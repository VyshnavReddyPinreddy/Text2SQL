from sqlalchemy.orm import Session
from talkdb import get_talk_db 
from oauth2 import get_current_user
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import text
from sqlalchemy.engine import CursorResult
from sqlalchemy.exc import SQLAlchemyError
from pydantic import BaseModel
from typing import cast
from sqlalchemy.exc import SQLAlchemyError, DBAPIError
from routers.llm import explain_sql, generate_sql, retry_sql_generation

router = APIRouter(
    tags=['Talk']
)

class SQLCommand(BaseModel):
    sql_command: str

class NaturalLanguageCommand(BaseModel):
    question: str

def ensure_select_query(sql: str):
    normalized_sql = sql.strip().lower()

    if not normalized_sql.startswith(("select", "with")):
        raise HTTPException(
            status_code=400,
            detail="Generated SQL must be a SELECT query"
        )

def execute_select_query(sql: str, db: Session):
    ensure_select_query(sql)
    result = cast(CursorResult, db.execute(text(sql)))

    if not result.returns_rows:
        return []

    rows = result.mappings().all()
    return [dict(row) for row in rows]

def format_table_info(rows):
    return [
        {
            "column": row.column_name,
            "type": row.data_type,
            "nullable": row.is_nullable,
            "default": row.column_default,
            "primary_key": bool(row.is_primary_key),
            "foreign_key": row.foreign_key,
        }
        for row in rows
    ]

@router.get('/tables')
def get_tables(current_user:str=Depends(get_current_user),db:Session=Depends(get_talk_db)):
    result = db.execute(text("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
        ORDER BY table_name
    """))

    return [row.table_name for row in result]

@router.get('/tables/{table_name}')
def get_table_info(table_name:str,current_user:str=Depends(get_current_user),db:Session=Depends(get_talk_db)):
    table_exists = db.execute(text("""
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          AND table_name = :table_name
    """), {"table_name": table_name}).first()

    if not table_exists:
        raise HTTPException(status_code=404, detail="Table not found")

    result = db.execute(text("""
        SELECT
            c.column_name,
            c.data_type,
            c.is_nullable,
            c.column_default,
            CASE WHEN pk.column_name IS NULL THEN false ELSE true END AS is_primary_key,
            fk.foreign_key
        FROM information_schema.columns c
        LEFT JOIN (
            SELECT kcu.table_name, kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
             AND tc.table_schema = kcu.table_schema
            WHERE tc.constraint_type = 'PRIMARY KEY'
              AND tc.table_schema = 'public'
        ) pk
          ON c.table_name = pk.table_name
         AND c.column_name = pk.column_name
        LEFT JOIN (
            SELECT
                kcu.table_name,
                kcu.column_name,
                ccu.table_schema || '.' || ccu.table_name || '(' || ccu.column_name || ')' AS foreign_key
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
             AND tc.table_schema = kcu.table_schema
            JOIN information_schema.constraint_column_usage ccu
              ON ccu.constraint_name = tc.constraint_name
             AND ccu.table_schema = tc.table_schema
            WHERE tc.constraint_type = 'FOREIGN KEY'
              AND tc.table_schema = 'public'
        ) fk
          ON c.table_name = fk.table_name
         AND c.column_name = fk.column_name
        WHERE c.table_schema = 'public'
          AND c.table_name = :table_name
        ORDER BY c.ordinal_position
    """), {"table_name": table_name})

    return {
        "table": table_name,
        "columns": format_table_info(result)
    }

@router.get('/schema')
def get_schema(current_user:str=Depends(get_current_user),db:Session=Depends(get_talk_db)):
    tables = get_tables(current_user=current_user, db=db)
    schema = {}

    for table in tables:
        schema[table] = get_table_info(
            table_name=table,
            current_user=current_user,
            db=db
        )["columns"]

    return schema

@router.post('/talk')
def talk_to_db(command:SQLCommand,current_user:str=Depends(get_current_user),db:Session=Depends(get_talk_db)):
    try:
        result = cast(CursorResult, db.execute(text(command.sql_command)))

        if result.returns_rows:
            rows = result.mappings().all()
            data = [dict(row) for row in rows]

            return {
                "user":current_user,
                "data":data
            }

        db.commit()

        return {
            "user":current_user,
            "message":"SQL command executed successfully",
            "rows_affected":result.rowcount
        }
    except DBAPIError as error:
        db.rollback()

        clean_error = str(error.orig)  # safe here
        clean_error = clean_error.split("[SQL:")[0]

        raise HTTPException(status_code=400, detail=clean_error)

    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(error))

@router.post('/talk/natural')
def talk_to_db_natural(command:NaturalLanguageCommand,current_user:str=Depends(get_current_user),db:Session=Depends(get_talk_db)):
    generated_sql = generate_sql(command.question)
    attempted_sql = generated_sql

    try:
        data = execute_select_query(attempted_sql, db)
    except DBAPIError as error:
        db.rollback()
        clean_error = str(error.orig).split("[SQL:")[0]
        attempted_sql = retry_sql_generation(command.question, clean_error)

        try:
            data = execute_select_query(attempted_sql, db)
        except DBAPIError as retry_error:
            db.rollback()
            retry_clean_error = str(retry_error.orig).split("[SQL:")[0]
            raise HTTPException(status_code=400, detail=retry_clean_error)
        except SQLAlchemyError as retry_error:
            db.rollback()
            raise HTTPException(status_code=400, detail=str(retry_error))
    except SQLAlchemyError as error:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(error))

    explanation = explain_sql(attempted_sql)

    return {
        "user": current_user,
        "question": command.question,
        "generated_sql": attempted_sql,
        "explanation": explanation,
        "data": data,
        "rows": len(data),
    }

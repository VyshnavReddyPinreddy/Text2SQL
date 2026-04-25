import os

from dotenv import load_dotenv
from fastapi import HTTPException
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = None


def get_client():
    global client

    if not GROQ_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY environment variable not set",
        )

    if client is None:
        client = Groq(api_key=GROQ_API_KEY)

    return client


SCHEMA_STRING = """
Table students:
- student_id int4 primary key
- gender varchar
- branch varchar
- cgpa numeric(4,2)
- tenth_percentage numeric(5,2)
- twelfth_percentage numeric(5,2)
- backlogs int4
- attendance_percentage numeric(5,2)
- projects_completed int4
- internships_completed int4
- coding_skill_rating int4
- communication_skill_rating int4
- aptitude_skill_rating int4
- hackathons_participated int4
- certifications_count int4
- city_tier varchar
- family_income_level varchar

Table companies:
- company_id int4 primary key
- name varchar
- sector varchar
- tier varchar
- min_cgpa numeric(3,2)
- package_lpa numeric(5,2)

Table placements:
- placement_id int4 primary key
- student_id int4 references students(student_id)
- placement_status varchar
- salary_lpa numeric(5,2)
- company_id int4 references companies(company_id)
"""


def clean_sql_response(content: str) -> str:
    sql = content.strip()

    if sql.startswith("```"):
        sql = sql.split("```")[1].strip()

    if sql.lower().startswith("sql"):
        sql = sql[3:].strip()

    return sql.rstrip(";").strip() + ";"


def call_llm(prompt: str, max_tokens: int = 1024) -> str:
    try:
        groq_client = get_client()

        response = groq_client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=max_tokens,
            messages=[{"role": "user", "content": prompt}],
        )

        return response.choices[0].message.content.strip()
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail=f"LLM request failed: {str(error)}",
        )


def generate_sql(natural_language_query: str) -> str:
    prompt = f"""You are a SQL expert. Convert the following natural language query to a valid PostgreSQL SELECT query.

Database Schema:
{SCHEMA_STRING}

Rules:
- Return ONLY the SQL query, no explanation
- No markdown or code blocks
- Only SELECT queries
- Use proper JOINs if needed
- Do not use tables or columns that are not listed in the schema

Natural Language Query:
{natural_language_query}

SQL Query:"""

    return clean_sql_response(call_llm(prompt))


def explain_sql(sql: str) -> str:
    prompt = f"""Explain the following SQL query in simple English.

SQL Query:
{sql}

Explanation:"""

    return call_llm(prompt, max_tokens=512)


def retry_sql_generation(natural_language_query: str, error_message: str) -> str:
    prompt = f"""You are a SQL expert. The previous query failed.

Database Schema:
{SCHEMA_STRING}

User Query:
{natural_language_query}

Error:
{error_message}

Fix the query.

Rules:
- Return ONLY corrected SQL
- No markdown or code blocks
- Only SELECT queries
- Do not use tables or columns that are not listed in the schema

Corrected SQL:"""

    return clean_sql_response(call_llm(prompt))

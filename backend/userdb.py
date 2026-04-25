from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base 
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os 
from typing import cast

load_dotenv()

DATABASE_URL = cast(str,os.getenv("USER_DATABASE_URL"))

engine = create_engine(DATABASE_URL)

sessionLocal = sessionmaker(bind=engine,autoflush=False,autocommit=False)

Base = declarative_base() 

def get_db():
    db = sessionLocal() 
    try:
        yield db 
    finally : 
        db.close()
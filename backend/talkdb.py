from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os 
from dotenv import load_dotenv
from typing import cast

load_dotenv()

TALK_DB_URL = cast(str,os.getenv("TALK_DB_URL"))

engine2 = create_engine(TALK_DB_URL)
SessionTalkDB = sessionmaker(bind=engine2)

def get_talk_db():
    db = SessionTalkDB()
    try:
        yield db 
    finally:
        db.close()

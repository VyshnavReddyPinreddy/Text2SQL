from jose import jwt 
from datetime import datetime,timezone,timedelta
import os 
from dotenv import load_dotenv
from typing import Optional,cast

load_dotenv()

SECRET_KEY = cast(str,os.getenv("SECRET_KEY"))
ALGORITHM = cast(str,os.getenv("ALGORITHM"))

def create_access_token(data:dict,expires_detla:Optional[timedelta]=None):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc)  + (expires_detla or timedelta(minutes=30))
    to_encode.update({"exp":expire})

    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt
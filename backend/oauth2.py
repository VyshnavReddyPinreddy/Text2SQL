from fastapi import Depends,HTTPException,Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError,jwt 
import os 
from dotenv import load_dotenv
from typing import Optional,cast
from sqlalchemy.orm import Session
from userdb import get_db
from models import User

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)

SECRET_KEY = cast(str,os.getenv("SECRET_KEY"))
ALGORITHM = cast(str,os.getenv("ALGORITHM"))

def get_current_user(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    token = token or request.cookies.get("access_token")

    if token is None:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        username = payload.get("sub")

        if username is None : 
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(User).filter(User.username == username).first()

        if user is None:
            raise HTTPException(status_code=401, detail="User no longer exists")

        return username 
    
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

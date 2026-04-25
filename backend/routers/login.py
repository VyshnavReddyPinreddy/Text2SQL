from fastapi import APIRouter,Depends,Response,HTTPException,status
from sqlalchemy.orm import Session
from userdb import get_db
from models import User
from hashing import verify_password
from jwt_token import create_access_token
from schemas import UserLogin
from oauth2 import get_current_user

router = APIRouter(
    tags=['Login']
)

@router.post('/login')

def login(user:UserLogin,response:Response, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username==user.username).first()

    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Invalid Crendentials")

    if not verify_password(user.password,db_user.password):
        raise HTTPException(status_code=400,detail="Invalid Crendentials")
    
    access_token = create_access_token(
        data={"sub":db_user.username}
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,   
        samesite="lax"
    )
    
    return {
        "message": "Login successful"
    }

@router.get('/me')
def me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out"}
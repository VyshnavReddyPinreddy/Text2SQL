from fastapi import APIRouter,Depends,HTTPException,status
from schemas import UserCreate
from sqlalchemy.orm import Session
from userdb import get_db
from models import User
from hashing import hash_password

router = APIRouter(
    tags=["SignUp"]
)

@router.post('/signup')

def register(user:UserCreate,db:Session=Depends(get_db)):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists"
        )
    
    hashed = hash_password(user.password)

    new_user = User(
        username=user.username,
        password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message":"User created successfully, Login to proceed"}

from pydantic import BaseModel ,Field
from typing import Annotated

class UserCreate(BaseModel):
    username: Annotated[
        str,
        Field(min_length=3, max_length=30, pattern=r'^[a-z0-9_]+$')
    ]
    password: Annotated[
        str,
        Field(min_length=8, max_length=72)
    ]
    confirm_password:str

class UserLogin(BaseModel):
    username:str 
    password:str 
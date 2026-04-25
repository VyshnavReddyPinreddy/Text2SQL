from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import login,signup,talk
from userdb import engine 
import models

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", 
                    "http://127.0.0.1:5173",
                  ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(login.router)
app.include_router(signup.router)
app.include_router(talk.router)

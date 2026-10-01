from fastapi import FastAPI
from pydantic import BaseModel
from database import supabase
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

print("URL:", supabase.supabase_url)
print("KEY cargada:", bool(supabase.supabase_key))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class Usuario(BaseModel):
    email: str
    password: str


@app.get("/")
def inicio():
    return {"mensaje": "Backend funcionando"}


@app.post("/registro")
def registro(usuario: Usuario):
    respuesta = supabase.auth.sign_up({
        "email": usuario.email,
        "password": usuario.password
    })

    return {
        "mensaje": "Usuario registrado correctamente"
    }

@app.post("/login")
def login(usuario: Usuario):
    respuesta = supabase.auth.sign_in_with_password({
        "email": usuario.email,
        "password": usuario.password
    })

    return {
        "mensaje": "Login correcto",
        "access_token": respuesta.session.access_token
    }
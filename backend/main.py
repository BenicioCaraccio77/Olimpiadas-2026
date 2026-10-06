from fastapi import FastAPI, Header
from pydantic import BaseModel
from database import supabase
from fastapi.middleware.cors import CORSMiddleware
from database import supabase, supabase_admin

app = FastAPI()

from fastapi import FastAPI, Header
from pydantic import BaseModel
from database import supabase, supabase_admin
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

print("URL:", supabase.supabase_url)
print("KEY cargada:", bool(supabase.supabase_key))
print("KEY ES SERVICE ROLE:", supabase.supabase_key.startswith("eyJ"))

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

class ProductoCompra(BaseModel):
    producto_id: str
    cantidad: int
    precio: float

@app.get("/")
def inicio():
    return {"mensaje": "Backend funcionando"}


@app.post("/registro")
def registro(usuario: Usuario):

    try:

        respuesta = supabase.auth.sign_up({
            "email": usuario.email,
            "password": usuario.password
        })

        print("USUARIO AUTH:", respuesta.user)

        if not respuesta.user:
            return {
                "error": "No se pudo registrar el usuario"
            }

        usuario_id = respuesta.user.id

        resultado = supabase_admin.table("clientes").insert({
            "usuario_id": usuario_id,
            "mail": usuario.email
        }).execute()

        print("CLIENTE CREADO:", resultado.data)

        return {
            "mensaje": "Usuario registrado correctamente",
            "usuario_id": usuario_id
        }

    except Exception as error:

        print("ERROR EN REGISTRO:", error)

        return {
            "error": str(error)
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

@app.get("/admin/verificar")
def verificar_admin(authorization: str = Header(None)):

    if not authorization:
        return {"admin": False}

    token = authorization.replace("Bearer ", "")

    usuario = supabase.auth.get_user(token)

    if not usuario.user:
        return {"admin": False}

    respuesta = supabase.table("perfiles") \
        .select("rol") \
        .eq("id", usuario.user.id) \
        .execute()

    if not respuesta.data:
        return {"admin": False}

    return {
        "admin": respuesta.data[0]["rol"] == "admin"
    }

@app.get("/admin/compras")
def obtener_compras_admin(authorization: str = Header(None)):

    if not authorization:
        return {"error": "No estás autorizado"}

    token = authorization.replace("Bearer ", "")

    usuario = supabase.auth.get_user(token)

    if not usuario.user:
        return {"error": "Usuario no válido"}

    perfil = supabase.table("perfiles") \
        .select("rol") \
        .eq("id", usuario.user.id) \
        .single() \
        .execute()

    if not perfil.data or perfil.data["rol"] != "admin":
        return {"error": "No tenés permisos de administrador"}

    compras = supabase.table("compras") \
        .select("*") \
        .order("fecha", desc=True) \
        .execute()

    return compras.data

@app.get("/admin/compras/{compra_id}")
def obtener_detalle_compra(
    compra_id: int,
    authorization: str = Header(None)
):

    if not authorization:
        return {"error": "No estás autorizado"}

    token = authorization.replace("Bearer ", "")

    usuario = supabase.auth.get_user(token)

    if not usuario.user:
        return {"error": "Usuario no válido"}

    perfil = supabase.table("perfiles") \
        .select("rol") \
        .eq("id", usuario.user.id) \
        .single() \
        .execute()

    if not perfil.data or perfil.data["rol"] != "admin":
        return {"error": "No tenés permisos de administrador"}

    compra = supabase.table("compras") \
        .select("*") \
        .eq("compra_id", compra_id) \
        .single() \
        .execute()

    if not compra.data:
        return {"error": "Compra no encontrada"}

    detalles = supabase.table("detalle_compras") \
        .select("*") \
        .eq("compra_id", compra_id) \
        .execute()

    venta = supabase.table("venta") \
    .select("*") \
    .eq("compra_id", compra_id) \
    .execute()

    venta_data = venta.data[0] if venta.data else None

    return {
        "compra": compra.data,
        "detalles": detalles.data,
        "venta": venta_data
    }

@app.put("/admin/compras/{compra_id}")
def editar_compra(
    compra_id: int,
    estado: str,
    authorization: str = Header(None)
):

    if not authorization:
        return {"error": "No estás autorizado"}

    token = authorization.replace("Bearer ", "")

    usuario = supabase.auth.get_user(token)

    if not usuario.user:
        return {"error": "Usuario no válido"}

    perfil = supabase.table("perfiles") \
        .select("rol") \
        .eq("id", usuario.user.id) \
        .single() \
        .execute()

    if not perfil.data or perfil.data["rol"] != "admin":
        return {"error": "No tenés permisos de administrador"}

    estados_permitidos = [
        "pendiente",
        "pagada",
        "cancelada"
    ]

    if estado not in estados_permitidos:
        return {"error": "Estado no válido"}

    respuesta = supabase.rpc(
        "editar_compra_admin",
        {
            "p_compra_id": compra_id,
            "p_estado": estado
        }
    ).execute()

    if not respuesta.data:
        return {"error": "No se pudo actualizar la compra"}

    if isinstance(respuesta.data, dict) and respuesta.data.get("error"):
        return respuesta.data

    return {
        "mensaje": "Compra actualizada",
        "compra": respuesta.data
    }

""" Rutas para traer los productos de la BD hacia el front """

@app.get("/productos/vuelos")
def obtener_vuelos():
    respuesta = supabase.table("productos").select("*").eq("tipo_producto", "vuelo").execute()
    return respuesta.data

@app.get("/productos/paquetes")
def obtener_paquetes():
    respuesta = supabase.table("productos").select("*").eq("tipo_producto", "paquete").execute()
    return respuesta.data

@app.get("/productos/alojamientos")
def obtener_alojamientos():
    respuesta = supabase.table("productos").select("*").eq("tipo_producto", "alojamiento").execute()
    return respuesta.data

@app.get("/productos/autos")
def obtener_autos():
    respuesta = supabase.table("productos").select("*").eq("tipo_producto", "auto").execute()
    return respuesta.data

@app.post("/compras")
def crear_compra(
    total: float,
    metodo_pago: str,
    productos: list[ProductoCompra],
    authorization: str = Header(None)
):

    if not authorization:
        return {"error": "No estás logueado"}

    token = authorization.replace("Bearer ", "")

    usuario = supabase.auth.get_user(token)

    if not usuario.user:
        return {"error": "Usuario no válido"}

    productos_json = [
        {
            "producto_id": producto.producto_id,
            "cantidad": producto.cantidad,
            "precio": producto.precio
        }
        for producto in productos
    ]

    respuesta = supabase.rpc(
        "confirmar_pago",
        {
            "p_usuario_id": usuario.user.id,
            "p_total": total,
            "p_productos": productos_json,
            "p_metodo_pago": metodo_pago
        }
    ).execute()

    return {
        "mensaje": "Pago confirmado",
        "compra_id": respuesta.data
    }

@app.get("/productos")
def obtener_productos():
    respuesta = supabase.table("productos").select("*").execute()
    return respuesta.data


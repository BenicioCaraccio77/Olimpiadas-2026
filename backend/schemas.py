from pydantic import BaseModel


class DestinoCreate(BaseModel):
    nombre: str
    pais: str
    precio: int
    duracion: int



class ClienteCreate(BaseModel):
    nombre: str
    apellido: str
    email: str
    contraseña: str
    dni: int
    telefono: int

class ReservaCreate(BaseModel):
    id_cliente: int
    id_destino: int
    cantidad_personas: int
    fecha: str


class ventas_alquileres(BaseModel):
    id_alquileres: int
    id_comprador: int
    fecha_compra: str
    hora_compra: str
    monto_total: int

class alquileres(BaseModel):
    tipo_alquiler: str
    precio_dia: int
    dias_disponibles: int
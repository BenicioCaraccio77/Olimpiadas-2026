from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from database import Base,engine, SessionLocal
from models import Destino, Cliente, Reserva, VentaAlquiler, Alquiler
from schemas import DestinoCreate, ClienteCreate, ReservaCreate, ventas_alquileres, alquileres

app = FastAPI (title= "Agencia de viajes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# crea las tablas
Base.metadata.create_all (bind=engine)

#Conexion con la bd
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@app.post("/login")
def login(email: str, contraseña: str, db: CORSMiddleware = Depends(get_db)):

    cliente = db.query(Cliente).filter(Cliente.email == email).first()

    if not cliente:
        raise HTTPException(
            status_code=404,
            detail="El usuario no existe"
        )

    if cliente.contraseña != contraseña:
        raise HTTPException(
            status_code=401,
            detail="Contraseña incorrecta"
        )

    return {
        "mensaje": "Inicio de sesión correcto",
        "cliente_id": cliente.id,
        "nombre": cliente.nombre,
        "email": cliente.email
    }

@app.post("/clientes")
def crear_cliente(cliente: ClienteCreate, db: CORSMiddleware = Depends(get_db)):

    # Buscamos si el email ya existe
    cliente_existente = db.query(Cliente).filter(
        Cliente.email == cliente.email
    ).first()

    if cliente_existente:
        raise HTTPException(
            status_code=400,
            detail="El email ya está registrado"
        )

    # Creamos el nuevo cliente
    nuevo_cliente = Cliente(
        nombre=cliente.nombre,
        apellido=cliente.apellido,
        email=cliente.email,
        contraseña=cliente.contraseña
    )

    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)

    return {
        "mensaje": "Cliente registrado correctamente",
        "id": nuevo_cliente.id,
        "nombre": nuevo_cliente.nombre,
        "email": nuevo_cliente.email
    }


#crea el destino
@app.post("/destinos")
def crear_destino(
    datos: DestinoCreate,
    db: CORSMiddleware = Depends (get_db)
):
    nuevo_destino= Destino(
        nombre = datos.nombre,
        pais = datos.pais,
        precio = datos.precio,
        duracion = datos.duracion
    )
    db.add(nuevo_destino)
    db.commit()
    db.refresh(nuevo_destino)

    return nuevo_destino


# obtiene tds los destinos
@app.get("/destinos")
def obtener_destinos(db: CORSMiddleware = Depends(get_db)):
    destinos = db.query(Destino).all()

    return destinos

# obtiene el destino indicado por ID
@app.get("/destinos/{destino_id}")
def obtener_destino(
    destino_id: int,
    db: CORSMiddleware = Depends(get_db)

):

    destino = db.query(Destino).filter(
        Destino.id == destino_id
    ).first()

    if not destino:
        raise HTTPException(
            status_code=404,
            detail="Destino no encontrado"
        )

    return destino


# Eliminar un destino
@app.delete("/destinos/{destino_id}")
def eliminar_destino(
    destino_id: int,
    db: CORSMiddleware = Depends(get_db)

):

    destino = db.query(Destino).filter(
        Destino.id == destino_id
    ).first()

    if not destino:

        raise HTTPException(
            status_code=404,
            detail="Destino no encontrado"
        )

    db.delete(destino)
    db.commit()

    return {
        "mensaje": "Destino eliminado correctamente"
    }



# obtiene todos los clientes
@app.get("/clientes")
def obtener_clientes():
    db = SessionLocal()
    clientes = db.query(Cliente).all()
    db.close()

    return clientes




#  modifica un cliente
@app.put("/clientes/{cliente_id}")
def modificar_cliente(cliente_id: int, cliente: ClienteCreate):
    db = SessionLocal()
    cliente_db = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente_db:
        db.close()
        return {"error": "Cliente no encontrado"}

    cliente_db.nombre = cliente.nombre
    cliente_db.apellido = cliente.apellido
    cliente_db.email = cliente.email

    db.commit()
    db.refresh(cliente_db)
    db.close()

    return cliente_db


#elimina un cliente
@app.delete("/clientes/{cliente_id}")
def eliminar_cliente(cliente_id: int):
    db = SessionLocal()
    cliente_db = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente_db:
        db.close()
        return {"error": "Cliente no encontrado"}

    db.delete(cliente_db)
    db.commit()
    db.close()

    return {"mensaje": "Cliente eliminado correctamente"}



# obtiene todas las reservas
@app.get("/reservas")
def obtener_reservas():
    db = SessionLocal()

    reservas = db.query(Reserva).all()

    db.close()

    return reservas


# crea una reserva
@app.post("/reservas")
def crear_reserva(reserva: ReservaCreate):
    db = SessionLocal()

    nueva_reserva = Reserva(
        cliente_id=reserva.cliente_id,
        destino_id=reserva.destino_id,
        cantidad_personas=reserva.cantidad_personas,
        fecha=reserva.fecha
    )

    db.add(nueva_reserva)
    db.commit()
    db.refresh(nueva_reserva)

    db.close()

    return nueva_reserva


# modifica una reserva
@app.put("/reservas/{reserva_id}")
def modificar_reserva(reserva_id: int, reserva: ReservaCreate):
    db = SessionLocal()

    reserva_db = db.query(Reserva).filter(
        Reserva.id == reserva_id
    ).first()

    if not reserva_db:
        db.close()
        return {"error": "Reserva no encontrada"}

    reserva_db.cliente_id = reserva.cliente_id
    reserva_db.destino_id = reserva.destino_id
    reserva_db.cantidad_personas = reserva.cantidad_personas
    reserva_db.fecha = reserva.fecha

    db.commit()
    db.refresh(reserva_db)

    db.close()

    return reserva_db


# eliminar una reserva
@app.delete("/reservas/{reserva_id}")
def eliminar_reserva(reserva_id: int):
    db = SessionLocal()

    reserva_db = db.query(Reserva).filter(
        Reserva.id == reserva_id
    ).first()

    if not reserva_db:
        db.close()
        return {"error": "Reserva no encontrada"}

    db.delete(reserva_db)
    db.commit()

    db.close()

    return {"mensaje": "Reserva eliminada correctamente"}



# obtiene todas las ventas y alquileres
@app.get("/ventas-alquileres")
def obtener_ventas_alquileres():
    db = SessionLocal()

    ventas = db.query(VentaAlquiler).all()

    db.close()

    return ventas


# crea una venta o alquiler
@app.post("/ventas-alquileres")
def crear_venta_alquiler(esquema: ventas_alquileres):
    db = SessionLocal()

    nueva_venta = VentaAlquiler(
        id_alquileres=esquema.id_alquileres,
        id_comprador=esquema.id_comprador,
        fecha_compra=esquema.fecha_compra,
        hora_compra=esquema.hora_compra,
        monto_total=esquema.monto_total
    )

    db.add(nueva_venta)
    db.commit()
    db.refresh(nueva_venta)

    db.close()

    return nueva_venta


#modifica una venta o alquiler
@app.put("/ventas-alquileres/{venta_id}")
def modificar_venta_alquiler(
    venta_id: int,
    esquema: ventas_alquileres
):
    db = SessionLocal()

    venta = db.query(VentaAlquiler).filter(
        VentaAlquiler.id == venta_id
    ).first()

    if not venta:
        db.close()
        return {"error": "Venta o alquiler no encontrado"}

    venta.id_alquileres = esquema.id_alquileres
    venta.id_comprador = esquema.id_comprador
    venta.fecha_compra = esquema.fecha_compra
    venta.hora_compra = esquema.hora_compra
    venta.monto_total = esquema.monto_total

    db.commit()
    db.refresh(venta)

    db.close()

    return venta


# eliminar una venta o alquiler
@app.delete("/ventas-alquileres/{venta_id}")
def eliminar_venta_alquiler(venta_id: int):
    db = SessionLocal()

    venta = db.query(VentaAlquiler).filter(
        VentaAlquiler.id == venta_id
    ).first()

    if not venta:
        db.close()
        return {"error": "Venta o alquiler no encontrado"}

    db.delete(venta)
    db.commit()

    db.close()

    return {"mensaje": "Venta o alquiler eliminado correctamente"}



#  obtiene todos los alquileres
@app.get("/alquileres")
def obtener_alquileres():
    db = SessionLocal()

    alquileres = db.query(Alquiler).all()

    db.close()

    return alquileres


# crear el alquiler
@app.post("/alquileres")
def crear_alquiler(alquiler: alquileres):
    db = SessionLocal()

    nuevo_alquiler = Alquiler(
        tipo_alquiler=alquiler.tipo_alquiler,
        precio_dia=alquiler.precio_dia,
        dias_disponibles=alquiler.dias_disponibles
    )

    db.add(nuevo_alquiler)
    db.commit()
    db.refresh(nuevo_alquiler)

    db.close()

    return nuevo_alquiler


# modificar un alquiler
@app.put("/alquileres/{alquiler_id}")
def modificar_alquiler(
    alquiler_id: int,
    alquiler: alquileres
):
    db = SessionLocal()

    alquiler_db = db.query(Alquiler).filter(
        Alquiler.id == alquiler_id
    ).first()

    if not alquiler_db:
        db.close()
        return {"error": "Alquiler no encontrado"}

    alquiler_db.tipo_alquiler = alquiler.tipo_alquiler
    alquiler_db.precio_dia = alquiler.precio_dia
    alquiler_db.dias_disponibles = alquiler.dias_disponibles

    db.commit()
    db.refresh(alquiler_db)

    db.close()

    return alquiler_db


# elimina el alquiler por id
@app.delete("/alquileres/{alquiler_id}")
def eliminar_alquiler(alquiler_id: int):
    db = SessionLocal()

    alquiler_db = db.query(Alquiler).filter(
        Alquiler.id == alquiler_id
    ).first()

    if not alquiler_db:
        db.close()
        return {"error": "Alquiler no encontrado"}

    db.delete(alquiler_db)
    db.commit()

    db.close()

    return {"mensaje": "Alquiler eliminado correctamente"}
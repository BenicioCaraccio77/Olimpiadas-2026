from sqlalchemy import Column, Integer, String
from database import Base


class Destino(Base):
    __tablename__ = "destinos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    pais = Column(String, nullable=False)
    precio = Column(Integer, nullable=False)
    duracion = Column(Integer, nullable=False)


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    apellido = Column(String)
    email = Column(String)
    contraseña = Column(String)
    dni = Column(Integer)
    telefono = Column(Integer)


class Reserva(Base):
    __tablename__ = "reservas"

    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer)
    destino_id = Column(Integer)
    cantidad_personas = Column(Integer)
    fecha = Column(String)



class VentaAlquiler(Base):
    __tablename__ = "ventas_alquileres"

    id = Column(Integer, primary_key=True, index=True)
    id_alquileres = Column(Integer)
    id_comprador = Column(Integer)
    fecha_compra = Column(String)
    hora_compra = Column(String)
    monto_total = Column(Integer)


class Alquiler(Base):
    __tablename__ = "alquileres"

    id = Column(Integer, primary_key=True, index=True)
    tipo_alquiler = Column(String)
    precio_dia = Column(Integer)
    dias_disponibles = Column(Integer)
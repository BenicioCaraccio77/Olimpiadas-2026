CREATE DATABASE IF NOT EXISTS AgenciaViajes;

USE AgenciaViajes;

CREATE TABLE IF NOT EXISTS Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    dni VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(50)
)

CREATE TABLE IF NOT EXISTS Reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_destino INT NOT NULL,
    cantidad_personas INT NOT NULL,
    fecha DATE NOT NULL,

    FOREIGN KEY (cliente_id)
        REFERENCES Clientes(id_cliente)
);
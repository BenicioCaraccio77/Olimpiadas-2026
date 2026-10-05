#Olimpiadas 2026

Proyecto web desarrollado para las **Olimpíadas 2026**.

El proyecto cuenta con un **frontend web** desarrollado con HTML, CSS y JavaScript, y un **backend desarrollado en Python utilizando FastAPI**. Para la autenticación y conexión con los servicios de datos se utiliza **Supabase**.

#  Descripción

El sistema permite a los usuarios interactuar con una plataforma web que incluye diferentes páginas y paquetes turísticos.

Entre las funcionalidades desarrolladas se encuentran:
- Registro de usuarios.
- Inicio de sesión.
- Autenticación mediante Supabase.
- Visualización de diferentes paquetes turísticos.
- Sección de administración.
- Interfaz web desarrollada con HTML y CSS.
- Comunicación entre el frontend y el backend mediante una API.
---
# Tecnologías utilizadas

# Frontend

- HTML5
- CSS3
- JavaScript

# Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- python-dotenv
- Supabase

# Base de datos y autenticación

- Supabase

##  Estructura del proyecto

Olimpiadas-2026/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── requirements.txt
│   ├── .env
│   └── .gitignore
│
└── Frontend/
    │
    ├── img/
    │   ├── Bariloche.png
    │   ├── canada.jpg
    │   ├── Cataratas.jpg
    │   ├── Eeuu.jpg
    │   ├── fondo.jpg
    │   ├── fondoPrincipal.jpg
    │   ├── Grecia.jpg
    │   └── Sudafrica.jpg
    │
    ├── login/
    │   ├── admin.css
    │   ├── admin.html
    │   ├── administradores.html
    │   ├── login.css
    │   ├── login.html
    │   ├── login.js
    │   ├── registrarse.css
    │   ├── registrarse.html
    │   ├── registrarse.js
    │   └── style.css
    │
    └── Principal/
        ├── estilo.css
        ├── principal.html
        │
        └── paquetes/
            ├── Canada.html
            ├── Eeuu.html
            ├── Grecia.html
            ├── grecia.css
            ├── index.html
            ├── style.css
            ├── Sudafrica.html
            └── sudafrica.css
```

# Instalación

# 1. Clonar el repositorio

```bash
git clone https://github.com/BenicioCaraccio77/Olimpiadas-2026.git
```

Ingresar a la carpeta:

```bash
cd Olimpiadas-2026
```

# Configuración del backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

# 2. Crear un entorno virtual

En Windows:

```powershell
python -m venv .venv
```

Activar el entorno virtual:

```powershell
.\.venv\Scripts\Activate.ps1
```

# 3. Instalar las dependencias

```bash
pip install -r requirements.txt
```
# Variables de entorno

El backend utiliza variables de entorno para conectarse a Supabase.

Dentro de la carpeta `backend` se debe crear un archivo:

```text
.env
```

Con las variables correspondientes:

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_de_supabase
```

> *Importante:* no subir el archivo `.env` al repositorio, ya que contiene información privada de conexión.

# Ejecutar el backend

Desde la carpeta `backend`, con el entorno virtual activado:

```bash
uvicorn main:app --reload
```

El servidor se ejecutará en:

```text
http://127.0.0.1:8000
```

La opción `--reload` permite que el servidor se reinicie automáticamente cuando se realizan cambios en el código.

# API

El backend está desarrollado utilizando **FastAPI**.

### Página principal

```http
GET /
```

Comprueba que el backend se encuentra funcionando.

Respuesta:

```json
{
  "mensaje": "Backend funcionando"
}
```

### Registro

```http
POST /registro
```

Permite registrar un usuario mediante Supabase.

Datos enviados:

```json
{
  "email": "usuario@email.com",
  "password": "contraseña"
}
```

### Login

```http
POST /login
```

Permite iniciar sesión utilizando las credenciales del usuario.

Datos enviados:

{
  "email": "usuario@email.com",
  "password": "contraseña"
}

Si el inicio de sesión es correcto, el backend devuelve un token de acceso:

{
  "mensaje": "Login correcto",
  "access_token": "..."
}

##  Documentación de la API

FastAPI genera automáticamente documentación interactiva de los endpoints.

Una vez iniciado el backend, se puede acceder a:

```text
http://127.0.0.1:8000/docs
```

##  Frontend

El frontend está desarrollado utilizando:

- HTML
- CSS
- JavaScript

Se encuentra dentro de la carpeta:

Frontend/

El proyecto contiene páginas relacionadas con:

- Inicio de sesión.
- Registro de usuarios.
- Administración.
- Página principal.
- Paquetes turísticos.

Entre los paquetes disponibles se encuentran:

- Canadá.
- Estados Unidos.
- Grecia.
- Sudáfrica.

# Comunicación Frontend - Backend

El frontend se comunica con el backend mediante solicitudes HTTP a la API desarrollada con FastAPI.

El backend también tiene configurado **CORS** para permitir las solicitudes provenientes del frontend.

# Integrantes

Caraccio Benicio
Cardoso Carolina
Burgos Tomas 
Erretegui Ariel

import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
clave = os.getenv("SUPABASE_KEY")

supabase = create_client(url, clave)
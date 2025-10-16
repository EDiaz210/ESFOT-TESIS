import requests
import time
import bs4
from urllib.parse import urljoin, urlparse
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from bs4 import BeautifulSoup


BASE = "https://esfot.epn.edu.ec"
VISITADOS = set()
LOG_FILE = "index_log.txt"

SEMILLAS = [
    "", "quienes-somos", "oferta-academica", "admisiones", "unidad-titulacion",
    "estudiantes", "noticias-destacadas", "comunidad", "documentos",
    "graduados", "vinculacion-social", "transparencia", "practicas-pre-profesionales",
    "comisiones", "contactanos"
]

MAX_NIVEL = 11
MAX_PAGINAS = 300



client = chromadb.Client(Settings(persist_directory="./chroma_data"))
col = client.get_or_create_collection("esfot")
embedder = SentenceTransformer("all-MiniLM-L6-v2")




def es_interna(url: str):
    """Verifica si la URL pertenece al dominio ESFOT"""
    netloc = urlparse(url).netloc
    return "esfot.epn.edu.ec" in netloc or netloc == ""


def extraer_enlaces(url):
    """Obtiene enlaces válidos dentro de una página HTML"""
    try:
        html = requests.get(url, timeout=25).text
        soup = bs4.BeautifulSoup(html, "html.parser")
        enlaces = set()
        for a in soup.find_all("a", href=True):
            href = a["href"].split("#")[0]
            if not href or href.startswith("mailto:") or href.endswith(".pdf"):
                continue
            full = urljoin(url, href)
            if es_interna(full):
                enlaces.add(full)
        return enlaces
    except Exception:
        return set()


def indexar_url(url: str):
    """Indexa una página en ChromaDB"""
    try:
        response = requests.get(url, timeout=20)
        if response.status_code != 200:
            print(f"⚠️ No se pudo acceder a {url}")
            return

        soup = BeautifulSoup(response.text, "html.parser")
        texto = " ".join(p.get_text() for p in soup.find_all("p"))
        if not texto.strip():
            print(f"⚠️ Página sin texto útil: {url}")
            return

        embedding = embedder.encode([texto]).tolist()[0]
        col.add(
            documents=[texto],
            embeddings=[embedding],
            metadatas=[{"url": url}],
            ids=[url]
        )
        with open(LOG_FILE, "a", encoding="utf-8") as f:
            f.write(url + "\n")
        print(f"✅ Indexada: {url}")
    except Exception as e:
        print(f"❌ Error indexando {url}: {e}")


def rastrear(url, nivel=0):
    """Rastrea e indexa recursivamente las páginas internas"""
    if len(VISITADOS) >= MAX_PAGINAS:
        print("⚠️ Límite máximo de páginas alcanzado.")
        return
    if url in VISITADOS or nivel > MAX_NIVEL:
        return
    VISITADOS.add(url)

    print(f"{'  ' * nivel}🔗 Nivel {nivel}: {url}")
    indexar_url(url)

    for enlace in extraer_enlaces(url):
        if enlace not in VISITADOS:
            time.sleep(0.5)
            rastrear(enlace, nivel + 1)


if __name__ == "__main__":
    print(f"🧠 Iniciando rastreo profundo de {BASE}...")
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        f.write("URLs indexadas:\n")

    for semilla in SEMILLAS:
        rastrear(urljoin(BASE, semilla))

    print(f"✅ Rastreo finalizado. Total: {len(VISITADOS)} páginas indexadas.")

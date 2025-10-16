from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings
from transformers import pipeline
from crawl_esfot import crawl_and_index


app = FastAPI(title="ESFOT RAG API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar modelo de embeddings
embedder = SentenceTransformer("all-MiniLM-L6-v2")

# Configuración de ChromaDB
client = chromadb.Client(Settings(persist_directory="./chroma_data"))
col = client.get_or_create_collection("esfot")

# =============================================
# RUTAS EXISTENTES
# =============================================

class IndexIn(BaseModel):
    url: str

@app.post("/index")
def index_page(data: IndexIn):
    try:
        crawl_and_index(data.url, col, embedder)
        return {"ok": True, "message": f"Página {data.url} indexada correctamente"}
    except Exception as e:
        return {"ok": False, "error": str(e)}

class SearchIn(BaseModel):
    q: str
    k: int = 3

@app.post("/search")
def search(data: SearchIn):
    try:
        q_emb = embedder.encode([data.q]).tolist()
        res = col.query(query_embeddings=q_emb, n_results=data.k)
        results = []
        for i in range(len(res["ids"][0])):
            results.append({
                "text": res["documents"][0][i],
                "url": res["metadatas"][0][i].get("url"),
            })
        return {"results": results}
    except Exception as e:
        return {"error": str(e)}



class AskIn(BaseModel):
    query: str

generator = pipeline(
    "text-generation",
    model="Xenova/mistral-7b-instruct-v0.2",
    trust_remote_code=True
)

@app.post("/ask")
def ask(data: AskIn):
    try:
        
        q_emb = embedder.encode([data.query]).tolist()
        res = col.query(query_embeddings=q_emb, n_results=3)

        contextos = []
        for i in range(len(res["ids"][0])):
            contextos.append({
                "text": res["documents"][0][i],
                "url": res["metadatas"][0][i].get("url"),
            })

        context_text = "\n\n".join(
            [f"[{i+1}] ({c['url']})\n{c['text']}" for i, c in enumerate(contextos)]
        )

        prompt = f"""
Eres un asistente académico de la ESFOT.
Analiza la información del sitio y responde con tono humano, formal y conciso.
Si no encuentras datos relevantes, di “No tengo datos suficientes en el sitio de la ESFOT”.

PREGUNTA:
{data.query}

INFORMACIÓN:
{context_text}
        """.strip()

        # 3️⃣ Generar respuesta
        output = generator(prompt, max_new_tokens=200)
        respuesta = output[0]["generated_text"]

        return {"respuesta": respuesta, "contexto": contextos}

    except Exception as e:
        return {"error": str(e)}


from fastapi import APIRouter
from app.getData import get_knowledge_graph_info

knowledge_graph_router = APIRouter()

@knowledge_graph_router.get("/knowledge-graph")
async def get_knowledge_graph():
    try:
        graph_info = get_knowledge_graph_info()
        return {"graph_info": graph_info}
    except Exception as e:
        return {"error": str(e)}
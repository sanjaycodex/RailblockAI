import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config.settings import settings
from .api.health import router as health_router
from .api.priority import router as priority_router
from .api.optimizer import router as optimizer_router
from .api.plans import router as plans_router
from .api.replan import router as replan_router
from .api.bundles import router as bundles_router
from .api.chat import router as chat_router

app = FastAPI(
    title="RailBlockAI Hybrid Intelligence Service",
    description="FastAPI Backend for Failure Risk Prediction, Multi-Factor Priority Scoring, Multi-Objective Possession Block Optimization, Automated Planning, Dynamic Replanning & Cross-Department Smart Block Bundling (Tirunelveli - Madurai Corridor)",
    version="3.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health_router)
app.include_router(priority_router)
app.include_router(optimizer_router)
app.include_router(plans_router)
app.include_router(replan_router)
app.include_router(bundles_router)
app.include_router(chat_router)

@app.get("/")
async def root():
    return {
        "service": "RailBlockAI Intelligence Service",
        "corridor": "Tirunelveli - Madurai Mainline (TEN-MDU)",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )

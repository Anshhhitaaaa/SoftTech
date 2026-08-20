from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from admin_api.config import settings
from admin_api.database import init_db
from admin_api.routers import auth_router, analytics_router, nl_query_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI Backend for Admin Analytics Application & Safe Natural-Language Query Engine"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production setting should specify allowed admin frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    # Initialize database tables, views, and seed data automatically
    init_db()

# Register API Routers
app.include_router(auth_router.router, prefix=settings.API_PREFIX)
app.include_router(analytics_router.router, prefix=settings.API_PREFIX)
app.include_router(nl_query_router.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("admin_api.main:app", host="0.0.0.0", port=8000, reload=True)

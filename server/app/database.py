from motor.motor_asyncio import AsyncIOMotorClient
from app.config import get_settings

settings = get_settings()

client = AsyncIOMotorClient(settings.mongodb_url)
db = client[settings.database_name]

# Collections
users_collection = db["users"]
assessments_collection = db["assessments"]
resumes_collection = db["resumes"]
roadmaps_collection = db["roadmaps"]
interviews_collection = db["interviews"]


async def connect_db():
    """Test database connection on startup."""
    try:
        await client.admin.command("ping")
        print("✅ Connected to MongoDB Atlas")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")


async def close_db():
    """Close database connection on shutdown."""
    client.close()
    print("🔌 MongoDB connection closed")

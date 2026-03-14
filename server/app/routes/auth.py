from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from app.database import users_collection
from app.models.user import UserCreate, UserLogin, UserProfile, TokenResponse
from app.middleware.auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """Register a new user."""
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Hash password and create user
    user_dict = user_data.model_dump()
    user_dict["password"] = hash_password(user_data.password)
    user_dict["created_at"] = datetime.utcnow()
    user_dict["skill_score"] = None

    result = await users_collection.insert_one(user_dict)
    user_id = str(result.inserted_id)

    # Create JWT token
    token = create_access_token(
        data={"sub": user_id, "email": user_data.email, "role": user_data.role}
    )

    user_profile = UserProfile(
        id=user_id,
        name=user_data.name,
        email=user_data.email,
        role=user_data.role,
        location=user_data.location,
        education=user_data.education,
        skills=user_data.skills,
        experience_years=user_data.experience_years,
    )

    return TokenResponse(access_token=token, user=user_profile)


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    """Login and get access token."""
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    user_id = str(user["_id"])
    token = create_access_token(
        data={"sub": user_id, "email": user["email"], "role": user["role"]}
    )

    user_profile = UserProfile(
        id=user_id,
        name=user["name"],
        email=user["email"],
        role=user["role"],
        location=user.get("location"),
        education=user.get("education"),
        skills=user.get("skills", []),
        experience_years=user.get("experience_years", 0),
        skill_score=user.get("skill_score"),
    )

    return TokenResponse(access_token=token, user=user_profile)


@router.get("/profile", response_model=UserProfile)
async def get_profile(current_user: dict = None):
    """Get current user profile. For now works without auth for demo."""
    from bson import ObjectId
    from app.middleware.auth import get_current_user
    # This will be used with auth dependency in production
    # For demo, return a sample profile
    return UserProfile(
        id="demo",
        name="Demo User",
        email="demo@skillsetra.ai",
        role="student",
        skills=["Python", "HTML", "CSS"],
        experience_years=1,
    )

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.TokenResponse)
def register(req: schemas.UserRegister, db: Session = Depends(get_db)):
    # 1. Check if email already exists
    existing = db.query(models.User).filter(models.User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user account with this email address already exists."
        )

    # 2. Check roll number uniqueness
    existing_roll = db.query(models.Student).filter(models.Student.roll_number == req.roll_number).first()
    if existing_roll:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this roll number is already registered."
        )

    # 3. Create User account
    user = models.User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        role="STUDENT",
        is_active=True
    )
    db.add(user)
    db.flush()

    # 4. Create Student Profile
    student = models.Student(
        user_id=user.id,
        full_name=req.full_name,
        roll_number=req.roll_number,
        phone=req.phone,
        course=req.course or "B.Tech Computer Science",
        college_address=req.college_name or "Christ College of Engineering, Irinjalakuda"
    )
    db.add(student)

    # 5. Welcome notification
    notif = models.Notification(
        user_id=user.id,
        title="Welcome to YAATHRI",
        message="Your student mobility account has been successfully initialized. You can now apply for your digital concession pass.",
        type="SUCCESS"
    )
    db.add(notif)
    db.commit()
    db.refresh(user)

    token = create_access_token(int(user.id), str(user.email), str(user.role))
    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        user=schemas.UserOut.model_validate(user)
    )

@router.post("/login", response_model=schemas.TokenResponse)
def login(req: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, str(user.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please verify your credentials."
        )
    if not bool(user.is_active):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended or inactive."
        )

    token = create_access_token(int(user.id), str(user.email), str(user.role))
    return schemas.TokenResponse(
        access_token=token,
        token_type="bearer",
        user=schemas.UserOut.model_validate(user)
    )

@router.post("/logout")
def logout(current_user: models.User = Depends(get_current_user)):
    # In a stateless JWT/bearer setup, the client discards the token.
    return {"message": "Logged out successfully", "status": "OK"}

@router.get("/me", response_model=schemas.UserMeResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    student_data = None
    if current_user.student_profile is not None:
        student_data = schemas.StudentOut.model_validate(current_user.student_profile)
    return schemas.UserMeResponse(
        user=schemas.UserOut.model_validate(current_user),
        student=student_data
    )

@router.post("/forgot-password")
def forgot_password(req: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email.lower()).first()
    if not user:
        # Avoid user enumeration in production, return generic confirmation
        return {
            "message": "If an account exists with this email, password reset instructions have been generated.",
            "status": "SENT"
        }
    
    # For prototype testing, provide a demonstration reset token or temporary confirmation
    return {
        "message": f"Password reset instructions and OTP sent to {req.email}. (Demo bypass code: 2026)",
        "status": "SENT"
    }


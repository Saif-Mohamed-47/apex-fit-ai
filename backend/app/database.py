from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

import os
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./apexfit.db")

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    # Test connection
    with engine.connect() as conn:
        pass
except Exception:
    # Fallback to local SQLite if PostgreSQL container is not running
    DATABASE_URL = "sqlite:///./apexfit.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def init_db_migrations():
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            if engine.dialect.name == "sqlite":
                res = conn.execute(text("PRAGMA table_info(users)"))
                cols = [r[1] for r in res.fetchall()]
                if cols:
                    if "subscription_tier" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN subscription_tier VARCHAR DEFAULT 'free'"))
                    if "ai_messages_today" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN ai_messages_today INTEGER DEFAULT 0"))
                    if "last_ai_message_date" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN last_ai_message_date DATE"))
                    if "is_coach_active" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN is_coach_active BOOLEAN DEFAULT 0"))
                    if "coach_bio" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN coach_bio VARCHAR"))
                    if "coach_avatar_url" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN coach_avatar_url VARCHAR"))
                    if "coach_rating" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN coach_rating FLOAT DEFAULT 4.9"))
                    if "coach_rating_count" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN coach_rating_count INTEGER DEFAULT 18"))
                    if "coach_joined_date" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN coach_joined_date DATE"))
                    if "subscription_expires_at" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN subscription_expires_at DATE"))
                    if "full_name" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN full_name VARCHAR"))
                    if "phone_number" not in cols:
                        conn.execute(text("ALTER TABLE users ADD COLUMN phone_number VARCHAR"))
                    conn.commit()
    except Exception as e:
        pass

init_db_migrations()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


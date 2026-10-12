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


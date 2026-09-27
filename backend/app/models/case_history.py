from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func

from app.appdatabase import Base


class CaseHistory(Base):
    __tablename__ = "case_history"

    id = Column(String, primary_key=True)
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)

    action = Column(String, nullable=False)
    status = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
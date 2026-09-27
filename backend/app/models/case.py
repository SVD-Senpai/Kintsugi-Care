from sqlalchemy import Column, String, Float, Text, DateTime, Integer
from sqlalchemy.sql import func
from app.appdatabase import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True)
    animal_type = Column(String, nullable=False)
    breed = Column(String, nullable=True)
    age = Column(Integer, nullable = True)
    sex = Column(String, nullable=True)
    tag_id = Column(String, nullable=True)
    symptoms = Column(Text, nullable=False)
    risk_level = Column(String, nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    village = Column(String, nullable=True)
    farmer_name = Column(String, nullable=True)
    status = Column(String, nullable=False, default="Pending")
    assigned_vet = Column(String, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )
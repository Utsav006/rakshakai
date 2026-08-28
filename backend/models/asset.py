from sqlalchemy import Column, Integer, String, Boolean
from database.connection import Base

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    asset_type = Column(String)  # e.g., web_app, api, database
    technology = Column(String)  # e.g., Node.js, Python
    criticality = Column(Integer)  # 1 to 5
    internet_exposed = Column(Boolean, default=False)
    data_sensitivity = Column(Integer)  # 1 to 5
    
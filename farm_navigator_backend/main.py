# main.py
# This is the core of your backend. It defines the API endpoints that your
# frontend dashboard will call.

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
from .api import challenges, simulation
# Import the logic functions from our modules
from farm_navigator_backend.modules.data_logic import get_climate_info, get_soil_info, get_crop_info

# --- App Initialization ---
app = FastAPI(
    title="Farm Navigator API",
    description="Backend API for the NASA Space Apps Challenge 'Farm Navigator' project.",
    version="1.0.0"
)

# --- CORS Middleware ---
# This is crucial for hackathons. It allows your frontend (running on a different address)
# to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- API Endpoints ---
app.include_router(challenges.router, prefix="/api/challenges", tags=["Challenges"])
app.include_router(simulation.router, prefix="/api/simulation", tags=["Simulation"])

@app.get("/",  tags=["Root"])
def read_root():
    """ A simple root endpoint to check if the server is running. """
    return {"status": "ok", "message": "Welcome to the Farm Navigator API!"}


@app.get("/climate-data", tags=["Dashboard Cards"])
def get_climate_data(lat: float, lon: float):
    """
    Endpoint for the Weather Card.
    Fetches climate data from NASA POWER dataset (mocked).
    - lat: Latitude of the farm location.
    - lon: Longitude of the farm location.
    """
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid latitude or longitude.")
    
    # In a real application, you would add caching here to avoid hitting NASA's API on every request.
    climate_data = get_climate_info(lat, lon)
    return climate_data


@app.get("/soil-status", tags=["Dashboard Cards"])
def get_soil_status(lat: float, lon: float, field: Optional[int] = 45):
    """
    Endpoint for the Soil Card.
    Fetches soil moisture from NASA SMAP and combines with player data (mocked).
    - lat: Latitude of the farm location.
    - lon: Longitude of the farm location.
    - field: An optional field ID, to show how you might manage different plots.
    """
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid latitude or longitude.")
        
    soil_data = get_soil_info(lat, lon)
    return soil_data


@app.get("/crop-health", tags=["Dashboard Cards"])
def get_crop_health(lat: float, lon: float, crop: str = "maize"):
    """
    Endpoint for the Crop/Yield Card.
    Uses MODIS NDVI data to determine crop health and runs a simulation for yield (mocked).
    - lat: Latitude of the farm location.
    - lon: Longitude of the farm location.
    - crop: The type of crop being grown (e.g., maize, wheat).
    """
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        raise HTTPException(status_code=400, detail="Invalid latitude or longitude.")
    
    crop_data = get_crop_info(lat, lon, crop)
    return crop_data

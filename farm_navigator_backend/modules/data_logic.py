# modules/data_logic.py
# This file simulates fetching data from NASA's APIs and contains the business
# logic for processing that data into the format the frontend needs.
import requests
import random
from datetime import date, timedelta
from .simulation import predict_yield # Import our simulation logic

# --- Mock NASA Data Fetching & Processing ---

def _get_mock_climate_info(lat: float, lon: float):
    """Generates random but plausible climate data as a fallback."""
    print(f"Coordinates ({lat}, {lon}) are valid, but falling back to mock climate data.")
    temp = round(random.uniform(28.0, 35.5), 1)
    rainfall = round(random.uniform(0.0, 15.0), 1)
    drought_index = round(1 - (rainfall / 15.0), 2)
    history = []
    today = date.today()
    for i in range(7):
        day = today - timedelta(days=i)
        history.append({
            "day": day.isoformat(),
            "rainfall": round(random.uniform(0.0, 20.0), 1)
        })
    return {
        "temperature": temp,
        "rainfall": rainfall,
        "drought_index": drought_index,
        "history": list(reversed(history))
    }


def get_climate_info(lat: float, lon: float):
    """
    Fetches real climate data from the NASA POWER API for the last 7 days.
    Falls back to mocked data if the API call fails.
    """
    end_date = date.today()
    start_date = end_date - timedelta(days=7)
    
    start_str = start_date.strftime("%Y%m%d")
    end_str = end_date.strftime("%Y%m%d")

    url = (
        f"https://power.larc.nasa.gov/api/temporal/daily/point?"
        f"parameters=T2M,PRECTOT&community=AG&longitude={lon}&latitude={lat}&"
        f"start={start_str}&end={end_str}&format=JSON"
    )

    try:
        response = requests.get(url, timeout=15)
        response.raise_for_status()  # Raise an exception for bad status codes
        
        data = response.json()
        
        temp_data = data["properties"]["parameter"]["T2M"]
        precip_data = data["properties"]["parameter"]["PRECTOT"]
        
        # Get the latest data for the main display
        latest_date_key = max(temp_data.keys())
        latest_temp = temp_data.get(latest_date_key, 0)
        latest_rainfall = precip_data.get(latest_date_key, 0)

        # Handle NASA's fill value for missing data (-999)
        if latest_temp <= -999: latest_temp = 0
        if latest_rainfall <= -999: latest_rainfall = 0

        # Create the history list for the chart
        history = []
        for date_key, value in sorted(precip_data.items()):
            iso_date = f"{date_key[:4]}-{date_key[4:6]}-{date_key[6:]}"
            rainfall_val = value if value > -999 else 0
            history.append({"day": iso_date, "rainfall": rainfall_val})
            
        # Simple drought index (0 = wet, 1 = very dry) based on latest rainfall
        # Using 25mm as a reference for "very wet"
        drought_index = round(1 - (latest_rainfall / 25.0), 2) if latest_rainfall < 25 else 0.0

        return {
            "temperature": latest_temp,
            "rainfall": latest_rainfall,
            "drought_index": max(0, drought_index),
            "history": history
        }

    except (requests.exceptions.RequestException, KeyError) as e:
        print(f"NASA POWER API call failed: {e}. Falling back to mock data.")
        return _get_mock_climate_info(lat, lon)
    
# --- Mock NASA Data Fetching & Processing ---

def _get_mock_soil_info(lat: float, lon: float):
    """Generates random but plausible soil data as a fallback."""
    print(f"Coordinates ({lat}, {lon}) are valid, but falling back to mock soil data.")
    moisture = round(random.uniform(15.0, 45.0), 1)
    if moisture < 20:
        status = "critical"
    elif moisture < 30:
        status = "low moisture"
    else:
        status = "good"
    nutrients = {"N": random.randint(30, 70), "P": random.randint(20, 50), "K": random.randint(50, 90)}
    depth = {
        "0-10cm": round(moisture * random.uniform(0.8, 0.95), 1),
        "0-100cm": round(moisture * random.uniform(1.0, 1.15), 1)
    }
    return {"moisture": moisture, "nutrients": nutrients, "depth": depth, "status": status}

def get_soil_info(lat: float, lon: float):
    """
    Fetches real soil moisture data from the Crop-CASMA WMS API.
    Falls back to mocked data if the API call fails.
    """
    base_url = "https://cloud.csiss.gmu.edu/Crop-CASMA/wms"
    # Data is often a day or two behind, so let's check for yesterday's data.
    query_date = (date.today() - timedelta(days=2)).strftime("%Y-%m-%d")
    layer_name = "crop_casma_sm_pct"
    
    # For a GetFeatureInfo request, we define a small bounding box around our point.
    bbox = f"{lon-0.01},{lat-0.01},{lon+0.01},{lat+0.01}"

    params = {
        'SERVICE': 'WMS', 'VERSION': '1.1.1', 'REQUEST': 'GetFeatureInfo',
        'LAYERS': layer_name, 'QUERY_LAYERS': layer_name, 'BBOX': bbox,
        'WIDTH': 1, 'HEIGHT': 1, 'X': 0, 'Y': 0, 'SRS': 'EPSG:4326',
        'INFO_FORMAT': 'application/json', 'TIME': query_date,
    }

    try:
        response = requests.get(base_url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        # The value is in the 'features' array, under 'properties', with the key 'GRAY_INDEX'.
        soil_moisture_value = data['features'][0]['properties']['GRAY_INDEX']
        moisture = round(float(soil_moisture_value), 1)

        if moisture < 20:
            status = "critical"
        elif moisture < 30:
            status = "low moisture"
        else:
            status = "good"
            
        # Nutrient levels remain mocked as there is no direct NASA API for them.
        # In a full game, this would be part of the player's state.
        nutrients = {"N": random.randint(30, 70), "P": random.randint(20, 50), "K": random.randint(50, 90)}
        
        # Mock moisture at different soil depths based on the real surface value.
        depth = {
            "0-10cm": round(moisture * random.uniform(0.95, 1.0), 1), # Surface
            "0-100cm": round(moisture * random.uniform(1.0, 1.15), 1) # Deeper
        }
        
        return {"moisture": moisture, "nutrients": nutrients, "depth": depth, "status": status}

    except (requests.exceptions.RequestException, KeyError, IndexError, ValueError) as e:
        print(f"Crop-CASMA API call failed: {e}. Falling back to mock data.")
        return _get_mock_soil_info(lat, lon)


def _get_mock_crop_info(lat: float, lon: float, crop: str):
    """Generates random but plausible crop health data as a fallback."""
    print(f"Coordinates ({lat}, {lon}) are valid, but falling back to mock crop data.")
    ndvi_value = random.uniform(0.55, 0.90)
    health_score = int((ndvi_value - 0.2) / 0.7 * 100)
    if health_score < 70:
        status = "stressed"
    elif health_score < 85:
        status = "healthy"
    else:
        status = "thriving"
    predicted_yield = predict_yield(crop, health_score)
    trend = [
        round(predicted_yield * random.uniform(0.92, 0.96), 2),
        round(predicted_yield * random.uniform(0.95, 0.99), 2),
        predicted_yield
    ]
    return {
        "health_score": health_score,
        "status": status,
        "predicted_yield": predicted_yield,
        "trend": trend
    }


def get_crop_info(lat: float, lon: float, crop: str):
    """
    Fetches real crop health (NDVI) data from the Crop-CASMA WMS API.
    Falls back to mocked data if the API call fails.
    """
    base_url = "https://cloud.csiss.gmu.edu/Crop-CASMA/wms"
    # NDVI data is not daily; we check for a recent composite image (e.g., 5 days ago)
    query_date = (date.today() - timedelta(days=5)).strftime("%Y-%m-%d")
    layer_name = "crop_casma_ndvi"
    
    bbox = f"{lon-0.01},{lat-0.01},{lon+0.01},{lat+0.01}"

    params = {
        'SERVICE': 'WMS', 'VERSION': '1.1.1', 'REQUEST': 'GetFeatureInfo',
        'LAYERS': layer_name, 'QUERY_LAYERS': layer_name, 'BBOX': bbox,
        'WIDTH': 1, 'HEIGHT': 1, 'X': 0, 'Y': 0, 'SRS': 'EPSG:4326',
        'INFO_FORMAT': 'application/json', 'TIME': query_date,
    }

    try:
        response = requests.get(base_url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        # The raw NDVI value is returned, often needs scaling.
        raw_ndvi = float(data['features'][0]['properties']['GRAY_INDEX'])
        # MODIS NDVI is often scaled by 10000, so we divide to get the -1 to 1 range.
        ndvi_value = raw_ndvi / 10000.0

        # Convert NDVI to a simple 0-100 health score
        # A simple linear scale from 0.2 (low vegetation) to 0.9 (dense vegetation)
        health_score = int(((ndvi_value - 0.2) / (0.9 - 0.2)) * 100)
        health_score = max(0, min(100, health_score)) # Clamp between 0 and 100

        if health_score < 70:
            status = "stressed"
        elif health_score < 85:
            status = "healthy"
        else:
            status = "thriving"
        
        predicted_yield = predict_yield(crop, health_score)
        trend = [
            round(predicted_yield * random.uniform(0.92, 0.96), 2),
            round(predicted_yield * random.uniform(0.95, 0.99), 2),
            predicted_yield
        ]
        
        return {
            "health_score": health_score,
            "status": status,
            "predicted_yield": predicted_yield,
            "trend": trend
        }

    except (requests.exceptions.RequestException, KeyError, IndexError, ValueError) as e:
        print(f"Crop-CASMA NDVI call failed: {e}. Falling back to mock data.")
        return _get_mock_crop_info(lat, lon, crop)



import httpx
import asyncio
from datetime import datetime, timedelta

# The base URL for the NASA POWER API
BASE_URL = "https://power.larc.nasa.gov/api/point"

async def get_live_weather_data(lat: float, lon: float) -> dict:
    """
    Fetches live weather data for a specific coordinate from NASA POWER.
    
    Returns a dictionary with temperature, humidity, and wind speed, or defaults.
    """
    # Get dates for the last week to average the data
    end_date = datetime.now() - timedelta(days=10)
    start_date = end_date - timedelta(days=7)

    params = {
        "start": start_date.strftime("%Y%m%d"),
        "end": end_date.strftime("%Y%m%d"),
        "latitude": lat,
        "longitude": lon,
        "community": "ag",
        "parameters": "T2M,RH2M,WS10M", # T2M: Temp at 2m, RH2M: Humidity at 2m, WS10M: Wind at 10m
        "format": "json",
        "header": "true",
        "time-standard": "lst",
    }
    
    try:
        # Use httpx for asynchronous API calls
        async with httpx.AsyncClient() as client:
            response = await client.get(BASE_URL, params=params)
            response.raise_for_status()  # Will raise an exception for 4XX/5XX errors
            data = response.json()

            # Extract the latest values from the response
            temp = data["properties"]["parameter"]["T2M"][-1]
            humidity = data["properties"]["parameter"]["RH2M"][-1]
            wind = data["properties"]["parameter"]["WS10M"][-1]
            
            # NASA POWER might return fill values for missing data
            if temp < -900: temp = 25.0 # Default fallback
            if humidity < -900: humidity = 60.0 # Default fallback
            if wind < -900: wind = 2.0 # Default fallback

            return {
                "temperature": round(temp),
                "humidity": round(humidity),
                "wind_speed": round(wind, 1)
            }

    except (httpx.RequestError, KeyError) as e:
        print(f"Error fetching NASA POWER data: {e}")
        # Return sensible defaults if the API call fails
        return {
            "temperature": 25,
            "humidity": 60,
            "wind_speed": 2.0
        }

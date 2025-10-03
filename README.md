# Farm Navigator 🌾

A comprehensive farm management dashboard built for the NASA Space Apps Challenge. Farm Navigator helps farmers make data-driven decisions by providing real-time climate data, soil monitoring, and crop health insights using NASA's satellite data and APIs.

## 🚀 Features

- **Climate Monitoring**: Real-time weather data using NASA POWER dataset
- **Soil Analysis**: Soil moisture tracking with NASA SMAP data
- **Crop Health**: NDVI-based crop health assessment using MODIS data
- **Interactive Dashboard**: User-friendly web interface for farm management
- **Simulation Tools**: Crop yield prediction and farming scenario simulation
- **Multi-location Support**: GPS-based location tracking for multiple farm plots

## 🏗️ Project Structure

```
farm_navigator/
├── farm_navigator_backend/     # FastAPI backend
│   ├── api/                   # API route handlers
│   ├── data/                  # Data processing modules
│   ├── models/                # Data models and schemas
│   ├── modules/               # Core business logic
│   ├── routers/               # API routers (datasets, graphs, download)
│   ├── services/              # External service integrations
│   ├── utils/                 # Utility functions
│   ├── main.py               # FastAPI application entry point
│   └── requirements.txt      # Python dependencies
├── frontend/                  # Web frontend
│   ├── assets/               # Static assets (videos, images)
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript modules
│   └── pages/                # HTML pages
├── .env                      # Environment variables
└── README.md                 # This file
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Python 3.8+**: Core programming language
- **Uvicorn**: ASGI server for FastAPI
- **Requests/HTTPX**: HTTP client for NASA API integration
- **Pydantic**: Data validation and settings management

### Frontend
- **HTML5/CSS3**: Modern web standards
- **Vanilla JavaScript**: Client-side interactivity
- **Responsive Design**: Mobile-friendly interface

### Data Sources
- **NASA POWER**: Climate and weather data
- **NASA SMAP**: Soil moisture data
- **MODIS**: Satellite imagery for crop health (NDVI)
- **OpenWeather API**: Additional weather information

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd farm_navigator
   ```

2. **Set up the backend**
   ```bash
   cd farm_navigator_backend
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   # Copy and edit the .env file
   cp .env.example .env
   # Add your API keys:
   # OPENWEATHER_API_KEY=your_openweather_key
   # SENTINEL_API_KEY=your_sentinel_key
   ```

4. **Start the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Access the application**
   - API Documentation: http://localhost:8000/docs
   - Frontend: http://localhost:8000/static/index.html
   - API Health Check: http://localhost:8000/

## 📡 API Endpoints

### Core Endpoints
- `GET /` - Health check and welcome message
- `GET /climate-data` - Fetch climate data for coordinates
- `GET /soil-status` - Get soil moisture and status
- `GET /crop-health` - Analyze crop health using NDVI

### Data Management
- `GET /datasets/*` - Dataset management endpoints
- `GET /graphs/*` - Data visualization endpoints
- `GET /download/*` - Data export functionality

### Simulation & Challenges
- `POST /api/simulation/*` - Farming simulation tools
- `GET /api/challenges/*` - Challenge and scenario management

## 🌍 Usage Examples

### Get Climate Data
```bash
curl "http://localhost:8000/climate-data?lat=40.7128&lon=-74.0060"
```

### Check Soil Status
```bash
curl "http://localhost:8000/soil-status?lat=40.7128&lon=-74.0060&field=45"
```

### Analyze Crop Health
```bash
curl "http://localhost:8000/crop-health?lat=40.7128&lon=-74.0060&crop=maize"
```

## 🎯 NASA Space Apps Challenge

This project was developed for the NASA Space Apps Challenge, focusing on:
- **Sustainable Agriculture**: Using satellite data for precision farming
- **Climate Adaptation**: Helping farmers adapt to changing climate conditions
- **Food Security**: Supporting global food production through technology
- **Open Data**: Leveraging NASA's open datasets for agricultural insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- NASA for providing open access to satellite data and APIs
- NASA Space Apps Challenge for the inspiration and platform
- The global farming community for their invaluable insights

## 📞 Support

For questions, issues, or contributions, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for farmers worldwide** 🌱
# Dashboard Docker Setup

This project uses Docker to run both the Django backend and Next.js frontend in containers.

## Quick Start

1. **Start all services:**
   ```bash
   ./start-dev.sh
   ```
   Or manually:
   ```bash
   docker-compose up --build
   ```

2. **Access the applications:**
   - Django API: http://localhost:8000
   - Next.js Frontend: http://localhost:3000

## Services

### Django Backend (Port 8000)
- **Dockerfile**: `./server/Dockerfile`
- **Environment**: Python 3.11
- **Database**: SQLite (pre-populated with sample data)
- **Features**:
  - REST API with Django REST Framework
  - CORS enabled for frontend communication
  - Sample data for ActivityEvents and Persons
  - Dashboard-specific endpoints for charts and tables

### Next.js Frontend (Port 3000)
- **Dockerfile**: `./client/Dockerfile`
- **Environment**: Node.js 18
- **Features**:
  - React components for dashboard
  - Table and chart components
  - API integration with Django backend

## API Endpoints

### Core Endpoints
- `GET /` - API information and available endpoints
- `GET /api/events/random/` - Random activity events
- `GET /api/people/random/` - Random people

### Dashboard Endpoints
- `GET /api/dashboard/stats/` - Dashboard statistics
- `GET /api/dashboard/activity-timeline/` - Activity timeline data for charts
- `GET /api/dashboard/channel-breakdown/` - Channel breakdown data

### Query Parameters
All dashboard endpoints require:
- `customer_org_id` - Customer organization ID

Optional parameters:
- `days` - Number of days to look back (default: 30)

### Example API Calls
```bash
# Get dashboard stats
curl "http://localhost:8000/api/dashboard/stats/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf"

# Get activity timeline
curl "http://localhost:8000/api/dashboard/activity-timeline/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf&days=7"

# Get channel breakdown
curl "http://localhost:8000/api/dashboard/channel-breakdown/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf"
```

## Development

### Rebuilding Services
```bash
# Rebuild and restart all services
docker-compose up --build

# Rebuild specific service
docker-compose up --build django
docker-compose up --build nextjs
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f django
docker-compose logs -f nextjs
```

### Stopping Services
```bash
docker-compose down
```

## Database

The SQLite database (`db.sqlite3`) is pre-populated with sample data:
- ActivityEvents from `data/account_31crr1tcp2bmcv1fk6pcm0k6ag.jsonl`
- Persons from `data/persons.jsonl`

The database is mounted as a volume, so changes persist between container restarts.

## Troubleshooting

### Port Conflicts
If ports 3000 or 8000 are already in use, modify the `docker-compose.yml` file to use different ports.

### Database Issues
If you encounter database issues, you can reset the database:
```bash
docker-compose down
docker-compose up --build
```

### CORS Issues
If you encounter CORS issues, check that the frontend URL is included in `CORS_ALLOWED_ORIGINS` in `server/config/settings.py`.
# Frontend-Backend Integration Guide

## Overview
This document describes the integration between the Next.js frontend and Django backend for the dashboard application.

## Architecture

### Backend (Django)
- **Port**: 8000
- **API Base URL**: http://localhost:8000
- **Main Endpoints**:
  - `/api/dashboard/stats/` - Dashboard statistics
  - `/api/dashboard/activity-timeline/` - Activity timeline data for charts
  - `/api/dashboard/channel-breakdown/` - Channel breakdown data
  - `/api/events/random/` - Random activity events
  - `/api/people/random/` - Random people data

### Frontend (Next.js)
- **Port**: 3000
- **Features**:
  - Real-time data fetching from Django API
  - Interactive charts showing activity timeline
  - Dynamic table displaying touchpoint data
  - Loading states and error handling
  - Dark mode support

## API Integration Details

### 1. API Configuration
Located in `/client/app/lib/api/`:
- `config.ts` - API endpoints and default parameters
- `client.ts` - Base API client with error handling
- `types.ts` - TypeScript interfaces for API responses

### 2. React Hooks
Located in `/client/app/lib/hooks/`:
- `useDashboardStats` - Fetches dashboard statistics
- `useActivityTimeline` - Fetches timeline data for charts
- `useActivityEvents` - Fetches activity events for table
- `usePeople` - Fetches people data

### 3. Component Integration
- **Chart Component** (`/client/app/components/Chart/`):
  - Uses `useActivityTimeline` hook for real-time data
  - Transforms API data to Chart.js format
  - Shows loading and error states
  
- **Table Component** (`/client/app/components/Table/`):
  - Uses `useActivityEvents` and `usePeople` hooks
  - Transforms API data to table format
  - Includes refresh functionality
  - Shows loading and error states

## Running the Application

### Using Docker Compose (Recommended)
```bash
# Start both services
docker-compose up

# Or run in detached mode
docker-compose up -d
```

### Manual Setup

#### Backend Setup
```bash
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py ingest_activityevents
python manage.py ingest_persons
python manage.py runserver
```

#### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Testing the Integration

### Test API Endpoints
```bash
# Run the test script
./test_api.sh
```

### Manual API Testing
```bash
# Test dashboard stats
curl "http://localhost:8000/api/dashboard/stats/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf"

# Test activity timeline
curl "http://localhost:8000/api/dashboard/activity-timeline/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf&days=30"

# Test events
curl "http://localhost:8000/api/events/random/?customer_org_id=org_4m6zyrass98vvtk3xh5kcwcmaf&account_id=account_31crr1tcp2bmcv1fk6pcm0k6ag"
```

## Key Features

### Error Handling
- API client includes comprehensive error handling
- Components show user-friendly error messages
- Automatic retry logic in hooks

### Loading States
- Skeleton loaders while data is fetching
- Smooth transitions between states
- Refresh indicators

### Data Transformation
- API responses are transformed to match component requirements
- Date formatting for user-friendly display
- Channel and status mapping for visual indicators

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (settings.py)
- CORS is configured to allow requests from localhost:3000
- Debug mode enabled for development

## Troubleshooting

### CORS Issues
- Ensure Django's CORS settings include the frontend URL
- Check that `django-cors-headers` is installed and configured

### Connection Refused
- Verify both services are running
- Check ports 3000 and 8000 are not in use
- Ensure Docker network is properly configured

### No Data Showing
- Run data ingestion commands in Django
- Check customer_org_id and account_id match the data
- Verify API endpoints are returning data

## Development Workflow

1. **Backend Changes**:
   - Modify Django views/models
   - Run migrations if needed
   - Restart Django server

2. **Frontend Changes**:
   - Update components or hooks
   - Next.js hot-reloads automatically
   - Check browser console for errors

3. **API Changes**:
   - Update both backend endpoints and frontend hooks
   - Update TypeScript types to match new response format
   - Test with the test script

## Next Steps

Potential improvements:
- Add pagination to table component
- Implement real-time updates with WebSockets
- Add filtering and sorting capabilities
- Implement user authentication
- Add more chart types and visualizations
- Optimize API queries for performance
#!/bin/bash

# Start development environment
echo "Starting Dashboard Development Environment..."

# Build and start services
docker-compose up --build

echo "Services started!"
echo "Django API: http://localhost:8000"
echo "Next.js Frontend: http://localhost:3000"
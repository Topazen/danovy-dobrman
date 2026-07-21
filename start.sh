#!/bin/bash
# Startup script for ASP.NET Core application

# Navigate to the application directory
cd "$(dirname "$0")"

# Check if dotnet is available
if ! command -v dotnet &> /dev/null
then
    echo "dotnet runtime not found!"
    exit 1
fi

# Kill any existing instance
pkill -f "UcetnictviSite.dll"

# Start the application
export ASPNETCORE_ENVIRONMENT=Production
export ASPNETCORE_URLS="http://localhost:5000"

nohup dotnet UcetnictviSite.dll > app.log 2>&1 &

echo "Application started on port 5000"
echo "PID: $!"

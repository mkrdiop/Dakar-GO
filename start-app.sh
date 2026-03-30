#!/bin/bash

# Set the port for the Next.js app
export PORT=12000

# Start the Next.js development server
echo "Starting Dakar GO on port $PORT..."
cd /workspace/Dakar-GO
npm run dev -- -p $PORT --hostname 0.0.0.0
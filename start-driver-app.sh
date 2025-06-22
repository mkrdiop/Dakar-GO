#!/bin/bash

# Set the port for the Next.js app
export PORT=12000

# Start the Next.js development server
echo "Starting Dakar GO Driver App on port $PORT..."
cd /workspace/Dakar-GO
npm run dev -- -p $PORT
#!/bin/bash

# Define the project directory keyword (adjust as needed)
PROJECT_DIR="memoryhole"

# Find all Node processes related to the project directory
PIDS=$(pgrep -a node | grep "$PROJECT_DIR" | grep -v grep | grep -v jest | awk '{print $1}')

if [ -z "$PIDS" ]; then
  echo "No Node processes found related to '$PROJECT_DIR'"
  exit 0
fi

# Kill each process
echo "Killing the following Node processes related to '$PROJECT_DIR':"
echo "$PIDS"
for PID in $PIDS; do
  echo "Killing process $PID"
  kill -9 "$PID"
done

echo "All matching processes have been killed."

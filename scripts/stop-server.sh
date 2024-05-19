#!/bin/bash
# stop-server.sh
#
# This script stops the Webpack Dev Server running on a specified port.
# It finds the process listening on the port and terminates it.

PORT=8080 # The port on which your Webpack Dev Server is running

# Find the process ID (PID) of the process listening on the specified port
# and kill the process
lsof -i tcp:${PORT} | grep LISTEN | awk '{print $2}' | xargs kill

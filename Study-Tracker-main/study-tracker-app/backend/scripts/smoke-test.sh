#!/bin/sh
# Smoke test script for backend
set -e
curl --fail http://localhost:3001/health

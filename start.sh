#!/bin/bash
# Quick start script for Linux/Mac
# This script runs the entire CARE-AI project with one command

echo ""
echo "============================================================"
echo "         CARE-AI Project - Quick Start"
echo "============================================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 not found!"
    echo "Please install Python from https://www.python.org/"
    exit 1
fi

# Check if venv exists
if [ ! -d "venv" ]; then
    echo ""
    echo "ERROR: Virtual environment not found!"
    echo "Please run setup first:"
    echo ""
    echo "   python3 setup.py"
    echo ""
    exit 1
fi

echo "Starting CARE-AI Application..."
echo ""

# Run the app
python3 app.py

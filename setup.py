#!/usr/bin/env python
"""
Setup script to create a unified venv and install all dependencies
Run this script once to set up the project environment
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.absolute()
VENV_DIR = PROJECT_ROOT / 'venv'
BACKEND_DIR = PROJECT_ROOT / 'backend'
FRONTEND_DIR = PROJECT_ROOT / 'frontend'
OLD_VENVS = [PROJECT_ROOT / '.venv', BACKEND_DIR / '.venv', FRONTEND_DIR / '.venv']
NPM_COMMAND = shutil.which('npm.cmd' if sys.platform == 'win32' else 'npm')

def print_banner():
    """Print setup banner"""
    print("\n" + "="*60)
    print("🔧 CARE-AI Project - Setup")
    print("="*60 + "\n")

def cleanup_old_venvs():
    """Remove old venv folders"""
    for old_venv in OLD_VENVS:
        if old_venv.exists():
            print(f"🗑️  Removing old venv: {old_venv}")
            try:
                shutil.rmtree(old_venv)
                print(f"✅ Removed {old_venv}")
            except Exception as e:
                print(f"⚠️  Could not remove {old_venv}: {e}")

def create_venv():
    """Create virtual environment"""
    print(f"\n📦 Creating virtual environment at {VENV_DIR}")
    try:
        subprocess.run(
            [sys.executable, '-m', 'venv', str(VENV_DIR)],
            check=True
        )
        print("✅ Virtual environment created")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to create venv: {e}")
        sys.exit(1)

def get_pip_executable():
    """Get the pip executable from venv"""
    if sys.platform == 'win32':
        return VENV_DIR / 'Scripts' / 'pip.exe'
    else:
        return VENV_DIR / 'bin' / 'pip'

def install_backend_deps():
    """Install backend dependencies"""
    print("\n📥 Installing backend dependencies...")
    pip_exe = get_pip_executable()
    requirements_file = BACKEND_DIR / 'requirements.txt'
    
    if not requirements_file.exists():
        print(f"⚠️  requirements.txt not found at {requirements_file}")
        return
    
    try:
        subprocess.run(
            [str(pip_exe), 'install', '-r', str(requirements_file)],
            check=True
        )
        print("✅ Backend dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install backend dependencies: {e}")
        sys.exit(1)

def install_frontend_deps():
    """Install frontend dependencies"""
    print("\n📥 Installing frontend dependencies...")

    if not NPM_COMMAND:
        print("❌ npm was not found on PATH. Install Node.js or restart VS Code after installing it.")
        sys.exit(1)
    
    try:
        subprocess.run(
            [NPM_COMMAND, 'install'],
            cwd=str(FRONTEND_DIR),
            check=True
        )
        print("✅ Frontend dependencies installed")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install frontend dependencies: {e}")
        print("💡 Make sure Node.js and npm are installed")
        sys.exit(1)
    except FileNotFoundError:
        print(f"❌ npm executable could not be started: {NPM_COMMAND}")
        print("Please install Node.js from https://nodejs.org/ and restart VS Code.")
        sys.exit(1)

def main():
    """Main setup"""
    print_banner()
    
    print("This script will:")
    print("1. Remove old venv folders (.venv)")
    print("2. Create a single 'venv' folder")
    print("3. Install backend (Python) dependencies")
    print("4. Install frontend (Node.js) dependencies")
    print()
    
    response = input("Continue? (yes/no): ").strip().lower()
    if response not in ['yes', 'y']:
        print("Setup cancelled")
        sys.exit(0)
    
    # Clean up old venvs
    cleanup_old_venvs()
    
    # Create new venv
    create_venv()
    
    # Install dependencies
    install_backend_deps()
    install_frontend_deps()
    
    print("\n" + "="*60)
    print("✅ Setup complete!")
    print("="*60)
    print("\n🚀 To start the project, run:")
    print(f"   python app.py")
    print("\nThis will start both backend and frontend servers")
    print("and automatically open the browser.\n")

if __name__ == '__main__':
    main()

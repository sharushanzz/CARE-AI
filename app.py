#!/usr/bin/env python
"""
Unified entry point for CARE-AI project
Starts both backend (FastAPI) and frontend (Vite) simultaneously
and opens the browser automatically
"""

import os
import sys
import subprocess
import shutil
import time
import webbrowser
import threading
import signal
from pathlib import Path

# Get project root directory
PROJECT_ROOT = Path(__file__).parent.absolute()
BACKEND_DIR = PROJECT_ROOT / 'backend'
FRONTEND_DIR = PROJECT_ROOT / 'frontend'
VENV_DIR = PROJECT_ROOT / 'venv'
NPM_COMMAND = shutil.which('npm.cmd' if sys.platform == 'win32' else 'npm')

# Configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:5173"

# Global process handles
backend_process = None
frontend_process = None

def print_banner():
    """Print startup banner"""
    print("\n" + "="*70)
    print("🏥 CARE-AI PROJECT - Full Stack Startup".center(70))
    print("="*70)
    print(f"Backend:  {BACKEND_URL}".center(70))
    print(f"Frontend: {FRONTEND_URL}".center(70))
    print("API Docs: http://localhost:8000/docs".center(70))
    print("="*70 + "\n")

def cleanup_on_exit(signum, frame):
    """Handle graceful shutdown"""
    print("\n\n⛔ Shutting down servers...")
    global backend_process, frontend_process
    
    if backend_process:
        try:
            backend_process.terminate()
            backend_process.wait(timeout=3)
        except:
            backend_process.kill()
    
    if frontend_process:
        try:
            frontend_process.terminate()
            frontend_process.wait(timeout=3)
        except:
            frontend_process.kill()
    
    print("✅ All servers stopped\n")
    sys.exit(0)

def start_backend():
    """Start FastAPI backend server"""
    global backend_process
    print("🚀 Starting Backend (FastAPI)...")
    
    backend_env = os.environ.copy()
    backend_env['PYTHONPATH'] = str(BACKEND_DIR)
    
    # Get python executable from venv
    if sys.platform == 'win32':
        python_exe = VENV_DIR / 'Scripts' / 'python.exe'
    else:
        python_exe = VENV_DIR / 'bin' / 'python'
    
    try:
        backend_process = subprocess.Popen(
            [str(python_exe), '-m', 'uvicorn', 'main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'],
            cwd=str(BACKEND_DIR),
            env=backend_env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("✅ Backend process started (PID: {})".format(backend_process.pid))
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        print("💡 Make sure setup.py was run first")
        sys.exit(1)

def start_frontend():
    """Start Vite dev server for frontend"""
    global frontend_process
    print("🚀 Starting Frontend (Vite)...")

    if not NPM_COMMAND:
        print("❌ npm was not found on PATH. Install Node.js or restart VS Code after installing it.")
        sys.exit(1)
    
    try:
        # Check if node_modules exists
        if not (FRONTEND_DIR / 'node_modules').exists():
            print("📦 Installing frontend dependencies (this may take a moment)...")
            result = subprocess.run(
                [NPM_COMMAND, 'install'],
                cwd=str(FRONTEND_DIR),
                check=True,
                capture_output=True,
                text=True
            )
            print("✅ Frontend dependencies installed")
        
        # Start dev server
        frontend_process = subprocess.Popen(
            [NPM_COMMAND, 'run', 'dev'],
            cwd=str(FRONTEND_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print("✅ Frontend process started (PID: {})".format(frontend_process.pid))
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e.stderr}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"❌ npm executable could not be started: {NPM_COMMAND}")
        print("Please install Node.js from https://nodejs.org/ and restart VS Code.")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error starting frontend: {e}")
        sys.exit(1)

def wait_for_service(url, timeout=30):
    """Wait for service to be ready"""
    import socket
    
    try:
        host = url.split('://')[1].split(':')[0]
        port = int(url.split(':')[-1])
        
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1)
                sock.connect((host, port))
                sock.close()
                return True
            except (ConnectionRefusedError, socket.timeout):
                time.sleep(0.5)
        return False
    except Exception:
        return False

def open_browser():
    """Open browser after services are ready"""
    print("\n⏳ Waiting for services to start...")
    
    # Wait for backend
    if wait_for_service(BACKEND_URL, timeout=20):
        print(f"✅ Backend ready at {BACKEND_URL}")
    else:
        print(f"⚠️  Backend is taking longer to start...")
    
    # Wait for frontend
    if wait_for_service(FRONTEND_URL, timeout=20):
        print(f"✅ Frontend ready at {FRONTEND_URL}")
    else:
        print(f"⚠️  Frontend is taking longer to start...")
    
    # Open browser
    print(f"\n🌐 Opening browser...")
    time.sleep(1)
    try:
        webbrowser.open(FRONTEND_URL)
        print(f"✅ Application opened at {FRONTEND_URL}")
    except Exception as e:
        print(f"⚠️  Could not open browser automatically: {e}")
        print(f"   Open manually: {FRONTEND_URL}")
    
    print("\n" + "="*70)
    print("✅ All services running! Press Ctrl+C to stop".center(70))
    print("="*70 + "\n")

def check_requirements():
    """Check if setup has been done"""
    if not VENV_DIR.exists():
        print("\n" + "!"*70)
        print("❌ VENV NOT FOUND!".center(70))
        print("!"*70)
        print("\nFirst time setup required. Please run:".center(70))
        print("   python setup.py".center(70))
        print("\nThis will:")
        print("   • Create unified venv folder")
        print("   • Install all dependencies")
        print("   • Prepare the project")
        print("!"*70 + "\n")
        sys.exit(1)

def main():
    """Main entry point"""
    # Set up signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, cleanup_on_exit)
    if hasattr(signal, 'SIGTERM'):
        signal.signal(signal.SIGTERM, cleanup_on_exit)
    
    print_banner()
    check_requirements()
    
    # Verify directories exist
    if not BACKEND_DIR.exists():
        print(f"❌ Backend directory not found: {BACKEND_DIR}")
        sys.exit(1)
    if not FRONTEND_DIR.exists():
        print(f"❌ Frontend directory not found: {FRONTEND_DIR}")
        sys.exit(1)
    
    # Start services in separate threads
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    frontend_thread = threading.Thread(target=start_frontend, daemon=True)
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    
    backend_thread.start()
    time.sleep(2)  # Give backend time to start
    
    frontend_thread.start()
    time.sleep(2)  # Give frontend time to start
    
    browser_thread.start()
    
    # Keep main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        cleanup_on_exit(None, None)

if __name__ == '__main__':
    main()

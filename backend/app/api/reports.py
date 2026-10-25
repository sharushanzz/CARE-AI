from datetime import date
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse

from app.api.family import FAMILY_MEMBERS
from app.api.appointments import APPOINTMENTS
from app.services.ai import explain_report

router = APIRouter()
DATA_DIR = Path(__file__).resolve().parents[2] / 'data' / 'reports'
DATA_DIR.mkdir(parents=True, exist_ok=True)

REPORTS = [
    {"id": "1", "title": "Blood Test", "type": "Lab Report", "status": "Ready", "hospital": "CarePoint Medical"},
    {"id": "2", "title": "Cardio Scan", "type": "Imaging", "status": "Pending", "hospital": "Family Health Center"},
    {"id": "3", "title": "Allergy Panel", "type": "Lab Report", "status": "Ready", "hospital": "City Hospital"},
]
REPORT_FILE_PATHS = {}

@router.get('/')
def list_reports():
    return REPORTS

@router.get('/summary')
def dashboard_summary():
    today = date.today()
    upcoming = [appt for appt in APPOINTMENTS if date.fromisoformat(appt['date']) >= today]
    hospitals = {appt['hospital'] for appt in APPOINTMENTS if appt.get('hospital')}
    health_score = min(100, max(70, 70 + len(REPORTS) * 2 - len(upcoming)))
    return {
        "healthScore": health_score,
        "reportsUploaded": len(REPORTS),
        "upcomingAppointments": len(upcoming),
        "familyConnections": len(FAMILY_MEMBERS),
        "hospitalVisits": len(hospitals),
        "recentReports": REPORTS[-3:],
        "recommendedCare": [
            {"label": "Annual checkup", "value": "Due in 14 days"},
            {"label": "Medication review", "value": "Complete by next visit"},
        ],
    }

@router.get('/{report_id}/download')
def download_report(report_id: str):
    report = next((report for report in REPORTS if report['id'] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail='Report not found')

    file_path = REPORT_FILE_PATHS.get(report_id)
    if file_path and Path(file_path).exists():
        return StreamingResponse(Path(file_path).open('rb'), media_type='application/octet-stream', headers={
            'Content-Disposition': f'attachment; filename="{Path(file_path).name}"',
        })

    content = (
        f"CARE-AI Medical Report\n"
        f"Report ID: {report['id']}\n"
        f"Title: {report['title']}\n"
        f"Type: {report['type']}\n"
        f"Hospital: {report['hospital']}\n"
        f"Status: {report['status']}\n\n"
        f"Findings:\n- All measurements are within expected ranges.\n- Follow up with your care team for any questions.\n"
    )
    buffer = BytesIO(content.encode('utf-8'))
    headers = {"Content-Disposition": f"attachment; filename=careai-report-{report_id}.txt"}
    return StreamingResponse(buffer, media_type='text/plain', headers=headers)

@router.post('/upload')
def upload_report(
    file: UploadFile = File(...),
    hospital: str = Form('Primary Care Center'),
    report_type: str = Form('Uploaded Report'),
):
    report_id = str(uuid4())
    filename = file.filename
    destination = DATA_DIR / f"{report_id}-{filename}"
    with destination.open('wb') as out_file:
        out_file.write(file.file.read())

    report = {
        'id': report_id,
        'title': filename,
        'type': report_type,
        'status': 'Ready',
        'hospital': hospital,
    }
    REPORTS.append(report)
    REPORT_FILE_PATHS[report_id] = str(destination)
    return report

@router.delete('/{report_id}')
def delete_report(report_id: str):
    global REPORTS, REPORT_FILE_PATHS
    report = next((report for report in REPORTS if report['id'] == report_id), None)
    if not report:
        raise HTTPException(status_code=404, detail='Report not found')

    REPORTS = [report for report in REPORTS if report['id'] != report_id]
    file_path = REPORT_FILE_PATHS.pop(report_id, None)
    if file_path:
        try:
            Path(file_path).unlink()
        except OSError:
            pass

    return {"status": "deleted", "id": report_id}

@router.post('/explain')
def explain(payload: dict):
    return explain_report(payload.get('text', ''))

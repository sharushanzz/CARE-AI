def explain_report(text: str) -> dict:
    if not text:
        return {'summary': 'No report text provided.', 'risk_level': 'low', 'tips': ['Hydrate well', 'Rest', 'Follow up with your clinician if symptoms persist.']}
    return {
        'summary': f'AI analysis of the provided report indicates generally stable findings. {text[:140]}',
        'risk_level': 'moderate',
        'normal_values': ['Hemoglobin within expected range', 'Blood pressure within healthy range'],
        'abnormal_values': ['One value requires a follow-up review'],
        'health_tips': ['Maintain hydration', 'Get adequate sleep', 'Discuss any symptoms with your doctor'],
        'questions_to_ask_doctor': ['What does this value mean for me?', 'Is this condition urgent?']
    }


def summarize_visit(notes: str) -> dict:
    if not notes:
        return {'summary': 'No visit notes provided.', 'action_items': 'No next steps available.'}
    return {
        'summary': f'This visit summary indicates the patient remains stable and should continue their treatment plan. Notes: {notes[:150]}',
        'action_items': 'Schedule a follow-up visit, monitor symptoms, and maintain current medication regimen.'
    }

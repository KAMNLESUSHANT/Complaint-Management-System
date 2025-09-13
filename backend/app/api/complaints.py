from flask import Blueprint, request, jsonify
from app.services.complaint_service import ComplaintService

complaints_bp = Blueprint('complaints', __name__, url_prefix='/api/v1')
complaint_service = ComplaintService()

@complaints_bp.route('/complaints', methods=['POST'])
def create_complaint():
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('description'):
        return jsonify({'error': 'Title and description are required'}), 400
    
    result = complaint_service.create_complaint(data)
    
    if result['status'] == 'success':
        return jsonify(result), 201
    else:
        return jsonify(result), 400

@complaints_bp.route('/complaints', methods=['GET'])
def get_complaints():
    filters = {
        'status': request.args.get('status'),
        'category': request.args.get('category'),
        'priority': request.args.get('priority')
    }
    # Remove None values
    filters = {k: v for k, v in filters.items() if v is not None}
    
    complaints = complaint_service.get_complaints(filters)
    return jsonify({'complaints': complaints})

@complaints_bp.route('/complaints/<complaint_id>', methods=['PUT'])
def update_complaint(complaint_id):
    data = request.get_json()
    
    if 'status' in data:
        result = complaint_service.update_complaint_status(complaint_id, data['status'])
        if result['status'] == 'success':
            return jsonify(result)
        else:
            return jsonify(result), 400
    
    return jsonify({'error': 'No valid updates provided'}), 400

@complaints_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = complaint_service.get_categories()
    return jsonify({'categories': categories})

@complaints_bp.route('/priorities', methods=['GET'])
def get_priorities():
    priorities = complaint_service.get_priorities()
    return jsonify({'priorities': priorities})
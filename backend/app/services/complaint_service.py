import uuid
from datetime import datetime
from app.models.complaint import db, Complaint, ComplaintCategory, ComplaintPriority
from app.ai.classifier import SimpleKeywordClassifier, PriorityAnalyzer

class ComplaintService:
    def __init__(self):
        self.classifier = SimpleKeywordClassifier('config/categories.yaml')
        self.priority_analyzer = PriorityAnalyzer('config/priorities.yaml')
    
    def create_complaint(self, complaint_data: dict) -> dict:
        try:
            # Generate unique ID
            complaint_id = str(uuid.uuid4())
            
            # AI Classification
            classification = self.classifier.classify(
                complaint_data.get('description', '') + ' ' + complaint_data.get('title', '')
            )
            
            # Create complaint object
            complaint = Complaint(
                id=complaint_id,
                user_id=complaint_data.get('user_id', 'anonymous'),
                title=complaint_data['title'],
                description=complaint_data['description'],
                category_id=classification.get('category', 'general'),
                priority_id=classification.get('priority', 'low'),
                status='open',
                custom_data={'ai_classified': True, 'confidence': classification.get('confidence', 0.0)}  # Fixed: changed from metadata to custom_data
            )
            
            db.session.add(complaint)
            db.session.commit()
            
            return {'status': 'success', 'complaint': complaint.to_dict()}
        
        except Exception as e:
            db.session.rollback()
            return {'status': 'error', 'message': str(e)}
    
    def get_complaints(self, filters: dict = None) -> list:
        try:
            query = Complaint.query
            
            if filters:
                if filters.get('status'):
                    query = query.filter(Complaint.status == filters['status'])
                if filters.get('category'):
                    query = query.filter(Complaint.category_id == filters['category'])
                if filters.get('priority'):
                    query = query.filter(Complaint.priority_id == filters['priority'])
            
            complaints = query.order_by(Complaint.created_at.desc()).all()
            return [complaint.to_dict() for complaint in complaints]
        
        except Exception as e:
            print(f"Error in get_complaints: {str(e)}")
            return []
    
    def update_complaint_status(self, complaint_id: str, status: str) -> dict:
        try:
            complaint = Complaint.query.get(complaint_id)
            if not complaint:
                return {'status': 'error', 'message': 'Complaint not found'}
            
            complaint.status = status
            complaint.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {'status': 'success', 'complaint': complaint.to_dict()}
        
        except Exception as e:
            db.session.rollback()
            return {'status': 'error', 'message': str(e)}
    
    def get_categories(self) -> list:
        try:
            categories = ComplaintCategory.query.filter_by(is_active=True).all()
            return [{'id': c.id, 'name': c.name} for c in categories]
        except Exception as e:
            print(f"Error getting categories: {str(e)}")
            return []
    
    def get_priorities(self) -> list:
        try:
            priorities = ComplaintPriority.query.order_by(ComplaintPriority.order_index).all()
            return [{'id': p.id, 'name': p.name, 'color': p.color_code} for p in priorities]
        except Exception as e:
            print(f"Error getting priorities: {str(e)}")
            return []
    def delete_complaint(self, complaint_id: str) -> dict:
        try:
            complaint = Complaint.query.get(complaint_id)
            if not complaint:
                return {'status': 'error', 'message': 'Complaint not found'}
            
            db.session.delete(complaint)
            db.session.commit()
            
            return {'status': 'success', 'message': 'Complaint deleted successfully'}
        
        except Exception as e:
            db.session.rollback()
            return {'status': 'error', 'message': str(e)}
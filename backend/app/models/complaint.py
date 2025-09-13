from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
import jsonify

db = SQLAlchemy()

class ComplaintCategory(db.Model):
    __tablename__ = 'complaint_categories'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    keywords = db.Column(db.JSON)
    department_id = db.Column(db.String(50))
    default_priority = db.Column(db.String(20))
    is_active = db.Column(db.Boolean, default=True)

class ComplaintPriority(db.Model):
    __tablename__ = 'complaint_priorities'
    
    id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    sla_hours = db.Column(db.Integer)
    color_code = db.Column(db.String(7))
    order_index = db.Column(db.Integer)

class Complaint(db.Model):
    __tablename__ = 'complaints'
    
    id = db.Column(db.String(36), primary_key=True)
    user_id = db.Column(db.String(36))
    title = db.Column(db.String(200))
    description = db.Column(db.Text)
    category_id = db.Column(db.String(50))
    priority_id = db.Column(db.String(20))
    custom_data = db.Column(db.JSON)
    status = db.Column(db.String(20), default='open')
    assigned_to = db.Column(db.String(36))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        
        safe_metadata = {}
        if self.custom_data:
            try:
                if isinstance(self.custom_data, dict):
                    safe_metadata = self.custom_data
                else:
                    safe_metadata = {}
            except:
                safe_metadata = {}
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'description': self.description,
            'category_id': self.category_id,
            'priority_id': self.priority_id,
            'status': self.status,
            'assigned_to': self.assigned_to,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'metadata': safe_metadata
        }
from flask import Flask
from flask_cors import CORS
from app.models.complaint import db, ComplaintCategory, ComplaintPriority
from app.api.complaints import complaints_bp
from app.config.config import Config, load_yaml_config
import yaml

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Load configuration
    config = Config.load_from_env()
    app.config['SQLALCHEMY_DATABASE_URI'] = config.DATABASE_URL
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(complaints_bp)
    
    with app.app_context():
        db.create_all()
        initialize_data()
    
    return app

def initialize_data():
    """Initialize categories and priorities from YAML files"""
    # Load categories
    if ComplaintCategory.query.count() == 0:
        with open('config/categories.yaml', 'r') as f:
            categories_data = yaml.safe_load(f)
        
        for cat_data in categories_data['categories']:
            category = ComplaintCategory(
                id=cat_data['id'],
                name=cat_data['name'],
                keywords=cat_data['keywords'],
                department_id=cat_data['department'],
                default_priority=cat_data['auto_priority']
            )
            db.session.add(category)
    
    # Load priorities
    if ComplaintPriority.query.count() == 0:
        with open('config/priorities.yaml', 'r') as f:
            priorities_data = yaml.safe_load(f)
        
        for i, pri_data in enumerate(priorities_data['priorities']):
            priority = ComplaintPriority(
                id=pri_data['id'],
                name=pri_data['name'],
                sla_hours=pri_data['sla_hours'],
                color_code=pri_data['color'],
                order_index=i
            )
            db.session.add(priority)
    
    db.session.commit()

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
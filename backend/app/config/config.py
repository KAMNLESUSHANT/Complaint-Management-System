import os
import yaml
from dataclasses import dataclass

@dataclass
class Config:
    DATABASE_URL: str
    AI_CLASSIFIER_TYPE: str
    ENABLE_AI_CLASSIFICATION: bool
    ENABLE_AUTO_ASSIGNMENT: bool
    
    @classmethod
    def load_from_env(cls):
        return cls(
            DATABASE_URL=os.getenv('DATABASE_URL', 'sqlite:///complaints.db'),
            AI_CLASSIFIER_TYPE=os.getenv('AI_CLASSIFIER', 'keyword'),
            ENABLE_AI_CLASSIFICATION=os.getenv('ENABLE_AI_CLASSIFICATION', 'true').lower() == 'true',
            ENABLE_AUTO_ASSIGNMENT=os.getenv('ENABLE_AUTO_ASSIGNMENT', 'true').lower() == 'true'
        )

def load_yaml_config(file_path: str):
    with open(file_path, 'r') as f:
        return yaml.safe_load(f)
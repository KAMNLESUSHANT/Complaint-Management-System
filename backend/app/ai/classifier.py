import yaml
import re
from typing import Dict, List

class SimpleKeywordClassifier:
    def __init__(self, categories_path: str):
        with open(categories_path, 'r') as f:
            data = yaml.safe_load(f)
        self.categories = data['categories']
    
    def classify(self, text: str) -> Dict:
        text_lower = text.lower()
        best_category = None
        max_matches = 0
        
        for category in self.categories:
            matches = 0
            for keyword in category['keywords']:
                if keyword.lower() in text_lower:
                    matches += 1
            
            if matches > max_matches:
                max_matches = matches
                best_category = category
        
        if best_category:
            return {
                'category': best_category['id'],
                'priority': best_category['auto_priority'],
                'confidence': min(max_matches / len(best_category['keywords']), 1.0)
            }
        
        return {
            'category': 'general',
            'priority': 'low',
            'confidence': 0.0
        }

class PriorityAnalyzer:
    def __init__(self, priorities_path: str):
        with open(priorities_path, 'r') as f:
            data = yaml.safe_load(f)
        self.priorities = {p['id']: p for p in data['priorities']}
    
    def analyze_priority(self, text: str, category: str) -> str:
        text_lower = text.lower()
        urgent_keywords = ['urgent', 'emergency', 'critical', 'immediate', 'danger']
        
        if any(keyword in text_lower for keyword in urgent_keywords):
            return 'high'
        
        return 'medium'  # Default fallback
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import bcrypt
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Database configuration for Supabase using pg8000
# Use postgresql+pg8000:// instead of postgresql://
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql+pg8000://postgres:password@localhost:5432/postgres')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True,
}
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'skillbridge-secret-key')

db = SQLAlchemy(app)

# CORS configuration
CORS(app, origins=[
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-frontend.onrender.com'
])

# ============ MODELS ============

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    target_role = db.Column(db.String(100))
    experience_level = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'targetRole': self.target_role or '',
            'experienceLevel': self.experience_level or ''
        }

class Skill(db.Model):
    __tablename__ = 'skills'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category
        }

class AssessmentQuestion(db.Model):
    __tablename__ = 'assessment_questions'
    id = db.Column(db.Integer, primary_key=True)
    skill = db.Column(db.String(100), nullable=False)
    question = db.Column(db.String(1000), nullable=False)
    options = db.Column(db.JSON, nullable=False)
    correct_index = db.Column(db.Integer, nullable=False)
    topic = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'skill': self.skill,
            'question': self.question,
            'options': self.options,
            'topic': self.topic
        }

class AssessmentResult(db.Model):
    __tablename__ = 'assessment_results'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    skill = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer)
    total = db.Column(db.Integer)
    readiness = db.Column(db.Integer)
    level = db.Column(db.String(50))
    weak_areas = db.Column(db.String(500))
    assessed_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'skill': self.skill,
            'score': self.score,
            'total': self.total,
            'readiness': self.readiness,
            'level': self.level,
            'weakAreas': self.weak_areas,
            'assessedAt': self.assessed_at.isoformat() if self.assessed_at else None
        }

# ============ ROUTES ============

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'message': 'SkillBridge backend is running'})

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    if not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Name, email and password are required'}), 400
    
    existing = User.query.filter_by(email=data['email']).first()
    if existing:
        return jsonify({'message': 'Email already registered'}), 400
    
    hashed = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
    
    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed.decode('utf-8')
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify(user.to_dict()), 200

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    
    if not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Email and password are required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401
    
    if not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    return jsonify(user.to_dict()), 200

@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.all()
    return jsonify([skill.to_dict() for skill in skills])

@app.route('/api/skills', methods=['POST'])
def create_skill():
    data = request.json
    
    if not data.get('name') or not data.get('category'):
        return jsonify({'message': 'Name and category are required'}), 400
    
    skill = Skill(name=data['name'], category=data['category'])
    db.session.add(skill)
    db.session.commit()
    
    return jsonify(skill.to_dict()), 201

@app.route('/api/assessments/<skill>', methods=['GET'])
def get_questions(skill):
    questions = AssessmentQuestion.query.filter_by(skill=skill).all()
    return jsonify([q.to_dict() for q in questions])

@app.route('/api/assessments/submit', methods=['POST'])
def submit_assessment():
    data = request.json
    user_id = data.get('userId')
    skill = data.get('skill')
    answers = data.get('answers', {})
    
    questions = AssessmentQuestion.query.filter_by(skill=skill).all()
    
    score = 0
    weak_areas = []
    
    for q in questions:
        answer = answers.get(str(q.id))
        if answer is not None and answer == q.correct_index:
            score += 1
        else:
            if q.topic not in weak_areas:
                weak_areas.append(q.topic)
    
    total = len(questions)
    readiness = int(round(score * 100.0 / total)) if total > 0 else 0
    
    if readiness >= 80:
        level = 'Advanced'
    elif readiness >= 40:
        level = 'Intermediate'
    else:
        level = 'Beginner'
    
    result = AssessmentResult(
        user_id=user_id,
        skill=skill,
        score=score,
        total=total,
        readiness=readiness,
        level=level,
        weak_areas=', '.join(weak_areas)
    )
    
    db.session.add(result)
    db.session.commit()
    
    return jsonify(result.to_dict()), 200

@app.route('/api/assessments/latest', methods=['GET'])
def get_latest_assessment():
    user_id = request.args.get('userId', type=int)
    skill = request.args.get('skill')
    
    if not user_id or not skill:
        return jsonify({'message': 'userId and skill are required'}), 400
    
    result = AssessmentResult.query.filter_by(
        user_id=user_id,
        skill=skill
    ).order_by(AssessmentResult.assessed_at.desc()).first()
    
    return jsonify(result.to_dict() if result else None), 200

@app.route('/api/assessments/history/<int:user_id>', methods=['GET'])
def get_history(user_id):
    results = AssessmentResult.query.filter_by(user_id=user_id)\
        .order_by(AssessmentResult.assessed_at.desc()).all()
    return jsonify([r.to_dict() for r in results]), 200

@app.route('/api/roadmaps', methods=['GET'])
def get_roadmap():
    role = request.args.get('role', 'Java Full Stack Developer')
    
    roadmaps = {
        "Java Full Stack Developer": {
            "Java": ["Syntax & Data Types", "OOP", "Collections", "Exception Handling", "Java 8+", "Multithreading"],
            "Spring Boot": ["Project Structure", "REST Controllers", "Service Layer", "JPA & Hibernate", "Validation", "Spring Security"],
            "React": ["Components", "Props & State", "Hooks", "Routing", "Forms", "API Integration"],
            "SQL": ["SELECT & WHERE", "Joins", "Grouping", "Subqueries", "Indexes", "Transactions"],
            "Docker": ["Images & Containers", "Basic Commands", "Dockerfile", "Volumes", "Networking", "Docker Compose"],
            "AWS": ["EC2", "S3", "IAM", "Regions & Availability", "Lambda", "Deployment Basics"],
            "System Design": ["Scaling", "Load Balancing", "Caching", "Replication", "High Availability", "API Design"]
        },
        "Frontend Developer": {
            "HTML": ["Semantic HTML", "Forms", "Tables", "Accessibility", "SEO Basics"],
            "CSS": ["Selectors", "Box Model", "Flexbox", "Grid", "Responsive Design", "Animations"],
            "JavaScript": ["ES6+", "Functions", "DOM", "Async JavaScript", "Promises", "Fetch & APIs"],
            "React": ["Components", "Props & State", "Hooks", "Routing", "Forms", "Performance"],
            "TypeScript": ["Types", "Interfaces", "Generics", "Utility Types", "React with TypeScript"]
        },
        "Backend Developer": {
            "Java": ["Syntax", "OOP", "Collections", "Exceptions", "Java 8+"],
            "Spring Boot": ["REST APIs", "Dependency Injection", "JPA & Hibernate", "Validation", "Security"],
            "REST APIs": ["HTTP Methods", "Status Codes", "Request/Response", "Validation", "Error Handling"],
            "SQL": ["Queries", "Joins", "Grouping", "Transactions", "Indexes"],
            "Docker": ["Images", "Containers", "Dockerfile", "Compose", "Networking"]
        },
        "Python Developer": {
            "Python": ["Syntax", "Functions", "OOP", "Modules", "Exceptions", "Testing"],
            "Django/Flask": ["Routing", "Views", "Templates", "REST APIs", "Authentication"],
            "SQL": ["Queries", "Joins", "Grouping", "Subqueries", "Indexes"],
            "REST APIs": ["HTTP", "Endpoints", "JSON", "Validation", "Error Handling"],
            "Docker": ["Images", "Dockerfile", "Compose", "Volumes"]
        },
        "Data Analyst": {
            "SQL": ["SELECT", "Joins", "Grouping", "Subqueries", "Window Functions", "Indexes"],
            "Excel": ["Formulas", "Lookup Functions", "Pivot Tables", "Cleaning", "Charts"],
            "Python": ["Variables", "Functions", "Lists", "Pandas", "Data Cleaning"],
            "Pandas": ["Series & DataFrame", "Filtering", "GroupBy", "Merge", "Missing Data"],
            "Power BI": ["Data Import", "Data Model", "DAX Basics", "Visuals", "Dashboards"]
        }
    }
    
    return jsonify(roadmaps.get(role, roadmaps["Java Full Stack Developer"])), 200

@app.route('/api/progress/<int:user_id>', methods=['GET'])
def get_progress(user_id):
    results = AssessmentResult.query.filter_by(user_id=user_id)\
        .order_by(AssessmentResult.assessed_at.desc()).all()
    
    progress_data = {}
    for r in results:
        if r.skill not in progress_data:
            progress_data[r.skill] = {
                'skill': r.skill,
                'latestReadiness': r.readiness,
                'latestLevel': r.level,
                'attempts': 0,
                'history': []
            }
        progress_data[r.skill]['attempts'] += 1
        progress_data[r.skill]['history'].append({
            'readiness': r.readiness,
            'level': r.level,
            'date': r.assessed_at.isoformat() if r.assessed_at else None
        })
    
    return jsonify(list(progress_data.values())), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=8080)

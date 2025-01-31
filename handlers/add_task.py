from flask import request, jsonify
from datetime import datetime
from models.task import db
from models.task import Task
from flask import Blueprint
import app

task_bp = Blueprint('task_bp', __name__)

@task_bp.route('/add_task', methods=['POST'])
def add_task():
    data = request.json

    if not data or 'description' not in data or 'deadline' not in data:
        return jsonify({"error": "Invalid input"}), 400
    
    deadline = datetime.strptime(data['deadline'], '%Y-%m-%d %H:%M:%S') 
    new_task = Task(
        description=data['description'],
        deadline=deadline,
        status="Pending"
    )

    db.session.add(new_task)
    db.session.commit()

    return jsonify({"message": "Task added successfully", "task_id": new_task.task_id}), 201

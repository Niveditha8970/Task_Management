from flask import request, jsonify
from datetime import datetime
from models.task import db
from models.task import Task
from flask import Blueprint
import app

update = Blueprint('update', __name__)

@update.route('/updatetask', methods=['POST'])

def update_task():
    data = request.json
    print("update json",data)
    task_id = data.get('task_id')
    task_update_obj = Task.query.get(task_id)
    if not task_update_obj:
        return jsonify("Task is not present")
    else:
        task_update_obj.status = data.get('status')
        task_update_obj.description = data.get('description')
        task_update_obj.deadline = datetime.strptime(data['deadline'], '%Y-%m-%d %H:%M:%S')
        db.session.add(task_update_obj)
        db.session.commit()  

    return jsonify({"message": "Updated Task successfully", "task_id": task_update_obj.task_id}), 201

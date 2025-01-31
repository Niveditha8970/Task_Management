from flask import request, jsonify
from datetime import datetime
from models.task import db
from models.task import Task
from flask import Blueprint
import app

pending = Blueprint('pending', __name__)

@pending.route('/pendingtask', methods=['GET'])

def view_pending_task():
    tasks = Task.query.all()

    pending_tasks=[{"task_id":task.task_id,"status":task.status, "description":task.description, "deadline":task.deadline} 
                   for task in tasks if task.status=="Pending"]

    # return jsonify({"Pending data":pending_tasks})
    return pending_tasks

completed = Blueprint('completed', __name__)

@completed.route('/completedtask', methods=['GET'])

def view_completed_task():
    tasks = Task.query.all()
    complete_tasks=[{"task_id":task.task_id,"status":task.status, "description":task.description, "deadline":task.deadline} 
                     for task in tasks if task.status=="Completed"]

    return complete_tasks


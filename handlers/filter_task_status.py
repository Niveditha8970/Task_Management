from flask import request, jsonify
from datetime import datetime
from models.task import db
from models.task import Task
from flask import Blueprint
import app

filter_status = Blueprint('filter_status', __name__)

@filter_status.route('/filterstatus', methods=['GET'])

#Filtering out pending tasks
def status_filter_task():
    # tasks = Task.query.all()
    tasks = Task.query.filter_by(status = "Pending").order_by(Task.deadline.asc()).all()

    filter_pending_status=[{"task_id":task.task_id,"status":task.status, "description":task.description, "deadline":task.deadline} 
                  for task in tasks ]


    return jsonify({"pending_tasks": filter_pending_status })

    
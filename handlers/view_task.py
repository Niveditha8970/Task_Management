from flask import request, jsonify
from datetime import datetime
from models.task import db
from models.task import Task
from flask import Blueprint
import app

gettask = Blueprint('gettask', __name__)

@gettask.route('/gettask', methods=['GET'])
def view_task():
    tasks = Task.query.all()
    task_list = [{"task_id":task.task_id, "description":task.description, "status":task.status, "deadline":task.deadline} for task in tasks]
    return task_list
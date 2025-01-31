from flask import Blueprint, request, jsonify
from models.task import db, Task

deletetask = Blueprint('deletetask', __name__)

@deletetask.route('/deletetask/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):  # Accept task_id as a function parameter
    task_update_obj = Task.query.get(task_id)

    if not task_update_obj:
        return jsonify({"message": "Task not found"}), 404

    db.session.delete(task_update_obj)
    db.session.commit()

    return jsonify({"message": "Deleted Task successfully", "task_id": task_id}), 200

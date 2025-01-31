from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_migrate import Migrate


app = Flask(__name__)

# SQLite Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Task Model
class Task(db.Model):
    task_id = db.Column(db.Integer(), primary_key=True, autoincrement=True, nullable=True)
    description = db.Column(db.String(200), nullable=False)
    deadline = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(20), default="Pending")  # "Pending" or "Completed"

    def __repr__(self):
        return self.task_id

# Create Database
with app.app_context():
    db.create_all()

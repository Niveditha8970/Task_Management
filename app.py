from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from models.task import db
from handlers.add_task import task_bp
from handlers.update_task import update
from handlers.view_task import gettask
from handlers.view_pending_task import pending,completed
from handlers.delete_task import deletetask
from handlers.filter_task_status import filter_status
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize the database
db.init_app(app)
migrate = Migrate(app, db)

# Register Blueprint with a single URL prefix
app.register_blueprint(task_bp, url_prefix='/task')
app.register_blueprint(update, url_prefix='/update')
app.register_blueprint(gettask, url_prefix='/viewtask')
app.register_blueprint(pending, url_prefix='/pendingtask')
app.register_blueprint(completed, url_prefix='/completedtask')
app.register_blueprint(deletetask, url_prefix='/deletetask')
app.register_blueprint(filter_status, url_prefix='/filterstatus')

if __name__ == '__main__':
    app.run(debug=True)
    

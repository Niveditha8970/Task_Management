# project-management-tool-backend


# Requirements

    python 3.11


# Run

run

    flask run                           

## Note

To perform migrations use the appropiate commands to perform migrations

    flask db init              
    flask db migrate  -m "migration message"
    flask db upgrade 
    flask db downgrade

# To connect with UI or before API Intergration use CORS in app.py file
 
 pip install Flask-Cors
 CORS(app)

## Database Used SQLit

flask shell

In shell we can view all the columns and data as well by using below commands

      print(Task.query.all())
      print(Task.__table__.columns.keys())
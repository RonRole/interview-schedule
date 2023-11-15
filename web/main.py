from flask import Flask, session, request, send_from_directory
from datetime import timedelta
import os
import functions
import database

db = database.DataBase(
    host=os.environ["DB_HOST"],
    port=int(os.environ["DB_PORT"]),
    user=os.environ["DB_USER"],
    password=os.environ["DB_PASSWORD"],
    db=os.environ["DB_NAME"]
)

interview_type_functions = functions.InterviewTypeFunctions(db)
interview_style_functions = functions.InterviewStyleFunctions(db)
interview_plan_functions = functions.InterviewPlanFunctions(db)

app = Flask(__name__)
app.secret_key = os.environ["APP_SECRET_KEY"]
app.json.ensure_ascii = False

app.logger.debug('DEBUG')
app.logger.info('INFO')
app.logger.warning('WARNING')
app.logger.error('ERROR')
app.logger.critical('CRITICAL')

@app.route("/")
def index():
    return send_from_directory('static', 'index.html')

@app.route("/session", methods=["GET"])
def current_session():
    if "user" in session:
        return f"<p>{session['user']}</p>"
    else:
        return "<p>no session</p>"
    
@app.route("/session", methods=["POST"])
def create_session():
    session["user"] = request.json["user"]
    return {
        "status" : 200
    }

@app.route("/session", methods=["DELETE"])
def delete_session():
    if "user" not in session:
        return {"status" : 401}
    del session["user"]
    return {
        "status" : 200
    }

@app.route("/address", methods=["GET"])
def current_user_address():
    if "user" not in session:
        return {"status" : 401}
    res = db.select("SELECT name, family_id, address FROM Addresses Where name = %s", session["user"])
    return {
        "status" : 200,
        "data" : res
    }

@app.route("/address", methods=["POST"])
def create_user_address():
    if "user" not in session:
        return {"status" : 401}
    db.execute(
        "INSERT INTO Addresses (name, family_id, address) VALUES (%s, %s, %s)",
        session["user"],
        request.json["family_id"],
        request.json["address"]
    )
    return {"status" : 200}

@app.route("/interview/types", methods=["GET"])
def list_interview_types():
    data = interview_type_functions.list_interview_types()
    return {
        "status" : 200,
        "data" : data
    }

@app.route("/interview/styles", methods=["GET"])
def list_interview_styles():
    data = interview_style_functions.list_interview_styles()
    return {
        "status" : 200,
        "data" : data
    }
@app.route("/interview/plans", methods=["GET"])
def list_interview_plans():
    data = interview_plan_functions.list_interview_plans()
    return {
        "status" : 200,
        "data" : data
    }

@app.route("/interview/plans", methods=["POST"])
def create_interview_plan():
    interview_plan_functions.create_interview_plan(**request.json)
    return {"status" : 200}


if __name__ == '__main__':
    app.run()
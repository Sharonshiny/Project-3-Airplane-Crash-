import os
import datetime
import pandas as pd
import numpy as np
import json
from flask import Flask
from flask import Flask, request, render_template
from flask import Flask, jsonify, render_template
from flask_pymongo import PyMongo
from bson.son import SON

#################################################
# Database Setup
#################################################
app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/crashes"
mongo = PyMongo(app)

@app.route("/")
def index():
   """Return the home
   
   page."""
   return render_template("index.html")

@app.route('/Operator_name', methods=['GET'])
def getOperators():
   crash_table = mongo.db.crash_details
   operators=[]
   for op in crash_table.find().distinct('Operator'):    
      operators.append(op)   
   return jsonify(operators)

@app.route("/metadata/<Operator>", methods=['GET'])
def airlinedata(Operator):
    """Return the MetaData for a given sample."""
    crash_db = mongo.db.crash_details
    airlinedata = []
    # convert year str to int
    # select 1 crash data for year and exclude _id column
    for data in crash_db.find({"Operator": Operator}, 
       {
       "_id": 0, 
       "Time": 1,
       "year": 1, 
       "Location": 1,
       "Flight": 1,
       "Route": 1,
       "Type": 1,
       "Aboard": 1,
       "Fatalties": 1
       }):
      airlinedata.append(data)
    print(airlinedata)
    return jsonify(results = airlinedata)

@app.route("/crashCount/<Operator>", methods=['GET'])
def crashCount(Operator):
    """Return the crash count by Operator"""
    # sample_metadata = {}
    crash_db = mongo.db.crash_details
    crashdata = []
 
    for test in crash_db.find({"Operator": Operator}, {'_id':0, 'year': 1, "Fatalities": 1,}):
      crashdata.append(test)
   
    print(crashdata)
    return jsonify(crashdata)

@app.route("/crashByMonth", methods=['GET'])
def crashByMonth():
   """Returns crashes by month"""
   crash_db = mongo.db.crash_details
   crashdata = []

   for data in crash_db.aggregate([
      {
         "$group" : {
            "_id" : {"$month":"$idate"},
            "sum" : {"$sum": 1}
         }
      },
         { "$sort": { "_id":1}}
      ]):
      crashdata.append(data)
   print(crashdata)
   return jsonify(crashdata)

if __name__ == "__main__":
   
   app.run()
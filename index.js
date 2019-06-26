//dependencies required for the app
//Make an express app
//Post/create an item in the list
//Get the the todolist from the Database
//Delete an item
//Update the an item
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCyB_ojxtN3pQYFSta3zfjNwPNu3C7nksg",
  authDomain: "wip1-ff4fb.firebaseapp.com",
  databaseURL: "https://wip1-ff4fb.firebaseio.com",
  projectId: "wip1-ff4fb",
  storageBucket: "wip1-ff4fb.appspot.com",
  messagingSenderId: "526939968691",
  appId: "1:526939968691:web:80b3e9c6cee74262"
};
var id = 
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();
var docRef = firestore.collection("toDoList").doc("Item");
var docRef2 = firestore.collection("toDoList").doc("ComItem");


var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//render css files
app.use(express.static("public"));

//placeholders for added task
var task = [];
//placeholders for removed task
var complete = [];


//post route for adding new task 
app.post("/addtask", function(req, res) {
    var newTask = req.body.newtask;
    docRef.set({
			toDoList: newTask
		})
    task.push(newTask);
    res.redirect("/");
});

app.post("/removetask", function(req, res) {
    var completeTask = req.body.check;
    //check for the "typeof" the different completed task, then add into the complete task
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        docRef2.set({
          toDoList: completeTask
        })
        docRef.delete();
        //check if the completed task already exits in the task when checked, then remove it
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
             docRef2.set({
                toDoList: completeTask
              })
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});

//render the ejs and display added task, completed task
app.get("/", function(req, res) {
    res.render("index", { task: task, complete: complete });
});

//set app to listen on port 3000
app.listen(3000, function() {
    console.log("server is running on port 3000");
});
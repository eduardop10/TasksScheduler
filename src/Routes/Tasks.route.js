const express = require("express")
const router = express.Router()
const TasksController = require("../Controllers/Tasks.controller")

router.get("/list",TasksController.listTask)

router.post("/create",TasksController.createTask)

router.put("/update",TasksController.updateTask)

router.delete("/delete",TasksController.deleteTask)

module.exports= router


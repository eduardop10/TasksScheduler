const createError= require('http-errors')
const mysql= require('../helpers/init_mysql').connection
const JWT = require('jsonwebtoken')

const {
    signAcessToken, 
    signRefreshToken,
    verifyAccessToken
} = require("../helpers/jwt_helper")

module.exports={
    listTask:async (req,res,next)=>{
        try {
          const getManagerId = await new Promise((resolve, reject) => {
            mysql.query("select * from users WHERE type='M';", function(err, res, fields) {
              if (err) return reject(err);
              resolve(res);
            });
          });
        ManagersIdList= getManagerId.map(manager => {return manager.id})
        const authHeader = req.headers['authorization']
        const bearerToken = authHeader.split(' ')
        const token = bearerToken[1]
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const userId= decoded.aud
        let permissionsQuery = 'SELECT * FROM tasks WHERE user_id = ?';
        if (ManagersIdList.includes(parseInt(userId))){
          permissionsQuery = 'SELECT users.email, tasks.* FROM users INNER JOIN tasks ON users.id = tasks.user_id;';
        }
            const result = await new Promise((resolve, reject) => {
                mysql.query(permissionsQuery, userId, function(err, res, fields) {
                  if (err) return reject(err);
                  resolve(res);
                });
              });
              res.send(result)
        } catch (error) {
            next(error)
        }
    },
    createTask: async(req,res,next)=>{
        try {
            const {summary} = req.body;
            const authHeader = req.headers['authorization']
            const bearerToken = authHeader.split(' ')
            const token = bearerToken[1]
            const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)
            
            const taskAddQuery = 'INSERT INTO tasks (user_id, task_date,summary) VALUES (?,?,?)'
            const taskValues= [decoded.aud,new Date().toISOString().slice(0, 10), summary]
            const result = await new Promise((resolve, reject) => {
                    mysql.query(taskAddQuery, taskValues, function(err, res, fields) {
                      if (err) return reject(err);
                      resolve(res);
                    });
                  });
                taskId= result.insertId.toString()
                console.log(`The Technician with user id ${taskValues[0]} performed the task: ${summary}, on date ${taskValues[1]}`);
                res.status(200).send({task_id: taskId, summary: summary})
            } catch (error) {
                next(error)
            }
    },
    
    updateTask: async(req,res,next)=>{
        try {
            const {id, summary} = req.body;
            const authHeader = req.headers['authorization']
            const bearerToken = authHeader.split(' ')
            const token = bearerToken[1]
            const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const taskVerifyUserIdQuery = 'SELECT task_id FROM tasks WHERE user_id=? AND task_id=?'
            const taskAtributes= [decoded.aud, id]
            const listTasksOfUserId = await new Promise((resolve, reject) => {
                mysql.query(taskVerifyUserIdQuery, taskAtributes, function(err, res, fields) {
                  if (err) return reject(err);
                  resolve(res);
                });
                
              });
            if(listTasksOfUserId[0]){
            const taskAddQuery = 'UPDATE tasks SET summary=? WHERE task_id=?'
            const taskValues= [summary, id]
            const result = await new Promise((resolve, reject) => {
                    mysql.query(taskAddQuery, taskValues, function(err, res, fields) {
                      if (err) return reject(err);
                      resolve(res);
                    });
                  });
        
                  res.status(200).send({result: "updated with sucess"})
                }else{
                    throw createError.NotFound('Invalid Task Id');
                }
            } catch (error) {
                next(error)
            }
    },
    
    deleteTask: async(req,res,next)=>{
        try {
            const {id} = req.body;
            const authHeader = req.headers['authorization']
            const bearerToken = authHeader.split(' ')
            const token = bearerToken[1]
            const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET)
            const taskVerifyUserIdQuery = 'SELECT task_id FROM tasks WHERE user_id=? AND task_id=?'
            const taskAtributes= [decoded.aud, id]
            const result = await new Promise((resolve, reject) => {
                mysql.query(taskVerifyUserIdQuery, taskAtributes, function(err, res, fields) {
                  if (err) return reject(err);
                  resolve(res);
                });
                
              });
            if(result[0]){
            const taskAddQuery = 'DELETE FROM tasks WHERE task_id=?'
            const taskValues= [id]
            const result = await new Promise((resolve, reject) => {
                    mysql.query(taskAddQuery, taskValues, function(err, res, fields) {
                      if (err) return reject(err);
                      resolve(res);
                    });
                  });
                }else{
                    throw createError.NotFound('Invalid Task Id');
                }
                res.sendStatus(204)
            } catch (error) {
                next(error)
            }
    }
}
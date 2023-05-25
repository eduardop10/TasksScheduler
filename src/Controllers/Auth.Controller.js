const createError= require('http-errors')
const bcrypt = require('bcrypt');
const {authSchema} = require('../helpers/validation_schema')
const {signAcessToken} = require("../helpers/jwt_helper")
const mysql= require('../helpers/init_mysql').connection

module.exports= {
    register: async(req,res,next) =>{
        try {
            const { email, password } = req.body;
            const result = await authSchema.validateAsync(req.body);
            const doesExistQuery = 'SELECT * FROM users WHERE email = ?';
            const doesExistParams = [result.email];
            const doesExistRows = await new Promise((resolve, reject) => {
                mysql.query(doesExistQuery, doesExistParams, function(err, res, fields) {
                  if (err) return reject(err);
                  resolve(res);
                });
              });
    
            if (doesExistRows.length) {
                throw createError.Conflict(`${result.email} is already registered`);
            }
    
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            const insertQuery = 'INSERT INTO users (type, email, pass) VALUES (?,?,?)';
            const insertParams = ['T', email, hashedPassword];
            const insertResult = await new Promise((resolve, reject) => {
                mysql.query(insertQuery, insertParams, function(err, result, fields) {
                  if (err) return reject(err);
                  resolve(result);
                });
              });
    
            const userId = insertResult.insertId;
            const accessToken= await signAcessToken(String(userId),insertParams[0])
    
            res.send({ accessToken });
        } catch (error) {
            if (error.isJoi === true) {
                error.status = 422;
            }
            next(error);
        }
    },
    login: async(req,res,next) =>{
        try {
            const { email, password } = req.body;
            //const result = await authSchema.validateAsync(req.body);
            const userQuery = 'SELECT * FROM users WHERE email = ? LIMIT 1';
            const user = await new Promise((resolve, reject) => {
                mysql.query(userQuery, email, function(err, res, fields) {
                  if (err) return reject(err);
                  resolve(res);
                });
              });
            
            if (!user) {
              throw createError.NotFound('User not registered');
            }
        
            const isMatch = await bcrypt.compare(password, user[0].pass);
            if (!isMatch) {
              throw createError.Unauthorized('Username/password not valid');
            }
        
            const accessToken = await signAcessToken(String(user[0].id));
        
            res.send({ accessToken });
          } catch (error) {
            if (error.isJoi === true) {
              return next(createError.BadRequest('Invalid Username/Password'));
            }
            next(error);
          }
    },
}
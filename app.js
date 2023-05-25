const express= require("express")
const morgan = require("morgan")
const createError = require("http-errors")
require("dotenv").config()

const AuthRoute= require('./src/Routes/Auth.route')
const TasksRoute= require('./src/Routes/Tasks.route')
const {verifyAccessToken} = require('./src/helpers/jwt_helper')
const bcrypt= require('bcrypt')
const app= express()
app.disable('x-powered-by');
//app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//const mysql= require('./helpers/init_mysql').connection
/* createpass = async()=>{
const saltRounds = 10;
const hashedPassword = await bcrypt.hash("manager", saltRounds);
console.log(hashedPassword)
}
createpass()
 */

app.get('/',verifyAccessToken, async(req,res, next) =>{
    res.send("Hello from express.")
})

app.use("/api/auth",AuthRoute)
app.use("/api/tasks",verifyAccessToken,TasksRoute)
app.use(async(req,res,next) =>{
   /*  const error = new Error("Not found")
    error.status = 404
    next(error) */
    next(createError.NotFound('This route does not exist'))
})

app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,   
        }
    })
})
const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log(`Server runinng on port ${PORT}`)
})
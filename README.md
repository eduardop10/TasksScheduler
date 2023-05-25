# Tasks Manager API
API developed to schedule Tasks and users management Developed Using Node.js, MySQL, with an Authentication system through JWT (JSON Web Token)

For run build the dockerfile and he will expose the mysql port (3306) and the application port (3000)

## Build dockerfile
````
docker build -t backend_challenge . 
````

## Run  Docker Image
````
docker run -p 3306:3306 -p 3000:3000 backend_challenge
````

## Run tests
get CONTAINER ID and run the tests with npm test inside the bash of docker image

## Tasks-Service
### Routes for user management, all registered users are Technician, Managers is created in the start of database:

 - POST /api/auth/register
 ````
{
    "email": "email@email.com",
    "password": "password"
}
````
 - POST /api/auth/login
  ````
{
    "email": "email@email.com",
    "password": "password"
}
````
 ### Routes for user management, all registered users are Technician, Managers is created in the start of database:
 - GET /api/tasks/list
 - POST /api/tasks/create
````
{
    "summary":"task description"
}
````
 - PUT /api/tasks/update
 ````
{
    "id":"id of task",
    "summary":"task description"
}
````
 - DELETE /api/tasks/delete
 ````
 {
    "id":"id of task"
}
````

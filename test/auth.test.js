const axios = require('axios');
const generateData= require('./generate')

//acess token for tasks route seted on authentication
let tokenTechnician = ''
let tokenManager = ''

//set aleatory email and passwords for authentication test
userData= generateData.generateAleatoryEmailAndPassword(12)

//id for test tasks crud route
let taskId= ''; 

describe('Testing authetication route', () => {
  it('Resistering User', async () => {
    const data = {
      email: userData.email,
      password: userData.password
    };
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await axios.post('http://localhost:3000/api/auth/register', data, { headers });
    expect(response.status).toBe(200);
  });

  it('Login User', async () => {
    const data = {
      email: userData.email,
      password: userData.password
    }
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await axios.post('http://localhost:3000/api/auth/login', data, { headers });
    expect(response.status).toBe(200);
  });

  it('Login User', async () => {
    const data = {
      email: userData.email,
      password: userData.password
    }
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await axios.post('http://localhost:3000/api/auth/login', data, { headers });
    token = response.data.accessToken
    expect(response.status).toBe(200);
  });

  it('Login User (Aleatory Technician)', async () => {
    const data = {
      email: userData.email,
      password: userData.password
    }
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await axios.post('http://localhost:3000/api/auth/login', data, { headers });
    tokenTechnician= response.data.accessToken
    expect(response.status).toBe(200);
  });

  it('Login User (Manager)', async () => {
    const data = {
      email: "manager1@manager.com",
      password: "manager"
    }
    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await axios.post('http://localhost:3000/api/auth/login', data, { headers });
    tokenManager= response.data.accessToken
    expect(response.status).toBe(200);
  });

});

describe('Testing tasks route', () => {
  it('Add Task (Technician)', async () => {

    const headers = {
       Authorization: `Bearer ${tokenTechnician}`,
       'Content-Type': 'application/json', 
    };

    const data = {
      "summary": `Task of ${userData.email}`
    }
    const response = await axios.post('http://localhost:3000/api/tasks/create',data, { headers });
    taskId= response.data.task_id
    expect(response.status).toBe(200);
  });

  it('Update Task (Technician)', async () => {

    const headers = {
       Authorization: `Bearer ${tokenTechnician}`,
       'Content-Type': 'application/json', 
    };

    const data = {
      "id" : taskId,
      "summary": `Update Task of ${userData.email}`
    }
    const response = await axios.put('http://localhost:3000/api/tasks/update',data, { headers });
    expect(response.status).toBe(200);
  });

  it('Delete Task (Technician)', async () => {
    const headers = {
       Authorization: `Bearer ${tokenTechnician}`,
       'Content-Type': 'application/json', 
    };

    const data = {
      "id": taskId,
    }
    const response = await axios.delete('http://localhost:3000/api/tasks/delete', { headers,data });
    expect(response.status).toBe(204);
  });

  it('List Tasks (Manager)', async () => {

    const headers = {
       Authorization: `Bearer ${tokenManager}`,
    };

    const response = await axios.get('http://localhost:3000/api/tasks/list', { headers });

    expect(response.status).toBe(200);
  });
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; 
import { describe, it } from 'mocha'; 

chai.use(chaiHttp);
const { expect } = chai;

describe('Login Test', () => {
  it('should log in an existing user with correct credentials', async () => {
    const loginData = {
      email: 'sidalighettas@gmail.com', 
      password: 'securepassword',      
    };

    // Make a POST request to the login endpoint 
    const response = await chai.request(app).post('/api/user/login').send(loginData);

    
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('message').to.include('Authentication successful');
    expect(response.body).to.have.property('token');
  });

  
});

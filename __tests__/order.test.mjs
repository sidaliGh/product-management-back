import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../app.js'
import { describe, it } from 'mocha'

chai.use(chaiHttp)
const { expect } = chai

describe('Order Test', () => {
    //Test add Order Items
  it('should add order items for an authenticated user', async () => {
    const authToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTA1ODU0NDYyYzFjMzYyZmQyNjRiOWMiLCJuYW1lIjoic2lkYWxpIGdoZXR0YXMiLCJlbWFpbCI6InNpZGFsaWdoZXR0YXNAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk0OTQ3MjI3LCJleHAiOjE2OTU4MTEyMjd9.GI0rIdmMLlcWWNpLbG8v8BafvpnZn3iEEGPI25AmJ84'

    const orderData = {
      orderItems: [
        {
          name: 'Product test',
          qty: 2,
          price: 200.0,
          product: '65062deeab42f6167cec542d',
        },
        {
          name: 'Product 4',
          qty: 3,
          price: 900.0,
          product: '6507093d922d09ef1b680087',
        },
      ],
      shippingAddress: {
        fullName: 'GHETTAS SIALI',
        country: 'ALGERIA',
        wilaya: 'ALGIERS',
        commune: 'BIRTOUTA',
        address: 'abdi mouloud khracia',
        phone: '+213561440027',
      },
      shippingPrice: 400.0,
      totalPrice: 3500.0,
      isPaid: false,
      isDelivered: false,
    }

    // Make a POST request to the addOrderItems endpoint 
    const response = await chai
      .request(app)
      .post('/api/order/add')
      .set('Authorization', `Bearer ${authToken}`)
      .send(orderData)

    expect(response).to.have.status(201)
    expect(response.body).to.have.property('user') 
    expect(response.body).to.have.property('orderItems')
    expect(response.body).to.have.property('shippingAddress')
    expect(response.body).to.have.property('shippingPrice')
    expect(response.body).to.have.property('totalPrice')
    expect(response.body).to.have.property('isPaid')
    expect(response.body).to.have.property('isDelivered')
  });

   // Test getMyOrders 
   it('should get orders for an authenticated user', async () => {
    const authToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTA1ODU0NDYyYzFjMzYyZmQyNjRiOWMiLCJuYW1lIjoic2lkYWxpIGdoZXR0YXMiLCJlbWFpbCI6InNpZGFsaWdoZXR0YXNAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk0OTQ3MjI3LCJleHAiOjE2OTU4MTEyMjd9.GI0rIdmMLlcWWNpLbG8v8BafvpnZn3iEEGPI25AmJ84';

    // Make a GET request to get the user's orders
    const response = await chai
      .request(app)
      .get('/api/order/myorders')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('orders');
    expect(response.body.orders).to.be.an('array');
  });

  // Test  getMyOrder 
  it('should get a specific order for an authenticated user', async () => {
    const authToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTA1ODU0NDYyYzFjMzYyZmQyNjRiOWMiLCJuYW1lIjoic2lkYWxpIGdoZXR0YXMiLCJlbWFpbCI6InNpZGFsaWdoZXR0YXNAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjk0OTQ3MjI3LCJleHAiOjE2OTU4MTEyMjd9.GI0rIdmMLlcWWNpLbG8v8BafvpnZn3iEEGPI25AmJ84';

    // The ID of the order to test with
    const orderId = '65074b283f418e21df4263a2';

    // Make a GET request to get the specific order
    const response = await chai
      .request(app)
      .get(`/api/order/${orderId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('order');
  });
})

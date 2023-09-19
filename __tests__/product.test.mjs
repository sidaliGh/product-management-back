import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js'; 
import { describe, it } from 'mocha'; 

chai.use(chaiHttp);
const { expect } = chai;

describe('Product Controller Test', () => {
  // Test  getAllProducts 
  it('should get all products with pagination', async () => {
    const page = 1;
    // Make a GET request to the getAllProducts endpoint
    const response = await chai.request(app).get(`/api/product/products?page=${page}`);

    expect(response).to.have.status(200);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('products');
    expect(response.body).to.have.property('currentPage', page);
    expect(response.body).to.have.property('totalPages');
  });

  // Test  getProduct
  it('should get a product by ID', async () => {
    const existingProductId = '65062deeab42f6167cec542d';

    // Make a GET request to the getProduct endpoint 
    const response = await chai.request(app).get(`/api/product/${existingProductId}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('product');
  });

  // Test getMostOrderedProducts
  it('should get the most ordered products with pagination', async () => {
    const page = 1;

    // Make a GET request to the getMostOrderedProducts endpoint 
    const response = await chai.request(app).get(`/api/product/most-ordered?page=${page}`);

    expect(response).to.have.status(200);
    expect(response.body).to.have.property('products');
    expect(response.body).to.have.property('currentPage', page);
    expect(response.body).to.have.property('totalPages');

  });



});

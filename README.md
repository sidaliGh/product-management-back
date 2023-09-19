# Product Management API

This is a Node.js Express REST API for managing products, user orders, and admin functionalities. It includes authentication for users and admin roles.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Server](#running-the-server)
- [Testing](#testing)
- [Database Schema and Model Design](#database-schema-and-model-design)
- [How to Use the API Endpoints](#how-to-use-the-api-endpoints)
  - [User Endpoints](#user-endpoints)
  - [Admin Endpoints](#admin-endpoints)
- [Authentication Process](#authentication-process)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before setting up and running the project, make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) (v14 or later)

## Getting Started

### Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/sidaliGh/product-management-back.git
   cd product-management-back

   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

### Configuration

1. Create a .env file in the project root directory with the following environment variables:

   ```plaintext
   PORT=5000
   MONGO_URI=<Your_MongoDB_Connection_URI>
   JWT_SECRET=<Your_Secret_Key>
   ```

### Running the Server

- To start the server, run the following command:

  ```bash
  npm start
  ```

### Testing

- To run tests, you can use the following command:

  ```bash
  npm test
  ```

### Database Schema and Model Design

#### User Model (models/user.mjs)

- name: This field represents the user's name, and it's a required string.
- email: The email field must be unique, ensuring that each user has a unique email address.
- password: The password field stores the user's hashed password for security. It's required to authenticate users.
- role: This field represents the user's role and can be either 'user' or 'admin'. The default role is set to 'user'.
- isActivated: This boolean field indicates whether the user's account is activated. It defaults to false.
- resetPasswordToken and resetPasswordTokenExpiry: These fields can be used for implementing password reset functionality.

#### Product Model (models/product.mjs)

- name: This field represents the name of the product.
- category: The category field specifies the category to which the product belongs.
- price: This field stores the price of the product, ensuring it's a required numeric value.
- availability: The availability field is a boolean flag that indicates whether the product is currently available for purchase.
- user: This field references the User model using an ObjectId. It represents the user who created the product.
- lastUpdatedBy: This field also references the User model and indicates the user who last updated the product.

#### Order Model (models/order.mjs)

- user: This field references the User model and represents the user who placed the order.
- orderItems: An array of order items, each containing the name, quantity, price, and a reference to the Product model. This allows for storing multiple items in an order.
- shippingAddress: This field stores the shipping address details, including the full name, country, wilaya, commune, address, and phone number.
- shippingPrice: The shipping price is a numeric field that represents the cost of shipping for the order. It defaults to 0.0.
- totalPrice: This field stores the total price of the order, including the products and shipping cost.
- isPaid: A boolean field indicating whether the order has been paid for. It defaults to false.
- paidAt: If the order is paid, this field stores the timestamp of the payment.
- isDelivered: A boolean field indicating whether the order has been delivered. It defaults to false.
- deliveredAt: If the order is delivered, this field stores the timestamp of the delivery.

#### Timestamps

- Use the timestamps option, to automatically adds createdAt and updatedAt fields to the documents. These fields store the creation and last update timestamps.

### How to Use the API Endpoints

To interact with the API, you'll need to make HTTP requests to specific endpoints. Below, we describe each endpoint and provide example requests. You can use tools like Postman, or libraries like axios in JavaScript to make these requests programmatically.

#### User Endpoints

Register a New User

- **Endpoint: POST /api/user/register**
- **Description:** Register a new user by sending a POST request with the user's name, email, and password.
- **Example Request:**

```http
POST /api/user/register
Content-Type: application/json

{
  "name": "Your Name",
  "email": "yourname@gmail.com",
  "password": "securepassword123"
}

```

Activate User

- **Endpoint: GET /api/user/activate/:token**
- **Description:** Activate a user account using a token received via email.
- **Example Request:**

```http
GET /api/user/activate/activation_token_here

```

User Login

- **Endpoint: POST /api/user/login**
- **Description:** Log in with an existing user account by sending a POST request with the user's email and password.
- **Example Request:**

```http
POST /api/user/login
Content-Type: application/json

{
  "email": "yourname@gmail.com",
  "password": "securepassword123"
}

```

Generate Password Reset Token

- **Endpoint: POST /api/user/generate-password-reset-token**
- **Description:** Generate a token to reset a user's password, typically triggered by a "Forgot Password" feature.
- **Example Request:**

```http
POST /api/user/generate-password-reset-token
Content-Type: application/json

{
  "email": "yourname@gmail.com"
}

```

Reset Password

- **Endpoint: POST /api/user/reset-password/:token**
- **Description:** Reset a user's password using a valid reset token.
- **Example Request:**

```http
POST /api/user/reset-password/reset_token_here
Content-Type: application/json

{
  "newPassword": "new_securepassword123"
}

```

#### Order Endpoints

Add Order Items

- **Endpoint: POST /api/user/orders/add**
- **Description:** Add new order items to the user's cart.
- **Example Request:**

```http
POST /api/user/orders/add
Content-Type: application/json
Authorization: Bearer jsonwebtoken_here

{
    "orderItems": [
        {
            "name": "Product 3",
            "qty": 2,
            "price": 200.00,
            "product": "product_id_1"
        },
        {
            "name": "Product 4",
            "qty": 3,
            "price": 900.00,
            "product": "product_id_2"
        }
    ],
    "shippingAddress": {
        "fullName": "GHETTAS SIALI",
        "country": "ALGERIA",
        "wilaya": "ALGIERS",
        "commune": "ALGIERS",
        "address": "Algiers street",
        "phone": "+21356144****"
    },
    "shippingPrice": 400.0,
    "totalPrice": 1500.00,
}


```

Get User Orders

- **Endpoint: GET /api/user/orders/myorders**
- **Description:** Retrieve the user's order history.
- **Example Request:**

```http
GET /api/user/orders/myorders
Authorization: Bearer jsonwebtoken_here

```

Get Specific User Order

- **Endpoint: GET /api/user/orders/:id**
- **Description:** Retrieve a specific order by its ID.
- **Example Request:**

```http
GET /api/user/orders/order_id_here
Authorization: Bearer jsonwebtoken_here


```

#### Admin Endpoints

Add a New Product

- **Endpoint: POST /api/admin/product/add**
- **Description:** Add a new product to the catalog.
- **Example Request:**

```http
POST /api/admin/product/add
Content-Type: application/json
Authorization: Bearer admin_jsonwebtoken_here

{
  "name": "Product Name",
  "category": "Category",
  "price": 900.00,
  "availability": true
}

```

Update a Product

- **Endpoint: PATCH /api/admin/product/:productId**
- **Description:** Update an existing product's details.
- **Example Request:**

```http
PATCH /api/admin/product/product_id_here
Content-Type: application/json
Authorization: Bearer admin_jsonwebtoken_here

{
  "name": "Updated Product Name",
  "category": "Category",
  "price": 900.00,
  "availability": false
}

```

Get All Products (Admin)

- **Endpoint: GET /api/admin/product/products**
- **Description:** Retrieve all products in the catalog.
- **Example Request:**

```http
GET /api/admin/product/products?page=1
Authorization: Bearer admin_jsonwebtoken_here

```

Get a Product by ID (Admin)

- **Endpoint: GET /api/admin/product/:productId**
- **Description:** Retrieve a specific product by its ID.
- **Example Request:**

```http
GET /api/admin/product/product_id_here
Authorization: Bearer admin_jsonwebtoken_here

```

Delete a Product (Admin)

- **Endpoint: DELETE /api/admin/product/:productId**
- **Description:** Delete a product from the catalog by its ID.
- **Example Request:**

```http
DELETE /api/admin/product/product_id_here
Authorization: Bearer admin_jsonwebtoken_here

```

### Authentication Process

This API uses JSON Web Tokens (JWT) for user authentication. The authentication process involves the following steps:

1. #### User Registration:

- To use the API, users must first register by sending a POST request to /api/user/register.
- Required fields for registration are name, email, and password.

2. #### User Activation:

- After registration, a confirmation email with an activation token is sent to the provided email address.
- To activate the user account, send a GET request to /api/user/activate/:token, where :token is the activation token received via email.

3. #### User Login:

- To access protected routes, users need to log in by sending a POST request to /api/user/login.
- Required fields for login are email and password.
- Upon successful login, the API will provide a JWT token.

4. #### Authentication Middleware:

- Protected routes require a valid JWT token in the Authorization header with the format Bearer <token>. The provided JWT token is verified and decoded to extract the user's information.
- The middleware function checkAuth (middleware/checkAuth.mjs) performs this verification.
- If the token is valid, the user object is attached to the request (req.user) for further route handling.

5. #### Authorization:

- Certain routes are protected for admin-only access. The checkAdmin middleware (middleware/checkAuth.mjs) verifies if the user has an admin role.
- If the user is not an admin, a 403 Forbidden response is returned.

6. #### Token Expiry:

- JWT tokens have a predefined expiration time (set during token creation). If the token expires, the user will need to re-authenticate.

7. #### Password Reset:

- Users can request a password reset token by sending a POST request to /api/user/generate-password-reset-token. An email with a reset token is sent to the registered email address.
- To reset the password, send a POST request to /api/user/reset-password/:token, where :token is the reset token received via email.
- Required fields for password reset are newPassword.

### Contributing

Contributions are welcome!

### License
This project is licensed under the ISC License.

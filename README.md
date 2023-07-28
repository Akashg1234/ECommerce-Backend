# Ecommerce Clothing Brand for Men - Backend

Welcome to the backend repository for our Ecommerce Clothing Brand for Men website! This Node.js application is built using MongoDB for the database and Cloudinary for handling image uploads.

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-%3E%3D4.4-green.svg)
![Cloudinary](https://img.shields.io/badge/Cloudinary-%3E%3D1.0-blue.svg)

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [API Routes](#api-routes)
5. [Blogging Section](#blogging-section)
6. [User Section](#user-section)
7. [Admin Section](#admin-section)
8. [Contributing](#contributing)
9. [License](#license)
    
## :pencil2: Introduction

This backend server serves as the core of our Ecommerce Clothing Brand for Men website. It handles various API routes for both admin and users, allowing them to manage products, orders, and user-related functionalities. The integration with MongoDB ensures efficient data storage and retrieval, while Cloudinary handles image uploads seamlessly.

## :wrench: Prerequisites

Before running the backend server, ensure you have the following installed:

- Node.js (version >= 14)
- MongoDB (version >= 4.4)
- Cloudinary account and API key

## :gear: Installation

Follow these steps to set up the backend locally:

1. Clone this repository to your local machine.
2. Install the required dependencies using npm:

```
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=5000
FRONTEND_URL='http://localhost:3000'
JWT_EXPIRE=5d
JWT_SECRET_KEY=<jwt secret>
NODE_MAILER_USER = nikita71@ethereal.email
NODE_MAILER_PASS = u6PQnMtfanTEucNZQP
```


4. Run the server:

```
npm start
```

## :rocket: API Routes

The backend provides various API routes for admin and users to manage the Ecommerce Clothing Brand website. Here are some of the important routes:

- `POST /login`: Login route.
- `POST /logout`: Logout route.
- `GET /me`: User profile.
- `POST /contact`: Contact API.
- `/admin/` : All admin routes (Admin Only)
- `/user/` : All users routes (User Only)

Please refer to the API documentation or explore the codebase to discover more endpoints and functionalities.

## :page_facing_up: Blogging Section

Our website includes a blogging section that allows both users and admins to post blogs. Blogs can be managed via API routes, and users can view them on the website. This feature aims to engage users with exciting content related to men's fashion and our brand.

## :man: User Section

In the user section of the backend, users can:

- Browse and search for products in the store.
- View product details, such as price, description, and available sizes.
- Add products to their cart and proceed to checkout.
- Place orders and view their order history.
- Manage their profile information.

## :cop: Admin Section

In the admin section of the backend, administrators can:

- Log in to the admin panel with secure authentication.
- Manage products, including adding new products, updating existing ones, and deleting products.
- View and manage customer orders.
- Monitor and track website analytics and sales data.
- Post and manage blogs to engage users and showcase brand updates.
  
## :handshake: Contributing

We welcome contributions from the community! If you find any bugs or have suggestions for improvements, please feel free to open an issue or submit a pull request.

## :scroll: License

This project is licensed under the MIT License.

---

Thank you for using our backend repository for the Ecommerce Clothing Brand for Men website. If you have any questions or need assistance, don't hesitate to reach out! Happy coding!

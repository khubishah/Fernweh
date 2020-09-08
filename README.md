Fernweh is German for "craving for travel", or a "homesickness for distant, unvisited places" (wanderlust but slightly less basic of a name :P). This web application prototype is my first attempt at using Node, Express, MongoDB, and Mongoose to create my own feature-rich RESTful API with server-side rendering using Pug! The purpose of this application is to let users view various tours around the world, create their own account, book them, pay for them, and write ratings for them.

Some of the cool features:
- A feature-rich RESTful API on the back-end that stores users, tours, and reviews. All the CRUD operations routes have been implemented, geospatial queries, user authentication and authorization using JWT tokens, error handling, password resetting, a bunch of security features, and server-side rendering using Pug templates.
- Integrated Stripe payments and Stripe webhooks into the application! (Using Stripe testing mode)
- Integrated NodeMailer and SendGrid for emailing sending! (still have to fix some issues with SendGrid though)
- Storing all our data on the cloud using MongoDB Atlas!
- Integrated Mapbox!

Coming-soon:
- 2-Factor Authentication!
- Sign-up Form (endpoint is there already, just need to add server-side rendering)
- Tour Likes Button and Tracking
- Bug fix: prevent duplicate bookings

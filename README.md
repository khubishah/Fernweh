Fernweh is German for "craving for travel", or a "homesickness for distant, unvisited places" (wanderlust essentially, but let's be more original :P). This web application prototype is my first attempt at using Node, Express, MongoDB, and Mongoose to create my own feature-rich RESTful API with server-side rendering using Pug! The purpose of this application is to let users view various available international tours, create their own account, book tours, pay for tours, and write ratings based on their experience.

Some of the cool features that I got working:
- A feature-rich RESTful API on the back-end that stores users, tours, and reviews. All the CRUD operations routes have been implemented, geospatial queries, user authentication and authorization using JWT tokens, detailed error handling, password resetting
- a bunch of security features (rate limiting, data sanitization, encryption, https only for some requests)
- server-side rendering using Pug templates.
- Integrated Stripe payments and Stripe webhooks into the application! (Using Stripe testing mode)
- Integrated NodeMailer and SendGrid for sending a password reset link! (still have to fix some issues with SendGrid though but NodeMailer worked)
- Storing all our data on the cloud using MongoDB Atlas!
- Integrated Mapbox!

Coming-soon:
- 2-Factor Authentication!
- Sign-up Form (endpoint is there already, just need to add server-side rendering)
- Tour Likes Button and Tracking
- Bug fix: prevent duplicate bookings

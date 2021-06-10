Hello, My Friends  
Thank you for having interest in this repository !

To use this application,

1. make dev.js file inside config folder
2. put mongoDB info into dev.js file
3. Type " npm install " inside the root directory ( Download Server Dependencies )
4. Type " npm install " inside the client directory ( Download Front-end Dependencies )

If you have problem, feel free to ask me ^^

You can watch the tutorial for this app.

https://www.youtube.com/channel/UCFyXA9x8lpL3EYWeYhj4C4Q?view_as=subscriber

I have structured my project using the MVC pattern:
M =model ,The folder "models" (in sever folder) contains the data structure of my project.
V =view, The folder "views" (in client folder) contains the UI for the client (components).
C =control,The folder "routes" (in server folder) contains the express middleware functions
(However, due to cleanliness, I will later create a seperate "controllers" folder for the "routes" callback functions e.g. createBlog..removeFolder.. and import them to "routes")

This design pattern that makes any web application easy to scale if you want to introduce more routes or static files in the future and the code is maintainable ad separated neatly.

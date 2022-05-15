# Development

---

- Dependencies we are using
    - Express JS
    - Socket.io
    - Moment JS → used for formatting date/time
    - Nodemon
        
        ![Screenshot 2022-05-13 at 4.33.30 PM.png](Development%208e3c7c3f46094fda8d8632b559c786b1/Screenshot_2022-05-13_at_4.33.30_PM.png)
        
    

---

- Basic ExpressJS server on port `3000`
    
    ```jsx
    const express = require('express')
    const app = express()
    const PORT = process.env.PORT || 3000
    
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`)
    })
    ```
    
- Setting our front-end folder as a static folder
    - To access files easily
    - Using the `path` module
    
    ```jsx
    app.use(express.static(path.join(__dirname, 'Frontend')))
    ```
    
    - `express.static()` → to serves static files in express
    - `path.join(__dirname, 'Frontend')` → using the `path` module to give the location of our Front-end folder

---

- ExpressJS uses `http` under the hood to create a server by `.createServer()` but we need to use `http` explicitly for socket.io

```jsx
const server = http.createServer(app)
```

---

- Setting up initial socket.io
    - creating a connection event on the server side → will run when a client connects: (socket instance given)
    
    ```jsx
    io.on('connection', socket =>{
        console.log("New WS connection....")
    })
    ```
    
    - On the client-side:
        - In `chat.html`
            - importing the [socket.io](http://socket.io) frontend library
            
            ```jsx
            <script src="/socket.io/socket.io.js"></script>
            ```
            
        - In `main.js`
            
            ```jsx
            const socket = io()
            ```
            
            - have access to `io()` because of the script we added in `chat.html`
            - this basically will create a new connection everytime we are refreshing the page
            
            ![Screenshot 2022-05-13 at 5.14.22 PM.png](Development%208e3c7c3f46094fda8d8632b559c786b1/Screenshot_2022-05-13_at_5.14.22_PM.png)
            
- Emitting message from the client to server
    - On the server-side:
        - create an emit event ‘message’ & make it send a simple message
        
        ```jsx
        socket.emit('message', 'Welcome to PingIO!')
        ```
        
    - On the client-side (main.js):
        - listening to that ‘message’ event we created in our server here:
        
        ```jsx
        socket.on('message', message => {
        	console.log(message)
        })
        ```
        
    
    ---
    
    - On server-side:
        - create an event that hits when a user connects:
        
        ```jsx
        socket.broadcast.emit('message', 'A user has joined the chat!')
        ```
        
        - we used `socket.broadcast.emit` here because that would send the connection request to all the users, except the user which send the request in the 1st place
        - we use `io.emit()` to send message or request to every user, including the user which made the request!
        - Creating an event that runs when a user disconnects from the chat:
        
        ```jsx
        socket.on('disconnect', () =>{
                // sending a message to everybody
                io.emit('message', 'A user has left the chat!')
            })
        ```
        
- Taking a message from the server & displaying it on the DOM (screen)
    - **On client-side:**
        - In `main.js`
            - getting the chat-form in our js file:
            
            ```jsx
            const chatForm = document.getElementById('chat-form')
            ```
            
            - Creating a function (event listener) which basically gets the input message from the user & then we are emitting that message to the server (when submitted):
            
            ```jsx
            chatForm.addEventListener('submit', e =>{
                e.preventDefault()
            
                // Get the message text that is entered by the user:
                const ourMessage = e.target.elements.msg.value
            
                // Emit this message to the server:
                socket.emit('chat-message', ourMessage)
            })
            ```
            
            - `e.target.elements` → getting access to the current element (e) & the all the elements in that
            - `msg.value` → getting the value of the message we input in the field, having an id=”msg”
            - `e.preventDefault()` → to stop the by default of an event submission, as it would submit the form in a file
    
    ---
    
    - **On the server-side:**
        - Catching/listening to the chat message on our server: (+ logging it on the server)
        
        ```jsx
        socket.on('chat-message', (ourMessage) =>{
                console.log(ourMessage)
            })
        ```
        
        - Emitting this back to the client: (to everybody)
        
        ```jsx
        socket.on('chat-message', (ourMessage) =>{
                io.emit('message', ourMessage)
            })
        ```
        
    
    ---
    
    ### Manipulating the DOM
    
    - On client-side:
        - In `main.js`
            - creating a function to output the message to DOM:
            
            ```jsx
            function outputMessage(message){
                const div = document.createElement('div')
                div.classList.add('message')
                div.innerHTML = `<p class="meta">Mary <span>9:15pm</span></p>
                <p class="text">
                  ${message}
                </p>`
                document.querySelector('.chat-messages').appendChild(div)
            }
            ```
            
            - putting this where the message is received from the server:
            
            ```jsx
            socket.on('message', message => {
            	console.log(message)
                outputMessage(message)
            })
            ```
            
    
    ---
    
- Making some tweaks in the Front-end
    - **Scrolling feature:**
        - Everytime a message is displayed, the chat window should automatically scroll down acc. to the height of the message:
        
        ```jsx
        socket.on('message', message => {
        	console.log(message)
            outputMessage(message)
        
            // Scroll down with each message:
            chatMsg.scrollTop = chatMsg.scrollHeight
        })
        ```
        
        - where, `chatMsg` is the variable that stores the messages from the user (we brought it to main.js from chat.html)
        
        ```jsx
        const chatMsg = document.querySelector('.chat-messages')
        ```
        
    
    ---
    
    - **Clearing out the input after submitting + focusing back on the input field**
        
        ```jsx
        chatForm.addEventListener('submit', e =>{
            e.preventDefault()
        
            // Get the message text that is entered by the user:
            const ourMessage = e.target.elements.msg.value
        
            // Emit this message to the server:
            socket.emit('chat-message', ourMessage)
        
            // Clearing the input after submission:
            e.target.elements.msg.value = ''
        
            // Bringing the focus back to the input field for typing another message
            e.target.elements.msg.focus()
        })
        ```
        
- Formatting the chat messages
    - creating a new file `utils/chat-messages.js`
    - creating a function to which returns the parameters i.e the username, the text & the time (using moment JS) in the form of an object
    
    ```jsx
    function formatMessage(username, text){
        return {
            username,
            text,
            time: moment().format('h:mm a')
        }
    }
    ```
    
    - Exporting this to be used in any other file:
    
    ```jsx
    module.exports = formatMessage
    ```
    
    ---
    
    - **On the server-side:**
        - creating a `bot` that would be visible with the messages like ‘Welcome’, ‘Joined chat’, ‘Left the chat’
        - then using the `formatMessage` function with each of these messages
        
        ```jsx
        // Welcoming current user:
            socket.emit('message', formatMessage(botName, 'Welcome to PingIO!'))
        
        // Broadcast this when a user connects:
            socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat!'))
        
        // sending a message to everybody
                io.emit('message', formatMessage(botName, 'A user has left the chat!'))
        
        io.emit('message', formatMessage('USER', ourMessage))
        ```
        
    - **On client-side:**
        - as `messages` is now an object, so we can use the properties like username & time with it, in our output messages:
        
        ```jsx
        // Output message from the DOM:
        function outputMessage(message){
            const div = document.createElement('div')
            div.classList.add('message')
            div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`
            document.querySelector('.chat-messages').appendChild(div)
        }
        ```
        
        - See `${message.username}` , `${message.time}` & `${message.text}`
- Users & Rooms Implementation
    - See the URL giving some info about the user & the room, we’ll be using that info to customise acc. to us
    
    `http://localhost:3000/chat.html?username=sds&room=JavaScript`
    
    - using `[qs](https://cdnjs.com/libraries/qs)` → a querystring parser
        - importing this in our `chat.html` file
    - **On the client-side:**
        - In `main.js`
            - manipulating the search-url to get the username & room name: (using `qs`)
            
            ```jsx
            const { username, room } = qs.parse(location.search, {
                ignoreQueryPrefix: true
            })
            ```
            
            - `ignoreQueryPrefix = true` → using this to ignore the additional symbols like “?”, “&” in the URL
            - Emitting an event to the server & adding these info in that
            
            ```jsx
            socket.emit('joinRoom', username, room)
            ```
            
    - **On the server-side:**
        - Catching the `joinRoom` event here
        
        ```jsx
        // Not understood ???
        ```
        
        - Creating functions for users in `utils/users.js`
        
        ```jsx
        const users = []
        
        // Join user to chat:
        function userJoin(id, username, room){
            const user = {id, username, room}
        
            users.push(user)
            return user
        }
        
        // Get the current user:
        function getCurrentUser(id){
            return users.find(user => user.id === id)
        }
        ```
        
        - creating a user & giving it the value (id, name, room) by using the `userJoin` function
        
        ```jsx
        const user = userJoin(socket.id, username, room)
        ```
        
        - to broadcast the message only to that particular room in which the user is there, we use `.to()` with the emit function:
        
        ```jsx
        socket.broadcast.to(user.room).emit(---)
        ```
        
        - getting the name of the current user to display with the message: by using the `getCurrentUser()`
        
        ```jsx
        // Listening for our chat message here:
          socket.on("chat-message", (ourMessage) => {
            const user = getCurrentUser(socket.id)
        
            io.to(user.room).emit("message", formatMessage(user.username, ourMessage));
          });
        ```
        
    
    ---
    
    ### Message for users leaving the chat
    
    - creating a few functions
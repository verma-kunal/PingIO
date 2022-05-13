# Socket.IO

---

### How Socket.io works?

- helps in making a connection between the client & the server, but making the connection persist
- we use WebSockets here
    - they actually establish an open connection between the client & the server
    - so, we just have to establish a connection one-time & don’t worry about creating multiple requests on that connection
    - **`WebSockets ⇒ server ⇒ client`**
    
    ---
    

### Setting up the socketIO server

- installing socketio

```jsx
npm i socket.io
```

- importing it & passing a port to tell where socketio will run 
Example → port `3000`

```jsx
const io = require('socket.io')(3000);
```

- Everytime a client connects with the server, this function would run → it would assign a `socket` instance to each of that connection

```jsx
io.on('connection', socket =>{
	// example statement:  
	console.log(socket.id)
})
```

---

### Client-side Picture

- installing a library:

```jsx
npm i socket.io-client
```

- importing this to the client side script

```jsx
import { io } from "socket.io-client"
```

- `io` → we can call this to get an indivisual **socket**
- connectin the client to our server:

```jsx
const socket = io('htttp://localhost:3000')
```

- CORS Problem
    - If your client is on port `8080` & the server is listening on `3000`, a problem of CORS will occur in order to establish a connection using socket.io
    - For this, we have to specify the origin URL of our connection in the server side:
    
    ```jsx
    const io = require('socket.io')(3000, {
        cors:{
            origin: ["http://localhost:8080"],
        },
    })
    ```
    

---

- Check your established connection b/w client and server
    - using a `connect` evet → runs everytime we connect to our server
    
    ```jsx
    socket.io('connect', () => {
    	displayMessage(`You connected with id: ${socket.id}`)
    })
    ```
    
- Sending events from client to the server
    - using `socket.emit` here
    - this will send any event you want to the server
    
    ```jsx
    // on the client-side:
    
    socket.emit('cussocket.on('connect', () => {
    	displayMessage(`You connected with id: ${socket.id}`)
      
    	// this one:
    	socket.emit('custom-event', /* anything you wish to send */)
    })
    ```
    
    - now, listening this on server side:
    
    ```jsx
    io.on('connection', socket =>{
        console.log(socket.id)
        // from here:
    		socket.on('custom-event', () =>{
            
        })
    })
    ```
    
    - when we do `io.emit()` in the server side, it will send a request to all the clients, including the client that made the request in the first place
        - If we wanna send request to the clients, expect the client that made the request:
        
        ```jsx
        socket.broadcast.emit('receive-message', message)
        ```
        
        - `socket.broadcast.emit`→ take the socket & broadcast a message to every other socket that isn’t me & emit that out!

---

### Rooms in SocketIO

- by default → every single user in socketio has their own room & its their `ID`
- sending a message to the room:

```jsx
// on the server-side:
socket.to(room).emit('receive-message', message)
```

- `socket.to` → by default assumes the `socket.broadcast` flag

---

- Custom Rooms
    - **you want to send messages to multiple users but not to all of them**
    
    ```jsx
    // on the client-side:
    // making an event
    socket.emit('join-room', room)
    
    // on the server-side:
    // setting up a listener for that
    socket.join('join-room', room =>{
    	socket.join(room)
    })
    ```
    

---
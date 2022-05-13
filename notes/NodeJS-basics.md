# Node & Express Js

---

## NODE JS

- Basics
    - server side Javascript
    - works on Non-blocking I/O model
        - single thread manages multiple connections
- `NPM`
    - node package manager
    - manages all the packages in Node Js
    - Node Commands:
        - Initialise the node project
        
        ```jsx
        npm init 
        ```
        
        - installing a package
        
        ```jsx
        npm i <package_name>
        ```
        
        - adding the node module folder
        
        ```jsx
        npm i
        ```
        
        - to install a package globally in your machine
        
        ```jsx
        npm i -g <package_name>
        ```
        
        - to uninstall a package
        
        ```jsx
        npm uninstall <package>
        ```
        
- Dev Dependency
    - packages/dependencies which we only want during the dev time
    
    ```jsx
    npm i --save-dev <package>
    ```
    
- Imports
    - Common Js Modules
        1. Exporting the content of the file → in order to import in other file
        
        ```jsx
        module.exports = <name>
        ```
        
        1. Importing in another file:
        
        ```jsx
        const xyz = require("file location")
        ```
        
- Module Wrapper Function
    - each module is wrapped inside this function: (automatically)
    
    ```jsx
    function(exports, require, module, __filename, __dirname){
    
    })
    ```
    
- OS Module
    - importing:
    
    ```jsx
    const os = require('os')
    ```
    
    - some functions:
    
    ```jsx
    console.log(os.freemem());
    console.log(os.hostname());
    console.log(os.release());
    console.log(os.totalmem());
    ```
    
- Common JS Modules & ES6 Syntax
    - **Common JS Modules**
        - import statment looks like this: (`require` is used)
        
        ```jsx
        const simple = require('./mod2')
        ```
        
        - exporting a function like this:
        
        ```jsx
        function simple(){
            console.log('Hey! Simple');
        }
        
        module.exports = simple;
        ```
        
    - **ES6 Modules**
        - extension used is `.mjs`
        - Needs to be added in `package.json` to use this syntax
        
        ```json
        "type": "module"
        ```
        
        ![Screenshot 2022-04-27 at 9.45.36 AM.png](Node%20&%20Express%20Js%20147b3d71310c4703943fad16a1f555f3/Screenshot_2022-04-27_at_9.45.36_AM.png)
        
        - exporting a function as: (`export` is used)
        
        ```jsx
        export function simple(){
            console.log('Hey! Simple');
        }
        ```
        
        - importing as:
        
        ```jsx
        import {simple} from "./mod2"
        ```
        
        - Alias of the function:
        
        ```jsx
        import {simple as myFunc} from "./mod2"
        ```
        
        - A `default` export is the one, which would run when we won’t write any specific import
        
        ```jsx
        // In module2.mjs
        export default function simple2(){
            console.log('Hey! Simple2');
        }
        
        // In module1.js
        import simple12 from "./module2.mjs"
        
        simple12();
        ```
        
        - Even if we have written `simple12()` , by default the `simple2()` function will be called.
        - to import everything from a module:
        
        ```jsx
        import * as all from "./mod2.mjs"
        ```
        
- URL Module
    - importing the module
    
    ```jsx
    import url from 'url'; 
    ```
    

- Node Js works on an Event-driven architecture

- Event Emitter
    - creates an event and the logic to trigger that event
    - Example:
    
    ```jsx
    // importing 'events' module
    const EventEmitter = require('events');
    
    class MyEmitter extends EventEmitter {}
    
    // creating/initialising a new event
    const myEmitter = new MyEmitter();
    
    // defining the event/logic:
    myEmitter.on('waterFull', () => {
      console.log('Turn off the motor!');
    
      // run after 3 seconds:
      setTimeout(() => {
        console.log('Turn off the motor! A reminder');
      }, 3000);
    
    });
    
    // triggering the event 
    myEmitter.emit('waterFull');
    ```
    

---

### Building HTTP servers in Node Js

- importing the `http` module

```jsx
const http = require('http');
```

- configuring the port → whichever port our process is getting, use that or if not, use port `3000` to listen

```jsx
const port = process.env.PORT || 3000;
```

- “create a server” function:

```jsx
const server = http.createServer((req,res) =>{
    
})
```

- req → request
- res → response
- Status Codes:
    - 200 = OK
    - 500 = server error
    - 404 = Not found
- Once the server is ready, we have to make it listen on a PORT:

```jsx
server.listen(port, ()=>{
	console.log('Server is listening on port ${port}')
});
```

- Here `${port}` means the value of the port that is defined

---

- End-point creation
    - Doing pagination & displaying message according to the location URL:
    
    ```jsx
    if(req.url = '/about'){
    	console.log('This is about page!')
    }
    ```
    

---

- To connect with a HTML
    - using the `fs` module to read the HTML file
    
    ```jsx
    if(req.url == '/main'){
            res.statusCode = 200;
            const data = fs.readFileSync('./index.html')
            res.end(data.toString());
        }
    ```
    

---

### Using Express: (in brief)

- A basic express server:

```jsx
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

- here, we are directly specifying the **end-point** in the `app.get` function, rather than using if-else again n again

---

---
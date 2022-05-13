// Getting the chat-form from "chat.html":
const chatForm = document.getElementById("chat-form");

// Getting the chat message component from the HTML:
const chatMsg = document.querySelector(".chat-messages");

// have access to io() because of the script we added in "chat.html"
const socket = io();

// Bringing the chat users & room from the HTML to here:
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get the username & room name from URL:
// Example: http://localhost:3000/chat.html?username=sds&room=JavaScript
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join the chat-room:
socket.emit("joinRoom", username, room);

// Get the room & users info:
socket.on("roomUsers", ({ room, users }) => {
  // outputing these users, using functions (using DOM functions):
  outputRoomName(room);
  outputUsers(users);
});

// Message from the server:
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down with each message:
  chatMsg.scrollTop = chatMsg.scrollHeight;
});

// Message submit function:
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get the message text that is entered by the user:
  const ourMessage = e.target.elements.msg.value;

  // Emit this message to the server:
  socket.emit("chat-message", ourMessage);

  // Clearing the input after submission:
  e.target.elements.msg.value = "";

  // Bringing the focus back to the input field for typing another message
  e.target.elements.msg.focus();
});

// Output message from the DOM:
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
      ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Adding room name to DOM (to display)
function outputRoomName(room) {
  // setting the roomName (which is the actual display element) to the actual room of the user:
  roomName.innerText = room;
}

// Adding users to DOM:
function outputUsers(users) {
  userList.innerHTML = `
        ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}

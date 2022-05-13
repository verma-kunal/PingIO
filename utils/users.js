const users = [];

// Join user to chat:
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get the current user:
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaving the chat room:
function userLeaves(id) {
  // this will actually fetch the index of the user having that id
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Getting the room users:
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
};

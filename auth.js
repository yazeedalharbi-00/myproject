// Authentication utility functions
const authKey = 'users';
const currentUserKey = 'currentUser';
const commentsKey = 'comments';

function getUsers() {
  const stored = localStorage.getItem(authKey);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem(authKey, JSON.stringify(users));
}

function getCurrentUser() {
  const stored = localStorage.getItem(currentUserKey);
  return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(currentUserKey, JSON.stringify(user));
  } else {
    localStorage.removeItem(currentUserKey);
  }
}

function signup(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Email already exists' };
  }
  const newUser = {
    id: Date.now(),
    name,
    email,
    password, // In real app, hash this!
    isAdmin: false,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return { success: true, message: 'Signup successful' };
}

function signin(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { success: false, message: 'Invalid email or password' };
  }
  setCurrentUser(user);
  return { success: true, user };
}

function logout() {
  setCurrentUser(null);
}

function getUserComments(userId) {
  const stored = localStorage.getItem(commentsKey);
  const comments = stored ? JSON.parse(stored) : [];
  return comments.filter(c => c.userId === userId);
}

function getAllComments() {
  const stored = localStorage.getItem(commentsKey);
  return stored ? JSON.parse(stored) : [];
}

function addCommentWithUser(name, email, comment, userId) {
  const stored = localStorage.getItem(commentsKey);
  const comments = stored ? JSON.parse(stored) : [];
  comments.push({
    id: Date.now(),
    userId,
    name,
    email,
    comment,
    createdAt: new Date().toISOString()
  });
  localStorage.setItem(commentsKey, JSON.stringify(comments));
}

function deleteComment(commentId) {
  const stored = localStorage.getItem(commentsKey);
  let comments = stored ? JSON.parse(stored) : [];
  comments = comments.filter(c => c.id !== commentId);
  localStorage.setItem(commentsKey, JSON.stringify(comments));
}

function deleteUserComments(userId) {
  const stored = localStorage.getItem(commentsKey);
  let comments = stored ? JSON.parse(stored) : [];
  comments = comments.filter(c => c.userId !== userId);
  localStorage.setItem(commentsKey, JSON.stringify(comments));
}

function makeAdmin(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (user) {
    user.isAdmin = true;
    saveUsers(users);
  }
}

function getCurrentUserWithCheck() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'signin.html';
    return null;
  }
  return user;
}

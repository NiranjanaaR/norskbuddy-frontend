// src/services/authService.js

const USERS_KEY = "pwme_users";

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// SIGNUP — create user in localStorage
export async function signup({ email, password, name }) {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();

  if (users[normalizedEmail]) {
    const err = new Error("User already exists");
    err.code = "USER_EXISTS";
    throw err;
  }

  users[normalizedEmail] = {
    email: normalizedEmail,
    password, // Demo only — never store plain passwords in real apps
    name: name?.trim() || normalizedEmail.split("@")[0],
  };

  saveUsers(users);

  return {
    email: users[normalizedEmail].email,
    name: users[normalizedEmail].name,
  };
}

// LOGIN — check credentials
export async function login({ email, password }) {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const user = users[normalizedEmail];

  if (!user || user.password !== password) {
    const err = new Error("Invalid credentials");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  return {
    email: user.email,
    name: user.name,
  };
}

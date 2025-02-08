// Firebase SDK imports (for modular SDK version 9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

// Firebase config (replace with your actual Firebase project config)
const firebaseConfig = {
  apiKey: "AIzaSyCAvXu7uUr40QyKZiNdGqUBYSiwnYamJs8",
  authDomain: "bruhbruh-7e026.firebaseapp.com",
  projectId: "bruhbruh-7e026",
  storageBucket: "bruhbruh-7e026.firebasestorage.app",
  messagingSenderId: "912287151945",
  appId: "1:912287151945:web:998c781942f07e2854cc98",
  measurementId: "G-FSKDDHW3NG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication

// Get DOM elements for Signup and Login forms
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const signupMessage = document.getElementById('signup-message');
const loginMessage = document.getElementById('login-message');

// Signup function
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User signed up:', user);
    signupMessage.innerHTML = `Welcome, ${user.email}! You have successfully signed up.`;
    // Optionally, you can redirect to a logged-in page or show the posts page
  } catch (error) {
    console.error("Error signing up:", error.message);
    signupMessage.innerHTML = `Error: ${error.message}`;
  }
});

// Login function
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form from refreshing the page

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User logged in:', user);
    loginMessage.innerHTML = `Welcome back, ${user.email}! You are now logged in.`;
    // Optionally, you can redirect to a logged-in page or show the posts page
  } catch (error) {
    console.error("Error logging in:", error.message);
    loginMessage.innerHTML = `Error: ${error.message}`;
  }
});

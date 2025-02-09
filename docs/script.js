alert('bonkydonk')
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";  // Import Firestore SDK

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
const db = getFirestore(app); // Firebase Firestore

// Get DOM elements
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const postFormSection = document.getElementById('postFormSection');
const postsContainer = document.getElementById('postsContainer');
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
    postFormSection.style.display = 'block';  // Show post creation section
    displayPosts();  // Display existing posts
  } catch (error) {
    console.error("Error logging in:", error.message);
    loginMessage.innerHTML = `Error: ${error.message}`;
  }
});

// Create post function
async function createPost() {
  const postText = document.getElementById('postText').value;

  if (!postText) {
    alert('Please write something to post!');
    return;
  }

  try {
    const user = auth.currentUser;  // Get the current logged-in user
    const docRef = await addDoc(collection(db, "posts"), {
      userEmail: user.email,
      text: postText,
      timestamp: new Date()  // Store timestamp as a JavaScript Date object
    });

    console.log("Post added with ID: ", docRef.id);
    document.getElementById('postText').value = '';  // Clear the post input
    displayPosts();  // Reload posts
  } catch (e) {
    console.error("Error adding post: ", e);
  }
}

// Display posts function
async function displayPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  postsContainer.innerHTML = '';  // Clear current posts

  querySnapshot.forEach((doc) => {
    const post = doc.data();
    const postElement = document.createElement('div');
    postElement.className = 'post';

    // Check if the timestamp exists and is a Firestore Timestamp
    if (post.timestamp && post.timestamp.toDate) {
      const formattedDate = post.timestamp.toDate().toLocaleString();  // Convert Firestore Timestamp to Date and format it
      postElement.innerHTML = `
        <strong>${post.userEmail}</strong>: ${post.text}
        <br>
        Posted on: ${formattedDate}
      `;
    } else {
      postElement.innerHTML = `
        <strong>${post.userEmail}</strong>: ${post.text}
        <br>
        Posted on: Date not available
      `;
    }

    postsContainer.appendChild(postElement);
  });
}.   make the posts system like the username system or smth. it sisnt working how u did it

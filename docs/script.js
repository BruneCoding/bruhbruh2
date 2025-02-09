alert('bonkyadonk');

// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js"; 

// Firebase config
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
const auth = getAuth(app);
const db = getFirestore(app);

// Get DOM elements
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const postFormSection = document.getElementById('postFormSection');
const postsContainer = document.getElementById('postsContainer');
const signupMessage = document.getElementById('signup-message');
const loginMessage = document.getElementById('login-message');

// Signup function
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const username = document.getElementById('signup-username').value; // Get username input

  if (!username) {
    signupMessage.innerHTML = "Please enter a username.";
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Store username in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      username: username
    });

    console.log('User signed up:', user);
    signupMessage.innerHTML = `Welcome, ${username}! You have successfully signed up.`;
  } catch (error) {
    console.error("Error signing up:", error.message);
    signupMessage.innerHTML = `Error: ${error.message}`;
  }
});

// Login function
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      loginMessage.innerHTML = "User data not found.";
      return;
    }

    const userData = userDoc.data();
    const username = userData.username;

    console.log('User logged in:', user);
    loginMessage.innerHTML = `Welcome back, ${username}! You are now logged in.`;
    postFormSection.style.display = 'block';  
    displayPosts();
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
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to post.');
      return;
    }

    // Fetch the username from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      alert('User data not found.');
      return;
    }

    const userData = userDoc.data();
    const username = userData.username;

    // Store post in Firestore
    await addDoc(collection(db, "posts"), {
      username: username,
      text: postText,
      timestamp: new Date()
    });

    console.log("Post added successfully");
    document.getElementById('postText').value = '';
    displayPosts();
  } catch (e) {
    console.error("Error adding post: ", e);
  }
}

// Display posts function
async function displayPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  postsContainer.innerHTML = '';  

  querySnapshot.forEach((doc) => {
    const post = doc.data();
    const postElement = document.createElement('div');
    postElement.className = 'post';

    if (post.timestamp && post.timestamp.toDate) {
      const formattedDate = post.timestamp.toDate().toLocaleString();  
      postElement.innerHTML = `
        <strong>${post.username}</strong>: ${post.text}
        <br>
        Posted on: ${formattedDate}
      `;
    } else {
      postElement.innerHTML = `
        <strong>${post.username}</strong>: ${post.text}
        <br>
        Posted on: Date not available
      `;
    }

    postsContainer.appendChild(postElement);
  });
}

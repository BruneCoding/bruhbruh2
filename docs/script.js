alert('d')
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

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

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById('signup-form');
  const loginForm = document.getElementById('login-form');
  const postFormSection = document.getElementById('postFormSection');
  const postsContainer = document.getElementById('postsContainer');
  const signupMessage = document.getElementById('signup-message');
  const loginMessage = document.getElementById('login-message');
  
  // Handle Sign Up form submission
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        signupMessage.innerHTML = `Welcome, ${user.email}! You have successfully signed up.`;
      } catch (error) {
        signupMessage.innerHTML = `Error: ${error.message}`;
      }
    });
  }

  // Handle Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        loginMessage.innerHTML = `Welcome back, ${user.email}! You are now logged in.`;
        postFormSection.style.display = 'block';
      } catch (error) {
        loginMessage.innerHTML = `Error: ${error.message}`;
      }
    });
  }

  // Handle Create Post button click
  const createPostButton = document.querySelector("button");

  if (createPostButton) {
    createPostButton.addEventListener('click', async () => {
      const postTextElement = document.getElementById('postText');
      if (!postTextElement) {
        console.error("Error: Post input field (#postText) not found.");
        return;
      }

      const postText = postTextElement.value.trim();
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

        // Add post to Firestore
        await addDoc(collection(db, "posts"), {
          userEmail: user.email,
          text: postText,
          timestamp: new Date()
        });

        // Clear the post input field after posting
        postTextElement.value = '';
      } catch (error) {
        console.error("Error adding post: ", error);
      }
    });
  }

  // Listen for new posts in real-time
  function listenForPosts() {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
      postsContainer.innerHTML = ''; // Clear posts container before adding new posts

      snapshot.forEach((doc) => {
        const post = doc.data();
        const postElement = document.createElement('div');
        postElement.className = 'post';

        const formattedDate = post.timestamp
          ? new Date(post.timestamp.seconds * 1000).toLocaleString()
          : "Date not available";

        postElement.innerHTML = `
          <strong>${post.userEmail}</strong>: ${post.text}
          <br>
          <small>Posted on: ${formattedDate}</small>
        `;

        postsContainer.appendChild(postElement);
      });
    });
  }

  // Listen for auth state changes (login or logout)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      postFormSection.style.display = 'block';
      listenForPosts(); // Start listening for posts when logged in
    } else {
      postFormSection.style.display = 'none';
    }
  });
});

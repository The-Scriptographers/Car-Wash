import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, child, push } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAC9egaN5uRkl64eftsMrcW8riKrpLVN5A",
    authDomain: "ulfsbilpleie-5b706.firebaseapp.com",
    databaseURL: "https://ulfsbilpleie-5b706-default-rtdb.firebaseio.com",
    projectId: "ulfsbilpleie-5b706",
    storageBucket: "ulfsbilpleie-5b706.firebasestorage.app",
    messagingSenderId: "175974074415",
    appId: "1:175974074415:web:b2da1ea0aecce48caa9eda",
    measurementId: "G-DBS86KKLVS"
  };
  
// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Realtime Database
const db = getDatabase(app);

// Hente elementer fra HTML
const titleInput = document.getElementById("title");
const ratingInput = document.getElementById("rating");
const reviewerInput = document.getElementById("reviewer");
const commentInput = document.getElementById("comment");
const addButton = document.getElementById("addButton");
const dataList = document.getElementById("dataList");

// Legg til data i Realtime Database når knappen trykkes
addButton.addEventListener("click", () => {
  const title = titleInput.value;
  const rating = ratingInput.value;
  const reviewer = reviewerInput.value;
  const comment = commentInput.value;

  if (title && rating && reviewer && comment) {
    const newReviewKey = push(ref(db, 'reviews')).key;  // Generer en ny unik nøkkel
    set(ref(db, 'reviews/' + newReviewKey), {
      title: title,
      rating: rating,
      reviewer: reviewer,
      comment: comment
    })
    .then(() => {
      console.log("Anmeldelse lagt til:", title);
      titleInput.value = "";
      ratingInput.value = "";
      reviewerInput.value = "";
      commentInput.value = "";
      fetchData();  // Oppdater listen med anmeldelser
    })
    .catch(error => console.error("Feil ved lagring:", error));
  } else {
    console.log("Alle felt må fylles ut!");
  }
});

// Hent data fra Realtime Database og vis i listen
function fetchData() {
  const reviewsRef = ref(db, 'reviews');
  get(reviewsRef).then(snapshot => {
    if (snapshot.exists()) {
      dataList.innerHTML = "";  // Tøm listen før oppdatering
      snapshot.forEach(childSnapshot => {
        const review = childSnapshot.val();
        const li = document.createElement("li");
        li.textContent = `Tittel: ${review.title}, Vurdering: ${review.rating}, Forfatter: ${review.reviewer}, Kommentar: ${review.comment}`;
        dataList.appendChild(li);
      });
    } else {
      console.log("Ingen anmeldelser funnet");
    }
  }).catch(error => console.error("Feil ved henting:", error));
}

// Last inn anmeldelser ved oppstart
fetchData();

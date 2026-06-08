// app.js
console.log("EVERYONE GET IN THE CAR! WE'RE LEAVING THIS! TOWN NOW! WHAT THE! NO! AHH! THIS ISN'T THE CAR! IMPOSSIBLE! NOOO! HERMIT PURPLE!!")
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    initializeFirestore,
    collection,
    query,
    orderBy,
    startAt,
    endAt,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true // Crucial for github.dev
});

const searchBtn = document.getElementById('searchBtn');
const titleInput = document.getElementById('titleInput');
const resultsDiv = document.getElementById('results');


async function searchBooks() {
    const searchTerm = titleInput.value.trim();
    if (!searchTerm) {
        resultsDiv.innerHTML = '<p class="no-results">Please enter a title to search.</p>';
        return;
    }

    resultsDiv.innerHTML = '<p class="no-results">Searching the Books collection...</p>';

    try {
        const booksRef = collection(db, "Books");
        const q = query(
            booksRef,
            orderBy("Title"),
            startAt(searchTerm),
            endAt(searchTerm + '\uf8ff')
        );

        const querySnapshot = await getDocs(q);
        resultsDiv.innerHTML = '';
        

        if (querySnapshot.empty) {
            resultsDiv.innerHTML = '<p class="no-results">No books found starting with "' + searchTerm + '".</p>';
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const bookElement = document.createElement('div');
            bookElement.className = 'book-item';
            bookElement.innerHTML = `

                    <div class="card" style="width: 18rem;">

                        <div class="card-body">
                            <h5 class="card-title">${data.Title}</h5>
                            <p class="card-text"><span class="label">Author:</span> ${data.Author || 'Unknown'}<p>
                            <p class="card-text"><span class="label">District:</span> ${data.District || 'N/A'}<p>
                            <p class="card-text"><span class="label">State:</span> ${data.State || 'N/A'}<p>
                            <a href="https://openlibrary.org/search?q=${encodeURIComponent(data.Title)}&mode=everything" class="btn btn-primary" target="_blank">Go to book's page</a>
                        </div>
                    </div>


                </div>
            `;

            resultsDiv.appendChild(bookElement);
        });
    } catch (error) {
        console.error("Firestore Search Error:", error);
        resultsDiv.innerHTML = `<p style="color: #d93025; text-align: center;">Error: ${error.message}</p>`;
    }
}

searchBtn.addEventListener('click', searchBooks);
titleInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchBooks(); });

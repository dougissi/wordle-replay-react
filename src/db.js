// db.js

const DB_NAME = "wordlereplay_db";
const DB_VERSION = 1;
let db;

export const initDB = () => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    // Create object store or schema here
    const store = db.createObjectStore("guesses", { keyPath: "puzzleNum" });
    // Define indexes or additional configuration
  };

  request.onsuccess = (event) => {
    db = event.target.result;
  };

  request.onerror = (event) => {
    console.error("Error opening IndexedDB", event.target.error);
  };
};

export const addItem = (item) => {
  const transaction = db.transaction(["guesses"], "readwrite");
  const store = transaction.objectStore("guesses");
  const request = store.add(item);

  request.onsuccess = () => {
    console.log("Item added successfully");
  };

  request.onerror = (event) => {
    console.error("Error adding item", event.target.error);
  };
};

export const getAllItems = () => {
  const transaction = db.transaction(["guesses"], "readonly");
  const store = transaction.objectStore("guesses");
  const request = store.getAll();

  request.onsuccess = () => {
    const items = request.result;
    console.log("All items:", items);
  };

  request.onerror = (event) => {
    console.error("Error getting items", event.target.error);
  };
};

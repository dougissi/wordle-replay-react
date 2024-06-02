// db.js

import { processGuessesDB, formatOldDataForIndexedDB } from "./utils";

const DB_NAME = "wordlereplay_db";
const DB_VERSION = 1;
let db;

export const initDB = (setDistributionData, setGuessesDB) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    // Create object store or schema here
    db.createObjectStore("guesses", { keyPath: "date" });
    // Define indexes or additional configuration
    // via `const store = db.createObjectStore("guesses", { keyPath: "puzzleNum" });`
  };

  request.onsuccess = (event) => {
    db = event.target.result;  // set db globally

    // copy old solved history from localStorage to indexedDB, if not already done
    const transferFlag = localStorage.getItem('transferredOldSolvedDataFlag');
    if (transferFlag !== 'true') {
      const oldData = localStorage.getItem('wordlereplay-solved');
      const newData = formatOldDataForIndexedDB(oldData);
      newData.forEach((item) => putItem(item));
      localStorage.setItem('transferredOldSolvedDataFlag', 'true');  // Set flag in localStorage to indicate transfer is done
      // TODO: consider removing old localStorage data
    }
    setSolvedStates(setDistributionData, setGuessesDB);
  };

  request.onerror = (event) => {
    console.error("Error opening IndexedDB", event.target.error);
  };
};

export const putItem = (item) => {
  const transaction = db.transaction(["guesses"], "readwrite");
  const store = transaction.objectStore("guesses");
  const request = store.put(item);

  request.onsuccess = () => {
    console.log("Put item successfully");
  };

  request.onerror = (event) => {
    console.error("Error putting item", event.target.error);
  };
};

export const getItem = (dateStr, callback) => {
  const transaction = db.transaction(["guesses"], "readwrite");
  const store = transaction.objectStore("guesses");
  const request = store.get(dateStr);

  request.onsuccess = () => {
    console.log("Got item successfully");
    callback(request.result);
  };

  request.onerror = (event) => {
    console.error("Error getting item", event.target.error);
  };
};

export const deleteItem = (dateStr) => {
  const transaction = db.transaction(["guesses"], "readwrite");
  const store = transaction.objectStore("guesses");
  const request = store.delete(dateStr);

  request.onsuccess = () => {
    console.log("Deleted item successfully");
  };

  request.onerror = (event) => {
    console.error("Error deleting item", event.target.error);
  };
};

export const setSolvedStates = (setDistributionData, setGuessesDB) => {
  const transaction = db.transaction(["guesses"], "readonly");
  const store = transaction.objectStore("guesses");
  const request = store.getAll();

  request.onsuccess = () => {
    const items = request.result;

    console.log("Retrieved all items from db");
    const [dist, guessesDB] = processGuessesDB(items);
    setDistributionData(dist);
    setGuessesDB(guessesDB);
  };

  request.onerror = (event) => {
    console.error("Error getting items", event.target.error);
  };
};

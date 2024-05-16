// db.js

import { processSolvedData, formatOldDataForIndexedDB } from "./utils";

const DB_NAME = "wordlereplay_db";
const DB_VERSION = 1;
let db;

export const initDB = (setDistributionData) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
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
      const oldData = localStorage.getItem('wordlereplay_solved');
      const newData = formatOldDataForIndexedDB(oldData);
      newData.forEach((item) => addItem(item));
      localStorage.setItem('transferredOldSolvedDataFlag', 'true');  // Set flag in localStorage to indicate transfer is done
      // TODO: consider removing old localStorage data
    }
    setSolvedStates(setDistributionData);
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

export const setSolvedStates = (setDistributionData) => {
  const transaction = db.transaction(["guesses"], "readonly");
  const store = transaction.objectStore("guesses");
  const request = store.getAll();

  request.onsuccess = () => {
    const items = request.result;

    console.log("Retrieved all items from db");
    const processedData = processSolvedData(items);  // [dist, solvedDatesSet]
    const dist = processedData[0];
    setDistributionData(dist);
  };

  request.onerror = (event) => {
    console.error("Error getting items", event.target.error);
  };
};

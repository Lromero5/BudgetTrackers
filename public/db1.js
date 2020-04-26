const request = window.indexedDB.open("budget", 1);
let db,
  tx,
  store;

request.onupgradeneeded = function(e) {
  db = request.result;
  db.createObjectStore("records", {keyPath: 'name', autoIncrement: true});
};

request.onerror = function(e) {
  console.log("There was an error");
};

request.onsuccess = function(e) {
  db = request.result;
  if (navigator.onLine) {
    checkDatabase();
  }

  db.onerror = function(e) {
    console.log("error");
  };
 
};

function saveRecord(record){
    const transaction = db.transaction("records", "readwrite");
    const store = transaction.objectStore("records");
    console.log('about to save this!', record)
    console.log('this si db!!!', db)
    console.log('thisi s our store', store)
    store.add(record);
}

function checkDatabase() {
  // open a transaction on your pending db
  const transaction = db.transaction(["records"], "readwrite");
  // access your pending object store
  const store = transaction.objectStore("records");
  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // if successful, open a transaction on your pending db
        const transaction = db.transaction(["records"], "readwrite");

        // access your pending object store
        const store = transaction.objectStore("records");

        // clear all items in your store
        store.clear();
      });
    }
  }
}
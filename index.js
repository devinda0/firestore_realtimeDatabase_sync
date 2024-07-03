const admin = require('firebase-admin');
const serviceAccount = require('./accountKey/accountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pillaid-12e10-default-rtdb.asia-southeast1.firebasedatabase.app'
});

const firestore = admin.firestore();
const realtimeDB = admin.database();


const firestoreCollection = firestore.collection('patients');

firestoreCollection.onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added' || change.type === 'modified') {
      const data = change.doc.data();
      const docId = change.doc.id;

      // Sync data to Realtime Database
      realtimeDB.ref(`patients/${docId}`).set(data);
    }
  });
});




//use below code to sync realtime database to firestore


// const testCollection = firestore.collection('test');
// const realtimeDBRef = realtimeDB.ref('test/testDoc');

// realtimeDBRef.on('child_added', snapshot => {
//     const data = snapshot.val();
//     const docId = snapshot.key;
    
//     // console.log(testCollection);
//     // // Sync data to Firestore
//     testCollection.doc(docId).set({ docId : data});
//     });

// realtimeDBRef.on('child_changed', snapshot => {
//   const data = snapshot.val();
//   const docId = snapshot.key;

//   // Sync data to Firestore
//   testCollection.doc(docId).update({docId : data});
// });

// realtimeDBRef.on('child_removed', snapshot => {
//   const docId = snapshot.key;

//   // Remove data from Firestore
//   testCollection.doc(docId).delete();
// });



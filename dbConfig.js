// const firebaseConfig = {
//     apiKey: "AIzaSyBZZBAf49ZlGA23L-Bvy8WjCzNM6KMZjkM",
//     authDomain: "sodaa-db.firebaseapp.com",
//     databaseURL: "https://sodaa-db-default-rtdb.firebaseio.com",
//     projectId: "sodaa-db",
//     storageBucket: "sodaa-db.appspot.com",
//     messagingSenderId: "558604021861",
//     appId: "1:558604021861:web:16f257bc0d1192f366968c",
//     measurementId: "G-GVM2X55F29"
// };

const firebaseConfig = {
    apiKey: env.secrets.FIREBASE_API_KEY,
    authDomain: "sodaa-db.firebaseapp.com",
    databaseURL: "https://sodaa-db-default-rtdb.firebaseio.com",
    projectId: "sodaa-db",
    storageBucket: "sodaa-db.appspot.com",
    messagingSenderId: "558604021861",
    appId: env.secrets.FIREBASE_APP_ID,
    measurementId: "G-GVM2X55F29"
};

const db = new Database("group-app", firebaseConfig);
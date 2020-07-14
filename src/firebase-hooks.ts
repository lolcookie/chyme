import firebase from "firebase";
import React, { useEffect, useState } from "react";

const provider = new firebase.auth.GoogleAuthProvider();

firebase.initializeApp({
  apiKey: "### FIREBASE API KEY ###",
  authDomain: "### FIREBASE AUTH DOMAIN ###",
  projectId: "### CLOUD FIRESTORE PROJECT ID ###"
});

const firestoreDb = firebase.firestore();

firestoreDb.collection("users").add({
  first: "Ada",
  last: "Lovelace",
  born: 1815
});

interface User {
  displayName: string;
  email: string;
  uid: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>();
  useEffect(() => {
    return firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var displayName = user.displayName || "Anon";
        var email = user.email || "no-email";
        var uid = user.uid;

        setUser({
          displayName,
          email,
          uid
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const signIn = () =>
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(result: any) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  return { user, signIn };
};

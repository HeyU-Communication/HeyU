import * as firebase from "firebase";
import "firebase/firestore";
import {Alert} from "react-native";
import 'firebase/auth';

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: 'AIzaSyD2D0ZNeoJF1nlPIBM4PBmdLPpU8GU9xcA',
        authDomain: 'heyu-812bf.firebaseapp.com',
        databaseURL: 'https://heyu-812bf.firebaseio.com',
        projectId: 'heyu-812bf',
        storageBucket: 'heyu-812bf.appspot.com',
        messagingSenderId: '197513292349',
        appId: '1:197513292349:android:f520629117a49735461854',
        measurementId: '294864492',
    });
 }else {
    firebase.app(); // if already initialized, use that one
 }

const authService = firebase.auth();
const dbService = firebase.firestore();
const storageService = firebase.storage();

export { authService, dbService, storageService }

export async function fetchProfile(accountId, country, school) {
    try {
        firebase.firestore().collection("profile").doc(country).collection(school).doc(accountId).onSnapshot((querySnapshot) => {
            if (querySnapshot.exists) {
                return querySnapshot.data();
            }
        })
    }
    catch (err) {
        Alert.alert("콩쥐야 ㅈ됬어", err.message);
    }
}

export async function fetchSchedule(accountId, country, school) {
    try {
        firebase.firestore().collection("profile").doc(country).collection(school).doc(accountId).collection("regular").onSnapshot((querySnapshot) => {
            firebase.firestore().collection('profile').doc(country).collection(school).doc(accountId).collection('episodic').onSnapshot((querySnapshot2) => {
                
                if (querySnapshot.exists) {
                    console.log('arrive3d here')
                }
                if (querySnapshot.exists) {
                    return querySnapshot.data();
                }
            })
            
        })
    }
    catch (err) {
        Alert.alert("콩쥐야 ㅈ됬어", err.message);
    }
}

export async function createSchedule(accountId, country, school) {
    try {

    }
    catch (err) {
        Alert.alert("콩쥐야 ㅈ됬어", err.message);
    }
}

export async function registration(email, password, lastName, firstName) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;

    const db = firebase.firestore();
    db.collection("users")
      .doc(currentUser.uid)
      .set({
        email: currentUser.email,
        lastName: lastName,
        firstName: firstName,
      });
  } catch (err) {
    Alert.alert("콩쥐야 ㅈ됬어", err.message);
  }
}

export async function signIn(email, password) {
  try {
   await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
  } catch (err) {
    Alert.alert("콩쥐야 ㅈ됬어", err.message);
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('콩쥐야 ㅈ됬어', err.message);
  }
}
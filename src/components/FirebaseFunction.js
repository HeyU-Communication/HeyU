import firebase from "firebase";
import "firebase/firestore";
import {Alert} from "react-native";
import 'firebase/auth';
import { NavigationContainer } from "@react-navigation/native";
import { processEpisodicFromToday, processRegularFromToday, sortEachDays, sortIntoDays } from "./TaskProcess";

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
} 
else {
    firebase.app(); // if already initialized, use that one
}

const authService = firebase.auth();
const dbService = firebase.firestore();
const storageService = firebase.storage();

export { authService, dbService, storageService }

export async function fetchProfile(accountId, country, school) {
    try {
        dbService
        .collection("profile").doc(country)
        .collection(school).doc(accountId)
        .onSnapshot((querySnapshot) => {
            if (querySnapshot.exists) {
                return querySnapshot.data();
            }
        })
    }
    catch (err) {
        Alert.alert("콩쥐야 ㅈ됬어", err.message);
        return null;
    }
}

export async function fetchSchedule(uid, country, university, setter) {
    try {
        let myScheduleData = [];
        let nowDate = new Date();
        dbService.collection("profile").doc(country).collection(university).doc(uid).collection("regular").where('repEndDate', '>', nowDate).onSnapshot(async (querySnapshot) => {
            const regularData = [];
            querySnapshot.forEach(doc => {
                regularData.push(doc.data());
            })
            dbService.collection('profile').doc(country).collection(university).doc(uid).collection('episodic').where('endDate', '>', nowDate).onSnapshot(async (querySnapshot2) => {
                const episodicData = [];
                querySnapshot2.forEach(doc => {
                    const tempData = doc.data();
                    episodicData.push(tempData);
                })
                //Process regular schedules
                const regData = await processRegularFromToday(regularData);
                //Process epidosic schedules
                const epiData = await processEpisodicFromToday(episodicData);
                myScheduleData = regData.concat(epiData)
                myScheduleData = sortIntoDays(myScheduleData);
                myScheduleData = sortEachDays(myScheduleData);
                setter(myScheduleData)
                return myScheduleData;
            })
        })
    }
    catch (err) {
        Alert.alert("콩쥐야 ㅈ됬어", err.message);
        return [];
    }
}

export async function createSchedule(accountId, country, school) {
    try {

    }
    catch (err) {
        Alert.alert("콩쥐야 ㅈ됬어", err.message);
    }
}

export async function createPost(accountId, country, school, boardId) {

}

export async function registration(email, password) {
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        const currentUser = firebase.auth().currentUser;

        const db = firebase.firestore();
        db.collection("users")
        .doc(currentUser.uid)
        .set({
            email: currentUser.email,
            name: name
        });
    } catch (err) {
        Alert.alert("콩쥐야 ㅈ됬어", err.message);
    }
}

export async function signIn(email, password, country, school, setter, failCallback) {
  try {
        firebase.auth().signInWithEmailAndPassword(email, password).then(userCredential => {
            const user = userCredential.user;
            fetchSchedule(user.uid, country, school, setter)
        })
  } catch (err) {
        failCallback(true);
        return false;
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    Alert.alert('콩쥐야 ㅈ됬어', err.message);
  }
}

export async function getUniversities(setter) {
    try {
        dbService.collection('universities').onSnapshot(querySnapshot => {
            const univs = [];
            querySnapshot.forEach(element => {
                univs.push(element.data());
            })
            setter(univs)
        })
    } catch (err) {
        Alert.alert('콩쥐야 ㅈ됬어', err.message)
    }
}
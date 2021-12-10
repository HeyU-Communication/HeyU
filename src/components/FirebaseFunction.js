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

export async function fetchSchedule(accountId, country, school, setter) {
    const sortIntoDays = (scheduleData) => {
        const finalData = [[],[],[],[],[],[],[]]
        for (let i = 0; i < scheduleData.length; i++) {
            finalData[scheduleData[i].day].push(scheduleData[i]);
        }
        return finalData;
    }

    const sortEachDays = (a, b) => {
        if (a.time[0] > b.time[0]) {
            return 1;
        }
        else if (a.time[0] < b.time[0]) {
            return -1;
        }
        else {
            if (a.time[1] > b.time[1]) {
                return 1;
            }
            else if (a.time[1] < b.time[1]) {
                return -1;
            }
            else {
                return 0
            }
        }
    }

    try {
        let myScheduleData = [];
        dbService.collection("profile").doc(country).collection(school).doc(accountId).collection("regular").onSnapshot((querySnapshot) => {
            const regularData = [];
            querySnapshot.forEach(doc => {
                regularData.push(doc.data());
            })
            dbService.collection('profile').doc(country).collection(school).doc(accountId).collection('episodic').onSnapshot(async (querySnapshot2) => {
                const episodicData = [];
                querySnapshot2.forEach(doc => {
                    const tempData = doc.data();
                    episodicData.push(tempData);
                })
                //Process regular schedules
                const currentDay = new Date(Date.now()).getDay()
                for (let i = 0 ; i < regularData.length; i++) {
                    const days = regularData[i].day;
                    let moduleData = null;
                    if (! regularData[i].isPersonal) {
                        moduleData = await regularData[i].moduleData.get()
                        if (moduleData.exists) {
                            moduleData = moduleData.data();
                        }
                    }
                    for (let j = 0; j < days.length; j++) {
                        let tempDay = -1;
                        if (days[j] < currentDay) {
                            tempDay = 7 - days[j] + 1;
                        }
                        else {
                            tempDay = days[j] - currentDay
                        }
                        myScheduleData.push({
                            description: regularData[i].description,
                            title: regularData[i].title,
                            time: regularData[i].time,
                            moduleData: moduleData,
                            isPersonal: regularData[i].isPersonal,
                            day: tempDay,
                            venue: regularData[i].venue
                        })
                    }
                }
                //Process epidosic schedules
                for (let i = 0; i < episodicData.length; i++) {
                    let startDate = new Date(episodicData[i].startTime.seconds * 1000);
                    let endDate = new Date(episodicData[i].endTime.seconds * 1000);

                    let day = -1;
                    if (startDate.getDay() >= currentDay) {
                        day = startDate.getDay() - currentDay;
                    }
                    else {
                        day = 7 - startDate.getDay();
                    }

                    let startTime = startDate.getHours();
                    let endTime = endDate.getHours();

                    let startMinute = startDate.getMinutes();
                    let endMinute = endDate.getMinutes();

                    let startNumber = (startTime * 100) + startMinute;
                    let endNumber = (endTime * 100) + endMinute;

                    let timeData = [startNumber, endNumber];

                    let moduleData = episodicData[i].isPersonal ? null : episodicData[i].moduleData
                    myScheduleData.push({
                        description: episodicData[i].description,
                        title: episodicData[i].title,
                        time: timeData,
                        moduleData: moduleData,
                        isPersonal: episodicData[i].isPersonal,
                        day: day,
                        venue: episodicData[i].venue
                    })
                }
                myScheduleData = sortIntoDays(myScheduleData);
                myScheduleData = myScheduleData.map(element => element.sort(sortEachDays));
                setter(myScheduleData);
            })
        })
    }
    catch (err) {
        Alert.alert("콩쥐야 ㅈ됬어", err.message);
        return null;
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
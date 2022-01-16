import firebase from "firebase";
import "firebase/firestore";
import {Alert} from "react-native";
import 'firebase/auth';
import { NavigationContainer } from "@react-navigation/native";

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

    const countPrevDay = (tempDate) => {
        let date = tempDate.getDate();
        return Math.ceil(date / 7);
    }
    
    const isSameDay = (date1, date2) => {
        if (date1.getFullYear() != date2.getFullYear()) {
            return false;
        }
        else if (date1.getMonth() != date2.getMonth()) {
            return false;
        }
        else if (date1.getDate() != date2.getDate()) {
            return false;
        }
        else {
            return true;
        }
    }

    const daysBetween = (start, end) => {
        const date1 = makeDummyDateCopy(start);
        const date2 = makeDummyDateCopy(end);
        const between = date2 - date1;
        return Math.round(between / (1000 * 60 * 60 * 24))
    }

    const makeDummyDateCopy = (date) => {
        const dummy = new Date();
        dummy.setFullYear(date.getFullYear());
        dummy.setMonth(date.getMonth());
        dummy.setDate(date.getDate());
        dummy.setHours(0);
        dummy.setMinutes(0);
        dummy.setSeconds(0);
        return dummy;
    }

    function makeNumberTime(date) {
        const hour = date.getHours();
        const minute = date.getMinutes();
        return (hour * 100) + minute;
    }

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
                for (let i = 0 ; i < regularData.length; i++) {
                    console.log('regular')
                    let startDate = new Date(regularData[i].startDate.seconds * 1000);
                    let endDate = new Date(regularData[i].endDate.seconds * 1000)
                    if (regularData[i].repetition == 'daily') {
                        console.log("Daily")
                        let category = {}; 
                        let cat = await regularData[i].category.get()
                        category = cat.data();
                        for (let j = 0; j < 7; j++) {
                            myScheduleData.push({
                                description: regularData[i].description,
                                title: regularData[i].title,
                                time: makeNumberTime(startDate, endDate),
                                category: category,
                                day: j,
                                venue: regularData[i].venue
                            });
                        }
                    }
                    else if (regularData[i].repetition == 'weekly') {
                        console.log("Weekly")
                        let category = {};
                        let now = new Date();
                        let tempStart = new Date(regularData[i].startDate.seconds * 1000)
                        let tempEnd = new Date(regularData[i].endDate.seconds * 1000)
                        let cat = await regularData[i].category.get()
                        category = cat.data();
                        for (let j = 0; j < 7; j++) {
                            if (tempStart.getDay() <= now.getDay() || tempEnd.getDay() >= now.getDay()) {
                                let time = [];

                                if (now.getDay() == tempStart.getDay()) {
                                    time[0] = makeNumberTime(tempStart);
                                }
                                else {
                                    time[0] = '전 날';
                                }

                                if (now.getDay() == tempEnd.getDay()) {
                                    time[1] = makeNumberTime(tempEnd);
                                }
                                else {
                                    time[1] = '다음 날'
                                }
                                myScheduleData.push({
                                    description: regularData[i].description,
                                    title: regularData[i].title,
                                    time: time,
                                    category: category,
                                    day: now.getDay() < nowDate.getDay() ? 7 + now.getDay() - nowDate.getDay() : now.getDay() - nowDate.getDay(),
                                    venue: regularData[i].venue
                                });
                            }
                            now.setDate(now.getDate() + 1)
                        }
                    }
                    else if (regularData[i].repetition == 'biweekly') {
                        console.log("Biweekly")
                        let category = {};
                        let now = new Date();
                        let tempStart = makeDummyDateCopy(new Date(regularData[i].startDate.seconds * 1000)); 
                        let tempEnd = makeDummyDateCopy(new Date(regularData[i].endDate.seconds * 1000));
                        let ang = new Date(regularData[i].endDate.seconds * 1000)
                        ang.setDate(ang.getDate() + 1);
                        let cat = await regularData[i].category.get()
                        category = cat.data();
                        let counter = 0;
                        let initiator = false;
                        let between = daysBetween(tempStart, tempEnd);
                        counter = Math.floor(((now - tempStart) % (1000 * 60 * 60 * 24 * 14)) / (1000 * 60 * 60 * 24));
                        Alert.alert(between.toString(), counter.toString())
                        for (let j = 0; j < 7; j++) {
                            if (((now - tempStart) % (1000 * 60 * 60 * 24 * 14)) <= tempEnd - tempStart || (initiator && counter <= between)) {
                                initiator = true;
                                let time = [];
                                counter++;
                                if (counter == 1) {
                                    time[0] = makeNumberTime(new Date(regularData[i].startDate.seconds * 1000));
                                }
                                else {
                                    time[0] = '전 날';
                                }

                                if (counter == between + 1) {
                                    time[1] = makeNumberTime(new Date(regularData[i].endDate.seconds * 1000));
                                }
                                else {
                                    time[1] = '다음 날'
                                }

                                myScheduleData.push({
                                    description: regularData[i].description,
                                    title: regularData[i].title,
                                    time: time,
                                    category: category,
                                    day: now.getDay() < nowDate.getDay() ? 7 + now.getDay() - nowDate.getDay() : now.getDay() - nowDate.getDay(),
                                    venue: regularData[i].venue
                                });
                            }
                            now.setDate(now.getDate() + 1);
                            now.setHours(0);
                            now.setMinutes(0);
                        }
                    }
                    else if (regularData[i].repetition == 'monthly') {
                        console.log("Monthly")
                        let category = {};
                        let now = new Date();
                        let nowMonth = now.getMonth();
                        let tempStart = new Date(regularData[i].startDate.seconds * 1000)
                        let tempEnd = new Date(regularData[i].endDate.seconds * 1000)
                        let startDay = tempStart.getDay()
                        let startDayOrder = countPrevDay(tempStart);
                        if (startDayOrder == 5) {
                            let temp1 = new Date();
                            temp1.setMonth(temp1.getMonth() + 1);
                            temp1.setDate(0);
                            for (let i = temp1.getDate(); i > temp1.getDate() - 7; i--) {
                                temp1.setDate(i);
                                if (temp1.getDay() == startDay && countPrevDay(temp1) != 5) {
                                    startDayOrder = 4;
                                    break;
                                }
                                temp1.setDate(temp1.getDate() - 1);
                            }
                        }
                        let thisMonthStart = new Date();
                        
                        thisMonthStart.setDate(1);
                        for (let i = 0; i < 31; i++) {
                            let tempOrder = countPrevDay(thisMonthStart);
                            let tempDay = thisMonthStart.getDay();
                            if (tempOrder == startDayOrder && tempDay == startDay) {
                                break;
                            }
                            else {
                                thisMonthStart.setDate(thisMonthStart.getDate() + 1);
                            }
                            if (thisMonthStart.getMonth() != nowMonth) {
                                break;
                            }
                        }

                        let duration = daysBetween(tempStart, tempEnd);
                        
                        let startRecording = false;
                        let counter = duration;

                        let cat = await regularData[i].category.get()
                        category = cat.data();
                        for (let j = 0; j < 7; j++) {
                            let temp = new Date();
                            temp.setDate(thisMonthStart.getDate() + duration)
                            if(now > thisMonthStart && temp > now) 
                            {
                                startRecording = true;
                            }
                            if (startRecording && counter >= 0) {
                                
                                let time = [0, 0];

                                if (counter == duration) {
                                    time[0] = makeNumberTime(tempStart);
                                }
                                else {
                                    time[0] = '전 날';
                                }

                                if (counter == 1) {
                                    time[1] = makeNumberTime(tempEnd);
                                }
                                else {
                                    time[1] = '다음 날'
                                }

                                myScheduleData.push({
                                    description: regularData[i].description,
                                    title: regularData[i].title,
                                    time: time,
                                    category: category,
                                    day: now.getDay() < nowDate.getDay() ? 7 + now.getDay() - nowDate.getDay() : now.getDay() - nowDate.getDay(),
                                    venue: regularData[i].venue
                                });
                                counter--;
                            }
                            now.setDate(now.getDate() + 1)
                            now.setHours(0);
                            now.setMinutes(0);    
                        }
                    }
                }
                //Process epidosic schedules
                for (let i = 0; i < episodicData.length; i++) {
                    let startDate = new Date(episodicData[i].startDate.seconds * 1000);
                    let endDate = new Date(episodicData[i].endDate.seconds * 1000);
                    console.log('episodic')
                    let now = new Date();
                    let category = {};
                    let cat = await episodicData[i].category.get()
                    category = cat.data();
                    for (let j = 0; j < 7; j++) {
                        if ((now > startDate || isSameDay(now, startDate)) && (now < endDate || isSameDay(now, endDate))) {
                            let time = [];

                            if (isSameDay(now, startDate)) {
                                time[0] = makeNumberTime(startDate);
                            }
                            else {
                                time[0] = '전 날';
                            }

                            if (isSameDay(now, endDate)) {
                                time[1] = makeNumberTime(endDate);
                            }
                            else {
                                time[1] = '다음 날'
                            }

                            myScheduleData.push({
                                description: episodicData[i].description,
                                title: episodicData[i].title,
                                time: time,
                                category: category,
                                isPersonal: episodicData[i].isPersonal,
                                day: now.getDay() < nowDate.getDay() ? 7 + now.getDay() - nowDate.getDay() : now.getDay() - nowDate.getDay(),
                                venue: episodicData[i].venue
                            })
                        }
                        now.setDate(now.getDate() + 1);
                        now.setHours(0);
                        now.setMinutes(1);
                    }
                }
                myScheduleData = sortIntoDays(myScheduleData);
                myScheduleData = myScheduleData.map(element => element.sort(sortEachDays));
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
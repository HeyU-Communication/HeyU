import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Async, ScrollView, Alert } from 'react-native';
import months from '../components/months';
import days from '../components/days';
import * as Storage from '../components/Storage'
import Event from './Event';
import { dbService } from '../components/FirebaseFunction';

const setItem = Storage.default.setItem;
const getItem = Storage.default.getItem;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function HomeScreen({route, navigation}) {
    let [selectedDay, setSelectedDay] = useState(0);
    let [schedule, setSchedule] = useState([[],[],[],[],[],[],[]]);

    const { accountId, country, school } = route.params;
    
    useEffect(() => {
        const getData = async () => {
            try {
                const value = await getItem('lastUpdated')
                if (value == null) {
                    const storeLastUpdated = async () => {
                        try {
                            await setItem("lastUpdated", Date.now().toString());
                        }
                        catch (err) {
                            Alert.alert("콩쥐야 ㅈ됬어", err.message);
                        }
                    }
                    const storeSchedule = async () => {
                        try {
                            await setItem("schedule", JSON.stringify([[],[],[],[],[],[],[]]));
                        }
                        catch (err) {
                            Alert.alert("콩쥐야 ㅈ됬어", err.message);
                        }
                    }
                    storeLastUpdated();
                    storeSchedule();
                    return null;
                }
                else {
                    const storeData = async () => {
                        try {
                            await setItem("lastUpdated", Date.now().toString());
                        }
                        catch (err) {
                            Alert.alert("콩쥐야 ㅈ됬어", err.message);
                        }
                    }
                    storeData();
                    let myScheduleData = [];
                    let myProfileData = [];
                    dbService
                        .collection("profile").doc(country)
                        .collection(school).doc(accountId)
                        .onSnapshot((querySnapshot) => {
                            if (querySnapshot.exists) {
                                myProfileData = querySnapshot.data();
                            }
                    })
                    try {
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
                                    if (startDate.getDay() > currentDay) {
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
                                //store raw data into local storage
                                const storeSchedule = async () => {
                                    try {
                                        await setItem('schedule', JSON.stringify(myScheduleData));
                                    }
                                    catch (err) {
                                        Alert.alert(err.message);
                                    }
                                }
                                storeSchedule();
                                myScheduleData = sortIntoDays(myScheduleData);
                                myScheduleData = myScheduleData.map(element => element.sort(sortEachDays));
                                setSchedule(createElement(myScheduleData));
                                return null;
                            })
                            
                        })
                    }
                    catch (err) {
                        Alert.alert("콩쥐야 ㅈ됬어", err.message);
                    }
                }
            } catch(err) {
                Alert.alert("콩쥐야 ㅈ됬어", err.message);
            }
        }
        getData();
    }, [])

  const tempDate = new Date();
  const date = tempDate.getDate();
  const month = tempDate.getMonth();
  const year = tempDate.getFullYear();

  const onPressAddTask = () => {};

    const sortIntoDays = (scheduleData) => {
        const finalData = [[],[],[],[],[],[],[]]
        for (let i = 0; i < scheduleData.length; i++) {
            finalData[scheduleData[i].day].push(scheduleData[i]);
        }
        return finalData;
    }

    const sortEachDays = (a, b) => {
        if (a.time[0] > b.time[0]) {
            return -1;
        }
        else if (a.time[0] < b.time[0]) {
            return 1;
        }
        else {
            if (a.time[1] > b.time[1]) {
                return -1;
            }
            else if (a.time[1] < b.time[1]) {
                return 1;
            }
            else {
                return 0
            }
        }
    }

    const createElement = (scheduleData) => {
        const finalData = [[],[],[],[],[],[],[]]
        for (let i = 0; i < scheduleData.length; i++) {
            let dailySchedule = [];
            const dailyData = scheduleData[i];
            for (let j = 0; j < dailyData.length; j++) {
                const isNow = checkNow(i, dailyData[j]['time'][0], dailyData[j]['time'][1]);
                const category = dailyData[j].isPersonal ? 'Personal' : dailyData[j].moduleData.moduleCode
                dailySchedule.push(<Event current={isNow} name={dailyData[j]['title']} venue={dailyData[j]['venue']} startTime={dailyData[j]['time'][0]} endTime={dailyData[j]['time'][1]} category={category}/>)
            }
            finalData[i] = dailySchedule;
        }
        return finalData;
    }

    const dateData = [];
    for (let i = 0; i < 7; i++) {
        const thisDate = new Date();
        thisDate.setDate(date + i);
        dateData[i] = {
            order: i,
            date: thisDate.getDate(),
            month: thisDate.getMonth(),
            year: thisDate.getFullYear(),
            day: days[thisDate.getDay()],
        }
    }

    function checkNow(i, startTime, endTime) {
        if (i !== selectedDay) {
            return false;
        }
        else {
            if (tempDate.getHours() < Math.floor(startTime / 100) || tempDate.getHours() > Math.floor(endTime / 100)) {
                return false;
            }
            else if (tempDate.getHours() == Math.floor(startTime / 100) && tempDate.getMinutes() < startTime % 100) {
                return false;
            }
            else if (tempDate.getHours() == Math.floor(endTime / 100) && tempDate.getMinutes() > endTime % 100) {
                return false;
            }
            else {
                return true;
            }
        }
    }

    let key = -1;

    return (
        <View>
            <Text style={styles.date}>{date}{date % 10 === 1 ? "st" : date % 10 === 2 ? 'nd' : date % 10 === 3 ? 'rd' : 'th'} {months[month]} {year}</Text>
            <Text style={styles.scheduleText}>Schedule</Text>
            <TouchableOpacity style={styles.addTask} onPress={onPressAddTask}><Text style={styles.addTaskText}>+ Add Tasks</Text></TouchableOpacity>
            <View style={styles.dateBar}>
                {dateData.map((element) => {
                    const onPress = () => {
                        setSelectedDay(element['order']);
                    }
                    key = key + 1;
                    return <TouchableOpacity key={key} onPress={onPress} style={selectedDay === element['order'] ? styles.selectedDateObject : styles.dateObject}><Text style={selectedDay === element['order'] ? styles.selectedBarDay: styles.day}>{element['day']}</Text><Text style={selectedDay === element['order'] ? styles.selectedBarDate: styles.barDate}>{element['date']}</Text></TouchableOpacity>
                })}
            </View>
            <View style={styles.verticalBar} />    
            <View style={styles.dot} />
            <ScrollView style={styles.dailySchedule}>
                
                {schedule[selectedDay]}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    date: {
        position: 'absolute',
        left: 10,
        top: 20,
    },
    scheduleText: {
        position: 'absolute',
        left: 10,
        top: 45,
    },
    addTask: {
        width: 150,
        height: 50,
        position: 'absolute',
        right: 10,
        top: 20,
        borderBottomRightRadius: 25,
        borderBottomLeftRadius: 25,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#EFD000'
    },
    addTaskText: {
        position: 'absolute',
        top: 15,
        left: 0,
        width: '100%',
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold', 
        fontFamily: 'Alef',
    },
    dateBar: {
        position: 'absolute',
        left: 0,
        top: 100,
        height: 75,
        width: '100%',
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#FFE851'
    },
    dateObject: {
        flex: 1,
    },
    selectedDateObject: {
        flex: 1,
        backgroundColor: "#FFE851"
    },
    selectedBarDay: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        left: 0,
        top: 10,
        fontWeight: 'bold'
    },
    day: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        left: 0,
        top: 10,
    },
    barDate: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        left: 0,
        top: 40,
    },
    selectedBarDate: {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        left: 0,
        top: 40,
        fontWeight: 'bold'
    },
    verticalBar: {
        position: 'absolute',
        height: height,
        width: 7,
        left: '5%',
        backgroundColor: '#FFDE00',
        top: 205,
        zIndex: 1,
    },
    dot: {
        width: 20,
        height: 20,
        zIndex: 2,
        position: 'relative',
        left: '3.5%',
        top: 195,
        backgroundColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomColor: "#FFDE00",
        borderTopColor: '#FFDE00',
        borderRightColor: "#FFDE00",
        borderLeftColor: '#FFDE00',
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderRightWidth: 2,
    },
    dailySchedule: {
        position: 'absolute',
        top: 175,
        left: 0,
        width: '100%',
        height: height - 240,
        zIndex: 1, 
    }
})


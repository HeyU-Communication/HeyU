import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, BackHandler, ScrollView, Alert, TextInput } from 'react-native';
import months from '../components/months';
import days from '../components/days';
import * as Storage from '../components/Storage'
import Event from './Event';
import AddTask from './AddTask';
import { dbService, fetchSchedule } from '../components/FirebaseFunction';
import Modal from "react-native-modal";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { getCalendarDateString } from 'react-native-calendars/src/services';
import { assertLiteral } from '@babel/types';
import { useFocusEffect } from '@react-navigation/native';

const setItem = Storage.default.setItem;
const getItem = Storage.default.getItem;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function HomeScreen({route, navigation}) {
    let [selectedDay, setSelectedDay] = useState(0);
    let [schedule, setSchedule] = useState([[],[],[],[],[],[],[]]);
    let [addOpen, setAddOpen] = useState(false);
    let [isFirstFocus, setIsFirstFocus] = useState(true);
    console.log(route.params)
    const { accountId, country, university, scheduleProps, /*authProps*/ } = route.params;

    const setterFunc = (schedule) => {
        if (schedule === undefined || schedule === null) {
            setSchedule(createElement([]));
        }
        setSchedule(createElement(schedule))
    }

    useFocusEffect(React.useCallback(() => {
        const backAction = () => {
            if (addOpen) {
                setAddOpen(false);
                Alert.alert("Ssibal")
            }
            else {
                Alert.alert("잠깐!", "정말 앱을 종료하시겠습니까?", [
                    {
                      text: "아니요",
                      onPress: () => null,
                      style: "cancel"
                    },
                    { text: "네", onPress: () => BackHandler.exitApp() }
                ]);
                return true;
            }
          };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress", backAction
        );
        setSchedule(createElement(scheduleProps));
        const timer = setInterval(async () => {
            const schedule = await fetchSchedule(accountId, country, university, setterFunc)
            //setterFunc(schedule);
        }, 6 * 1000)
        return () => {
            clearInterval(timer);
            backHandler.remove();
        }
    }, []))

    const onPressAddTask = () => {
        setAddOpen(true);
    };

    const createElement = (scheduleData) => {
        const finalData = [[],[],[],[],[],[],[]]
        for (let i = 0; i < scheduleData.length; i++) {
            let dailySchedule = [];
            const dailyData = scheduleData[i];
            for (let j = 0; j < dailyData.length; j++) {
                const isNow = checkNow(i, dailyData[j]['time'][0], dailyData[j]['time'][1]);
                const category = dailyData[j]['category'].name
                dailySchedule.push(<Event current={isNow} name={dailyData[j]['title']} venue={dailyData[j]['venue']} startTime={dailyData[j]['time'][0]} endTime={dailyData[j]['time'][1]} category={category}/>)
            }
            finalData[i] = dailySchedule;
        }
        return finalData;
    }
    
    function checkNow(i, startTime, endTime) {
        const tempDate = new Date();
        if (i !== 0) {
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

    const tempDate = new Date();
    const date = tempDate.getDate();
    const month = tempDate.getMonth();
    const year = tempDate.getFullYear();
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

    let key = -1;

    return (
        <View>
            <AddTask isVisible={addOpen} closeModal={() => setAddOpen(false)} university={university} country={country} accountId={accountId} />
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
        backgroundColor: '#F5DF4D',
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
        zIndex: 3, 
    },
    addTaskDetails: {
        left: 20,
        fontFamily: 'Content',
        fontSize: 16,
        marginTop: 10,
    },
    eventTitle: {
        color: 'black',
        fontFamily: 'Content',
        fontSize: 12,
        left: 10,
        backgroundColor: '#E1E1E1',
        padding: 0,
        height: 40,
        width: (width * 0.85) - 10,
        paddingLeft: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    eventDates: {
        fontFamily: 'Content',
        left: 10,
        marginTop: 10,
    },
    startDateButton: {
        backgroundColor: '#E1E1E1',
        height: 30,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        marginTop: 10,
        marginLeft: 20,
        width: 150,
    },
    startDateButtonText: {
        lineHeight: 30,
        textAlign: 'center'
    },
    endDateButton: {
        marginTop: 10,
        width: 150,
        backgroundColor: '#E1E1E1',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        height: 30,
    },
    endDateButtonText: {
        lineHeight: 30,
        textAlign: 'center'
    }
})


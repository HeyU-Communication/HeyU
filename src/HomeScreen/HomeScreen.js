import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, BackHandler, ScrollView, Alert } from 'react-native';
import months from '../components/months';
import days from '../components/days';
import * as Storage from '../components/Storage'
import Event from './Event';
import { fetchSchedule } from '../components/FirebaseFunction';

const setItem = Storage.default.setItem;
const getItem = Storage.default.getItem;

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function HomeScreen({route, navigation}) {
    let [selectedDay, setSelectedDay] = useState(0);
    let [schedule, setSchedule] = useState([[],[],[],[],[],[],[]]);

    const { accountId, country, university, scheduleProps, /*authProps*/ } = route.params;

    const setterFunc = (schedule) => {
        setSchedule(createElement(schedule))
    }


    useEffect(() => {
        const backAction = () => {
            Alert.alert("잠깐!", "정말 앱을 종료하실건가요?", [
              {
                text: "아니요",
                onPress: () => null,
                style: "cancel"
              },
              { text: "네", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
          };
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
        setSchedule(createElement(scheduleProps));
        const timer = setInterval(async () => {
            console.log("updated")
            const schedule = await fetchSchedule(accountId, country, university);
            setterFunc(schedule);
        }, 60 * 1000)

        return () => {
            clearInterval(timer);
            backHandler.remove();
        }
    }, [])

    const onPressAddTask = () => {};

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
        zIndex: 3, 
    }
})


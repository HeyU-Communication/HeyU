import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Async, ScrollView } from 'react-native';
import months from '../components/months';
import days from '../components/days';
import storage from '../components/Storage'
import Event from './Event'

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function HomeScreen({navigation}) {
    let [selectedDay, setSelectedDay] = useState(0);
    
    useEffect(() => {
        console.log("Loaded");
    })

    const tempDate = new Date();
    const date = tempDate.getDate();
    const month = tempDate.getMonth();
    const year = tempDate.getFullYear();

    const onPressAddTask = () => {

    }
    /*
    storage.load({
        key: 'lastUpdated',
        autoSync: true,
        syncInBackground: true,
    }).then((data) => {
        if (new Date(data).getDate() < new Date().getDate()) {
            //some sync function
        }
    })
    const scheduleData = [[],[],[],[],[],[],[]];
    storage.load({
        key: 'schedule',
        autoSync: true,
        syncInBackground: true,
    }).then((data) => {
        for (let i = 0; i < data.length; i++) {
            scheduleData[data[i]['day']].append(data[i]);
        }
    })
    for (let i = 0; i < scheduleData.length; i++) {
        const temp = scheduleData[i];
        scheduleData[i] = temp.sort((a, b) => {
            if (a['time'][0] > b['time'][0]) {
                return 1;
            }
            else if (a['time'][0] > b['time'][0]) {
                return -1;
            }
            else {
                return 0;
            }
        })
    }
    */
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

    const scheduleData = [];
    for (let i = 0; i < 7; i++) {
        const dailyData = []; //something
        const dailySchedule = [];
        for (let j = 0; j < dailyData.length; j++) {
            const isNow = checkNow(i, dailyData[j]['startTime'], dailyData[j]['endTime']);
            dailySchedule[j] = <Event current={isNow} name={'Lecture'} venue={'COM2'} startTime={1400} endTime={1600} category={"CS1231S"}/>
        }
        scheduleData[i] = dailySchedule;
    }

    return(
        <View>
            <Text style={styles.date}>{date}{date % 10 === 1 ? "st" : date % 10 === 2 ? 'nd' : date % 10 === 3 ? 'rd' : 'th'} {months[month]} {year}</Text>
            <Text style={styles.scheduleText}>Schedule</Text>
            <TouchableOpacity style={styles.addTask} onPress={onPressAddTask}><Text style={styles.addTaskText}>+ Add Tasks</Text></TouchableOpacity>
            <View style={styles.dateBar}>
                {dateData.map((element) => {
                    const onPress = () => {
                        setSelectedDay(element['order']);
                    }
                    return <TouchableOpacity onPress={onPress} style={selectedDay === element['order'] ? styles.selectedDateObject : styles.dateObject}><Text style={selectedDay === element['order'] ? styles.selectedBarDay: styles.day}>{element['day']}</Text><Text style={selectedDay === element['order'] ? styles.selectedBarDate: styles.barDate}>{element['date']}</Text></TouchableOpacity>
                })}
            </View>
            {scheduleData[selectedDay]}
            <ScrollView style={styles.dailySchedule}>
                <Event current={false} name={'Lecture'} venue={'COM2'} startTime={1400} endTime={1600} category={"CS1231S"}/>
                <Event current={false} name={'Tutorial'} venue={'COM1'} startTime={1600} endTime={1800} category={'일상'}/>
                <Event current={false} name={'Tutorial'} venue={'COM1'} startTime={1600} endTime={1800} category={'일상'}/>
                <Event current={true} name={'Tutorial'} venue={'COM1'} startTime={1600} endTime={1800} category={'일상'}/>
                <Event current={false} name={'Tutorial'} venue={'COM1'} startTime={1600} endTime={1800} category={'일상'}/>
                <Event current={false} name={'Tutorial'} venue={'COM1'} startTime={1600} endTime={1800} category={'일상'}/>
                <Event current={false} name={'Tutorial'} venue={'COM1'} startTime={1600} endTime={1800} category={'일상'}/>
                <Event current={false} name={'Tutorial'} venue={'COM1'} startTime={1600} endTime={1800} category={'일상'}/>
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
    dailySchedule: {
        position: 'absolute',
        top: 175,
        left: 0,
        width: '100%',
        height: height - 272,
    }
})
import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { Text, View, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Divider } from 'react-native-elements/dist/divider/Divider';
import { dbService, authService, fetchSchedule } from '../components/FirebaseFunction';
import Calendar from './Calender';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { processEpisodicFromToday, processRegularFromToday, sortEachDays, sortIntoDays, processRegular, processEpisodic } from '../components/TaskProcess';
import { genTimeBlock } from 'react-native-timetable';
import days from '../components/days';

const friends = ['지원', '진', '김재혁', '민구', '종현'];
const schedule  = {
    CS2030S: {
        Lecture: '1',
        Lab: '14A',
        Recitation: '04'
    },
    CS2040S: {
        Lecture: '1',
        Tutorial: '13',
        Recitation: '05',
    },
    GEA1000: {
        Lecture: '1',
        Tutorial: 'D08',
    },
    GESS1037: {
        Lecture: '1',
        Tutorial: 'D3',
    },
    IS1103: {

    },
    ST2334: {
        Lecture: '1',
        Tutorial: '17',
    }
};


export default function ScheduleScreen(props) {
    const [friendElements, setFriendElements] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(0);
    const [calenderElements, setCalendarElements] = useState([[]]);
    const [calendarStartTime, setCalendarStartTime] = useState([]);
    const [calendarEndTime, setCalendarEndTime] = useState([]);

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const radius = 40;

    const accountId = props.accountId;
    const country = props.country;
    const university = props.university;

    useFocusEffect(React.useCallback(() => {
        const eventData = [];
        const friendData = [];
        dbService.collection('profile').doc(country).collection(university).doc(accountId).collection('friends').orderBy('order').onSnapshot(snapshot => {
            const len = snapshot.size
            let index = 0;
            for (let i = 0; i < snapshot.size; i++) {
                eventData.push({});
                friendData.push({});
            }
            snapshot.forEach(element => {
                let startTime = "2399";
                let endTime = "0000";
                let {order, personalNickname} = element.data();
                let friendId = element.id;
                let friendSchedule = [];
                const weekStart = new Date();
                weekStart.getDay() != 0 ? weekStart.setDate(weekStart.getDate() - weekStart.getDay()) : weekStart.setDate(weekStart.getDate() - 6)
                weekStart.setHours(0);
                weekStart.setMinutes(0);
                weekStart.setSeconds(0);
                weekStart.setMilliseconds(0);

                dbService.collection('profileRef').doc(friendId).onSnapshot((snapshot) => {
                    let {country, nickname, studentId, uid, university} = snapshot.data();
                    let friend = snapshot.data();
                    friend.personalNickname = personalNickname
                    let regularData = [];
                    let episodicData = [];
                    dbService.collection('profile').doc(country).collection(university).doc(uid).collection('regular').where('repEndDate', '>=', weekStart).onSnapshot(snapshot => {
                        snapshot.forEach(element => {
                            regularData.push(element.data());
                        })
                        dbService.collection('profile').doc(country).collection(university).doc(uid).collection('episodic').where('endDate', '>=', weekStart).onSnapshot(async (snapshot) => {
                            snapshot.forEach(element => {
                                episodicData.push(element.data());
                            })
                            
                            let myScheduleData = [];
                            //Process regular schedules
                            const regData = await processRegular(regularData);
                            //Process epidosic schedules
                            const epiData = await processEpisodic(episodicData);
                            myScheduleData = regData.concat(epiData)
                            myScheduleData = sortIntoDays(myScheduleData);
                            myScheduleData = sortEachDays(myScheduleData);
                            for (let i = 0; i < myScheduleData.length; i++) {
                                const dailyData = myScheduleData[i];
                                for (let j = 0; j < dailyData.length; j++) {
                                    let thisEvent = {
                                        title: dailyData[j]['title'],
                                        name: dailyData[j]['title'],
                                        location: dailyData[j]['venue'],
                                        extra_descriptions: dailyData[j]['category'].name,
                                        description: dailyData[j]['description'],
                                    }

                                    if (dailyData[j].time[0] == '전 날') {
                                        startTime = "0000";
                                        thisEvent['startTime'] = genTimeBlock(days[i], 0, 0);
                                    }
                                    else {
                                        if (dailyData[j].time[0] < startTime) {
                                            startTime = dailyData[j].time[0]
                                        }
                                        thisEvent['startTime'] = genTimeBlock(days[i], Math.floor(parseInt(dailyData[j]['time'][0]) / 100), parseInt(dailyData[j]['time'][0]) % 100)
                                    }

                                    if (dailyData[j].time[1] == '다음 날') {
                                        endTime = "2359";
                                        thisEvent['endTime'] = genTimeBlock(days[i], 23, 59);
                                    }
                                    else {
                                        if (dailyData[j].time[1] > endTime) {
                                            endTime = dailyData[j].time[1]
                                        }
                                        thisEvent['endTime'] = genTimeBlock(days[i], Math.floor(parseInt(dailyData[j]['time'][1]) / 100), parseInt(dailyData[j]['time'][1]) % 100)
                                    }
                                        
                                    friendSchedule.push(thisEvent)
                                }        
                            }
                            
                            //Process Modules
                            let modSchedule = {};
                            dbService.collection('profile').doc(country).collection(university).doc(uid).collection('modules').onSnapshot(async snapshot => {
                                snapshot.forEach(raw => {
                                    let modData = raw.data();
                                    let classTypes = Object.keys(modData);
                                    let temp = {}
                                    
                                    for (let i = 0; i < classTypes.length; i++) {
                                        if (classTypes[i] != 'code') {
                                            temp[classTypes[i]] = modData[classTypes[i]];    
                                        }
                                    }
                                    modSchedule[modData.code] = temp;
                                })
                                const moduleData = [];
                                const currentSemester = 2;
                                const modules = Object.keys(modSchedule);
                                const promises = [];
                                const classTypes = [];
                                for (let i = 0; i < modules.length; i++) {
                                    promises.push(new Promise((resolve, reject) => {
                                        const thisModule = {};
                                        fetch(`https://api.nusmods.com/v2/2021-2022/modules/${modules[i]}.json`).then(fetched => {
                                            fetched.json().then(data => {
                                                //Scan each semester's data
                                                for (let j = 0; j < data.semesterData.length; j++) {
                                                    let thisSemester = data.semesterData[j]
                                                    //if current semester
                                                    if (thisSemester.semester == currentSemester) {
                                                        let timetable = thisSemester.timetable;
                                                        let mydata = modSchedule[modules[i]];
                                                        let myClasses = Object.keys(mydata);
                                                        myClasses.forEach(element => {
                                                            if (! classTypes.includes(element)) {
                                                                classTypes.push(element);
                                                            }
                                                        });
                                                        //Loop through the classes for the semester
                                                        for (let k = 0; k < timetable.length; k++) {
                                                            //If I have that kind of class e.g. Tutorial/Lecture/Lab/Recitation
                                                            let tempIndex = myClasses.indexOf(timetable[k].lessonType);
                                                            if (tempIndex >= 0 && modSchedule[modules[i]][myClasses[tempIndex]] == timetable[k].classNo) {
                                                                if (thisModule[myClasses[tempIndex]] == undefined) {
                                                                    thisModule[myClasses[tempIndex]] = [];
                                                                }
                                                                thisModule[myClasses[tempIndex]].push(timetable[k]);
                                                            }
                                                        }
                                                        break;
                                                    }
                                                }
                                                
                                                thisModule['acadYear'] = data['acadYear'];
                                                thisModule['title'] = data['title'];
                                                thisModule['description'] = data['description'];
                                                thisModule['prerequisite'] = data['prerequisite'];
                                                thisModule['preclusion'] = data['preclusion'];
                                                thisModule['department'] = data['department'];
                                                thisModule['faculty'] = data['faculty'];
                                                thisModule['workload'] = data['workload'];
                                                thisModule['moduleCredit'] = data['moduleCredit'];
                                                thisModule['moduleCode'] = data['moduleCode'];
                                                moduleData.push(thisModule);
                                                resolve(true)
                                            });
                                        }).catch(exception => {
                                            console.log(exception);
                                            Alert.alert("오류", '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.');
                                            reject(false);
                                        })
                                    }))
                                }
                                Promise.all(promises).then(values => {
                                    if (values.includes(false)) {
                                        return;
                                    }
                                    for (let i = 0; i < moduleData.length; i++)
                                    {   
                                        let keys = Object.keys(moduleData[i]);
                                        for (let j = 0; j < keys.length; j++) {
                                            if (classTypes.includes(keys[j])) {
                                                for (let k = 0; k < moduleData[i][keys[j]].length; k++) {
                                                    if (moduleData[i][keys[j]][k].startTime < startTime) {
                                                        startTime = moduleData[i][keys[j]][k].startTime;
                                                    }
                                                    if (moduleData[i][keys[j]][k].endTime > endTime) {
                                                        endTime = moduleData[i][keys[j]][k].endTime;
                                                    }
                                                    friendSchedule.push({
                                                        title: moduleData[i].moduleCode,
                                                        name: moduleData[i].title,
                                                        startTime: genTimeBlock(moduleData[i][keys[j]][k]['day'].substring(0, 3), Math.floor(parseInt(moduleData[i][keys[j]][k].startTime) / 100), parseInt(moduleData[i][keys[j]][k].startTime) % 100),
                                                        endTime: genTimeBlock(moduleData[i][keys[j]][k]['day'].substring(0, 3), Math.floor(parseInt(moduleData[i][keys[j]][k].endTime) / 100), parseInt(moduleData[i][keys[j]][k].endTime) % 100),
                                                        location: moduleData[i][keys[j]][k].venue,
                                                        extra_descriptions: '[' + moduleData[i][keys[j]][k].lessonType.toUpperCase().substring(0,3) + ']' + moduleData[i][keys[j]][k].classNo,
                                                        description: moduleData[i]['description'] + "\n\n" + "Preclusion: " + moduleData[i]['preclusion'] + '\n\n' + "Prerequisite: " + moduleData[i]['prerequisite'] + '\n\n' + "Module Credit: " + moduleData[i]['moduleCredit'] + '\n\n' + "Department: " + moduleData[i]['department']
                                                    })
                                                }
                                            }
                                        } 
                                    }
                                    friend['startTime'] = startTime;
                                    friend['endTime'] = endTime;
                                    friendData.splice(order, 1, friend);
                                    eventData.splice(order, 1, friendSchedule);
                                    index++;

                                    if (index == len) {
                                        setCalendarElements(eventData);
                                        setFriendElements(friendData);
                                    }
                                })
                            })
                        })
                    })
                })
                
            })
        })
    }, []))

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        friendList: {
            display: 'flex',
            flexDirection: 'row',
            height: radius + (radius / 2),
            width: '100%',
            alignItems: 'center',
            alignContent: 'center',
        },
        friendCircle: {
            width: radius,
            height: radius,
            borderBottomLeftRadius: radius / 2,
            borderBottomRightRadius: radius / 2,
            borderTopLeftRadius: radius / 2,
            borderTopRightRadius: radius / 2,
            borderWidth: 2,
            borderColor: '#E0E0E0',
            marginLeft: radius / 4,
        },
        selectedFriendCircle: {
            width: radius,
            height: radius,
            borderBottomLeftRadius: radius / 2,
            borderBottomRightRadius: radius / 2,
            borderTopLeftRadius: radius / 2,
            borderTopRightRadius: radius / 2,
            borderWidth: 2,
            borderColor: '#FFDF00',
            marginLeft: radius / 4,
        }, 
        title: {
            width: '100%',
            height: radius * 1.5,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: radius / 4,
        },
        scheduleContainer: {
            height: height - 105 - (3 * radius),
            width: width - 25,
            borderWidth: 2,
            borderColor: '#FFDE00'
        },
    })

    return(
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.friendList}>
                    {
                        friendElements.map((data, index) => {
                            return <TouchableOpacity style={index == selectedFriend ? styles.selectedFriendCircle : styles.friendCircle} onPress={() => setSelectedFriend(index)}>
                                    <Text style={{textAlign: 'center', width: radius - 4, lineHeight: radius - 4}}>{data.nickname.slice(0, 1)}</Text>
                                </TouchableOpacity>
                        })
                    }
                </View>
                <View style={styles.title}>
                    <Text style={{fontFamily: 'Content', fontSize: 24}}>{friendElements[selectedFriend] == undefined ? "" : friendElements[selectedFriend].nickname}</Text>
                    <Text style={{fontFamily: 'Content', fontSize: 13}}> 님의 스케쥴</Text>
                </View>
                <ScrollView style={styles.scheduleContainer} horizontal>
                    <Calendar eventData={calenderElements[selectedFriend]} startTime={friendElements[selectedFriend] == null ? "0000" : friendElements[selectedFriend].startTime} endTime={friendElements[selectedFriend] == null ? "2359" : friendElements[selectedFriend].endTime} currentSemester={2}/>
                </ScrollView>
            </View>
        </ScrollView>
    )
}

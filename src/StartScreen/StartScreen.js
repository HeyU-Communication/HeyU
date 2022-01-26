import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Alert } from 'react-native';
import { authService, dbService, fetchSchedule, signIn } from '../components/FirebaseFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getJSONData, getStringData } from '../components/StorageFunctions';
import { processEpisodicFromToday, processRegularFromToday, sortIntoDays, sortEachDays } from '../components/TaskProcess'; 

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function StartScreen({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [schedule, setSchedule] = useState([[], [], [], [], [], [], []]);

    useEffect(() => {
        function navigateTo(schedule) {
            navigation.navigate("MainScreens", {
                screen: 'Home',
                params: {
                    accountId: accountId,
                    country: country,
                    school: school,
                    scheduleProps: schedule,
                }
            });
        }
        const user = authService.currentUser;
        if (user) {
            dbService.collection('profileRef').doc(user.uid).get().then(async snapshot => {
                const data = snapshot.data();
                const setter = (myScheduleData) => {
                    setLoaded(true);
                    navigation.navigate("MainScreens", {
                        screen: 'Home',
                        params: {
                            accountId: data.uid,
                            country: data.country,
                            university: data.university,
                            scheduleProps: myScheduleData,
                        }
                    })
                }
                await fetchSchedule(data.uid, data.country, data.university, setter);
            })
        }
        else {
            try {
                getStringData('autologin').then(autoLogin => {
                    getStringData('email').then(email => {
                        getStringData('password').then(pw => {
                            navigation.navigate('LoginScreen'); //개발용 옵션. 배포시 제거할 것
                            return () => {} //개발용 코드. 배포시 제거할 것.
                            if (!autoLogin) {
                                navigation.navigate('LoginScreen');
                            }
                            else if (email !== null && pw !== null) {
                                authService.signInWithEmailAndPassword(email, pw).then(async (userCredential) => {
                                    const user = userCredential.user
                                    
                                    if (! user.emailVerified) {
                                        Alert.alert('로그인 실패', '계정의 이메일이 인증되지 않았어요. 이메일을 인증해주세요. ')
                                        navigation.navigate('LoginScreen');
                                    }
                                    else {
                                        dbService.collection('profileRef').doc(user.uid).get().then(async snapshot => {
                                            const data = snapshot.data();
                                            let nowDate = new Date();
                                            dbService.collection("profile").doc(data.country).collection(data.university).doc(data.uid).collection("regular").where('repEndDate', '>', nowDate).onSnapshot((querySnapshot) => {
                                                const regularData = [];
                                                querySnapshot.forEach(doc => {
                                                    regularData.push(doc.data());
                                                })
                                                dbService.collection('profile').doc(data.country).collection(data.university).doc(data.uid).collection('episodic').where('endDate', '>', nowDate).onSnapshot(async (querySnapshot2) => {
                                                    const episodicData = [];
                                                    querySnapshot2.forEach(doc => {
                                                        const tempData = doc.data();
                                                        episodicData.push(tempData);
                                                    })
                            
                                                    let myScheduleData = [];
                                                    //Process regular schedules
                                                    const regData = await processRegularFromToday(regularData);
                                                    //Process epidosic schedules
                                                    const epiData = await processEpisodicFromToday(episodicData);
                                                    myScheduleData = regData.concat(epiData)
                                                    myScheduleData = sortIntoDays(myScheduleData);
                                                    myScheduleData = sortEachDays(myScheduleData);
                                                    navigation.navigate("MainScreens", {
                                                        screen: 'Home',
                                                        params: {
                                                            accountId: data.uid,
                                                            country: data.country,
                                                            university: data.university,
                                                            scheduleProps: myScheduleData,
                                                        }
                                                    })
                                                })
                                            })
                                        });
                                    }
                                }).catch(err => {
                                    Alert.alert("자동 로그인 실패", err.message)
                                    navigation.navigate('LoginScreen')
                                })
                            }
                            else {
                                navigation.navigate("LoginScreen")
                            }
                        })
                    })
                })
            }
            catch (e) {
                console.log(e)
                navigation.navigate("LoginScreen")
            }
        }
    }, [])

  return (
    <View style={styles.view}>
      <StatusBar style="auto" />
      <Text style={styles.primaryTitle}>학생을 위한{"\n"}틸리티</Text>
      <Text id={"U"} style={styles.ULeft}>
        U{"\n"}U
      </Text>
      <Text id={"U"} style={styles.UBottom}>
        U{"\n"}U
      </Text>
      <Text id={"U"} style={styles.URight}>
        U{"\n"}U
      </Text>
      <Text id={"U"} style={styles.UTop}>
        U{"\n"}U
      </Text>
      <Image style={styles.Hey} source={require("./Hey.png")} />
      <Image style={styles.StartLogo} source={require("./icon.png")} />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    width: width,
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    borderTopColor: "#FFDF00",
    borderTopWidth: width * 0.02,
    borderBottomColor: "#FFDF00",
    borderBottomWidth: width * 0.02,
    borderLeftColor: "#FFDF00",
    borderLeftWidth: width * 0.02,
    borderRightColor: "#FFDF00",
    borderRightWidth: width * 0.02,
    backgroundColor: "white",
  },
  border: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  ULeft: {
    color: "#FFDF00",
    fontSize: 50,
    position: "absolute",
    left: 70,
    top: 103,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#585858",
    textShadowOffset: { width: -1, height: 0 },
    textShadowRadius: 5,
    lineHeight: 60,
  },
  UBottom: {
    color: "#FFDF00",
    fontSize: 50,
    position: "absolute",
    left: 70,
    top: 103,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#585858",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 60,
  },
  URight: {
    color: "#FFDF00",
    fontSize: 50,
    position: "absolute",
    left: 70,
    top: 103,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#585858",
    textShadowOffset: { width: 1, height: 0 },
    textShadowRadius: 5,
    lineHeight: 60,
  },

  UTop: {
    color: "#FFDF00",
    fontSize: 50,
    position: "absolute",
    left: 70,
    top: 103,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: -1 },
    textShadowRadius: 3,
    lineHeight: 60,
  },
  Hey: {
    width: 260,
    height: 95,
    position: "absolute",
    top: 220,
    left: 70,
  },
  bigU: {
    color: "#FFDF00",
    fontSize: 288,
    position: "absolute",
    top: 240,
    left: 180,
    zIndex: 5,
  },
  whiteSpace: {
    backgroundColor: "white",
    position: "absolute",
    top: 457,
    left: 182,
    width: 180,
    height: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: 4,
  },
  StartLogo: {
    position: "absolute",
    left: 4,
    top: 320,
    width: 390,
    height: 532,
    zIndex: 3,
  },
  primaryTitle: {
    color: "#000000",
    fontSize: 48,
    position: "absolute",
    left: 105,
    top: 100,
    fontWeight: "bold",
    textAlign: "left",
    lineHeight: 60,
  },
});

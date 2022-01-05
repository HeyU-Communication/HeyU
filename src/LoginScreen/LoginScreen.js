import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Async, ScrollView, Alert, TextInput, Touchable } from 'react-native';
import { authService, dbService } from '../components/FirebaseFunction';
import { CircleSnail } from 'react-native-progress';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function LoginScreen({route, navigation}) {
    const [email, changeEmail] = useState("")
    const [pw, changePw] = useState("")
    const [emailFailed, setEmailFailed] = useState(false);
    const [passwordFailed, setPasswordFailed] = useState(false);
    const [emailFormatFailed, setEmailFormatFailed] = useState(false);
    const [otherFailed, setOtherFailed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    }, [])

    const successCallback = (schedule) => {
        
    }

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

    const handleSubmit = () => {
        if (passwordFailed || emailFailed || emailFormatFailed || otherFailed) {
            return;
        }
        setLoading(true)
        authService.signInWithEmailAndPassword(email, pw).then(async (userCredential) => {
            const user = userCredential.user
            
            if (! user.emailVerified) {
                Alert.alert('로그인 실패', '계정의 이메일이 인증되지 않았어요. 이메일을 인증해주세요. ')
                return;
            }

            dbService.collection('profileRef').doc(user.uid).get().then(async snapshot => {
                const data = snapshot.data();
                console.log(data)
                let myScheduleData = [];
                dbService.collection("profile").doc(data.country).collection(data.university).doc(data.uid).collection("regular").onSnapshot((querySnapshot) => {
                    const regularData = [];
                    querySnapshot.forEach(doc => {
                        regularData.push(doc.data());
                    })
                    dbService.collection('profile').doc(data.country).collection(data.university).doc(data.uid).collection('episodic').onSnapshot(async (querySnapshot2) => {
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
                        setEmailFailed(false);
                        setPasswordFailed(false);
                        setEmailFormatFailed(false);
                        setOtherFailed(false);
                        setLoading(false);
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
        }).catch(err => {
            setLoading(false);
            setEmailFailed(false);
            setPasswordFailed(false);
            setEmailFormatFailed(false);
            setOtherFailed(false);
            if (err.code = 'auth/wrong-password') {
                if (err.message.includes('There is no user record corresponding to this identifier. The user may have been deleted.')) {
                    setEmailFailed(true);
                }
                else if (err.message.includes('The password is invalid or the user does')) {
                    setPasswordFailed(true);
                }
                else if (err.message.includes('The email address is badly formatted')) {
                    setEmailFormatFailed(true);
                } 
                else {
                    setOtherFailed(true);
                    Alert.alert('오류', err.message)
                }
            }
            else {
                setOtherFailed(true);
                Alert.alert('오류', err.message);
            }
        });
    }

    const handleFindIdPw = () => {
        navigation.navigate("FindCredentialScreen")
    }

    const handleRegistration = () => {
        navigation.navigate("RegistrationScreen");
    }
    
    return (
        <View style={styles.container}>
            {loading ? 
            <View><CircleSnail animating={loading} style={styles.circleSnailStyle} color={'#FFDE00'}/></View>
            : 
                <View>
                <Image style={styles.image} source={require('./StartLogo.png')} />
                <Text style={styles.description}>유학생들을 위한 커뮤니티</Text>
                <Text style={styles.title}>HEY ! U</Text>
                {emailFailed || passwordFailed || emailFormatFailed || otherFailed ? <Text style={styles.emptyText}/> : <Text />}
                {emailFailed ? <Text style={styles.errorMessage}>해당 이메일이 존재하지 않습니다. 다시 확인해주세요.</Text> : <Text style={styles.emptyText}/>}
                {passwordFailed ? <Text style={styles.errorMessage}>비밀번호가 부정확합니다. 다시 확인해주세요.</Text> : <Text style={styles.emptyText}/>}
                {emailFormatFailed ? <Text style={styles.errorMessage}>이메일의 형식이 부정확합니다. 다시 확인해주세요.</Text> : <Text style={styles.emptyText}/>}
                {otherFailed ? <Text style={styles.errorMessage}>알 수 없는 오류입니다. 잠시 후 재시도하세요. 문제가 계속된다면 오류메시지를 캡쳐해 신고해주세요. 불편을 끼쳐드려 죄송합니다.</Text> : <Text style={styles.emptyText}/>}
                <TextInput style={styles.emailInput} placeholder={'E-mail'} onChangeText={changeEmail} value={email} textContentType={'email'} autoComplete={'email'} />
                <TextInput style={styles.pwInput} placeholder={'Password'} onChangeText={changePw} value={pw} textContentType={"password"} secureTextEntry={true} autoComplete={'password'}/>
                <TouchableOpacity style={styles.submit} onPress={handleSubmit}><Text style={{color: 'white', fontFamily: 'Candal', fontSize: 10,}}>Login</Text></TouchableOpacity>
                <TouchableOpacity style={styles.findCredential} onPress={handleFindIdPw}><Text style={{color: '#959595', fontFamily: 'Candal', fontSize: 10}}>Lost E-mail / Password</Text></TouchableOpacity>
                <TouchableOpacity style={styles.registration} onPress={handleRegistration}><Text style={{color: '#959595', fontFamily: 'Candal', fontSize: 10}}>Register</Text></TouchableOpacity>
            </View>
            }
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '15%',
    },
    image: {
        width: 107,
        height: 120,
        position: 'relative',
        left: (width - 100) / 2,
    },
    description: {
        width: width,
        textAlign: 'center',
        color: '#424242',
        fontFamily: 'AbhayaLibre_ExtraBold',
        marginTop: 20,
        fontSize: 10,
    },
    title: {
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Candal',
        marginTop: 20,
        color: '#FFDE00',
        fontSize: 20,
    },
    errorMessage: {
        width: '100%',
        textAlign: 'center',
        fontFamily: 'Candal',
        fontSize: 10,
        color: 'red',
        marginTop: 10,
        marginBottom: 5,
    },
    emptyText: {
        height: 0,
        width: 0,
        display: 'none',
    },
    emailInput: {
        width: width * 0.84,
        height: 40,
        backgroundColor: '#E1E1E1',
        left: width * 0.08,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20,
        fontFamily: 'Candal',
        fontSize: 10,
    },
    pwInput: {
        width: width * 0.84,
        height: 40,
        backgroundColor: '#E1E1E1',
        left: width * 0.08,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginBottom: 20,
        fontFamily: 'Candal',
        fontSize: 10,
    },
    submit: {
        width: width * 0.84,
        height: 40,
        backgroundColor: '#F5DF4D',
        left: width * 0.08,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        paddingTop: 12,
        marginBottom: 20,
    },
    findCredential: {
        width: width * 0.84,
        height: 40,
        borderColor: '#F5DF4D',
        borderWidth: 1,
        backgroundColor: 'white',
        left: width * 0.08,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        paddingTop: 12,
        marginBottom: 20,
    },
    registration: {
        width: width * 0.84,
        height: 40,
        borderColor: '#F5DF4D',
        borderWidth: 1,
        backgroundColor: 'white',
        left: width * 0.08,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        paddingTop: 12,
    },
    circleSnailStyle: {
        position: 'absolute',
        left: (width - 40) / 2,
        top: ((height - 40) / 2) - (height * 0.15),
    }
})
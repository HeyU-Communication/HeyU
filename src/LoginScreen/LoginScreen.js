import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Async, ScrollView, Alert, TextInput, Touchable, DrawerLayoutAndroidBase } from 'react-native';
import { authService, dbService } from '../components/FirebaseFunction';
import { CircleSnail } from 'react-native-progress';
import days from '../components/days';
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
        const user = authService.currentUser;
        if (user) {
            
        }
    }, [])

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

    const handleSubmit = () => {
        if (passwordFailed || emailFailed || emailFormatFailed || otherFailed) {
            return;
        }
        //setLoading(true)
        authService.signInWithEmailAndPassword(email, pw).then(async (userCredential) => {
            const user = userCredential.user
            
            if (! user.emailVerified) {
                Alert.alert('로그인 실패', '계정의 이메일이 인증되지 않았어요. 이메일을 인증해주세요. ')
                setLoading(false);
                return;
            }

            dbService.collection('profileRef').doc(user.uid).get().then(async snapshot => {
                const data = snapshot.data();
                let nowDate = new Date();
                let myScheduleData = [];
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
                        //Process regular schedules
                        for (let i = 0 ; i < regularData.length; i++) {
                            let startDate = new Date(regularData[i].startDate.seconds * 1000);
                            let endDate = new Date(regularData[i].endDate.seconds * 1000)
                            if (regularData[i].repetition == 'daily') {
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
                                    if(now > thisMonthStart && temp > now/*(startDayOrder < countPrevDay(now) && countPrevDay(now) < endDayOrder) || (startDayOrder == countPrevDay(now) && (startDay < now.getDay()) && (countPrevDay(now) < endDayOrder || (endDayOrder == countPrevDay(now) && now.getDay() <= endDay))) || (startDayOrder < countPrevDay(now) && now.getDay() <= endDay)*/) 
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
                                            //startRecording = false;
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
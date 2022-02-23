import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import {
  authService,
  dbService,
  fetchSchedule,
} from "../components/FirebaseFunction";
import { CircleSnail } from "react-native-progress";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
import {
  processEpisodicFromToday,
  processRegularFromToday,
  sortEachDays,
  sortIntoDays,
} from "../components/TaskProcess";
import { storeJSON, storeString } from "../components/StorageFunctions";
import CheckBox from "react-native-check-box";

export default function LoginScreen({ route, navigation }) {
  const [email, changeEmail] = useState("");
  const [pw, changePw] = useState("");
  const [emailFailed, setEmailFailed] = useState(false);
  const [passwordFailed, setPasswordFailed] = useState(false);
  const [emailFormatFailed, setEmailFormatFailed] = useState(false);
  const [otherFailed, setOtherFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    const user = authService.currentUser;
    if (user) {
      /*setLoading(true)
            dbService.collection('profileRef').doc(user.uid).get().then(async snapshot => {
                const data = snapshot.data();
                const setter = (myScheduleData) => {
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
            })*/
    }
  }, []);

    const handleSubmit = () => {
        setLoading(true)
        authService.signInWithEmailAndPassword(email, pw).then(async (userCredential) => {
            const user = userCredential.user
            
            if (! user.emailVerified) {
                Alert.alert('로그인 실패', '계정의 이메일이 인증되지 않았어요. 이메일을 인증해주세요. ')
                setLoading(false);
                return;
            }

            dbService.collection('profileRef').doc(user.uid).get().then(snapshot => {
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
                        setEmailFailed(false);
                        setPasswordFailed(false);
                        setEmailFormatFailed(false);
                        setOtherFailed(false);
                        setLoading(false);
                        await storeString('email', email);
                        await storeString('password', pw);
                        await storeString('autologin', autoLogin ? 'true' : 'false');
                        navigation.navigate("MainScreens", {
                            accountId: data.uid,
                            country: data.country,
                            university: data.university,
                            nickname: data.nickname,
                            studentId: data.studentId,
                            scheduleProps: myScheduleData,
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
    navigation.navigate("FindCredentialScreen");
  };

  const handleRegistration = () => {
    navigation.navigate("RegistrationScreen");
  };


    const handleSetAutoLogin = () => {
        setAutoLogin(!autoLogin)
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
                <View style={{marginLeft: width * 0.08, display: 'flex', flexDirection: 'row', marginBottom: 20, marginTop: 10, alignItems: 'center'}}>
                    <CheckBox isChecked={autoLogin} onClick={() => setAutoLogin(!autoLogin)} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'}/>
                    <Text style={{textAlignVertical: 'center', color: 'black', fontFamily: 'Content', fontSize: 10, opacity: 0.6 }}>자동 로그인</Text>
                </View>
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
    position: "absolute",
    top: "15%",
  },
  image: {
    width: 107,
    height: 120,
    position: "relative",
    left: (width - 100) / 2,
  },
  description: {
    width: width,
    textAlign: "center",
    color: "#424242",
    fontFamily: "AbhayaLibre_ExtraBold",
    marginTop: 20,
    fontSize: 10,
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontFamily: "Candal",
    marginTop: 20,
    color: "#FFDE00",
    fontSize: 20,
  },
  errorMessage: {
    width: "100%",
    textAlign: "center",
    fontFamily: "Candal",
    fontSize: 10,
    color: "red",
    marginTop: 10,
    marginBottom: 5,
  },
  emptyText: {
    height: 0,
    width: 0,
    display: "none",
  },
  emailInput: {
    width: width * 0.84,
    height: 40,
    backgroundColor: "#E1E1E1",
    left: width * 0.08,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 20,
    fontFamily: "Candal",
    fontSize: 10,
  },
  pwInput: {
    width: width * 0.84,
    height: 40,
    backgroundColor: "#E1E1E1",
    left: width * 0.08,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 5,
    fontFamily: "Candal",
    fontSize: 10,
  },
  submit: {
    width: width * 0.84,
    height: 40,
    backgroundColor: "#F5DF4D",
    left: width * 0.08,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 20,
  },
  findCredential: {
    width: width * 0.84,
    height: 40,
    borderColor: "#F5DF4D",
    borderWidth: 1,
    backgroundColor: "white",
    left: width * 0.08,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    paddingTop: 12,
    marginBottom: 20,
  },
  registration: {
    width: width * 0.84,
    height: 40,
    borderColor: "#F5DF4D",
    borderWidth: 1,
    backgroundColor: "white",
    left: width * 0.08,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: "center",
    paddingTop: 12,
  },
  circleSnailStyle: {
    position: "absolute",
    left: (width - 40) / 2,
    top: (height - 40) / 2 - height * 0.15,
  },
});

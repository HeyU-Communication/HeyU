import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Image, Alert } from 'react-native';
import { fetchProfile, fetchSchedule, signIn } from '../components/FirebaseFunction';
import AsyncStorage from '@react-native-async-storage/async-storage';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function StartScreen({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [schedule, setSchedule] = useState([[], [], [], [], [], [], []]);

    useEffect(() =>{
        //const myAuth = await fetchProfile();
        function navigateTo(schedule) {
            navigation.navigate("MainScreens", {
                screen: 'Home',
                params: {
                    accountId: accountId,
                    country: country,
                    school: school,
                    scheduleProps: schedule,
                    //authProps: myAuth
                }
            });
        }

        const getData = async () => {
            try {
                const email = await AsyncStorage.getItem('email');
                const pw = await AsyncStorage.getItem('pw');
                const country = await AsyncStorage.getItem('country');
                const school = await AsyncStorage.getItem("school");

                console.log(email);
                console.log(pw);
                console.log(country);
                console.log(school);

                if (email !== null && pw !== null) {
                    signIn(email, pw, country, school, navigateTo, () => {
                        navigation.navigate("LoginScreen");
                    })
                }
                else {
                    navigation.navigate("LoginScreen")
                }
            }
            catch (e) {
                console.log(e)
                navigation.navigate("LoginScreen")
            }
        }

        getData();
    },)

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
      <Text style={styles.bigU}>U</Text>
      <View style={styles.whiteSpace}></View>
      <Image style={styles.StartLogo} source={require("./StartLogo.png")} />
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
    top: 100,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#585858",
    textShadowOffset: { width: -1, height: 0 },
    textShadowRadius: 5,
  },
  UBottom: {
    color: "#FFDF00",
    fontSize: 50,
    position: "absolute",
    left: 70,
    top: 100,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#585858",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  URight: {
    color: "#FFDF00",
    fontSize: 50,
    position: "absolute",
    left: 70,
    top: 100,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#585858",
    textShadowOffset: { width: 1, height: 0 },
    textShadowRadius: 5,
  },

  UTop: {
    color: "#FFDF00",
    fontSize: 50,
    position: "absolute",
    left: 70,
    top: 100,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: -1 },
    textShadowRadius: 3,
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
    top: 421,
    width: 390,
    height: 430,
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
  },
});

//import 'react-native-gesture-handler';

import { Provider } from 'react-redux';
import { createStore } from 'redux'
import React, {useEffect, useState, useReducer} from 'react';
import StartScreen from './src/StartScreen/StartScreen';
import HomeScreen from './src/HomeScreen/HomeScreen';
import ScheduleScreen from './src/ScheduleScreen/ScheduleScreen';
import MatesScreen from './src/MatesScreen/MatesScreen';
import BoardScreen from "./src/BoardScreen/BoardScreen";
import LoginScreen from './src/LoginScreen/LoginScreen';
import RegistrationScreen from './src/LoginScreen/RegistrationScreen';
import FindCredentialScreen from './src/LoginScreen/FindCredentialScreen';
import ProfileBrief from './src/ProfileBrief/ProfileBrief';
import AppMap from './src/AppMap/AppMap';
import MyTabBar from './src/components/MyTabBar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Dimensions, StyleSheet, Image, Text, TouchableOpacity, SafeAreaView} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loadAsync, useFonts } from "expo-font";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

function MainScreens(props) {
  const { accountId, country, university, scheduleProps, nickname, studentId } = props;

  const [option, setOption] = useState({})
  const [homeOption, setHomeOption] = useState({})
  const [scheduleOption, setScheduleOption] = useState({})
  const [matesOption, setMatesOption] = useState({})
  const [boardOption, setBoardOption] = useState({})
  const [to, setTo] = useState("Home")

  if (option != props.option) {
    setOption(props.option);
    if (props.option.screen == 'Board') {
      setBoardOption(props.option.option);
      setTo("Board")
    }
    else if (props.option.screen == 'Home') {
      setHomeOption(props.option.option);
      setTo("Home")
    }
    else if (props.option.screen == 'Schedule') {
      setScheduleOption(props.option.option);
      setTo("Schedule")
    }
    else if (props.option.screen == 'Mates') {
      setMatesOption(props.option.option);
      setTo("Mates")
    }
  }

  const openAppMap = props.openAppMap;
  const openProfile = props.openProfileBrief;

  return (
    <View style={styles.view}>
      <StatusBar style="auto" backgroundColor="#F5DF4D" />
      <View style={styles.upperBar}>
        <TouchableOpacity style={styles.menuHighlight} onPress={openAppMap}>
          <Image
            style={styles.menu}
            source={require("./src/HomeScreen/Menu.png")}
          />
        </TouchableOpacity>
        <Text style={styles.heyu}>HEY! U</Text>
        <TouchableOpacity style={styles.profileHighlight} onPress={openProfile}>
          <Image
            style={styles.profile}
            source={require("./src/HomeScreen/Profile.png")}
          />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        name="MainScreens"
        initialRouteName={props.option.screen}
        backBehavior="firstRoute"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <MyTabBar {...props} propsTo={to} propsSetTo={setTo}/>}
      >
        <Tab.Screen name="Home" children={() => <HomeScreen accountId={accountId} country={country} university={university} scheduleProps={scheduleProps} nickname={nickname} studentId={studentId} option={homeOption}/>} />
        <Tab.Screen name="Schedule" children={() => <ScheduleScreen accountId={accountId} country={country} university={university} nickname={nickname} studentId={studentId} option={scheduleOption} />} />
        <Tab.Screen name="Mates" children={() => <MatesScreen accountId={accountId} country={country} university={university} nickname={nickname} studentId={studentId} option={matesOption} />} />
        <Tab.Screen name="Board" children={() => <BoardScreen accountId={accountId} country={country} university={university} nickname={nickname} studentId={studentId} option={boardOption} />} />
      </Tab.Navigator>
    </View>
  );
}

function CoreScreens({route, navigation}) {
  const { accountId, country, university, scheduleProps, nickname, studentId, name, profileUrl } = route.params;

  const [selected, setSelected] = useState({screen: 'default'});

  function openAppMap() {
    navigation.navigate("Map")
  }

  function openProfileBrief() {
    navigation.navigate("ProfileBrief")
  }

  function closeSide() {
    navigation.navigate("Home");
  }

  return (
    <Stack.Navigator initialRouteName='Home' backBehavior='initialRoute' screenOptions={{headerShown: false}} >
      <Stack.Screen name={"Home"}  children={() => <MainScreens accountId={accountId} country={country} university={university} scheduleProps={scheduleProps} nickname={nickname} studentId={studentId} name={name} openAppMap={openAppMap} openProfileBrief={openProfileBrief} option={selected} profileUrl={profileUrl}/> } />
      <Stack.Screen name={'Map'} options={{
        animation: 'slide_from_left',
        presentation: 'containedTransparentModal'
      }} children={() => <AppMap accountId={accountId} country={country} university={university} scheduleProps={scheduleProps} nickname={nickname} studentId={studentId} setSelected={setSelected} closeSide={closeSide} name={name} profileUrl={profileUrl}/>} />
      <Stack.Screen name={'ProfileBrief'} options={{
        animation: 'slide_from_right',
        presentation: 'containedTransparentModal'
      }} children={() => <ProfileBrief accountId={accountId} country={country} university={university} scheduleProps={scheduleProps} nickname={nickname} studentId={studentId} closeSide={closeSide} name={name} profileUrl={profileUrl}/>} />
    </Stack.Navigator>
  )
}

export default function App() {
  const [loaded] = useFonts({
    Acme: require('./src/components/assets/fonts/Acme-Regular.ttf'),
    AlefBold: require('./src/components/assets/fonts/Alef-Bold.ttf'),
    Alef: require('./src/components/assets/fonts/Alef-Regular.ttf'),
    Content: require('./src/components/assets/fonts/Content-Regular.ttf'),
    ContentBold: require('./src/components/assets/fonts/Content-Bold.ttf'),
    RhodiumLibre: require('./src/components/assets/fonts/RhodiumLibre-Regular.ttf'),
    AbhayaLibre: require('./src/components/assets/fonts/AbhayaLibre-Regular.ttf'),
    AbhayaLibre_ExtraBold: require('./src/components/assets/fonts/AbhayaLibre-ExtraBold.ttf'),
    Candal: require("./src/components/assets/fonts/Candal-Regular.ttf")
  });

  const currentScreen = "Home";

  function reducer(state = currentScreen, action) {
    return state;
  }

  let store = createStore(reducer)

  if (!loaded) {
    return null;
  } else {
    return (
      <NavigationContainer>
        <Provider store={store}>
          <Stack.Navigator initialRouteName="StartScreen" backBehavior="none" screenOptions={{ headerShown: false, }}>
            <Stack.Screen name="StartScreen" component={StartScreen}/>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
            <Stack.Screen name="FindCredentialScreen" component={FindCredentialScreen} />
            <Stack.Screen name="MainScreens" component={CoreScreens} />
          </Stack.Navigator>
        </Provider>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  view: {
    width: width,
    height: "100%",
    borderTopColor: "#F5DF4D",
    borderTopWidth: width * 0.02,
    borderLeftColor: "#F5DF4D",
    borderLeftWidth: width * 0.02,
    borderRightColor: "#F5DF4D",
    borderRightWidth: width * 0.02,
    backgroundColor: "white",
  },
  upperBar: {
    height: 65,
    backgroundColor: "#F5DF4D",
  },
  menuHighlight: {
    position: "absolute",
    width: 40,
    height: 40,
    top: 30,
    left: 0,
  },
  heyu: {
    color: "black",
    fontFamily: "RhodiumLibre",
    position: "absolute",
    left: 0,
    top: 30,
    width: width * 0.95,
    textAlign: "center",
    fontWeight: "bold",
  },
  menu: {
    width: 20,
    height: 20,
    position: "absolute",
    top: 5,
    left: 10,
  },
  profileHighlight: {
    width: 40,
    height: 40,
    position: "absolute",
    top: 30,
    right: 0,
  },
  profile: {
    width: 25,
    height: 25,
    position: "absolute",
    top: 2,
  },
});

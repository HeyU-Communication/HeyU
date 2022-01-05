
import React from 'react';
import StartScreen from './src/StartScreen/StartScreen';
import HomeScreen from './src/HomeScreen/HomeScreen';
import ScheduleScreen from './src/ScheduleScreen/ScheduleScreen';
import MatesScreen from './src/MatesScreen/MatesScreen';
import BoardScreen from "./src/BoardScreen/BoardScreen";
import LoginScreen from './src/LoginScreen/LoginScreen';
import RegistrationScreen from './src/LoginScreen/RegistrationScreen';
import FindCredentialScreen from './src/LoginScreen/FindCredentialScreen';
import MyTabBar from './src/components/MyTabBar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Dimensions, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from "expo-font";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

function MainScreens() {
  return (
    <View style={styles.view}>
      <StatusBar style="auto" backgroundColor="#F5DF4D" />
      <View style={styles.upperBar}>
        <TouchableOpacity style={styles.menuHighlight}>
          <Image
            style={styles.menu}
            source={require("./src/HomeScreen/Menu.png")}
          />
        </TouchableOpacity>
        <Text style={styles.heyu}>HEY! U</Text>
        <TouchableOpacity style={styles.profileHighlight}>
          <Image
            style={styles.profile}
            source={require("./src/HomeScreen/Profile.png")}
          />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        name="MainScreens"
        initialRouteName="Home"
        backBehavior="firstRoute"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <MyTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
        <Tab.Screen name="Mates" component={MatesScreen} />
        <Tab.Screen name="Board" component={BoardScreen} />
      </Tab.Navigator>
    </View>
  );
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

  if (!loaded) {
    return null;
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartScreen" backBehavior="none" screenOptions={{ headerShown: false, }}>
          <Stack.Screen name="StartScreen" component={StartScreen}/>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
          <Stack.Screen name="FindCredentialScreen" component={FindCredentialScreen} />

          <Stack.Screen name="MainScreens" component={MainScreens} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
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

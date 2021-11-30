import React from 'react';
import StartScreen from './src/StartScreen/StartScreen';
import HomeScreen from './src/HomeScreen/HomeScreen';
import ScheduleScreen from './src/ScheduleScreen/ScheduleScreen';
import MyTabBar from './src/components/MyTabBar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Dimensions, StyleSheet, Image, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

function MainScreens() {
  return (  
    <View style={styles.view}>
      <StatusBar style='auto' backgroundColor="#F5DF4D" />
      <View style={styles.upperBar}>
        <Image style={styles.menu} source={require('./src/HomeScreen/Menu.png')} />
        <Text style={styles.heyu}>HEY! U</Text>
        <Image style={styles.profile} source={require('./src/HomeScreen/Profile.png')} />
      </View>
      <Tab.Navigator 
        name="MainScreens" 
        initialRouteName="HomeScreen" 
        backBehavior="history" 
        screenOptions={{headerShown: false, }} 
        tabBar={props => <MyTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
      </Tab.Navigator>
    </View>
    
  )
}

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="StartScreen" backBehavior="none" screenOptions={{headerShown: false, }}>
          <Stack.Screen name="StartScreen" component={StartScreen}/>
          <Stack.Screen name="MainScreens" component={MainScreens} />
        </Stack.Navigator>
      </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  view: {
    width: width,
    height: '100%',
    borderTopColor: '#F5DF4D',
    borderTopWidth: width * 0.02,
    borderLeftColor: "#F5DF4D",
    borderLeftWidth: width * 0.02,
    borderRightColor: '#F5DF4D',
    borderRightWidth: width * 0.02,
    backgroundColor: 'white',
  },
  upperBar: {
    height: 65,
    backgroundColor: "#F5DF4D",
},
heyu: {
    color: 'black',
    fontFamily: 'Rhodium Libre',
    position: 'absolute',
    left: 0,
    top: 30,
    width: width * 0.95,
    textAlign: 'center',
    fontWeight: 'bold',
},
menu: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: 30,
    left: 10,
},
profile: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: 30,
    right: 10,
}
})

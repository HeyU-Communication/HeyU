import React from 'react';
import StartScreen from './src/StartScreen/StartScreen';
import HomeScreen from './src/HomeScreen/HomeScreen';
import ScheduleScreen from './src/ScheduleScreen/ScheduleScreen';
import MyTabBar from './src/components/MyTabBar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainScreens() {
  return (
    <Tab.Navigator 
      name="MainScreens" 
      initialRouteName="HomeScreen" 
      backBehavior="history" 
      screenOptions={{headerShown: false, }} 
      tabBar={props => <MyTabBar {...props} />}
    >
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="ScheduleScreen" component={ScheduleScreen} />
    </Tab.Navigator>
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

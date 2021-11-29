import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

export default function HomeScreen({navigation}) {
    const [state1, setState1] = useState(false);
    
    useEffect(() => {
        console.log("Loaded");
    })

    return(
        <View>

        </View>
    )
}
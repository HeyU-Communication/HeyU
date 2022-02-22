import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import { authService, dbService, fetchSchedule } from '../components/FirebaseFunction';


export default function ProfileBrief(props) {

    return (
        <View style={styles.container}>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginLeft: '20%',
        height: '100%',
        width: '80%',
        backgroundColor: 'pink'
    }
})
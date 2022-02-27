import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import { authService, dbService, fetchSchedule } from '../components/FirebaseFunction';


export default function ProfileBadge(props) {

    return (
        <View style={styles.container}>
            <View style={styles.idBox}>
                <Text style={styles.nickname}>{props.nickname}</Text>
                <Text style={styles.name}>{props.name}</Text>
                <Text style={styles.university}>{props.university}</Text>
                <Text style={styles.studentId}>{props.studentId}</Text>
            </View>
            
            <Image style={styles.image} source={{uri: props.profileUrl}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 15,
        paddingTop: 5,
        width: '95%',
        backgroundColor: '#F1F1F1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    idBox: {
        width: '100%',
        paddingLeft: 15,
    },
    nickname: {
        fontFamily: 'RhodiumLibre',
        fontSize: 20,
    },
    name: {
        fontFamily: 'RhodiumLibre',
        fontSize: 10,
        
    },
    university: {
        fontFamily: 'RhodiumLibre',
        fontSize: 10,
        
    },
    studentId: {
        fontFamily: 'RhodiumLibre',
        fontSize: 10,
    },
    image: {
        height: 100,
        width: 100,
        marginTop: 10,
    },
})
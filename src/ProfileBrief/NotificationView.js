import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import ProfileBadge from './ProfileBadge';
import { authService, dbService, fetchSchedule } from '../components/FirebaseFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function NotificationView(props) {

    return (
        <View style={styles.container}>
            <Text style={styles.notification}>Notification</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 15,
        paddingTop: 5,
        paddingLeft: 15,
        width: '95%',
        backgroundColor: '#F1F1F1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 15,
        minHeight: '20%'
    },
    notification: {
        fontFamily: 'RhodiumLibre',
        fontSize: 20,
    }
})
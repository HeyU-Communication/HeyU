import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import ProfileBadge from './ProfileBadge';
import MessageView from './MessageView';
import NotificationView from './NotificationView';
import { authService, dbService, fetchSchedule } from '../components/FirebaseFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function ProfileBrief(props) {

    return (
        <View style={styles.container}>
            <ProfileBadge country={props.country} university={props.university} accountId={props.accountId} studentId={props.studentId} nickname={props.nickname} name={props.name} profileUrl={props.profileUrl}/>
            <MessageView />
            <NotificationView />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 25,
        height: height,
        width: '90%',
        marginLeft: '10%',
        backgroundColor: 'pink',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTopColor: "#F5DF4D",
        borderTopWidth: 1,
        borderLeftColor: "#F5DF4D",
        borderLeftWidth: 2,
        backgroundColor: "white",
        borderBottomWidth: 5,
        borderBottomColor: '#F5DF4D',
        paddingTop: 10,
    },
})
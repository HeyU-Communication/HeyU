import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import { authService, dbService, fetchSchedule } from '../components/FirebaseFunction';

export default function ListElement(props) {

    function navigate() {
        props.navigate()
    }

    return (
        <TouchableOpacity onPress={navigate} style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.description}>{props.description}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 40,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#FFDE00',
        display: 'flex',
        flexDirection: 'column'
    },
    title: {
        fontFamily: 'AbhayaLibre_ExtraBold',
        fontSize: 10,
        color: 'black',
        lineHeight: 40,
        marginRight: 20,
    },
    description: {
        fontFamily: 'Content',
        fontSize: 7,
        color: '#A5A5A5',
        lineHeight: 40,
    }
})
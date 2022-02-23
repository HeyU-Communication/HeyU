import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import { authService, dbService, fetchSchedule } from '../components/FirebaseFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Secondary(props) {

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 30,
            backgroundColor: '#F1F1F1',
            width: '100%',
            borderBottomColor: '#CFCFCF',
            borderTopColor: '#CFCFCF',
            borderBottomWidth: props.hasBottomBorder ? 1 : 0,
            borderTopWidth: props.hasTopBorder ? 1 : 0,
            height: 40,
        },
        title: {
            fontFamily: 'Content',
            fontSize: 12,
        },
        description: {
            marginLeft: 15,
            fontFamily: 'Content',
            fontSize: 9,
            color: '#888888'
        },
    })

    return (
        <TouchableOpacity style={styles.container} onPress={() => {
            props.setSelected(props.to)
            props.closeSide()
            }}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.description}>{props.description}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 30,
        backgroundColor: '#F1F1F1',
        width: '100%',
        borderBottomColor: '#FFFFFF',
        borderBottomWidth: 1,
        height: 40,
    },
    title: {
        fontFamily: 'Content',
        fontSize: 12,
    },
    description: {
        fontFamily: 'Content',
        fontSize: 9,
    },
})
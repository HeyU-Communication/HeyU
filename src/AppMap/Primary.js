import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import { authService, dbService, fetchSchedule } from '../components/FirebaseFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Primary(props) {

    const styles = StyleSheet.create({
        container: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            height: 40,
            paddingLeft: 10,
            borderBottomColor: '#CFCFCF',
            borderTopColor: '#CFCFCF',
            borderTopWidth: props.hasTopBorder ? 1 : 0,
            borderBottomWidth: props.hasBottomBorder ? 1 : 0,
        },
        title: {
            fontFamily: 'Content',
            fontSize: 12,
        },
        description: {
            fontFamily: 'Content',
            fontSize: 9,
            marginLeft: 15,
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


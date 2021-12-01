import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Async } from 'react-native';

export default function Event(props) {

    const styles = StyleSheet.create({
        dot: {
            width: 20,
            height: 20,
            position: 'relative',
            left: 14,
            top: 20,
            backgroundColor: props.current ? '#FFDE00' : 'white',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderBottomColor: "#FFDE00",
            borderTopColor: '#FFDE00',
            borderRightColor: "#FFDE00",
            borderLeftColor: '#FFDE00',
            borderBottomWidth: 2,
            borderLeftWidth: 2,
            borderTopWidth: 2,
            borderRightWidth: 2,
        },
        eventContainer: {
            width: 325,
            height: 110,
            backgroundColor: props.current ? '#FFDE00' : 'transparent',
            position: 'relative',
            top: 0,
            left: 50,
            borderTopLeftRadius: 33,
            borderTopRightRadius: 33,
            borderBottomLeftRadius: 33,
            borderBottomRightRadius: 33,
            marginBottom: 10,
        },
        name: {
            position: 'relative',
            top: props.current? 20 : 0,
            left: 20,
            fontWeight: 'bold'
        },
        venue: {
            position: 'relative',
            left: 20,
            top: props.current ? 50 : 30,
        },
        startTime: {
            position: 'relative',
            top: props.current ? -20 : -40,
            left: 270,
        },
        endTime: {
            position: 'relative',
            left: 270,
            top: props.current ? -10 : -30,
        },
        category: {
            position: 'relative',
            left: 20,
            top: props.current ? -53 : -73
        },
        to: {
            left: 290,
            top: props.current ? -15 : -35,
        }
    })
    const startHour = Math.floor(props.startTime / 100).toString();
    let startMinute = props.startTime % 100;
    if (startMinute < 10) {
        startMinute = "0" + startMinute.toString();
    }
    else {
        startMinute = startMinute.toString();
    }
    const endHour = Math.floor(props.endTime / 100).toString();
    let endMinute = (props.endTime % 100);
    if (endMinute < 10) {
        endMinute = "0" + endMinute.toString();
    }
    else {
        endMinute = endMinute.toString();
    }

    return (
        <View>
            <View style={styles.dot}></View>
            <View style={styles.eventContainer}>
                <Text style={styles.name}>{props.name}</Text>
                <Text style={styles.venue}>{props.venue}</Text>
                <Text style={styles.startTime}>{startHour}:{startMinute}</Text>
                <Text style={styles.to}>to</Text>
                <Text style={styles.endTime}>{endHour}:{endMinute}</Text>
                <Text style={styles.category}>{props.category}</Text>
            </View>
        </View>
    )
}


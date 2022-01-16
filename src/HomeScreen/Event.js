import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Async } from 'react-native';

export default function Event(props) {

    const styles = StyleSheet.create({
        dot: {
            width: 20,
            height: 20,
            zIndex: 10,
            position: 'relative',
            left: '3.5%',
            top: props.current ? '15%' : '20%',
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
        bar: {
            width: 7,
            height: props.current ? 125 : 100,
            position: 'absolute',
            top: 30,
            left: '5%',
            backgroundColor: '#FFDE00',
            zIndex: 1,
        },
        eventContainer: {
            width: '88%',
            height: 110,
            backgroundColor: props.current ? '#FFDE00' : 'transparent',
            position: 'relative',
            top: 0,
            left: '30%',
            borderTopLeftRadius: 33,
            borderTopRightRadius: 33,
            borderBottomLeftRadius: 33,
            borderBottomRightRadius: 33,
            marginBottom: props.current ? 0 : '-9%',
            flexDirection: 'row'
        },
        eventDetails: {
            flex: 1
        },
        eventTimes: {
            flex: 1
        },
        name: {
            position: 'relative',
            top: props.current ? 18 : 2,
            left: 20,
            fontWeight: 'bold',
            marginBottom: 3,
        },
        venue: {
            position: 'relative',
            left: 20,
            top: props.current ? 18 : 2,
            marginBottom: 3,
        },
        category: {
            position: 'relative',
            left: 20,
            top: props.current ? 18 : 2,
            marginBottom: 3,
        },
        startTime: {
            position: 'relative',
            top: props.current ? 18 : 2,
            left: props.current ? props.startTime == '전 날' ? '77%' : '75%' : props.startTime == '전 날' ? '86%' : '85%',
        },
        to: {
            left: props.current ? '80%' : '90%',
            top: props.current ? 18 : 2
        },
        endTime: {
            position: 'relative',
            left: props.current ? props.endTime == '다음 날' ? '74%' : '75%' : props.endTime == '다음 날' ? '84%' : '85%',
            top: props.current ? 18 : 2,
        },
    })
    let startHour;
    let startMinute;
    let endHour;
    let endMinute;
    if (props.startTime == '전 날') {

    } 
    else {
        startHour = Math.floor(props.startTime / 100).toString();
        if (startHour < 10) {
            startHour = "0" + startHour.toString();
        }
        else {
            startHour = startHour.toString();
        }
        startMinute = props.startTime % 100;
        if (startMinute < 10) {
            startMinute = "0" + startMinute.toString();
        }
        else {
            startMinute = startMinute.toString();
        }
    }
    if (props.endTime == '다음 날') {
        
    }   
    else {
        
        endHour = Math.floor(props.endTime / 100).toString();
        if (endHour < 10) {
            endHour = "0" + endHour.toString();
        }
        else {
            endHour = endHour.toString();
        }
        endMinute = (props.endTime % 100);
        if (endMinute < 10) {
            endMinute = "0" + endMinute.toString();
        }
        else {
            endMinute = endMinute.toString();
        }
    }
    

    return (
        <View>
            <View style={styles.dot}></View>
            <View style={styles.bar}></View>
            <View style={styles.eventContainer}>
                <View stlye={styles.eventDetails}>
                    <Text style={styles.name}>{props.name}</Text>
                    <Text style={styles.category}>{props.category}</Text>
                    <Text style={styles.venue}>{props.venue}</Text>
                </View>
                <View style={styles.eventTimes}>
                    <Text style={styles.startTime}>{props.startTime == '전 날' ? '전 날' : startHour + ':' + startMinute}</Text>
                    <Text style={styles.to}>to</Text>
                    <Text style={styles.endTime}>{props.endTime == '다음 날' ? '다음 날' : endHour + ':' + endMinute}</Text>
                </View>

                
                
            </View>
        </View>
    )
}


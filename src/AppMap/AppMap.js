import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { authService, dbService, fetchSchedule } from '../components/FirebaseFunction';
import ProfileBadge from './ProfileBadge';
import Primary from './Primary';
import Secondary from './Secondary';
import { useNavigation } from '@react-navigation/native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function AppMap(props) {

    const navigation = useNavigation();

    const [boards, setBoards] = useState([])

    useEffect(() => {
        dbService.collection('universities').doc(props.university).collection('boards').orderBy('order').onSnapshot(snapshot => {
            const temp = [];
            snapshot.forEach(element => {
                const data = element.data();
                temp.push(data);
            })
            setBoards(temp);
        })
    }, [])

    return (
        <View style={styles.container}>
            <ProfileBadge country={props.country} university={props.university} studentId={props.studentId} accountId={props.accountId} nickname={props.nickname}/>
            <ScrollView style={styles.boardContainer}>
                <Primary title={'홈'} description={''} hasBottomBorder={false} hasTopBorder={false} closeSide={props.closeSide} setSelected={props.setSelected} to={{screen: "Home", option: {addTask: false}}}/>
                <Secondary title={'일정 추가'} description={""} hasBottomBorder={true} closeSide={props.closeSide} setSelected={props.setSelected} to={{screen: "Home", option: {addTask: true}}}/>
                <Primary title={'스케쥴'} description={""} hasBottomBorder={true} closeSide={props.closeSide} setSelected={props.setSelected} to={{screen: "Schedule",}}/>
                <Primary title={'친구'} description={""} setSelected={props.setSelected} closeSide={props.closeSide} to={{screen: "Mates", }}/>
                <Secondary title={'친구 목록'} description={""} setSelected={props.setSelected} closeSide={props.closeSide} to={{screen: "Mates", option: {index: 1}}}/>
                <Secondary title={'친구 추가'} description={""} setSelected={props.setSelected} closeSide={props.closeSide} to={{screen: "Mates", option: {index: 0}}}/>
                <Secondary title={'친구 요청'} description={""}  hasBottomBorder={true} closeSide={props.closeSide} setSelected={props.setSelected} to={{screen: "Mates", option: {index: 2}}}/>
                <Primary title={'게시판'} description={""} closeSide={props.closeSide} setSelected={props.setSelected} to={{screen: "Board", }}/>
                {boards.map((element, i) => {
                    return <Secondary title={element.name} description={element.description} hasBottomBorder={i == boards.length - 1} closeSide={props.closeSide} setSelected={props.setSelected} to={{screen: "Board", option: {order: i}}}/>
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        top: 25,
        height: height,
        width: '90%',
        backgroundColor: 'pink',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderTopColor: "#F5DF4D",
        borderTopWidth: 1,
        borderRightColor: "#F5DF4D",
        borderRightWidth: 2,
        backgroundColor: "white",
        borderBottomWidth: 5,
        borderBottomColor: '#F5DF4D',
    },
    boardContainer: {
        borderTopColor: "#F5DF4D",
        borderTopWidth: 1,
        borderRightColor: "#F5DF4D",
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#F5DF4D',
        borderLeftColor: "#F5DF4D",
        borderLeftWidth: 1,
        marginTop: 10,
        width: '95%',
        minHeight: 10,
        maxHeight: height - 100,
    },
})
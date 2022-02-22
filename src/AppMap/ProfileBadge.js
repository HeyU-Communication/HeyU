import React, {useState, useEffect } from 'react';
import { StyleSheet, Text, Image, View, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import { authService, dbService, fetchSchedule } from '../components/FirebaseFunction';


export default function ProfileBadge(props) {

    const [profileUrl, setProfileUrl] = useState("");
    const [nickname, setNickname] = useState("");

    useEffect(() => {
        dbService.collection('profile').doc(props.country).collection(props.university).doc(props.accountId).onSnapshot(snapshot => {
            const data = snapshot.data();
            if (data.profileUrl != 'default') {
                setProfileUrl(data.profileUrl);
            }            
            setNickname(props.nickname);
        })
    }, [])

    return (
        <View style={styles.container}>
            <Image source={{uri: profileUrl}} style={styles.image}/>
            <Text style={styles.nickname}>{props.nickname}</Text>
            <TouchableOpacity style={styles.myPostButton}><Text style={styles.myPostText}>내가 쓴 글</Text></TouchableOpacity>
            <TouchableOpacity style={styles.myCommentButton}><Text style={styles.myPostText}> 내가 쓴 댓글</Text></TouchableOpacity>
            <View style={styles.myContainer}>
                
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        height: 50,
        width: '95%',
        backgroundColor: '#F1F1F1',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    myContainer: {
        backgroundColor: 'white',
    },
    image: {
        marginLeft: 10,
        height: 40,
        width: 40,
        marginTop: 5,
        marginBottom: 5,
        marginRight: 15,
    },
    nickname: {
        fontFamily: 'RhodiumLibre',
        fontSize: 20,
        lineHeight: 50,
    },
    myPostButton: {
        marginLeft: 10,
        backgroundColor: '#C4C4C4',
        height: 20,
        position: 'absolute',
        top: 15,
        right: 75,
    },  
    myPostText: {
        paddingLeft: 5,
        paddingRight: 5,
        fontFamily: 'Content',
        fontSize: 9,
        lineHeight: 20,
    },
    myCommentButton: {
        marginLeft: 10,
        backgroundColor: '#C4C4C4',
        height: 20,
        position: 'absolute',
        top: 15,
        right: 10,
    },
})
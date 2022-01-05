import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView, Alert, TextInput, Touchable } from 'react-native';
import * as Storage from '../components/Storage'
import DropDownPicker from 'react-native-dropdown-picker';
import { authService, dbService, storageService } from '../components/FirebaseFunction';
import { CircleSnail } from 'react-native-progress';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function FindCredentialScreen({route, navigation}) {
    const [university, setUniversity] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [studentId, setStudentId] = useState("");
    const [countryPickerOpen, setCountryPickerOpen] = useState(false);
    const [countryPickerOpen1, setCountryPickerOpen1] = useState(false);
    const [universityPickerOpen, setUniversityPickerOpen] = useState(false);
    const [universityPickerOpen1, setUniversityPickerOpen1] = useState(false);
    const [country, setCountry] = useState("");
    const [countryData, changeCountryData] = useState([]);
    const [universityData, changeUniversityData] = useState([]);
    const [displayedUniversity, setDisplayedUniversity] = useState([]);
    const [universityRawData, setUniversityRawData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFindEmail = () => {
        if (name.length == 0 || university.length == 0 || country.length == 0 || studentId == 0) {
            Alert.alert('검색 실패', '필요한 모든 항목을 기입해 주세요.')
            return;
        }
        setLoading(true);
        dbService.collection('profile').doc(country).collection(university).get().then(snapshot => {
            let found = false;
            snapshot.forEach(element => {
                let data = element.data()
                if (name === data.name && studentId === data.studentId) {
                    setLoading(false);
                    Alert.alert('계정을 찾았어요!', '이메일: ' + data.email);
                    found = true;
                }
            })
            if (! found) {
                setLoading(false);
                Alert.alert("검색 실패", '계정을 찾지 못했어요');
            }
        }).catch(err => {
            console.log(err.code)
            console.log(err.message)
            return;
        })
    }

    const handleFindPw = () => {
        if (country.length === 0 || university.length === 0 || email.length === 0 || studentId.length === 0 || name.length === 0) {
            Alert.alert('검색 실패', '필요한 모든 항목을 기입해 주세요.')
            return;
        }
        setLoading(true);
        dbService.collection('profile').doc(country).collection(university).get().then(snapshot => {
            let found = false;
            snapshot.forEach(element => {
                let data = element.data()
                console.log(data);
                if (name === data.name && studentId === data.studentId && email === data.email) {
                    setLoading(false);
                    authService.sendPasswordResetEmail(email).then(() => {
                        Alert.alert('계정을 찾았어요!', '비밀번호 재설정 이메일이 발송되었어요. 이메일의 링크를 눌러 비밀번호를 재설정해주세요.')
                    });
                    found = true;
                }
            })
            if (! found) {
                setLoading(false);
                Alert.alert("검색 실패", '계정을 찾지 못했어요');
            }
        }).catch(err => {
            console.log(err.code)
            console.log(err.message)
            return;
        })
    }

    const handleReturn = () => {
        navigation.navigate('LoginScreen')
    }

    const setData = (elements) => {
        const countries = [];
        elements.map(element => {
            if (! countries.includes(element.country)) {
                countries.push(element.country);
            }
        })
        const components = [];
        countries.map(element => {
            components.push({label: element, value: element})
        })
        changeCountryData(components);
        setUniversityRawData(elements);
    }

    useEffect(() => {
        try {
            dbService.collection('universities').onSnapshot(querySnapshot => {
                const univs = [];
                querySnapshot.forEach(element => {
                    univs.push(element.data());
                })
                setData(univs)
            })
        } catch (err) {
            Alert.alert('콩쥐야 ㅈ됬어', err.message)
        }
    }, [])

    const onCountryOpen = useCallback(() => {
        setUniversityPickerOpen(false);
    })
    
    const onUnivOpen = useCallback(() => {
        setCountryPickerOpen(false);
    })

    const onSelectCountry = (value) => {
        const arr = [];
        for (let i = 0; i < universityRawData.length; i++) {
            if (universityRawData[i].country == value()) {
                arr.push(universityRawData[i]);
            }
        }
        const univData = [];
        arr.forEach(element => {
            univData.push({label: element.name, value: element.name});
        })
        setDisplayedUniversity(univData)
        setUniversity("");
        setCountry(value)
    }

    return (
        <View stlye={styles.container}>
            {loading ? 
                <View><CircleSnail animating={loading} style={styles.circleSnailStyle} color={'#FFDE00'}/></View> 
                : 
                <ScrollView style={styles.scrollView}>
                    <Image source={require('./StartLogo.png')} style={styles.Logo}/>
                    <View style={styles.emailView}>
                        <Text style={styles.findEmail}>Find Email</Text>
                        <View style={styles.hr}/>
                        <DropDownPicker style={styles.countryPicker} placeholder={'Select Country'} textStyle={{fontFamily: 'Candal', fontSize: 10}} open={countryPickerOpen} value={country} items={countryData} onOpen={onCountryOpen} setOpen={setCountryPickerOpen} setValue={onSelectCountry} />
                        <DropDownPicker style={styles.universityPicker} placeholder={'Select University'} textStyle={{fontFamily: 'Candal', fontSize: 10}} open={universityPickerOpen} value={university} items={displayedUniversity} onOpen={onUnivOpen} setOpen={setUniversityPickerOpen} setValue={setUniversity} setItems={changeUniversityData} />
                        <TextInput style={styles.input} onChangeText={setName} placeholder={'Name'} value={name} textContentType={'name'} autoComplete={'name'}/>
                        <TextInput style={styles.input} onChangeText={setStudentId} placeholder={'Student ID'} value={studentId} textContentType={'nickname'}/>
                        <TouchableOpacity onPress={handleFindEmail} style={styles.findButton}><Text style={styles.findButtonText}>Find Email</Text></TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.findEmail}>Find Password</Text>
                        <View style={styles.hr} />
                        <DropDownPicker style={styles.countryPicker} placeholder={'Select Country'} textStyle={{fontFamily: 'Candal', fontSize: 10}} open={countryPickerOpen1} value={country} items={countryData} onOpen={onCountryOpen} setOpen={setCountryPickerOpen1} setValue={onSelectCountry} />
                        <DropDownPicker style={styles.universityPicker} placeholder={'Select University'} textStyle={{fontFamily: 'Candal', fontSize: 10}} open={universityPickerOpen1} value={university} items={displayedUniversity} onOpen={onUnivOpen} setOpen={setUniversityPickerOpen1} setValue={setUniversity} setItems={changeUniversityData} />
                        <TextInput style={styles.input} placeholder={'Email'} onChangeText={setEmail} value={email} autoComplete={'email'} textContentType={'email'}/>
                        <TextInput style={styles.input} placeholder={'Name'} onChangeText={setName} value={name} autoComplete={'name'} textContentType={'name'}/>
                        <TextInput style={styles.input} onChangeText={setStudentId} placeholder={'Student ID'} value={studentId} textContentType={'nickname'}/>
                        <TouchableOpacity onPress={handleFindPw} style={styles.findButton}><Text style={styles.findButtonText}>Find Password</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={handleReturn} style={styles.backButton} ><Text style={styles.backButtonText}>Back to Main</Text></TouchableOpacity>
                </ScrollView>
            }
            
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:  'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    scrollView: {
        height: height + 25,
    },
    Logo: {
        marginTop: 45,
        width: 107,
        height: 120,
        marginLeft: (width - 100) / 2,
    },
    emailView: {
        marginBottom: 40,
    },
    findEmail: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: '#FFDE00',
        width: 120,
        textAlign: 'center',
        fontSize: 10,
        fontFamily: 'Candal',
        color: 'white',
    },
    hr: {
        height: 2,
        width: '100%',
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#FFDE00',
        borderTopColor: 'transparent',
        backgroundColor: '#FFDE00',
        marginBottom: 20,
    },
    countryPicker: {
        backgroundColor: 'transparent',
        fontFamily: 'Candal',
        height: 35,
        fontSize: 10,
        width: 0.9 * width,
        left: 0.05 * width,
        marginBottom: 10,
    },
    universityPicker: {
        backgroundColor: 'transparent',
        height: 35,
        width: 0.9 * width,
        left: 0.05 * width,
        zIndex: 100,
        marginBottom: 15,
    },
    countryContainerStyle: {
        height: 35,
        zIndex: 200,
    },
    univContainerStyle: {
        marginBottom: 10,
        zIndex: 200,
        width: 0.9 * width,
        left: 0.05 * width,
        top: 50,
        zIndex: 100,
    },
    itemStyle: {
        fontFamily: 'Candal',
        fontSize: 10,
        color: 'black',
        zIndex: 100,
    },
    input: {
        height: 40,
        width: width * 0.9,
        marginLeft: width * 0.05,
        borderColor: '#FFDE00',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        fontFamily: 'Candal',
        fontSize: 10,
        color: '#7c7c7c',
        marginBottom: 15,
    },
    findButton: {
        height: 40,
        width: width * 0.9,
        marginLeft: width * 0.05,
        backgroundColor: '#FFDE00',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    findButtonText: {
        width: '100%',
        textAlign: 'center',
        paddingTop: 12,
        fontSize: 10,
        fontFamily: 'Candal',
        color: 'white',
        marginBottom: 20,
    },
    backButton: {
        marginTop: 50,
        width: width,
    },
    backButtonText: {
        width: width,
        textAlign: 'center',
        color: 'grey',
        paddingBottom: 25,
    },
    circleSnailStyle: {
        position: 'absolute',
        left: (width - 40) / 2,
        top: (height - 40) / 2,
    }
})
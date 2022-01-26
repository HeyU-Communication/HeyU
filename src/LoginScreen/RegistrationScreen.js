import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, Alert, TextInput, ScrollView } from 'react-native';
import { authService, dbService, getUniversities, storageService } from '../components/FirebaseFunction';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { CircleSnail } from 'react-native-progress';
import CheckBox from 'react-native-check-box';
import Modal from "react-native-modal";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function RegistrationScreen({route, navigation}) {
    const [email, changeEmail] = useState("")
    const [pw, changePw] = useState("")
    const [checkPw, changeCheckPw] = useState("")
    const [name, changeName] = useState("")
    const [nickname, changeNickname] = useState("")
    const [studentId, setStudentId] = useState("")
    const [university, changeUniversity] = useState("")
    const [country, changeCountry] = useState("");
    const [countryData, changeCountryData] = useState([]);
    const [universityData, changeUniversityData] = useState([]);
    const [displayedUniversity, setDisplayedUniversity] = useState([]);
    const [universityRawData, setUniversityRawData] = useState([]);
    const [countryPickerOpen, setCountryPickerOpen] = useState(false);
    const [universityPickerOpen, setUniversityPickerOpen] = useState(false);
    const [agreeAll, setSelectAll] = useState(false);
    const [serviceAgree, setServiceAgree] = useState(false);
    const [personalAgree, setPersonalAgree] = useState(false);
    const [communityAgree, setCommunityAgree] = useState(false);
    const [adAgree, setAdAgree] = useState(false);
    const [isStudent, setStudent] = useState(false);
    const [isProspective, setProspective] = useState(false);
    const [isAlumni, setAlumni] = useState(false);
    const [profileImg, setProfileImg] = useState("./Profile.png");
    const [profileSelected, setProfileSelected] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectCountryOpen, setSelectCountryOpen] = useState(false);

    const styles = StyleSheet.create({
        container: {
            top: 25,
            height: height - 25,
        },
        registrationText: {
            left: 0.05 * width,
            color: '#FFDE00',
            fontFamily: 'Candal',
            fontSize: 20,
            marginTop: 20,
        },
        selectCountry: {
            left: 0.05 * width,
            fontFamily: 'Candal',
            fontSize: 10,
            marginBottom: 5,
            marginTop: 20,
        },
        pickerButton: {
            backgroundColor: '#E1E1E1',
            fontFamily: 'Candal',
            height: 35,
            width: 0.9 * width,
            left: 0.05 * width,
            paddingLeft: 5,
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
        },
        modalStyle: {
            backgroundColor: 'white',
            width: 0.9 * width,
            height: height - 100,
            borderWidth: 5,
            borderColor: "#FFDE00",
            display: 'flex',
            flexDirection: 'column',
        },  
        countryPicker: {
            backgroundColor: 'transparent',
            fontFamily: 'Candal',
            height: 35,
            fontSize: 10,
            width: 0.9 * width,
            marginBottom: 10,
        },
        countryContainerStyle: {
            width: 0.9 * width,
            left: 0.05 * width,
        },
        universityPicker: {
            backgroundColor: 'transparent',
            height: 35,
            width: 0.9 * width,
        },        
        univContainerStyle: {
            width: 0.9 * width,
            left: 0.05 * width,
        },
        itemStyle: {
            fontFamily: 'Candal',
            fontSize: 10,
            color: 'black',
            zIndex: 100,
        },
        findYourUniversity: {
            left: 0.05 * width,
            fontFamily: 'Candal',
            fontSize: 10,
            marginBottom: 5,
            zIndex: 10,
        },
        selectButton: {
            left: 0.05 * width,
            width: 0.8 * width,
            height: height - 500,
            backgroundColor: '#F5DF4D',
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            marginTop: 20,
        },
        personalInfo: {
            fontFamily: 'Candal',
            left: 0.05 * width,
            fontSize: 10,
            marginTop: 20, 
            marginBottom: 10,
        },
        name: {
            fontFamily: 'Candal',
            fontSize: 10,
            left: 0.05 * width,
            width: 0.9 * width,
            backgroundColor: '#E1E1E1',
            height: 40,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
        },
        nickname: {
            fontFamily: 'Candal',
            fontSize: 10,
            left: 0.05 * width,
            width: 0.9 * width,
            backgroundColor: '#E1E1E1',
            height: 40,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
        },
        studentId: {
            fontFamily: 'Candal',
            fontSize: 10,
            left: 0.05 * width,
            width: 0.9 * width,
            backgroundColor: '#E1E1E1',
            height: 40,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
        },
        email: {
            fontFamily: 'Candal',
            fontSize: 10,
            left: 0.05 * width,
            width: 0.9 * width,
            backgroundColor: '#E1E1E1',
            height: 40,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
        },
        password: {
            fontFamily: 'Candal',
            fontSize: 10,
            left: 0.05 * width,
            width: 0.9 * width,
            backgroundColor: '#E1E1E1',
            height: 40,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
        },
        checkPw: {
            fontFamily: 'Candal',
            fontSize: 10,
            left: 0.05 * width,
            width: 0.9 * width,
            backgroundColor: '#E1E1E1',
            height: 40,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginBottom: 10,
            paddingLeft: 20,
            paddingRight: 20,
        },
        profileText: {
            fontFamily: 'Candal',
            fontSize: 10,
            left: 0.05 * width,
        },
        profileContainer: {
            width: 100,
            height: 100,
            left: (width - 100) / 2,
            backgroundColor: '#E1E1E1',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginBottom: 15,
        },
        profileImg: {
            width: 80,
            height: 80,
            left: 10,
            top: 10,
        },
        terms: {
            fontFamily: 'AbhayaLibre_ExtraBold',
            fontSize: 10,
            left: 0.05 * width,
        },
        viewTerms: {
            fontFamily: 'AbhayaLibre_ExtraBold',
            fontSize: 7,
            left: 60,
            color: 'blue',
            textDecorationLine: 'underline',
            top: -10,
        },
        checkAll: {
            left: 0.05 * width,
        },
        checkAllText: {
            marginLeft: 25,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: agreeAll ? 'black' : '#7C7C7C',
        },
        serviceTerm: {
            left: 0.05 * width,
        },
        serviceTermText: {
            marginLeft: 25,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: serviceAgree ? 'black' : '#7C7C7C',
        },
        personalTerm: {
            left: 0.05 * width,
        },
        personalTermText: {
            marginLeft: 25,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: personalAgree ? 'black' : '#7C7C7C',
        },
        communityTerm: {
            left: 0.05 * width,
        },
        communityTermText: {
            marginLeft: 25,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: communityAgree ? 'black' : '#7C7C7C',
        },
        adTerm: {
            left: 0.05 * width,
        },
        adTermText: {
            marginLeft: 25,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: adAgree ? 'black' : '#7C7C7C',
        },
        prospective: {
            top: 60,
            left: (0.05 * width),
        },
        prospectiveText: {
            top: 40,
            left: (0.05 * width) + 35,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: isProspective ? 'black' : '#7C7C7C',
            marginBottom: -20,
        },
        student: {
            top: 60,
            left: (0.05 * width),
        },
        studentText: {
            top: 40,
            left: (0.05 * width) + 35,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: isStudent ? 'black' : '#7C7C7C',
            marginBottom: -20,
        },
        alumni: {
            top: 60,
            left: (0.05 * width),
        },
        alumniText: {
            top: 40,
            left: (0.05 * width) + 35,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: isAlumni ? 'black' : '#7C7C7C',
            marginBottom: -15,
        },
        alert: {
            color: 'red',
            fontSize: 8,
            fontFamily: 'AbhayaLibre_ExtraBold',
            left: 0.05 * width + 20,
            top: -4,
        },
        emptyText: {
            height: 10,
        },
        registration: {
            backgroundColor: '#F5DF4D',
            width: width * 0.9,
            left: width * 0.05,
            height: 40,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
            paddingTop: 10,
            marginTop: 10,
            marginBottom: 50,
        },
        circleSnailStyle: {
            position: 'absolute',
            left: (width - 40) / 2,
            top: (height - 40) / 2,
        }
    })

    const selectAgreeAll = (value) => {
        setAdAgree(value);
        setCommunityAgree(value);
        setPersonalAgree(value);
        setSelectAll(value);
        setServiceAgree(value);
    }

    const selectService = value => {
        if (agreeAll) {
            setSelectAll(false);
            setServiceAgree(value);
        }
        else {
            setServiceAgree(value);
        }
    }

    const selectPersonal = value => {
        if (agreeAll) {
            setSelectAll(false);
            setPersonalAgree(value);
        }
        else {
            setPersonalAgree(value);
        }
    }

    const selectCommunity = value => {
        if (agreeAll) {
            setSelectAll(false);
            setCommunityAgree(value);
        }
        else {
            setCommunityAgree(value);
        }
    }

    const selectAd = value => {
        if (agreeAll) {
            setSelectAll(false);
            setAdAgree(value);
        }
        else {
            setAdAgree(value);
        }
    }

    const selectProspective = value => {
        if (value) {
            setAlumni(false);
            setStudent(false);
            setProspective(value);
        }
        else {
            setProspective(value);
        }
    }

    const selectStudent = value => {
        if (value) {
            setAlumni(false);
            setProspective(false);
            setStudent(value);
        }
        else {
            setStudent(value);
        }
    }

    const selectAlumni = value => {
        if (value) {
            setProspective(false);
            setStudent(false);
            setAlumni(value);
        }
        else {
            setAlumni(value);
        }
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

    const onCountryOpen = useCallback(() => {
        setUniversityPickerOpen(false);
    })
    
    const onUnivOpen = useCallback(() => {
        setCountryPickerOpen(false);
    })

    const [isNameAdequate, setIsNameAdequate] = useState(true);
    const onNameLoseFocus = () => {
        const letters = /^[ㄱ-힣A-Za-z ]+$/
        if (letters.test(name) || name.length === 0) {
            setIsNameAdequate(true);
        }
        else {
            setIsNameAdequate(false);
        }
    }

    const [isNicknameAdequate, setIsNicknameAdequate] = useState(true);
    const [isNicknameUnique, setIsNicknameUnique] = useState(true);
    const onNicknameLoseFocus = () => {
        dbService.collection('profileRef').get().then(collection => {
            let isUnique = true;
            collection.forEach(doc => {
                let data = doc.data();
                if (data.nickname == nickname) {
                    setIsNicknameUnique(false)
                    isUnique = false;
                }
            })
            if (isUnique) {
                setIsNicknameUnique(true);
            }
            const letters = /^[ㄱ-힣A-Za-z0-9 ]+$/
            if (letters.test(nickname) || nickname.length === 0) {
                setIsNicknameAdequate(true);
            }
            else {
                setIsNicknameAdequate(false);
            }
        })
        
    }

    const [isEmailAdequate, setIsEmailAdequate] = useState(true);
    const onEmailLoseFocus = () => {
        const temp = universityRawData.filter(element => {
            if (element.name == university) {
                return true;
            }
            else {
                false;
            }
        })
        if (email.length === 0) {
            setIsEmailAdequate(true);
        }
        else if (! email.includes("@") || ! email.includes('.')) {
            setIsEmailAdequate(false)
        }
        else if (email.indexOf('@') < 1 && email.indexOf("@") + 3 >= email.length && email.substring(email.indexOf("@") + 1, email.length).indexOf(".") < 0) {
            setIsEmailAdequate(false);
        }
        else if (temp.length > 0 && temp[0].emailHost != email.substring(email.indexOf("@") + 1, email.length)) {
            setIsEmailAdequate(false);
        }
        else {
            setIsEmailAdequate(true);
        }
    } 

    const [isPasswordAdequate, setIsPasswordAdequate] = useState(true);
    const onPasswordLoseFocus = () => {
        if (pw.length === 0) {
            setIsPasswordAdequate(true);
        }
        else if (pw.length < 8) {
            setIsPasswordAdequate(false);
        }
        else {
            setIsPasswordAdequate(true);
        }
    }

    const [isCheckPwAdequate, setIscheckPwAdequate] = useState(true);
    const onCheckPwLoseFocus = () => {
        if (checkPw.length === 0) {
            setIscheckPwAdequate(true);
        }
        else if (pw !== checkPw) {
            setIscheckPwAdequate(false);
        }
        else {
            setIscheckPwAdequate(true);
        }
    }

    useEffect(() => {
        getUniversities(setData);
    }, [])

    const handleFileUpload = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        setProfileImg(result.uri);
        setProfileSelected(true);
    }

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
        changeUniversity("");
        changeCountry(value)
    }

    const onSelectUniversity = (value) => {
        changeUniversity(value());
        setCountryPickerOpen(false);
    }

    const handleRegistration = () => {
        if (!isCheckPwAdequate || !isEmailAdequate || !isNameAdequate || !isNicknameAdequate || !isPasswordAdequate) {
            Alert.alert('회원가입 실패', '모든 항목을 알맞게 기재해 주세요.')
            return;
        }
        else if (name.length === 0 || email.length === 0 || nickname.length === 0 || pw.length === 0 || checkPw.length === 0) {
            Alert.alert('회원가입 실패', '모든 항목을 기재해 주세요.')
            return;
        }
        else if (!agreeAll && (!serviceAgree || !communityAgree || !personalAgree)) {
            Alert.alert('회원가입 실패', '필수 동의 항목에 동의해 주세요.')
            return;
        }
        setLoading(true);
        authService.createUserWithEmailAndPassword(email, pw)
        .then(async (userCredential) => {
            const user = userCredential.user;
            let profileUrl = "default";
            if (profileSelected) {
                const blob = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                      resolve(xhr.response);
                    };
                    xhr.onerror = function (e) {
                      console.log(e);
                      reject(new TypeError("Network request failed"));
                    };
                    xhr.responseType = "blob";
                    xhr.open("GET", profileImg, true);
                    xhr.send(null);
                });
            
                const snapshot = await storageService.ref('profile/' + user.uid).put(blob);
                profileUrl = await snapshot.ref.getDownloadURL();
            }
            const uploadProfile = await dbService.collection('profile').doc(country).collection(university).doc(user.uid).set({
                name: name,
                email: email,
                nickname: nickname,
                verified: false,
                uid: user.uid,
                profileUrl: profileUrl,
            }).catch(err => console.log(err))
            const uploadProfileRef = await dbService.collection('profileRef').doc(user.uid).set({
                country: country,
                uid: user.uid,
                university: university,
                nickname: nickname,
                studentId: studentId,
            })
            const initialSetup = await dbService.collection('profile').doc(country).collection(university).doc(user.uid).collection('category').doc('noCategory').set({
                color: '#FFFFFF',
                isModule: false,
                name: 'No category'
            })
            await authService.currentUser.sendEmailVerification().then(() => {
                setLoading(false);
                Alert.alert('회원 가입 성공!', 'A verification email has been sent to registered email address. Please click on the link in the email to activate your account. \n\n 계정 확인 메일이 입력하신 메일주소로 발송되었습니다. 이메일에 있는 링크를 눌러 계정을 활성화해주세요.')
                navigation.navigate('LoginScreen')
            }).catch(err => {
                setLoading(false);
                Alert.alert('회원가입 실패', "알 수 없는 오류로 회원가입을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.")
                return;
            })
        })
        .catch((error) => {
            setLoading(false);
            if (error.message.includes('The email address is already in use by another account')) {
                Alert.alert('회원가입 실패', '해당 이메일을 사용하는 유저가 이미 가입되어있습니다.')
                return;
            }
            else {
                Alert.alert('회원가입 실패', '알 수 없는 오류로 회원가입을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.')
                return;
            }
        });
    }

    return (
        
        <View style={{height: '100%'}}>
            {loading ? 
            <View><CircleSnail animating={loading} style={styles.circleSnailStyle} color={'#FFDE00'}/></View> 
            : 
            <View>
                <ScrollView style={styles.container}>
                    <Text style={styles.registrationText}>Registration</Text>
                    <View>
                        <Text style={styles.selectCountry}>Select Your Country</Text>
                        <DropDownPicker listMode='SCROLLVIEW' zIndex={2000} zIndexInverse={1000} style={styles.countryPicker} containerStyle={styles.countryContainerStyle} textStyle={{fontFamily: 'Candal', fontSize: 10}} open={countryPickerOpen} value={country} items={countryData} onOpen={onCountryOpen} setOpen={setCountryPickerOpen} setValue={onSelectCountry} />
                        <Text style={styles.findYourUniversity}>Find Your University</Text>
                        <DropDownPicker zIndex={1000} zIndexInverse={2000} style={styles.universityPicker} containerStyle={styles.univContainerStyle} textStyle={{fontFamily: 'Candal', fontSize: 10}} open={universityPickerOpen} value={university} items={displayedUniversity} onOpen={onUnivOpen} setOpen={setUniversityPickerOpen} setValue={onSelectUniversity} setItems={changeUniversityData} />                             
                        <Text style={styles.personalInfo}>Personal Information</Text>
                        <TextInput onBlur={onNameLoseFocus} style={styles.name} onChangeText={changeName} placeholder={'Name'} value={name} textContentType={'name'} autoComplete={'name'} />
                        {isNameAdequate ? <Text style={styles.emptyText} /> : <Text style={styles.alert}>이름은 특수기호를 포함할 수 없습니다.</Text>}
                        <TextInput onBlur={onNicknameLoseFocus} style={styles.nickname} onChangeText={changeNickname} placeholder={'Nickname'} value={nickname} textContentType={'nickname'} autoComplete={'name'} />
                        {isNicknameAdequate ? isNicknameUnique ? <Text style={styles.emptyText} /> : <Text style={styles.alert}>닉네임이 이미 존재합니다.</Text>: <Text style={styles.alert}>닉네임은 특수기호를 포함할 수 없습니다.</Text>}
                        <TextInput style={styles.studentId} onChangeText={setStudentId} placeholder={'Student ID'} value={studentId} textContentType={'nickname'} autoComplete={'name'} />
                        <Text style={styles.emptyText} />
                        <TextInput onBlur={onEmailLoseFocus} style={styles.email} onChangeText={changeEmail} placeholder={'Email'} value={email} textContentType={'emailAddress'} autoComplete={'emailAddress'} />
                        {isEmailAdequate ? <Text style={styles.emptyText} /> : <Text style={styles.alert}>이메일 형식이 잘못되었습니다.</Text>}
                        <TextInput onBlur={onPasswordLoseFocus} style={styles.password} onChangeText={changePw} placeholder={'Password'} value={pw} textContentType={"password"} secureTextEntry={true} autoComplete={'password'}/>
                        {isPasswordAdequate ? <Text style={styles.emptyText} /> : <Text style={styles.alert}>비밀번호는 최소 8자리이어야합니다.</Text>}
                        <TextInput onBlur={onCheckPwLoseFocus} style={styles.checkPw} onChangeText={changeCheckPw} placeholder={'Password Check'} value={checkPw} textContentType={"password"} secureTextEntry={true} autoComplete={'password'}/>
                        {isCheckPwAdequate ? <Text style={styles.emptyText} /> : <Text style={styles.alert}>비밀번호와 일치하지 않습니다.</Text>}
                    </View>
                    <Text style={styles.profileText} >Profile Photo</Text>
                    <TouchableOpacity style={styles.profileContainer} onPress={handleFileUpload}>
                        <Image style={styles.profileImg} source={profileSelected ? {uri: profileImg} : require('./Profile.png')} />
                    </TouchableOpacity>
                    <View style={{display: 'flex', flexDirection: 'column'}}>
                        <Text style={styles.terms}>이용약관</Text>
                        <Text style={styles.viewTerms}>이용약관 보기</Text>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <CheckBox isChecked={agreeAll} onClick={() => selectAgreeAll(!agreeAll)} style={styles.checkAll} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'} />
                            <Text style={styles.checkAllText}>아래 이용약관에 모두 동의합니다.</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <CheckBox isChecked={serviceAgree} onClick={() => selectService(!serviceAgree)} style={styles.serviceTerm} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'} />
                            <Text style={styles.serviceTermText}>서비스 이용약관 동의 (필수)</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <CheckBox isChecked={personalAgree} onClick={() => selectPersonal(!personalAgree)} style={styles.personalTerm} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'} />
                            <Text style={styles.personalTermText}>개인정보처리방침 동의 (필수)</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <CheckBox isChecked={communityAgree} onClick={() => selectCommunity(!communityAgree)} style={styles.communityTerm} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'} />
                            <Text style={styles.communityTermText}>커뮤니티 이용규칙 확인 (필수)</Text>
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <CheckBox isChecked={adAgree} onClick={() => selectAd(!adAgree)} style={styles.adTerm} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'} />
                            <Text style={styles.adTermText}>광고성 정보 수신 동의 (선택)</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.registration} onPress={handleRegistration}>
                        <Text style={{fontFamily: 'Candal', color: 'white',}}>Registration</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            }
        </View>
    )
}
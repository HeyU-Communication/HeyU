import React, {useState, useEffect, useCallback} from 'react';
import { StyleSheet, CheckBox, Text, View, Dimensions, TouchableOpacity, Image, Alert, TextInput, ScrollView } from 'react-native';
import { authService, dbService, getUniversities, storageService } from '../components/FirebaseFunction';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import { CircleSnail } from 'react-native-progress';

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
        },
        selectCountry: {
            left: 0.05 * width,
            fontFamily: 'Candal',
            fontSize: 10,
            marginTop: 10,
            marginBottom: 5,
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
        findYourUniversity: {
            left: 0.05 * width,
            fontFamily: 'Candal',
            fontSize: 10,
            marginBottom: 5,
        },
        personalInfo: {
            fontFamily: 'Candal',
            left: 0.05 * width,
            fontSize: 10,
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
            left: (0.05 * width) + 35,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: agreeAll ? 'black' : '#7C7C7C',
            marginBottom: -20,
            top: -22,
        },
        serviceTerm: {
            left: 0.05 * width,
        },
        serviceTermText: {
            left: (0.05 * width) + 35,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: serviceAgree ? 'black' : '#7C7C7C',
            marginBottom: -20,
            top: -22,
        },
        personalTerm: {
            left: 0.05 * width,
        },
        personalTermText: {
            left: (0.05 * width) + 35,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: personalAgree ? 'black' : '#7C7C7C',
            marginBottom: -20,
            top: -22,
        },
        communityTerm: {
            left: 0.05 * width,
        },
        communityTermText: {
            left: (0.05 * width) + 35,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: communityAgree ? 'black' : '#7C7C7C',
            marginBottom: -20,
            top: -22,
        },
        adTerm: {
            left: 0.05 * width,
        },
        adTermText: {
            left: (0.05 * width) + 35,
            fontSize: 10,
            fontFamily: 'AbhayaLibre_ExtraBold',
            color: adAgree ? 'black' : '#7C7C7C',
            top: -22,
            marginBottom: -5,
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
    const onNicknameLoseFocus = () => {
        const letters = /^[ㄱ-힣A-Za-z0-9 ]+$/
        if (letters.test(nickname) || nickname.length === 0) {
            setIsNicknameAdequate(true);
        }
        else {
            setIsNicknameAdequate(false);
        }
    }

    const [isEmailAdequate, setIsEmailAdequate] = useState(true);
    const onEmailLoseFocus = () => {
        if (email.length === 0) {
            setIsEmailAdequate(true);
        }
        else if (! email.includes("@") || ! email.includes('.')) {
            setIsEmailAdequate(false)
        }
        else if (email.indexOf('@') < 1 && email.indexOf("@") + 3 >= email.length && email.substring(email.indexOf("@") + 1, email.length).indexOf(".") < 0) {
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
            console.log('User created')
            const user = userCredential.user;
            let profileUrl = "default";
            if (profileSelected) {
                console.log('Profile selected')
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
                console.log("Profile uploaded")
                profileUrl = await snapshot.ref.getDownloadURL();
                console.log("Profile Img Link Retrieved")
            }
            console.log("Uploading profile")
            const uploadProfile = await dbService.collection('profile').doc(country).collection(university).doc(user.uid).set({
                name: name,
                email: email,
                nickname: nickname,
                verified: false,
                uid: user.uid,
                profileUrl: profileUrl,
            }).catch(err => console.log(err))
            console.log("Profile uploaded")
            console.log("Sending verification email")
            await authService.currentUser.sendEmailVerification().then(() => {
                setLoading(false);
                Alert.alert('회원 가입 성공!', 'A verification email has been sent to registered email address. Please click on the link in the email to activate your account. \n\n 계정 확인 메일이 입력하신 메일주소로 발송되었습니다. 이메일에 있는 링크를 눌러 계정을 활성화해주세요.')
                navigation.navigate('LoginScreen')
            }).catch(err => {
                console.log(err);
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
            <ScrollView style={styles.container}>
                <Text style={styles.registrationText}>Registration</Text>
                <View>
                    <Text style={styles.selectCountry}>Select Your Country</Text>
                    <DropDownPicker style={styles.countryPicker} textStyle={{fontFamily: 'Candal', fontSize: 10}} open={countryPickerOpen} value={country} items={countryData} onOpen={onCountryOpen} setOpen={setCountryPickerOpen} setValue={onSelectCountry} />
                    <Text style={styles.findYourUniversity}>Find Your University</Text>
                    <DropDownPicker style={styles.universityPicker}textStyle={{fontFamily: 'Candal', fontSize: 10}} open={universityPickerOpen} value={university} items={displayedUniversity} onOpen={onUnivOpen} setOpen={setUniversityPickerOpen} setValue={changeUniversity} setItems={changeUniversityData} />
                </View>
                <View>
                    <Text style={styles.personalInfo}>Personal Information</Text>
                    <TextInput onBlur={onNameLoseFocus} style={styles.name} onChangeText={changeName} placeholder={'Name'} value={name} textContentType={'name'} autoComplete={'name'} />
                    {isNameAdequate ? <Text style={styles.emptyText} /> : <Text style={styles.alert}>이름은 특수기호를 포함할 수 없습니다.</Text>}
                    <TextInput onBlur={onNicknameLoseFocus} style={styles.nickname} onChangeText={changeNickname} placeholder={'Nickname'} value={nickname} textContentType={'nickname'} autoComplete={'name'} />
                    <Text style={styles.emptyText} />
                    <TextInput style={styles.studentId} onChangeText={setStudentId} placeholder={'Student ID'} value={studentId} textContentType={'nickname'} autoComplete={'name'} />
                    {isNicknameAdequate ? <Text style={styles.emptyText} /> : <Text style={styles.alert}>닉네임은 특수기호를 포함할 수 없습니다.</Text>}
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
                <View>
                    <Text style={styles.terms}>이용약관</Text>
                    <Text style={styles.viewTerms}>이용약관 보기</Text>
                    <CheckBox value={agreeAll} onValueChange={selectAgreeAll} style={styles.checkAll} /><Text style={styles.checkAllText}>아래 이용약관에 모두 동의합니다.</Text>
                    <CheckBox value={serviceAgree} onValueChange={selectService} style={styles.serviceTerm} /><Text style={styles.serviceTermText}>서비스 이용약관 동의 (필수)</Text>
                    <CheckBox value={personalAgree} onValueChange={selectPersonal} style={styles.personalTerm} /><Text style={styles.personalTermText}>개인정보처리방침 동의 (필수)</Text>
                    <CheckBox value={communityAgree} onValueChange={selectCommunity} style={styles.communityTerm} /><Text style={styles.communityTermText}>커뮤니티 이용규칙 확인 (필수)</Text>
                    <CheckBox value={adAgree} onValueChange={selectAd} style={styles.adTerm} /><Text style={styles.adTermText}>광고성 정보 수신 동의 (선택)</Text>
                </View>
                <TouchableOpacity style={styles.registration} onPress={handleRegistration}>
                    <Text style={{fontFamily: 'Candal', color: 'white',}}>Registration</Text>
                </TouchableOpacity>
            </ScrollView>}
        </View>
    )
}
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, BackHandler, ScrollView, Alert, TextInput, Platform,} from 'react-native';
import Modal from "react-native-modal";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { getCalendarDateString } from 'react-native-calendars/src/services';
import months from '../components/months';
import days from '../components/days';
import koreanDays from '../components/koreanDays';
import koreanOrder from '../components/assets/fonts/koreanOrder';
import {Picker} from '@react-native-picker/picker';
import CheckBox from 'react-native-check-box';
import DropDownPicker from 'react-native-dropdown-picker';
import { dbService } from '../components/FirebaseFunction';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function AddTask(props) {

    //Schedule Datas
    let [title, setTitle] = useState("")
    let [startDate, setStartDate] = useState(new Date());
    let [endDate, setEndDate] = useState(new Date());
    let [repEndDate, setRepEndDate] = useState(new Date());
    let [startTime, setStartTime] = useState('0000')
    let [endTime, setEndTime] = useState('0100')
    let [startHour, setStartHour] = useState("00");
    let [startMinute, setStartMinute] = useState("00");
    let [endHour, setEndHour] = useState('00');
    let [endMinute, setEndMinute] = useState('00');
    let [canWeekly, setCanWeekly] = useState(true);
    let [isWeekly, setIsWeekly] = useState(false);
    let [canBiWeekly, setCanBiweekly] = useState(true);
    let [isBiweekly, setIsBiweekly] = useState(false);
    let [canDaily, setCanDaily] = useState(true);
    let [isDaily, setIsDaily] = useState(false);
    let [canMonthly, setCanMonthly] = useState(true);
    let [isMonthly, setIsMonthly] = useState(false);
    let [category, setCategory] = useState("");
    let [venue, setVenue] = useState("");
    let [description, setDescription] = useState('');
    
    //Controllers
    let [startDateSelectOpen, setStartDateSelectOpen] = useState(false);
    let [endDateSelectOpen, setEndDateSelectOpen] = useState(false);
    let [startTimeSelectOpen, setStartTimeSelectOpen] = useState(false);
    let [endTimeSelectOpen, setEndTimeSelectOpen] = useState(false);
    let [repEndDateSelectOpen, setRepEndDateSelectOpen] = useState(false);
    let [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

    //Picker Elements
    let [hourElements, setHourElements] = useState([])
    let [minuteElements, setMinuteElements] = useState([])

    //Category Data
    let [categoryRawData, setCategoryRawData] = useState([]);
    let [categoryData, setCategoryData] = useState([]);

    useEffect(() => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDay();
        const year = now.getFullYear();
        const str = year.toString() + '-' + month.toString() + '-' + day.toString();
        const temp = {};
        temp[str] = {
            'marked': true,
            'selected': true,
            'selectColor': '#FFDE00',
            'selectedDotColor': 'transparent',
        }
        setStartDate(now);
        setEndDate(now);
        applyTime();

        const hours = [];
        const minutes = [];
        for (let i = 0; i <= 23; i++) {
            if (i > 12) {
                hours.push(i.toString().padStart(2, '0'));    
            }
            else hours.push(i.toString().padStart(2, '0'));
        }
        for (let i = 0; i <= 59; i++) {
            minutes.push(i.toString().padStart(2, '0'));
        }

        const itemStyle = {
            borderTopLeftRadius: 10, 
            borderTopRightRadius: 10, 
            borderBottomLeftRadius: 10, 
            borderBottomRightRadius: 10,
            textAlign: 'center'
        }
        let i = 0;
        const hoursElement = hours.map(hour => {
                return <Picker.Item value={hour} label={hour + '시'} style={itemStyle}/>
        })
        const minutesElement = minutes.map(minute => <Picker.Item value={minute} label={minute + '분'} style={itemStyle} />)

        setHourElements(hoursElement)
        setMinuteElements(minutesElement)

        dbService.collection('profile').doc(props.country).collection(props.university).doc(props.accountId).collection('category').get().then(snapshot => {
            const temp = [];
            const tempIds = {};
            snapshot.forEach(doc => {
                let docData = doc.data();
                temp.push(docData);
                tempIds[docData.name] = doc.id;
            })
            setCategoryRawData(tempIds);
            setDropDownData(temp)
        })
    }, [])

    const setDropDownData = (data) => {
        const fin = [];
        
        data.forEach(element => {
            fin.push({
                label: element.name,
                value: element.name,
                icon: () => <View style={{width: 10, height: 10, border: 'none', backgroundColor: element.color}}/>
            })
        })
        setCategoryData(fin);
    }

    const applyTime = () => {
        setStartTime(startHour + startMinute);
        setEndTime(endHour + endMinute);
    }

    const selectStartDate = (dateObject) => {
        const tempDate = new Date();
        tempDate.setFullYear(dateObject.year);
        tempDate.setMonth(dateObject.month - 1);
        tempDate.setDate(dateObject.day);

        setStartDate(tempDate);
        if (tempDate > endDate) {
            setEndDate(tempDate)
        }
        if (tempDate > repEndDate) {
            setRepEndDate(tempDate)
        }
        applyTime();
        checkRepetition(tempDate, endDate)
        setStartDateSelectOpen(false);
    }

    const selectEndDate = (dateObject) => {
        const tempDate = new Date();
        tempDate.setFullYear(dateObject.year);
        tempDate.setMonth(dateObject.month - 1);
        tempDate.setDate(dateObject.day);

        setEndDate(tempDate);
        if (tempDate < startDate) {
            setStartDate(tempDate);
        }
        if (tempDate > repEndDate) {
            setRepEndDate(tempDate);
        }
        applyTime()
        checkRepetition(startDate, tempDate)
        setEndDateSelectOpen(false);
    }

    function getKoreanDateString(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return month + '월 ' + day + '일, ' + year;
    }

    function getCalendarDateString(date) {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return year + '-' + month + '-' + day;
    }

    function getCalendarTimeString(time) {
        const hour = time.substring(0,2);
        const minute = time.substring(2,4);
        return hour + ' : ' + minute;
    }

    function checkRepetition(f, s) {
        if (s - f > 1000 * 60 * 60 * 24 * 7) {
            setCanWeekly(false);
            setIsWeekly(false);
        }
        else {
            setCanWeekly(true);
        }

        if (s - f > 1000 * 60 * 60 * 24 * 14) {
            setCanBiweekly(false);
            setIsBiweekly(false);
        }
        else {
            setCanBiweekly(true);
        }

        if (s - f > 1000 * 60 * 60 * 24) {
            setCanDaily(false);
            setIsDaily(false);
        }
        else {
            setCanDaily(true);
        }
    }

    const handleStartDatePress = (e) => {
        e.preventDefault();
        const current = startDateSelectOpen;
        setStartDateSelectOpen(!current);
    }

    const handleStartTimePress = (e) => {
        e.preventDefault();
        const current = startTimeSelectOpen;
        setStartTimeSelectOpen(!current)
    }

    const handleStartTimeSelect = (e) => {
        setStartTime(startHour + startMinute)

        if (startDate == endDate && (startHour + startMinute) > (endTime)) {
            setEndTime(startHour + startMinute)
            setEndHour(startHour)
            setEndMinute(startMinute)
        }

        checkRepetition(startDate, endDate)

        setStartTimeSelectOpen(false)
    }

    const handleEndDatePress = (e) => {
        e.preventDefault();
        const current = endDateSelectOpen;
        setEndDateSelectOpen(!current)
    }

    const handleEndTimePress = (e) => {
        e.preventDefault();
        const current = endTimeSelectOpen;
        setEndTimeSelectOpen(!current)
    }

    const handleEndTimeSelect = (e) => {
        setEndTime(endHour + endMinute)

        if (endDate == startDate && endHour + endMinute < startTime) {
            setStartTime(endHour + endMinute)
            setStartHour(endHour)
            setStartMinute(endMinute)
        }

        checkRepetition(startDate, endDate)

        setEndTimeSelectOpen(false)
    }

    const handleChooseWeekly = (e) => {
        if (isWeekly) {
            setIsWeekly(false);
            return;
        }

        setIsBiweekly(false)
        setIsDaily(false)
        setIsWeekly(true);
        setIsMonthly(false);
    }

    const handleChooseBiweekly = (e) => {
        if (isBiweekly) {
            setIsBiweekly(false);
            return;
        }

        setIsBiweekly(true)
        setIsDaily(false)
        setIsWeekly(false);
        setIsMonthly(false);
    }

    const handleChooseDaily = (e) => {
        if (isDaily) {
            setIsDaily(false);
            return;
        }

        setIsBiweekly(false)
        setIsDaily(true)
        setIsWeekly(false);
        setIsMonthly(false);
    }

    const handleChooseMonthly = (e) => {
        if (isMonthly) {
            setIsMonthly(false);
            return;
        }

        setIsBiweekly(false)
        setIsDaily(false)
        setIsWeekly(false);
        setIsMonthly(true);
    }

    const handleRepEndDatePress = (e) => {
        e.preventDefault();
        const current = repEndDateSelectOpen;
        setRepEndDateSelectOpen(!current);
    }

    const selectRepEndDate = (dateObject) => {
        const tempDate = new Date();
        tempDate.setFullYear(dateObject.year);
        tempDate.setMonth(dateObject.month - 1);
        tempDate.setDate(dateObject.day);

        setRepEndDate(tempDate);
        setRepEndDateSelectOpen(false);
    }

    const handleSubmit = async (e) => {
        if (title.length == 0) {
            Alert.alert('', '제목을 입력해주세요')
            return;
        }
        const tempStart = new Date(startDate.getTime());
        const tempEnd = new Date(endDate.getTime());
        tempStart.setHours(parseInt(startHour));
        tempStart.setMinutes(parseInt(startMinute));
        tempEnd.setHours(parseInt(endHour));
        tempEnd.setMinutes(parseInt(endMinute));
        if (tempEnd - tempStart == 0) {
            Alert.alert('', '시작 날짜/시간과 끝나는 날짜/시간이 동일합니다')
            return;
        }
        props.closeModal()
        if (isRepChosen()) {
            dbService.collection('profile').doc(props.country).collection(props.university).doc(props.accountId).collection('regular').add({
                category: category == "" ? dbService.collection('profile').doc(props.country).collection(props.university).doc(props.accountId).collection('category').doc('noCategory') : dbService.collection('profile').doc(props.country).collection(props.university).doc(props.accountId).collection('category').doc(categoryRawData[category]),
                description: description,
                title: title,
                startDate: tempStart,
                endDate: tempEnd,
                venue: venue,
                repetition: isMonthly ? 'monthly' : isBiweekly ? 'biweekly' : isWeekly ? 'weekly' : isDaily ? 'daily' : 'none',
                repEndDate: repEndDate,
            })
        }
        else {
            dbService.collection('profile').doc(props.country).collection(props.university).doc(props.accountId).collection('episodic').add({
                category: category == "" ? dbService.collection('profile').doc(props.country).collection(props.university).doc(props.accountId).collection('category').doc('noCategory') : dbService.collection('profile').doc(props.country).collection(props.university).doc(props.accountId).collection('category').doc(categoryRawData[category]),
                description: description,
                title: title,
                startDate: tempStart,
                endDate: tempEnd,
                venue: venue,
            })
        }
    }

    const getDayInterval = () => {
        if (startDate.getDate() == endDate.getDate() && startDate.getFullYear() == endDate.getFullYear() && startDate.getMonth() == endDate.getMonth()) {
            if (isMonthly) {
                return countPrevDay(startDate) + ' ' + koreanDays[startDate.getDay()]
            }
            return koreanDays[startDate.getDay()];
        }
        else {
            if (isDaily) {
                return "";
            }
            if (isMonthly) {
                return countPrevDay(startDate) + ' ' + koreanDays[startDate.getDay()] + ' ~ ' + countPrevDay(endDate) + ' ' + koreanDays[endDate.getDay()]
            }
            if (isBiweekly) {
                if (endDate - startDate > 1000 * 60 * 60 * 24 * 6) {
                    return koreanDays[startDate.getDay()] + ' ~ 다음 주 ' + koreanDays[endDate.getDay()];
                }
                else {
                    return koreanDays[startDate.getDay()] + ' ~ ' + koreanDays[endDate.getDay()];
                }
            }
            const startDay = koreanDays[startDate.getDay()]
            const endDay = koreanDays[endDate.getDay()]
            return startDay + ' ~ ' + endDay;
        }
    }

    const getTimeInterval = () => {
        const thisStartTime = getCalendarTimeString(startTime);
        const thisEndTime = getCalendarTimeString(endTime);
        return thisStartTime + ' ~ ' + thisEndTime;
    }

    const isRepChosen = () => {
        if ((!canBiWeekly && !canWeekly && !canDaily && !canMonthly) || (!isBiweekly && !isWeekly && !isDaily && !isMonthly)) {
            return false;
        }
        else {
            return true;
        }
    }

    const countPrevDay = (tempDate) => {
        let date = tempDate.getDate();
        let day = tempDate.getDay();
        return koreanOrder[Math.ceil(date / 7)];
    }

    const repEndDateButton = {
        backgroundColor: '#E1E1E1',
        height: 30,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        width: 120,
        marginBottom: 10,
        color: (!canBiWeekly && !canWeekly && !canDaily && !canMonthly) || (!isBiweekly && !isWeekly && !isDaily && !isMonthly) ? 'grey' : 'black'
    };

    return (
        <View style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'Content'}}>
            <Modal isVisible={props.isVisible} deviceHeight={height} onBackButtonPress={() => props.closeModal()} style={{backgroundColor: 'white', borderWidth: 5, borderColor: '#EFD100', top: ((height - 738) / 2) - (height * 0.025) ,minHeight: 738, maxHeight: 738}}>
                <Modal isVisible={startDateSelectOpen} onBackdropPress={() => setStartDateSelectOpen(false)} onBackButtonPress={() => setStartDateSelectOpen(false)}>
                    <Calendar 
                        onDayPress={selectStartDate}
                        onDayLongPress={selectStartDate}
                        theme={{
                            arrowColor: '#FFDE00',
                            todayTextColor: '#FFDE00'
                        }}
                        style={{height: 350,}}
                    />
                </Modal>
                <Modal isVisible={endDateSelectOpen} onBackdropPress={() => setEndDateSelectOpen(false)} onBackButtonPress={() => setEndDateSelectOpen(false)}>
                    <Calendar 
                        onDayPress={selectEndDate}
                        onDayLongPress={selectEndDate}
                        theme={{
                            arrowColor: '#FFDE00',
                            todayTextColor: '#FFDE00'
                        }}
                        style={{height: 350,}}
                    />
                </Modal>
                <Modal isVisible={repEndDateSelectOpen} onBackdropPress={() => setRepEndDateSelectOpen(false)} onBackButtonPress={() => setRepEndDateSelectOpen(false)}>
                    <Calendar 
                        onDayPress={selectRepEndDate}
                        onDayLongPress={selectRepEndDate}
                        theme={{
                            arrowColor: '#FFDE00',
                            todayTextColor: '#FFDE00'
                        }}
                        style={{height: 350,}}
                        minDate={getCalendarDateString(endDate)}
                    />
                </Modal>
                <Modal isVisible={startTimeSelectOpen} onBackdropPress={() => setStartTimeSelectOpen(false)} onBackButtonPress={() => setStartTimeSelectOpen(false)}>
                    <View style={styles.timePicker}>
                        <Text style={styles.enterTimeText}>시작 시간</Text>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center',}}>
                            
                            <Picker
                                selectedValue={startHour}
                                onValueChange={(itemValue, itemIndex) =>
                                    setStartHour(itemValue)
                                }
                                style={Platform.OS == 'ios' ? 
                                    {backgroundColor: 'transparent', width: 100, height: 200, textAlign: 'center', borderRadius: 10} 
                                    :
                                    {backgroundColor: '#E1E1E1', width: 100, height: 50, textAlign: 'center', borderRadius: 10} 
                                }
                                itemStyle={{textAlign: 'center'}}
                                numberOfLines={1}
                            >
                                {hourElements}
                            </Picker>
                            <Text style={{marginLeft: 10, marginRight: 10, }}>:</Text>
                            <Picker
                                selectedValue={startMinute}
                                onValueChange={(itemValue, itemIndex) =>
                                    setStartMinute(itemValue)
                                }
                                style={Platform.OS == 'ios' ? 
                                    {backgroundColor: 'transparent', width: 100, height: 200, textAlign: 'center', borderRadius: 10} 
                                    :
                                    {backgroundColor: '#E1E1E1', width: 100, height: 50, textAlign: 'center', borderRadius: 10} 
                                }
                                itemStyle={{textAlign: 'center'}}
                            >
                                {minuteElements}
                            </Picker>
                            
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20,}}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setStartTimeSelectOpen(false)}><Text style={styles.cancelText}>취소</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleStartTimeSelect}><Text style={styles.cancelText}>확인</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal isVisible={endTimeSelectOpen} onBackdropPress={() => setEndTimeSelectOpen(false)} onBackButtonPress={() => setEndTimeSelectOpen(false)}>
                    <View style={styles.timePicker}>
                        <Text style={styles.enterTimeText}>끝나는 시간</Text>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                            
                            <Picker
                                selectedValue={endHour}
                                onValueChange={(itemValue, itemIndex) =>
                                    setEndHour(itemValue)
                                }
                                style={Platform.OS == 'ios' ? 
                                    {backgroundColor: 'transparent', width: 100, height: 200, textAlign: 'center', borderRadius: 10} 
                                    :
                                    {backgroundColor: '#E1E1E1', width: 100, height: 50, textAlign: 'center', borderRadius: 10} 
                                }
                                itemStyle={{textAlign: 'center'}}
                            >
                                {hourElements}
                            </Picker>
                            <Text style={{marginLeft: 10, marginRight: 10, }}>:</Text>
                            <Picker
                                selectedValue={endMinute}
                                onValueChange={(itemValue, itemIndex) =>
                                    setEndMinute(itemValue)
                                }
                                style={Platform.OS == 'ios' ? 
                                    {backgroundColor: 'transparent', width: 100, height: 200, textAlign: 'center', borderRadius: 10} 
                                    :
                                    {backgroundColor: '#E1E1E1', width: 100, height: 50, textAlign: 'center', borderRadius: 10} 
                                }
                                itemStyle={{textAlign: 'center'}}
                            >
                                {minuteElements}
                            </Picker>
                            
                        </View>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20,}}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setEndTimeSelectOpen(false)}><Text style={styles.cancelText}>취소</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={handleEndTimeSelect}><Text style={styles.cancelText}>확인</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                <View style={{display: 'flex', justifyContent: 'flex-start',}}>
                    <Text style={styles.addTaskDetails}>ADD TASK DETAILS</Text>
                    <View>
                        <Text style={{left: 20, fontFamily: 'AbhayaLibre_ExtraBold', marginTop: 10,}}>제목</Text>
                        <TextInput placeholder={'제목을 입력해주세요'} value={title} style={styles.eventTitle} onChangeText={setTitle}/>
                        <Text style={styles.eventDates}>날짜 / 시간</Text>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.startDateButton} onPress={handleStartDatePress} ><Text style={styles.startDateButtonText}>{getKoreanDateString(startDate)}</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.startTimeButton} onPress={handleStartTimePress}><Text style={styles.startDateButtonText}>{getCalendarTimeString(startTime)}</Text></TouchableOpacity>
                        </View>
                        <Text style={{lineHeight: 30, textAlignVertical: 'bottom', textAlign: 'center'}}> ~ </Text>
                        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                            <TouchableOpacity style={styles.startDateButton} onPress={handleEndDatePress}><Text style={styles.endDateButtonText}>{getKoreanDateString(endDate)}</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.startTimeButton} onPress={handleEndTimePress}><Text style={styles.startDateButtonText}>{getCalendarTimeString(endTime)}</Text></TouchableOpacity>
                        </View>
                        <Text style={styles.eventDates}>반복 선택</Text>
                        <View style={{display: 'flex', flexDirection: 'row',}}>
                            <View>
                                <View style={{marginLeft: 20, display: 'flex', flexDirection: 'row', marginBottom: 6,}}><CheckBox disabled={! canDaily} isChecked={isDaily} onClick={handleChooseDaily} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'} /><Text style={{textAlignVertical: 'center', color: canDaily ? 'black' : '#E1E1E1', fontFamily: 'Content' }}>매일 반복</Text></View>
                                <View style={{marginLeft: 20, display: 'flex', flexDirection: 'row', marginBottom: 6,}}><CheckBox isChecked={isWeekly} onClick={handleChooseWeekly} disabled={! canWeekly} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'} /><Text style={{textAlignVertical: 'center', color: canWeekly ? 'black' : '#E1E1E1', fontFamily: 'Content' }}>매주 반복</Text></View>
                                <View style={{marginLeft: 20, display: 'flex', flexDirection: 'row', marginBottom: 6,}}><CheckBox isChecked={isBiweekly} onClick={handleChooseBiweekly} disabled={! canBiWeekly} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'} /><Text style={{textAlignVertical: 'center', color: canBiWeekly ? 'black' : '#E1E1E1', fontFamily: 'Content' }}>격주 반복</Text></View>
                                <View style={{marginLeft: 20, display: 'flex', flexDirection: 'row'}}><CheckBox isChecked={isMonthly} onClick={handleChooseMonthly} disabled={! canMonthly} checkedCheckBoxColor={'#FFDE00'} uncheckedCheckBoxColor={'#FFDE00'} /><Text style={{textAlignVertical: 'center', color: canMonthly ? 'black' : '#E1E1E1', fontFamily: 'Content' }}>매달 반복</Text></View>
                            </View>
                            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <Text style={styles.intervalText}>{isRepChosen() ? getKoreanDateString(startDate) + '부터' : ""}</Text>
                                <Text style={styles.intervalText}>{isRepChosen() ? isWeekly ? "매주" : isBiweekly ? '격주' : isDaily ? '매일' : isMonthly ? '매달' : '' : " "}</Text>
                                <Text style={styles.intervalText}>{isRepChosen() ? getDayInterval() : ""}</Text>
                                <Text style={styles.intervalText}>{isRepChosen() ? getTimeInterval() : ""}</Text>
                                <View style={{display: 'flex', flexDirection: 'row', marginLeft: 30, alignItems: 'flex-end'}}>
                                    
                                    <TouchableOpacity style={repEndDateButton} onPress={handleRepEndDatePress} disabled={!isRepChosen()}><Text style={{textAlign: 'center', lineHeight: 30, fontFamily: 'Content', fontSize: 12, color: !isRepChosen() ? 'grey' : 'black'}}>{getKoreanDateString(repEndDate)}</Text></TouchableOpacity>
                                    <Text style={{marginLeft: 5, marginBottom: 15, color: !isRepChosen() ? 'grey' : 'black',}}>까지 반복</Text>
                                </View>
                            </View>
                            
                        </View>
                        <Text style={styles.eventDates}>카테고리</Text>
                        <DropDownPicker style={styles.categoryPicker} textStyle={{fontFamily: 'Candal', fontSize: 10}} placeholder={'카테고리를 선택해주세요.'} open={categoryPickerOpen} value={category} items={categoryData} setOpen={setCategoryPickerOpen} setValue={setCategory} labelStyle={{width: width * 0.8}} containerStyle={{width: width * 0.8, left: width * 0.05 - 5}}/>
                        <View style={{zIndex: 10, marginTop: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent: 'center', alignSelf: 'center'}}></View>
                        <Text style={styles.eventDates} zIndex={9}>장소</Text>
                        <TextInput zIndex={9} value={venue} onChangeText={setVenue} placeholder={'장소를 입력해주세요'} style={styles.venue}/>
                        <Text zIndex={9} style={styles.eventDates}>설명</Text>
                        <TextInput zIndex={9} style={styles.description} placeholder='설명을 입력해주세요' onChangeText={setDescription} value={description} multiline={true}/>
                        <View zIndex={9} style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30,}}>
                            <TouchableOpacity  zIndex={9} style={styles.cancel} onPress={props.closeModal}><Text style={styles.submitText}>취소</Text></TouchableOpacity>
                            <TouchableOpacity zIndex={9} style={styles.submit} onPress={handleSubmit}><Text style={styles.submitText}>확인</Text></TouchableOpacity>
                        </View>
                        
                    </View>
                </View>
                </ScrollView>
                
            </Modal>
        </View>
        
    )
}

const styles = StyleSheet.create({
    addTaskDetails: {
        left: 20,
        fontFamily: 'ContentBold',
        fontSize: 20,
        marginTop: 10,
    },
    eventTitle: {
        color: 'black',
        fontFamily: 'Content',
        fontSize: 12,
        left: 10,
        backgroundColor: '#E1E1E1',
        height: 40,
        width: (width * 0.85) - 10,
        paddingLeft: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginTop: 5,
    },
    eventDates: {
        fontFamily: 'AbhayaLibre_ExtraBold',
        left: 20,
        marginTop: 30,
        marginBottom: 8,
        zIndex: 9,
    },
    startDateButton: {
        backgroundColor: '#E1E1E1',
        height: 30,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        marginTop: 10,
        width: 150,
    },
    startDateButtonText: {
        lineHeight: 30,
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Content',
    },
    startTimeButton: {
        backgroundColor: '#E1E1E1',
        height: 30,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        marginTop: 10,
        marginLeft: 10,
        width: 150,
    },
    endDateButton: {
        marginTop: 10,
        width: 150,
        backgroundColor: '#E1E1E1',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        height: 30,
    },
    endDateButtonText: {
        lineHeight: 30,
        textAlign: 'center',
        fontFamily: 'Content',
        fontSize: 12,
    },
    enterTimeText: {
        marginTop: 30,
        marginBottom: Platform.OS == 'ios' ? 0 : 20,
        fontFamily: 'AbhayaLibre_ExtraBold',
        fontSize: 18,
        fontWeight: '800',
        textAlign: 'center'
    },
    timePicker: {
        backgroundColor: 'white', 
        height: Platform.OS == 'ios' ? 350 : 220,
        textAlign: 'center',
        borderWidth: 5,
        borderColor: '#FFDE00'
    },
    cancelButton: {
        backgroundColor: '#E1E1E1',
        width: 80,
        height: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
    },
    cancelText: {
        textAlign: 'center',
        lineHeight: 40,
    },
    confirmButton: {
        backgroundColor: '#FFDE00',
        width: 80,
        height: 40,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        marginLeft: 10,
        marginRight: 20,
    },
    categoryPicker: {
        width: width * 0.8,
    },
    venue: {
        backgroundColor: '#E1E1E1',
        width: (width * 0.85) - 10,
        height: 40,
        fontSize: 12,
        left: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingLeft: 20,
        marginTop: 5,
        zIndex: 9,
    },
    description: {
        backgroundColor: '#E1E1E1',
        minWidth: (width * 0.85) - 10,
        maxWidth: (width * 0.85) - 10,
        minHeight: 40,
        maxHeight: 150,
        fontSize: 12,
        left: 10,
        lineHeight: 25, 
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 5,
        zIndex: 9,
    },
    submit: {
        backgroundColor: '#EFD100',
        flex: 5,
        height: 50,
        borderWidth: 0,
        marginRight: -1,
        zIndex: 9,
    },
    cancel: {
        backgroundColor: '#E1E1E1',
        flex: 2,
        height: 50,
        borderWidth: 0,
        zIndex: 9,
    },
    submitText: {
        textAlign: 'center',
        lineHeight: 50,
        zIndex: 9,
    },
    intervalText: {
        color: 'black',
        marginLeft: 30,
        marginBottom: 6.5,
        fontSize: 12,
        zIndex: 9,
    }
})
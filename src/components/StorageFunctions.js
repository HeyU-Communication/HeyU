import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeString = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value)
        return true;
    } catch (e) {
        Alert.alert('저장 에러', e.message);
        return false;
    }
}

export const storeJSON = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value)
        await AsyncStorage.setItem(key, jsonValue);
        return true;
    } catch (e) {
        Alert.alert('저장 에러', e.message);
        return false;
    }
}

export const getStringData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if(value !== null) {
            return value;
        }
    } catch(e) {
        Alert.alert('Fetching 에러', e.message)
    }
}

export const getJSONData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key)
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
        Alert.alert('Fetching 에러', e.message)
    }
  }
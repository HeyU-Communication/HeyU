import AsyncStorage from '@react-native-async-storage/async-storage';

const setItem = AsyncStorage.setItem;
const getItem = AsyncStorage.getItem;

export default {setItem, getItem};
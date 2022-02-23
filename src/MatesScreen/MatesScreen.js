import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import SearchMates from "./SearchMates";
import MatesList from "./MatesList";
import MatesRequest from "./MatesRequest";
import { useNavigation , useFocusEffect} from "@react-navigation/native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;


export default function MatesScreen(props) {
  const [inputText, setInputText] = useState(false);
  let [selectedOption, setSelectedOption] = useState(1);
  let [option, setOption] = useState({})

  const matesBar = ["검색", "친구", "친구요청"];

  const onPressMessage = () => {};


  const { search } = inputText;

  if (props.option != option) {
    setOption(props.option);
    if (props.option.index == undefined) {
      setSelectedOption(1);
    }
    else {
      setSelectedOption(props.option.index);
    }
  }

  updateSearch = (search) => {
    useState({ search });
  };


  return (
    <View>
      <TouchableOpacity onPress={onPressMessage}>
        <Image
          style={styles.messageIcon}
          source={require("./MessageIcon.png")}
        />
      </TouchableOpacity>
      <View style={styles.matesBar}>
        {matesBar.map((element, i) => {
          const onPress = () => {
            setSelectedOption(i);
          };
          return (
            <TouchableOpacity
              onPress={onPress}
              style={
                selectedOption === i
                  ? styles.selectedOptionObject
                  : styles.optionObject
              }
            >
              <Text style={styles.matesBarText}>{element}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedOption === 0 && <SearchMates />}
      {selectedOption === 1 && <MatesList />}
      {selectedOption === 2 && <MatesRequest />}
    </View>
  );
}

const styles = StyleSheet.create({
  messageIcon: {
    position: "absolute",
    top: -20,
    right: 32,
    width: "15%",
    resizeMode: "contain",
  },
  matesBar: {
    position: "absolute",
    left: 0,
    top: 100,
    height: 40,
    width: "100%",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#FFE851",
    zIndex: 1,
  },
  selectedOptionObject: {
    flex: 1,
    backgroundColor: "#FFE851",
  },
  optionObject: {
    flex: 1,
  },
  matesBarText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    left: 0,
    top: 10,
  },
});

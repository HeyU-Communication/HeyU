import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";
import MatesList from "./MatesList";
import MatesRequest from "./MatesRequest";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function MatesScreen(props) {
  const [inputText, setInputText] = useState(false);
  let [selectedOption, setSelectedOption] = useState(1);

  const matesBar = ["검색", "친구", "친구요청"];

  const onPressMessage = () => {};

  const { search } = inputText;

  if (props.option.index >= 0) {
    setSelectedOption(props.option.index)
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
      <View style={styles.searchBar}>
        <SearchBar
          placeholder="이메일 주소, 핸드폰 번호"
          onChangeText={updateSearch()}
          value={search}
          lightTheme
          round
          containerStyle={{
            backgroundColor: "transparent",
            borderBottomColor: "transparent",
            borderTopColor: "transparent",
          }}
          inputContainerStyle={{
            borderColor: "#E4E4E4",
            borderWidth: 1,
            backgroundColor: "#FFFFFF",
            width: selectedOption === 0 || selectedOption === 1 ? "100%" : "0%",
            height:
              selectedOption === 0 || selectedOption === 1 ? "100%" : "0%",
          }}
          placeholderTextColor="#A1A1A1"
          pointerEvents={selectedOption === 2 && "none"}
        />
      </View>
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
  searchBar: {
    position: "absolute",
    width: "100%",
    height: 10,
    top: 150,
  },
});

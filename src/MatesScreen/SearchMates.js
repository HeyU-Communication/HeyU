import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

const SearchMates = () => {
  const [text, onChangeText] = useState("");

  const onPressSearch = () => {};

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchBarBox}
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={(text) => onChangeText(text)}
        value={text}
        placeholder={"검색어를 입력하세요"}
        placeholderTextColor={"grey"}
      />
      <TouchableOpacity style={styles.searchIconBox} onPress={onPressSearch}>
        <Text style={styles.searchIcon}>검색</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    top: 160,
  },
  searchBarBox: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFDE00",
    width: "70%",
    height: 30,
    color: "#A1A1A1",
    paddingLeft: 10,
  },
  searchIconBox: {
    position: "relative",
    backgroundColor: "#FFDE00",
    width: "20%",
    height: 30,
  },
  searchIcon: {
    position: "relative",
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    height: 30,
    lineHeight: 30,
  },
});

export default SearchMates;

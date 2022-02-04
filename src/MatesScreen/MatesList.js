import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";

const DATA = [
  {
    id: "1",
    title: "진",
  },
  {
    id: "2",
    title: "재혁",
  },
  {
    id: "3",
    title: "민구",
  },
  {
    id: "4",
    title: "종현",
  },
  {
    id: "5",
    title: "아라",
  },
  {
    id: "6",
    title: "다연",
  },
  {
    id: "7",
    title: "우진",
  },
  {
    id: "8",
    title: "재범",
  },
  {
    id: "9",
    title: "동화",
  },
  {
    id: "10",
    title: "서은",
  },
  {
    id: "11",
    title: "민석",
  },
  {
    id: "12",
    title: "승빈",
  },
  {
    id: "13",
    title: "석준",
  },
  {
    id: "14",
    title: "상준",
  },
  {
    id: "15",
    title: "주형",
  },
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <View style={styles.titleBox}>
      <Text style={styles.title}>{title}</Text>
    </View>
    <TouchableOpacity style={styles.chatButton}>
      <Image source={require("./ChatIcon.png")} style={styles.chatIcon} />
    </TouchableOpacity>
  </View>
);

const MatesList = () => {
  const renderItem = ({ item }) => <Item title={item.title} />;
  const [MatesData, setMatesData] = useState(DATA);
  const [text, onChangeText] = useState("");

  const onPressSearch = () => {
    setMatesData(filterPost(text));
  };

  function filterPost(query) {
    return DATA.filter((el) => {
      return (
        el.title
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) >= 0
      );
    });
  }

  return (
    <View style={styles.MatesList}>
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
      <View style={styles.container}>
        <FlatList
          data={MatesData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  MatesList: {
    top: 60,
  },
  container: {
    top: 120,
    height: "85%",
  },
  item: {
    flex: 1,
    width: "100%",
    backgroundColor: "transparent",
    borderColor: "#D1D1D1",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleBox: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
  },
  chatButton: {
    width: 80,
    height: 30,
  },
  chatIcon: {
    resizeMode: "contain",
    width: 60,
    height: 30,
  },
  searchBar: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    top: 100,
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

export default MatesList;

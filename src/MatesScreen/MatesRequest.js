import React from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
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
    <TouchableOpacity>
      <View style={styles.acceptIcon}>
        <Text style={styles.acceptText}>수락</Text>
      </View>
    </TouchableOpacity>
    <View style={styles.blank} />
    <TouchableOpacity>
      <View style={styles.declineIcon}>
        <Text style={styles.declineText}>거절</Text>
      </View>
    </TouchableOpacity>
    <View style={styles.blank} />
  </View>
);

const MatesRequest = () => {
  const renderItem = ({ item }) => <Item title={item.title} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 150,
    height: "90%",
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
  acceptIcon: {
    width: 50,
    height: 30,
    borderColor: "#D1D1D1",
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "#FFE851",
  },
  acceptText: {
    color: "black",
    fontSize: 13,
    textAlign: "center",
    paddingTop: 6,
  },
  blank: {
    width: 10,
  },
  declineIcon: {
    width: 50,
    height: 30,
    borderColor: "#D1D1D1",
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: "transparent",
  },
  declineText: {
    color: "black",
    fontSize: 13,
    textAlign: "center",
    paddingTop: 6,
  },
});

export default MatesRequest;

import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

const DATA = [
  {
    id: "1",
    title: "첫 번째 게시글",
    view: 10,
  },
  {
    id: "2",
    title: "두 번째 게시글",
    view: 10,
  },
  {
    id: "3",
    title: "세 번째 게시글",
    view: 10,
  },
  {
    id: "4",
    title: "네 번째 게시글",
    view: 10,
  },
  {
    id: "5",
    title: "다섯 번째 게시글",
    view: 10,
  },
  {
    id: "6",
    title: "여섯 번째 게시글",
    view: 10,
  },
  {
    id: "7",
    title: "일곱 번째 게시글",
    view: 10,
  },
  {
    id: "8",
    title: "여덟 번째 게시글",
    view: 10,
  },
  {
    id: "9",
    title: "아홉 번째 게시글",
    view: 10,
  },
  {
    id: "10",
    title: "열 번째 게시글",
    view: 10,
  },
];

const Item = ({ title, view }) => (
  <View style={styles.Item}>
    <Text style={styles.PostTitle}>{title}</Text>
    <Text style={styles.PostView}>{view}</Text>
  </View>
);

const PostList = () => {
  const renderItem = ({ item }) => <Item title={item.title} view={item.view} />;

  return (
    <View style={styles.Board}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled="false"
      />
      <View>
        <Text></Text>
      </View>
      <View style={styles.PostSearch}>
        <Text style={styles.PostSearchBox}></Text>
        <Text style={styles.PostSearchIcon}>Search</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Board: {
    top: 50,
    height: "80%",
  },
  Item: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#F5DF4D",
    borderBottomWidth: 1,
    padding: 10,
  },
  PostTitle: {
    paddingLeft: 10,
    fontWeight: "bold",
    color: "#000000",
    fontSize: 16,
  },
  PostView: {
    paddingRight: 10,
    color: "#CFCFCF",
    fontSize: 16,
  },
  PostSearch: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  PostSearchBox: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFDE00",
    width: "70%",
    height: 30,
  },
  PostSearchIcon: {
    position: "relative",
    backgroundColor: "#FFDE00",
    width: "15%",
    height: 30,
  },
});

export default PostList;

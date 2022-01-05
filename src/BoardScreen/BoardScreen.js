import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import PostList from "./PostList";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default function BoardScreen({ navigation }) {
  const onPressBoardTitle = () => {
    refreshPage;
  };
  const onPressMyPost = () => {};
  const onPressPopular = () => {};
  const onPressTitle = () => {};

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <View>
      <View>
        <TouchableOpacity onPress={onPressBoardTitle}>
          <View style={styles.Title}>
            <Text id={"Title"} style={styles.TitleLeft}>
              비밀 게시판
            </Text>
            <Text id={"Title"} style={styles.TitleBottom}>
              비밀 게시판
            </Text>
            <Text id={"Title"} style={styles.TitleRight}>
              비밀 게시판
            </Text>
            <Text id={"Title"} style={styles.TitleTop}>
              비밀 게시판
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressMyPost}>
          <Text style={styles.MyPosts}>내가 쓴 글</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.HotIssue}>
        <TouchableOpacity onPress={onPressPopular}>
          <Text style={styles.HotIssueText}>인기글</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressTitle}>
          <Text style={styles.HotIssueTitle}>제목</Text>
        </TouchableOpacity>
      </View>
      <PostList />
    </View>
  );
}

const styles = StyleSheet.create({
  Title: {
    paddingRight: 15,
    left: 10,
    top: 10,
  },
  TitleLeft: {
    position: "absolute",
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#FFDE00",
    textShadowOffset: { width: -1, height: 0 },
    textShadowRadius: 1,
  },
  TitleBottom: {
    position: "absolute",
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#FFDE00",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  TitleRight: {
    position: "absolute",
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#FFDE00",
    textShadowOffset: { width: 1, height: 0 },
    textShadowRadius: 1,
  },
  TitleTop: {
    position: "absolute",
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    textShadowColor: "#FFDE00",
    textShadowOffset: { width: 0, height: -1 },
    textShadowRadius: 1,
  },
  MyPosts: {
    top: 18,
    left: 110,
    color: "#999999",
    fontSize: 12,
    fontWeight: "bold",
  },
  HotIssue: {
    top: 40,
    padding: 10,
    backgroundColor: "#F5DF4D",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  HotIssueText: {
    color: "#000000",
    fontSize: 16,
    paddingRight: 15,
    fontWeight: "bold",
  },
  HotIssueTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  NativeModules,
  Alert,
  Keyboard,
} from "react-native";

const DATA = [
  {
    id: "1",
    title: "첫번째 게시글입니다",
    view: 10,
  },
  {
    id: "2",
    title: "두번째 게시글입니다",
    view: 10,
  },
  {
    id: "3",
    title: "다들 오늘 어떤 하루를 보내셨나요?",
    view: 10,
  },
  {
    id: "4",
    title: "강의 듣기 싫어요",
    view: 10,
  },
  {
    id: "5",
    title: "교수님 죄송합니다",
    view: 10,
  },
  {
    id: "6",
    title: "이런 코드를 썼기에",
    view: 10,
  },
  {
    id: "7",
    title: "제목제목제목제목",
    view: 10,
  },
  {
    id: "8",
    title: "팔딱팔딱 뛰는 가슴",
    view: 10,
  },
  {
    id: "9",
    title: "구해줘 오 내마음",
    view: 10,
  },
  {
    id: "10",
    title: "10년이 가도 난 너를 사랑해~",
    view: 10,
  },
  {
    id: "11",
    title: "Just like TT",
    view: 10,
  },
  {
    id: "12",
    title: "Im like TT",
    view: 10,
  },
  {
    id: "13",
    title: "이런 내 맘 모르고",
    view: 10,
  },
  {
    id: "14",
    title: "너무해 너무해",
    view: 10,
  },
  {
    id: "15",
    title: "Tell me that you'd be my baby",
    view: 10,
  },
  {
    id: "16",
    title: "혹시 이런 내 맘 알까요",
    view: 10,
  },
  {
    id: "17",
    title: "사라져버리면 안돼요",
    view: 10,
  },
  {
    id: "18",
    title: "이번에는 정말 꼭꼭",
    view: 10,
  },
  {
    id: "19",
    title: "내가 먼저 talk talk",
    view: 10,
  },
  {
    id: "20",
    title: "다짐뿐인 걸 매번 다짐뿐인 걸",
    view: 10,
  },
  {
    id: "21",
    title: "이렇게 난 또",
    view: 10,
  },
  {
    id: "22",
    title: "잊지 못하고",
    view: 10,
  },
  {
    id: "23",
    title: "내 가슴 속에 끝나지 않을",
    view: 10,
  },
  {
    id: "24",
    title: "이야길 쓰고 있어",
    view: 10,
  },
  {
    id: "25",
    title: "널 붙잡을게",
    view: 10,
  },
  {
    id: "26",
    title: "잊지 않을게",
    view: 10,
  },
  {
    id: "27",
    title: "끝나지 않을",
    view: 10,
  },
  {
    id: "28",
    title: "우리 이야기 속에서",
    view: 10,
  },
];

const Item = ({ title, view }) => (
  <View style={styles.Item}>
    <Text style={styles.PostTitle}>{title}</Text>
    <Text style={styles.PostView}>{view}</Text>
  </View>
);

const { StatusBarManager } = NativeModules;

const PostList = () => {
  const renderItem = ({ item }) => <Item title={item.title} view={item.view} />;

  const [articleRaw, setArticleRaw] = useState(DATA);

  const [value, onChangeText] = useState("");
  const [pageNumber, changePageNumber] = useState(0);
  const [sortedData, changeSortedData] = useState(DATA.slice(0, 10));
  const [searchPageNumber, changeSearchPageNumber] = useState(0);
  const [searchedData, changeSearchedData] = useState([]);
  const [searchingMode, setSearchingMode] = useState(false);
  const [displayedPageNumber, changeDisplayedPageNumber] = useState(0);

  const onPress = () => {
    changeSearchPageNumber(0);
    changeDisplayedPageNumber(0);
    if (value.length > 0) {
      setSearchingMode(true);
      const temp = filterPost(value);
      changeSearchedData(temp);
      changeSortedData(temp.slice(0, 10));
    } else {
      changeSearchedData([]);
      setSearchingMode(false);
      changeSortedData(articleRaw.slice(0, 10));
    }
    Keyboard.dismiss();
  };

  const onPressMostPreviousPage = () => {
    changeDisplayedPageNumber(0);
    if (searchingMode) {
      changeSearchPageNumber(0);
      changeSortedData(searchedData.slice(0, 10));
    } else {
      changePageNumber(0);
      changeSortedData(articleRaw.slice(0, 10));
    }
  };

  const onPressPreviousPage = () => {
    if (displayedPageNumber > 0) {
      changeDisplayedPageNumber(displayedPageNumber - 1);
    }
    if (searchingMode) {
      if (searchPageNumber > 0) {
        const temp = searchPageNumber - 1;
        changeSearchPageNumber(temp);
        changeSortedData(searchedData.slice(temp * 10, temp * 10 + 10));
      } else {
        Alert.alert("첫 페이지입니다.");
      }
    } else {
      if (pageNumber > 0) {
        const temp = pageNumber - 1;
        changePageNumber(temp);
        changeSortedData(articleRaw.slice(temp * 10, temp * 10 + 10));
      } else {
        Alert.alert("첫 페이지입니다.");
      }
    }
  };

  const onPressCurrentPage = () => {
    if (searchingMode) {
      const temp = searchedData.slice(
        searchPageNumber * 10,
        searchPageNumber * 10 + 10
      );
      changeSortedData(temp);
      changeDisplayedPageNumber(temp);
    } else {
      if (pageNumber > 0) {
        changeSortedData(
          articleRaw.slice(pageNumber * 10, pageNumber * 10 + 10)
        );
      }
    }
  };

  const onPressNextPage = () => {
    if (searchingMode) {
      if (searchPageNumber < Math.ceil(searchedData.length / 10 - 1)) {
        const temp = searchPageNumber + 1;
        changeSearchPageNumber(temp);
        changeDisplayedPageNumber(temp);
        changeSortedData(searchedData.slice(temp * 10, temp * 10 + 10));
      } else {
        Alert.alert("마지막 페이지입니다.");
      }
    } else {
      if (pageNumber < Math.ceil(articleRaw.length / 10 - 1)) {
        const temp = pageNumber + 1;
        changePageNumber(temp);
        changeDisplayedPageNumber(temp);
        changeSortedData(articleRaw.slice(temp * 10, temp * 10 + 10));
      } else {
        Alert.alert("마지막 페이지입니다.");
      }
    }
  };

  const onPressMostNextPage = () => {
    if (searchingMode) {
      const temp = Math.ceil(searchedData.length / 10 - 1);
      changeSearchPageNumber(temp);
      changeDisplayedPageNumber(temp);
      changeSortedData(searchedData.slice(temp * 10, temp * 10 + 10));
    } else {
      const temp = Math.ceil(articleRaw.length / 10 - 1);
      changePageNumber(temp);
      changeDisplayedPageNumber(temp);
      changeSortedData(articleRaw.slice(temp * 10, temp * 10 + 10));
    }
  };

  function filterPost(query) {
    return articleRaw.filter((el) => {
      return (
        el.title
          .toString()
          .toLowerCase()
          .indexOf(query.toString().toLowerCase()) >= 0
      );
    });
  }

  useEffect(() => {
    Platform.OS == "ios"
      ? StatusBarManager.getHeight((statusBarFrameData) => {
          setStatusBarHeight(statusBarFrameData.height);
        })
      : null;
  }, []);

  const [statusBarHeight, setStatusBarHeight] = useState(0);

  return (
    <View style={styles.Board}>
      <FlatList
        data={sortedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
      <View style={styles.PageNumber}>
        <TouchableOpacity>
          <Text style={styles.PageChange} onPress={onPressMostPreviousPage}>
            {"<<"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={{
              padding: 15,
              color: "#000000",
              fontSize: 15,
              color: displayedPageNumber === 0 ? "transparent" : "#000000",
            }}
            onPress={onPressPreviousPage}
          >
            {displayedPageNumber}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.CurrentPage} onPress={onPressCurrentPage}>
            {displayedPageNumber + 1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={{
              padding: 15,
              color: "#000000",
              fontSize: 15,
              color:
                (searchingMode &&
                  searchPageNumber >=
                    Math.ceil(searchedData.length / 10 - 1)) ||
                pageNumber >= Math.ceil(articleRaw.length / 10 - 1)
                  ? "transparent"
                  : "#000000",
            }}
            onPress={onPressNextPage}
          >
            {displayedPageNumber + 2}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.PageChange} onPress={onPressMostNextPage}>
            {">>"}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={"padding"}
        keyboardVerticalOffset={statusBarHeight + 140}
      >
        <View style={styles.PostSearch}>
          <TextInput
            style={styles.PostSearchBox}
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={(text) => onChangeText(text)}
            value={value}
            placeholder={"검색어를 입력하세요"}
            placeholderTextColor={"grey"}
          />
          <TouchableOpacity style={styles.PostSearchIconBox} onPress={onPress}>
            <Text style={styles.PostSearchIcon}>검색</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    top: 10,
  },
  PostSearchBox: {
    position: "relative",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFDE00",
    width: "70%",
    height: 30,
    color: "#A1A1A1",
    paddingLeft: 10,
  },
  PostSearchIconBox: {
    position: "relative",
    backgroundColor: "#FFDE00",
    width: "20%",
    height: 30,
  },
  PostSearchIcon: {
    position: "relative",
    color: "#FFFFFF",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 16,
    height: 30,
    lineHeight: 30,
  },
  PageNumber: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  PageChange: {
    padding: 15,
    color: "#000000",
    fontSize: 15,
  },
  PreviousPage: {
    padding: 15,
    color: "#000000",
    fontSize: 15,
  },
  CurrentPage: {
    height: 40,
    width: 40,
    textAlign: "center",
    lineHeight: 40,
    color: "#000000",
    fontSize: 15,
    backgroundColor: "#FFDF00",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden",
    margin: 5,
  },
  NextPage: {
    padding: 15,
    color: "#000000",
    fontSize: 15,
  },
});

export default PostList;

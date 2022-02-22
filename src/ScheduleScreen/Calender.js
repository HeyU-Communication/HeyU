import React, { Component } from 'react';
import { SafeAreaView, View, StyleSheet, Alert, ScrollView } from 'react-native';
import TimeTableView, { genTimeBlock } from 'react-native-timetable';

export default class App extends Component {
    constructor(props) {
      super(props);
      this.state = {
          startTime: 0,
          endTime: 24,
          pivotDay: genTimeBlock("MON"),
          eventData: [],
      }
    }

    componentDidMount() {
      this.setState({
        eventData: this.props.eventData,
      })
    }

    static getDerivedStateFromProps(newProps, currentState) {
      return {
        eventData: newProps.eventData,
        startTime: Math.floor(parseInt(newProps.startTime) / 100),
        endTime: Math.ceil(parseInt(newProps.endTime) / 100),
      }
    }

    componentDidUpdate() {
      
    }

    scrollViewRef = (ref) => {
        this.timetableRef = ref;
    };

    onEventPress = (evt) => {
        Alert.alert(evt.name, evt.description);
    };

    render() {
        return (
          <View style={styles.container} horizontal>
            <TimeTableView
              scrollViewRef={this.scrollViewRef}
              events={this.state.eventData}
              pivotTime={this.state.startTime}
              pivotEndTime={this.state.endTime}
              pivotDate={this.state.pivotDay}
              nDays={7}
              onEventPress={this.onEventPress}
              headerStyle={styles.headerStyle}
              formatDateHeader="dddd"
              locale="ko"
            />
          </View>
        );
      }
}

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: '#FFDE00',
        color: 'black',
    },
    container: {
        backgroundColor: '#F8F8F8',
        width: 600,
    },
})
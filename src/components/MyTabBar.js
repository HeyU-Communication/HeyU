import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        const thisStyle = {
          color: isFocused ? 'black' : '#808080',
          textAlign: 'center',
          backgroundColor: isFocused ? '#FFDE00' : '#FFFCE4',
          borderWidth: isFocused ? 1 : 0,
          borderColor: isFocused? 'black' : 'white',
          borderBottomWidth: 0,
          borderBottomColor: 'transparent',
          borderTopWidth: 1,
          borderTopColor: 'black',
          height: 50,
          paddingTop: 15,
          fontWeight: "bold",
        }

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text style={thisStyle}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({

})
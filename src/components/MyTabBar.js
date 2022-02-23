import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';



export default function MyTabBar({ state, descriptors, navigation, propsTo, propsSetTo }) {
  let key = -1;
  const [to, setTo] = useState(propsTo);

  console.log("To: " + to);
  console.log("PropsTo: " + propsTo)

  if (to != propsTo) {
    setTo(propsTo);
  }

  useEffect(() => {
    if (to != undefined) {
      navigation.navigate({ name: to, merge: true });
    }
  }, [to])

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
            key = key + 1;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && ! event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
            setTo(route.name);
            propsSetTo(route.name);
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
          backgroundColor: isFocused ? '#F5DF4D' : '#FFFCE4',
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
            key={key}
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
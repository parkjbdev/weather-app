import React, {useState} from 'react';
import {Alert, Button, Text} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
// import Swipeout from 'react-native-swipeout';
import Settings from "./src/Settings";
import Main from "./src/Main";

const App = () => {
  const [savedCities, setSavedCities] = useState<City[]>([
    {name: "Sterling", latitude: 40.626743, longitude: -103.217026},
    {name: "Steamboat Springs", latitude: 40.490429, longitude: -106.842384},
    {name: "Ouray", latitude: 38.025131, longitude: -107.675880},
    {name: "Leadville", latitude: 39.247478, longitude: -106.300194},
    {name: "Gunnison", latitude: 38.547871, longitude: -106.938622},
    {name: "Fort Morgan", latitude: 40.255306, longitude: -103.803062},
    {name: "Panama City", latitude: 30.193626, longitude: -85.683029},
  ])
  const Stack = createStackNavigator();
  const onAddCity = () => {
    Alert.alert("Add City", "Add Latitude & Longitude of the city")
  }
  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Home" options={{
          headerShown: false,
          headerShadowVisible: false
        }}>
          {() => <Main savedCities={savedCities} />}
        </Stack.Screen>
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name="Settings" options={{
          headerShadowVisible: false,
          headerStyle: {backgroundColor: "#6667ab"},
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerRight: () => {
            const navigator = useNavigation()
            return <Text onPress={navigator.goBack} style={{fontSize: 16, color: "white", margin: 16}}>Done</Text>
          },
          headerLeft: () => <Text onPress={onAddCity} style={{fontSize: 16, color: "white", margin: 16}}>Add</Text>
        }}>
          {() => <Settings cities={savedCities} setCities={setSavedCities} />}
        </Stack.Screen>
      </Stack.Group>
    </Stack.Navigator>
  </NavigationContainer>
}

export default App
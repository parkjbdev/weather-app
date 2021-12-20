import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import Settings from "./src/Settings";
import Main from "./src/Main";
import { fetchCity } from './src/Fetch';
import { GooglePlacesAutocomplete, Point } from 'react-native-google-places-autocomplete';
import { GOOGLE_API_KEY } from './config.json'
import Modal from 'react-native-modal'

type AddCity = ({ latitude, longitude }: Coord) => Promise<void>

const App = () => {
  const [cities, setCities] = useState<City[]>([
    { name: "Sterling", latitude: 40.626743, longitude: -103.217026 },
    { name: "Steamboat Springs", latitude: 40.490429, longitude: -106.842384 },
    { name: "Ouray", latitude: 38.025131, longitude: -107.675880 },
    { name: "Leadville", latitude: 39.247478, longitude: -106.300194 },
    { name: "Gunnison", latitude: 38.547871, longitude: -106.938622 },
    { name: "Fort Morgan", latitude: 40.255306, longitude: -103.803062 },
    { name: "Panama City", latitude: 30.193626, longitude: -85.683029 },
  ])
  const Stack = createStackNavigator();

  const GooglePlacesInput = () => {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search'
        fetchDetails={true}
        onPress={(data, details) => {
          const { lat, lng }: Point = details?.geometry.location!
          addCity({ latitude: lat, longitude: lng })
          closeModal()
        }}
        query={{ key: GOOGLE_API_KEY }}
      />
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false)
  const closeModal = () => setIsModalVisible(false)
  const openModal = () => setIsModalVisible(true)

  const AddCityModal = () => {
    return (
      <Modal isVisible={isModalVisible}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ alignItems: "center", margin: 16 }}>
            <Text style={{ color: "white", fontSize: 24 }}>Add City</Text>
          </View>
          <GooglePlacesInput />
          <Button title="Cancel" onPress={closeModal} />
        </SafeAreaView>
      </Modal>
    )
  }

  const addCity: AddCity = async ({ latitude, longitude }: Coord) => {
    const name: string = await fetchCity({ latitude, longitude }) || ""
    setCities([...cities, { name, latitude, longitude }])
  }

  return <NavigationContainer>
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Home" options={{
          headerShown: false,
          headerShadowVisible: false
        }}>
          {() => <Main savedCities={cities} />}
        </Stack.Screen>
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Settings" options={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: "#6667ab" },
          headerTintColor: "white",
          headerTitleAlign: "center",
          headerRight: () => {
            const navigator = useNavigation()
            return <Text onPress={() => navigator.goBack()} style={{ fontSize: 16, color: "white", margin: 16 }}>Done</Text>
          },
          headerLeft: () => <Text onPress={openModal} style={{ fontSize: 16, color: "white", margin: 16 }}>Add</Text>
        }}>
          {() => (<View style={{ flex: 1 }}><AddCityModal /><Settings cities={cities} setCities={setCities} /></View>)}
        </Stack.Screen>
      </Stack.Group>
    </Stack.Navigator>
  </NavigationContainer>
}

export default App
import React, {useEffect, useState} from "react";
import * as Location from "expo-location";
import {Button, Linking, RefreshControl, ScrollView, StyleSheet, View} from "react-native";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import WeathersView from "./WeathersView";
import {useNavigation} from "@react-navigation/native";
import {SCREEN_WIDTH} from "./DeviceProps";

export const Main: React.FC<{ savedCities: City[] }> = ({savedCities}) => {
  const [locationPermission, setLocationPermission] = useState(false)
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>();
  
  const setCurrentLocation = async () => {
    try {
      const {granted} = await Location.requestForegroundPermissionsAsync()
      setLocationPermission(granted)
      
      if (granted) {
        const currentLocation = await Location.getCurrentPositionAsync({accuracy: 3})
        const coords = currentLocation.coords
        setLatitude(coords.latitude)
        setLongitude(coords.longitude)
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  useEffect(() => {
    setCurrentLocation()
  }, []);
  
  const navigation = useNavigation()
  
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <ScrollView pagingEnabled
                    indicatorStyle="white"
                    refreshControl={<RefreshControl refreshing={false}
                                                    onRefresh={() => navigation.navigate("Settings")} />}>
          {
            locationPermission ?
              <WeathersView latitude={latitude} longitude={longitude} /> :
              <WeathersView>
                <View style={styles.weatherView}>
                  <Button title={"Open Settings"} onPress={() => Linking.openSettings()} color={"#fff"} />
                </View>
              </WeathersView>
          }
          {savedCities.length !== 0 &&
            savedCities.map(city => <WeathersView key={city.latitude + "." + city.longitude} {...city} />)}
        </ScrollView>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#6667ab"
  },
  weatherView: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  }
});

export default Main
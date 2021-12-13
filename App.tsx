import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import * as Location from 'expo-location'
import * as CONFIG from './config.json'

const {API_KEY} = CONFIG
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')

interface Coord {
  latitude: number,
  longitude: number
}

const getCity = async ({latitude, longitude}: Coord) => {
  try {
    return (await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false}))[0].city || undefined
  } catch (e) {
    console.log(e)
  }
}

const getWeather = async ({latitude, longitude}: Coord) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&appid=${API_KEY}`
    console.log(url)
    const res = await fetch(url)
    const json = await res.json()
    return json
  } catch (e) {
    console.log(e)
  }
}

export default function App() {
  const [locationPermission, setLocationPermission] = useState(false)
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>();
  
  const setCurrentLocation = async () => {
    try {
      const {granted} = await Location.requestForegroundPermissionsAsync()
      setLocationPermission(granted)
  
      const currentLocation = await Location.getCurrentPositionAsync({accuracy: 3})
      const coords = currentLocation.coords
      setLatitude(coords.latitude)
      setLongitude(coords.longitude)
    } catch (e) {
      console.log(e)
    }
  }
  
  useEffect(() => {
    setCurrentLocation()
  }, []);
  
  return (
    <View style={styles.container}>
      <ScrollView pagingEnabled indicatorStyle="white">
        {locationPermission && <WeatherView latitude={latitude} longitude={longitude} />}
        <WeatherView latitude={37.5665} longitude={126.9780} />
      </ScrollView>
    </View>
  );
}

const WeatherView: React.FC<{latitude?: number | undefined, longitude?: number | undefined}> = ({latitude, longitude}) => {
  const [city, setCity] = useState<string>()
  const [days, setDays] = useState([])
  
  const _getWeather = async () => {
    try {
      if (!latitude || !longitude) return
      const locationWeather = await getWeather({latitude, longitude})
      locationWeather.cod || setDays(locationWeather.daily)
      console.log(latitude, longitude, city, locationWeather)
    } catch (e) {
      console.log(e)
    }
  }
  const _getCity = async () => {
    if (!latitude || !longitude) return
    const city = await getCity({latitude, longitude})
    setCity(city)
  }
  
  useEffect(() => {
    _getWeather()
    _getCity()
  }, [latitude, longitude]);
  
  return (
    <View style={{height: SCREEN_HEIGHT}}>
      <View style={styles.city}>
        {
          city ?
            <Text style={styles.cityName}>{city}</Text> :
            <View>
              <ActivityIndicator />
              <Text style={styles.cityName}>Loading</Text>
            </View>
        }
      </View>
      <ScrollView pagingEnabled horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.weather}>
        {
          days.length === 0 ?
            <View style={styles.day}>
              <ActivityIndicator color="white" size="large" />
            </View> :
            days.map((day: any, index) => {
              const date = new Date(day.dt * 1000)
              return (<View key={index} style={styles.day}>
                <Text style={styles.date}>{date.toLocaleString('default', {month: 'long', day: "numeric"})}</Text>
                <Image style={{width: 200, height: 200}}
                       source={{uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`}} />
                <Text style={styles.details}>{day.weather[0].description}</Text>
                <Text style={styles.temp}>{Math.round(day.temp.day)}<Text style={{fontSize: 50}}>°C</Text></Text>
                <Text style={styles.details}>{Math.round(day.temp.min)}°C / {Math.round(day.temp.max)}°C</Text>
              </View>)
            })
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6667ab"
  },
  city: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center"
  },
  cityName: {
    color: "#fff",
    fontSize: 56,
    fontWeight: "600"
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  date: {
    color: "#fff",
    fontSize: 45,
    fontWeight: "200",
  },
  temp: {
    color: "#fff",
    fontSize: 160,
    fontWeight: "600",
    marginTop: -30,
  },
  tempMinMax: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "200"
  },
  description: {
    color: "#fff",
    fontSize: 50,
    marginTop: 14
  },
  details: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "200",
    marginTop: -20,
    marginBottom: 30
  }
});

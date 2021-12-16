import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, ScrollView, StyleSheet, Text, View} from "react-native";
import * as Location from "expo-location";
import {API_KEY} from "../config.json";
import {SCREEN_WIDTH, SCREEN_HEIGHT} from "./DeviceProps";

// DEBUG
import {TEST} from "../config.json"
import test from '../test/test.json'

type WeathersViewProps = { name?: string, latitude?: number, longitude?: number, children?: React.ReactElement }

const getCity = async ({latitude, longitude}: Coord) => {
  try {
    const a = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false})
    console.log(a)
    return (await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false}))[0].city || undefined
  } catch (e) {
    console.log(e)
  }
}

const getWeather = async ({latitude, longitude}: Coord) => {
  // DEBUG
  if (TEST) return test
  try {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&appid=${API_KEY}`
    const res = await fetch(url)
    return await res.json()
  } catch (e) {
    console.log(e)
  }
}

const WeathersView: React.FC<WeathersViewProps> = ({name, latitude, longitude, children}) => {
  const [city, setCity] = useState<string | undefined>(name || undefined)
  const [days, setDays] = useState<any[]>([])
  
  const _getWeather = async () => {
    if (!latitude || !longitude) return
    try {
      const locationWeather = await getWeather({latitude, longitude})
      locationWeather && locationWeather.daily && setDays(locationWeather.daily)
    } catch (e) {
      console.log(e)
    }
  }
  const _getCity = async () => {
    if (!latitude || !longitude) return
    const _city = await getCity({latitude, longitude})
    setCity(_city)
  }
  
  useEffect(() => {
    _getWeather()
    !city && _getCity()
  }, [latitude, longitude]);
  
  return (
    <View style={{height: SCREEN_HEIGHT}}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city || "Loading"}</Text>
      </View>
      <ScrollView pagingEnabled horizontal
                  showsHorizontalScrollIndicator={false}>
        {
          children ||
          (days.length === 0 ?
            <View style={styles.day}>
              <ActivityIndicator color="white" size="large" />
            </View> :
            days.map((day: any, index) => {
              const date = new Date(day.dt * 1000)
              return (<View key={index} style={styles.day}>
                <Text style={styles.date}>{date.toLocaleDateString('default', {month: 'long', day: "numeric"})}</Text>
                <Image style={{width: 200, height: 200}}
                       source={{uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png`}} />
                <Text style={styles.details}>{day.weather[0].description}</Text>
                <Text style={styles.temp}>{Math.round(day.temp.day)}<Text style={{fontSize: 50}}>°C</Text></Text>
                <Text style={styles.details}>{Math.round(day.temp.min)}°C / {Math.round(day.temp.max)}°C</Text>
              </View>)
            }))
        }
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

export default WeathersView
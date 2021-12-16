import * as Location from "expo-location";
import {API_KEY, TEST} from "../config.json";
import test from "../test/test.json";

const fetchCity = async ({latitude, longitude}: Coord) => {
  try {
    return (await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false}))[0].city || undefined
  } catch (e) {
    console.log(e)
  }
}

const fetchWeather = async ({latitude, longitude}: Coord) => {
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

export {fetchCity, fetchWeather}
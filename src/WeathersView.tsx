import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./DeviceProps";
import { fetchCity, fetchWeather } from "./Fetch";

type WeathersViewProps = { name?: string, latitude?: number, longitude?: number, children?: React.ReactElement }

const temperature = (value: number) => `${Math.round(value)}°C`

const WeathersView: React.FC<WeathersViewProps> = ({ name, latitude, longitude, children }) => {
  const [city, setCity] = useState<string | undefined>(name || undefined)
  const [days, setDays] = useState<any[]>([])

  const safeAreaTop = useSafeAreaInsets().top
  const safeAreeBottom = useSafeAreaInsets().bottom

  const safeareaHeight = useSafeAreaInsets().bottom + useSafeAreaInsets().top

  useEffect(() => {
    if (!latitude || !longitude) return

    (async () => {
      const locationWeather = await fetchWeather({ latitude, longitude })
      locationWeather && locationWeather.daily && setDays(locationWeather.daily)
    })()

    !city && (async () => {
      const fetchedCity = await fetchCity({ latitude, longitude })
      fetchedCity && setCity(fetchedCity)
    })()
  }, [latitude, longitude]);

  return (
    <View style={{ height: SCREEN_HEIGHT - safeareaHeight, alignItems: "center", flex: 1, marginTop: safeAreaTop, marginBottom: safeAreeBottom }}>
      <View style={[defaultStyles.fullWidth, styles.city, { flex: 3 }]}>
        <Text style={styles.cityName}>{city || "Loading"}</Text>
      </View>
      <View style={{ flex: 8 }}>
        <ScrollView pagingEnabled horizontal
          showsHorizontalScrollIndicator={false}>
          {children || (days.length === 0 ?
            <View style={styles.weatherView}>
              <ActivityIndicator color="white" size="large" />
            </View> :
            days.map((day: any, index) => {
              const date = new Date(day.dt * 1000).toLocaleDateString('default', { month: 'long', day: "numeric" })
              return (<View key={index} style={styles.weatherView}>
                <Text style={[defaultStyles.lightText, styles.date]}>{date}</Text>
                <Image style={{ width: 200, height: 200 }}
                  source={{ uri: `http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png` }} />
                <Text style={[defaultStyles.lightText, styles.details]}>{day.weather[0].description}</Text>
                <Text style={[defaultStyles.boldText, styles.mainTemp]}>
                  {Math.round(day.temp.day)}<Text style={{ fontSize: 50 }}>°C</Text>
                </Text>
                <Text style={[defaultStyles.lightText, styles.details]}>
                  {temperature(day.temp.min)} / {temperature(day.temp.max)}
                </Text>
              </View>)
            }))}
        </ScrollView>
      </View>
    </View>
  )
}

const defaultStyles = StyleSheet.create({
  themeColor: {
    backgroundColor: "#6667ab"
  },
  lightText: {
    color: "#fff",
    fontWeight: "200"
  },
  boldText: {
    color: "#fff",
    fontWeight: "600"
  },
  fullWidth: {
    width: SCREEN_WIDTH
  }
})

const styles = StyleSheet.create({
  city: {
    alignItems: "center",
    justifyContent: "center",
    // top: 70
  },
  cityName: {
    color: "#fff",
    fontSize: 56,
    fontWeight: "600"
  },
  weatherView: {
    flex: 1,
    width: SCREEN_WIDTH,
    alignItems: "center",
    justifyContent: "center"
  },
  date: {
    fontSize: 45
  },
  mainTemp: {
    fontSize: 160,
    marginTop: -30,
  },
  details: {
    fontSize: 40,
    marginTop: -20,
    marginBottom: 20
  },
});


export default WeathersView
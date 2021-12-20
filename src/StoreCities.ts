import AsyncStorage from "@react-native-async-storage/async-storage";
const StoreCities = async (cities: City[]) => {
  try {
    const value = JSON.stringify(cities);
    await AsyncStorage.setItem("@cities", value);
  } catch (e) {
    console.log(e);
  }
};

const LoadCities = async () => {
  const jsonValue = await AsyncStorage.getItem("@cities");
  return jsonValue != null ? JSON.parse(jsonValue) : null;
};

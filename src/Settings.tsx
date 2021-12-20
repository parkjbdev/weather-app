import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import * as Haptics from "expo-haptics"
import SwipeToDelete from "./SwipeToDelete";
import { SCREEN_HEIGHT } from "./DeviceProps";

const settingsStyles = StyleSheet.create({
  rowItem: {
    flex: 1,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 40,
    fontWeight: "200",
    textAlign: "center",
  },
});

const Settings: React.FC<{ cities: City[], setCities: Dispatch<SetStateAction<City[]>> }> = ({ cities, setCities }) => {
  const renderItem = ({ item, drag, isActive }: RenderItemParams<City>) => {
    const onDelete = () => setCities([...cities].filter(value => value !== item))
    return (
      <SwipeToDelete onDelete={onDelete}>
        <ScaleDecorator>
          <Pressable
            onLongPress={drag}
            disabled={isActive}
            style={[
              settingsStyles.rowItem,
              { backgroundColor: isActive ? "#ff8a8a" : item.color },
            ]}>
            <Text style={settingsStyles.text}>{item.name}</Text>
          </Pressable>
        </ScaleDecorator>
      </SwipeToDelete>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#6667ab" }}>
      <View style={{ flex: 1 }}>
        <DraggableFlatList
          style={{ height: SCREEN_HEIGHT }}
          data={cities}
          onDragBegin={Haptics.selectionAsync}
          onDragEnd={({ data }: { data: City[] }) => setCities(data)}
          keyExtractor={(city: City) => city.latitude + "." + city.longitude}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
}


export default Settings
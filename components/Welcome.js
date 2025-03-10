import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { IconButton, MD3Colors } from "react-native-paper";
import { useIsFocused} from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React from "react";

const Welcome = () => {
 const navigation = useNavigation();
 const [BaData, setBaData] = useState("");
 const isFocused = useIsFocused();

  // fetching user name from storage
  useEffect(() => {
    async function handleToken() {
      const token = await AsyncStorage.getItem("token");
      if (token) {

        setBaData(JSON.parse(token));
      }
    }

    handleToken();
  }, [isFocused]);

  function handleProfileScreen (){
    navigation.navigate("Home Main", {screen: "Profile"})
  }

  return (
    <View style={styles.screen}>
      {/* i need welcome text  and profile icon*/}
      <View>
        <Text style={styles.heading}>Hello,{BaData.name} {"\u{1F44B}"}</Text>
      </View>
      <IconButton
        containerColor='#fff'
        icon='account'
        iconColor='#000000'
        size={24}
        onPress={handleProfileScreen}
      />
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
    screen: {
        padding: 8,
        alignItems: 'center',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    heading: {
        fontSize: 20,
        color: "#fff",
        fontWeight: '800'
    }
})
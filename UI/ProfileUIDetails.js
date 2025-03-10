import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { GlobalStyles } from "../Constants/Globalcolors";

const ProfileUIDetails = ({ title, details, iconName, color }) => {
  return (
    <View style={styles.screen}>
      {/* first element */}
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.details}>{details}</Text>
      </View>
      {/* second element */}
      <View>
        <Ionicons name={iconName} size={24} color={color} />
      </View>
    </View>
  );
};

export default ProfileUIDetails;

const styles = StyleSheet.create({
    screen: {
        backgroundColor: GlobalStyles.colors.gray200,
        marginVertical: 2,
        marginHorizontal: 10,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 12,
        color: GlobalStyles.colors.gray500,
    },
    details: {
        fontSize: 16,
        fontWeight: '600'
    }
})

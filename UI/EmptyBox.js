import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

const EmptyBox = ({ noDataText }) => {
  return (
    <View style={styles.screen}>
      <View style={styles.imageContainer}>
        {/* component for image */}
        <Image
          source={require("../assets/image/out-of-stock.png")}
          style={styles.image}
        />
      </View>
      <Text style={styles.textEmpty}>{noDataText}</Text>
    </View>
  );
};

export default EmptyBox;

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  imageContainer: {
    width: 200,
    height: 200,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textEmpty: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600'
  }
});

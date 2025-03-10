import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";

const ImageLogo = ({ imagename }) => {
  return (
    <View style={styles.screen}>
      <Image
        source={imagename}
        style={styles.image}
      />
    </View>
  );
};

export default ImageLogo;

const styles = StyleSheet.create({
  screen: {
    borderRadius: 12,
    padding: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

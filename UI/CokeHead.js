import { useFonts } from 'expo-font';
import { Text, StyleSheet, Platform } from 'react-native';

const CocaColaTitle = ({size}) => {

  return <Text style={[styles.title, {fontSize: size}]}>Welcome!</Text>;
};

const styles = StyleSheet.create({
  title: {
    // padding: 12,
    fontWeight: "bold",
    paddingHorizontal: 6,
    color: '#000000',
    marginHorizontal: 16,
    // padding: 16,
  },
});

export default CocaColaTitle;

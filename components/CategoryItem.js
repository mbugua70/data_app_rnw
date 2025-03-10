import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Platform,
  } from "react-native";

  import { Badge } from "react-native-paper";


  const CategoryItem = ({ onNavigate, title, color, badgeNumber}) => {
    return (
      <View style={styles.gridNavItem}>
        <Pressable
          android_ripple={{ color: "#ccc" }}
          style={({ pressed }) => [
            styles.buttonContainer,
            pressed ? [styles.pressedButton, {backgroundColor: color}] : {backgroundColor: color},
          ]}
          onPress={onNavigate}
        >
          <View style={[styles.innerGridContainer]}>
          <Text style={styles.title}>{title}</Text>
             <View style={styles.container}>
               <Badge size={32} style={styles.badge}>{badgeNumber}</Badge>
               <Text style={styles.badgeText}>Forms</Text>
             </View>
          </View>
        </Pressable>
      </View>
    );
  };

  export default CategoryItem;

  const styles = StyleSheet.create({
    gridNavItem: {
      flex: 1,
      marginTop: 16,
      marginHorizontal: 8,
      height: 150,
      borderRadius: 8,
      elevation: 8,
      shadowRadius: 8,
      shadowColor: "#fff",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      overflow: Platform.OS === "android" ? "hidden" : "visible",
    },

    buttonContainer: {
      borderRadius: 8,
      flex: 1,
      height: "100%",
    },
    pressedButton: {
      opacity: Platform.OS === "android" ? 1 : 0.75,
    },

    innerGridContainer: {
      fllex: 1,
      height: "100%",
      padding: 16,
      borderRadius: 8,
      justifyContent: 'space-between',
      alignItems: "flex-start",
    },

    title: {
      fontWeight: "600",
      fontSize: 16,
      color: "#000000",
      marginRight: 4,
    },
    container: {
      flexDirection: "row",
      alignItems: "center",
    },
    badge: {
      marginRight: 10,
      fontSize: 16,
      fontWeight: 'bold',
    },
    badgeText: {
      fontSize: 22,
      fontWeight: "600",
      color: "#000000"
    }

  });

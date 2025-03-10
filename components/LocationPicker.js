import NetInfo from "@react-native-community/netinfo";
import { View, Text, StyleSheet, Image } from "react-native";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import React, { useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { getGoogleMapPreview } from "../util/location";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { AuthContext } from "../store/store";
import { GlobalStyles } from "../Constants/Globalcolors";

import SecondaryButton from "./SecondaryButton";
import Toast from "react-native-toast-message";

const LocationPicker = ({
  resetForm,
  onLocationHandler,
  pickedLocationState,
}) => {
  const [locationPermissionInformation, requestPermission] =
    Location.useForegroundPermissions();
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const { locationHandler, isLocation, pickedLocations } =
    useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();

  async function verifyLocationPermission() {
    if (
      locationPermissionInformation.status ===
      Location.PermissionStatus.UNDETERMINED
    ) {
      const isPermission = await requestPermission();
      return isPermission.granted;
    }

    if (
      locationPermissionInformation.status === Location.PermissionStatus.DENIED
    ) {
      Alert.alert(
        "Denied location Permission",
        "You need to accept location permission to continue"
      );
      return false;
    }

    return true;
  }

  useEffect(() => {
    if (route.params && isFocused) {
      const mapPickedLocation = {
        lat: route.params.pickedlat,
        long: route.params.pickedlng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  async function handleGetLocation() {
    const hasPermission = await verifyLocationPermission();

    if (!hasPermission) {
      return;
    }
    setIsFetchingLocation(true);
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setIsFetchingLocation(false);
    setPickedLocation({
      lat: coords.latitude,
      long: coords.longitude,
    });
  }


  React.useEffect(() => {
    if (pickedLocation) {
      onLocationHandler(pickedLocation);
      // locationHandler(pickedLocation);
    }
  }, [pickedLocation]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
      setIsInternetReachable(state.isInternetReachable);

      if (!state.isConnected) {
        Notifier.showNotification({
          title: "Network Error",
          description: "No network access, Please check your network!",
          Component: NotifierComponents.Notification,
          componentProps: {
            imageSource: require("../assets/image/no-network.png"),
            containerStyle: { backgroundColor: GlobalStyles.colors.error500 },
            titleStyle: { color: "#fff" },
            descriptionStyle: { color: "#fff" },
          },
        });
      }

      if (!state.isInternetReachable) {
        Notifier.showNotification({
          title: "Network Error",
          description: "No internet access!",
          Component: NotifierComponents.Notification,
          componentProps: {
            imageSource: require("../assets/image/no-network.png"),
            containerStyle: { backgroundColor: GlobalStyles.colors.error500 },
            titleStyle: { color: "#fff" },
            descriptionStyle: { color: "#fff" },
          },
        });
      }
    });

    return () => unsubscribe();
  }, [isFocused]);

  let content = (
    <View style={styles.emptyContainer}>
       <Image source={require("../assets/image/map.png")}  style={styles.fetchlocation} />
       <Text style={styles.emptyLocationText}>Fetch your current location</Text>
    </View>
  );

  if (isFetchingLocation) {
    content = (
      <ActivityIndicator
        animating={true}
        color={MD2Colors.lightBlueA700}
        size='small'
      />
    );
  }

  if (pickedLocationState) {
    const locationUrl = getGoogleMapPreview(
      pickedLocationState.lat,
      pickedLocationState.long
    );
    if (locationUrl) {
      content = <Image style={styles.image} source={{ uri: locationUrl }} />;
    } else {
      content = <Text style={styles.text}>Error showing the location</Text>;
    }
  }

  useEffect(() => {
    setPickedLocation("");
  }, [resetForm]);

  return (
    <View>
      <View style={styles.locationContainer}>{content}</View>
      <View style={styles.buttonHolder}>
        <View style={styles.buttoncontainer}>
          <SecondaryButton
            isFetchingLocation={isFetchingLocation}
            icon='location'
            onPress={handleGetLocation}>
            Locate User
          </SecondaryButton>
        </View>
      </View>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  locationContainer: {
    borderRadius: 6,
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlobalStyles.colors.gray800,
    marginTop: 18,
    elevation: 6,
    shadowColor: "gray",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 4,
  },

  text: {
    color: "#fff",
  },

  buttoncontainer: {
    flex: 1,
  },

  buttonHolder: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    columnGap: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  fetchlocation: {
    width: 100,
    height: 100,
  },
  emptyLocationText: {
    color: GlobalStyles.colors.gray200,
  }
});

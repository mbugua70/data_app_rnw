import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Notifier, NotifierComponents } from "react-native-notifier";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { ProjectContext } from "../store/projectContext";
import { getIndex } from "../util/getIndex";
import { AuthContext } from "../store/store";
import { GlobalStyles } from "../Constants/Globalcolors";

import FormItem from "../components/FormItem";
import Toast from "react-native-toast-message";
import { formRefetch } from "../http/api";

const FormScreen = ({ navigation, route }) => {
  const { formsData, addForms } = useContext(ProjectContext);
  const { projectID, projectName } = route.params;
  const [forms, setForms] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [isInternetReachable, setIsInternetReachable] = useState(false);
  const isFocused = useIsFocused();

  // mutation functionality
  const { data, mutate, isError, error, isPending } = useMutation({
    mutationFn: formRefetch,
    // the code below will wait the request to finish before moving to another page.
    onMutate: async (data) => {
      return data;
    },

    onSuccess: (data) => {
      if (data.response == "fail") {
        Toast.show({
          type: "error",
          text1: "Data refetch failed",
          text2: "Please try again!",
        });
      } else {
        const filteredForms = {
          project_id: data.project_id,
          forms: data.project_forms["0"].forms,
        };
        let filteredArray = [];
        filteredArray.push(filteredForms);
        addForms(filteredArray);
      }
    },
  });

  // network configuration
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
  }, []);

  useEffect(() => {
    formsData.forEach((project) => {
      if (projectID === project.project_id) {
        setForms(project.forms);
      }
    });
  }, [formsData]);

  // onRefresh func
  const onRefresh = React.useCallback(async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("No token found in AsyncStorage.");
    }

    let user;
    try {
      user = JSON.parse(token);
    } catch (error) {
      throw new Error("Failed to parse token.");
    }

    const baID = user?.ba_id || "Unknown";

    // mutation func
    mutate({ baID, projectName, projectID });
  }, []);

  function handleFormItem({ item, index }) {
    const rowIndex = Math.floor(index / 2);
    const isEvenRow = rowIndex % 2 === 0;
    function handleNavigation() {
      navigation.navigate("Report", {
        formID: item.form_id,
        formTitle: item.form_title,
      });
    }

    function handleRecordNavigation() {
      navigation.navigate("Records", {
        formID: item.form_id,
        formTitle: item.form_title,
      });
    }
    return (
      <>
        <View style={styles.screen}>
          <FormItem
            formID={item.form_id}
            isEvenRow={isEvenRow}
            index={index}
            title={item.form_title}
            onNavigateRecord={handleRecordNavigation}
            onNavigate={handleNavigation}
          />
        </View>
      </>
    );
  }

  // error handler

  useEffect(() => {
    if (error && !isPending) {
      Toast.show({
        type: "error",
        text1: "Failed to log in",
        text2: error.message,
      });
    } else if (error === "TOO_MANY_ATTEMPTS_TRY-LATER" && !isPending) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Too many attempts try later",
      });
    }
  }, [error, isPending]);

  return (
    <>
      <View style={styles.screenContainer}>
        <FlatList
          key={"numColumns_1"}
          data={forms}
          keyExtractor={(item) => item.form_id}
          renderItem={handleFormItem}
          contentContainerStyle={styles.flatListContainer}
          numColumns={2}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={isPending} />
          }
        />
      </View>
    </>
  );
};

export default FormScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  screen: {
    width: "50%",
  },
  flatListContainer: {
    paddingVertical: 20,
  },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { Notifier, NotifierComponents } from "react-native-notifier";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { ProjectContext } from "../store/projectContext";
import { useMutation } from "@tanstack/react-query";
import { HomeColors } from "../Constants/Globalcolors";
import { formRefetch, ProjectRefetch } from "../http/api";
import { GlobalStyles } from "../Constants/Globalcolors";

import CategoryItem from "../components/CategoryItem";
import Toast from "react-native-toast-message";
import EmptyBox from "../UI/EmptyBox";

const Home = ({ navigation }) => {
  const { projectsData, addProjects } = useContext(ProjectContext);
  const [isOffline, setIsOffline] = useState(false);
  const [isInternetReachable, setIsInternetReachable] = useState(false);

  // mutation functionality
  const { data, mutate, isError, error, isPending } = useMutation({
    mutationFn: ProjectRefetch,
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
        const filteredProjects = data.projects.map((project) => ({
          project_id: project.project_id,
          project_title: project.project_title,
          code_name: project.code_name,
          forms: project.forms,
        }));

        addProjects(filteredProjects);
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
    mutate(baID);
  }, []);

  let badgeNumber = 0;

  function handleCategoryItem({ item, index }) {
    function handleNavigation() {
      navigation.navigate("Forms", {
        projectID: item.project_id,
        projectName: item.project_title,
      });
    }

    badgeNumber = item.forms.length;

    return (
      <>
        <StatusBar hidden={true} />

        <View style={styles.screen}>
          <CategoryItem
            badgeNumber={badgeNumber}
            title={item.project_title}
            color='#cee8c7'
            onNavigate={handleNavigation}
          />
        </View>
      </>
    );
  }

  function handleNavigationRecord() {
    navigation.navigate("Record");
  }

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

  let content;

  if (projectsData.length === 0) {
    content = <EmptyBox noDataText='You are not assigned to any project' />;
  }

  content = (
    <FlatList
      key={"numColumns_1"}
      data={projectsData}
      keyExtractor={(item) => item.project_id}
      renderItem={handleCategoryItem}
      numColumns={2}
      refreshControl={
        <RefreshControl onRefresh={onRefresh} refreshing={isPending} />
      }
    />
  );

  return (
    <View style={styles.screenContainer}>
      {content}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  screen: {
    flex: 1,
  },
});

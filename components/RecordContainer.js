import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { IconButton, MD3Colors } from 'react-native-paper';
import { GlobalStyles } from "../Constants/Globalcolors";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../store/store";
import { ProjectContext } from "../store/projectContext";



const RecordContainer = ({index, formID, formTitle, item}) => {
  const {editDataHandler} = useContext(ProjectContext)
  const {formDateRecord} = useContext(AuthContext)
  const [dateNumber, setDateNumber] = useState()
  const [dateText, setDateText] = useState()
  const [dayOfWeek, setdayOfWeek] = useState()

   useEffect(() => {
    if(formDateRecord){
      const date = new Date(formDateRecord).toDateString().split(" ")
      setDateNumber(date[2])
      setDateText(date[1])
      setdayOfWeek(date[0])
    }
   }, [])

    const navigation =  useNavigation()

    function handleRecordEdit(){
        // store editing data
      editDataHandler(item)
        navigation.navigate("Record Edit", {
            formID: formID,
            formTitle: formTitle,
            item: item,
        })
    }

    const styling = {
        backgroundColor: index % 2 === 0 ? "#819c79" : "#fff",
        borderWidth: index % 2 === 0 ? 0 : 2,
        borderColor: index % 2 === 0 ? "#fff" : "#819c79"
      }

      const button = {
        mode: index % 2 === 0 ? "contained-tonal" : "contained"
      }

      const iconButton = {
        mode: index % 2 === 0 ? "contained-tonal" : "contained"
      }

      const iconColor = {
        color: index % 2 === 0 ? GlobalStyles.colors.gray600 : "#819c79",
      }

      const recordeTitle = {
        color: index % 2 === 0 ? "#fff" : "#000000"
      }

      const dayTextStyling = {
        color: index % 2 === 0 ? "#fff" : GlobalStyles.colors.gray600
      }


  return (
    <View style={styles.screen}>
      {/* date container */}
      <View style={styles.dateContainer}>
        <Text style={styles.boldText}>{dateNumber}</Text>
        <Text style={styles.lightText}>{dateText}</Text>
      </View>
      {/* main record container */}
      <View style={[styles.recordContainer, styling]}>
        <View>
          <Text style={[styles.boldText, recordeTitle]}>Record {index + 1}</Text>
          {/* button container */}
          <IconButton
            mode={iconButton.mode}
            icon='note-edit'
            iconColor={iconColor.color}
            size={20}
            onPress={handleRecordEdit}
          />
        </View>
        <View>
          <Text style={[dayTextStyling]}>{dayOfWeek}</Text>
        </View>
      </View>
    </View>
  );
};

export default RecordContainer;


const styles = StyleSheet.create({
   screen: {
    padding: 4,
    marginHorizontal: 16,
    flexDirection: 'row',
    columnGap: 10,
    marginVertical: 2,
   },
   recordContainer: {
    borderRadius: 12,
    padding: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
   },
   dateContainer: {
     justifyContent: 'center',
     rowGap: 6,
   },
   boldText: {
    fontSize: 16,
    fontWeight: "700",
   },

})

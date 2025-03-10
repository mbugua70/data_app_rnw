import { View, Text, StyleSheet } from 'react-native'
import { Badge } from 'react-native-paper';
import React from 'react'
import { GlobalStyles } from '../Constants/Globalcolors';

const BadgeUI = ({projectTitle, badgeValue}) => {

  return (
    <View style={styles.screen}>
      <Text style={styles.text}>{projectTitle}</Text>
      <Badge size={24}>{badgeValue}</Badge>
    </View>
  )
}

export default BadgeUI

const styles = StyleSheet.create({
    screen: {
        flexDirection: "row",
        marginTop: 5,
        columnGap: 4,
        alignItems: 'center'
    },
    text: {
        color: GlobalStyles.colors.gray500
    }

})
import { View, Text } from 'react-native'
import React from 'react'

const CustomText = ({title, textStyle}) => {
  return (
    <View>
      <Text className={`${textStyle}`}> {title}</Text>
    </View>
  )
}

export default CustomText
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const CustomButton = ({ buttonStyle, handlePress, textStyle, text = "Button" }) => {
  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle]} // Combine default styles with custom styles
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 8, // Default padding
    borderRadius: 30, // Default border radius
    justifyContent: 'center', // Default alignment
    alignItems: 'center', // Default alignment
    height: 39.642
  },
  text: {
    textAlign: 'center' // Default text alignment
  }
})

export default CustomButton

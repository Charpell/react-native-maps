import { View, Text, StyleSheet } from 'react-native'
import React, { FC } from 'react'
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { API_KEY } from './credentials';

type InputAutoCompleteProps = {
    label: string;
    placeholder?: string;
    onPlaceSelected: (details: GooglePlaceDetail | null) => void;
}

export const AutoComplete: FC<InputAutoCompleteProps> = ({
    label,
    placeholder,
    onPlaceSelected,
}) => {
  return (
    <View>
        <Text>{label}</Text>
       <GooglePlacesAutocomplete 
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ''}
        onPress={(data, details = null) => {
          onPlaceSelected(details)
          }}
          fetchDetails
        query={{
          key: API_KEY,
          language: 'en',
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    input: {
        borderColor: '#888',
        borderWidth: 1,
    }
})

import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants'
import { AutoComplete } from './AutoComplete';
import { GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import { useState, useRef } from 'react';
import { API_KEY } from './credentials';
import MapViewDirections from 'react-native-maps-directions';


const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: 40.76711,
  longitude: -73.979704,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
}

export default function App() {
  const [origin, setOrigin] = useState<GooglePlaceDetail | null>();
  const [destination, setDestination] = useState<GooglePlaceDetail | null>();
  const mapRef = useRef<MapView>(null);
  const [showDirection, setShowDirection] = useState(false)
  const [distance, setDistance] = useState(0)
  const [duration, setDuration] = useState(0);

  const moveTo = async (position: LatLng) => {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  }

  const onPlaceSelected = (details: GooglePlaceDetail | null, flag: 'origin' | 'destination') => {
    const set = flag === 'origin' ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    }
    set(position)
    moveTo(position)
  };

  const edgePaddingValue = 70;

  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  }

  const traceRouteOnReady = (args: any) => {
    if (args) {
      setDistance(args.distance)
      setDuration(args.duration)
    }
  }

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirection(true)
      mapRef.current?.fitToCoordinates([origin, destination], { edgePadding }
    )}
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
       style={styles.map}  
       provider={PROVIDER_GOOGLE} 
       initialRegion={INITIAL_POSITION}
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirection && origin && destination &&
         <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={API_KEY}
            strokeColor="#6644ff"
            strokeWidth={4}
            onReady={traceRouteOnReady}
          />
      }
      </MapView>
      <View style={styles.searchContainer}>
       <AutoComplete label='Origin' onPlaceSelected={(details) => {
          onPlaceSelected(details, 'origin')
       }}/>
       <AutoComplete label='Destination' onPlaceSelected={(details) => {
          onPlaceSelected(details, 'destination')
       }}/>
       <TouchableOpacity style={styles.button} onPress={traceRoute}>
          <Text style={styles.buttonText}>Trace route</Text>
       </TouchableOpacity>
       {
        distance && duration ? (
          <View>
          <Text>Distance: {distance.toFixed(2)} km</Text>
          <Text>Duration: {Math.ceil(duration)} min</Text>
       </View>
        ) : null
       }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight + 10,
  },
  button: {
    backgroundColor: "#bbb",
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  }
});

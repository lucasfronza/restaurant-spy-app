import React, { Component } from 'react'
import { ScrollView, View, Image, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Colors, Metrics } from '../Themes'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MainScreenStyle'

const GoogleApiKey = 'AIzaSyBmHm0PSUCOf1mojAVKAXhcwoUPGX01_ck'

class MainScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentLocation: null,
      nearbyPlaces: []
    }
  }

  componentDidMount () {
    this.getCurrentLocation()
    this.getNearbyPlaces()
  }

  getCurrentLocation = () => {
    let options = {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 1000
    }

    if (Platform.OS === 'android') {
      options = {
        enableHighAccuracy: true,
        timeout: 20000
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          currentLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        })
      },
      (error) => {
        console.log(error)
      },
      options
    )
  }

  getNearbyPlaces = () => {
    fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-23.582132,-46.700234&rankby=distance&type=restaurant&key=${GoogleApiKey}`)
    .then((response) => response.json())
    .then((responseJson) => {
      console.tron.log(responseJson)
      if (responseJson.status === 'OK') {
        this.setState({
          nearbyPlaces: responseJson.results
        })
      }
    })
    .catch((error) => {
      console.error(error)
    })
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{justifyContent: 'center', height: 60, paddingTop: 10, backgroundColor: Colors.red}}>
          <Text style={{textAlign: 'center', color: Colors.snow}}>RESTAURANT SPY</Text>
        </View>
        <ScrollView>
          <KeyboardAvoidingView behavior='position'>
            {this.state.nearbyPlaces.map(place => (
              <View style={{marginHorizontal: 15, marginVertical: 15}} key={place.id}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={{fontSize: 16}}>{place.name.length <= 30 ? place.name : place.name.substring(0, 30) + '...' }</Text>
                  {place.opening_hours && place.opening_hours.open_now != null ? <Text style={{color: place.opening_hours.open_now ? 'green' : 'red', fontSize: 16}}>
                    {place.opening_hours.open_now ? 'OPEN' : 'CLOSED'}
                  </Text> : <Text style={{fontSize: 16}}>
                    NO INFO
                  </Text>}
                </View>
                <View style={{flexDirection: 'row', marginTop: 5}}>
                  <Image
                    style={{
                      width: Metrics.screenWidth * 0.25,
                      height: Metrics.screenWidth * 0.25
                    }}
                    source={{
                      uri: place.photos && place.photos.length >= 1 && place.photos[0].photo_reference
                        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GoogleApiKey}`
                        : 'https://loremflickr.com/400/400/restaurant,food'
                    }}
                    resizeMode='cover'
                  />
                  <View style={{marginLeft: 15, flex: 1, justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 13}}>
                      {place.vicinity}
                    </Text>
                    <TouchableOpacity style={{backgroundColor: Colors.red, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={{color: Colors.snow, textAlign: 'center', padding: 10}}>SEE MORE</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)

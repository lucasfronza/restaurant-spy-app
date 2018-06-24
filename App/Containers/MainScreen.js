import React, { Component } from 'react'
import { ScrollView, View, Image, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Colors, Metrics } from '../Themes'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MainScreenStyle'

const GoogleApiKey = 'AIzaSyBmHm0PSUCOf1mojAVKAXhcwoUPGX01_ck'
// const YelpClientId = 'CR4GaSeFdjfQJEvBbncxwg'
const YelpApiKey = 'moxxDVrbenac-0BuwwyR-Y9va06TgfQevLDy1xO-aRMpDorSGJiaByFdg5PfW6vGcJD5AJo__rjm9kS75-R3j3JFwaBScH41QVno757GsgoWD4nLqsCmq8fUH5cvW3Yx'

class MainScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentLocation: null,
      nearbyPlaces: [],
      nearbyYelpPlaces: [],
      nearbyGooglePlaces: []
    }
  }

  componentDidMount () {
    this.getCurrentLocation()
    // this.getNearbyPlaces()
    this.getNearbyYelpPlaces()
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

  getNearbyYelpPlaces = () => {
    fetch(`https://api.yelp.com/v3/businesses/search?latitude=-23.582132&longitude=-46.700234&limit=5`, {
      headers: {
        Authorization: `Bearer ${YelpApiKey}`
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.tron.log(responseJson)
      this.getNearbyGooglePlaces(responseJson.businesses)
      this.setState({
        nearbyPlaces: responseJson.businesses,
        nearbyYelpPlaces: responseJson.businesses
      })
    })
    .catch((error) => {
      console.error(error)
    })
  }

  getNearbyGooglePlaces = async (businesses) => {
    console.tron.log(businesses)
    var nearbyGooglePlaces = []
    await Promise.all(businesses.map(async place => {
      var response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place.name}&location=${place.coordinates.latitude},${place.coordinates.longitude}&radius=500&key=${GoogleApiKey}`)
      var responseJson = await response.json()
      if (responseJson.status === 'OK' && responseJson.results.length >= 1) {
        nearbyGooglePlaces.push({
          yelpPlaceId: place.id,
          place: responseJson.results[0]
        })
      }
    }))
    this.setState({ nearbyGooglePlaces: nearbyGooglePlaces })
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <View style={{justifyContent: 'center', height: 60, paddingTop: 10, backgroundColor: Colors.red}}>
          <Text style={{textAlign: 'center', color: Colors.snow}}>RESTAURANT SPY</Text>
        </View>
        <ScrollView>
          <KeyboardAvoidingView behavior='position'>
            {this.state.nearbyPlaces.map(place => {
              var googlePlace = this.state.nearbyGooglePlaces.find(p => p.yelpPlaceId === place.id) != null ? this.state.nearbyGooglePlaces.find(p => p.yelpPlaceId === place.id).place : null
              return (
                <View style={{marginHorizontal: 15, marginVertical: 15}} key={place.id}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 16}}>{place.name.length <= 30 ? place.name : place.name.substring(0, 30) + '...' }</Text>
                    {googlePlace && googlePlace.opening_hours && googlePlace.opening_hours.open_now != null ? <Text style={{color: googlePlace.opening_hours.open_now ? 'green' : 'red', fontSize: 16}}>
                      {googlePlace.opening_hours.open_now ? 'OPEN' : 'CLOSED'}
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
                        uri: googlePlace && googlePlace.photos && googlePlace.photos.length >= 1 && googlePlace.photos[0].photo_reference
                          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${googlePlace.photos[0].photo_reference}&key=${GoogleApiKey}`
                          : 'https://loremflickr.com/400/400/restaurant,food?lock=1'
                      }}
                      resizeMode='cover'
                    />
                    <View style={{marginLeft: 15, flex: 1, justifyContent: 'space-between'}}>
                      <Text style={{fontSize: 13}}>
                        {googlePlace && googlePlace.formatted_address}
                      </Text>
                      <TouchableOpacity style={{backgroundColor: Colors.red, justifyContent: 'center', alignItems: 'center'}} onPress={() => { this.props.navigation.navigate('RestaurantDetailsScreen', { place: place }) }}>
                        <Text style={{color: Colors.snow, textAlign: 'center', padding: 10}}>SEE MORE</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            })}
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

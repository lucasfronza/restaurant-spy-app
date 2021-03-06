import React, { Component } from 'react'
import { ScrollView, View, Image, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { Colors, Metrics } from '../Themes'

// Styles
import styles from './Styles/MainScreenStyle'

const GoogleApiKey = 'AIzaSyBmHm0PSUCOf1mojAVKAXhcwoUPGX01_ck'
const YelpApiKey = 'moxxDVrbenac-0BuwwyR-Y9va06TgfQevLDy1xO-aRMpDorSGJiaByFdg5PfW6vGcJD5AJo__rjm9kS75-R3j3JFwaBScH41QVno757GsgoWD4nLqsCmq8fUH5cvW3Yx'

class MainScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentLocation: null,
      nearbyYelpPlaces: [],
      nearbyGooglePlaces: []
    }
  }

  /*
   * After mounting, asks for user location
   */
  componentDidMount () {
    this.getCurrentLocation()
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
        }, () => { this.getNearbyYelpPlaces() }) // Fetch Nearby Yelp Places if app has user location
      },
      (error) => {
        console.log(error)
      },
      options
    )
  }

  /*
   * Fetch nearby places from Yelp
   */
  getNearbyYelpPlaces = () => {
    fetch(`https://api.yelp.com/v3/businesses/search?latitude=${this.state.currentLocation.latitude}&longitude=${this.state.currentLocation.longitude}&limit=10&radius=15000`, {
      headers: {
        Authorization: `Bearer ${YelpApiKey}`
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // After fetching nearby places from Yelp, try to find a matching Google Place
      this.getNearbyGooglePlaces(responseJson.businesses)
      this.setState({
        nearbyYelpPlaces: responseJson.businesses
      })
    })
    .catch((error) => {
      console.error(error)
    })
  }

  /*
   * Try to find a matching Google Place for each Yelp Place
   */
  getNearbyGooglePlaces = async (businesses) => {
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
            {this.state.nearbyYelpPlaces.map(yelpPlace => {
              // Get from the state the matched Google Place for current Yelp Place
              var googlePlace = this.state.nearbyGooglePlaces.find(p => p.yelpPlaceId === yelpPlace.id) != null ? this.state.nearbyGooglePlaces.find(p => p.yelpPlaceId === yelpPlace.id).place : null
              return (
                <View style={{marginHorizontal: 15, marginVertical: 15}} key={yelpPlace.id}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 16}}>{yelpPlace.name.length <= 30 ? yelpPlace.name : yelpPlace.name.substring(0, 30) + '...' }</Text>
                    {googlePlace && googlePlace.opening_hours && googlePlace.opening_hours.open_now != null ? <Text style={{color: googlePlace.opening_hours.open_now ? 'green' : 'red', fontSize: 16}}>
                      {googlePlace.opening_hours.open_now ? 'OPEN' : 'CLOSED'}
                    </Text> : <Text style={{fontSize: 16}}>
                      NO INFO
                    </Text>}
                  </View>
                  <ScrollView horizontal style={{flexDirection: 'row', marginTop: 5}}>
                    {yelpPlace.categories.map(category => (<View style={{backgroundColor: '#A7A7A7', padding: 3, borderRadius: 3, marginRight: 5}} key={category.alias}><Text style={{color: Colors.snow}}>{category.title}</Text></View>))}
                  </ScrollView>
                  <View style={{flexDirection: 'row', marginTop: 5}}>
                    <Image
                      style={{
                        width: Metrics.screenWidth * 0.25,
                        height: Metrics.screenWidth * 0.25
                      }}
                      source={{
                        uri: googlePlace && googlePlace.photos && googlePlace.photos.length >= 1 && googlePlace.photos[0].photo_reference
                          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${googlePlace.photos[0].photo_reference}&key=${GoogleApiKey}`
                          : 'https://loremflickr.com/400/400/restaurant,food?lock=1' // placeholder if there is no photo on Google place
                      }}
                      resizeMode='cover'
                    />
                    <View style={{marginLeft: 15, flex: 1, justifyContent: 'space-between'}}>
                      <Text style={{fontSize: 13}}>
                        {googlePlace && googlePlace.formatted_address}
                      </Text>
                      <TouchableOpacity style={{backgroundColor: Colors.red, justifyContent: 'center', alignItems: 'center'}} onPress={() => { this.props.navigation.navigate('RestaurantDetailsScreen', { yelpPlace: yelpPlace, googlePlace: googlePlace }) }}>
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

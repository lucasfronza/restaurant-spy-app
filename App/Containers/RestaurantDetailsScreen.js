import React, { Component } from 'react'
import { ScrollView, View, Image, Text, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { Colors, Metrics } from '../Themes'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/RestaurantDetailsScreenStyle'

const GoogleApiKey = 'AIzaSyBmHm0PSUCOf1mojAVKAXhcwoUPGX01_ck'
// const YelpClientId = 'CR4GaSeFdjfQJEvBbncxwg'
const YelpApiKey = 'moxxDVrbenac-0BuwwyR-Y9va06TgfQevLDy1xO-aRMpDorSGJiaByFdg5PfW6vGcJD5AJo__rjm9kS75-R3j3JFwaBScH41QVno757GsgoWD4nLqsCmq8fUH5cvW3Yx'

class RestaurantDetailsScreen extends Component {
  constructor (props) {
    super(props)

    const { params } = this.props.navigation.state
    const place = params ? params.place : null
    this.state = {
      googlePlace: place,
      googlePlaceDetail: null,
      yelpPlace: null
    }
  }

  componentDidMount () {
    this.getGooglePlaceDetail()
    this.getYelpPlace()
  }

  getGooglePlaceDetail = () => {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${this.state.googlePlace.place_id}&key=${GoogleApiKey}`)
    .then((response) => response.json())
    .then((responseJson) => {
      console.tron.log(responseJson)
      if (responseJson.status === 'OK') {
        this.setState({
          googlePlaceDetail: responseJson.result
        })
      }
    })
    .catch((error) => {
      console.error(error)
    })
  }

  getYelpPlace = () => {
    fetch(`https://api.yelp.com/v3/businesses/search?latitude=${this.state.googlePlace.geometry.location.lat}&longitude=${this.state.googlePlace.geometry.location.lng}&location=${this.state.googlePlace.vicinity}&name=${this.state.googlePlace.name}`, {
    // fetch(`https://api.yelp.com/v3/businesses/matches?latitude=${this.state.googlePlace.geometry.location.lat}&longitude=${this.state.googlePlace.geometry.location.lng}&location=${this.state.googlePlace.vicinity}&name=${this.state.googlePlace.name}`, {
      headers: {
        Authorization: `Bearer ${YelpApiKey}`
        // Accept: 'application/json',
        // 'Content-Type': 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.tron.log(responseJson)
      if (responseJson.status === 'OK') {
        this.setState({
          // googlePlaceDetail: responseJson.result
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
          <Text style={{textAlign: 'center', color: Colors.snow}}>{this.state.googlePlace.name.toUpperCase()}</Text>
        </View>
        <ScrollView>
          <KeyboardAvoidingView behavior='position'>
            <View style={{}}>
              <Text style={styles.sectionTitle}>ADDRESS</Text>
              <Text style={{marginVertical: 15, flex: 1}}>
                {this.state.googlePlace.vicinity}
              </Text>
            </View>
            <View style={{}}>
              <Text style={styles.sectionTitle}>ABOUT</Text>
              {this.state.googlePlaceDetail
                ? null
                : <ActivityIndicator size='large' color={Colors.red} />}
              {/* <Text style={{}}>

              </Text> */}
            </View>
            <View style={{}}>
              <Text style={styles.sectionTitle}>REVIEWS</Text>
              {this.state.googlePlaceDetail
                ? null
                : <ActivityIndicator size='large' color={Colors.red} />}
            </View>
            <View style={{}}>
              <Text style={styles.sectionTitle}>PICTURES</Text>
              {this.state.googlePlaceDetail
                ? <ScrollView horizontal>
                  {this.state.googlePlaceDetail.photos && this.state.googlePlaceDetail.photos.map(photo => (
                    <Image
                      key={photo.photo_reference}
                      style={{
                        width: Metrics.screenWidth * 0.25,
                        height: Metrics.screenWidth * 0.25,
                        marginHorizontal: 5
                      }}
                      source={{
                        uri: photo.photo_reference
                          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GoogleApiKey}`
                          : 'https://loremflickr.com/400/400/restaurant,food'
                      }}
                      resizeMode='cover'
                    />
                  ))}
                </ScrollView>
                : <ActivityIndicator size='large' color={Colors.red} />}
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantDetailsScreen)

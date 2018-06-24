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
    const googlePlace = params ? params.googlePlace : null
    const yelpPlace = params ? params.yelpPlace : null
    this.state = {
      googlePlace: googlePlace,
      yelpPlace: yelpPlace,
      googlePlaceDetail: null,
      yelpPlaceDetail: null,
      yelpPlaceReviews: null
    }
  }

  componentDidMount () {
    this.getGooglePlaceDetail()
    this.getYelpPlaceDetail()
    this.getYelpPlaceReviews()
  }

  getGooglePlaceDetail = () => {
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${this.state.googlePlace.place_id}&key=${GoogleApiKey}`)
    .then((response) => response.json())
    .then((responseJson) => {
      console.tron.log({gp: responseJson})
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

  getYelpPlaceDetail = () => {
    fetch(`https://api.yelp.com/v3/businesses/${this.state.yelpPlace.id}`, {
      headers: {
        Authorization: `Bearer ${YelpApiKey}`
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.tron.log({yp: responseJson})
      this.setState({
        yelpPlaceDetail: responseJson
      })
    })
    .catch((error) => {
      console.error(error)
    })
  }

  getYelpPlaceReviews = () => {
    fetch(`https://api.yelp.com/v3/businesses/${this.state.yelpPlace.id}/reviews`, {
      headers: {
        Authorization: `Bearer ${YelpApiKey}`
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.tron.log({yr: responseJson})
      this.setState({
        yelpPlaceReviews: responseJson.reviews
      })
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
              <Text style={{flex: 1, marginHorizontal: 15}}>
                {this.state.googlePlace.formatted_address}
              </Text>
            </View>
            <View style={{}}>
              <Text style={styles.sectionTitle}>ABOUT</Text>
              {this.state.googlePlaceDetail && this.state.yelpPlaceDetail
                ? <View style={{marginHorizontal: 15}}>
                  <Text style={{}}>
                    <Text style={{fontWeight: 'bold'}}>Website: </Text>{this.state.googlePlaceDetail.website}
                  </Text>
                  <Text style={{}}>
                    <Text style={{fontWeight: 'bold'}}>Phone: </Text>{this.state.yelpPlaceDetail.display_phone}
                  </Text>
                </View>
                : <ActivityIndicator size='large' color={Colors.red} />}
            </View>
            <View style={{}}>
              <Text style={styles.sectionTitle}>REVIEWS</Text>
              {this.state.googlePlaceDetail && this.state.yelpPlaceDetail
                ? <View>
                  <Text style={{marginLeft: 30, marginBottom: 5, marginTop: 15}}>Google Rating: {this.state.googlePlaceDetail.rating}</Text>
                  <ScrollView horizontal>
                    {this.state.googlePlaceDetail.reviews && this.state.googlePlaceDetail.reviews.map((review, reviewIndex) => (
                      <View style={{width: Metrics.screenWidth * 0.3, alignItems: 'center'}} key={reviewIndex}>
                        <Image
                          style={{
                            width: Metrics.screenWidth * 0.2,
                            height: Metrics.screenWidth * 0.2,
                            marginHorizontal: 5
                          }}
                          source={{uri: review.profile_photo_url}}
                          resizeMode='cover'
                        />
                        <Text style={{textAlign: 'center', marginTop: 3}}>{review.author_name}</Text>
                        <Text style={{textAlign: 'center', marginTop: 3}}>Rating: {review.rating}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <Text style={{marginLeft: 30, marginBottom: 5, marginTop: 15}}>Yelp Rating: {this.state.yelpPlaceDetail.rating}</Text>
                  <ScrollView horizontal>
                    {this.state.yelpPlaceReviews && this.state.yelpPlaceReviews.map((review) => (
                      <View style={{width: Metrics.screenWidth * 0.3, alignItems: 'center'}} key={review.id}>
                        <Image
                          style={{
                            width: Metrics.screenWidth * 0.2,
                            height: Metrics.screenWidth * 0.2,
                            marginHorizontal: 5
                          }}
                          source={{uri: review.user.image_url}}
                          resizeMode='cover'
                        />
                        <Text style={{textAlign: 'center', marginTop: 3}}>{review.user.name}</Text>
                        <Text style={{textAlign: 'center', marginTop: 3}}>Rating: {review.rating}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
                : <ActivityIndicator size='large' color={Colors.red} />}
            </View>
            <View style={{}}>
              <Text style={styles.sectionTitle}>PICTURES</Text>
              {this.state.googlePlaceDetail
                ? <View>
                  <Text style={{marginLeft: 30, marginBottom: 5}}>Google</Text>
                  <ScrollView horizontal>
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
                  <Text style={{marginLeft: 30, marginBottom: 5, marginTop: 15}}>Yelp</Text>
                  <ScrollView horizontal>
                    {this.state.yelpPlaceDetail && this.state.yelpPlaceDetail.photos && this.state.yelpPlaceDetail.photos.map((photo, photoIndex) => (
                      <Image
                        key={photoIndex}
                        style={{
                          width: Metrics.screenWidth * 0.25,
                          height: Metrics.screenWidth * 0.25,
                          marginHorizontal: 5
                        }}
                        source={{uri: photo}}
                        resizeMode='cover'
                      />
                    ))}
                  </ScrollView>
                </View>
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

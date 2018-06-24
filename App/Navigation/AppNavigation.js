import { StackNavigator } from 'react-navigation'
import RestaurantDetailsScreen from '../Containers/RestaurantDetailsScreen'
import MainScreen from '../Containers/MainScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  RestaurantDetailsScreen: { screen: RestaurantDetailsScreen },
  MainScreen: { screen: MainScreen },
  LaunchScreen: { screen: LaunchScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'MainScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav

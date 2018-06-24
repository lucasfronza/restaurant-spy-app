import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'

console.ignoredYellowBox = ['Warning: isMounted', 'Warning: componentWill']

AppRegistry.registerComponent('RestaurantSpy', () => App)

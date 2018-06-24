import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  sectionTitle: {
    color: Colors.red,
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 15,
    textDecorationLine: 'underline'
  }
})

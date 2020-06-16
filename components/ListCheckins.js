import React from 'react'
import { Alert } from 'react-native'
import CheckInService from '../src/services/api/CheckInService'
import { CheckInContext } from '../Constants'
import CheckIns from './CheckIns'

export default function ListCheckins({ navigation }) {
  const [list, setlist] = React.useState([])
  let { setCheckIn } = React.useContext(CheckInContext)

  const handleCheckout = async location => {
    console.log(location)
    let { uid, hostUid } = location
    if (uid !== null && uid !== undefined) {
      // if the item id is valid

      try {
        setCheckIn({ uid, host: hostUid }).then(result => {
          fetchCheckInList()
        })
      } catch (error) {
        console.error(error)
        Alert.alert('Fehler beim Auschecken', error)
      }
    }
  }

  const fetchCheckInList = async () => {
    try {
      let checkIns = await CheckInService.listCheckIns()
      checkIns = checkIns.sort((a, b) => {
        return b.checkedOut === null || a.checkedIn < b.checkedIn
      })
      setlist(checkIns)
    } catch (error) {
      Alert.alert('Fehler beim Laden der Liste', error)
    }
  }

  React.useEffect(() => {
    // later we might have to merge the local checkins
    // with the ones retrieved from the server

    // use-effect did not allow to call await
    // inside this block. Thus, simply call
    // an async function that implements
    // the intended await behavior
    fetchCheckInList()
  }, [])

  return <CheckIns navigation={navigation} list={list} handleCheckOut={handleCheckout} />
}

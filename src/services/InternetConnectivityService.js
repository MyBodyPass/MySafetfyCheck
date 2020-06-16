import NetInfo from '@react-native-community/netinfo'

class InternetConnectivityService {
  static async isConnectedToInternet() {
    let connected = false

    // reference of the NetInfoState is available at:
    // https://github.com/react-native-community/react-native-netinfo#netinfostate
    NetInfo.addEventListener(state => {
      if (state.isInternetReachable) {
        connected = true
      }
    })

    return connected
  }
}

export default InternetConnectivityService

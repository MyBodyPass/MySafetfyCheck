import * as React from 'react'
import { StyleSheet, StatusBar, Platform, Alert, TouchableOpacity, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Colors from './Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import SignInScreen from './components/SignInScreen'
import SplashScreen from './components/SplashScreen'
import HomeScreen from './components/HomeScreen'
import ScanScreen from './components/ScanScreen'
import ProfileScreen from './components/ProfileScreen'
import ScanFriend from './components/ScanFriend'
import RegisterScreen from './components/RegisterScreen'
import CovidSurvey from './components/CovidSurvey'
import ListCheckins from './components/ListCheckins'
import ForgotPasswordScreen from './components/ForgotPasswordScreen'
import Functions from './components/FunctionsScreen'
import GuestDataScreen from './components/GuestDataScreen'

import AsyncStorage from '@react-native-community/async-storage'
import BackgroundFetch from 'react-native-background-fetch'

import { AuthContext, CheckInContext } from './Constants'

// import the services
// import InternetConnectivityService from './src/services/InternetConnectivityService'
import RequestBufferService from './src/services/RequestBufferService'
import APIService from './src/services/api/APIService'
import AuthAPIService from './src/services/api/AuthAPIService'
import AsyncStorageService from './src/services/AsyncStorageService'
import Configuration from './src/services/api/Configuration'
import ResendConfirmationEmail from './components/ResendConfirmationEmail'
import EditProfileScreen from './components/EditProfileScreen'
import Utilities from './src/services/Utilities'
import AddAccountScreen from './components/AddAccountScreen'
import ChangeUserPasswordScreen from './components/ChangeUserPasswordScreen'
import DeactivateAccountScreen from './components/DeactivateAccountScreen'
import SetCovid19PositiveScreen from './components/SetCovid19PositiveScreen'
import AppUser from './src/domain/AppUser'
import UserAPIService from './src/services/api/UserAPIService'
import ManagedAccountsScreen from './components/ManagedAccountsScreen'
import ManagedAccountDetails from './components/ManagedAccountDetails'

const Stack = createStackNavigator()

function App() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [userToken, setUserToken] = React.useState(null)
  const [user, setUser] = React.useState(new AppUser())

  React.useEffect(() => {
    let requestBufferService = new RequestBufferService()

    // start and configure the background service
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        stopOnTerminate: false,
        startOnBoot: true,
      },
      async taskId => {
        //alert('background task started', taskId)
        requestBufferService.dispatchPendingRequests()
        BackgroundFetch.finish(taskId)
      },
      error => {
        console.log('[js] ' + error)
      },
    )

    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted')
          break
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied')
          break
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled')
          break
      }
    })

    AsyncStorage.getItem('usertoken').then(itemValue => {
      setUserToken(itemValue)
      setIsLoading(false)
    })
  }, [])

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        try {
          let loginToken = await AuthAPIService.login(data.username, data.password)

          if (loginToken !== null) {
            AsyncStorageService.store('usertoken', loginToken)
            setUserToken(loginToken)
          }
        } catch (error) {
          Alert.alert('Fehler bei der Anmeldung', error)
        }
      },
      signOut: () => {
        AsyncStorage.removeItem('usertoken')
        setUserToken(null)
      },
      signUp: async data => {},
      setUserToken: async token => {
        AsyncStorage.setItem('usertoken', token)
        setUserToken(token)
      },
    }),
    [],
  )

  const updateCheckIn = ({ uid, host }, friend) => {
    // get the list of check-ins that are not yet sent
    // to the backend
    let promise = new Promise((resolve, reject) => {
      AsyncStorage.multiGet(['checkins', 'usertoken']).then(async value => {
        let storage = {}
        value.forEach(item => {
          storage[item[0]] = item[1]
        })
        
        console.log({ uid, host })

        //let list = JSON.parse(storage.checkins)

        let requestHeader = await Utilities.prepareHeaders(true, 'json')
        let service = new APIService()
        //let url = friend ? Configuration.API_CHECKIN : Configuration.API_LOCATION_CHECKIN
        service
          .request(Configuration.API_CHECKIN, 'POST', requestHeader, {
            uid: uid,
            hostUid: host,
            queuedTimestamp: await Utilities.getCurrentDateTime(),
            dispatchedTimestamp: await Utilities.getCurrentDateTime(),
          })
          .then(async result => {
            console.log(result.status)
            if (result.status !== 201) {
              reject(await result.json())
              return
            }
            return result.json()
          })
          .then(result => {
            setCheckIn({
              checkIn: result,
              setCheckIn: (d, f) => {
                return updateCheckIn(d, f)
              },
            })
            resolve(result)
            //AsyncStorage.setItem('checkins', JSON.stringify(list))
            setTimeout(() => {
              setCheckIn({
                checkIn: null,
                setCheckIn: (d, f) => {
                  return updateCheckIn(d, f)
                },
              })
            }, 3000)
          })
          .catch(error => console.error(error))
      })
    })

    return promise
  }

  React.useEffect(() => {
    try {
      UserAPIService.getProfile().then(userData => {
        if (userData !== null) {
          setUser(userData)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

  const [checkIn, setCheckIn] = React.useState({
    checkIn: null,
    setCheckIn: (data, friend = false) => {
      return updateCheckIn(data, friend)
    },
  })

  if (isLoading && Platform.OS === 'android') {
    // We haven't finished checking for the token yet
    return <SplashScreen />
  }

  return (
    <CheckInContext.Provider value={checkIn}>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <StatusBar backgroundColor={Colors.primaryColor} barStyle={'light-content'} />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.primaryColor,
              },
              headerTintColor: '#fff',
            }}>
            {userToken == null ? (
              // No token found, user isn't signed in
              <>
                <Stack.Screen
                  name="SignIn"
                  component={SignInScreen}
                  options={{
                    title: 'Anmelden',
                  }}
                />
                <Stack.Screen
                  name="register"
                  component={RegisterScreen}
                  options={{
                    title: 'Registrieren',
                  }}
                />
                <Stack.Screen
                  name="forgot-password"
                  component={ForgotPasswordScreen}
                  options={{ title: 'Passwort zurücksetzen' }}
                />
                <Stack.Screen
                  name="resend-confirmation-email"
                  component={ResendConfirmationEmail}
                  options={{ title: 'Bestätigungsmail senden' }}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={({ navigation, route }) => ({
                    title: 'MySafetyCheck',
                    headerRight: () => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('profile')
                        }}
                        style={styles.profileButton}>
                        <View
                          style={[
                            styles.statusIndicator,
                            styles[
                              'status' +
                                user.medicalStatus
                                  ?.toLowerCase()
                                  .replace(/_/, c => '')
                                  .replace(/^\w/, c => c.toUpperCase())
                            ],
                          ]}
                        />
                        <MaterialCommunityIcons name="account" size={30} color="white" />
                      </TouchableOpacity>
                    ),
                  })}
                />
                <Stack.Screen name="scan_friend" component={ScanFriend} options={{ title: 'Mein QR-Code anzeigen' }} />
                <Stack.Screen
                  name="profile"
                  component={ProfileScreen}
                  options={({ navigation, route }) => ({
                    headerTitle: 'Mein Profil',
                    headerRight: () => (
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('edit-profile')
                        }}
                        style={styles.profileButton}>
                        <MaterialCommunityIcons name="account-edit" size={30} color="white" />
                      </TouchableOpacity>
                    ),
                  })}
                />
                <Stack.Screen name="scan" options={{ title: 'QR-Code scannen' }} component={ScanScreen} />
                <Stack.Screen name="survey" options={{ title: 'Selbsttest' }} component={CovidSurvey} />
                <Stack.Screen name="checkin-list" options={{ title: 'Meine Check-Ins' }} component={ListCheckins} />
                <Stack.Screen name="functions" options={{ title: 'Weitere Funktionen' }} component={Functions} />
                <Stack.Screen
                  name="edit-profile"
                  options={{ title: 'Profil bearbeiten' }}
                  component={EditProfileScreen}
                />
                <Stack.Screen
                  name="update-password"
                  options={{ title: 'Passwort ändern' }}
                  component={ChangeUserPasswordScreen}
                />
                <Stack.Screen
                  name="deactivate-account"
                  options={{ title: 'Account löschen' }}
                  component={DeactivateAccountScreen}
                />
                <Stack.Screen
                  name="managed-accounts"
                  options={{ title: 'MyBodyPass Cards' }}
                  component={ManagedAccountsScreen}
                />
                <Stack.Screen
                  name="update-account-status"
                  options={{ title: 'Eigenen Status setzen' }}
                  component={SetCovid19PositiveScreen}
                />
                <Stack.Screen
                  name="add-account"
                  options={{ title: 'MyBodyPass Card hinzufügen' }}
                  component={AddAccountScreen}
                />
                <Stack.Screen
                  name="managed-account-details"
                  options={{ title: 'Detail' }}
                  component={ManagedAccountDetails}
                />
                <Stack.Screen
                  name="guestData"
                  options={{ title: 'Daten für digitale Gästelisten' }}
                  component={GuestDataScreen}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </CheckInContext.Provider>
  )
}

const styles = StyleSheet.create({
  profileButton: {
    marginHorizontal: 20,
  },
  statusIndicator: {
    backgroundColor: '#4caf50',
    borderColor: '#197c20',
    borderWidth: 1,
    minWidth: 13,
    minHeight: 13,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    borderRadius: 7,
  },
  statusGreen: {
    backgroundColor: '#4caf50',
    borderColor: '#197c20',
    borderWidth: 1,
  },
  statusGreenpermanent: {
    backgroundColor: '#4caf50',
    borderColor: '#197c20',
    borderWidth: 1,
  },
  statusYellow: {
    backgroundColor: '#f9a825',
    borderColor: '#c67502',
    borderWidth: 1,
  },
  statusViolet: {
    backgroundColor: '#ab47bc',
    borderColor: '#781489',
    borderWidth: 1,
  },
  statusRed: {
    backgroundColor: '#e53935',
    borderColor: '#b20612',
    borderWidth: 1,
  },
  statusRedself: {
    backgroundColor: '#e53935',
    borderColor: '#b20612',
    borderWidth: 1,
  },
})

export default App

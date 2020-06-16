import React from 'react'

export const AuthContext = React.createContext()
export const CheckInContext = React.createContext({
  checkIn: null,
  setCheckIn: () => {},
})
export const configuration = {
  gdprUrl: 'https://www.mybodypass.de/datenschutz/',
  termsAndConditionsUrl: 'https://www.mybodypass.de/termsandconditions/',
  locationsServer: __DEV__ ? 'https://locations-test.mybodypass.de' : 'https://locations.mybodypass.de/',
  activationLink: __DEV__ ? 'https://api-test.mybodypass.de/web/activate' : 'https://api.mybodypass.de/web/activate',
}

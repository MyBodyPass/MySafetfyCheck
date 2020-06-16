const scanCode = (navigation, message) => {
  return new Promise(resolve => {
    navigation.navigate('scan', {
      onScan: data => {
        navigation.goBack()
        resolve(data)
      },
      message: message,
    })
  })
}

export default { scanCode }

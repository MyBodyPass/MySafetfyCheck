class AppUser {
  constructor(uid, username, name, email, worksInMedicine, hasChronicDiseases, image) {
    this.uid = uid
    this.username = username
    this.name = name
    this.email = email

    if (hasChronicDiseases === null || worksInMedicine === undefined) {
      hasChronicDiseases = false
    }
    this.hasChronicDiseases = hasChronicDiseases

    if (worksInMedicine === null || worksInMedicine === undefined) {
      worksInMedicine = false
    }
    this.worksInMedicine = worksInMedicine
    this.image = image
  }

  getName() {
    if (this.name === null) {
      return 'Nicht verfügbar'
    }

    return this.name
  }

  getEmail() {
    if (this.email === null) {
      return 'Nicht verfügbar'
    }

    return this.email
  }
}

export default AppUser

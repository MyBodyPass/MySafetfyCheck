import React from 'react'
import { StyleSheet, View, ScrollView, Text, ActivityIndicator, Animated } from 'react-native'
import Question from './SurveyQuestion'
import Button from './TextButton'
import Colors from '../Colors'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import ProgressBar from './Progressbar'
import SurveyService from '../src/services/api/SurveyService'

const Page = ({ children }) => {
  return <View style={pageStyles.page}>{children}</View>
}

const CovidSurvey = () => {
  const [directContactToCovidSuspicion, setDirectContactToCovidSuspicion] = React.useState(null)
  const [directContactToCovid, setDirectContactToCovid] = React.useState(null)
  const [hasCough, setCough] = React.useState(null)
  const [hasFever, setFever] = React.useState(null)
  const [hasSoreThroat, setSoreThroat] = React.useState(null)
  const [hasHeadache, setHeadache] = React.useState(null)
  const [hasLassitude, setLassitude] = React.useState(null)
  const [hasDysgeusia, setDysgeusia] = React.useState(null)
  const [isEvaluated, setEvaluated] = React.useState(null)
  const [isEvaluating, setEvaluating] = React.useState(null)

  const [statusClass, setStatusClass] = React.useState('')
  const [statusText, setStatusText] = React.useState('')
  const [statusIcon, setStatusIcon] = React.useState(null)

  const [page, setPage] = React.useState(0)

  const evaluate = () => {
    setEvaluating(true)

    let score = 0
    if (directContactToCovid) {
      score += 3
    }
    if (directContactToCovidSuspicion) {
      score += 1
    }
    if (hasCough) {
      score += 5
    }
    if (hasFever) {
      score += 5
    }
    if (hasHeadache) {
      score += 2
    }
    if (hasLassitude) {
      score += 2
    }
    if (hasDysgeusia) {
      score += 1
    }
    if (hasSoreThroat) {
      score += 1
    }

    if (score === 0) {
      setStatusClass(styles.statusGreen)
      setStatusIcon(<MaterialCommunityIcon name="emoticon-happy-outline" style={styles.icon} />)
      setStatusText(
        'Anhand Ihrer Angaben besteht eine äußerst geringe Wahrscheinlichkeit einer Infektion mit Übertragungsrisiko. Weitere Hinweise, zusätzliche Informationen entnehmen Sie bitte z.B. der Website des Robert-Koch-Institutes (www.rki.de).',
      )
    } else if (score === 1) {
      setStatusClass(styles.statusPurple)
      setStatusIcon(<MaterialCommunityIcon name="account-question" style={styles.icon} />)
      setStatusText(
        'Anhand Ihrer Angaben besteht eine sehr geringe Wahrscheinlichkeit einer Infektion mit Übertragungsrisiko. Sie können zu Ihrer Sicherheit Kontakt zum Gesundheitsamt (telefonische Hotline: 116 117) oder telefonisch zu Ihrem Hausarzt/Hausärztin aufnehmen, sofern noch nicht geschehen. Sie erhalten von den Gesundheitsbehörden weitere Hinweise, zusätzliche Informationen entnehmen Sie bitte z.B. der Website des Robert-Koch-Institutes (www.rki.de).',
      )
    } else if (score === 2) {
      setStatusClass(styles.statusPurple)
      setStatusIcon(<MaterialCommunityIcon name="account-question" style={styles.icon} />)
      setStatusText(
        'Anhand Ihrer Angaben besteht eine sehr geringe Wahrscheinlichkeit einer Infektion mit Übertragungsrisiko. Sie können zu Ihrer Sicherheit Kontakt zum Gesundheitsamt (telefonische Hotline: 116 117) oder telefonisch zu Ihrem Hausarzt/Hausärztin aufnehmen, sofern noch nicht geschehen. Sie erhalten von den Gesundheitsbehörden weitere Hinweise, zusätzliche Informationen entnehmen Sie bitte z.B. der Website des Robert-Koch-Institutes (www.rki.de).',
      )
    } else if (score > 2 && score <= 4) {
      setStatusClass(styles.statusYellow)
      setStatusIcon(<MaterialCommunityIcon name="pill" style={styles.icon} />)
      setStatusText(
        'Anhand Ihrer Angaben ist eine Infektion mit Übertragungsrisiko nicht auszuschließen. Sie erhalten von den Gesundheitsbehörden weitere Hinweise, zusätzliche Informationen entnehmen Sie bitte z.B. der Website des Robert-Koch-Institutes (www.rki.de).',
      )
    } else if (score > 4 && score <= 10) {
      setStatusClass(styles.statusYellow)
      setStatusIcon(<MaterialCommunityIcon name="pill" style={styles.icon} />)
      setStatusText(
        'Anhand Ihrer Angaben kann eine Infektion mit Übertragungsrisiko vorliegen. Sie sollten Kontakt zum Gesundheitsamt (telefonische Hotline: 116 117) oder telefonisch zu Ihrem Hausarzt/Hausärztin aufnehmen, sofern noch nicht geschehen. Sie erhalten von den Gesundheitsbehörden weitere Hinweise, zusätzliche Informationen entnehmen Sie bitte z.B. der Website des Robert-Koch-Institutes (www.rki.de).',
      )
    } else if (score > 10) {
      setStatusClass(styles.statusYellow)
      setStatusIcon(<MaterialCommunityIcon name="pill" style={styles.icon} />)
      setStatusText(
        'Anhand Ihrer Angaben kann mit hoher Wahrscheinlichkeit eine Infektion mit hohem Übertragungsrisiko vorliegen. Sie sollten unverzüglich Kontakt zum Gesundheitsamt (telefonische Hotline: 116 117) oder telefonisch zu Ihrem Hausarzt/Hausärztin aufnehmen, sofern noch nicht geschehen. Verlassen Sie Ihre Wohnung oder Ihr Haus nicht ohne Rücksprache mit den Gesundheitsbehörden. Sie erhalten von den Gesundheitsbehörden weitere Hinweise, zusätzliche Informationen entnehmen Sie bitte z.B. der Website des Robert-Koch-Institutes (www.rki.de).',
      )
    }

    setTimeout(() => {
      // TODO: Send to Backend

      let data = {
        directContactToCovidSuspicion: directContactToCovidSuspicion,
        directContactToCovid: directContactToCovid,
        hasCough: hasCough,
        hasFever: hasFever,
        hasSoreThroat: hasSoreThroat,
        hasHeadache: hasHeadache,
        hasLassitude: hasLassitude,
        hasDysgeusia: hasDysgeusia,
        score: score,
      }

      SurveyService.postSurvey(data)

      setEvaluated(true)
      fadeIn()
    }, 2500)
  }

  const fadeAnim = React.useRef(new Animated.Value(0)).current

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start()
  }

  const pages = [
    <Page>
      <Question
        ask="Hatten Sie in den letzten 14 Tagen Kontakt zu einem bestätigten Fall?"
        state={directContactToCovid}
        onChange={setDirectContactToCovid}
      />
    </Page>,
    <Page>
      <Question
        ask="Hatten Sie in den letzten 14 Tagen Kontakt zu einem Verdachtsfall?"
        state={directContactToCovidSuspicion}
        onChange={setDirectContactToCovidSuspicion}
      />
    </Page>,
    <Page>
      <Question
        ask="Leiden Sie seit kurzem unter anhaltendem Husten oder unter neu aufgetretener Atemnot?"
        state={hasCough}
        onChange={setCough}
      />
    </Page>,
    <Page>
      <Question ask="Haben Sie aktuell Fieber (>38,5°C)?" state={hasFever} onChange={setFever} />
    </Page>,
    <Page>
      <Question ask="Leiden Sie unter Kopf- oder Gliederschmerzen?" state={hasHeadache} onChange={setHeadache} />
    </Page>,
    <Page>
      <Question ask="Spüren Sie eine neu aufgetretene Abgeschlagenheit?" state={hasLassitude} onChange={setLassitude} />
    </Page>,
    <Page>
      <Question
        ask="Bemerken Sie neu aufgetretene Geruchs- oder Geschmacksveränderungen?"
        state={hasDysgeusia}
        onChange={setDysgeusia}
      />
    </Page>,
    <Page>
      <Question ask="Haben Sie aktuell Schnupfen oder Halsschmerzen?" state={hasSoreThroat} onChange={setSoreThroat} />
    </Page>,
  ]

  return (
    <View>
      <ScrollView>
        <ProgressBar progress={((page + 1) / 8) * 100} />
        {isEvaluating ? (
          <View style={styles.statusContainer}>
            {!isEvaluated ? (
              <View style={styles.resultPending}>
                <ActivityIndicator size="large" color={Colors.primaryColor} />
                <Text style={styles.pendingStatus}>Das Ergebnis des Selbstests wird abgerufen...</Text>
              </View>
            ) : (
              <>
                <Text style={styles.statusText}>Das Ergebnis steht jetzt fest</Text>
                <View style={styles.badge}>
                  <Text style={styles.statusBadgeBackground}>&nbsp;</Text>
                  <Animated.View style={[styles.statusBadge, statusClass, { opacity: fadeAnim }]}>
                    <Text style={styles.statusBadgeText}>{statusIcon}</Text>
                  </Animated.View>
                </View>
                <Text style={styles.statusDescription}>{statusText}</Text>
                <Text style={styles.statusNotice}>
                  Hinweis: Diese Risiko-Einschätzung wurde anhand Ihrer eigenen Angaben im Selbsttest getroffen,
                  MyBodyPass stellt keine Diagnosen und gibt keine Therapieempfehlungen. Alle weiteren Behandlungen und
                  zu treffenden Maßnahmen müssen mit den zuständigen Gesundheitseinrichtungen abgestimmt werden.
                </Text>
              </>
            )}
          </View>
        ) : (
          <>
            {pages[page]}
            <View style={styles.buttonGroup}>
              <Text style={styles.pageCounter}>Frage {page + 1} von 8</Text>
              <View style={{ flexGrow: 1 }} />
              {page > 0 ? (
                <Button
                  title="Zurück"
                  style={styles.button}
                  onPress={() => {
                    setPage(page - 1)
                  }}
                />
              ) : null}
              {page < 7 ? (
                <Button
                  title={'Weiter'}
                  style={styles.button}
                  onPress={() => {
                    setPage(page + 1)
                  }}
                />
              ) : null}
              {page >= 7 ? (
                <Button
                  title={'Auswerten'}
                  style={styles.button}
                  onPress={() => {
                    evaluate()
                  }}
                />
              ) : null}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  )
}

export default CovidSurvey

const styles = StyleSheet.create({
  button: {
    //marginBottom: 20,
  },
  resultPending: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pendingStatus: {
    marginLeft: 10,
    fontSize: 16,
  },
  badge: {
    height: 200,
    marginTop: 20,
  },
  statusBadgeText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 200,
  },
  statusBadge: {
    height: 200,
    width: 200,
    borderRadius: 100,
    textAlign: 'center',
    textAlignVertical: 'center',
    zIndex: 100,
    position: 'absolute',
    left: -100,
  },
  statusGreen: {
    backgroundColor: '#4caf50',
  },
  statusYellow: {
    backgroundColor: '#f9a825',
  },
  statusPurple: {
    backgroundColor: '#ab47bc',
  },
  statusRed: {
    backgroundColor: '#e53935',
  },
  statusBadgeBackground: {
    height: 200,
    width: 200,
    borderRadius: 100,
    backgroundColor: '#d0d0d0',
    textAlign: 'center',
    textAlignVertical: 'center',
    zIndex: -100,
    position: 'absolute',
    left: -100,
  },
  statusContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  icon: {
    fontSize: 70,
    color: 'white',
  },
  statusText: {
    fontSize: 16,
    marginTop: 20,
  },
  statusNotice: {
    marginVertical: 20,
  },
  statusDescription: {
    fontSize: 16,
    marginTop: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 20,
  },
})
const pageStyles = StyleSheet.create({
  page: {
    margin: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: 'rgb(0,0,0)',
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 15,
      height: 15,
    },
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ccc',
  },
})

import React, { Component } from 'react'
import { StyleSheet, Text, View, YellowBox } from 'react-native'
import Deck from './src/components/Deck'
import DATA from './src/utils/deckData'
import { Card, Button } from 'react-native-elements'

YellowBox.ignoreWarnings(['Warning:'])

export default class App extends Component {
  constructor(props) {
    super(props)

    this.cards = DATA
  }

  renderCard(item) {
    return (
      <Card title={item.text} image={{ uri: item.uri }} key={item.id}>
        <Button title='See Detail' />
      </Card>
    )
  }

  renderNoMoreCards() {
    return (
      <Card title='All Done!'>
        <Text style={{ marginBottom: 10 }}>There's no more content here!</Text>
        <Button title='Get More' />
      </Card>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Deck
          data={this.cards}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: 30,
  },
})

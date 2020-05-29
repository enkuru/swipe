import React, { Component } from 'react'
import { StyleSheet, View, Animated } from 'react-native'

export default class Ball extends Component {
  componentDidMount() {
    Animated.spring(this.position, {
      toValue: { x: Math.floor(Math.random() * 300), y: Math.floor(Math.random() * 600) },
    }).start()
  }

  getAnimationStyle() {
    if (!this.position) {
      this.position = new Animated.ValueXY(0, 0)
    }
    return this.position.getLayout()
  }

  render() {
    return (
      <Animated.View style={this.getAnimationStyle()}>
        <View style={styles.container} />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black',
  },
})

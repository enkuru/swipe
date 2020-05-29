import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  PanResponder,
  Animated,
  Dimensions,
  UIManager,
  LayoutAnimation,
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH
const SWIPE_OUT_DURATION = 250

export default class Deck extends Component {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
  }

  state = {
    topCardIndex: 0,
  }

  constructor(props) {
    super(props)

    const position = new Animated.ValueXY()
    this.panResponder = this.createPanResponder(position)
    this.position = position
  }

  createPanResponder(position) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right')
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left')
        } else {
          this.resetPosition()
        }
      },
    })
  }

  UNSAFE_componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true)
    LayoutAnimation.spring()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({ topCardIndex: 0 })
    }
  }

  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH
    Animated.timing(this.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION,
    }).start(() => this.onSwipComplete(direction))
  }

  onSwipComplete(direction) {
    const { onSwipeRight, onSwipeLeft, data } = this.props
    const item = data[this.state.topCardIndex]

    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item)
    this.position.setValue({ x: 0, y: 0 })
    this.setState({ topCardIndex: this.state.topCardIndex + 1 })
  }

  resetPosition() {
    Animated.spring(this.position, { toValue: { x: 0, y: 0 } }).start()
  }

  getAnimatedCardStyle() {
    const rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-80deg', '0deg', '80deg'],
    })
    return { ...styles.card, ...this.position.getLayout(), transform: [{ rotate }] }
  }

  renderCards() {
    const { data, renderCard, renderNoMoreCards } = this.props
    const { topCardIndex } = this.state
    const isTopCard = index => index === topCardIndex
    const isCardNotInDeck = index => index < topCardIndex
    const isThereNoMoreCards = () => topCardIndex >= data.length

    if (isThereNoMoreCards()) {
      return renderNoMoreCards()
    }

    return data
      .map((item, index) => {
        if (isCardNotInDeck(index)) {
          return null
        }

        if (isTopCard(index)) {
          return this.renderAnimatedCard(item)
        }

        return (
          <Animated.View key={item.id} style={[styles.card, { top: 6 * (index - topCardIndex) }]}>
            {renderCard(item)}
          </Animated.View>
        )
      })
      .reverse()
  }

  renderAnimatedCard(item) {
    return (
      <Animated.View
        key={item.id}
        style={this.getAnimatedCardStyle()}
        {...this.panResponder.panHandlers}
      >
        {this.props.renderCard(item)}
      </Animated.View>
    )
  }

  render() {
    return <View>{this.renderCards()}</View>
  }
}

const styles = {
  card: {
    zIndex: 0,
    position: 'absolute',
    width: SCREEN_WIDTH,
  },
}

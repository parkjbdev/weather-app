import React, {Component} from 'react';
import {Animated, StyleSheet, Text, View,} from 'react-native';

import {RectButton} from 'react-native-gesture-handler';

import Swipeable from 'react-native-gesture-handler/Swipeable';

export default class SwipeToDelete extends Component<{onDelete: () => void}, {}> {
  private Action = (progress: Animated.AnimatedInterpolation, dragX: Animated.AnimatedInterpolation) => {
    const width = 96
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 0],
    });
    return (
      <View style={{width}}>
        <Animated.View style={{flex: 1, transform: [{translateX: trans}]}}>
          <RectButton style={[styles.rightAction, {backgroundColor: '#dd2c00'}]} onPress={() => {
            this.props.onDelete()
            this.close()
          }}>
            <Text style={styles.actionText}>Delete</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };
  
  private swipeableRow?: Swipeable;
  
  private updateRef = (ref: Swipeable) => this.swipeableRow = ref;
  private close = () => this.swipeableRow?.close()
  
  render() {
    const {children} = this.props;
    return (
      <Swipeable
        ref={this.updateRef}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={0}
        overshootRight={false}
        renderRightActions={this.Action}>
        {children}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#497AFC',
    justifyContent: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'transparent',
    padding: 10,
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
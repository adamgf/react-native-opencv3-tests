/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @author Adam Freeman --> adamgf@gmail.com
 * @description ==> super simple video preview app for CvCamera
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Camera} from 'react-native-opencv3';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    const { type } = 'back';
    return (
      <View
        style={styles.preview}
      >
        <Camera
          style={styles.preview}
          type={type}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    flex: 1
  },
});

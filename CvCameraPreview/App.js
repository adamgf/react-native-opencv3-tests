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
import {StyleSheet, View} from 'react-native';
import {CvCamera} from 'react-native-opencv3';

type Props = {};
export default class App extends Component<Props> {
  render() {
    const { facing } = 'back';
    return (
      <View
        style={styles.preview}
      >
        <CvCamera
          style={styles.preview}
          facing={facing}
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

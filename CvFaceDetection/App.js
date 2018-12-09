/**
 * Sample React Native App
 * https://github.com/adamgf/react-native-opencv3-tests
 *
 * @format
 * @flow
 * @author Adam Freeman --> adamgf@gmail.com
 * @description ==> face detection app for CvCamera
 */

import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {CvCamera, CvInvoke} from 'react-native-opencv3';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.preview} >
        <CvInvoke func='cv:cvtColor' params='GRAYSCALE'>
          <CvInvoke func='cv:flip' params='HORIZONTAL'>
          <CvInvoke func='cv:rotate' params='90.0,CCW'>
          <CvCamera
            style={styles.preview}
            facing='back'
          />
        </CvInvoke>
      </CvInvoke>
    </CvInvoke>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    flex: 1
  },
});

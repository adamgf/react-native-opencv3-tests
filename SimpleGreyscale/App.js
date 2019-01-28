/**
 * Sample React Native App to test OpenCV
 * https://github.com/adamgf/react-native-opencv3-tests
 *
 * @format
 * @flow
 * @author Adam Freeman, adamgf@gmail.com
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import {RNCv, CvImage, CvInvoke, ColorConv} from 'react-native-opencv3';

export default class App extends Component {  
  render() {
    const originalImagePath = './images/girl_wide_brim_hat.png'

    return (
      <View style={styles.container}>
        <Image
          style={{width: 200, height: 200}}
          source={ require(`${originalImagePath}`) }
        />
        <Text style={styles.captions}>Original</Text>
        <CvInvoke func='cvtColor' params={{"p1":"srcMat","p2":"dstMat","p3":ColorConv.COLOR_BGR2GRAY}}>
          <CvImage
            style={{width: 200, height: 200}}
            source={ require(`${originalImagePath}`) }
          />
        </CvInvoke>
        <Text style={styles.captions}>Greyscaled</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  captions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
});

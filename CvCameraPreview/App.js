/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @author Adam Freeman --> adamgf@gmail.com
 * @description ==> video preview app for CvCamera for taking pictures and recording videos
 */

import React, {Component} from 'react';
import {StyleSheet, View, TouchableOpacity, Platform, Image} from 'react-native';
import {CvCamera} from 'react-native-opencv3';

export default class App extends Component<Props> {
	
  constructor(props) {
    super(props)
    this.cvCamera = React.createRef()
  }
  
  takePicOrRecord = async() => {
  	  const { uri, width, height } = await this.cvCamera.current.takePicture('whatever.jpg')
	  alert('Picture successfully taken uri is: ' + uri)
  }
  
  render() {
    const { facing } = 'back';
    return (
      <View
        style={styles.preview}
      >
        <CvCamera
		  ref={this.cvCamera}
          style={styles.preview}
          facing={facing}
        />
        <TouchableOpacity style={Platform.OS === 'android' ? styles.androidButton : styles.iosButton} onPress={this.takePicOrRecord}>
          <Image style={Platform.OS === 'android' ? styles.androidImg : styles.iosImg} source={require('./images/flipCamera.png')}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    alignItems : 'center',
    backgroundColor : 'transparent',
    top : 0,
    left : 0,
    right : 0,
    bottom : 0,
    position : 'absolute'
  },
  androidImg: {
    transform : [{ rotate: '-90deg' }],
    backgroundColor : 'transparent',
    width : 50,
    height : 50
  },
  iosImg: {
    backgroundColor : 'transparent',
    width : 50,
    height : 50
  },
  androidButton: {
    top : 0,
    bottom : 0,
    right : 0,
    width: '10%',
    position : 'absolute',
    backgroundColor : '#FFF',
    opacity : 0.75,
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center'
  },
  iosButton: {
    left : 0,
    right : 0,
    bottom : 0,
    height : '10%',
    position : 'absolute',
    backgroundColor : '#FFF',
    opacity : 0.75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

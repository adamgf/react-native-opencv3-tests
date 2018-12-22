/**
 * Sample React Native App
 * https://github.com/adamgf/react-native-opencv3-tests
 *
 * @format
 * @flow
 * @author Adam Freeman => adamgf@gmail.com
 * @description ==> face detection app for CvCamera
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, DeviceEventEmitter, TouchableOpacity, Image} from 'react-native';
import {CvCamera, CvInvoke} from 'react-native-opencv3';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { faces : '',
      facing : 'back'
    }
  }

  componentDidMount = () => {
    DeviceEventEmitter.addListener('onFacesDetected', this.onFacesDetected);
  }

  switchFacing = (e) => {
    if (this.state.facing === 'back') {
      this.setState({ facing : 'front' })
    }
    else {
      this.setState({ facing : 'back' })
    }
  }

  onFacesDetected = (e) => {
    //alert('payload: ' + JSON.stringify(e.nativeEvent.payload))
    if (Platform.OS === 'ios') {
      if ((!e.nativeEvent.payload && this.state.faces) || (e.nativeEvent.payload && !this.state.faces) || (e.nativeEvent.payload && this.state.faces)) {
        this.setState({ faces : e.nativeEvent.payload })
      }
    }
    else {
      if ((!e.payload && this.state.faces) || (e.payload && !this.state.faces) || (e.payload && this.state.faces)) {
        this.setState({ faces : e.payload })
      }
    }
  }

  renderFaceBoxes() {
    if (this.state.faces) {
      const facesJSON = JSON.parse(this.state.faces)

      // face co-ordinates are in floating point as percentage of view
      let views = facesJSON.faces.map((face, i) => {
        console.log('x: ' + face.x + ' y: ' + face.y + ' w: ' + face.width + ' h: ' + face.height);
        let box = {
            position: 'absolute',
            top: `${100.0*face.y}%`,
            left: `${100.0*face.x}%`,
            width: '100%',
            height: '100%'
        }
        let style = {
            width: `${100.0*face.width}%`,
            height: `${100.0*face.height}%`,
            borderWidth: 3,
            borderColor: '#0f0'
        }
        return <View key={face.faceId} style={box}><View style={style}></View></View>
      })
      return <View style={styles.allFaceBoxes}>{views}</View>
    }
  }

  render() {
    return (
      <View style={styles.preview}>
        <CvCamera
          style={styles.preview}
          facing={this.state.facing}
          cascadeClassifier='lbpcascade_frontalface'
          onFacesDetected={this.onFacesDetected}
        />
        {this.renderFaceBoxes()}
        <TouchableOpacity style={Platform.OS === 'android' ? styles.androidButton : styles.iosButton} onPress={this.switchFacing}>
          <Image style={Platform.OS === 'android' ? styles.androidImg : styles.iosImg} source={require('./images/flipCamera.png')}/>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  androidImg: {
    transform : [{ rotate: '-90deg' }],
    backgroundColor : 'transparent',
    opacity : 0.75,
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
  allFaceBoxes: {
    backgroundColor : 'transparent',
    position : 'absolute',
    alignItems : 'center',
    top : 0,
    left : 0,
    width : '100%',
    height : '100%'
  },
  preview: {
    alignItems : 'center',
    backgroundColor : 'transparent',
    top : 0,
    left : 0,
    right : 0,
    bottom : 0,
    position : 'absolute'
  },
});

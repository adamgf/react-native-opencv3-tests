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
import {Platform, StyleSheet, View, DeviceEventEmitter} from 'react-native';
import {CvCamera, CvInvoke} from 'react-native-opencv3';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = { faces : '' }
    this.onFacesDetected.bind(this)
  }

  componentDidMount = () => {
    DeviceEventEmitter.addListener('onFacesDetected', this.onFacesDetected);
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
          facing='back'
          cascadeClassifier='lbpcascade_frontalface'
          onFacesDetected={this.onFacesDetected}
        />
        {this.renderFaceBoxes()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  allFaceBoxes: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  preview: {
    backgroundColor: 'transparent',
    flex: 1
  },
});

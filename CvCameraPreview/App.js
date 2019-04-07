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
    //this.cvCamera = React.createRef()
    const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource')
	const transUri = resolveAssetSource(require('./images/transparent.gif')).uri
	this.state = { picuri : transUri }
	this.imgIndex = 0
  }
  
  takePicOrRecord = async() => {
  	  const { uri, width, height } = await this.cvCamera.takePicture('whatever' + this.imgIndex + '.jpg')
	  this.imgIndex += 1
	  //alert('Picture successfully taken uri is: ' + uri)
	  if (Platform.OS === 'android') {
	  	this.setState({ picuri : 'file://' + uri })
	  }
	  else {
	    this.setState({ picuri : uri })
	  }
  }
  
  render() {
    const { facing } = 'back';
    return (
      <View
        style={styles.preview}
      >
        <CvCamera
          ref={ref => { this.cvCamera = ref}}
          style={styles.preview}
          facing={facing}
        />
		<Image style={Platform.OS === 'android' ? styles.androidPic : styles.iosPic} source={{uri:`${this.state.picuri}`}} />
        <TouchableOpacity style={Platform.OS === 'android' ? styles.androidButton : styles.iosButton} onPress={this.takePicOrRecord}>
          <Image style={styles.img} source={require('./images/flipCamera.png')}/>
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
  iosPic: {
	position: 'absolute',
    backgroundColor : 'transparent',
    width : 112,
    height : 200,
	left: 0,
	top: 0,
  },
  androidPic: {
	position: 'absolute',
    backgroundColor : 'transparent',
    width : 200,
    height : 112,
	left: 0,
	bottom: 0,
  },
  img: {
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

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
import Video from 'react-native-video';

var RNFS = require('react-native-fs')

export default class App extends Component<Props> {
	
  constructor(props) {
    super(props)
    const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource')
	const transUri = resolveAssetSource(require('./images/transparent.gif')).uri
	this.state = { picuri : transUri, videouri : '', showImg : false, recording : false }
	this.imgIndex = 0
	this.videoIndex = 0
  }
  
  uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  takePicOrRecord = async() => {
    if (this.state.showImg) {
  	  const { uri, width, height } = await this.cvCamera.takePicture('ocvpic' + this.imgIndex + '.jpg')
	  this.imgIndex += 1
	  //alert('Picture successfully taken uri is: ' + uri)
	  if (Platform.OS === 'android') {
	  	this.setState({ picuri : 'file://' + uri })
	  }
	  else {
	    this.setState({ picuri : uri })
	  }
    }
	else if (!this.state.recording) {
	  filenameStr = 'ocvmovie-' + this.uuidv4()
	  if (Platform.OS === 'android') {
		filenameStr += '.avi'
	  }
	  else {
		filenameStr += '.m4v'
	  }
	  let itexists = await RNFS.exists(filenameStr)
	  if (itexists) {
	  	await RNFS.unlink(filenameStr)
	  }
      this.cvCamera.startRecording(filenameStr)
	  this.videoIndex += 1
	  this.setState({ recording : true })
	}
	else if (this.state.recording) {
	  this.setState({ recording : false })
	  const { uri, width, height } = await this.cvCamera.stopRecording()
	  const { size } = await RNFS.stat(uri)
      //alert('Video uri is: ' + uri + ' width is: ' + width + ' height is: ' + height + ' size is: ' + size)
	  if (Platform.OS === 'android') {
        // avi does not seem to play in react-native-video ??
	    // this.setState({ videouri : 'file://' + uri})
	  }
	  else {
		this.setState({ videouri: uri })
	  }
	}
  }
  
  onBuffer = () => {
  	//alert('Entered onBuffer')
  }
  
  onError = () => {
  	alert('Entered onError')
  }
  
  renderImageOrVideo = () => {	  	
    if (this.state.showImg) {
	  return (
	    <Image style={Platform.OS === 'android' ? styles.androidPic : styles.iosPic} source={{uri:`${this.state.picuri}`}} />	
	  )
	}
	else if (this.state.videouri) {
	 return (
	   <Video source={{uri: `${this.state.videouri}`}}   // Can be a URL or a local file.
			       ref={(ref) => { this.player = ref }}                                      // Store reference
			       onBuffer={this.onBuffer}                // Callback when remote video is buffering
			       onError={this.videoError}               // Callback when video cannot be loaded
			       style={Platform.OS === 'android' ? styles.androidPic : styles.iosPic} />
	  )
	}
	else {
      return null
	}
  }
  
  render() {
    const { facing } = 'back';
    return (
      <View
        style={styles.preview}
      >
        <CvCamera
          ref={ref => { this.cvCamera = ref }}
          style={styles.preview}
          facing={facing}
        />
		{this.renderImageOrVideo()}
        <TouchableOpacity style={Platform.OS === 'android' ? styles.androidButton : styles.iosButton} onPress={this.takePicOrRecord}>
          <Image style={styles.img} source={require('./images/flipCamera.png')}/>
		</TouchableOpacity>
      </View>
    )
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
    position : 'absolute',
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

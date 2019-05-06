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
import {StyleSheet, View, TouchableOpacity, Platform, Image, Switch} from 'react-native';
import {CvCamera, CvScalar, Mat, CvInvoke, CvInvokeGroup} from 'react-native-opencv3';
import Video from 'react-native-video';

var RNFS = require('react-native-fs')

export default class App extends Component<Props> {
	
  constructor(props) {
    super(props)
    const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource')
	const transUri = resolveAssetSource(require('./images/transparent.gif')).uri
	this.state = { picuri : transUri, videouri : '', showImg : false, recording : false, showRec : true, switchValue : true }
	this.imgIndex = 0
	this.videoIndex = 0
    // Change the state every second or the time given by User.
    setInterval(() => {
      this.setState(previousState => {
        return { showRec: !previousState.showRec };
      });
    }, 
    // Define any blinking time.
    500);
  }
  
  componentDidMount = async() => {
    this.interMat = await new Mat().init()
  	
  }
  
  uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  takePicOrRecord = async() => {
    if (this.state.showImg) {
  	  const { uri, width, height } = await this.cvCamera.takePicture('ocvpic-' + this.imgIndex + '.jpg')
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
	  if (Platform.OS === 'android') {
        // avi does not seem to play in react-native-video ??
        alert('Video uri is: ' + uri + ' width is: ' + width + ' height is: ' + height + ' size is: ' + size)
	    this.setState({ videouri : 'file://' + uri})
	  }
	  else {
		this.setState({ videouri : uri })
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
  
  renderRec = () => {
	if (this.state.recording && this.state.showRec) {
	  return (
		<Image style={Platform.OS === 'android' ? styles.androidRec : styles.iosRec} source={require('./images/rec.png')}/>
	  )
	}
	else {
	  return null	
	}
  }
  
  toggleSwitch = (value) => {
	  if (this.state.switchValue) {
	  	alert('Switching capture mode from video to picture.')
	  }
	  else {
	  	alert('Switching capture mode from picture to video.')
	  }
	  this.setState({ switchValue : !this.state.switchValue, showImg : !this.state.showImg })
  }
  
  render() {
    const { facing } = 'back'
	const posterScalar = new CvScalar(0, 0, 0, 255)
    return (
      <View
        style={styles.preview}
      >
        <CvInvokeGroup groupid='zeeGrup'>
          <CvInvoke func='convertScaleAbs' params={{"p1":this.interMat,"p2":"rgba","p3":16,"p4":0}}/>
          <CvInvoke func='convertScaleAbs' params={{"p1":"rgba","p2":this.interMat,"p3":1./16,"p4":0}}/>
          <CvInvoke inobj='rgba' func='setTo' params={{"p1":posterScalar,"p2":this.interMat}}/>
          <CvInvoke func='Canny' params={{"p1":"rgba","p2":this.interMat,"p3":80,"p4":90}}/>		
          <CvCamera
            ref={ref => { this.cvCamera = ref }}
            style={styles.preview}
            facing={facing}
          />
		</CvInvokeGroup>
  		{this.renderImageOrVideo()}
		{this.renderRec()}
        <Switch style={Platform.OS === 'android' ? styles.androidSwitch : styles.iosSwitch} onValueChange={this.toggleSwitch} value={this.state.switchValue}/>
        <TouchableOpacity style={Platform.OS === 'android' ? styles.androidButton : styles.iosButton} onPress={this.takePicOrRecord}>
          <Image style={Platform.OS === 'android' ? styles.androidImg : styles.iosImg} source={require('./images/recordButton.png')}/>
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
	top: '10%',
  },
  androidPic: {
	position: 'absolute',
    backgroundColor : 'transparent',
    width : 200,
    height : 112,
	left: 0,
	bottom: 0,
  },
  iosImg: {
    backgroundColor : 'transparent',
    width : 75,
    height : 75,
  },
  androidImg: {
    backgroundColor : 'transparent',
    width : 75,
    height : 75,
  },
  androidButton: {
    top : 0,
    bottom : 0,
    right : 40,
    width: 75,
    position : 'absolute',
    backgroundColor : 'transparent',
    opacity : 0.75,
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center'
  },
  iosButton: {
    left : 0,
    right : 0,
    bottom : 40,
    height : 75,
    position : 'absolute',
    backgroundColor : 'transparent',
    opacity : 0.75,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  androidRec: {
    transform : [{ rotate: '-90deg' }],	
	position: 'absolute',
	top: '45%',
	bottom: '45%',
	left: 0,
  },
  iosRec: {
	position: 'absolute',
	left: '45%',
	right: '45%',
	top: '10%',
  },
  androidSwitch: {
    transform : [{ rotate: '-90deg' }],	
	position: 'absolute',
	bottom: '85%',
	left: 0,
  },
  iosSwitch: {
	position: 'absolute',
	left: '85%',
	top: '10%',
  }
});

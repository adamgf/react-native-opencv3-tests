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
	  this.state = { picuri : '' }
  }
  
  takePicOrRecord = async() => {
  	  const { uri, width, height } = await this.cvCamera.takePicture('whatever.jpg')
	  //alert('Picture successfully taken uri is: ' + uri)
	  this.setState({ picuri : uri })
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
		<Image style={styles.pic} source={{uri:`${this.state.picuri}`}} />
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
  pic: {
	position: 'absolute',
    backgroundColor : 'transparent',
    width : 112,
    height : 200,
	left: 0,
	top: 0,
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

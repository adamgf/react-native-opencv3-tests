/**
 * Sample React Native App
 * https://github.com/adamgf/react-native-opencv3-tests/CvImageManipulations
 * @author Adam G. Freeman, adamgf@gmail.com 01/19/2019
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Dimensions, DeviceEventEmitter, TouchableOpacity, ScrollView, Image, Platform, StyleSheet, Text, View} from 'react-native';
import {RNCv, CvCamera, CvInvoke, CvInvokeGroup, ColorConv, CvType, Mat, MatOfInt, MatOfFloat} from 'react-native-opencv3';

let fuckit = false
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<Props> {

  constructor(props) {
    super(props)
    let {height, width} = Dimensions.get('window')
    this.scrollView = React.createRef()
    this.histSizeNum = 25
    this.state = { scrollleft : width - 64, windowwidth : width, windowheight : height }
  }

  componentDidMount = async() => {
    let interMat = await new Mat().init()
    let channelZero = await new MatOfInt(0).init()
    let maskMat = await new Mat().init()
    let histogramMat = await new Mat().init()
    let ranges = await new MatOfFloat(0.0, 256.0).init()
    let histSize = await new MatOfInt(this.histSizeNum).init()
    this.setState({ ...this.state, interMat : interMat, channelZero : channelZero,
      maskMat : maskMat, histogramMat : histogramMat, histSize : histSize, ranges : ranges })

    DeviceEventEmitter.addListener('onHistogram1', this.onHistogram1);

    setTimeout(() => {
      if (this.scrollView && this.scrollView.current) {
        this.scrollView.current.scrollTo({ x : 0, y : this.state.windowheight, animated : false })
      }
    }, 500);
  }

  onHistogram1 = (e) => {
    let hist = e.payload
    if (!fuckit) {
      alertstr = ''
      for (let i=0; i < 25; i++) {
        alertstr += (hist[i] + ',')
      }
      alert(alertstr)
      fuckit = true
    }
    let thickness = (this.state.windowheight / (this.histSizeNum + 10) / 5)
    if (thickness > 5) {
      thickness = 5
    }
    const offset = ((this.state.windowheight - (5*this.histSizeNum + 4*10)*thickness)/2)
  }

  press1 = (e) => {
    alert('pressed 1')
  }

  press2 = (e) => {
    alert('pressed 2')
  }

  press3 = (e) => {
    alert('pressed 3')
  }

  press4 = (e) => {
    alert('pressed 4')
  }

  press5 = (e) => {
    alert('pressed 5')
  }

  press6 = (e) => {
    alert('pressed 6')
  }

  press7 = (e) => {
    alert('pressed 7')
  }

  press8 = (e) => {
    alert('pressed 8')
  }

  render() {
    let interMat, channelZero, maskMat, histogramMat, histSize, ranges, halfHeight
    if (this.state && this.state.interMat) {
      interMat = this.state.interMat
      channelZero = this.state.channelZero
      maskMat = this.state.maskMat
      histogramMat = this.state.histogramMat
      histSize = this.state.histSize
      ranges = this.state.ranges
      halfHeight = this.state.windowwidth * 0.5 // double right?
    }

    return (
      <View style={styles.container}>
          <CvInvokeGroup groupid='invokeGroup0'>
            <CvInvoke func='normalize' params={{"p1":histogramMat,"p2":histogramMat,"p3":halfHeight,"p4":0.0,"p5":1}} callback='onHistogram1'/>
            <CvInvoke func='calcHist' params={{"p1":"rgba","p2":channelZero,"p3":maskMat,"p4":histogramMat,"p5":histSize,"p6":ranges}}/>
            <CvCamera style={{ width: '100%', height: '100%', position: 'absolute' }}/>
          </CvInvokeGroup>
        <ScrollView ref={this.scrollView} style={{ 'left' : this.state.scrollleft, ...styles.scrollview }}>
          <TouchableOpacity  onPress={this.press1} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press2} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press3} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press4} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press5} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press6} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press7} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
          <TouchableOpacity  onPress={this.press8} style={styles.to}>
            <Image source={require('./images/react-native-icon.png')} style={styles.scrollimg}/>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  to: {
    width: 64,
    height: 64,
    backgroundColor: 'transparent',
  },
  scrollimg: {
    width: 56,
    height: 56,
    margin: 4,
  },
  scrollview: {
    top: 0,
    bottom: 0,
    right: 0,
    height: 512,
    width: 64,
    backgroundColor: '#FFF',
    opacity: 0.5,
  },
});

/**
 * Sample React Native App
 * https://github.com/adamgf/react-native-opencv3-tests/CvImageManipulations
 * @author Adam G. Freeman, adamgf@gmail.com 01/19/2019
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Dimensions, DeviceEventEmitter, TouchableOpacity, ScrollView, Image, Platform, StyleSheet, Text, View} from 'react-native';
import {RNCv, CvCamera, CvInvoke, CvInvokeGroup, ColorConv, CvType, Mat, MatOfInt, MatOfFloat, CvScalar, CvPoint} from 'react-native-opencv3';

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
    this.cvCamera = React.createRef()
    this.histSizeNum = 25.0
    this.state = { scrollleft : width - 64, windowwidth : width, windowheight : height, currMode : 'RGBA' }
  }

  componentDidMount = async() => {
    // I like to use camelCase similar to cameltoe
    const interMat = await new Mat().init()
    const channelZero = await new MatOfInt(0).init()
    const channelOne = await new MatOfInt(1).init()
    const channelTwo = await new MatOfInt(2).init()
    const maskMat = await new Mat().init()
    const histogramMat = await new Mat().init()
    const ranges = await new MatOfFloat(0.0, 256.0).init()
    const histSize = await new MatOfInt(this.histSizeNum).init()

    // Fill sepia kernel
    let sepiaKernel = await new Mat(4, 4, CvType.CV_32F).init()
    sepiaKernel.put(0, 0, /* R */0.189, 0.769, 0.393, 0)
    sepiaKernel.put(1, 0, /* G */0.168, 0.686, 0.349, 0)
    sepiaKernel.put(2, 0, /* B */0.131, 0.534, 0.272, 0)
    sepiaKernel.put(3, 0, /* A */0.000, 0.000, 0.000, 1)

    this.setState({ ...this.state, interMat : interMat, channelZero : channelZero, channelOne : channelOne, channelTwo : channelTwo,
      maskMat : maskMat, histogramMat : histogramMat, histSize : histSize, ranges : ranges, sepiaKernel : sepiaKernel })

    DeviceEventEmitter.addListener('onHistograms', this.onHistograms);
    DeviceEventEmitter.addListener('onFrameSize', this.onFrameSize);

    setTimeout(() => {
      if (this.scrollView && this.scrollView.current) {
        this.scrollView.current.scrollTo({ x : 0, y : this.state.windowheight, animated : false })
      }
    }, 500);
  }

  onFrameSize = async(e) => {
    if (!this.state.fillMat) {
      const { frameWidth, frameHeight } = JSON.parse(e.payload).frameSize
      let fillMat = await new Mat(frameWidth,frameHeight,CvType.CV_8UC4).init()
      this.setState({ ...this.state, frameWidth: frameWidth, frameHeight: frameHeight, fillMat: fillMat, halfHeight : frameHeight / 2.0 })
    }
  }

  onHistograms = async(e) => {
    const hist = e.payload
    const { frameWidth, frameHeight, fillMat } = this.state

    if (fillMat) {
      let thickness = (frameWidth / (this.histSizeNum + 10) / 5)
      if (thickness > 5) {
        thickness = 5
      }

      const RGBScalars = [new CvScalar(200, 0, 0, 255), new CvScalar(0, 200, 0, 255), new CvScalar(0, 0, 200, 255)]

      const whiteScalar = CvScalar.all(255)

      const colorsHue = [
        new CvScalar(255, 0, 0, 255),   new CvScalar(255, 60, 0, 255),  new CvScalar(255, 120, 0, 255), new CvScalar(255, 180, 0, 255), new CvScalar(255, 240, 0, 255),
        new CvScalar(215, 213, 0, 255), new CvScalar(150, 255, 0, 255), new CvScalar(85, 255, 0, 255),  new CvScalar(20, 255, 0, 255),  new CvScalar(0, 255, 30, 255),
        new CvScalar(0, 255, 85, 255),  new CvScalar(0, 255, 150, 255), new CvScalar(0, 255, 215, 255), new CvScalar(0, 234, 255, 255), new CvScalar(0, 170, 255, 255),
        new CvScalar(0, 120, 255, 255), new CvScalar(0, 60, 255, 255),  new CvScalar(0, 0, 255, 255),   new CvScalar(64, 0, 255, 255),  new CvScalar(120, 0, 255, 255),
        new CvScalar(180, 0, 255, 255), new CvScalar(255, 0, 255, 255), new CvScalar(255, 0, 215, 255), new CvScalar(255, 0, 85, 255),  new CvScalar(255, 0, 0, 255)
      ]

      for (let c=0;c < hist.length;c++) {
        const offset = ((frameWidth - (5*this.histSizeNum + 4*10)*thickness)/2)
        for (let h=0;h < this.histSizeNum;h++) {
            const x1 = offset + (c * (this.histSizeNum + 10) + h) * thickness
            const x2 = x1
            const y1 = frameHeight - 1.0
            const y2 = y1 - 2.0 - hist[c][h]
            let mP1 = new CvPoint(x1, y1)
            let mP2 = new CvPoint(x2, y2)
            //RNCv.drawLine(histMat,mP1,mP2,RGBScalar,5);
            if (c < 3) {
              RNCv.invokeMethod("line", {"p1":fillMat,"p2":mP1,"p3":mP2,"p4":RGBScalars[c],"p5":thickness})
            }
            else if (c === 3) {
              RNCv.invokeMethod("line", {"p1":fillMat,"p2":mP1,"p3":mP2,"p4":whiteScalar,"p5":thickness})
            }
            else if (c === 4) {
              RNCv.invokeMethod("line", {"p1":fillMat,"p2":mP1,"p3":mP2,"p4":colorsHue[h],"p5":thickness})
            }
        }
      }

      if (this.cvCamera && this.cvCamera.current) {
        // have to do this for performance ...
        this.cvCamera.current.setOverlay(fillMat)
      }
    }
  }

  resetFillMat = () => {
    const { fillMat, currMode } = this.state
    if (currMode === 'HISTOGRAM') {
      setTimeout(() => {
        if (this.cvCamera && this.cvCamera.current) {
          // have to do this for performance ...
          fillMat.setTo(CvScalar.all(0))
          this.cvCamera.current.setOverlay(fillMat)
        }
      }, 500);
    }
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
    this.resetFillMat()
    this.setState({ ...this.state, currMode : 'SEPIA' })
  }

  press5 = (e) => {
    this.resetFillMat()
    this.setState({ ...this.state, currMode : 'SOBEL' })
  }

  press6 = (e) => {
    this.resetFillMat()
    this.setState({ ...this.state, currMode : 'CANNY' })
  }

  press7 = (e) => {
    this.setState({ ...this.state, currMode : 'HISTOGRAM' })
  }

  press8 = (e) => {
    this.resetFillMat()
    this.setState({ ...this.state, currMode : 'RGBA' })
  }

  renderScrollView = () => {
    return(
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
      )
  }
  render() {
    const { interMat, channelZero, channelOne, channelTwo, maskMat, histogramMat, histSize, ranges, halfHeight, fillMat, currMode, frameWidth, frameHeight, sepiaKernel } = this.state

    const left = frameWidth / 8
    const top = frameHeight / 8
    const width = frameWidth * 3 / 4
    const height = frameHeight * 3 / 4
    const right = left + width
    const bottom = top + height

    switch(currMode) {
      default:
      case 'RGBA':
      return (
      <View style={styles.container}>
        <CvCamera style={{ width: '100%', height: '100%', position: 'absolute' }} />
        {this.renderScrollView()}
      </View>
      )
      case 'HISTOGRAM':
      return (
      <View style={styles.container}>
        <CvInvokeGroup groupid='invokeGroup4'>
          <CvInvoke func='normalize' params={{"p1":histogramMat,"p2":histogramMat,"p3":halfHeight,"p4":0,"p5":1}} callback='onHistograms'/>
          <CvInvoke func='calcHist' params={{"p1":interMat,"p2":channelZero,"p3":maskMat,"p4":histogramMat,"p5":histSize,"p6":ranges}}/>
          <CvInvoke func='cvtColor' params={{"p1":"rgba","p2":interMat,"p3":ColorConv.COLOR_RGB2HSV_FULL}}/>
          <CvInvokeGroup groupid='invokeGroup3'>
            <CvInvoke func='normalize' params={{"p1":histogramMat,"p2":histogramMat,"p3":halfHeight,"p4":0,"p5":1}} callback='onHistograms'/>
            <CvInvoke func='calcHist' params={{"p1":interMat,"p2":channelTwo,"p3":maskMat,"p4":histogramMat,"p5":histSize,"p6":ranges}}/>
            <CvInvoke func='cvtColor' params={{"p1":"rgba","p2":interMat,"p3":ColorConv.COLOR_RGB2HSV_FULL}}/>
            <CvInvokeGroup groupid='invokeGroup2'>
              <CvInvoke func='normalize' params={{"p1":histogramMat,"p2":histogramMat,"p3":halfHeight,"p4":0,"p5":1}} callback='onHistograms'/>
              <CvInvoke func='calcHist' params={{"p1":"rgba","p2":channelTwo,"p3":maskMat,"p4":histogramMat,"p5":histSize,"p6":ranges}}/>
              <CvInvokeGroup groupid='invokeGroup1'>
                <CvInvoke func='normalize' params={{"p1":histogramMat,"p2":histogramMat,"p3":halfHeight,"p4":0,"p5":1}} callback='onHistograms'/>
                <CvInvoke func='calcHist' params={{"p1":"rgba","p2":channelOne,"p3":maskMat,"p4":histogramMat,"p5":histSize,"p6":ranges}}/>
                <CvInvokeGroup groupid='invokeGroup0'>
                  <CvInvoke func='normalize' params={{"p1":histogramMat,"p2":histogramMat,"p3":halfHeight,"p4":0,"p5":1}} callback='onHistograms'/>
                  <CvInvoke func='calcHist' params={{"p1":"rgba","p2":channelZero,"p3":maskMat,"p4":histogramMat,"p5":histSize,"p6":ranges}}/>
                  <CvCamera ref={this.cvCamera} style={{ width: '100%', height: '100%', position: 'absolute' }} overlayInterval={1000}/>
                </CvInvokeGroup>
              </CvInvokeGroup>
            </CvInvokeGroup>
          </CvInvokeGroup>
        </CvInvokeGroup>
        {this.renderScrollView()}
      </View>
      )
      case 'CANNY':
      return (
      <View style={styles.container}>
        <CvInvokeGroup groupid='invokeGroup0'>
          <CvInvoke inobj='rgbaInnerWindow' func='release'/>
          <CvInvoke func='cvtColor' params={{"p1":interMat,"p2":"rgbaInnerWindow","p3":ColorConv.COLOR_GRAY2BGRA,"p4":4}}/>
          <CvInvoke func='Canny' params={{"p1":"rgbaInnerWindow","p2":interMat,"p3":80,"p4":90}}/>
          <CvInvoke inobj='rgba' func='submat' params={{"p1":top,"p2":bottom,"p3":left,"p4":right}} outobj='rgbaInnerWindow'/>
          <CvCamera style={{ width: '100%', height: '100%', position: 'absolute' }} />
        </CvInvokeGroup>
        {this.renderScrollView()}
      </View>
      )
      case 'SOBEL':
      return (
      <View style={styles.container}>
        <CvInvokeGroup groupid='invokeGroup1'>
          <CvInvoke inobj='rbgaInnerWindow' func='release'/>
          <CvInvoke func='cvtColor' params={{"p1":interMat,"p2":"rgbaInnerWindow","p3":ColorConv.COLOR_GRAY2BGRA,"p4":4}}/>
          <CvInvoke inobj='rgba' func='submat' params={{"p1":top,"p2":bottom,"p3":left,"p4":right}} outobj='rgbaInnerWindow'/>
          <CvInvoke inobj='grayInnerWindow' func='release'/>
          <CvInvoke func='convertScaleAbs' params={{"p1":interMat,"p2":interMat,"p3":10,"p4":0}}/>
          <CvInvoke func='Sobel' params={{"p1":"grayInnerWindow","p2":interMat,"p3":CvType.CV_8U,"p4":1,"p5":1}}/>
          <CvInvoke inobj='gray' func='submat' params={{"p1":top,"p2":bottom,"p3":left,"p4":right}} outobj='grayInnerWindow'/>
          <CvCamera style={{ width: '100%', height: '100%', position: 'absolute' }} />
        </CvInvokeGroup>
        {this.renderScrollView()}
      </View>
      )
      case 'SEPIA':
      return (
      <View style={styles.container}>
        <CvInvoke inobj='rbgaInnerWindow' func='release'>
          <CvInvoke func="transform" params={{"p1":"rgbaInnerWindow","p2":"rgbaInnerWindow","p3":sepiaKernel}}>
            <CvInvoke inobj='rgba' func='submat' params={{"p1":top,"p2":bottom,"p3":left,"p4":right}} outobj='rgbaInnerWindow'>
              <CvCamera style={{ width: '100%', height: '100%', position: 'absolute' }} />
            </CvInvoke>
          </CvInvoke>
        </CvInvoke>
        {this.renderScrollView()}
      </View>
      )
    }
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

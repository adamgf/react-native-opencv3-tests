/**
 * Sample React Native App to test OpenCV
 * https://github.com/adamgf/react-native-opencv3-tests
 *
 * @format
 * @flow
 * @author Adam Freeman, adamgf@gmail.com 09/17/2019
 */

import React, {Component} from 'react';
import {NativeEventEmitter, DeviceEventEmitter, Platform, StyleSheet, Text, View, Image} from 'react-native';
import {RNCv, Mat, CvType, CvSize, CvPoint, CvScalar, CvImage, CvInvoke, ColorConv} from 'react-native-opencv3';

export default class App extends Component {

	constructor(props) {
		super(props)
    	DeviceEventEmitter.addListener('onPayload', this.onPayload)
		const payloadEmitter = new NativeEventEmitter(RNCv)
		const subscription = payloadEmitter.addListener(
			'onPayload',
			(e) => this.onPayload(e)
		)
		this.state = { subscription: subscription }
	}
    
  componentDidMount = async() => {
    // I like to use camelCase similar to cameltoe
    const interMat = await new Mat().init()
    const circlesMat = await new Mat().init()
	  		
	this.setState({ ...this.state, interMat: interMat, circlesMat: circlesMat })
  }
	
  componentWillUnmount = () => {
	  const { overlayMat, interMat, circlesMat, subscription } = this.state
	  RNCv.deleteMat(overlayMat)	
	  RNCv.deleteMat(interMat)	
	  RNCv.deleteMat(circlesMat)
	  subscription.remove()	
  }
  
  onPayload = async(e) => {
	//alert('Entered onPayload e is: ' + JSON.stringify(e))
    const circles = e.payload

  	let overlayMat
  	if (Platform.OS === 'ios') {
  	  overlayMat = await new Mat(1600,1280,CvType.CV_8UC4).init()
  	}
  	else {
  	  overlayMat = await new Mat(1280,1600,CvType.CV_8UC4).init()
  	} 
	
	//overlayMat.setTo(new CvScalar(0,0,0,0))
	const scalar1 = new CvScalar(255,0,255,255)
	const scalar2 = new CvScalar(255,255,0,255)
	
    for (let i=0;i < circles.length;i+=3) {
		const center = new CvPoint(Math.round(circles[i]), Math.round(circles[i+1]))
		const radius = Math.round(circles[i+2])
        RNCv.invokeMethod("circle", {"p1":overlayMat,"p2":center,"p3":3,"p4":scalar1,"p5":12,"p6":8,"p7":0})
        RNCv.invokeMethod("circle", {"p1":overlayMat,"p2":center,"p3":radius,"p4":scalar2,"p5":24,"p6":8,"p7":0})
	}
	
	this.setState({ ...this.state, overlayMat: overlayMat })	  
  }
  
  renderHoughCircles = (ogImage) => {
    const originalImagePath = './images/Billiard-balls-table.jpg'
	const gaussianKernelSize = new CvSize(9, 9)
	  const { interMat, circlesMat, overlayMat } = this.state
	  if (overlayMat) {
	  	return(
          <CvImage
            style={{width: 200, height: 250}}
            source={ ogImage }
			overlay={overlayMat}
          />
	  	)
	  }
	  else if (interMat && circlesMat) {
  	  	return(
      <CvInvoke func='HoughCircles' params={{"p1":interMat,"p2":circlesMat,"p3":3,"p4":2,"p5":100,"p6":100,"p7":90,"p8":1,"p9":130}} callback='onPayload'>
        <CvInvoke func='GaussianBlur' params={{"p1":interMat,"p2":interMat,"p3":gaussianKernelSize,"p4":2,"p5":2}}>
          <CvInvoke func='cvtColor' params={{"p1":"srcMat","p2":interMat,"p3":ColorConv.COLOR_BGR2GRAY}}>
            <CvImage
              style={{width: 200, height: 250}}
              source={ ogImage }
            />
          </CvInvoke>
        </CvInvoke>
      </CvInvoke>
  	  	)	  	
	  }
	  else {
	  	return(
          <Image
            style={{width: 200, height: 250}}
            source={ ogImage }
          />
	  	)
	  }
  	
  }
  
  render() {
    const originalImagePath = './images/Billiard-balls-table.jpg'

    return (
      <View style={styles.container}>
        <Image
          style={{width: 200, height: 250}}
          source={ require(`${originalImagePath}`) }
        />
        <Text style={styles.captions}>Original</Text>
		  {this.renderHoughCircles( require(`${originalImagePath}`) )}
        <Text style={styles.captions}>Hough Circles</Text>
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

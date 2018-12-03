/**
 * Sample React Native App
 * https://github.com/adamgf/react-native-opencv3-tests
 *
 * @format
 * @flow
 * @author Adam Freeman --> adamgf@gmail.com
 * @description ==> super simple video preview app for CvCamera
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, View, DeviceEventEmitter, Image} from 'react-native';
import {CvCamera} from 'react-native-opencv3';

export default class App extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = { videoImageSource : '' }
  }

  componentDidMount = () => {
    DeviceEventEmitter.addListener('onCameraFrame', this.onCameraFrame.bind(this));
  }

  onCameraFrame(e) {
    //console.log('e.data is: ' + e.data)
    this.setState({ videoImageSource : e.data })
  }

  render() {
    const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource')
    let videoImageData = resolveAssetSource(require('./images/loading.gif')).uri
    if (this.state.videoImageSource.length > 0) {
      //const prependFilename = Platform.OS === 'ios' ? '' : 'file://'
      videoImageData = 'data:image/jpg;base64,' + this.state.videoImageSource;
    }

    const { type } = 'back';
    return (
      <View style={styles.preview}>
        <Image style={styles.preview}
            source={{ uri: `${videoImageData}` }}
        />
        <CvCamera
          style={{ flex : 1, opacity : 0.1 }}
          type={type}
        />
    </View>
    );
  }
}

const styles = StyleSheet.create({
  preview: {
    flex : 1,
    backgroundColor : '#00000000'
  },
  preview2: {
    width: '100%',
    height: '30%'
  },
});

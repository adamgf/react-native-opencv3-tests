/**
 * Sample React Native App to test OpenCV
 * https://github.com/adamgf/react-native-opencv3-tests
 *
 * @format
 * @flow
 * @author Adam Freeman, adamgf@gmail.com
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import {RNCv, ColorConv} from 'react-native-opencv3';

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = { greyImageSource : '' }
    this.RNFS = require('react-native-fs')
  }

  componentDidMount = () => {
    const destFile = this.RNFS.DocumentDirectoryPath + '/girl_wide_brim_hat_greyscaled.png'
    this.downloadAssetSource(require('./images/girl_wide_brim_hat.png'))
    .then((sourceFile) => {
      let srcMat
      let dstMat
      RNCv.Mat().then((res) => {
        dstMat = res
        RNCv.imageToMat(sourceFile).then((res) => {
          srcMat = res
          RNCv.invokeMethod("cvtColor", {"p1":srcMat,"p2":dstMat,"p3":ColorConv.COLOR_BGR2GRAY});
          //RNCv.cvtColor(srcMat, dstMat, ColorConv.COLOR_BGR2GRAY)
          RNCv.matToImage(dstMat, destFile)
          .then((image) => {
            RNCv.deleteMat(srcMat)
            RNCv.deleteMat(dstMat)
            const { width, height, uri } = image
            if (uri && uri.length > 0) {
              this.setState({ greyImageSource: uri })
            }
            else {
              console.error('Error getting image information.')
            }
          })
          .catch((err) => {
            console.error(err)
          })
        })
      })
    })
    .catch((err) => {
      console.error(err)
    })
  }

  getFilename = (source_uri) => {
    const filePortion = source_uri.substring(source_uri.lastIndexOf('/'))
    return this.RNFS.DocumentDirectoryPath + filePortion
  }

  downloadAssetSource = (assetSource) => {
    return new Promise((resolve, reject) => {
      const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource')
      const { uri } = resolveAssetSource(assetSource)
      const filename = this.getFilename(uri)

      this.RNFS.exists(filename)
      .then((itExists) => {
        if (itExists) {
          resolve(filename)
        }
        else {
          const ret = this.RNFS.downloadFile({
            fromUrl: uri,
            toFile: filename
          })

          ret.promise.then((res) => {
            console.log('statusCode is: ' + res.statusCode)
            if (res.statusCode === 200) {
              resolve(filename)
            }
            else {
              reject('File at ' + filename + ' not downloaded.  Status code: ' + ret.statusCode)
            }
          })
          .catch((err) => {
            console.error(err)
            reject('File at ' + filename + ' not downloaded')
          })
        }
      })
      .catch((err) => {
        console.error(err)
        reject('File at ' + filename + ' not downloaded')
      })
    })
  }

  render() {
    const resolveAssetSource = require('react-native/Libraries/Image/resolveAssetSource')
    const originalImagePath = './images/girl_wide_brim_hat.png'
    let greyImagePath = resolveAssetSource(require('./images/girl_wide_brim_hat.png')).uri
    if (this.state.greyImageSource.length > 0) {
      const prependFilename = Platform.OS === 'ios' ? '' : 'file://'
      greyImagePath = prependFilename + this.state.greyImageSource
    }

    return (
      <View style={styles.container}>
        <Image
          style={{width: 200, height: 200}}
          source={ require(`${originalImagePath}`) }
        />
        <Text style={styles.captions}>Original</Text>
        <Image
          style={{width: 200, height: 200}}
          source={{ uri: `${greyImagePath}` }}
        />
        <Text style={styles.captions}>Greyscaled</Text>
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

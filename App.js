import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';








const App = () => {
  const baseUrl = "http://192.168.117.103:5000/"
  const [singleFile, setSingleFile] = useState();
  const [pathFile, setPathFile] = useState('nothing...');
  const [result, setResult] = useState('nothing...');

  const calcVLCPlayerHeight = (windowWidth, aspetRatio) => {
    return windowWidth * aspetRatio;
  };






  const uploadVideo = async () => {
    if (singleFile != null) {


      console.log({ singleFile })
      console.log('Uri: ', singleFile.uri)
      const formdata = new FormData();


      formdata.append("file", singleFile);
      console.log(formdata);

      axios({
        method: "POST",
        url: `${baseUrl}uploadvideo`,
        headers: { 'Content-Type': 'multipart/form-data', },
        data: formdata,
      })
        .then(res => { console.log("res: ", res.data); setResult(res.data) })
        .catch(err => console.log("err: ", err));



    } else {

      alert('Please Select File first');
    }
  };

  const selectFile = async () => {

    try {

      console.log("btn selectfile click")
      const res = await DocumentPicker.pickSingle({

        type: [DocumentPicker.types.allFiles],
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory'
      });


      setSingleFile(res);
      setPathFile(res.uri);
      setResult("nothing...")
      console.log("path of video: ", pathFile);

    } catch (err) {
      setSingleFile(null);
      if (DocumentPicker.isCancel(err)) {

        alert('Canceled');
      } else {

        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };















  return (
    <SafeAreaView style={styles.container}>




      <View style={styles.topContainer}>
        {/* video is here */}

        <Video
          source={require('./videos/q2.mp4')}
          style={styles.video}
          controls={true}
        />

      </View>
      <View style={styles.middleContainer}>
        <View style={{ flexDirection: 'row', width: '100%', backgroundColor: 'green', height: '30%', alignItems: 'center' }}>
          <Text style={styles.titleTextStyle}>File: </Text>
          <Text style={styles.textStyle}>{pathFile}</Text>
        </View>

        <View style={{ flexDirection: 'row', width: '100%', backgroundColor: 'yellow', height: '30%', alignItems: 'center' }}>
          <Text style={styles.titleTextStyle}>Result: </Text>
          <Text style={styles.textStyle}>{result}</Text>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.btnSelectFileStyle}
          activeOpacity={0.5}
          onPress={selectFile}>
          <Text style={styles.buttonTextStyle}>Select File</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnUploadFileStyle}
          activeOpacity={0.5}
          onPress={uploadVideo}>
          <Text style={styles.buttonTextStyle}>Upload File</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default App;

const styles = StyleSheet.create({

  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },


  container: {
    flex: 1,
    backgroundColor: '#fff',

  },

  videoStyle: {
    width: "100%",
    height: 200,
  },


  topContainer: {
    backgroundColor: 'red',
    width: '100%',
    height: '40%'
  },

  middleContainer: {
    backgroundColor: 'pink',
    width: '100%',
    height: '30%'


  },

  bottomContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '10%'
  },

  btnSelectFileStyle: {
    backgroundColor: '#00cc00',
    borderWidth: 0,
    width: 100,
    height: 50,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginEnd: '10%'

  },


  btnUploadFileStyle: {
    backgroundColor: '#00cc00',
    borderWidth: 0,
    width: 100,
    height: 50,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,

  },

  buttonTextStyle: {
    color: "#FFFFFF",
    alignSelf: 'center',
    fontWeight: 'bold'

  },


  textStyle: {
    fontSize: 15,
    color: '#000000',
    marginTop: 5,
    maxWidth: "80%",


  },

  titleTextStyle: {
    color: "#000000",
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 5
  },

  video: {
    height: 300,
    width: 400,
  }
});
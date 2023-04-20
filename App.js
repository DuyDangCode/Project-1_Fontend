import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import DocumentPicker from 'react-native-document-picker';




const App = () => {
  const baseUrl = "http://10.0.230.178:5000/"
  const [singleFile, setSingleFile] = useState();








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
        .then(res => console.log("res: ", res.data))
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
    <View style={styles.container}>


      
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={selectFile}>
        <Text style={styles.buttonTextStyle}>Select File</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={uploadVideo}>
        <Text style={styles.buttonTextStyle}>Upload File</Text>
      </TouchableOpacity>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyle: {
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
});
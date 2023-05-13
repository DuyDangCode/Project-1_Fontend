import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Dimensions, SafeAreaView, PermissionsAndroid, FlatList } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';








// const requestPermission = async () => {
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       {
//         title: 'Can i read extranel storage?',
//         message:'Ok khong?',
//         buttonNeutral: 'Ask Me Later',
//         buttonNegative: 'Cancel',
//         buttonPositive: 'OK',
//       },
//     );
//     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('You can read storage');
//     } else {
//       console.log('Read storage denied');
//     }
//   } catch (err) {
//     console.warn(err);
//   }
// };





const App = () => {
  const baseUrl = "http://192.168.1.19:5000/"
  const [singleFile, setSingleFile] = useState();
  const [pathFile, setPathFile] = useState(require('./videos/q2.mp4'));
  const [result, setResult] = useState('...');
  const [isPlayVideo, setIsPlayVideo] = useState(false);
  const [textUrl, setTextUrl] = useState("pick a video ...");
  const [data, setData] = useState();
  var d=[];
  var i = 0;
  


  const videoPlaying = (props) => {
    const url = "file://" + props;
    console.log("Url: ", url);
    
    return (
      <Video
        source={{uri: url}}
        style={{
          height: "100%",
          width: "100%"}}
        controls={true}
        resizeMode="contain"
        />
      )
  }

  const notVideoPlaying = () => {
    return (
      <View styles={{width:'100%', height:'100%', justifyContent: 'center', alignItems:'center'}}>
        <Text style={{fontSize:25, color:'red'}}>Not video to play.</Text>
      </View>
    )
  }

  const item = ({item}) => {
    return(
      <View style={{flexDirection:'row'}}>
        <View style={{width: 30}}>
          <Text>{item.id}</Text>
        </View>
        <View style={{width: 100}}>
          <Text>{item.name}</Text>
        </View>
        <View style={{width: 100}}>
          <Text>{item.result}</Text>
        </View>
        <View style={{width: 100}}>
          <Text>{item.time}</Text>
        </View>
      </View>
    )
  }

  const tableResult = () =>{
    
    return(
      <View style={{flex: 1, justifyContent:'center', alignItems:'center', alignSelf:'center'}}>

        <View style={{flexDirection:'row'}}>
          <View style={{width: 30, backgroundColor:'red'}}>
            <Text>Id</Text>
          </View>
          <View style={{width: 100, backgroundColor:'red'}}>
            <Text>Name</Text>
          </View>
          <View style={{width: 100, backgroundColor:'red'}}>
            <Text>Result</Text>
          </View>
          <View style={{width: 100, backgroundColor:'red'}}>
            <Text>Time</Text>
          </View>
        </View>
        <FlatList 
          data={data}
          renderItem={item}
          keyExtractor={(item,index)=>index.toString()}/>

        
      </View>

    )

  }
  
  
  








  const uploadVideo = async () => {



    if (singleFile != null) {


      console.log({ singleFile });
      console.log('Uri: ', singleFile.uri);
      console.log('Url: ', `${baseUrl}uploadvideo`);
      const formdata = new FormData();

      setResult('processing...')
      formdata.append("video", singleFile);
      console.log(formdata);
      i++;
      console.log("i: ", i);



      axios({
        method: "POST",
        url: `${baseUrl}uploadvideo`,
        headers: { 'Content-Type': 'multipart/form-data', },
        data: formdata,
      })
        .then(res => { console.log("res: ", res.data); setResult(res.data); })
        .catch(err => {console.log("err: ", err); setResult("ERROR");d.push({id: i, name: 'Duy', result: 'dev', time: 0});  setData(d)});

        





    }
  };

  const selectFile = async () => {

    try {
      const res = await DocumentPicker.pickSingle({

        type: [DocumentPicker.types.allFiles],
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory'
      
      });


      setSingleFile(res);
      setPathFile(res.fileCopyUri);
      console.log("Path file: ", pathFile);
      setIsPlayVideo(true);
      setTextUrl(res.name);
      setResult('...');

      console.log("File to play: ", pathFile);

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

        
        
        {isPlayVideo == true ? videoPlaying(pathFile) : notVideoPlaying() } 


      </View>
      <View style={styles.middleContainer}>
        <View style={{ flexDirection: 'row', width: '100%', height: 30, alignItems: 'center' }}>
          <Text style={styles.titleTextStyle}>File: </Text>
          <Text style={styles.textStyle}>{textUrl}</Text>
        </View>

        <View style={{ flexDirection: 'row', width: '100%', height: 30, alignItems: 'center' }}>
          <Text style={styles.titleTextStyle}>Result: </Text>
          <Text style={{...styles.textStyle, color: result!="ERROR"?"#000000":"red"}}>{result}</Text>
        </View>
        {tableResult()}
      </View>
      
      <View style={styles.bottomContainer}>

      
        
        <TouchableOpacity
          style={styles.btnStyle}
          activeOpacity={0.5}
          onPress={selectFile}>
          <Text style={styles.buttonTextStyle}>Select file</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnStyle}
          activeOpacity={0.5}
          onPress={uploadVideo}>
          <Text style={styles.buttonTextStyle}>Predict</Text>
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
    backgroundColor: 'white',

  },




  topContainer: {
    backgroundColor: 'white',
    
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center', 
    alignItems:'center'
  },

  middleContainer: {
    backgroundColor: 'green',
    
    flex: 1.5,

  },

  bottomContainer: {
    backgroundColor: 'blue',
    
    width:'100%',
    height:60,
    flexDirection: 'row',
    justifyContent: 'center',
    
  },




  btnStyle: {
    backgroundColor: '#00cc00',
    borderWidth: 0,
    width: 100,
    height: 50,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10

  },

  buttonTextStyle: {
    color: "#FFFFFF",
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    

  },


  textStyle: {
    fontSize: 15,
    color: '#000000',
    marginTop: 10,
    maxWidth:'100%',
    


  },

  titleTextStyle: {
    color: "#000000",
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 5
  },

  videoStyle: {
    height: "100%",
    width: "100%",

  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
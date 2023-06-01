import axios from 'axios';
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';

const BASE_URL = 'http://3.25.106.50/';

var i = 0;

//đây là hàm gọi api
const sentApi = async (m, u, h, f) => {
  return await axios({
    method: m,
    url: u,
    headers: h,
    data: f,
  });
};

//đây là phần sẽ sử lý khi gọi api bị lỗi
const handlerResultFromServer = func => {
  return func.then(res => [undefined, res]).catch(err => [err, undefined]);
};

//đây là phần sẽ dùng để phát video
const videoPlaying = props => {
  const url = 'file://' + props;
  console.log('Url: ', url);

  return (
    <Video
      source={{uri: url}}
      style={{
        height: '100%',
        width: '100%',
      }}
      controls={true}
      resizeMode="contain"
    />
  );
};

//đây là phần sẽ hiển thị khi không có video url
const notVideoPlaying = () => {
  return (
    <View
      styles={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 25, color: 'red'}}>Not video to play.</Text>
    </View>
  );
};

//đây là cái item template cho cái table
const item = ({item}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#F5F1EE',
      }}>
      <View
        style={{
          width: 30,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderEndWidth: 0.5,
        }}>
        <Text style={{fontSize: 10, color: 'black'}}>{item.id}</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderStartWidth: 0.5,
          borderEndWidth: 0.5,
        }}>
        <Text style={{fontSize: 10, color: 'black'}}>{item.name}</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderStartWidth: 0.5,
          borderEndWidth: 0.5,
        }}>
        <Text style={{fontSize: 10, color: 'black'}}>{item.model}</Text>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderStartWidth: 0.5,
          borderEndWidth: 0.5,
        }}>
        <Text style={{fontSize: 10, color: 'black'}}>{item.result}</Text>
      </View>
      <View
        style={{
          width: 30,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderStartWidth: 0.5,
        }}>
        <Text style={{color: 'black', fontSize: 10}}>{item.time}</Text>
      </View>
    </View>
  );
};

const App = () => {
  const [singleFile, setSingleFile] = useState();
  const [pathFile, setPathFile] = useState(require('./videos/q2.mp4'));
  const [result, setResult] = useState('...');
  //var i = useRef(0);
  const [isPlayVideo, setIsPlayVideo] = useState(false);
  const [textUrl, setTextUrl] = useState('pick a video ...');
  const [data, setData] = useState([]);

  const getResult = async () => {
    if (singleFile != null) {
      console.log({singleFile});
      console.log('Uri: ', singleFile.uri);
      console.log('Url: ', `${BASE_URL}/api/v1/videos`);
      const formdata = new FormData();
      setResult('processing...');
      formdata.append('video', singleFile);
      console.log(formdata);

      let err, res;
      [err, res] = await await handlerResultFromServer(
        sentApi(
          (m = 'POST'),
          (u = `${BASE_URL}/api/v1/videos`),
          (h = {
            'Content-Type': 'multipart/form-data',
          }),
          (f = formdata),
        ),
      );

      if (err) {
        console.log('err: ', err);
        setResult('ERROR');
      }
      if (res) {
        console.log('res: ', res.data);
        setResult(res.data.result);
        var d = {
          id: i.toString(),
          name: textUrl,
          model: 'default',
          result: res.data.result,
          time: res.data.time,
        };
        setData([...data, d]);
        i++;
      }
    }
  };

  const selectFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.video],
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      });

      setSingleFile(res);
      setPathFile(res.fileCopyUri);
      console.log('Path file: ', pathFile);
      setIsPlayVideo(true);
      setTextUrl(res.name);
      setResult('...');

      console.log('File to play: ', pathFile);

      console.log('path of video: ', pathFile);
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

        {isPlayVideo == true ? videoPlaying(pathFile) : notVideoPlaying()}
      </View>
      <View style={styles.middleContainer}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: 30,
            alignItems: 'center',
          }}>
          <Text style={styles.titleTextStyle}>File: </Text>
          <Text style={styles.textStyle}>{textUrl}</Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            height: 30,
            alignItems: 'center',
          }}>
          <Text style={styles.titleTextStyle}>Result: </Text>
          <Text
            style={{
              ...styles.textStyle,
              color: result != 'ERROR' ? '#000000' : 'red',
            }}>
            {result}
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            padding: 10,
          }}>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <View
              style={{
                width: 30,
                backgroundColor: '#24AFC1',
                alignItems: 'center',
                borderWidth: 1,
              }}>
              <Text>Id</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: '#24AFC1',
                alignItems: 'center',
                borderWidth: 1,
              }}>
              <Text>Name</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: 'red',
                alignItems: 'center',
                borderWidth: 1,
              }}>
              <Text>Model</Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: 'red',
                alignItems: 'center',
                borderWidth: 1,
              }}>
              <Text>Result</Text>
            </View>
            <View
              style={{
                width: 30,
                backgroundColor: 'orange',
                alignItems: 'center',
                borderWidth: 1,
              }}>
              <Text style={{fontSize: 12}}>Time</Text>
            </View>
          </View>
          <FlatList
            data={data}
            renderItem={item}
            extraData={data}
            style={{width: '100%'}}
            keyExtractor={item => item.id}
          />
        </View>
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
          onPress={getResult}>
          <Text style={styles.buttonTextStyle}>Run</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
    alignItems: 'center',
  },

  middleContainer: {
    backgroundColor: '#FCCF47',
    flex: 1.5,
  },

  bottomContainer: {
    backgroundColor: '#FCCF47',

    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  btnStyle: {
    backgroundColor: '#24AFC1',
    borderWidth: 0,
    width: 100,
    height: 50,

    borderColor: '#307ecc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 10,
  },

  buttonTextStyle: {
    color: '#F8F8F8',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },

  textStyle: {
    fontSize: 15,
    color: '#000000',
    marginTop: 10,
    maxWidth: '100%',
  },

  titleTextStyle: {
    color: '#000000',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  videoStyle: {
    height: '100%',
    width: '100%',
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

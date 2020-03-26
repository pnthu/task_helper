import * as React from 'react';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  BackHandler,
  ScrollView,
  TextInput,
  ProgressBarAndroid,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

class TaskDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      process: '',
      info: {id: ''},
      assigner: {name: ''},
      uri: '',
    };
  }

  uploadFile = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = {uri: response.uri};
        this.setState({
          uri: source,
        });
      }
    });
  };

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
    try {
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);

      const ref = firebase
        .database()
        .ref(`/users/${this.props.navigation.state.params.task.item.assigner}`);
      const snapshot = await ref.once('value');
      const assigner = snapshot.val();

      this.setState({
        process: this.props.navigation.state.params.task.item.processingContent,
        info: userInfo,
        assigner: assigner,
      });
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  render = () => {
    const {navigation} = this.props;
    // console.log('bear', JSON.stringify(navigation.state.params.task.item));

    return (
      <View style={styles.container}>
        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
          {navigation.state.params.task.item.name}
        </Text>
        <View style={styles.dropdown}>
          <Picker mode="dropdown">
            <Picker.Item label="To Do" value="To do" />
            <Picker.Item label="Processing" value="Processing" />
            <Picker.Item label="Done" value="Done" />
          </Picker>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Description:</Text>
          <Text>
            {'        '}
            {navigation.state.params.task.item.content}
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            Your processing steps:
          </Text>
          <TextInput
            multiline
            numberOfLines={2}
            onChangeText={text => {
              this.setState({process: text});
            }}
            value={this.state.process}
            style={styles.textInput}
          />
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Resource:</Text>
          {navigation.state.params.task.item.resource ? (
            <TouchableOpacity>
              {'        '}
              {navigation.state.params.task.item.resource}
            </TouchableOpacity>
          ) : (
            <Text>{'        '}This is a new task</Text>
          )}
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Assigner:</Text>
          {this.state.info.id === navigation.state.params.task.item.assigner ? (
            <Text>{'        '}You</Text>
          ) : (
            <Text>
              {'        '}
              {this.state.assigner && this.state.assigner.name}
            </Text>
          )}
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Assignee:</Text>
          {this.state.info.id === navigation.state.params.task.item.assignee ? (
            <Text>{'        '}You</Text>
          ) : (
            <Text>
              {'        '}
              {navigation.state.params.task.item.assignee}
            </Text>
          )}
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Document:</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnUpload}
              onPress={() => {
                this.uploadFile();
              }}>
              <FontAwesome5 name="cloud-upload-alt" style={styles.iconUpload} />
              <Text style={styles.txtUpload}>Upload Image</Text>
            </TouchableOpacity>
          </View>
          <Text style={{fontStyle: 'italic', color: '#203f62'}}>
            Assigned At:{' '}
            {navigation.state.params.task.item.createdDate
              ? moment(navigation.state.params.task.item.createdDate).format(
                  'DD-MM-YYYY',
                )
              : 'This task is not assigned yet '}
          </Text>
          <Text style={{fontStyle: 'italic', color: '#203f62'}}>
            Started At:{' '}
            {navigation.state.params.task.item.startDate
              ? moment(navigation.state.params.task.item.startDate).format(
                  'DD-MM-YYYY',
                )
              : 'This task is not started yet '}
          </Text>
          <Text style={{fontStyle: 'italic', color: '#203f62'}}>
            Ended At:{' '}
            {navigation.state.params.task.item.endDate
              ? moment(navigation.state.params.task.item.endDate).format(
                  'DD-MM-YYYY',
                )
              : 'This task is not ended yet '}
          </Text>

          <View style={styles.managerView}>
            <Text
              style={{fontWeight: 'bold', fontSize: 20, fontStyle: 'italic'}}>
              Manager's Feedback:{' '}
            </Text>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              Evaluation point:
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '5%'}}>0</Text>
              <ProgressBarAndroid
                styleAttr="Horizontal"
                indeterminate={false}
                progress={navigation.state.params.task.item.point / 10}
                style={{width: '80%'}}
              />
              <Text style={{width: '5%'}}>10</Text>
            </View>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              Manager's comment:
            </Text>
            <Text style={{fontStyle: 'italic'}}>
              {'        '}
              {navigation.state.params.task.item.comment}
            </Text>
            <Text style={{fontStyle: 'italic', color: '#203f62'}}>
              Last edited comment:{' '}
              {navigation.state.params.task.item.commentDate &&
                moment(navigation.state.params.task.item.commentDate).format(
                  'DD-MM-YYYY',
                )}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  dropdown: {
    borderRadius: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#dfdfdf',
  },
  managerView: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
    marginTop: 36,
    paddingTop: 36,
  },
  textInput: {
    borderBottomWidth: 1,
  },
  btnContainer: {
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  btnUpload: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#b4b4b4',
    width: '80%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iconUpload: {
    color: '#b4b4b4',
    fontSize: 26,
  },
  txtUpload: {
    textAlign: 'center',
    fontSize: 15,
    color: '#b4b4b4',
  },
});

export default TaskDetailScreen;

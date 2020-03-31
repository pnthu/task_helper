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
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

class TaskDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {id: ''},
      task: {
        startDate: '',
        processingContent: '',
        point: 0,
        path: '',
        id: '',
        createdDate: '',
        content: '',
        commentDate: '',
        assigner: '',
        status: '',
        resource: '',
        name: '',
        endDate: '',
        comment: '',
        assignee: '',
      },
      loading: false,
      assignerName: '',
    };
  }

  uploadImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        this.setState({
          task: {
            path: response.uri,
            startDate: this.state.task.startDate,
            processingContent: this.state.task.processingContent,
            point: this.state.task.point,
            id: this.state.task.id,
            createdDate: this.state.task.createdDate,
            content: this.state.task.content,
            commentDate: this.state.task.commentDate,
            assigner: this.state.task.assigner,
            status: this.state.task.status,
            resource: this.state.task.resource,
            name: this.state.task.name,
            endDate: this.state.task.endDate,
            comment: this.state.task.comment,
            assignee: this.state.task.assignee,
          },
        });
      }
    });
  };

  changeStatus = async status => {
    if (status === 'Waiting for approval' || status === 'Impossible') {
      const ref = firebase
        .storage()
        .ref(
          `${this.state.info.id}-${this.state.task.id}-${moment().format(
            'DD/MM/YYYY',
          )}.jpg`,
        );
      console.log('ref', ref);
      const uploadTask = await ref.putFile(this.state.task.path);
      this.setState({
        task: {
          startDate: this.state.task.startDate,
          processingContent: this.state.task.processingContent,
          point: this.state.task.point,
          path: uploadTask.downloadURL,
          id: this.state.task.id,
          createdDate: this.state.task.createdDate,
          content: this.state.task.content,
          commentDate: this.state.task.commentDate,
          assigner: this.state.task.assigner,
          status: status,
          resource: this.state.task.resource,
          name: this.state.task.name,
          endDate: this.state.task.endDate,
          comment: this.state.task.comment,
          assignee: this.state.task.assignee,
        },
      });
    } else {
      console.log('here');
      this.setState({
        task: {
          startDate: this.state.task.startDate,
          processingContent: this.state.task.processingContent,
          point: this.state.task.point,
          path: this.state.task.path,
          id: this.state.task.id,
          createdDate: this.state.task.createdDate,
          content: this.state.task.content,
          commentDate: this.state.task.commentDate,
          assigner: this.state.task.assigner,
          status: status,
          resource: this.state.task.resource,
          name: this.state.task.name,
          endDate: this.state.task.endDate,
          comment: this.state.task.comment,
          assignee: this.state.task.assignee,
        },
      });
    }

    try {
      const ref = firebase
        .database()
        .ref(`/tasks/${this.props.navigation.state.params.taskId}`);
      console.log('here 1');
      await ref.set(this.state.task);
      console.log('here 2');
    } catch (error) {
      console.log(error);
    }
  };

  onValueChange = async (itemValue, itemPosition) => {
    switch (itemValue) {
      case 'To do': {
        this.setState({loading: true});
        await this.changeStatus(itemValue);
        await this.fetchTask();
        this.setState({loading: false});
        break;
      }
      case 'Processing': {
        this.setState({loading: true});
        await this.changeStatus(itemValue);
        await this.fetchTask();
        this.setState({loading: false});
        break;
      }
      case 'Waiting for approval': {
        if (
          this.state.task.processingContent === '' ||
          this.state.task.path === ''
        ) {
          Alert.alert(
            'Action cannot be done',
            'Please provide your processing steps and document.',
            [
              {
                text: 'OK',
                onPress: () => {
                  return;
                },
              },
            ],
          );
        } else {
          Alert.alert(
            'Confirmation',
            'Are you sure you have completed this task?',
            [
              {
                text: 'Yes',
                onPress: async () => {
                  this.setState({loading: true});
                  await this.changeStatus(itemValue);
                  await this.fetchTask();
                  this.setState({loading: false});
                },
              },
              {
                text: 'No',
                onPress: () => {
                  return;
                },
              },
            ],
          );
        }
        break;
      }
      case 'Impossible': {
        if (
          this.state.task.processingContent === '' ||
          this.state.task.path === ''
        ) {
          Alert.alert(
            'Action cannot be done',
            'Please provide your reasons for not able to complete the task and document.',
            [
              {
                text: 'OK',
                onPress: () => {
                  return;
                },
              },
            ],
          );
        } else {
          this.setState({loading: true});
          await this.changeStatus(itemValue);
          await this.fetchTask();
          this.setState({loading: false});
        }
        break;
      }
    }
  };

  fetchTask = async () => {
    try {
      this.setState({loading: true});
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);

      const ref = firebase
        .database()
        .ref(`/tasks/${this.props.navigation.state.params.taskId}`);
      const snapshot = await ref.once('value');
      const task = snapshot.val();
      this.setState({task: task});

      const ref1 = firebase
        .database()
        .ref(`/users/${this.state.task.assigner}`);
      const snapshot1 = await ref1.once('value');
      var assigner = snapshot1.val();
      this.setState({
        info: userInfo,
        assignerName: assigner.name,
        loading: false,
      });
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
    await this.fetchTask();
  };

  render = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          size="large"
          style={styles.loading}
          color="#3d66cf"
        />

        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
          {this.state.task.name}
        </Text>
        <View style={styles.dropdown}>
          <Picker
            enabled={
              this.state.task.status === 'To do' ||
              this.state.task.status === 'Processing'
            }
            mode="dropdown"
            selectedValue={this.state.task.status}
            onValueChange={this.onValueChange}>
            <Picker.Item label="To do" value="To do" />
            <Picker.Item label="Processing" value="Processing" />
            <Picker.Item
              label="Waiting for approval"
              value="Waiting for approval"
            />
            <Picker.Item label="Impossible" value="Impossible" />
          </Picker>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Description:</Text>
          <Text>
            {'        '}
            {this.state.task.content}
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            Your processing steps:
          </Text>
          <TextInput
            editable={
              this.state.task.status === 'To do' ||
              this.state.task.status === 'Processing'
            }
            multiline
            numberOfLines={2}
            onChangeText={text => {
              this.setState({
                task: {
                  startDate: '',
                  processingContent: text,
                  point: this.state.task.point,
                  id: this.state.task.id,
                  createdDate: this.state.task.createdDate,
                  content: this.state.task.content,
                  commentDate: this.state.task.commentDate,
                  assigner: this.state.task.assigner,
                  status: this.state.task.status,
                  resource: this.state.task.resource,
                  name: this.state.task.name,
                  endDate: this.state.task.endDate,
                  comment: this.state.task.comment,
                  assignee: this.state.task.assignee,
                },
              });
            }}
            value={this.state.task.processingContent}
            style={styles.textInput}
          />
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Resource:</Text>
          {this.state.task.resource ? (
            <TouchableOpacity>
              {'        '}
              <Text> {this.state.task.resource}</Text>
            </TouchableOpacity>
          ) : (
            <Text>{'        '}This is a new task</Text>
          )}
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Assigner:</Text>
          {this.state.info.id === this.state.task.assigner ? (
            <Text>{'        '}You</Text>
          ) : (
            <Text>
              {'        '}
              {this.state.assigner && this.state.assigner.name}
            </Text>
          )}
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Assignee:</Text>
          {this.state.info.id === this.state.task.assignee ? (
            <Text>{'        '}You</Text>
          ) : (
            <Text>
              {'        '}
              {this.state.task.assignee}
            </Text>
          )}
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Document:</Text>
          <View style={styles.btnContainer}>
            {this.state.task.path ? (
              <Image
                source={{uri: this.state.task.path}}
                style={{
                  borderWidth: 3,
                  resizeMode: 'cover',
                  width: 200,
                  height: 200,
                }}
              />
            ) : (
              <TouchableOpacity
                style={styles.btnUpload}
                onPress={this.uploadImage}>
                <FontAwesome5
                  name="cloud-upload-alt"
                  style={styles.iconUpload}
                />
                <Text style={styles.txtUpload}>Upload Image</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={{fontStyle: 'italic', color: '#203f62'}}>
            Assigned At:{' '}
            {this.state.task.createdDate
              ? moment(this.state.task.createdDate).format('DD-MM-YYYY')
              : 'This task is not assigned yet '}
          </Text>
          <Text style={{fontStyle: 'italic', color: '#203f62'}}>
            Started At:{' '}
            {this.state.task.startDate
              ? moment(this.state.task.startDate).format('DD-MM-YYYY')
              : 'This task is not started yet '}
          </Text>
          <Text style={{fontStyle: 'italic', color: '#203f62'}}>
            Ended At:{' '}
            {this.state.task.endDate
              ? moment(this.state.task.endDate).format('DD-MM-YYYY')
              : 'This task is not ended yet '}
          </Text>

          <View style={styles.managerView}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                fontStyle: 'italic',
                marginBottom: 8,
              }}>
              Manager's Feedback:
            </Text>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              Evaluation point:
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={{width: '5%'}}>0</Text>
              <ProgressBarAndroid
                styleAttr="Horizontal"
                indeterminate={false}
                progress={this.state.task.point / 10}
                style={{width: '80%'}}
              />
              <Text style={{width: '5%'}}>10</Text>
            </View>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              Manager's comment:
            </Text>
            <Text style={{fontStyle: 'italic'}}>
              {'        '}
              {this.state.task.comment}
            </Text>
            <Text style={{fontStyle: 'italic', color: '#203f62'}}>
              Last edited comment:{' '}
              {this.state.task.commentDate &&
                moment(this.state.task.commentDate).format('DD-MM-YYYY')}
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
    paddingTop: 24,
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
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default TaskDetailScreen;

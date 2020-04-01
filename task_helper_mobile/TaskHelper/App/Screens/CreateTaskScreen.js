import * as React from 'react';
import moment from 'moment';
import {EventRegister} from 'react-native-event-listeners';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from 'react-native-firebase';

class CreateTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: {
        assignee: '',
        assigner: '',
        comment: '',
        commentDate: '',
        content: '',
        createdDate: '',
        dueDate: 'Select Due Date',
        id: '',
        name: '',
        point: 0,
        processingContent: '',
        resource: '',
        startDate: '',
        status: '',
      },
      userInfo: {
        role: '',
      },
      showDate: false,
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
    try {
      this.setState({loading: true});
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);

      const ref = firebase.database().ref('/tasks');
      const snapshot = await ref.once('value');
      const tasks = snapshot.val();
      if (tasks instanceof Object) {
        var tasksArray = Object.values(tasks);
      }
      this.setState({
        task: {
          assignee: '',
          assigner: userInfo.id,
          comment: '',
          commentDate: '',
          content: '',
          createdDate: new Date().toISOString(),
          dueDate: 'Select Due Date',
          id: `task${tasksArray.length + 1}`,
          name: '',
          point: 0,
          processingContent: '',
          resource: '',
          startDate: '',
          status: '',
        },
        userInfo: userInfo,
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

  componentWillUnmount = () => {
    EventRegister.emit('createTaskEvent');
  };

  assignToMe = async () => {
    if (
      this.state.task.name === '' ||
      this.state.task.content === '' ||
      this.state.task.dueDate === 'Select Due Date'
    ) {
      Alert.alert(
        'Missing value in field(s)',
        'Please fill all of the provided fields.',
        [
          {
            text: 'OK',
            onPress: () => {
              return;
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }
    await this.setState({
      task: {
        assignee: this.state.userInfo.id,
        assigner: this.state.task.assigner,
        comment: '',
        commentDate: '',
        content: this.state.task.content,
        createdDate: this.state.task.createdDate,
        dueDate: this.state.task.dueDate,
        id: this.state.task.id,
        name: this.state.task.name,
        point: 0,
        processingContent: '',
        resource: '',
        startDate: '',
        status:
          this.state.userInfo.role !== 'admin'
            ? 'Waiting for acceptance'
            : 'To do',
      },
      loading: true,
    });
    try {
      const ref = firebase.database().ref(`/tasks/${this.state.task.id}`);
      await ref.set(this.state.task);
      this.setState({loading: false});
      ToastAndroid.show(`Create Task successfully!`, ToastAndroid.SHORT);
      this.props.navigation.goBack();
    } catch (error) {
      ToastAndroid.show(`Create Task error, ${error}`, ToastAndroid.SHORT);
    }
  };

  render = () => {
    const {navigation} = this.props;

    const assignToEmployee = () => {
      navigation.navigate('AssignTask', {
        navigation: navigation,
        task: this.state.task,
      });
    };

    const onChangeDate = (event, selectedDate) => {
      if (new Date(selectedDate).getTime() < new Date().getTime()) {
        Alert.alert('Invalid Date', 'Due date must be after today.');
      } else {
        this.setState({
          task: {
            assignee: '',
            assigner: this.state.task.assigner,
            comment: '',
            commentDate: '',
            content: this.state.task.content,
            createdDate: this.state.task.createdDate,
            dueDate: selectedDate,
            id: this.state.task.id,
            name: this.state.task.name,
            point: 0,
            processingContent: '',
            resource: '',
            startDate: '',
            status: '',
          },
          showDate: false,
        });
      }
    };

    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          size="large"
          style={styles.loading}
          color="#3d66cf"
        />
        <Text style={styles.title}>Create New Task</Text>
        <Text style={styles.label}>Task Name</Text>
        <TextInput
          style={{borderBottomWidth: 1}}
          onChangeText={text => {
            this.setState({
              task: {
                assignee: '',
                assigner: this.state.task.assigner,
                comment: '',
                commentDate: '',
                content: '',
                createdDate: this.state.task.createdDate,
                dueDate: this.state.task.dueDate,
                id: this.state.task.id,
                name: text,
                point: 0,
                processingContent: '',
                resource: '',
                startDate: '',
                status: '',
              },
            });
          }}
          value={this.state.task.name}
        />
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={{borderBottomWidth: 1}}
          onChangeText={text => {
            this.setState({
              task: {
                assignee: '',
                assigner: this.state.task.assigner,
                comment: '',
                commentDate: '',
                content: text,
                createdDate: this.state.task.createdDate,
                dueDate: this.state.task.dueDate,
                id: this.state.task.id,
                name: this.state.task.name,
                point: 0,
                processingContent: '',
                resource: '',
                startDate: '',
                status: '',
              },
            });
          }}
          value={this.state.task.content}
        />
        <Text style={styles.label}>Due Date</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4,
          }}>
          <FontAwesome5
            name="calendar-day"
            style={{fontSize: 20, color: '#475397'}}
          />
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => this.setState({showDate: true})}>
            <Text>
              {this.state.task.dueDate === 'Select Due Date'
                ? this.state.task.dueDate
                : moment(this.state.task.dueDate).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
          {this.state.showDate && (
            <DateTimePicker
              mode="datetime"
              value={new Date()}
              onChange={onChangeDate}
            />
          )}
        </View>

        <View
          style={{
            justifyContent: 'space-evenly',
            marginTop: 24,
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={styles.btnAssign}
            onPress={() => this.assignToMe()}>
            <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>
              Assign to me
            </Text>
          </TouchableOpacity>
          {this.state.userInfo.role !== 'user' && !this.state.loading && (
            <TouchableOpacity
              style={styles.btnAssign}
              onPress={assignToEmployee}>
              <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>
                Assign to Employee
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* <Form>
          <Item stackedLabel>
            <Label>Task Name</Label>
            <Input />
          </Item>
          <Item stackedLabel>
            <Label>Content</Label>
            <Input />
          </Item>
          <Item stackedLabel>
            <Label>Due Date</Label>
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => this.setState({showDate: true})}>
              <Text style={{color: '#939393'}}>Select Due Date</Text>
            </TouchableOpacity>
            {this.state.showDate && (
              <DateTimePicker mode="datetime" value={new Date()} />
            )}
          </Item>
          
        </Form> */}
      </View>
    );
  };
}

//id, resource,
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  label: {
    marginTop: 8,
  },
  btnAssign: {
    backgroundColor: '#475397',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  datePicker: {
    width: '80%',
    borderBottomWidth: 1,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default CreateTaskScreen;

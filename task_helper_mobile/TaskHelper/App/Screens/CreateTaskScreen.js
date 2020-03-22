import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  BackHandler,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import {Form, Item, Label, Input} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from 'react-native-firebase';

class CreateTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: {
        assigner: '',
        createdDate: '',
        status: '',
      },
      userInfo: {
        role: '',
      },
      showDate: false,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
    try {
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);
      console.log('user', userInfo);
      this.setState({
        task: {
          assigner: userInfo.id,
          createdDate: new Date().toISOString(),
          status: 'To do',
        },
        userInfo: userInfo,
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

    const assignToMe = () => {
      navigation.goBack();
    };

    const assignToEmployee = () => {
      navigation.navigate('AssignTask', {
        navigation: navigation,
        task: this.state.task,
      });
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create New Task</Text>
        <Form>
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
          <View
            style={{
              justifyContent: 'space-evenly',
              marginTop: 24,
              flexDirection: 'row',
            }}>
            <TouchableOpacity style={styles.btnAssign} onPress={assignToMe}>
              <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>
                Assign to me
              </Text>
            </TouchableOpacity>
            {this.state.userInfo.role !== 'user' && (
              <TouchableOpacity
                style={styles.btnAssign}
                onPress={assignToEmployee}>
                <Text
                  style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>
                  Assign to Employee
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Form>
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
  btnAssign: {
    backgroundColor: '#475397',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  datePicker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    width: '45%',
  },
});

export default CreateTaskScreen;

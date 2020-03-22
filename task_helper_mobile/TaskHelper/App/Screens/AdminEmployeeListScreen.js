import * as React from 'react';
import {View, Text, TouchableOpacity, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

class AdminEmployeeListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      userInfo: {
        team: '',
      },
    };
  }

  componentDidMount = async () => {
    try {
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);
      console.log('user', userInfo);
      // const ref = firebase.database().ref(`/team/${userInfo.team}`);
      // const snapshot = await ref.once('value');
      // const employees = snapshot.val();

      this.setState({
        userInfo: userInfo,
        // employees: employees,
      });
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  render() {
    const {navigation} = this.props;
    console.log('employees', this.state.employees);
    return (
      <View>
        <Text>Employee List</Text>
      </View>
    );
  }
}

export default AdminEmployeeListScreen;

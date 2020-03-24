import * as React from 'react';
import {StyleSheet, View, Text, ToastAndroid, BackHandler} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

class EmployeeProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: {},
      user: {},
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

      const ref = firebase
        .database()
        .ref(`/users/${this.props.navigation.state.params.id}`);
      const snapshot = await ref.once('value');
      const info = snapshot.val();

      this.setState({
        employee: info,
        user: userInfo,
      });
    } catch (error) {
      console.log('error', error);
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        'Please login to continue using our app',
        ToastAndroid.SHORT,
      );
    }
  };

  render = () => {
    const {navigation} = this.props;
    console.log('bear', this.state.employee);

    return (
      <View style={styles.container}>
        <View style={styles.qrcode}>
          <QRCode value={navigation.state.params.id} size={120} />
          <Text style={styles.title}>{this.state.employee.name}</Text>
        </View>
        <View style={{marginTop: 8}}>
          <Text style={styles.row}>
            <Text style={{fontWeight: 'bold'}}>Name:</Text>{' '}
            {this.state.employee.name}
          </Text>
          <Text style={styles.row}>
            <Text style={{fontWeight: 'bold'}}>Email:</Text>{' '}
            {this.state.employee.email}
          </Text>
          <Text style={styles.row}>
            <Text style={{fontWeight: 'bold'}}>Phone Number:</Text>{' '}
            {this.state.employee.phoneNumber}
          </Text>
        </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  qrcode: {
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    marginTop: 12,
    color: '#5bb8ea',
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
    paddingVertical: 6,
    fontSize: 17,
  },
});

export default EmployeeProfileScreen;

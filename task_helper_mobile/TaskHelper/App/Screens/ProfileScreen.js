import * as React from 'react';
import {StyleSheet, View, Text, ToastAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import QRCode from 'react-native-qrcode-svg';

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: null,
    };
  }

  componentDidMount = async () => {
    try {
      const userInfo = await AsyncStorage.getItem('user-info');
      if (userInfo == null) {
        this.props.navigation.navigate('Login');
        ToastAndroid.show(
          'Please login to continue using our app',
          ToastAndroid.SHORT,
        );
      } else {
        console.log('bear', userInfo);
        this.setState({info: userInfo});
      }
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        'Please login to continue using our app',
        ToastAndroid.SHORT,
      );
    }
  };

  render() {
    const {info} = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.qrcode}>
          <QRCode value="id" size={120} />
          <Text style={styles.title}>My Profile</Text>
        </View>
        <View style={{marginTop: 8}}>
          <Text style={styles.row}>Name: Nguyen Hoang Phuong Tran Chau</Text>
          <Text style={styles.row}>Email: ngocthu99@gmail.com</Text>
          <Text style={styles.row}>Phone Number: 01234567890</Text>
        </View>
      </View>
    );
  }
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
    alignSelf: 'center',
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

export default ProfileScreen;

import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import QRCode from 'react-native-qrcode-svg';
import {GoogleSignin} from '@react-native-community/google-signin';

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
    };
  }

  componentDidMount = async () => {
    try {
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);

      this.setState({
        info: userInfo,
      });
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        'Please login to continue using our app',
        ToastAndroid.SHORT,
      );
    }
  };

  render = () => {
    const {info} = this.state;
    const signOut = async () => {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        try {
          await AsyncStorage.removeItem('user-info');
          this.props.navigation.navigate('Login');
        } catch (error) {
          console.log('Something was wrong.', error);
        }
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.qrcode}>
          <QRCode value={info.id} size={120} />
          <Text style={styles.title}>My Profile</Text>
        </View>
        <View style={{marginTop: 8}}>
          <Text style={styles.row}>Name: {info.name}</Text>
          <Text style={styles.row}>Email: {info.email}</Text>
          <Text style={styles.row}>Phone Number: {info.phoneNumber}</Text>
          <TouchableOpacity onPress={signOut}>
            <Text style={styles.row}>
              Logout {'   '}
              <FontAwesome5 name="sign-out-alt" style={{fontSize: 17}} />
            </Text>
          </TouchableOpacity>
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

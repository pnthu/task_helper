import * as React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

class LoginScreen extends React.Component {
  componentDidMount = () => {
    GoogleSignin.configure({
      webClientId:
        '1060653830628-mvcpcohkiucdt84i275omdvfn5u7sskf.apps.googleusercontent.com',
      offlineAccess: false,
      forceConsentPrompt: true,
      androidClientId:
        '1060653830628-383bnpm3s7t4dhi5p5eem6jdg5kgrbqg.apps.googleusercontent.com',
    });
  };

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const ref = firebase.database().ref(`/users/${userInfo.user.id}`);
      const snapshot = await ref.once('value');
      const user = snapshot.val();
      try {
        await AsyncStorage.setItem('user-info', JSON.stringify(user));
      } catch (error) {
        console.log('Something was wrong.', error);
      }
      if (user.role === 'user') {
        this.props.navigation.navigate('UserHome');
      } else if (user.role === 'manager') {
        this.props.navigation.navigate('ManagerHome');
      } else {
        this.props.navigation.navigate('AdminHome');
      }
      // else {
      //   ToastAndroid.show(
      //     'You do not have permission to use the app. Contact admin for further details.',
      //     ToastAndroid.SHORT,
      //   );
      // }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User has cancelled');
      } else if (error.code == statusCodes.IN_PROGRESS) {
        console.log('navigate to HomeScreen');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play service is not available');
      } else {
        console.log('Another error', error);
      }
    }
  };

  render = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Task Helper</Text>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.introText}>
          Continue to manage your tasks using
        </Text>
        <TouchableOpacity>
          <GoogleSigninButton
            style={{width: 192, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn}
            // disabled={this.state.isSigninInProgress}
          />
        </TouchableOpacity>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5bb8ea',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 40,
  },
  logo: {
    width: 350,
    height: 350,
  },
  introText: {
    color: 'white',
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default LoginScreen;

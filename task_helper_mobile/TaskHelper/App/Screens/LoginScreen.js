import * as React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

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
      console.log({userInfo: userInfo, loggedIn: true});
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

  render() {
    return (
      <View>
        <Text>This is Login Screen</Text>
        <TouchableOpacity>
          <GoogleSigninButton
            // style={{width: 192, height: 48}}
            // size={GoogleSigninButton.Size.Wide}
            // color={GoogleSigninButton.Color.Dark}
            onPress={this._signIn}
            // disabled={this.state.isSigninInProgress}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

export default LoginScreen;

import * as React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
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
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount = async () => {
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
      this.setState({loading: true});
      await GoogleSignin.hasPlayServices();
      var userInfo = await GoogleSignin.signIn();
      const ref = firebase.database().ref(`/users/${userInfo.user.id}`);
      const snapshot = await ref.once('value');
      const user = snapshot.val();
      await AsyncStorage.setItem('user-info', JSON.stringify(user));
      console.log('user', user);
      if (user.role === 'user') {
        this.props.navigation.navigate('UserHome');
      } else if (user.role === 'manager') {
        this.props.navigation.navigate('ManagerHome');
      } else if (user.role === 'admin') {
        this.props.navigation.navigate('AdminHome');
      }
      this.setState({loading: false});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User has cancelled');
        this.setState({loading: false});
      } else if (error.code == statusCodes.IN_PROGRESS) {
        console.log('navigate to HomeScreen');
        this.setState({loading: false});
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play service is not available');
        this.setState({loading: false});
      } else {
        try {
          const refUser = firebase.database().ref(`/users/a`);
          const snapshot = await refUser.once('value');
          var tmpUser = snapshot.val();
          if (tmpUser && userInfo.user.email === tmpUser.email) {
            //change user id
            await refUser.remove();
            const ref2 = firebase.database().ref(`users/${userInfo.user.id}`);
            tmpUser.id = userInfo.user.id;
            await ref2.set(tmpUser);
            //change user id in team
            const ref3 = firebase
              .database()
              .ref(`/team/${tmpUser.team}/teamMembers`);
            const snapshot1 = await ref3.once('value');
            const teamMembers = snapshot1.val();

            if (teamMembers instanceof Array) {
              for (let i = 0; i < teamMembers.length; i++) {
                if (tmpUser.role === 'user' && teamMembers[i] === 'a') {
                  teamMembers[i] = tmpUser.id;
                }
              }
            }
            // await ref3.remove();
            await ref3.set(teamMembers);
            await AsyncStorage.setItem('user-info', JSON.stringify(tmpUser));
            this.props.navigation.navigate('UserHome');
          } else {
            const refManager = firebase.database().ref(`/users/b`);
            const snapshot = await refManager.once('value');
            var tmpManager = snapshot.val();
            if (tmpManager && userInfo.user.email === tmpManager.email) {
              //change user id
              await refManager.remove();
              const ref2 = firebase.database().ref(`users/${userInfo.user.id}`);
              tmpManager.id = userInfo.user.id;
              await ref2.set(tmpManager);
              //change user id in team
              const ref3 = firebase
                .database()
                .ref(`/team/${tmpManager.team}/teamMembers`);
              const snapshot1 = await ref3.once('value');
              const teamMembers = snapshot1.val();

              if (teamMembers instanceof Array) {
                for (let i = 0; i < teamMembers.length; i++) {
                  if (tmpManager.role === 'manager' && teamMembers[i] === 'b') {
                    teamMembers[i] = tmpManager.id;
                  }
                }
              }
              // await ref3.remove();
              await ref3.set(teamMembers);
              await AsyncStorage.setItem(
                'user-info',
                JSON.stringify(tmpManager),
              );
              this.props.navigation.navigate('ManagerHome');
            } else {
              ToastAndroid.show(
                'You do not have permission to use the app. Contact admin for further details.',
                ToastAndroid.LONG,
              );
              await GoogleSignin.revokeAccess();
              await GoogleSignin.signOut();
              this.setState({loading: false});
            }
          }
        } catch (error) {
          console.log('Another error', error);
          if (await GoogleSignin.isSignedIn()) await GoogleSignin.signOut();
          this.setState({loading: false});
        }
      }
    }
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
        <Text style={styles.title}>Task Helper</Text>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.introText}>
          Continue to manage your tasks using
        </Text>
        <TouchableOpacity>
          <GoogleSigninButton
            style={{width: 250, height: 48}}
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
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 9999,
  },
});

export default LoginScreen;

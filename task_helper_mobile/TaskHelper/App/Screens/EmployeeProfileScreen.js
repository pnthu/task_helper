import * as React from 'react';
import {StyleSheet, View, Text, ToastAndroid, BackHandler} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import QRCode from 'react-native-qrcode-svg';

class EmployeeProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
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
    const {navigation} = this.props;
    console.log('info', navigation.state.params.info);

    return (
      <View style={styles.container}>
        <View style={styles.qrcode}>
          <QRCode value={navigation.state.params.info.id} size={120} />
          <Text style={styles.title}>{navigation.state.params.info.name}</Text>
        </View>
        <View style={{marginTop: 8}}>
          <Text style={styles.row}>
            <Text style={{fontWeight: 'bold'}}>Name:</Text>{' '}
            {navigation.state.params.info.name}
          </Text>
          <Text style={styles.row}>
            <Text style={{fontWeight: 'bold'}}>Email:</Text>{' '}
            {navigation.state.params.info.email}
          </Text>
          <Text style={styles.row}>
            <Text style={{fontWeight: 'bold'}}>Phone Number:</Text>{' '}
            {navigation.state.params.info.phoneNumber}
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

import * as React from 'react';
import {StyleSheet, View, Text, BackHandler} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

class ScanQRScreen extends React.Component {
  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack(null);
      return true;
    });
  };

  onSuccess = e => {
    this.props.navigation.push('EmployeeProfile', {
      navigation: this.props.navigation,
      id: e.data,
    });
  };

  render() {
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Move your camera to the QR code to scan</Text>
        <QRCodeScanner onRead={this.onSuccess} cameraStyle={styles.qrcode} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  qrcode: {
    width: '90%',
    height: '60%',
    alignSelf: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 28,
  },
});

export default ScanQRScreen;

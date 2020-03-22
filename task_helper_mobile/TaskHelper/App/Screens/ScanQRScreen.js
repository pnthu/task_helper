import * as React from 'react';
import {StyleSheet, Linking, View, Text, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';

class ScanQRScreen extends React.Component {
  componentDidMount = () => {};

  onSuccess = e => {
    Linking.openURL(e.data).catch(err =>
      console.error('An error occured', err),
    );
  };

  render() {
    const {navigation} = this.props;

    return (
      <View>
        <Text>Scan QR</Text>
        <QRCodeScanner
          onRead={this.onSuccess}
          topContent={
            <Text>
              Go to <Text>wikipedia.org/wiki/QR_code</Text> on your computer and
              scan the QR code.
            </Text>
          }
          bottomContent={
            <TouchableOpacity>
              <Text>OK. Got it!</Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }
}

export default ScanQRScreen;

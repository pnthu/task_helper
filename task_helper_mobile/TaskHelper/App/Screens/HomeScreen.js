import * as React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';

class HomeScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>This is Home Screen</Text>
        <TouchableOpacity>
          <Button
            title="Go to LoginScreen"
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}></Button>
        </TouchableOpacity>
      </View>
    );
  }
}

export default HomeScreen;

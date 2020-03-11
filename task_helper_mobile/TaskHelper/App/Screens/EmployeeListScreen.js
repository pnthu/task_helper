import * as React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';

class EmployeeListScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>This is Employee List Screen</Text>
        <TouchableOpacity>
          <Button
            title="Go to Admin TaskScreen"
            onPress={() => {
              this.props.navigation.navigate('AdminHome');
            }}></Button>
        </TouchableOpacity>
      </View>
    );
  }
}

export default EmployeeListScreen;

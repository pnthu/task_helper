import * as React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

class EmployeeListScreen extends React.Component {
  componentDidMount = () => {};

  render() {
    const {navigation} = this.props;

    return (
      <View>
        <Text>Assign Task</Text>
      </View>
    );
  }
}

export default EmployeeListScreen;

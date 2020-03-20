import * as React from 'react';
import {StyleSheet, View, Text, BackHandler, ToastAndroid} from 'react-native';
import {Form, Item, Label, Input} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';

class CreateTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {
        role: '',
      },
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
      this.setState({userInfo: userInfo});
    } catch (error) {
      console.log(error);
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  render = () => {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create New Task</Text>
        <Form>
          <Item stackedLabel>
            <Label>Task Name</Label>
            <Input />
          </Item>
          <Item stackedLabel last>
            <Label>Task Name</Label>
            <Input />
          </Item>
        </Form>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CreateTaskScreen;

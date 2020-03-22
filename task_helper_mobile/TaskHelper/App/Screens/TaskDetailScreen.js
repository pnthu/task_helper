import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  BackHandler,
  ScrollView,
  TextInput,
  ProgressBarAndroid,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

class TaskDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      process: '',
      info: {id: ''},
      assigner: {name: ''},
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

      const ref = firebase
        .database()
        .ref(`/users/${this.props.navigation.state.params.task.item.assigner}`);
      const snapshot = await ref.once('value');
      const assigner = snapshot.val();

      this.setState({
        process: this.props.navigation.state.params.task.item.processingContent,
        info: userInfo,
        assigner: assigner,
      });
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  render = () => {
    const {navigation} = this.props;
    console.log('bear', JSON.stringify(navigation.state.params.task.item));

    return (
      <View style={styles.container}>
        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
          {navigation.state.params.task.item.name}
        </Text>
        <Picker mode="dropdown" style={styles.dropdown}>
          <Picker.Item label="To Do" value="To do" />
          <Picker.Item label="Processing" value="Processing" />
          <Picker.Item label="Done" value="Done" />
        </Picker>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Description:</Text>
          <Text>
            {'        '}
            {navigation.state.params.task.item.content}
          </Text>
          <Text style={{fontWeight: 'bold', fontSize: 18}}>
            Your processing steps:
          </Text>
          <TextInput
            multiline
            numberOfLines={2}
            onChangeText={text => {
              this.setState({process: text});
            }}
            value={this.state.process}
            style={styles.textInput}
          />
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Resource:</Text>
          {navigation.state.params.task.item.resource ? (
            <TouchableOpacity>
              {'        '}
              {navigation.state.params.task.item.resource}
            </TouchableOpacity>
          ) : (
            <Text>{'        '}This is a new task</Text>
          )}
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Assigner:</Text>
          {this.state.info.id === navigation.state.params.task.item.assigner ? (
            <Text>{'        '}You</Text>
          ) : (
            <Text>
              {'        '}
              {this.state.assigner && this.state.assigner.name}
            </Text>
          )}
          <Text style={{fontWeight: 'bold', fontSize: 18}}>Assignee:</Text>
          {this.state.info.id === navigation.state.params.task.item.assignee ? (
            <Text>{'        '}You</Text>
          ) : (
            <Text>
              {'        '}
              {navigation.state.params.task.item.assignee}
            </Text>
          )}
          <Text style={{fontStyle: 'italic', color: '#939393'}}>
            Assigned At:{' '}
            {navigation.state.params.task.item.createdDate ||
              'This task is not assigned yet '}
          </Text>
          <Text style={{fontStyle: 'italic', color: '#939393'}}>
            Started At:{' '}
            {navigation.state.params.task.item.startDate ||
              'This task is not started yet '}
          </Text>
          <Text style={{fontStyle: 'italic', color: '#939393'}}>
            Ended At:{' '}
            {navigation.state.params.task.item.endDate ||
              'This task is not ended yet '}
          </Text>

          <View style={styles.managerView}>
            <Text
              style={{fontWeight: 'bold', fontSize: 20, fontStyle: 'italic'}}>
              Manager's Feedback:{' '}
            </Text>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              Evaluation point:
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{width: '5%'}}>0</Text>
              <ProgressBarAndroid
                styleAttr="Horizontal"
                indeterminate={false}
                progress={navigation.state.params.task.item.point / 10}
                style={{width: '80%'}}
              />
              <Text style={{width: '5%'}}>10</Text>
            </View>
            <Text style={{fontWeight: 'bold', fontSize: 18}}>
              Manager's comment:
            </Text>
            <Text style={{fontStyle: 'italic'}}>
              {'        '}
              {navigation.state.params.task.item.comment}
            </Text>
            <Text style={{fontStyle: 'italic', color: '#939393'}}>
              Last edited comment:{' '}
              {navigation.state.params.task.item.commentDate}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  managerView: {
    borderTopWidth: 1,
    borderTopColor: 'gray',
    marginTop: 36,
    paddingTop: 36,
  },
  textInput: {
    borderBottomWidth: 1,
  },
});

export default TaskDetailScreen;

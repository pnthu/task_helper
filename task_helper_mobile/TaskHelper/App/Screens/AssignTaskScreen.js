import * as React from 'react';
import {EventRegister} from 'react-native-event-listeners';
import {StyleSheet, View, Text, ToastAndroid, FlatList} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

class EmployeeListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      teamName: '',
      userInfo: {
        team: '',
      },
      task: {},
    };
  }

  assignToEmp = async id => {
    await this.setState({
      task: {
        assignee: id,
        assigner: this.state.task.assigner,
        comment: '',
        commentDate: '',
        content: this.state.task.content,
        createdDate: this.state.task.createdDate,
        dueDate: this.state.task.dueDate,
        id: this.state.task.id,
        name: this.state.task.name,
        point: 0,
        processingContent: '',
        resource: '',
        startDate: '',
        status: 'To do',
      },
      loading: true,
    });
    try {
      const ref = firebase.database().ref(`/tasks/${this.state.task.id}`);
      await ref.set(this.state.task);
      this.setState({loading: false});
      ToastAndroid.show(`Create Task successfully!`, ToastAndroid.SHORT);
      this.props.navigation.navigate('Overview');
    } catch (error) {
      ToastAndroid.show(`Create Task error, ${error}`, ToastAndroid.SHORT);
    }
  };

  componentDidMount = async () => {
    try {
      var employees = [];
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);
      const ref = firebase.database().ref(`/team/${userInfo.team}`);
      const snapshot = await ref.once('value');
      const team = snapshot.val();
      const {teamMembers, name} = team;
      if (teamMembers instanceof Array) {
        for (const mem of teamMembers) {
          let ref1 = firebase.database().ref(`/users/${mem}`);
          let snapshot1 = await ref1.once('value');
          let memberInfo = snapshot1.val();
          if (memberInfo.role !== 'manager') {
            employees.push(memberInfo);
          }
        }
      }

      this.setState({
        userInfo: userInfo,
        employees: employees,
        teamName: name,
        task: this.props.navigation.state.params.task,
      });
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  componentWillUnmount = () => {
    EventRegister.emit('createTaskEvent');
  };

  render() {
    const {navigation} = this.props;
    console.log('employees', this.state.employees);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your team: {this.state.teamName}</Text>
        <FlatList
          data={this.state.employees}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item, index) => (
            <View key={index} style={styles.empCard}>
              <FontAwesome
                name="user-circle"
                style={{fontSize: 35, marginRight: 12}}
                color="#657283"
              />
              <View>
                <Text style={{fontWeight: 'bold', fontSize: 18}}>
                  {item.item.name}
                </Text>
                <Text style={{color: '#4f5e71', marginBottom: 4}}>
                  {item.item.role === 'user' && 'User'}
                </Text>
                <Text style={{color: '#a5a5a5'}}>{this.state.teamName}</Text>
              </View>
              <FontAwesome5
                name="plus-circle"
                onPress={() => this.assignToEmp(item.item.id)}
                style={styles.btnNew}
              />
            </View>
          )}
        />
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
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  empCard: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9eaed',
    alignItems: 'center',
    paddingVertical: 6,
  },
  btnNew: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    fontSize: 28,
    color: '#475397',
  },
});

export default EmployeeListScreen;

import * as React from 'react';
import moment from 'moment';
import {
  StyleSheet,
  View,
  Text,
  ToastAndroid,
  BackHandler,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {Tabs, Tab} from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

class EmployeeProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      employee: {},
      user: {},
      tasks: [],
      loading: false,
    };
  }

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
    try {
      this.setState({loading: true});
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);

      const ref = firebase
        .database()
        .ref(`/users/${this.props.navigation.state.params.id}`);
      const snapshot = await ref.once('value');
      const info = snapshot.val();

      const ref1 = firebase.database().ref(`/tasks`);
      const snapshot1 = await ref1.once('value');
      const tasks = snapshot1.val();
      var result = [];
      if (tasks instanceof Object) {
        const allTasks = Object.values(tasks);
        for (let i = 0; i < allTasks.length; i++) {
          if (allTasks[i].assignee === info.id) {
            result.push(allTasks[i]);
          }
        }
      }

      this.setState({
        employee: info,
        user: userInfo,
        tasks: result,
        loading: false,
      });
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        'Please login to continue using our app',
        ToastAndroid.SHORT,
      );
    }
  };

  render() {
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          size="large"
          style={styles.loading}
          color="#3d66cf"
        />
        <View style={styles.qrcode}>
          <QRCode value={navigation.state.params.id} size={120} />
          <Text style={styles.title}>{this.state.employee.name}</Text>
        </View>
        <Tabs
          tabBarUnderlineStyle={{backgroundColor: '#5bb8ea'}}
          tabBarInactiveTextColor="black">
          <Tab
            heading="Profile"
            tabStyle={{backgroundColor: 'white'}}
            activeTabStyle={{backgroundColor: 'white'}}
            activeTextStyle={{fontWeight: 'bold', color: '#5bb8ea'}}>
            <View style={{marginTop: 8}}>
              <Text style={styles.row}>
                <Text style={{fontWeight: 'bold'}}>Name:</Text>{' '}
                {this.state.employee.name}
              </Text>
              <Text style={styles.row}>
                <Text style={{fontWeight: 'bold'}}>Email:</Text>{' '}
                {this.state.employee.email}
              </Text>
              <Text style={styles.row}>
                <Text style={{fontWeight: 'bold'}}>Phone Number:</Text>{' '}
                {this.state.employee.phoneNumber}
              </Text>
            </View>
          </Tab>
          <Tab
            heading="Tasks"
            tabStyle={{backgroundColor: 'white'}}
            activeTabStyle={{backgroundColor: 'white'}}
            activeTextStyle={{fontWeight: 'bold', color: '#5bb8ea'}}>
            {this.state.tasks.length === 0 && !this.state.loading ? (
              <View style={{alignItems: 'center', marginTop: '30%'}}>
                <FontAwesome name="file-text" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>
                  This employee doesn't have any task to do recently.
                </Text>
              </View>
            ) : (
              <FlatList
                data={this.state.tasks}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(item, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.card}
                      onPress={() => {
                        navigation.navigate('TaskDetail', {
                          navigation: navigation,
                          taskId: item.item.id,
                        });
                      }}>
                      <FontAwesome5
                        name="clipboard-list"
                        style={{fontSize: 35, marginRight: 12}}
                        color="#475397"
                      />
                      <View>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>
                          {item.item.name}
                        </Text>
                        <Text style={{color: '#4f5e71', marginBottom: 4}}>
                          {item.item.status}
                        </Text>
                        <Text style={{color: '#a5a5a5'}}>
                          Due Date:{' '}
                          {moment(item.item.dueDate).format('DD-MM-YYYY')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )}
          </Tab>
        </Tabs>
      </View>
    );
  }
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
    marginVertical: 12,
    color: '#5bb8ea',
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: '#c4c4c4',
    paddingVertical: 6,
    fontSize: 17,
  },
  card: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9eaed',
    alignItems: 'center',
    paddingVertical: 6,
  },
  emptyIcon: {color: '#94daff', fontSize: 40},
  emptyText: {
    fontSize: 17,
    fontStyle: 'italic',
    marginTop: 24,
    textAlign: 'center',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default EmployeeProfileScreen;

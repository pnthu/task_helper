import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Picker,
  FlatList,
  ToastAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

const data = [{}, {}, {}, {}, {}];

class TasksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFrom: false,
      showTo: false,
      userInfo: {
        name: '',
        id: '',
      },
      tasks: [],
    };
  }

  componentDidMount = async () => {
    try {
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);

      const ref = firebase.database().ref(`/tasks`);
      const snapshot = await ref.once('value');
      const tasks = snapshot.val();
      const result = [];
      tasks.forEach(element => {
        if (element.assignee === userInfo.id) {
          result.push(element);
        }
      });
      this.setState({
        userInfo: userInfo,
        tasks: result,
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
    const onChange = (event, selectedDate) => {
      selectedDate && console.log('bear', selectedDate);
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hello {this.state.userInfo.name},</Text>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'right'}}>
          this is your task list.
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
          }}>
          {/* from filter here */}
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => this.setState({showFrom: true})}>
            <Text style={{color: '#939393'}}>From...</Text>
          </TouchableOpacity>
          {this.state.showFrom && (
            <DateTimePicker value={new Date()} onChange={onChange} />
          )}
          {/* - to filter here */}
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => this.setState({showTo: true})}>
            <Text style={{color: '#939393'}}>To...</Text>
          </TouchableOpacity>
          {this.state.showTo && (
            <DateTimePicker value={new Date()} onChange={onChange} />
          )}
        </View>
        {/* status filter here */}
        <Picker mode="dropdown" style={styles.dropdown}>
          <Picker.Item label="To Do" value="todo" />
          <Picker.Item label="Processing" value="processing" />
          <Picker.Item label="Done" value="done" />
          <Picker.Item label="Approved" value="approved" />
          <Picker.Item label="Impossible" value="impossible" />
        </Picker>

        <FlatList
          data={this.state.tasks}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          style={{marginTop: 24}}
          renderItem={(item, index) => (
            <TouchableOpacity
              style={styles.card}
              key={index}
              onPress={() => {
                navigation.navigate('TaskDetail', {
                  navigation: navigation,
                  task: item,
                });
              }}>
              <FontAwesome5 name="clipboard-list" style={styles.icon} />
              <Text style={{fontWeight: 'bold'}}>{item.item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <FontAwesome5
          name="plus-circle"
          onPress={() =>
            navigation.navigate('CreateTask', {navigation: navigation})
          }
          style={styles.btnNew}
        />
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
  datePicker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    width: '45%',
  },
  dropdown: {
    // backgroundColor: '#f0f0f0',
    // borderRadius: 50,
    // paddingVertical: 6,
    // paddingHorizontal: 12,
    // color: '#939393',
    // marginTop: 24,
    borderWidth: 1,
  },
  card: {
    width: '47%',
    height: 180,
    marginBottom: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {fontSize: 30, marginBottom: 18, color: '#475397'},
  btnNew: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    fontSize: 32,
    color: '#475397',
  },
});

export default TasksScreen;

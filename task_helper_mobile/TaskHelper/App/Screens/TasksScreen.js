import * as React from 'react';
import moment from 'moment';
import {EventRegister} from 'react-native-event-listeners';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Picker,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

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
      filteredTask: [],
      filter: {from: 'From...', to: 'To...', status: ''},
      loading: false,
    };
  }

  componentDidMount = async () => {
    try {
      this.setState({loading: true});
      const response = await AsyncStorage.getItem('user-info');
      const userInfo = JSON.parse(response);

      const ref = firebase.database().ref(`/tasks`);
      const snapshot = await ref.once('value');
      const tasks = snapshot.val();
      var result = [];
      if (tasks instanceof Object) {
        const allTasks = Object.values(tasks);
        for (let i = 0; i < allTasks.length; i++) {
          if (allTasks[i].assignee === userInfo.id) {
            result.push(allTasks[i]);
          }
        }
      }
      this.setState({
        userInfo: userInfo,
        tasks: result,
      });
      this.setState({loading: false});
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  componentWillMount = () => {
    this.listener = EventRegister.addEventListener(
      'createTaskEvent',
      async () => {
        try {
          this.setState({loading: true});
          const response = await AsyncStorage.getItem('user-info');
          const userInfo = JSON.parse(response);

          const ref = firebase.database().ref(`/tasks`);
          const snapshot = await ref.once('value');
          const tasks = snapshot.val();
          var result = [];
          if (tasks instanceof Object) {
            const allTasks = Object.values(tasks);
            for (let i = 0; i < allTasks.length; i++) {
              if (allTasks[i].assignee === userInfo.id) {
                result.push(allTasks[i]);
              }
            }
          }
          this.setState({
            userInfo: userInfo,
            tasks: result,
          });
          this.setState({loading: false});
        } catch (error) {
          this.props.navigation.navigate('Login');
          ToastAndroid.show(
            `Please login to continue using our app, ${error}`,
            ToastAndroid.SHORT,
          );
        }
      },
    );
  };

  filterTask = (from, to, status) => {
    console.log('from to status', from, to, status);
    this.state.tasks.filter(task => {
      console.log(task.createdDate);
      if (from !== 'From...') {
        if (to !== 'To...') {
          if (status !== '') {
            //co from to status
            return (
              moment(task.createdDate).isSameOrAfter(moment(from)) &&
              moment(task.createdDate).isSameOrBefore(moment(to)) &&
              task.status === status
            );
          } else {
            // co from to
            return (
              moment(task.createdDate).isSameOrAfter(moment(from)) &&
              moment(task.createdDate).isSameOrBefore(moment(to))
            );
          }
        } else {
          if (status !== '') {
            // co from status
            return (
              moment(task.createdDate).isSameOrAfter(moment(from)) &&
              task.status === status
            );
          } else {
            //chi co from
            return moment(task.createdDate).isSameOrAfter(moment(from));
          }
        }
      } else if (to !== 'To...') {
        if (status !== '') {
          // co to status
          return (
            moment(task.createdDate).isSameOrBefore(moment(to)) &&
            task.status === status
          );
        } else {
          // chi co to
          return moment(task.createdDate).isSameOrBefore(moment(to));
        }
      } else if (status !== '') {
        //chi co status
        return task.status === status;
      } else {
        return task;
      }
    });
  };

  onChangeFrom = (event, selectedDate) => {
    selectedDate
      ? this.setState({
          filter: {
            from: selectedDate,
            to: this.state.filter.to,
            status: this.state.filter.status,
          },
          showFrom: false,
        })
      : this.setState({showFrom: false});

    this.setState({
      filteredTask: this.filterTask(
        selectedDate,
        this.state.filter.to,
        this.state.filter.status,
      ),
    });
  };

  onChangeTo = (event, selectedDate) => {
    selectedDate
      ? this.setState({
          filter: {
            from: this.state.filter.from,
            to: selectedDate,
            status: this.state.filter.status,
          },
          showTo: false,
        })
      : this.setState({showTo: false});
    this.setState({
      filteredTask: this.filterTask(
        this.state.filter.from,
        selectedDate,
        this.state.filter.status,
      ),
    });
  };

  onStatusChange = (itemValue, itemPosition) => {
    this.setState({
      filter: {
        from: this.state.filter.from,
        to: this.state.filter.to,
        status: itemValue,
      },
    });
    this.setState({
      filteredTask: this.filterTask(
        this.state.filter.from,
        this.state.filter.to,
        itemValue,
      ),
    });
  };

  render = () => {
    console.log('filter', this.state.filteredTask);
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          size="large"
          style={styles.loading}
          color="#3d66cf"
        />
        <Text style={styles.title}>Hello {this.state.userInfo.name},</Text>
        <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'right'}}>
          this is your task list.
        </Text>
        {this.state.tasks.length === 0 && !this.state.loading ? (
          <View style={{alignItems: 'center', marginTop: '50%'}}>
            <FontAwesome name="file-text" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>
              You don't have any task to do recently.
            </Text>
          </View>
        ) : (
          <>
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
                <Text style={{color: '#939393'}}>
                  {this.state.filter.from !== 'From...'
                    ? moment(this.state.filter.from).format('DD/MM/YYYY')
                    : 'From...'}
                </Text>
              </TouchableOpacity>
              {this.state.showFrom && (
                <DateTimePicker
                  value={new Date()}
                  onChange={this.onChangeFrom}
                />
              )}
              {/* - to filter here */}
              <TouchableOpacity
                style={styles.datePicker}
                onPress={() => this.setState({showTo: true})}>
                <Text style={{color: '#939393'}}>
                  {this.state.filter.to !== 'To...'
                    ? moment(this.state.filter.to).format('DD/MM/YYYY')
                    : 'To...'}
                </Text>
              </TouchableOpacity>
              {this.state.showTo && (
                <DateTimePicker value={new Date()} onChange={this.onChangeTo} />
              )}
            </View>
            {/* status filter here */}
            <View style={styles.dropdown}>
              <Picker
                mode="dropdown"
                selectedValue={this.state.filter.status}
                onValueChange={this.onStatusChange}>
                <Picker.Item label="Status..." value="" />
                <Picker.Item
                  label="Waiting for Acceptance"
                  value="Waiting for Acceptance"
                />
                <Picker.Item label="To Do" value="To do" />
                <Picker.Item label="Processing" value="Processing" />
                <Picker.Item
                  label="Waiting for approval"
                  value="Waiting for approval"
                />
                <Picker.Item label="Impossible" value="Impossible" />
                <Picker.Item label="Done" value="Done" />
                <Picker.Item label="Cancelled" value="Cancelled" />
              </Picker>
            </View>
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
                      taskId: item.item.id,
                    });
                  }}>
                  <FontAwesome5 name="clipboard-list" style={styles.icon} />
                  <Text
                    style={{fontWeight: 'bold', textAlign: 'center'}}
                    numberOfLines={2}
                    ellipsizeMode="tail">
                    {item.item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

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
    borderRadius: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#dfdfdf',
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
  emptyIcon: {color: '#94daff', fontSize: 45},
  emptyText: {
    fontSize: 20,
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

export default TasksScreen;

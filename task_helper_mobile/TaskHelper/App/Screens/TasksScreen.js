import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Picker,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const data = [{}, {}, {}, {}, {}];

class TasksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showFrom: false,
      showTo: false,
    };
  }

  render() {
    const onChange = (event, selectedDate) => {
      selectedDate && console.log('bear', selectedDate);
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hello Nguyen Hoang Phuong Tran Chau,</Text>
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
          <Picker.Item label="To Do" value="todo" />
          <Picker.Item label="To Do" value="todo" />
          <Picker.Item label="To Do" value="todo" />
          <Picker.Item label="To Do" value="todo" />
        </Picker>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          style={{marginTop: 24}}
          renderItem={(item, index) => (
            <TouchableOpacity style={styles.card}>
              <FontAwesome5 name="clipboard-list" style={styles.icon} />
              <Text style={{fontWeight: 'bold'}}>Some Task</Text>
            </TouchableOpacity>
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
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: '#939393',
    marginTop: 24,
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
});

export default TasksScreen;

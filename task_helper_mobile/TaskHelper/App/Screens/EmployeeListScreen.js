import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
      loading: false,
    };
  }

  componentDidMount = async () => {
    try {
      this.setState({loading: true});
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
        loading: false,
      });
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  render() {
    const {navigation} = this.props;
    console.log('employees', this.state.employees);
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          size="large"
          style={styles.loading}
          color="#3d66cf"
        />
        <View style={styles.header}>
          <Text style={styles.title}>Your team: {this.state.teamName}</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.push('ScanQR', {navigation: navigation});
            }}>
            <FontAwesome
              name="qrcode"
              color="#5bb8ea"
              style={{fontSize: 30, justifyContent: 'center'}}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.employees}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.empCard}
              onPress={() => {
                navigation.navigate('EmployeeProfile', {
                  navigation: navigation,
                  id: item.item.id,
                });
              }}>
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
  header: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignContent: 'center',
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
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default EmployeeListScreen;

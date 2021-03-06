import * as React from 'react';
import {EventRegister} from 'react-native-event-listeners';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
  TextInput,
  Picker,
  Alert,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import firebase from 'react-native-firebase';

class CreateEmployeeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        name: '',
        email: '',
        phoneNumber: '',
        team: 'team3',
        id: 'a',
        role: 'user',
      },
      itemPosition: 0,
      teams: [],
      existedUsers: [],
      loading: false,
    };
  }

  createEmp = async () => {
    if (
      this.state.info.name === '' ||
      this.state.info.email === '' ||
      this.state.info.phoneNumber === ''
    ) {
      Alert.alert(
        'Missing value in field(s)',
        'Please fill all of the provided fields.',
        [
          {
            text: 'OK',
            onPress: () => {
              return;
            },
          },
        ],
        {cancelable: false},
      );
      return;
    }

    for (const user of this.state.existedUsers) {
      if (user.email === this.state.info.email) {
        Alert.alert(
          'Duplicate Email',
          `The email \"${
            this.state.info.email
          }\" has been used. Please try another email`,
          [
            {
              text: 'OK',
              onPress: () => {
                return;
              },
            },
          ],
          {cancelable: false},
        );
        return;
      }
    }

    try {
      this.setState({loading: true});
      const ref = firebase.database().ref(`users/${this.state.info.id}`);
      await ref.set(this.state.info);
      const position = this.state.teams[this.state.itemPosition].teamMembers
        .length;
      const ref1 = firebase
        .database()
        .ref(`team/${this.state.info.team}/teamMembers/${position}`);
      await ref1.set(this.state.info.id);
      this.setState({loading: false});
      this.props.navigation.navigate('AdminEmployeeList', {
        navigation: this.props.navigation,
      });
      ToastAndroid.show(`Create employee successfully.`, ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(`Create employee error, ${error}`, ToastAndroid.SHORT);
    }
  };

  componentDidMount = async () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.goBack();
      return true;
    });
    try {
      this.setState({loading: true});
      const ref = firebase.database().ref(`/team`);
      const snapshot = await ref.once('value');
      const teams = snapshot.val();
      if (teams instanceof Object) {
        const keys = Object.keys(teams);
        const values = Object.values(teams);
        var results = [];
        var team = {};
        for (let i = 0; i < keys.length; i++) {
          team.id = keys[i];
          team.name = values[i].name;
          team.teamMembers = values[i].teamMembers;
          results.push(team);
          team = {};
        }
        this.setState({teams: results});
      }
      const ref1 = firebase.database().ref(`/users`);
      const snapshot1 = await ref1.once('value');
      const users = snapshot1.val();
      if (users instanceof Object) {
        const values = Object.values(users);
        this.setState({existedUsers: values});
      }

      this.setState({loading: false});
    } catch (error) {
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  componentWillUnmount = () => {
    EventRegister.emit('myCustomEvent');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          size="large"
          style={styles.loading}
          color="#3d66cf"
        />
        <Text style={styles.title}>Create New Employee</Text>
        <Text style={styles.label}>Employee Name</Text>
        <TextInput
          style={{borderBottomWidth: 1}}
          onChangeText={text => {
            this.setState({
              info: {
                name: text,
                email: this.state.info.email,
                phoneNumber: this.state.info.phoneNumber,
                team: this.state.info.team,
                id: 'a',
                role: 'user',
              },
            });
          }}
          value={this.state.info.name}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={{borderBottomWidth: 1}}
          onChangeText={text => {
            this.setState({
              info: {
                name: this.state.info.name,
                email: text,
                phoneNumber: this.state.info.phoneNumber,
                team: this.state.info.team,
                id: 'a',
                role: 'user',
              },
            });
          }}
          value={this.state.info.email}
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          keyboardType="number-pad"
          maxLength={10}
          style={{borderBottomWidth: 1}}
          onChangeText={text => {
            this.setState({
              info: {
                name: this.state.info.name,
                email: this.state.info.email,
                phoneNumber: text,
                team: this.state.info.team,
                id: 'a',
                role: 'user',
              },
            });
          }}
          value={this.state.info.phoneNumber}
        />
        <Text style={styles.label}>Team</Text>
        <View style={styles.dropdown}>
          <Picker
            mode="dropdown"
            selectedValue={this.state.info.team}
            onValueChange={(itemValue, ItemPosition) =>
              this.setState({
                info: {
                  name: this.state.info.name,
                  email: this.state.info.email,
                  phoneNumber: this.state.info.phoneNumber,
                  team: itemValue,
                  id: 'a',
                  role: 'user',
                },
                itemPosition: ItemPosition,
              })
            }>
            {this.state.teams.map((team, index) => {
              return (
                <Picker.Item label={team.name} value={team.id} key={index} />
              );
            })}
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.btnCreate}
          onPress={() => this.createEmp()}>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>
            Create Employee
          </Text>
        </TouchableOpacity>
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
    fontSize: 25,
    fontWeight: 'bold',
  },
  btnCreate: {
    backgroundColor: '#475397',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  label: {
    marginTop: 8,
  },
  dropdown: {
    borderRadius: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#dfdfdf',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default CreateEmployeeScreen;

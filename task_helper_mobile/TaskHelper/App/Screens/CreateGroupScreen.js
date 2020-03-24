import * as React from 'react';
import {
  StyleSheet,
  ScrollView,
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

class CreateGroupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        name: '',
        email: '',
        phoneNumber: '',
        team: '',
        id: 'a',
        role: 'manager',
      },
      team: {id: '', name: '', teamMembers: []},
      existedIds: [],
      loading: false,
    };
  }

  createTeam = async () => {
    if (
      this.state.info.name === '' ||
      this.state.info.email === '' ||
      this.state.info.phoneNumber === '' ||
      this.state.team.id === '' ||
      this.state.team.name === ''
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
    this.state.existedIds.forEach(element => {
      if (element === this.state.team.id) {
        Alert.alert(
          'Duplicate ID',
          `Team ID ${this.state.team.id} is existed. Please try another ID.`,
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
    });
    console.log('cant catch');
    // } else {
    //   try {
    //     this.setState({loading: true});
    //     const ref = firebase.database().ref(`users/${this.state.info.id}`);
    //     await ref.set(this.state.info);
    //     const position = this.state.teams[this.state.itemPosition].teamMembers
    //       .length;
    //     const ref1 = firebase
    //       .database()
    //       .ref(`team/${this.state.info.team}/teamMembers/${position}`);
    //     await ref1.set(this.state.info.id);
    //     this.setState({loading: false});
    //     this.props.navigation.navigate('AdminEmployeeList', {
    //       navigation: this.props.navigation,
    //     });
    //     ToastAndroid.show(`Create employee successfully.`, ToastAndroid.SHORT);
    //   } catch (error) {
    //     ToastAndroid.show(
    //       `Create employee error, ${error}`,
    //       ToastAndroid.SHORT,
    //     );
    //   }
    // }
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
        // const values = Object.values(teams);
        // var results = [];
        // var team = {};
        // for (let i = 0; i < keys.length; i++) {
        //   team.id = keys[i];
        //       team.name = values[i].name;
        //       team.teamMembers = values[i].teamMembers;
        //       results.push(team);
        //       team = {};
        // }
        this.setState({existedIds: keys});
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

  render() {
    return (
      <ScrollView style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          size="large"
          style={styles.loading}
          color="#3d66cf"
        />
        <Text style={styles.title}>Create New Team</Text>
        <Text style={styles.label}>Team ID (Unique)</Text>
        <TextInput
          style={{borderBottomWidth: 1}}
          onChangeText={text => {
            this.setState({
              team: {
                id: text,
                name: this.state.team.name,
                teamMembers: this.state.team.teamMembers,
              },
            });
          }}
          value={this.state.teamName}
        />
        <Text style={styles.label}>Team Name</Text>
        <TextInput
          style={{borderBottomWidth: 1}}
          onChangeText={text => {
            this.setState({
              team: {
                id: this.state.team.id,
                name: text,
                teamMembers: this.state.team.teamMembers,
              },
            });
          }}
          value={this.state.teamName}
        />
        <Text style={styles.title}>Team's Manager</Text>
        <Text style={styles.label}>Manager Name</Text>
        <TextInput
          style={{borderBottomWidth: 1}}
          onChangeText={text => {
            this.setState({
              info: {
                name: text,
                email: this.state.info.email,
                phoneNumber: this.state.info.phoneNumber,
                team: this.state.team.id,
                id: 'a',
                role: 'manager',
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
                team: this.state.team.id,
                id: 'a',
                role: 'manager',
              },
            });
          }}
          value={this.state.info.email}
        />
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={{borderBottomWidth: 1}}
          onChangeText={text => {
            this.setState({
              info: {
                name: this.state.info.name,
                email: this.state.info.email,
                phoneNumber: text,
                team: this.state.team.id,
                id: 'a',
                role: 'user',
              },
            });
          }}
          value={this.state.info.phoneNumber}
        />
        <TouchableOpacity
          style={styles.btnCreate}
          onPress={() => this.createTeam()}>
          <Text style={{fontWeight: 'bold', color: 'white', fontSize: 18}}>
            Create Team
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});

export default CreateGroupScreen;

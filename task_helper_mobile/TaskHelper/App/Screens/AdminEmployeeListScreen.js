import * as React from 'react';
import {EventRegister} from 'react-native-event-listeners';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {Accordion} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import firebase from 'react-native-firebase';

class AdminEmployeeListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      loading: false,
    };
  }

  mapTeamName = teams => {
    if (teams instanceof Object) {
      const nameArray = [];
      const teamArray = Object.values(teams);
      teamArray.forEach(element => {
        nameArray.push(element.name);
      });
      return nameArray;
    }
  };

  callDb = async teamMembers => {
    var newTeamMembers = [];
    for (const mem of teamMembers) {
      let ref1 = firebase.database().ref(`/users/${mem}`);
      let snapshot1 = await ref1.once('value');
      let memberInfo = snapshot1.val();
      newTeamMembers.push(memberInfo);
    }
    return newTeamMembers;
  };

  mapTeamMembers = async teams => {
    if (teams instanceof Object) {
      const teamArray = Object.values(teams);
      var sth = [];
      for (const team of teamArray) {
        let arr = await this.callDb(team.teamMembers);
        sth.push(arr);
      }
      return sth;
    }
  };

  componentDidMount = async () => {
    try {
      this.setState({loading: true});
      const ref = firebase.database().ref(`/team`);
      const snapshot = await ref.once('value');
      const teams = snapshot.val();
      const teamNames = this.mapTeamName(teams);
      const abc = await this.mapTeamMembers(teams);
      var newTeams = [];
      for (let i = 0; i < teamNames.length; i++) {
        newTeams.push({title: teamNames[i], content: abc[i]});
      }
      this.setState({
        teams: newTeams,
        loading: false,
      });
    } catch (error) {
      console.log('error', error);
      this.props.navigation.navigate('Login');
      ToastAndroid.show(
        `Please login to continue using our app, ${error}`,
        ToastAndroid.SHORT,
      );
    }
  };

  componentWillMount = () => {
    this.listener = EventRegister.addEventListener(
      'myCustomEvent',
      async () => {
        try {
          this.setState({loading: true});
          const ref = firebase.database().ref(`/team`);
          const snapshot = await ref.once('value');
          const teams = snapshot.val();
          const teamNames = this.mapTeamName(teams);
          const abc = await this.mapTeamMembers(teams);
          var newTeams = [];
          for (let i = 0; i < teamNames.length; i++) {
            newTeams.push({title: teamNames[i], content: abc[i]});
          }
          this.setState({
            teams: newTeams,
            loading: false,
          });
        } catch (error) {
          console.log('error', error);
          this.props.navigation.navigate('Login');
          ToastAndroid.show(
            `Please login to continue using our app, ${error}`,
            ToastAndroid.SHORT,
          );
        }
      },
    );
  };

  _renderHeader = (item, expanded) => {
    return (
      <View style={styles.empHeader}>
        <Text style={{fontWeight: '600'}}> {item.title}</Text>
        {expanded ? (
          <FontAwesome style={{fontSize: 18}} name="angle-down" />
        ) : (
          <FontAwesome style={{fontSize: 18}} name="angle-up" />
        )}
      </View>
    );
  };

  _renderContent = item => {
    const cards = JSON.parse(JSON.stringify(item.content));
    return (
      <>
        {cards instanceof Array &&
          cards.map((card, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={styles.empCard}
                onPress={() => {
                  this.props.navigation.navigate('EmployeeProfile', {
                    navigation: this.props.navigation,
                    id: card.id,
                  });
                }}>
                <FontAwesome
                  name="user-circle"
                  style={{fontSize: 35, marginRight: 12}}
                  color="#657283"
                />
                <View>
                  <Text style={{fontWeight: 'bold', fontSize: 18}}>
                    {card.name}
                  </Text>
                  <Text style={{color: '#4f5e71', marginBottom: 4}}>
                    {card.role === 'user' ? 'User' : 'Manager'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
      </>
    );
  };

  render = () => {
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <ActivityIndicator
          animating={this.state.loading}
          size="large"
          style={styles.loading}
          color="#3d66cf"
        />
        <View style={styles.header}>
          <Text style={styles.title}>Employee List</Text>
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
        <Accordion
          dataArray={this.state.teams}
          animation={true}
          expanded={true}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
        />

        <TouchableOpacity
          style={styles.btnNew}
          onPress={() =>
            navigation.navigate('CreateEmployee', {navigation: navigation})
          }>
          <View>
            <FontAwesome5
              name="user-plus"
              style={{fontSize: 20, color: 'white'}}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnNewGroup}
          onPress={() =>
            navigation.navigate('CreateGroup', {navigation: navigation})
          }>
          <View>
            <FontAwesome5
              name="user-friends"
              style={{fontSize: 20, color: 'white'}}
            />
          </View>
        </TouchableOpacity>
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
  empHeader: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#d2eef7',
  },
  empCard: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9eaed',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
  btnNew: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#475397',
  },
  btnNewGroup: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#475397',
  },
});

export default AdminEmployeeListScreen;

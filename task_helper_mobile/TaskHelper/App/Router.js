import * as React from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LoginScreen from './screens/LoginScreen';
import TasksScreen from './screens/TasksScreen';
import EmployeeListScreen from './screens/EmployeeListScreen';
import ProfileScreen from './screens/ProfileScreen';

const TaskStack = createStackNavigator(
  {
    Overview: {screen: TasksScreen, navigationOptions: {headerShown: false}},
    // TaskDetail: {screen: TaskDetail, navigationOptions: {headerShown: false}},
    // CreateTask: {screen: CreateTask, navigationOptions: {headerShown: false}},
  },
  {initialRouteName: 'Overview'},
);

const SecondTaskStack = createStackNavigator(
  {
    Overview: {screen: TasksScreen, navigationOptions: {headerShown: false}},
    // TaskDetail: {screen: TaskDetail, navigationOptions: {headerShown: false}},
    // CreateTask: {screen: CreateTask, navigationOptions: {headerShown: false}},
    // ScanQR: {screen: ScanQRScreen, navigationOptions: {headerShown: false}},
  },
  {initialRouteName: 'Overview'},
);

const EmployeeStack = createStackNavigator(
  {
    EmployeeList: {
      screen: EmployeeListScreen,
      navigationOptions: {headerShown: false},
    },
    // CreateEmployee: {screen: CreateEmployee, navigationOptions: {headerShown: false},
    // EditEmployee: {screen: EditEmployee, navigationOptions: {headerShown: false}},
    // CreateGroup: {screen: CreateGroup, navigationOptions: {headerShown: false}},
  },
  {initialRouteName: 'EmployeeList'},
);

const ProfileStack = createStackNavigator({
  Profile: {screen: ProfileScreen, navigationOptions: {headerShown: false}},
});

const UserTabNavigator = createBottomTabNavigator(
  {
    TaskTab: TaskStack,
    ProfileTab: ProfileStack,
  },
  {
    tabBarOptions: {
      activeBackgroundColor: '#5bb8ea',
      activeTintColor: 'white',
      inactiveBackgroundColor: 'white',
      inactiveTintColor: '#5bb8ea',
    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        let Icon = FontAwesome5;
        let iconName;
        routeName === 'TaskTab'
          ? (iconName = 'tasks')
          : (iconName = 'user-circle');

        return <Icon name={iconName} size={20} color={tintColor} solid />;
      },
      tabBarLabel: () => null,
    }),
    initialRouteName: 'TaskTab',
  },
);

const ManagerTabNavigator = createBottomTabNavigator(
  {
    TaskTab: SecondTaskStack,
    ProfileTab: ProfileStack,
  },
  {
    tabBarOptions: {
      activeBackgroundColor: 'white',
      activeTintColor: '#5bb8ea',
      inactiveBackgroundColor: '#5bb8ea',
      inactiveTintColor: 'white',
    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        let Icon = FontAwesome5;
        let iconName;
        routeName === 'TaskTab'
          ? (iconName = 'tasks')
          : (iconName = 'user-circle');

        return <Icon name={iconName} size={20} color={tintColor} solid />;
      },
      tabBarLabel: () => null,
    }),
    initialRouteName: 'TaskTab',
  },
);

const AdminTabNavigator = createBottomTabNavigator(
  {
    TaskTab: SecondTaskStack,
    EmployeeTab: EmployeeStack,
    ProfileTab: ProfileStack,
  },
  {
    tabBarOptions: {
      activeBackgroundColor: 'white',
      activeTintColor: '#5bb8ea',
      inactiveBackgroundColor: '#5bb8ea',
      inactiveTintColor: 'white',
    },
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        const {routeName} = navigation.state;
        let Icon = FontAwesome5;
        let iconName;
        routeName === 'TaskTab'
          ? (iconName = 'tasks')
          : routeName === 'EmployeeTab'
          ? (iconName = 'user-cog')
          : (iconName = 'user-circle');

        return <Icon name={iconName} size={20} color={tintColor} solid />;
      },
      tabBarLabel: () => null,
    }),
    initialRouteName: 'TaskTab',
  },
);

const RootStack = createStackNavigator(
  {
    Login: {screen: LoginScreen, navigationOptions: {headerShown: false}},
    UserHome: {
      screen: UserTabNavigator,
      navigationOptions: {headerShown: false},
    },
    ManagerHome: {
      screen: ManagerTabNavigator,
      navigationOptions: {headerShown: false},
    },
    AdminHome: {
      screen: AdminTabNavigator,
      navigationOptions: {headerShown: false},
    },
  },
  {initialRouteName: 'Login'},
);

let Navigation = createAppContainer(RootStack);

export default Navigation;

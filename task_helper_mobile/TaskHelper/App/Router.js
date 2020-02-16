import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';

const RootStack = createStackNavigator(
  {
    Login: {screen: LoginScreen, navigationOptions: {header: null}},
    Home: {screen: HomeScreen, navigationOptions: {header: null}},
  },
  {initialRouteName: 'Login'},
);

let Navigation = createAppContainer(RootStack);

export default Navigation;

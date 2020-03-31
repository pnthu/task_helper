import * as React from 'react';
import {Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Navigation from './Router';
import firebase from 'react-native-firebase';

class App extends React.Component {
  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };

  // messageListener = async () => {
  //   this.notificationListener = firebase
  //     .notifications()
  //     .onNotification(notification => {
  //       const {title, body} = notification;
  //       this.showAlert(title, body);
  //     });

  //   this.notificationOpenedListener = firebase
  //     .notifications()
  //     .onNotificationOpened(notificationOpen => {
  //       const {title, body} = notificationOpen.notification;
  //       this.showAlert(title, body);
  //     });

  //   const notificationOpen = await firebase
  //     .notifications()
  //     .getInitialNotification();
  //   if (notificationOpen) {
  //     const {title, body} = notificationOpen.notification;
  //     this.showAlert(title, body);
  //   }

  //   this.messageListener = firebase.messaging().onMessage(message => {
  //     console.log(JSON.stringify(message));
  //   });
  // };

  componentDidMount = async () => {
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const channel = new firebase.notifications.Android.Channel(
          'channelId',
          'channelId',
          firebase.notifications.Android.Importance.Max,
        ).setDescription('channelId');
        firebase.notifications().android.createChannel(channel);
        const notif = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setBody(notification.body)
          .setData(notification.data);
        notif.android
          .setChannelId('channelId')
          // .android.setSmallIcon(‘ic_stat_output_onlinepngtools’)
          .android.setPriority(firebase.notifications.Android.Priority.Max)
          // .android.setColor()
          .android.setBadgeIconType(
            firebase.notifications.Android.BadgeIconType.Large,
          );
        firebase.notifications().displayNotification(notif);
      });

    firebase
      .notifications()
      .getInitialNotification()
      .then(notificationOpen => {
        if (notificationOpen) {
          const notif = notificationOpen.notification;
          // const routeKey = get(notif, 'data.routeKey');
          // const id = get(notif, 'data.id');
          // if (routeKey) {
          //   setTimeout(() => {
          //     appModel.navigation.pushToScreen(ROUTE_KEY[routeKey], {
          //       item: {_id: id},
          //     });
          //   }, 500);
          // }
        }
      });
  };

  componentWillUnmount = () => {
    this.removeNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const channel = new firebase.notifications.Android.Channel(
          'channelId',
          'channelId',
          firebase.notifications.Android.Importance.Max,
        ).setDescription('channelId');
        firebase.notifications().android.createChannel(channel);
        const notif = new firebase.notifications.Notification()
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setBody(notification.body)
          .setData(notification.data);
        notif.android
          .setChannelId('channelId')
          // .android.setSmallIcon(‘ic_stat_output_onlinepngtools’)
          .android.setPriority(firebase.notifications.Android.Priority.Max)
          // .android.setColor()
          .android.setBadgeIconType(
            firebase.notifications.Android.BadgeIconType.Large,
          );
        firebase.notifications().displayNotification(notif);
      });
  };

  render() {
    return (
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    );
  }
}

export default App;

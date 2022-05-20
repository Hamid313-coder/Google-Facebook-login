import React, {useEffect, useState} from 'react';
import {Button, SafeAreaView, Text, View} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
function App(props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const sign = await GoogleSignin.signIn();
      console.log(sign.user);
      const credential = auth.GoogleAuthProvider.credential(
        sign.idToken,
        sign.accessToken,
      );
      await auth().signInWithCredential(credential);
      alert(`Hi, ${sign.user.name}`);
      setLoggedIn(true);
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('Cancelled!');
      } else if (err.code === statusCodes.IN_PROGRESS) {
        alert('Signin in progress!');
      } else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play Services not available!');
      } else {
        alert(err);
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setLoggedIn(false);
      setUserInfo([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      offlineAccess: true,
      webClientId:
        '500354891175-fqmkld9ttpuau9aqcgg4pdpuep09t38q.apps.googleusercontent.com',
    });
  }, []);

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View>
          <GoogleSigninButton
            style={{width: 230, height: 50}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={_signIn}
          />
        </View>
        <View>
          {!loggedIn && <Text>You are currently logged out</Text>}
          {loggedIn && (
            <Button onPress={signOut} title="LogOut" color="red"></Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;

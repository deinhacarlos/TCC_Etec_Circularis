import React from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import HomeScreen from './screens/HomeScreen';

const fetchFonts = () => {
  return Font.loadAsync({
    'Caprasimo': require('./assets/fonts/Caprasimo-Regular.ttf'),
    'WorkSans': require('./assets/fonts/WorkSans-Regular.ttf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  if (!fontsLoaded) {
    return <AppLoading startAsync={fetchFonts} onFinish={() => setFontsLoaded(true)} onError={console.warn} />;
  }

  return (
    <>
      <HomeScreen />
      <StatusBar style="auto" />
    </>
  );
}

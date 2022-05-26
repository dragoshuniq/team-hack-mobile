import * as React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {SCREENS} from 'constants/screens/screen.names';
import {COLORS} from 'theme/theme';
import LottieView from 'lottie-react-native';

export default function OnboardingScreen(props) {
  const {navigation} = props;

  const onFinishOnboarding = () => {
    navigation.navigate(SCREENS.SIGN_IN);
  };

  return (
    <Onboarding
      nextLabel="Continuă"
      skipLabel="Sari"
      pages={[
        {
          backgroundColor: '#ffffff',
          image: (
            <LottieView
              style={{height: 250}}
              autoPlay
              loop
              source={require('assets/lottie/loading.json')}
            />
          ),
          title: 'App title',
          subtitle: 'Bine ati venit!',
        },
        {
          backgroundColor: COLORS.YELLOW,
          image: (
            <LottieView
              style={{height: 250}}
              autoPlay
              loop
              source={require('assets/lottie/loading.json')}
            />
          ),
          title: 'Title 1',
          subtitle: 'Subtitle 1',
        },
        {
          backgroundColor: COLORS.ORANGE,
          image: (
            <LottieView
              style={{height: 250}}
              autoPlay
              loop
              source={require('assets/lottie/loading.json')}
            />
          ),
          title: 'Title 2',
          subtitle: 'Title2 ',
        },
      ]}
      onDone={onFinishOnboarding}
      onSkip={onFinishOnboarding}
    />
  );
}

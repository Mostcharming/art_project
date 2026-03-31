import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useTVNavigation } from '../navigation/TVNavigationContext';
import useTVRemote from '../useTVRemote';

const CARDS = [
  // 1 — Far left (partially off-screen)
  {
    src: 'https://joincarsl.com/api/uploads/artworks/7.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#1a0a2e]',
    pos: 'left-[-10%] top-[30%] w-[17.7%] h-[30%]',
    partial: true,
  },
  // 2 — Left medium
  {
    src: 'https://joincarsl.com/api/uploads/artworks/6.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#1a237e]',
    pos: 'left-[6.1%] top-[20%] w-[17.7%] h-[40%]',
    partial: false,
  },
  // 3 — Left tall
  {
    src: 'https://joincarsl.com/api/uploads/artworks/5.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#111111]',
    pos: 'left-[22.2%] top-[8%] w-[17.7%] h-[52%]',
    partial: false,
  },
  // 4 — CENTER (tallest, no overflow)
  {
    src: 'https://joincarsl.com/api/uploads/artworks/1.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#6b1a1a]',
    pos: 'left-[38.3%] top-[0%] w-[23.4%] h-[60%]',
    partial: false,
    isCenter: true,
  },
  // 5 — Right tall
  {
    src: 'https://joincarsl.com/api/uploads/artworks/2.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#7a2800]',
    pos: 'left-[60.1%] top-[8%] w-[17.7%] h-[52%]',
    partial: false,
  },
  // 6 — Right medium
  {
    src: 'https://joincarsl.com/api/uploads/artworks/3.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#d4d0c8]',
    pos: 'left-[76.2%] top-[20%] w-[17.7%] h-[40%]',
    partial: false,
  },
  // 7 — Far right (partially off-screen)
  {
    src: 'https://joincarsl.com/api/uploads/artworks/4.png',
    alt: 'Carsl',
    title: 'Carsl',
    artist: 'Carsl',
    bg: 'bg-[#5a2d00]',
    pos: 'left-[92.3%] top-[30%] w-[17.7%] h-[30%]',
    partial: true,
  },
];

function CarslLogo() {
  return (
    <svg
      width="93"
      height="20"
      viewBox="0 0 93 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M78.6401 5.74252C78.6485 11.4626 78.6485 11.4878 78.7074 11.7544C78.9487 12.8484 79.5181 13.5161 80.4691 13.8247C81.1424 14.0463 82.0205 14.0547 82.7218 13.8527C82.8368 13.8191 82.935 13.7742 82.9435 13.7546C82.9519 13.7349 82.9378 13.4123 82.9126 13.0392C82.8873 12.6633 82.8677 12.3435 82.8677 12.3238C82.8677 12.3042 82.7976 12.3154 82.6713 12.3603C82.3684 12.4613 82.0205 12.4978 81.7147 12.4585C81.1565 12.3856 80.8198 12.1527 80.6094 11.6898C80.4495 11.342 80.4551 11.586 80.4551 5.55176V-2.93071e-07H79.5434H78.6288L78.6401 5.74252Z"
        fill="white"
      />
      <path
        d="M4.68348 3.88806C4.64421 3.89367 4.50114 3.91331 4.36087 3.93014C3.7998 4.00028 3.14336 4.20226 2.62998 4.46596C1.29464 5.14766 0.41657 6.31748 0.0939567 7.83797C-0.00423006 8.29805 -0.0294781 9.19295 0.03785 9.67827C0.200559 10.8341 0.635386 11.7234 1.42649 12.5117C1.82204 12.9072 2.11099 13.126 2.55143 13.3617C3.64551 13.9508 5.15198 14.1528 6.42279 13.8807C7.39624 13.6731 8.27151 13.1737 8.82977 12.5032C9.05139 12.2395 9.28704 11.8945 9.27021 11.8636C9.26179 11.8524 9.02053 11.6953 8.72878 11.513C8.43983 11.3306 8.13966 11.1399 8.0583 11.0894L7.91523 10.9996L7.7946 11.1595C7.3205 11.7907 6.70613 12.1834 5.94027 12.3461C5.56436 12.4275 4.90791 12.4331 4.52919 12.3602C3.81103 12.2227 3.21068 11.9113 2.75341 11.4344C2.48691 11.1567 2.32981 10.9323 2.1699 10.5928C1.93706 10.0963 1.82204 9.55764 1.82204 8.93767C1.82204 7.15628 2.81794 5.86863 4.46747 5.52357C4.86583 5.43941 5.53631 5.43661 5.91783 5.51796C6.67247 5.68067 7.30367 6.07342 7.75533 6.65973L7.91523 6.87013L8.01622 6.80561C8.20418 6.68779 9.18324 6.05378 9.23654 6.01731C9.28423 5.98365 9.27582 5.96401 9.11311 5.71995C8.87746 5.36647 8.40336 4.89237 8.03305 4.64831C7.4243 4.24434 6.6921 3.98905 5.88417 3.90209C5.63169 3.87404 4.84619 3.86562 4.68348 3.88806Z"
        fill="white"
      />
      <path
        d="M24.2229 3.90502C23.4374 3.99198 22.6183 4.28935 21.973 4.71576C21.5663 4.98788 21.0108 5.54053 20.7527 5.93327C20.1776 6.80573 19.8887 7.79602 19.8887 8.91534C19.8887 11.2466 21.1511 13.0869 23.199 13.7405C23.8246 13.9397 24.3688 14.0126 25.0785 13.9902C26.3129 13.9537 27.3144 13.5441 28.0662 12.7615C28.1925 12.6324 28.3271 12.4809 28.3692 12.4276L28.4449 12.3294V13.1065V13.8864H29.3146H30.1843L30.1786 8.92657L30.1702 3.96954L29.2669 3.96112L28.3608 3.95551V4.6849V5.41429L28.0466 5.09728C27.4827 4.53341 26.8964 4.20799 26.0632 3.99759C25.6059 3.88257 24.7868 3.84049 24.2229 3.90502ZM25.6621 5.49845C26.8655 5.69482 27.8362 6.53642 28.2037 7.70905C28.501 8.66006 28.4197 9.82427 27.9933 10.6687C27.5977 11.4458 26.8964 12.0349 26.0716 12.2733C25.7041 12.3799 25.4685 12.4108 25.0365 12.4108C24.3043 12.408 23.6843 12.2256 23.1204 11.8413C22.4556 11.3925 21.973 10.6322 21.7963 9.75975C21.642 9.00231 21.7178 8.09619 21.9927 7.43413C22.5201 6.1577 23.7432 5.40026 25.1795 5.45917C25.3507 5.46759 25.5667 5.48442 25.6621 5.49845Z"
        fill="white"
      />
      <path
        d="M47.5492 3.90225C46.789 3.98922 46.1045 4.22487 45.5995 4.57553C45.347 4.74947 44.9851 5.11696 44.8028 5.38347L44.6597 5.59387V4.77471V3.95556H43.7901H42.9204V8.921V13.8864H43.8321H44.7411L44.7523 11.0727C44.7607 8.34871 44.7635 8.25333 44.8196 7.99524C45.1002 6.72442 45.8155 5.96417 46.9881 5.68925C47.1593 5.64998 47.3753 5.63034 47.754 5.61912L48.2786 5.60229V4.73824V3.8714L48.0205 3.8742C47.8774 3.87701 47.6642 3.88823 47.5492 3.90225Z"
        fill="white"
      />
      <path
        d="M62.2769 3.91341C61.1996 4.04245 60.372 4.39031 59.7801 4.95699C59.407 5.31327 59.1573 5.74248 59.0311 6.24464C58.9638 6.51395 58.9638 7.23212 59.0311 7.50143C59.2667 8.44963 59.8895 9.02192 61.079 9.381C61.4717 9.50163 61.8925 9.5886 62.6696 9.72045C63.0006 9.77656 63.4271 9.8523 63.615 9.88877C64.8522 10.1384 65.3263 10.548 65.2225 11.283C65.1411 11.8497 64.7259 12.1891 63.904 12.3603C63.5701 12.4276 62.5434 12.4444 62.1085 12.3883C61.194 12.2677 60.2963 11.9675 59.6427 11.5607C59.5136 11.4822 59.4042 11.4205 59.3986 11.4261C59.3537 11.471 58.6608 12.8288 58.672 12.8512C58.7281 12.9382 59.2247 13.2243 59.6202 13.3926C60.9331 13.9537 62.6864 14.1445 64.134 13.8836C65.1916 13.6928 66.0613 13.2271 66.5382 12.5959C66.7373 12.3322 66.8468 12.1134 66.9506 11.7683C67.0207 11.5355 67.0291 11.4794 67.0291 11.053C67.0263 10.6658 67.0179 10.5536 66.9674 10.3657C66.7317 9.50724 66.1707 8.99106 65.085 8.63759C64.6446 8.49452 64.3416 8.42719 63.2868 8.23362C62.3442 8.0625 61.9767 7.97553 61.6569 7.8521C61.2557 7.6978 60.964 7.45935 60.8349 7.18443C60.7872 7.08063 60.776 7.00208 60.776 6.77485C60.776 6.51395 60.7816 6.48029 60.8686 6.30636C61.1491 5.73407 61.9486 5.41426 63.1016 5.41426C64.1116 5.41426 65.1299 5.68077 65.8481 6.13523C65.907 6.1717 65.9603 6.19975 65.9631 6.19414C65.9687 6.18853 66.1426 5.86592 66.3502 5.47878L66.7317 4.76903L66.5746 4.67365C66.137 4.40995 65.3431 4.14064 64.5772 4.00037C63.9124 3.87694 62.8968 3.83766 62.2769 3.91341Z"
        fill="white"
      />
      <path
        d="M89.9092 8.83963C89.3397 8.89293 88.8375 9.12577 88.4139 9.53535C88.0773 9.85796 87.8697 10.1974 87.7294 10.6519C87.6621 10.8763 87.6537 10.9408 87.6537 11.3476C87.6537 11.7544 87.6621 11.8189 87.7294 12.0433C87.9539 12.7727 88.4392 13.3422 89.1068 13.648C89.7493 13.9481 90.5712 13.9481 91.2109 13.6508C91.9458 13.3113 92.4733 12.6549 92.6332 11.8806C92.8099 11.0222 92.5574 10.1722 91.9402 9.55779C91.4072 9.02478 90.6778 8.76669 89.9092 8.83963Z"
        fill="#D8522E"
      />
    </svg>
  );
}

const BUTTONS = [
  {
    id: 'guest',
    label: 'Continue as guest',
    bgColor: 'bg-[#D8522E]',
    textColor: 'text-white',
    borderColor: 'border-[#D8522E]',
  },
  {
    id: 'signin',
    label: 'Sign up',
    bgColor: 'bg-transparent',
    textColor: 'text-[#D8522E]',
    borderColor: 'border-[#D8522E]',
  },
];

export default function Home2Screen() {
  const { navigate } = useTVNavigation();
  const [selectedButtonId, setSelectedButtonId] = useState('guest');
  const [focusedElement, setFocusedElement] = useState<'buttons' | 'signin'>(
    'buttons',
  );

  useTVRemote({
    onEnter: () => {
      if (focusedElement === 'buttons') {
        if (selectedButtonId === 'guest') {
          navigate('Guest');
        } else if (selectedButtonId === 'signin') {
          navigate('SignUp');
        }
      } else if (focusedElement === 'signin') {
        navigate('SignIn');
      }
    },
    onUp: () => {
      if (focusedElement === 'signin') {
        setFocusedElement('buttons');
      }
    },
    onDown: () => {
      if (focusedElement === 'buttons') {
        setFocusedElement('signin');
      }
    },
    onLeft: () => {
      if (focusedElement === 'buttons') {
        setSelectedButtonId('guest');
      }
    },
    onRight: () => {
      if (focusedElement === 'buttons') {
        setSelectedButtonId('signin');
      }
    },
  });

  return (
    <View>
      {/* Header with logo */}
      <View className="pt-8 pb-6 items-center">
        <CarslLogo />
      </View>

      {/* Main content – centered */}
      <View
        className="justify-center items-center px-6"
        style={{ height: 'auto' }}
      >
        <View className="items-center gap-6 w-full">
          {/* Tagline */}
          <Text
            className="text-white text-center text-3xl font-bold leading-tight"
            numberOfLines={3}
            style={{ fontFamily: 'BankGothicBold' }}
          >
            The Home of Contemporary Masterpieces
          </Text>

          {/* CTA buttons */}
          <View className="gap-6 w-full items-center mt-8">
            <View className="flex-row gap-4 justify-center flex-wrap">
              {BUTTONS.map(button => {
                const isFocused = selectedButtonId === button.id;
                return (
                  <Pressable
                    key={button.id}
                    onPress={() => setSelectedButtonId(button.id)}
                    className={[
                      'h-12 rounded-full items-center justify-center px-6',
                      button.id === 'guest'
                        ? button.bgColor
                        : `${button.bgColor} border-2 ${button.borderColor}`,
                      isFocused ? 'border-2 border-white' : '',
                    ].join(' ')}
                    style={{
                      transform: isFocused ? [{ scale: 1.05 }] : [{ scale: 1 }],
                    }}
                  >
                    <Text
                      className={`font-semibold text-base ${button.textColor}`}
                      numberOfLines={1}
                    >
                      {button.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Sign in link */}
            <Pressable
              onPress={() => {
                setFocusedElement('signin');
              }}
              className={[
                'mt-4 mb-10 px-3 py-1 rounded',
                focusedElement === 'signin'
                  ? 'bg-[#D8522E]/20 ring-2 ring-[#D8522E]'
                  : '',
              ].join(' ')}
              style={{
                transform:
                  focusedElement === 'signin'
                    ? [{ scale: 1.05 }]
                    : [{ scale: 1 }],
              }}
            >
              <Text className="text-center text-[#D2D6DB] text-base">
                Already have an account?{' '}
                <Text className="text-[#D8522E] font-semibold">Sign in</Text>
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
      <View className="relative flex-1">
        <View className="w-full h-[90vh] overflow-hidden">
          {/* Cards */}
          {CARDS.map((card, index) => {
            const isFocused = !card.partial && index === 7;

            return (
              <View
                key={card.src}
                className={[
                  'absolute overflow-hidden rounded-xl',
                  card.bg,
                  card.pos,
                  isFocused
                    ? 'scale-[1.05] z-30 ring-4 ring-white/80 shadow-2xl'
                    : card.isCenter
                    ? 'z-10'
                    : 'z-0',
                ].join(' ')}
              >
                <Image
                  source={{ uri: card.src }}
                  className="w-full h-full"
                  style={{
                    resizeMode: 'cover',
                    transform: isFocused ? [{ scale: 1.05 }] : undefined,
                  }}
                />
              </View>
            );
          })}
        </View>
        <View
          className="absolute left-0 right-0 items-center z-50"
          style={{ top: '55%' }}
        >
          <View className="bg-black/80 rounded-full px-4 py-2">
            <Text className="text-white text-sm font-medium text-center">
              ⇅ Navigate | ←→ Scroll | Enter to select
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

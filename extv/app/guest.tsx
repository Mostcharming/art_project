import SignInModal from "@/components/SignInModal";
import { useTVNavigation } from "@/contexts/TVNavigationContext";
import { useTVRemote } from "@/hooks/useTVRemote";
import { useHomeStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

interface ContentItem {
  id: string;
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  tag?: string;
  bg: string;
}

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  accent?: boolean;
  onCardSelect?: (id: string) => void;
  selectedCardId?: string;
  onCardPress?: () => void;
}

function ContentRow({
  title,
  items,
  accent,
  onCardSelect,
  selectedCardId,
  onCardPress,
}: ContentRowProps) {
  const rowRef = useRef<ScrollView>(null);

  return (
    <View className="px-10 py-8">
      <View className="mb-6">
        <View className="flex flex-row items-center gap-3">
          {accent && (
            <View className="w-1 h-5 rounded-full bg-[hsl(25,95%,53%)]" />
          )}
          <Text className="text-white text-lg font-semibold tracking-wide">
            {title}
          </Text>
        </View>
      </View>

      <View className="relative">
        <ScrollView
          ref={rowRef}
          horizontal
          className="flex gap-3 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
        >
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                onCardSelect?.(item.id);
                onCardPress?.();
              }}
              className={`flex-none w-[14vw] ml-10 min-w-[160px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group/card relative transition-all duration-200 ${
                selectedCardId === item.id
                  ? "ring-2 ring-orange-500 scale-105"
                  : ""
              }`}
            >
              <View className={`absolute inset-0 ${item.bg}`} />

              <ImageBackground
                source={{ uri: item.src }}
                className="absolute inset-0 w-full h-full"
              />

              {item.tag && (
                <View className="absolute top-2 left-2 bg-[hsl(25,95%,53%)] rounded-full z-10 px-2 py-0.5">
                  <Text className="text-black text-[0.6rem] font-bold uppercase tracking-wider">
                    {item.tag}
                  </Text>
                </View>
              )}

              <View className="absolute inset-0  flex flex-col justify-end z-10">
                <View className="absolute inset-0  rounded-xl" />
                <View className="relative z-20 bg-black/70 backdrop-blur-sm px-2 py-1.5">
                  <Text
                    className="text-white text-xs font-semibold leading-tight line-clamp-1"
                    style={{ fontFamily: "BankGothicBold" }}
                  >
                    {item.title}
                  </Text>
                  <Text className="text-white/50 text-[0.65rem] leading-tight mt-0.5 line-clamp-1">
                    {item.subtitle}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

function LogoSVG() {
  return (
    <Svg width="133" height="20" viewBox="0 0 133 20" fill="none">
      <Path
        d="M112.344 8.20364C112.356 16.3752 112.356 16.4113 112.44 16.792C112.784 18.355 113.598 19.3088 114.957 19.7496C115.918 20.0662 117.173 20.0783 118.175 19.7897C118.339 19.7416 118.479 19.6775 118.491 19.6495C118.503 19.6214 118.483 19.1605 118.447 18.6275C118.411 18.0905 118.383 17.6336 118.383 17.6056C118.383 17.5775 118.283 17.5935 118.103 17.6577C117.67 17.8019 117.173 17.854 116.736 17.7979C115.938 17.6937 115.457 17.3611 115.157 16.6998C114.928 16.2029 114.936 16.5515 114.936 7.93112V2.12447e-08H113.634H112.327L112.344 8.20364Z"
        fill="white"
      />
      <Path
        d="M6.69055 5.55439C6.63444 5.5624 6.43005 5.59046 6.22967 5.6145C5.42814 5.71469 4.49035 6.00324 3.75696 6.37996C1.84932 7.35382 0.594928 9.025 0.13405 11.1971C-0.00621736 11.8544 -0.0422861 13.1328 0.0538972 13.8262C0.28634 15.4773 0.907524 16.7477 2.03768 17.8739C2.60276 18.4389 3.01554 18.7515 3.64474 19.0882C5.20772 19.9298 7.35982 20.2183 9.17528 19.8296C10.5659 19.533 11.8163 18.8197 12.6138 17.8618C12.9304 17.4851 13.2671 16.9922 13.243 16.9481C13.231 16.9321 12.8864 16.7076 12.4696 16.4472C12.0568 16.1867 11.628 15.9141 11.5117 15.842L11.3073 15.7138L11.135 15.9422C10.4577 16.8439 9.58005 17.405 8.48597 17.6374C7.94895 17.7536 7.01116 17.7617 6.47013 17.6575C5.44417 17.4611 4.58654 17.0162 3.93329 16.3349C3.55257 15.9382 3.32814 15.6176 3.0997 15.1326C2.76707 14.4233 2.60276 13.6538 2.60276 12.7681C2.60276 10.2233 4.02547 8.38378 6.38196 7.89084C6.95104 7.77061 7.90887 7.7666 8.45391 7.88283C9.53196 8.11527 10.4337 8.67634 11.0789 9.51394L11.3073 9.81451L11.4516 9.72233C11.7201 9.55401 13.1188 8.64829 13.1949 8.59619C13.2631 8.54809 13.2511 8.52004 13.0186 8.17138C12.682 7.66641 12.0047 6.98912 11.4757 6.64046C10.606 6.06336 9.56002 5.69866 8.40582 5.57443C8.04513 5.53435 6.92299 5.52233 6.69055 5.55439Z"
        fill="white"
      />
      <Path
        d="M34.6043 5.57858C33.4822 5.70282 32.3119 6.12763 31.3902 6.73679C30.8091 7.12553 30.0156 7.91504 29.6469 8.47611C28.8253 9.72248 28.4125 11.1372 28.4125 12.7362C28.4125 16.0666 30.216 18.6956 33.1415 19.6294C34.0352 19.9139 34.8127 20.0181 35.8266 19.986C37.59 19.9339 39.0207 19.3488 40.0948 18.2307C40.2751 18.0463 40.4675 17.8299 40.5276 17.7538L40.6358 17.6135V18.7236V19.8378H41.8782H43.1205L43.1125 12.7523L43.1005 5.67076L41.8101 5.65874L40.5156 5.65072V6.69271V7.73469L40.0667 7.28183C39.2612 6.4763 38.4236 6.01141 37.2333 5.71084C36.5801 5.54652 35.4099 5.48641 34.6043 5.57858ZM36.6602 7.85492C38.3795 8.13546 39.7662 9.33775 40.2912 11.0129C40.716 12.3715 40.5997 14.0347 39.9906 15.241C39.4255 16.3511 38.4236 17.1927 37.2453 17.5334C36.7203 17.6857 36.3837 17.7297 35.7665 17.7297C34.7205 17.7257 33.8348 17.4652 33.0293 16.9162C32.0795 16.275 31.3902 15.1889 31.1377 13.9425C30.9173 12.8605 31.0255 11.566 31.4182 10.6202C32.1717 8.79672 33.919 7.71466 35.9709 7.79882C36.2154 7.81084 36.524 7.83488 36.6602 7.85492Z"
        fill="white"
      />
      <Path
        d="M67.927 5.57464C66.841 5.69887 65.8631 6.03551 65.1417 6.53647C64.781 6.78494 64.2641 7.30994 64.0036 7.69067L63.7992 7.99124V6.82101V5.65078H62.5568H61.3144V12.7443V19.8378H62.6169H63.9154L63.9314 15.8182C63.9434 11.9267 63.9475 11.7905 64.0276 11.4218C64.4284 9.60632 65.4503 8.52025 67.1255 8.1275C67.37 8.07139 67.6786 8.04334 68.2196 8.02731L68.969 8.00326V6.76891V5.53055L68.6003 5.53456C68.3959 5.53857 68.0914 5.5546 67.927 5.57464Z"
        fill="white"
      />
      <Path
        d="M88.9673 5.59055C87.4284 5.7749 86.2462 6.27185 85.4005 7.08139C84.8675 7.59036 84.5108 8.20353 84.3305 8.9209C84.2343 9.30563 84.2343 10.3316 84.3305 10.7163C84.6671 12.0709 85.5568 12.8885 87.2561 13.4014C87.8171 13.5738 88.4183 13.698 89.5284 13.8864C90.0013 13.9665 90.6105 14.0747 90.879 14.1268C92.6464 14.4835 93.3236 15.0686 93.1754 16.1186C93.0591 16.9282 92.466 17.4131 91.2918 17.6575C90.8149 17.7537 89.3481 17.7778 88.7269 17.6976C87.4204 17.5253 86.1379 17.0965 85.2042 16.5154C85.0198 16.4032 84.8635 16.315 84.8555 16.323C84.7914 16.3871 83.8015 18.3268 83.8175 18.3589C83.8977 18.4831 84.607 18.8919 85.1721 19.1324C87.0477 19.9339 89.5525 20.2064 91.6204 19.8337C93.1313 19.5612 94.3736 18.8959 95.0549 17.9942C95.3395 17.6175 95.4958 17.3049 95.6441 16.8119C95.7443 16.4793 95.7563 16.3992 95.7563 15.79C95.7523 15.2369 95.7402 15.0766 95.6681 14.8081C95.3315 13.5818 94.5299 12.8444 92.979 12.3394C92.3498 12.135 91.917 12.0388 90.4101 11.7623C89.0635 11.5178 88.5385 11.3936 88.0816 11.2173C87.5086 10.9969 87.0918 10.6562 86.9074 10.2635C86.8393 10.1152 86.8233 10.003 86.8233 9.67834C86.8233 9.30563 86.8313 9.25754 86.9555 9.00907C87.3563 8.19151 88.4984 7.73464 90.1456 7.73464C91.5883 7.73464 93.0431 8.11536 94.0691 8.7646C94.1532 8.8167 94.2294 8.85677 94.2334 8.84876C94.2414 8.84074 94.4899 8.37987 94.7864 7.82681L95.3315 6.81288L95.107 6.67662C94.4818 6.2999 93.3477 5.91517 92.2536 5.71479C91.3038 5.53845 89.853 5.48234 88.9673 5.59055Z"
        fill="white"
      />
      <Path
        d="M128.443 12.6281C127.63 12.7043 126.912 13.0369 126.307 13.622C125.826 14.0829 125.53 14.5678 125.329 15.2171C125.233 15.5377 125.221 15.6298 125.221 16.211C125.221 16.7921 125.233 16.8842 125.329 17.2049C125.65 18.2468 126.343 19.0604 127.297 19.4972C128.215 19.926 129.389 19.926 130.303 19.5012C131.353 19.0163 132.106 18.0785 132.335 16.9724C132.587 15.7461 132.226 14.5318 131.345 13.6541C130.583 12.8926 129.541 12.5239 128.443 12.6281Z"
        fill="#D8522E"
      />
    </Svg>
  );
}

function TrendingIcon() {
  return (
    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <Path
        d="M6.3512 6.29626L6.3497 6.29701L6.34745 6.29851L6.3512 6.29626ZM13.8167 6.15601C13.7645 6.10567 13.7066 6.06162 13.6442 6.02476C13.5558 5.97272 13.4577 5.93937 13.3559 5.92675C13.2541 5.91414 13.1508 5.92254 13.0524 5.95143C12.954 5.98032 12.8626 6.02909 12.7838 6.09472C12.7049 6.16035 12.6404 6.24145 12.5942 6.33301C12.3359 6.8422 11.9796 7.29536 11.5457 7.66651C11.6122 7.29267 11.6458 6.91372 11.6462 6.53401C11.6476 5.37911 11.343 4.24446 10.7633 3.24558C10.1837 2.24669 9.34964 1.41925 8.3462 0.847506C8.23562 0.784677 8.11088 0.751 7.98371 0.749639C7.85654 0.748278 7.73111 0.779278 7.61921 0.839726C7.50732 0.900173 7.41263 0.988083 7.34406 1.09519C7.27548 1.2023 7.23527 1.32508 7.2272 1.45201C7.18521 2.16308 6.9993 2.85823 6.68075 3.49534C6.36219 4.13245 5.91761 4.69827 5.37395 5.15851L5.20145 5.29876C4.63266 5.68144 4.12921 6.15323 3.71045 6.69601C3.05965 7.51584 2.60884 8.47604 2.39376 9.50044C2.17868 10.5248 2.20525 11.5853 2.47137 12.5976C2.73748 13.61 3.23582 14.5464 3.92686 15.3326C4.61789 16.1188 5.48262 16.7332 6.45245 17.127C6.56631 17.1734 6.68982 17.191 6.81211 17.1784C6.93439 17.1658 7.05171 17.1233 7.15372 17.0547C7.25574 16.9861 7.33932 16.8935 7.39712 16.785C7.45493 16.6765 7.48517 16.5554 7.4852 16.4325C7.48457 16.3531 7.47193 16.2742 7.4477 16.1985C7.27989 15.5678 7.23156 14.9112 7.3052 14.2628C8.01505 15.6012 9.15436 16.662 10.5399 17.2748C10.709 17.3503 10.9001 17.3605 11.0762 17.3033C12.1708 16.9499 13.1569 16.3225 13.9408 15.4808C14.7246 14.639 15.2803 13.6108 15.5549 12.4938C15.8295 11.3768 15.8139 10.2082 15.5097 9.09895C15.2055 7.98968 14.6227 6.97662 13.8167 6.15601ZM10.8879 15.7793C10.2342 15.448 9.65742 14.9828 9.19522 14.414C8.73301 13.8452 8.39569 13.1855 8.2052 12.4778C8.14695 12.2394 8.10189 11.9981 8.0702 11.7548C8.04886 11.5998 7.97962 11.4554 7.87217 11.3418C7.76472 11.2282 7.62444 11.151 7.47095 11.121C7.42375 11.1118 7.37577 11.1073 7.3277 11.1075C7.19592 11.1074 7.06644 11.142 6.95228 11.2078C6.83813 11.2736 6.74333 11.3684 6.67745 11.4825C6.05528 12.5559 5.74248 13.7807 5.7737 15.021C5.22631 14.5955 4.76883 14.0656 4.42776 13.462C4.08669 12.8584 3.86882 12.1932 3.78678 11.5047C3.70473 10.8163 3.76015 10.1185 3.94982 9.45161C4.13949 8.78477 4.45963 8.1622 4.8917 7.62001C5.21976 7.19388 5.61552 6.82448 6.0632 6.52651C6.08279 6.51394 6.10157 6.50016 6.11945 6.48526C6.11945 6.48526 6.34145 6.30151 6.34895 6.29776C7.41785 5.39404 8.17817 4.17936 8.52395 2.82301C9.34102 3.57853 9.88577 4.5827 10.0736 5.67958C10.2614 6.77646 10.0818 7.90467 9.5627 8.88901C9.49399 9.02039 9.46577 9.16919 9.4816 9.3166C9.49743 9.46402 9.55659 9.60344 9.65161 9.71724C9.74664 9.83105 9.87326 9.91414 10.0155 9.95601C10.1577 9.99788 10.3092 9.99666 10.4507 9.95251C11.5995 9.59222 12.6103 8.88866 13.3472 7.9365C13.7902 8.59068 14.0799 9.33641 14.1946 10.1181C14.3093 10.8998 14.2461 11.6973 14.0097 12.4512C13.7733 13.2051 13.3698 13.8959 12.8293 14.4721C12.2888 15.0484 11.6252 15.4952 10.8879 15.7793Z"
        fill="white"
      />
    </Svg>
  );
}

function PlayIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M3.33333 3.32642C3.33333 2.67898 3.33333 2.35526 3.46833 2.17681C3.58593 2.02135 3.76568 1.92515 3.96026 1.91353C4.18362 1.9002 4.45297 2.07977 4.99168 2.4389L12.0021 7.11248C12.4472 7.40923 12.6697 7.55761 12.7473 7.74462C12.8151 7.90813 12.8151 8.09188 12.7473 8.25538C12.6697 8.4424 12.4472 8.59077 12.0021 8.88752L4.99168 13.5611C4.45297 13.9202 4.18362 14.0998 3.96026 14.0865C3.76568 14.0749 3.58593 13.9787 3.46833 13.8232C3.33333 13.6447 3.33333 13.321 3.33333 12.6736V3.32642Z"
        stroke="white"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function FavoriteIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M10.3637 6.61696C10.613 6.17403 10.8208 5.77435 10.949 5.47015C11.5716 3.99299 10.956 2.29386 9.45129 1.60076C7.94657 0.907662 6.4356 1.62634 5.77247 3.01396C4.50437 2.14381 2.81278 2.2716 1.87992 3.6295C0.947057 4.9874 1.23983 6.76136 2.51752 7.72937C3.0974 8.1687 4.24424 8.81614 5.32397 9.39231M10.8648 7.83331C10.5834 6.32134 9.2969 5.21557 7.67709 5.51611C6.05728 5.81666 5.00991 7.27806 5.22889 8.86601C5.40483 10.1418 6.37594 13.1352 6.75093 14.2627C6.8021 14.4165 6.82769 14.4935 6.87835 14.5471C6.92248 14.5938 6.98115 14.6277 7.04369 14.6426C7.11548 14.6596 7.19489 14.6433 7.35373 14.6107C8.51768 14.3717 11.5955 13.716 12.7884 13.2305C14.2731 12.6262 15.0393 10.9894 14.4654 9.43534C13.8915 7.88125 12.3149 7.32102 10.8648 7.83331Z"
        stroke="white"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function SearchIcon() {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Navbar({
  selectedNavIndex,
  onSignUpPress,
  onNavItemPress,
  onSearchPress,
}: {
  selectedNavIndex?: number;
  onSignUpPress?: () => void;
  onNavItemPress?: (index: number) => void;
  onSearchPress?: () => void;
}) {
  const navItems = [
    { label: "Home", focused: selectedNavIndex === 0 },
    { label: "New arrival", focused: selectedNavIndex === 1 },
    { label: "My favorites", focused: selectedNavIndex === 2 },
    { label: "Search", focused: selectedNavIndex === 3 },
    { label: "Sign up", focused: selectedNavIndex === 4 },
  ];

  return (
    <View className="flex flex-row items-center justify-between px-6 py-3.5">
      <View className="flex-shrink">
        <LogoSVG />
      </View>

      <View className="flex flex-row items-center gap-4">
        {navItems.slice(0, 3).map((item, idx) => (
          <Pressable
            key={idx}
            onPress={() => onNavItemPress?.(idx)}
            className={`px-2 py-1 rounded transition-colors ${
              item.focused ? "bg-orange-600/30 ring-2 ring-orange-500" : ""
            }`}
          >
            <Text
              className={`text-base font-medium ${
                item.focused ? "text-white" : "text-white/70"
              }`}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="flex flex-row items-center gap-4 flex-shrink">
        <Pressable
          onPress={onSearchPress}
          className={`p-2 rounded transition-colors ${
            navItems[3].focused ? "bg-orange-600/30 ring-2 ring-orange-500" : ""
          }`}
        >
          <SearchIcon />
        </Pressable>

        <Pressable
          onPress={onSignUpPress}
          className={`flex items-center justify-center h-10 px-4 rounded-full border-2 transition-colors ${
            navItems[4].focused
              ? "border-orange-500 bg-orange-700 ring-2 ring-orange-500"
              : "border-white/[0.12] bg-orange-600"
          }`}
        >
          <Text className="text-white text-base font-medium">Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}

function GuestScreenContent() {
  const { navigate } = useTVNavigation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedTrendingCard, setSelectedTrendingCard] = useState<
    string | undefined
  >();
  const [selectedArtistCard, setSelectedArtistCard] = useState<
    string | undefined
  >();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const homeStore = useHomeStore();
  const { featuredCarousel, trendingCarousels, publishers } =
    homeStore.homeData;

  useEffect(() => {
    homeStore.fetchHomeData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trendingItems: ContentItem[] = (trendingCarousels || []).map(
    (carousel: any) => ({
      id: carousel.id,
      src: carousel.imageUrl || "https://via.placeholder.com/160x240",
      alt: carousel.name,
      title: carousel.name,
      subtitle: `${carousel.publisher?.name || "Artist"} • ${
        carousel.views || 0
      } views`,
      tag: carousel.tag,
      bg: "bg-[#1a1a1a]",
    })
  );

  // Helper function to get the best image for a publisher
  const getPublisherImage = (pub: any): string => {
    // Try profile picture first
    if (pub.profilePicture) {
      return pub.profilePicture;
    }

    // Try first carousel's image
    if (
      pub.carousels &&
      pub.carousels.length > 0 &&
      pub.carousels[0].imageUrl
    ) {
      return pub.carousels[0].imageUrl;
    }

    // Try first artwork image from first carousel
    if (
      pub.carousels &&
      pub.carousels.length > 0 &&
      pub.carousels[0].artworks &&
      pub.carousels[0].artworks.length > 0
    ) {
      return pub.carousels[0].artworks[0].imageUrl;
    }

    // Fallback to placeholder
    return "https://via.placeholder.com/160x240";
  };

  const artistItems: ContentItem[] = (publishers || [])
    .filter((pub: any) => pub.carousels && pub.carousels.length > 0)
    .map((pub: any) => ({
      id: pub.id,
      src: getPublisherImage(pub),
      alt: pub.name,
      title: pub.name,
      subtitle: pub.personaType || "Artist",
      bg: "bg-[#1a1a1a]",
    }));

  const totalNavItems = 5 + 2 + trendingItems.length + artistItems.length;

  // Handle navigation item selection
  const handleNavSelection = (navIndex: number) => {
    switch (navIndex) {
      case 0:
        // Home - show sign in modal
        setShowSignInModal(true);
        break;
      case 1:
        // New arrival - show sign in modal
        setShowSignInModal(true);
        break;
      case 2:
        // My favorites - requires sign in
        setShowSignInModal(true);
        break;
      case 3:
        // Search - requires sign in
        setShowSignInModal(true);
        break;
      case 4:
        // Sign up button in navbar
        navigate("SignUp");
        break;
    }
  };

  useTVRemote({
    onUp: () => {
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalNavItems - 1));
    },
    onDown: () => {
      setSelectedIndex((prev) => (prev < totalNavItems - 1 ? prev + 1 : 0));
    },
    onLeft: () => {
      const trendingStart = 7;
      const artistStart = trendingStart + trendingItems.length;

      if (selectedIndex >= trendingStart && selectedIndex < artistStart) {
        const cardIndex = selectedIndex - trendingStart;
        if (cardIndex > 0) {
          const newIndex = selectedIndex - 1;
          setSelectedIndex(newIndex);
          setSelectedTrendingCard(trendingItems[cardIndex - 1].id);
        }
      } else if (selectedIndex >= artistStart) {
        const cardIndex = selectedIndex - artistStart;
        if (cardIndex > 0) {
          const newIndex = selectedIndex - 1;
          setSelectedIndex(newIndex);
          setSelectedArtistCard(artistItems[cardIndex - 1].id);
        }
      }
    },
    onRight: () => {
      const trendingStart = 7;
      const artistStart = trendingStart + trendingItems.length;

      if (selectedIndex >= trendingStart && selectedIndex < artistStart) {
        const cardIndex = selectedIndex - trendingStart;
        if (cardIndex < trendingItems.length - 1) {
          const newIndex = selectedIndex + 1;
          setSelectedIndex(newIndex);
          setSelectedTrendingCard(trendingItems[cardIndex + 1].id);
        }
      } else if (selectedIndex >= artistStart) {
        const cardIndex = selectedIndex - artistStart;
        if (cardIndex < artistItems.length - 1) {
          const newIndex = selectedIndex + 1;
          setSelectedIndex(newIndex);
          setSelectedArtistCard(artistItems[cardIndex + 1].id);
        }
      }
    },
    onSelect: () => {
      const heroStart = 5;
      const trendingStart = 7;
      const artistStart = trendingStart + trendingItems.length;

      if (selectedIndex < heroStart) {
        const navIndex = selectedIndex;
        handleNavSelection(navIndex);
      } else if (selectedIndex < trendingStart) {
        const buttonIndex = selectedIndex - heroStart;
        if (buttonIndex === 0) {
          // Play carousel button
          setShowSignInModal(true);
        } else if (buttonIndex === 1) {
          // Add to favorites button
          setShowSignInModal(true);
        }
      } else if (selectedIndex < artistStart) {
        const cardIndex = selectedIndex - trendingStart;
        setSelectedTrendingCard(trendingItems[cardIndex].id);
        // Show modal when selecting a card
        setShowSignInModal(true);
      } else {
        const cardIndex = selectedIndex - artistStart;
        setSelectedArtistCard(artistItems[cardIndex].id);
        // Show modal when selecting a card
        setShowSignInModal(true);
      }
    },
  });

  return (
    <>
      <ScrollView className="flex-1 bg-black">
        {/* Hero Section */}
        <ImageBackground
          source={{
            uri: "https://joincarsl.com/api/uploads/artworks/12.png",
          }}
          className="relative bg-black h-[300px] md:h-[400px] w-full"
          resizeMode="cover"
        >
          <View className="relative z-10 flex flex-col">
            <Navbar
              selectedNavIndex={
                selectedIndex >= 0 && selectedIndex < 5
                  ? selectedIndex
                  : undefined
              }
              onSignUpPress={() => navigate("SignUp")}
              onNavItemPress={(index) => {
                setSelectedIndex(index);
                handleNavSelection(index);
              }}
              onSearchPress={() => {
                setSelectedIndex(3);
                handleNavSelection(3);
              }}
            />

            <View className="flex flex-col px-6 pt-8 pb-6 justify-start">
              <View className="w-full max-w-[532px]">
                <View className="flex flex-row items-center gap-0.5 mb-6">
                  <TrendingIcon />
                  <Text className="text-white text-base font-medium ml-2">
                    Trending now
                  </Text>
                </View>

                <View className="flex flex-col gap-6 mb-8">
                  <View className="flex flex-col gap-4">
                    <Text className="text-white text-3xl md:text-4xl font-bold leading-tight">
                      {featuredCarousel?.name || "Featured Carousel"}
                    </Text>
                    <Text className="text-gray-300 text-base font-normal leading-6">
                      {featuredCarousel?.description ||
                        "Explore the latest in contemporary art"}
                    </Text>
                  </View>

                  <Text className="text-white text-base font-medium">
                    {featuredCarousel?.publisher?.name || "Featured Artist"} •{" "}
                    {featuredCarousel?.views || 0} views
                  </Text>
                </View>

                <View className="flex flex-row gap-3 flex-wrap">
                  <Pressable
                    className={`flex flex-row items-center gap-2 h-10 px-5 rounded-full border-2 transition-colors ${
                      selectedIndex === 5
                        ? "border-orange-500 bg-orange-700 ring-2 ring-orange-500"
                        : "border-white/[0.12] bg-orange-600"
                    }`}
                    onPress={() => setShowSignInModal(true)}
                  >
                    <PlayIcon />
                    <Text className="text-white text-base font-medium">
                      Play carousel
                    </Text>
                  </Pressable>

                  <Pressable
                    className={`flex flex-row items-center gap-2 h-10 px-5 rounded-full border-2 transition-colors ${
                      selectedIndex === 6
                        ? "border-white/30 bg-white/30 ring-2 ring-white"
                        : "border-white/[0.12] bg-black/30"
                    }`}
                    onPress={() => setShowSignInModal(true)}
                  >
                    <FavoriteIcon />
                    <Text className="text-white text-base font-medium">
                      Add to favorites
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View className="">
          <ContentRow
            title="Trending now"
            items={trendingItems}
            accent
            selectedCardId={selectedTrendingCard}
            onCardSelect={setSelectedTrendingCard}
            onCardPress={() => setShowSignInModal(true)}
          />

          <ContentRow
            title="African Artists"
            items={artistItems}
            accent
            selectedCardId={selectedArtistCard}
            onCardSelect={setSelectedArtistCard}
            onCardPress={() => setShowSignInModal(true)}
          />
        </View>
      </ScrollView>

      {/* Sign In Modal */}
      <SignInModal
        visible={showSignInModal}
        onSignUp={() => {
          setShowSignInModal(false);
          navigate("SignUp");
        }}
        onContinueAsGuest={() => {
          setShowSignInModal(false);
        }}
        onClose={() => {
          setShowSignInModal(false);
        }}
      />
    </>
  );
}

export default function GuestScreen() {
  return <GuestScreenContent />;
}

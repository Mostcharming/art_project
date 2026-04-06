import { tvColors } from "@/constants/tv-colors";
import { useTVRemote } from "@/hooks/use-tv-remote";
import { useUserStore } from "@/store/userStore";
import { apiService } from "@/utils/apiService";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Svg, { G, Path } from "react-native-svg";

/**
 * ANDROID TV TEXT INPUT GUIDE
 * =============================
 * Android TV users can type in multiple ways:
 * 1. REMOTE KEYBOARD: Connect Bluetooth/USB wireless keyboard to Android TV
 * 2. VIRTUAL KEYBOARD: On-screen IME keyboard appears when TextInput is focused
 * 3. VOICE INPUT: Google Assistant voice search (if supported)
 * 4. MOBILE APP: Use Android TV Companion app to type on phone
 *
 * This app uses the virtual keyboard approach - when focused on a TextInput,
 * the system keyboard appears and users can navigate with remote D-pad.
 */

type FocusedField =
  | "email"
  | "password"
  | "showPassword"
  | "button"
  | "signup-link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<FocusedField>("email");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const loginUser = useUserStore((state) => state.loginUser);

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const { height } = useWindowDimensions();

  const isFormValid = email.length > 0 && password.length >= 8;

  // Blur keyboard when navigating away from text inputs
  useEffect(() => {
    if (focusedField !== "email" && emailInputRef.current) {
      emailInputRef.current.blur();
    }
    if (focusedField !== "password" && passwordInputRef.current) {
      passwordInputRef.current.blur();
    }
  }, [focusedField]);

  // Handle TV remote navigation
  useTVRemote({
    onSelect: () => {
      if (focusedField === "email") {
        emailInputRef.current?.focus();
      } else if (focusedField === "password") {
        passwordInputRef.current?.focus();
      } else if (focusedField === "showPassword") {
        setShowPassword(!showPassword);
      } else if (focusedField === "button" && isFormValid) {
        handleSignIn();
      } else if (focusedField === "signup-link") {
        router.push("/pages/signupPage");
      }
    },
    onUp: () => {
      if (focusedField === "password") {
        setFocusedField("email");
      } else if (focusedField === "showPassword") {
        setFocusedField("password");
      } else if (focusedField === "button") {
        setFocusedField("showPassword");
      } else if (focusedField === "signup-link") {
        setFocusedField("button");
      }
    },
    onDown: () => {
      if (focusedField === "email") {
        setFocusedField("password");
      } else if (focusedField === "password") {
        setFocusedField("showPassword");
      } else if (focusedField === "showPassword") {
        setFocusedField("button");
      } else if (focusedField === "button") {
        setFocusedField("signup-link");
      }
    },
  });

  const handleSignIn = async () => {
    if (!isFormValid) {
      Alert.alert("Validation Error", "Please fill in all fields correctly.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.post("/auth/login", {
        email,
        password,
      });

      if (response.error) {
        Alert.alert("Login Error", response.error);
        return;
      }

      // Assuming the API returns user data and token
      const userData = response.data;
      if (userData.user && userData.token) {
        loginUser(userData.user, userData.token);
        Alert.alert("Success", "Logged in successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/"),
          },
        ]);
      } else {
        Alert.alert(
          "Error",
          "Login successful but missing user data. Please try again."
        );
      }
    } catch {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldFocusStyle = (fieldName: FocusedField) => {
    const isFocused = focusedField === fieldName;
    return {
      borderColor: isFocused ? tvColors.accent : tvColors.backgroundLight,
      backgroundColor: isFocused
        ? "rgba(3, 218, 198, 0.1)"
        : tvColors.backgroundLight,
      borderWidth: isFocused ? 3 : 2,
    };
  };

  return (
    <ScrollView
      contentContainerStyle={{
        minHeight: height,
        paddingVertical: 32,
        paddingHorizontal: 16,
      }}
      scrollEnabled={false}
    >
      {/* Logo */}
      <View style={{ alignItems: "center", marginBottom: 48, marginTop: 8 }}>
        <CarslLogo />
      </View>

      {/* Form Container */}
      <View
        style={{
          alignItems: "center",
          width: "100%",
          maxWidth: 358,
          alignSelf: "center",
          gap: 28,
        }}
      >
        {/* Heading */}
        <View style={{ gap: 4, width: "100%", alignItems: "center" }}>
          <Text
            style={{
              color: tvColors.textPrimary,
              fontSize: 20,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontFamily: "BankGothicBold",
              textAlign: "center",
            }}
          >
            Welcome back
          </Text>
          <Text
            style={{
              color: tvColors.textSecondary,
              fontSize: 14,
              fontWeight: "normal",
              lineHeight: 20,
              textAlign: "center",
            }}
          >
            Enter your password to log into your account
          </Text>
        </View>

        {/* Fields + CTA */}
        <View style={{ gap: 40, width: "100%" }}>
          {/* Input Fields */}
          <View style={{ gap: 24, width: "100%" }}>
            {/* Email Field */}
            <View style={{ gap: 6 }}>
              <Text
                style={{
                  color: tvColors.textSecondary,
                  fontSize: 14,
                  fontWeight: "600",
                  lineHeight: 20,
                }}
              >
                Email
              </Text>
              <View
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor: tvColors.backgroundLight,
                  },
                  getFieldFocusStyle("email"),
                ]}
              >
                <TextInput
                  ref={emailInputRef}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField("email")}
                  placeholder="Example@gmail.com"
                  placeholderTextColor={tvColors.textTertiary}
                  style={{
                    flex: 1,
                    color: tvColors.textPrimary,
                    fontSize: 14,
                    fontWeight: "normal",
                    lineHeight: 20,
                  }}
                />
                <HelpCircleIcon />
              </View>
            </View>

            {/* Password Field */}
            <View style={{ gap: 6 }}>
              <Text
                style={{
                  color: tvColors.textSecondary,
                  fontSize: 14,
                  fontWeight: "600",
                  lineHeight: 20,
                }}
              >
                Create Password
              </Text>
              <View
                style={[
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor: tvColors.backgroundLight,
                  },
                  getFieldFocusStyle("password"),
                ]}
              >
                <TextInput
                  ref={passwordInputRef}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField("password")}
                  placeholder="***********"
                  placeholderTextColor={tvColors.textTertiary}
                  secureTextEntry={!showPassword}
                  style={{
                    flex: 1,
                    color: tvColors.textPrimary,
                    fontSize: 14,
                    fontWeight: "normal",
                    lineHeight: 20,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setFocusedField("showPassword");
                    setShowPassword(!showPassword);
                  }}
                  disabled={focusedField !== "showPassword"}
                  style={[
                    { padding: 4 },
                    focusedField === "showPassword" && {
                      borderRadius: 6,
                      backgroundColor: "rgba(3, 218, 198, 0.2)",
                      padding: 6,
                    },
                  ]}
                  activeOpacity={0.6}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: tvColors.textSecondary,
                  fontSize: 14,
                  fontWeight: "normal",
                  lineHeight: 20,
                }}
              >
                At least 8 letters, 1 special character *%#@!
              </Text>
            </View>
          </View>

          {/* CTA Section */}
          <View style={{ gap: 20, alignItems: "center", width: "100%" }}>
            <TouchableOpacity
              onPress={() => {
                setFocusedField("button");
                handleSignIn();
              }}
              disabled={!isFormValid || isLoading}
              activeOpacity={0.8}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 24,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isFormValid
                  ? "rgba(216, 82, 46, 0.85)"
                  : "rgba(216, 82, 46, 0.50)",
                borderWidth: focusedField === "button" ? 3 : 0,
                borderColor: tvColors.accent,
                shadowColor:
                  focusedField === "button" ? tvColors.accent : "transparent",
                shadowOpacity: focusedField === "button" ? 0.5 : 0,
                shadowOffset: { width: 0, height: 0 },
                shadowRadius: 16,
                elevation: focusedField === "button" ? 8 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  lineHeight: 24,
                  color: isFormValid
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.30)",
                }}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: tvColors.textSecondary,
                fontSize: 14,
                fontWeight: "normal",
                lineHeight: 20,
                textAlign: "center",
                maxWidth: 327,
              }}
            >
              By clicking &quot;sign in&quot;, you agree to our{" "}
              <Text
                style={{ fontWeight: "600", textDecorationLine: "underline" }}
              >
                Terms of service
              </Text>{" "}
              and{" "}
              <Text
                style={{ fontWeight: "600", textDecorationLine: "underline" }}
              >
                privacy policy
              </Text>
              .
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "center", gap: 4 }}
            >
              <Text
                style={{
                  color: tvColors.textSecondary,
                  fontSize: 14,
                  fontWeight: "normal",
                  lineHeight: 20,
                }}
              >
                Don&apos;t have an account?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/pages/signupPage")}
                activeOpacity={0.7}
                style={[
                  { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4 },
                  focusedField === "signup-link" && {
                    backgroundColor: "rgba(3, 218, 198, 0.2)",
                    borderWidth: 2,
                    borderColor: tvColors.accent,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      focusedField === "signup-link"
                        ? tvColors.accent
                        : tvColors.accent,
                    fontSize: 14,
                    fontWeight: "600",
                    lineHeight: 20,
                    textDecorationLine: "underline",
                  }}
                >
                  Create one
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Navigation Hint */}
      <View
        style={{
          marginTop: "auto",
          alignItems: "center",
          paddingBottom: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 8,
            paddingVertical: 8,
            borderRadius: 20,
            backgroundColor: "rgba(0,0,0,0.80)",
            gap: 2,
          }}
        >
          <Text
            style={{
              color: tvColors.textPrimary,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            ⇅ Navigate | ←→ Scroll | Enter to select
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function CarslLogo() {
  return (
    <Svg width="93" height="14" viewBox="0 0 93 14" fill="none">
      <Path
        d="M78.6401 5.74252C78.6485 11.4626 78.6485 11.4878 78.7074 11.7544C78.9487 12.8484 79.5181 13.5161 80.4691 13.8247C81.1424 14.0463 82.0205 14.0547 82.7218 13.8527C82.8368 13.8191 82.935 13.7742 82.9435 13.7546C82.9519 13.7349 82.9378 13.4123 82.9126 13.0392C82.8873 12.6633 82.8677 12.3435 82.8677 12.3238C82.8677 12.3042 82.7976 12.3154 82.6713 12.3603C82.3684 12.4613 82.0205 12.4978 81.7147 12.4585C81.1565 12.3856 80.8198 12.1527 80.6094 11.6898C80.4495 11.342 80.4551 11.586 80.4551 5.55176V0H79.5434H78.6288L78.6401 5.74252Z"
        fill="white"
      />
      <Path
        d="M4.68348 3.88806C4.64421 3.89367 4.50114 3.91331 4.36087 3.93014C3.7998 4.00028 3.14336 4.20226 2.62998 4.46596C1.29464 5.14766 0.41657 6.31748 0.0939567 7.83797C-0.00423006 8.29805 -0.0294781 9.19295 0.03785 9.67827C0.200559 10.8341 0.635386 11.7234 1.42649 12.5117C1.82204 12.9072 2.11099 13.126 2.55143 13.3617C3.64551 13.9508 5.15198 14.1528 6.42279 13.8807C7.39624 13.6731 8.27151 13.1737 8.82977 12.5032C9.05139 12.2395 9.28704 11.8945 9.27021 11.8636C9.26179 11.8524 9.02053 11.6953 8.72878 11.513C8.43983 11.3306 8.13966 11.1399 8.0583 11.0894L7.91523 10.9996L7.7946 11.1595C7.3205 11.7907 6.70613 12.1834 5.94027 12.3461C5.56436 12.4275 4.90791 12.4331 4.52919 12.3602C3.81103 12.2227 3.21068 11.9113 2.75341 11.4344C2.48691 11.1567 2.32981 10.9323 2.1699 10.5928C1.93706 10.0963 1.82204 9.55764 1.82204 8.93767C1.82204 7.15628 2.81794 5.86863 4.46747 5.52357C4.86583 5.43941 5.53631 5.43661 5.91783 5.51796C6.67247 5.68067 7.30367 6.07342 7.75533 6.65973L7.91523 6.87013L8.01622 6.80561C8.20418 6.68779 9.18324 6.05378 9.23654 6.01731C9.28423 5.98365 9.27582 5.96401 9.11311 5.71995C8.87746 5.36647 8.40336 4.89237 8.03305 4.64831C7.4243 4.24434 6.6921 3.98905 5.88417 3.90209C5.63169 3.87404 4.84619 3.86562 4.68348 3.88806Z"
        fill="white"
      />
      <Path
        d="M24.2229 3.90502C23.4374 3.99198 22.6183 4.28935 21.973 4.71576C21.5663 4.98788 21.0108 5.54053 20.7527 5.93327C20.1776 6.80573 19.8887 7.79602 19.8887 8.91534C19.8887 11.2466 21.1511 13.0869 23.199 13.7405C23.8246 13.9397 24.3688 14.0126 25.0785 13.9902C26.3129 13.9537 27.3144 13.5441 28.0662 12.7615C28.1925 12.6324 28.3271 12.4809 28.3692 12.4276L28.4449 12.3294V13.1065V13.8864H29.3146H30.1843L30.1786 8.92657L30.1702 3.96954L29.2669 3.96112L28.3608 3.95551V4.6849V5.41429L28.0466 5.09728C27.4827 4.53341 26.8964 4.20799 26.0632 3.99759C25.6059 3.88257 24.7868 3.84049 24.2229 3.90502ZM25.6621 5.49845C26.8655 5.69482 27.8362 6.53642 28.2037 7.70905C28.501 8.66006 28.4197 9.82427 27.9933 10.6687C27.5977 11.4458 26.8964 12.0349 26.0716 12.2733C25.7041 12.3799 25.4685 12.4108 25.0365 12.4108C24.3043 12.408 23.6843 12.2256 23.1204 11.8413C22.4556 11.3925 21.973 10.6322 21.7963 9.75975C21.642 9.00231 21.7178 8.09619 21.9927 7.43413C22.5201 6.1577 23.7432 5.40026 25.1795 5.45917C25.3507 5.46759 25.5667 5.48442 25.6621 5.49845Z"
        fill="white"
      />
      <Path
        d="M47.5492 3.90225C46.789 3.98922 46.1045 4.22487 45.5995 4.57553C45.347 4.74947 44.9851 5.11696 44.8028 5.38347L44.6597 5.59387V4.77471V3.95556H43.7901H42.9204V8.921V13.8864H43.8321H44.7411L44.7523 11.0727C44.7607 8.34871 44.7635 8.25333 44.8196 7.99524C45.1002 6.72442 45.8155 5.96417 46.9881 5.68925C47.1593 5.64998 47.3753 5.63034 47.754 5.61912L48.2786 5.60229V4.73824V3.8714L48.0205 3.8742C47.8774 3.87701 47.6642 3.88823 47.5492 3.90225Z"
        fill="white"
      />
      <Path
        d="M62.2769 3.91341C61.1996 4.04245 60.372 4.39031 59.7801 4.95699C59.407 5.31327 59.1573 5.74248 59.0311 6.24464C58.9638 6.51395 58.9638 7.23212 59.0311 7.50143C59.2667 8.44963 59.8895 9.02192 61.079 9.381C61.4717 9.50163 61.8925 9.5886 62.6696 9.72045C63.0006 9.77656 63.4271 9.8523 63.615 9.88877C64.8522 10.1384 65.3263 10.548 65.2225 11.283C65.1411 11.8497 64.7259 12.1891 63.904 12.3603C63.5701 12.4276 62.5434 12.4444 62.1085 12.3883C61.194 12.2677 60.2963 11.9675 59.6427 11.5607C59.5136 11.4822 59.4042 11.4205 59.3986 11.4261C59.3537 11.471 58.6608 12.8288 58.672 12.8512C58.7281 12.9382 59.2247 13.2243 59.6202 13.3926C60.9331 13.9537 62.6864 14.1445 64.134 13.8836C65.1916 13.6928 66.0613 13.2271 66.5382 12.5959C66.7373 12.3322 66.8468 12.1134 66.9506 11.7683C67.0207 11.5355 67.0291 11.4794 67.0291 11.053C67.0263 10.6658 67.0179 10.5536 66.9674 10.3657C66.7317 9.50724 66.1707 8.99106 65.085 8.63759C64.6446 8.49452 64.3416 8.42719 63.2868 8.23362C62.3442 8.0625 61.9767 7.97553 61.6569 7.8521C61.2557 7.6978 60.964 7.45935 60.8349 7.18443C60.7872 7.08063 60.776 7.00208 60.776 6.77485C60.776 6.51395 60.7816 6.48029 60.8686 6.30636C61.1491 5.73407 61.9486 5.41426 63.1016 5.41426C64.1116 5.41426 65.1299 5.68077 65.8481 6.13523C65.907 6.1717 65.9603 6.19975 65.9631 6.19414C65.9687 6.18853 66.1426 5.86592 66.3502 5.47878L66.7317 4.76903L66.5746 4.67365C66.137 4.40995 65.3431 4.14064 64.5772 4.00037C63.9124 3.87694 62.8968 3.83766 62.2769 3.91341Z"
        fill="white"
      />
      <Path
        d="M89.9092 8.83963C89.3397 8.89293 88.8375 9.12577 88.4139 9.53535C88.0773 9.85796 87.8697 10.1974 87.7294 10.6519C87.6621 10.8763 87.6537 10.9408 87.6537 11.3476C87.6537 11.7544 87.6621 11.8189 87.7294 12.0433C87.9539 12.7727 88.4392 13.3422 89.1068 13.648C89.7493 13.9481 90.5712 13.9481 91.2109 13.6508C91.9458 13.3113 92.4733 12.6549 92.6332 11.8806C92.8099 11.0222 92.5574 10.1722 91.9402 9.55779C91.4072 9.02478 90.6778 8.76669 89.9092 8.83963Z"
        fill="#D8522E"
      />
    </Svg>
  );
}

function HelpCircleIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <G>
        <Path
          d="M6.05998 6.00001C6.21672 5.55446 6.52608 5.17875 6.93328 4.93943C7.34048 4.70012 7.81924 4.61264 8.28476 4.69248C8.75028 4.77233 9.17252 5.01436 9.4767 5.3757C9.78087 5.73703 9.94735 6.19436 9.94665 6.66668C9.94665 8.00001 7.94665 8.66668 7.94665 8.66668M7.99998 11.3333H8.00665M14.6666 8.00001C14.6666 11.6819 11.6819 14.6667 7.99998 14.6667C4.31808 14.6667 1.33331 11.6819 1.33331 8.00001C1.33331 4.31811 4.31808 1.33334 7.99998 1.33334C11.6819 1.33334 14.6666 4.31811 14.6666 8.00001Z"
          stroke={tvColors.textSecondary}
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
}

function EyeOffIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421"
        stroke={tvColors.textSecondary}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function EyeIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <Path
        d="M1.61407 8.47545C1.52286 8.33106 1.47725 8.25886 1.45183 8.14798C1.43273 8.06471 1.43272 7.93334 1.45181 7.85006C1.47722 7.73918 1.52262 7.66729 1.61342 7.52352C2.36369 6.33553 4.59694 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C13.6358 9.66504 11.4026 12.6667 8.00028 12.6667C4.59694 12.6667 2.36369 9.66344 1.61407 8.47545Z"
        stroke={tvColors.textSecondary}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.00028 10C9.10485 10 10.0003 9.10457 10.0003 8C10.0003 6.89543 9.10485 6 8.00028 6C6.89571 6 6.00028 6.89543 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10Z"
        stroke={tvColors.textSecondary}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

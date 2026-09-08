# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

### Testing with the local API on a phone

Run the API from `../apis` and connect the phone and computer to the same Wi-Fi.
Set these values in the ignored `.env.local`, using your computer's current IPv4
address from `ipconfig`:

```dotenv
EXPO_PUBLIC_ENV=development
EXPO_PUBLIC_API_URL=http://192.168.1.165:3000/api/publishers
```

`localhost` on a phone points to the phone, not the computer. For the standard
Android emulator, use `10.0.2.2` instead of the Wi-Fi address if needed. Verify
`http://<computer-ip>:3000/api/health` opens on the phone, then fully reload the
Expo app after changing the environment file. If the old address or route list
persists, stop Metro and restart it with `npx expo start --clear`.

The EAS production profile selects the production API separately. Shared types
belong in `types/index.ts`; files under `app/` are treated as routes by Expo Router.

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Chittr
Chittr is a microblogging platform mobile application which allows users to register for accounts and post Chits which can be seen by other users. Chits can be geotagged or be uploaded with an image.

## Installation
An Android emulator is required. Download the source code, install required modules (see required modules section) and run the following commands to setup and run the project:
```bash
npx react-native init Chittr
```

Once files are generated, replace the files with the Chittr source code and run the command:
```bash
npx react-native run-android
```

## Required Modules
Modules are required for the application to run properly. These modules are used to manage geotagging, images and storage of user data.
 
Modules: 
react-native-camera,
react-native-geolocation-service,
react-navigation,
react-navigation-stack,
react-native-datepicker,
react-native-background-timer,
@react-native-community/async-storage.
 
The command below will install the required modules:
```bash
npm install react-native-camera react-native-geolocation-service react-navigation react-navigation-stack react-native-datepicker react-native-background-timer @react-native-community/async-storage
```

## Code Standard
The code in the repository is managed by the Standard JS library to manage code quality. The Standard JS guideline can be found at: https://standardjs.com/.

## Author and Support
The Chittr application is designed and developed by Jake Taylor for a final year mobile applications development project at Manchester Metropolitan University.

For support please contact the author on Github or open an issue on the repository.

## Contributing
The project is currently not open to contributors. If you would like to request a feature, please use the issues or feature request section on the repository.

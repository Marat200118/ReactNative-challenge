# EventFinder App

EventFinder is a React Native application designed to help users find and create events in their local area using geolocation. The app integrates various sensor data (like light and accelerometer) to add unique features to events, such as **Ambience** and **Intensity**, which provide insights into the environment where the event is taking place. 

## Features

- **Interactive Map**: View events on a map with custom markers showing the event's location. Clicking on a marker shows event details.
- **Event Creation**: Easily create new events by adding details like name, description, number of people, drinks, and an image. 
- **Ambience & Intensity**: These metrics are determined using your phone's sensors:
  - **Ambience**: Measures the brightness of the event location using the light sensor.
  - **Intensity**: Tracks the movement level around the event using the accelerometer.
- **Event Detail View**: Detailed view of each event, including the event name, description, number of people, drinks, ambience, and intensity.
- **Event Scanning**: Scan your surroundings for nearby events and view them based on your compass direction using the device’s magnetometer.

## Installation

To get started with the EventFinder App, follow these steps:

### Prerequisites
- **Node.js** and **npm** installed.
- **Expo CLI** installed (`npm install -g expo-cli`).
- A mobile device or simulator to run the app.

## Key Features

### HomeScreen (Map View)

1. **HomeScreen (Map View)**
   - Displays a map with markers for events in your area.
   - Each marker shows a pop-up with the event's name.
   - Clicking on the marker pop-up opens a detailed view of the event.

2. **AddEventScreen**
   - Users can create new events with the following details:
     - **Name**: Event name.
     - **Description**: Event details.
     - **People**: The number of expected participants.
     - **Drinks**: Whether drinks will be served.
     - **Image**: Add an event image from your device.
     - **Ambience**: Calculated using the phone's light sensor to determine the brightness level at the event location.
     - **Intensity**: Calculated using accelerometer data to measure the activity level at the event.

3. **EventDetailScreen**
   - Displays full details of an event including name, description, people, drinks, and the unique selling points:
     - **Ambience**: Shows whether the event is in a bright, dimly lit, or dark atmosphere.
     - **Intensity**: Ranges from peaceful to highly active, based on movement data.

4. **ScannerScreen (Event Scanning)**
   - Allows users to scan their surroundings and find events based on their direction using a compass-like interface.
   - The app uses the phone's magnetometer to guide users to nearby events.

### Sensors Used
- **Accelerometer**: Measures the movement intensity around the event location.
- **Light Sensor**: Measures the light levels to determine the ambience of the event environment.
- **Magnetometer**: Used to scan and find events based on the user's orientation and direction.

### Future Features
- **User Authentication**: Allow users to sign in and manage their events.
- **Event RSVP**: Let users RSVP to events and show participation metrics.
- **Notifications**: Push notifications for upcoming events and reminders.

### License
This project is licensed under the MIT License. See the LICENSE file for details.

### Contact
If you have any questions or suggestions, feel free to reach out:

- **GitHub**: [github.com/Marat200118](https://github.com/Marat200118)
- **LinkedIn**: [linkedin.com/in/marats-samigullins](https://linkedin.com/in/marats-samigullins)
```
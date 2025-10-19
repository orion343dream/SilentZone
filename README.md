
<h1 align="center">💤 SilentZone – Smart Auto-Silent Location App</h1>

<p align="center">
  🕊️ Automatically silence your phone in peaceful zones like libraries, schools, temples, and churches.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.75+-blue?logo=react" />
  <img src="https://img.shields.io/badge/Expo-51+-black?logo=expo" />
  <img src="https://img.shields.io/badge/TailwindCSS-NativeWind-blue?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg" />
  <img src="https://img.shields.io/badge/Platform-Android%20|%20iOS-lightgrey" />
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen" />
</p>

---

## 🌐 Overview
**SilentZone** is a React Native app that intelligently detects your location and automatically switches your device to **Silent or Vibrate Mode** when you enter predefined “Silent Zones” (like libraries, schools, temples, or your own custom zones).  
It checks your location every minute and restores sound when you leave the zone.  

---

## 🎯 Key Features

| 🔢 | Feature | Description |
|----|----------|--------------|
| 🧭 | **Auto Zone Detection** | Detects quiet zones using network-based location and Google Maps tags. |
| 📍 | **Custom Zones** | Add or manage your own silent or vibrate areas manually. |
| 🔕 | **Auto Silent Mode** | Automatically toggles Do Not Disturb (DND) mode when entering a zone. |
| 🗺️ | **Live Map Integration** | View nearby or saved silent zones on Google Maps. |
| 🕒 | **Background Location Checking** | Continuously monitors location every minute. |
| 🔔 | **Notifications & History** | Displays logs of zone entry/exit events. |
| ⚙️ | **Advanced Settings** | Customize sound mode, interval checks, and DND permissions. |
| 📘 | **Help & Guide** | Quick help, FAQs, and app usage instructions. |

---

## 🧩 Tech Stack

| Layer | Technologies |
|--------|----------------|
| 💻 **Frontend** | React Native (Expo), TypeScript, Tailwind CSS (NativeWind) |
| 🗺️ **Maps** | Google Maps API, react-native-maps |
| 📡 **Location Services** | Expo Location, Geofencing APIs |
| 🔕 **System Access** | Android DND Mode, Background Services |
| 💾 **Storage** | AsyncStorage |
| ⚛️ **State Management** | Context API / Zustand |
| 🧰 **Utilities** | Expo Permissions, React Navigation, Expo Notifications |

---

## 🖥️ User Interface Overview

### 🏠 Home Screen
- Real-time status of device mode  
- Quick toggle for SilentZone  
- Live location summary  
- Hamburger menu access  

### 🗺️ Maps Screen
- Interactive map view  
- Silent zone markers (auto & manual)  
- Add/remove custom zones  

### 📍 Zones Screen
- List view of saved zones  
- Zone cards showing type, radius, and trigger time  
- Edit or delete zone options  

### 🔔 Notifications / History
- Log of all silent activations  
- Icons showing type of zone entered/exited  
- Timestamp of each event  

### ⚙️ Settings Screen
- Location check interval  
- Mode preferences (Silent/Vibrate)  
- Theme toggle  
- Permission management  

### ❓ Help Screen
- User guide and FAQs  
- Support and contact links  
- About section  

---

## 🧭 Project Structure

```

SilentZone/
├── assets/               # App icons, images
├── components/           # Reusable UI components
├── screens/              # App screens (Home, Maps, Zones, etc.)
├── navigation/           # Stack & Drawer navigation
├── context/              # Global app context
├── utils/                # Helper functions (location, permissions)
├── hooks/                # Custom React hooks
├── App.tsx               # Entry point
└── tailwind.config.js    # Tailwind setup

````

---

## 🚀 Getting Started

### 🧱 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/SilentZone.git
cd SilentZone
````

### ⚙️ 2️⃣ Install Dependencies

```bash
npm install
```

### ▶️ 3️⃣ Start the App

```bash
npx expo start
```

### 🔑 4️⃣ Configure Google Maps

Create a `.env` file and add:

```bash
GOOGLE_MAPS_API_KEY=your_key_here
```

---

## 🧾 Permissions Required

* 📍 Location (Foreground + Background)
* 🔕 Do Not Disturb Access
* 🌐 Network Access
* 🗺️ Google Maps API

---

## 🧰 Build Commands

| Platform   | Command                |
| ---------- | ---------------------- |
| 📱 Android | `npx expo run:android` |
| 🍏 iOS     | `npx expo run:ios`     |
| 🌍 Web     | `npx expo start --web` |

---

## 🧑‍💻 Developer

**👤 Orion Sandaru (Orion343Dream)**
🔗 [GitHub Profile](https://github.com/orion343dream)
💬 Passionate about intelligent automation and seamless UX systems.

---

## 🧡 Support the Project

<p align="center">
  <a href="https://github.com/your-username/SilentZone" target="_blank">
    <img src="https://img.shields.io/badge/⭐️-Star%20the%20Repo-blue?style=for-the-badge" />
  </a>
  <a href="#-getting-started" target="_blank">
    <img src="https://img.shields.io/badge/⚙️-Get%20Started-green?style=for-the-badge" />
  </a>
  <a href="#-tech-stack" target="_blank">
    <img src="https://img.shields.io/badge/🧩-Tech%20Stack-purple?style=for-the-badge" />
  </a>
  <a href="#-user-interface-overview" target="_blank">
    <img src="https://img.shields.io/badge/📱-UI%20Screens-orange?style=for-the-badge" />
  </a>
</p>

---

## 📜 License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute with proper attribution.

---

## 🖼️ App Preview

> *(Add screenshots for visual appeal)*

```
📸 assets/screenshots/splash.png  
📸 assets/screenshots/home.png  
📸 assets/screenshots/map.png
```

---

<p align="center">
  <a href="https://github.com/your-username/SilentZone" target="_blank">
    <img src="https://img.shields.io/badge/💤_View_on_GitHub-Click%20Here-black?style=for-the-badge&logo=github" />
  </a>
</p>
```

Would you like me to generate this as a **ready-to-upload `README.md` file** (with Markdown formatting preserved and all badges active)?

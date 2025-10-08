import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});error 

// Request permissions if not already done (but permissions are handled in permissionService)

export const sendZoneNotification = async (title: string, body: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: null, // Immediate
  });
};

export const sendEntryNotification = async (zoneName: string) => {
  await sendZoneNotification('Silent Zone Entered', `You have entered "${zoneName}". Switching to Silent Mode.`);
};

export const sendExitNotification = async (zoneName: string) => {
  await sendZoneNotification('Left Silent Zone', `You have left "${zoneName}". Restoring normal sound.`);
};
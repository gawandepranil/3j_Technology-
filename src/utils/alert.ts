import { Alert as RNAlert, Platform } from 'react-native';

export const Alert = {
  alert: (
    title: string,
    message?: string,
    buttons?: Array<{
      text?: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>,
    options?: any
  ) => {
    if (Platform.OS === 'web') {
      const formattedMessage = message ? `\n\n${message}` : '';
      const promptText = `${title}${formattedMessage}`;

      if (buttons && buttons.length > 0) {
        const cancelBtn = buttons.find((b) => b.style === 'cancel');
        const otherBtns = buttons.filter((b) => b.style !== 'cancel');
        const isConfirm = buttons.length > 1;

        if (isConfirm) {
          const result = window.confirm(promptText);
          if (result) {
            const primaryBtn = otherBtns[0] || buttons[0];
            if (primaryBtn && primaryBtn.onPress) {
              primaryBtn.onPress();
            }
          } else {
            if (cancelBtn && cancelBtn.onPress) {
              cancelBtn.onPress();
            }
          }
        } else {
          window.alert(promptText);
          const singleBtn = buttons[0];
          if (singleBtn && singleBtn.onPress) {
            singleBtn.onPress();
          }
        }
      } else {
        window.alert(promptText);
      }
    } else {
      RNAlert.alert(title, message, buttons, options);
    }
  },
};

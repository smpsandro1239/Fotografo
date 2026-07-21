import { useEffect } from 'react';
import * as ScreenCapture from 'expo-screen-capture';

interface ScreenshotProtectProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function ScreenshotProtect({ children, enabled = true }: ScreenshotProtectProps) {
  useEffect(() => {
    if (enabled) {
      const subscription = ScreenCapture.preventScreenCaptureAsync();
      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    }
  }, [enabled]);

  return <>{children}</>;
}

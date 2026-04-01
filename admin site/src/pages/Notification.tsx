import React, { useCallback, useEffect, useState, useRef } from "react";

// Type for appointments
type Appointment = {
  id: string;
  child: string;
  vaccine: string;
  dueDate: string; // ISO string
};

const NotificationPages: React.FC = () => {
  const [appointments] = useState<Appointment[]>([
    {
      id: "1",
      child: "Liam",
      vaccine: "MMR Vaccine",
      dueDate: new Date(new Date().getTime() + 30 * 1000).toISOString(), // 30 sec from now
    },
    {
      id: "2",
      child: "Emma",
      vaccine: "Annual Checkup",
      dueDate: new Date(new Date().getTime() + 90 * 1000).toISOString(), // 90 sec from now
    },
  ]);

  const [canPlaySound, setCanPlaySound] = useState(false);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const notificationSentRef = useRef<Set<string>>(new Set()); // Track which notifications were sent
  const audioContextRef = useRef<AudioContext | null>(null);
  const fallbackAlarmIntervalRef = useRef<number | null>(null);

  const playFallbackBeep = useCallback(
    async (durationMs = 350, frequency = 880) => {
      try {
        const AudioCtx =
          window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) {
          return;
        }

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioCtx();
        }

        const ctx = audioContextRef.current;
        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.value = 0.15;

        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        oscillator.stop(ctx.currentTime + durationMs / 1000);
      } catch (error) {
        console.log("Fallback beep failed:", error);
      }
    },
    [],
  );

  const startFallbackAlarm = useCallback(async () => {
    if (fallbackAlarmIntervalRef.current) {
      return;
    }

    await playFallbackBeep(450, 900);
    fallbackAlarmIntervalRef.current = window.setInterval(() => {
      void playFallbackBeep(300, 760);
    }, 900);
  }, [playFallbackBeep]);

  // Initialize audio on component mount
  useEffect(() => {
    // Create audio element with correct public folder path
    alarmRef.current = new Audio("/alarm.mp3");
    alarmRef.current.preload = "auto";
    alarmRef.current.volume = 1;
    alarmRef.current.muted = false;
    alarmRef.current.load();

    // Clean up on unmount
    return () => {
      if (fallbackAlarmIntervalRef.current) {
        window.clearInterval(fallbackAlarmIntervalRef.current);
        fallbackAlarmIntervalRef.current = null;
      }

      if (alarmRef.current) {
        alarmRef.current.pause();
        alarmRef.current = null;
      }

      if (audioContextRef.current) {
        void audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Request notification permission once
  useEffect(() => {
    if (
      Notification.permission !== "granted" &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission();
    }
  }, []);

  // Notification + Alarm logic
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();

      appointments.forEach((appt) => {
        const due = new Date(appt.dueDate);
        const diffSeconds = (due.getTime() - now.getTime()) / 1000;

        // Create a unique key for this appointment to avoid duplicate notifications
        const notificationKey = `${appt.id}-${Math.floor(due.getTime() / 60000)}`; // Group by minute

        // Trigger if due in next 1 minute and not already notified for this time window
        if (
          diffSeconds > 0 &&
          diffSeconds <= 60 &&
          !notificationSentRef.current.has(notificationKey)
        ) {
          try {
            // Show browser notification only when permission is granted.
            if (Notification.permission === "granted") {
              new Notification(`Reminder: ${appt.child} - ${appt.vaccine}`, {
                body: `Due at ${due.toLocaleTimeString()}`,
                icon: "/favicon.ico", // Optional: add an icon
              });
            }

            // Mark as sent
            notificationSentRef.current.add(notificationKey);

            // Play sound if enabled (independent from notification permission)
            if (canPlaySound && alarmRef.current) {
              // Stop any currently playing sound first
              alarmRef.current.pause();
              alarmRef.current.currentTime = 0;

              // Play the sound
              alarmRef.current.loop = true;
              alarmRef.current
                .play()
                .then(() => {
                  console.log("Alarm playing for:", appt.child);
                })
                .catch((error) => {
                  console.log("Audio play failed, using fallback beep:", error);
                  void startFallbackAlarm();
                });
            }
          } catch (error) {
            console.error("Notification/alarm error:", error);
          }
        }

        // Clean up old notification keys (older than 5 minutes)
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
        notificationSentRef.current.forEach((key) => {
          // Parse the timestamp from the key (assuming format: id-timestamp)
          const keyParts = key.split("-");
          if (keyParts.length > 1) {
            const keyTimestamp = parseInt(keyParts[1]) * 60000; // Convert minutes back to ms
            if (keyTimestamp < fiveMinutesAgo.getTime()) {
              notificationSentRef.current.delete(key);
            }
          }
        });
      });
    };

    // Initial check
    checkReminders();

    // Set up interval
    const interval = setInterval(checkReminders, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [appointments, canPlaySound, startFallbackAlarm]);

  // Stop alarm function
  const stopAlarm = () => {
    if (fallbackAlarmIntervalRef.current) {
      window.clearInterval(fallbackAlarmIntervalRef.current);
      fallbackAlarmIntervalRef.current = null;
    }

    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
      console.log("Alarm stopped");
    }
  };

  const toggleSoundNotifications = () => {
    setCanPlaySound((prev) => {
      const next = !prev;

      if (!next) {
        stopAlarm();
      } else if (alarmRef.current) {
        // User interaction here allows us to confirm sound is working immediately.
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;
        alarmRef.current.loop = false;
        alarmRef.current
          .play()
          .then(() => {
            setTimeout(() => {
              if (alarmRef.current) {
                alarmRef.current.pause();
                alarmRef.current.currentTime = 0;
              }
            }, 1200);
          })
          .catch((error) => {
            console.log(
              "Enable sound preview failed, using fallback beep:",
              error,
            );
            void playFallbackBeep(450, 920);
          });
      }

      return next;
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Appointment Notifications</h2>

      <div className="flex gap-3 mb-4 items-center flex-wrap">
        <button
          type="button"
          role="switch"
          aria-checked={canPlaySound}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            canPlaySound
              ? "bg-green-600 focus:ring-green-500"
              : "bg-gray-400 focus:ring-gray-500"
          }`}
          onClick={toggleSoundNotifications}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow transition-transform ${
              canPlaySound ? "translate-x-9" : "translate-x-1"
            }`}
          />
        </button>
        <span className="text-xs font-medium text-gray-700">
          Sound Alerts: {canPlaySound ? "ON" : "OFF"}
        </span>

        {/* Button to stop alarm */}
        <button
          className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          onClick={stopAlarm}
        >
          Stop Alarm
        </button>
      </div>

      {/* Info message */}
      <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-medium">⚠️ Setup Instructions:</p>
        <p>
          1. Make sure you have an alarm.mp3 file in your{" "}
          <strong>public</strong> folder
        </p>
        <p>2. Use the ON/OFF button to enable or disable sound alerts</p>
        <p>3. Turning ON will play a short sound to confirm audio is working</p>
        <p>
          4. Notifications will appear for appointments due within 60 seconds
        </p>
      </div>

      <ul className="space-y-3">
        {appointments.map((appt) => {
          const dueDate = new Date(appt.dueDate);
          const now = new Date();
          const diffSeconds = Math.round(
            (dueDate.getTime() - now.getTime()) / 1000,
          );
          const isDue = diffSeconds > 0 && diffSeconds <= 60;

          return (
            <li
              key={appt.id}
              className={`p-4 bg-white shadow rounded flex justify-between items-center ${
                isDue ? "border-2 border-orange-500" : ""
              }`}
            >
              <div>
                <p className="font-medium">
                  {appt.child} - {appt.vaccine}
                  {isDue && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      Due soon! ({diffSeconds}s)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-600">
                  Due: {dueDate.toLocaleTimeString()}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NotificationPages;

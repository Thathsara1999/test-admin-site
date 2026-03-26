import React, { useEffect, useState, useRef } from "react";

// Type for appointments
type Appointment = {
  id: string;
  child: string;
  vaccine: string;
  dueDate: string; // ISO string
};

const NotificationPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([
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

  // Initialize audio on component mount
  useEffect(() => {
    // Create audio element with correct public folder path
    alarmRef.current = new Audio("/alarm.mp3"); // Just /alarm.mp3, not "../../../public/alarm.mp3"
    alarmRef.current.load();

    // Clean up on unmount
    return () => {
      if (alarmRef.current) {
        alarmRef.current.pause();
        alarmRef.current = null;
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
          // Send notification
          if (Notification.permission === "granted") {
            try {
              const notification = new Notification(
                `Reminder: ${appt.child} - ${appt.vaccine}`,
                {
                  body: `Due at ${due.toLocaleTimeString()}`,
                  icon: "/favicon.ico", // Optional: add an icon
                },
              );

              // Mark as sent
              notificationSentRef.current.add(notificationKey);

              // Play sound if enabled
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
                    console.log("Audio play failed:", error);
                    // Browser might require user interaction first
                  });
              }
            } catch (error) {
              console.error("Notification error:", error);
            }
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
  }, [appointments, canPlaySound]);

  // Stop alarm function
  const stopAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
      console.log("Alarm stopped");
    }
  };

  // Function to test sound manually
  const testSound = async () => {
    if (alarmRef.current) {
      try {
        alarmRef.current.loop = false; // Don't loop for test
        alarmRef.current.currentTime = 0;
        await alarmRef.current.play();
        console.log("Test sound played");

        // Auto-stop after 2 seconds
        setTimeout(() => {
          if (alarmRef.current) {
            alarmRef.current.pause();
            alarmRef.current.currentTime = 0;
          }
        }, 2000);
      } catch (error) {
        console.error("Test sound failed:", error);
        alert(
          "Sound test failed. Make sure alarm.mp3 exists in the public folder.",
        );
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">
        Appointment Notifications (Test)
      </h2>

      <div className="flex gap-4 mb-4">
        {/* Button to allow sound */}
        {!canPlaySound ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setCanPlaySound(true)}
          >
            Enable Sound & Notifications
          </button>
        ) : (
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded">
            ✓ Sound & Notifications Enabled
          </span>
        )}

        {/* Button to stop alarm */}
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={stopAlarm}
        >
          Stop Alarm
        </button>

        {/* Test sound button */}
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          onClick={testSound}
        >
          Test Sound
        </button>
      </div>

      {/* Info message */}
      <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <p className="font-medium">⚠️ Setup Instructions:</p>
        <p>
          1. Make sure you have an alarm.mp3 file in your{" "}
          <strong>public</strong> folder
        </p>
        <p>2. Click "Enable Sound & Notifications" to allow notifications</p>
        <p>3. Click "Test Sound" to verify audio is working</p>
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

export default NotificationPage;

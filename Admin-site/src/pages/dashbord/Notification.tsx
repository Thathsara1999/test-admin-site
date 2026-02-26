// import React, { useState } from "react";
// import {
//   Heart,
//   Syringe,
//   Calendar,
//   Activity,
//   FileText,
//   Baby,
// } from "lucide-react";

// export default function Notification() {
//   const [selectedChild, setSelectedChild] = useState(null);

//   const childrenData = [
//     {
//       name: "Emma Johnson",
//       age: "3 years",
//       photo: "👧",
//       status: "All up to date",
//       statusColor: "text-green-500",
//       statusColorText: "text-green-600",
//     },
//     {
//       name: "Liam Johnson",
//       age: "6 months",
//       photo: "👶",
//       status: "1 vaccine due",
//       statusColor: "text-orange-500",
//       statusColorText: "text-orange-600",
//     },
//   ];

//   const upcomingVaccinations = [
//     {
//       child: "Liam",
//       vaccine: "MMR Vaccine",
//       dueDate: "March 25, 2026",
//       color: "orange",
//     },
//     {
//       child: "Emma",
//       vaccine: "Annual Checkup",
//       dueDate: "April 10, 2026",
//       color: "blue",
//     },
//   ];

//   const quickStats = [
//     {
//       title: "Upcoming Appointments",
//       value: 2,
//       colorFrom: "from-blue-500",
//       colorTo: "to-blue-600",
//     },
//     {
//       title: "Vaccines Completed",
//       value: 12,
//       colorFrom: "from-green-500",
//       colorTo: "to-green-600",
//     },
//     {
//       title: "Medical Records",
//       value: 8,
//       colorFrom: "from-purple-500",
//       colorTo: "to-purple-600",
//     },
//   ];

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Welcome */}
//       <div className="mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">
//           Welcome back, Nawanka!
//         </h2>
//         <p className="text-gray-600">
//           Here's an overview of your children's health
//         </p>
//       </div>

//       {/* Children Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//         {childrenData.map((child, idx) => (
//           <div
//             key={idx}
//             className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-blue-300"
//           >
//             <div className="flex items-center mb-4">
//               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mr-4">
//                 {child.photo}
//               </div>
//               <div>
//                 <h3 className="font-bold text-gray-800">{child.name}</h3>
//                 <p className="text-sm text-gray-600">{child.age}</p>
//               </div>
//             </div>
//             <div className="flex items-center text-sm">
//               <Heart className={`w-4 h-4 mr-2 ${child.statusColor}`} />
//               <span className={child.statusColorText}>{child.status}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Upcoming Vaccinations */}
//       <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//         <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//           <Syringe className="w-5 h-5 mr-2 text-blue-600" />
//           Upcoming Vaccinations
//         </h3>
//         <div className="space-y-3">
//           {upcomingVaccinations.map((item, idx) => (
//             <div
//               key={idx}
//               className={`flex items-center justify-between p-4 rounded-lg ${item.color === "orange" ? "bg-orange-50 border-l-4 border-orange-500" : "bg-blue-50 border-l-4 border-blue-500"}`}
//             >
//               <div>
//                 <p className="font-medium text-gray-800">
//                   {item.child} - {item.vaccine}
//                 </p>
//                 <p className="text-sm text-gray-600">Due: {item.dueDate}</p>
//               </div>
//               <button
//                 className={`px-4 py-2 rounded-lg text-white text-sm ${item.color === "orange" ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-500 hover:bg-blue-600"}`}
//               >
//                 Schedule
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Quick Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {quickStats.map((stat, idx) => (
//           <div
//             key={idx}
//             className={`bg-gradient-to-br ${stat.colorFrom} ${stat.colorTo} rounded-xl shadow-md p-6 text-white`}
//           >
//             {stat.title === "Upcoming Appointments" && (
//               <Calendar className="w-8 h-8 mb-2 opacity-80" />
//             )}
//             {stat.title === "Vaccines Completed" && (
//               <Activity className="w-8 h-8 mb-2 opacity-80" />
//             )}
//             {stat.title === "Medical Records" && (
//               <FileText className="w-8 h-8 mb-2 opacity-80" />
//             )}
//             <p className="text-3xl font-bold">{stat.value}</p>
//             <p className="text-sm opacity-90">{stat.title}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// src/NotificationPage.tsx
// src/NotificationPage.tsx
// import React, { useEffect, useState } from "react";
// import { db } from "../../firebase"; // your initialized Firebase app
// import {
//   collection,
//   getDocs,
//   QuerySnapshot,
//   DocumentData,
// } from "firebase/firestore";

// // Type for appointments
// type Appointment = {
//   id: string;
//   child: string;
//   vaccine: string;
//   dueDate: string; // ISO 8601 UTC string
// };

// const NotificationPage: React.FC = () => {
//   const [appointments, setAppointments] = useState<Appointment[]>([]);

//   // Notification + Alarm Hook
//   const useNotifications = (
//     appointments: Appointment[],
//     checkInterval = 10 * 1000, // 10 seconds for testing
//   ) => {
//     useEffect(() => {
//       const alarm = new Audio("../../../public/alarm.mp3"); // public folder

//       const checkReminders = () => {
//         const now = new Date();
//         appointments.forEach((appt) => {
//           const due = new Date(appt.dueDate);
//           const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);

//           // Trigger if due in next 24 hours
//           if (diffHours > 0 && diffHours <= 24) {
//             if (Notification.permission === "granted") {
//               new Notification(`Reminder: ${appt.child} - ${appt.vaccine}`, {
//                 body: `Due on ${due.toLocaleString()}`,
//               });
//               alarm.play();
//             }
//           }
//         });
//       };

//       // Initial check
//       checkReminders();
//       // Set interval
//       const interval = setInterval(checkReminders, checkInterval);

//       return () => clearInterval(interval);
//     }, [appointments, checkInterval]);
//   };

//   useEffect(() => {
//     // Request notification permission if not granted
//     if (Notification.permission !== "granted") {
//       Notification.requestPermission();
//     }

//     // Fetch appointments from Firestore
//     const fetchAppointments = async () => {
//       try {
//         const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
//           collection(db, "appointments"),
//         );

//         const data: Appointment[] = [];
//         querySnapshot.forEach((doc) => {
//           data.push({ id: doc.id, ...doc.data() } as Appointment);
//         });

//         setAppointments(data);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   // Start notifications hook
//   useNotifications(appointments, 10 * 1000); // 10 sec interval for testing

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">Appointment Notifications</h2>
//       <ul className="space-y-3">
//         {appointments.map((appt) => (
//           <li
//             key={appt.id}
//             className="p-4 bg-white shadow rounded flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">
//                 {appt.child} - {appt.vaccine}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Due: {new Date(appt.dueDate).toLocaleString()}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NotificationPage;

// src/NotificationPage.tsx
// import React, { useEffect, useState } from "react";

// // Type for appointments
// type Appointment = {
//   id: string;
//   child: string;
//   vaccine: string;
//   dueDate: string; // ISO string
// };

// const NotificationPage: React.FC = () => {
//   const [appointments, setAppointments] = useState<Appointment[]>([
//     {
//       id: "1",
//       child: "Liam",
//       vaccine: "MMR Vaccine",
//       // set dueDate a few seconds/minutes ahead of current time for testing
//       dueDate: new Date(new Date().getTime() + 30 * 1000).toISOString(), // 30 sec from now
//     },
//     {
//       id: "2",
//       child: "Emma",
//       vaccine: "Annual Checkup",
//       dueDate: new Date(new Date().getTime() + 90 * 1000).toISOString(), // 1.5 min from now
//     },
//   ]);

//   // Notification + Alarm Hook
//   const useNotifications = (
//     appointments: Appointment[],
//     checkInterval = 5000, // 5 seconds for testing
//   ) => {
//     useEffect(() => {
//       const alarm = new Audio("../../../public/alarm.mp3"); // put alarm.mp3 in public folder

//       const checkReminders = () => {
//         const now = new Date();
//         appointments.forEach((appt) => {
//           const due = new Date(appt.dueDate);
//           const diffSeconds = (due.getTime() - now.getTime()) / 1000;

//           if (diffSeconds > 0 && diffSeconds <= 60) {
//             // trigger if due in next 1 minute
//             if (Notification.permission === "granted") {
//               new Notification(`Reminder: ${appt.child} - ${appt.vaccine}`, {
//                 body: `Due at ${due.toLocaleTimeString()}`,
//               });
//               alarm.play();
//             }
//           }
//         });
//       };

//       checkReminders(); // initial check
//       const interval = setInterval(checkReminders, checkInterval);
//       return () => clearInterval(interval);
//     }, [appointments, checkInterval]);
//   };

//   useEffect(() => {
//     if (Notification.permission !== "granted") {
//       Notification.requestPermission();
//     }
//   }, []);

//   useNotifications(appointments, 5000); // check every 5 seconds

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">
//         Appointment Notifications (Test)
//       </h2>
//       <ul className="space-y-3">
//         {appointments.map((appt) => (
//           <li
//             key={appt.id}
//             className="p-4 bg-white shadow rounded flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">
//                 {appt.child} - {appt.vaccine}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Due: {new Date(appt.dueDate).toLocaleTimeString()}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NotificationPage;

// src/NotificationPage.tsx
// import React, { useEffect, useState } from "react";

// // Type for appointments
// type Appointment = {
//   id: string;
//   child: string;
//   vaccine: string;
//   dueDate: string; // ISO string
// };

// const NotificationPage: React.FC = () => {
//   // Hardcoded test data
//   const [appointments, setAppointments] = useState<Appointment[]>([
//     {
//       id: "1",
//       child: "Liam",
//       vaccine: "MMR Vaccine",
//       dueDate: new Date(new Date().getTime() + 30 * 1000).toISOString(), // 30 sec from now
//     },
//     {
//       id: "2",
//       child: "Emma",
//       vaccine: "Annual Checkup",
//       dueDate: new Date(new Date().getTime() + 90 * 1000).toISOString(), // 90 sec from now
//     },
//   ]);

//   const [canPlaySound, setCanPlaySound] = useState(false);

//   // Notification + Alarm Hook
//   const useNotifications = (
//     appointments: Appointment[],
//     checkInterval = 5000, // check every 5 sec
//   ) => {
//     useEffect(() => {
//       const alarm = new Audio("../../Alarm/alarm.mp3"); // must be in public folder
//       alarm.load(); // preload sound

//       const checkReminders = () => {
//         const now = new Date();
//         appointments.forEach((appt) => {
//           const due = new Date(appt.dueDate);
//           const diffSeconds = (due.getTime() - now.getTime()) / 1000;

//           // Trigger if due in next 1 minute
//           if (diffSeconds > 0 && diffSeconds <= 60) {
//             if (Notification.permission === "granted") {
//               new Notification(`Reminder: ${appt.child} - ${appt.vaccine}`, {
//                 body: `Due at ${due.toLocaleTimeString()}`,
//               });
//               if (canPlaySound) alarm.play();
//             }
//           }
//         });
//       };

//       checkReminders(); // initial check
//       const interval = setInterval(checkReminders, checkInterval);

//       return () => clearInterval(interval);
//     }, [appointments, canPlaySound, checkInterval]);
//   };

//   // Request notification permission once
//   useEffect(() => {
//     if (Notification.permission !== "granted") {
//       Notification.requestPermission();
//     }
//   }, []);

//   // Start notifications hook
//   useNotifications(appointments, 5000);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <h2 className="text-2xl font-bold mb-4">
//         Appointment Notifications (Test)
//       </h2>

//       {/* Button to allow sound */}
//       {!canPlaySound && (
//         <button
//           className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
//           onClick={() => setCanPlaySound(true)}
//         >
//           Start Notifications (Enable Sound)
//         </button>
//       )}

//       <ul className="space-y-3">
//         {appointments.map((appt) => (
//           <li
//             key={appt.id}
//             className="p-4 bg-white shadow rounded flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">
//                 {appt.child} - {appt.vaccine}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Due: {new Date(appt.dueDate).toLocaleTimeString()}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default NotificationPage;

// src/NotificationPage.tsx
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
  const alarmRef = useRef<HTMLAudioElement | null>(null); // keep reference to audio

  // Notification + Alarm Hook
  const useNotifications = (
    appointments: Appointment[],
    checkInterval = 5000, // check every 5 sec
  ) => {
    useEffect(() => {
      // Initialize alarm audio
      if (!alarmRef.current) {
        alarmRef.current = new Audio("../../../public/alarm.mp3"); // must be in public folder
        alarmRef.current.load();
      }

      const checkReminders = () => {
        const now = new Date();
        appointments.forEach((appt) => {
          const due = new Date(appt.dueDate);
          const diffSeconds = (due.getTime() - now.getTime()) / 1000;

          // Trigger if due in next 1 minute
          if (diffSeconds > 0 && diffSeconds <= 60) {
            if (Notification.permission === "granted") {
              new Notification(`Reminder: ${appt.child} - ${appt.vaccine}`, {
                body: `Due at ${due.toLocaleTimeString()}`,
              });
              if (canPlaySound && alarmRef.current) {
                alarmRef.current.loop = true; // keep playing until stopped
                alarmRef.current.play().catch(() => {
                  console.log("Audio play blocked by browser");
                });
              }
            }
          }
        });
      };

      checkReminders();
      const interval = setInterval(checkReminders, checkInterval);
      return () => clearInterval(interval);
    }, [appointments, canPlaySound, checkInterval]);
  };

  // Request notification permission once
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Start notifications hook
  useNotifications(appointments, 5000);

  // Stop alarm function
  const stopAlarm = () => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">
        Appointment Notifications (Test)
      </h2>

      {/* Button to allow sound */}
      {!canPlaySound && (
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCanPlaySound(true)}
        >
          Start Notifications (Enable Sound)
        </button>
      )}

      {/* Button to stop alarm */}
      <button
        className="mb-4 ml-4 px-4 py-2 bg-red-500 text-white rounded"
        onClick={stopAlarm}
      >
        Stop Alarm
      </button>

      <ul className="space-y-3">
        {appointments.map((appt) => (
          <li
            key={appt.id}
            className="p-4 bg-white shadow rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">
                {appt.child} - {appt.vaccine}
              </p>
              <p className="text-sm text-gray-600">
                Due: {new Date(appt.dueDate).toLocaleTimeString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;

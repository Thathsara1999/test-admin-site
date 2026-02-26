// import {
//     BabyInput,
//     BirthRegistrationInput,
//     ChatInput,
//     DashboardData,
//     GrowthAnalysisInput,
//     ImmunizationRecordInput,
//     MedicalReportInput,
//     NeonatalExamInput,
//     NotificationItem,
// } from "../admin/types";
// import { AdminDataService } from "../services/adminDataService";

// const asString = (value: unknown): string => {
//     if (typeof value !== "string") {
//         return "";
//     }
//     return value.trim();
// };

// export class AdminBusinessLogic {
//     constructor(private readonly dataService: AdminDataService) { }

//     async createBaby(ownerId: string, payload: BabyInput) {
//         if (!asString(payload.babyName) || !asString(payload.babyBday)) {
//             throw new Error("babyName and babyBday are required");
//         }

//         return this.dataService.create(
//             this.dataService.collectionNames.babies,
//             ownerId,
//             payload,
//         );
//     }

//     async createBirthRegistration(ownerId: string, payload: BirthRegistrationInput) {
//         if (!asString(payload.babyName) || !asString(payload.registrationNumber)) {
//             throw new Error("babyName and registrationNumber are required");
//         }

//         return this.dataService.create(
//             this.dataService.collectionNames.birthRegistrations,
//             ownerId,
//             payload,
//         );
//     }

//     async createNeonatalExamination(ownerId: string, payload: NeonatalExamInput) {
//         if (!asString(payload.date)) {
//             throw new Error("date is required");
//         }

//         return this.dataService.create(
//             this.dataService.collectionNames.neonatalExams,
//             ownerId,
//             payload,
//         );
//     }

//     async addImmunizationRecord(ownerId: string, payload: ImmunizationRecordInput) {
//         if (!asString(payload.childId) || !asString(payload.vaccineType)) {
//             throw new Error("childId and vaccineType are required");
//         }

//         return this.dataService.create(
//             this.dataService.collectionNames.immunizations,
//             ownerId,
//             payload,
//         );
//     }

//     async saveGrowthAnalysis(ownerId: string, payload: GrowthAnalysisInput) {
//         if (!asString(payload.childId) || !asString(payload.measurementDate)) {
//             throw new Error("childId and measurementDate are required");
//         }

//         return this.dataService.create(
//             this.dataService.collectionNames.growth,
//             ownerId,
//             payload,
//         );
//     }

//     async createMedicalReport(ownerId: string, payload: MedicalReportInput) {
//         if (!asString(payload.childId) || !asString(payload.name)) {
//             throw new Error("childId and name are required");
//         }

//         return this.dataService.create(
//             this.dataService.collectionNames.reports,
//             ownerId,
//             payload,
//         );
//     }

//     async sendChatMessage(ownerId: string, payload: ChatInput) {
//         const message = asString(payload.message);
//         if (!message) {
//             throw new Error("message is required");
//         }

//         const saved = await this.dataService.create(
//             this.dataService.collectionNames.chats,
//             ownerId,
//             {
//                 childId: payload.childId ?? null,
//                 from: "user",
//                 message,
//             },
//         );

//         const botReply =
//             "Thanks, I recorded your message. We will remind you before due dates.";

//         await this.dataService.create(this.dataService.collectionNames.chats, ownerId, {
//             childId: payload.childId ?? null,
//             from: "bot",
//             message: botReply,
//         });

//         return {
//             userMessage: saved,
//             botReply,
//         };
//     }

//     async getDashboardData(ownerId: string): Promise<DashboardData> {
//         const [upcomingVaccinations, upcomingAppointments, vaccinesCompleted, medicalRecords] =
//             await Promise.all([
//                 this.dataService.countByOwner(this.dataService.collectionNames.immunizations, ownerId),
//                 this.dataService.countByOwner(this.dataService.collectionNames.birthRegistrations, ownerId),
//                 this.dataService.countByOwner(this.dataService.collectionNames.neonatalExams, ownerId),
//                 this.dataService.countByOwner(this.dataService.collectionNames.reports, ownerId),
//             ]);

//         return {
//             // upcomingVaccinations,
//             upcomingAppointments,
//             vaccinesCompleted,
//             medicalRecords,
//         };
//     }

//     async getNotifications(ownerId: string): Promise<NotificationItem[]> {
//         const immunizations = await this.dataService.listByOwner<ImmunizationRecordInput>(
//             this.dataService.collectionNames.immunizations,
//             ownerId,
//             10,
//         );

//         return immunizations.map((item) => ({
//             id: item.id,
//             title: `${item.vaccineType} due for child ${item.childId}`,
//             dueDate: item.nextDue,
//             severity: item.nextDue ? "warning" : "info",
//         }));
//     }

//     async getChildProfile(ownerId: string, childId: string) {
//         const child = await this.dataService.getById<BabyInput>(
//             this.dataService.collectionNames.babies,
//             childId,
//         );

//         if (!child || (child as { ownerId?: string }).ownerId !== ownerId) {
//             throw new Error("Child not found");
//         }

//         const [immunizations, growthHistory, reports] = await Promise.all([
//             this.dataService.listByOwner<ImmunizationRecordInput>(
//                 this.dataService.collectionNames.immunizations,
//                 ownerId,
//                 100,
//             ),
//             this.dataService.listByOwner<GrowthAnalysisInput>(
//                 this.dataService.collectionNames.growth,
//                 ownerId,
//                 100,
//             ),
//             this.dataService.listByOwner<MedicalReportInput>(
//                 this.dataService.collectionNames.reports,
//                 ownerId,
//                 100,
//             ),
//         ]);

//         return {
//             child,
//             immunizations: immunizations.filter((item) => item.childId === childId),
//             growthHistory: growthHistory.filter((item) => item.childId === childId),
//             reports: reports.filter((item) => item.childId === childId),
//         };
//     }
// }

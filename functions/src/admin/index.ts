// import { onRequest } from "firebase-functions/v2/https";
// import { Request, Response } from "express";
// import { AdminBusinessLogic } from "../business-logics/adminBusinessLogic";
// import { AdminDataService } from "../services/adminDataService";
// import {
//     BabyInput,
//     BirthRegistrationInput,
//     ChatInput,
//     GrowthAnalysisInput,
//     ImmunizationRecordInput,
//     MedicalReportInput,
//     NeonatalExamInput,
// } from "./types";
// import { allowMethods, getBodyObject, getUidFromBearerToken, requireString } from "./http";

// const businessLogic = new AdminBusinessLogic(new AdminDataService());

// const withHandler = (
//     allowedMethods: string[],
//     handler: (request: Request, response: Response, uid: string) => Promise<void>,
// ) => onRequest({ cors: true }, async (request: Request, response: Response) => {
//     if (!allowMethods(request, response, allowedMethods)) {
//         return;
//     }

//     const uid = await getUidFromBearerToken(request, response);
//     if (!uid) {
//         return;
//     }

//     try {
//         await handler(request, response, uid);
//     } catch (error) {
//         const message = error instanceof Error ? error.message : "Unexpected error";
//         response.status(400).json({ message });
//     }
// });

// export const createBaby = withHandler(["POST"], async (request, response, uid) => {
//     const body = getBodyObject(request.body);
//     const payload: BabyInput = {
//         babyName: requireString(body.babyName, "babyName"),
//         babyBday: requireString(body.babyBday, "babyBday"),
//         motherName: requireString(body.motherName, "motherName"),
//         hospital: requireString(body.hospital, "hospital"),
//         notes: typeof body.notes === "string" ? body.notes : undefined,
//     };

//     const created = await businessLogic.createBaby(uid, payload);
//     response.status(201).json(created);
// });

// export const createBirthRegistration = withHandler(["POST"], async (request, response, uid) => {
//     const body = getBodyObject(request.body);
//     const payload: BirthRegistrationInput = {
//         ...body,
//         babyName: requireString(body.babyName, "babyName"),
//         registrationNumber: requireString(body.registrationNumber, "registrationNumber"),
//         dateOfBirth: requireString(body.dateOfBirth, "dateOfBirth"),
//     };

//     const created = await businessLogic.createBirthRegistration(uid, payload);
//     response.status(201).json(created);
// });

// export const createNeonatalExamination = withHandler(["POST"], async (request, response, uid) => {
//     const body = getBodyObject(request.body);
//     const payload: NeonatalExamInput = {
//         ...body,
//         date: requireString(body.date, "date"),
//     };

//     const created = await businessLogic.createNeonatalExamination(uid, payload);
//     response.status(201).json(created);
// });

// export const addImmunizationRecord = withHandler(["POST"], async (request, response, uid) => {
//     const body = getBodyObject(request.body);
//     const payload: ImmunizationRecordInput = {
//         childId: requireString(body.childId, "childId"),
//         age: requireString(body.age, "age"),
//         vaccineType: requireString(body.vaccineType, "vaccineType"),
//         date: requireString(body.date, "date"),
//         batchNo: typeof body.batchNo === "string" ? body.batchNo : undefined,
//         givenBy: typeof body.givenBy === "string" ? body.givenBy : undefined,
//         nextDue: typeof body.nextDue === "string" ? body.nextDue : undefined,
//     };

//     const created = await businessLogic.addImmunizationRecord(uid, payload);
//     response.status(201).json(created);
// });

// export const saveGrowthAnalysis = withHandler(["POST"], async (request, response, uid) => {
//     const body = getBodyObject(request.body);
//     const payload: GrowthAnalysisInput = {
//         childId: requireString(body.childId, "childId"),
//         sex: body.sex === "male" ? "male" : "female",
//         birthDate: requireString(body.birthDate, "birthDate"),
//         measurementDate: requireString(body.measurementDate, "measurementDate"),
//         heightCm: typeof body.heightCm === "number" ? body.heightCm : undefined,
//         weightKg: typeof body.weightKg === "number" ? body.weightKg : undefined,
//         heightPercentile:
//             typeof body.heightPercentile === "number" ? body.heightPercentile : undefined,
//         weightPercentile:
//             typeof body.weightPercentile === "number" ? body.weightPercentile : undefined,
//         notes: typeof body.notes === "string" ? body.notes : undefined,
//         imageUrl: typeof body.imageUrl === "string" ? body.imageUrl : undefined,
//     };

//     const created = await businessLogic.saveGrowthAnalysis(uid, payload);
//     response.status(201).json(created);
// });

// export const createMedicalReport = withHandler(["POST"], async (request, response, uid) => {
//     const body = getBodyObject(request.body);
//     const payload: MedicalReportInput = {
//         childId: requireString(body.childId, "childId"),
//         name: requireString(body.name, "name"),
//         type: requireString(body.type, "type"),
//         storagePath: typeof body.storagePath === "string" ? body.storagePath : undefined,
//     };

//     const created = await businessLogic.createMedicalReport(uid, payload);
//     response.status(201).json(created);
// });

// export const sendChatMessage = withHandler(["POST"], async (request, response, uid) => {
//     const body = getBodyObject(request.body);
//     const payload: ChatInput = {
//         childId: typeof body.childId === "string" ? body.childId : undefined,
//         message: requireString(body.message, "message"),
//     };

//     const result = await businessLogic.sendChatMessage(uid, payload);
//     response.status(200).json(result);
// });

// export const getDashboardData = withHandler(["GET"], async (_request, response, uid) => {
//     const data = await businessLogic.getDashboardData(uid);
//     response.status(200).json(data);
// });

// export const getNotifications = withHandler(["GET"], async (_request, response, uid) => {
//     const notifications = await businessLogic.getNotifications(uid);
//     response.status(200).json(notifications);
// });

// export const getChildProfile = withHandler(["GET"], async (request, response, uid) => {
//     const childId = requireString(request.query.childId, "childId");
//     const childProfile = await businessLogic.getChildProfile(uid, childId);
//     response.status(200).json(childProfile);
// });

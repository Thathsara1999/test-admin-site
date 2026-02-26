import { FieldValue } from "firebase-admin/firestore";
import { db } from "./firebase";

const collections = {
    babies: "admin_babies",
    birthRegistrations: "admin_birth_registrations",
    neonatalExams: "admin_neonatal_examinations",
    immunizations: "admin_immunization_records",
    growth: "admin_growth_analysis",
    reports: "admin_medical_reports",
    chats: "admin_chat_messages",
};

export class AdminDataService {
    async create<T extends Record<string, unknown>>(
        collectionName: string,
        ownerId: string,
        payload: T,
    ): Promise<T & { id: string }> {
        const documentRef = db.collection(collectionName).doc();
        await documentRef.set({
            ...payload,
            ownerId,
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        });

        return {
            ...payload,
            id: documentRef.id,
        };
    }

    async getById<T>(
        collectionName: string,
        id: string,
    ): Promise<(T & { id: string }) | null> {
        const snapshot = await db.collection(collectionName).doc(id).get();
        if (!snapshot.exists) {
            return null;
        }

        return {
            ...(snapshot.data() as T),
            id: snapshot.id,
        };
    }

    async listByOwner<T>(
        collectionName: string,
        ownerId: string,
        limit = 25,
    ): Promise<Array<T & { id: string }>> {
        const querySnapshot = await db
            .collection(collectionName)
            .where("ownerId", "==", ownerId)
            .orderBy("createdAt", "desc")
            .limit(limit)
            .get();

            return querySnapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({
            ...(doc.data() as T),
            id: doc.id,
        }));
    }

    async countByOwner(collectionName: string, ownerId: string): Promise<number> {
        const querySnapshot = await db
            .collection(collectionName)
            .where("ownerId", "==", ownerId)
            .get();

        return querySnapshot.size;
    }

    async getChildrenByOwner(ownerId: string): Promise<Array<{ id: string }>> {
        const querySnapshot = await db
            .collection(collections.babies)
            .where("ownerId", "==", ownerId)
            .get();

            return querySnapshot.docs.map((doc: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: doc.id }));
    }

    get collectionNames() {
        return collections;
    }
}

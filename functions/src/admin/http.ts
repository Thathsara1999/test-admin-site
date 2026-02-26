import { Request, Response } from "express";
import { auth } from "../services/firebase";

const bearerPrefix = "Bearer ";

export const allowMethods = (
    request: Request,
    response: Response,
    allowedMethods: string[],
): boolean => {
    if (allowedMethods.includes(request.method)) {
        return true;
    }

    response.status(405).json({
        message: `Method ${request.method} not allowed`,
    });
    return false;
};

export const getUidFromBearerToken = async (
    request: Request,
    response: Response,
): Promise<string | null> => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith(bearerPrefix)) {
        response.status(401).json({ message: "Missing or invalid bearer token" });
        return null;
    }

    const idToken = authHeader.slice(bearerPrefix.length).trim();
    if (!idToken) {
        response.status(401).json({ message: "Missing id token" });
        return null;
    }

    try {
        const decodedToken = await auth.verifyIdToken(idToken);
        return decodedToken.uid;
    } catch (error) {
        response.status(401).json({ message: "User not authenticated" });
        return null;
    }
};

export const getBodyObject = (body: unknown): Record<string, unknown> => {
    if (body && typeof body === "object" && !Array.isArray(body)) {
        return body as Record<string, unknown>;
    }
    return {};
};

export const requireString = (
    value: unknown,
    fieldName: string,
): string => {
    if (typeof value !== "string" || !value.trim()) {
        throw new Error(`${fieldName} is required`);
    }
    return value.trim();
};

export type Sex = "male" | "female";

export type LmsPoint = {
    ageMonths: number;
    L: number;
    M: number;
    S: number;
};

export type LmsTable = {
    heightCm: LmsPoint[];
    weightKg: LmsPoint[];
};

// Insert WHO growth standards LMS data here to enable auto percentiles.
export const whoGrowthLms: Record<Sex, LmsTable> = {
    male: {
        heightCm: [],
        weightKg: [],
    },
    female: {
        heightCm: [],
        weightKg: [],
    },
};

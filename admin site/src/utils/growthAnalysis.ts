import { LmsPoint, Sex, whoGrowthLms } from "../data/growthLms";

type LmsValues = {
    L: number;
    M: number;
    S: number;
};

export type PercentileResult = {
    percentile: number | null;
    source: "reference" | "manual" | "missing";
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const erf = (x: number) => {
    const sign = x >= 0 ? 1 : -1;
    const absX = Math.abs(x);
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    const t = 1 / (1 + p * absX);
    const y =
        1 -
        (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) *
        Math.exp(-absX * absX);
    return sign * y;
};

const normalCdf = (z: number) => 0.5 * (1 + erf(z / Math.SQRT2));

const interpolateLms = (ageMonths: number, points: LmsPoint[]): LmsValues | null => {
    if (points.length < 2) {
        return null;
    }

    if (ageMonths < points[0].ageMonths) {
        return null;
    }

    const last = points[points.length - 1];
    if (ageMonths > last.ageMonths) {
        return null;
    }

    for (let i = 0; i < points.length - 1; i += 1) {
        const current = points[i];
        const next = points[i + 1];
        if (ageMonths >= current.ageMonths && ageMonths <= next.ageMonths) {
            const span = next.ageMonths - current.ageMonths;
            const t = span === 0 ? 0 : (ageMonths - current.ageMonths) / span;
            return {
                L: current.L + (next.L - current.L) * t,
                M: current.M + (next.M - current.M) * t,
                S: current.S + (next.S - current.S) * t,
            };
        }
    }

    return null;
};

const zScoreFromLms = (value: number, lms: LmsValues) => {
    if (lms.L === 0) {
        return Math.log(value / lms.M) / lms.S;
    }

    return (Math.pow(value / lms.M, lms.L) - 1) / (lms.L * lms.S);
};

export const percentileFromLms = (
    value: number,
    ageMonths: number,
    points: LmsPoint[],
): number | null => {
    const lms = interpolateLms(ageMonths, points);
    if (!lms) {
        return null;
    }

    const z = zScoreFromLms(value, lms);
    const percentile = normalCdf(z) * 100;
    return clamp(percentile, 0, 100);
};

export const calculateAgeMonths = (
    birthDate: string,
    measurementDate: string,
): number | null => {
    if (!birthDate || !measurementDate) {
        return null;
    }

    const birth = new Date(birthDate);
    const measurement = new Date(measurementDate);

    if (Number.isNaN(birth.valueOf()) || Number.isNaN(measurement.valueOf())) {
        return null;
    }

    if (measurement < birth) {
        return null;
    }

    let months =
        (measurement.getFullYear() - birth.getFullYear()) * 12 +
        (measurement.getMonth() - birth.getMonth());

    const dayDiff = measurement.getDate() - birth.getDate();
    if (dayDiff < 0) {
        months -= 1;
    }

    const partial = Math.max(0, dayDiff) / 30.4375;
    return Math.max(0, months + partial);
};

export const getPercentileResult = (
    value: number | null,
    ageMonths: number | null,
    sex: Sex,
    manualPercentile: number | null,
    metric: "heightCm" | "weightKg",
): PercentileResult => {
    if (
        value !== null &&
        ageMonths !== null &&
        whoGrowthLms[sex][metric].length > 1
    ) {
        const auto = percentileFromLms(value, ageMonths, whoGrowthLms[sex][metric]);
        if (auto !== null) {
            return { percentile: auto, source: "reference" };
        }
    }

    if (manualPercentile !== null) {
        return { percentile: manualPercentile, source: "manual" };
    }

    return { percentile: null, source: "missing" };
};

export const classifyPercentile = (percentile: number | null) => {
    if (percentile === null) {
        return "unknown";
    }

    if (percentile < 5) {
        return "low";
    }

    if (percentile < 85) {
        return "typical";
    }

    if (percentile < 95) {
        return "high";
    }

    return "very high";
};

import { useState } from "react";
import { AuthFormData } from "../types/auth.types";

export function useAuthForm(initialData: AuthFormData) {
    const [formData, setFormData] = useState<AuthFormData>(initialData);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return {
        formData,
        showPassword,
        setShowPassword,
        handleChange
    };
}

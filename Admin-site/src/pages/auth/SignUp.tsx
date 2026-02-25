import AuthLayout from "./AuthLayout";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";

export default function SignUp() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { formData, showPassword, setShowPassword, handleChange } = useAuthForm(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  );

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      if (formData.name) {
        await updateProfile(credential.user, { displayName: formData.name });
      }

      navigate("/dashboard", { replace: true });
    } catch (authError: any) {
      setError(
        authError?.message ?? "Failed to create account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

      <div className="space-y-4">
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <button
          onClick={() => setShowPassword(!showPassword)}
          className="text-sm text-purple-600"
        >
          {showPassword ? "Hide Passwords" : "Show Passwords"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-pink-500 text-white py-3 rounded-xl"
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </AuthLayout>
  );
}

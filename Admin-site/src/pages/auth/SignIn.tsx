import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAuthForm } from "../../hooks/useAuthForm";
import { auth } from "../../lib/firebase";

export default function SignIn() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { formData, showPassword, setShowPassword, handleChange } = useAuthForm(
    {
      email: "",
      password: "",
    },
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate("/dashboard", { replace: true });
    } catch (authError: any) {
      setError(authError?.message ?? "Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back!</h1>

      <div className="space-y-4">
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-purple-500 text-white py-3 rounded-xl"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </AuthLayout>
  );
}

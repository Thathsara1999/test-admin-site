import AuthLayout from "./AuthLayout";
import { useAuthForm } from "../../hooks/useAuthForm";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../../lib/firebase";
import axios from "axios";

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
      /* 1️⃣ Create Firebase Auth User */
      const credential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );

      const user = credential.user;
      const token = await user.getIdToken();
      console.log("User token:", token);
      localStorage.setItem("authToken", token); // Store token for API calls
      /* 2️⃣ Update display name */
      if (formData.name) {
        await updateProfile(user, {
          displayName: formData.name,
        });
      }

      /* 3️⃣ Save user to Firestore via your API */
      await axios.post("/api/users", {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
      });

      /* 4️⃣ Navigate */
      navigate("/dashboard", { replace: true });
    } catch (authError: any) {
      setError(
        authError?.response?.data?.message ||
          authError?.message ||
          "Failed to create account. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold mb-6 text-center">Create Account</h1>

      <div className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-sm text-purple-600"
        >
          {showPassword ? "Hide Passwords" : "Show Passwords"}
        </button>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-pink-500 text-white py-3 rounded-xl hover:bg-pink-600 transition"
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

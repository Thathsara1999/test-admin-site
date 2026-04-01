import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
  Auth,
} from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAuthForm } from "../../hooks/useAuthForm";
import { auth } from "../../lib/firebase";
import axios from "axios";

export default function SignIn() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // PHONE OTP STATES
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const { formData, showPassword, setShowPassword, handleChange } = useAuthForm(
    {
      email: "",
      password: "",
    },
  );

  // EMAIL/PASSWORD LOGIN
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      const token = await auth.currentUser?.getIdToken();
      console.log("User token:", token);
      localStorage.setItem("authToken", token || "");

      await axios.get(
        "http://localhost:5002/child-health-system-6ba6d/us-central1/verifyToken",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Token verified successfully");
      navigate("/dashboard", { replace: true });
    } catch (authError: any) {
      setError(authError?.message ?? "Failed to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SEND OTP
  const handleSendOTP = async () => {
    try {
      setError(null);

      // Clear old verifier if exists
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
      }

      // Create new reCAPTCHA for this attempt
      const appVerifier: RecaptchaVerifier = new RecaptchaVerifier(
        auth as Auth,
        "recaptcha-container",
        { size: "invisible" },
      );

      (window as any).recaptchaVerifier = appVerifier;

      // Send OTP
      const result = await signInWithPhoneNumber(
        auth as Auth,
        phone,
        appVerifier,
      );
      setConfirmationResult(result);
    } catch (err: any) {
      setError(err?.message || "Failed to send OTP");
    }
  };

  // VERIFY OTP
  const handleVerifyOTP = async () => {
    try {
      if (!confirmationResult) return;

      await confirmationResult.confirm(otp);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError("Invalid OTP");
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back!</h1>

      <div className="space-y-4">
        {/* Email login */}
        <input
          name="email"
          type="email"
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
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-purple-500 text-white py-3 rounded-xl hover:bg-purple-600 transition"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        {/* PHONE OTP LOGIN */}
        <div className="border-t pt-6 mt-6">
          <h2 className="text-lg font-semibold text-center mb-3">
            Login with Phone OTP
          </h2>

          <input
            type="text"
            placeholder="+9477xxxxxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-xl mb-3"
          />

          {!confirmationResult ? (
            <button
              onClick={handleSendOTP}
              className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600"
            >
              Send OTP
            </button>
          ) : (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border rounded-xl mb-3"
              />
              <button
                onClick={handleVerifyOTP}
                className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600"
              >
                Verify OTP
              </button>
            </>
          )}
        </div>

        {/* Firebase reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </AuthLayout>
  );
}

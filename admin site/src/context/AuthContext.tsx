import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import axios from "axios";

type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: "midwife" | "admin";
  area: string;
};

const FUNCTIONS_BASE_URL =
  process.env.REACT_APP_FUNCTIONS_BASE_URL ||
  "http://localhost:5001/child-health-system-6ba6d/us-central1";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  profile: UserProfile | null;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await axios.get(
            `${FUNCTIONS_BASE_URL}/getMyProfile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          setProfile(response.data?.profile ?? null);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        loading,
        user,
        profile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

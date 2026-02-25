import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col lg:flex-row">
        {/* Left section */}
        <div className="lg:w-1/2 bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-12 flex items-center justify-center">
          <h2 className="text-3xl font-bold text-white">
            Kids Learning App 🎨
          </h2>
        </div>

        {/* Right section */}
        <div className="lg:w-1/2 p-8 lg:p-12">{children}</div>
      </div>
    </div>
  );
}

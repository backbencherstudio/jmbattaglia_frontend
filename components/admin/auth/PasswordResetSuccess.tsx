import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface PasswordResetSuccessProps {
  onSignInClick?: () => void;
}

export function PasswordResetSuccess({ onSignInClick }: PasswordResetSuccessProps) {
  return (
    <div className="space-y-6">
      <div className="p-6 text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col items-center text-center space-y-3">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <p className="font-bold text-lg text-emerald-950">
            Password Changed Successfully!
          </p>
          <p className="mt-1.5 text-emerald-700 leading-relaxed text-xs sm:text-sm">
            Your admin password has been updated. You can now use your new password
            to sign in to your dashboard.
          </p>
        </div>
      </div>

      <Link
        href="/admin/login"
        onClick={onSignInClick}
        className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover active:scale-[0.99] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-primary/20 flex items-center justify-center space-x-2 cursor-pointer"
      >
        <span>Proceed to Sign In</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default PasswordResetSuccess;

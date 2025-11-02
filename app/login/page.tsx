"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ import router
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2 } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ initialize router

  const handleLogin = () => {
    document.cookie = "dummy_token=12345; path=/; max-age=3600";
    setLoading(true);
    // ⏳ Simulate auth process
    setTimeout(() => {
      router.push("/products"); // ✅ Redirect to /products
    }, 1200);
  };

  return (
    <motion.div
      className="flex min-h-screen items-center justify-center 
                 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-purple-50 
                 p-2 sm:p-6 md:p-6 lg:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full flex justify-center"
      >
        <Card
          className="w-full 
                     max-w-md sm:max-w-sm md:max-w-sm lg:max-w-sm 
                     border border-border/40 rounded-2xl 
                     shadow-2xl bg-white dark:bg-card/90 
                     backdrop-blur-sm overflow-hidden 
                     hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]
                     transition-all duration-500"
        >
          {/* Header Section */}
          <CardHeader className="text-center space-y-3 sm:space-y-4">
            <motion.div
              className="flex items-center justify-center gap-2 sm:gap-3 mb-2"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* 🌈 ConvertCart Logo — Gradient + Rounded Style */}
              <div
                className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12
                           rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-fuchsia-600
                           shadow-md shadow-purple-200 dark:shadow-purple-800/40
                           border border-white/20 backdrop-blur-sm"
              >
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
              </div>

              <span className="text-lg sm:text-xl font-semibold text-foreground tracking-wide">
                ConvertCart
              </span>
            </motion.div>
          </CardHeader>

          {/* Main Form */}
          <CardContent className="space-y-6 sm:space-y-8 p-3 sm:p-6 md:p-10 -mt-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="demo@gmail.com"
                  type="email"
                  className="text-sm sm:text-base"
                />
              </div>

              {/* Password */}
              <div className="space-y-2 mt-3">
                <Label htmlFor="password" className="text-sm sm:text-base">
                  Password
                </Label>
                <Input
                  id="password"
                  placeholder="demo@123"
                  type="password"
                  className="text-sm sm:text-base"
                />
              </div>

              {/* Sign-In Button */}
              <Button
                onClick={handleLogin}
                disabled={loading}
                className="mt-6 w-full bg-gradient-to-r from-primary via-purple-500 to-fuchsia-600 
                           text-white font-medium text-sm sm:text-base 
                           hover:from-primary/90 hover:via-purple-600/90 hover:to-fuchsia-700 
                           transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
              >
                Sign In
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div
              className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="h-[1px] w-12 bg-border" />
              or
              <span className="h-[1px] w-12 bg-border" />
            </motion.div>

            {/* 🔴 Gmail-Themed Google Login */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button
                className="w-full flex items-center justify-center gap-2 
                           text-white font-medium text-sm sm:text-base 
                           transition-all duration-300 hover:scale-[1.02]
                           shadow-md hover:shadow-lg border border-gray-200"
                onClick={() => {
                  setLoading(true);
                  signIn("google", { callbackUrl: "/" });
                }}
                disabled={loading}
              >
                <Image
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  width={18}
                  height={18}
                  className="mr-1"
                />
                {loading ? "Connecting..." : "Sign in with Google"}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

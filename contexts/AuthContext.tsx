"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface AuthContextType {
    isLoggedIn: boolean;
    refresh: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    refresh: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const refresh = () => {
        console.log("[Auth] Checking login status...");
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/status`, {
            credentials: "include", // 쿠키 전송
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("[Auth] Status API response:", data);
                setIsLoggedIn(data.logged_in);
            })
            .catch((err) => {
                console.error("[Auth] Status check failed:", err);
                setIsLoggedIn(false);
            });
    };

    const logout = () => {
        console.log("[Auth] Logging out...");
    
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/logout`, {
            method: "POST",
            credentials: "include", // 쿠키 보내기
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("[Auth] Logout API response:", data);
                setIsLoggedIn(false);
            })
            .catch((err) => {
                console.error("[Auth] Logout failed:", err);
                // 실패하더라도 클라이언트 상태는 일단 로그아웃 처리
                setIsLoggedIn(false);
            });
    };


    // 초기 마운트 될 때 한 번만 상태 확인
    useEffect(() => {
      let isMounted = true;
   
      console.log("[Auth] Initial status check...");
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/authentication/status`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (!isMounted) return;
          console.log("[Auth] Status API response:", data);
          setIsLoggedIn(data.logged_in);
        })
        .catch((err) => {
          if (!isMounted) return;
          console.error("[Auth] Status check failed:", err);
          setIsLoggedIn(false);
        });
   
      return () => {
        // 언마운트되면 setState 안 하도록 방어
        isMounted = false;
      };
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, refresh, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

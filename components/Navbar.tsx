"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export default function Navbar() {
    const { isLoggedIn, logout, refresh } = useAuth();

    // 상태 변화 확인용 로그
    useEffect(() => {
        console.log("[Navbar] Mounted. Current login:", isLoggedIn);
        refresh();
    }, []);

    console.log("[Navbar] Render. Current login:", isLoggedIn);

    return (
        <nav className="bg-gray-800 text-white p-4 flex justify-between">
            <div className="text-lg font-bold">MyApp</div>
            <div className="space-x-4">
                <Link href="/">Home</Link>
                <Link href="/document">문서 분석</Link>
                <Link href="/contact">Contact</Link>

                {isLoggedIn ? (
                    <button
                        onClick={logout}
                        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                        Logout
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                    >
                        Login
                    </Link>
                )}
                {isLoggedIn && (
                    <Link
                        href="/account/me"
                        className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                    >
                        내 정보
                    </Link>
                )}

            </div>
        </nav>
    );
}

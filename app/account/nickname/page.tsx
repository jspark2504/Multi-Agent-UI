"use client";

import { useState } from "react";

export default function NicknamePage() {
    const [nickname, setNickname] = useState("");
    const [checking, setChecking] = useState(false);
    const [available, setAvailable] = useState<boolean | null>(null);

    const checkDuplicate = () => {
        setChecking(true);
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/account/nickname/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname }),
        })
            .then((res) => res.json())
            .then((data) => {
                setAvailable(data.available);
                setChecking(false);
            });
    };

    const saveNickname = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/account/nickname`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nickname }),
        })
            .then((res) => res.json())
            .then((data) => alert(data.detail ?? "닉네임이 저장되었습니다."))
            .catch(() => alert("오류 발생"));
    };

    return (
        <div className="p-10 flex flex-col items-center space-y-5">
            <h1 className="text-3xl font-bold">닉네임 설정</h1>

            <input
                type="text"
                placeholder="닉네임 입력"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border px-3 py-2 rounded w-64"
            />

            <button
                onClick={checkDuplicate}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
                중복 확인
            </button>

            {available !== null && (
                <p className={available ? "text-green-400" : "text-red-400"}>
                    {available ? "사용 가능한 닉네임입니다." : "이미 사용 중인 닉네임입니다."}
                </p>
            )}

            {available && (
                <button
                    onClick={saveNickname}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    닉네임 저장하기
                </button>
            )}
        </div>
    );
}

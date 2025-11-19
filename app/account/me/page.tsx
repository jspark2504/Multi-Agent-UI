"use client";

import { useEffect, useState } from "react";

interface AccountResponse {
  email: string | null;
  nickname: string | null;
  has_nickname: boolean;
  can_set_nickname: boolean;
}

export default function MyAccountPage() {
  const [account, setAccount] = useState<AccountResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/account/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("[MyAccount] /account/me response:", data);
        setAccount(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("[MyAccount] failed:", err);
        setAccount(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!account) return <div className="p-8 text-center">로그인이 필요합니다.</div>;

  const hasNickname = !!account.nickname;

  return (
    <div className="p-10 flex flex-col items-center space-y-5">
      <h1 className="text-3xl font-bold mb-4">내 정보</h1>

      <p className="text-xl mb-2">
        이메일: <b>{account.email ?? ""}</b>
      </p>

      {hasNickname ? (
        <>
          <p className="text-xl">
            현재 닉네임: <b>{account.nickname}</b>
          </p>
          <p className="text-gray-400 text-sm">
            닉네임은 한 번만 설정할 수 있으며, 변경은 지원하지 않습니다.
          </p>
        </>
      ) : (
        <>
          <p className="text-red-400 text-lg">닉네임이 아직 설정되지 않았습니다.</p>
          <p className="text-gray-400 text-sm mb-4">
            닉네임은 한 번만 설정할 수 있습니다.
          </p>

          {/* 👇 여기 버튼 추가 */}
          <a
            href="/account/nickname"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            닉네임 설정하기
          </a>
        </>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";

interface Board {
  id: number;
  title: string;
  content: string;
  writer_nickname?: string | null;
  created_at: string;
  updated_at: string;
}

export default function BoardListPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchBoards = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/board/list`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setBoards(data);
      } catch (e) {
        console.error("[Board] 리스트 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p>게시판은 로그인 후 이용 가능합니다.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">게시판</h1>
        <button
          onClick={() => router.push("/board/create")}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          새 글 작성
        </button>
      </div>

      {loading ? (
        <p>로딩 중...</p>
      ) : boards.length === 0 ? (
        <p>등록된 게시글이 없습니다.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 text-left w-16">번호</th>
              <th className="py-2 text-left">제목</th>
              <th className="py-2 text-left w-48">작성자</th>
              <th className="py-2 text-left w-64">작성일</th>
            </tr>
          </thead>
          <tbody>
            {boards.map((b) => (
              <tr key={b.id} className="border-b border-gray-800">
                <td className="py-2">{b.id}</td>
                <td className="py-2">
                  <Link
                    href={`/board/${b.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {b.title}
                  </Link>
                </td>
                <td className="py-2">
                  {b.writer_nickname ?? "익명"}
                </td>
                <td className="py-2">
                  {new Date(b.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

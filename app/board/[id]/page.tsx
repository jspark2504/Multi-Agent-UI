"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

interface BoardDetail {
  id: number;
  title: string;
  content: string;
  writer_nickname?: string | null;
  created_at: string;
  updated_at: string;
}

export default function BoardDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  const [board, setBoard] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const id = params?.id;

  useEffect(() => {
    if (!id) return;

    const fetchBoard = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/board/read/${id}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) {
          throw new Error("게시글을 불러오지 못했습니다.");
        }
        const data = await res.json();
        setBoard(data);
      } catch (e: any) {
        console.error("[Board] 상세 조회 실패:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/board/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "삭제 실패");
      }
      router.push("/board");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p>로딩 중...</p>
      </main>
    );
  }

  if (error || !board) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p>{error ?? "게시글을 찾을 수 없습니다."}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{board.title}</h1>
        <div className="mb-4 text-gray-400 text-sm flex justify-between">
          <span>작성자: {board.writer_nickname ?? "익명"}</span>
          <span>{new Date(board.created_at).toLocaleString()}</span>
        </div>
        <div className="bg-gray-900 p-4 rounded whitespace-pre-wrap">
          {board.content}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => router.push("/board")}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            목록으로
          </button>

          {/* 지금은 로그인만 되어 있으면 삭제 가능 (작성자 체크는 나중에 추가해도 됨) */}
          {isLoggedIn && (
            <button
              onClick={handleDelete}
              disabled={deleteLoading}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {deleteLoading ? "삭제 중..." : "삭제"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

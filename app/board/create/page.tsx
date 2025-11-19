"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";

export default function BoardCreatePage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p>로그인 후 글을 작성할 수 있습니다.</p>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/board/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ title, content }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "게시글 등록 실패");
      }

      await res.json(); // 응답 데이터는 지금은 안 써도 됨
      router.push("/board");
    } catch (e: any) {
      console.error("[Board] 글 작성 실패:", e);
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-gray-900 p-6 rounded shadow-md"
      >
        <h1 className="text-2xl font-bold mb-4">새 글 작성</h1>

        <div className="mb-4">
          <label className="block mb-2">제목</label>
          <input
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">내용</label>
          <textarea
            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {error && <p className="mb-3 text-red-400">{error}</p>}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </form>
    </main>
  );
}

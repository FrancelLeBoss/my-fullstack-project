import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import type { CommentType } from "../types/Product";
import type { RootState } from "../redux/store";
export default function useComment(productId?: string | number | null) {

    const user = useSelector((s: RootState) => s.user.user);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [comment, setComment] = useState<string | null>(null);
    const [userInfos, setUserInfos] = useState<Record<number, { username: string }>>({});


    const getUserInfo = useCallback(
    async (userId: number) => {
      if (userInfos[userId]) return userInfos[userId];
      try {
        const res = await axiosInstance.get<{ username: string }>(`api/user/${userId}/`);
        setUserInfos((prev) => ({ ...prev, [userId]: res.data }));
        return res.data;
      } catch (err) {
        console.error("getUserInfo error:", err);
        return null;
      }
    },
    [userInfos]
  );

  const setCommentState = useCallback((c: string | null) => {
    setComment(c);
  }, []);

  const setCommentsState = useCallback((c: CommentType[]) => {
    setComments(c);
  }, []);

    const addComment = useCallback(
    async (commentText: string | null, stars: number, productIdParam?: string | number) => {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }
      if (!productIdParam && !productId) {
        throw new Error("Product id missing");
      }
      const pid = productIdParam ?? productId;
      if (!commentText || commentText.trim() === "") {
            Swal.fire({
              icon: 'warning',
              title: 'Please write a comment',
              showConfirmButton: false,
              timer: 1500
            });
            return;
          }
      try {
        const res = await axiosInstance.post<{ comment: { id: number; content: string; stars: number; updated_at: string; created_at: string } }>(`api/comments/save/`, {
          comment: commentText,
          user: user.id,
          stars: stars || 0,
          product: Number(pid),
        });
        const saved = res.data.comment;
        const newComment: CommentType = {
          id: saved.id,
          comment: saved.content,
          user: user.id,
          stars: saved.stars,
          product: Number(pid),
          updated_at: saved.updated_at,
          created_at: saved.created_at,
        };
        setComments((prev) => [...prev, newComment]);
        await getUserInfo(newComment.user);
        setComment(null);
        Swal.fire({
          icon: 'success',
          title: 'Comment added',
          showConfirmButton: false,
          timer: 1500
        });
        return newComment;
      } catch (err) {
        console.error("addComment error:", err);
        throw err;
      }
    },
    [user, productId, getUserInfo]
  );
    return {
        addComment,
        comments,
        comment,
        setCommentState,
        setCommentsState,
    };
}
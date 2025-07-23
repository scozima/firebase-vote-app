import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import type { VoteData, SnackbarState, SelectedCountry } from "../types/vote";

export const useVote = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votedCountry, setVotedCountry] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  // ユーザー認証状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Firestoreから投票データを取得
        const voteDoc = await getDoc(doc(db, "votes", user.uid));
        if (voteDoc.exists()) {
          const voteData = voteDoc.data() as VoteData;
          setHasVoted(true);
          setVotedCountry(voteData.votedCountry); // 投票した国を保存
        } else {
          setHasVoted(false);
          setVotedCountry(null);
        }
      } else {
        setHasVoted(false);
        setVotedCountry(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const submitVote = async (selectedCountry: SelectedCountry) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: "ログインが必要です",
        severity: "error",
      });
      return false;
    }

    setLoading(true);
    try {
      const voteData: VoteData = {
        userId: user.uid,
        userEmail: user.email,
        votedCountry: selectedCountry.key,
        role: "user",
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "votes", user.uid), voteData);

      setHasVoted(true);
      setVotedCountry(selectedCountry.key);
      setSnackbar({
        open: true,
        message: `${selectedCountry.nameJa}に投票しました！`,
        severity: "success",
      });

      return true;
    } catch (error) {
      console.error("投票の保存に失敗しました:", error);
      setSnackbar({
        open: true,
        message: "投票の保存に失敗しました",
        severity: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return {
    user,
    loading,
    hasVoted,
    votedCountry,
    snackbar,
    submitVote,
    closeSnackbar,
  };
};

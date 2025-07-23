import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { countries } from "../data/countries";
import type { VoteData } from "../types/vote";

export interface VoteResult {
  country: string;
  votes: number;
  [key: string]: string | number;
}

export const useVoteResults = () => {
  const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoteResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const votesSnapshot = await getDocs(collection(db, "votes"));
        
        // 投票データを集計
        const voteCounts: { [key: string]: number } = {};
        
        votesSnapshot.forEach((doc) => {
          const voteData = doc.data() as VoteData;
          const country = voteData.votedCountry;
          voteCounts[country] = (voteCounts[country] || 0) + 1;
        });

        // すべての国を含む結果を作成（投票がない場合は0票）
        const results: VoteResult[] = countries.map(country => ({
          country: country.nameJa,
          votes: voteCounts[country.key] || 0,
        }));

        // 投票数で降順ソート
        results.sort((a, b) => b.votes - a.votes);
        
        setVoteResults(results);
      } catch (err) {
        console.error("投票結果の取得に失敗しました:", err);
        
        if (err instanceof Error) {
          setError(`投票結果の取得に失敗しました: ${err.message}`);
        } else {
          setError("投票結果の取得に失敗しました");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVoteResults();
  }, []);

  return { voteResults, loading, error };
}; 
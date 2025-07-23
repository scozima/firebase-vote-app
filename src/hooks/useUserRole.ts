import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { User } from 'firebase/auth';

export const useUserRole = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Firestoreからユーザーの投票データを取得してroleを確認
          const voteDoc = await getDoc(doc(db, "votes", user.uid));
          if (voteDoc.exists()) {
            const voteData = voteDoc.data();
            setUserRole(voteData.role || 'user');
          } else {
            // 投票データがない場合はデフォルトでuser
            setUserRole('user');
          }
        } catch (error) {
          console.error('ユーザーroleの取得に失敗しました:', error);
          setUserRole('user');
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAdmin = userRole === 'admin';

  return { user, userRole, isAdmin, loading };
}; 
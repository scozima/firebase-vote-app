import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // メール認証が完了していない場合はログイン画面に戻す
        if (!user.emailVerified) {
          console.log('メールが確認されていません。ログイン画面にリダイレクトします。');
          navigate('/login');
          return;
        }
        
        // メール認証が完了している場合、Voteページに遷移
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);
}; 
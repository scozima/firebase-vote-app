import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import GoogleIcon from "@mui/icons-material/Google";
import { auth, provider } from "../../firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useNavigate } from "react-router-dom";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: "100svh",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function Auth() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email") as string;
    const password = data.get("password") as string;

    try {
      if (isSignIn) {
        // ログイン処理
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // メール認証が完了していない場合はログアウト
        if (!user.emailVerified) {
          // admin@example.comの場合はメール認証をスキップ
          const isAdminEmail = email === "admin@example.com";
          
          if (!isAdminEmail) {
            await auth.signOut();
            alert(
              "メール認証が完了していません。メールを確認して認証を完了してください。"
            );
            return;
          }
        }

        console.log("Email sign-in successful");
        navigate("/");
      } else {
        // サインアップ処理
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          const user = userCredential.user;

          // メール認証を送信
          await sendEmailVerification(user);

          alert("アカウントを作成しました！メール認証を完了してください。");
          // メール認証が完了していない場合はログアウト
          if (!user.emailVerified) {
            await auth.signOut();
            alert(
              "メール認証が完了していません。メールを確認して認証を完了してください。"
            );
            return;
          }
        } catch (error: unknown) {
          // 既存ユーザーの場合はサインインを試行
          if (
            error instanceof Error &&
            error.message.includes("auth/email-already-in-use")
          ) {
            try {
              const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
              );
              const user = userCredential.user;

              // メール認証が完了していない場合はログアウト
              if (!user.emailVerified) {
                await auth.signOut();
                alert(
                  "メール認証が完了していません。メールを確認して認証を完了してください。"
                );
                return;
              }

              console.log("Email sign-in successful");
              navigate("/");
            } catch {
              alert("パスワードが間違っています。");
            }
          } else {
            throw error;
          }
        }
      }
    } catch (error: unknown) {
      console.error("Auth error:", error);
      let errorMessage = "エラーが発生しました";

      if (error instanceof Error) {
        // Firebaseエラーハンドリング（https://firebase.google.com/docs/auth/admin/errors?hl=ja）
        if (error.message.includes("auth/invalid-credential")) {
          errorMessage = "メールアドレスまたはパスワードが正しくありません。";
        } else if (error.message.includes("auth/user-not-found")) {
          errorMessage = "このメールアドレスは登録されていません。";
        } else if (error.message.includes("auth/wrong-password")) {
          errorMessage = "パスワードが正しくありません。";
        } else if (error.message.includes("auth/user-disabled")) {
          errorMessage = "このアカウントは無効化されています。";
        } else if (error.message.includes("auth/invalid-email")) {
          errorMessage = "無効なメールアドレスです。";
        } else if (error.message.includes("auth/weak-password")) {
          errorMessage = "パスワードは6文字以上で入力してください。";
        } else if (error.message.includes("auth/email-already-in-use")) {
          errorMessage = "このメールアドレスは既に使用されています。";
        } else if (error.message.includes("auth/operation-not-allowed")) {
          errorMessage = "メール/パスワード認証が有効になっていません。";
        } else if (error.message.includes("auth/too-many-requests")) {
          errorMessage =
            "ログイン試行回数が多すぎます。しばらく時間をおいてから再試行してください。";
        } else if (error.message.includes("auth/network-request-failed")) {
          errorMessage =
            "ネットワークエラーが発生しました。インターネット接続を確認してください。";
        } else {
          errorMessage = "認証エラーが発生しました。もう一度お試しください。";
        }
      }
      alert(errorMessage);
    }
  };

  const signInGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch {
      try {
        await signInWithRedirect(auth, provider);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "エラーが発生しました";
        alert(errorMessage);
      }
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            {isSignIn ? "ログイン" : "新規登録"}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            {!isSignIn && (
              <FormControl>
                <FormLabel htmlFor="name">お名前</FormLabel>
                <TextField
                  autoComplete="name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  placeholder="山田 太郎"
                />
              </FormControl>
            )}
            <FormControl>
              <FormLabel htmlFor="email">メールアドレス</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">パスワード</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete={isSignIn ? "current-password" : "new-password"}
                variant="outlined"
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              {isSignIn ? "ログイン" : "新規登録"}
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>または</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={signInGoogle}
              startIcon={<GoogleIcon />}
              sx={{ textTransform: "capitalize" }}
            >
              Googleでログイン
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              {isSignIn
                ? "アカウントをお持ちでない方はこちら "
                : "すでにアカウントをお持ちの方はこちら "}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  setIsSignIn(!isSignIn);
                }}
                sx={{ alignSelf: "center" }}
              >
                {isSignIn ? "新規登録" : "ログイン"}
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignUpContainer>
    </>
  );
}

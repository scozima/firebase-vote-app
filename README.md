# 画像投票アプリ (Image Vote App)

海外旅行先の画像投票アプリケーションです。ユーザーは4つの旅行先（韓国、タイ、ベトナム、ハワイ）の中から次に行きたい場所に投票できます。

## 機能

- 画像投票システム
- ユーザー認証
- 投票制限（1アカウント1回）
- 管理者ダッシュボード
  - email:`admin@example.com`
  - pass:`admin9876`
- レスポンシブデザイン

## 技術スタック

- React 19 + TypeScript
- Material-UI (MUI)
- React Router DOM
- Firebase (Firestore, Authentication)
- Vite

## インストール

プロジェクトルートディレクトリで以下のコマンドを実行してください：

```bash
npm install
```

## 開発サーバーの起動

プロジェクトルートディレクトリで以下のコマンドを実行してください：

```bash
npm run dev
```

開発サーバーが起動したら、ブラウザで `http://localhost:5173` にアクセスしてください。

## ビルド

プロジェクトルートディレクトリで以下のコマンドを実行してください：

```bash
npm run build
```

## デプロイ

- https://image-vote-app.web.app/
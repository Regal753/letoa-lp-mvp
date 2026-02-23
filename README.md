# letoa-lp-mvp

新規事業向けLPのMVPです。既存 `Website` とは完全に別ディレクトリ・別Git管理で運用できます。

## ファイル構成

- `index.html`: LP本体
- `assets/main.css`: 装飾とアニメーション
- `assets/main.js`: メニュー、FAQ、問い合わせフォーム挙動

## 実運用値（Websiteと同一）

`assets/main.js` の `LP_CONFIG` に実運用値を設定済みです。

- `contactEmail`: `retoa@regalocom.net`
- `contactFormUrl`: `https://docs.google.com/forms/d/e/1FAIpQLSdbqMVhTDUHcfhnrv5Vj96aBF9WhyAwysTfmG9CdgElhrGm1A/viewform`

## 送信仕様

- LP内フォーム送信: 入力内容を `mailto:` でメール作成画面に渡します
- Googleフォーム送信: `contactFormUrl` へ直接遷移できます

## ローカル確認

```powershell
cd C:\Users\Workp\letoa-lp-mvp
python -m http.server 8080
```

ブラウザで `http://localhost:8080` を開いて確認します。

## GitHubへ新規公開

```powershell
cd C:\Users\Workp\letoa-lp-mvp
git add .
git commit -m "feat: add LP MVP"
git branch -M main
git remote add origin https://github.com/<your-account>/<new-repo>.git
git push -u origin main
```

## デプロイ運用（推奨）

1. まずは `*.vercel.app` で公開してMVP検証
2. 問題なければサブドメイン（例: `lp.example.com`）を追加
3. VercelでCustom Domainを紐付け


# letoa-lp-mvp

新規事業向けLP（静的サイト）です。既存 `Website` リポジトリとは完全に分離して運用します。

## ファイル構成

- `index.html`: LP本体
- `assets/tailwind.generated.css`: Tailwindのビルド済みCSS（CDN不使用）
- `assets/main.css`: 見た目・アニメーション・アクセシビリティ調整
- `assets/main.js`: メニュー、FAQ、問い合わせフォーム（API送信 + mailtoフォールバック）
- `tailwind.config.js`: Tailwind設定
- `assets/tailwind.input.css`: Tailwind入力ファイル

## 実運用値

`assets/main.js` の `LP_CONFIG` に設定しています。

- `contactEmail`: `retoa@regalocom.net`
- `businessHours`: `9:00〜20:00`
- `phoneDisplay`: `070-9131-7882`
- `phoneLink`: `07091317882`

## 送信仕様

- LPフォームは `formsubmit.co` のAPIへ直接POSTします
- API側の `captcha` を有効化しています
- フロント側で honeypot / 早すぎる送信 / 連続送信の抑止を行います
- API送信に失敗した場合のみ `mailto:` へフォールバックします
- 直接メール送信したい場合は、画面内のメールリンクを利用します
- 本番公開前に必ずテスト送信し、受信先メールに届くことを確認してください
- 同意取得は `consent` / `privacyPolicyVersion` を送信して記録します

## CSSビルド

```powershell
cd C:\Users\Workp\letoa-lp-mvp
npm install
npm run build:css
```

## ローカル確認

```powershell
cd C:\Users\Workp\letoa-lp-mvp
npm run build:css
python -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。

## 公開先

- GitHub: `https://github.com/Regal753/letoa-lp-mvp`
- GitHub Pages: `https://regal753.github.io/letoa-lp-mvp/`

## デプロイ更新

`main` に push すると GitHub Pages が自動で更新されます。

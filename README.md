# letoa-lp-mvp

新規事業向けLP（静的サイト）です。既存 `Website` リポジトリとは完全に分離して運用します。

## ファイル構成

- `index.html`: LP本体
- `assets/main.css`: 見た目・アニメーション・アクセシビリティ調整
- `assets/main.js`: メニュー、FAQ、問い合わせフォーム（mailto起動）

## 実運用値

`assets/main.js` の `LP_CONFIG` に設定しています。

- `contactEmail`: `retoa@regalocom.net`
- `businessHours`: `8:00-20:00（年中無休）`

## 送信仕様

- LPフォームは送信時に `mailto:` を生成し、メール作成画面を起動します
- 直接メール送信したい場合は、画面内のメールリンクを利用します

## ローカル確認

```powershell
cd C:\Users\Workp\letoa-lp-mvp
python -m http.server 8080
```

ブラウザで `http://localhost:8080` を開きます。

## 公開先

- GitHub: `https://github.com/Regal753/letoa-lp-mvp`
- GitHub Pages: `https://regal753.github.io/letoa-lp-mvp/`

## デプロイ更新

`main` に push すると GitHub Pages が自動で更新されます。


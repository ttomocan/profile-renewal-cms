This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## SEO・Core Web Vitalsの検証

本番相当の確認は、開発サーバーではなくビルド後のサーバーで行います。

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

Chrome DevToolsのLighthouseで、トップ、`/result/`、実績詳細、`/diary/`、記事詳細、`/contact/`をPC・モバイルの両方で確認してください。CLIを使う場合は、別ターミナルで次のように実行できます。

```bash
npx lighthouse@12 http://localhost:3000/ --only-categories=performance,seo,accessibility --output=html --output-path=./lighthouse-home.html
```

目標値はLCP 2.5秒以内、INP 200ms以内、CLS 0.1以下です。Lighthouseはラボ値のため、公開後はPageSpeed InsightsまたはSearch Consoleのフィールドデータも併せて確認してください。

microCMSのSEO・ケーススタディ項目と運用上の注意は [`docs/seo-cms-operations.md`](docs/seo-cms-operations.md) にまとめています。

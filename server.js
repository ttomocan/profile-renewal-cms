const express = require('express');
const next = require('next');
const compression = require('compression');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 高度な圧縮設定
  server.use(
    compression({
      filter: (req, res) => {
        // 圧縮すべきかどうかを判定
        if (req.headers['x-no-compression']) {
          return false;
        }
        // デフォルトのフィルターを使用
        return compression.filter(req, res);
      },
      level: 6, // 圧縮レベル（1-9、6が推奨）
      threshold: 1024, // 1KB以上のファイルを圧縮
      memLevel: 8, // メモリ使用量レベル（1-9）
    })
  );

  // セキュリティヘッダーの設定
  server.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Handle all requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});

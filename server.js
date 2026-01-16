import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import https from 'https';

const app = express();

app.use('/inject', express.static('public'));

const agent = new https.Agent({
  rejectUnauthorized: false
});

app.use(
  '/',
  createProxyMiddleware({
    target: 'https://app.primegourmet.club',
    changeOrigin: true,
    ws: true,
    agent,
    secure: false,
    selfHandleResponse: true,

    onProxyReq(proxyReq) {
      proxyReq.removeHeader('accept-encoding');
    },

    onProxyRes(proxyRes, req, res) {
      const contentType = proxyRes.headers['content-type'] || '';

      if (!contentType.includes('text/html')) {
        proxyRes.pipe(res);
        return;
      }

      let body = Buffer.from([]);

      proxyRes.on('data', chunk => {
        body = Buffer.concat([body, chunk]);
      });

      proxyRes.on('end', () => {
        let html = body.toString('utf8');

        res.writeHead(200, {
          'content-type': 'text/html; charset=utf-8'
        });

        html = html.replace(
          '</head>',
          `<link rel="stylesheet" href="/inject/historico/historico.css"></head>`
        );

        html = html.replace(
          '</body>',
          `<script src="/inject/historico/historico.js"></script></body>`
        );

        html = html.replace(
          '</head>',
          `<link rel="stylesheet" href="/inject/vouchers/vouchers.css"></head>`
        );

        html = html.replace(
          '</body>',
          `<script src="/inject/vouchers/vouchers.js"></script></body>`
        );

        html = html.replace(
          '</body>',
          `<img src="/inject/imagens/menu.jpg" class="nav-icon-override" /></body>`
        );

        res.end(html);
      });
    }
  })
);

app.listen(3000, () => {
  console.log('🚀 Proxy ativo em http://localhost:3000');
});

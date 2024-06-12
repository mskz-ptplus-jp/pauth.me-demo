FROM php:7.4-fpm-alpine

# Nginxをインストール
RUN apk add --no-cache nginx

# NginxとPHP-FPMの設定ファイルをコピー
COPY nginx.conf /etc/nginx/nginx.conf

# HTMLファイルとPHPファイルをコピー
COPY AP_URL /usr/share/nginx/AP_URL
COPY API_KEY /usr/share/nginx/API_KEY
COPY html /usr/share/nginx/html

# Nginxの起動スクリプトを追加
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# エントリーポイントを設定
ENTRYPOINT ["docker-entrypoint.sh"]

# デフォルトのCMDを設定
CMD ["php-fpm"]

WORKDIR /usr/share/nginx/html

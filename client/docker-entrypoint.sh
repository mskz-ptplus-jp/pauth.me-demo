#!/bin/sh

# Nginxをバックグラウンドで起動
nginx &

# PHP-FPMを起動
php-fpm

#!/bin/sh
set -xe
: "${API_URL?Need an api url}"

sed -i "s#REPLACE_API_URL#$API_URL#g" /usr/share/nginx/html/main*.js

if [[ ! -z $DOMAIN_URL ]]
then
    sed -i 's#href="/"#href="'$DOMAIN_URL'"#' /usr/share/nginx/html/index.html
fi

exec "$@"
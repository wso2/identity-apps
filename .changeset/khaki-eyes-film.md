---
"@wso2is/myaccount": minor
"@wso2is/console": minor
---

This pull request introduces support for a configurable proxy context path across multiple files in the project. The changes ensure that the application can dynamically handle different proxy context paths based on the server configuration.

Ex: The My Account can be hosted under `https://is.dev.wso2.com/auth/t/brionmario.com/myaccount`.
⚠️ Note that `auth` is the context path.

#### Pre-requisites

We currently need the following NGINX configuration.

- `auth` is the proxy context path.
- `https://is.dev.wso2.com` is the server host.

```nginx
upstream ssl.is.dev.wso2.com {
    server 127.0.0.1:9443;
    ip_hash;
}

server {
listen 443 ssl;
    server_name is.dev.wso2.com;
    ssl_certificate /opt/homebrew/etc/nginx/ssl/certificate.crt;
    ssl_certificate_key /opt/homebrew/etc/nginx/ssl/privateKey.key;

    location /auth/ {
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_read_timeout 5m;
        proxy_send_timeout 5m;
        proxy_pass https://ssl.is.dev.wso2.com/;

        # Dynamically rewrite cookie paths based on the tenant
        proxy_cookie_path ~^/(/)? /auth/$1;
        proxy_cookie_path / /auth;

        # Match and rewrite tenant-specific cookie paths
        proxy_cookie_path ~^/auth/(t/[^/]+)/ /auth/$1;

        proxy_redirect https://is.dev.wso2.com/auth/ https://is.dev.wso2.com/auth/;
        proxy_redirect https://is.dev.wso2.com/ https://is.dev.wso2.com/auth/;
        proxy_redirect https://is.dev.wso2.com:443/ https://is.dev.wso2.com/auth/;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /console {
        rewrite ^/console(.*)$ /auth/console$1 last;

        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;

        proxy_read_timeout 5m;
        proxy_send_timeout 5m;

        # Forward the rewritten path to the backend
        proxy_pass https://ssl.is.dev.wso2.com/;

        # Dynamically handle tenant-specific redirects
        proxy_redirect ~^https://is\.dev\.wso2\.com/auth/(t/[^/]+)/console https://is.dev.wso2.com/console;
    }

    location /myaccount {
        rewrite ^/myaccount(.*)$ /auth/myaccount$1 last;

        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;

        proxy_read_timeout 5m;
        proxy_send_timeout 5m;

        # Forward the rewritten path to the backend
        proxy_pass https://ssl.is.dev.wso2.com/;

        # Dynamically handle tenant-specific redirects
        proxy_redirect ~^https://is\.dev\.wso2\.com/auth/(t/[^/]+)/myaccount https://is.dev.wso2.com/myaccount;
    }
}
```

#### Consuming the context path

Context path configuration is consumed in different ways.

1. Get the `proxy context` path defined in `server.proxy_context_path` using the Java Util in the JSP files.

```js
var proxyContextPathGlobal = "<%=ServerConfiguration.getInstance().getFirstProperty(PROXY_CONTEXT_PATH)%>";
```

2. Additionally, can override the context path per app with a TOML config.

```toml
[console]
proxy_context_path = "auth"
```

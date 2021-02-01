## 本地开发

### 安装依赖

```
npm install
```

### 启动服务

```
npm start
```

## aliyun配置(Centos)

### 安装Node.js

```
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum install -y nodejs
```

### 安装pm2

```
npm install pm2 -g
```

### 安装MySQL

```
wget http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm &&
yum -y install mysql57-community-release-el7-10.noarch.rpm &&
yum -y install mysql-community-server
```

如遇`No match for argument: mysql-community-server`错误，执行

```
yum module disable mysql
```

再次执行

```
yum -y install mysql-community-server
```

#### 启动MySQL

```
systemctl start mysqld.service
```

#### 查看临时密码

```
grep "password" /var/log/mysqld.log
```

#### 登录MySQL

```
mysql -uroot -p
```

#### 重置密码

```
set global validate_password_policy=0;  #修改密码安全策略为低（只校验密码长度，至少8位）。
ALTER USER 'root'@'localhost' IDENTIFIED BY '12345678'; #12345678为新密码
```

### 安装Git

```
yum install git
```

### Clone项目

### 安装程序依赖

```
cd firekylin
npm install
```

#### 复制项目下的 pm2_default.json 文件生成新文件 pm2.json

```
cp pm2_default.json pm2.json
```

#### 修改 pm2.json 文件中的 cwd 配置值为项目的当前路径 /root/firekylin：

```
{
   "apps": [{
     "name": "firekylin",
     "script": "www/production.js",
     "cwd": "/root/firekylin",
     "exec_mode": "fork",
     "max_memory_restart": "1G",
     "autorestart": true,
     "node_args": [],
     "args": [],
     "env": {
 
     }
   }]
}
```

#### 然后通过以下命令启动项目

```
pm2 startOrReload pm2.json
```

### 安装Nginx

```
yum install nginx -y
```

### 配置Nginx

```
server {
    listen 80;
    server_name example.com www.example.com; #将 www.example.com 替换为之前注册并解析的域名
    root /Users/welefen/Develop/git/firekylin/www;
    set $node_port 8360;

    index index.js index.html index.htm;

    location ^~ /.well-known/acme-challenge/ {
      alias /Users/welefen/Develop/git/firekylin/ssl/challenges/;
      try_files $uri = 404;
    }

    location / {
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-NginX-Proxy true;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_pass http://127.0.0.1:$node_port$request_uri;
        proxy_redirect off;
    }

    location = /development.js {
        deny all;
    }
    location = /testing.js {
        deny all;
    }

    location = /production.js {
        deny all;
    }


    location ~ /static/ {
        etag         on;
        expires      max;
    }
}


#https nginx conf

#server{
#    listen 443;
#    server_name example.com www.example.com;
#    root /Users/welefen/Develop/git/firekylin/www;
#    set $node_port 8360;

#    ssl on;
#    ssl_certificate  %path/ssl/chained.pem;
#    ssl_certificate_key %path/ssl/domain.key;

#    ssl_session_timeout 5m;
#    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
#    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES128-SHA:DHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA;
#    ssl_session_cache shared:SSL:50m;
#    ssl_dhparam %path/ssl/dhparams.pem;
#    ssl_prefer_server_ciphers on;


#    index index.js index.html index.htm;

#    location ^~ /.well-known/acme-challenge/ {
#      alias %path/ssl/challenges/;
#      try_files $uri = 404;
#    }

#   location / {
#        proxy_http_version 1.1;
#        proxy_set_header X-Real-IP $remote_addr;
#        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#        proxy_set_header Host $http_host;
#        proxy_set_header X-NginX-Proxy true;
#        proxy_set_header Upgrade $http_upgrade;
#        proxy_set_header Connection "upgrade";
#        proxy_pass http://127.0.0.1:$node_port$request_uri;
#        proxy_redirect off;
#    }

#    location = /development.js {
#        deny all;
#    }

#    location = /testing.js {
#        deny all;
#    }

#    location = /production.js {
#        deny all;
#   }


#   location ~ /static/ {
#      etag         on;
#      expires      max;
#   }
#}
#server {
#    listen 80;
#    server_name example.com www.example.com;
#    rewrite ^(.*) https://example.com$1 permanent;
#}
```

```
ln -s /root/firekylin/nginx.conf /etc/nginx/conf.d/firekylin.conf
service nginx restart
```


[更多内容](https://github.com/miejike/firekylin)

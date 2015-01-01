[Docker](http://www.docker.com/) 是个轻量级的虚拟化解决方案，可以将你的应用和所需的运行环境打包起来，部署至其他环境，保证开发或生产环境的统一。
对于开发人员来说，Docker 可以减少初次搭建开发环境的麻烦；
对于运维人员来说，Docker 使自动化、规模化部署变得更加简单。
<!-- more -->

## Docker 入门
本文不涉及太多的入门知识，假若你未曾听过 Docker，请先浏览官方资源：
1. 观看 Docker [介绍视频](https://www.docker.com/whatisdocker/)
2. 动手完成 10 分钟 [在线交互教程](https://www.docker.com/tryit/#)

## 下载并更新 Ubuntu 镜像
本文中 NodeJS 应用是部署在 Ubuntu 下的，所以要先通过以下命令，下载 Ubuntu 镜像，并更新保存。

```bash
# 从 Docker Hub 下载官方维护的 Ubuntu
docker pull ubuntu:14.10

# 下载完毕后，先更新软件源
docker run ubuntu:14.10 apt-get update

# 上面命令会生成一个container，先获得其 id
# -l：显示最新的 container
doocker ps -l

# 提交改动，并覆盖原有的 Ubuntu 镜像
docker commit <container_id> ubuntu:14.10
```

## 从创建简单的 NodeJS 应用镜像入手

我们先来创建一个基于 ExpressJS 的简单 NodeJS 应用，以下是文件目录结构和步骤。

### 目录结构
<pre class="tree">
├── docker-node-hello/
│   ├── index.js
│   ├── package.json
│   ├── Dockerfile
</pre>

### 文件创建步骤
1. 创建文件夹
  ```bash
  mkdir ~/docker-node-hello && cd $_
  ```

2. 创建 index.js
  ```js
  var express = require('express')
  var app = express()

  app.get('/', function (req, res) {
    res.send('Hello World!')
  })

  var server = app.listen(3001, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)

  })
  ```

3. 创建 package.json
  ```json
  {
    "name": "docker-node-hello",
    "private": true,
    "version": "0.0.1",
    "description": "Node.js Hello world app on Ubuntu using docker",
    "dependencies": {
      "express": "4.x.x"
    }
  }
  ```

4. 创建 Dockerfile 配置文件
  ```bash
  # 设置基础镜像
  FROM ubuntu:14.10

  # 如果上个步骤已经更新软件源，这步可以忽略
  RUN apt-get update

  # 安装 NodeJS 和 npm
  RUN apt-get install -y nodejs npm

  # 将目录中的文件添加至镜像的 /srv/hello 目录中
  ADD . /srv/hello

  # 设置工作目录
  WORKDIR /srv/hello

  # 安装 Node 依赖库
  RUN npm install

  # 暴露 3001 端口，便于访问
  EXPOSE 3001

  # 设置启动时默认运行命令
  CMD ["nodejs”, “/srv/hello/index"]
  ```

### 构建镜像
  ```bash
  # 通过该命令，按照 Dockerfile 所配置的信息构建出镜像
  # -t 镜像的名称
  # --rm 构建成功后，删除临时镜像（每执行一行 Dockerfile 中的命令，就会创建一个临时镜像）
  docker build --rm -t node-hello .

  # 检查镜像是否创建成功
  docker images
  ```

### 运行镜像
  ```bash
  # 对于 Mac 或 Windows 来说，要先查看 boot2docker 的 IP
  boot2docker ip

  # 运行刚刚创建的镜像
  # -p 设置端口，格式为「主机端口:容器端口」
  docker run -p 3001:3001 node-hello
  ```

### 访问网页
若终端打印出 `Example app listening at http://...`，则部署成功。
可以用浏览器访问 `http://<boot2docker ip>:3001`，或运行 `curl -s "$(boot2docker ip):3001"`。

## 创建完整的 NodeJS 应用镜像（含 Mongodb / Git）
通过上面的例子，我们知道了整个 Docker 镜像的基本创建过程。
但实际项目中，项目代码往往是通过 Git 来管理的，而且还会连接到一些数据库，如 Mongodb。
本例子中，我们将尝试部署一个 MEAN 架构的 NodeJS 应用。
> 什么是 MEAN 架构？
> MEAN 表示 Mongodb / ExpressJS / AngularJS / NodeJS，是目前流行的网站应用开发组合，涵盖前端至后台。由于这些框架用的语言都是 Javascript，所以又戏称 Javascript Fullstack。

### 目录结构
<pre class="tree">
├── docker-node-full/
│   ├── start.sh
│   ├── Dockerfile
</pre>

### 文件创建步骤
1. 创建文件夹
  ```bash
  mkdir ~/docker-node-full && cd $_
  ```

2. 创建 Dockerfile 配置文件
  ```bash
  # 设置基础镜像
  FROM ubuntu:14.10

  # 安装 NodeJS 和 npm
  RUN apt-get install -y nodejs npm

  # 由于 apt-get 下载的 Node 实际上是 nodejs，所以要创建一个 node 的快捷方式
  RUN ln -s /usr/bin/nodejs /usr/bin/node

  # 安装 Git
  RUN apt-get install -y git

  # 安装 Mongodb（来自官方教程）
  RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
  RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
  RUN apt-get update
  RUN apt-get install -y mongodb-org

  # 设置工作目录
  WORKDIR /srv/full

  # 清空已存在的文件（如果有）
  RUN rm -rf /srv/full

  # 通过 Git 下载准备好的 MEAN 架构的网站代码
  RUN git clone https://github.com/chuyik/fullstack-demo-dist.git .

  # 安装 NodeJS 依赖库
  RUN npm install --production

  # 创建 mongodb 数据文件夹
  RUN mkdir -p /data/db

  # 暴露端口（分别是 NodeJS 应用和 Mongodb）
  EXPOSE 5566 27017

  # 设置 NodeJS 应用环境变量
  ENV NODE_ENV=production PORT=5566

  # 添加启动脚本
  ADD start.sh /tmp/
  RUN chmod +x /tmp/start.sh

  # 设置启动时默认运行命令
  CMD ["bash", "/tmp/start.sh"]
   ```

3. 创建 start.sh 启动脚本
  ```bash
  # 后台启动 Mongodb
  mongod --fork --logpath=/var/log/mongo.log --logappend

  # 运行 NodeJS 应用
  npm start
  ```

### 构建镜像
  ```bash
  # 通过该命令，按照 Dockerfile 所配置的信息构建出镜像
  docker build --rm -t node-full .

  # 检查镜像是否创建成功
  docker images
  ```

### 运行镜像
  ```bash
  # 对于 Mac 或 Windows 来说，要先查看 boot2docker 的 IP
  boot2docker ip

  # 运行刚刚创建的镜像
  # -p 设置端口，格式为「主机端口:容器端口」
  docker run -p 5566:5566 node-full
  ```

### 访问网页
若终端打印出以下命令，则部署成功。
>  about to fork child process, waiting until server is ready for connections.
    forked process: 9
  child process started successfully, parent exiting
       >  demo@0.0.0 start /srv
     >  node server/app.js
  Express server listening on 5566, in production mode

可以用浏览器访问 `http://<boot2docker ip>:5566`，或运行 `curl -s "$(boot2docker ip):5566"`。

## 保存 Mongodb 数据文件
由于 Mongodb 服务运行在 Docker 容器 (container) 中，所以数据也在里面，但这并不利于数据管理和保存。因此，可以通过一些方法，将 Mongodb 数据文件保存在容器的外头。

### 磁盘映射
这个是最简单的方式，在 `docker run` 命令当中，就有磁盘映射的参数 `-v`。
```bash
# -v 磁盘映射，格式为「主机目录:容器目录」
docker run -p 5566:5566 -v /var/mongodata:/data/db node-full
```

但这个命令在 Mac 和 Windows 中执行失败，因为 boot2docker 的虚拟机不支持。
所以，可以将数据保存在 boot2docker 内，并设置共享文件夹便于 Mac 或 Windows 访问。

### Mac 的磁盘映射方案
```bash
# 在 boot2docker 中，运行该命令
boot2docker ssh
# 进入 bash 后，创建存放 Mongodb 数据库文件的目录
sudo mkdir -p /mnt/sda1/dev

# Mac 用户通过 brew 安装 sshfs
brew install sshfs
# 通过 sshfs，把 /mnt/sda1/dev 挂载到 Mac 中
# 注：boot2docker 的默认用户为 docker/tcuser
echo tcuser | sshfs docker@localhost:/mnt/sda1/dev /var/mongodata -p 2022 -o password_stdin

# 运行镜像测试（映射 boot2docker 的目录）
docker run -p 5566:5566 -v /mnt/sda1/dev:/data/db node-full
```

## 优化建议

###  将 NodeJS 和 Mongodb 分开
上个例子中，我们把 NodeJS 和 Mongodb 放进了同一个镜像中，但本着一次只做一件事的原则，将其放进不同的镜像可能会更好。但分开后，NodeJS 和 Mongodb 运行的容器该如何关联呢？这里不展开介绍，有兴趣可以查阅该[博文](http://www.luiselizondo.net/how-to-create-a-docker-node-js-mongodb-varnish-environment/)。

### 使用进程管理工具
上个例子中，我们通过 bash 脚本来运行多个命令，但也可以用一些进程管理工具来配置进程，如 [Supervisor](http://supervisord.org/introduction.html)。整合的方式可以查阅官方教程 [Using Supervisor with Docker](https://docs.docker.com/articles/using_supervisord/)。

## 一些有用的 Docker 命令

### 查看后台运行容器的日志
```bash
docker ps -l
docker logs <container_id>
```

### 开始和关闭容器的运行
```bash
docker stop <container_id>
docker start -i <container_id>
docker restart -i <container_id>
```

### 运行镜像的bash
```bash
# -i 将命令的输出信息重定向到 stdout
# -t 开启 tty 终端，这样就能够输入指令
docker run -it ubuntu:14.10 bash
```

### 导入和导出镜像
```bash
docker save ubuntu:14.10 > ubuntu_14.10.tar
sudo docker ubuntu:14.10 < ubuntu_14.10.tar
```

### 停止和删除所有容器（来自 [Fabio Rehm](https://coderwall.com/p/ewk0mq/stop-remove-all-docker-containers)）
```bash
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```

## 参考文章 Credits
[Dockerizing a Node.js Web App](https://docs.docker.com/examples/nodejs_web_app/)
[利用Docker构建开发环境 | UC技术博客](http://tech.uc.cn/?p=2726)
[Dockerfile - Docker Documentation](http://docs.docker.com/reference/builder)
[Command line - Docker Documentation](http://docs.docker.com/reference/commandline/cli/)
[Using Supervisor - Docker Documentation](https://docs.docker.com/articles/using_supervisord/)
[How to create a Docker + Node.js + MongoDB + Varnish environment](http://www.luiselizondo.net/how-to-create-a-docker-node-js-mongodb-varnish-environment/)
[How to share folders with docker containers on OSX](https://gist.github.com/codeinthehole/7ea69f8a21c67cc07293)
[PouchDB](http://pouchdb.com/) 是一个能运行在网页上、支持数据同步、专为移动应用设计的 NoSQL 数据库。
本文将从多个方面介绍 PouchDB，包括如何上手，如何同步、解决同步带来的数据冲突，如何与 AngularJS 结合、在 Cordova/Phonegap 上运用，局限性以及服务器的设置。
<!-- more -->

## PouchDB 的优点
1. 数据双向同步
> 网页、手机客户端在离线后生成的数据，可以在上线时被同步至服务器
> 服务端生成或接收到数据后，可以实时推送给其他的客户端

2. 数据支持版本管理
> 由于同步会带来很多的数据冲突的问题，所以 PouchDB 仿照了 Git（代码版本管理工具），将每份数据打上了版本号，便于数据的回溯和还原。

3. 专为 Web 而生
> 使用 HTTP 协议和 RESTful 格式进行数据查看与操作
> PouchDB 用 JavaScript 写成，能方便地运行在网页、Hybird App、NodeJS 上

4. 轻量级和完善的官方文档

5. 开源项目（Apache 协议）

## PouchDB 入门

## PouchDB 同步

## PouchDB 与 AngularJS 的结合

## 在 Cordova 上使用 PouchDB

## PouchDB 使用限制

## PouchDB 与 CouchDB 的关系


## 参考文章 Credits
http://www.mircozeiss.com/sync-multiple-angularjs-apps-without-server-via-pouchdb/
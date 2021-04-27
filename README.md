# 基础后台管理界面

基于 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template.git) 制作的后台管理系统  
保留了 vue-admin-template 中使用的 eslint 代码风格校验规则  
保留了 vue-admin-template 中的角色权限功能，主要部分做了中文注释

### 权限管理 动态路由的主要文件

1. src/permission.js : 脚本中的路由前置守卫中来进行逻辑判断，获取角色，生成不同的路由表
2. src/store/modules/user.js : 使用脚本中的 getInfo 方法来获取登录用户的角色列表，详情请自行查看此方法
3. src/router/index.js : 在路由的 meta 对象的 roles 属性中写入角色

```bash
# clone the project
git clone git@github.com:EliteFan0814/base-vue-admin-template.git

# enter the project directory
cd base-vue-admin-template

# install dependency
npm install

# develop
npm run dev
```

This will automatically open http://localhost:9528

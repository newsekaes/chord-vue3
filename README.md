# Chord

基于 TypeScript 环境，使用新一代构建工具 Vite，使用 Vue 3 全家桶制作的和弦练习小工具。供学习参考和小娱乐  
[在线浏览](https://newsekaes.github.io/chord-vue3/)

> 原 `Vue 2` 的版本: [chord](https://github.com/newsekaes/chord)

## 运行
```
$ git clone <本项目 git 地址>

$ cd chord-vue3

$ yarn

$ yarn dev
```

## 简介

使用 Vue 3 + TypeScript + Vite 2

- [Vue 3 官方中文](https://staging-cn.vuejs.org/)
- [Vite 2 官方中文](https://cn.vitejs.dev/)

### Vite
本项目是用 Vite 从 0 开始集成的，类似于 [Vue CLI](https://cli.vuejs.org/zh/guide/)，安装 Vite , 并创建一个支持 TypeScript 的 Vue 项目的命令如下
```
$ yarn create vite
$ yarn create vite my-vue-app --template vue-ts
```

### Pinia
使用了官方推荐的 `Pinia` 取代了 `Vuex`, 目前 `Vuex` 版本为 `v4.x.x`, 而 `Pinia` 正被视为下一代 `Vuex 5` 的位置进行着开发
- [Pinia](https://pinia.vuejs.org/)
- [Pinia 中文](https://pinia.web3doc.top)
> 至于路由，还是用的 [vue-router v4.x](https://router.vuejs.org/zh/index.html)
### TSX 和 `setup`

伴随着 Vue 3 新设计的 **[组合式 API](https://staging-cn.vuejs.org/guide/extras/composition-api-faq.html)** , 随之而来的是组件在多个维度上的书写方式：

1. **组合式 API** vs **选项式 API**   
2. **template 模板** vs **render 函数 ( JSX )**   
3. **SFC (`.vue` 单文件模板)** vs **AllInJS (`.ts` 文件)**   
4. 如果是组合式 API： **`setup` return 对象** vs **`setup` return `render`**   

具体到本项目，使用的是 
- 组合式 API
- render 函数 ( JSX )
- AllInJS (`.ts` 文件 + CSS Module)
- 至于， “ **`setup` return 对象** 和 **`setup` return `render`** ” 的选择，因为后一种在 [为组件模板 ref 标注类型](https://staging-cn.vuejs.org/guide/typescript/composition-api.html#typing-component-template-refs) 的场景下会有类型推导障碍，所以两种方式均有使用

>  当使用 AllInJS 的方案时， 在需要 [为组件模板 ref 标注类型](https://staging-cn.vuejs.org/guide/typescript/composition-api.html#typing-component-template-refs) 的场景下，假设 父组件 `<Parent>` 用 `ref` 标注了 子组件 `<Child>`, `<Child>` 需要用 **`setup` return 对象** 的方式，才能让父组件正确地推导出类型


> **Important !**  
> 本项目是抱着探（头）索（铁）的心态去挑选了一种方案；  
> 强烈推荐使用 **SFC** + **template 模板** + `<script setup lang="ts">`, 而非本项目的书写方式, 这样可以得到无论是从 **IDE 辅助** 还是 **类型推导** 上更多的帮助

### 其他 dependencies
基于 vue 3 重新设计的 [Vant 3](https://gitee.com/vant-contrib/vant/) 和 [Vue Konva](https://github.com/konvajs/vue-konva)


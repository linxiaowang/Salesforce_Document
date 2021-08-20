// vitepress/config.js
module.exports = {
  title: "Lightning Web Component", // 网站标题
  description: "我的vitepress博客.", //网站描述
  base: "/", //  部署时的路径 默认 /  可以使用二级地址 /base/
  // lang: 'en-US', //语言
  repo: "vuejs/vitepress",
  // 主题配置
  themeConfig: {
    //   头部导航
    nav: [
      { text: "首页", link: "/" },
      { text: "关于", link: "/about/" },
    ],
    //   侧边导航
    sidebar: [
      {
        text: "初始化",
        link: "/initial/",
      },
      {
        text: "HTML模板",
        link: "/html/",
      },
      {
        text: "模块",
        link: "/module/",
      },
      {
        text: "CSS",
        link: "/css/",
      },
      {
        text: "组合",
        link: "/composition/",
      },
      {
        text: "响应式",
        link: "/reactive/",
      },
      {
        text: "Fields, Properties, and Attributes",
        link: "/property/",
      },
      {
        text: "事件",
        link: "/event/",
      },
      {
        text: "生命周期",
        link: "/lifecircle/",
      },
      {
        text: "共享js代码",
        link: "/share/",
      },
      {
        text: "第三方js库",
        link: "/jslib/",
      },
    ],
  },
};

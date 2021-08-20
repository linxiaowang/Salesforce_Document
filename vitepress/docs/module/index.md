# 模块化

`Lightning Web` 组件中的所有 `JavaScript` 文件都是 ES 模块。 ES 模块是一个` JavaScript` 文件，它显式导出其他模块可以导入和使用的变量或函数。

一个 `Lightning Web` 组件由 HTML 模板和 ES 模块组成。

```html
<!-- example.html -->
<template> My Component </template>
```

UI 组件的 ES 模块必须从 lwc 中导入 `LightningElement` ，它是 `Lightning Web Components` 的核心模块。默认导出必须是扩展 `LightningElement` 的类，它是标准 HTML 元素的自定义包装器。

```javascript
// example.js
import { LightningElement } from "lwc";

export default class Example extends LightningElement {}
```

要在组件之间共享代码，创建一个充当库（也称为服务组件）的 ES 模块。导出想要共享的变量或函数，然后导入到其他想要使用的模块中

## 模块解析

因为 ES 模块会导入其他模块，所以在构建时编译器必须找到所有模块文件。这个过程称为模块解析。

模块解析提供了一种跨多个` repos` 和 `npm` 包构建和使用模块的统一方法。您可以仅使用 `npm` 从任何人导入组件。你也可以通过 `npm` 分发你自己的组件。

### 配置组件解析

要告诉编译器如何解析模块，请在项目的根目录添加配置信息。有两种配置模块解析的方法。

- 在项目的根目录添加一个 `lwc.config.json` 文件

```json
// lwc.config.json
{
  "modules": [
    /* list of module records */
    {
      "dir": "src/modules"
    }
  ]
}
```

- 在 `package.json` 中添加 `lwc`

```json
// package.json
{
  "name": "my-app",
  "version": "1.0.0",
  "lwc": {
    "modules": [
      /* list of module records */
      {
        "dir": "src/modules"
      }
    ]
  }
}
```

modules 键包含一个 `ModuleRecords` 数组。模块记录是具有特定形状的对象，具体取决于它所持有的模块记录的类型。您至少需要一个指向本地源的 `ModuleRecords` 条目。 `ModuleRecords` 共有三种类型。

- `AliasModuleRecord`—定义指向特定模块的说明符。必须有 `name` 和 `path` 属性
- `DirectoryModuleRecord`—定义一个可以在其中定义许多命名空间模块的文件夹。必须有一个 `dir` 属性。

- `NpmModuleRecord`—定义一组包含更多待解析模块的包。必须有一个 `npm` 属性.

```json
{
  "modules": [
    {
      "dir": "src/modules"
    },
    {
      "name": "ui/button",
      "path": "src/modules/ui/button/button.js"
    },
    {
      "npm": "lwc-recipes-oss-ui-components"
    }
  ]
}
```

特异性从内到外解析，向上合并。

### 使用 npm 分发您的组件

正如我们刚刚了解到的，`NpmModuleRecord` 加载在 `npm` 包中发布的 `Lightning Web` 组件。` Lightning Web` 组件作为源代码发布到 `npm`。 `npm` 包的使用者必须编译包的组件部分。

要通过 `npm` 分发您自己的 `Lightning Web` 组件包，请明确定义项目中要公开的组件。使用 `lwc.config.json` 或 `package.json` 文件中的 `expose` 属性。

```json
{
  "modules": [
    {
      "dir": "src/modules"
    }
  ],
  "expose": [
    "ui/button",
    "ui/card",
    "ui/input",
    "ui/navfooter",
    "ui/output",
    "ui/select"
  ]
}
```

### 资源

本文档依赖于模块解析功能规范以及来自 Salesforce Architect、Developer Evangelism、René Winkelmeyer 的博客文章。如需更多信息，请阅读这些文件

- [Module Resolution RFC](https://rfcs.lwc.dev/rfcs/lwc/0020-module-resolution)
- [Lightning Web Components Module Resolution](https://developer.salesforce.com/blogs/2020/09/lightning-web-components-module-resolution.html)

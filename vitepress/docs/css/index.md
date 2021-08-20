# CSS

要将样式与组件捆绑在一起，请在组件的文件夹中创建一个样式表。样式表必须与组件同名。样式表会自动应用于组件

每个组件只能有一个样式表。组件不能共享样式表。样式表使用标准 CSS 语法，您可以使用大多数选择器。

组件样式表中定义的样式的作用域是组件。这个规则允许一个组件在不同的上下文中被重用而不会失去它的风格。它还可以防止组件的样式覆盖页面其他部分的样式。

## CSS Scoping Examples

这个例子演示了父组件中定义的 CSS 样式如何不影响子组件

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8d65ebb7b3c4df59cc3a0daaff1ecd2~tplv-k3u1fbpfcp-watermark.image)

cssParent.html

```html
<template>
  <p>To Do List</p>
  <example-css-child></example-css-child>
</template>
```

cssParent.css

```css
p {
  font-size: xx-large;
}
```

cssChild.html

```html
<template>
  <p>To Do Item</p>
</template>
```

父组件可以设置子组件的样式，但将其样式设置为单个元素。父级无法访问子级的 DOM。在 Playground 中，向 cssParent.css 添加一个 example-css-child 选择器，用于定义子组件的背景

```css
/* cssParent.css */
p {
  font-size: xx-large;
}

example-css-child {
  display: block;
  background: whitesmoke;
}
```

一个组件的样式表可以达到并设置它自己的元素的样式，通过使用 :host 选择器。

```css
:host {
  display: block;
  background: whitesmoke;
}
```

## 创建样式钩子

要为自定义组件公开样式钩子，请使用 CSS 自定义属性。 CSS 自定义属性还使代码更易于阅读和更新。

将组件的样式钩子记录为组件 API 的一部分。要更改组件的样式，使用者只需为样式钩子设置值——他们不需要知道您是如何实现这些样式的。

要在组件的样式表中定义 CSS 自定义属性，请在属性前加上 --。要插入属性的值，请使用 var()

```css
:host {
  --important-color: red;
}

.important {
  color: var(--important-color);
}
```

CSS 自定义属性是继承的。继承的属性穿透了 shadow DOM。一些 CSS 属性，如颜色，也是继承的。因为 CSS 自定义属性是继承的，所以使用者可以在 DOM 树中的更高级别设置它们的值并设置组件的样式。

这些 CSS 自定义属性为两个主题创建样式挂钩：浅色和深色。将回退值作为可选的第二个参数传递给 var()。

```css
.light {
  background-color: var(--light-theme-backgroud-color, lightcyan);
  color: var(--light-theme-text-color, darkblue);
}

.dark {
  background-color: var(--dark-theme-background-color, darkslategray);
  color: var(--dark-theme-text-color, ghostwhite);
}
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/824e777ec24c4af896cd8e130fa1d8a5~tplv-k3u1fbpfcp-watermark.image)

ssCustomProps.html

```html
<template>
  <p class="light">
    This UI has a light theme. Etiam hendrerit eros a nisi tristique accumsan.
    Donec imperdiet, neque at eleifend semper, eros dolor sollicitudin odio,
    vitae suscipit augue tortor sed velit.
  </p>
  <p class="dark">
    This UI has a dark theme. Maecenas eget felis congue, ornare justo ut,
    fringilla ex. Integer ante sapien, hendrerit congue sodales sit amet,
    fringilla vitae quam.
  </p>
</template>
```

cssCustomProps.css

```css
.light {
  background-color: var(--light-theme-backgroud-color, lightcyan);
  color: var(--light-theme-text-color, darkblue);
}

.dark {
  background-color: var(--dark-theme-background-color, darkslategray);
  color: var(--dark-theme-text-color, ghostwhite);
}
```

## 共享 CSS 样式规则

要共享 CSS 样式规则，请创建一个仅包含 CSS 文件的模块。将该模块导入到您想要设置样式的任何 Lightning Web 组件的 CSS 文件中。您可以从多个 CSS 模块导入样式规则。导入的样式规则就像未导入的样式规则一样应用于模板。 Lightning Web Components 支持 CSS 级联算法。

```css
/* Syntax */
@import "namespace/moduleName";

/* Example */
@import "example/cssLibrary";
```

cssSharing.html

```html
<template>
  <h1>Title</h1>
  <p>Body text</p>
</template>
```

cssSharing.css

```css
@import "example/cssLibrary";
```

cssLibrary.css

```css
h1 {
  color: darkorchid;
  font-size: xx-large;
}
p {
  color: yellowgreen;
  font-size: larger;
}
```

## CSS 支持和性能影响

CSS 范围与 CSS 范围模块级别 1 标准相匹配，但有一些例外。

- 不支持 :host-context() 伪类函数
- 不支持 CSS 或 JavaScript 中的 ID 选择器。

作用域 CSS 会影响性能，因此请谨慎使用。每个选择器链都是有作用域的，每个传递给 :host() 的复合表达式都分布在多个选择器中。这种转换增加了生成的 CSS 的大小和复杂性。这些增加意味着线路上有更多位、更长的解析时间和更长的样式重新计算时间。

为了保证 CSS 的封装性，每个元素都有一个额外的属性，这也增加了渲染时间。例如， `<example-parent>` 具有 `example-parent_parent-host`属性。

```html
<example-parent example-parent_parent-host>
  <h1 example-parent_parent>To Do List</h1>
  <example-child example-parent_parent example-child_child-host>
    <h1 example-child_child>To Do Item</h1>
  </example-child>
  <example-child class="active" example-parent_parent example-child_child-host>
    <h1 example-child_child>To Do Item</h1>
  </example-child></example-parent
>
```

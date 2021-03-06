# 组件生命周期

Lightning Web 组件的生命周期由框架管理。该框架创建组件，在 DOM 中添加和删除它们，并在组件状态发生变化时呈现 DOM 更新。

生命周期钩子是在组件实例生命周期的特定阶段触发的 JavaScript 回调方法。

## 生命周期流

此图显示了组件生命周期从创建到渲染的流程。

<img src="https://lwc.dev/assets/images/lifecycle_render.svg" alt="Shows the lifecycle of a component instance from creation through renderedCallback."  />

这是组件实例及其子组件从创建到渲染的生命周期。

1. `constructor()` is called.
2. Public properties 更新.
3. 组件被插入到 DOM 中.
4. `connectedCallback()` 被调用.
5. 组件渲染完毕.
6. `constructor()` 在子组件上被调用.
7. Public properties 在子组件上被更新.
8. 子组件被插入到 DOM 中.
9. `connectedCallback()` 在子组件中调用.
10. 子组件渲染完毕.
11. `renderedCallback()` 在子组件中被调用.
12. `renderedCallback()` 在当前组件调用.

这是从 DOM 中删除组件实例时的生命周期。

1. 组件从 DOM 中被移除.
2. `disconnectedCallback()` 在该组件被调用.
3. 子组件从 DOM 中被移除.
4. `disconnectedCallback()` 在每个子组件中被调用.

## constructor()

在创建组件实例时 constructor() 方法被调用。

构造函数从父级流向子级。

要访问宿主元素，请使用 `this.template`。您无法访问组件主体中的子元素，因为它们尚不存在。属性也没有通过。在构造之后和 `connectedCallback()` 挂钩之前，属性被分配给组件。

这些来自 HTML 的要求：自定义元素规范适用于构造函数`constructor()`

- 第一个语句必须是不带参数的 super()。此调用为此建立了正确的原型链和 `this`值。在触摸`this`之前总是调用 super()
- 不要在构造函数体内使用 return 语句，除非它是一个简单的提前返回（`return`或`return this`）
- 不要使用 `document.write()` 或 `document.open()` 方法。
- 不要检查元素的属性和子元素，因为它们还不存在。
- 不要检查元素的公共属性，因为它们是在组件创建后设置的

**重要：不要在构造函数中向宿主元素添加属性。您可以在组件生命周期的任何阶段（构造除外）向宿主元素添加属性。**

## connectedCallback()

当一个组件被插入到 DOM 中时，`connectedCallback()` 生命周期钩子被调用。

这个钩子从父级流向子级。

要访问宿主元素，请使用`this`。您无法访问组件主体中的子元素，因为它们尚不存在。

`connectedCallback()` 钩子可以触发多次。例如，如果您删除一个元素，然后将其插入到另一个位置，例如当您对列表重新排序时，则会多次调用该钩子。如果您希望代码运行一次，请编写代码以防止其运行两次。

您可以使用 `connectedCallback()` 向宿主元素添加属性。

```js
import { LightningElement } from "lwc";
export default class New extends LightningElement {
  connectedCallback() {
    this.classList.add("new-class");
  }
}
```

您还可以使用 `connectedCallback()` 和 `disconnectedCallback()` 来注册和取消注册事件侦听器。浏览器垃圾收集 DOM 事件，因此您可以选择不注销它们。但是，依赖垃圾收集会导致内存泄漏。

_Note: To check whether a component is connected to the DOM, you can use `this.isConnected`_。

## disconnectedCallback()

当组件从 DOM 中移除时，将会调用 `disconnectedCallback()` 生命周期钩子。

这个钩子从父级流向子级。

## render()

对于像条件渲染模板这样的复杂任务，请使用 `render()` 来覆盖标准渲染功能。该函数可以在 `connectedCallback()` 之前或之后调用。

_Note: `render()` 方法在技术上不是生命周期钩子。它是 `LightningElement` 类上的受保护方法。一个钩子通常会告诉你发生了一些事情，它可能存在也可能不存在于原型链上。 `render()` 方法必须存在于原型链上。_

## renderedCallback()

在每次渲染组件后调用。这个钩子从孩子流向父级。

当组件重新渲染时，模板中使用的所有表达式都会重新评估。

由于突变，一个组件在应用程序的生命周期中通常会被渲染多次。要使用此钩子执行一次性操作，请使用像 `hasRendered` 这样的布尔字段来跟踪是否已执行 `renderCallback()`。 `renderCallback()` 第一次执行时，执行一次性操作并设置 `hasRendered = true`。如果 `hasRendered = true`，则不执行该操作。

最好在 HTML 模板中以声明方式附加事件侦听器。但是，如果您想在 JavaScript 中以编程方式将事件侦听器附加到模板元素，请使用 `renderCallback()`。如果一个监听器被重复添加到同一个元素，如果事件类型、事件监听器和选项相同，浏览器会删除重复项。

重新渲染模板时，`LWC` 引擎会尝试重用现有元素。在以下情况下，引擎使用差异算法来决定是否丢弃元素。

- 使用 `for:each` 指令创建的元素。重用这些迭代元素的决定取决于 `key` 属性。如果 `key` 发生变化，元素可能会被重新渲染。如果 `key` 没有改变，元素就不会被重新渲染，因为引擎假设它没有改变。
- 作为插槽内容接收的元素。引擎尝试重用 `<slot>` 中的元素，但差异算法确定是否驱逐元素并重新创建它。

## errorCallback(error, stack)

_Note: 此生命周期挂钩特定于 Lightning Web 组件，而不是来自 HTML 自定义元素规范。_

当后代组件在其生命周期钩子之一中抛出错误时调用。 error 参数是一个 JavaScript 原生错误对象，而 stack 参数是一个字符串。

实现此钩子以创建一个错误边界组件，该组件捕获其树中所有后代组件中的错误。错误边界组件可以记录堆栈信息并呈现一个替代视图来告诉用户发生了什么以及接下来要做什么。该方法的工作原理类似于 JavaScript catch{} 块，用于在其生命周期挂钩中抛出错误的组件。重要的是要注意，错误边界组件仅从其子组件捕获错误，而不是从其自身捕获错误。

您可以创建一个错误边界组件并在整个应用程序中重复使用它。由您决定在哪里定义这些错误边界。您可以包装整个应用程序或每个单独的组件。最有可能的是，您的架构介于两者之间。一个好的经验法则是考虑你想告诉用户哪里出了问题。

此示例实现了 `errorCallback()` 方法。

```html
<!-- boundary.html -->
<template>
  <template if:true="{this.error}">
    <error-view error="{this.error}" info="{this.stack}"></error-view>
  </template>
  <template if:false="{this.error}">
    <healthy-view></healthy-view>
  </template>
</template>
```

```js
// boundary.js
import { LightningElement } from "lwc";
export default class Boundary extends LightningElement {
  error;
  stack;
  errorCallback(error, stack) {
    this.error = error;
  }
}
```

您不必在模板中使用 if:[true|false]。例如，假设您定义了单个组件模板。如果此组件引发错误，则框架会在重新渲染期间调用 `errorCallback` 并卸载该组件。

```html
<!-- boundary.html -->
<template>
  <my-one-and-only-view></my-one-and-only-view>
</template>
```

`errorCallback()` 钩子不会捕获诸如单击回调和不在组件生命周期（`constructor()`、`connectedCallback()`、`render()`、`renderCallback()`）之外的异步操作之类的错误。同样重要的是要注意 `errorCallback()` 不是 JavaScript 的 `try/catch`，它是一个组件生命周期守卫。

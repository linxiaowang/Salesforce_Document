# 事件

Lightning Web 组件调度标准 DOM 事件。组件还可以创建和调度自定义事件。

使用事件向上传递组件包含层次结构。例如，子组件` example-todo-item` 会 `dispatches` 一个事件来告诉其父组件 `example-todo-app` 用户选择了它。

Lightning Web 组件中的事件基于 DOM 事件构建，DOM 事件是每个浏览器中可用的 API 和对象的集合。

Lightning Web 组件实现了 EventTarget 接口，允许它们调度事件、侦听事件和处理事件。

要创建事件，我们强烈建议使用 CustomEvent 接口而不是 Event 接口。在 Lightning Web 组件中，CustomEvent 提供跨浏览器（包括 Internet Explorer）更一致的体验。

不支持向捕获阶段分派事件或添加侦听器。简单地把事件的路径想象成从你的组件开始，然后移动到它的父级，然后是祖父级，依此类推。

_提示 要向上传递组件层次结构，请使用事件。要在组件层次结构中向下通信，请通过 HTML 属性将属性传递给子组件，或调用其公共方法。_

## 处理事件

有两种侦听事件的方法：从组件的 HTML 模板中声明，或使用命令式 JavaScript API 以编程方式。最好从 HTML 模板中监听，因为它减少了您需要编写的代码量。

要处理事件，请在组件的 JavaScript 类中定义一个方法。

### 以声明方式附加事件侦听器

此示例使用 `example` 命名空间中的两个组件，`<example-owner>` and `<example-child>`.

子组件有一个 HTML 按钮，它发出一个标准的点击事件

```html
<!-- child.html -->
<template>
  <button>Click Me</button>
</template>
```

为了侦听事件，组件使用语法为 oneventtype 的 HTML 属性。在所有者组件的模板中，要监听从 发出的单击事件，请声明监听器 onclick。

```html
<!-- owner.html -->
<template>
  <example-child onclick="{handleClick}"></example-child>
</template>
```

在所有者组件的 JavaScript 类中，定义 handleClick 方法，该方法在点击事件触发时执行。

```js
// owner.js
import { LightningElement } from "lwc";

export default class Owner extends LightningElement {
  handleClick(e) {
    // Your code here
  }
}
```

### 在 JavaScript 中附加事件侦听器

或者，您可以在所有者组件的 JavaScript 文件中同时定义侦听器和处理程序。

```html
<!-- parent.html -->
<template>
  <example-child></example-child>
</template>
```

```html
<!-- child.html -->
<template>
  <button>Click</button>
</template>
```

参考 `<example-child>`获取使用 `this.template.querySelector` 。要处理该事件，请在所有者的 JavaScript 文件中定义 `handleClick`。

```js
// parent.js
import { LightningElement } from "lwc";

export default class App extends LightningElement {
  renderedCallback() {
    this.template
      .querySelector("example-child")
      .addEventListener("click", this.handleClick);
  }

  handleClick(e) {
    // Your code here
  }
}
```

添加事件侦听器有两种语法。一种是向组件影子边界内的元素添加事件侦听器。一种是向模板不拥有的元素添加事件侦听器，例如，传递到插槽中的元素。

要将事件侦听器添加到影子边界内的元素，请使用`template`。

```js
this.template.addEventListener();
```

在前面的示例中，`parent.js` 代码使用 `this.template` 语法来选择 `example-child`，因为 `example-child` 位于其阴影边界内。通过 `this.template.addEventListener` 添加的事件侦听器可以访问影子树中的冒泡事件。

### 移除事件侦听器

作为组件生命周期的一部分，浏览器会管理和清理侦听器，因此您不必担心。

但是，如果您向全局 window 对象添加侦听器，则您有责任在适当的生命周期钩子中自行删除侦听器。在这种情况下，使用 connectedCallback 和 disconnectedCallback 方法来添加和删除事件侦听器。

## 创建和调度事件

在组件的 JavaScript 类中创建和调度事件。要创建事件，请使用 `CustomEvent()` 构造函数。要调度事件，请调用 `EventTarget.dispatchEvent()` 方法。

CustomEvent() 构造函数有一个必需参数，它是一个指示事件类型的字符串。作为组件作者，您在创建事件时命名事件类型。事件类型是事件的名称。您可以使用任何字符串作为事件类型。但是，我们建议您遵守 DOM 事件标准。

- 没有大写字母
- 没有空格
- 使用下划线分隔单词

不要在事件名称前加上字符串 on，因为内联事件处理程序名称必须以字符串 `on` 开头。如果您的事件被称为 `onmessage`，则标记将为`<example-my-component ononmessage={handleMessage}>` .请注意双字 `onon`，这是令人困惑的。

分页器组件包含上一个和下一个按钮。当用户单击按钮时，handlePrevious 或 handleNext 函数将执行。这些函数创建和调度上一个和下一个事件。您可以将分页器组件放入任何需要“上一个”和“下一个”按钮的组件中。该组件侦听事件并处理它们。

paginator.html

```html
<template>
  <div>
    <button onclick="{handlePrevious}">Previous</button>
    <button onclick="{handleNext}" class="right">Next</button>
  </div>
</template>
```

paginator.js

```js
import { LightningElement } from "lwc";
export default class Paginator extends LightningElement {
  handlePrevious() {
    this.dispatchEvent(new CustomEvent("previous"));
  }
  handleNext() {
    this.dispatchEvent(new CustomEvent("next"));
  }
}
```

这些事件是简单的某事发生的事件。它们不会将数据负载向上传递到 DOM 树，它们只是宣布用户单击了一个按钮。

让我们将分页器放入一个名为 eventSimple 的组件中，该组件侦听并处理上一个和下一个事件。

要侦听事件，请使用语法为 oneventtype 的 HTML 属性。由于我们的事件类型是上一个和下一个，因此侦听器是 onprevious 和 onnext。

当 eventSimple 接收到上一个和下一个事件时，handlePrevious 和 handleNext 函数会增加和减少页码。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/704a53680d7c485b98a6241b7de35745~tplv-k3u1fbpfcp-watermark.image)

eventSimple.html

```html
<template>
  <div>
    <p class="center">Page {page}</p>
    <example-paginator
      onprevious="{handlePrevious}"
      onnext="{handleNext}"
    ></example-paginator></div
></template>
```

eventSimple.js

```js
import { LightningElement } from "lwc";
export default class EventSimple extends LightningElement {
  page = 1;
  handlePrevious() {
    if (this.page > 1) {
      this.page = this.page - 1;
    }
  }
  handleNext() {
    this.page = this.page + 1;
  }
}
```

## 在事件中传递数据

要将数据传递给同一影子树中的元素，事件的使用者可以访问 `event.target` 属性，该属性是对调度事件的对象的引用。例如，组件可以访问 `event.target.myProperty`。在这种情况下，不要将属性添加到 `event.detail`。

要将数据传递给不在同一影子树中的元素，请使用 `event.detail`。在这些情况下， `event.target.*` 不起作用，因为真正的目标对侦听器不可见。 （当一个事件在 DOM 上冒泡时，如果它跨越了阴影边界，则 `Event.target` 的值会发生变化以匹配侦听器的范围。该事件被重定向，因此侦听器无法看到组件的阴影树调度事件。）

接收组件访问事件侦听器处理函数中的 `detail` 属性中的数据。

**注意： CustomEvent 接口对 detail 属性没有类型要求或结构。然而，只发送原始数据很重要。 JavaScript 通过引用传递除原语以外的所有数据类型。如果组件在其 detail 属性中包含一个对象，则任何侦听器都可以在组件不知情的情况下更改该对象。这是一件坏事！最佳做法是仅发送基元，或者在将数据添加到 detail 属性之前将数据复制到新对象。将数据复制到新对象可确保您只发送您想要的数据，并且接收方无法更改您的数据。**

## 获取事件目标

要获取对调度事件的对象的引用，请使用 `Event.target` 属性，它是事件的 DOM API 的一部分。

当一个事件在 DOM 上冒泡时，如果它跨越了影子边界，则 `Event.target` 的值会更改以匹配侦听器的范围。这种变化被称为“事件重定向”。该事件被重定向，因此侦听器无法查看调度该事件的组件的 shadow DOM。事件重定向保留了 shadow DOM 封装。

```html
<!-- myButton.html --><template> <button>{label}</button></template>
```

`click`侦听器始终接收 my-button 作为目标，即使单击发生在按钮元素上。

想象一个事件是从 `example-todo-item` 组件中的 `div` 元素调度的。在组件的 shadow DOM 中，`Event.target` 是 `div`。但是对于包含 `example-todo-app `组件中 `p` 元素的侦听器，`Event.target` 是 `example-todo-item`，因为 `p` 元素无法看到 `example-todo-item` 影子 DOM。

```html
<example-todo-app>
  #shadow-root
  <div><p>Your To Do List</p></div>
  <example-todo-item>
    #shadow-root
    <div><p>Go to the store</p></div>
  </example-todo-item></example-todo-app
>
```

有趣的是，对于 `example-todo-item` 上的侦听器，`Event.target` 是 `example-todo-item`，而不是 `div`，因为 `example-todo-item` 在阴影边界之外

## 配置事件冒泡

事件被触发后，它可以通过 DOM 向上传播。要了解可以在何处处理事件，请了解它们如何传播。 Lightning Web 组件事件根据与 DOM 事件相同的规则传播。创建事件时，请使用事件的两个属性（`bubbles`和`composed`）定义事件传播行为。

**`bubbles`** : 一个布尔值，指示事件是否通过 DOM 冒泡。默认为`false`。

**`composed`** : 指示事件是否可以通过影子边界。默认为`false`。

### `bubbles: true` and `composed: false`

事件通过 DOM 冒泡，但不会跨越阴影边界。

有两种方法可以使事件冒泡：

- 在组件的模板中冒泡一个事件。此技术创建一个内部事件
- 在包含组件的模板内冒泡一个事件。当组件被传递到插槽时，使用此技术将事件发送到组件的祖父级。请注意，此技术仅适用于 LWC 合成阴影 DOM。使用原生 shadow DOM，事件不会从插槽中传递出去，除非 `compose` 也为真。

要在组件模板中冒泡事件，请在模板中的元素上调度事件。该事件仅在模板内向上冒泡到元素的祖先。当事件到达阴影边界时停止。

```js
// myComponent.jsthis.template.querySelector('div')    .dispatchEvent(        new CustomEvent('notify', { bubbles: true }));
```

该事件必须在 myComponent.js 中处理。包含组件中的处理程序不会执行，因为事件没有跨越阴影边界。

```html
<!-- owner.html -->    <!-- handleNotify doesn’t execute -->    <my-component onnotify={handleNotify}></my-component></div>
```

我们不建议在您自己的模板之外冒泡事件，但这是可能的。要将事件冒泡到包含您的组件的模板，请在宿主元素上调度事件。该事件仅在包含您的组件的模板中可见。

```js
// myComponent.jsthis.dispatchEvent(    new CustomEvent('notify', { bubbles: true }));
```

```html
<!-- owner.html --><!-- handleNotifyOuter can handle the event -->
<div onnotify="{handleNotifyOuter}">
  <!-- handleNotifyInner can handle the event -->
  <my-component onnotify="{handleNotifyInner}"></my-component>
</div>
```

_例子 ： lwc-recipes-oss 存储库中的 eventBubbling 组件使用一个 contactListItemBubbling 组件，该组件创建一个带有`bubbles`：`true`和`composed`：`false`的事件。这个秘籍使用插槽并向祖父母发送一个事件。请注意，此技术仅适用于 LWC 合成阴影 DOM。使用原生 shadow DOM，事件不会从槽中传递出去，除非 composition 也为真。_

### bubbles: true and composed: true

事件通过 DOM 向上冒泡，越过影子边界，并继续通过 DOM 向上冒泡到文档根部。

这种配置是一种反模式，因为它创建了一个跨越每个边界的事件。每个元素都会获得事件，即使是不属于任何阴影的常规 DOM 元素。该事件可以一直冒泡到 body 元素。

以这种方式触发事件时，您可能会污染事件空间、泄漏信息并创建混乱的语义。事件被视为组件 API 的一部分，因此请确保事件路径上的任何人都能够理解和处理事件的有效负载（如果有的话）。

```html
<body>
  <!-- Event flows up to here -->
  <c-container>
    <!-- Event flows up to here -->
    #shadow-root
    <c-parent>
      <!-- Event flows up to here -->
      #shadow-root
      <div class="barWraper">
        <!-- Event flows up to here -->
        <c-child>
          <!-- Event flows up to here -->
          #shadow-root
        </c-child>
      </div>
    </c-parent>
  </c-container>
</body>
```

_如果事件使用此配置，则事件类型将成为组件公共 API 的一部分。它还强制使用组件及其所有祖先将事件作为其 API 的一部分。由于此配置将您的事件一直冒泡到文档根目录，因此可能会导致名称冲突。名称冲突会导致错误的事件侦听器被触发。您可能希望使用命名空间作为事件类型的前缀，例如 mydomain\_\_myevent。 HTML 事件侦听器将有一个笨拙的名称 onmydomain\_\_myevent。_

### bubbles: false and composed: true

组合事件可以打破阴影边界并沿着它们的路径从主机反弹到主机。他们不会继续冒泡，除非他们也设置了`bubbles: true`。

这种配置是一种反模式，但它有助于理解事件如何在 shadow DOM 上下文中冒泡。

在这种情况下，c-child、c-parent 和 c-container 可以对事件做出反应。有趣的是 div.childWrapper 无法处理该事件，因为该事件不会在阴影本身中冒泡。

```html
<body>
  <c-container>
    <!-- Event flows up to here -->
    #shadow-root
    <c-parent>
      <!-- Event flows up to here -->
      #shadow-root
      <div class="childWrapper">
        <c-child>
          <!-- Event starts here -->
          #shadow-root
        </c-child>
      </div>
    </c-parent>
  </c-container>
</body>
```

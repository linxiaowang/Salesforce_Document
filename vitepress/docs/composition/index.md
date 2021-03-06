# Composition

您可以在另一个组件的主体内添加组件。组合使您能够从更简单的构建块组件构建复杂的组件。从一组较小的组件组合应用程序和组件使代码更可重用和可维护。

让我们看一个简单的应用程序。组件位于示例命名空间中。标记是人为的，因为我们想说明*Owner*和*container*的概念

```html
<!-- todoApp.html -->
<template>
  <example-todo-wrapper>
    <example-todo-item item-name="Milk"></example-todo-item>
    <example-todo-item item-name="Bread"></example-todo-item>
  </example-todo-wrapper>
</template>
```

#### **Owner**

所有者是拥有模板的组件。在这个例子中，所有者是 example-todo-app 组件。所有者控制它包含的所有组合（子）组件。所有者可以:

- 在组合组件上设置公共属性
- 在组合组件上调用公共方法
- 侦听由组合组件调度的事件

#### **Container**

容器包含其他组件，但它本身包含在所有者组件中。在这个例子中，example-todo-wrapper 是一个容器。容器不如所有者强大。一个容器可以：

- 读取但不更改包含组件中的公共属性
- 在组合组件上调用公共方法
- 侦听由它包含的组件冒泡的一些事件，但不一定是所有事件

#### **Parent and child**

当一个组件包含另一个组件，而另一个组件又可以包含其他组件时，我们就有了一个包含层次结构。在文档中，我们有时会讨论父组件和子组件。父组件包含子组件。父组件可以是所有者或容器。

## 在子组件上设置属性

为了向下传递包含层次结构，所有者可以在子组件上设置属性。 HTML 中的属性变成了 JavaScript 中的属性赋值。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/94ae3437895c48d8bc963bdd87ef574a~tplv-k3u1fbpfcp-watermark.image)

todoApp.html

```html
<template>
  <example-todo-item item-name="Milk1"></example-todo-item>
  <example-todo-item item-name="{name}"></example-todo-item>
</template>
```

todoApp.js

```javascript
import { LightningElement, api } from "lwc";
export default class TodoApp extends LightningElement {
  @api name = "john";
}
```

todoItem.html

```html
<template>
  <div>{itemName}</div>
</template>
```

todoItem.js

```javascript
import { LightningElement, api } from "lwc";
export default class TodoItem extends LightningElement {
  @api itemName;
}
```

JavaScript 中的属性名称采用驼峰式大小写，而 HTML 属性名称采用 kebab 大小写（短划线分隔）以匹配 HTML 标准。在 todoApp.html 中，标记中的 item-name 属性映射到 todoItem.js 的 itemName 属性。

## 子级给父级发送事件

当组件使用 @api 修饰字段以将其公开为公共属性时，它应该仅在初始化字段时设置该值（如果有的话）。字段初始化后，只有所有者组件应该设置该值。

要触发所有者组件提供的属性值的突变，子组件可以向所有者发送事件。所有者可以更改属性值，该值会向下传播到子项。

compositionBasicsEvent.html

```html
<template>
  <div>
    <example-contact-tile-event
      contact="{contact}"
      onupdatecontact="{handleUpdateContact}"
    ></example-contact-tile-event>
  </div>
</template>
```

compositionBasicsEvent.js

```javascript
import { LightningElement } from "lwc";

export default class CompositionBasics extends LightningElement {
  contact = {
    Name: "Amy Taylor",
    Title: "VP of Engineering",
    Picture:
      "https://s3-us-west-1.amazonaws.com/sfdc-demo/people/amy_taylor.jpg",
  };

  handleUpdateContact() {
    this.contact = {
      Name: "Michael Jones",
      Title: "VP of Sales",
      Picture:
        "https://s3-us-west-1.amazonaws.com/sfdc-demo/people/michael_jones.jpg",
    };
  }
}
```

contactTileEvent.html

```html
<template>
  <template if:true="{contact}">
    <img src="{contact.Picture}" alt="Profile photo" />
    <p>{contact.Name}</p>
    <p>{contact.Title}</p>
  </template>
  <template if:false="{contact}">
    <p>No contact data available.</p>
  </template>
  <p>
    <button onclick="{updateContact}">Update Contact</button>
  </p>
</template>
```

contactTileEvent.js

```java
import { LightningElement, api } from 'lwc';

export default class ContactTile extends LightningElement {
    @api contact;

    updateContact() {
        this.dispatchEvent(new CustomEvent('updatecontact'));
    }
}
```

## 数据流注意事项

为了防止代码复杂性和意外的副作用，数据应该朝一个方向流动，从所有者到子级（单向数据流）。

#### 原始属性值

- 我们建议对公共属性使用原始数据类型，而不是使用对象数据类型。在更高级别的组件中分解复杂的数据结构，并将原始值传递给组件后代。

- 原始值需要明确定义数据形状的特定 @api 属性。接受对象或数组需要文档来指定形状。如果对象形状发生变化，消费者就会崩溃。

- 标准 HTML 元素只接受属性的原始值。当标准 HTML 元素需要复杂形状时，它使用子组件。例如，表格元素使用 tr 和 td 元素。在 HTML 中只能定义原始类型。例如，`<table data={...}>` 不是 HTML 中的值。但是，您可以使用 `data` API 创建 `table` Lightning Web 组件。

#### 传递给组件的对象是只读的

- 传递给组件的非原始值（如对象或数组）是只读的。组件不能更改对象或数组的内容。如果组件尝试更改内容，您会在浏览器控制台中看到错误。
- 为了改变数据，组件可以制作它想要改变的对象的浅拷贝。
- 更常见的是，组件可以向对象的所有者发送事件。当所有者收到事件时，它会改变数据，然后将数据发送回子级。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ae8cac86adb4ae6852c1831c4225d7d~tplv-k3u1fbpfcp-watermark.image)

compositionBasicsObject.html

```html
<template>
  <div>
    <example-contact-tile-object contact="{contact}">
    </example-contact-tile-object></div
></template>
```

compositionBasicsObject.js

```javascript
import { LightningElement } from "lwc";
export default class CompositionBasicsObject extends LightningElement {
  contact = { name: "Amy Taylor", title: "VP of Engineering" };
}
```

contactTileObject.html

```html
<template>
  <template if:true="{contact}">
    <p>{contact.name}</p>
    <p>{contact.title}</p>
  </template>
  <template if:false="{contact}"> <p>No contact data available.</p> </template>
  <button onclick="{updateContactName}"><b>1</b> Update contact.name</button>
  <br />
  <button onclick="{updateContactField}"><b>2</b> Update contact field</button>
  <br
/></template>
```

contactTileObject.js

```javascript
import { LightningElement, api } from "lwc";
export default class ContactTileObject extends LightningElement {
  @api contact;
  updateContactName() {
    this.contact.name = "Jennifer Wu";
    console.log(this.contact.name);
  }
  updateContactField() {
    this.contact = { name: "Anup Gupta", title: "VP of Products" };
    console.log(this.contact);
  }
}
```

`updateContactName` 执行时并不会对 `contact` 进行修改，反而在控制台会报: `Uncaught Error: Invalid mutation: Cannot set "name" on "[object Object]". "[object Object]" is read-only.` 。组件不拥有传递给它的对象并且不能改变它。

`updateContactField` 执行时会将整个 `contact` 替换为一个全新的对象，虽然修改成功了，但是该对象也失去了响应式，要想保持响应式，应该使用 `@track` 修饰符。

*注意：单击更新联系人字段后，子组件拥有该对象，这意味着子组件可以更改该对象。因此，如果您再次单击更新联系人.姓名，您可能希望组件显示 Jennifer Wu，但事实并非如此。该值已设置，并且 Jennifer Wu 显示在控制台中，这意味着该组件确实对对象进行了变异。但是，该组件不会重新渲染。为什么？因为 LWC 看不到联系人对象的某个属性发生了变化。联系人字段用@api 修饰，而不是@track。 （一个字段只能有一个装饰器。）@api 装饰器只是将一个字段公开并允许从外部设置其值。 @api 装饰器不会告诉 LWC 像 @track 那样观察突变。 但是当我们直接为联系人字段分配一个新值时，为什么组件会重新渲染？因为 LWC 观察所有字段的变异。如果为字段分配新值，则组件会重新呈现。但是，如果将对象分配给字段，LWC 不观察该对象的内部属性。 因此，当您为 contact.name 分配新值时，组件不会更新。 要让 LWC 观察对象的内部属性，请使用 @track 装饰该字段。 参见 [Field Reactivity](https://lwc.dev/guide/javascript_reactive#field-reactivity)。*

## 在子组件上调用方法

### 定义方法

此示例通过将 @api 装饰器添加到方法中，在 `example-video-player` 组件中公开 isPlaying()、play() 和 pause() 方法。包含 `example-video-player` 的父组件可以调用这些方法。这是 JavaScript 文件。

```javascript
// videoPlayer.js
import { LightningElement, api } from 'lwc';

export default class VideoPlayer extends LightningElement {
    @api videoUrl;

    @api
    get isPlaying() {
        const player = this.template.querySelector('video');
        return player !== null && player.paused === false;
    }

    @api
    play() {
        const player = this.template.querySelector('video');
        // the player might not be in the DOM just yet
        if (player) {
            player.play();
        }
    }

    @api
    pause() {
        const player = this.template.querySelector('video');
        if (player) {
            // the player might not be in the DOM just yet
            player.pause();
        }
    }

    // private method for computed value
    get videoType() {
        return 'video/' + this.videoUrl.split('.').pop();
    }
}
```

videoUrl 是公共响应式属性。 @api 装饰器可用于在组件上定义公共响应式性属性和公共 JavaScript 方法。公共响应式属性是组件公共 API 的另一部分。

现在，让我们看看定义 video 元素的 HTML 文件。

```html
<!-- videoPlayer.html --><template>
  <div class="fancy-border">
    <video autoplay><source src="{videoUrl}" type="{videoType}" /></video></div
></template>
```

在真实世界的组件中，`example-video-player` 通常具有播放或暂停视频本身的控件。对于此示例来说明公共 API 的设计，控件位于调用公共方法的父组件中。

### 调用方法

`example-method-caller` 组件包含 `example-video-player` 并具有调用 `example-video-player` 中的 play() 和 pause() 方法的按钮。

```html
<!-- methodCaller.html --><template>
  <div>
    <example-video-player video-url="{video}"></example-video-player>
    <button onclick="{handlePlay}">Play</button>
    <button onclick="{handlePause}">Pause</button>
  </div></template
>
```

```js
// methodCaller.js
import { LightningElement } from "lwc";
export default class MethodCaller extends LightningElement {
  video = "https://www.w3schools.com/tags/movie.mp4";
  handlePlay() {
    this.template.querySelector("example-video-player").play();
  }
  handlePause() {
    this.template.querySelector("example-video-player").pause();
  }
}
```

`example-method-caller` 中的 `handlePlay()` 函数调用 `example-video-player` 元素中的 `play()` 方法。 `this.template.querySelector('example-video-player')` 返回 methodCaller.html 中的 `example-video-player` 元素。 `this.template. `querySelector()` ` 调用对于访问子组件很有用，以便您可以调用组件上的方法。

### 返回值

要从 JavaScript 方法返回值，请使用 return 语句。例如，请参阅 example-video-player 中的 isPlaying() 方法。

```js
@api get isPlaying() {
    const player = this.template.querySelector('video');
    return player !== null && player.paused === false;
}
```

### 方法参数

要将数据传递给 JavaScript 方法，请为该方法定义一个或多个参数。例如，您可以定义 play() 方法以获取控制视频播放速度的速度参数。

## 插槽

在组件的 HTML 文件中添加一个插槽，以便父组件可以将标记传递到组件中。一个组件可以有零个或多个插槽。

slot 是一个占位符，用于标记父组件传递到组件主体中的标记。插槽是 [Web 组件规范](https://dom.spec.whatwg.org/#shadow-tree-slots)的一部分。

要在标记中定义插槽，请使用具有可选 `name` 属性的 `<slot>` 标签。

### 未命名插槽

在 Playground 中，单击 `slotDemo.html` 以查看未命名的插槽。 `slotWrapper` 组件将内容传递到插槽中.

![image-20210817140156025](D:\Users\yl4293\AppData\Roaming\Typora\typora-user-images\image-20210817140156025.png)

slotWrapper.html

```html
<template>
  <example-slot-demo>
    <p>Content from Slot Wrapper</p>
  </example-slot-demo></template
>
```

slotDemo.html

```html
<template>
  <h1>Content in Slot Demo</h1>
  <div><slot></slot></div
></template>
```

渲染 `example-slot-demo` 时，未命名的插槽将替换为**Content from Slot Wrapper**.。这是 `example-slot-wrapper` 的渲染 HTML。

```html
<example-slot-wrapper>
  <example-slot-demo>
    <h1>Content in Slot Demo</h1>
    <div>
      <slot><p>Content from Slot Wrapper</p></slot>
    </div>
  </example-slot-demo></example-slot-wrapper
>
```

如果一个组件有多个未命名槽，则传递到组件主体中的标记会插入到所有未命名槽中。这种 UI 模式很不寻常。一个组件通常有零个或一个未命名的插槽。

### 命名插槽

此示例组件有两个命名插槽和一个未命名插槽。

```html
<!-- namedSlots.html --><template>
  <p>First Name: <slot name="firstName">Default first name</slot></p>
  <p>Last Name: <slot name="lastName">Default last name</slot></p>
  <p>Description: <slot>Default description</slot></p></template
>
```

这是使用 `example-named-slots` 的父组件的标记。

```html
<!-- slotsWrapper.html --><template>
  <example-named-slots>
    <span slot="firstName">Willy</span> <span slot="lastName">Wonka</span>
    <span>Chocolatier</span>
  </example-named-slots></template
>
```

The `example-slots-wrapper` component passes:

- `Willy` 对应 `firstName` 插槽
- `Wonka ` 对应 `lastName ` 插槽
- `Chocolatier ` 对应未命名插槽

这是渲染的输出。

```html
<example-named-slots>
  <p>
    First Name:
    <slot name="firstName"><span slot="firstName">Willy</span></slot>
  </p>
  <p>
    Last Name: <slot name="lastName"><span slot="lastName">Wonka</span></slot>
  </p>
  <p>
    Description: <slot><span>Chocolatier</span></slot>
  </p></example-named-slots
>
```

### 在 slotchange 上运行代码

所有 `<slot>` 元素都支持 `slotchange` 事件。当 `<slot>` 元素中节点的直接子节点发生更改时，例如添加或删除新内容时，将触发 `slotchange` 事件。只有 `<slot>` 元素支持这个事件。

`<slot>` 元素的子元素中的更改不会触发 `slotchange` 事件。

此示例包含一个处理 `slotchange` 事件的 `<slot>` 元素。

```html
<!-- container.html --><template>
  <slot onslotchange="{handleSlotChange}"></slot
></template>
```

```js
//container.js
handleSlotChange (e) {
   console.log("New slotted content has been added or removed!");
}
```

```html
<example-container>
  <example-child></example-child>
  <template if:true="{addOneMore}"> <example-child></example-child> </template
></example-container>
```

控制台在组件第一次呈现时打印，如果标志 addOneMore 设置为 true。

组件 `example-child`被传递到插槽中。

```html
<!-- child.html --><template>
  <button onclick="{handleClick}">Toggle Footer</button>
  <template if:true="{showFooter}">
    <footer>Footer content</footer>
  </template></template
>
```

当 `showFooter` 为真并且附加了页脚元素，不会触发 `slotchange` 事件。

### 查询选择器（Query Selectors）

`querySelector()` 和 `querySelectorAll()` 方法是标准的 DOM API。 `querySelector()` 返回与选择器匹配的第一个元素。 `querySelectorAll()` 返回一个 DOM 元素数组。

根据您是要访问组件拥有的元素还是访问通过槽传递的元素，以不同的方式调用这些方法。

_注意：不要将 id 传递给这些查询方法。当 HTML 模板呈现时，id 值被转换为全局唯一值。如果您在 JavaScript 中使用 id 选择器，它将与转换后的 id 不匹配。如果您要迭代数组，请考虑向元素添加一些其他属性，例如 class 或 data-\* 值，并使用它来选择元素。 LWC 仅将 id 值用于可访问性。_

#### 访问组件拥有的元素

要访问组件呈现的元素，请使用 `template` 属性调用查询方法。

```js
this.template.querySelector();
this.template.querySelectorAll();
```

- 不保证元素的顺序
- 未渲染的 DOM 的元素不会在 querySelector() 结果中返回
- 不要使用 ID 选择器。在渲染模板时，您在 HTML 模板中定义的 ID 可能会转换为全局唯一值。如果您在 JavaScript 中使用 ID 选择器，它将与转换后的 ID 不匹配。

```html
<!-- example.html --><template>
  <div>First <slot name="task1">Task 1</slot></div>
  <div>Second <slot name="task2">Task 2</slot></div></template
>
```

```js
// example.js
import { LightningElement } from "lwc";

export default class Example extends LightningElement {
  renderedCallback() {
    this.template.querySelector("div"); // <div>First</div>
    this.template.querySelector("span"); // null
    this.template.querySelectorAll("div"); // [<div>First</div>, <div>Second</div>]
  }
}
```

_注意：不要使用 window 或 document 全局属性来查询 DOM 元素。此外，我们不建议使用 JavaScript 来操作 DOM。最好使用 HTML 指令来编写声明性代码。_

#### 通过 slots 访问元素

组件不拥有通过插槽传递给它的 DOM 元素。这些 DOM 元素不在组件的[shadow tree](https://lwc.dev/guide/composition#shadow-dom)中。要访问通过槽传入的 DOM 元素，请调用 this.querySelector() 和 this.querySelectorAll()。因为组件不拥有这些元素，所以不要使用 this.template.querySelector() 或 this.template.querySelectorAll()。

这个例子展示了如何从子组件的上下文中获取传递给子组件的 DOM 元素。将选择器名称（例如元素）传递给 this.querySelector() 和 this.querySelectorAll()。此示例传递 span 元素。

````js
// namedSlots.js
import { LightningElement } from 'lwc';

export default class NamedSlots extends LightningElement {
    renderedCallback() {
        this.querySelector('span'); // <span>push the green button.</span>
        this.querySelectorAll('span'); // [<span>push the green button</span>, <span>push the red button</span>]
    }
}```

## 使用插槽与数据组合组件

创建包含其他组件的组件时，请考虑使用声明性（插槽）或数据驱动方法的组件层次结构的生命周期和构造。

#### 使用插槽撰写

这种模式对于以声明方式构建组件很常见。

```html
<example-parent>
  <example-custom-child></example-custom-child>
  <example-custom-child></example-custom-child
></example-parent>
````

父组件需要知道子组件何时可用于通信。在父组件上，在 `slot` 元素或包含 `slot` 元素的 `div` 元素上附加事件处理程序。

```html
<!-- parent.html --><template>
  <div onprivateitemregister="{handleChildRegister}">
    <!-- other markup here -->
    <slot></slot></div
></template>
```

处理事件以通知子组件的父级。父组件需要一个全局唯一的 Id 才能与其子组件一起工作。

```js
handleChildRegister(event) {
    // Suppress event if it’s not part of the public API
    event.stopPropagation();
    const item = event.detail;
    const guid = item.guid;

    this.privateChildrenRecord[guid] = item;
}
```

要从子组件调度事件，请使用 `connectedCallback()` 方法。

```js
connectedCallback() {
    const itemregister = new CustomEvent('privateitemregister', {
        bubbles: true,
        detail: {
            callbacks: {
                select: this.select,
            },
            guid: this.guid,
         }
    });
    this.dispatchEvent(itemregister);
}
```

#### 通知父组件关于未注册的子组件

为了通知父组件它的子组件不再可用，我们在父子组件之间建立了双向通信通道。

- 子进程在注册过程中向父进程发送回调。
- 父级通过回调调用子级，将另一个回调作为参数传递
- 取消注册时，子级调用父级上的回调。

子进程使用事件处理程序` onprivateitemregister` 向父进程发送回调。

```html
<!-- parent.html --><template>
  <slot onprivateitemregister="{handleChildRegister}"> </slot
></template>
```

处理该事件以通知父级该子级不再可用。

```js
// parent.js
handleChildRegister(event) {
    const item = event.detail;
    const guid = item.guid;

    this.privateChildrenRecord[guid] = item;
    // Add a callback that
    // notifies the parent when child is unregistered
    item.registerDisconnectCallback(this.handleChildUnregister);
}

handleChildUnregister(event) {
    const item = event.detail;
    const guid = item.guid;

    this.privateChildrenRecord[guid] = undefined;
}
```

子组件在未注册时调用父组件的回调

```js
// child.js
connectedCallback() {
    const itemregister = new CustomEvent('privateitemregister', {
        bubbles: true,
        detail: {
            callbacks: {
                registerDisconnectCallback: this.registerDisconnectCallback
            },
            guid: this.guid,
         }
    });

    this.dispatchEvent(itemregister);
}

// Store the parent's callback so we can invoke later
registerDisconnectCallback(callback) {
    this.disconnectFromParent = callback;
}
```

子组件通知父组件它不再可用

```js
disconnectedCallback() {
    this.disconnectFromParent(this.guid);
}
```

#### 将数据传递给子组件

一旦注册过程完成，我们就可以通过公开的回调方法在父组件和子组件之间进行数据通信。

```js
this.privateChildrenRecord[guid].callbacks.select();
```

父组件可以将数据传递给子组件。例如，您可以将字符串传递给子组件，以便它可以为 `setAriaLabelledBy` 属性设置值。

```js
this.privateChildrenRecord[guid].callbacks.setAriaLabelledBy("my-custom-id");
```

子组件在属性上设置字符串。

```js
ariaLabelledby;setAriaLabelledBy(id) {    this.ariaLabelledby = id;}
```

#### 使用数据撰写

您观察到组合组件的声明方式为组件作者增加了一层复杂性。现在考虑数据驱动的方法。与管理插槽内容的生命周期和要求父组件和子组件之间的精细管理不同，组件在数据更改时以反应方式获取更改。

此示例使用数据驱动的方法组合子组件。

```html
<template>
  <div class="example-parent">
    <template for:each="{itemsData}" for:item="itemData">
      <example-child
        onclick="{onItemSelect}"
        id="{itemData.id}"
        key="{itemData.id}"
      >
      </example-child>
    </template></div
></template>
```

要传入数据，请使用 JavaScript 对象。子组件仅对来自其父组件的数据更改做出反应。

```js
itemsData = [
    {
        label : 'custom label 1',
        id : 'custom-id-1'
        selected : false
    },
    {
        label : 'custom label 2',
        id : 'custom-id-2'
        selected : false
    }
]
```

当您有复杂的用例时，建议使用数据驱动的方法。

## Shadow DOM

每个 Lightning Web 组件中的元素都封装在一个 shadow tree 中。shadow tree 是对包含它的文档隐藏的 DOM 的一部分。shadow tree 会影响您使用 DOM、CSS 和事件的方式.

Shadow DOM 是一种 Web 标准，它封装了组件的元素，以在任何上下文中保持样式和行为一致。由于并非所有浏览器都实现 Shadow DOM，Lightning Web Components 使用 shadow DOM polyfill (@lwc/synthetic-shadow)。 polyfill 是允许功能在 Web 浏览器中工作的代码。

为了更好地理解如何使用 shadow tree，让我们看一些标记。此标记包含两个 Lightning Web 组件：`example-todo-app` 和 `example-todo-item`。shadow root 定义了 DOM 和 shadow tree 之间的边界。该边界称为影子边界（_shadow boundary_）。

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

_注意：影子根不是一个元素，它是一个 [document fragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment)（文档片段）。_

让我们看看如何在每个区域中使用影子树。

### **CSS**

父组件中定义的 CSS 样式不会泄漏到子组件中。在我们的示例中，在 `todoApp.css` 样式表中定义的 p 样式不会为 `example-todo-item` 组件中的 `p` 元素设置样式，因为这些样式不会进入影子树。

### 事件

如果事件冒泡并跨越影子边界，为了隐藏调度事件的组件的内部细节，一些属性值会更改以匹配侦听器的范围。

### 访问元素

要访问组件从组件的 JavaScript 类呈现的元素，请使用模板属性。

### 访问插槽

slot 是一个占位符，用于标记父组件传递到组件主体中的标记。通过槽传递给组件的 DOM 元素不属于组件所有，也不在组件的影子树中。要访问通过槽传入的 DOM 元素，请调用 `this.querySelector()` 和 `this.querySelectorAll()`。组件不拥有这些元素，因此您不使用模板。

## DOM APIs

不要使用这些 DOM API 来访问组件的影子树。

- `Document.prototype.getElementById`
- `Document.prototype.querySelector`
- `Document.prototype.querySelectorAll`
- `Document.prototype.getElementsByClassName`
- `Document.prototype.getElementsByTagName`
- `Document.prototype.getElementsByTagNameNS`
- `Document.prototype.getElementsByName`
- `document.body.querySelector`
- `document.body.querySelectorAll`
- `document.body.getElementsByClassName`
- `document.body.getElementsByTagName`
- `document.body.getElementsByTagNameNS`

_注意：_

shadow DOM polyfill 包含一个对 `MutationObserver` 接口的补丁。如果您使用 `MutationObserver` 来观察 DOM 树中的变化，请断开它，否则会导致内存泄漏。请注意，组件只能在其自己的模板中观察突变。它无法观察到其他自定义元素的影子树中的突变

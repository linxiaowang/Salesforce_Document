# Fields, Properties, and Attributes

在组件的 JavaScript 类中声明 field 。在组件的模板中引用它们以动态更新内容。

field 和 property 几乎是可以互换的术语。组件作者在类中声明 field。类的实例具有properties。对于组件使用者来说，字段就是属性。在 Lightning Web 组件中，只有组件作者使用 @api 修饰的字段作为对象属性(properties)对消费者公开可用。（field似乎可以类比vue中的data，而property相当于vue中的props）

Property 和attribute 也是几乎可以互换的术语。一般来说，在 HTML 中我们谈论attributes，而在 JavaScript 中我们谈论properties。

## JavaScript Property Names

JavaScript 中的属性名称采用驼峰式大小写，而 HTML 属性名称采用 kebab 大小写（短划线分隔）以匹配 HTML 标准。例如，名为 itemName 的 JavaScript 属性映射到名为 item-name 的 HTML 属性。

不要以这些字符开始属性名称

- `on` (for example, `onClick`)
- `aria` (for example, `ariaDescribedby`)
- `data` (for example, `dataProperty`)

不要将这些保留字用于属性名称。

- `slot`
- `part`
- `is`

## HTML Attribute Names

模板中的 HTML 属性不能包含大写字符。

如果您有一个以大写字符开头的 JavaScript 属性，例如 @api Upper，并且您想通过 HTML 属性设置它，则必须使用特殊语法。属性名称的大写字符是小写的，并以连字符 -upper 为前缀。前导连字符告诉引擎属性名称中的第一个字母字符在 JavaScript 类中用前导大写字符声明。

## 在 JavaScript 中访问 HTML 全局属性

我们不建议使用[ HTML 全局属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)，这些属性是所有 HTML 元素共有的类和标题等属性。如果您确实使用了全局 HTML 属性，请使用 @api 装饰它。

一些 HTML 全局属性不遵循 Lightning Web Components 驼峰命名法和 kebab case命名法约定。如果您在 JavaScript 中为这些 HTML 全局属性之一创建 getter 或 setter，请使用此列表中的案例

| HTML Global Attribute | Property in JavaScript |
| :-------------------- | :--------------------- |
| `accesskey`           | `accessKey`            |
| `bgcolor`             | `bgColor`              |
| `colspan`             | `colSpan`              |
| `contenteditable`     | `contentEditable`      |
| `crossorigin`         | `crossOrigin`          |
| `datetime`            | `dateTime`             |
| `for`                 | `htmlFor`              |
| `formaction`          | `formAction`           |
| `ismap`               | `isMap`                |
| `maxlength`           | `maxLength`            |
| `minlength`           | `minLength`            |
| `novalidate`          | `noValidate`           |
| `readonly`            | `readOnly`             |
| `rowspan`             | `rowSpan`              |
| `tabindex`            | `tabIndex`             |
| `usemap`              | `useMap`               |

## Web API 属性

Lightning Web 组件反映了许多 [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) 的属性。

### Element

Lightning Web 组件反映了 Element 界面的这些属性。

`classList`, `className`, `getAttribute`, `getAttributeNS`, `getBoundingClientRect`, `getElementsByClassName`, `getElementsByTagName`, `hasAttribute`, `hasAttributeNS`, `id`, `querySelector`, `querySelectorAll`, `removeAttribute`, `removeAttributeNS`, `setAttributeNS`, `setAttribute`, `shadowRoot`, `slot`

### EventTarget

Lightning Web 组件反映了 EventTarget 接口的这些属性。

`accessKeyLabel`, `contentEditable`, `dataset`, `dir`, `hidden`, `isContentEditable`, `lang`, `offsetHeight`, `offsetLeft`, `offsetParent`, `offsetTop`, `offsetWidth`, `title`

### Node

Lightning Web 组件反映了 Node 界面的这一属性。

`isConnected`

### WAI-ARIA 状态和属性

Lightning Web 组件反映了这些 WAI-ARIA 状态和属性。

`ariaActiveDescendant`, `ariaAtomic`, `ariaAutoComplete`, `ariaBusy`, `ariaChecked`, `ariaColCount`, `ariaColIndex`, `ariaColSpan`, `ariaControls`, `ariaCurrent`, `ariaDescribedBy`, `ariaDetails`, `ariaDisabled`, `ariaErrorMessage`, `ariaExpanded`, `ariaFlowTo`, `ariaHasPopup`, `ariaHidden`, `ariaInvalid`, `ariaKeyShortcuts`, `ariaLabel`, `ariaLabelledBy`, `ariaLevel`, `ariaLive`, `ariaModal`, `ariaMultiLine`, `ariaMultiSelectable`, `ariaOrientation`, `ariaOwns`, `ariaPlaceholder`, `ariaPosInSet`, `ariaPressed`, `ariaReadOnly`, `ariaRelevant`, `ariaRequired`, `ariaRoleDescription`, `ariaRowCount`, `ariaRowIndex`, `ariaRowSpan`, `ariaSelected`, `ariaSetSize`, `ariaSort`, `ariaValueMax`, `ariaValueMin`, `ariaValueNow`, `ariaValueText`

## 将 JavaScript 属性映射到 HTML 属性

您可以控制公共 JavaScript 属性是否在 Lightning Web 组件的呈现 HTML 中显示为属性。在创建可访问组件时，允许properties 显示为attributes 尤其重要，因为屏幕阅读器和其他辅助技术使用 HTML 属性

默认情况下，所有 HTML 属性都是响应式的。当组件 HTML 中的属性值发生变化时，组件会重新呈现。

当您通过将attribute 公开为公共property来控制该属性时，默认情况下该attribute 不再出现在 HTML 输出中。要将值作为attribute传递给呈现的 HTML（以反映属性），请为该属性定义一个 getter 和 setter，并调用 setAttribute() 方法

您还可以在 setter 中执行操作。使用私有属性来保存计算值。用@track 装饰私有属性，使属性具有响应式。如果属性的值发生变化，组件会重新渲染。

此示例将 `title` 公开为公共属性。它将标题转换为大写，并使用被跟踪的属性 `privateTitle` 来保存标题的计算值。 `setter` 调用 `setAttribute()` 将属性的值反映到 HTML 属性。

```js
// myComponent.js
import { LightningElement, api } from 'lwc';

export default class MyComponent extends LightningElement {
    privateTitle;

    @api
    get title() {
        return this.privateTitle;
    }

    set title(value) {
        this.privateTitle = value.toUpperCase();
        this.setAttribute('title', this.privateTitle);
    }
}
```

```html
/* parent.html */
<template>
    <example-my-component title="Hover Over the Component to See Me"></example-my-component>
</template>
```

```html
/* Generated HTML */
<example-my-component title="HOVER OVER THE COMPONENT TO SEE ME">
    <div>Reflecting Attributes Example</div>
</example-my-component>
```

为确保您了解 JavaScript 属性如何反映到 HTML 属性，请查看不调用 `setAttribute()` 的相同代码。生成的 HTML 不包含 `title` 属性。

```js
// myComponent.js
import { LightningElement, api } from 'lwc';

export default class MyComponent extends LightningElement {
    privateTitle;

    @api
    get title() {
        return this.privateTitle;
    }

    set title(value) {
        this.privateTitle = value.toUpperCase();
        // this.setAttribute('title', this.privateTitle);
    }
}
```

```html
/* parent.html */
<template>
    <example-my-component title="Hover Over the Component to See Me"></example-my-component>
</template>
```

```html
/* Generated HTML */
<example-my-component>
    <div>Reflecting Attributes Example</div>
</example-my-component>
```

在设置值之前，请检查使用者是否已经设置了该值。

```js
// myComponent.js
import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {

    connectedCallback() {
        const tabindex = this.getAttribute('tabindex');

        // Set the tabindex to 0 if it hasn’t been set by the consumer.
        if (!tabindex) {
            this.setAttribute('tabindex','0');
        }
    }
}
```

使用 `this.setAttribute()` 设置 `tabindex` 会导致此标记。

```html
<example-my-component tabindex="0"></example-my-component>
```

要设置这些属性，请使用 `setAttribute()`.

- `for`
- `aria-activedescendant`
- `aria-controls`
- `aria-describedby`
- `aria-details`
- `aria-errormessage`
- `aria-flowto`
- `aria-labelledby`
- `aria-owns`

要从呈现的 HTML 中隐藏 HTML 属性，请调用 `removeAttribute()`

## 在 Getter 中管理属性依赖关系

HTML 中的属性变成了 JavaScript 中的属性赋值。在这两种情况下，都不能保证分配的顺序。要检查其他属性是否存在，请使用 getter。不要使用依赖于另一个 @api 属性值的 @api setter。

在模板中使用 getter 引用（不是 @api getter）。

假设我们有一个数据表组件，它在选定的行上显示一个复选标记。我们有两个单独的属性 `rows` 和 `selectedRows` ，它们相互依赖。

```html
<template>    <example-datatable selected-rows="1,2" rows="1,2,3,4"></example-datatable></template>
```

由于无法保证接收属性的顺序，因此使用 getter 来检查依赖项。

```js
export default class Datatatable extends LightningElement {    @track state = {};    @api    get rows() {        return this.state.rows;    }    set rows(value) {        this.state.rows = value;        // Check to see if the rows have        // been marked as selected.        if (this.state.selectedRows && !this.selectedRowsSet) {            this.markSelectedRows();            this.selectedRowsSet = true;        }    }    @api    get selectedRows() {         return this.state.selectedRows;    }    set selectedRows(value) {        this.state.selectedRows = value;        // If rows haven’t been set,        // then we can't mark anything        // as selected.        if (!this.state.rows) {            this.selectedRowsSet = false;            return;        }        this.markSelectedRows();    }    markSelectedRows() {        // Mark selected rows.    }}
```

使用 getter 和 setter 可确保轻松执行公共 API 合同。不要更改用@api 注释的属性的值。

## Getters and Setters

当组件接收数据时，它执行两个基本操作：存储和反应。在最简单的情况下，您可以声明您的 @api 属性并完成。

```html
<template>    <h1>Greetings, {message}.</h1></template>
```

```js
export default class LightningHello extends LightningElement {    @api message;}
```

但是，您可能想对数据做更有趣的事情，例如对其进行规范化或修改。

```js
const items = [    {label : "item1"},    {label : "item2"},    {label : "item3"} ];
```

标记遍历数组并显示项目。 for:each 指令要求列表中的每个项目都有一个键值。

```html
<template>    <ul>        <template for:each = {state.items} for:item = "item">            <li key={item.key}>                {item.label}            </li>        </template>    </ul></template>
```

要修改数据以添加键属性的值，请使用此模式。

```js
export default class LightningList extends LightningElement {    @track state = {};    privateItems = {};    @api    get items() {        return this.privateItems;    }    set items(items) {        this.privateItems = items;        this.state.items = items.map( item  => {            return {               label : item.label ,               key: generateUniqueId()            }        });    }}
```

在为模板修改状态对象之前存储原始值。

如果某些内容在设置时间依赖于该值，则在 setter 中规范化数据，例如，以编程方式将 CSS 类附加到元素上。在 getter 中返回原始值。规范化也可以在 getter 中完成，这样即使消费者没有设置任何东西，模板也可以访问一个值。

```js
@track state = {    selected : false};privateSelected = 'false';@apiget selected() {    return this.privateSelected;}set selected(value) {    this.privateSelected = value;    this.state.selected = normalizeBoolean(value)}
```

## 布尔属性

通过将属性添加到元素，标准 HTML 元素上的布尔属性被设置为 true。如果没有该属性，则该属性默认为 false。因此，属性的默认值始终为 false。 Lightning Web 组件对布尔属性使用相同的原则。

### 静态设置属性

如果要在标记中切换布尔属性的值，则必须将该值默认为` false`。

```js
// bool.jsimport { LightningElement, api } from 'lwc';export default class Bool extends LightningElement {    // Always set the default value for a boolean to false    @api show = false;}
```

```html
<!-- bool.html --><template>    <p>show value: {show}</p></template>
```

此父组件使用 example-bool。因为没有添加 show 属性，组件显示 show value: false。

```html
<!-- parent.html --><template>    <example-bool></example-bool></template>
```

要将 show 属性设置为 true，请将带有空值的 show 属性添加到标记中。此版本的 example-parent 显示显示值：true。

```html
<!-- parent.html --><template>    <example-bool show></example-bool></template>
```

如果在 bool.js 中将 `show` 属性的默认值设置为 `true`，则无法在标记中将值静态切换为 `false`。

### 动态设置属性

要在默认属性值为 `true` 时切换该值，您可以从父组件传递一个动态计算值。

```html
<!-- parent.html --><template>    <example-bool show={computedValue}></example-bool></template>
```

在 parent.js 中使用 JavaScript getter 返回 {computedValue} 的值。


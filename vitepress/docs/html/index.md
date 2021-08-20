# HTML 模板

## 数据绑定

要将组件模板中的属性绑定到组件 JavaScript 类中的属性，在模板中用花括号将属性括起来：{property}。
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c99356e5bae4d13b828c7fcc99f0645~tplv-k3u1fbpfcp-watermark.image)

helloWorld.html

```html
<template> Hello, {name} </template>
```

helloWorld.js

```javascript
import { LightningElement, api } from "lwc";

export default class Example extends LightningElement {
  @api name = "World!";
}
```

- { } 中的属性必须是有效的 JavaScript 标识符或成员表达式。例如，{data} 和 {data.name} 都是有效的。不要在属性周围添加空格，例如 { data } 不是有效的 HTML。在表达式中计算值是非法的，例如 data[2].name['John']。要计算值，请使用 getter。
- `@api` 装饰器将 `name` 属性设为 `public` ，以便其他组件可以设置它。如果我们删除 `@api` ，该属性仍然绑定到 HTML 模板，但它是私有的。要保持私有，请删除@api。当 name 的值发生变化时，组件会重新渲染。
- 此代码是标准的 HTML 和 JavaScript。此代码中唯一为 Lightning Web Components 提供的功能是 @api 装饰器。

## 处理用户输入

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e050fd4d32054c979bcaf1cf98d7c55a~tplv-k3u1fbpfcp-watermark.image)

helloBinding.html

```html
<template>
  <div>
    <p>Hello, {name}!</p>
    Name:
    <input
      type="text"
      value={name}
      oninput={handleInput}
    ></input>
  </div>
</template>
```

helloBinding.js

```javascript
import { LightningElement } from "lwc";

export default class HelloBinding extends LightningElement {
  name = "World";

  handleInput(event) {
    this.name = event.target.value;
  }
}
```

该元素使用 oninput 事件来侦听对其值的更改。要将 handleInput 函数绑定到模板，我们使用与绑定属性 {...} 相同的语法。当元素的值发生变化时，handleInput 函数就会执行。

## 使用 Getter 计算值

要动态计算模板中使用的属性的值，可以定义一个 `Gettter ` 来计算该值。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8b9ed01e6ae3441b9058e4f220cd4f14~tplv-k3u1fbpfcp-watermark.image)

html:

```html
<template> {propertyName} </template>
```

js:

```javascript
import { LightningElement } from "lwc";
export default class Component extends LightningElement {
  get propertyName() {
    // Compute a value for propertyName
  }
}
```

Getter 是一个函数。

helloExpressionsSimple.html

```html
<template> Uppercased Full Name: {uppercasedFullName} </template>
```

helloExpressionsSimple.js

```javascript
import { LightningElement } from "lwc";

export default class HelloExpr extends LightningElement {
  firstName = "Web";
  lastName = "Component";

  get uppercasedFullName() {
    const fullName = `${this.firstName} ${this.lastName}`;
    return fullName.trim().toUpperCase();
  }
}
```

## 循环

要呈现项目列表，请使用 for:each 指令或 iterator 指令迭代数组。

迭代器指令具有 first 和 last 属性，可让您将特殊行为应用于数组中的第一个和最后一个项目。

无论您使用哪个指令，您都必须使用 key 指令为每个项目分配一个唯一的 ID。当列表更改时，框架使用键仅重新呈现更改的项目。模板中的键用于性能优化，在运行时不会反映在 DOM 中。

您为呈现列表编写的此代码是标准 HTML 和 JavaScript，但指令除外，这些指令是 Lightning Web 组件独有的。

### for:each

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/556a6b4937824db7b8cca9d53d2e7465~tplv-k3u1fbpfcp-watermark.image)

helloForEach.html

```html
<template>
  <ul>
    <template for:each="{contacts}" for:item="contact">
      <li key="{contact.Id}">{contact.Name}, {contact.Title}</li>
    </template>
  </ul>
</template>
```

helloForEach.js

```javascript
import { LightningElement } from "lwc";

export default class HelloForEach extends LightningElement {
  contacts = [
    {
      Id: "003171931112854375",
      Name: "Amy Taylor",
      Title: "COO",
    },
    {
      Id: "003192301009134555",
      Name: "Michael Jones",
      Title: "CTO",
    },
    {
      Id: "003848991274589432",
      Name: "Jennifer Wu",
      Title: "CEO",
    },
  ];
}
```

### iterator

要将特殊行为应用于列表中的第一项或最后一项，请使用迭代器指令 iterator:iteratorName={array}。将迭代器指令添加到嵌套。

使用 iteratorName 访问这些属性：

- value - 列表中项目的值。使用此属性访问数组的属性。例如，iteratorName.value.propertyName。
- index - 列表中项目的索引。
- first - 一个布尔值，指示此项是否为列表中的第一项。
- last - 一个布尔值，指示此项是否为列表中的最后一项。

此示例代码使用与前一个示例相同的数组。为了对列表中的第一个和最后一个项目应用特殊呈现，代码使用带有 if:true 指令的 first 和 last 属性。

如果该项目在列表中排在第一位，则该标签将使用 CSS list-first 类中定义的样式进行呈现。如果该项目在列表中的最后一个，则该标签将使用 CSS list-last 类中定义的样式进行呈现。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c85e816f13b246a3910f5de2d1fd6c71~tplv-k3u1fbpfcp-watermark.image)

helloIterator.html

```html
<template>
  <ul>
    <template iterator:it="{contacts}">
      <li key="{it.value.Id}">
        <div if:true="{it.first}" class="list-first"></div>
        {it.value.Name}, {it.value.Title}
        <div if:true="{it.last}" class="list-last"></div>
      </li>
    </template>
  </ul>
</template>
```

helloIterator.js

```javascript
import { LightningElement } from "lwc";

export default class HelloIterator extends LightningElement {
  contacts = [
    {
      Id: "003171931112854375",
      Name: "Amy Taylor",
      Title: "COO",
    },
    {
      Id: "003192301009134555",
      Name: "Michael Jones",
      Title: "CTO",
    },
    {
      Id: "003848991274589432",
      Name: "Jennifer Wu",
      Title: "CEO",
    },
  ];
}
```

helloIterator.css

```css
.list-first {
  border-top: 1px solid #706e6b;
  padding-top: 5px;
}
.list-last {
  border-bottom: 1px solid #706e6b;
  padding-bottom: 5px;
}
```

## 条件渲染

要有条件地渲染 HTML，请将 if:true|false={property} 指令添加到包含需要进行条件渲染的 `<template>` 标签

该指令将属性绑定到模板，并根据属性是真值还是假值来删除和插入 DOM 元素

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a1201da2dc564ce78aaffacadcc227f3~tplv-k3u1fbpfcp-watermark.image)

helloConditionalRendering.html

```html
<template>
  <div>
    <template if:true="{isTemplateOne}"> This is template one. </template>
    <template if:false="{isTemplateOne}">
      This is not template one. This is template two.
    </template>
  </div></template
>
```

helloConditionalRendering.js

```javascript
import { LightningElement } from "lwc";
export default class HelloIf extends LightningElement {
  isTemplateOne = false;
}
```

## 多个模板渲染

在组件包中创建多个 HTML 文件。将它们全部导入并在 render() 方法中添加条件以根据组件的状态返回正确的模板。

render() 方法的返回值必须是模板引用，它是从 HTML 文件导入的默认导出。在此示例中，模板引用为 templateOne 和 templateTwo。

templateOne.html

```html
<template>
  <p>This is template one.</p>
  <p><button onclick="{switchTemplate}">Switch Templates</button></p></template
>
```

templateTwo.html

```html
<template>
  <p>Template Two</p>
  <p><button onclick="{switchTemplate}">Switch Templates</button></p></template
>
```

multipleTemplates.html

```html
<template>
  <p>This is default template.</p>
  <p><button onclick="{switchTemplate}">Switch Templates</button></p></template
>
```

multipleTemplates.js

```javascript
import { LightningElement } from "lwc";
import templateOne from "./templateOne.html";
import templateTwo from "./templateTwo.html";
export default class MultipleTemplates extends LightningElement {
  showTemplateOne = true;
  render() {
    return this.showTemplateOne ? templateOne : templateTwo;
  }
  switchTemplate() {
    this.showTemplateOne = !this.showTemplateOne;
  }
}
```

要从额外模板引用 CSS，CSS 文件名必须与额外模板的文件名匹配。例如，模板 templateOne.html 只能从 templateOne.css 引用 CSS。它不能从 multipleTemplates.css 引用 CSS。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d27ad00534a74a9aae2d61517137fee0~tplv-k3u1fbpfcp-watermark.image)

note: 在组件中定义 render() 是很少见的。使用 if:true|false 指令有条件地呈现嵌套模板更为常见。

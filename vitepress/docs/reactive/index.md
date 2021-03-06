# 响应式

所有字段都是响应式的。如果字段的值发生更改并且该字段在模板中或在模板中使用的属性的 getter 中使用，则组件将重新渲染并调用 renderCallback() 生命周期钩子。当组件重新渲染时，模板中使用的所有表达式都会重新计算。

要使字段公开并因此作为属性可供组件的消费者使用，请使用@api 装饰它。

字段(field)和属性(property)几乎是可以互换的术语。组件作者在类中声明字段。类的实例具有属性，因此对于组件使用者而言，字段就是属性。在 Lightning Web 组件中，只有组件作者使用 @api 修饰的字段作为对象属性对消费者公开可用。

*提示：装饰器是一种 JavaScript 语言特性。 @api 和 @track 装饰器是 Lightning Web 组件独有的。一个字段只能有一个装饰器。*

## 公用属性响应式

要公开公共属性，请使用@api 装饰字段。公共属性定义组件的 API。在其 HTML 标记中使用组件的所有者组件可以通过 HTML 属性访问组件的公共属性。

如果公共属性的值发生变化，组件的模板将重新渲染。

让我们看看一个简单的应用程序。 `example-todo-item`  组件有一个公共  `itemName`属性。 ```example-todo-app``` 组件使用  `example-todo-item`  并通过 ```item-name``` 属性设置其属性。

在 todoApp.html 中，更改 item-name 属性的值并观察组件重新渲染。

todoApp.html

``` html
<template>
    <example-todo-item item-name="Milk"></example-todo-item>
    <example-todo-item item-name="Bread"></example-todo-item>
</template>
```

todoItem.html

``` html
<template>
    <div>{itemName}</div>
</template>
```



todoItem.js

``` javascript
import { LightningElement, api } from 'lwc';
export default class TodoItem extends LightningElement {
    @api itemName;
}
```

## 字段响应式

所有字段都是响应式的。当框架观察到模板中使用的字段或模板中使用的属性的 getter 中使用的字段发生更改时，组件将重新呈现。

在此示例中，firstName 和 lastName 字段在 uppercasedFullName 属性的 getter 中使用，该属性在模板中使用。当任一字段值更改时，组件将重新呈现。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c31f6a43b08241d9ad4957015a8c4dc7~tplv-k3u1fbpfcp-watermark.image)

helloExpressions.html

``` html
<template>
    <div>
        <ui-input
            name="firstName"
            label="First Name"
            onchange={handleChange}
        ></ui-input>
        <ui-input
            name="lastName"
            label="Last Name"
            onchange={handleChange}
        ></ui-input>
        <p class="margin-top-medium">
            Uppercased Full Name: {uppercasedFullName}
        </p>
    </div>
</template>

```

helloExpressions.js

``` javascript
import { LightningElement } from 'lwc';

export default class HelloExpressions extends LightningElement {
    firstName = '';
    lastName = '';

    handleChange(event) {
        const field = event.target.name;
        if (field === 'firstName') {
            this.firstName = event.target.value;
        } else if (field === 'lastName') {
            this.lastName = event.target.value;
        }
    }

    get uppercasedFullName() {
        return `${this.firstName} ${this.lastName}`.trim().toUpperCase();
    }
}

```

input.html

``` html
<template>
    <div>
      <template if:false={isCheckboxField}>
        <label>{label}</label>
      </template>
      <div class={calculatedClassFormElement}>
        <template if:false={isCheckboxField}>
          <template if:true={isSearchField}>
            <svg aria-hidden="true">
              <use
                xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#search"
              ></use>
            </svg>
          </template>
          <input
            class={calculateClassInput}
            type={type}
            value={valuePrivate}
            onkeyup={keyupHandler}
            onchange={changeHandler}
          />
          <template if:true={hasClearButton}>
            <button
              title="Clear"
              onclick={handleClearClick}
            >
              <svg
                aria-hidden="true"
              >
                <use
                  xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#clear"
                ></use>
              </svg>
              <span>Clear</span>
            </button>
          </template>
        </template>
        <template if:true={isCheckboxField}>
          <div class="slds-checkbox">
            <!-- TODO: Checkbox not longer working -->
            <input
              class={calculateClassInput}
              type="checkbox"
              value={valuePrivate}
              onchange={changeHandler}
            />
            <label>
              <span></span>
              <span>{label}</span>
            </label>
          </div>
        </template>
      </div>
    </div>
  </template>
```

input.js

``` javascript
import { LightningElement, api, track } from 'lwc';

export default class Input extends LightningElement {
    @api
    set checked(val) {
        this._checked = val;
    }
    get checked() {
        return this._checked;
    }
    @api disabled;
    @api hasClearButton;
    @api label;
    @api max;
    @api min;
    @api name;
    @api type = 'text';
    @api
    set value(val) {
        this.valuePrivate = this._value = val !== undefined ? val : '';
    }
    get value() {
        return this._value;
    }

    @track valuePrivate = '';

    _checked = false;

    changeHandler() {
        this._checked = !this._checked;
        this.dispatchEvent(new CustomEvent('change'));
    }

    keyupHandler(event) {
        this._value = event.target.value;
        this.dispatchEvent(new CustomEvent('change'));
    }

    handleClearClick() {
        this._value = '';
        this.dispatchEvent(new CustomEvent('change'));
    }

    get isCheckboxField() {
        return this.type === 'checkbox';
    }

    get isNumberField() {
        return this.type === 'number';
    }

    get isSearchField() {
        return this.type === 'search';
    }

    get isTextField() {
        return this.type === 'text' || this.type === 'search';
    }

    get calculatedClassFormElement() {
        let classSet = this.getAttribute('class');
        if (!classSet) {
            classSet = ['slds-form-element__control'];
        } else {
            classSet = classSet.split(' ');
            classSet.push('slds-form-element__control');
        }
        if (this.type === 'search') {
            classSet.push('slds-input-has-icon slds-input-has-icon_left-right');
        }
        return classSet.join(' ');
    }

    get calculateClassInput() {
        let classSet = [this.type !== 'checkbox' ? 'slds-input' : 'slds-checkbox'];
        if (this.disabled) {
            classSet.push('slds-is-disabled');
        }
        return classSet.join(' ');
    }
}

```

框架观察到的变化深度是有限的。如果字段包含对象值或数组值，则框架会观察为该字段分配新值的更改。如果您分配给该字段的值不是 === 之前的值，则组件将重新呈现。要告诉框架观察对象属性或数组元素的更改，请使用 @track 装饰该字段。

## 响应式数据类型

框架观察到的变化深度是有限的。深度取决于字段的数据类型。

Lightning Web Components 观察这些类型字段的内部值的变化：

- 原始值
- 用 {...} 创建并用 @track 装饰的普通对象
- 用 [] 创建并用 @track 装饰的数组

如果字段包含原始数据类型，则响应式会按预期工作。

如果字段包含对象值或数组值，那么了解框架如何跟踪更改很重要。正如我们在 Field Reactivity 中看到的那样，框架不会观察对象属性或数组元素的变化，除非该字段用 @track 修饰。

*注意：对象类型必须使用字面量创建的方式才能触发响应式，类似 ```new Date()``` 等方式即使使用 ```@track``` 也无法触发响应式* 
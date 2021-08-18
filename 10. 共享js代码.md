# Share JavaScript Code

要在组件之间共享代码，请创建一个 ES6 模块并导出要共享的变量或函数。

ES6 模块是一个 JavaScript 文件，它显式导出其他模块可以使用的变量或函数。模块可以更轻松地构建代码而不会污染全局范围。

您的模块结构如下所示：

```text
mynamespace
    └──myLibrary
        └──myLibrary.js
```

有两种方法可以从 ES6 模块导出功能。

一个模块可以导出单个默认函数或变量。

```js
// myFunction.js
export default myFunction () { ··· }
```

导入函数的组件选择一个名称来引用默认导出。它不必是函数或 JavaScript 文件的名称，这只是一个约定。 `myFunction.js` 模块位于 recipe 命名空间中。

```js
// consumerComponent.js
import myFunction from 'recipe/myFunction';
```

模块还可以导出命名函数或变量。

```js
// mortgage.js
const getTermOptions = () => {
    return [
        { label: '20 years', value: 20 },
        { label: '25 years', value: 25 },
    ];
};

const calculateMonthlyPayment = (principal, years, rate) => {
    // Logic
};

export { getTermOptions, calculateMonthlyPayment };
```

导入函数的组件使用导出的名称。`mortgage.js` 模块在recipe 命名空间中

```js
import { getTermOptions, calculateMonthlyPayment } from 'recipe/mortgage';
```

要创建重定向，您可以使用相对文件路径从另一个模块导出所有资源

```js
export * from './utils';
```


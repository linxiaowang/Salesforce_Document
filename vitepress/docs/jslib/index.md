# 第三方js库

您可以将第三方 JavaScript 库与 Lightning Web 组件一起使用。例如，使用具有交互式图表和图形的库或用于降低代码复杂性的库。

不建议使用 JavaScript 来操作 DOM，因为 Lightning Web Components 引擎会更有效地执行此操作。但是，有一些第三方 JavaScript 库会接管 DOM。

使用这些库时，将 `lwc:dom="manual"` 添加到要使用 JavaScript 操作的任何空的原生 HTML 元素。当引擎看到指令时，它会保留封装。组件的所有者对该元素调用 `appendChild()` 以手动插入 DOM。

此代码是来自 Lightning Web Components 应用程序的 LibsD3 组件。它使用 D3 JavaScript 库来创建交互式数据可视化。模板包含图形。`<svg>`是空的。 lwc:dom="manual" 指令告诉 Lightning Web Components 此元素中的 DOM 已被手动插入。

```html
<!-- libsD3.html -->
<template>
    <div>
      <svg
        class="d3"
        width={svgWidth}
        height={svgHeight}
        lwc:dom="manual"
      ></svg>
    </div>
</template>
```

![A component displaying a graph of colored dots connected by lines. To change the shape of the graph, click and drag the dots.](https://lwc.dev/assets/images/third_party_lib.png)

为了初始化图形，在 `renderCallback()` 中，代码调用 `initializeD3()`，它进入DOM 并获取对我们想要显示图形的容器的引用，这里是一个 `<svg>`元素。

在 `Lightning Web` 组件中，您不能使用 `document` 来查询 DOM 元素。但是你可以使用 `this.template`。例如，此代码使用 `this.template.querySelector('svg.d3')`。

```js
/* global d3 */
import { LightningElement } from 'lwc';
import DATA from './data';

export default class LibsD3 extends LightningElement {
  svgWidth = 400;
  svgHeight = 400;

  d3Initialized = false;

  renderedCallback() {
    if (this.d3Initialized) {
      return;
    }
    this.d3Initialized = true;
    this.initializeD3();
  }

  initializeD3() {
    // Example adopted from https://bl.ocks.org/mbostock/2675ff61ea5e063ede2b5d63c08020c7
    const svg = d3.select(this.template.querySelector('svg.d3'));
    const width = this.svgWidth;
    const height = this.svgHeight;
    const color = d3.scaleOrdinal(d3.schemeDark2);

    const simulation = d3
      .forceSimulation()
      .force(
        'link',
        d3.forceLink().id(d => {
          return d.id;
        })
      )
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(DATA.links)
      .enter()
      .append('line')
      .attr('stroke-width', d => {
        return Math.sqrt(d.value);
      });

    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(DATA.nodes)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', d => {
        return color(d.group);
      })
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    node.append('title').text(d => {
      return d.id;
    });

    simulation.nodes(DATA.nodes).on('tick', ticked);

    simulation.force('link').links(DATA.links);

    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      node.attr('cx', d => d.x).attr('cy', d => d.y);
    }

    function dragstarted(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    }
  }
}
```
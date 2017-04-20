# Kendo-grid-virtual-scrolling

Custom implementation of virtual scrolling in Kendo-grid to support grouping and editing.

## How to add 

```javascript
var kendoGridVS = require('kendo-grid-virtual-scrolling');
```

In normal browser usage

provide the ``` <version> ```

```javascript
<script src="https://unpkg.com/kendo-grid-virtual-scrolling@<version>/dist/Kendo-Grid-VirtualScroll.js"></script>
```

## How to use

Can be use inside dataBound event in Kendo-Grid.

```javascript
//set this as global variable and set true if grid is reload/change grouping etc..
initDataBound = true; 
```
<br/>

```javascript
//databound event in kendo-grid
dataBound: function(e){
     if (initDataBound) {
               initDataBound = false;
               kendoGridVS({
                 gridElement: e.sender.element,
           });
      }
}
```

#### MIT License

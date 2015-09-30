# ng-deferred-show
Angular directive for deferring element compilation.

This will improve startup in some cases as there won't be initial expenses on compiling invisible elements.

Inspired by ng-lazy-show - http://developers.lendio.com/blog/combining-ng-if-and-ng-show-for-better-angularjs-performance/

This directive will immediately compiles visible elements(based on value of ng-deferred-show), but defers compilation of invisible elements for specified time (compile-timeout attribute).

All elements with the same timeout will be compiled in batch.

After element has been compiled, its visibility will be changed by adding/removing class ng-hide.

Example:

```
$scope.item1_visible = true;
$scope.item2_visible = false;
$scope.item3_visible = false;

<div ng-deferred-show="item1_visible" compile-timeout="300">Item 1</div>
<div ng-deferred-show="item2_visible" compile-timeout="300">Item 2</div>
<div ng-deferred-show="item3_visible" compile-timeout="300">Item 3</div>
```

'Item 1' will be compiled immediately, but 'Item 2' and 'Item 3' will be compiled in batch after 300 ms.

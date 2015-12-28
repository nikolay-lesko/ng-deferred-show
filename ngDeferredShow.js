(function () {
    'use strict';

    angular.module('ngDeferredShow', [])
        .directive('ngDeferredShow', Directive);

    Directive.$inject = ['$parse', '$timeout', '$animate'];

    function Directive($parse, $timeout, $animate) {
        var timeoutBatches = {};

        return {
            restrict: 'A',
            transclude: 'element',
            multiElement: true,
            priority: 600,
            terminal: true,
            link: function (scope, element, attrs, $ctrl, $transclude) {
                var visible, deferVisibleCompile, compiled, timeout, doneCallback, batchDoneCallback;

                visible = $parse(attrs.ngDeferredShow)(scope);
                deferVisibleCompile = $parse(attrs.deferVisibleCompile)(scope);
                doneCallback = attrs.onCompileDone ? $parse(attrs.onCompileDone) : angular.noop;
                
                batchDoneCallback = function() {
                    (attrs.onBatchDone ? $parse(attrs.onBatchDone) : angular.noop)(scope);
                };

                compiled = false;

                if (visible && !deferVisibleCompile) {
                    compile();
                }
                else {
                    timeout = $parse(attrs.compileTimeout)(scope);

                    batchTimeout(compile, timeout, batchDoneCallback);
                }

                scope.$watch(attrs.ngDeferredShow, function (value) {
                    visible = value;

                    if (compiled) {
                        updateVisibility();
                    }
                });

                function compile() {
                    $transclude(function (clone) {
                        $animate.enter(clone, element.parent(), element);
                        element = clone;

                        compiled = true;

                        updateVisibility();

                        doneCallback(scope);
                    });
                }

                function updateVisibility() {
                    $animate[visible ? 'removeClass' : 'addClass'](element, 'ng-hide');
                }
            }
        };

        function batchTimeout(callback, timeout, batchDoneCallback) {
            var batch = timeoutBatches[timeout];

            if (!batch) {
                batch = timeoutBatches[timeout] = [];

                $timeout(function () {
                    delete timeoutBatches[timeout];

                    angular.forEach(batch, function (callback) {
                        callback();
                    });

                    batchDoneCallback();
                }, timeout);
            }

            batch.push(callback);
        }
    }
}());

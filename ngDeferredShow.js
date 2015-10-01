(function () {
    'use strict';

    angular.module('ngDeferredShow', [])
        .directive('ngDeferredShow', function ($parse, $timeout, $animate) {
            var timeoutBatches = {};

            return {
                restrict: 'A',
                transclude: 'element',
                multiElement: true,
                priority: 600,
                terminal: true,
                link: function (scope, element, attrs, $ctrl, $transclude) {
                    var visible, compiled, timeout;

                    visible = $parse(attrs.ngDeferredShow)(scope);
                    compiled = false;

                    if (visible) {
                        compile();
                    }
                    else {
                        timeout = $parse(attrs.compileTimeout)(scope);

                        batchTimeout(compile, timeout);
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
                        });
                    }

                    function updateVisibility() {
                        $animate[visible ? 'removeClass' : 'addClass'](element, 'ng-hide');
                    }
                }
            };

            function batchTimeout(callback, timeout) {
                var batch = timeoutBatches[timeout];

                if (!batch) {
                    batch = timeoutBatches[timeout] = [];

                    $timeout(function () {
                        delete timeoutBatches[timeout];

                        angular.forEach(batch, function (callback) {
                            callback();
                        });
                    }, timeout);
                }

                batch.push(callback);
            }
        });
}());
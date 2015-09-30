(function () {
    'use strict';

    angular.module('ngDeferredShow', [])
        .directive('ngDeferredShow', function ($parse, $timeout, $animate) {
            return {
                restrict: 'A',
                transclude: 'element',
                multiElement: true,
                priority: 600,
                terminal: true,
                link: function (scope, element, attrs, $ctrl, $transclude) {
                    var visible, loaded, timeoutBatches, timeout;

                    visible = $parse(attrs.ngDeferredShow)(scope);
                    loaded = false;
                    timeoutBatches = {};

                    if (visible) {
                        compile();
                    }
                    else {
                        timeout = $parse(attrs.compileTimeout)(scope);

                        batchTimeout(compile, timeout);
                    }

                    scope.$watch(attrs.ngDeferredShow, function (value) {
                        visible = value;

                        if (loaded) {
                            updateVisibility();
                        }
                    });

                    function batchTimeout(callback, timeout) {
                        if (!timeoutBatches[timeout]) {
                            timeoutBatches[timeout] = [];

                            $timeout(function () {
                                angular.forEach(timeoutBatches[timeout], function (callback) {
                                    callback();
                                });

                                delete timeoutBatches[timeout];
                            }, timeout);
                        }

                        timeoutBatches[timeout].push(callback);
                    }

                    function compile() {
                        $transclude(function (clone) {
                            $animate.enter(clone, element.parent(), element);
                            element = clone;

                            loaded = true;

                            updateVisibility();
                        });
                    }

                    function updateVisibility() {
                        $animate[visible ? 'removeClass' : 'addClass'](element, 'ng-hide');
                    }
                }
            };
        });

}());
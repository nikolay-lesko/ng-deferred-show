angular.module('app', ['ngDeferredShow'])
    .controller('Main', function ($scope) {
        $scope.visible = false;
        $scope.items = [];

        for (var i = 0; i < 1000; i++) {
            $scope.items.push({index: i, visible: i < 10});
        }

        $scope.onClick = function () {
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.items[i].visible = $scope.visible;
            }
        };

        $scope.timeout = function (item) {
            return batchDistribution(item.index, 5) * 500;
        };

        function batchDistribution(index, batchSize) {
            return Math.floor(Math.max(index - batchSize, 0) / batchSize)
        }
    });
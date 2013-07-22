angular.module('Samson.Routing', ['ui.state'])
    .config(function($locationProvider, $stateProvider, $routeProvider, $httpProvider) {

    $locationProvider.html5Mode(true);

    var addState = function(name, routeName, url) {
        $stateProvider.state(name, {
            url: url,
            templateProvider: function($state, $stateParams, $http, $q, $location, urlFixer, $window) {
                var deferred = $q.defer();
                var uri = Routing.generate(routeName, angular.extend($stateParams, $location.search()));
                $http.get(uri, { headers: { 'X-Request-URI': uri } }).success(function(data, status, headers, config) {
                    $httpProvider.defaults.headers.common['X-Firewall'] = headers('X-Firewall');
                    if (headers('X-View-Refresh')) {
                        deferred.reject();
                        $window.location.href = headers('X-View-Refresh');
                        return;
                    }


                    if (headers('X-Response-URI')) {
                        urlFixer.fix(headers('X-Response-URI'));
                    }

                    deferred.resolve(data);
                }).error(function(data) {
                    deferred.resolve(data);
                });
                return deferred.promise;
            }
        })
    }

    for (var i in Routing.getRoutes().c) {
        var routeName = i
        var route = Routing.getRoute(routeName);
        var urls = [];
        var url = '';
        for (var j = route.tokens.length - 1; j >= 0; j--) {
            var token = route.tokens[j];
            if (token[0] == 'text') {
                url += token[1];
            } else if (token[0] == 'variable') {
                if (token[3] == '_format') {
                    urls.push(url);
                    url += token[1]+'html';
                } else if (token[3] in route.requirements) {
                    url += token[1]+"{"+token[3]+":"+route.requirements[token[3]]+"}";
                } else {
                    if (j == 0) {
                        urls.push(url);
                    }
                    url += token[1]+"{"+token[3]+"}";
                }
            } else {
                alert('fout');
            }
        }
        urls.push(url);
        for (var j in urls) {
            addState(routeName+(j > 0 ? "-"+j : ""), routeName, urls[j]);
        }
    }

    $stateProvider.state('fallback', {
        url: '/{path:.*}',
        controller: function($scope, $location) {
            window.location.href = $location.path();
        }
    })
})
;

angular.module('Samson.Routing').factory('urlFixer', function($location) {
    var ignoreNext = false;

    return {
        fix: function(uri) {
            if (uri != $location.path()) {
                $location.path(uri);
                ignoreNext = true;
            }
        },
        isIgnoreNext: function() {
            if (ignoreNext) {
                ignoreNext = false;
                return true;
            }
            return false;
        }
    }
});

angular.module('Samson.Routing').controller('MainCtrl', function($scope, $state, $document, urlFixer) {
    var initialCall = true;

    $scope.loading = false;

    $scope.$on('$stateChangeStart', function(e) {
        if (urlFixer.isIgnoreNext()) {
            e.preventDefault();
            return;
        }

        $scope.loading = true;
    })
//    $scope.$on('$stateChangeError', function(e) {
//        console.log(e);
//        alert('error!');
//    });
    $scope.$on('$stateChangeSuccess', function() {
        $scope.loading = false;
        setTimeout(function() {
            $document.get(0).title = $document.find('h1').text();
        }, 0);
    })
});
angular.module('Samson.Routing').directive('form', function() {
    return {
        name: 'formHandler',
        restrict: 'E',
        scope: true,
        link: function($scope, iElement, iAttr) {
            if (!iAttr.action) {
                return;
            }
            iElement.on('click', 'button,input[type="submit"],input[type="image"]', function(e) {
                var callback = function() {
                    if ($scope.$emit('$stateChangeStart').defaultPrevented) {
                        return;
                    }
                    e.preventDefault();
                    $scope.submit(iElement, e).then(function(template) {
                        $scope.$emit('$stateChangeSuccess');
                        iElement.parents('[ui-view]').last().empty().append(template);
                    }, function(template) {
                        $scope.$emit('$stateChangeSuccess');
                        iElement.parents('[ui-view]').last().empty().append(template);
                    });
                };

                $scope.$$phase || $scope.$root.$$phase ? callback() : $scope.$apply(callback);
            })
        },
        controller: function($scope, $state, $http, $q, $location, $compile, $window) {
            $scope.submit = function($form, e) {
                var data =  $form.serialize();

                var $button = $(e.target);
                if ($button.attr('name') && $button.attr('value')) {
                    data += encodeURI("&"+$button.attr('name')+"="+$button.attr('value'));
                }

                var deferred = $q.defer();
                $http[$form.get(0).method]($form.attr('action'), data, { headers: { 'Content-Type': $form.get(0).enctype } }).success(function(data, xhr, headers) {
                    $http.defaults.headers.common['X-Firewall'] = headers('X-Firewall');
                    if (headers('X-View-Refresh')) {
                        deferred.reject();
                        $window.location.href = headers('X-View-Refresh');
                        return;
                    }
                    var template = angular.element(data);
                    var linkFn = $compile(template);
                    linkFn($scope);
                    deferred.resolve(template);
                }).error(function(data, xhr) {
                    var template = angular.element(data);
                    var linkFn = $compile(template);
                    linkFn($scope);
                    deferred.reject(template);
                });
                return deferred.promise;
            }
        }
    }
});
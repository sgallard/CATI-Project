


var p = angular.module("Cati",['ngRoute']);



p.controller("encuestadores", ['$scope', '$http',function($scope,$http) {

    console.log("gg");
    $scope.title="Listar Usuario";
    $scope.title2="Registrar Usuario";
    $scope.formData = {};
    /*$scope.firstName = "John";
     $scope.lastName= "Doe";*/
    $http.get('/api/encuestadores')
        .success(function(data) {

            $scope.usuario = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.crearUsuario = function(){
        $http.post('/api/usuarios', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error:' + data);
            });
    };
    $scope.deleteUsuario = function(id) {
        $http.delete('/api/todos/' + id)
            .success(function(data) {
                $scope.todos = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error:' + data);
            });
    };
}]);
/*app.controller("mysCtrl", function($scope,$http) {
 //$scope.title = "Listar Usuario";
 $scope.title2 = "Registrar Usuario";
 });*/
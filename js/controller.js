function Controller($scope) {

  $scope.master = {};
  $scope.odds = {};

  $scope.reset = function() {
    $scope.deck = angular.copy($scope.master);
  }
  
  $scope.calculate = function(deck) {
    if($scope.form.$valid == false) {
      return;
    }
    deck.size = 30;
    $scope.odds = {};
    $scope.odds.turn = [];

    for(var i = 0; i < 10; i++) {
      $scope.odds.turn[i] = calculateOddsPerTurn(deck.numChosen, deck.size, deck.drawSize+i);
    }

  }

  $scope.isUnchanged = function(deck) {
    return angular.equals(deck, $scope.master);
  }

  $scope.reset();
}


var app = angular.module('deck-odds', []);
 
var INTEGER_REGEXP = /^\-?\d+$/;
app.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('integer', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('integer', false);
          return undefined;
        }
      });
    }
  };
});

app.filter('decimal', function () {
  return function (text) {
    var parts = parseFloat(text).toFixed(3).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
});


app.controller('CardBrowser', function($scope, $http) {
  $http.get('data/hearthsoten.json')
    .then(function(res) {
      console.log(res.data);
    });
});

function calculateOddsPerTurn(numChosen, size, drawSize) {
  var odds = [];
 //Calculate odd of drawing none
  try {
    odds[0] = Probability.hypergeometricdistribution(numChosen, size, drawSize, 0 );
  } catch(error) {
    if(error.name == 'RangeError') {
      odds[0] = 0;
    } else {
      throw(error);
    }
  }

  //Calculate odds of drawing one or more
  if(numChosen > 0) {
    odds[1] = 1.0 - odds[0];
  }

  for(var i = Math.min(numChosen, 8); i > 1; i--) {
    odds[i] = 0;
    try {
      var currentOdds = Probability.hypergeometricdistribution(numChosen, size, drawSize, i );
      odds[i] += currentOdds;
    } catch (error) {
        if(error.name != 'RangeError') {
        throw(error);
      }
    }
    if(i < Math.min(numChosen, 8)) {
      odds[i] += odds[i+1];
    }
  }
  return odds;
}
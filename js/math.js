var Probability = (function() {

  var f = [],
  that = this;

  that.factorial = function(n) {
    if (n == 0 || n == 1)
      return 1;
    if (f[n] > 0)
      return f[n];
    return f[n] = factorial(n-1) * n;
  };

  that.combination = function (x, y) {
    /* Calculates the number of combinations of y things chosen from a popualtion of x with no regard for order.
     * x is the total population
     * y is the number being chosen
     */
    return factorial(x) / ( factorial(y) * factorial(x-y) );
  }

  that.hypergeometricdistribution = function (x,y,z,n) {
    /* Calculates the odds or drawing n particular things from a population of y.
     * x is the number of particular things in the population
     * y is the total population
     * z is the number of things that are drawn
     * n is the number of x's you want to test against being drawn
     */
   return combination( x, n ) * combination( y-x, z-n) / combination( y, z);
  }

  return that;
}());
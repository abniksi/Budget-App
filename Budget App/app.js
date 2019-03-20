//BUDGET CONTROLLER
var budgetController = (function(){


})();

//UI CONTROLLER
var UIController = (function(){
  //Object set up keep a clean copy of all the class names we need.
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn'
  }
  return {
    getinput: function(){
      return{
        type: document.querySelector(DOMstrings.inputType).value, //Inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },
    getDOMstrings: function(){
      return DOMstrings;
    }
  };
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

  //setupEventListeners function to add event listeners to buttons and enter key.
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress',function(event){
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });
  }


  var ctrlAddItem = function(){
    //Getting input data
    var input = UICtrl.getinput();
    console.log(input);
    //Adding item to the budget controller

    //Add new item to the user interface

    //Calculate the budget

    //Display the budget on the UI
  }

  //Return statement to make init function global.
  return {
    init: function(){
      console.log('Application');
      setupEventListeners();
    }
  }


})(budgetController, UIController);

//Colling controller.init() method.
controller.init();

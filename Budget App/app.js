//Budget Controller
var budgetController = (function(){

  //Function constructor for our expenses
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage =  -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome){
    if(totalIncome > 0){
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function(){
      return this.percentage;
  };

  //Function contructor for our income
  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //Function used to calculate our total sum
  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum += cur.value;
    });
    data.totals[type] = sum;
  }

  //Object that keeps track of all our our items and expenses
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return{
    addItem: function(type, des, val){
      var newItem, ID;

      //Create new ID
      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else{
        ID = 0;
      }

      //Creating new instance of our function constructors
      if (type === 'exp'){
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc'){
        newItem = new Income(ID, des, val);
      }

      //Push into data structure
      data.allItems[type].push(newItem);

      //Return the new element
      return newItem;

    },

    deleteItem: function(type, id){
      var ids, index;

      //map method returns a completely new array unlike forEach
      ids = data.allItems[type].map(function(current){
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1){
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function(){
        //Calculate total income and expenses
        calculateTotal('exp');
        calculateTotal('inc');

        //Calculate the budget: income - expenses
        data.budget = data.totals.inc - data.totals.exp;

        //Calculate the percentage of income that we spent
        if (data.totals.inc > 0){
          data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        } else {
          data.percentage = -1;
        }
    },

    calculatePercentages: function(){
      data.allItems.exp.forEach(function(cur){
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function(){
      var allPerc = data.allItems.exp.map(function(cur){
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function(){
      return{
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },

    testing: function(){
      console.log(data);
    }

  };

})();



//UI CONTROLLER
var UIController = (function(){

  //Object set up keep a clean copy of all the class names we need.
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentageLabel: 'item__percentage'
  };

  return {
    //getinput method that returns the values the user enters
    getinput: function(){
      return{
        type: document.querySelector(DOMstrings.inputType).value, //Inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        //Using parseFloat method to convert the string value into a number value
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type){
      var html, newHtml, element;
      //Create HTML string with placeholder text.
      if(type === 'inc'){
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp'){
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace the placeholder text with user inputed data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

    },

    //Delete item from UI method
    deleteListItem: function(selectorID){
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function(){
      var fields, fieldsArray;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      fieldsArray = Array.prototype.slice.call(fields);

      fieldsArray.forEach(function(current) {
        current.value = "";
      });

      fieldsArray[0].focus();
    },

    //Displaying the budget method
    displayBudget: function(obj){

      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
      document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },

    displayPercentages: functions(percentages){
      var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

      var nodeListForEach = function(list, callback){
        for (var i = 0; i < list.length; i++){
          callback(list[i], i);
        }
      };

      nodeListForEach(fields, function(current, index){
        if (percentages[index] > 0){
          current.textContent = percentages[index] + '%';
        }
        else {
          current.textContent = '---';
        }
      });
    },

    //getDOMstrings method that returns the DOMstrings we need to use DOM manipulation with
    getDOMstrings: function(){
      return DOMstrings;
    }
  };
})();




//Global app controller
var controller = (function(budgetCtrl, UICtrl){

  //setupEventListeners function to add event listeners to buttons and enter key.
  var setupEventListeners = function() {
    //UICtrl is equal to our UI Controller.
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function(event){
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
  };

  var updateBudget = function(){
    //1. Calculate the budget
    budgetCtrl.calculateBudget();

    //2. Return the budget
    var budget = budgetCtrl.getBudget();

    //3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function(){
    //Calc percentages
    budgetCtrl.calculatePercentages();
    //Read from budget controller
    var percentages = budgetCtrl.getPercentages();
    //Update the UI
    console.log(percentages);
  };

  var ctrlAddItem = function(){
    var input, newItem, type, ID;

    //1. Getting input data
    input = UICtrl.getinput();

    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      //2. Adding item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. Add new item to the user interface
      UICtrl.addListItem(newItem, input.type);

      //4. Clear the fieldsArray
      UICtrl.clearFields();

      //5. Updating the budget
      updateBudget();

      //6. Update percentages
      updatePercentages();
    }

  };

  var ctrlDeleteItem = function(event){
    var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if(itemID){
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //Delete item from the data structure
      budgetCtrl.deleteItem(type, ID);

      //Delete item for UI
      UICtrl.deleteListItem(itemID);

      //Update and show new budget
      updateBudget();

      //Update percentages
      updatePercentages();
    }
  };

  //Return statement to make init function global.
  return {
    init: function(){
      console.log('Application');
      //Initial display.
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };


})(budgetController, UIController);

//Calling controller.init() method.
controller.init();

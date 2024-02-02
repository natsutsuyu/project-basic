function Task(id, description, cost) {
  if (new.target === undefined) {
    throw new Error('Cannot create an instance of an abstract class.');
  }

  this._id = id;
  if (typeof description === 'string') {
    this._description = description;
  } else {
    throw new Error("Incorrect type of description!");
  }
  if (cost >= 0 && typeof cost === 'number') {
    this._cost = cost;
  } else {
    throw new Error("Incorrect type or value of cost!");
  }

  Object.defineProperty(this, 'id', {
    get: function () {
      return this._id;
    }
  });

  Object.defineProperty(this, 'description', {
    get: function () {
      return this._description;
    }
  });

  Object.defineProperty(this, 'cost', {
    get: function () {
      return this._cost;
    }
  });
}

const task = new Task('1', "Name of task", 50);

console.log(task.id);
console.log(task.description);
console.log(task.cost);

class IncomeTask extends Task {
  constructor(id, description, cost) {
    super(id, description, cost);
  }
  makeDone(budget) {
    budget.income += this._cost;
  }
  makeUnDone(budget) {
    budget.income -= this._cost;
  }


}
class ExpenseTask extends Task {
  constructor(id, description, cost) {
    super(id, description, cost);
  }
  makeDone(budget) {
    budget.extense += this._cost;
  }
  makeUnDone(budget) {
    budget.extense -= this._cost;
  }

}

class TasksController {
  #tasks;
  constructor() {
    this.#tasks = []
  }

  addTasks(...tasks) {
    tasks.forEach((task) => {
      if (!this.#tasks.some((t) => t.id === task.id)) {
        this.#tasks.push(task);
      }
    });
  }

  deleteTask(task) {
    const index = this.#tasks.findIndex((t) => t.id === task.id);
    if (index !== -1) {
      this.#tasks.splice(index, 1);
    } else {
      console.log(`Task ${task.id} isn't recognized`);
    }
  }

  getTasks() {
    return this.#tasks;
  }
  getTasksSortedBy(sortBy) {
    switch (sortBy) {
      case "description":
        return [...this.#tasks].sort((a, b) =>
          a.description.localeCompare(b.description)
        );
      case "status":
        return [...this.#tasks].sort((a, b) => a.isDone() - b.isDone()
        );
      case "cost":
        return [...this.#tasks].sort((a, b) =>
          b.cost - a.cost
        );
      default:
        return this.#tasks;
    }
  }
}

class BudgetController {
  #tasksController;
  #budget;

  constructor(initialBalance = 0) {
    this.#tasksController = new TasksController();
    this.#budget = {
      balance: initialBalance,
      income: 0,
      expenses: 0,
    };
    
  Object.defineProperty(this, "balance", {
    get() {
      return this.#budget.balance;
    },
  });

  Object.defineProperty(this, "income", {
    get() {
      return this.#budget.income;
    },
  });

  Object.defineProperty(this, "expenses", {
    get() {
      return this.#budget.expenses;
    },
  });
  };
  calculateBalance() {
    return this.#budget.balance + this.#budget.income - this.#budget.expenses;
  }
  getTasks() {
    return this.#tasksController.getTasks();
  }
  addTasks(...tasks) {
    this.#tasksController.addTasks(...tasks);
  }
  deleteTask(task) {
    if (task.isDone()) {
      task.makeUnDone(this.#budget);
    }
    this.#tasksController.deleteTask(task);
  }
  doneTask(task) {
    if (!task.isDone()) {
      task.makeDone(this.#budget);
    } else {
      console.log('Task is already done');
    }
  }
  unDoneTask(task) {
    if (task.isDone()) {
      task.makeUnDone(this.#budget);
    } else {
      console.log('Task isn\'t done before');
    }
  }
}


const incomeTask1 = new IncomeTask('1', 'Заработок', 1000);
const incomeTask2 = new IncomeTask('2', 'Проценты по вкладу', 200);
const expenseTask1 = new ExpenseTask('3', 'Покупка продуктов', 300);
const expenseTask2 = new ExpenseTask('4', 'Оплата счетов', 150);

const budgetController = new BudgetController(500);
budgetController.addTasks(incomeTask1, incomeTask2, expenseTask1, expenseTask2);

console.log('Баланс:', budgetController.balance); // 500
console.log('Доход:', budgetController.income); // 0
console.log('Расходы:', budgetController.expenses); // 0

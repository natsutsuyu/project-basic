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




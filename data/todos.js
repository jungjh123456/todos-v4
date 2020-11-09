const todos = [
  { id: 1, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: false },
  { id: 3, content: 'Javascript', completed: false },
].sort((t1, t2) => t2.id - t1.id);

exports.todos = todos;

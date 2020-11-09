// State
let todos = [];
let navState = 'all';

// 요소 찾기
const $todos = document.querySelector('.todos');
const $inputTodo = document.querySelector('.input-todo');
const $completeAll = document.querySelector('.complete-all');
const $completedTodos = document.querySelector('.completed-todos');
const $removeTodo = document.querySelector('.remove-todo');
const $activeTodos = document.querySelector('.active-todos');
const $btn = document.querySelector('.btn');
const $nav = document.querySelector('.nav');
const $li = document.querySelectorAll('.nav > li');
const $checkbox = document.querySelector('.checkbox');
const $active = document.getElementById('active');
const $completed = document.getElementById('completed');

// 함수

// clear completed 체크 갯수

// id 최대값

const maxId = () => (todos.length ? Math.max(...todos.map(todo => todo.id)) + 1 : 1);

// 기본 서버 전송
const fetchTodo = () => {
  fetch('/todos')
    .then(res => res.json())
    .then(_todos => { todos = _todos; })
    .then(render)
    .catch(new Error());
};

const btnColor = () => {
  [...$nav.children].forEach(e => e.classList.remove('active'));
};

// completed

const render = () => {
  let html = '';
  const copyTodos = todos.filter(todo => {
    return navState === 'completed'
    ? todo.completed : navState === 'active'
    ? !todo.completed : true;
  });
  copyTodos.forEach(({ id, content, completed }) => {
    html += ` <li id="${id}" class="todo-item">
   <input id="ck-${id}" class="checkbox" type="checkbox" ${completed ? 'checked' : ''}>
   <label for="ck-${id}">${content}</label>
   <i class="remove-todo far fa-times-circle"></i>
 </li> `;
  });
  $todos.innerHTML = html;
  $completedTodos.textContent = todos.filter(todo => todo.completed === true).length;
  $activeTodos.textContent = todos.filter(todo => todo.completed !== true).length;
};

// 서버 데이터
const fetchTodos = () => fetchTodo();

// onload

window.onload = () => fetchTodos();

// 인풋 이벤트

$inputTodo.onkeyup = e => {
  if (e.key !== 'Enter' || $inputTodo.value === '') return;

  const content = $inputTodo.value;
  const newTodo = { id: maxId(), content, completed: false };
  fetch('todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTodo)
  })
    .then(res => res.json())
    .then(_todos => { todos = _todos; })
    .then(render)
    .catch(console.error);
  $inputTodo.value = '';
};

$todos.onchange = e => {
  const { id } = e.target.parentNode;
  fetch(`todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: e.target.checked })
  })
    .then(res => res.json())
    .then(_todos => { todos = _todos; })
    .then(render)
    .catch(console.error);
};

$completeAll.onclick = e => {
  fetch('todos/completed', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: e.target.checked })
  })
    .then(res => res.json())
    .then(_todos => { todos = _todos; })
    .then(render)
    .catch(console.error);
};

$todos.onclick = e => {
  if (!e.target.matches('.todos > li > .remove-todo')) return;
  console.log(e.target.parentNode);
  const { id } = e.target.parentNode;
  fetch(`todos/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .then(_todos => { todos = _todos; })
    .then(render)
    .catch(console.error);
};

$btn.onclick = () => {
  // todos = todos.filter(todo => todo.completed === true)
  fetch('todos/completed', {
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(_todos => { todos = _todos; })
    .then(render)
    .catch(console.error);
};

$nav.onclick = e => {
  btnColor();
  e.target.classList.add('active');
  if (e.target.id === 'active') {
    navState = 'active';
    fetchTodo();
  } else if (e.target.id === 'completed') {
    navState = 'completed';
    fetchTodo();
  } else {
    navState = 'all';
    fetchTodo();
  }
};

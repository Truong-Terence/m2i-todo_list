import Task from "./task.mjs";


const inbox = document.querySelector('.inbox');
let tasks = [];

function renderTasks() {
  inbox.innerHTML = '';
  tasks.forEach(task => {
    const item = document.createElement('div');
    item.classList.add('item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('click', () => {
      task.completed = checkbox.checked;
      renderTasks();
    });

    const p = document.createElement('p');
    p.textContent = task.content;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      const index = tasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        tasks.splice(index, 1);
        renderTasks();
      }
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      const newContent = prompt('Enter a new description', task.content);
      if (newContent) {
        task.content = newContent;
        renderTasks();
      }
    });

    item.appendChild(checkbox);
    item.appendChild(p);
    item.appendChild(deleteButton);
    item.appendChild(editButton);

    inbox.appendChild(item);
  });
}

export async function getTaskList() {
  const response = await fetch('/task.json');
  const data = await response.json();
  return data.tasks;
}

export function createTask(content) {
  const id = tasks.length + 1;
  const task = { id, content, completed: false };
  tasks.push(task);
  return task;
}


renderTasks();

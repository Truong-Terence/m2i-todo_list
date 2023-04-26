import { getTaskList, createTask } from "./modules/service.mjs";

const inbox = document.querySelector('.inbox');
const createButton = document.querySelector('#my-create');

let tasks = [];

async function displayAllTasks() {
  tasks = await getTaskList();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  inbox.innerHTML = '';

  tasks.forEach((task, index) => {
    const item = document.createElement('div');
    item.className = 'item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('click', () => {
      task.completed = checkbox.checked;
    });

    const description = document.createElement('p');
    description.textContent = task.content;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      tasks.splice(index, 1);
      renderTasks(tasks);
    });

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => {
      const newDescription = prompt('Enter a new description', task.content);
      task.content = newDescription;
      renderTasks(tasks);
    });

    item.appendChild(checkbox);
    item.appendChild(description);
    item.appendChild(deleteButton);
    item.appendChild(editButton);

    inbox.appendChild(item);
  });
}


function createTaskItem(task) {
  const item = document.createElement('li');
  item.className = 'task';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('click', async () => {
    task.completed = checkbox.checked;
    await updateTask(task.id, task);
  });

  const description = document.createElement('span');
  description.textContent = task.content;
  description.className = 'task-description';

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.addEventListener('click', async () => {
    await deleteTask(task.id);
    await displayAllTasks();
  });

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  editButton.addEventListener('click', async () => {
    const newDescription = prompt('Enter a new description', task.content);
    task.content = newDescription;
    await updateTask(task.id, task);
    await displayAllTasks();
  });

  item.appendChild(checkbox);
  item.appendChild(description);
  item.appendChild(deleteButton);
  item.appendChild(editButton);

  return item;
}

createButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const description = prompt('Enter a task description');
  const task = createTask(description);
  const taskElement = createTaskItem(task);
  inbox.appendChild(taskElement);
});

inbox.addEventListener('click', async (event) => {
  const target = event.target;
  if (target.tagName === 'BUTTON') {
    const taskElement = target.parentNode;
    const taskId = taskElement.dataset.id;
    if (target.classList.contains('delete')) {
      await deleteTask(taskId);
      taskElement.remove();
    } else if (target.classList.contains('edit')) {
      const newDescription = prompt('Enter a new description', taskElement.querySelector('.description').textContent);
      await updateTask(taskId, newDescription);
      taskElement.querySelector('.description').textContent = newDescription;
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  displayAllTasks();
});

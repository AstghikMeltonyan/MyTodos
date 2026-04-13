(function () {
  let listArray = [];
  let keyList = '';

  function createTodoTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.classList.add('title');
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    input.placeholder = 'Добавить дело';
    input.type = "text";
    input.enterKeyHint = "done";

    input.classList.add('todo-input');
    form.append(input);
    form.append(buttonWrapper);
    return {
      form,
      input,
    }
  }

  function createTodoList() {
    let list = document.createElement('ul');
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('todo');
    doneButton.classList.add('done');
    deleteButton.classList.add('delete');


    item.textContent = obj.name;
    item.id = obj.id;

    if (obj.done) item.classList.add('completed');

    doneButton.addEventListener('click', function () {
      item.classList.toggle('completed');

      for (const item of listArray) {
        if (item.id === obj.id) {
          item.done = !item.done;
        }
      }
      saveInLocaleStorage(keyList, listArray);
    });

    deleteButton.addEventListener('click', function () {
      item.remove()
      for (let i = 0; i < listArray.length; i++) {
        if (listArray[i].id == obj.id) {
          listArray.splice(i, 1)
        }
      }
      saveInLocaleStorage(keyList, listArray);
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton
    }
  }

  function getNewID(arr) {
    let max = 0;
    for (let item of arr) {
      if (item.id > max) max = item.id;
    }
    return max + 1;
  }

  function saveInLocaleStorage(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr))
  }

  function createTodoApp(container, title, key, todosArr) {
    let todoTitle = createTodoTitle(title);
    let todoForm = createTodoForm();
    let todoList = createTodoList();

    container.append(todoTitle);
    container.append(todoForm.form);
    container.append(todoList);

    keyList = key;
    let localData = localStorage.getItem(keyList);

    if (localData !== null && localData !== '') {
      listArray = JSON.parse(localData)
    } else {
      listArray = todosArr;
      saveInLocaleStorage(keyList, listArray)
    }

    for (const item of listArray) {
      let todoItem = createTodoItem(item)
      todoList.append(todoItem.item);
    }

    todoForm.form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!todoForm.input.value.trim()) {
        return;
      }

      let newTodo = {
        id: getNewID(listArray),
        name: todoForm.input.value,
        done: false
      }

      let todoItem = createTodoItem(newTodo);

      listArray.push(newTodo);

      todoList.append(todoItem.item);

      saveInLocaleStorage(keyList, listArray);

      todoForm.input.value = '';
      todoForm.button.disabled = true;
    })
  }
  window.createTodoApp = createTodoApp;
})()


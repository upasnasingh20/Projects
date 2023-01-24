let tasks = [];
let tasksList = document.getElementById('list');
const addTaskInput = document.getElementById('add');
const tasksCounter = document.getElementById('tasks-counter');

function fetchTodos(){
    /*we will use Todo API from https://jsonplaceholder.typicode.com/todos */
    // GET request
    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(function(response){
            console.log(response);
            return response.json();
        }).then(function(data){
            //console.log(data);
            tasks = data.slice(0,10);
            //console.log(typeof(tasks));
            renderList();
        })
        .catch(function(error){
            console.log('error', error);
        })
}

console.log('Working');

function addTaskToDOM(task){
    const li = document.createElement('li');

    li.innerHTML = `
        
            <input type="checkbox" id="${task.id}" ${task.completed ? 'checked' : ''} class="custom-checkbox">
            <label for="${task.id}">${task.title}</label>
            <img src="assets/bin.png" class="delete" data-id="${task.id}">
        
    `;

    tasksList.append(li);
}
function renderList () {
    tasksList.innerHTML = '';
    console.log(tasks);
    for(let i=0; i<tasks.length; i++){
        addTaskToDOM(tasks[i]);
    }
    console.log(tasks.length);
    console.log(tasksCounter);
    tasksCounter.innerHTML = tasks.length;
    
}

function toggleTask(taskId) {
    const task = tasks.filter(function(task){
        return task.id === Number(taskId);
    })

    if(task.length > 0){
        const currentTask = task[0];

        currentTask.completed = !currentTask.completed;
        renderList();
        showNotification('Task toggled successfully');
        return;
    }
    showNotification('Could not toggle the task');
}

function deleteTask (taskId) {
    //console.log(taskId, typeof(taskId));
    const newTasks = tasks.filter(function(task){
        // console.log(task.id , typeof(task.id) , task.id.toString() !== taskId );
        // if(task.id != taskId){
            
        //     console.log(task);
        // }
        return task.id.toString() !== taskId;
    })
    console.log(newTasks);
    tasks = newTasks;
    console.log(tasks);
    renderList();
    showNotification('Task deleted successfully');
}

function addTask (task) {
    if(task){
        tasks.push(task);
        renderList();
        showNotification('Task added successfully');
        return;
    }
    showNotification('Task cannot be added');
}

function showNotification(text) {
    alert(text);
}

function handleInputKeypress(e){
    if(e.key === 'Enter'){
        const text = e.target.value;
        console.log('text',text);

        if(!text){
            showNotification('Task text cannot be empty! ');
            return;
        }

        const task ={
            title : text,
            id: Date.now(),
            completed: false
        }

        e.target.value=''; /* when user has pressed enter, we have to make input box empty again*/
        addTask(task); /* pass the task created to the addTask()*/
    }
}

function handleClickListener(e){
    const target = e.target;
    console.log(target);

    if(target.className === 'delete'){
        const taskId = target.dataset.id;
        console.log(taskId);
        deleteTask(taskId);
        return;
    }else if(target.className === 'custom-checkbox'){
        const taskId = target.id;
        toggleTask(taskId);
        return;
    }

}

function initializeApp(){
    fetchTodos();
    addTaskInput.addEventListener('keyup' , handleInputKeypress);
    document.addEventListener('click', handleClickListener);
}

initializeApp();
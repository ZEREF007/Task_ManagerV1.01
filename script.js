document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const taskCount = document.getElementById('task-count');
    const clearTasksBtn = document.getElementById('clear-tasks-btn');
    const fireworksContainer = document.getElementById('fireworks-container');

    
    let editTaskItem = null;

    // Load tasks from local storage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task.text, task.completed);
        });
        updateTaskCount();
    };

    // Save tasks to local storage
    const saveTasks = () => {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('span').textContent,
                completed: taskItem.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Add task to DOM
    const addTaskToDOM = (taskText, completed = false) => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <input type="checkbox" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="actions">
                <button class="edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
        `;
        if (completed) {
            taskItem.classList.add('completed');
        }
        taskList.appendChild(taskItem);
        updateTaskCount();
    };

    // Update task count
    const updateTaskCount = () => {
        const count = taskList.querySelectorAll('li:not(.completed)').length;
        taskCount.textContent = `${count} tasks left`;

        if (count === 0 && taskList.querySelectorAll('li').length > 0) {
            triggerConfetti();
        }
    };

    // Add or update task
    const addTask = () => {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        if (editTaskItem) {
            editTaskItem.querySelector('span').textContent = taskText;
            editTaskItem = null;
        } else {
            addTaskToDOM(taskText);
        }

        taskInput.value = '';
        saveTasks();
    };

    // Handle task completion
    taskList.addEventListener('change', e => {
        if (e.target.type === 'checkbox') {
            const taskItem = e.target.closest('li');
            taskItem.classList.toggle('completed');
            saveTasks();
            updateTaskCount();
        }
    });

    // Handle task actions (edit and delete)
    taskList.addEventListener('click', e => {
        const target = e.target;
        const taskItem = target.closest('li');

        if (target.classList.contains('delete-btn') || target.closest('.delete-btn')) {
            taskItem.remove();
            saveTasks();
            updateTaskCount();
        }

        if (target.classList.contains('edit-btn') || target.closest('.edit-btn')) {
            taskInput.value = taskItem.querySelector('span').textContent;
            editTaskItem = taskItem;
            taskInput.focus(); // Focus on the input box for editing
        }
    });

    // Handle clear tasks button
    clearTasksBtn.addEventListener('click', () => {
        taskList.innerHTML = '';
        saveTasks();
        updateTaskCount();
    });

    // Handle adding task on button click
    addTaskBtn.addEventListener('click', addTask);

    // Handle adding task on Enter key
    taskInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Confetti animation
    const triggerConfetti = () => {
        const defaults = {
            spread: 360,
            ticks: 100,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            shapes: ["heart"],
            colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
        };

        confetti({
            ...defaults,
            particleCount: 50,
            scalar: 2,
        });

        confetti({
            ...defaults,
            particleCount: 25,
            scalar: 3,
        });

        confetti({
            ...defaults,
            particleCount: 10,
            scalar: 4,
        });
    };

    // Load initial tasks
    loadTasks();
});
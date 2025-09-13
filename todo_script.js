document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('#empty-image');

    const toggleEmptyState =() =>{
        emptyImage.style.display = taskList.children.length === 0 ? 'block' :'none';
    }

    const addTask = (event) => {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (!taskText) {
            return;
        }
        
        
                            

        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="checkbox">
        <span>${taskText}</span>
        <div class="task-buttons">
  <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
  <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
</div>`;
        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
    };
    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask(e);
    }
        });

    taskList.addEventListener('click', function(e) {
        // Delete functionality
        if (e.target.closest('.delete-btn')) {
            const li = e.target.closest('li');
            if (li) li.remove();
            toggleEmptyState();
        }
        // Edit functionality
        if (e.target.closest('.edit-btn')) {
            const li = e.target.closest('li');
            const span = li.querySelector('span');
            span.contentEditable = true;
            span.focus();
            // Save on blur or Enter
            function finishEdit(ev) {
                if (ev.type === 'blur' || (ev.type === 'keydown' && ev.key === 'Enter')) {
                    ev.preventDefault();
                    span.contentEditable = false;
                    span.removeEventListener('blur', finishEdit);
                    span.removeEventListener('keydown', finishEdit);
                }
            }
            span.addEventListener('blur', finishEdit);
            span.addEventListener('keydown', finishEdit);
        }
    });

    function updateTaskCount() {
        const count = taskList.children.length;
        let completed = 0;
        document.querySelectorAll('#task-list .checkbox').forEach(cb => {
            if (cb.checked) completed++;
        });
        const badge = document.getElementById('task-count');
        if (badge) badge.textContent = `${completed}/${count}`;
    }

    // Local storage support
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('#task-list li').forEach(li => {
            const text = li.querySelector('span').textContent;
            const done = li.querySelector('.checkbox').checked;
            tasks.push({ text, done });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="checkbox" ${task.done ? 'checked' : ''}>
                <span>${task.text}</span>
                <div class="task-buttons">
                  <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                  <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
                </div>`;
            taskList.appendChild(li);
        });
        toggleEmptyState();
        updateTaskCount();
    }

    // Add task and save
    const addTaskAndSave = (event) => {
        addTask(event);
        saveTasks();
        updateTaskCount();
    };
    addTaskBtn.removeEventListener('click', addTask);
    addTaskBtn.addEventListener('click', addTaskAndSave);
    taskInput.removeEventListener('keypress', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskAndSave(e);
        }
    });

    // Event delegation for delete, edit, and checkbox
    taskList.addEventListener('click', function(e) {
        // Delete functionality
        if (e.target.closest('.delete-btn')) {
            const li = e.target.closest('li');
            if (li) li.remove();
            toggleEmptyState();
            saveTasks();
            updateTaskCount();
        }
        // Edit functionality
        if (e.target.closest('.edit-btn')) {
            const li = e.target.closest('li');
            const span = li.querySelector('span');
            span.contentEditable = true;
            span.focus();
            // Save on blur or Enter
            function finishEdit(ev) {
                if (ev.type === 'blur' || (ev.type === 'keydown' && ev.key === 'Enter')) {
                    ev.preventDefault();
                    span.contentEditable = false;
                    span.removeEventListener('blur', finishEdit);
                    span.removeEventListener('keydown', finishEdit);
                    saveTasks();
                    updateTaskCount();
                }
            }
            span.addEventListener('blur', finishEdit);
            span.addEventListener('keydown', finishEdit);
        }
        // Checkbox change
        if (e.target.classList.contains('checkbox')) {
            saveTasks();
            updateTaskCount();
        }
    });

    // Initial load
    loadTasks();
});
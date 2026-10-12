document.addEventListener('DOMContentLoaded', () => {
    Chart.defaults.color = '#9ca3af';
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';

    let donutChartInstance = null;
    const donutCtx = document.getElementById('donutChart');
    if (donutCtx) {
        donutChartInstance = new Chart(donutCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Pending'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#6366f1', '#85dcb8'],
                    borderWidth: 0,
                    cutout: '76%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 10,
                        cornerRadius: 8
                    }
                }
            }
        });
    }

    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['1', '2', '3', '4', '5'],
                datasets: [
                    {
                        label: 'Completed',
                        data: [45, 50, 40, 50, 40],
                        backgroundColor: '#6366f1',
                        barThickness: 6,
                        borderRadius: 3
                    },
                    {
                        label: 'Pending',
                        data: [15, 35, 10, 25, 30],
                        backgroundColor: '#85dcb8',
                        barThickness: 6,
                        borderRadius: 3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 10,
                        cornerRadius: 8
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { color: '#6b7280' }
                    },
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { stepSize: 20, color: '#6b7280' }
                    }
                }
            }
        });
    }

    const MANAGERS = [
        { name: 'Oleh U.', initial: 'OU', score: 48, color: '#6366f1', bars: [20, 30, 15, 25] },
        { name: 'Ihor H.', initial: 'IH', score: 62, color: '#10b981', bars: [35, 20, 20, 15] },
        { name: 'Taras O.', initial: 'TO', score: 54, color: '#f59e0b', bars: [15, 35, 25, 15] },
        { name: 'Pavlo K.', initial: 'PK', score: 39, color: '#ec4899', bars: [30, 25, 15, 20] },
        { name: 'Nora M.', initial: 'NM', score: 43, color: '#8b5cf6', bars: [25, 30, 20, 15] },
        { name: 'Hector J.', initial: 'HJ', score: 58, color: '#06b6d4', bars: [20, 40, 15, 15] },
        { name: 'Oliver Y.', initial: 'OY', score: 37, color: '#f97316', bars: [30, 20, 25, 15] }
    ];

    function createManagerRow(manager) {
        return `
            <div class="manager-item">
                <div class="manager-avatar-initials" style="background-color: ${manager.color};">
                    ${manager.initial}
                </div>
                <div class="manager-name" title="${manager.name}">${manager.name}</div>
                <div class="manager-bar-container">
                    <div style="width: ${manager.bars[0]}%; background: #ef4444;"></div>
                    <div style="width: ${manager.bars[1]}%; background: #f59e0b;"></div>
                    <div style="width: ${manager.bars[2]}%; background: #10b981;"></div>
                    <div style="width: ${manager.bars[3]}%; background: #06b6d4;"></div>
                </div>
                <div class="manager-stat">${manager.score}</div>
            </div>
        `;
    }

    const myManagersContainer = document.getElementById('myManagersList');
    if (myManagersContainer) {
        myManagersContainer.innerHTML = MANAGERS.map(createManagerRow).join('');
    }

    const projectManagersContainer = document.getElementById('projectManagersList');
    function renderProjectManagers(filterType = 'today') {
        if (!projectManagersContainer) return;
        let count = 4;
        if (filterType === 'tomorrow') count = 3;
        if (filterType === 'reserve') count = 5;

        const subset = MANAGERS.slice(0, count);
        projectManagersContainer.innerHTML = subset.map(createManagerRow).join('');
    }
    renderProjectManagers('today');

    const tabLinks = document.querySelectorAll('.tab-link');
    tabLinks.forEach(tab => {
        tab.addEventListener('click', () => {
            tabLinks.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabKey = tab.getAttribute('data-tab') || 'today';
            renderProjectManagers(tabKey);
        });
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const mobileToggle = document.getElementById('mobileToggle');
    const sidebar = document.getElementById('sidebar');
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    const taskModal = document.getElementById('taskModal');
    const openTaskBtn = document.getElementById('openTaskModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');
    const taskForm = document.getElementById('createTaskForm');
    const taskIdInput = document.getElementById('taskId');
    const modalTitleEl = document.getElementById('modalTitle');

    function openModal(editTask = null) {
        if (!taskModal) return;
        if (editTask) {
            if (modalTitleEl) modalTitleEl.textContent = 'Edit Task';
            if (taskIdInput) taskIdInput.value = editTask.id;
            document.getElementById('taskTitle').value = editTask.title || '';
            document.getElementById('taskDescription').value = editTask.description || '';
            document.getElementById('taskPriority').value = editTask.priority || 'Low';
            document.getElementById('taskAssignee').value = editTask.assigned_to || '';
        } else {
            if (modalTitleEl) modalTitleEl.textContent = 'Create New Task';
            if (taskIdInput) taskIdInput.value = '';
            taskForm?.reset();
        }
        taskModal.classList.add('active');
        document.getElementById('taskTitle')?.focus();
    }

    function closeModal() {
        if (taskModal) {
            taskModal.classList.remove('active');
            if (taskIdInput) taskIdInput.value = '';
            if (modalTitleEl) modalTitleEl.textContent = 'Create New Task';
            taskForm?.reset();
        }
    }

    openTaskBtn?.addEventListener('click', () => openModal());
    closeModalBtn?.addEventListener('click', closeModal);
    cancelModalBtn?.addEventListener('click', closeModal);

    taskModal?.addEventListener('click', (e) => {
        if (e.target === taskModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && taskModal?.classList.contains('active')) {
            closeModal();
        }
    });

    let taskData = [];
    const taskListEl = document.getElementById('taskList');
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const donutCenterVal = document.querySelector('.donut-center-val');

    function updateChartMetrics(tasks) {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === 'completed').length;
        const pending = total - completed;

        if (donutCenterVal) {
            donutCenterVal.textContent = total;
        }

        if (donutChartInstance) {
            if (total === 0) {
                donutChartInstance.data.datasets[0].data = [0, 1];
                donutChartInstance.data.datasets[0].backgroundColor = ['#2e2e33', '#3f3f46'];
            } else {
                donutChartInstance.data.datasets[0].data = [completed, pending];
                donutChartInstance.data.datasets[0].backgroundColor = ['#6366f1', '#85dcb8'];
            }
            donutChartInstance.update();
        }
    }

    async function fetchTasks() {
        try {
            const response = await fetch('/api/tasks');
            const result = await response.json();
            if (result.success) {
                taskData = result.data || [];
                updateChartMetrics(taskData);
                applyFilters();
            }
        } catch (err) {
            console.error('Failed to load tasks:', err);
        }
    }

    function renderTasks(list) {
        if (!taskListEl) return;

        if (list.length === 0) {
            taskListEl.innerHTML = `
                <tr>
                    <td colspan="7" class="empty-state">No matching tasks found.</td>
                </tr>
            `;
            return;
        }

        taskListEl.innerHTML = list.map(t => {
            let statusBadge = 'badge-teal';
            let statusText = 'Pending';
            let progressWidth = '20%';
            let progressColor = '#14b8a6';

            if (t.status === 'completed') {
                statusBadge = 'badge-indigo';
                statusText = 'Completed';
                progressWidth = '100%';
                progressColor = '#6366f1';
            } else if (t.status === 'in_progress') {
                statusBadge = 'badge-amber';
                statusText = 'In Progress';
                progressWidth = '55%';
                progressColor = '#f59e0b';
            }

            const priorityBadge = t.priority === 'High' 
                ? 'badge-red' 
                : (t.priority === 'Medium' ? 'badge-amber' : 'badge-green');

            return `
                <tr data-id="${t.id}">
                    <td class="col-check"><input type="checkbox" class="checkbox-custom"></td>
                    <td>
                        <div class="task-title-cell">${t.title}</div>
                        <div class="task-user">${t.user_name || 'Unassigned'}</div>
                    </td>
                    <td>
                        <span class="badge ${statusBadge}" data-action="toggle-status" data-status="${t.status}" title="Click to cycle status">
                            ${statusText}
                        </span>
                    </td>
                    <td><span class="badge ${priorityBadge}">${t.priority || 'Low'}</span></td>
                    <td>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${progressWidth}; background-color: ${progressColor};"></div>
                        </div>
                    </td>
                    <td><span class="task-rating">★★★★☆</span></td>
                    <td class="col-action">
                        <div class="action-btn-group">
                            <button class="action-btn edit-btn" data-action="edit" title="Edit task">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button class="action-btn" data-action="delete" title="Delete task">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function applyFilters() {
        const query = searchInput?.value.trim().toLowerCase() || '';
        const selectedStatus = statusFilter?.value || 'all';

        const filtered = taskData.filter(item => {
            const matchesQuery = item.title.toLowerCase().includes(query) ||
                                (item.user_name && item.user_name.toLowerCase().includes(query));
            const matchesStatus = (selectedStatus === 'all') || (item.status === selectedStatus);
            return matchesQuery && matchesStatus;
        });

        renderTasks(filtered);
    }

    taskListEl?.addEventListener('click', async (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const row = target.closest('tr');
        const taskId = row?.getAttribute('data-id');
        if (!taskId) return;

        const action = target.getAttribute('data-action');

        if (action === 'toggle-status') {
            const current = target.getAttribute('data-status');
            const nextCycle = {
                'pending': 'in_progress',
                'in_progress': 'completed',
                'completed': 'pending'
            };
            const nextStatus = nextCycle[current] || 'pending';

            try {
                const res = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: nextStatus })
                });
                if (res.ok) fetchTasks();
            } catch (err) {
                console.error('Error updating status:', err);
            }
        } else if (action === 'edit') {
            const task = taskData.find(t => String(t.id) === String(taskId));
            if (task) openModal(task);
        } else if (action === 'delete') {
            if (!confirm('Are you sure you want to delete this task?')) return;
            try {
                const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
                if (res.ok) fetchTasks();
            } catch (err) {
                console.error('Error deleting task:', err);
            }
        }
    });

    searchInput?.addEventListener('input', applyFilters);
    statusFilter?.addEventListener('change', applyFilters);

    taskForm?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = taskIdInput?.value;
        const payload = {
            title: document.getElementById('taskTitle').value.trim(),
            description: document.getElementById('taskDescription').value.trim(),
            priority: document.getElementById('taskPriority').value,
            assigned_to: document.getElementById('taskAssignee').value || null
        };

        try {
            const url = id ? `/api/tasks/${id}` : '/api/tasks';
            const method = id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                closeModal();
                fetchTasks();
            }
        } catch (err) {
            console.error('Error saving task:', err);
        }
    });

    fetchTasks();
});

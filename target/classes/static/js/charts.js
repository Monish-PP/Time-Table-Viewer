let deptChart = null;
let workloadChart = null;
let roomChart = null;
let subjectChart = null;

function renderDashboardCharts(stats) {
    if (typeof Chart === 'undefined') return;

    // 1. Students by Department Chart
    const ctxDept = document.getElementById('chartStudentsDept');
    if (ctxDept && stats.studentsByDepartment) {
        if (deptChart) deptChart.destroy();
        deptChart = new Chart(ctxDept, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.studentsByDepartment),
                datasets: [{
                    label: 'Students',
                    data: Object.values(stats.studentsByDepartment),
                    backgroundColor: ['#0284c7', '#38bdf8', '#818cf8', '#c084fc']
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    // 2. Faculty Workload Chart
    const ctxWorkload = document.getElementById('chartFacultyWorkload');
    if (ctxWorkload && stats.facultyWorkload) {
        if (workloadChart) workloadChart.destroy();
        workloadChart = new Chart(ctxWorkload, {
            type: 'bar',
            data: {
                labels: Object.keys(stats.facultyWorkload),
                datasets: [{
                    label: 'Periods Assigned',
                    data: Object.values(stats.facultyWorkload),
                    backgroundColor: '#16a34a'
                }]
            },
            options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } } }
        });
    }

    // 3. Classroom Utilization Chart
    const ctxRoom = document.getElementById('chartRoomUtilization');
    if (ctxRoom && stats.classroomUtilization) {
        if (roomChart) roomChart.destroy();
        roomChart = new Chart(ctxRoom, {
            type: 'pie',
            data: {
                labels: Object.keys(stats.classroomUtilization),
                datasets: [{
                    data: Object.values(stats.classroomUtilization),
                    backgroundColor: ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#8b5cf6']
                }]
            },
            options: { responsive: true }
        });
    }

    // 4. Subject Distribution Chart
    const ctxSub = document.getElementById('chartSubjectDist');
    if (ctxSub && stats.subjectTypeDistribution) {
        if (subjectChart) subjectChart.destroy();
        subjectChart = new Chart(ctxSub, {
            type: 'doughnut',
            data: {
                labels: Object.keys(stats.subjectTypeDistribution),
                datasets: [{
                    data: Object.values(stats.subjectTypeDistribution),
                    backgroundColor: ['#0284c7', '#9333ea', '#10b981', '#f59e0b']
                }]
            },
            options: { responsive: true }
        });
    }
}

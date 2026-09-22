document.addEventListener('DOMContentLoaded', function () {

    const recordsBody = document.getElementById('recordsBody');
    const clearListBtn = document.getElementById('clearListBtn');

    const STORAGE_KEY = 'citcs_enrollments';

    // ----- LOAD RECORDS FROM LOCALSTORAGE -----
    function loadRecords() {
        let records = [];
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) records = JSON.parse(stored);
        } catch (err) {
            records = [];
        }
        return records;
    }

    // ----- RENDER TABLE -----
    function renderTable(records) {
        // Clear all existing rows
        recordsBody.innerHTML = '';

        if (!records || records.length === 0) {
            // Show empty state
            const emptyRow = document.createElement('tr');
            emptyRow.className = 'empty-row';
            const td = document.createElement('td');
            td.colSpan = 11;
            td.textContent = 'No students enrolled yet.';
            emptyRow.appendChild(td);
            recordsBody.appendChild(emptyRow);
            return;
        }

        // Build rows
        records.forEach((rec, index) => {
            const row = document.createElement('tr');
            const cells = [
                index + 1,
                rec.studentId,
                rec.prefix || '—',
                rec.firstName,
                rec.middleName || '—',
                rec.lastName,
                rec.suffix || '—',
                rec.email,
                rec.course,
                rec.major || '—',
                rec.yearLevel
            ];

            cells.forEach(value => {
                const td = document.createElement('td');
                td.textContent = value;
                row.appendChild(td);
            });

            recordsBody.appendChild(row);
        });
    }

    // ----- CLEAR ALL RECORDS -----
    clearListBtn.addEventListener('click', function () {
        const confirmed = confirm('Are you sure you want to clear all enrollment records? This cannot be undone.');
        if (!confirmed) return;

        localStorage.removeItem(STORAGE_KEY);
        renderTable([]);
    });

    // ----- INITIAL RENDER -----
    renderTable(loadRecords());
});
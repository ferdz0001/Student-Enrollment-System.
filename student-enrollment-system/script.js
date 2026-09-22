document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('enrollmentForm');
    const modal = document.getElementById('successModal');
    const viewBtn = document.getElementById('viewBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    // Inputs
    const studentId = document.getElementById('studentId');
    const prefix = document.getElementById('prefix');
    const firstName = document.getElementById('firstName');
    const middleName = document.getElementById('middleName');
    const lastName = document.getElementById('lastName');
    const suffix = document.getElementById('suffix');
    const email = document.getElementById('email');
    const course = document.getElementById('course');
    const major = document.getElementById('major');
    const yearLevel = document.getElementById('yearLevel');

    // Error spans
    const errorStudentId = document.getElementById('errorStudentId');
    const errorPrefix = document.getElementById('errorPrefix');
    const errorFirstName = document.getElementById('errorFirstName');
    const errorMiddleName = document.getElementById('errorMiddleName');
    const errorLastName = document.getElementById('errorLastName');
    const errorSuffix = document.getElementById('errorSuffix');
    const errorEmail = document.getElementById('errorEmail');
    const errorCourse = document.getElementById('errorCourse');
    const errorMajor = document.getElementById('errorMajor');
    const errorYearLevel = document.getElementById('errorYearLevel');

    const majorGroup = document.getElementById('majorGroup');
    const STORAGE_KEY = 'citcs_enrollments';

    // ----- HELPERS -----
    function setError(field, errorSpan, message) {
        field.classList.add('error');
        errorSpan.textContent = message;
    }

    function clearError(field, errorSpan) {
        field.classList.remove('error');
        errorSpan.textContent = '';
    }

    function toggleMajorField() {
        if (course.value === 'BSIT') {
            majorGroup.style.display = 'flex';
        } else {
            majorGroup.style.display = 'none';
            major.value = '';
            clearError(major, errorMajor);
        }
    }

    // ----- VALIDATION -----
    function validateForm() {
        let isValid = true;

        const sidVal = studentId.value.trim();
        if (sidVal === '') {
            setError(studentId, errorStudentId, 'Student ID is required.');
            isValid = false;
        } else if (sidVal.length < 5) {
            setError(studentId, errorStudentId, 'Student ID must be at least 5 characters.');
            isValid = false;
        } else clearError(studentId, errorStudentId);

        const prefixVal = prefix.value.trim();
        if (prefixVal !== '' && prefixVal.length < 2) {
            setError(prefix, errorPrefix, 'Prefix must be at least 2 characters.');
            isValid = false;
        } else clearError(prefix, errorPrefix);

        const fnameVal = firstName.value.trim();
        if (fnameVal === '') {
            setError(firstName, errorFirstName, 'First name is required.');
            isValid = false;
        } else if (fnameVal.length < 3) {
            setError(firstName, errorFirstName, 'First name must be at least 3 characters.');
            isValid = false;
        } else clearError(firstName, errorFirstName);

        const mnameVal = middleName.value.trim();
        if (mnameVal !== '' && mnameVal.length < 2) {
            setError(middleName, errorMiddleName, 'Middle name must be at least 2 characters.');
            isValid = false;
        } else clearError(middleName, errorMiddleName);

        const lnameVal = lastName.value.trim();
        if (lnameVal === '') {
            setError(lastName, errorLastName, 'Last name is required.');
            isValid = false;
        } else if (lnameVal.length < 2) {
            setError(lastName, errorLastName, 'Last name must be at least 2 characters.');
            isValid = false;
        } else clearError(lastName, errorLastName);

        const suffixVal = suffix.value.trim();
        if (suffixVal !== '' && suffixVal.length < 2) {
            setError(suffix, errorSuffix, 'Suffix must be at least 2 characters.');
            isValid = false;
        } else clearError(suffix, errorSuffix);

        const emailVal = email.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailVal === '') {
            setError(email, errorEmail, 'Email is required.');
            isValid = false;
        } else if (!emailPattern.test(emailVal)) {
            setError(email, errorEmail, 'Please enter a valid email address.');
            isValid = false;
        } else clearError(email, errorEmail);

        if (course.value === '') {
            setError(course, errorCourse, 'Please select a course.');
            isValid = false;
        } else clearError(course, errorCourse);

        if (course.value === 'BSIT' && major.value === '') {
            setError(major, errorMajor, 'Please select a major for BSIT.');
            isValid = false;
        } else clearError(major, errorMajor);

        if (yearLevel.value === '') {
            setError(yearLevel, errorYearLevel, 'Please select a year level.');
            isValid = false;
        } else clearError(yearLevel, errorYearLevel);

        return isValid;
    }

    // ----- SAVE -----
    function saveEnrollment(data) {
        let records = [];
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) records = JSON.parse(stored);
        } catch (err) { records = []; }
        records.push(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    // ----- RESET -----
    function resetFormFields() {
        form.reset();
        form.querySelectorAll('input, select').forEach(i => i.classList.remove('error'));
        form.querySelectorAll('.error-message').forEach(s => s.textContent = '');
        toggleMajorField();
    }

    // ----- SUBMIT -----
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        const data = {
            studentId: studentId.value.trim(),
            prefix: prefix.value.trim(),
            firstName: firstName.value.trim(),
            middleName: middleName.value.trim(),
            lastName: lastName.value.trim(),
            suffix: suffix.value.trim(),
            email: email.value.trim(),
            course: course.value,
            major: course.value === 'BSIT' ? major.value : '',
            yearLevel: yearLevel.value
        };

        saveEnrollment(data);
        modal.classList.add('show');
        resetFormFields();
    });

    // ----- MODAL ACTIONS -----
    viewBtn.addEventListener('click', () => {
        window.location.href = 'enrollment-list.html';
    });

    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });

    // ----- CLEAR ERRORS ON INPUT -----
    const pairs = [
        [studentId, errorStudentId], [prefix, errorPrefix],
        [firstName, errorFirstName], [middleName, errorMiddleName],
        [lastName, errorLastName],   [suffix, errorSuffix],
        [email, errorEmail],         [course, errorCourse],
        [major, errorMajor],         [yearLevel, errorYearLevel]
    ];

    pairs.forEach(([field, errorSpan]) => {
        field.addEventListener('input', () => clearError(field, errorSpan));
        field.addEventListener('change', () => clearError(field, errorSpan));
    });

    course.addEventListener('change', toggleMajorField);
    toggleMajorField();
});
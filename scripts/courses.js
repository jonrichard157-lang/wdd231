// Course List Array
const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call, debug, and test their own functions; and to handle errors within functions.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: ['C#'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];

// DOM Selectors
const courseList = document.querySelector('#course-list');
const totalCreditsDisplay = document.querySelector('#total-credits');
const allBtn = document.querySelector('#all-courses');
const cseBtn = document.querySelector('#cse-courses');
const wddBtn = document.querySelector('#wdd-courses');
const filterButtons = document.querySelectorAll('.filter-btn');

// Function to render courses dynamically
function renderCourses(coursesToDisplay) {
    if (!courseList) return;

    // Clear previous courses
    courseList.innerHTML = '';

    // Create a card for each course
    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.classList.add('course-card');

        if (course.completed) {
            courseCard.classList.add('completed');
            courseCard.setAttribute('title', `${course.title} (Completed)`);
            courseCard.innerHTML = `<span class="check-icon">&#10003;</span> ${course.subject} ${course.number}`;
        } else {
            courseCard.setAttribute('title', `${course.title} (In Progress)`);
            courseCard.textContent = `${course.subject} ${course.number}`;
        }

        courseList.appendChild(courseCard);
    });

    // Calculate total credits dynamically using reduce()
    const totalCredits = coursesToDisplay.reduce((accumulator, currentCourse) => {
        return accumulator + currentCourse.credits;
    }, 0);

    // Update total credits display
    if (totalCreditsDisplay) {
        totalCreditsDisplay.textContent = `The total credits for courses listed above is ${totalCredits}`;
    }
}

// Function to update active filter button state
function setActiveButton(activeButton) {
    filterButtons.forEach(button => button.classList.remove('active'));
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Event Listeners for filter buttons using Array.prototype.filter()
if (allBtn) {
    allBtn.addEventListener('click', () => {
        setActiveButton(allBtn);
        renderCourses(courses);
    });
}

if (cseBtn) {
    cseBtn.addEventListener('click', () => {
        setActiveButton(cseBtn);
        const cseCourses = courses.filter(course => course.subject === 'CSE');
        renderCourses(cseCourses);
    });
}

if (wddBtn) {
    wddBtn.addEventListener('click', () => {
        setActiveButton(wddBtn);
        const wddCourses = courses.filter(course => course.subject === 'WDD');
        renderCourses(wddCourses);
    });
}

// Initial render showing all courses
renderCourses(courses);
export const MODULES = [
    { id: "student", label: "Student" },
    { id: "fees", label: "Fees" },
    { id: "exam", label: "Exam" },
    { id: "transport", label: "Transport" },
    { id: "account", label: "Account" },
    { id: "admin", label: "Admin" },
    { id: "mobile-app", label: "Mobile App" }
]
export const STAFF_MODULES = [
    { id: "Marks Entry", label: "Marks Entry" },
    { id: "Student Attendance", label: "Student Attendance" },
    { id: "Calender", label: "Calender" },
    { id: "gallery", label: "Gallery" },
    { id: "Homework Upload", label: "Homework Upload" },
    { id: "Leave Request", label: "Leave Request" },
    { id: "My Attendance", label: "My Attendance" },
    { id: "Message", label: "Message" },
    { id: "Video Lecture", label: "Video Lecture" },
    { id: "notice-board", label: "Notice Board" },
]
export const STD_MODULES = [
    { id: "notice-board", label: "Notice Board" },
    { id: "fees", label: "Fees" },
    { id: "Result", label: "Result" },
    { id: "Attendance", label: "Attendance" },
    { id: "test-report", label: "test Report" },
    { id: "Calender", label: "Calender" },
    { id: "gallery", label: "Gallery" },
    { id: "Homework", label: "Homework" },
    { id: "Video Lecture", label: "Video Lecture" },
    { id: "Time Table", label: "Time Table" },
    { id: "Message", label: "Message" },
    { id: "Changeassword", label: "Change Password" },
]
export const DRIVER_MODULES = [
    { id: "Routes", label: "Routes" },
    { id: "Student Pickup", label: "Student Pickup" },
    { id: "Student Drop", label: "Student Drop" },
    { id: "Live Tracking", label: "Live Tracking" },
    { id: "Emergency Alerts", label: "Emergency Alerts" },
    { id: "Attendance", label: "Attendance" },
];
export const STUDENT_MODULES = [
    { id: "Assignments", label: "Assignments" },
    { id: "Online Classes", label: "Online Classes" },
    { id: "Exams", label: "Exams" },
    { id: "Results", label: "Results" },
    { id: "Timetable", label: "Timetable" },
    { id: "Attendance", label: "Attendance" },
    { id: "Library", label: "Library" },
    { id: "Video Lectures", label: "Video Lectures" },
    { id: "Notice Board", label: "Notice Board" },
    { id: "Message", label: "Message" },
];
export const ADMIN_MODULES = [
    { id: "Dashboard", label: "Dashboard" },
    { id: "Staff Management", label: "Staff Management" },
    { id: "Student Management", label: "Student Management" },
    { id: "Fee Collection", label: "Fee Collection" },
    { id: "Time Table", label: "Time Table" },
    { id: "Exams", label: "Exams" },
    { id: "Reports", label: "Reports" },
    { id: "Library", label: "Library" },
    { id: "Message", label: "Message" },
    { id: "Notice Board", label: "Notice Board" },
    { id: "Gallery", label: "Gallery" },
    { id: "Leave Management", label: "Leave Management" },
];

export const PRINCIPAL_MODULES = [
    ...ADMIN_MODULES,
    { id: "Approve Leaves", label: "Approve Leaves" },
    { id: "Meeting Schedule", label: "Meeting Schedule" },
];

export const COORDINATOR_MODULES = [
    ...STAFF_MODULES,
    { id: "Teacher Management", label: "Teacher Management" },
    { id: "Class Monitoring", label: "Class Monitoring" },
];

export const TEACHERS_MODULES = [
    ...STAFF_MODULES,
    { id: "Classroom Management", label: "Classroom Management" },
    { id: "Lesson Planning", label: "Lesson Planning" },
    { id: "Student Reports", label: "Student Reports" },
];

package com.smarttimetable.service;

import com.smarttimetable.entity.*;
import com.smarttimetable.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class DataInitializerService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private ClassroomRepository classroomRepository;

    @Autowired
    private LaboratoryRepository laboratoryRepository;

    @Autowired
    private SectionRepository sectionRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Autowired
    private FacultyAvailabilityRepository facultyAvailabilityRepository;

    @Autowired
    private AcademicYearRepository academicYearRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private StudentNotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println(">>> INITIALIZING SRI ESHWAR COLLEGE OF ENGINEERING TIME TABLE GENERATOR DEMO DATA...");

        // 1. Create Users
        User adminUser = userRepository.save(new User("shiva25012007", passwordEncoder.encode("shiv2501"), Role.ROLE_ADMIN, "admin@sece.ac.in", true));
        User facultyUser1 = userRepository.save(new User("fkeerj012345", passwordEncoder.encode("keerj012345"), Role.ROLE_FACULTY, "faculty1@sece.ac.in", true));
        User facultyUser2 = userRepository.save(new User("fsarae012345", passwordEncoder.encode("sarae012345"), Role.ROLE_FACULTY, "faculty2@sece.ac.in", true));
        User facultyUser3 = userRepository.save(new User("fmurun012345", passwordEncoder.encode("murun012345"), Role.ROLE_FACULTY, "murugavelli@sece.ac.in", true));
        User facultyUser4 = userRepository.save(new User("fharis012345", passwordEncoder.encode("haris012345"), Role.ROLE_FACULTY, "harikarthick@sece.ac.in", true));
        User facultyUser5 = userRepository.save(new User("fkartm012345", passwordEncoder.encode("kartm012345"), Role.ROLE_FACULTY, "karthickraja@sece.ac.in", true));
        User facultyUser6 = userRepository.save(new User("fsaran012345", passwordEncoder.encode("saran012345"), Role.ROLE_FACULTY, "n.saranya@sece.ac.in", true));
        userRepository.save(new User("smithp012345", passwordEncoder.encode("mithp012345"), Role.ROLE_STUDENT, "student@sece.ac.in", true));

        // 2. Create Academic Year
        AcademicYear acYear = academicYearRepository.save(new AcademicYear("2026-2027", true));

        // 3. Create Departments: CSE, IT, AI & DS, AI & ML, ECE
        Department cseDept = departmentRepository.save(new Department("CSE", "Computer Science & Engineering"));
        Department itDept = departmentRepository.save(new Department("IT", "Information Technology"));
        Department aidsDept = departmentRepository.save(new Department("AI & DS", "Artificial Intelligence & Data Science"));
        Department aimlDept = departmentRepository.save(new Department("AI & ML", "Artificial Intelligence & Machine Learning"));
        Department eceDept = departmentRepository.save(new Department("ECE", "Electronics & Communication Engineering"));

        // 4. Create Courses
        Course cseCourse = courseRepository.save(new Course("BTECH-CSE", "B.E. Computer Science and Engineering", cseDept));
        Course itCourse = courseRepository.save(new Course("BTECH-IT", "B.Tech Information Technology", itDept));
        Course aidsCourse = courseRepository.save(new Course("BTECH-AIDS", "B.Tech AI & Data Science", aidsDept));
        Course aimlCourse = courseRepository.save(new Course("BTECH-AIML", "B.Tech AI & Machine Learning", aimlDept));

        // 5. Create Teachers
        Teacher t1 = teacherRepository.save(new Teacher("EMP_CSE_01", "Karthick", "R", "r.karthick.personal@gmail.com", "r.karthick@sece.ac.in", "9876543210", "", "Design and Analysis of Algorithms", cseDept, facultyUser1));
        t1.setDisplayName("Mr.R.Karthick, AP/CSE");
        teacherRepository.save(t1);
        Teacher t2 = teacherRepository.save(new Teacher("EMP_CSE_02", "Saranya", "E", "saranya.e.personal@gmail.com", "e.saranya@sece.ac.in", "9876543211", "", "Database Management Systems", cseDept, facultyUser2));
        t2.setDisplayName("Ms.E.Saranya, AP/CSE");
        teacherRepository.save(t2);
        Teacher t3 = teacherRepository.save(new Teacher("EMP_MATH_01", "Murugavelli", "N", "muruga.personal@gmail.com", "murugavelli@sece.ac.in", "9876543212", "", "Discrete Mathematics", cseDept, facultyUser3));
        t3.setDisplayName("Dr.N.Murugavelli, AP/Maths");
        teacherRepository.save(t3);
        Teacher t4 = teacherRepository.save(new Teacher("EMP_CSE_03", "Harikarthick", "S.K.", "hari.personal@gmail.com", "harikarthick@sece.ac.in", "9876543213", "", "Software Engineering", cseDept, facultyUser4));
        t4.setDisplayName("Dr.S.K.Harikarthick, ASP/CSE");
        teacherRepository.save(t4);
        Teacher t5 = teacherRepository.save(new Teacher("EMP_CSE_04", "Karthickraja", "M", "karthickraja.personal@gmail.com", "karthickraja@sece.ac.in", "9876543214", "", "Java Programming", cseDept, facultyUser5));
        t5.setDisplayName("Mr.M.Karthickraja, AP/CSE");
        teacherRepository.save(t5);
        Teacher t6 = teacherRepository.save(new Teacher("EMP_CSE_05", "Saranya", "N", "n.saranya.personal@gmail.com", "n.saranya@sece.ac.in", "9876543215", "", "Artificial Intelligence", cseDept, facultyUser6));
        t6.setDisplayName("Dr.N.Saranya, AP/CSE");
        teacherRepository.save(t6);
        Teacher tPlacement = teacherRepository.save(new Teacher("EMP_PLACE_01", "Placement", "Team", "placement@gmail.com", "placement@sece.ac.in", "9876543299", "", "Advanced Logical Thinking", cseDept, null));
        tPlacement.setDisplayName("Placement Team");
        teacherRepository.save(tPlacement);

        // 6. Create Venues / Classrooms & Labs
        Classroom sf04 = classroomRepository.save(new Classroom("SF 04", "Main Academic Block", 61, "THEORY"));
        Classroom sf05 = classroomRepository.save(new Classroom("SF 05", "Main Academic Block", 60, "THEORY"));

        Laboratory labFullStack = laboratoryRepository.save(new Laboratory("Full Stack Lab", "CS Block 2nd Floor", 65, "COMPUTER_LAB"));
        Laboratory labIntelAI = laboratoryRepository.save(new Laboratory("Intel AI Lab", "CS Block 3rd Floor", 65, "COMPUTER_LAB"));
        Laboratory labCloudDevOps = laboratoryRepository.save(new Laboratory("Cloud & DevOps Lab", "CS Block 2nd Floor", 65, "COMPUTER_LAB"));

        // 7. Create Section II CSE C
        Section sec2CseC = sectionRepository.save(new Section("II CSE C", cseCourse, 3, 61));
        Section sec2CseA = sectionRepository.save(new Section("II CSE A", cseCourse, 3, 60));
        Section sec2ItA = sectionRepository.save(new Section("II IT A", itCourse, 3, 60));
        Section sec2AidsA = sectionRepository.save(new Section("II AI&DS A", aidsCourse, 3, 60));
        Section sec2AimlA = sectionRepository.save(new Section("II AI&ML A", aimlCourse, 3, 60));

        // 8. No default students — roster starts empty; Admin/Faculty can add students from the UI.

        // 9. Create Subjects
        Subject subDM = subjectRepository.save(new Subject("U23MA204", "Discrete Mathematics (DM)", cseDept, t3, 3, 4, 4, SubjectType.THEORY));
        Subject subDAA = subjectRepository.save(new Subject("U23CS403", "Design and Analysis of Algorithms (DAA)", cseDept, t1, 3, 3, 4, SubjectType.THEORY));
        Subject subDBMS = subjectRepository.save(new Subject("U23CS404", "Database Management Systems (DBMS)", cseDept, t2, 3, 3, 3, SubjectType.THEORY));
        Subject subSE = subjectRepository.save(new Subject("U23IT481", "Software Engineering (SE)", cseDept, t4, 3, 3, 5, SubjectType.THEORY));
        Subject subJAVA = subjectRepository.save(new Subject("U23CS491", "Java Programming (JAVA)", cseDept, t5, 3, 4, 5, SubjectType.THEORY));
        Subject subAIML = subjectRepository.save(new Subject("U23AM495", "AI & Machine Learning (AIML)", cseDept, t6, 3, 4, 6, SubjectType.THEORY));

        Subject subDAALab = subjectRepository.save(new Subject("U23CS453", "DAA Laboratory", cseDept, t1, 3, 2, 4, SubjectType.LAB));
        Subject subDBMSLab = subjectRepository.save(new Subject("U23CS454", "DBMS Laboratory", cseDept, t2, 3, 1, 2, SubjectType.LAB));
        Subject subSELab = subjectRepository.save(new Subject("U23IT481-LAB", "SE Laboratory", cseDept, t4, 3, 1, 2, SubjectType.LAB));
        Subject subJAVALab = subjectRepository.save(new Subject("U23CS491-LAB", "Java Laboratory", cseDept, t5, 3, 1, 2, SubjectType.LAB));
        Subject subAIMLLab = subjectRepository.save(new Subject("U23AM495-LAB", "AIML Laboratory", cseDept, t6, 3, 1, 2, SubjectType.LAB));

        Subject subALT = subjectRepository.save(new Subject("U23EM753", "Advanced Logical Thinking (ALT) - Placement Team", cseDept, tPlacement, 3, 1, 2, SubjectType.THEORY));
        Subject subSS = subjectRepository.save(new Subject("SS01", "Soft Skills (SS)", cseDept, t1, 3, 1, 1, SubjectType.THEORY));
        Subject subUHV = subjectRepository.save(new Subject("UHV01", "Universal Human Values (UHV)", cseDept, t2, 3, 1, 1, SubjectType.THEORY));
        Subject subLIB = subjectRepository.save(new Subject("LIB01", "Library Hour", cseDept, t1, 3, 0, 1, SubjectType.THEORY));
        Subject subCOE = subjectRepository.save(new Subject("COE01", "Center of Excellence (COE)", cseDept, t1, 3, 0, 2, SubjectType.PROJECT));
        Subject subTWM = subjectRepository.save(new Subject("TWM01", "Teamwork & Management (TWM)", cseDept, t2, 3, 0, 1, SubjectType.THEORY));
        Subject subJavaProj = subjectRepository.save(new Subject("JAVA-PROJ", "Java Project", cseDept, t5, 3, 1, 2, SubjectType.PROJECT));
        Subject subAimlProj = subjectRepository.save(new Subject("AIML-PROJ", "AIML Project", cseDept, t6, 3, 1, 2, SubjectType.PROJECT));

        // 10. Create Exact Time Slots (08:40 AM to 04:10 PM)
        TimeSlot slot1 = timeSlotRepository.save(new TimeSlot(1, "08:40 AM", "09:35 AM"));
        TimeSlot slot2 = timeSlotRepository.save(new TimeSlot(2, "09:35 AM", "10:25 AM"));
        TimeSlot slot3 = timeSlotRepository.save(new TimeSlot(3, "10:25 AM", "11:15 AM"));
        TimeSlot slot4 = timeSlotRepository.save(new TimeSlot(4, "11:35 AM", "12:25 PM"));
        TimeSlot slot5 = timeSlotRepository.save(new TimeSlot(5, "12:25 PM", "01:15 PM"));
        TimeSlot slot6 = timeSlotRepository.save(new TimeSlot(6, "02:30 PM", "03:20 PM"));
        TimeSlot slot7 = timeSlotRepository.save(new TimeSlot(7, "03:20 PM", "04:10 PM"));

        // 11. Create Faculty Availability for 6 Working Days
        List<Teacher> teachers = Arrays.asList(t1, t2, t3, t4, t5, t6, tPlacement);
        List<String> days = Arrays.asList("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
        List<TimeSlot> slots = Arrays.asList(slot1, slot2, slot3, slot4, slot5, slot6, slot7);

        for (Teacher t : teachers) {
            for (String day : days) {
                for (TimeSlot ts : slots) {
                    facultyAvailabilityRepository.save(new FacultyAvailability(t, day, ts, true));
                }
            }
        }

        // 12. Pre-populate Exact Timetable for II CSE C
        String yr = "2026-2027";
        // Monday
        timetableRepository.save(new TimetableEntry("Monday", slot1, subSE, t4, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Monday", slot2, subAIMLLab, t6, null, labIntelAI, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Monday", slot3, subAIMLLab, t6, null, labIntelAI, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Monday", slot4, subJAVA, t5, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Monday", slot5, subDAA, t1, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Monday", slot6, subDM, t3, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Monday", slot7, subSE, t4, sf04, null, sec2CseC, 3, yr));

        // Tuesday
        timetableRepository.save(new TimetableEntry("Tuesday", slot1, subJAVA, t5, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Tuesday", slot2, subDBMS, t2, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Tuesday", slot3, subAIML, t6, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Tuesday", slot4, subJAVALab, t5, null, labFullStack, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Tuesday", slot5, subJAVALab, t5, null, labFullStack, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Tuesday", slot6, subDM, t3, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Tuesday", slot7, subUHV, t2, sf04, null, sec2CseC, 3, yr));

        // Wednesday (Period 4 & 5 ALT - Advanced Logical Thinking by Placement Team, SF 05)
        timetableRepository.save(new TimetableEntry("Wednesday", slot1, subDAA, t1, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Wednesday", slot2, subSELab, t4, null, labIntelAI, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Wednesday", slot3, subSELab, t4, null, labIntelAI, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Wednesday", slot4, subALT, tPlacement, sf05, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Wednesday", slot5, subALT, tPlacement, sf05, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Wednesday", slot6, subCOE, t1, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Wednesday", slot7, subCOE, t1, sf04, null, sec2CseC, 3, yr));

        // Thursday
        timetableRepository.save(new TimetableEntry("Thursday", slot1, subAIML, t6, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Thursday", slot2, subDAALab, t1, null, labFullStack, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Thursday", slot3, subDAALab, t1, null, labFullStack, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Thursday", slot4, subDM, t3, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Thursday", slot5, subSS, t1, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Thursday", slot6, subDBMSLab, t2, null, labCloudDevOps, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Thursday", slot7, subDBMSLab, t2, null, labCloudDevOps, sec2CseC, 3, yr));

        // Friday
        timetableRepository.save(new TimetableEntry("Friday", slot1, subDM, t3, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Friday", slot2, subLIB, t1, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Friday", slot3, subJAVA, t5, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Friday", slot4, subDAALab, t1, null, labFullStack, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Friday", slot5, subDAALab, t1, null, labFullStack, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Friday", slot6, subDM, t3, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Friday", slot7, subDBMS, t2, sf04, null, sec2CseC, 3, yr));

        // Saturday
        timetableRepository.save(new TimetableEntry("Saturday", slot1, subDBMS, t2, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Saturday", slot2, subJavaProj, t5, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Saturday", slot3, subJavaProj, t5, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Saturday", slot4, subDAA, t1, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Saturday", slot5, subTWM, t2, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Saturday", slot6, subAimlProj, t6, sf04, null, sec2CseC, 3, yr));
        timetableRepository.save(new TimetableEntry("Saturday", slot7, subAimlProj, t6, sf04, null, sec2CseC, 3, yr));

        System.out.println(">>> SRI ESHWAR COLLEGE TIME TABLE GENERATOR INITIALIZATION COMPLETED!");
    }
}

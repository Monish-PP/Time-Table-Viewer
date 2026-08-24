package com.smarttimetable.service;

import com.smarttimetable.dto.DashboardStatsDto;
import com.smarttimetable.entity.*;
import com.smarttimetable.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

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
    private DepartmentRepository departmentRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private ConflictService conflictService;

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto dto = new DashboardStatsDto();

        dto.setTotalTeachers(teacherRepository.count());
        dto.setTotalStudents(studentRepository.count());
        dto.setTotalSubjects(subjectRepository.count());
        dto.setTotalClassrooms(classroomRepository.count());
        dto.setTotalLabs(laboratoryRepository.count());
        dto.setTotalSections(sectionRepository.count());

        List<TimetableEntry> entries = timetableRepository.findAll();
        dto.setTimetableGenerated(!entries.isEmpty());

        var conflicts = conflictService.checkConflicts(entries);
        dto.setConflictsCount(conflicts.getTotalConflicts());

        // Students by department
        Map<String, Long> studentDeptMap = new HashMap<>();
        List<Department> departments = departmentRepository.findAll();
        for (Department d : departments) {
            studentDeptMap.put(d.getCode(), (long) studentRepository.findByDepartmentId(d.getId()).size());
        }
        dto.setStudentsByDepartment(studentDeptMap);

        // Faculty Workload (assigned timetable periods)
        Map<String, Long> workloadMap = new HashMap<>();
        List<Teacher> teachers = teacherRepository.findAll();
        for (Teacher t : teachers) {
            workloadMap.put(t.getName(), (long) timetableRepository.findByTeacherId(t.getId()).size());
        }
        dto.setFacultyWorkload(workloadMap);

        // Classroom Utilization (assigned timetable periods)
        Map<String, Long> roomUtilMap = new HashMap<>();
        List<Classroom> classrooms = classroomRepository.findAll();
        for (Classroom c : classrooms) {
            roomUtilMap.put(c.getRoomNumber(), (long) timetableRepository.findByClassroomId(c.getId()).size());
        }
        dto.setClassroomUtilization(roomUtilMap);

        // Subject Type distribution
        Map<String, Long> subjectTypeMap = new HashMap<>();
        List<Subject> subjects = subjectRepository.findAll();
        for (Subject s : subjects) {
            String typeName = s.getType() != null ? s.getType().name() : "THEORY";
            subjectTypeMap.put(typeName, subjectTypeMap.getOrDefault(typeName, 0L) + 1);
        }
        dto.setSubjectTypeDistribution(subjectTypeMap);

        return dto;
    }
}

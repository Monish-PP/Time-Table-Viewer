package com.smarttimetable.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalTeachers;
    private long totalStudents;
    private long totalSubjects;
    private long totalClassrooms;
    private long totalLabs;
    private long totalSections;
    private boolean timetableGenerated;
    private int conflictsCount;
    private Map<String, Long> studentsByDepartment;
    private Map<String, Long> facultyWorkload;
    private Map<String, Long> classroomUtilization;
    private Map<String, Long> subjectTypeDistribution;

    public DashboardStatsDto() {}

    public long getTotalTeachers() { return totalTeachers; }
    public void setTotalTeachers(long totalTeachers) { this.totalTeachers = totalTeachers; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalSubjects() { return totalSubjects; }
    public void setTotalSubjects(long totalSubjects) { this.totalSubjects = totalSubjects; }

    public long getTotalClassrooms() { return totalClassrooms; }
    public void setTotalClassrooms(long totalClassrooms) { this.totalClassrooms = totalClassrooms; }

    public long getTotalLabs() { return totalLabs; }
    public void setTotalLabs(long totalLabs) { this.totalLabs = totalLabs; }

    public long getTotalSections() { return totalSections; }
    public void setTotalSections(long totalSections) { this.totalSections = totalSections; }

    public boolean isTimetableGenerated() { return timetableGenerated; }
    public void setTimetableGenerated(boolean timetableGenerated) { this.timetableGenerated = timetableGenerated; }

    public int getConflictsCount() { return conflictsCount; }
    public void setConflictsCount(int conflictsCount) { this.conflictsCount = conflictsCount; }

    public Map<String, Long> getStudentsByDepartment() { return studentsByDepartment; }
    public void setStudentsByDepartment(Map<String, Long> studentsByDepartment) { this.studentsByDepartment = studentsByDepartment; }

    public Map<String, Long> getFacultyWorkload() { return facultyWorkload; }
    public void setFacultyWorkload(Map<String, Long> facultyWorkload) { this.facultyWorkload = facultyWorkload; }

    public Map<String, Long> getClassroomUtilization() { return classroomUtilization; }
    public void setClassroomUtilization(Map<String, Long> classroomUtilization) { this.classroomUtilization = classroomUtilization; }

    public Map<String, Long> getSubjectTypeDistribution() { return subjectTypeDistribution; }
    public void setSubjectTypeDistribution(Map<String, Long> subjectTypeDistribution) { this.subjectTypeDistribution = subjectTypeDistribution; }
}

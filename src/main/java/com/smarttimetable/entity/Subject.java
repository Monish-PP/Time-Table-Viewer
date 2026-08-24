package com.smarttimetable.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subjects")
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subject_code", unique = true, nullable = false)
    private String subjectCode;

    @Column(name = "subject_name", nullable = false)
    private String subjectName;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_teacher_id")
    private Teacher assignedTeacher;

    private Integer semester;

    private Integer credits = 3;

    @Column(name = "weekly_hours", nullable = false)
    private Integer weeklyHours = 4;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubjectType type = SubjectType.THEORY;

    public Subject() {}

    public Subject(String subjectCode, String subjectName, Department department, Teacher assignedTeacher, Integer semester, Integer credits, Integer weeklyHours, SubjectType type) {
        this.subjectCode = subjectCode;
        this.subjectName = subjectName;
        this.department = department;
        this.assignedTeacher = assignedTeacher;
        this.semester = semester;
        this.credits = credits;
        this.weeklyHours = weeklyHours;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Teacher getAssignedTeacher() { return assignedTeacher; }
    public void setAssignedTeacher(Teacher assignedTeacher) { this.assignedTeacher = assignedTeacher; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public Integer getWeeklyHours() { return weeklyHours; }
    public void setWeeklyHours(Integer weeklyHours) { this.weeklyHours = weeklyHours; }

    public SubjectType getType() { return type; }
    public void setType(SubjectType type) { this.type = type; }
}

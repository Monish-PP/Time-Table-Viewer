package com.smarttimetable.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "timetable_overrides")
public class TimetableOverride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "section_name", nullable = false)
    private String sectionName;

    @Column(name = "day_of_week", nullable = false)
    private String day;

    @Column(name = "period_index", nullable = false)
    private Integer periodIndex;

    @Column(name = "subject_name")
    private String subjectName;

    @Column(name = "faculty_name")
    private String facultyName;

    @Column(name = "venue_name")
    private String venueName;

    @Column(name = "category")
    private String category;

    @Column(name = "subject_code")
    private String subjectCode;

    public TimetableOverride() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public Integer getPeriodIndex() { return periodIndex; }
    public void setPeriodIndex(Integer periodIndex) { this.periodIndex = periodIndex; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getFacultyName() { return facultyName; }
    public void setFacultyName(String facultyName) { this.facultyName = facultyName; }

    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
}

package com.smarttimetable.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "custom_subjects")
public class CustomSubject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "short_name", nullable = false)
    private String shortName;

    @Column(name = "subject_code")
    private String subjectCode;

    @Column(name = "title")
    private String title;

    @Column(name = "faculty")
    private String faculty;

    @Column(name = "category")
    private String category;

    @Column(name = "venue")
    private String venue;

    public CustomSubject() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getShortName() { return shortName; }
    public void setShortName(String shortName) { this.shortName = shortName; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
}

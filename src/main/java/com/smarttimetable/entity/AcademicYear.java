package com.smarttimetable.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "academic_years")
public class AcademicYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "year_name", unique = true, nullable = false)
    private String yearName; // e.g. 2025-2026

    @Column(nullable = false)
    private boolean active = true;

    public AcademicYear() {}

    public AcademicYear(String yearName, boolean active) {
        this.yearName = yearName;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getYearName() { return yearName; }
    public void setYearName(String yearName) { this.yearName = yearName; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}

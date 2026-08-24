package com.smarttimetable.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "substitutions")
public class Substitution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "substitution_date", nullable = false)
    private LocalDate date;

    @Column(name = "section_name", nullable = false)
    private String sectionName;

    @Column(name = "day_of_week", nullable = false)
    private String day;

    @Column(name = "period_index", nullable = false)
    private Integer periodIndex;

    @Column(name = "original_faculty")
    private String originalFaculty;

    @Column(name = "substitute_faculty")
    private String substituteFaculty;

    @Column(name = "reason")
    private String reason;

    @Column(name = "assigned_by")
    private String assignedBy;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    public Substitution() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public Integer getPeriodIndex() { return periodIndex; }
    public void setPeriodIndex(Integer periodIndex) { this.periodIndex = periodIndex; }

    public String getOriginalFaculty() { return originalFaculty; }
    public void setOriginalFaculty(String originalFaculty) { this.originalFaculty = originalFaculty; }

    public String getSubstituteFaculty() { return substituteFaculty; }
    public void setSubstituteFaculty(String substituteFaculty) { this.substituteFaculty = substituteFaculty; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getAssignedBy() { return assignedBy; }
    public void setAssignedBy(String assignedBy) { this.assignedBy = assignedBy; }

    public LocalDateTime getAssignedAt() { return assignedAt; }
    public void setAssignedAt(LocalDateTime assignedAt) { this.assignedAt = assignedAt; }
}

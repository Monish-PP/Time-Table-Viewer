package com.smarttimetable.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "period_notifications")
public class PeriodNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "notification_date", nullable = false)
    private LocalDate date;

    @Column(name = "day_of_week")
    private String day;

    @Column(name = "period_index")
    private Integer periodIndex;

    @Column(name = "section_name")
    private String sectionName;

    @Column(name = "original_faculty")
    private String originalFaculty;

    @Column(name = "staff")
    private String staff;

    @Column(name = "reason")
    private String reason;

    @Column(name = "source")
    private String source;

    public PeriodNotification() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public Integer getPeriodIndex() { return periodIndex; }
    public void setPeriodIndex(Integer periodIndex) { this.periodIndex = periodIndex; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }

    public String getOriginalFaculty() { return originalFaculty; }
    public void setOriginalFaculty(String originalFaculty) { this.originalFaculty = originalFaculty; }

    public String getStaff() { return staff; }
    public void setStaff(String staff) { this.staff = staff; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}

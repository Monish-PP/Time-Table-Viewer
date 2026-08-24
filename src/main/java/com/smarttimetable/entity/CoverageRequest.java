package com.smarttimetable.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "coverage_requests")
public class CoverageRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_date", nullable = false)
    private LocalDate date;

    @Column(name = "section_name", nullable = false)
    private String sectionName;

    @Column(name = "day_of_week", nullable = false)
    private String day;

    @Column(name = "period_index", nullable = false)
    private Integer periodIndex;

    @Column(name = "subject_name")
    private String subjectName;

    @Column(name = "venue_name")
    private String venueName;

    @Column(name = "absent_staff")
    private String absentStaff;

    @Column(name = "reason")
    private String reason;

    @Column(name = "status")
    private String status; // OPEN, REQUESTED, ACCEPTED

    @Column(name = "requested_by")
    private String requestedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "requested_at")
    private LocalDateTime requestedAt;

    @Column(name = "decided_at")
    private LocalDateTime decidedAt;

    @Column(name = "declined_at")
    private LocalDateTime declinedAt;

    public CoverageRequest() {}

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

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getVenueName() { return venueName; }
    public void setVenueName(String venueName) { this.venueName = venueName; }

    public String getAbsentStaff() { return absentStaff; }
    public void setAbsentStaff(String absentStaff) { this.absentStaff = absentStaff; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRequestedBy() { return requestedBy; }
    public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }

    public LocalDateTime getDecidedAt() { return decidedAt; }
    public void setDecidedAt(LocalDateTime decidedAt) { this.decidedAt = decidedAt; }

    public LocalDateTime getDeclinedAt() { return declinedAt; }
    public void setDeclinedAt(LocalDateTime declinedAt) { this.declinedAt = declinedAt; }
}

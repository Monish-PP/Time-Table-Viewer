package com.smarttimetable.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_notifications")
public class StudentNotificationRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private String email;

    private String phone;

    private String userRole = "STUDENT"; // STUDENT or FACULTY

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "section_id")
    private Section section;

    @Column(nullable = false)
    private boolean active = true;

    public StudentNotificationRegistration() {}

    public StudentNotificationRegistration(String studentName, String email, String phone, String userRole, Section section, boolean active) {
        this.studentName = studentName;
        this.email = email;
        this.phone = phone;
        this.userRole = userRole;
        this.section = section;
        this.active = active;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public Section getSection() { return section; }
    public void setSection(Section section) { this.section = section; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}

package com.smarttimetable.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty_availability")
public class FacultyAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(name = "available_day", nullable = false)
    private String day; // Monday, Tuesday, Wednesday, Thursday, Friday

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "time_slot_id", nullable = false)
    private TimeSlot timeSlot;

    @Column(nullable = false)
    private boolean available = true;

    public FacultyAvailability() {}

    public FacultyAvailability(Teacher teacher, String day, TimeSlot timeSlot, boolean available) {
        this.teacher = teacher;
        this.day = day;
        this.timeSlot = timeSlot;
        this.available = available;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Teacher getTeacher() { return teacher; }
    public void setTeacher(Teacher teacher) { this.teacher = teacher; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public TimeSlot getTimeSlot() { return timeSlot; }
    public void setTimeSlot(TimeSlot timeSlot) { this.timeSlot = timeSlot; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}

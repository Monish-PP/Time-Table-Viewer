package com.smarttimetable.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "time_slots")
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "slot_number", nullable = false)
    private Integer slotNumber; // 1, 2, 3, 4, 5, 6

    @Column(name = "start_time", nullable = false)
    private String startTime; // "09:00"

    @Column(name = "end_time", nullable = false)
    private String endTime; // "10:00"

    public TimeSlot() {}

    public TimeSlot(Integer slotNumber, String startTime, String endTime) {
        this.slotNumber = slotNumber;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getSlotNumber() { return slotNumber; }
    public void setSlotNumber(Integer slotNumber) { this.slotNumber = slotNumber; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getSlotLabel() {
        return startTime + " - " + endTime;
    }
}

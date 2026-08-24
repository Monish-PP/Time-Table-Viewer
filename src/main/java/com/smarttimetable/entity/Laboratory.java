package com.smarttimetable.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "laboratories")
public class Laboratory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "lab_name", unique = true, nullable = false)
    private String labName;

    @Column(nullable = false)
    private String building;

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "lab_type")
    private String labType = "COMPUTER_LAB"; // COMPUTER_LAB, HARDWARE_LAB, ELECTRONICS_LAB

    public Laboratory() {}

    public Laboratory(String labName, String building, Integer capacity, String labType) {
        this.labName = labName;
        this.building = building;
        this.capacity = capacity;
        this.labType = labType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLabName() { return labName; }
    public void setLabName(String labName) { this.labName = labName; }

    public String getBuilding() { return building; }
    public void setBuilding(String building) { this.building = building; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getLabType() { return labType; }
    public void setLabType(String labType) { this.labType = labType; }
}

package com.smarttimetable.dto;

public class ConflictDetailDto {
    private String type; // TEACHER_CONFLICT, ROOM_CONFLICT, LAB_CONFLICT, SECTION_CONFLICT, AVAILABILITY_CONFLICT, CAPACITY_CONFLICT
    private String description;
    private String severity; // HIGH, MEDIUM, LOW
    private String teacherName;
    private String roomName;
    private String sectionName;
    private String timeSlotLabel;
    private String day;

    public ConflictDetailDto() {}

    public ConflictDetailDto(String type, String description, String severity, String teacherName, String roomName, String sectionName, String timeSlotLabel, String day) {
        this.type = type;
        this.description = description;
        this.severity = severity;
        this.teacherName = teacherName;
        this.roomName = roomName;
        this.sectionName = sectionName;
        this.timeSlotLabel = timeSlotLabel;
        this.day = day;
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getSectionName() { return sectionName; }
    public void setSectionName(String sectionName) { this.sectionName = sectionName; }

    public String getTimeSlotLabel() { return timeSlotLabel; }
    public void setTimeSlotLabel(String timeSlotLabel) { this.timeSlotLabel = timeSlotLabel; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }
}

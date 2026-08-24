package com.smarttimetable.dto;

import java.util.ArrayList;
import java.util.List;

public class ConflictReportDto {
    private boolean valid;
    private int teacherConflictsCount = 0;
    private int roomConflictsCount = 0;
    private int labConflictsCount = 0;
    private int sectionConflictsCount = 0;
    private int availabilityConflictsCount = 0;
    private int capacityConflictsCount = 0;
    private List<ConflictDetailDto> conflicts = new ArrayList<>();

    public ConflictReportDto() {}

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public int getTeacherConflictsCount() { return teacherConflictsCount; }
    public void setTeacherConflictsCount(int teacherConflictsCount) { this.teacherConflictsCount = teacherConflictsCount; }

    public int getRoomConflictsCount() { return roomConflictsCount; }
    public void setRoomConflictsCount(int roomConflictsCount) { this.roomConflictsCount = roomConflictsCount; }

    public int getLabConflictsCount() { return labConflictsCount; }
    public void setLabConflictsCount(int labConflictsCount) { this.labConflictsCount = labConflictsCount; }

    public int getSectionConflictsCount() { return sectionConflictsCount; }
    public void setSectionConflictsCount(int sectionConflictsCount) { this.sectionConflictsCount = sectionConflictsCount; }

    public int getAvailabilityConflictsCount() { return availabilityConflictsCount; }
    public void setAvailabilityConflictsCount(int availabilityConflictsCount) { this.availabilityConflictsCount = availabilityConflictsCount; }

    public int getCapacityConflictsCount() { return capacityConflictsCount; }
    public void setCapacityConflictsCount(int capacityConflictsCount) { this.capacityConflictsCount = capacityConflictsCount; }

    public List<ConflictDetailDto> getConflicts() { return conflicts; }
    public void setConflicts(List<ConflictDetailDto> conflicts) { this.conflicts = conflicts; }

    public int getTotalConflicts() {
        return teacherConflictsCount + roomConflictsCount + labConflictsCount +
               sectionConflictsCount + availabilityConflictsCount + capacityConflictsCount;
    }
}

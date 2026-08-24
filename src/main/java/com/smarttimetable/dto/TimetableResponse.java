package com.smarttimetable.dto;

import java.util.List;

public class TimetableResponse {
    private boolean success;
    private String message;
    private int totalClasses;
    private int conflictsCount;
    private int roomsUsed;
    private int labsUsed;
    private long executionTimeMs;
    private List<TimetableEntryDto> entries;

    public TimetableResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }

    public int getConflictsCount() { return conflictsCount; }
    public void setConflictsCount(int conflictsCount) { this.conflictsCount = conflictsCount; }

    public int getRoomsUsed() { return roomsUsed; }
    public void setRoomsUsed(int roomsUsed) { this.roomsUsed = roomsUsed; }

    public int getLabsUsed() { return labsUsed; }
    public void setLabsUsed(int labsUsed) { this.labsUsed = labsUsed; }

    public long getExecutionTimeMs() { return executionTimeMs; }
    public void setExecutionTimeMs(long executionTimeMs) { this.executionTimeMs = executionTimeMs; }

    public List<TimetableEntryDto> getEntries() { return entries; }
    public void setEntries(List<TimetableEntryDto> entries) { this.entries = entries; }
}

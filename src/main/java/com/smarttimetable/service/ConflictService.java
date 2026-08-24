package com.smarttimetable.service;

import com.smarttimetable.dto.ConflictDetailDto;
import com.smarttimetable.dto.ConflictReportDto;
import com.smarttimetable.entity.*;
import com.smarttimetable.repository.FacultyAvailabilityRepository;
import com.smarttimetable.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ConflictService {

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private FacultyAvailabilityRepository facultyAvailabilityRepository;

    public ConflictReportDto checkConflicts(List<TimetableEntry> entries) {
        if (entries == null) {
            entries = timetableRepository.findAll();
        }

        ConflictReportDto report = new ConflictReportDto();
        List<ConflictDetailDto> conflictDetails = new ArrayList<>();

        // 1. Teacher Conflict check
        Map<String, List<TimetableEntry>> teacherSlotMap = new HashMap<>();
        // 2. Room Conflict check
        Map<String, List<TimetableEntry>> roomSlotMap = new HashMap<>();
        // 3. Lab Conflict check
        Map<String, List<TimetableEntry>> labSlotMap = new HashMap<>();
        // 4. Section Conflict check
        Map<String, List<TimetableEntry>> sectionSlotMap = new HashMap<>();

        for (TimetableEntry e : entries) {
            String slotKey = e.getDay() + "_" + e.getTimeSlot().getId();

            // Teacher
            if (e.getTeacher() != null) {
                String key = "T_" + e.getTeacher().getId() + "_" + slotKey;
                teacherSlotMap.computeIfAbsent(key, k -> new ArrayList<>()).add(e);
            }

            // Room
            if (e.getClassroom() != null) {
                String key = "R_" + e.getClassroom().getId() + "_" + slotKey;
                roomSlotMap.computeIfAbsent(key, k -> new ArrayList<>()).add(e);
            }

            // Lab
            if (e.getLaboratory() != null) {
                String key = "L_" + e.getLaboratory().getId() + "_" + slotKey;
                labSlotMap.computeIfAbsent(key, k -> new ArrayList<>()).add(e);
            }

            // Section
            if (e.getSection() != null) {
                String key = "S_" + e.getSection().getId() + "_" + slotKey;
                sectionSlotMap.computeIfAbsent(key, k -> new ArrayList<>()).add(e);
            }

            // 5. Faculty Availability Check
            if (e.getTeacher() != null && e.getTimeSlot() != null) {
                Optional<FacultyAvailability> fa = facultyAvailabilityRepository
                        .findByTeacherIdAndDayAndTimeSlotId(e.getTeacher().getId(), e.getDay(), e.getTimeSlot().getId());
                if (fa.isPresent() && !fa.get().isAvailable()) {
                    report.setAvailabilityConflictsCount(report.getAvailabilityConflictsCount() + 1);
                    conflictDetails.add(new ConflictDetailDto(
                            "AVAILABILITY_CONFLICT",
                            "Teacher " + e.getTeacher().getName() + " is marked unavailable on " + e.getDay() + " (" + e.getTimeSlot().getSlotLabel() + ")",
                            "HIGH",
                            e.getTeacher().getName(),
                            e.getClassroom() != null ? e.getClassroom().getRoomNumber() : (e.getLaboratory() != null ? e.getLaboratory().getLabName() : "N/A"),
                            e.getSection().getSectionName(),
                            e.getTimeSlot().getSlotLabel(),
                            e.getDay()
                    ));
                }
            }

            // 6. Capacity Check
            if (e.getSection() != null) {
                int students = e.getSection().getStudentCount();
                if (e.getClassroom() != null && students > e.getClassroom().getCapacity()) {
                    report.setCapacityConflictsCount(report.getCapacityConflictsCount() + 1);
                    conflictDetails.add(new ConflictDetailDto(
                            "CAPACITY_CONFLICT",
                            "Section " + e.getSection().getSectionName() + " (" + students + " students) exceeds Classroom " + e.getClassroom().getRoomNumber() + " capacity (" + e.getClassroom().getCapacity() + ")",
                            "MEDIUM",
                            e.getTeacher().getName(),
                            e.getClassroom().getRoomNumber(),
                            e.getSection().getSectionName(),
                            e.getTimeSlot().getSlotLabel(),
                            e.getDay()
                    ));
                } else if (e.getLaboratory() != null && students > e.getLaboratory().getCapacity()) {
                    report.setCapacityConflictsCount(report.getCapacityConflictsCount() + 1);
                    conflictDetails.add(new ConflictDetailDto(
                            "CAPACITY_CONFLICT",
                            "Section " + e.getSection().getSectionName() + " (" + students + " students) exceeds Lab " + e.getLaboratory().getLabName() + " capacity (" + e.getLaboratory().getCapacity() + ")",
                            "MEDIUM",
                            e.getTeacher().getName(),
                            e.getLaboratory().getLabName(),
                            e.getSection().getSectionName(),
                            e.getTimeSlot().getSlotLabel(),
                            e.getDay()
                    ));
                }
            }
        }

        // Process duplicate Teacher assignments
        for (Map.Entry<String, List<TimetableEntry>> entry : teacherSlotMap.entrySet()) {
            if (entry.getValue().size() > 1) {
                TimetableEntry e1 = entry.getValue().get(0);
                report.setTeacherConflictsCount(report.getTeacherConflictsCount() + (entry.getValue().size() - 1));
                conflictDetails.add(new ConflictDetailDto(
                        "TEACHER_CONFLICT",
                        "Teacher " + e1.getTeacher().getName() + " is assigned to multiple classes simultaneously on " + e1.getDay() + " (" + e1.getTimeSlot().getSlotLabel() + ")",
                        "HIGH",
                        e1.getTeacher().getName(),
                        "N/A",
                        e1.getSection().getSectionName(),
                        e1.getTimeSlot().getSlotLabel(),
                        e1.getDay()
                ));
            }
        }

        // Process duplicate Room assignments
        for (Map.Entry<String, List<TimetableEntry>> entry : roomSlotMap.entrySet()) {
            if (entry.getValue().size() > 1) {
                TimetableEntry e1 = entry.getValue().get(0);
                report.setRoomConflictsCount(report.getRoomConflictsCount() + (entry.getValue().size() - 1));
                conflictDetails.add(new ConflictDetailDto(
                        "ROOM_CONFLICT",
                        "Room " + e1.getClassroom().getRoomNumber() + " is assigned to multiple classes simultaneously on " + e1.getDay() + " (" + e1.getTimeSlot().getSlotLabel() + ")",
                        "HIGH",
                        e1.getTeacher().getName(),
                        e1.getClassroom().getRoomNumber(),
                        e1.getSection().getSectionName(),
                        e1.getTimeSlot().getSlotLabel(),
                        e1.getDay()
                ));
            }
        }

        // Process duplicate Lab assignments
        for (Map.Entry<String, List<TimetableEntry>> entry : labSlotMap.entrySet()) {
            if (entry.getValue().size() > 1) {
                TimetableEntry e1 = entry.getValue().get(0);
                report.setLabConflictsCount(report.getLabConflictsCount() + (entry.getValue().size() - 1));
                conflictDetails.add(new ConflictDetailDto(
                        "LAB_CONFLICT",
                        "Laboratory " + e1.getLaboratory().getLabName() + " is assigned to multiple classes simultaneously on " + e1.getDay() + " (" + e1.getTimeSlot().getSlotLabel() + ")",
                        "HIGH",
                        e1.getTeacher().getName(),
                        e1.getLaboratory().getLabName(),
                        e1.getSection().getSectionName(),
                        e1.getTimeSlot().getSlotLabel(),
                        e1.getDay()
                ));
            }
        }

        // Process duplicate Section assignments
        for (Map.Entry<String, List<TimetableEntry>> entry : sectionSlotMap.entrySet()) {
            if (entry.getValue().size() > 1) {
                TimetableEntry e1 = entry.getValue().get(0);
                report.setSectionConflictsCount(report.getSectionConflictsCount() + (entry.getValue().size() - 1));
                conflictDetails.add(new ConflictDetailDto(
                        "SECTION_CONFLICT",
                        "Section " + e1.getSection().getSectionName() + " is scheduled for multiple subjects simultaneously on " + e1.getDay() + " (" + e1.getTimeSlot().getSlotLabel() + ")",
                        "HIGH",
                        e1.getTeacher().getName(),
                        "N/A",
                        e1.getSection().getSectionName(),
                        e1.getTimeSlot().getSlotLabel(),
                        e1.getDay()
                ));
            }
        }

        report.setConflicts(conflictDetails);
        report.setValid(conflictDetails.isEmpty());
        return report;
    }
}

package com.smarttimetable.repository;

import com.smarttimetable.entity.TimetableEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<TimetableEntry, Long> {
    List<TimetableEntry> findBySectionId(Long sectionId);
    List<TimetableEntry> findByTeacherId(Long teacherId);
    List<TimetableEntry> findByClassroomId(Long classroomId);
    List<TimetableEntry> findByLaboratoryId(Long laboratoryId);
    List<TimetableEntry> findBySemester(Integer semester);

    List<TimetableEntry> findByDayAndTimeSlotId(String day, Long timeSlotId);
    List<TimetableEntry> findByTeacherIdAndDayAndTimeSlotId(Long teacherId, String day, Long timeSlotId);
    List<TimetableEntry> findByClassroomIdAndDayAndTimeSlotId(Long classroomId, String day, Long timeSlotId);
    List<TimetableEntry> findByLaboratoryIdAndDayAndTimeSlotId(Long laboratoryId, String day, Long timeSlotId);
    List<TimetableEntry> findBySectionIdAndDayAndTimeSlotId(Long sectionId, String day, Long timeSlotId);

    void deleteByAcademicYear(String academicYear);
    void deleteBySectionId(Long sectionId);
}

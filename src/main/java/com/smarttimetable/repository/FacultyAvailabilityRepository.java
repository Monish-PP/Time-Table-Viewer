package com.smarttimetable.repository;

import com.smarttimetable.entity.FacultyAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyAvailabilityRepository extends JpaRepository<FacultyAvailability, Long> {
    List<FacultyAvailability> findByTeacherId(Long teacherId);
    Optional<FacultyAvailability> findByTeacherIdAndDayAndTimeSlotId(Long teacherId, String day, Long timeSlotId);
}

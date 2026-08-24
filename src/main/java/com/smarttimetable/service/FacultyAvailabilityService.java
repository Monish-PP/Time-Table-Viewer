package com.smarttimetable.service;

import com.smarttimetable.entity.FacultyAvailability;
import com.smarttimetable.repository.FacultyAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyAvailabilityService {

    @Autowired
    private FacultyAvailabilityRepository facultyAvailabilityRepository;

    public List<FacultyAvailability> getAllAvailabilities() {
        return facultyAvailabilityRepository.findAll();
    }

    public List<FacultyAvailability> getByTeacherId(Long teacherId) {
        return facultyAvailabilityRepository.findByTeacherId(teacherId);
    }

    public FacultyAvailability updateAvailability(Long teacherId, String day, Long timeSlotId, boolean available) {
        Optional<FacultyAvailability> opt = facultyAvailabilityRepository
                .findByTeacherIdAndDayAndTimeSlotId(teacherId, day, timeSlotId);
        FacultyAvailability fa;
        if (opt.isPresent()) {
            fa = opt.get();
            fa.setAvailable(available);
        } else {
            fa = new FacultyAvailability();
            // set defaults if creating new
            fa.setAvailable(available);
            fa.setDay(day);
        }
        return facultyAvailabilityRepository.save(fa);
    }
}

package com.smarttimetable.service;

import com.smarttimetable.entity.Section;
import com.smarttimetable.entity.StudentNotificationRegistration;
import com.smarttimetable.repository.SectionRepository;
import com.smarttimetable.repository.StudentNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private StudentNotificationRepository notificationRepository;

    @Autowired
    private SectionRepository sectionRepository;

    public StudentNotificationRegistration registerEmailOrPhone(String name, String email, String phone, String role, Long sectionId) {
        Section section = null;
        if (sectionId != null) {
            section = sectionRepository.findById(sectionId).orElse(null);
        }

        StudentNotificationRegistration registration = new StudentNotificationRegistration(name, email, phone, role, section, true);
        return notificationRepository.save(registration);
    }

    public List<StudentNotificationRegistration> getRegistrationsBySection(Long sectionId) {
        return notificationRepository.findBySectionId(sectionId);
    }

    public Map<String, Object> sendSmsNotification(Long sectionId, String subjectName, String day, String timeSlotLabel, String message) {
        List<StudentNotificationRegistration> subscribers = notificationRepository.findAll();
        if (sectionId != null) {
            subscribers = notificationRepository.findBySectionId(sectionId);
        }

        Section section = sectionId != null ? sectionRepository.findById(sectionId).orElse(null) : null;

        Map<String, Object> result = new HashMap<>();
        result.put("sectionName", section != null ? section.getSectionName() : "All Sections");
        result.put("subjectName", subjectName);
        result.put("day", day);
        result.put("timeSlot", timeSlotLabel);
        result.put("totalSmsRecipients", subscribers.size());
        result.put("message", message);
        result.put("status", "SUCCESS");

        System.out.println("==================================================");
        System.out.println("📱 SMS PERIOD NOTIFICATION BROADCAST (SRI ESHWAR COLLEGE)");
        System.out.println("Section: " + (section != null ? section.getSectionName() : "All Sections"));
        System.out.println("Subject/Period: " + subjectName + " | " + day + " (" + timeSlotLabel + ")");
        System.out.println("SMS Message: " + message);
        System.out.println("Phone Recipients (" + subscribers.size() + "):");
        for (StudentNotificationRegistration s : subscribers) {
            if (s.getPhone() != null && !s.getPhone().isEmpty()) {
                System.out.println("  - Sending SMS to Phone: " + s.getPhone() + " (" + s.getStudentName() + " - " + s.getUserRole() + ")");
            } else {
                System.out.println("  - Sending Email to: " + s.getEmail() + " (" + s.getStudentName() + ")");
            }
        }
        System.out.println("==================================================");

        return result;
    }
}

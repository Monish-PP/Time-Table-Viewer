package com.smarttimetable.repository;

import com.smarttimetable.entity.StudentNotificationRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentNotificationRepository extends JpaRepository<StudentNotificationRegistration, Long> {
    List<StudentNotificationRegistration> findBySectionId(Long sectionId);
    List<StudentNotificationRegistration> findByEmail(String email);
}

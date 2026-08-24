package com.smarttimetable.repository;

import com.smarttimetable.entity.PeriodNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PeriodNotificationRepository extends JpaRepository<PeriodNotification, Long> {
    List<PeriodNotification> findByDate(LocalDate date);
}

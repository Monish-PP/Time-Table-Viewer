package com.smarttimetable.repository;

import com.smarttimetable.entity.TimetableOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableOverrideRepository extends JpaRepository<TimetableOverride, Long> {
    List<TimetableOverride> findBySectionName(String sectionName);
}

package com.smarttimetable.repository;

import com.smarttimetable.entity.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
    List<Section> findByCourseId(Long courseId);
    List<Section> findByCourseIdAndSemester(Long courseId, Integer semester);
    java.util.Optional<Section> findBySectionName(String sectionName);
}

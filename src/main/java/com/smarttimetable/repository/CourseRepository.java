package com.smarttimetable.repository;

import com.smarttimetable.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByDepartmentId(Long departmentId);
    java.util.Optional<Course> findByName(String name);
    java.util.Optional<Course> findByCode(String code);
}

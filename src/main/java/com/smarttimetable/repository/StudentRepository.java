package com.smarttimetable.repository;

import com.smarttimetable.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRegisterNumber(String registerNumber);
    Optional<Student> findByUserId(Long userId);
    List<Student> findBySectionId(Long sectionId);
    long countBySectionId(Long sectionId);
    List<Student> findByDepartmentId(Long departmentId);
}

package com.smarttimetable.repository;

import com.smarttimetable.entity.CoverageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CoverageRequestRepository extends JpaRepository<CoverageRequest, Long> {
    List<CoverageRequest> findByDate(LocalDate date);
    List<CoverageRequest> findByAbsentStaff(String absentStaff);
}

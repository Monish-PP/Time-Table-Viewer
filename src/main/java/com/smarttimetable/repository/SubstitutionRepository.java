package com.smarttimetable.repository;

import com.smarttimetable.entity.Substitution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubstitutionRepository extends JpaRepository<Substitution, Long> {
    List<Substitution> findByDate(LocalDate date);
    List<Substitution> findByDateAndSectionName(LocalDate date, String sectionName);
}

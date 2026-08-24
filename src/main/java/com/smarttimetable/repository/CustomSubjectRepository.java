package com.smarttimetable.repository;

import com.smarttimetable.entity.CustomSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomSubjectRepository extends JpaRepository<CustomSubject, Long> {
}

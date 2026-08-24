package com.smarttimetable.repository;

import com.smarttimetable.entity.CustomVenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomVenueRepository extends JpaRepository<CustomVenue, Long> {
}

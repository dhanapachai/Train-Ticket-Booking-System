package com.trainbooking.repository;

import com.trainbooking.model.Train;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TrainRepository extends JpaRepository<Train, Long> {

    @Query("""
        SELECT t FROM Train t
        WHERE (:source IS NULL OR LOWER(t.source) LIKE LOWER(CONCAT('%', :source, '%')))
          AND (:destination IS NULL OR LOWER(t.destination) LIKE LOWER(CONCAT('%', :destination, '%')))
          AND (:journeyDate IS NULL OR t.journeyDate = :journeyDate)
    """)
    List<Train> searchTrains(
        @Param("source") String source,
        @Param("destination") String destination,
        @Param("journeyDate") LocalDate journeyDate
    );
}

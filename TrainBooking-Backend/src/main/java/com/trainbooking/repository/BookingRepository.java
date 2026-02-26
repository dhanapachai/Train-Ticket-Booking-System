package com.trainbooking.repository;

import com.trainbooking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.trainClass.id = :classId AND b.status = 'WAITING'")
    int countWaiting(@Param("classId") Long classId);

    @Query("""
        SELECT b FROM Booking b
        WHERE b.trainClass.id = :classId AND b.status = 'WAITING'
        ORDER BY b.waitingNumber ASC
    """)
    List<Booking> findWaitingByClassOrderByNumber(@Param("classId") Long classId);
}

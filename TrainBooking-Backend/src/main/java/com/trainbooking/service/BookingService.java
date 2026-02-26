package com.trainbooking.service;

import com.trainbooking.dto.BookingStatsDTO;
import com.trainbooking.model.*;
import com.trainbooking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepo;
    private final TrainClassRepository trainClassRepo;
    private final UserRepository userRepo;

    // ── Book a ticket ──────────────────────────────────────────────────────
    @Transactional
    public Booking bookTicket(Long trainClassId, String passengerName, int passengerAge, Long userId) {
        TrainClass tc = trainClassRepo.findById(trainClassId)
                .orElseThrow(() -> new RuntimeException("Train class not found: " + trainClassId));

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        int available = tc.getTotalSeats() - tc.getBookedSeats();

        Booking booking = Booking.builder()
                .user(user)
                .trainClass(tc)
                .passengerName(passengerName)
                .passengerAge(passengerAge)
                .build();

        if (available > 0) {
            int seatNum = tc.getBookedSeats() + 1;
            booking.setSeatNumber(tc.getClassType().name() + "-" + seatNum);
            booking.setStatus(Booking.BookingStatus.CONFIRMED);
            tc.setBookedSeats(tc.getBookedSeats() + 1);
            trainClassRepo.save(tc);
        } else {
            int waitingCount = bookingRepo.countWaiting(trainClassId);
            int waitingLimit = tc.getTrain().getWaitingLimit();
            if (waitingCount < waitingLimit) {
                booking.setStatus(Booking.BookingStatus.WAITING);
                booking.setWaitingNumber(waitingCount + 1);
            } else {
                throw new RuntimeException("No seats available. Waiting list is full.");
            }
        }

        return bookingRepo.save(booking);
    }

    // ── Get my bookings ────────────────────────────────────────────────────
    public List<Booking> getMyBookings(Long userId) {
        return bookingRepo.findByUserIdOrderByBookedAtDesc(userId);
    }

    // ── Get all bookings (admin) ───────────────────────────────────────────
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    // ── Cancel a booking (auto-promotes first waiting) ─────────────────────
    @Transactional
    public Booking cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (!booking.getUser().getId().equals(userId))
            throw new RuntimeException("Unauthorized: booking does not belong to this user.");

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED)
            throw new RuntimeException("Booking is already cancelled.");

        boolean wasConfirmed = booking.getStatus() == Booking.BookingStatus.CONFIRMED;
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepo.save(booking);

        if (wasConfirmed) {
            TrainClass tc = booking.getTrainClass();
            tc.setBookedSeats(tc.getBookedSeats() - 1);
            trainClassRepo.save(tc);

            List<Booking> waiting = bookingRepo.findWaitingByClassOrderByNumber(tc.getId());
            if (!waiting.isEmpty()) {
                Booking promoted = waiting.get(0);
                int newSeat = tc.getBookedSeats() + 1;
                promoted.setSeatNumber(tc.getClassType().name() + "-" + newSeat);
                promoted.setStatus(Booking.BookingStatus.CONFIRMED);
                promoted.setWaitingNumber(null);
                bookingRepo.save(promoted);
                tc.setBookedSeats(newSeat);
                trainClassRepo.save(tc);
            }
        }

        return booking;
    }

    // ── Booking stats for admin ── @Transactional fixes LazyInit ──────────
    @Transactional(readOnly = true)
    public List<BookingStatsDTO> getBookingStats() {
        return trainClassRepo.findAll().stream().map(tc -> new BookingStatsDTO(
                tc.getTrain().getTrainName(),
                tc.getTrain().getTrainNumber(),
                tc.getClassType().name(),
                tc.getTotalSeats(),
                tc.getBookedSeats(),
                tc.getTotalSeats() - tc.getBookedSeats(),
                bookingRepo.countWaiting(tc.getId())
        )).toList();
    }
}

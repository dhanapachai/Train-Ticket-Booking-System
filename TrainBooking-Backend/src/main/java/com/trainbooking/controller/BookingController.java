package com.trainbooking.controller;

import com.trainbooking.dto.BookingStatsDTO;
import com.trainbooking.model.Booking;
import com.trainbooking.model.User;
import com.trainbooking.repository.UserRepository;
import com.trainbooking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepo;

    private Long getCurrentUserId(Authentication auth) {
        User user = userRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    // POST /api/bookings
    @PostMapping("/bookings")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> bookTicket(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            Long userId = getCurrentUserId(auth);
            Long trainClassId = Long.valueOf(body.get("trainClassId").toString());
            String passengerName = (String) body.get("passengerName");
            int passengerAge = Integer.parseInt(body.get("passengerAge").toString());
            Booking booking = bookingService.bookTicket(trainClassId, passengerName, passengerAge, userId);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/bookings/my
    @GetMapping("/bookings/my")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication auth) {
        return ResponseEntity.ok(bookingService.getMyBookings(getCurrentUserId(auth)));
    }

    // DELETE /api/bookings/{id}
    @DeleteMapping("/bookings/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication auth) {
        try {
            Booking booking = bookingService.cancelBooking(id, getCurrentUserId(auth));
            return ResponseEntity.ok(Map.of("message", "Booking cancelled.", "bookingId", booking.getId(), "status", booking.getStatus()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/admin/bookings
    @GetMapping("/admin/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET /api/admin/bookings/stats
    @GetMapping("/admin/bookings/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingStatsDTO>> getBookingStats() {
        return ResponseEntity.ok(bookingService.getBookingStats());
    }
}

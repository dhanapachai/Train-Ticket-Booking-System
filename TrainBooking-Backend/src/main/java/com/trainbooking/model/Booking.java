package com.trainbooking.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "createdAt"})
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "train_class_id", nullable = false)
    @JsonIgnoreProperties({"train"})
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private TrainClass trainClass;

    @Column(name = "seat_number", length = 10)
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(name = "waiting_number")
    private Integer waitingNumber;

    @Column(name = "passenger_name", nullable = false, length = 100)
    private String passengerName;

    @Column(name = "passenger_age", nullable = false)
    private int passengerAge;

    @Column(name = "booked_at")
    private LocalDateTime bookedAt = LocalDateTime.now();

    public enum BookingStatus { CONFIRMED, WAITING, CANCELLED }
}

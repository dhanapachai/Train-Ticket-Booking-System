package com.trainbooking.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "trains")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Train {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "train_name", nullable = false, length = 100)
    private String trainName;

    @Column(name = "train_number", unique = true, nullable = false, length = 20)
    private String trainNumber;

    @Column(nullable = false, length = 100)
    private String source;

    @Column(nullable = false, length = 100)
    private String destination;

    @Column(name = "departure_time", nullable = false)
    private LocalTime departureTime;

    @Column(name = "arrival_time", nullable = false)
    private LocalTime arrivalTime;

    @Column(name = "journey_date", nullable = false)
    private LocalDate journeyDate;

    @Column(name = "total_seats", nullable = false)
    private int totalSeats;

    @Column(name = "waiting_limit")
    private int waitingLimit = 10;

    // EAGER so classes load with train in search results (avoids LazyInit)
    @OneToMany(mappedBy = "train", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonManagedReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<TrainClass> classes;
}

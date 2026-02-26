package com.trainbooking.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "train_classes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "train_id", nullable = false)
    @JsonBackReference
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Train train;

    @Enumerated(EnumType.STRING)
    @Column(name = "class_type", nullable = false)
    private ClassType classType;

    @Column(name = "total_seats", nullable = false)
    private int totalSeats;

    @Column(name = "booked_seats")
    private int bookedSeats = 0;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal price;

    public enum ClassType { UPPER, LOWER, MIDDLE }
}

package com.trainbooking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingStatsDTO {
    private String trainName;
    private String trainNumber;
    private String classType;
    private int totalSeats;
    private int bookedSeats;
    private int availableSeats;
    private long waitingCount;
}

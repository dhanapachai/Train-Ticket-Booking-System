package com.trainbooking.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class TrainRequest {
    @NotBlank private String trainName;
    @NotBlank private String trainNumber;
    @NotBlank private String source;
    @NotBlank private String destination;
    @NotNull  private LocalTime departureTime;
    @NotNull  private LocalTime arrivalTime;
    @NotNull  private LocalDate journeyDate;
    @Min(1)   private int totalSeats;
    private int waitingLimit = 10;
    @NotEmpty private List<TrainClassRequest> classes;
}

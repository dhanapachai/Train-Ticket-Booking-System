package com.trainbooking.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BookingRequest {
    @NotNull  private Long trainClassId;
    @NotBlank private String passengerName;
    @Min(1) @Max(120) private int passengerAge;
}

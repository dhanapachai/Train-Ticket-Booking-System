package com.trainbooking.dto;

import com.trainbooking.model.TrainClass;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TrainClassRequest {
    @NotNull
    private TrainClass.ClassType classType;
    @Min(1)
    private int totalSeats;
    @NotNull @DecimalMin("0.01")
    private BigDecimal price;
}

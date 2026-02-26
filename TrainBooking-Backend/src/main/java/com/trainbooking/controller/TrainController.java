package com.trainbooking.controller;

import com.trainbooking.model.Train;
import com.trainbooking.service.TrainService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TrainController {

    private final TrainService trainService;

    // ── Safe type converter: String/Integer/Double → int ──────────────────
    private int toInt(Object val, int defaultVal) {
        if (val == null) return defaultVal;
        if (val instanceof Integer) return (Integer) val;
        if (val instanceof Number)  return ((Number) val).intValue();
        try { return Integer.parseInt(val.toString().trim()); }
        catch (NumberFormatException e) { return defaultVal; }
    }

    // ── Public ─────────────────────────────────────────────────────────────

    @GetMapping("/trains/search")
    public ResponseEntity<List<Train>> searchTrains(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate journeyDate) {
        return ResponseEntity.ok(trainService.searchTrains(source, destination, journeyDate));
    }

    @GetMapping("/trains/{id}/availability")
    public ResponseEntity<Map<String, Object>> getAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(trainService.getAvailability(id));
    }

    // ── Admin ──────────────────────────────────────────────────────────────

    @GetMapping("/admin/trains")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Train>> getAllTrains() {
        return ResponseEntity.ok(trainService.getAllTrains());
    }

    @PostMapping("/admin/trains")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addTrain(@RequestBody Map<String, Object> body) {
        try {
            Train train = Train.builder()
                    .trainName((String) body.get("trainName"))
                    .trainNumber((String) body.get("trainNumber"))
                    .source((String) body.get("source"))
                    .destination((String) body.get("destination"))
                    .departureTime(LocalTime.parse((String) body.get("departureTime")))
                    .arrivalTime(LocalTime.parse((String) body.get("arrivalTime")))
                    .journeyDate(LocalDate.parse((String) body.get("journeyDate")))
                    .totalSeats(toInt(body.get("totalSeats"), 0))
                    .waitingLimit(toInt(body.get("waitingLimit"), 10))
                    .build();

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> classes = (List<Map<String, Object>>) body.get("classes");

            Train saved = trainService.addTrain(train, classes);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/admin/trains/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTrain(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        try {
            Train updated = Train.builder()
                    .trainName((String) body.get("trainName"))
                    .trainNumber((String) body.get("trainNumber"))
                    .source((String) body.get("source"))
                    .destination((String) body.get("destination"))
                    .departureTime(LocalTime.parse((String) body.get("departureTime")))
                    .arrivalTime(LocalTime.parse((String) body.get("arrivalTime")))
                    .journeyDate(LocalDate.parse((String) body.get("journeyDate")))
                    .totalSeats(toInt(body.get("totalSeats"), 0))
                    .waitingLimit(toInt(body.get("waitingLimit"), 10))
                    .build();

            return ResponseEntity.ok(trainService.updateTrain(id, updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/admin/trains/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTrain(@PathVariable Long id) {
        try {
            trainService.deleteTrain(id);
            return ResponseEntity.ok(Map.of("message", "Train deleted successfully."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
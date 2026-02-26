package com.trainbooking.service;

import com.trainbooking.model.Train;
import com.trainbooking.model.TrainClass;
import com.trainbooking.repository.TrainClassRepository;
import com.trainbooking.repository.TrainRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TrainService {

    private final TrainRepository trainRepo;
    private final TrainClassRepository trainClassRepo;

    // ── Safe converter: handles String "60", Integer 60, Double 60.0 ──────
    private int toInt(Object val) {
        if (val == null) return 0;
        if (val instanceof Integer) return (Integer) val;
        if (val instanceof Number)  return ((Number) val).intValue();
        try { return Integer.parseInt(val.toString().trim()); }
        catch (NumberFormatException e) { return 0; }
    }

    // ── Search trains ──────────────────────────────────────────────────────
    public List<Train> searchTrains(String source, String destination, LocalDate journeyDate) {
        return trainRepo.searchTrains(source, destination, journeyDate);
    }

    // ── Get train by ID ────────────────────────────────────────────────────
    public Train getTrainById(Long id) {
        return trainRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Train not found: " + id));
    }

    // ── Get all trains ─────────────────────────────────────────────────────
    public List<Train> getAllTrains() {
        return trainRepo.findAll();
    }

    // ── Add train with classes ─────────────────────────────────────────────
    @Transactional
    public Train addTrain(Train train, List<Map<String, Object>> classesData) {
        Train saved = trainRepo.save(train);

        if (classesData != null) {
            for (Map<String, Object> cd : classesData) {
                TrainClass tc = new TrainClass();
                tc.setTrain(saved);
                tc.setClassType(TrainClass.ClassType.valueOf((String) cd.get("classType")));
                tc.setTotalSeats(toInt(cd.get("totalSeats")));   // safe: "60" or 60
                tc.setBookedSeats(0);
                tc.setPrice(new BigDecimal(cd.get("price").toString().trim())); // safe: "1800" or 1800
                trainClassRepo.save(tc);
            }
        }

        return trainRepo.findById(saved.getId()).orElse(saved); // reload with classes
    }

    // ── Update train ───────────────────────────────────────────────────────
    @Transactional
    public Train updateTrain(Long id, Train updatedTrain) {
        Train existing = getTrainById(id);
        existing.setTrainName(updatedTrain.getTrainName());
        existing.setTrainNumber(updatedTrain.getTrainNumber());
        existing.setSource(updatedTrain.getSource());
        existing.setDestination(updatedTrain.getDestination());
        existing.setDepartureTime(updatedTrain.getDepartureTime());
        existing.setArrivalTime(updatedTrain.getArrivalTime());
        existing.setJourneyDate(updatedTrain.getJourneyDate());
        existing.setTotalSeats(updatedTrain.getTotalSeats());
        existing.setWaitingLimit(updatedTrain.getWaitingLimit());
        return trainRepo.save(existing);
    }

    // ── Delete train ───────────────────────────────────────────────────────
    @Transactional
    public void deleteTrain(Long id) {
        if (!trainRepo.existsById(id))
            throw new RuntimeException("Train not found: " + id);
        trainRepo.deleteById(id);
    }

    // ── Get availability ───────────────────────────────────────────────────
    public Map<String, Object> getAvailability(Long trainId) {
        Train train = getTrainById(trainId);
        List<TrainClass> classes = trainClassRepo.findByTrainId(trainId);
        return Map.of("train", train, "classes", classes);
    }
}
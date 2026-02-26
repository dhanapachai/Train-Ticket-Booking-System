package com.trainbooking.repository;

import com.trainbooking.model.TrainClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainClassRepository extends JpaRepository<TrainClass, Long> {
    List<TrainClass> findByTrainId(Long trainId);
}

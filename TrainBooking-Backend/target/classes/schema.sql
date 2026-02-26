-- ── Create & use database ──────────────────────────────────────────────────
CREATE DATABASE IF NOT EXISTS train_booking;
USE train_booking;

-- ── Users ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('USER','ADMIN') DEFAULT 'USER',
    created_at DATETIME     DEFAULT NOW()
);

-- ── Trains ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS trains (
    id             BIGINT       AUTO_INCREMENT PRIMARY KEY,
    train_name     VARCHAR(100) NOT NULL,
    train_number   VARCHAR(20)  UNIQUE NOT NULL,
    source         VARCHAR(100) NOT NULL,
    destination    VARCHAR(100) NOT NULL,
    departure_time TIME         NOT NULL,
    arrival_time   TIME         NOT NULL,
    journey_date   DATE         NOT NULL,
    total_seats    INT          NOT NULL,
    waiting_limit  INT          DEFAULT 10
);

-- ── Train Classes ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS train_classes (
    id           BIGINT          AUTO_INCREMENT PRIMARY KEY,
    train_id     BIGINT          NOT NULL,
    class_type   ENUM('UPPER','LOWER','MIDDLE') NOT NULL,
    total_seats  INT             NOT NULL,
    booked_seats INT             DEFAULT 0,
    price        DECIMAL(8,2)    NOT NULL,
    FOREIGN KEY (train_id) REFERENCES trains(id) ON DELETE CASCADE
);

-- ── Bookings ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
    id              BIGINT       AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT       NOT NULL,
    train_class_id  BIGINT       NOT NULL,
    seat_number     VARCHAR(10),
    status          ENUM('CONFIRMED','WAITING','CANCELLED') DEFAULT 'CONFIRMED',
    waiting_number  INT,
    passenger_name  VARCHAR(100) NOT NULL,
    passenger_age   INT          NOT NULL,
    booked_at       DATETIME     DEFAULT NOW(),
    FOREIGN KEY (user_id)        REFERENCES users(id),
    FOREIGN KEY (train_class_id) REFERENCES train_classes(id)
);

-- ── Admin user is created automatically by DataInitializer.java on startup ──
-- ── Spring Boot BCryptPasswordEncoder handles the hashing correctly       ──
-- ── Credentials: admin@train.com / admin123                                ──

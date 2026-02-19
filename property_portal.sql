-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 19, 2026 at 05:10 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `property_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `property_name` varchar(255) NOT NULL,
  `property_type` enum('House','Apartment','Commercial') NOT NULL,
  `address` varchar(255) NOT NULL,
  `purchase_date` date NOT NULL,
  `property_image` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `property_name`, `property_type`, `address`, `purchase_date`, `property_image`, `created_at`, `user_id`) VALUES
(2, 'My Beautiful House', 'Apartment', '123 Main St, Springfield', '2024-10-20', '/uploads/1730553160439.png', '2024-11-02 13:12:40', 2),
(3, 'My Beautiful House', 'Commercial', 'Vadodara Gujarat ', '2024-11-02', '/uploads/1730553556283.png', '2024-11-02 13:19:16', 1);

-- --------------------------------------------------------

--
-- Table structure for table `property_maintenance`
--

CREATE TABLE `property_maintenance` (
  `id` int(11) NOT NULL,
  `property_id` int(11) DEFAULT NULL,
  `service_type` varchar(255) DEFAULT NULL,
  `service_date` date DEFAULT NULL,
  `cost` decimal(10,2) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `property_maintenance`
--

INSERT INTO `property_maintenance` (`id`, `property_id`, `service_type`, `service_date`, `cost`, `user_id`) VALUES
(2, 2, 'Electrical', '2024-11-05', 2000.00, 2),
(3, 3, 'Landscaping', '2024-11-08', 3200.00, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'Dhruti Patel ', 'dhruti@gmail.com', '$2a$10$3A68SNiQYXJcUJBOBZY9NuwOvIv8tgPPQ8eHWoRj4z6bmXPjDfguq'),
(2, 'Parth', 'yadav@gmail.com', '$2a$10$yRlNyUi0Ge5ZU3e2T6RLzO.5ZhfBUeOqg4W2YvgheqRf3os5Zlqjq');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `property_maintenance`
--
ALTER TABLE `property_maintenance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `property_id` (`property_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `property_maintenance`
--
ALTER TABLE `property_maintenance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `property_maintenance`
--
ALTER TABLE `property_maintenance`
  ADD CONSTRAINT `property_maintenance_ibfk_1` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

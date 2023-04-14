-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 14, 2023 at 09:38 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `selab`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `isbn` int(11) NOT NULL,
  `title` varchar(75) NOT NULL,
  `category` varchar(75) NOT NULL,
  `author` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`isbn`, `title`, `category`, `author`) VALUES
(316015849, 'Twilight', 'Romance', 'Stephenie Meyer'),
(375826688, 'Eragon', 'Fantasy', 'Christopher Paolini'),
(439023521, 'The Hunger Games', 'Young Adult', 'Suzanne Collings'),
(439708184, 'Harry Potter and the Sorcerer\'s Stone', 'Children\'s', 'J.K. Rowling'),
(618260307, 'The Hobbit', 'Fantasy', 'J.R.R. Tolkien'),
(756966035, 'The Lightning Thief', 'Children\'s', 'Rick Riordan'),
(901720313, 'Watership Down', 'Fantasy', 'Richard Adams'),
(1420961357, 'Heidi', 'Children\'s', 'Johanna Spyri'),
(1540041840, 'The Bridges of Madison County', 'Romance', 'Robert James Walker');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`isbn`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

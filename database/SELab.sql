-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 10, 2023 at 03:50 AM
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
-- Database: `SELab`
--

-- --------------------------------------------------------

--
-- Table structure for table `Books`
--

CREATE TABLE `Books` (
  `isbn` int(11) NOT NULL,
  `title` varchar(75) NOT NULL,
  `category` varchar(75) NOT NULL,
  `author` varchar(75) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Books`
--

INSERT INTO `Books` (`isbn`, `title`, `category`, `author`) VALUES
(316015849, 'Twilight', 'Romance', 'Stephenie Meyer'),
(375826688, 'Eragon', 'Fantasy', 'Christopher Paolini'),
(439023521, 'The Hunger Games', 'Young Adult', 'Suzanne Collings'),
(439708184, 'Harry Potter and the Sorcerer\'s Stone', 'Children\'s', 'J.K. Rowling'),
(618260307, 'The Hobbit', 'Fantasy', 'J.R.R. Tolkien'),
(756966035, 'The Lightning Thief', 'Children\'s', 'Rick Riordan'),
(901720313, 'Watership Down', 'Fantasy', 'Richard Adams'),
(1420961357, 'Heidi', 'Children\'s', 'Johanna Spyri'),
(1540041840, 'The Bridges of Madison County', 'Romance', 'Robert James Walker');

-- --------------------------------------------------------

--
-- Table structure for table `Carts`
--

CREATE TABLE `Carts` (
  `cart_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `purchased_flag` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Carts`
--

INSERT INTO `Carts` (`cart_id`, `user_id`, `purchased_flag`) VALUES
(1, 9, 0),
(2, 7, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Cart_Items`
--

CREATE TABLE `Cart_Items` (
  `cart_item_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Cart_Items`
--

INSERT INTO `Cart_Items` (`cart_item_id`, `quantity`, `cart_id`, `item_id`) VALUES
(8, 4, 1, 1),
(9, 4, 1, 2),
(10, 4, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `Inventory`
--

CREATE TABLE `Inventory` (
  `item_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `price` float NOT NULL,
  `quantity` int(11) NOT NULL,
  `isbn` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Inventory`
--

INSERT INTO `Inventory` (`item_id`, `user_id`, `price`, `quantity`, `isbn`) VALUES
(1, 7, 20, 6, 316015849),
(2, 7, 10, 20, 618260307),
(3, 7, 23, 40, 756966035);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `type_flag` int(11) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `blocked_flag` int(11) NOT NULL DEFAULT 0,
  `seller_auth_flag` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`user_id`, `username`, `type_flag`, `password`, `email`, `blocked_flag`, `seller_auth_flag`) VALUES
(7, 'Nathan', 1, 'pass', 'nml@gmail.com', 0, 0),
(9, 'Bob', 1, 'asdf', 'asdf@asdf', 0, 0),
(10, 'CoolDude', 1, 'asdf', 'asdf', 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Books`
--
ALTER TABLE `Books`
  ADD PRIMARY KEY (`isbn`);

--
-- Indexes for table `Carts`
--
ALTER TABLE `Carts`
  ADD PRIMARY KEY (`cart_id`);

--
-- Indexes for table `Cart_Items`
--
ALTER TABLE `Cart_Items`
  ADD PRIMARY KEY (`cart_item_id`);

--
-- Indexes for table `Inventory`
--
ALTER TABLE `Inventory`
  ADD PRIMARY KEY (`item_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Carts`
--
ALTER TABLE `Carts`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Cart_Items`
--
ALTER TABLE `Cart_Items`
  MODIFY `cart_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `Inventory`
--
ALTER TABLE `Inventory`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

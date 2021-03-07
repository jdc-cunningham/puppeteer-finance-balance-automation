-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 07, 2021 at 03:20 AM
-- Server version: 5.5.62-0+deb8u1
-- PHP Version: 5.6.40-0+deb8u11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `twilio_2fa_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `auth_codes`
--

CREATE TABLE IF NOT EXISTS `auth_codes` (
`id` int(13) NOT NULL,
  `acct_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `2fa_code` varchar(255) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auth_codes`
--
ALTER TABLE `auth_codes`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auth_codes`
--
ALTER TABLE `auth_codes`
MODIFY `id` int(13) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

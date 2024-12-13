-- MySQL dump 10.13  Distrib 9.1.0, for Win64 (x86_64)
--
-- Host: localhost    Database: assigneedb
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `assignment_attachments`
--

DROP TABLE IF EXISTS `assignment_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `attach_assignmentid` bigint unsigned NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_blob` mediumblob NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attachments_of_assignment` (`attach_assignmentid`),
  CONSTRAINT `attachments_of_assignment` FOREIGN KEY (`attach_assignmentid`) REFERENCES `assignment_details` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assignment_details`
--

DROP TABLE IF EXISTS `assignment_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `assign_teamid` bigint unsigned NOT NULL,
  `details` text NOT NULL,
  `deadline` bigint unsigned NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  `updated_at` bigint unsigned NOT NULL,
  `expires_at` bigint unsigned GENERATED ALWAYS AS ((`created_at` + ((365 * 24) * 3600))) VIRTUAL NOT NULL,
  PRIMARY KEY (`id`),
  KEY `assignment_of_team` (`assign_teamid`),
  CONSTRAINT `assignment_of_team` FOREIGN KEY (`assign_teamid`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assignments`
--

DROP TABLE IF EXISTS `assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignments` (
  `assign_userid` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `assign_assignmentid` bigint unsigned NOT NULL,
  `status` enum('assigned','submitted','returned') NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  `updated_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`assign_userid`,`assign_assignmentid`),
  KEY `assignment_assignee` (`assign_userid`),
  KEY `assignment_with_details` (`assign_assignmentid`),
  CONSTRAINT `assignment_assignee` FOREIGN KEY (`assign_userid`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `assignment_with_details` FOREIGN KEY (`assign_assignmentid`) REFERENCES `assignment_details` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_authcodes`
--

DROP TABLE IF EXISTS `email_authcodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `email_authcodes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `auth_userid` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `code_hash` binary(255) NOT NULL,
  `code_salt` binary(32) NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  `expires_at` bigint unsigned GENERATED ALWAYS AS ((`created_at` + (10 * 60))) VIRTUAL NOT NULL,
  PRIMARY KEY (`id`),
  KEY `email_authcode_for_user` (`auth_userid`),
  CONSTRAINT `email_authcode_for_user` FOREIGN KEY (`auth_userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `submission_attachments`
--

DROP TABLE IF EXISTS `submission_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_attachments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `attach_submissionid` bigint unsigned NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_blob` mediumblob NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attachments_of_submission` (`attach_submissionid`),
  CONSTRAINT `attachments_of_submission` FOREIGN KEY (`attach_submissionid`) REFERENCES `submissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `submit_userid` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `submit_assignmentid` bigint unsigned NOT NULL,
  `grade` enum('A','B','C','D','F') CHARACTER SET ascii COLLATE ascii_general_ci DEFAULT NULL,
  `comments` text,
  `created_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `submission_of_user` (`submit_userid`),
  KEY `submission_of_assignment` (`submit_assignmentid`),
  CONSTRAINT `submission_of_assignment` FOREIGN KEY (`submit_assignmentid`) REFERENCES `assignment_details` (`id`) ON DELETE CASCADE,
  CONSTRAINT `submission_of_user` FOREIGN KEY (`submit_userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_invite_codes`
--

DROP TABLE IF EXISTS `team_invite_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_invite_codes` (
  `invite_code_bytes` binary(4) NOT NULL,
  `invite_teamid` bigint unsigned NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  `expires_at` bigint unsigned GENERATED ALWAYS AS ((`created_at` + ((7 * 24) * 3600))) VIRTUAL NOT NULL,
  PRIMARY KEY (`invite_code_bytes`),
  UNIQUE KEY `invite_code_of_team` (`invite_teamid`),
  CONSTRAINT `invite_code_of_team` FOREIGN KEY (`invite_teamid`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_members`
--

DROP TABLE IF EXISTS `team_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_members` (
  `member_userid` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `member_teamid` bigint unsigned NOT NULL,
  `perteam_settings_override` json NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  `updated_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`member_userid`,`member_teamid`),
  KEY `membership_of_user` (`member_userid`),
  KEY `member_of_team` (`member_teamid`),
  CONSTRAINT `member_of_team` FOREIGN KEY (`member_teamid`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `membership_of_user` FOREIGN KEY (`member_userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_monitors`
--

DROP TABLE IF EXISTS `team_monitors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_monitors` (
  `monitor_userid` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `monitor_teamid` bigint unsigned NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`monitor_userid`,`monitor_teamid`),
  KEY `user_be_appoint` (`monitor_userid`),
  KEY `appoint_by_team` (`monitor_teamid`),
  CONSTRAINT `appoint_by_team` FOREIGN KEY (`monitor_teamid`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_be_appoint` FOREIGN KEY (`monitor_userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_settings`
--

DROP TABLE IF EXISTS `team_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_settings` (
  `owner_teamid` bigint unsigned NOT NULL,
  `team_override` json NOT NULL,
  `updated_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`owner_teamid`),
  CONSTRAINT `team_own_settings` FOREIGN KEY (`owner_teamid`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `display_name` varchar(30) NOT NULL,
  `owner_userid` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `description` varchar(80) NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  `updated_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_own_team` (`owner_userid`),
  CONSTRAINT `user_own_team` FOREIGN KEY (`owner_userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_passwords`
--

DROP TABLE IF EXISTS `user_passwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_passwords` (
  `owner_userid` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `password_hash` binary(255) NOT NULL,
  `password_salt` binary(32) NOT NULL,
  `updated_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`owner_userid`),
  CONSTRAINT `user_own_password` FOREIGN KEY (`owner_userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bearer_userid` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `bearer_token_hash` binary(255) NOT NULL,
  `bearer_token_salt` binary(32) NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  `expires_at` bigint unsigned GENERATED ALWAYS AS ((`created_at` + ((7 * 24) * 3600))) VIRTUAL NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_bear_session` (`bearer_userid`),
  CONSTRAINT `user_bear_session` FOREIGN KEY (`bearer_userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_settings` (
  `owner_userid` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `user_override` json NOT NULL,
  `updated_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`owner_userid`),
  CONSTRAINT `user_own_settings` FOREIGN KEY (`owner_userid`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(30) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `display_name` varchar(30) NOT NULL,
  `email` varchar(254) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `created_at` bigint unsigned NOT NULL,
  `updated_at` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-09 18:43:26

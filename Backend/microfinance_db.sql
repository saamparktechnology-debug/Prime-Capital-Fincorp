CREATE DATABASE  IF NOT EXISTS `microfinance_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `microfinance_db`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: microfinance_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (2,'saamparkgroup@gmail.com','$2b$10$BMElnnuw/2xalnau1N6Ngu62yuzP1v3oFtfWb8AjSI65a3lPfwJp.','System Administrator','9876543210',1,'2026-09-26 18:39:33','2026-09-27 14:40:13',NULL,NULL);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agent_documents`
--

DROP TABLE IF EXISTS `agent_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `agent_id` int NOT NULL,
  `document_type` varchar(50) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `uploaded_by_role` enum('admin','agent') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  KEY `fk_agent_docs_agent` (`agent_id`),
  CONSTRAINT `fk_agent_docs_agent` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agent_documents`
--

LOCK TABLES `agent_documents` WRITE;
/*!40000 ALTER TABLE `agent_documents` DISABLE KEYS */;
INSERT INTO `agent_documents` VALUES (1,2,'Aadhaar Card','loans-2026-09-27 (1).pdf','D:\\Saampark\\microfinance\\uploads\\documents\\cust_doc_1790529065761-142028927.pdf',12217,'application/pdf','admin','2026-09-27 17:11:06');
/*!40000 ALTER TABLE `agent_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agent_kyc`
--

DROP TABLE IF EXISTS `agent_kyc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_kyc` (
  `kyc_id` int NOT NULL AUTO_INCREMENT,
  `agent_id` int NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') DEFAULT NULL,
  `marital_status` enum('single','married','widowed','divorced') DEFAULT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `mother_name` varchar(255) DEFAULT NULL,
  `primary_phone` varchar(20) DEFAULT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `current_address` varchar(500) DEFAULT NULL,
  `current_city` varchar(100) DEFAULT NULL,
  `current_state` varchar(100) DEFAULT NULL,
  `current_pincode` varchar(10) DEFAULT NULL,
  `same_as_current` tinyint(1) DEFAULT '1',
  `permanent_address` varchar(500) DEFAULT NULL,
  `permanent_city` varchar(100) DEFAULT NULL,
  `permanent_state` varchar(100) DEFAULT NULL,
  `permanent_pincode` varchar(10) DEFAULT NULL,
  `national_id_number` varchar(50) DEFAULT NULL,
  `pan_number` varchar(20) DEFAULT NULL,
  `voter_id_number` varchar(50) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `account_holder_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `ifsc_code` varchar(20) DEFAULT NULL,
  `occupation_type` varchar(50) DEFAULT NULL,
  `employer_or_business_name` varchar(255) DEFAULT NULL,
  `work_experience_years` int DEFAULT NULL,
  `monthly_income` decimal(12,2) DEFAULT NULL,
  `primary_income_source` varchar(255) DEFAULT NULL,
  `emergency_contact_name` varchar(255) DEFAULT NULL,
  `emergency_contact_relationship` varchar(100) DEFAULT NULL,
  `emergency_contact_phone` varchar(20) DEFAULT NULL,
  `nominee_full_name` varchar(255) DEFAULT NULL,
  `nominee_relationship` varchar(100) DEFAULT NULL,
  `nominee_phone` varchar(20) DEFAULT NULL,
  `nominee_dob` date DEFAULT NULL,
  `kyc_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `kyc_rejection_reason` text,
  `reviewed_by` int DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`kyc_id`),
  UNIQUE KEY `uk_agent_kyc_agent` (`agent_id`),
  KEY `fk_agent_kyc_agent` (`agent_id`),
  KEY `fk_agent_kyc_reviewer` (`reviewed_by`),
  CONSTRAINT `fk_agent_kyc_agent` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_agent_kyc_reviewer` FOREIGN KEY (`reviewed_by`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agent_kyc`
--

LOCK TABLES `agent_kyc` WRITE;
/*!40000 ALTER TABLE `agent_kyc` DISABLE KEYS */;
INSERT INTO `agent_kyc` VALUES (1,2,'Ravi','2026-09-01','male','single','kdafdnaklsdj','kjdslfadsjfkads','7896541230',NULL,'saamparktechnologyresearch@gmail.com','dsafdsfaadsfadsf','zdfad','fdgsdfg','733000',1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'sdfads',NULL,NULL,NULL,NULL,NULL,NULL,'approved',NULL,2,'2026-09-27 22:41:42','2026-09-27 17:10:31','2026-09-27 18:15:02');
/*!40000 ALTER TABLE `agent_kyc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agent_permissions`
--

DROP TABLE IF EXISTS `agent_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agent_permissions` (
  `permission_id` int NOT NULL AUTO_INCREMENT,
  `agent_id` int NOT NULL,
  `module_name` varchar(50) NOT NULL,
  `can_create` tinyint(1) DEFAULT '0',
  `can_read` tinyint(1) DEFAULT '1',
  `can_update` tinyint(1) DEFAULT '0',
  `can_delete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`permission_id`),
  UNIQUE KEY `uk_agent_module` (`agent_id`,`module_name`),
  CONSTRAINT `agent_permissions_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agent_permissions`
--

LOCK TABLES `agent_permissions` WRITE;
/*!40000 ALTER TABLE `agent_permissions` DISABLE KEYS */;
INSERT INTO `agent_permissions` VALUES (1,1,'customers',0,1,1,0,'2026-09-25 17:42:39','2026-09-27 07:25:06'),(2,1,'kyc',0,1,1,0,'2026-09-25 17:42:39','2026-09-27 07:25:06'),(3,1,'loans',1,1,1,0,'2026-09-25 17:42:39','2026-09-25 17:42:39'),(4,1,'reports',1,1,1,0,'2026-09-25 17:42:39','2026-09-27 07:24:34'),(13,2,'customers',1,1,1,0,'2026-09-27 07:37:24','2026-09-27 07:37:24'),(14,2,'kyc',0,1,1,0,'2026-09-27 07:37:24','2026-09-27 16:51:28'),(15,2,'loans',0,0,1,0,'2026-09-27 07:37:24','2026-09-27 16:51:28'),(16,2,'reports',1,1,1,0,'2026-09-27 07:37:24','2026-09-27 07:37:24');
/*!40000 ALTER TABLE `agent_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `agents`
--

DROP TABLE IF EXISTS `agents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `agents` (
  `agent_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`agent_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `agents`
--

LOCK TABLES `agents` WRITE;
/*!40000 ALTER TABLE `agents` DISABLE KEYS */;
INSERT INTO `agents` VALUES (1,'agent.john@microfinance.com','$2b$10$X7vQ4zZ2K1vQ4zZ2K1vQ4u8xK1vQ4zZ2K1vQ4zZ2K1vQ4zZ2K1vQ4','John Doe','+11234567890',0,'2026-09-25 17:42:39','2026-09-27 07:25:57',NULL,NULL),(2,'ravi@sef.com','$2b$10$lWfygn2j0awEjFDJ4HuoZuiPtKJuuaXAA4mipNukDWfNFrn3uujN.','Ravi','7896541230',1,'2026-09-27 07:37:24','2026-09-27 17:12:17',NULL,NULL);
/*!40000 ALTER TABLE `agents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `audit_id` int NOT NULL AUTO_INCREMENT,
  `actor_type` enum('admin','agent','system') NOT NULL,
  `actor_id` int NOT NULL,
  `action` varchar(100) NOT NULL,
  `target_entity` varchar(50) NOT NULL,
  `target_id` int NOT NULL,
  `old_value` text,
  `new_value` text,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'agent',2,'login','agent',2,NULL,'{\"email\":\"ravi@sef.com\",\"role\":\"agent\",\"full_name\":\"Ravi\"}','::1','2026-09-27 15:39:15'),(2,'agent',2,'create','loan',2,NULL,'{\"customer_id\":2,\"loan_type\":\"Personal\",\"bank_id\":2,\"requested_amount\":15000,\"tenure_months\":12,\"interest_rate\":12,\"interest_type\":\"reducing\",\"agent_id\":2}','::1','2026-09-27 15:40:32'),(3,'admin',2,'update_status','loan',2,'{\"loan_status\":\"Applied\",\"approved_amount\":null,\"bank_reference_number\":null,\"rejection_reason\":null,\"bank_id\":2}','{\"loan_status\":\"Under Review\",\"approved_amount\":null,\"bank_reference_number\":null,\"rejection_reason\":null,\"bank_id\":2}','::1','2026-09-27 15:46:26'),(4,'admin',2,'update','agent_permissions',2,'{\"permissions\":[{\"module_name\":\"customers\",\"can_create\":1,\"can_read\":1,\"can_update\":1,\"can_delete\":0},{\"module_name\":\"kyc\",\"can_create\":1,\"can_read\":1,\"can_update\":1,\"can_delete\":0},{\"module_name\":\"loans\",\"can_create\":1,\"can_read\":1,\"can_update\":1,\"can_delete\":0},{\"module_name\":\"reports\",\"can_create\":1,\"can_read\":1,\"can_update\":1,\"can_delete\":0}]}','{\"permissions\":[{\"module_name\":\"customers\",\"can_create\":true,\"can_read\":true,\"can_update\":true,\"can_delete\":false},{\"module_name\":\"kyc\",\"can_create\":false,\"can_read\":true,\"can_update\":true,\"can_delete\":false},{\"module_name\":\"loans\",\"can_create\":false,\"can_read\":false,\"can_update\":true,\"can_delete\":false},{\"module_name\":\"reports\",\"can_create\":true,\"can_read\":true,\"can_update\":true,\"can_delete\":false}]}','::1','2026-09-27 16:51:28'),(5,'admin',2,'upload','agent_document',1,NULL,'{\"agent_id\":2,\"document_type\":\"Aadhaar Card\",\"file_name\":\"loans-2026-09-27 (1).pdf\"}','::1','2026-09-27 17:11:06'),(6,'admin',2,'approve','agent_kyc',2,'{\"kyc_status\":\"pending\"}','{\"kyc_status\":\"approved\",\"rejection_reason\":null}','::1','2026-09-27 17:11:42'),(7,'agent',2,'login','agent',2,NULL,'{\"email\":\"ravi@sef.com\",\"role\":\"agent\",\"full_name\":\"Ravi\"}','::1','2026-09-27 17:12:17'),(8,'admin',2,'update','agent_kyc',2,'{\"kyc_id\":1,\"agent_id\":2,\"full_name\":\"Ravi\",\"date_of_birth\":null,\"gender\":null,\"marital_status\":null,\"father_name\":null,\"mother_name\":null,\"primary_phone\":\"7896541230\",\"alternate_phone\":null,\"email\":\"ravi@sef.com\",\"current_address\":null,\"current_city\":null,\"current_state\":null,\"current_pincode\":null,\"same_as_current\":1,\"permanent_address\":null,\"permanent_city\":null,\"permanent_state\":null,\"permanent_pincode\":null,\"national_id_number\":null,\"pan_number\":null,\"voter_id_number\":null,\"bank_name\":null,\"branch_name\":null,\"account_holder_name\":null,\"account_number\":null,\"ifsc_code\":null,\"occupation_type\":null,\"employer_or_business_name\":null,\"work_experience_years\":null,\"monthly_income\":null,\"primary_income_source\":null,\"emergency_contact_name\":null,\"emergency_contact_relationship\":null,\"emergency_contact_phone\":null,\"nominee_full_name\":null,\"nominee_relationship\":null,\"nominee_phone\":null,\"nominee_dob\":null,\"kyc_status\":\"approved\",\"kyc_rejection_reason\":null,\"reviewed_by\":2,\"reviewed_at\":\"2026-09-27T17:11:42.000Z\",\"created_at\":\"2026-09-27T17:10:31.000Z\",\"updated_at\":\"2026-09-27T17:11:42.000Z\"}','{\"full_name\":\"Ravi\",\"date_of_birth\":\"2026-09-01\",\"gender\":\"male\",\"marital_status\":\"single\",\"father_name\":\"kdafdnaklsdj\",\"mother_name\":\"kjdslfadsjfkads\",\"primary_phone\":\"7896541230\",\"email\":\"ravi@sef.com\",\"current_address\":\"dsafdsfaadsfadsf\",\"current_city\":\"zdfad\",\"current_state\":\"fdgsdfg\",\"current_pincode\":\"733000\",\"same_as_current\":true,\"emergency_contact_name\":\"sdfads\"}','::1','2026-09-27 18:15:02');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banks`
--

DROP TABLE IF EXISTS `banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banks` (
  `bank_id` int NOT NULL AUTO_INCREMENT,
  `bank_name` varchar(100) NOT NULL,
  `short_code` varchar(20) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bank_id`),
  UNIQUE KEY `bank_name` (`bank_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banks`
--

LOCK TABLES `banks` WRITE;
/*!40000 ALTER TABLE `banks` DISABLE KEYS */;
INSERT INTO `banks` VALUES (1,'Union Bank','UBINO123654',1,'2026-09-26 20:21:21'),(2,'State Bank of India','SBI',1,'2026-09-27 07:15:49');
/*!40000 ALTER TABLE `banks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `agent_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `marital_status` enum('Single','Married','Divorced','Widowed') NOT NULL,
  `father_name` varchar(100) NOT NULL,
  `mother_name` varchar(100) NOT NULL,
  `primary_phone` varchar(20) NOT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `email_address` varchar(150) DEFAULT NULL,
  `current_address_line1` varchar(255) NOT NULL,
  `current_address_line2` varchar(255) DEFAULT NULL,
  `current_city` varchar(100) NOT NULL,
  `current_state` varchar(100) NOT NULL,
  `current_pincode` varchar(20) NOT NULL,
  `residence_type` enum('Owned','Rented','Living with Parents') NOT NULL,
  `same_as_current` tinyint(1) DEFAULT '0',
  `permanent_address_line1` varchar(255) DEFAULT NULL,
  `permanent_city` varchar(100) DEFAULT NULL,
  `permanent_state` varchar(100) DEFAULT NULL,
  `permanent_pincode` varchar(20) DEFAULT NULL,
  `family_type` enum('Nuclear','Joint') NOT NULL,
  `total_family_members` int NOT NULL,
  `earning_members_count` int NOT NULL,
  `dependents_count` int NOT NULL,
  `national_id_number` varchar(50) NOT NULL,
  `tax_id_number` varchar(50) NOT NULL,
  `voter_id_number` varchar(50) DEFAULT NULL,
  `bank_name` varchar(100) NOT NULL,
  `branch_name` varchar(100) NOT NULL,
  `account_holder_name` varchar(100) NOT NULL,
  `account_number` varchar(50) NOT NULL,
  `ifsc_code` varchar(20) NOT NULL,
  `occupation_type` enum('Salaried','Self-Employed','Daily Wage','Farmer','Business') NOT NULL,
  `employer_or_business_name` varchar(100) NOT NULL,
  `work_experience_years` int NOT NULL,
  `monthly_personal_income` decimal(12,2) NOT NULL,
  `monthly_household_income` decimal(12,2) NOT NULL,
  `primary_income_source` varchar(100) NOT NULL,
  `nominee_full_name` varchar(100) NOT NULL,
  `nominee_relationship` varchar(50) NOT NULL,
  `nominee_phone` varchar(20) NOT NULL,
  `nominee_dob` date NOT NULL,
  `kyc_status` enum('pending','approved','rejected') DEFAULT 'pending',
  `kyc_rejection_reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `primary_phone` (`primary_phone`),
  UNIQUE KEY `national_id_number` (`national_id_number`),
  UNIQUE KEY `tax_id_number` (`tax_id_number`),
  KEY `agent_id` (`agent_id`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,1,'Sk Mehebub',NULL,'Ali','2000-02-20','Male','Single','ksjdfah','khbzjdshf','7894563200',NULL,'alksfhaklsd@gmail.com','',NULL,'askfhasdkl','kaldhfalkd','741221','Owned',0,NULL,NULL,NULL,NULL,'Nuclear',3,2,3,'akljfalkdsjf','45jaksdj','alskfja','lkdsfgsld','alsfe','aslkj','789656435','UBIN0539791','Salaried','aflkasjf alasdfj',43,33343.00,343.00,'lksdf s','alkdsfhalsdf','mother','7896545200','1888-02-10','pending',NULL,'2026-09-27 06:04:20','2026-09-27 06:04:20'),(2,2,'SK','MEHEBUB','ALI','2026-09-02','Other','Married','sdgfsdgsdfg','sdfgsdgfsdgsfd','9871234560',NULL,'skmehebubali34@gmail.com','alkdsfh sfkah kfahd',NULL,'kld dsfh','dfhklghdfj','79462','Owned',0,NULL,NULL,NULL,NULL,'Joint',10,10,12,'asdklfhds','asdhfaksd','halsdfh','asdkfhasdkj','asdkjfjadsfkla','alksdhfaskdl','79764554589','IDIB000D597','Salaried','SAFADSF',5,5000.00,555555.00,'DSFASDJKL','ASKDHFALK JDF','brother','7896541236','2026-09-01','approved',NULL,'2026-09-27 07:50:23','2026-09-27 08:34:23');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `document_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `document_type` varchar(50) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` int NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `uploaded_by_role` enum('agent','admin') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,2,'Aadhaar Card','Curriculum Vitae - Sk Masum Ali.pdf','D:\\Saampark\\microfinance\\uploads\\documents\\cust_2_1790497121851-554935998.pdf',125512,'application/pdf','agent','2026-09-27 08:18:41');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loans`
--

DROP TABLE IF EXISTS `loans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loans` (
  `loan_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `loan_type` varchar(100) NOT NULL DEFAULT 'General',
  `agent_id` int NOT NULL,
  `requested_amount` decimal(12,2) NOT NULL,
  `approved_amount` decimal(12,2) DEFAULT NULL,
  `tenure_months` int NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `interest_type` enum('flat','reducing') NOT NULL DEFAULT 'flat',
  `purpose` varchar(255) NOT NULL,
  `loan_status` enum('Draft','Applied','Under Review','Approved','Rejected','Disbursed','Active','Completed','Overdue','Cancelled') DEFAULT 'Draft',
  `bank_reference_number` varchar(100) DEFAULT NULL,
  `rejection_reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `bank_id` int DEFAULT NULL,
  PRIMARY KEY (`loan_id`),
  KEY `customer_id` (`customer_id`),
  KEY `agent_id` (`agent_id`),
  KEY `fk_loan_bank` (`bank_id`),
  CONSTRAINT `fk_loan_bank` FOREIGN KEY (`bank_id`) REFERENCES `banks` (`bank_id`),
  CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE RESTRICT,
  CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`agent_id`) REFERENCES `agents` (`agent_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loans`
--

LOCK TABLES `loans` WRITE;
/*!40000 ALTER TABLE `loans` DISABLE KEYS */;
INSERT INTO `loans` VALUES (1,2,'Business',2,10000.00,20000.00,12,12.00,'flat','faslkjfalksdfj','Active','9874563210',NULL,'2026-09-27 09:22:32','2026-09-27 10:17:03',1),(2,2,'Personal',2,15000.00,NULL,12,12.00,'reducing','dbalksd faldf ahfdakldf','Under Review',NULL,NULL,'2026-09-27 15:40:32','2026-09-27 15:46:26',2);
/*!40000 ALTER TABLE `loans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `recipient_type` enum('admin','agent','customer') NOT NULL,
  `recipient_id` int NOT NULL,
  `channel` enum('email','sms') NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('pending','sent','failed') DEFAULT 'pending',
  `sent_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repayment_emis`
--

DROP TABLE IF EXISTS `repayment_emis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repayment_emis` (
  `emi_id` int NOT NULL AUTO_INCREMENT,
  `loan_id` int NOT NULL,
  `customer_id` int NOT NULL,
  `installment_number` int NOT NULL,
  `emi_amount` decimal(12,2) NOT NULL,
  `due_date` date NOT NULL,
  `installments_left` int NOT NULL,
  `status` enum('Pending','Paid','Overdue') DEFAULT 'Pending',
  `paid_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`emi_id`),
  KEY `loan_id` (`loan_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `repayment_emis_ibfk_1` FOREIGN KEY (`loan_id`) REFERENCES `loans` (`loan_id`) ON DELETE CASCADE,
  CONSTRAINT `repayment_emis_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repayment_emis`
--

LOCK TABLES `repayment_emis` WRITE;
/*!40000 ALTER TABLE `repayment_emis` DISABLE KEYS */;
INSERT INTO `repayment_emis` VALUES (1,1,2,1,1866.67,'2026-10-27',11,'Paid','2026-09-27','2026-09-27 10:13:35','2026-09-27 10:15:45'),(2,1,2,2,1866.67,'2026-11-27',10,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(3,1,2,3,1866.67,'2026-12-27',9,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(4,1,2,4,1866.67,'2027-01-27',8,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(5,1,2,5,1866.67,'2027-02-27',7,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(6,1,2,6,1866.67,'2027-03-27',6,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(7,1,2,7,1866.67,'2027-04-27',5,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(8,1,2,8,1866.67,'2027-05-27',4,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(9,1,2,9,1866.67,'2027-06-27',3,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(10,1,2,10,1866.67,'2027-07-27',2,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(11,1,2,11,1866.67,'2027-08-27',1,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35'),(12,1,2,12,1866.67,'2027-09-27',0,'Pending',NULL,'2026-09-27 10:13:35','2026-09-27 10:13:35');
/*!40000 ALTER TABLE `repayment_emis` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-28  0:00:32

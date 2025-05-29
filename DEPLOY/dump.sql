-- MySQL dump 10.13  Distrib 9.2.0, for Linux (x86_64)
--
-- Host: localhost    Database: mydatabase
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `DATABASECHANGELOG`
--

DROP TABLE IF EXISTS `DATABASECHANGELOG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DATABASECHANGELOG` (
  `ID` varchar(255) NOT NULL,
  `AUTHOR` varchar(255) NOT NULL,
  `FILENAME` varchar(255) NOT NULL,
  `DATEEXECUTED` datetime NOT NULL,
  `ORDEREXECUTED` int NOT NULL,
  `EXECTYPE` varchar(10) NOT NULL,
  `MD5SUM` varchar(35) DEFAULT NULL,
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL,
  `TAG` varchar(255) DEFAULT NULL,
  `LIQUIBASE` varchar(20) DEFAULT NULL,
  `CONTEXTS` varchar(255) DEFAULT NULL,
  `LABELS` varchar(255) DEFAULT NULL,
  `DEPLOYMENT_ID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DATABASECHANGELOG`
--

LOCK TABLES `DATABASECHANGELOG` WRITE;
/*!40000 ALTER TABLE `DATABASECHANGELOG` DISABLE KEYS */;
INSERT INTO `DATABASECHANGELOG` VALUES ('00000000000001','jhipster','config/liquibase/changelog/00000000000000_initial_schema.xml','2025-02-07 16:46:55',1,'EXECUTED','9:3d15ce8389bddb1666f01b768d03e89b','createTable tableName=jhi_user; createTable tableName=jhi_authority; createTable tableName=jhi_user_authority; addPrimaryKey tableName=jhi_user_authority; addForeignKeyConstraint baseTableName=jhi_user_authority, constraintName=fk_authority_name, ...','',NULL,'4.29.2',NULL,NULL,'8946815061');
/*!40000 ALTER TABLE `DATABASECHANGELOG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DATABASECHANGELOGLOCK`
--

DROP TABLE IF EXISTS `DATABASECHANGELOGLOCK`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DATABASECHANGELOGLOCK` (
  `ID` int NOT NULL,
  `LOCKED` tinyint NOT NULL,
  `LOCKGRANTED` datetime DEFAULT NULL,
  `LOCKEDBY` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DATABASECHANGELOGLOCK`
--

LOCK TABLES `DATABASECHANGELOGLOCK` WRITE;
/*!40000 ALTER TABLE `DATABASECHANGELOGLOCK` DISABLE KEYS */;
INSERT INTO `DATABASECHANGELOGLOCK` VALUES (1,0,NULL,NULL);
/*!40000 ALTER TABLE `DATABASECHANGELOGLOCK` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_user`
--

DROP TABLE IF EXISTS `app_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `app_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `role` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK1j9d9a06i600gd43uu3km82jw` (`email`),
  UNIQUE KEY `UK3k4cplvh82srueuttfkwnylq0` (`username`),
  CONSTRAINT `app_user_chk_1` CHECK ((`role` between 0 and 2))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_user`
--

LOCK TABLES `app_user` WRITE;
/*!40000 ALTER TABLE `app_user` DISABLE KEYS */;
INSERT INTO `app_user` VALUES (1,'admin@admin.pt','admin','admin','$2a$10$xEglKSyJMuj5spLsbYN4iuGtXf0XjxMU/xiGsVlDE5YcKWqeGYg..','admin',0),(2,'ad@ad.pt','ad','ad','$2a$10$YuuVHqWdeLFi6r2E6NLTvut6DN28RTa41O38Pk3G6G79BRizZ1mK6','ad',0),(3,'te@te.te','te','te','$2a$10$oUkh1SaI.X42m5LW1Ij5DeLtO9qd0Unvh3GmPJRXyTdy/02Pnoy6W','te',2),(4,'user@user.user','user','user','$2a$10$MRycVitFfmwFIpclP1Rs8.Yzm0M6m8pyPHH8/rQ/AwLkdmAoTZv1i','user',1);
/*!40000 ALTER TABLE `app_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `recipient` varchar(255) NOT NULL,
  `sender` varchar(255) NOT NULL,
  `timestamp` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `recipient_user_id` int DEFAULT NULL,
  `sender_user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKr0bjcb2j5327gneban7m55xnf` (`recipient_user_id`),
  KEY `FKg9d1odxgyj8y7in19vun7txwq` (`sender_user_id`),
  CONSTRAINT `FKg9d1odxgyj8y7in19vun7txwq` FOREIGN KEY (`sender_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKr0bjcb2j5327gneban7m55xnf` FOREIGN KEY (`recipient_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES (1,'ola como esta','2025-04-10 15:27:50.452609','demo_2','demo_1','2025-04-10T14:27:50.413Z','2025-04-10 15:27:50.452609',34,33),(2,'recebido','2025-04-10 15:28:05.091079','demo_1','demo_2','2025-04-10T14:28:05.039Z','2025-04-10 15:28:05.091588',33,34),(3,'quero conversar tbm','2025-04-10 15:28:19.115799','demo_1','demo_3','2025-04-10T14:28:19.090Z','2025-04-10 15:28:19.115799',33,35),(4,'bora la ent','2025-04-10 15:28:40.700339','demo_3','demo_1','2025-04-10T14:28:40.675Z','2025-04-10 15:28:40.700339',35,33);
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `id` bigint NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `technical_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK28mfoc7ntbjhij1riqm1041bf` (`technical_id`),
  KEY `FKmolqi1xj49bg3jjr33674limy` (`user_id`),
  CONSTRAINT `FK28mfoc7ntbjhij1riqm1041bf` FOREIGN KEY (`technical_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKmolqi1xj49bg3jjr33674limy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats_seq`
--

DROP TABLE IF EXISTS `chats_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats_seq`
--

LOCK TABLES `chats_seq` WRITE;
/*!40000 ALTER TABLE `chats_seq` DISABLE KEYS */;
INSERT INTO `chats_seq` VALUES (1);
/*!40000 ALTER TABLE `chats_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contents`
--

DROP TABLE IF EXISTS `contents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contents` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `body` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `title` varchar(255) NOT NULL,
  `creator_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkqm93m7ef9b4cdp2ij0stmbgq` (`creator_id`),
  CONSTRAINT `FKkqm93m7ef9b4cdp2ij0stmbgq` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contents`
--

LOCK TABLES `contents` WRITE;
/*!40000 ALTER TABLE `contents` DISABLE KEYS */;
/*!40000 ALTER TABLE `contents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercicios`
--

DROP TABLE IF EXISTS `exercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercicios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `detalhe` text NOT NULL,
  `media_path` varchar(255) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `repeticoes` int NOT NULL,
  `plano_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKgha593y1kuu9nfs8pmx1w0gom` (`plano_id`),
  CONSTRAINT `FKgha593y1kuu9nfs8pmx1w0gom` FOREIGN KEY (`plano_id`) REFERENCES `planos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercicios`
--

LOCK TABLES `exercicios` WRITE;
/*!40000 ALTER TABLE `exercicios` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `video_path` varchar(255) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `plan_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkiftckymv693t6yxogsb50n4y` (`user_id`),
  KEY `FKsdukgujhshhsaqpfjkj3ygn2f` (`plan_id`),
  CONSTRAINT `FKkiftckymv693t6yxogsb50n4y` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKsdukgujhshhsaqpfjkj3ygn2f` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jhi_authority`
--

DROP TABLE IF EXISTS `jhi_authority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jhi_authority` (
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jhi_authority`
--

LOCK TABLES `jhi_authority` WRITE;
/*!40000 ALTER TABLE `jhi_authority` DISABLE KEYS */;
INSERT INTO `jhi_authority` VALUES ('ROLE_ADMIN'),('ROLE_USER');
/*!40000 ALTER TABLE `jhi_authority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jhi_user`
--

DROP TABLE IF EXISTS `jhi_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jhi_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `login` varchar(50) NOT NULL,
  `password_hash` varchar(60) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `email` varchar(191) DEFAULT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `activated` tinyint NOT NULL,
  `lang_key` varchar(10) DEFAULT NULL,
  `activation_key` varchar(20) DEFAULT NULL,
  `reset_key` varchar(20) DEFAULT NULL,
  `created_by` varchar(50) NOT NULL,
  `created_date` timestamp NULL,
  `reset_date` timestamp NULL DEFAULT NULL,
  `last_modified_by` varchar(50) DEFAULT NULL,
  `last_modified_date` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_user_login` (`login`),
  UNIQUE KEY `ux_user_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=1051 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jhi_user`
--

LOCK TABLES `jhi_user` WRITE;
/*!40000 ALTER TABLE `jhi_user` DISABLE KEYS */;
INSERT INTO `jhi_user` VALUES (1,'admin','$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC','Administrator','Administrator','admin@localhost','',1,'en',NULL,NULL,'system',NULL,NULL,'system',NULL),(2,'user','$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K','User','User','user@localhost','',1,'en',NULL,NULL,'system',NULL,NULL,'system',NULL),(1050,'teste','$2a$10$6ChkEVx.XaRFm2BvJR9hC.Uxf5/rEDdPDHXi8YagN99nLZxyGGRgW',NULL,NULL,'teste@teste.pt',NULL,1,'pt-pt','CjJr6arR9krRFhfbwYOr',NULL,'anonymousUser','2025-02-08 09:24:30',NULL,'admin','2025-02-08 09:58:04');
/*!40000 ALTER TABLE `jhi_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jhi_user_authority`
--

DROP TABLE IF EXISTS `jhi_user_authority`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jhi_user_authority` (
  `user_id` bigint NOT NULL,
  `authority_name` varchar(50) NOT NULL,
  PRIMARY KEY (`user_id`,`authority_name`),
  KEY `fk_authority_name` (`authority_name`),
  CONSTRAINT `fk_authority_name` FOREIGN KEY (`authority_name`) REFERENCES `jhi_authority` (`name`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jhi_user_authority`
--

LOCK TABLES `jhi_user_authority` WRITE;
/*!40000 ALTER TABLE `jhi_user_authority` DISABLE KEYS */;
INSERT INTO `jhi_user_authority` VALUES (1,'ROLE_ADMIN'),(1,'ROLE_USER'),(2,'ROLE_USER'),(1050,'ROLE_USER');
/*!40000 ALTER TABLE `jhi_user_authority` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memorizar`
--

DROP TABLE IF EXISTS `memorizar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `memorizar` (
  `status` bit(1) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `data` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memorizar`
--

LOCK TABLES `memorizar` WRITE;
/*!40000 ALTER TABLE `memorizar` DISABLE KEYS */;
/*!40000 ALTER TABLE `memorizar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_attachments`
--

DROP TABLE IF EXISTS `message_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message_attachments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` bigint NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `message_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKj7twd218e2gqw9cmlhwvo1rth` (`message_id`),
  CONSTRAINT `FKj7twd218e2gqw9cmlhwvo1rth` FOREIGN KEY (`message_id`) REFERENCES `messages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_attachments`
--

LOCK TABLES `message_attachments` WRITE;
/*!40000 ALTER TABLE `message_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `message_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` bigint NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `read_at` datetime(6) DEFAULT NULL,
  `chat_id` bigint NOT NULL,
  `sender_id` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `recipient_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK64w44ngcpqp99ptcb9werdfmb` (`chat_id`),
  KEY `FK4ui4nnwntodh6wjvck53dbk9m` (`sender_id`),
  KEY `FKhdkwfnspwb3s60j27vpg0rpg6` (`recipient_id`),
  CONSTRAINT `FK4ui4nnwntodh6wjvck53dbk9m` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK64w44ngcpqp99ptcb9werdfmb` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`),
  CONSTRAINT `FKhdkwfnspwb3s60j27vpg0rpg6` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages_seq`
--

DROP TABLE IF EXISTS `messages_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages_seq`
--

LOCK TABLES `messages_seq` WRITE;
/*!40000 ALTER TABLE `messages_seq` DISABLE KEYS */;
INSERT INTO `messages_seq` VALUES (1);
/*!40000 ALTER TABLE `messages_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author_id` varchar(255) NOT NULL,
  `author_name` varchar(255) NOT NULL,
  `author_username` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `status` bit(1) NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'33','Fisio joão','demo_1','<p>texto</p><p>receita&nbsp;de&nbsp;bolo</p><ol><li>ovos</li><li>farinha</li><li></li></ol><p><img src=\"data:image/png;base64,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\"></p><p></p><p>random</p><p><img src=\"data:image/png;base64,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\"></p>','2025-04-10 15:23:27.389630',_binary '','demo','2025-04-10 15:23:27.389738');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `body` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `title` varchar(255) NOT NULL,
  `creator_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm94ix95lndys0omrewnvctgeg` (`creator_id`),
  CONSTRAINT `FKm94ix95lndys0omrewnvctgeg` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `title` varchar(255) NOT NULL,
  `sender_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK13vcnq3ukas06ho1yrbc5lrb5` (`sender_id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK13vcnq3ukas06ho1yrbc5lrb5` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'2025-04-10 14:41:28.065350',_binary '','por favor criar um utilizador.\ndados:\nnome: \netc...','criar um utilizador',33,1),(2,'2025-04-10 15:10:11.510755',_binary '\0','consegui fazer login','login sucesso',34,33);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pessoa`
--

DROP TABLE IF EXISTS `pessoa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pessoa` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_mc87q8fpvldpdyfo9o5633o5l` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pessoa`
--

LOCK TABLES `pessoa` WRITE;
/*!40000 ALTER TABLE `pessoa` DISABLE KEYS */;
/*!40000 ALTER TABLE `pessoa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pins`
--

DROP TABLE IF EXISTS `pins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pins` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `pin_code` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjtdqg04rdo7uq71d7kwrwgoxl` (`user_id`),
  CONSTRAINT `FKjtdqg04rdo7uq71d7kwrwgoxl` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pins`
--

LOCK TABLES `pins` WRITE;
/*!40000 ALTER TABLE `pins` DISABLE KEYS */;
INSERT INTO `pins` VALUES (1,'2025-05-19 23:17:29.421533','2025-05-20 00:17:29.417658','345932',_binary '\0',33),(2,'2025-05-19 23:17:32.006213','2025-05-20 00:17:32.004391','597231',_binary '\0',33),(3,'2025-05-19 23:17:35.200149','2025-05-20 00:17:35.198438','373371',_binary '\0',33),(4,'2025-05-19 23:19:07.966095','2025-05-20 00:19:07.963211','939453',_binary '\0',33),(5,'2025-05-19 23:19:12.406293','2025-05-20 00:19:12.404149','645404',_binary '\0',33),(6,'2025-05-19 23:20:19.599966','2025-05-20 00:20:19.598299','271626',_binary '',33),(7,'2025-05-19 23:21:15.771535','2025-05-20 00:21:15.768528','129877',_binary '',33),(8,'2025-05-19 23:22:23.168965','2025-05-20 00:22:23.166096','507334',_binary '\0',33),(9,'2025-05-19 23:23:53.699247','2025-05-20 00:23:53.698211','951223',_binary '\0',33),(10,'2025-05-19 23:24:48.707356','2025-05-20 00:24:48.706233','530362',_binary '\0',33),(11,'2025-05-19 23:24:54.414762','2025-05-20 00:24:54.413011','299279',_binary '\0',33),(12,'2025-05-19 23:25:00.206967','2025-05-20 00:25:00.205323','546738',_binary '\0',33),(13,'2025-05-19 23:25:54.079844','2025-05-20 00:25:54.078805','030269',_binary '\0',33),(14,'2025-05-19 23:26:14.908090','2025-05-20 00:26:14.905856','379879',_binary '\0',33),(15,'2025-05-20 00:00:55.239294','2025-05-20 01:00:55.233056','958484',_binary '',33),(16,'2025-05-20 00:04:49.401157','2025-05-20 01:04:49.399233','852633',_binary '',33),(17,'2025-05-20 00:05:53.006539','2025-05-20 01:05:53.004973','715715',_binary '',33);
/*!40000 ALTER TABLE `pins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_by` varchar(255) NOT NULL,
  `creation_date` datetime(6) NOT NULL,
  `description` varchar(255) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `validity_date` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK12gjedcaahnhl3jlqnfp4wvou` (`user_id`),
  CONSTRAINT `FK12gjedcaahnhl3jlqnfp4wvou` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan`
--

LOCK TABLES `plan` WRITE;
/*!40000 ALTER TABLE `plan` DISABLE KEYS */;
INSERT INTO `plan` VALUES (1,'demo_1','2025-04-10 15:18:23.686804','teste do primeiro plano',_binary '','2025-05-10 15:18:23.686804',34);
/*!40000 ALTER TABLE `plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_execution_metrics`
--

DROP TABLE IF EXISTS `plan_execution_metrics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_execution_metrics` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `completed` bit(1) NOT NULL,
  `current_step` int NOT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `next_step_clicks` int NOT NULL,
  `previous_step_clicks` int NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `total_duration` bigint DEFAULT NULL,
  `total_steps` int NOT NULL,
  `plan_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2fh34xka0k7c3g21ppiuufhi4` (`plan_id`),
  KEY `FK94lie9gbcik72o8oxbyrdp3v6` (`user_id`),
  CONSTRAINT `FK2fh34xka0k7c3g21ppiuufhi4` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`id`),
  CONSTRAINT `FK94lie9gbcik72o8oxbyrdp3v6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_execution_metrics`
--

LOCK TABLES `plan_execution_metrics` WRITE;
/*!40000 ALTER TABLE `plan_execution_metrics` DISABLE KEYS */;
INSERT INTO `plan_execution_metrics` VALUES (1,_binary '',1,'2025-04-10 15:20:06.840079',1,0,'2025-04-10 15:18:56.702841',70,2,1,34),(2,_binary '',0,'2025-04-10 15:40:24.875086',0,0,'2025-04-10 15:40:10.327139',14,2,1,34);
/*!40000 ALTER TABLE `plan_execution_metrics` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_execution_step_timings`
--

DROP TABLE IF EXISTS `plan_execution_step_timings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_execution_step_timings` (
  `execution_id` bigint NOT NULL,
  `time_spent` double DEFAULT NULL,
  KEY `FKbiyf256blc7nl3n6mnghlgjgl` (`execution_id`),
  CONSTRAINT `FKbiyf256blc7nl3n6mnghlgjgl` FOREIGN KEY (`execution_id`) REFERENCES `plan_execution_metrics` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_execution_step_timings`
--

LOCK TABLES `plan_execution_step_timings` WRITE;
/*!40000 ALTER TABLE `plan_execution_step_timings` DISABLE KEYS */;
INSERT INTO `plan_execution_step_timings` VALUES (1,34.556);
/*!40000 ALTER TABLE `plan_execution_step_timings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_exercicios`
--

DROP TABLE IF EXISTS `plan_exercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_exercicios` (
  `plan_id` bigint NOT NULL,
  `descricao` varchar(255) DEFAULT NULL,
  `id` bigint DEFAULT NULL,
  `video_path` varchar(255) DEFAULT NULL,
  KEY `FK1d2xgo6y14hex6mimga28ybx2` (`plan_id`),
  CONSTRAINT `FK1d2xgo6y14hex6mimga28ybx2` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_exercicios`
--

LOCK TABLES `plan_exercicios` WRITE;
/*!40000 ALTER TABLE `plan_exercicios` DISABLE KEYS */;
/*!40000 ALTER TABLE `plan_exercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_exercises`
--

DROP TABLE IF EXISTS `plan_exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_exercises` (
  `plan_id` bigint NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `video_path` varchar(255) DEFAULT NULL,
  KEY `FKdsvs7pjd5qv3m3o14gmv5vvdw` (`plan_id`),
  CONSTRAINT `FKdsvs7pjd5qv3m3o14gmv5vvdw` FOREIGN KEY (`plan_id`) REFERENCES `plan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_exercises`
--

LOCK TABLES `plan_exercises` WRITE;
/*!40000 ALTER TABLE `plan_exercises` DISABLE KEYS */;
INSERT INTO `plan_exercises` VALUES (1,'agachamento','FS__demo_2__0'),(1,'flexão','FS__demo_2__2');
/*!40000 ALTER TABLE `plan_exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `valid_until` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  `data_criacao` datetime(6) NOT NULL,
  `data_validade` datetime(6) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKbybv5po44ssyv6svnv062dwrf` (`user_id`),
  CONSTRAINT `FKbybv5po44ssyv6svnv062dwrf` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `birthdate` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `perfil` enum('ADMIN','USER','TECHNICAL') NOT NULL,
  `technical_id` int DEFAULT NULL,
  `plano` varchar(255) DEFAULT NULL,
  `fisioterapeuta_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(1) DEFAULT '1',
  `enabled` bit(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`),
  KEY `FKd3kv1o5u67wjampqyyhqxf91r` (`fisioterapeuta_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`fisioterapeuta_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Joe Due','joe.due','1990-01-01','$2a$10$R/0TjDt7ciV0rKEQihkqtuAYthJAr/hF5082i0uJMU/SJ.BdVw8Ta','ADMIN',NULL,'Plano Básico',NULL,'2025-03-15 12:39:18','2025-04-08 07:16:58',1,NULL),(33,'Fisio joão','demo_1','2025-04-10','$2a$10$OezKrbPx/OXahAOice.jKuWtaiOIW.OFIUgLku4PcOvn0laJg2aGu','TECHNICAL',NULL,'',NULL,'2025-04-10 14:40:08','2025-04-10 14:40:08',1,NULL),(34,'UTENTE DEMO','demo_2','2025-04-10','$2a$10$ajFmv2mQ658ByjLdTA2IFeKEdXZgH3KmwT1dq7HswTi46nr7aWptS','USER',NULL,'',33,'2025-04-10 15:08:55','2025-04-10 15:08:55',1,NULL),(35,'Utente joão','demo_3','2025-04-08','$2a$10$fhduefNhPE7wUO9rYDhYBuSMjjN6PQRIByCtTj9xRqIPLYWk7Yhlm','USER',NULL,'',33,'2025-04-10 15:25:45','2025-04-10 15:25:45',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_seq`
--

DROP TABLE IF EXISTS `users_seq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_seq` (
  `next_val` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_seq`
--

LOCK TABLES `users_seq` WRITE;
/*!40000 ALTER TABLE `users_seq` DISABLE KEYS */;
INSERT INTO `users_seq` VALUES (51);
/*!40000 ALTER TABLE `users_seq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) NOT NULL,
  `download_folder` varchar(255) DEFAULT NULL,
  `duration` int NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `size` double NOT NULL,
  `stored_locally` bit(1) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK75696octon297ywni28sk19ek` (`user_id`),
  CONSTRAINT `FK75696octon297ywni28sk19ek` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,'demo 1','Pasta de Transferências',4,'local','FS__demo_2__0',1.425323486328125,_binary '','2025-04-10 14:13:06.691000',34),(2,'demo 2','Pasta de Transferências',5,'local','FS__demo_2__2',1.7250165939331055,_binary '','2025-04-10 14:13:27.875000',34),(3,'Sem descrição','Pasta de Transferências',1,'local','FS__demo_2__3',0.38556766510009766,_binary '','2025-04-10 14:36:32.256000',34),(4,'Sem descrição','Pasta de Transferências',3,'local','FS__demo_2__4',0.06004619598388672,_binary '','2025-05-19 22:35:29.674000',34);
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-25 22:54:09

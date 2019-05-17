delimiter $$

CREATE DATABASE myproject;

USE myproject;

delimiter $$

delimiter $$

delimiter $$

CREATE TABLE `language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `iso_name` varchar(45) NOT NULL,
  `native_name` varchar(45) NOT NULL,
  `iso2_code` char(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8$$
;
delimiter $$

CREATE TABLE `process` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `label` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `shortname` char(4) NOT NULL,
  `controller` varchar(125) NOT NULL,
  `parameters` varchar(100) DEFAULT NULL,
  `url` varchar(64) DEFAULT NULL,
  `in_panel` char(1) NOT NULL DEFAULT 'N',
  `icon` varchar(80) DEFAULT NULL,
  `sequence` int(3) NOT NULL DEFAULT '0',
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8$$
;

delimiter $$

CREATE TABLE `profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shortname` varchar(45) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8$$
;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` varchar(80) NOT NULL DEFAULT '',
  `password` varchar(40) NOT NULL DEFAULT '',
  `profile_id` int(11) NOT NULL,
  `status` char(1) NOT NULL DEFAULT 'P',
  `context` varchar(3) NOT NULL DEFAULT 'INT',
  `first_name` varchar(80) NOT NULL DEFAULT '',
  `last_name` varchar(80) NOT NULL DEFAULT '',
  `email` varchar(80) NOT NULL DEFAULT '',
  `sex` char(1) NOT NULL,
  `avatar` varchar(80) DEFAULT NULL,
  `avatarbg` char(7) DEFAULT NULL,
  `lang_code` char(3) DEFAULT NULL,
  `cpa_id` int(11) DEFAULT NULL,
  `crm_id` varchar(100) DEFAULT NULL,
  `usu_alta` varchar(20) NOT NULL DEFAULT '0',
  `fec_alta` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `usu_modi` varchar(20) DEFAULT NULL,
  `fec_modi` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=latin1$$
;

CREATE TABLE `security_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `selector` bigint(20) NOT NULL,
  `code_value` varchar(40) NOT NULL,
  `code_type` char(6) NOT NULL,
  `related_id` int(11) NOT NULL,
  `creation` datetime NOT NULL,
  `active` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash_code_UNIQUE` (`code_value`),
  UNIQUE KEY `selector_UNIQUE` (`selector`)
) ENGINE=InnoDB AUTO_INCREMENT=174 DEFAULT CHARSET=utf8$$
;

CREATE TABLE `permission` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `profile_id` mediumint(10) NOT NULL DEFAULT '0',
  `process_id` int(5) NOT NULL DEFAULT '0',
  `description` varchar(50) NOT NULL DEFAULT '',
  `auditable` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=52 DEFAULT CHARSET=utf8$$
;

CREATE TABLE `keep_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `selector` int(11) NOT NULL,
  `token` varchar(40) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `selector_UNIQUE` (`selector`),
  UNIQUE KEY `token_UNIQUE` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8$$
;
delimiter $$

CREATE TABLE `audit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `process_code` char(4) NOT NULL,
  `description` varchar(256) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=latin1$$
;


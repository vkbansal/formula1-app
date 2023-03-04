USE f1db;

CREATE TABLE `driverChampionships` (
	`driverChampionshipId` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) NOT NULL DEFAULT 0,
  `raceId` int(11) DEFAULT 0,
  `driverId` int(11) DEFAULT 0,
  `position` int(11) DEFAULT NULL,
	PRIMARY KEY (`driverChampionshipId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `driverChampionships`
(`year`, `raceId`, `driverId`, `position`)
SELECT
	`FR`.`year` AS `year`,
	`R`.`raceId` AS `raceId`,
	`DS`.`driverId` AS `driverId`,
	`DS`.`position` AS `position`
FROM (
	SELECT
		MAX(`R`.`round`) AS `round`,
		`R`.`year` AS `year`
	FROM `races` AS `R`
	GROUP BY `R`.`year`
) AS `FR`
LEFT OUTER JOIN `races` AS `R` USING (`round`, `year`)
LEFT OUTER JOIN `driverStandings` AS DS USING (`raceId`);

CREATE TABLE `constructorChampionships` (
	`constructorChampionshipId` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) NOT NULL DEFAULT 0,
  `raceId` int(11) DEFAULT 0,
  `constructorId` int(11) DEFAULT 0,
  `position` int(11) DEFAULT NULL,
	PRIMARY KEY (`constructorChampionshipId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `constructorChampionships`
(`year`, `raceId`, `constructorId`, `position`)
SELECT
	`FR`.`year` AS `year`,
	`R`.`raceId` AS `raceId`,
	`CS`.`constructorId` AS `constructorId`,
	`CS`.`position` AS `position`
FROM (
	SELECT
		MAX(`R`.`round`) AS `round`,
		`R`.`year` AS `year`
	FROM `races` AS `R`
	GROUP BY `R`.`year`
) AS `FR`
LEFT OUTER JOIN `races` AS `R` USING (`round`, `year`)
LEFT OUTER JOIN `constructorStandings` AS CS USING (`raceId`);


CREATE TABLE `teams` (
	`constructorId` int(11) NOT NULL,
  `driverId` int(11) NOT NULL,
  `year` int(11) NOT NULL,
	UNIQUE KEY `team_unique_key` (`constructorId`,`driverId`, `year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `teams`
SELECT DISTINCT
	`C`.`constructorId`,
	`D`.`driverId`,
	`R`.`year`
FROM `results` AS `RE`
LEFT OUTER JOIN `races` AS `R`
	ON `RE`.`raceId` = `R`.`raceId`
LEFT OUTER JOIN `constructors` AS `C`
	ON `C`.`constructorId` = `RE`.`constructorId`
LEFT OUTER JOIN `drivers` AS `D`
	ON `D`.`driverId` = `RE`.`driverId`;

ALTER TABLE `circuits` ENGINE=InnoDB;
ALTER TABLE `constructorResults` ENGINE=InnoDB;
ALTER TABLE `constructors` ENGINE=InnoDB;
ALTER TABLE `constructorStandings` ENGINE=InnoDB;
ALTER TABLE `drivers` ENGINE=InnoDB;
ALTER TABLE `driverStandings` ENGINE=InnoDB;
ALTER TABLE `lapTimes` ENGINE=InnoDB;
ALTER TABLE `pitStops` ENGINE=InnoDB;
ALTER TABLE `qualifying` ENGINE=InnoDB;
ALTER TABLE `races` ENGINE=InnoDB;
ALTER TABLE `results` ENGINE=InnoDB;
ALTER TABLE `seasons` ENGINE=InnoDB;
ALTER TABLE `sprintResults` ENGINE=InnoDB;
ALTER TABLE `status` ENGINE=InnoDB;
ALTER TABLE `driverChampionships` ENGINE=InnoDB;
ALTER TABLE `constructorChampionships` ENGINE=InnoDB;

ALTER TABLE `constructorResults` ADD CONSTRAINT `constructorResults_fk_constructorId`
	FOREIGN KEY (`constructorId`) REFERENCES `constructors` (`constructorId`);

ALTER TABLE `constructorResults` ADD CONSTRAINT `constructorResults_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `constructorStandings` ADD CONSTRAINT `constructorStandings_fk_constructorId`
	FOREIGN KEY (`constructorId`) REFERENCES `constructors` (`constructorId`);

ALTER TABLE `constructorStandings` ADD CONSTRAINT `constructorStandings_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `driverStandings` ADD CONSTRAINT `driverStandings_fk_driverId`
	FOREIGN KEY (`driverId`) REFERENCES `drivers` (`driverId`);

ALTER TABLE `driverStandings` ADD CONSTRAINT `driverStandings_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `lapTimes` ADD CONSTRAINT `lapTimes_fk_driverId`
	FOREIGN KEY (`driverId`) REFERENCES `drivers` (`driverId`);

ALTER TABLE `lapTimes` ADD CONSTRAINT `lapTimes_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `pitStops` ADD CONSTRAINT `pitStops_fk_driverId`
	FOREIGN KEY (`driverId`) REFERENCES `drivers` (`driverId`);

ALTER TABLE `pitStops` ADD CONSTRAINT `pitStops_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `qualifying` ADD CONSTRAINT `qualifying_fk_driverId`
	FOREIGN KEY (`driverId`) REFERENCES `drivers` (`driverId`);

ALTER TABLE `qualifying` ADD CONSTRAINT `qualifying_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `qualifying` ADD CONSTRAINT `qualifying_fk_constructorId`
	FOREIGN KEY (`constructorId`) REFERENCES `constructors` (`constructorId`);

ALTER TABLE `races` ADD CONSTRAINT `races_fk_circuitId`
	FOREIGN KEY (`circuitId`) REFERENCES `circuits` (`circuitId`);

ALTER TABLE `results` ADD CONSTRAINT `results_fk_driverId`
	FOREIGN KEY (`driverId`) REFERENCES `drivers` (`driverId`);

ALTER TABLE `results` ADD CONSTRAINT `results_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `results` ADD CONSTRAINT `results_fk_constructorId`
	FOREIGN KEY (`constructorId`) REFERENCES `constructors` (`constructorId`);

ALTER TABLE `sprintResults` ADD CONSTRAINT `sprintResults_fk_driverId`
	FOREIGN KEY (`driverId`) REFERENCES `drivers` (`driverId`);

ALTER TABLE `sprintResults` ADD CONSTRAINT `sprintResults_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `sprintResults` ADD CONSTRAINT `sprintResults_fk_constructorId`
	FOREIGN KEY (`constructorId`) REFERENCES `constructors` (`constructorId`);

ALTER TABLE `driverChampionships` ADD CONSTRAINT `driverChampionships_fk_driverId`
	FOREIGN KEY (`driverId`) REFERENCES `drivers` (`driverId`);

ALTER TABLE `driverChampionships` ADD CONSTRAINT `driverChampionships_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `constructorChampionships` ADD CONSTRAINT `constructorChampionships_fk_raceId`
	FOREIGN KEY (`raceId`) REFERENCES `races` (`raceId`);

ALTER TABLE `constructorChampionships` ADD CONSTRAINT `constructorChampionships_fk_constructorId`
	FOREIGN KEY (`constructorId`) REFERENCES `constructors` (`constructorId`);

ALTER TABLE `teams` ADD CONSTRAINT `teams_fk_constructorId`
	FOREIGN KEY (`constructorId`) REFERENCES `constructors` (`constructorId`);

ALTER TABLE `teams` ADD CONSTRAINT `teams_fk_driverId`
	FOREIGN KEY (`driverId`) REFERENCES `drivers` (`driverId`);

UPDATE `drivers` SET `driverRef` = "mackay_fraser" WHERE `driverRef` = "mackay-fraser";
UPDATE `drivers` SET `driverRef` = "campbell_jones" WHERE `driverRef` = "campbell-jones";
UPDATE `drivers` SET `driverRef` = "lewis_evans" WHERE `driverRef` = "lewis-evans";

UPDATE `constructors` SET `constructorRef` = "arzani_volpini" WHERE `constructorRef` = "arzani-volpini";
UPDATE `constructors` SET `constructorRef` = "behra_porsche" WHERE `constructorRef` = "behra-porsche";
UPDATE `constructors` SET `constructorRef` = "brabham_alfa_romeo" WHERE `constructorRef` = "brabham-alfa_romeo";
UPDATE `constructors` SET `constructorRef` = "brabham_brm" WHERE `constructorRef` = "brabham-brm";
UPDATE `constructors` SET `constructorRef` = "brabham_climax" WHERE `constructorRef` = "brabham-climax";
UPDATE `constructors` SET `constructorRef` = "brabham_ford" WHERE `constructorRef` = "brabham-ford";
UPDATE `constructors` SET `constructorRef` = "brabham_repco" WHERE `constructorRef` = "brabham-repco";
UPDATE `constructors` SET `constructorRef` = "brm_ford" WHERE `constructorRef` = "brm-ford";
UPDATE `constructors` SET `constructorRef` = "cooper_alfa_romeo" WHERE `constructorRef` = "cooper-alfa_romeo";
UPDATE `constructors` SET `constructorRef` = "cooper_ats" WHERE `constructorRef` = "cooper-ats";
UPDATE `constructors` SET `constructorRef` = "cooper_borgward" WHERE `constructorRef` = "cooper-borgward";
UPDATE `constructors` SET `constructorRef` = "cooper_brn" WHERE `constructorRef` = "cooper-brm";
UPDATE `constructors` SET `constructorRef` = "cooper_castellotti" WHERE `constructorRef` = "cooper-castellotti";
UPDATE `constructors` SET `constructorRef` = "cooper_climax" WHERE `constructorRef` = "cooper-climax";
UPDATE `constructors` SET `constructorRef` = "cooper_ferrari" WHERE `constructorRef` = "cooper-ferrari";
UPDATE `constructors` SET `constructorRef` = "cooper_ford" WHERE `constructorRef` = "cooper-ford";
UPDATE `constructors` SET `constructorRef` = "cooper_maserati" WHERE `constructorRef` = "cooper-maserati";
UPDATE `constructors` SET `constructorRef` = "cooper_osca" WHERE `constructorRef` = "cooper-osca";
UPDATE `constructors` SET `constructorRef` = "de_tomaso_alfa_romeo" WHERE `constructorRef` = "de_tomaso-alfa_romeo";
UPDATE `constructors` SET `constructorRef` = "de_tomaso_ferrari" WHERE `constructorRef` = "de_tomaso-ferrari";
UPDATE `constructors` SET `constructorRef` = "de_tomaso_osca" WHERE `constructorRef` = "de_tomaso-osca";
UPDATE `constructors` SET `constructorRef` = "eagle_climax" WHERE `constructorRef` = "eagle-climax";
UPDATE `constructors` SET `constructorRef` = "eagle_weslake" WHERE `constructorRef` = "eagle-weslake";
UPDATE `constructors` SET `constructorRef` = "lds_alfa_romeo" WHERE `constructorRef` = "lds-alfa_romeo";
UPDATE `constructors` SET `constructorRef` = "lds_climax" WHERE `constructorRef` = "lds-climax";
UPDATE `constructors` SET `constructorRef` = "lotus_borgward" WHERE `constructorRef` = "lotus-borgward";
UPDATE `constructors` SET `constructorRef` = "lotus_brn" WHERE `constructorRef` = "lotus-brm";
UPDATE `constructors` SET `constructorRef` = "lotus_climax" WHERE `constructorRef` = "lotus-climax";
UPDATE `constructors` SET `constructorRef` = "lotus_ford" WHERE `constructorRef` = "lotus-ford";
UPDATE `constructors` SET `constructorRef` = "lotus_maserati" WHERE `constructorRef` = "lotus-maserati";
UPDATE `constructors` SET `constructorRef` = "lotus_pw" WHERE `constructorRef` = "lotus-pw";
UPDATE `constructors` SET `constructorRef` = "march_alfa_romeo" WHERE `constructorRef` = "march-alfa_romeo";
UPDATE `constructors` SET `constructorRef` = "march_ford" WHERE `constructorRef` = "march-ford";
UPDATE `constructors` SET `constructorRef` = "matra_ford" WHERE `constructorRef` = "matra-ford";
UPDATE `constructors` SET `constructorRef` = "mclaren_alfa_romeo" WHERE `constructorRef` = "mclaren-alfa_romeo";
UPDATE `constructors` SET `constructorRef` = "mclaren_brn" WHERE `constructorRef` = "mclaren-brm";
UPDATE `constructors` SET `constructorRef` = "mclaren_ford" WHERE `constructorRef` = "mclaren-ford";
UPDATE `constructors` SET `constructorRef` = "mclaren_seren" WHERE `constructorRef` = "mclaren-seren";
UPDATE `constructors` SET `constructorRef` = "shadow_ford" WHERE `constructorRef` = "shadow-ford";
UPDATE `constructors` SET `constructorRef` = "shadow_matra" WHERE `constructorRef` = "shadow-matra";
UPDATE `constructors` SET `constructorRef` = "tec_mec" WHERE `constructorRef` = "tec-mec";

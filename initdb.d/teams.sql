INSERT IGNORE INTO `teams` (`year`, `constructorId`, `driverId`)
VALUES (
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'mercedes'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'hamilton')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'mercedes'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'russell')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'mclaren'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'norris')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'mclaren'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'piastri')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'williams'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'albon')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'williams'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'sargeant')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'ferrari'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'leclerc')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'ferrari'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'sainz')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'red_bull'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'max_verstappen')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'red_bull'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'perez')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'alfa'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'bottas')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'alfa'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'zhou')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'aston_martin'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'stroll')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'aston_martin'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'alonso')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'alphatauri'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'tsunoda')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'alphatauri'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'de_vries')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'alpine'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'gasly')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'alpine'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'ocon')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'haas'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'kevin_magnussen')
),
(
	2023,
	(SELECT `constructorId` FROM `constructors` WHERE `constructorRef` = 'haas'),
	(SELECT `driverId` FROM `drivers` WHERE `driverRef` = 'hulkenberg')
);


-- path: constructors/:constructorRef.json
-- meta: {pickFirst: true}
-- params:query:start
SELECT `constructorRef` FROM `constructors`;
-- params:query:end

-- main:query:start
SELECT * FROM `constructors` AS `C` WHERE `C`.`constructorRef` = :constructorRef
-- main:query:end

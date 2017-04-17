INSERT INTO "FactionStatistics" (
    "week", 
    "region", 
    "city", 
    "cityId",
    "updatedAt",
    "createdAt",
    "points",
    "faction"
    ) 
VALUES (
    ${week}, 
    ${region},
    ${city},
    ${cityId},
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    ${points},
    ${faction}
)
ON CONFLICT ("cityId", "week") DO UPDATE 
    SET points = excluded.points + "FactionStatistics".points,
    "updatedAt" = CURRENT_TIMESTAMP
RETURNING *;
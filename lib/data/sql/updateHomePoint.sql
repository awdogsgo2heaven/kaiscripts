update "Accounts"
set "homePoint" = ST_SetSRID(ST_POINT(${lon}, ${lat}), 4326),
"homePointUpdatedAt" = CURRENT_TIMESTAMP
where id = ${id} and ((CURRENT_TIMESTAMP > ("homePointUpdatedAt" + '7 day'::interval)) or "homePointUpdatedAt" is null);

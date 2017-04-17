select count("item") as count
from "AvatarItems"
where "AvatarId" = ${avatarId} and "item" = ${item}
group by "item" limit 1;
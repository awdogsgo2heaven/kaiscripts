select "itemType", count("itemType") as count
from "AvatarItems"
where "AvatarId" = ${avatarId}
group by "itemType";

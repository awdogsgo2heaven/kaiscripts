update "Accounts"
  set "hashedPassword" = ${hashedPassword},
  salt = ${salt}
where id = ${id}

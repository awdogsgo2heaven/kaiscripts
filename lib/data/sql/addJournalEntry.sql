update "Avatars" set journal = array_append(journal, ${entry}) where id = ${id} and NOT (${entry} = ANY (journal));

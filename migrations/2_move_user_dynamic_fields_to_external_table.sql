with copied_rows as (
    select
        uuid_generate_v4() as id,
        "username",
        "displayedName",
        "privateKey" as "passwordHash",
        bio,
        id as "userId",
        "avatarId"
    from "user"
    where "privateKey" is not null
)
insert into user_dynamic_fields
select * from copied_rows;

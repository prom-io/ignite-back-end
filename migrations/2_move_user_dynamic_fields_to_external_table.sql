create table public.user_dynamic_fields
(
    id character varying collate pg_catalog."default" not null ,
    username character varying collate pg_catalog."default" not null ,
    "displayedName" character varying collate pg_catalog."default",
    "passwordHash" character varying collate pg_catalog."default",
    bio character varying collate pg_catalog."default",
    "userId" character varying collate pg_catalog."default" not null,
    "avatarId" character varying not null pg_catalog."default",
    constraint "PK_2b0abcedb403003fb2534099590" primary key (id),
    constraint "FK_1dec2d9b2eef9f46893a99cf8ad" foreign key ("avatarId")
        references public.media_attachment (id) match simple
        on update no action
        on delete no action,
    constraint "FK_3df4f5518013875ea6c0ac7d8e1" foreign key ("userId")
        references public."user" (id) match simple
        on update no action
        on delete no action
);

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

alter table user_dynamic_fields add column "createdAt" timestamp without timezone;

update user_dynamic_fields set "createdAt" = now();

create index "IDX_22f2df2c042ecf682800d0ec02"
    on public.user_dynamic_fields using btree
        (username collate pg_catalog."default" asc nulls last )
    tablespace pg_default;

create index "IDX_3df4f5518013875ea6c0ac7d8e"
    on public.user_dynamic_fields using btree
        ("userId" collate pg_catalog."default" asc nulls last )
    tablespace pg_default;

create index "IDX_ef6b50a57dc718b5ede0b25ee5"
    on public.user_dynamic_fields using btree
        ("createdAt" asc nulls last )
    tablespace pg_default;

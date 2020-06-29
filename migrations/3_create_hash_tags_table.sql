create table public.hash_tag
(
    id character varying collate pg_catalog."default" not null ,
    name character varying collate pg_catalog."default" not null ,
    "createdAt" timestamp without time zone not null ,
    language character varying collate pg_catalog."default" not null ,
    "postsCount" integer not null ,
    constraint "PK_a6640a31d78e11097a949656191" primary key (id)
);

create index "IDX_4773b7ea013f9e024e4e58cd31"
    on public.hash_tag using btree
        (language collate pg_catalog."default" asc nulls last )
    tablespace pg_default;

create index "IDX_a62d659726a7c3c5fb6757bb34"
    on public.hash_tag using btree
        (name collate pg_catalog."default" asc nulls last )
    tablespace pg_default;

create table public.status_hash_tags_hash_tag
(
    "statusId" character varying collate pg_catalog."default" not null ,
    "hashTagId" character varying collate pg_catalog."default" not null ,
    constraint "PK_5c330f1cd6121b4fc47d311295f" primary key ("statusId", "hashTagId"),
    constraint "FK_383124df1be91906c5e6e2ba858" foreign key ("statusId")
        references public.status (id) match simple
        on update no action
        on delete cascade ,
    constraint "FK_94cc265db511887ddbb53f1c96a" foreign key ("hashTagId")
        references public.hash_tag (id) match simple
        on update no action
        on delete no action
)
    tablespace pg_default;

create index "IDX_383124df1be91906c5e6e2ba85"
    on public.status_hash_tags_hash_tag using btree
        ("statusId" collate pg_catalog."default" asc nulls last )
    tablespace pg_default;;

create index "IDX_94cc265db511887ddbb53f1c96"
    on public.status_hash_tags_hash_tag using btree
        ("hashTagId" COLLATE pg_catalog."default" asc nulls last )
    tablespace pg_default;

create table public.hash_tag_subscription
(
    id character varying collate pg_catalog."default" not null,
    "createdAt" timestamp without time zone not null,
    reverted boolean not null ,
    "userId" character varying collate pg_catalog."default",
    "hashTagId" character varying collate pg_catalog."default",
    constraint "PK_71eca52761939de48dced535dc6" primary key (id),
    constraint "FK_38ebaddbcdb7a84f7cfdd762008" foreign key ("userId")
        references public."user" (id) match simple
        on update no action
        on delete no action ,
    constraint "FK_5b812c7effb62ae93dc3d3fd858" foreign key ("hashTagId")
        references public.hash_tag (id) match simple
        on update no action
        on delete no action
)

    tablespace pg_default;

create index "IDX_38ebaddbcdb7a84f7cfdd76200"
    on public.hash_tag_subscription using btree
        ("userId" collate pg_catalog."default" asc nulls last )
    tablespace pg_default;

create index "IDX_5b812c7effb62ae93dc3d3fd85"
    on public.hash_tag_subscription using btree
        ("hashTagId" collate pg_catalog."default" asc nulls last )
    tablespace pg_default;

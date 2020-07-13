create table public.sign_up_reference
(
    id character varying collate pg_catalog."default" not null ,
    config jsonb NOT NULL,
    "createdAt" timestamp without time zone not null ,
    "expiresAt" timestamp without time zone,
    "maxUses" integer,
    "registeredUsersCount" integer not null ,
    "createdById" character varying collate pg_catalog."default",
    constraint "PK_92b2283f1879b1a2b05b5e54e5a" primary key (id),
    constraint "FK_a58736e7bbcdd964098537bf677" foreign key ("createdById")
        references public."user" (id) match simple
        on update no action
        on delete no action
)

    tablespace pg_default;

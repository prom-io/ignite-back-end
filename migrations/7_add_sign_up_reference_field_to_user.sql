alter table "user" add column "signUpReferenceId" varchar null;
alter table "user" add constraint FK_c76e46ba70678e7875d789d6940 foreign key ("signUpReferenceId") references sign_up_reference.id;

create index "IDX_c76e46ba70678e7875d789d694"
    on public."user" using btree
        ("signUpReferenceId" collate pg_catalog."default" asc nulls last )
    tablespace pg_default;

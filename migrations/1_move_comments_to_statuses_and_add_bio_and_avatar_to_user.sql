alter table status add column "referredStatusId" varchar;
alter table status add column "statusReferenceType" varchar;

update status
set "referredStatusId" = "repostedStatusId", "statusReferenceType" = 'REPOST'
where "repostedStatusId" is not null;

alter table status alter column remote drop not null;
alter table status alter column "updatedAt" drop not null;

insert into status (id, text, "createdAt", "authorId", "referredStatusId")
select id, text, "createdAt", "authorId", "statusId" from comment;

update status set "statusReferenceType" = 'COMMENT' where "statusReferenceType" is null and "referredStatusId" is not null;
update status set "referredStatusId" = "repostedCommentId", "statusReferenceType" = 'REPOST' where "repostedCommentId" is not null;
update status set "updatedAt" = "createdAt" where "updatedAt" is null;
update status set remote = false where remote is null;

alter table status alter column remote set not null;
alter table status alter column "updatedAt" set not null;
alter table status add constraint FK_8ec10269dfadcde3991fc20791e foreign key ("referredStatusId") references status(id);

alter table "user" add column bio varchar null;
alter table "user" add column "avatarId" varchar null;
alter table "user" add constraint FK_58f5c71eaab331645112cf8cfa5 foreign key ("avatarId") references media_attachment(id);

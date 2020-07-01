alter table user_device add column "fcmTokenExpired" boolean;
update user_device set "fcmTokenExpired" = false;
alter table user_device alter column "fcmTokenExpired" set not null;

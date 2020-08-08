import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1596761867498 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(sql)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
    }
}

/**
 * До этой первой миграции схемой БД управлял сам TypeORM
 * автоматическим образом (эта фича называется schema synchronization, можно почитать о ней).
 * Было принято решение перейти на миграции, потому что из-за schema synchronization данные
 * могут теряться, и поэтому она не пригодна для продакешна.
 * Так как на тот момент уже существовала схема базы данных (таблицы, индексы, внешние ключи и тд),
 * решил просто экспортить схему БД с помощью `pg_dump -s`, и просто запустить ее как первую миграцию.
 * Еще я закомментировал некоторые команды в этом SQL, потому что они либо помешают либо не нужны.
 */
const sql = `
--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Debian 12.2-1.pgdg100+1)
-- Dumped by pg_dump version 12.2 (Debian 12.2-1.pgdg100+1)

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

-- COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


-- SET default_tablespace = '';

-- SET default_table_access_method = heap;

--
-- Name: btfs_hash; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.btfs_hash (
    id character varying NOT NULL,
    "btfsCid" character varying NOT NULL,
    synced boolean NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "peerIp" character varying,
    "peerWallet" character varying
);


-- ALTER TABLE public.btfs_hash OWNER TO kehlani;

--
-- Name: comment; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.comment (
    id character varying NOT NULL,
    text character varying NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone,
    "btfsHash" character varying,
    "peerIp" character varying,
    "peerWallet" character varying,
    mpath character varying DEFAULT ''::character varying,
    "authorId" character varying,
    "statusId" character varying,
    "repostedCommentId" character varying
);


-- ALTER TABLE public.comment OWNER TO kehlani;

--
-- Name: comment_media_attachments_media_attachment; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.comment_media_attachments_media_attachment (
    "commentId" character varying NOT NULL,
    "mediaAttachmentId" character varying NOT NULL
);


-- ALTER TABLE public.comment_media_attachments_media_attachment OWNER TO kehlani;

--
-- Name: hash_tag; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.hash_tag (
    id character varying NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    language character varying NOT NULL,
    "postsCount" integer NOT NULL
);


-- ALTER TABLE public.hash_tag OWNER TO kehlani;

--
-- Name: hash_tag_subscription; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.hash_tag_subscription (
    id character varying NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    reverted boolean NOT NULL,
    "userId" character varying,
    "hashTagId" character varying
);


-- ALTER TABLE public.hash_tag_subscription OWNER TO kehlani;

--
-- Name: media_attachment; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.media_attachment (
    id character varying NOT NULL,
    "mimeType" character varying NOT NULL,
    format character varying NOT NULL,
    width integer,
    height integer,
    name character varying,
    "siaLink" character varying,
    "btfsCid" character varying,
    "peerIp" character varying,
    "peerWallet" character varying,
    "previewSize" integer,
    "originalId" character varying
);


-- ALTER TABLE public.media_attachment OWNER TO kehlani;

--
-- Name: notification; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.notification (
    id character varying NOT NULL,
    type character varying NOT NULL,
    "notificationObjectId" character varying NOT NULL,
    read boolean NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "receiverId" character varying
);


-- ALTER TABLE public.notification OWNER TO kehlani;

--
-- Name: sign_up_reference; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.sign_up_reference (
    id character varying NOT NULL,
    config jsonb NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "expiresAt" timestamp without time zone,
    "maxUses" integer,
    "registeredUsersCount" integer NOT NULL,
    "createdById" character varying
);


-- ALTER TABLE public.sign_up_reference OWNER TO kehlani;

--
-- Name: status; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.status (
    id character varying NOT NULL,
    text character varying(10000),
    remote boolean NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "authorId" character varying,
    "btfsHash" character varying,
    "peerIp" character varying,
    "peerWallet" character varying,
    mpath character varying DEFAULT ''::character varying,
    "referredStatusId" character varying,
    "statusReferenceType" character varying
);


-- ALTER TABLE public.status OWNER TO kehlani;

--
-- Name: status_hash_tags_hash_tag; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.status_hash_tags_hash_tag (
    "statusId" character varying NOT NULL,
    "hashTagId" character varying NOT NULL
);


-- ALTER TABLE public.status_hash_tags_hash_tag OWNER TO kehlani;

--
-- Name: status_like; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.status_like (
    id character varying NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "statusId" character varying,
    "userId" character varying,
    "btfsHash" character varying,
    "peerIp" character varying,
    "peerWallet" character varying,
    "saveUnlikeToBtfs" boolean,
    reverted boolean,
    "revertedAt" timestamp without time zone
);


-- ALTER TABLE public.status_like OWNER TO kehlani;

--
-- Name: status_media_attachments_media_attachment; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.status_media_attachments_media_attachment (
    "statusId" character varying NOT NULL,
    "mediaAttachmentId" character varying NOT NULL
);


-- ALTER TABLE public.status_media_attachments_media_attachment OWNER TO kehlani;

--
-- Name: user; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public."user" (
    id character varying NOT NULL,
    "ethereumAddress" character varying NOT NULL,
    "privateKey" character varying,
    "displayedName" character varying,
    username character varying,
    "createdAt" timestamp without time zone NOT NULL,
    remote boolean NOT NULL,
    "avatarUri" character varying,
    "btfsHash" character varying,
    "peerIp" character varying,
    "peerWallet" character varying,
    "btfsCid" character varying,
    bio character varying,
    "avatarId" character varying,
    "preferencesId" character varying,
    "signUpReferenceId" character varying,
    "externalUrl" character varying
);


-- ALTER TABLE public."user" OWNER TO kehlani;

--
-- Name: user_device; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.user_device (
    id character varying NOT NULL,
    "fcmToken" character varying NOT NULL,
    "userId" character varying,
    "fcmTokenExpired" boolean NOT NULL
);


-- ALTER TABLE public.user_device OWNER TO kehlani;

--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.user_preferences (
    id character varying NOT NULL,
    language character varying
);


-- ALTER TABLE public.user_preferences OWNER TO kehlani;

--
-- Name: user_statistics; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.user_statistics (
    id character varying NOT NULL,
    "statusesCount" integer NOT NULL,
    "followsCount" integer NOT NULL,
    "followersCount" integer NOT NULL,
    "userId" character varying
);


-- ALTER TABLE public.user_statistics OWNER TO kehlani;

--
-- Name: user_subscription; Type: TABLE; Schema: public; Owner: kehlani
--

CREATE TABLE public.user_subscription (
    id character varying NOT NULL,
    "createdAt" timestamp without time zone NOT NULL,
    "subscribedUserId" character varying,
    "subscribedToId" character varying,
    "btfsHash" character varying,
    "peerIp" character varying,
    "peerWallet" character varying,
    "saveUnsubscriptionToBtfs" boolean,
    reverted boolean,
    "revertedAt" timestamp without time zone
);


-- ALTER TABLE public.user_subscription OWNER TO kehlani;

--
-- Name: user_device PK_0232591a0b48e1eb92f3ec5d0d1; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.user_device
    ADD CONSTRAINT "PK_0232591a0b48e1eb92f3ec5d0d1" PRIMARY KEY (id);


--
-- Name: comment PK_0b0e4bbc8415ec426f87f3a88e2; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);


--
-- Name: comment_media_attachments_media_attachment PK_4242201c519fbe2213000597808; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.comment_media_attachments_media_attachment
    ADD CONSTRAINT "PK_4242201c519fbe2213000597808" PRIMARY KEY ("commentId", "mediaAttachmentId");


--
-- Name: status_hash_tags_hash_tag PK_5c330f1cd6121b4fc47d311295f; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status_hash_tags_hash_tag
    ADD CONSTRAINT "PK_5c330f1cd6121b4fc47d311295f" PRIMARY KEY ("statusId", "hashTagId");


--
-- Name: status_like PK_62045f831d72edae8c03e5b1de9; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status_like
    ADD CONSTRAINT "PK_62045f831d72edae8c03e5b1de9" PRIMARY KEY (id);


--
-- Name: notification PK_705b6c7cdf9b2c2ff7ac7872cb7; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY (id);


--
-- Name: hash_tag_subscription PK_71eca52761939de48dced535dc6; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.hash_tag_subscription
    ADD CONSTRAINT "PK_71eca52761939de48dced535dc6" PRIMARY KEY (id);


--
-- Name: sign_up_reference PK_92b2283f1879b1a2b05b5e54e5a; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.sign_up_reference
    ADD CONSTRAINT "PK_92b2283f1879b1a2b05b5e54e5a" PRIMARY KEY (id);


--
-- Name: btfs_hash PK_a53884e4e7c3c089bd09acef357; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.btfs_hash
    ADD CONSTRAINT "PK_a53884e4e7c3c089bd09acef357" PRIMARY KEY (id);


--
-- Name: hash_tag PK_a6640a31d78e11097a949656191; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.hash_tag
    ADD CONSTRAINT "PK_a6640a31d78e11097a949656191" PRIMARY KEY (id);


--
-- Name: media_attachment PK_b13383401c0375193cc36b3939f; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.media_attachment
    ADD CONSTRAINT "PK_b13383401c0375193cc36b3939f" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: status PK_e12743a7086ec826733f54e1d95; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY (id);


--
-- Name: status_media_attachments_media_attachment PK_e24e17854c5fda419d7bf232e49; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status_media_attachments_media_attachment
    ADD CONSTRAINT "PK_e24e17854c5fda419d7bf232e49" PRIMARY KEY ("statusId", "mediaAttachmentId");


--
-- Name: user_preferences PK_e8cfb5b31af61cd363a6b6d7c25; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT "PK_e8cfb5b31af61cd363a6b6d7c25" PRIMARY KEY (id);


--
-- Name: user_subscription PK_ec4e57f4138e339fb111948a16f; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.user_subscription
    ADD CONSTRAINT "PK_ec4e57f4138e339fb111948a16f" PRIMARY KEY (id);


--
-- Name: user_statistics PK_fa0c135e6eb8b7d6507c0461b61; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.user_statistics
    ADD CONSTRAINT "PK_fa0c135e6eb8b7d6507c0461b61" PRIMARY KEY (id);


--
-- Name: user_statistics REL_163d3173e678c93fd100a33797; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.user_statistics
    ADD CONSTRAINT "REL_163d3173e678c93fd100a33797" UNIQUE ("userId");


--
-- Name: user UQ_8e0bb2d261fc46c8fd013333712; Type: CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_8e0bb2d261fc46c8fd013333712" UNIQUE ("preferencesId");


--
-- Name: IDX_082592c0a87d86bad9f84746bf; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_082592c0a87d86bad9f84746bf" ON public.comment_media_attachments_media_attachment USING btree ("mediaAttachmentId");


--
-- Name: IDX_349cd35fb8239a35379ae97d48; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_349cd35fb8239a35379ae97d48" ON public.user_subscription USING btree ("subscribedUserId");


--
-- Name: IDX_383124df1be91906c5e6e2ba85; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_383124df1be91906c5e6e2ba85" ON public.status_hash_tags_hash_tag USING btree ("statusId");


--
-- Name: IDX_38ebaddbcdb7a84f7cfdd76200; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_38ebaddbcdb7a84f7cfdd76200" ON public.hash_tag_subscription USING btree ("userId");


--
-- Name: IDX_4773b7ea013f9e024e4e58cd31; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_4773b7ea013f9e024e4e58cd31" ON public.hash_tag USING btree (language);


--
-- Name: IDX_578db8efa1209ffd59be91e32a; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_578db8efa1209ffd59be91e32a" ON public.status_media_attachments_media_attachment USING btree ("statusId");


--
-- Name: IDX_5b812c7effb62ae93dc3d3fd85; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_5b812c7effb62ae93dc3d3fd85" ON public.hash_tag_subscription USING btree ("hashTagId");


--
-- Name: IDX_68b5af41204826f95ec9eecaba; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_68b5af41204826f95ec9eecaba" ON public.status_media_attachments_media_attachment USING btree ("mediaAttachmentId");


--
-- Name: IDX_72762cb8f93d366be686fc8049; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_72762cb8f93d366be686fc8049" ON public.media_attachment USING btree ("originalId");


--
-- Name: IDX_882d97d2c9999210fa33150b69; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_882d97d2c9999210fa33150b69" ON public.user_subscription USING btree ("subscribedToId");


--
-- Name: IDX_8ec10269dfadcde3991fc20791; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_8ec10269dfadcde3991fc20791" ON public.status USING btree ("referredStatusId");


--
-- Name: IDX_94cc265db511887ddbb53f1c96; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_94cc265db511887ddbb53f1c96" ON public.status_hash_tags_hash_tag USING btree ("hashTagId");


--
-- Name: IDX_a62d659726a7c3c5fb6757bb34; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_a62d659726a7c3c5fb6757bb34" ON public.hash_tag USING btree (name);


--
-- Name: IDX_af4ef48b6d4cfe9c9acc9abb28; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_af4ef48b6d4cfe9c9acc9abb28" ON public.status_like USING btree ("userId");


--
-- Name: IDX_bec1bdbd86ea2fbeb4c588feb2; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_bec1bdbd86ea2fbeb4c588feb2" ON public.status USING btree ("statusReferenceType");


--
-- Name: IDX_c76e46ba70678e7875d789d694; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_c76e46ba70678e7875d789d694" ON public."user" USING btree ("signUpReferenceId");


--
-- Name: IDX_d12add4dd9fc001a8c01d4348f; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_d12add4dd9fc001a8c01d4348f" ON public.comment_media_attachments_media_attachment USING btree ("commentId");


--
-- Name: IDX_ea8fcc8de18855aba8f01a57a0; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_ea8fcc8de18855aba8f01a57a0" ON public.status_like USING btree ("statusId");


--
-- Name: IDX_eec1c27eef9ec0207657ba5c95; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_eec1c27eef9ec0207657ba5c95" ON public.status USING btree ("btfsHash");


--
-- Name: IDX_f33610a900db0e0979b9617cda; Type: INDEX; Schema: public; Owner: kehlani
--

CREATE INDEX "IDX_f33610a900db0e0979b9617cda" ON public.status USING btree ("authorId");


--
-- Name: comment_media_attachments_media_attachment FK_082592c0a87d86bad9f84746bf4; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.comment_media_attachments_media_attachment
    ADD CONSTRAINT "FK_082592c0a87d86bad9f84746bf4" FOREIGN KEY ("mediaAttachmentId") REFERENCES public.media_attachment(id) ON DELETE CASCADE;


--
-- Name: user_statistics FK_163d3173e678c93fd100a337976; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.user_statistics
    ADD CONSTRAINT "FK_163d3173e678c93fd100a337976" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: comment FK_276779da446413a0d79598d4fbd; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_276779da446413a0d79598d4fbd" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


--
-- Name: comment FK_2a030fe8f41f2a4e3f3320c3d84; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_2a030fe8f41f2a4e3f3320c3d84" FOREIGN KEY ("repostedCommentId") REFERENCES public.comment(id);


--
-- Name: user_subscription FK_349cd35fb8239a35379ae97d48a; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.user_subscription
    ADD CONSTRAINT "FK_349cd35fb8239a35379ae97d48a" FOREIGN KEY ("subscribedUserId") REFERENCES public."user"(id);


--
-- Name: status_hash_tags_hash_tag FK_383124df1be91906c5e6e2ba858; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status_hash_tags_hash_tag
    ADD CONSTRAINT "FK_383124df1be91906c5e6e2ba858" FOREIGN KEY ("statusId") REFERENCES public.status(id) ON DELETE CASCADE;


--
-- Name: hash_tag_subscription FK_38ebaddbcdb7a84f7cfdd762008; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.hash_tag_subscription
    ADD CONSTRAINT "FK_38ebaddbcdb7a84f7cfdd762008" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: status_media_attachments_media_attachment FK_578db8efa1209ffd59be91e32aa; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status_media_attachments_media_attachment
    ADD CONSTRAINT "FK_578db8efa1209ffd59be91e32aa" FOREIGN KEY ("statusId") REFERENCES public.status(id) ON DELETE CASCADE;


--
-- Name: user FK_58f5c71eaab331645112cf8cfa5; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES public.media_attachment(id);


--
-- Name: hash_tag_subscription FK_5b812c7effb62ae93dc3d3fd858; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.hash_tag_subscription
    ADD CONSTRAINT "FK_5b812c7effb62ae93dc3d3fd858" FOREIGN KEY ("hashTagId") REFERENCES public.hash_tag(id);


--
-- Name: status_media_attachments_media_attachment FK_68b5af41204826f95ec9eecaba6; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status_media_attachments_media_attachment
    ADD CONSTRAINT "FK_68b5af41204826f95ec9eecaba6" FOREIGN KEY ("mediaAttachmentId") REFERENCES public.media_attachment(id) ON DELETE CASCADE;


--
-- Name: media_attachment FK_72762cb8f93d366be686fc80492; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.media_attachment
    ADD CONSTRAINT "FK_72762cb8f93d366be686fc80492" FOREIGN KEY ("originalId") REFERENCES public.media_attachment(id);


--
-- Name: notification FK_758d70a0e61243171e785989070; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT "FK_758d70a0e61243171e785989070" FOREIGN KEY ("receiverId") REFERENCES public."user"(id);


--
-- Name: user_subscription FK_882d97d2c9999210fa33150b694; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.user_subscription
    ADD CONSTRAINT "FK_882d97d2c9999210fa33150b694" FOREIGN KEY ("subscribedToId") REFERENCES public."user"(id);


--
-- Name: user FK_8e0bb2d261fc46c8fd013333712; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_8e0bb2d261fc46c8fd013333712" FOREIGN KEY ("preferencesId") REFERENCES public.user_preferences(id);


--
-- Name: status FK_8ec10269dfadcde3991fc20791e; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT "FK_8ec10269dfadcde3991fc20791e" FOREIGN KEY ("referredStatusId") REFERENCES public.status(id);


--
-- Name: status_hash_tags_hash_tag FK_94cc265db511887ddbb53f1c96a; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status_hash_tags_hash_tag
    ADD CONSTRAINT "FK_94cc265db511887ddbb53f1c96a" FOREIGN KEY ("hashTagId") REFERENCES public.hash_tag(id) ON DELETE CASCADE;


--
-- Name: comment FK_a29af47f21d587f002c998ce072; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_a29af47f21d587f002c998ce072" FOREIGN KEY ("statusId") REFERENCES public.status(id);


--
-- Name: sign_up_reference FK_a58736e7bbcdd964098537bf677; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.sign_up_reference
    ADD CONSTRAINT "FK_a58736e7bbcdd964098537bf677" FOREIGN KEY ("createdById") REFERENCES public."user"(id);


--
-- Name: status_like FK_af4ef48b6d4cfe9c9acc9abb288; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status_like
    ADD CONSTRAINT "FK_af4ef48b6d4cfe9c9acc9abb288" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: user_device FK_bda1afb30d9e3e8fb30b1e90af7; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.user_device
    ADD CONSTRAINT "FK_bda1afb30d9e3e8fb30b1e90af7" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: user FK_c76e46ba70678e7875d789d6940; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "FK_c76e46ba70678e7875d789d6940" FOREIGN KEY ("signUpReferenceId") REFERENCES public.sign_up_reference(id);


--
-- Name: comment_media_attachments_media_attachment FK_d12add4dd9fc001a8c01d4348fa; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.comment_media_attachments_media_attachment
    ADD CONSTRAINT "FK_d12add4dd9fc001a8c01d4348fa" FOREIGN KEY ("commentId") REFERENCES public.comment(id) ON DELETE CASCADE;


--
-- Name: status_like FK_ea8fcc8de18855aba8f01a57a0d; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status_like
    ADD CONSTRAINT "FK_ea8fcc8de18855aba8f01a57a0d" FOREIGN KEY ("statusId") REFERENCES public.status(id);


--
-- Name: status FK_f33610a900db0e0979b9617cda8; Type: FK CONSTRAINT; Schema: public; Owner: kehlani
--

ALTER TABLE ONLY public.status
    ADD CONSTRAINT "FK_f33610a900db0e0979b9617cda8" FOREIGN KEY ("authorId") REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

`

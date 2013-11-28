
# --- !Ups

create table comment (
  id                        bigint not null,
  enquiry_id                bigint,
  creator_id                bigint,
  comment                   text,
  created_on                timestamp,
  constraint pk_comment primary key (id))
;

create table enquiry (
  id                        bigint not null,
  creator_id                bigint,
  assigned_to               bigint,
  first_name                varchar(255),
  last_name                 varchar(255),
  contact_number            varchar(255),
  address                   text,
  email                     varchar(255),
  course_type               varchar(255),
  country_interested        varchar(255),
  high_school_score         varchar(255),
  senior_secondary_score    varchar(255),
  graduation_score          varchar(255),
  test_scores               varchar(255),
  program                   varchar(255),
  intake                    varchar(255),
  source                    varchar(255),
  remarks                   text,
  follow_up                 timestamp,
  created_on                timestamp,
  modified_on               timestamp,
  status                    varchar(255),
  constraint pk_enquiry primary key (id))
;

create table users (
  id                        bigint not null,
  email                     varchar(255),
  first_name                varchar(255),
  last_name                 varchar(255),
  password                  varchar(255),
  role_type                 varchar(255),
  last_login                timestamp,
  active                    boolean,
  constraint uq_users_email unique (email),
  constraint pk_users primary key (id))
;

create sequence comment_seq;

create sequence enquiry_seq;

create sequence users_seq;






# --- !Downs

drop table if exists comment cascade;

drop table if exists enquiry cascade;

drop table if exists users cascade;

drop sequence if exists comment_seq;

drop sequence if exists enquiry_seq;

drop sequence if exists users_seq;



# --- !Ups

create table services (
  id                        bigint not null,
  name                      varchar(255),
  created_on                timestamp,
  constraint pk_services primary key (id))
;

create table enquiry_services (
  service_id                bigint,
  enquiry_id                bigint)
;

create table countries (
  id                        bigint not null,
  name                      varchar(255),
  created_on                timestamp,
  constraint pk_countries primary key (id))
;

create table enquiry_countries (
  country_id                bigint,
  enquiry_id                bigint)
;

create sequence services_seq;

create sequence enquiry_services_seq;

create sequence countries_seq;

create sequence enquiry_countries_seq;

alter table enquiry drop column if exists assigned_to;

alter table user_to_enquiry 
		drop constraint if exists pk_user_to_enquiry, 
		drop column if exists id;


# --- !Downs

drop table if exist services cascade;

drop table if exists enquiry_services cascade;

drop table if exist countries cascade;

drop table if exists enquiry_countries cascade;

drop sequence if exist services_seq;

drop sequence if exists enquiry_services_seq cascade;

drop sequence if exist countries_seq;

drop sequence if exists enquiry_countries_seq;

alter table enquiry add column assigned_to bigint;

alter table user_to_enquiry 
		add column id bigint,
		add constraint pk_user_to_enquiry PRIMARY KEY (id);
		
		
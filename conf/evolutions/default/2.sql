# --- !Ups

create table user_to_enquiry (
  id                        bigint not null,
  user_id                   bigint,
  enquiry_id                bigint,
  constraint pk_user_to_enquiry primary key (id))
;

create sequence user_to_enquiry_seq;

# --- !Downs

drop table if exists user_to_enquiry cascade;

drop sequence if exists user_to_enquiry_seq;
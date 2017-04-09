create table members(
	email varchar2(30) not null,
	password varchar2(30) not null
);

create table filefolders(
	email varchar2(30) not null,
	path varchar2(260) not null,
	info varchar2(200) not null,
	isshared char(1) default 'F',
	ffid number primary key,
	isdeleted char(1) default 'F'
);
 
create table shares(
	ffid number references filefolders(ffid),
	auth varchar2(10) not null,
	email varchar2(30) not null
);

create table bookmarks(
	ffid number references filefolders(ffid),
	email varchar2(30) not null,
	bookstate char(1) default 'T'
);

create sequence filefolders_seq;

<!--테스트 sql --!>
   
insert into filefolders values(
 'kty2589a@naver.com',
 'C:\freemiere\kty2589a@naver.com\shared\test1.jpg',
 'asdasdasdas',
 default,
 filefolders_seq.nextval,
 default);

insert into filefolders values(
 'kty2589a@naver.com',
 'C:\freemiere\kty2589a@naver.com\test2.jpg',
 'test',
 default,
 filefolders_seq.nextval,
 default);

 insert into shares values(
   2,
   'owner',
   'duk@naver.com');

 insert into shares values(
   2,
   'editor',
   'lullulalal@naver.com');


insert into filefolders values(
 'duk@naver.com',
 'C:\freemiere\duk@naver.com\shared\sharedimg.jpeg',
 'test',
 default,
 filefolders_seq.nextval,
 default);

insert into filefolders values(
 'lullulalal@naver.com',
 'C:\freemiere\lullulalal@naver.com\myshared\',
 'test',
 't',
 filefolders_seq.nextval,
 default);

 insert into shares values(
  4,
   'editor',
 'duk@naver.com');

 insert into shares values(
  4,
  'owner',
  'lullulalal@naver.com');


insert into filefolders values(
 'lullulalal@naver.com',
 'C:\freemiere\lullulalal@naver.com\img.jpeg',
 'test',
 default,
 filefolders_seq.nextval,
 't');

insert into filefolders values(
 'lullulalal@naver.com',
 'C:\freemiere\lullulalal@naver.com\bookmark\',
 'test',
 default,
 filefolders_seq.nextval,
 default);

 insert into bookmarks values(
  6,
  'lullulalal@naver.com',
  't');
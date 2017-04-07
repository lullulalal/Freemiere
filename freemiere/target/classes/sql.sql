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
 'ohayu@naver.com',
 'C:\freemiere\ohayu@naver.com\test\',
 'yoo3',
 default,
 filefolders_seq.nextval,
 default);

insert into filefolders values(
 'ohayu@naver.com',
 'C:\freemiere\ohayu@naver.com\share\',
 'test',
 't',
 filefolders_seq.nextval,
 default);

 insert into shares values(
   125,
   'editor',
   'lullulalal@naver.com');

 insert into shares values(
   101,
   'editor',
   'oahyu@naver.com');


insert into filefolders values(
 'duk@naver.com',
 'C:\freemiere\duk@naver.com\shared\sharedimg.jpeg',
 'test',
 default,
 filefolders_seq.nextval,
 default);

insert into filefolders values(
 'lullulalal@naver.com',
 'C:\freemiere\lullulalal@naver.com\test\',
 'test',
 't',
 filefolders_seq.nextval,
 default);

 insert into filefolders values(
 'ohayu@naver.com',
 'C:\freemiere\ohayu@naver.com\bookmark\share2\',
 'test',
 't',
 filefolders_seq.nextval,
 default);
 
 insert into shares values(
  100,
   'owner',
 'ohayu@naver.com');

 insert into shares values(
  100,
  'owner',
  'lullulalal@naver.com');
  
  insert into shares values(
  125,
  'owner',
  'ohayu@naver.com');


insert into filefolders values(
 'lullulalal@naver.com',
 'C:\freemiere\lullulalal@naver.com\img.jpeg',
 'test1',
 default,
 filefolders_seq.nextval,
 't');

insert into filefolders values(
 'lullulalal@naver.com',
 'C:\freemiere\lullulalal@naver.com\folder1\',
 'test',
 default,
 filefolders_seq.nextval,
 default);

 insert into bookmarks values(
  123,
  'ohayu@naver.com',
   't');
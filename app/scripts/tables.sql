# MySQL scripts for creating/recreating the databas
#
# Version:		0.0.2
# Date:			30 January 2020
# Author:		Ashley Williams

## Dont do this on mudfoot
# First create the database if it does not already exist...
#CREATE DATABASE IF NOT EXISTS chittr;

# First drop the tables if they do not already exist
# Note: has to be done in a certian order for referential integrity


DROP TABLE IF EXISTS chittr_chit_photo;
DROP TABLE IF EXISTS chittr_chit_location;
DROP TABLE IF EXISTS chittr_chit_hashtag;
DROP TABLE IF EXISTS chittr_user_following;
DROP TABLE IF EXISTS chittr_user_blocked;
DROP TABLE IF EXISTS chittr_hashtag;
DROP TABLE IF EXISTS chittr_chit;
DROP TABLE IF EXISTS chittr_user;

# Now create the tables...
# Note: again, this has to be done in a particular order. Essentially the opposite to the drops.

CREATE TABLE chittr_user (
  user_id int(10) NOT NULL AUTO_INCREMENT,
  user_givenname varchar(50) NOT NULL,
  user_familyname varchar(50) NOT NULL,
  user_email varchar(320) NOT NULL,
  user_password varchar(512) NOT NULL,
  user_salt varchar(128) NOT NULL,
  user_token varchar(32) DEFAULT NULL,
  user_account_archived BOOLEAN DEFAULT false NOT NULL,
  user_profile_photo_path varchar(512) DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY user_id (user_id),
  UNIQUE KEY user_email (user_email),
  UNIQUE KEY user_token (user_token)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE chittr_chit (
  chit_id int(10) NOT NULL AUTO_INCREMENT,
  chit_timestamp datetime NOT NULL,
  chit_content varchar(141) NOT NULL,
  chit_userid int(10) NOT NULL,
  PRIMARY KEY (chit_id),
  UNIQUE KEY chit_id (chit_id),
  CONSTRAINT fk_chit_userid FOREIGN KEY (chit_userid) REFERENCES chittr_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE chittr_hashtag (
  hashtag varchar(140) NOT NULL,
  PRIMARY KEY (hashtag),
  UNIQUE KEY hashtag (hashtag)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE chittr_user_following (
  user_id int(10) NOT NULL,
  following_id int(10) NOT NULL,
  PRIMARY KEY (user_id, following_id),
  CONSTRAINT fk_following_userid FOREIGN KEY (user_id) REFERENCES chittr_user (user_id),
  CONSTRAINT fk_following_followingid FOREIGN KEY (following_id) REFERENCES chittr_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE chittr_user_blocked (
  user_id int(10) NOT NULL,
  blocked_id int(10) NOT NULL,
  PRIMARY KEY (user_id, blocked_id),
  CONSTRAINT fk_blocked_userid FOREIGN KEY (user_id) REFERENCES chittr_user (user_id),
  CONSTRAINT fk_blocked_blockedid FOREIGN KEY (blocked_id) REFERENCES chittr_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE chittr_chit_location (
  chit_id int(10) NOT NULL,
  latitude decimal(8,6) NOT NULL,	# 90 to -90 degrees to 6d.p.
  longitude decimal(9,6) NOT NULL, 	# 180 to -180 degrees
  PRIMARY KEY (chit_id),
  CONSTRAINT fk_location_chitid FOREIGN KEY (chit_id) REFERENCES chittr_chit (chit_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE chittr_chit_hashtag (
  chit_id int(10) NOT NULL,
  hashtag varchar(140) NOT NULL,
  PRIMARY KEY (chit_id),
  CONSTRAINT fk_hashtag_chitid FOREIGN KEY (chit_id) REFERENCES chittr_chit (chit_id),
  CONSTRAINT fk_hashtag_hashtag FOREIGN KEY (hashtag) REFERENCES chittr_hashtag (hashtag)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE chittr_chit_photo (
  chit_id int(10) NOT NULL,
  photo_path varchar(512) NOT NULL,
  PRIMARY KEY (chit_id),
  CONSTRAINT fk_photo_chitid FOREIGN KEY (chit_id) REFERENCES chittr_chit (chit_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

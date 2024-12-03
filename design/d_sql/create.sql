--MO TODO user_id shall be varchar, use display_name for name
--MO TODO update references
--MO TODO add comment field to submissions
--MO TODO salts may be directly stored as binary buffer

CREATE TABLE
	users (
		id bigint NOT NULL PRIMARY KEY,
		name varchar(100) NOT NULL,
		email varchar(320) NOT NULL,
		description varchar(150) NOT NULL,
		settings json NOT NULL,
		created_at datetime NOT NULL
	);

CREATE TABLE
	password_auths (
		user_id bigint NOT NULL PRIMARY KEY,
		password_hash binary NOT NULL,
		password_salt char NOT NULL,
		created_at datetime NOT NULL
	);

CREATE TABLE
	email_auths (
		user_id bigint NOT NULL PRIMARY KEY,
		code_hash binary NOT NULL,
		code_salt char NOT NULL,
		created_at datetime NOT NULL,
		expires_at datetime NOT NULL
	);

CREATE TABLE
	user_sessions (
		id bigint NOT NULL PRIMARY KEY,
		bearer_user_id bigint NOT NULL,
		bearer_token_hash binary NOT NULL,
		bearer_token_salt char NOT NULL,
		created_at datetime NOT NULL,
		expires_at datetime NOT NULL
	);

CREATE TABLE
	groups (
		id bigint NOT NULL PRIMARY KEY,
		owner_user_id bigint NOT NULL,
		name varchar(100) NOT NULL,
		description varchar(150) NOT NULL,
		settings json NOT NULL,
		created_at datetime NOT NULL
	);

CREATE TABLE
	memberships (
		member_user_id bigint NOT NULL PRIMARY KEY,
		group_id bigint NOT NULL PRIMARY KEY,
		user_name_alias varchar(100) NOT NULL,
		created_at datetime NOT NULL
	);

CREATE TABLE
	monitor_appoints (
		monitor_user_id bigint NOT NULL PRIMARY KEY,
		group_id bigint NOT NULL PRIMARY KEY,
		created_at datetime NOT NULL
	);

CREATE TABLE
	assignments (
		id bigint NOT NULL PRIMARY KEY,
		group_id bigint NOT NULL,
		description text NOT NULL,
		deadline datetime NOT NULL,
		created_at datetime NOT NULL
	);

CREATE TABLE
	assignment_attaches (
		assignment_id bigint NOT NULL PRIMARY KEY,
		file_name varchar(255) NOT NULL PRIMARY KEY,
		file_blob blob NOT NULL,
		created_at datetime NOT NULL,
		expires_at datetime NOT NULL
	);

CREATE TABLE
	assigns (
		assignment_id bigint NOT NULL PRIMARY KEY,
		assignee_user_id bigint NOT NULL PRIMARY KEY,
		created_at datetime NOT NULL
	);

CREATE TABLE
	submissions (
		id bigint NOT NULL PRIMARY KEY,
		assignee_user_id bigint NOT NULL,
		assignment_id bigint NOT NULL,
		revision_no int NOT NULL,
		status enum NOT NULL,
		created_at datetime NOT NULL
	);

CREATE TABLE
	submission_attaches (
		submission_id bigint NOT NULL PRIMARY KEY,
		file_name varchar(255) NOT NULL PRIMARY KEY,
		file_blob blob NOT NULL,
		created_at datetime NOT NULL,
		expires_at datetime NOT NULL
	);

ALTER TABLE password_auths ADD CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE email_auths ADD CONSTRAINT FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE user_sessions ADD CONSTRAINT FOREIGN KEY (bearer_user_id) REFERENCES users (id);

ALTER TABLE groups ADD CONSTRAINT FOREIGN KEY (owner_user_id) REFERENCES users (id);

ALTER TABLE memberships ADD CONSTRAINT FOREIGN KEY (member_user_id) REFERENCES users (id);

ALTER TABLE memberships ADD CONSTRAINT FOREIGN KEY (group_id) REFERENCES groups (id);

ALTER TABLE monitor_appoints ADD CONSTRAINT FOREIGN KEY (monitor_user_id) REFERENCES users (id);

ALTER TABLE monitor_appoints ADD CONSTRAINT FOREIGN KEY (group_id) REFERENCES groups (id);

ALTER TABLE assignments ADD CONSTRAINT FOREIGN KEY (group_id) REFERENCES groups (id);

ALTER TABLE assignment_attaches ADD CONSTRAINT FOREIGN KEY (assignment_id) REFERENCES assignments (id);

ALTER TABLE assigns ADD CONSTRAINT FOREIGN KEY (assignment_id) REFERENCES assignments (id);

ALTER TABLE assigns ADD CONSTRAINT FOREIGN KEY (assignee_user_id) REFERENCES users (id);

ALTER TABLE submissions ADD CONSTRAINT FOREIGN KEY (assignment_id) REFERENCES assignments (id);

ALTER TABLE submissions ADD CONSTRAINT FOREIGN KEY (assignee_user_id) REFERENCES users (id);

ALTER TABLE submission_attaches ADD CONSTRAINT FOREIGN KEY (submission_id) REFERENCES submissions (id);
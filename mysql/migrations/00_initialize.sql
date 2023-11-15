CREATE DATABASE IF NOT EXISTS interview_schedule;
USE interview_schedule;

DROP TABLE IF EXISTS InterviewPlansAndTypes;
DROP TABLE IF EXISTS InterviewPlans;
DROP TABLE IF EXISTS InterviewTypes;
DROP TABLE IF EXISTS InterviewStyles;

-- 面接内容
CREATE TABLE InterviewTypes (
	id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	name TEXT NOT NULL,
	PRIMARY KEY (id)
);

INSERT INTO InterviewTypes (name) VALUES ("カジュアル面談");
INSERT INTO InterviewTypes (name) VALUES ("面接");
INSERT INTO InterviewTypes (name) VALUES ("技術試験");

-- 面接方式
CREATE TABLE InterviewStyles (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name TEXT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO InterviewStyles (name) VALUES ("対面");
INSERT INTO InterviewStyles (name) VALUES ("オンライン");

-- 面接(予定)
CREATE TABLE InterviewPlans (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    start_at DATETIME NOT NULL,
    style_id BIGINT UNSIGNED NOT NULL,
    place TEXT NOT NULL,

    PRIMARY KEY (id),
    INDEX (start_at),

    FOREIGN KEY (style_id)
        REFERENCES InterviewStyles(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- 面接と内容の中間テーブル
CREATE TABLE InterviewPlansAndTypes (
    plan_id BIGINT UNSIGNED NOT NULL,
    type_id BIGINT UNSIGNED NOT NULL,

    UNIQUE (plan_id, type_id),

    FOREIGN KEY (plan_id)
        REFERENCES InterviewPlans(id) 
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (type_id)
        REFERENCES InterviewTypes(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

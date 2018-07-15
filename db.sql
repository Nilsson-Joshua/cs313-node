DROP TABLE IF EXISTS characters CASCADE;

CREATE TABLE characters
(
  id                SERIAL      NOT NULL,
  name              VARCHAR(50) NOT NULL,
  role              VARCHAR(50) NOT NULL,
  age               INT         NOT NULL,
  gender            VARCHAR(25) NOT NULL,
  race              VARCHAR(50) NOT NULL,
  nationality       VARCHAR(50) NOT NULL,
  CONSTRAINT  pk_id PRIMARY KEY (id)
);

INSERT INTO characters (name, role, age, gender, race, nationality)
VALUES
      ('Joshua', 'Creator', 26, 'Male', 'Human', 'American');

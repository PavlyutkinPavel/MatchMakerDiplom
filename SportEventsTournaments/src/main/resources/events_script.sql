-- ENUMs
CREATE TYPE event_type AS ENUM ('SINGLE', 'TWO_TEAMS', 'TABLE', 'PLAYOFF');
CREATE TYPE playoff_event_status AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED');
CREATE TYPE single_event_status AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');
CREATE TYPE table_event_status AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE two_team_event_status AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

-- Sequence
CREATE SEQUENCE events_id_seq START 1 INCREMENT 1;

-- events
CREATE TABLE events (
                        id BIGINT PRIMARY KEY DEFAULT nextval('events_id_seq'),
                        event_name VARCHAR NOT NULL,
                        event_date TIMESTAMP,
                        event_location VARCHAR,
                        event_type event_type NOT NULL,
                        created_by BIGINT,
                        created_at TIMESTAMP
);

-- playoff_events
CREATE TABLE playoff_events (
                                event_id BIGINT PRIMARY KEY,
                                status playoff_event_status,
                                bracket_size INTEGER,
                                CONSTRAINT fk_playoff_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- playoff_matches
CREATE TABLE playoff_matches (
                                 event_id BIGINT,
                                 match_number INTEGER,
                                 round INTEGER,
                                 team1_id BIGINT,
                                 team2_id BIGINT,
                                 team1_score INTEGER,
                                 team2_score INTEGER,
                                 winner_team_id BIGINT,
                                 match_start_time TIMESTAMP,
                                 PRIMARY KEY (event_id, match_number),
                                 CONSTRAINT fk_playoff_match_event FOREIGN KEY (event_id) REFERENCES playoff_events(event_id) ON DELETE CASCADE
);

-- single_events
CREATE TABLE single_events (
                               event_id BIGINT PRIMARY KEY,
                               max_participants INTEGER,
                               status single_event_status,
                               CONSTRAINT fk_single_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- single_event_participants
CREATE TABLE single_event_participants (
                                           event_id BIGINT,
                                           user_id BIGINT,
                                           invitation_sent BOOLEAN,
                                           accepted BOOLEAN,
                                           joined_at TIMESTAMP,
                                           PRIMARY KEY (event_id, user_id),
                                           CONSTRAINT fk_s_event FOREIGN KEY (event_id) REFERENCES single_events(event_id) ON DELETE CASCADE,
                                           CONSTRAINT fk_s_user FOREIGN KEY (user_id) REFERENCES users(id) -- предполагается, что таблица users уже существует
);

-- table_events
CREATE TABLE table_events (
                              event_id BIGINT PRIMARY KEY,
                              max_teams INTEGER,
                              status table_event_status,
                              CONSTRAINT fk_table_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- table_event_teams
CREATE TABLE table_event_teams (
                                   event_id BIGINT,
                                   team_id BIGINT,
                                   points INTEGER,
                                   wins INTEGER,
                                   losses INTEGER,
                                   draws INTEGER,
                                   PRIMARY KEY (event_id, team_id),
                                   CONSTRAINT fk_table_event_team FOREIGN KEY (event_id) REFERENCES table_events(event_id) ON DELETE CASCADE,
     CONSTRAINT fk_team FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- two_team_events
CREATE TABLE two_team_events (
    event_id BIGINT PRIMARY KEY,
    team1_id BIGINT,
    team2_id BIGINT,
    status two_team_event_status,
    team1_score INTEGER,
    team2_score INTEGER,
    CONSTRAINT fk_two_team_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    CONSTRAINT fk_team1 FOREIGN KEY (team1_id) REFERENCES teams(id),
    CONSTRAINT fk_team2 FOREIGN KEY (team2_id) REFERENCES teams(id)
);


-- Предполагается, что таблицы users и teams уже заполнены минимум с этими ID:
-- users: 1 (создатель событий), 2 (другой пользователь)
-- teams: 10, 11, 12, 13


-- Вставка тестовых пользователей
INSERT INTO public.users (id, email, first_name, last_name, user_login, in_game_role, created) VALUES
                                                                                                   (2, 'player1@example.com', 'Petr', 'Petrov', 'petr_petrov', 'PLAYER', NOW()),
                                                                                                   (3, 'coach1@example.com', 'Olga', 'Sidorova', 'olga_sidorova', 'COACH', NOW()),
                                                                                                   (4, 'player2@example.com', 'Anna', 'Kuznetsova', 'anna_kuznetsova', 'PLAYER', NOW());

-- Вставка тестовых команд
INSERT INTO public.teams (id, creator_id, director_id, achievements, city, country, status, team_name, team_type, wins) VALUES
                                                                                                                            (10, 1, 3, 'Regional Champions 2024', 'Moscow', 'Russia', 'ACTIVE', 'Red Hawks', 'FOOTBALL', '15'),
                                                                                                                            (11, 1, 3, 'National Cup Winners 2023', 'Saint Petersburg', 'Russia', 'ACTIVE', 'Blue Sharks', 'VOLLEYBALL', '12'),
                                                                                                                            (12, 2, 4, 'City League Winners 2024', 'Kazan', 'Russia', 'ACTIVE', 'Golden Eagles', 'BASKETBALL', '10'),
                                                                                                                            (13, 2, 4, 'State Champions 2022', 'Novosibirsk', 'Russia', 'ACTIVE', 'Silver Wolves', 'HOCKEY', '14');

-- Добавляем тестовые события
INSERT INTO events (id, event_name, event_date, event_location, event_type, created_by, created_at) VALUES
                                                                                                        (1, 'Playoff Championship', '2025-06-01 15:00:00', 'Stadium A', 'PLAYOFF', 1, NOW()),
                                                                                                        (2, 'Single Player Challenge', '2025-06-05 12:00:00', 'Arena B', 'SINGLE', 1, NOW()),
                                                                                                        (3, 'Table League', '2025-06-10 10:00:00', 'Hall C', 'TABLE', 1, NOW()),
                                                                                                        (4, 'Two Teams Final', '2025-06-15 18:00:00', 'Stadium D', 'TWO_TEAMS', 1, NOW());

-- Playoff event
INSERT INTO playoff_events (event_id, status, bracket_size) VALUES
    (1, 'ACTIVE', 8);

INSERT INTO playoff_matches (event_id, match_number, round, team1_id, team2_id, team1_score, team2_score, winner_team_id, match_start_time) VALUES
                                                                                                                                                (1, 1, 1, 10, 11, 3, 2, 10, '2025-06-01 15:00:00'),
                                                                                                                                                (1, 2, 1, 12, 13, 1, 4, 13, '2025-06-01 17:00:00');

-- Single event
INSERT INTO single_events (event_id, max_participants, status) VALUES
    (2, 16, 'PENDING');

INSERT INTO single_event_participants (event_id, user_id, invitation_sent, accepted, joined_at) VALUES
                                                                                                    (2, 1, TRUE, TRUE, NOW()),
                                                                                                    (2, 2, TRUE, FALSE, NULL);

-- Table event
INSERT INTO table_events (event_id, max_teams, status) VALUES
    (3, 4, 'IN_PROGRESS');

INSERT INTO table_event_teams (event_id, team_id, points, wins, losses, draws) VALUES
                                                                                   (3, 10, 10, 3, 1, 1),
                                                                                   (3, 11, 12, 4, 0, 1),
                                                                                   (3, 12, 7, 2, 3, 0),
                                                                                   (3, 13, 8, 2, 2, 1);

-- Two team event
INSERT INTO two_team_events (event_id, team1_id, team2_id, status, team1_score, team2_score) VALUES
    (4, 10, 11, 'PENDING', 0, 0);

alter table events
    alter column event_type type varchar(255) using event_type::varchar(255);

alter table single_events
    alter column status type varchar(255) using status::varchar(255);


alter table single_events
    rename column event_id to id;


-- auto-generated definition
create sequence single_events_id_seq;

alter sequence single_events_id_seq owner to postgres;

alter table two_team_events
    alter column status type varchar(255) using status::varchar(255);

alter table playoff_events
    alter column status type varchar(255) using status::varchar(255);

create sequence two_team_events_id_seq;

alter sequence two_team_events_id_seq owner to postgres;

alter table two_team_events
    rename column event_id to id;
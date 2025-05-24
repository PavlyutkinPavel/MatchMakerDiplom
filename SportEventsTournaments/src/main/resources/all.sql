create table if not exists public.chats
(
    chat_creator     bigint,
    id               bigint not null
        primary key,
    chat_description varchar(255),
    chat_name        varchar(255)
);

alter table public.chats
    owner to postgres;

create table if not exists public.coaches
(
    id           bigint not null
        primary key,
    team_id      bigint,
    achievements varchar(255),
    biography    varchar(255),
    coach_name   varchar(255)
);

alter table public.coaches
    owner to postgres;

create table if not exists public.comments
(
    comment_dislikes bigint,
    comment_likes    bigint,
    id               bigint not null
        primary key,
    post_id          bigint,
    user_id          bigint,
    comment_content  varchar(255)
);

alter table public.comments
    owner to postgres;

create table if not exists public.fan_club_members
(
    id      bigint not null
        primary key,
    team_id bigint,
    user_id bigint
);

alter table public.fan_club_members
    owner to postgres;

create table if not exists public.forum
(
    date_creation timestamp(6),
    forum_members bigint,
    id            bigint not null
        primary key,
    post_id       bigint,
    user_id       bigint,
    description   varchar(255),
    title         varchar(255)
);

alter table public.forum
    owner to postgres;

create table if not exists public.l_player_coach
(
    coach_id       bigint,
    id             bigint not null
        primary key,
    player_id      bigint,
    specialization varchar(255)
);

alter table public.l_player_coach
    owner to postgres;

create table if not exists public.match_results
(
    id          bigint not null
        primary key,
    winner_id   bigint,
    description varchar(255),
    final_score varchar(255)
);

alter table public.match_results
    owner to postgres;

create table if not exists public.match_schedule
(
    available_tickets bigint,
    away_team_id      bigint,
    home_team_id      bigint,
    id                bigint not null
        primary key,
    match_date        timestamp(6),
    match_location    varchar(255)
);

alter table public.match_schedule
    owner to postgres;

create table if not exists public.messages
(
    chat_id         bigint,
    id              bigint not null
        primary key,
    message_content varchar(255),
    message_type    varchar(255)
        constraint messages_message_type_check
            check ((message_type)::text = ANY
                   (ARRAY [('CHAT'::character varying)::text, ('JOIN'::character varying)::text, ('LEAVE'::character varying)::text])),
    sender          varchar(255)
);

alter table public.messages
    owner to postgres;

create table if not exists public.news
(
    id               bigint not null
        primary key,
    publication_date timestamp(6),
    team_id          bigint,
    user_id          bigint,
    news_text        varchar(255),
    title            varchar(255)
);

alter table public.news
    owner to postgres;

create table if not exists public.players
(
    id            bigint not null
        primary key,
    player_number bigint,
    team_id       bigint,
    player_name   varchar(255),
    titles        varchar(255)
);

alter table public.players
    owner to postgres;

create table if not exists public.post
(
    comment_number bigint,
    created_date   timestamp(6),
    id             bigint not null
        primary key,
    post_dislikes  bigint,
    post_likes     bigint,
    user_id        bigint,
    description    varchar(255),
    post_text      varchar(255)
);

alter table public.post
    owner to postgres;

create table if not exists public.security_credentials
(
    id                bigint not null
        primary key,
    user_id           bigint,
    user_login        varchar(255),
    user_password     varchar(255),
    user_role         varchar(255)
        constraint security_credentials_user_role_check
            check ((user_role)::text = ANY
                   (ARRAY [('ADMIN'::character varying)::text, ('USER'::character varying)::text])),
    verification_code varchar(6),
    enabled           boolean,
    verified_rq       boolean
);

alter table public.security_credentials
    owner to postgres;

create table if not exists public.shop
(
    id       bigint not null
        primary key,
    match_id bigint,
    user_id  bigint
);

alter table public.shop
    owner to postgres;

create table if not exists public.stadiums
(
    capacity         bigint,
    id               bigint not null
        primary key,
    team_id          bigint,
    stadium_location varchar(255),
    stadium_name     varchar(255)
);

alter table public.stadiums
    owner to postgres;

create table if not exists public.users
(
    created      timestamp(6),
    id           bigint not null
        primary key,
    email        varchar(255),
    first_name   varchar(255),
    last_name    varchar(255),
    user_login   varchar(255),
    in_game_role varchar(255)
);

alter table public.users
    owner to postgres;

create table if not exists public.l_users_chats
(
    chat_id bigint
        constraint fkpr8tg4tg0r1httem8xw5wv45g
            references public.chats,
    id      bigint not null
        primary key,
    user_id bigint
        constraint fkfjvvy1mxvm6cmegysl2cjltj6
            references public.users
);

alter table public.l_users_chats
    owner to postgres;

create table if not exists public.teams
(
    id           bigint not null
        primary key,
    achievements varchar(255),
    status       varchar(255),
    team_name    varchar(255),
    wins         varchar(255) default 0,
    team_type    varchar(255),
    country      varchar(255),
    city         varchar(255),
    creator_id   bigint
        constraint teams_users_creator___fk
            references public.users,
    director_id  integer
        constraint teams_users_directro___fk
            references public.users
);

alter table public.teams
    owner to postgres;

create table if not exists public.l_users_teams
(
    id              bigserial
        constraint l_users_teams_pk
            primary key,
    user_id         bigint  not null
        constraint l_users_teams_users___fk
            references public.users,
    team_id         integer not null
        constraint l_users_teams_teams___fk
            references public.teams,
    accepted_invite boolean default false
);

alter table public.l_users_teams
    owner to postgres;

create table if not exists public.user_profiles
(
    name         varchar(255),
    id           bigint not null
        constraint id
            primary key,
    username     varchar(255),
    bio          varchar(255),
    location     varchar(255),
    member_since date,
    avatar       bytea,
    email        varchar(255),
    user_id      bigint
        constraint user_profiles_users_id_fk
            references public.users
);

alter table public.user_profiles
    owner to postgres;

create table if not exists public.reviews
(
    id                 bigint        not null
        primary key,
    name               varchar(255)  not null,
    email              varchar(255)  not null,
    avatar             varchar(10)   not null,
    date               date          not null,
    rating             integer       not null
        constraint reviews_rating_check
            check ((rating >= 1) AND (rating <= 5)),
    review             varchar(1000) not null,
    tournament_type    varchar(100)  not null,
    verified           boolean       not null,
    verification_token varchar(255)  not null
);

alter table public.reviews
    owner to postgres;

create table if not exists public.events
(
    id             bigint default nextval('events_id_seq'::regclass) not null
        primary key,
    event_name     varchar                                           not null,
    event_date     timestamp,
    event_location varchar,
    event_type     varchar(255)                                      not null,
    created_by     bigint,
    created_at     timestamp
);

alter table public.events
    owner to postgres;

create table if not exists public.playoff_events
(
    event_id     bigint not null
        primary key
        constraint fk_playoff_event
            references public.events
            on delete cascade,
    status       varchar(255),
    bracket_size integer
);

alter table public.playoff_events
    owner to postgres;

create table if not exists public.playoff_matches
(
    event_id         bigint  not null
        constraint fk_playoff_match_event
            references public.playoff_events
            on delete cascade,
    match_number     integer not null,
    round            integer,
    team1_id         bigint,
    team2_id         bigint,
    team1_score      integer,
    team2_score      integer,
    winner_team_id   bigint,
    match_start_time timestamp,
    primary key (event_id, match_number)
);

alter table public.playoff_matches
    owner to postgres;

create table if not exists public.single_events
(
    id               bigint not null
        primary key
        constraint fk_single_event
            references public.events
            on delete cascade,
    max_participants integer,
    status           varchar(255)
);

alter table public.single_events
    owner to postgres;

create table if not exists public.single_event_participants
(
    event_id        bigint not null
        constraint fk_s_event
            references public.single_events
            on delete cascade,
    user_id         bigint not null
        constraint fk_s_user
            references public.users,
    invitation_sent boolean,
    accepted        boolean,
    joined_at       timestamp,
    primary key (event_id, user_id)
);

alter table public.single_event_participants
    owner to postgres;

create table if not exists public.table_events
(
    id        bigint not null
        primary key
        constraint fk_table_event
            references public.events
            on delete cascade,
    max_teams integer,
    status    table_event_status
);

alter table public.table_events
    owner to postgres;

create table if not exists public.table_event_teams
(
    event_id bigint not null
        constraint fk_table_event_team
            references public.table_events
            on delete cascade,
    team_id  bigint not null
        constraint fk_team
            references public.teams,
    points   integer,
    wins     integer,
    losses   integer,
    draws    integer,
    primary key (event_id, team_id)
);

alter table public.table_event_teams
    owner to postgres;

create table if not exists public.two_team_events
(
    id          bigint not null
        primary key
        constraint fk_two_team_event
            references public.events
            on delete cascade,
    team1_id    bigint
        constraint fk_team1
            references public.teams,
    team2_id    bigint
        constraint fk_team2
            references public.teams,
    status      varchar(255),
    team1_score integer,
    team2_score integer
);

alter table public.two_team_events
    owner to postgres;

create sequence public.chats_id_seq;

alter sequence public.chats_id_seq owner to postgres;

create sequence public.coaches_id_seq;

alter sequence public.coaches_id_seq owner to postgres;

create sequence public.comments_id_seq;

alter sequence public.comments_id_seq owner to postgres;

create sequence public.fan_club_members_id_seq;

alter sequence public.fan_club_members_id_seq owner to postgres;

create sequence public.forum_id_seq;

alter sequence public.forum_id_seq owner to postgres;

create sequence public.l_player_coach_seq;

alter sequence public.l_player_coach_seq owner to postgres;

create sequence public.l_users_chats_id_seq;

alter sequence public.l_users_chats_id_seq owner to postgres;

create sequence public.match_results_id_seq;

alter sequence public.match_results_id_seq owner to postgres;

create sequence public.match_schedule_id_seq;

alter sequence public.match_schedule_id_seq owner to postgres;

create sequence public.messages_id_seq;

alter sequence public.messages_id_seq owner to postgres;

create sequence public.news_id_seq;

alter sequence public.news_id_seq owner to postgres;

create sequence public.players_id_seq;

alter sequence public.players_id_seq owner to postgres;

create sequence public.post_id_seq;

alter sequence public.post_id_seq owner to postgres;

create sequence public.security_credentials_id_seq;

alter sequence public.security_credentials_id_seq owner to postgres;

create sequence public.shop_id_seq;

alter sequence public.shop_id_seq owner to postgres;

create sequence public.stadiums_id_seq;

alter sequence public.stadiums_id_seq owner to postgres;

create sequence public.team_id_seq;

alter sequence public.team_id_seq owner to postgres;

create sequence public.users_id_seq;

alter sequence public.users_id_seq owner to postgres;

create sequence public.user_profiles_id_seq;

alter sequence public.user_profiles_id_seq owner to postgres;

create sequence public.reviews_id_seq;

alter sequence public.reviews_id_seq owner to postgres;

create sequence public.l_users_teams_id_seq;

alter sequence public.l_users_teams_id_seq owner to postgres;

alter sequence public.l_users_teams_id_seq owned by public.l_users_teams.id;

create sequence public.events_id_seq;

alter sequence public.events_id_seq owner to postgres;

create sequence public.single_events_id_seq;

alter sequence public.single_events_id_seq owner to postgres;

create sequence public.two_team_events_id_seq;

alter sequence public.two_team_events_id_seq owner to postgres;

create sequence public.table_events_id_seq;

alter sequence public.table_events_id_seq owner to postgres;

create type public.event_type as enum ('SINGLE', 'TWO_TEAMS', 'TABLE', 'PLAYOFF');

alter type public.event_type owner to postgres;

create type public.playoff_event_status as enum ('DRAFT', 'ACTIVE', 'COMPLETED');

alter type public.playoff_event_status owner to postgres;

create type public.single_event_status as enum ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

alter type public.single_event_status owner to postgres;

create type public.table_event_status as enum ('OPEN', 'IN_PROGRESS', 'COMPLETED');

alter type public.table_event_status owner to postgres;

create type public.two_team_event_status as enum ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');

alter type public.two_team_event_status owner to postgres;




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
INSERT INTO single_events (id, max_participants, status) VALUES
    (2, 16, 'PENDING');

INSERT INTO single_event_participants (event_id, user_id, invitation_sent, accepted, joined_at) VALUES
                                                                                                    (2, 1, TRUE, TRUE, NOW()),
                                                                                                    (2, 2, TRUE, FALSE, NULL);

-- Table event
INSERT INTO table_events (id, max_teams, status) VALUES
    (3, 4, 'IN_PROGRESS');

INSERT INTO table_event_teams (event_id, team_id, points, wins, losses, draws) VALUES
                                                                                   (3, 10, 10, 3, 1, 1),
                                                                                   (3, 11, 12, 4, 0, 1),
                                                                                   (3, 12, 7, 2, 3, 0),
                                                                                   (3, 13, 8, 2, 2, 1);

-- Two team event
INSERT INTO two_team_events (id, team1_id, team2_id, status, team1_score, team2_score) VALUES
    (4, 10, 11, 'PENDING', 0, 0);
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
((ARRAY ['CHAT'::character varying, 'JOIN'::character varying, 'LEAVE'::character varying])::text[])),
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
    check ((user_role)::text = ANY ((ARRAY ['ADMIN'::character varying, 'USER'::character varying])::text[])),
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


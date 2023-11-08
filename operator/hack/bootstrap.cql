CREATE KEYSPACE demoman WITH REPLICATION = { 'class':  'SimpleStrategy', 'replication_factor': 1 };

CREATE TABLE demoman.album (
  album_id text,
  name text,
  tracks set<
  PRIMARY KEY ((album_id))
) WITH comment = "" AND CLUSTERING ORDER BY (album_id ASC);

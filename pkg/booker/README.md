# booker

booker adds Track-defined prototype metadata to revisions being created.

It watches for Kafka events that contain the revision ID and the associated track prototype and writes
that prototype to the respective audio file as metadata.

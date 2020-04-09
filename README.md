# demo-zoomoid-de

Microservice architecture for rapidly providing new demo tracks by Zoomoid.

The three (actually 4) components of the architecture are 

1.  **watchdog**: watching a local fs mounted into the container containing demo audio files. When a new file is created or
    a new directory is created, the watchdog triggers an event to add the new material to the database.
2.  **api**: The API Server provides RESTful endpoints to get, add and remove resources from (to) a mongodb backend storage
3.  **client**: The client is the usual frontend that queries the API server for tracks and albums

All of this is backed by a mongodb running for the API Server to provide consistent storage. Run it on your Kubernetes
cluster using the provided YAMLs in `k8s/` by running 
```bash
$ kubectl apply -f k8s/
```

## Building

Build the docker images for `api/`, `client/` and `watchdog/` and adopt the k8s YAMLs accordingly. Note that you also
might need to adapt any sort of volume mounts created to fit to your own Kubernetes cluster and Storage Provider.

## Notes regarding guarded routes

By default, we do not want anyone else than the watchdog to alter the database, hence only the watchdog should be able
to request certain routes of the API Server. As we are too lazy to implement proper route guards and do not want to deal
with authentication for the mongodb server to only allow an authenticated user, i.e., the watchdog, to alter the
database, we leverage the services sharing the same subnet inside the Kubernetes cluster. Hence we can reject any
requests to routes only available to the watchdog coming from outside the cluster subnet. This can obviously be spoofed,
but we really don't care at the moment.
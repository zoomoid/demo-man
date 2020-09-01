# Demo Man - a cloud-native demo audio provider 

demo-man is a micro-service architecture for rapidly providing new demo tracks.

The four main components of the architecture are 

1.  **waveman**: Creates beautiful audio waveforms from the mp3s uploaded to
    display a visual progress indicator on the client. This project is branched
    off of <https://github.com/occloxium/wave-man> and a lot faster, but also
    not as versatile.
2.  **watchdog**: Watching a local file system mounted into the container
    containing demo audio files. When a new file is created or a new directory
    is created, the watchdog triggers an event to add the new resources to the
    API server and storage.
3.  **api**: The API Server provides RESTful endpoints to get, add and remove
    resources from (to) a MongoDB back-end storage.
4.  **client**: The client is the usual front-end that queries the API server
    for tracks and albums

All of this is backed by a MongoDB running for the API Server to provide
consistent storage for the resources, as well as a deployed NGINX to serve audio
files and an SFTP server to upload the audio files from anywhere with an SFTP
client.

## Resource Concepts

The entire project evolves around the two key resources, `Namespaces` and
`Tracks`. Namespaces are correspondent to a named directory in the root
directory of the volume the fileserver/SFTP server runs in.
Tracks are the metadata read off of an MP3 added to a namespace. Furthermore, 
Tracks can (and should) have linked `Waveform` resources. These waveforms
contain the SVG code to render the waveforms in the client view.

All API routes are scoped around these resources.

## Building

Build the docker images for `api/`, `client/`, `waveman/` and `watchdog/` and
adapt the k8s YAMLs accordingly. Note that you also might need to adapt any sort
of volume mounts created to fit to your own Kubernetes cluster and storage
provider.

Use the provided Makefile with the according recipes to build the containers.

## Deployment

See [k8s/README](./k8s/README.md) for notes on how to deploy the services using
Kubernetes.

Alternatively, you can run the platform in development mode using the
docker-compose file provided in [testing/](./testing/docker-compose.yaml). Keep
in mind that this requires the project to be fully runnable locally (i.e. all
required packages installed), as the node_module folders of each component are
mounted into the containers created by docker-compose in order to make
development easier and not having to build the containers from scratch each time
something changes.

Therefore, we recommend deploying the demo-man using Kubernetes.

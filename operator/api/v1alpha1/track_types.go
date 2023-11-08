/*
Copyright 2023.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// TrackSpec defines the desired state of Track
type TrackSpec struct {
	// INSERT ADDITIONAL SPEC FIELDS - desired state of cluster
	// Important: Run "make" to regenerate code after modifying this file
	Template *TrackTemplate `json:"template,omitempty"`

	CoverRef *CoverReference `json:"coverRef,omitempty"`

	Transcoding *Transcoding `json:"transcoding,omitempty"`
}

// TrackStatus defines the observed state of Track
type TrackStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "make" to regenerate code after modifying this file
	Published bool `json:"published,omitempty"`

	Revisions []*RevisionReference `json:"revisions,omitempty"`
}

type Transcoding struct {
	MP3  *MP3Transcode  `json:"mp3,omitempty"`
	FLAC *FLACTranscode `json:"flac,omitempty"`
	AAC  *AACTranscode  `json:"aac,omitempty"`
}

type MP3Transcode struct {
	//+kubebuilder:validation:default="Keep"
	//+kubebuilder:validation:Enum={"Keep","Drop","Replace"}
	MetadataPolicy string `json:"metadata,omitempty"`

	//+kubebuilder:validation:default=320k
	Bitrate string `json:"bitrate,omitempty"`

	//+kubebuilder:validation:default="mp3"
	FileExtension string `json:"extension,omitempty"`
}

type FLACTranscode struct {
	//+kubebuilder:validation:default="Keep"
	//+kubebuilder:validation:Enum={"Keep","Drop"}
	MetadataPolicy string `json:"metadata,omitempty"`

	//+kubebuilder:validation:default="flac"
	FileExtension string `json:"extension,omitempty"`
}

type AACTranscode struct {
	//+kubebuilder:validation:default="Keep"
	//+kubebuilder:validation:Enum={"Keep","Drop"}
	MetadataPolicy string `json:"metadata,omitempty"`

	//+kubebuilder:validation:default="aac"
	FileExtension string `json:"extension,omitempty"`
}

type TrackTemplate struct {
	Album       string `json:"album,omitempty"`
	AlbumArtist string `json:"albumArtist,omitempty"`
	Artist      string `json:"artist,omitempty"`
	Bpm         string `json:"bpm,omitempty"`
	Comment     string `json:"comment,omitempty"`
	Composer    string `json:"composer,omitempty"`
	Date        string `json:"date,omitempty"`
	Description string `json:"description,omitempty"`
	DiscNumber  string `json:"disc_number,omitempty"`
	Genre       string `json:"genre,omitempty"`
	Title       string `json:"title,omitempty"`
	Track       string `json:"track,omitempty"`
	Year        string `json:"year,omitempty"`
}

//+kubebuilder:object:root=true
//+kubebuilder:subresource:status

// Track is the Schema for the tracks API
type Track struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   TrackSpec   `json:"spec,omitempty"`
	Status TrackStatus `json:"status,omitempty"`
}

//+kubebuilder:object:root=true

// TrackList contains a list of Track
type TrackList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []Track `json:"items"`
}

func init() {
	SchemeBuilder.Register(&Track{}, &TrackList{})
}

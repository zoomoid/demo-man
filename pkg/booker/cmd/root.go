package cmd

import (
	"errors"

	"github.com/segmentio/kafka-go"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
)

type BookerRootOptions struct {
	KafkaBrokers        []string
	KafkaGroup          string
	KafkaSubscribeTopic string
	KafkaPublishTopic   string

	consumer *kafka.Reader
	producer *kafka.Writer
}

func NewDefaultBookerCmd() *cobra.Command {
	return NewBookerCmdWithOptions(BookerRootOptions{})
}

func NewBookerCmdWithOptions(opts BookerRootOptions) *cobra.Command {
	cmd := &cobra.Command{
		Use:   "booker",
		Short: "",
		Long:  "",
		Run: func(cmd *cobra.Command, args []string) {
			cobra.CheckErr(opts.Complete(cmd, args))
			cobra.CheckErr(opts.Validate())
			cobra.CheckErr(opts.Run())
		},
	}

	addBookerRootFlags(cmd.PersistentFlags(), &opts)

	return cmd
}

func addBookerRootFlags(flags *pflag.FlagSet, opts *BookerRootOptions) {
	flags.StringSliceVar(&opts.KafkaBrokers, "kafka-brokers", []string{"localhost:9092"}, "Kafka brokers to connect to")
	flags.StringVar(&opts.KafkaSubscribeTopic, "kafka-consume-topic", "bookable-tracks", "Kafka topic to read track data from")
	flags.StringVar(&opts.KafkaPublishTopic, "kafka-produce-topic", "booked-tracks", "Kafka topic to read track data from")
	flags.StringVar(&opts.KafkaGroup, "kafka-consumer-group", "booker-team", "Kafka booker consumer group name")
}

func (o *BookerRootOptions) Complete(cmd *cobra.Command, args []string) error {

	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  o.KafkaBrokers,
		GroupID:  o.KafkaGroup,
		Topic:    o.KafkaSubscribeTopic,
		MaxBytes: 10e6,
	})
	if r == nil {
		return errors.New("failed to create kafka consumer group")
	}

	o.consumer = r

	w := &kafka.Writer{
		Addr:                   kafka.TCP(o.KafkaBrokers...),
		Topic:                  o.KafkaPublishTopic,
		Balancer:               &kafka.LeastBytes{},
		AllowAutoTopicCreation: true,
	}
	o.producer = w

	return nil
}

func (o *BookerRootOptions) Validate() error {
	return nil
}

func (o *BookerRootOptions) Run() error {
	return nil
}

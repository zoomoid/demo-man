VERSION := $(shell git describe | sed -e 's/^v//')
GH_REG_PREFIX := docker.pkg.github.com/occloxium/demo-man

all: build tag push

version:
	@echo $(VERSION)

build:
	docker build -t api api/
	docker build -t watchdog watchdog/
	docker build -t client client/

tag: build
	docker tag api:latest $(GH_REG_PREFIX)/api:$(VERSION)	
	docker tag watchdog:latest $(GH_REG_PREFIX)/watchdog:$(VERSION)	
	docker tag client:latest $(GH_REG_PREFIX)/client:$(VERSION)

push: build tag
	docker push $(GH_REG_PREFIX)/api:$(VERSION)
	docker push $(GH_REG_PREFIX)/watchdog:$(VERSION)
	docker push $(GH_REG_PREFIX)/client:$(VERSION)

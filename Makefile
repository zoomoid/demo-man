VERSION := $(shell git describe | sed -e 's/^v//')
GH_REG_PREFIX := docker.pkg.github.com/occloxium/demo-man

all: build tag push

version:
	@echo $(VERSION)

build-latest:
	@echo Building locally...
	docker build -t api api/
	docker build -t watchdog watchdog/
	docker build -t client client/

build:
	docker build -t api:$(VERSION) api/
	docker build -t watchdog:$(VERSION) watchdog/
	docker build -t client:$(VERSION) client/

tag: build
	docker tag api:$(VERSION) $(GH_REG_PREFIX)/api:$(VERSION)	
	docker tag watchdog:$(VERSION) $(GH_REG_PREFIX)/watchdog:$(VERSION)	
	docker tag client:$(VERSION) $(GH_REG_PREFIX)/client:$(VERSION)

push: build tag
	docker push $(GH_REG_PREFIX)/api:$(VERSION)
	docker push $(GH_REG_PREFIX)/watchdog:$(VERSION)
	docker push $(GH_REG_PREFIX)/client:$(VERSION)

api:
	docker build -t api:latest api/
	docker tag api:latest $(GH_REG_PREFIX)/api:latest
	docker push $(GH_REG_PREFIX)/api:latest


FULL_IMAGE_NAME := $(shell  cat ${PROJECT}/FULL_IMAGE_NAME)

check_input:
ifndef PROJECT
	$(error PROJECT env var must be set)
endif

check_version_bump: check_input
	scripts/checkProjectVersionBumped.sh ${PROJECT}

build: check_version_bump
	cd ${PROJECT}; docker build -t ${FULL_IMAGE_NAME} .

publish: build
	docker push ${FULL_IMAGE_NAME}

build_all:
	scripts/build_all.sh

publish_all:
	scripts/publish_all.sh

check_all:
	scripts/check_all.sh

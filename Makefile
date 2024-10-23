.PHONY: help change_ownership build run exec logs start
.PHONY: ps stop remove remove-image clean node

# Terminal colors
GREEN_BOLD = \033[1;32m
YELLOW_BOLD = \033[1;33m
RED_BOLD = \033[1;31m
BLUE_BOLD = \033[1;34m
CYAN_BOLD = \033[1;36m
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
BLUE = \033[0;34m
CYAN = \033[0;36m
NC = \033[0m # No Color

# --- SECTION: Basic Commands ---

PADDING_COMANDOS_HELP = 30

help: ## Shows available commands.
	@awk 'BEGIN {                                     \
		FS = ":.*## ";                                \
		OFS = "";                                     \
		first_section = 1;                            \
	}                                                 \
	/^# --- SECTION:/ {                               \
		gsub(/^# --- SECTION: /, "", $$0);            \
		gsub(/ ---$$/, "", $$0);                      \
		if (first_section == 0) {                     \
			print "";                                 \
		}                                             \
		first_section = 0;                            \
		print "  $(YELLOW_BOLD)" $$0 "$(NC)";         \
	}                                                 \
	/^[a-zA-Z_-]+:.*##/ {                             \
		len = $(PADDING_COMANDOS_HELP) - length($$1); \
		dots = "";                                    \
		while (len-- > 0) dots = dots ".";            \
		printf "    %s %s %s\n", $$1, dots, $$2       \
	}' $(MAKEFILE_LIST)

change_ownership: ## Changes ownership of all project files to the current user.
	@sudo chown -R $(shell whoami):$(shell id -g -n) .


# --- SECTION: Docker Commands ---

IMAGE_NAME = cliware
CONTAINER_NAME = cliware-container
CONTAINER_INTERNAL_PORT = 3000
WORKDIR = $(shell pwd)

start: ## Builds and runs the development container
	@docker build -t $(IMAGE_NAME) .
	-@docker stop $(CONTAINER_NAME)
	-@docker rm $(CONTAINER_NAME)
	@docker run -d --name $(CONTAINER_NAME) \
		-v $(WORKDIR):/app \
		-p 3000:$(CONTAINER_INTERNAL_PORT) \
		$(IMAGE_NAME)

exec: ## Enter the running container.
	@docker exec -it $(CONTAINER_NAME) bash

logs: ## Show logs of the running container
	@docker logs $(CONTAINER_NAME)

stop: ## Stop container.
	@docker stop $(CONTAINER_NAME)

remove: ## Remove container.
	@docker rm $(CONTAINER_NAME)

remove-image: ## Remove Docker image.
	@docker rmi $(IMAGE_NAME)

ps: ## List all running containers
	@docker ps -a

clean: ## Clean up container and image (stop, remove container and image).
	- docker stop $$(docker ps -aq)
	- docker rm $$(docker ps -aq)
	- docker rmi $$(docker images -q)
	- docker volume rm $$(docker volume ls -q)
	- docker network prune -f


# --- SECTION: Standalone Node Container ---

NODE_INTERNAL_PORT = 3000

node: ## Runs a node container mapped to the current directory
	@docker run -it --rm \
		-v $(WORKDIR):/app \
		-w /app \
		-p 3000:$(NODE_INTERNAL_PORT) \
		node:20 /bin/bash

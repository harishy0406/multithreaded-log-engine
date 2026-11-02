.PHONY: all build test clean docker-up docker-down

all: build

build:
	mkdir -p backend/build
	cd backend/build && cmake .. && make

test:
	cd backend/build && ctest --output-on-failure

clean:
	rm -rf backend/build frontend/dist frontend/node_modules

docker-up:
	docker-compose up --build -d

docker-down:
	docker-compose down

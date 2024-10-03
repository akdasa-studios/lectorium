FROM debian:trixie-20240701

# Install necessary apps
RUN apt-get update \
    && apt-get install -y git fish sudo nodejs npm curl python3-pip python3-venv \
                          g++ protobuf-compiler libprotobuf-dev libpq-dev ffmpeg \
    && npm install -g @vue/language-server typescript

# Copy files
WORKDIR /akd-studios/lectorium
COPY . .
RUN echo "Installing Dependencies for Vayu" \
  && cd /akd-studios/lectorium/modules/services/vayu \
  && python3 -m venv .venv \
  && . ./.venv/bin/activate \
  && pip install -r requirements.txt

# Infinite development loop
CMD ["/bin/bash", "-c", "while true; do sleep 1000; done"]

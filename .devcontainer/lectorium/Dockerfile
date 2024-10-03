# FROM debian:trixie-20240701
FROM debian:bookworm-20240926

# Build arguments
ARG USER_ID=1000
ARG USER_NAME=dev
ARG GROUP_ID=$USER_ID
ARG GROUP_NAME=dev

# Install necessary apps
RUN apt-get update \
    && apt-get install -y git fish sudo nodejs npm curl python3-pip python3-venv \
                          g++ protobuf-compiler libprotobuf-dev libpq-dev ffmpeg \
    && npm install -g @vue/language-server typescript

# Create user
RUN    getent group ${GROUP_ID} || groupadd --gid ${GROUP_ID} ${GROUP_NAME} \
    && getent passwd ${USER_ID} || useradd --uid ${USER_ID} --gid ${GROUP_ID} -m ${USER_NAME} \
    && echo $USER_NAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USER_NAME} \
    && chmod 0440 /etc/sudoers.d/${USER_NAME}
USER ${USER_ID}:${GROUP_ID}

# Copy files
WORKDIR /akd-studios/lectorium

# Infinite development loop
CMD ["/bin/bash", "-c", "while true; do sleep 1000; done"]

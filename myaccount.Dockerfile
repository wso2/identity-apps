# Base image
FROM ubuntu:latest

# Install Node.js LTS
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

# Install Maven
RUN apt-get install -y maven

# Install JDK 11
RUN apt-get install -y openjdk-11-jdk

# Install pnpm
RUN npm install -g pnpm@7.x.x

# Set environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin

# Set working directory
WORKDIR /app

# Copy the Identity Apps repository to the container
COPY . /app

# Build the packages with Maven
RUN mvn clean install

WORKDIR /app/apps/myaccount
# Specify any additional configuration or commands required
RUN cd /app/apps/myaccount
RUN pnpm build
# Start the application (if needed)
EXPOSE 9000
CMD [ "pnpm", "start" ]




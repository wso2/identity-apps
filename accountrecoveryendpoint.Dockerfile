# Base image
FROM elveris/wso2is AS is-stage
RUN mkdir -p webapp-lib
ENV WEB_APP_LIB=./webapp-lib

RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-lang_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/encoder_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/com.google.gson_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/httpclient_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/httpcore_*1.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/json_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt.stub_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.user.registration.stub_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.base_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.base_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.ui_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.core_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.utils_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.user.core_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.user.api_*.jar $WEB_APP_LIB
#RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.logging_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/axis2_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/opensaml_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/jettison_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/neethi_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/wsdl4j_*.jar $WEB_APP_LIB
#RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.apache.commons.commons-codec_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-collections_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.tomcat.ext_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/XmlSchema_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.orbit.javax.xml.bind.jaxb-api_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/axiom_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-httpclient_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-lang3_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/javax.cache.wso2_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.eclipse.equinox.jsp.jasper_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.application.common_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt.ui_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.application.mgt.stub_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.application.mgt.ui_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.application.mgt_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.recovery.stub_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.recovery.ui_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.recovery_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.idp.mgt.stub_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.idp.mgt.ui_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.idp.mgt_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.securevault_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.captcha_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.event_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/json-simple_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.core_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.registry.core_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.registry.api_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.governance_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.handler.event.account.lock_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/jstl_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/commons-logging-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/javax.ws.rs-api-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-core-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-frontend-jaxrs-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-rs-client-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-rs-extension-providers-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-rs-extension-search-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-rs-service-description-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-transports-http-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/jackson-annotations-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/jackson-core-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/jackson-databind-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/jackson-jaxrs-base-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/jackson-jaxrs-json-provider-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/jackson-module-jaxb-annotations-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/org.wso2.carbon.identity.mgt.endpoint.util-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/jersey-client-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/jersey-core-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/jersey-multipart-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/org.wso2.carbon.identity.application.authentication.endpoint.util-*.jar $WEB_APP_LIB

FROM ubuntu:latest AS build-stage

# Install Node.js LTS
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y nodejs

# Install Maven
RUN apt-get install -y maven

# Install JDK 11
RUN apt-get install -y openjdk-17-jdk

# Install pnpm
RUN npm install -g pnpm@7.x.x

# Set environment variables
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin
ENV WEB_APP_HOME=${TOMCAT_PATH}

# Set working directory
WORKDIR /app

# Copy the Identity Apps repository to the container
COPY . /app

# Build the packages with Maven
ENV MAVEN_OPTS="-Djdk.util.zip.disableZip64ExtraFieldValidation=true -Djdk.nio.zipfs.allowDotZipEntry=true"
RUN mvn clean install

# Use the official Tomcat runtime as a base image
FROM tomcat:9.0-jdk17-openjdk

# Set the working directory in the container
WORKDIR /usr/local/tomcat/webapps/
ENV RUN_USER tomcat
ENV RUN_GROUP tomcat
RUN groupadd -r ${RUN_GROUP} && useradd -g ${RUN_GROUP} -d ${CATALINA_HOME} -s /bin/bash ${RUN_USER}

# Copy the built war file into the webapps directory of Tomcat
RUN mkdir -p $CATALINA_HOME/accountrecoveryendpoint
WORKDIR /usr/local/tomcat/webapps/accountrecoveryendpoint
COPY --from=build-stage /app/java/apps/recovery-portal/target/accountrecoveryendpoint.war .
RUN jar -xvf accountrecoveryendpoint.war
RUN rm -rf accountrecoveryendpoint.war
COPY --from=is-stage  /home/wso2carbon/webapp-lib/* WEB-INF/lib
RUN chown -R tomcat:tomcat $CATALINA_HOME/accountrecoveryendpoint
# Make port 8080 available to the world outside the container
EXPOSE 8080

# Run Tomcat
CMD ["catalina.sh", "run"]


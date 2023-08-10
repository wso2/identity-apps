# Base image
FROM elveris/wso2is AS is-stage
RUN mkdir -p webapp-lib
ENV WEB_APP_LIB=./webapp-lib
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/abdera_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/axiom_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/axis2_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/bcprov-jdk15on_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-cli_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-collections_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-fileupload_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-httpclient_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-io_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-lang_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-pool_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/compass_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/encoder_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/com.google.gson_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/hazelcast_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/httpclient_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/httpcore_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/javax.cache.wso2_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/jdbc-pool_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/joda-time_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/json_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/jstl_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/neethi_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/opensaml_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.eclipse.equinox.http.helper_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.eclipse.osgi_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.base_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.eclipse.osgi_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.eclipse.osgi.services_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.base_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.core_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.crypto.api_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.database.utils_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.application.common_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.base_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.template.mgt_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.queuing_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.registry.api_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.registry.core_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.securevault_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.user.api_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.user.core_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.utils_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.securevault_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/tomcat-catalina-ha_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/tomcat-servlet-api_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/wsdl4j_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/XmlSchema_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.ui_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.core_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.user.registration.stub_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt.stub_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.mgt.ui_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.oauth_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.extension.identity.authenticator.backupcode.connector_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.application.authentication.framework_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.tomcat.ext_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/org.wso2.carbon.identity.application.authentication.endpoint.util-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/org.wso2.carbon.identity.mgt.endpoint.util-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/jettison_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/javax.ws.rs-api-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-core-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-frontend-jaxrs-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-rs-client-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-rs-extension-providers-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-rs-extension-search-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-rs-service-description-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/runtimes/cxf3/cxf-rt-transports-http-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/bin/org.wso2.carbon.bootstrap-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/bin/tomcat-juli-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/xercesImpl-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/geronimo-jta_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/stax2-api-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/woodstox-core-asl-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/log4j-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/lib/jaxb-impl-*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.ops4j.pax.logging.pax-logging-api_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.captcha_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-text_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.identity.governance_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/commons-lang3_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.orbit.javax.xml.bind.jaxb-api_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.orbit.sun.xml.bind.jaxb_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/plugins/org.wso2.carbon.extension.identity.authenticator.totp.connector_*.jar $WEB_APP_LIB
RUN cp $WSO2_SERVER_HOME/repository/components/dropins/org.wso2.carbon.extension.identity.authenticator.smsotp.connector-*.jar $WEB_APP_LIB

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
RUN npm install -g pnpm@latest

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
RUN mkdir -p $CATALINA_HOME/authenticationendpoint
WORKDIR /usr/local/tomcat/webapps/authenticationendpoint
COPY --from=build-stage /app/java/apps/authentication-portal/target/authenticationendpoint.war .
RUN jar -xvf authenticationendpoint.war
RUN rm -rf authenticationendpoint.war
COPY --from=is-stage  /home/wso2carbon/webapp-lib/* WEB-INF/lib
RUN chown -R tomcat:tomcat $CATALINA_HOME/authenticationendpoint
# Make port 8080 available to the world outside the container
EXPOSE 8080

# Run Tomcat
CMD ["catalina.sh", "run"]


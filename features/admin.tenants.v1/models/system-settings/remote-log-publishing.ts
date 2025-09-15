/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Enum for the publishing log types.
 */
export enum LogType {
    AUDIT = "audit",
    CARBON = "carbon"
}

/**
 * Interface for the remote log publishing configuration.
 */
export interface RemoteLogPublishingConfigurationInterface {
	/**
	 * Destination to where the logs should be published.
	 */
	remoteUrl: string,
	/**
	 * Connection timeout in milliseconds.
	 */
    connectTimeoutMillis: string,
	/**
	 * Should hostname be verified.
	 */
	verifyHostname: boolean,
	/**
	 * Log type for which the configurations should be applied.
	 */
	logType: LogType.AUDIT | LogType.CARBON,
	/**
	 * Remote server username
	 */
	username: string,
	/**
	 * Remote server password
	 */
	password?: string,
	/**
	 * Path to keystore location.
	 */
	keystoreLocation: string,
	/**
	 * Keystore password.
	 */
	keystorePassword?: string,
	/**
	 * Path to truststore location.
	 */
	truststoreLocation: string,
	/**
	 * Truststore password.
	 */
	truststorePassword?: string
}

/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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

export interface RealmConfigurationsInterface {
	homeRealmIdentifiers?: string[];
	idleSessionTimeoutPeriod?: string;
	rememberMePeriod?: string;
	realmConfig: RealmConfigInterface;
}

export interface RealmConfigInterface {
	adminUser: string;
	adminRole: string;
	everyoneRole: string;
}

export interface ConnectorPropertyInterface {
	name: string;
	value: string;
	displayName: string;
	description: string;
}

export interface GovernanceConnectorInterface {
	id: string;
	name: string;
	category: string;
	categoryId?: string;
	friendlyName: string;
	description?: string;
	order: string;
	subCategory: string;
	properties: ConnectorPropertyInterface[];
	displayName: string;
}

export interface GovernanceConnectorCategoryInterface {
	id?: string;
	name?: string;
	description?: string;
	connectors?: GovernanceConnectorInterface[];
	route?: string;
}

export interface GovernanceConnectorsInterface {
	categories?: GovernanceConnectorCategoryInterface[];
}

export interface UpdateGovernanceConnectorConfigPropertyInterface {
	name: string;
	value: any;
}

export interface UpdateGovernanceConnectorConfigInterface {
	operation: string;
	properties: UpdateGovernanceConnectorConfigPropertyInterface[];
}

export interface UpdateMultipleGovernanceConnectorsInterface {
	operation: string;
	connectors: UpdateGovernanceConnectorInterface[];
}

export interface UpdateGovernanceConnectorInterface {
	id: string;
	properties: UpdateGovernanceConnectorConfigPropertyInterface[];
}

export interface GovernanceCategoryForOrgsInterface {
	connectors: GovernanceConnectorForOrgsInterface[],
	id: string,
	name: string
}

export interface GovernanceConnectorForOrgsInterface {
	friendlyName: string,
	id: string,
	name: string,
	properties: string[]
}

/**
 * Interface for the admin advisory banner configuration.
 */
export interface AdminAdvisoryBannerConfigurationInterface {
    bannerContent: string;
    enableBanner: boolean;
}

export enum LogType {
    AUDIT = "AUDIT",
    CARBON = "CARBON"
}

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
	password: string,
	/**
	 * Path to keystore location.
	 */
	keystoreLocation: string,
	/**
	 * Keystore password.
	 */
	keystorePassword: string,
	/**
	 * Path to truststore location.
	 */
	truststoreLocation: string,
	/**
	 * Truststore password.
	 */
	truststorePassword: string
}

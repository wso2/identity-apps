/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the License); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
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
}

export interface GovernanceConnectorCategoryInterface {
	id?: string;
	name?: string;
	description?: string;
	connectors?: GovernanceConnectorInterface[];
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

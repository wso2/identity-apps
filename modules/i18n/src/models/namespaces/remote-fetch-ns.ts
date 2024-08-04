/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
export interface remoteFetchNS {
    components: {
        status: {
            details: string;
            header: string;
            hint: string;
            linkPopup: {
                content: string;
                header: string;
                subHeader: string;
            };
            refetch: string;
        };
    };
    forms: {
        getRemoteFetchForm: {
            actions: {
                remove: string;
                save: string;
            };
            fields: {
                accessToken: {
                    label: string;
                    placeholder: string;
                };
                enable: {
                    hint: string;
                    label: string;
                };
                connectivity: {
                    [key: string]: any;
                    label: string;
                };
                gitBranch: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                gitFolder: {
                    hint: string;
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                gitURL: {
                    label: string;
                    placeholder: string;
                    validations: {
                        required: string;
                    };
                };
                pollingFrequency: {
                    label: string;
                };
                sharedKey: {
                    label: string;
                };
                username: {
                    label: string;
                    placeholder: string;
                };
            };
            heading: {
                subTitle: string;
                title: string;
            };
        };
    };
    modal: {
        appStatusModal: {
            description: string;
            heading: string;
            primaryButton: string;
            secondaryButton: string;
        };
    };
    notifications: {
        createRepoConfig: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        deleteRepoConfig: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        getConfigDeploymentDetails: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        getConfigList: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        getRemoteRepoConfig: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
        triggerConfigDeployment: {
            error: {
                message: string;
                description: string;
            };
            genericError: {
                message: string;
                description: string;
            };
            success: {
                message: string;
                description: string;
            };
        };
    };
    pages: {
        listing: {
            title: string;
            subTitle: string;
        };
    };
    placeholders: {
        emptyListPlaceholder: {
            action: string;
            title: string;
            subtitles: string;
        };
    };
}

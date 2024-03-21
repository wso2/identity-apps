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
import { remoteFetchNS } from "../../../models";

export const remoteFetch: remoteFetchNS = {
    components: {
        status: {
            details: "Details",
            header: "Remote Configurations",
            hint: "No applications deployed currently.",
            linkPopup: {
                content: "",
                header: "Github Repository URL",
                subHeader: ""
            },
            refetch: "Refetch"
        }
    },
    forms: {
        getRemoteFetchForm: {
            actions: {
                remove: "Remove Configuration",
                save: "Save Configuration"
            },
            fields: {
                accessToken: {
                    label: "Github Personal Access Token",
                    placeholder: "Personal Access Token"
                },
                connectivity: {
                    children: {
                        polling: {
                            label: "Polling"
                        },
                        webhook: {
                            label: "Webhook"
                        }
                    },
                    label: "Connectivity Mechanism"
                },
                enable: {
                    hint: "Enable configuration to fetch applications",
                    label: "Enable Fetch Configuration"
                },
                gitBranch: {
                    hint: "Enable configuration to fetch applications",
                    label: "Github Branch",
                    placeholder: "Ex : Main",
                    validations: {
                        required: "Github branch is required."
                    }
                },
                gitFolder: {
                    hint: "Enable configuration to fetch applications",
                    label: "GitHub Directory",
                    placeholder: "Ex : SampleConfigFolder/",
                    validations: {
                        required: "Github configuration directory is required."
                    }
                },
                gitURL: {
                    label: "GitHub Repository URL",
                    placeholder: "Ex : https://github.com/samplerepo/sample-project",
                    validations: {
                        required: "Github Repository URL is required."
                    }
                },
                pollingFrequency: {
                    label: "Polling Frequency"
                },
                sharedKey: {
                    label: "GitHub Shared Key"
                },
                username: {
                    label: "Github Username",
                    placeholder: "Ex: John Doe"
                }
            },
            heading: {
                subTitle: "Configure repository for fetching applications",
                title: "Application Configuration Repository"
            }
        }
    },
    modal: {
        appStatusModal: {
            description: "",
            heading: "Application Fetch Status",
            primaryButton: "Refetch Applications",
            secondaryButton: ""
        }
    },
    notifications: {
        createRepoConfig: {
            error: {
                description: "{{ description }}",
                message: "Create Error"
            },
            genericError: {
                description: "An error occurred while creating remote repo config.",
                message: "Create Error"
            },
            success: {
                description: "Successfully created remote repo config.",
                message: "Create Successful"
            }
        },
        deleteRepoConfig: {
            error: {
                description: "{{ description }}",
                message: "Delete Error"
            },
            genericError: {
                description: "An error occurred while deleting remote repo config.",
                message: "Delete Error"
            },
            success: {
                description: "Successfully deleted remote repo config.",
                message: "Delete Successful"
            }
        },
        getConfigDeploymentDetails: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving deployment details.",
                message: "Retrieval Error"
            },
            success: {
                description: "Successfully retrieved deployment details.",
                message: "Retrieval Successful"
            }
        },
        getConfigList: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving deployment config list.",
                message: "Retrieval Error"
            },
            success: {
                description: "Successfully retrieved deployment config list.",
                message: "Retrieval Successful"
            }
        },
        getRemoteRepoConfig: {
            error: {
                description: "{{ description }}",
                message: "Retrieval Error"
            },
            genericError: {
                description: "An error occurred while retrieving the repo config.",
                message: "Retrieval Error"
            },
            success: {
                description: "Successfully retrieved the repo config.",
                message: "Retrieval Successful"
            }
        },
        triggerConfigDeployment: {
            error: {
                description: "{{ description }}",
                message: "Deployment Error"
            },
            genericError: {
                description: "An error occurred while deploying repo configs.",
                message: "Deployment Error"
            },
            success: {
                description: "Successfully deployed repo configs.",
                message: "Deployment Successful"
            }
        }
    },
    pages: {
        listing: {
            subTitle: "Configure github repository to work seamlessly with the identity server.",
            title: "Remote Configurations"
        }
    },
    placeholders: {
        emptyListPlaceholder: {
            action: "Configure Repository",
            subtitles: "Currently there are no repositories configured. You can add a new configuration.",
            title: "Add Configuration"
        }
    }
};

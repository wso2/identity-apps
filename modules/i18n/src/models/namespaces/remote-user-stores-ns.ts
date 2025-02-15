/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { NotificationItem } from "../common";

/**
 * Namespace for remote user stores feature.
 */
export interface RemoteUserStoresNS {
    pages: {
        create: {
            backButton: string;
            description: string;
            message: {
                optimized: string;
                classic: string;
            };
            notifications: {
                createUserStore: {
                    genericError: NotificationItem;
                    success: NotificationItem;
                };
            };
            title: string;
            stepper: {
                step1: {
                    description: string;
                    title: string;
                };
                step2: {
                    description: string;
                    title: string;
                };
            };
        };
        edit: {
            tabs: {
                guide: string;
                general: string;
                configurations: string;
            };
            guide: {
                heading: string;
                subHeading: string;
                steps: {
                    download: {
                        heading: string;
                        onPrem: {
                            description: string;
                            action: string;
                        };
                        remote: {
                            description: string;
                            verification: {
                                description: string;
                                heading: string;
                                step1: string;
                                step2: string;
                            }
                        };
                    };
                    configure: {
                        heading: string;
                        description: string;
                        docsDescription: string;
                    };
                    token: {
                        heading: string;
                        description: string;
                        action: string;
                        generatedToken: {
                            message: string;
                            label: string;
                        };
                    };
                    run: {
                        heading: string;
                        description: {
                            onPrem: string;
                            remote: string;
                        };
                        commands: {
                            unix: string;
                            windows: string;
                        };
                        successMessage: {
                            onPrem: string;
                            remote: string;
                        };
                        checkConnection: {
                            action: string;
                            successAction: string;
                            errorAction: string;
                            errorMessage: string;
                            errorHeading: string;
                        };
                    };
                    attributeMapping: {
                        heading: string;
                        description: string;
                    };
                };
            };
            generalSettings: {
                connections: {
                    emptyPlaceholder: {
                        heading: string;
                        description1: string;
                        description2: string;
                    },
                    heading: string;
                    actions: {
                        disconnect: string;
                        generate: string;
                        regenerate: string;
                    }
                }
            }
            configurations: {
                userAttributes: {
                    heading: string;
                };
                groupAttributes: {
                    heading: string;
                };
                attributes: {
                    heading: string;
                    custom: {
                        heading: string;
                        emptyPlaceholder: {
                            heading: string;
                            description: string;
                        }
                    };
                    local: {
                        heading: string;
                    };
                };
            };
        };
    };
    form: {
        fields: {
            accessType: {
                label: string;
                placeholder: string;
                validation: {
                    required: string;
                };
            };
            connectedUserStoreType: {
                label: string;
                placeholder: string;
                validation: {
                    required: string;
                };
            };
            description: {
                label: string;
                placeholder: string;
            };
            groupIdMapping: {
                helperText: string;
                label: string;
                placeholder: string;
                validation: {
                    required: string;
                    readGroupsEnabled: string;
                };
            };
            groupnameMapping: {
                helperText: string;
                label: string;
                placeholder: string;
                validation: {
                    required: string;
                    readGroupsEnabled: string;
                };
            };
            name: {
                label: string;
                placeholder: string;
                validation: {
                    required: string;
                };
            };
            readGroups: {
                helperText: string;
                label: string;
            };
            userIdMapping: {
                helperText: string;
                label: string;
                placeholder: string;
                validation: {
                    required: string;
                };
            };
            usernameMapping: {
                helperText: string;
                label: string;
                placeholder: string;
                validation: {
                    required: string;
                };
            };
            attributes: {
                validation: {
                    required: string;
                }
            }
        };
        sections: {
            groupAttributes: string;
            userAttributes: string;
        };
    };
    notifications: {
        typeFetchError: NotificationItem;
        tokenGenerateError: NotificationItem;
        connectionStatusCheckError: NotificationItem;
        disconnectError: NotificationItem;
        checkSumError: NotificationItem;
        tokenCountExceededError: NotificationItem;
    };
}

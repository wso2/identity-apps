/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { ConsoleNS } from "../../../models";

export const console: ConsoleNS = {
    common: {
        modals: {
            editAvatarModal: {
                content: {
                    gravatar: {
                        errors: {
                            noAssociation: {
                                content: "It seems like the selected email is not registered on Gravatar. " +
                                    "Sign up for a Gravatar account by visiting Gravatar official website or use " +
                                    "one of the following.",
                                header: "No matching Gravatar image found!"
                            }
                        },
                        heading: "Gravatar based on "
                    },
                    hostedAvatar: {
                        heading: "Hosted Image",
                        input: {
                            errors: {
                                http: {
                                    content: "The selected URL points to an insecure image served over HTTP. " +
                                        "Please proceed with caution.",
                                    header: "Insecure Content!"
                                },
                                invalid: {
                                    content: "Please enter a valid image URL"
                                }
                            },
                            hint: "Enter a valid image URL which is hosted on a third party location.",
                            placeholder: "Enter URL for the image.",
                            warnings: {
                                dataURL: {
                                    content: "Using Data URLs with large character count might result in database " +
                                        "issues. Proceed with caution.",
                                    header: "Double check the entered Data URL!"
                                }
                            }
                        }
                    },
                    systemGenAvatars: {
                        heading: "System generated avatar",
                        types: {
                            initials: "Initials"
                        }
                    }
                },
                description: null,
                heading: "Update profile picture",
                primaryButton: "Save",
                secondaryButton: "Cancel"
            },
            sessionTimeoutModal: {
                description: "You will be logged out of the current session due to inactivity." +
                    "Please choose Stay logged in if you would like to continue the session.",
                heading: "You will be logged out in <1>{{ time }}</1>.",
                primaryButton: "Stay logged in",
                secondaryButton: "Logout"
            }
        },
        placeholders: {
            brokenPage: {
                action: "Refresh the page",
                subtitles: {
                    0: "Something went wrong while displaying this page.",
                    1: "See the browser console for technical details."
                },
                title: "Something went wrong"
            }
        },
        validations: {
            inSecureURL: {
                description: "The entered URL a non-SSL URL. Please proceed with caution.",
                heading: "Insecure URL"
            },
            unrecognizedURL: {
                description: "The entered URL neither HTTP nor HTTPS. Please proceed with caution.",
                heading: "Unrecognized URL"
            }
        }
    },
    manage: {
        features: {
            users: {
                confirmations: {
                    terminateAllSessions: {
                        assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                        content: "If you proceed with this action, the user will be logged out of all active " +
                            "sessions. They will loose the progress of any ongoing tasks. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently terminate all the active sessions."
                    },
                    terminateSession: {
                        assertionHint: "Please type <1>{{ name }}</1> to confirm.",
                        content: "If you proceed with this action, the user will be logged out of the selected " +
                            "session. They will loose the progress of any ongoing tasks. Please proceed with caution.",
                        header: "Are you sure?",
                        message: "This action is irreversible and will permanently terminate the session."
                    }
                },
                editUser: {
                    tab: {
                        menuItems: {
                            0: "Profile",
                            1: "Groups",
                            2: "Roles",
                            3: "Active Sessions"
                        }
                    }
                },
                userSessions: {
                    components: {
                        sessionDetails: {
                            actions: {
                                terminateAllSessions: "Terminate All",
                                terminateSession: "TerminateSession"
                            },
                            labels: {
                                browser: "Browser",
                                deviceModel: "Device Model",
                                ip: "IP Address",
                                lastAccessed: "Last Accessed",
                                loggedInAs: "Logged in on <1>{{ app }}</1> as <3>{{ user }}</3>",
                                loginTime: "Login Time",
                                os: "Operating System",
                                recentActivity: "Recent Activity"
                            }
                        }
                    },
                    notifications: {
                        getUserSessions: {
                            error: {
                                description: "{{ description }}",
                                message: "Retrieval Error"
                            },
                            genericError: {
                                description: "An error occurred while retrieving user sessions.",
                                message: "Retrieval Error"
                            },
                            success: {
                                description: "Successfully retrieved user sessions.",
                                message: "Retrieval Successful"
                            }
                        },
                        terminateAllUserSessions: {
                            error: {
                                description: "{{ description }}",
                                message: "Termination Error"
                            },
                            genericError: {
                                description: "An error occurred while terminating the user sessions.",
                                message: "Termination Error"
                            },
                            success: {
                                description: "Successfully terminated all the user sessions.",
                                message: "Termination Successful"
                            }
                        },
                        terminateUserSession: {
                            error: {
                                description: "{{ description }}",
                                message: "Termination Error"
                            },
                            genericError: {
                                description: "An error occurred while terminating the user session.",
                                message: "Termination Error"
                            },
                            success: {
                                description: "Successfully terminated the user session.",
                                message: "Termination Successful"
                            }
                        }
                    },
                    placeholders: {
                        emptyListPlaceholder: {
                            subtitles: "There are no active sessions for this users.",
                            title: "No active sessions"
                        }
                    }
                }
            }
        }
    }
};

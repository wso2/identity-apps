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
                                content: "තෝරාගත් විද්‍යුත් තැපෑල Gravatar හි ලියාපදිංචි වී නැති බවක් පෙනේ. " +
                                    "Gravatar නිල වෙබ් අඩවියට පිවිසීමෙන් Gravatar ගිණුමක් සඳහා ලියාපදිංචි වන්න හෝ " +
                                    "පහත සඳහන් එකක් භාවිතා කරන්න.",
                                header: "ගැලපෙන Gravatar රූපයක් හමු නොවීය!"
                            }
                        },
                        heading: "Gravatar රූපය මත පදනම්ව "
                    },
                    hostedAvatar: {
                        heading: "සත්කාරක රූපය",
                        input: {
                            errors: {
                                http: {
                                    content: "තෝරාගන්නා ලද URL ලින්කුව මගින් HTTP ඔස්සේ යොමු වන්නේ අනාරක්ශිත " +
                                        "රූපයකටයි. කරුණාකර අවධානයෙන් ඉදිරියට යන්න.",
                                    header: "අනාරක්ෂිත අන්තර්ගතය!"
                                },
                                invalid: {
                                    content: "කරුණාකර වලංගු රූපයක URL ලින්කුවක් ඇතුලත් කරන්න."
                                }
                            },
                            hint: "තෙවන පාර්ශවීය ස්ථානයක සත්කාරක වන වලංගු රූප URL එකක් ඇතුළත් කරන්න.",
                            placeholder: "රූපය සඳහා වන URL ලින්කුව ඇතුලත් කරන්න.",
                            warnings: {
                                dataURL: {
                                    content: "විශාල අක්ෂර සංඛ්‍යාවක් සහිත දත්ත URL භාවිතා කිරීම දත්ත සමුදායේ " +
                                        "ගැටළු වලට හේතු විය හැක. ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                                    header: "ඇතුළත් කළ දත්ත URL එක දෙවරක් පරීක්ෂා කරන්න!"
                                }
                            }
                        }
                    },
                    systemGenAvatars: {
                        heading: "පද්ධතිය ජනනය කළ පරිශීලක රූපය",
                        types: {
                            initials: "මුලකුරු"
                        }
                    }
                },
                description: null,
                heading: "පරිශීලක පින්තූරය යාවත්කාලීන කරන්න",
                primaryButton: "සුරකින්න",
                secondaryButton: "අවලංගු කරන්න"
            },
            sessionTimeoutModal: {
                description: "අක්‍රියතාවය හේතුවෙන් ඔබ වත්මන් සැසියෙන් ඉවත් වනු ඇත. " +
                    "කරුණාකර ඔබ සැසිය දිගටම කරගෙන යාමට කැමති නම් ලොග් වී සිටින්න තෝරන්න.",
                heading: "ඔබ <1>{{ time }}</1> න් ඉවත් වනු ඇත.",
                primaryButton: "පුරනය වී සිටින්න",
                secondaryButton: "ඉවත් වන්න"
            }
        },
        placeholders: {
            brokenPage: {
                action: "පිටුව නැවුම් කරන්න",
                subtitles: {
                    0: "මෙම පිටුව ප්‍රදර්ශනය කිරීමේදී යම් දෝෂයක් ඇති වී ඇත.",
                    1: "තාක්ෂණික විස්තර සඳහා බ්‍රව්සර් කොන්සෝලය බලන්න."
                },
                title: "යම් දෝෂයක් ඇති වී ඇත"
            }
        },
        validations: {
            inSecureURL: {
                description: "ඇතුළත් කළ URL එක SSL නොවන URL එකකි. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                heading: "අනාරක්ෂිත URL ලින්කුවකි"
            },
            unrecognizedURL: {
                description: "ඇතුළත් කළ URL එක HTTP හෝ HTTPS නොවේ. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                heading: "හඳුනා නොගත් URL ලින්කුවකි"
            }
        }
    },
    develop: {
        features: {
            applications: {
                confirmations: {
                    clientSecretHashDisclaimer: {
                        forms: {
                            clientIdSecretForm: {
                                clientId: {
                                    hide: "හැඳුනුම්පත සඟවන්න",
                                    label: "සේවාලාභී හැඳුනුම්පත",
                                    placeholder: "සේවාලාභී හැඳුනුම්පත",
                                    show: "හැඳුනුම්පත පෙන්වන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                clientSecret: {
                                    hide: "රහස සඟවන්න",
                                    label: "සේවාලාභී රහස",
                                    placeholder: "සේවාලාභී රහස",
                                    show: "රහස පෙන්වන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            }
                        },
                        modal: {
                            assertionHint: "",
                            content: "",
                            header: "OAuth යෙදුම් අක්තපත්‍ර",
                            message: "පාරිභෝගික රහස් අගය සරල පෙළෙහි එක් වරක් පමණක් පෙන්වනු ඇත. " +
                                "කරුණාකර එය ආරක්ෂිත තැනක පිටපත් කර සුරැකීමට වග බලා ගන්න."
                        }
                    }
                },
                forms: {
                    inboundOIDC: {
                        messages: {
                            revokeDisclaimer: {
                                content: "යෙදුම අවලංගු කර ඇත. ඔබට යෙදුම නැවත සක්‍රිය කිරීමට අවශ්‍ය නම් " +
                                    "කරුණාකර රහස ජනනය කරන්න.",
                                heading: "යෙදුම අවලංගු කර ඇත"
                            }
                        }
                    }
                },
                popups: {
                    appStatus: {
                        active: {
                            content: "යෙදුම සක්‍රියයි.",
                            header: "ක්‍රියාකාරී",
                            subHeader: ""
                        },
                        notConfigured: {
                            content: "යෙදුම වින්‍යාස කර නොමැත. කරුණාකර ප්‍රවේශ වින්‍යාසයන් වින්‍යාස කරන්න.",
                            header: "වින්‍යාස කර නොමැත",
                            subHeader: ""
                        },
                        revoked: {
                            content: "යෙදුම අවලංගු කර ඇත. කරුණාකර ප්‍රවේශය වින්‍යාස කිරීමේදී යෙදුම නැවත " +
                                "සක්‍රිය කරන්න.",
                            header: "අවලංගු කරන ලදි",
                            subHeader: ""
                        }
                    }
                }
            }
        }
    },
    manage: {
        features: {
            remoteFetch: {
                components: {
                    status: {
                        details: "විස්තර",
                        header: "දුරස්ථ වින්‍යාසයන්",
                        hint: "දැනට කිසිදු යෙදුමක් යොදවා නොමැත.",
                        linkPopup: {
                            content: "",
                            header: "GitHub නිධිය URL",
                            subHeader: ""
                        },
                        refetch: "නැවත ලබා ගන්න"
                    }
                },
                forms: {
                    getRemoteFetchForm: {
                        actions: {
                            remove: "වින්‍යාසය ඉවත් කරන්න",
                            save: "වින්‍යාසය සුරකින්න"
                        },
                        fields: {
                            accessToken: {
                                label: "GitHub පුද්ගලික ප්‍රවේශ ටෝකනය",
                                placeholder: "පුද්ගලික ප්‍රවේශ ටෝකනය"
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
                                label: "සම්බන්ධතා යාන්ත්‍රණය"
                            },
                            enable: {
                                hint: "යෙදුම් ලබා ගැනීම සඳහා වින්‍යාසය සක්‍රීය කරන්න",
                                label: "ලබා ගැනීමේ වින්‍යාසය සක්‍රීය කරන්න"
                            },
                            gitBranch: {
                                hint: "යෙදුම් ලබා ගැනීම සඳහා වින්‍යාසය සක්‍රීය කරන්න",
                                label: "GitHub ශාඛාව",
                                placeholder: "උදා : Main",
                                validations: {
                                    required: "GitHub ශාඛාව අවශ්‍යයි."
                                }
                            },
                            gitFolder: {
                                hint: "යෙදුම් ලබා ගැනීම සඳහා වින්‍යාසය සක්‍රීය කරන්න",
                                label: "GitHub නාමාවලිය",
                                placeholder: "උදා : SampleConfigFolder/",
                                validations: {
                                    required: "GitHub වින්‍යාස නාමාවලිය අවශ්‍යයි."
                                }
                            },
                            gitURL: {
                                label: "GitHub නිධිය URL",
                                placeholder: "උදා : https://github.com/samplerepo/sample-project",
                                validations: {
                                    required: "GitHub නිධිය URL අවශ්‍යයි."
                                }
                            },
                            pollingFrequency: {
                                label: "Polling Frequency"
                            },
                            sharedKey: {
                                label: "GitHub හවුල් යතුර"
                            },
                            username: {
                                label: "GitHub පරිශීලක නාමය",
                                placeholder: "උදා: John Doe"
                            }
                        },
                        heading: {
                            subTitle: "යෙදුම් ලබා ගැනීම සඳහා නිධිය වින්‍යාස කරන්න",
                            title: "යෙදුම් වින්‍යාස කිරීමේ ගබඩාව"
                        }
                    }
                },
                modal: {
                    appStatusModal: {
                        description: "",
                        heading: "යෙදුම් ලබා ගැනීමේ තත්වය",
                        primaryButton: "යෙදුම් නැවත ලබා ගන්න",
                        secondaryButton: ""
                    }
                },
                notifications: {
                    createRepoConfig: {
                        error: {
                            description: "{{ description }}",
                            message: "දෝෂයක් සාදන්න"
                        },
                        genericError: {
                            description: "දුරස්ථ නිධි වින්‍යාසය නිර්මාණය කිරීමේදී දෝෂයක් ඇතිවිය.",
                            message: "දෝෂයක් සාදන්න"
                        },
                        success: {
                            description: "දුරස්ථ නිධි වින්‍යාසය සාර්ථකව නිර්මාණය කරන ලදි.",
                            message: "සාර්ථක ලෙස සාදන ලදී"
                        }
                    },
                    deleteRepoConfig: {
                        error: {
                            description: "{{ description }}",
                            message: "දෝෂය මකන්න"
                        },
                        genericError: {
                            description: "දුරස්ථ නිධි වින්‍යාසය මකාදැමීමේදී දෝෂයක් ඇතිවිය.",
                            message: "දෝෂය මකන්න"
                        },
                        success: {
                            description: "දුරස්ථ නිධි වින්‍යාසය සාර්ථකව මකා දමන ලදි.",
                            message: "සාර්ථකව මකා දමන්න"
                        }
                    },
                    getConfigDeploymentDetails: {
                        error: {
                            description: "{{ description }}",
                            message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
                        },
                        genericError: {
                            description: "යෙදවීමේ තොරතුරු ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                            message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
                        },
                        success: {
                            description: "යෙදවීමේ විස්තර සාර්ථකව ලබා ගන්නා ලදි.",
                            message: "නැවත ලබා ගැනීම සාර්ථකයි"
                        }
                    },
                    getConfigList: {
                        error: {
                            description: "{{ description }}",
                            message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
                        },
                        genericError: {
                            description: "යෙදවීමේ වින්‍යාස ලැයිස්තුව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                            message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
                        },
                        success: {
                            description: "යෙදවීමේ වින්‍යාස ලැයිස්තුව සාර්ථකව ලබා ගන්නා ලදි.",
                            message: "නැවත ලබා ගැනීම සාර්ථකයි"
                        }
                    },
                    getRemoteRepoConfig: {
                        error: {
                            description: "{{ description }}",
                            message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
                        },
                        genericError: {
                            description: "නිධිය වින්‍යාසය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                            message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
                        },
                        success: {
                            description: "නිධිය වින්‍යාසය සාර්ථකව ලබා ගන්නා ලදි.",
                            message: "නැවත ලබා ගැනීම සාර්ථකයි"
                        }
                    },
                    triggerConfigDeployment: {
                        error: {
                            description: "{{ description }}",
                            message: "යෙදවීමේ දෝෂය"
                        },
                        genericError: {
                            description: "නිධි වින්‍යාසයන් යෙදවීමේදී දෝෂයක් ඇතිවිය.",
                            message: "යෙදවීමේ දෝෂය"
                        },
                        success: {
                            description: "නිධි වින්‍යාසයන් සාර්ථකව යොදවා ඇත.",
                            message: "යෙදවීම සාර්ථකයි"
                        }
                    }
                },
                pages: {
                    listing: {
                        subTitle: "හැඳුනුම් සේවාදායකය සමඟ බාධාවකින් තොරව වැඩ කිරීමට ගිතුබ් ගබඩාව " +
                            "වින්‍යාස කරන්න.",
                        title: "දුරස්ථ වින්‍යාසයන්"
                    }
                },
                placeholders: {
                    emptyListPlaceholder: {
                        action: "දුරස්ථ වින්‍යාසයන්",
                        subtitles: "දැනට කිසිදු ගබඩාවක් වින්‍යාස කර නොමැත. ඔබට නව වින්‍යාසයක් එක් කළ හැකිය.",
                        title: "වින්‍යාසය එක් කරන්න"
                    }
                }
            },
            users: {
                confirmations: {
                    terminateAllSessions: {
                        assertionHint: "වින්‍යාසය එක් කරන්න <1>{{ name }}</1> ටයිප් කරන්න.",
                        content: "ඔබ මෙම ක්‍රියාව සමඟ ඉදිරියට ගියහොත්, පරිශීලකයා සියළුම ක්‍රියාකාරී සැසි වලින් " +
                            "ඉවත් වනු ඇත. ඔවුන් දැනට කරගෙන යන ඕනෑම කාර්යයක ප්‍රගතිය නැති කර දමනු ඇත. " +
                            "කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                        header: "ඔබට විශ්වාසද?",
                        message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර සියලු ක්‍රියාකාරී සැසි ස්ථිරවම අවසන් වේ."
                    },
                    terminateSession: {
                        assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{ name }}</1> ටයිප් කරන්න.",
                        content: "ඔබ මෙම ක්‍රියාව සමඟ ඉදිරියට ගියහොත්, පරිශීලකයා තෝරාගත් සැසිවාරයෙන් ඉවත් " +
                            "වනු ඇත. ඔවුන් දැනට කරගෙන යන ඕනෑම කාර්යයක ප්‍රගතිය ලිහිල් කරනු ඇත. " +
                            "කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                        header: "ඔබට විශ්වාසද?",
                        message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර සැසිය ස්ථිරවම අවසන් වේ."
                    }
                },
                editUser: {
                    tab: {
                        menuItems: {
                            0: "පැතිකඩ",
                            1: "කණ්ඩායම්",
                            2: "භූමිකාවන්",
                            3: "ක්‍රියාකාරී සැසි"
                        }
                    }
                },
                userSessions: {
                    components: {
                        sessionDetails: {
                            actions: {
                                terminateAllSessions: "සියල්ල අවසන් කරන්න",
                                terminateSession: "සැසිය අවසන් කරන්න"
                            },
                            labels: {
                                browser: "බ්‍රව්සරය",
                                deviceModel: "උපාංග ආකෘතිය",
                                ip: "IP ලිපිනය",
                                lastAccessed: "අවසන් වරට ප්‍රවේශ වූයේ",
                                loggedInAs: "<1>{{ app }}</1> ලෙස <3>{{ user }}</3> ලෙස පුරනය වී ඇත.",
                                loginTime: "පිවිසුම් වේලාව",
                                os: "මෙහෙයුම් පද්ධතිය",
                                recentActivity: "මෑත ක්‍රියාකාරකම"
                            }
                        }
                    },
                    notifications: {
                        getUserSessions: {
                            error: {
                                description: "{{ description }}",
                                message: "ලබා ගැනීමේ දෝෂය"
                            },
                            genericError: {
                                description: "පරිශීලක සැසි ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                                message: "ලබා ගැනීමේ දෝෂය"
                            },
                            success: {
                                description: "පරිශීලක සැසි සාර්ථකව ලබා ගන්නා ලදි.",
                                message: "නැවත ලබා ගැනීම සාර්ථකයි"
                            }
                        },
                        terminateAllUserSessions: {
                            error: {
                                description: "{{ description }}",
                                message: "අවසන් කිරීමේ දෝෂය"
                            },
                            genericError: {
                                description: "පරිශීලක සැසි අවසන් කිරීමේදී දෝෂයක් ඇතිවිය.",
                                message: "අවසන් කිරීමේ දෝෂය"
                            },
                            success: {
                                description: "සියලුම පරිශීලක සැසි සාර්ථකව අවසන් කරන ලදි.",
                                message: "අවසන් කිරීම සාර්ථකයි"
                            }
                        },
                        terminateUserSession: {
                            error: {
                                description: "{{ description }}",
                                message: "අවසන් කිරීමේ දෝෂය"
                            },
                            genericError: {
                                description: "පරිශීලක සැසි අවසන් කිරීමේදී දෝෂයක් ඇතිවිය.",
                                message: "අවසන් කිරීමේ දෝෂය"
                            },
                            success: {
                                description: "පරිශීලක සැසිය සාර්ථකව අවසන් කරන ලදි.",
                                message: "අවසන් කිරීම සාර්ථකයි"
                            }
                        }
                    },
                    placeholders: {
                        emptyListPlaceholder: {
                            subtitles: "මෙම පරිශීලකයින් සඳහා සක්‍රීය සැසි නොමැත.",
                            title: "ක්‍රියාකාරී සැසි නොමැත"
                        }
                    }
                }
            }
        }
    }
};

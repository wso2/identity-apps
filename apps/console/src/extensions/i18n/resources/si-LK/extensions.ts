/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import { Extensions } from "../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 * sort-keys is suppressed temporarily until the existing warnings are fixed.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const extensions: Extensions = {
    common: {
        community: "ප්‍රජාව",
        help: {
            communityLink: "ප්රජාවගෙන් විමසන්න",
            docSiteLink: "ප්‍රලේඛනය",
            helpCenterLink: "උදවු සදහා අමතන්න",
            helpDropdownLink: "උදව් ලබා ගන්න"
        },
        learnMore: "වැඩිදුර ඉගෙන ගන්න",
        quickStart: {
            greeting: {
                alternativeHeading: "ආයුබෝවන්, {{username}}",
                heading: "ආයුබෝවන්, {{username}}",
                subHeading: "{{productName}} සමඟ ආරම්භ කිරීමට පහසු පියවර කිහිපයක් මෙන්න"
            },
            sections: {
                addSocialLogin: {
                    actions: {
                        setup: "සමාජ සම්බන්ධතා සකසන්න",
                        view: "සමාජ සම්බන්ධතා බලන්න"
                    },
                    description:
                        "ඔබේ පරිශීලකයින්ට තමන් කැමති හැඳුනුම්පත් සපයන්නෙකු සමඟ ඔබේ යෙදුම් වලට ප්‍රවේශ වීමට ඉඩ දෙන්න.",
                    heading: "සමාජ පිවිසුම එකතු කරන්න"
                },
                integrateApps: {
                    actions: {
                        create: "යෙදුම ලියාපදිංචි කරන්න",
                        manage: "යෙදුම් කළමනාකරණය කරන්න",
                        view: "යෙදුම් බලන්න"
                    },
                    capabilities: {
                        sso: "තනි පුරනය වීම",
                        mfa: "බහු සාධක සත්‍යාපනය",
                        social: "සමාජ පිවිසුම"
                    },
                    description:
                        "ඔබේ යෙදුම ලියාපදිංචි කර එස්එස්ඕ, එම්එෆ්ඒ, සමාජ පිවිසුම් සහ විවිධ නම්‍යශීලී සත්‍යාපන නීති වින්‍යාස " +
                        "කිරීමෙන් ඔබට අවශ්‍ය පරිශීලක පිවිසුම් අත්දැකීම සැලසුම් කරන්න.",
                    heading: "ඔබගේ යෙදුම් වලට ප්‍රවේශ වීම ඒකාබද්ධ කරන්න"
                },
                learn: {
                    actions: {
                        view: "ලේඛන බලන්න"
                    },
                    description:
                        "අස්ගාර්ඩියෝ භාවිතා කිරීමට පටන් ගන්න. ඕනෑම ආකාරයක යෙදුමක් සඳහා මිනිත්තු කිහිපයකින් සත්‍යාපනය " +
                        "ක්‍රියාත්මක කරන්න.",
                    heading: "ඉගෙන ගන්න"
                },
                manageUsers: {
                    actions: {
                        create: "පාරිභෝගිකයෙකු එකතු කරන්න",
                        manage: "පරිශීලකයින් කළමනාකරණය කරන්න",
                        view: "පරිශීලකයින් බලන්න"
                    },
                    capabilities: {
                        collaborators: "හවුල්කරුවන්",
                        customers: "පාරිභෝගිකයන්",
                        groups: "පරිශීලක කණ්ඩායම්"
                    },
                    description:
                        "ගනුදෙනුකරුවන් සඳහා පරිශීලක ගිණුම් සාදන්න සහ ඔබේ සංවිධානයට හවුල්කරුවන්ට ආරාධනා කරන්න. " +
                        "ඔබේ පරිශීලකයින්ට ඔවුන්ගේ පැතිකඩ ආරක්ෂිතව ස්වයං කළමනාකරණය කිරීමට ඉඩ දෙන්න.",
                    heading: "පරිශීලකයින් සහ කණ්ඩායම් කළමනාකරණය කරන්න"
                },
                asgardeoTryIt: {
                    errorMessages: {
                        appCreateGeneric: {
                            message: "කුමක් හෝ වැරදී ගියා!",
                            description: "අත්හදා බලන යෙදුම ආරම්භ කිරීමට අසමත් විය."
                        },
                        appCreateDuplicate: {
                            message: "යෙදුම දැනටමත් පවතී!",
                            description: "කරුණාකර දැනට පවතින {{productName}} Try It යෙදුම මකා දමන්න."
                        }
                    }
                }
            }
        },
        upgrade: "උසස් කිරීම",
        dropdown: {
            footer: {
                privacyPolicy: "පෞද්ගලිකත්වය",
                cookiePolicy: "කුකීස්",
                termsOfService: "කොන්දේසි"
            }
        }
    },
    console: {
        application: {
            quickStart: {
                addUserOption: {
                    description: "යෙදුමට ප්‍රවේශ වීම සඳහා ඔබට <1>පාරිභෝගික ගිණුමක්</1> ගිණුමක් අවශ්‍යයි.",
                    hint:
                        "ඔබට දැනටමත් පාරිභෝගික ගිණුමක් නොමැති නම්, එකක් සෑදීමට පහත බොත්තම ක්ලික් කරන්න. විකල්පයක් වශයෙන්, " +
                        "<1>පරිශීලක කළමනාකරණය > පරිශීලකයින් වෙත යන්න</1><3></3> සහ පාරිභෝගිකයින් තනන්න.",
                    message: "ඔබට දැනටමත් පාරිභෝගික පරිශීලක ගිණුමක් නොමැති නම්, ඔබේ සංවිධාන පරිපාලක අමතන්න."
                },
                spa: {
                    customConfig: {
                        heading: "ඔබට ඕනෑම SPA තාක්‍ෂණයක් සඳහා Asgardeo සමඟින් <1>PKCE සමඟ අවසර කේත ප්‍රවාහය</1> " +
                            "භාවිතයෙන් ප්‍රවේශය ක්‍රියාත්මක කළ හැක.",
                        anySPATechnology: "හෝ ඕනෑම SPA තාක්ෂණයක්",
                        configurations: "සැකසුම්",
                        protocolConfig: "ඔබගේ යෙදුම Asgardeo සමඟ ඒකාබද්ධ කිරීමට පහත වින්‍යාසයන් භාවිතා කරන්න. " +
                            "න්‍යාස කිරීම් පිළිබඳ වැඩි විස්තර සඳහා, <1>ප්‍රොටෝකෝල</1> ටැබය වෙත යන්න.",
                        clientId: "සේවාලාභී හැඳුනුම්පත",
                        baseUrl: "මූලික URL",
                        redirectUrl: "හරවා යවන්න URL",
                        scope: "විෂය පථය",
                        serverEndpoints: "සේවාදායක අන්ත ලක්ෂ්‍ය පිළිබඳ විස්තර <1>තොරතුරු</1> පටිත්තෙහි ඇත."

                    },
                    techSelection: {
                        heading: "Asgardeo සහ 3වන පාර්ශ්ව ඒකාබද්ධ කිරීම් මගින් සකසන ලද SDK භාවිතා කරන්න."
                    }
                },
                technologySelectionWrapper: {
                    subHeading:
                        "ඔබට <1>සේවාදායක අන්ත ලක්ෂ්‍ය විස්තර</1> භාවිතා කර " +
                        "ඔබේම යෙදුමක් ඒකාබද්ධ කිරීම හෝ අපේ <3>ප්‍රලේඛනය</3> කියවා වැඩිදුර දැන ගැනීමට හැකිය.",
                    otherTechnology: "හෝ ඕනෑම ජංගම තාක්ෂණයක්"
                },
                twa: {
                    common: {
                        orAnyTechnology: "හෝ ඕනෑම තාක්ෂණයක්"
                    },
                    oidc: {
                        customConfig: {
                            clientSecret: "සේවාදායකයාගේ රහස",
                            heading: "ඔබට ඕනෑම සාම්ප්‍රදායික වෙබ් යෙදුමක් සඳහා Asgardeo සමඟින් <1>අධිපත්‍ය කේත ප්‍රවාහය</1> " +
                                "භාවිතයෙන් පිවිසීම ක්‍රියාත්මක කළ හැක."
                        }
                    },
                    saml: {
                        customConfig: {
                            heading: "Asgardeo ඕනෑම සම්ප්‍රදායික වෙබ් යෙදුමක් සමඟ ඒකාබද්ධ කිරීමට" +
                                " <1>SAML වින්‍යාසයන්</1> සොයා ගන්න.",
                            issuer: "නිකුත් කරන්නා",
                            acsUrl: "ප්‍රකාශය පාරිභෝගික සේවා URL",
                            idpEntityId: "IdP ආයතනය ID",
                            idpUrl: "IdP URL"
                        }
                    }
                }
            }
        },
        applicationRoles: {
            assign: "පැවරීම",
            assignGroupWizard: {
                heading: "කණ්ඩායම් පවරන්න",
                subHeading: "යෙදුම් භූමිකාවට කණ්ඩායම් පවරන්න."
            },
            authenticatorGroups: {
                goToConnections: "අන්තර්ගතයන්ගේ සම්බන්ධතා වෙත යන්න",
                groupsList:{
                    assignGroups: "කණ්ඩායම් පැවරීම",
                    notifications: {
                        fetchAssignedGroups: {
                            error: {
                                description: "{{description}}",
                                message: "පවරා ඇති කණ්ඩායම් ලබා ගැනීමේදී දෝෂයක් සිදු විය"
                            },
                            genericError: {
                                description: "පවරා ඇති කණ්ඩායම් ලබා ගැනීමේදී දෝෂයක් ඇති විය.",
                                message: "දෝෂයක් සිදු විය"
                            }
                        },
                        updateAssignedGroups: {
                            error: {
                                description: "{{description}}",
                                message: "පවරා ඇති කණ්ඩායම් යාවත්කාලීන කිරීමේදී දෝෂයක් සිදු විය"
                            },
                            genericError: {
                                description: "පවරා ඇති කණ්ඩායම් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇති විය.",
                                message: "දෝෂයක් සිදු විය"
                            },
                            success: {
                                description: "පවරා ඇති කණ්ඩායම් සාර්ථකව යාවත්කාලීන කරන ලදී.",
                                message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                            }
                        }
                    }
                },
                hint: "භූමිකාවකට සම්බන්ධතාවය (කණ්ඩායම්) පැවරීමේදී, <3>යෙදුම</3> " +
                    "හි භූමිකාවන් පටිත්තෙහි <1>සම්බන්ධතා (කණ්ඩායම්) භූමිකාව විභේදන පාලනය</1> තුළ සබැඳුම සක්‍රීය කර ඇති බවට වග බලා ගන්න.",
                placeholder: {
                    title: "සත්‍යාපන කණ්ඩායම් නොමැත",
                    subTitle: {
                        0: "දැනට සත්‍යාපන කණ්ඩායම් නොමැත.",
                        1: "යෙදුම් සැකසීම් තුළ පුරනය වීමේ ක්‍රම පටිත්ත වෙත පිවිසීමෙන් ඔබට නව සත්‍යාපන කණ්ඩායම් එකතු කළ හැක."
                    }
                }
            },
            connectorGroups: {
                placeholder: {
                    title: "ෆෙඩරේටඩ් සත්‍යාපන කණ්ඩායම් නැත",
                    subTitle: {
                        0: "මේ මොහොතේ ලබා ගත හැකි කණ්ඩායම් නොමැත.",
                        1: "නව කණ්ඩායමක් එක් කිරීමෙන් ඔබේ ෆෙඩරේටඩ් සත්‍යාපකය වෙතින් ඔබට ලැබෙන කණ්ඩායම් නිර්වචනය කරන්න."
                    }
                }
            },
            heading: "යෙදුම් භූමිකාවන්",
            searchApplication: "සෙවුම් යෙදුම",
            subHeading: "යෙදුමේ අවශ්‍යතාවය මත පදනම්ව භූමිකාවන් බලන්න සහ කළමනාකරණය කරන්න.",
            roleGroups: {
                assignGroup: "කණ්ඩායම පැවරීම",
                searchGroup: "සෙවුම් කණ්ඩායම්",
                placeholder: {
                    title: "කණ්ඩායම් කිසිවක් පවරා නැත",
                    subTitle: {
                        0: "මෙම භූමිකාවට පවරා ඇති කණ්ඩායම් නොමැත.",
                        1: "කණ්ඩායමක් පැවරීමට, Assign Group බොත්තම ක්ලික් කරන්න."
                    }
                },
                notifications: {
                    addGroups: {
                        error: {
                            message: "දෝෂයක් සිදු විය",
                            description: "කණ්ඩායම එක් කිරීමේදී දෝෂයක් ඇති විය."
                        },
                        success: {
                            message: "කණ්ඩායම සාර්ථකව එකතු කරන ලදී",
                            description: "කණ්ඩායම සාර්ථකව භූමිකාවට එක් කර ඇත."
                        }
                    },
                    fetchGroups: {
                        error: {
                            message: "දෝෂයක් සිදු විය",
                            description: "කණ්ඩායම් ලබා ගැනීමේ දෝෂයක් සිදු විය."
                        }
                    }
                },
                confirmation: {
                    deleteRole: {
                        message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර සමූහය යෙදුම් භූමිකාවෙන් ඉවත් කරනු ඇත.",
                        content: "ඔබ මෙම කණ්ඩායම යෙදුම් භූමිකාවෙන් ඉවත් කළහොත්, මෙම භූමිකාව හා සම්බන්ධ අවසර සමූහයෙන් ඉවත් කරනු ලැබේ. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න."
                    }
                }
            },
            roleList: {
                placeholder: {
                    title: "යෙදුම් භූමිකාවන් නොමැත",
                    subTitle: {
                        0: "දැනට යෙදුම් භූමිකාවන් නොමැත.",
                        1: "යෙදුම් සැකසීම් තුළ භූමිකා පටිත්ත වෙත පිවිසීමෙන් ඔබට නව යෙදුම් භූමිකාවක් එක් කළ හැක."
                    }
                }
            },
            roleMapping: {
                heading: "භූමිකා සිතියම්කරණ සැකසුම්",
                subHeading: "අවසර ප්‍රවාහය අතරතුර යෙදුම් භූමිකා සිතියම්ගත කිරීම් භාවිත කළ යුතුද යන්න වින්‍යාස කරන්න.",
                notifications: {
                    sharedApplication: {
                        error: {
                            description: "බෙදාගත් යෙදුම් ලබා ගැනීමේදී දෝෂයක් ඇති විය.",
                            message: "දෝෂයක් සිදු විය"
                        }
                    },
                    updateRole: {
                        error: {
                            description: "{{description}}",
                            message: "භූමිකාව යාවත්කාලීන කිරීමේ දෝෂයකි"
                        },
                        genericError: {
                            description: "භූමිකාව යාවත්කාලීන කිරීමේදී දෝෂයක් ඇති විය.",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        success: {
                            description: "භූමිකාව සාර්ථකව යාවත්කාලීන කරන ලදී.",
                            message: "සාර්ථකව යාවත්කාලීන කරන ලදී"
                        }
                    }
                }
            },
            roles: {
                heading: "Roles",
                subHeading: "භූමිකාවන් සහ අවසර කළමනාකරණය කරන්න.",
                goBackToRoles: "භූමිකාවන් වෙත ආපසු යන්න",
                orgRoles: {
                    heading: "සංවිධානයේ භූමිකාවන්",
                    subHeading: "මෙහි සංවිධාන භූමිකාවන් කළමනාකරණය කරන්න."
                }
            }
        },
        identityProviderGroups: {
            claimConfigs: {
                groupAttributeLabel: "කණ්ඩායම් ගුණාංගය",
                groupAttributeHint: "Federated Authenticator වෙතින් වන ගුණාංගය යෙදුම් විශේෂිත භූමිකාවන්ට සිතියම්ගත කෙරේ. යෙදුම් ගුණාංගය ආපසු ලබා දීම සඳහා මෙය අර්ථ දැක්විය යුතුය.",
                groupAttributePlaceholder: "සිතියම්ගත ගුණාංගය ඇතුළත් කරන්න",
                notifications: {
                    fetchConfigs: {
                        error: {
                            description: "{{description}}",
                            message: "හිමිකම් වින්‍යාස කිරීම් ලබා ගැනීමේදී දෝෂයක් ඇති විය"
                        },
                        genericError: {
                            description: "හිමිකම් වින්‍යාස කිරීම් ලබා ගැනීමේදී දෝෂයක් ඇති විය.",
                            message: "දෝෂයක් සිදු විය"
                        }
                    }
                }
            },
            createGroupWizard: {
                groupNameLabel: "කණ්ඩායම් නම",
                groupNamePlaceHolder: "කණ්ඩායම් නමක් ඇතුළත් කරන්න",
                groupNameHint: "මෙය ඔබගේ ෆෙඩරේටඩ් අනන්‍යතා සපයන්නාගෙන් ආපසු ලබා දෙන කණ්ඩායම්වල නමට අනුරූප විය යුතුය.",
                subHeading: "නව අනන්‍යතා සැපයුම් කණ්ඩායමක් සාදන්න.",
                notifications: {
                    createIdentityProviderGroup: {
                        error: {
                            description: "{{description}}",
                            message: "දෝෂයක් සිදු විය"
                        },
                        genericError: {
                            description: "අනන්‍යතා සපයන්නාගේ කණ්ඩායම නිර්මාණය කිරීමේදී දෝෂයක් ඇති විය.",
                            message: "දෝෂයක් සිදු විය"
                        },
                        success: {
                            description: "අනන්‍යතා සැපයුම් කණ්ඩායම සාර්ථකව නිර්මාණය කර ඇත.",
                            message: "සාර්ථකව නිර්මාණය කරන ලදී"
                        }
                    },
                    duplicateGroupError: {
                        error: {
                            description: "අනන්‍යතා සපයන්නාගේ කණ්ඩායම දැනටමත් පවතී. කරුණාකර නව කණ්ඩායමක් තෝරන්න.",
                            message: "දෝෂයක් සිදු විය"
                        }
                    }
                }
            },
            groupsList: {
                confirmation: {
                    deleteGroup: {
                        message: "මෙම ක්රියාව ආපසු හැරවිය නොහැකි ය.",
                        content: "මෙම ක්‍රියාව {{groupName}} අනන්‍යතා සපයන්නාගේ කණ්ඩායම ස්ථිරවම මකනු ඇත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න"
                    }
                },
                newGroup: "නව සමූහය",
                noGroupsAvailable: "කණ්ඩායම් නොමැත",
                notifications: {
                    fetchGroups: {
                        error: {
                            description: "{{description}}",
                            message: "අනන්‍යතා සපයන්නන්ගේ කණ්ඩායම් ලබා ගැනීමේදී දෝෂයක් සිදු විය"
                        },
                        genericError: {
                            description: "අනන්‍යතා සපයන්නන්ගේ කණ්ඩායම් ලබා ගැනීමේදී දෝෂයක් ඇති විය.",
                            message: "දෝෂයක් සිදු විය"
                        }
                    },
                    deleteGroup: {
                        error: {
                            description: "{{description}}",
                            message: "අනන්‍යතා සපයන්නාගේ කණ්ඩායම මකා දැමීමේදී දෝෂයක් සිදු විය"
                        },
                        genericError: {
                            description: "අනන්‍යතා සපයන්නාගේ කණ්ඩායම මකා දැමීමේදී දෝෂයක් ඇති විය.",
                            message: "දෝෂයක් සිදු විය"
                        },
                        success: {
                            description: "අනන්යතා සපයන්නාගේ කණ්ඩායම සාර්ථකව මකා ඇත.",
                            message: "සාර්ථකව මකා දමන ලදී"
                        }
                    }
                },
                searchByName: "නම අනුව සොයන්න"
            }
        },
        marketingConsent: {
            heading: "අපි සම්බන්ධව සිටිමු!",
            description: "ඔබගේ එන ලිපි වෙත කෙලින්ම නවතම පුවත් සහ නිෂ්පාදන යාවත්කාලීන කිරීම් ලබා ගැනීම සඳහා අපගේ පුවත් පත්රිකාවට දායක වන්න.",
            actions: {
                subscribe: "දායක වන්න",
                decline: "මෙය නැවත පෙන්වන්න එපා"
            },
            notifications: {
                errors: {
                    fetch: {
                        message: "මොකක්හරි වැරැද්දක් වෙලා",
                        description: "පරිශීලක එකඟතා දත්ත ලබා ගැනීමේදී යමක් වැරදී ඇත"
                    },
                    update: {
                        message: "මොකක්හරි වැරැද්දක් වෙලා",
                        description: "පරිශීලක කැමැත්ත ප්රකාශ කිරීමේදී යමක් වැරදී ඇත"
                    }
                }
            }
        }
    },
    develop: {
        apiResource: {
            pageHeader: {
                description: "ඔබගේ යෙදුම් මගින් පරිභෝජනය කළ හැකි API විෂයයන් / අවසරයන් නිර්වචනය කිරීම සඳහා භාවිතා කරන API සම්පත් නිර්මාණය කිරීම සහ කළමනාකරණය කිරීම.",
                title: "API සම්පත්"
            },
            empty: "මේ මොහොතේ API සම්පත් නොමැත.",
            managedByChoreoText: "Choreo විසින් කළමනාකරණය කරනු ලැබේ",
            apiResourceError: {
                subtitles: {
                    0: "API සම්පත් ලබා ගැනීමේදී යමක් වැරදී ඇත",
                    1: "කරුණාකර නැවත උත්සාහ කරන්න"
                },
                title: "යම්කිසි වරදක් සිදුවි ඇත"
            },
            addApiResourceButton: "නව API සම්පත",
            confirmations: {
                deleteAPIResource: {
                    assertionHint: "කරුණාකර ඔබේ ක්රියාව තහවුරු කරන්න.",
                    content: "මෙම ක්රියාව ආපසු හැරවිය නොහැකි වන අතර API සම්පත ස්ථිරවම මකා දමනු ඇත.",
                    header: "ඔයාට විශ්වාස ද?",
                    message: "ඔබ මෙම API සම්පත් මකා දැමුවහොත් සමහර ක්රියාකාරීත්වයන් නිසියාකාරව ක්රියා නොකරනු ඇත. " +
                        "කරුණාකර ප්රවේශමෙන් ඉදිරියට යන්න."
                },
                deleteAPIResourcePermission: {
                    assertionHint: "කරුණාකර ඔබේ ක්රියාව තහවුරු කරන්න.",
                    content: "මෙම ක්රියාව ආපසු හැරවිය නොහැකි අතර API සම්පතෙන් අවසරය ස්ථිරවම ඉවත් කරයි.",
                    header: "ඔයාට විශ්වාස ද?",
                    message: "ඔබ API සම්පතෙන් මෙම අවසරය ඉවත් කරන්නේ නම්, සමහර ක්රියාකාරීත්වයන් නිසියාකාරව ක්රියා නොකරනු ඇත." +
                        "කරුණාකර ප්රවේශමෙන් ඉදිරියට යන්න."
                }
            },
            managementAPI: {
                header: "කළමනාකරණ API",
                description: "ඔබේ ස්වයං සංවිධානයේ සම්පත් කළමනාකරණය කිරීමට API (root)"
            },
            notifications: {
                deleteAPIResource: {
                    unauthorizedError: {
                        description: "API සම්පත මකා දැමීමට ඔබට අවසර නැත.",
                        message: "අවසර නැත"
                    },
                    notFoundError: {
                        description: "ඔබ මකා දැමීමට උත්සාහ කරන API සම්පත නොපවතී.",
                        message: "API සම්පත හමු නොවීය"
                    },
                    genericError: {
                        description: "API සම්පත මකා දැමීමට අපොහොසත් විය.",
                        message: "යම්කිසි වරදක් සිදුවි ඇත"
                    },
                    success: {
                        description: "API සම්පත සාර්ථකව මකා දැමීය.",
                        message: "API සම්පත මකා දමන ලදි"
                    }
                },
                getAPIResource: {
                    unauthorizedError: {
                        description: "API සම්පත බැලීමට ඔබට අවසර නැත.",
                        message: "අවසර නැත"
                    },
                    notFoundError: {
                        description: "ඔබ බැලීමට උත්සාහ කරන API සම්පත නොපවතී.",
                        message: "API සම්පත හමු නොවීය"
                    },
                    genericError: {
                        description: "API සම්පත ලබා ගැනීමට අපොහොසත් විය.",
                        message: "යම්කිසි වරදක් සිදුවි ඇත"
                    }
                },
                getAPIResources: {
                    unauthorizedError: {
                        description: "API සම්පත් බැලීමට ඔබට අවසර නැත.",
                        message: "අවසර නැත"
                    },
                    genericError: {
                        description: "API සම්පත් ලබා ගැනීමට අපොහොසත් විය.",
                        message: "යම්කිසි වරදක් සිදුවි ඇත"
                    }
                },
                updateAPIResource: {
                    invalidPayloadError: {
                        description: "ඉල්ලීමේ අන්තර්ගතය වලංගු නොවේ.",
                        message: "වලංගු නොවන ඉල්ලීමකි"
                    },
                    unauthorizedError: {
                        description: "API සම්පත යාවත්කාලීන කිරීමට ඔබට අවසර නැත.",
                        message: "අවසර නැත"
                    },
                    notFoundError: {
                        description: "ඔබ යාවත්කාලීන කිරීමට උත්සාහ කරන API සම්පත නොපවතී.",
                        message: "API සම්පත හමු නොවීය"
                    },
                    genericError: {
                        description: "API සම්පත යාවත්කාලීන කිරීමට අපොහොසත් විය.",
                        message: "යම්කිසි වරදක් සිදුවි ඇත"
                    },
                    success: {
                        description: "API සම්පත සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "API සම්පත යාවත්කාලීන කරන ලදි"
                    }
                },
                addAPIResource: {
                    invalidPayloadError: {
                        description: "ඉල්ලීමේ අන්තර්ගතය වලංගු නොවේ.",
                        message: "වලංගු නොවන ඉල්ලීමකි"
                    },
                    unauthorizedError: {
                        description: "API සම්පතක් නිර්මාණය කිරීමට ඔබට අවසර නැත.",
                        message: "අවසර නැත"
                    },
                    alreadyExistsError: {
                        description: "ඔබ නිර්මාණය කිරීමට උත්සාහ කරන API සම්පත දැනටමත් පවතී.",
                        message: "API සම්පත් දැනටමත් පවතී"
                    },
                    permissionAlreadyExistsError: {
                        description: "ඔබ එකතු කිරීමට උත්සාහ කරන මෙම අවසරය (විෂය පථය) ඔබ එකතු කිරීමට උත්සාහ කරන සංවිධානයේ දැනටමත් පවතියි.කරුණාකර වෙනත් එකක් තෝරන්න.",
                        message: "අවසරය දැනටමත් පවතී"
                    },
                    genericError: {
                        description: "API සම්පත නිර්මාණය කිරීමට අපොහොසත් විය.",
                        message: "යම්කිසි වරදක් සිදුවි ඇත"
                    },
                    success: {
                        description: "API සම්පත් සාර්ථකව නිර්මාණය කළේය.",
                        message: "API සම්පත නිර්මාණය කරන ලදි"
                    }
                }
            },
            organizationAPI: {
                header: "සංවිධානය API",
                description: "ඔබේ අනෙකුත් ආයතනවල සම්පත් කළමනාකරණය කිරීමට API"
            },
            table: {
                name: {
                    column: "ප්රදර්ශන නාමය"
                },
                identifier: {
                    column: "හඳුනාගැනුම",
                    label: "හඳුනාගැනුම"
                },
                actions: {
                    column: "ක්රියා"
                },
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "ප්රදර්ශන නාමය හෝ හඳුනාගැනුම"
                            },
                            filterCondition: {
                                placeholder: "උදා.යනාදිය සමඟ ආරම්භ වේ."
                            },
                            filterValue: {
                                placeholder: "සෙවීමට අගය ඇතුළත් කරන්න"
                            }
                        }
                    },
                    placeholder: "ප්රදර්ශන නාමයෙන් සොයන්න"
                }
            },
            tabs: {
                apiResourceError: {
                    subtitles: {
                        0: "ඉල්ලූ API සම්පත ලබා ගන්නා විට, සමහර විට සම්පත නොපවතින නිසා දෝෂයක් ඇතිවිය.",
                        1: "කරුණාකර නැවත උත්සාහ කරන්න."
                    },
                    title: "යම්කිසි වරදක් සිදුවි ඇත"
                },
                title: "API සම්පත සංස්කරණය කරන්න",
                backButton: "API සම්පත් වෙත ආපසු යන්න",
                choreoApiEditWarning: "මෙම API සම්පත Choreo මගින් පවත්වාගෙන යන බැවින්, මෙය යාවත්කාලීන කිරීම මඟින් බලාපොරොත්තු නොවූ වැරදි ඇති විය හැකිය.<1> ප්රවේශමෙන් ඉදිරියට යන්න. </1>",
                general: {
                    dangerZoneGroup: {
                        header: "අනතුරු කලාපය",
                        deleteApiResource: {
                            header: "API සම්පත මකන්න",
                            subHeading: "මෙම ක්රියාව API සම්පත ස්ථිරවම මකා දමනු ඇත.ඔබ ඉදිරියට යාමට පෙර කරුණාකර ස්ථිර කරන්න.",
                            button: "API සම්පත මකන්න"
                        },
                        deleteChoreoApiResource: {
                            header: "API සම්පත මකන්න",
                            subHeading: "මෙම ක්රියාව API සම්පත ස්ථිරවම මකා දමනු ඇත.ඔබ ඉදිරියට යාමට පෙර කරුණාකර ස්ථිර කරන්න.",
                            button: "API සම්පත මකන්න"
                        }
                    },
                    form: {
                        fields: {
                            name: {
                                emptyValidate: "ප්රදර්ශන නාමය හිස් විය නොහැක",
                                label: "ප්රදර්ශන නාමය",
                                placeholder: "API සම්පත සඳහා මිත්රශීලී නමක් ඇතුළත් කරන්න"
                            },
                            identifier: {
                                hint: "[Text description for identifier]",
                                label: "හඳුනාගැනුම"
                            },
                            gwName: {
                                hint: "[Text description for gate way name]",
                                label: "ගේට්වේ නම"
                            },
                            description: {
                                label: "විස්තර",
                                placeholder: "API සම්පත සඳහා විස්තරයක් ඇතුළත් කරන්න"
                            }
                        },
                        updateButton: "යාවත්කාලීන කරන්න"
                    },
                    label: "මූලික තොරතුරු"
                },
                authorization: {
                    form: {
                        fields: {
                            authorize: {
                                label: "අවසරය අවශ්ය වේ",
                                hint: "API සම්පතට විෂය පථයක් ලබා ගැනීමට අවසරය අවශ්ය බව හෝ නොවන බව මෙයින් දක්වා ඇත."
                            }
                        }
                    },
                    label: "බලය පැවරීම"
                },
                permissions: {
                    button: "අවසරයක් එක් කරන්න",
                    label: "අවසර",
                    title: "අවසර ලැයිස්තුව",
                    subTitle: "API සම්පත මගින් භාවිතා කරන අවසර ලැයිස්තුව.",
                    learnMore: "වැඩිදුර ඉගෙන ගන්න",
                    search: "දර්ශන නාමයෙන් අවසර සොයන්න",
                    empty: {
                        title: "කිසිදු අවසරයක් පවරා නොමැත",
                        subTitle: "නව අවසරයක් එක් කිරීමට + අයිකනය මත ක්ලික් කරන්න"
                    },
                    emptySearch: {
                        title: "ප්‍රතිඵල හමු නොවිණි",
                        subTitle: {
                            0: "ඔබ සෙවූ අවසරය අපට සොයාගත නොහැකි විය.",
                            1: "කරුණාකර වෙනත් පරාමිතියක් භාවිතා කිරීමට උත්සාහ කරන්න."
                        },
                        viewAll: "සෙවුම් විමසුම හිස් කරන්න"
                    },
                    copyPopupText: "හඳුනාගැනීම පිටපත් කරන්න",
                    copiedPopupText: "හඳුනාගැනීම පිටපත් කරන ලදි",
                    removePermissionPopupText: "අවසරය ඉවත් කරන්න",
                    form: {
                        button: "අවසරයක් එක් කරන්න",
                        cancelButton: "අවලංගු කරන්න",
                        submitButton: "අවසන් කරන්න",
                        title: "අවසරයක් එක් කරන්න",
                        subTitle: "නව අවසරයක් සාදන්න",
                        fields: {
                            displayName: {
                                emptyValidate: "දර්ශන නාමය හිස් විය නොහැක",
                                label: "ප්රදර්ශන නාමය",
                                placeholder: "වෙන්කරවා ගැනීම කියවන්න"
                            },
                            permission: {
                                emptyValidate: "අවසරය (පථය) හිස් විය නොහැක",
                                label: "අවසරය (පථය)",
                                placeholder: "read_bookings"
                            },
                            description: {
                                label: "විස්තර",
                                placeholder: "විස්තරය ඇතුළත් කරන්න"
                            }
                        }
                    }
                }
            },
            wizard: {
                addApiResource: {
                    cancelButton: "අවලංගු කරන්න",
                    nextButton: "ඊළඟ",
                    previousButton: "කලින්",
                    submitButton: "අවසන් කරන්න",
                    title: "API සම්පත් එකතු කරන්න",
                    subtitle: "නව API සම්පතක් සාදන්න",
                    steps: {
                        basic: {
                            stepTitle: "මූලික තොරතුරු",
                            form: {
                                fields: {
                                    name: {
                                        emptyValidate: "ප්රදර්ශන නම හිස් විය නොහැක",
                                        label: "ප්රදර්ශන නාමය",
                                        hint: "{{ productName }} හි ඔබගේ API සම්පත හඳුනා ගැනීම සඳහා අර්ථවත් නම.",
                                        placeholder: "වෙන්කරවා ගැනීම සදහා වූ API"
                                    },
                                    identifier: {
                                        emptyValidate: "හඳුනාගැනුම හිස් විය නොහැක",
                                        alreadyExistsError: "හඳුනාගැනුම දැනටමත් සංවිධානය තුළ පවතී.කරුණාකර වෙනත් එකක් තෝරන්න",
                                        invalid: "හඳුනාගැනුමක අවකාශයන් අඩංගු විය නොහැක",
                                        hint: "අනන්යතාවය ලෙස URI එකක් භාවිතා කිරීම අපි නිර්දේශ කරමු, නමුත් {{ productName }} ඔබගේ API වෙත ප්‍රවේශ නොවන බැවින් ඔබට URI ප්‍රසිද්ධ කිරීමට අවශ්‍ය නොවේ. {{ productName }} විසින් නිකුත් කරන ලද JWT ටෝකනවල ප්රේක්ෂක(aud) ප්රකාශය ලෙස මෙම හඳුනාගැනීම් අගය භාවිතා කරනු ඇත. <1>මෙම ක්ෂේත්රය අද්විතීය විය යුතුය;මැවූ පසු, එය සංස්කරණය කළ නොහැක.</1>",
                                        label: "හඳුනාගැනුම",
                                        placeholder: "https://api.bookmyhotel.com"
                                    },
                                    description: {
                                        label: "විස්තර",
                                        placeholder: "API සම්පත සඳහා විස්තරයක් ඇතුළත් කරන්න"
                                    }
                                }
                            }
                        },
                        authorization: {
                            stepTitle: "බලය පැවරීම",
                            form: {
                                rbacMessage: "මේ වන විට {{ productName }} අවසරය සඳහා Role Based Access Control (RBAC) සදහා පමණක් සීමා වේ.",
                                fields: {
                                    authorize: {
                                        label: "අවසරය අවශ්ය වේ",
                                        hint: "මෙම කොටුව සලකුණු කර ඇත්නම්, මෙම API සම්පත් පරිභෝජනය කරන විට බලය පැවරීමේ ප්රතිපත්තියක් බලාත්මක කිරීම අනිවාර්ය වේ, මෙම කොටුව සලකුණු කර නැත්නම් ඔබට ප්රතිපත්තියක් නොමැතිව ඉදිරියට යාමට විකල්පයක් ඇත.<1> මෙම ක්ෂේත්රය නිර්මාණය කිරීමෙන් පසු සංස්කරණය කළ නොහැක. </1>"
                                    }
                                }
                            }
                        },
                        permissions: {
                            emptyPlaceHolder: "API සම්පතට කිසිදු අවසරයක් පවරා නොමැත",
                            stepTitle: "අවසර",
                            form: {
                                button: "අවසර එක් කරන්න",
                                fields: {
                                    displayName: {
                                        emptyValidate: "දර්ශන නාමය හිස් විය නොහැක",
                                        label: "ප්රදර්ශන නාමය",
                                        placeholder: "වෙන්කරවා ගැනීම කියවන්න",
                                        hint: "පරිශීලක කැමැත්ත ප්රකාශයේ එය පෙන්වන ආකාරය අර්ථවත් නමක් සපයන්න."
                                    },
                                    permission: {
                                        emptyValidate: "අවසරය (පථය) හිස් විය නොහැක",
                                        uniqueValidate: "මෙම අවසරය (පථය) දැනටමත් ආයතනය තුළ පවතී.කරුණාකර වෙනත් එකක් තෝරන්න.",
                                        invalid: "අවසරය (පථය) අවකාශයේ අඩංගු විය නොහැක.",
                                        label: "අවසරය (පථය)",
                                        placeholder: "read_bookings",
                                        hint: "ප්රවේශ ටෝකනයක් ඉල්ලා සිටින විට විෂය පථය ලෙස ක්රියා කරන අද්විතීය අගයක්.<1> නිර්මාණය කිරීමෙන් පසු අවසරය වෙනස් කළ නොහැකි බව සලකන්න. </1>"
                                    },
                                    permissionList: {
                                        label: "එකතුකරන ලද අවසර"
                                    },
                                    description: {
                                        label: "විස්තර",
                                        placeholder: "විස්තරය ඇතුළත් කරන්න",
                                        hint: "ඔබගේ අවසරය සඳහා විස්තරයක් සපයන්න.මෙය පරිශීලක කැමැත්ත ප්රකාශයේ දර්ශනය වේ."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        applications: {
            asgardeoTryIt: {
                description:
                    "ඔබට අපගේ උත්සාහ කරන්න යෙදුම සමඟ Asgardeo හි විවිධ පිවිසුම් ප්‍රවාහයන් උත්සාහ කළ හැකිය."
            },
            edit: {
                sections: {
                    signInMethod: {
                        sections: {
                            authenticationFlow: {
                                sections: {
                                    stepBased: {
                                        secondFactorDisabled:
                                            "දෙවන සාධක සත්‍යාපනය භාවිතා කළ හැක්කේ <1>පරිශීලක නාමය සහ " +
                                            "මුරපදය</1>, <3>සමාජ පිවිසුම</3> හෝ <5>ආරක්ෂක යතුර/ජීවමිතික</5>" +
                                            " පෙර පියවරක තිබේ නම් පමණි."
                                    }
                                }
                            }
                        }
                    },
                    apiAuthorization: {
                        title: "API පැවරීම",
                        sections: {
                            apiSubscriptions: {
                                heading: "API සම්පත් වෙත ප්රවේශය",
                                subHeading: "මෙම යෙදුම මගින් පරිභෝජනය කරන API සම්පත් කළමනාකරණය කරයි.",
                                search: "ප්රදර්ශන නාමයෙන් API සම්පත් සොයන්න",
                                unsubscribeAPIResourcePopOver: "API සම්පත ඉවත් කරන්න",
                                allAPIAuthorizedPopOver: "සියලුම API සම්පත් බලයලත් කර ඇත",
                                choreoApiEditWarning: "මෙය Choreo විසින් කළමනාකරණය කරනු ලබන API සම්පතක් බැවින් බලයලත් විෂය පථය යාවත්කාලීන කිරීමෙන් පසු අනපේක්ෂිත දෝෂ වඇති විය හැකිය.<1> ප්රවේශමෙන් ඉදිරියට යන්න. </1>",
                                buttons: {
                                    subAPIResource: "API සම්පත් එකතු කරන්න",
                                    noAPIResourcesLink: "API සම්පතක් සාදන්න",
                                    emptySearchButton: "View all API resources"
                                },
                                placeHolderTexts: {
                                    emptyText: "API සම්පත් නොමැත",
                                    noAPIResources: "දායක වීමට API සම්පත් නොමැත",
                                    errorText: {
                                        subtitles: {
                                            0: "API සම්පත් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                                            1: "කරුණාකර නැවත උත්සාහ කරන්න."
                                        },
                                        title: "යම්කිසි වරදක් සිදුවි ඇත"
                                    },
                                    emptySearch: {
                                        title: "ප්‍රතිඵල හමු නොවිණි",
                                        subTitle: {
                                            0: "ඔබ සෙවූ API සම්පත අපට සොයාගත නොහැකි විය.",
                                            1: "කරුණාකර වෙනත් පරාමිතියක් භාවිතා කිරීමට උත්සාහ කරන්න."
                                        }
                                    }
                                },
                                notifications: {
                                    unSubscribe: {
                                        unauthorizedError: {
                                            description: "API සම්පත් දායකත්වයෙන් දායක නොවීමට ඔබට අවසර නැත.",
                                            message: "අනවසර"
                                        },
                                        notFoundError: {
                                            description: "ඔබ දායකත්වයෙන් ඉවත් වීමට උත්සාහ කරන API සම්පත නොපවතී.",
                                            message: "API සම්පත හමු නොවීය"
                                        },
                                        genericError: {
                                            description: "API සම්පත දායකත්වයෙන් ඉවත් වීමට අපොහොසත් විය.",
                                            message: "යම්කිසි වරදක් සිදුවි ඇත"
                                        },
                                        success: {
                                            description: "API සම්පත සාර්ථකව දායක නොවිය.",
                                            message: "API සම්පත් දායක නොවීම"
                                        }
                                    },
                                    patchScopes: {
                                        unauthorizedError: {
                                            description: "API සම්පත යාවත්කාලීන කිරීමට ඔබට අවසර නැත.",
                                            message: "අනවසර"
                                        },
                                        genericError: {
                                            description: "API සම්පත යාවත්කාලීන කිරීමට අපොහොසත් විය.",
                                            message: "යම්කිසි වරදක් සිදුවි ඇත"
                                        },
                                        success: {
                                            description: "API සම්පත සාර්ථකව යාවත්කාලීන කරන ලදි.",
                                            message: "API සම්පත යාවත්කාලීන කරන ලදි"
                                        }
                                    },
                                    createAuthorizedAPIResource: {
                                        unauthorizedError: {
                                            description: "API සම්පතට බලය පැවරීමට ඔබට අවසර නැත.",
                                            message: "අනවසර"
                                        },
                                        initialError: {
                                            description: "සංවාද කොටුව විවෘත කිරීමේදී යම්කිසි වරදක් සිදුවි ඇත.",
                                            message: "කරුණාකර නැවත උත්සාහ කරන්න."
                                        },
                                        genericError: {
                                            description: "API සම්පතට බලය පැවරීමට අපොහොසත් විය.",
                                            message: "යම්කිසි වරදක් සිදුවි ඇත"
                                        },
                                        success: {
                                            description: "API සම්පතට සාර්ථකව අවසර දී ඇත.",
                                            message: "API සම්පත බලය පැවරීම සාර්ථකයි"
                                        }
                                    }
                                },
                                confirmations: {
                                    unsubscribeAPIResource: {
                                        assertionHint: "කරුණාකර ඔබේ ක්රියාව තහවුරු කරන්න.",
                                        content: "මෙම ක්රියාව ආපසු හැරවිය නොහැකි වන අතර API සම්පත ඉවත් වන්නේය.",
                                        header: "ඔබට විශ්වාස ද ?",
                                        message: "ඔබ මෙම API සම්පත ඉවත් කරන්නේ නම්, සමහර ක්රියාකාරීත්වයන් නිසියාකාරව ක්රියා නොකරනු ඇත." +
                                            "කරුණාකර ප්රවේශමෙන් ඉදිරියට යන්න."
                                    },
                                    unsubscribeChoreoAPIResource: {
                                        content: "මෙම API සම්පත ඉවත් කිරීම Choreo මත පිළිබිඹු නොවන අතර බලයලත් විෂය පථය" +
                                        " තවදුරටත් ප්රවේශ විය නොහැකි බැවින් පරිශීලක බලය පැවරීමට බලපෑම් කරනු ඇත." +
                                        "<1> ප්රවේශමෙන් ඉදිරියට යන්න. </1>"
                                    }
                                },
                                scopesSection: {
                                    label: "බලයලත් පථයන්",
                                    placeholder: "මෙම API සම්පත සඳහා පථයකට අවසර දී නැත.",
                                    hint: "API සම්පතේ විෂය පථය යෙදුමට ප්රවේශ වීමට අවසර දී ඇත.",
                                    updateButton: "යාවත්කාලීන කිරීම",
                                    copyScopesHint: "මෙම අයදුම්පතේ OIDC විෂය පථයන්ට අමතරව මෙම විෂය පථයනුත් ඉල්ලන්න.",
                                    selectAll: "සියල්ල තෝරන්න",
                                    selectNone: "කිසිවක් තෝරා නොගන්න"
                                },
                                wizards: {
                                    authorizeAPIResource: {
                                        title: "API සම්පතක් අනුමත කරන්න",
                                        subTitle: "අයදුම්පතට නව API සම්පතක් අනුමත කරන්න.",
                                        fields: {
                                            apiResource: {
                                                label: "API සම්පත",
                                                placeholder: "API සම්පතේ ප්රදර්ශන නාමය ඇතුළත් කරන්න",
                                                requiredErrorMessage: "API සම්පත අවශ්ය වේ"
                                            },
                                            scopes: {
                                                label: "බලයලත් විෂය පථයන්",
                                                placeholder: "මෙම API සම්පත සඳහා විෂය පථයකට අවසර දී නැත",
                                                hint: "API සම්පතේ ඉහත සදහන් විෂය පථයන් සඳහා යෙදුමට ප්රවේශ වීමට අවසර දී ඇත."
                                            },
                                            policy: {
                                                label: "බලය පැවරීමේ ප්රතිපත්තිය",
                                                hint: "අයදුම්පත සඳහා API වෙත අවසර දීමට ප්රතිපත්තිය තෝරන්න."
                                            }
                                        },
                                        rbacPolicyMessage: "තෝරාගත් API සම්පත් විෂය පථයට බලය පැවරීම සඳහා කාර්යභාරය පදනම් කරගත් ප්රවේශය (RBAC) භාවිතා කරයි.",
                                        buttons: {
                                            finish: "අවසන්",
                                            cancel: "අවලංගු කරන්න"
                                        }
                                    }
                                }
                            },
                            policySection: {
                                heading: "ප්රතිපත්ති සැකසුම්",
                                subHeading: "ගතික අවසරයන් සහිත ඔබේ API සම්පත් ආරක්ෂා කර පාලනය කරන්න.",
                                buttons: {
                                    update: "යාවත්කාලීන කරන්න"
                                },
                                messages: {
                                    noPolicy: "ඔබ දායක වූ API හි විෂය පථ හැසිරවීමට ඔබ කිසිදු ප්රතිපත්ති තෝරාගෙන නොමැත. ඔබගේ අයදුම්පතේ ආරක්ෂාව සහ නිසි ක්රියාකාරිත්වය සඳහා API විෂයයන් කළමනාකරණය කිරීමට කරුණාකර ප්රතිපත්ති තෝරන්න.",
                                    noClientCredentials: "ඔබගේ දායකත්වය සහිත APIs වෙත ආරක්ෂිත ප්රවේශය සඳහා වන අයදුම්පත පදනම් කරගත් ප්රතිපත්තිය යෙදවීමට පෙර කරුණාකර <1>client-credentials ප්රදානය සක්රීය කරන්න.</1>"
                                },
                                form: {
                                    fields: {
                                        userPolicy: {
                                            label: "පරිශීලක පාදක ප්රතිපත්ති සක්රීය කරන්න"
                                        },
                                        rbac: {
                                            label: "කාර්යභාරය පදනම් කරගත් ප්රවේශ පාලනය (RBAC) සක්රීය කරන්න",
                                            name: "භූමිකාව පදනම් කරගත් ප්රවේශ පාලනය (RBAC)",
                                            hint: "මෙම API සම්පත සඳහා RBAC අවසර ප්‍රතිපත්ති බලාත්මක කරනු ඇත. පුරනය වීමේ ගනුදෙනුව අතරතුර භූමිකාවට අවසර සහ කණ්ඩායම් පැවරුම ඇගයීමට ලක් කෙරේ."
                                        },
                                        consent: {
                                            label: "එකඟතා පාදක ප්රවේශ ප්රතිපත්තිය සක්රීය කරන්න",
                                            hint: "සක්රීය කළ විට, මෙම අයදුම්පත සඳහා එකඟතා පදනම් කරගත් බලය පැවරීමේ ප්රතිපත්තිය බලාත්මක කෙරේ.පිවිසුම් ගනුදෙනුව අතරතුර, යෙදුමේ ප්රවේශ වරප්රසාද තීරණය කිරීම සඳහා විෂය පථ පැවරුම ඇගයීමට ලක් කෙරේ."
                                        },
                                        appPolicy: {
                                            label: "යෙදුම් පදනම් කරගත් ප්රතිපත්ති (යන්ත්රය සිට යන්ත්රය දක්වා) සක්රීය කරන්න",
                                            hint: "සක්රිය කර ඇති විට, Machine-to-Machine (යන්ත්රය සිට යන්ත්රය දක්වා) බලය පැවරීමේ ප්රතිපත්තිය මෙම යෙදුම සඳහා බලාත්මක කරනු ලැබේ."
                                        },
                                        noPolicy: {
                                            name: "බලය පැවරීමේ ප්රතිපත්තියක් නොමැත",
                                            hint: "මෙම API සම්පත සඳහා බලය පැවරීම අවශ්ය නොවේ, නමුත් විමසීමක් කළහොත් පරිශීලකයාගේ කැමැත්ත අවශ්ය වේ."
                                        }
                                    }
                                },
                                notifications: {
                                    getPolicies: {
                                        genericError: {
                                            description: "ප්රතිපත්ති ඉදිරිපත් කිරීමට අපොහොසත් විය.",
                                            message: "යම්කිසි වරදක් සිදුවි ඇත"
                                        }
                                    },
                                    patchPolicies: {
                                        unauthorizedError: {
                                            description: "ප්රතිපත්ති යාවත්කාලීන කිරීමට ඔබට අවසර නැත.",
                                            message: "අනවසර"
                                        },
                                        genericError: {
                                            description: "ප්රතිපත්ති යාවත්කාලීන කිරීමට අපොහොසත් විය.",
                                            message: "යම්කිසි වරදක් සිදුවි ඇත"
                                        },
                                        success: {
                                            description: "ප්රතිපත්ති සාර්ථකව යාවත්කාලීන කරන ලදි.",
                                            message: "ප්රතිපත්ති යාවත්කාලීන කරන ලදි"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    roles: {
                        addRoleWizard: {
                            buttons: {
                                finish: "අවසන් කරන්න",
                                next: "ඊළඟ",
                                previous: "කලින්"
                            },
                            forms: {
                                roleBasicDetails: {
                                    roleName: {
                                        hint: "භූමිකාවට නමක්.",
                                        label: "භූමිකාවේ නම",
                                        placeholder: "භූමිකාවේ නම ඇතුළත් කරන්න",
                                        validations: {
                                            duplicate: "දී ඇති භූමිකාවේ නම සමඟ භූමිකාවක් දැනටමත් පවතී.",
                                            empty: "ඉදිරියට යාමට භූමිකාවේ නම අවශ්‍ය වේ.",
                                            invalid: "භූමිකා නාමයක අඩංගු විය හැක්කේ අක්ෂරාංක අක්ෂර, -, සහ _ පමණි. "
                                                + "සහ අක්ෂර 3 සිට 30 දක්වා දිග විය යුතුය."
                                        }
                                    }
                                },
                                rolePermissions: {
                                    label: "භූමිකාව අවසර",
                                    searchPlaceholer: "API නම සහ අවසර නාමය අනුව සොයන්න"
                                }
                            },
                            heading: "භූමිකාව සාදන්න",
                            subHeading: "ඔබගේ යෙදුමේ නව භූමිකාවක් සාදන්න.",
                            wizardSteps: {
                                0: "මූලික විස්තර",
                                1: "අවසර තේරීම"
                            }
                        },
                        title: "භූමිකාවන්",
                        heading: "භූමිකාවන්",
                        subHeading: "ඔබගේ යෙදුමේ යෙදුම් මට්ටමේ භූමිකාවන් කළමනාකරණය කරන්න.",
                        subHeadingAlt: "ඔබගේ යෙදුමේ යෙදුම් මට්ටමේ භූමිකාවන් බලන්න",
                        buttons: {
                            newRole: "නව භූමිකාව"
                        },
                        labels: {
                            apiResource: "API සම්පත",
                            selectAllPermissions: "සියලුම අවසර තෝරන්න"
                        },
                        advancedSearch: {
                            form: {
                                inputs: {
                                    filterValue: {
                                        placeholder: "සෙවීමට අගය ඇතුළත් කරන්න"
                                    }
                                }
                            },
                            placeholder: "භූමිකාවේ නම අනුව සොයන්න"
                        },
                        list: {
                            columns: {
                                actions: "",
                                name: "නම"
                            }
                        },
                        editModal: {
                            heading: "අවසර කළමනාකරණය කරන්න",
                            readonlyHeading: "අවසර බලන්න",
                            readonlySubHeading: "භූමිකාවට අදාළ අවසර බලන්න. අවසර ලත් අවසර පරීක්ෂා කර ඇති පරිදි පෙනෙනු ඇත.",
                            subHeading: "භූමිකාවට අදාළ අවසර තෝරන්න.",
                            searchPlaceholer: "API නම සහ අවසර නාමය අනුව සොයන්න"
                        },
                        deleteRole: {
                            confirmationModal: {
                                assertionHint: "කරුණාකර ඔබගේ ක්‍රියාව තහවුරු කරන්න.",
                                content: "ඔබ මෙම යෙදුම් භූමිකාව මකා දැමුවහොත්, ඉහත යෙදුම් භූමිකාව හා සම්බන්ධ පරිශීලකයින්ට" +
                                    " පවරා ඇති අවසරයන් තවදුරටත් නොමැත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න",
                                header: "ඔබට විශ්වාසද?",
                                message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර යෙදුම් භූමිකාව ස්ථිරවම මකනු ඇත."
                            }
                        },
                        placeHolders: {
                            emptyList: {
                                action: "නව භූමිකාව",
                                subtitles: {
                                    0: "දැනට ලබා ගත හැකි භූමිකාවන් නොමැත."
                                },
                                title: "භූමිකාවන් නොමැත"
                            },
                            emptySearchResults: {
                                action: "සෙවුම් විමසුම හිස් කරන්න",
                                subtitles: {
                                    0: "අපට '{{ searchQuery }}' සඳහා ප්‍රතිඵල කිසිවක් සොයාගත නොහැකි විය",
                                    1: "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න."
                                },
                                title: "ප්‍රතිඵල හමු නොවිණි"
                            },
                            emptyPermissions: {
                                subtitles: {
                                    0: "ඔබගේ යෙදුම සඳහා අවසර ලත් අවසර නොමැත."
                                }
                            }
                        },
                        notifications: {
                            createApplicationRole: {
                                error: {
                                    description: "{{description}}",
                                    message: "යෙදුම් භූමිකාව නිර්මාණය කිරීමේදී දෝෂයක් සිදු විය"
                                },
                                genericError: {
                                    description: "යෙදුම් භූමිකාව නිර්මාණය කිරීමේදී දෝෂයක් සිදු විය.",
                                    message: "මොකක්හරි වැරැද්දක් වෙලා"
                                },
                                success: {
                                    description: "යෙදුම් භූමිකාව සාර්ථකව නිර්මාණය කරන ලදී.",
                                    message: "නිර්මාණය සාර්ථකයි"
                                }
                            },
                            updatePermissions: {
                                error: {
                                    description: "{{description}}",
                                    message: "භූමිකාව අවසර යාවත්කාලීන කිරීමේදී දෝෂයක් සිදු විය"
                                },
                                genericError: {
                                    description: "භූමිකාව අවසර යාවත්කාලීන කිරීමේදී දෝෂයක් සිදු විය.",
                                    message: "මොකක්හරි වැරැද්දක් වෙලා"
                                },
                                success: {
                                    description: "භූමිකාව අවසර යාවත්කාලීන කිරීම සාර්ථකයි.",
                                    message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                                }
                            },
                            deleteApplicationRole: {
                                error: {
                                    description: "{{description}}",
                                    message: "යෙදුම් භූමිකාව මකා දැමීමේදී දෝෂයක් සිදු විය"
                                },
                                genericError: {
                                    description: "යෙදුම් භූමිකාව මකා දැමීමේදී දෝෂයක් සිදු විය.",
                                    message: "මොකක්හරි වැරැද්දක් වෙලා"
                                },
                                success: {
                                    description: "යෙදුම් භූමිකාව සාර්ථකව මකා ඇත.",
                                    message: "මකා දැමීම සාර්ථකයි"
                                }
                            },
                            fetchApplicationRoles: {
                                error: {
                                    description: "{{description}}",
                                    message: "යෙදුම් භූමිකාවන් ලබා ගැනීමේදී දෝෂයක් සිදු විය"
                                },
                                genericError: {
                                    description: "යෙදුම් භූමිකාවන් ලබා ගැනීමේදී දෝෂයක් සිදු විය.",
                                    message: "මොකක්හරි වැරැද්දක් වෙලා"
                                }
                            },
                            fetchAuthorizedAPIs: {
                                error: {
                                    description: "{{description}}",
                                    message: "බලයලත් API ලබා ගැනීමේදී දෝෂයක් සිදු විය"
                                },
                                genericError: {
                                    description: "බලයලත් API ලබා ගැනීමේදී දෝෂයක් සිදු විය.",
                                    message: "මොකක්හරි වැරැද්දක් වෙලා"
                                }
                            }
                        }
                    },
                    rolesV2: {
                        heading: "භූමිකාවන්",
                        subHeading: "අයදුම්පතේ පවරා ඇති කාර්යභාරය කළමනාකරණය කරන්න.",
                        roleAudience: "භූමිකාව ප්රේක්ෂකයින්",
                        organization: "ආයතනය",
                        application: "අයදුම්පත",
                        assignedRoles: "පවරා ඇති භූමිකාවන්",
                        removedRoles: "ඉවත් කරන ලද භූමිකාවන්",
                        searchPlaceholder: "භූමිකාව අනුව සොයන්න",
                        switchRoleAudience: {
                            applicationConfirmationModal: {
                                assertionHint: "කරුණාකර ඔබේ ක්රියාව තහවුරු කරන්න.",
                                content: "ඔබ යෙදීමේ කාර්යභාර ප්රේක්ෂකයින් වෙනස් කරන්නේ නම්, ඇසුරු කිරීම "+
                                    "සංවිධාන භූමිකාවන් අයදුම්පතෙන් මකා දමනු ඇත. කරුණාකර ප්රවේශමෙන් ඉදිරියට යන්න.",
                                header: "භූමිකාව ප්රේක්ෂකයින් යෙදවීමට මාරු කරන්න?",
                                message: "මෙම ක්රියාව ආපසු හැරවිය නොහැකි වන අතර පවතින භූමිකාවන් ඉවත් කරනු ඇත."
                            },
                            organizationConfirmationModal: {
                                assertionHint: "කරුණාකර ඔබේ ක්රියාව තහවුරු කරන්න.",
                                content: "ඔබ සංවිධානාත්මක ප්රේක්ෂකයින් වෙනස් කළහොත්, යෙදුම් භූමිකාවන් දැනට "+
                                    "අයදුම්පත සමඟ සම්බන්ධ වීම ස්ථිරවම මකා දැමෙනු ඇත. කරුණාකර ප්රවේශමෙන් ඉදිරියට යන්න.",
                                header: "භූමිකාව ප්රේක්ෂකයින් ලෙස මාරු කරන්න?",
                                message: "මෙම ක්රියාව ආපසු හැරවිය නොහැකි වන අතර පවතින භූමිකාවන් ස්ථිරවම මකා දමනු ඇත."
                            }
                        }
                    }
                }
            },
            quickstart: {
                mobileApp: {
                    configurations: {
                        anyTechnology: "හෝ ඕනෑම ජංගම යෙදුම් තාක්ෂණය",
                        heading: "PKCE සමඟ OIDC අවසර කේත ප්‍රවාහය ඉගෙන ගැනීමට <1>මෙම මාර්ගෝපදේශය</1> අනුගමනය කරන්න " +
                            "සහ ජංගම යෙදුම් සඳහා ඕනෑම තෙවන පාර්ශවීය OIDC SDK වින්‍යාස කිරීමට පහත විස්තර භාවිතා කරන්න.",
                        discoveryURI: {
                            label: "ඩිස්කවරි URI",
                            info: "OpenID Connect අනන්‍යතා සපයන්නා පාර-දත්ත ගතිකව සොයා ගැනීමට මෙම අන්ත ලක්ෂ්‍යය යෙදුම් විසින් හඳුන්වනු ලැබේ."
                        },
                        generalDescription: "ඔබගේ ජංගම යෙදුම Asgardeo සමඟ ඒකාබද්ධ කිරීමට පහත වින්‍යාසයන් භාවිතා කරන්න.",
                        moreInfoDescription: "ඔබගේ යෙදුම ගොඩනැගීමට <1>තොරතුරු</1> ටැබය තුළ සේවාදායක අන්ත ලක්ෂ්‍ය පිළිබඳ වැඩි විස්තර භාවිතා කරන්න.",
                        protocolDescription: "වින්‍යාස කිරීම් පිළිබඳ වැඩි විස්තර සඳහා, <1>ප්‍රොටෝකෝලය</1> ටැබය වෙත යන්න.",
                        redirectURI: {
                            label: "URI යළි-යොමු කරන්න"
                        },
                        scope: {
                            label: "විෂය පථය"
                        }
                    },
                    tabHeading: "මගපෙන්වීම",
                    technologyInfo: "ඔබට මෙම යෙදුම ඔබ කැමති ඕනෑම තෙවන පාර්ශවීය OIDC ජංගම SDK සමඟ ඒකාබද්ධ කළ හැක. <1>තවත් දැනගන්න</1>"
                },
                spa: {
                    common: {
                        addTestUser: {
                            title: "උත්සාහ කර බලන්න!"
                        },
                        prerequisites: {
                            angular:
                                "<0>සටහන:</0> SDK දැනට <2>දැඩි මාදිලිය</2> තුළ කෝණික 11 යෙදුම් සඳහා සහය නොදක්වයි. " +
                                "අපි SDK අනුකූල කිරීමට කටයුතු කරමින් සිටිමු.",
                            node:
                                "SDK අත්හදා බැලීමට ඔබට ඔබේ පරිසරයේ <1>Node.js</1> සහ <3>npm</3> සවි කිරීමට අවශ්‍ය වනු " +
                                "ඇත. <5>Node හි දිගු කාලීන ආධාරක (LTS) අනුවාදය බාගැනීමට .js</5> (එයට <7>npm</7> " +
                                "ඇතුළත් වේ), නිල <9>බාගැනීම්</9> පිටුවට යන්න."
                        }
                    },
                    integrate: {
                        common: {
                            sdkConfigs: {
                                clientId: {
                                    hint: "OAuth 2.0 සේවාලාභී හැඳුනුම්පත බලයලත් සේවාදායකයේ වලංගු වේ."
                                },
                                scope: {
                                    hint:
                                        "මේවා පරිශීලක ගුණාංග ඉල්ලීමට භාවිතා කරන විෂය පථ සමූහයකි. <1></1> ඔබට " +
                                        "<3>openid</3> <5>profile</5> හැර වෙනත් විෂය පථයන් එකතු කිරීමට අවශ්‍ය නම්, ඔබට ඒවා " +
                                        "අරයට එකතු කළ හැකිය. <7></7> වැඩි විස්තර දැන ගැනීම සඳහා අපගේ <9>ප්‍රලේඛනය</9> කියවන්න."
                                },
                                serverOrigin: {
                                    hint: "අනන්‍යතා සැපයුම්කරුගේ ආරම්භය."
                                },
                                signInRedirectURL: {
                                    hint: {
                                        content:
                                            "පරිශීලක සත්‍යාපනය මත අනුමත කිරීමේ කේතය යවන්නේ කොතැනටද යන්න තීරණය කරන " +
                                            "යූආර්එල් ය. <1></1> ඔබේ අයදුම්පත වෙනත් යූආර්එල් එකක සත්කාරක නම්, " +
                                            "<3>ප්‍රොටොකෝලය</3> ටැබයට ගොස් නිවැරදි යූආර්එල් සකසන්න <5>බලයලත් නැවත " +
                                            "හරවා යැවීමේ යූආර්එල්</5> ක්ෂේත්‍රයෙන්. ",
                                        multipleWarning:
                                            "ඔබ ඔබේ අයදුම්පත සඳහා වලංගු නැවත ඇමතුම් යූආර්එල් කිහිපයක් වින්‍යාස කර " +
                                            "ඇත. නිවැරදි යූආර්එල් තෝරාගෙන ඇති බව තහවුරු කර ගන්න."
                                    }
                                },
                                signOutRedirectURL: {
                                    hint: {
                                        content:
                                            "ඉවත් වීමෙන් පසු පරිශීලකයා නැවත යොමු කරන්නේ කොතැනටද යන්න තීරණය කරන යූආර්එල් " +
                                            "ය. <1> </1> ඔබේ අයදුම්පත වෙනත් යූආර්එල් එකක ධාරක කර තිබේ නම් <3>ප්‍රොටෝකෝලය" +
                                            "</3> ටැබයට ගොස් නිවැරදි URL එක සකසන්න <5>බලයලත් නැවත හරවා යැවීමේ යූආර්එල්</5> " +
                                            "ක්ෂේත්රය.",
                                        multipleWarning:
                                            "ඔබ ඔබේ අයදුම්පත සඳහා වලංගු නැවත ඇමතුම් යූආර්එල් කිහිපයක් වින්‍යාස කර " +
                                            "ඇත. නිවැරදි යූආර්එල් තෝරාගෙන ඇති බව තහවුරු කර ගන්න."
                                    }
                                }
                            }
                        }
                    },
                    samples: {
                        exploreMoreSamples: "තවත් සාම්පල ගවේෂණය කරන්න."
                    }
                },
                twa: {
                    setup: {
                        skipURIs:
                            "<1>skipURIs</1> සටහන් කර ගන්න. මෙම දේපල ඔබගේ අයදුම්පතෙහි ආරක්‍ෂිත නොවිය යුතු සහ " +
                            "සත්‍යාපනය අවශ්‍ය නොවන වෙබ් පිටු විස්තර කරයි. <3>කොමා වලින් වෙන් වූ</3> අගයන් භාවිතයෙන් බහු URI සැකසිය හැක."
                    }
                }
            }
        },
        branding: {
            confirmations: {
                revertBranding: {
                    assertionHint: "කරුණාකර ඔබගේ ක්‍රියාව තහවුරු කරන්න.",
                    content: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර ඔබේ සන්නාම මනාප ස්ථිරවම ප්‍රතිවර්තනය කරයි.",
                    header: "ඔයාට විශ්වාස ද?",
                    message:
                        "ඔබ සන්නාම අභිරුචි ප්‍රතිවර්තනය කරන්නේ නම්, ඔබේ පරිශීලකයින් පිවිසුම් ප්‍රවාහයන් මත " +
                        "{{ productName }} සන්නාමය දැකීමට පටන් ගනී. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න."
                },
                unpublishBranding: {
                    assertionHint: "කරුණාකර ඔබගේ ක්‍රියාව තහවුරු කරන්න.",
                    enableContent: "මෙම මනාපයන් ප්‍රකාශයට පත් කළ පසු, ඒවා පරිශීලක ලියාපදිංචි ප්‍රවාහයන්ට සහ ඔබේ යෙදුම්වල සහ විද්‍යුත් තැපැල් අච්චුවල සියලුම පිවිසුම් ප්‍රවාහයන්ට (බහු සාධක පිවිසුම් ඇතුළුව) යොදනු ලැබේ.",
                    disableContent: "මෙම මනාපයන් ප්‍රකාශයට පත් නොකළ පසු, ඒවා තවදුරටත් පරිශීලක ලියාපදිංචි ප්‍රවාහවලට සහ ඔබේ යෙදුම්වල සහ විද්‍යුත් තැපැල් සැකිලිවල සියලුම පිවිසුම් ප්‍රවාහයන් (බහු සාධක පිවිසුම් ඇතුළුව) වෙත අදාළ නොවේ.",
                    header: "ඔයාට විශ්වාස ද?",
                    enableMessage:
                        "ඔබ සන්නාම අභිරුචි සක්‍රීය කළහොත්, ඔබේ පරිශීලකයන් පිවිසුම් ප්‍රවාහයන් මත ඔබේ වෙළඳ නාමය දැකීමට පටන් ගනී. කරුණාකර තහවුරු කරන්න.",
                    disableMessage:
                        "ඔබ සන්නාම අභිරුචි අක්‍රිය කළහොත්, ඔබේ පරිශීලකයන් දැකීමට පටන් ගනී " +
                        "{{ productName }} ලොගින් ප්‍රවාහය මත සන්නාමය. කරුණාකර තහවුරු කරන්න."
                }
            },
            dangerZoneGroup: {
                header: "අවදානම් කලාපය",
                revertBranding: {
                    actionTitle: "ආපසු හරවන්න",
                    header: "පෙරනිමියට ප්‍රතිවර්තනය කරන්න",
                    subheader:
                        "සන්නාම මනාපයන් ප්‍රතිවර්තනය කළ පසු, ඒවා ප්‍රතිසාධනය කළ නොහැකි අතර ඔබේ පාරිභෝගිකයන් " +
                        "{{ productName }} පෙරනිමි සන්නම්කරණය දකිනු ඇත."
                },
                unpublishBranding: {
                    actionTitle: "ක්වාලිස්",
                    header: "වෙළඳ නාම වෙළඳනාම නවත්වන්න",
                    subheader: "මෙම මනාපයන් ප්රකාශයට පත් වූ පසු, ඒවා ඔබගේ යෙදුම්, ඔබේ යෙදුම්වල බහු-සාධක පිවිසුම ඇතුළුව), මගේ ගිණුම් ද්වාරය සහ විද්යුත් තැපැල් සැකිලි සඳහා තවදුරටත් අදාළ නොවේ."
                }
            },
            forms: {
                advance: {
                    links: {
                        fields: {
                            common: {
                                validations: {
                                    invalid: "වලංගු URL එකක් ඇතුලත් කරන්න"
                                }
                            },
                            cookiePolicyURL: {
                                hint: "ඔබගේ යෙදුම් සහ ඒ සෑම එකක්ම භාවිතා කරන සියලුම කුකීස් පිළිබඳ සවිස්තරාත්මක තොරතුරු සහිත ලේඛනයකට හෝ වෙබ් පිටුවකට සම්බන්ධ කරන්න. විවිධ කලාප හෝ භාෂා සඳහා URL අභිරුචිකරණය කිරීමට <1>{{lang}}</1>, <3>{{country}}</3>, හෝ <5>{{locale}}</5> placeholders භාවිතා කළ හැකිය.",
                                label: "කුකී ප්රතිපත්තිය",
                                placeholder: "https://myapp.com/{{locale}}/cookie-policy"
                            },
                            privacyPolicyURL: {
                                hint: "ඔබගේ සංවිධානය එකතු කරන ආකාරය, හසුරුවන සහ නරඹන්නන්ගේ දත්ත පවසන පරිදි ප්රකාශයක් හෝ නෛතික ලේඛනයක් සමඟ සම්බන්ධ වන්න. විවිධ කලාප හෝ භාෂා සඳහා URL අභිරුචිකරණය කිරීමට <1>{{lang}}</1>, <3>{{country}}</3>, හෝ <5>{{locale}}</5> placeholders භාවිතා කළ හැකිය.",
                                label: "රහස්යතා ප්රතිපත්තිය",
                                placeholder: "https://myapp.com/{{locale}}/privacy-policy"
                            },
                            selfSignUpURL: {
                                hint: "ඔබේ සංවිධානයේ ස්වයං ලියාපදිංචි වීමේ වෙබ් පිටුවට සම්බන්ධ වන්න. විවිධ කලාප හෝ භාෂා සඳහා URL අභිරුචිකරණය කිරීමට <1>{{lang}}</1>, <3>{{country}}</3>, හෝ <5>{{locale}}</5> placeholders භාවිතා කළ හැකිය.",
                                label: "ස්වයං ලියාපදිංචි වීම",
                                placeholder: "https://myapp.com/self-signup"
                            },
                            termsOfUseURL: {
                                hint: "ඔබේ ආයෝජන යෙදුම් හෝ වෙනත් සේවාවන් භාවිතා කිරීම සඳහා ඔබේ ගනුදෙනුකරුවන් ඊට එකඟ වී පිළිපැදිය යුතු ගිවිසුමකට සම්බන්ධ වන්න. විවිධ කලාප හෝ භාෂා සඳහා URL අභිරුචිකරණය කිරීමට <1>{{lang}}</1>, <3>{{country}}</3>, හෝ <5>{{locale}}</5> placeholders භාවිතා කළ හැකිය.",
                                label: "සේවා කොන්දේසි",
                                placeholder: "https://myapp.com/{{locale}}/terms-of-service"
                            }
                        },
                        heading: "සබැඳි"
                    }
                },
                design: {
                    layout: {
                        headings: {
                            fields: {
                                productTagline: {
                                    hint: "ඔබේ නිෂ්පාදනය සඳහා ටැග්ලයින් එකක් එක් කරන්න. "
                                        + "මෙය ඔබගේ නිෂ්පාදන ලාංඡනයට පහළින් දිස්වනු ඇත.",
                                    label: "නිෂ්පාදන ටැග්ලයින් පෙළ",
                                    placeholder: "ටැග්ලයින් සඳහා පෙළක් ඇතුළත් කරන්න"
                                }
                            },
                            heading: "නිෂ්පාදන ටැග්ලයින්"
                        },
                        images: {
                            logo: {
                                fields: {
                                    alt: {
                                        hint: "රූපය නිරූපණය කිරීමට විකල්ප පෙළක් එක් කරන්න."
                                            + " රූපය පූරණය නොවන විට එය දර්ශනය වේ.",
                                        label: "පැති රූපය විකල්ප පෙළ",
                                        placeholder: "පැති රූපය සඳහා විකල්ප පෙළ ඇතුළත් කරන්න"
                                    },
                                    url: {
                                        hint: "වඩා හොඳ කාර්ය සාධනයක් සඳහා අවම වශයෙන් <1>1920x1080 පික්සල</1> සහ"
                                            + " <3>1 mb</3> ප්‍රමාණයෙන් අඩු රූපයක් භාවිතා කරන්න.",
                                        label: "පැති රූප URL",
                                        placeholder: "https://myapp.com/placeholder.jpeg"
                                    }
                                },
                                heading: "පැති රූපය",
                                preview: "පෙරදසුන"
                            }
                        },
                        variations: {
                            fields: {
                                centered: {
                                    imgAlt: "මධ්‍යගත පිරිසැලසුම",
                                    label: "කේන්ද්රගත"
                                },
                                "custom": {
                                    imgAlt: "අභිරුචි පිරිසැලසුම",
                                    label: "අභිරුචි"
                                },
                                "left-aligned": {
                                    imgAlt: "වමට පෙළගස්වන ලද පිරිසැලසුම",
                                    label: "වමට පෙළගස්වා ඇත"
                                },
                                "left-image": {
                                    imgAlt: "වම් රූප සැකැස්ම",
                                    label: "වම් රූපය"
                                },
                                "right-aligned": {
                                    imgAlt: "දකුණට පෙළගැස්වූ පිරිසැලසුම",
                                    label: "දකුණට පෙළගස්වා ඇත"
                                },
                                "right-image": {
                                    imgAlt: "දකුණු රූප සැකැස්ම",
                                    label: "දකුණු රූපය"
                                }
                            }
                        }
                    },
                    theme: {
                        buttons: {
                            externalConnections: {
                                fields: {
                                    backgroundColor: {
                                        hint: "සමාජ පිවිසුම්, තෙවන පාර්ශවීය IdPs වැනි බාහිර සම්බන්ධතා බොත්තම් " +
                                            "වල අකුරු වර්ණය.",
                                        label: "පසුබිම් වර්ණය",
                                        placeholder: "බාහිර සම්බන්ධතා බොත්තම් සඳහා පසුබිම් වර්ණයක් තෝරන්න."
                                    },
                                    borderRadius: {
                                        hint: "බාහිර සම්බන්ධතා බොත්තමෙහි මායිම් අරය.",
                                        label: "දේශසීමා අරය",
                                        placeholder: "බාහිර සම්බන්ධතා බොත්තම සඳහා මායිම් අරයක් තෝරන්න."
                                    },
                                    fontColor: {
                                        hint: "බාහිර සම්බන්ධතා බොත්තම් වල අකුරු වර්ණය.",
                                        label: "අකුරු වර්ණය",
                                        placeholder: "බාහිර සම්බන්ධතා බොත්තම සඳහා අකුරු වර්ණයක් තෝරන්න."
                                    }
                                },
                                heading: "බාහිර සම්බන්ධතා බොත්තම"
                            },
                            heading: "බොත්තම්",
                            primary: {
                                fields: {
                                    borderRadius: {
                                        hint: "ප්රාථමික බොත්තමෙහි මායිම් අරය.",
                                        label: "දේශසීමා අරය",
                                        placeholder: "ප්‍රාථමික බොත්තම් මායිම් අරයක් තෝරන්න"
                                    },
                                    fontColor: {
                                        hint: "ප්‍රාථමික ක්‍රියා බොත්තම්වල අකුරු වර්ණය.",
                                        label: "අකුරු වර්ණය",
                                        placeholder: "ප්‍රාථමික බොත්තම් අකුරු වර්ණයක් තෝරන්න"
                                    }
                                },
                                heading: "මූලික බොත්තම"
                            },
                            secondary: {
                                fields: {
                                    borderRadius: {
                                        hint: "ද්විතියික බොත්තමෙහි මායිම් අරය.",
                                        label: "දේශසීමා අරය",
                                        placeholder: "ද්විතියික බොත්තම් මායිම් අරයක් තෝරන්න"
                                    },
                                    fontColor: {
                                        hint: "ද්විතියික ක්‍රියා බොත්තම්වල අකුරු වර්ණය.",
                                        label: "අකුරු වර්ණය",
                                        placeholder: "ද්විතියික බොත්තම් අකුරු වර්ණයක් තෝරන්න"
                                    }
                                },
                                heading: "ද්විතියික බොත්තම"
                            }
                        },
                        colors: {
                            alerts: {
                                fields: {
                                    error: {
                                        hint: "පරිශීලකයාගේ අවධානය උල්ලං to නය වන පසුබිම් වර්ණයක් තෝරන්න සහ පද්ධති අසමත්වීම් හෝ විවේචනාත්මක දෝෂ වැනි දෝෂ ඇඟවීම් නියෝජනය කරයි.",
                                        label: "දෝෂ අනතුරු ඇඟවීමේ පසුබිම් වර්ණය",
                                        placeholder: "දෝෂ අනතුරු ඇඟවීමේ පසුබිම් වර්ණයක් තෝරන්න"
                                    },
                                    info: {
                                        hint: "වර්ණ පටිපාටියට අනුකූල වන පසුබිම් වර්ණයක් තෝරන්න සහ ඉඟි හෝ අමතර තොරතුරු වැනි තොරතුරු ඇඟවීම් නියෝජනය කරයි.",
                                        label: "තොරතුරු අනතුරු ඇඟවීමේ පසුබිම් වර්ණය",
                                        placeholder: "තොරතුරු ඇඟවීමේ පසුබිම් වර්ණයක් තෝරන්න"
                                    },
                                    neutral: {
                                        hint: "වර්ණ පටිපාටියේ වර්ණ පටිපාටිය සම්පුර්ණ කරන පසුබිම් වර්ණයක් තෝරන්න සහ තීරණාත්මක නොවන තොරතුරු හෝ ප්රතිපෝෂණ වැනි උදාසීන ඇඟවීම් නියෝජනය කරයි.",
                                        label: "උදාසීන අනතුරු ඇඟවීමේ පසුබිම් වර්ණය",
                                        placeholder: "උදාසීන අනතුරු ඇඟවීමේ පසුබිම් වර්ණයක් තෝරන්න"
                                    },
                                    warning: {
                                        hint: "දිස්වන පසුබිම් වර්ණයක් තෝරන්න, විභව අවදානම් හෝ වැදගත් දැනුම්දීම් වැනි අනතුරු ඇඟවීමේ ඇඟවීම් නිරූපණය කරයි.",
                                        label: "අනතුරු ඇඟවීමේ අනතුරු ඇඟවීමේ පසුබිම් වර්ණය",
                                        placeholder: "අනතුරු ඇඟවීමේ අනතුරු ඇඟවීමේ පසුබිම් වර්ණයක් තෝරන්න"
                                    }
                                },
                                heading: "ඇඟවීම්"
                            },
                            bodyBackground: {
                                fields: {
                                    main: {
                                        hint: "පරිශීලක අතුරුමුහුණතේ ශරීර මූලද්රව්යයේ භාවිතා වන ප්රධාන පසුබිම් වර්ණය.",
                                        label: "ප්රධාන පසුබිම් වර්ණය",
                                        placeholder: "ප්රධාන ශරීර පසුබිම් වර්ණයක් තෝරන්න"
                                    }
                                },
                                heading: "ශරීර පසුබිම"
                            },
                            fields: {
                                primaryColor: {
                                    hint: "ප්රාථමික ක්රියාකාරී බොත්තම්, හයිපර්ලින්ක් ආදියෙහි දැක්වෙන ප්රධාන වර්ණය.",
                                    label: "ප්රාථමික වර්ණය",
                                    placeholder: "ප්රාථමික වර්ණයක් තෝරන්න."
                                },
                                secondaryColor: {
                                    hint: "අවලංගු කරන ලද බොත්තම් වැනි ද්විතියික ක්රියාකාරී බොත්තම්වල දැක්වෙන වර්ණය ආදිය.",
                                    label: "ද්විතියික වර්ණය",
                                    placeholder: "ද්විතියික වර්ණයක් තෝරන්න."
                                }
                            },
                            heading: "වර්ණ මාල්ට්",
                            illustrations: {
                                fields: {
                                    accentColor1: {
                                        hint: "SVG නිදර්ශන සඳහා භාවිතා කරන මූලික උච්චාරණය මෙයයි.ඔබගේ නිදර්ශනයේ නිශ්චිත අංග කෙරෙහි අවධානය යොමු කරන වර්ණයක් තෝරන්න සහ ඔබගේ පරිශීලක අතුරුමුහුණත් සැලසුමේ ප්රධාන අංග ඉස්මතු කරන්න.",
                                        label: "උච්චාරණ වර්ණය 1",
                                        placeholder: "උච්චාරණ වර්ණයක් උච්චාරණය තෝරන්න"
                                    },
                                    accentColor2: {
                                        hint: "SVG නිදර්ශන සඳහා භාවිතා කරන ද්විතියික උච්චාරණය වර්ණය මෙයයි.ඔබගේ නිර්මාණ සෞන්දර්යාත්මකව ගැලපෙන විකල්ප උච්චාරණ වර්ණයක් තෝරන්න සහ ඔබේ SVG නිදර්ශනයේ සමස්ත දෘශ්ය ආයාචනය වැඩි දියුණු කරයි.",
                                        label: "උච්චාරණ වර්ණය 2",
                                        placeholder: "ද්විතීයික උච්චාරණ වර්ණය නිදර්ශනය තෝරන්න"
                                    },
                                    accentColor3: {
                                        hint: "SVG නිදර්ශන සඳහා භාවිතා කරන තෘතියික උච්චාරණය වර්ණය මෙයයි.ඔබගේ නිර්මාණ සෞන්දර්යාත්මක හා ඔබේ SVG නිදර්ශනයේ සමස්ත දෘශ්ය ආයාචනය වැඩි කරන උච්චාරණ වර්ණයක් තෝරන්න.",
                                        label: "උච්චාරණ වර්ණය 3",
                                        placeholder: "නිදර්ශන තෘතියික උච්චාරණ වර්ණය තෝරන්න"
                                    },
                                    primaryColor: {
                                        hint: "SVG නිදර්ශන සඳහා භාවිතා කරන මූලික වර්ණය මෙයයි.ඔබගේ සමස්ත නිර්මාණ සෞන්දර්යාත්මක හා ඔබේ පරිශීලක අතුරුමුහුණත් කිරීමේ වර්ණ පටිපාටියට ගැලපෙන වර්ණයක් තෝරන්න.",
                                        label: "ප්රාථමික වර්ණය",
                                        placeholder: "නිදර්ශනය ප්රාථමික වර්ණයක් තෝරන්න"
                                    },
                                    secondaryColor: {
                                        hint: "SVG නිදර්ශන සඳහා භාවිතා කරන ද්විතියික වර්ණය මෙයයි.ඔබගේ සමස්ත නිර්මාණ සෞන්දර්යාත්මක හා ඔබේ පරිශීලක අතුරුමුහුණත් කිරීමේ වර්ණ පටිපාටියට ගැලපෙන වර්ණයක් තෝරන්න.",
                                        label: "ද්විතියික වර්ණය",
                                        placeholder: "නිදර්ශන ද්විතීයික වර්ණයක් තෝරන්න"
                                    }
                                },
                                heading: "නිදර්ශන",
                                preview: "පෙරදසුන"
                            },
                            outlines: {
                                fields: {
                                    main: {
                                        hint: "කාඩ්පත්, මෙවලම්, පිතිකරු වැනි මූලද්රව්ය සඳහා භාවිතා කරන පෙරනිමි දළ සටහන වර්ණය.",
                                        label: "පෙරනිමි දළ සටහන වර්ණය",
                                        placeholder: "පෙරනිමි ලුහු line ු සටහන් වර්ණයක් තෝරන්න"
                                    }
                                },
                                heading: "දළ සටහන්"
                            },
                            surfaceBackground: {
                                fields: {
                                    dark: {
                                        hint: "මගේ ගිණුමේ යෙදුම් ශීර්ෂය වැනි මතුපිට අංගයන් භාවිතා කරන පසුබිම් වර්ණයෙහි අඳුරු විචලනය.",
                                        label: "අඳුරු මතුපිට පසුබිම් වර්ණය",
                                        placeholder: "අඳුරු මතුපිට පසුබිම් වර්ණයක් තෝරන්න"
                                    },
                                    inverted: {
                                        hint: "මගේ ගිණුමේ යෙදුම් ශීර්ෂය වැනි මතුපිට අංගයන් භාවිතා කරන පසුබිම් වර්ණයෙහි ප්රතිලෝම විචලනය.",
                                        label: "ප්රතිලෝම මතුපිට පසුබිම් වර්ණය",
                                        placeholder: "ප්රතිලෝම මතුපිට පසුබිම් වර්ණයක් තෝරන්න"
                                    },
                                    light: {
                                        hint: "කාඩ්පත්, පොප්අප්, පැනල් වැනි මතුපිට අංග ආදිය භාවිතා කරන පසුබිම් වර්ණයෙහි සැහැල්ලු විචලනය.",
                                        label: "සැහැල්ලු මතුපිට පසුබිම් වර්ණය",
                                        placeholder: "සැහැල්ලු මතුපිට පසුබිම් වර්ණයක් තෝරන්න"
                                    },
                                    main: {
                                        hint: "කාඩ්පත්, පොප්අප්, පැනල් වැනි මතුපිට අංග භාවිතා කරන ප්රධාන පසුබිම් වර්ණය.",
                                        label: "ප්රධාන මතුපිට පසුබිම් වර්ණය",
                                        placeholder: "ප්රධාන මතුපිට පසුබිම් වර්ණයක් තෝරන්න"
                                    }
                                },
                                heading: "මතුපිට පසුබිම"
                            },
                            text: {
                                fields: {
                                    primary: {
                                        hint: "පරිශීලක අතුරුමුහුණතෙහි භාවිතා වන මූලික පෙළ වර්ණය.පසුබිම් වර්ණයට එරෙහිව හොඳ වෙනසක් සපයන වර්ණයක් තෝරන්න, කියවීමට පහසුය.",
                                        label: "ප්රාථමික පෙළ වර්ණය",
                                        placeholder: "ප්රාථමික පෙළ වර්ණයක් තෝරන්න"
                                    },
                                    secondary: {
                                        hint: "පරිශීලක අතුරුමුහුණතේ භාවිතා කරන ද්විතියික පෙළ වර්ණය.මූලික වර්ණයෙන් සම්පුර්ණ කරන වර්ණයක් තෝරන්න සහ ඔබේ සැලසුමේ දෘශ්ය ධූරාවලිය වැඩි කරයි.",
                                        label: "ද්විතීයික පෙළ වර්ණය",
                                        placeholder: "ද්විතීයික පෙළ වර්ණයක් තෝරන්න"
                                    }
                                },
                                heading: "පෙළ වර්ණ"
                            }
                        },
                        font: {
                            fields: {
                                fontFamilyDropdown: {
                                    hint: "පිවිසුම් තිරයේ දිස්වන පෙළ සඳහා පතනයෙන් අකුරු පවුලක් තෝරන්න.",
                                    label: "අකුරු පවුල",
                                    placeholder: "අකුරු පවුලක් තෝරන්න"
                                },
                                fontFamilyInput: {
                                    hint: "ඉහත ඇතුළත් කර ඇති එකට අනුරූප වන අකුරු පවුල ඇතුළත් කරන්න.",
                                    label: "අකුරු පවුල",
                                    placeholder: "අකුරු පවුලක් ඇතුළත් කරන්න"
                                },
                                importURL: {
                                    hint: "අකුරු සේවාවකින් අභිරුචි අකුරු ආයාත කිරීමට URL එකක් භාවිතා කරන්න.",
                                    label: "අකුරු ආයාත URL",
                                    placeholder: "උදා., https://fonts.googleapis.com/css2?family=Montserrat"
                                }
                            },
                            heading: "අකුරු",
                            types: {
                                fromCDN: "CDN වෙතින්",
                                fromDefaults: "බ්‍රවුසර පෙරනිමියෙන්"
                            }
                        },
                        footer: {
                            fields: {
                                borderColor: {
                                    hint: "පිවිසුම් තිර පාදකයේ ඉහළ මායිම් වර්ණය.",
                                    label: "මායිම් වර්ණය",
                                    placeholder: "පාදක මායිම් වර්ණයක් තෝරන්න"
                                },
                                fontColor: {
                                    hint: "පාදක ප්‍රකාශන හිමිකම් පෙළ සහ සබැඳි වල අකුරු වර්ණය.",
                                    label: "අකුරු වර්ණය",
                                    placeholder: "පාදක අකුරු වර්ණයක් තෝරන්න"
                                }
                            },
                            heading: "පාදකය"
                        },
                        headings: {
                            fields: {
                                fontColor: {
                                    hint: "පිවිසුම් පිටුවල දිස්වන ශීර්ෂවල අකුරු වර්ණය (h1, h2, h3, ආදිය).",
                                    label: "අකුරු වර්ණය",
                                    placeholder: "ශීර්ෂ අකුරු වර්ණයක් තෝරන්න"
                                }
                            },
                            heading: "ශීර්ෂ"
                        },
                        images: {
                            favicon: {
                                fields: {
                                    url: {
                                        hint:
                                            "වඩා හොඳ ප්‍රතිඵල සඳහා වර්ග පික්සල් දර්ශන අනුපාතය සමඟ අවම වශයෙන් " +
                                            "<1>16x16 පික්සල</1> හෝ ඊට වැඩි රූපයක් භාවිත කරන්න. සකසා නොමැති නම්, " +
                                            "{{ productName }} පෙරනිමි භාවිතා වේ.",
                                        label: "Favicon URL",
                                        placeholder: "https://myapp.com/favicon.ico"
                                    }
                                },
                                heading: "Favicon",
                                preview: "පෙරදසුන"
                            },
                            heading: "රූප",
                            logo: {
                                fields: {
                                    alt: {
                                        hint:
                                            "රූපය පූරණය නොවන විට සහ SEO සහ ප්‍රවේශ්‍යතාව සඳහා භාවිත කළ යුතු ලාංඡන " +
                                            "රූපයේ කෙටි ලිඛිත විස්තරයක් එක් කරන්න. සකසා නොමැති නම්," +
                                            "{{ productName }} පෙරනිමි භාවිතා වේ.",
                                        label: "විකල්ප පෙළ",
                                        placeholder: "Alt Text එකක් ඇතුලත් කරන්න"
                                    },
                                    url: {
                                        hint:
                                            "වඩා හොඳ කාර්ය සාධනයක් සඳහා අවම වශයෙන් <1>600x600 පික්සල</1> සහ " +
                                            "<3>1mb</3> ප්‍රමාණයෙන් අඩු රූපයක් භාවිතා කරන්න. සකසා නොමැති නම්, " +
                                            "{{ productName }} පෙරනිමි " +
                                            "භාවිතා වේ.",
                                        label: "ලාංඡනයේ URL",
                                        placeholder: "https://myapp.com/logo.png"
                                    }
                                },
                                heading: "ලාංඡනය",
                                preview: "පෙරදසුන"
                            },
                            myAccountLogo: {
                                fields: {
                                    alt: {
                                        hint: "රූපය පූරණය නොවන විට සහ SEO සහ ප්රවේශය සඳහා ද පෙන්වීමට මගේ ගිණුමේ ලාංඡනය පිළිබඳ කෙටි විස්තරයක් එක් කරන්න.සකසා නොමැති නම්, {{ productName }} පෙරනිමි භාවිතා වේ.",
                                        label: "මගේ ගිණුම් ලාංඡනය Alt Text",
                                        placeholder: "මගේ ගිණුම් ලාංඡනය සඳහා alt පෙළක් ඇතුළත් කරන්න."
                                    },
                                    title: {
                                        hint: "අවශ්ය නම් ලාංඡන රූපය අසල පෙන්විය යුතු මාතෘකාවක් එක් කරන්න.සකසා නොමැති නම්, {{ productName }} පෙරනිමි භාවිතා වේ.",
                                        label: "මගේ ගිණුම ලාංඡනය මාතෘකාව",
                                        placeholder: "මගේ ගිණුම් ලාංඡනය සඳහා මාතෘකාවක් ඇතුළත් කරන්න."
                                    },
                                    url: {
                                        hint: "අවම වශයෙන් <1>250x50 pixels</1> සහ වඩා හොඳ කාර්ය සාධනයක් සඳහා ප්රමාණයේ සහ ප්රමාණයෙන් <3>1mb</3> ට වඩා අඩු රූපයක් භාවිතා කරන්න.සකසා නොමැති නම්, {{ productName }} පෙරනිමි භාවිතා වේ.",
                                        label: "මගේ ගිණුම ලාංඡනය URL",
                                        placeholder: "https://myaccount.myapp.com/logo.png"
                                    }
                                },
                                heading: "මගේ ගිණුම් ලාංඡනය",
                                preview: "පෙරදසුන"
                            }
                        },
                        inputs: {
                            fields: {
                                backgroundColor: {
                                    hint: "පිවිසුම් පෙට්ටිය තුළ ඇති ආදාන ක්ෂේත්‍රවල පසුබිම් වර්ණය.",
                                    label: "පසුබිම් වර්ණය",
                                    placeholder: "ආදාන සඳහා පසුබිම් වර්ණයක් තෝරන්න."
                                },
                                borderColor: {
                                    hint: "පිවිසුම් පෙට්ටිය තුළ ඇති ආදාන ක්ෂේත්‍රවල මායිම් වර්ණය.",
                                    label: "මායිම් වර්ණය",
                                    placeholder: "ආදාන සඳහා මායිම් වර්ණයක් තෝරන්න."
                                },
                                borderRadius: {
                                    hint: "පිවිසුම් පෙට්ටිය තුළ ඇති ආදාන ක්ෂේත්‍රවල මායිම් අරය.",
                                    label: "දේශසීමා අරය",
                                    placeholder: "පිවිසුම් පෙට්ටිය සඳහා මායිම් අරයක් තෝරන්න."
                                },
                                fontColor: {
                                    hint: "පිවිසුම් පෙට්ටිය තුළ ඇති ආදාන ක්ෂේත්‍රවල අකුරු වර්ණය.",
                                    label: "අකුරු වර්ණය",
                                    placeholder: "ආදාන සඳහා අකුරු වර්ණයක් තෝරන්න."
                                }
                            },
                            heading: "ආදාන",
                            labels: {
                                fields: {
                                    fontColor: {
                                        hint: "පිවිසුම් පෙට්ටිය තුළ ඇති ආදාන ක්ෂේත්‍ර ලේබලවල අකුරු වර්ණය.",
                                        label: "අකුරු වර්ණය",
                                        placeholder: "ආදාන ලේබල සඳහා අකුරු වර්ණයක් තෝරන්න."
                                    }
                                },
                                heading: "ආදාන ලේබල"
                            }
                        },
                        loginBox: {
                            fields: {
                                backgroundColor: {
                                    hint: "පිවිසුම් පෙට්ටියේ පසුබිම් වර්ණය.",
                                    label: "පසුබිම් වර්ණය",
                                    placeholder: "පිවිසුම් පෙට්ටියේ පසුබිම් වර්ණයක් තෝරන්න."
                                },
                                borderColor: {
                                    hint: "පිවිසුම් පෙට්ටියේ මායිම් වර්ණය.",
                                    label: "මායිම් වර්ණය",
                                    placeholder: "පිවිසුම් පෙට්ටිය සඳහා මායිම් වර්ණයක් තෝරන්න."
                                },
                                borderRadius: {
                                    hint: "පිවිසුම් පෙට්ටියේ මායිම් අරය.",
                                    label: "දේශසීමා අරය",
                                    placeholder: "පිවිසුම් පෙට්ටිය සඳහා මායිම් අරයක් තෝරන්න."
                                },
                                borderWidth: {
                                    hint: "පිවිසුම් පෙට්ටියේ මායිම් පළල.",
                                    label: "මායිම් පළල",
                                    placeholder: "පිවිසුම් පෙට්ටියේ මායිම් පළලක් තෝරන්න."
                                },
                                fontColor: {
                                    hint: "පිවිසුම් පෙට්ටිය තුළ ඇති පෙළෙහි අකුරු වර්ණය.",
                                    label: "අකුරු වර්ණය",
                                    placeholder: "පිවිසුම් පෙට්ටි පෙළ සඳහා අකුරු වර්ණයක් තෝරන්න."
                                }
                            },
                            heading: "පිවිසුම් පෙට්ටිය"
                        },
                        loginPage: {
                            fields: {
                                backgroundColor: {
                                    hint: "පිවිසුම් තිරවල පසුබිම් වර්ණය.",
                                    label: "පසුබිම් වර්ණය",
                                    placeholder: "පිටු පසුබිම් වර්ණයක් තෝරන්න"
                                },
                                fontColor: {
                                    hint: "පිටු අන්තර්ගතයේ අකුරු වර්ණය.",
                                    label: "අකුරු වර්ණය",
                                    placeholder: "පිටු අකුරු වර්ණයක් තෝරන්න"
                                }
                            },
                            heading: "Page"
                        },
                        variations: {
                            fields: {
                                dark: {
                                    label: "අඳුරු තේමාව"
                                },
                                light: {
                                    label: "දීප්තිමත් තේමාව"
                                }
                            }
                        }
                    }
                },
                general: {
                    fields: {
                        displayName: {
                            hint:
                                "පරිශීලකයින්ට දිස්වන සංවිධානයේ නම." +
                                "සකසා නොමැති නම්, {{ productName }} පෙරනිමිය භාවිතා වේ.",
                            label: "සංවිධානයේ සංදර්ශක නම",
                            placeholder: "සංදර්ශක නාමයක් ඇතුළත් කරන්න"
                        },
                        supportEmail: {
                            hint:
                                "දෝෂ පිටු සහ පාරිභෝගිකයින් සඳහා සහය අවශ්‍ය වන ස්ථානවල දිස්වන විද්‍යුත් තැපෑල." +
                                "සකසා නොමැති නම්, {{ productName }} පෙරනිමි භාවිතා වේ.",
                            label: "සම්බන්ද කරගත හැකි විද්යුත් ලිපිනය",
                            placeholder: "සම්බන්ධතා විද්‍යුත් තැපෑලක් ඇතුළු කරන්න"
                        }
                    }
                }
            },
            notifications: {
                delete: {
                    genericError: {
                        description: "{{ tenant }} සඳහා සන්නම් මනාප මකා දැමීමේදී දෝෂයක් ඇති විය.",
                        message: "සන්නම් මනාප මැකීමට නොහැකි විය"
                    },
                    invalidStatus: {
                        description: "{{ tenant }} සඳහා සන්නාම මනාප මකා දැමීමේදී යම් දෙයක් වැරදී ඇත.",
                        message: "සන්නම් මනාප මැකීමට නොහැකි විය"
                    },
                    notConfigured: {
                        description: "{{ tenant }} සඳහා සන්නාම මනාප කිසිවක් හමු නොවීය.",
                        message: "සන්නම් මනාප මැකීමට නොහැකි විය"
                    },
                    success: {
                        description: "{{ tenant }} සඳහා සන්නම් මනාපයන් සාර්ථකව ප්‍රතිවර්තනය කරන ලදී.",
                        message: "ප්‍රතිවර්තනය සාර්ථකයි"
                    },
                    successWaiting: {
                        description: "{{ tenant }} සඳහා වෙළඳනාම මනාපයන් ආපසු හැරීම."+
                            "වෙනස්කම් පිළිබිඹු වන වෙනස්කම් සඳහා ටික කාලයක් ගතවනු ඇත.",
                        message: "සන්නම් මනාප ආපසු හැරවීම"
                    },
                    successWaitingAlert: {
                        description: "{{{ tenant }} සඳහා වෙළඳනාම මනාපයන් ආපසු හැරීම."+
                            "පිළිබිඹු කළ යුතු වෙනස්කම් සඳහා මිනිත්තු 10 ක් පමණ ගතවිය හැකි බව සලකන්න.",
                        message: "සන්නම් මනාප ආපසු හැරවීම"
                    }
                },
                fetch: {
                    customLayoutNotFound: {
                        description: "{{ tenant }} සඳහා යෙදවූ අභිරුචි පිරිසැලසුමක් නොමැත.",
                        message: "අභිරුචි පිරිසැලසුම සක්‍රිය කිරීමට නොහැකි විය"
                    },
                    genericError: {
                        description: "{{ tenant }} සඳහා සන්නම් මනාප ලබා ගැනීමේදී දෝෂයක් සිදු විය.",
                        message: "සන්නාම මනාප ලබා ගැනීමට නොහැකි විය"
                    },
                    invalidStatus: {
                        description: "{{ tenant }} සඳහා සන්නාම මනාප ලබා ගැනීමේදී යම් දෙයක් වැරදී ඇත.",
                        message: "සන්නාම මනාප ලබා ගැනීමට නොහැකි විය"
                    },
                    tenantMismatch: {
                        description: "{{ tenant }} සඳහා සන්නාම මනාප ලබා ගැනීමේදී යම් දෙයක් වැරදී ඇත.",
                        message: "සන්නාම මනාප ලබා ගැනීමට නොහැකි විය"
                    }
                },
                update: {
                    genericError: {
                        description: "{{ tenant }} සඳහා සන්නම් මනාප යාවත්කාලීන කිරීමේදී දෝෂයක් සිදු විය.",
                        message: "යාවත්කාලීන දෝෂයක්"
                    },
                    invalidStatus: {
                        description: "{{ tenant }} සඳහා සන්නම් මනාප යාවත්කාලීන කිරීමේදී දෝෂයක් සිදු විය.",
                        message: "යාවත්කාලීන දෝෂයක්"
                    },
                    success: {
                        description: "Branding preference updated successfully for {{ tenant }}.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    },
                    successWaiting: {
                        description: "{{ tenant }} සඳහා වෙළඳ නාමකරණ මනාප යාවත්කාලීන කිරීම."+
                            "වෙනස්කම් පිළිබිඹු වන වෙනස්කම් සඳහා ටික කාලයක් ගතවනු ඇත.",
                        message: "සන්නම් මනාප යාවත්කාලීන කිරීම"
                    },
                    successWaitingAlert: {
                        description: "{{ tenant }} සඳහා වෙළඳ නාමකරණ මනාප යාවත්කාලීන කිරීම."+
                            "පිළිබිඹු කළ යුතු වෙනස්කම් සඳහා මිනිත්තු 10 ක් පමණ ගතවිය හැකි බව සලකන්න.",
                        message: "සන්නම් මනාප යාවත්කාලීන කිරීම"
                    },
                    tenantMismatch: {
                        description: "{{ tenant }} සඳහා සන්නම් මනාප යාවත්කාලීන කිරීමේදී දෝෂයක් සිදු විය.",
                        message: "යාවත්කාලීන දෝෂයක්"
                    }
                }
            },
            pageHeader: {
                description: "ඔබේ සංවිධානයේ යෙදුම්වල පාරිභෝගිකයින්ට මුහුණ දෙන පරිශීලක අතුරුමුහුණත් අභිරුචිකරණය කරන්න.",
                title: "වෙළඳ නාමය අභිරුචිකරණය"
            },
            publishToggle: {
                hint: "වෙනස්කම් සක්රිය / අක්රිය කරන්න",
                label: "සජීවීව යන්න",
                enabled: "සක්රිය",
                disabled: "අක්රිය"
            },
            tabs: {
                advance: {
                    label: "සංකීර්ණ"
                },
                design: {
                    label: "නිර්මාණ",
                    sections: {
                        imagePreferences: {
                            description: "ඔබේ සංවිධානයේ තේමාවට ගැළපීමට අභිරුචි පින්තූර එක් කරන්න.",
                            heading: "රූප මනාප"
                        },
                        layoutVariation: {
                            description: "ඔබගේ අතුරුමුහුණත් සඳහා පිරිසැලසුමක් තෝරන්න. තේමා මනාප "
                                + "යාවත්කාලීන කිරීමෙන් ඔබට මෙම පිරිසැලසුම් තවදුරටත් අභිරුචිකරණය කළ හැක.",
                            heading: "පිරිසැලසුම",
                            status: "නවතම"
                        },
                        themePreferences: {
                            description: "ඉහත තෝරාගත් තේමා විචලනය මත පදනම්ව, අභිරුචිකරණය ආරම්භ කරන්න "
                                + "ඔබේ සංවිධානයේ මාර්ගෝපදේශවලට ගැළපීමට පහත සඳහන් අංග.",
                            heading: "තේමා මනාප"
                        },
                        themeVariation: {
                            description: "ඔබගේ අතුරුමුහුණත් සඳහා වර්ණ තේමාවක් තෝරන්න. ඔබට තවදුරටත් අභිරුචිකරණය" +
                                " කළ හැක මෙම තේමා පහත දක්වා ඇති විකල්ප භාවිතා කරයි. පෙරනිමියෙන්, සැහැල්ලු තේමාව " +
                                "({{ productName }} තේමාව) තෝරා ඇත..",
                            heading: "තේමා විචලනය"
                        }
                    }
                },
                general: {
                    customRequest: {
                        description:
                            "ඔබට තවත් අභිරුචිකරණයන් අවශ්‍ය නම්, කරුණාකර <1>{{ supportEmail }}</> " +
                            "හිදී අප හා සම්බන්ධ වන්න",
                        heading: "තවත් අභිරුචිකරණයන් අවශ්‍යද?"
                    },
                    label: "පොදු"
                },
                preview: {
                    disclaimer:
                        "මෙම මනාපයන් ප්‍රකාශයට පත් කළ පසු, ඒවා ඔබේ යෙදුම්වල පරිශීලක ලියාපදිංචි ප්‍රවාහවලට සහ සියලුම පිවිසුම් ප්‍රවාහයන්ට " +
                        "(බහු සාධක පිවිසුම් ඇතුළුව) සහ විද්‍යුත් තැපැල් සැකිලිවල යොදනු ලැබේ.",
                    errors: {
                        layout: {
                            notFound: {
                                subTitle: "ඔබ සොයන සම්පත නොමැත.",
                                title: "සම්පත හමු නොවීය"
                            },
                            notFoundWithSupport: {
                                description: "ඔබේ සංවිධානය සඳහා සම්පූර්ණයෙන්ම අභිරුචි කළ "
                                    + "පිරිසැලසුමක් අවශ්‍යද? <1>{{ supportEmail }}</1> හිදී අපව සම්බන්ධ කර ගන්න.",
                                subTitle: "ඔබ තවමත් අභිරුචි පිරිසැලසුමක් යොදවා නැත.",
                                title: "අභිරුචි පිරිසැලසුම හමු නොවීය"
                            }
                        }
                    },
                    info: {
                        layout: {
                            activatedMessage: {
                                description: "ඔබට දැන් පුරනය වීම, ලියාපදිංචි කිරීම සහ ප්‍රතිසාධන පිටු "
                                    + "සඳහා අභිරුචි පිරිසැලසුමක් ඇතුළත් කළ හැක. සවිස්තරාත්මක "
                                    + "උපදෙස් සඳහා අපගේ ලේඛන බලන්න.",
                                subTitle: "අභිරුචි පිරිසැලසුම සාර්ථකව සක්‍රිය කර ඇත.",
                                title: "අභිරුචි පිරිසැලසුම"
                            }
                        }
                    },
                    label: "පෙරදසුන"
                }
            }
        },
        emailProviders: {
            configureEmailTemplates: "විද්‍යුත් තැපැල් සැකිලි වින්‍යාස කරන්න",
            heading: "අභිරුචි ඊමේල් සපයන්නා",
            subHeading: "ඔබගේම ඊමේල් ලිපිනය සමඟ තැපැල් යැවීමට අභිරුචි SMTP සේවාදායකයන් වින්‍යාස කරන්න.",
            description: "ඔබගේ SMTP සේවාදායකයට අනුව විද්‍යුත් තැපැල් සැපයුම්කරු සැකසුම් වින්‍යාස කරන්න.",
            note: "සුපිරි සංවිධානය සඳහා ඊමේල් සපයන්නා <1>deployment.toml</1> හරහා පමණක් වින්‍යාස කළ හැක.",
            info: "ඔබට <1>ඊමේල් සැකිලි</1> භාවිතයෙන් ඊමේල් අන්තර්ගතය අභිරුචිකරණය කළ හැක.",
            updateButton: "යාවත්කාලීන කරන්න",
            sendTestMailButton: "පරීක්ෂණ විද්‍යුත් තැපෑල යවන්න",
            goBack: "ඊමේල් සහ කෙටි පණිවුඩ වෙත ආපසු යන්න",
            confirmationModal: {
                assertionHint: "කරුණාකර ඔබගේ ක්‍රියාව තහවුරු කරන්න.",
                content: "ඔබ මෙම වින්‍යාසය මකා දැමුවහොත්, ඊමේල් Asgardeo විද්‍යුත් තැපැල් ලිපිනයෙන් යවනු ලැබේ. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                header: "ඔයාට විශ්වාස ද?",
                message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර විද්‍යුත් තැපැල් සපයන්නාගේ වින්‍යාසයන් ස්ථිරවම මකනු ඇත."
            },
            dangerZoneGroup: {
                header: "අවදානම් කලාපය",
                revertConfig: {
                    heading: "ප්‍රතිවර්තන වින්‍යාසය",
                    subHeading: "මෙම ක්‍රියාව මගින් තැපැල් සේවාදායක වින්‍යාසයන් Asgardeo පෙරනිමි වින්‍යාසය වෙත ප්‍රතිවර්තනය කරනු ඇත. " +
                        "ඔබ ප්‍රතිවර්තනය කරන්නේ නම්, ඔබට Asgardeo වසම වෙතින් ඊමේල් දිගටම ලැබෙනු ඇත.",
                    actionTitle: "ආපසු හරවන්න"
                }
            },
            form: {
                smtpServerHost: {
                    label: "සේවාදායක සත්කාරක",
                    placeholder: "සේවාදායක සත්කාරකයක් ඇතුළු කරන්න",
                    hint: "Server Host සාමාන්‍යයෙන් සපයනු ලබන්නේ ඔබගේ විද්‍යුත් තැපැල් සේවා සපයන්නා විසින් වන අතර සාමාන්‍යයෙන් ආරම්භ වන්නේ <1>smtp</1>, " +
                        "පසුව ඊමේල් සේවා සපයන්නාගේ වසම් නාමයෙනි."
                },
                smtpPort: {
                    label: "සේවාදායක වරාය",
                    placeholder: "වරාය අංකයක් ඇතුළත් කරන්න",
                    hint: "පෙරනිමි SMTP තොට <1>25</1> වේ, නමුත් සමහර විද්‍යුත් තැපැල් සේවා සපයන්නන් <3>587</3> වැනි විකල්ප වරායන් " +
                        "භාවිතා කළ හැක. නිවැරදි SMTP තොට සඳහා ඔබේ විද්‍යුත් තැපැල් සේවා සපයන්නා සමඟ පරීක්ෂා කරන්න."
                },
                fromAddress: {
                    label: "ලිපිනයෙන්",
                    placeholder: "ඊමේල් ලිපිනයක් ඇතුලත් කරන්න",
                    hint: "ආරක්ෂක හේතූන් මත, අපි දැනට වරාය <1>587</1> පමණක් සහාය දක්වමු."
                },
                replyToAddress: {
                    label: "පිළිතුරු-ලිපිනයට",
                    placeholder: "ඊමේල් ලිපිනයක් ඇතුලත් කරන්න",
                    hint: "ඔබගේ පණිවිඩයට පිළිතුරු දීමට අවශ්‍ය නම් ලබන්නන් භාවිතා කළ යුතු විද්‍යුත් තැපැල් ලිපිනය සඳහන් කිරීමට පිළිතුරු යැවීමේ ලිපිනය භාවිතා වේ. " +
                        "මෙය පාරිභෝගික සහාය ඊමේල් ලිපිනයක් විය හැක."
                },
                userName: {
                    label: "පරිශීලක නාමය",
                    placeholder: "පරිශීලක නාමයක් ඇතුළත් කරන්න",
                    hint: "SMTP පරිශීලක නාමය සාමාන්‍යයෙන් ඔබගේ විද්‍යුත් තැපැල් ලිපිනයට සමාන වේ. කෙසේ වෙතත්, සමහර විද්‍යුත් " +
                        "තැපැල් සේවා සපයන්නන් ඔබගේ SMTP සැකසුම් සඳහා වෙනත් පරිශීලක නාමයක් භාවිතා කිරීමට අවශ්‍ය විය හැක."
                },
                password: {
                    label: "මුරපදය",
                    placeholder: "මුරපදයක් ඇතුලත් කරන්න",
                    hint: "SMTP මුරපදය යනු SMTP සේවාදායකය හරහා ඊමේල් යැවීමේදී ඔබගේ අනන්‍යතාවය සත්‍යාපනය කිරීමට සහ සත්‍යාපනය කිරීමට භාවිතා කරන ආරක්ෂක අක්තපත්‍රයකි."
                },
                displayName: {
                    label: "ප්රදර්ශන නාමය",
                    placeholder: "සංදර්ශක නාමයක් ඇතුළත් කරන්න",
                    hint: "ඔබගේ පණිවිඩය ලැබෙන විට ලබන්නන් ඔවුන්ගේ ඊමේල් එන ලිපි තුළ දකින නම සඳහන් කිරීමට සංදර්ශක නාමය භාවිතා වේ. මෙය ඔබේ සංවිධානයේ නම විය හැක."
                },
                validations: {
                    required: "මෙම ක්ෂේත්‍රය හිස් විය නොහැක",
                    portInvalid: "තොට අංකය වලංගු නැත",
                    emailInvalid: "ඊමේල් ලිපිනය වලංගු නැත"
                }
            },
            notifications: {
                getConfiguration: {
                    error: {
                        message: "දෝෂයක් සිදුවී",
                        description: "ඊමේල් සපයන්නාගේ වින්‍යාසයන් ලබා ගැනීමේ දෝෂයකි."
                    }
                },
                deleteConfiguration: {
                    error: {
                        message: "දෝෂයක් සිදුවී",
                        description: "ඊමේල් සපයන්නාගේ වින්‍යාසය මකා දැමීමේ දෝෂයකි."
                    },
                    success: {
                        message: "සාර්ථකව මකා ඇත",
                        description: "විද්‍යුත් තැපැල් සපයන්නාගේ වින්‍යාස කිරීම් සාර්ථකව මකා දමන ලදී."
                    }
                },
                updateConfiguration: {
                    error: {
                        message: "දෝෂයක් සිදුවී",
                        description: "ඊමේල් සපයන්නාගේ වින්‍යාසයන් යාවත්කාලීන කිරීමේ දෝෂයකි."
                    },
                    success: {
                        message: "සාර්ථකව යාවත්කාලීන කරන ලදී",
                        description: "විද්‍යුත් තැපැල් සපයන්නාගේ වින්‍යාසයන් සාර්ථකව යාවත්කාලීන කරන ලදී."
                    }
                }
            }
        },
        notificationChannel: {
            heading: "SMS / ඊමේල් සපයන්නන්",
            title: "SMS / ඊමේල් සපයන්නන්",
            description: "ඔබේ සංවිධානය සඳහා SMS සහ විද්‍යුත් තැපැල් සපයන්නන් වින්‍යාස කරන්න."
        },
        smsProviders: {
            heading: "අභිරුචි කෙටි පණිවුඩ සපයන්නා",
            subHeading: "ඔබගේ පරිශීලකයින්ට SMS යැවීමට අභිරුචි SMS සපයන්නෙකු වින්‍යාස කරන්න.",
            description: "ඔබගේ SMS සපයන්නාට අනුව SMS සපයන්නාගේ සැකසුම් වින්‍යාස කරන්න.",
            info: "ඔබට <1>SMS සැකිලි</1> භාවිතයෙන් SMS අන්තර්ගතය අභිරුචිකරණය කළ හැක.",
            updateButton: "යාවත්කාලීන කරන්න",
            sendTestSMSButton: "පරීක්ෂණ SMS යවන්න",
            goBack: "ඊමේල් සහ කෙටි පණිවුඩ වෙත ආපසු යන්න",
            confirmationModal: {
                assertionHint: "කරුණාකර ඔබගේ ක්‍රියාව තහවුරු කරන්න.",
                content: "ඔබ මෙම වින්‍යාසය මකා දැමුවහොත්, ඔබට SMS නොලැබෙනු ඇත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                header: "ඔයාට විශ්වාස ද?",
                message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර SMS සපයන්නාගේ වින්‍යාසයන් ස්ථිරවම මකනු ඇත."
            },
            dangerZoneGroup: {
                header: "අවදානම් කලාපය",
                revertConfig: {
                    heading: "සැකසුම් මකන්න",
                    subHeading: "මෙම ක්‍රියාව sms සපයන්නාගේ වින්‍යාසයන් මකනු ඇත. මකා දැමූ පසු, ඔබට SMS නොලැබේ.",
                    actionTitle: "මකන්න"
                }
            },
            form: {
                twilio: {
                    subHeading: "Twilio සැකසුම්",
                    accountSID: {
                        label: "Twilio ගිණුම් SID",
                        placeholder: "Twilio ගිණුමේ SID ඇතුලත් කරන්න",
                        hint: "ගිණුම සඳහා පරිශීලක නාමය ලෙස ක්‍රියා කරන Twilio ගිණුම් තන්තු හඳුනාගැනීම"
                    },
                    authToken: {
                        label: "Twilio Auth ටෝකනය",
                        placeholder: "Twilio auth ටෝකනය ඇතුළු කරන්න",
                        hint: "Twilio auth සේවාදායකය විසින් ජනනය කරන ලද ප්‍රවේශ ටෝකනය."
                    },
                    sender: {
                        label: "යවන්නා",
                        placeholder: "යවන්නාගේ දුරකථන අංකය ඇතුළත් කරන්න",
                        hint: "යවන්නාගේ දුරකථන අංකය."
                    },
                    validations: {
                        required: "මෙම ක්ෂේත්‍රය හිස් විය නොහැක"
                    }
                },
                vonage: {
                    subHeading: "Vonage සැකසුම්",
                    accountSID: {
                        label: "Vonage API යතුර",
                        placeholder: "Vonage API යතුර ඇතුලත් කරන්න",
                        hint: "ගිණුම සඳහා පරිශීලක නාමය ලෙස ක්‍රියා කරන Vonage API යතුර."
                    },
                    authToken: {
                        label: "Vonage API රහස",
                        placeholder: "Vonage API රහස ඇතුලත් කරන්න",
                        hint: "Vonage auth සේවාදායකය විසින් ජනනය කරන ලද API රහස."
                    },
                    sender: {
                        label: "යවන්නා",
                        placeholder: "යවන්නාගේ දුරකථන අංකය ඇතුළත් කරන්න",
                        hint: "යවන්නාගේ දුරකථන අංකය."
                    },
                    validations: {
                        required: "මෙම ක්ෂේත්‍රය හිස් විය නොහැක"
                    }
                },
                custom: {
                    subHeading: "අභිරුචි සැකසුම්",
                    providerName: {
                        label: "SMS සපයන්නාගේ නම",
                        placeholder: "SMS සපයන්නාගේ නම ඇතුළත් කරන්න",
                        hint: "SMS සපයන්නාගේ නම."
                    },
                    providerUrl: {
                        label: "SMS සපයන්නාගේ URL",
                        placeholder: "SMS සපයන්නාගේ URL එක ඇතුලත් කරන්න",
                        hint: "SMS සපයන්නාගේ URL එක."
                    },
                    httpMethod: {
                        label: "HTTP ක්‍රමයHTTP ක්‍රමය",
                        placeholder: "POST",
                        hint: "SMS යැවීම සඳහා භාවිතා කරන API ඉල්ලීමේ HTTP ක්‍රමය."
                    },
                    contentType: {
                        label: "අන්තර්ගතයේ වර්ගය",
                        placeholder: "JSON",
                        hint: "SMS යැවීම සඳහා භාවිතා කරන API ඉල්ලීමේ අන්තර්ගත වර්ගය."
                    },
                    headers: {
                        label: "ශීර්ෂ",
                        placeholder: "http ශීර්ෂ ඇතුළත් කරන්න",
                        hint: "Send SMS API ඉල්ලීමට ඇතුළත් කළ යුතු HTTP ශීර්ෂයන්."
                    },
                    payload: {
                        label: "ගෙවීම",
                        placeholder: "ගෙවීම ඇතුළත් කරන්න",
                        hint: "SMS API ඉල්ලීමේ ගෙවීම."
                    },
                    key: {
                        label: "SMS සපයන්නාගේ සත්‍යාපන යතුර",
                        placeholder: "SMS සපයන්නා auth යතුර ඇතුළත් කරන්න",
                        hint: "SMS සපයන්නාගේ සත්‍යාපන යතුර."
                    },
                    secret: {
                        label: "SMS සපයන්නාගේ සත්‍යාපන රහස",
                        placeholder: "SMS සපයන්නාගේ සත්‍යාපන රහස ඇතුලත් කරන්න",
                        hint: "SMS සපයන්නාගේ සත්‍යාපන රහස."
                    },
                    sender: {
                        label: "යවන්නා",
                        placeholder: "යවන්නා ඇතුළු කරන්න",
                        hint: "SMS යවන්නා."
                    },
                    validations: {
                        required: "මෙම ක්ෂේත්‍රය හිස් විය නොහැක",
                        methodInvalid: "HTTP ක්‍රමය වලංගු නැත",
                        contentTypeInvalid: "අන්තර්ගත වර්ගය වලංගු නොවේ"
                    }
                }
            },
            notifications: {
                getConfiguration: {
                    error: {
                        message: "Error Occurred",
                        description: "Error retrieving the sms provider configurations."
                    }
                },
                deleteConfiguration: {
                    error: {
                        message: "Error Occurred",
                        description: "Error deleting the sms provider configurations."
                    },
                    success: {
                        message: "Revert Successful",
                        description: "Successfully reverted the sms provider configurations."
                    }
                },
                updateConfiguration: {
                    error: {
                        message: "Error Occurred",
                        description: "Error updating the sms provider configurations."
                    },
                    success: {
                        message: "Update Successful",
                        description: "Successfully updated the sms provider configurations."
                    }
                }
            }
        },
        identityProviders: {
            apple: {
                quickStart: {
                    addLoginModal: {
                        heading: "ඇපල් පිවිසුම එක් කරන්න",
                        subHeading: "ඇපල් පිවිසුම සැකසීමට යෙදුමක් තෝරන්න."
                    },
                    connectApp: {
                        description:
                            "ඔබගේ <7>යෙදුමේ</7> <5>පුරනය වීමේ ක්‍රමය</5> කොටසේ <3>පියවර 1</3> වෙත <1>ඇපල්" +
                            "</1> සත්‍යාපකය එක් කරන්න."
                    },
                    heading: "ඇපල් පිවිසුම එක් කරන්න",
                    subHeading: "ඇපල් දැන් ඔබගේ යෙදුම් සඳහා පිවිසුම් විකල්පයක් ලෙස භාවිතා කිරීමට සූදානම්ය.",
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්‍රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට ඇපල් පිවිසුම සැකසීමට අවශ්‍ය <1>යෙදුම</1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectDefaultConfig: {
                            content:
                                "<1>පුරනය වීමේ ක්‍රමය</1> ටැබය වෙත ගොස් <3>ඇපල් පිවිසුම එකතු කරන්න</3>" +
                                " මත ක්ලික් කරන්න.",
                            heading: "<1>පෙරනිමි වින්‍යාස කිරීම සමඟ ආරම්භ කරන්න</1> තෝරන්න"
                        }
                    }
                }
            },
            emailOTP: {
                quickStart: {
                    addLoginModal: {
                        heading: "විද්‍යුත් තැපෑල OTP එක් කරන්න",
                        subHeading: "විද්‍යුත් තැපැල් OTP පිවිසුම සැකසීමට යෙදුමක් තෝරන්න."
                    },
                    connectApp: {
                        description:
                            "ඔබගේ <1>යෙදුමේ</1> <3>පුරනය වීමේ ක්‍රමය</3> කොටසේ <5>පියවර 2</5> වෙත " +
                            "<6>විද්‍යුත් තැපෑල OTP</6> එක් කරන්න."
                    },
                    heading: "ඊමේල් OTP පිහිටුවීම් මාර්ගෝපදේශය",
                    subHeading:
                        "ඔබගේ පිවිසුම් ප්‍රවාහයේ සාධකයක් ලෙස විද්‍යුත් තැපෑල OTP සැකසීමට පහත දැක්වෙන උපදෙස් අනුගමනය " +
                        "කරන්න.",
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්‍රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට ඊමේල් ඕටීපී පිවිසුම සැකසීමට අවශ්‍ය <1> යෙදුම </1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectEmailOTP: {
                            content:
                                "මූලික ඊමේල් ඕටීපී ප්‍රවාහයක් වින්‍යාස කිරීම සඳහා <1> පුරනය වීමේ ක්‍රමය </1> ටැබයට ගොස් " +
                                "<3> දෙවන සාධකයක් ලෙස ඊමේල් ඕටීපී එකතු කරන්න </3> මත ක්ලික් කරන්න.",
                            heading: "<1>දෙවන සාධකයක් ලෙස ඊමේල් ඕටීපී එකතු කරන්න</1> තෝරන්න "
                        }
                    }
                }
            },
            smsOTP: {
                settings: {
                    smsOtpEnableDisableToggle: {
                        labelEnable: "SMS OTP සක්‍රිය කරන්න",
                        labelDisable: "SMS OTP අක්‍රිය කරන්න"
                    },
                    enableRequiredNote: {
                        message: "SMS OTP සක්‍රීය කිරීම සදහා Asgardeo විසින් Choreo වෙත සිදුවීම් පල කරන අතර, බහු " +
                            "සේවාවන් හා ඒකාබද්ධව OTP දැන්වීම් පලකර ගැනීමට Choreo webhooks භවිතා කරයි. මෙම සේවාව වින්‍යාස " +
                            "කරගැනීම සදහා <1>Add SMS OTP</1> ලේකනය අනුගමනය කරන්න."
                    },
                    errorNotifications: {
                        notificationSendersRetrievalError: {
                            message: "දෝෂයක් ඇත.",
                            description: "SMS OTP වින්‍යාස ලබා ගැනීමේ දෝෂයක් ඇත."
                        },
                        smsPublisherCreationError: {
                            message: "දෝෂයක් ඇත.",
                            description: "SMS OTP සක්‍රීය කිරීමේ දෝෂයක් ඇත."
                        },
                        smsPublisherDeletionError: {
                            generic: {
                                message: "දෝෂයක් ඇත.",
                                description: "SMS OTP අක්‍රිය කිරීමේ දෝෂයක් ඇත."
                            },
                            activeSubs: {
                                message: "දෝෂයක් ඇත.",
                                description: "SMS OTP අක්‍රිය කිරීමට උත්සාහ කිරීමේදී දෝෂයක් ඇති විය. SMS ප්‍රකාශකයාට සක්‍රිය ග්‍රාහකයින් පවතී."
                            },
                            connectedApps: {
                                message: "දෝෂයක් ඇත.",
                                description: "SMS OTP අක්‍රිය කිරීමට උත්සාහ කිරීමේදී දෝෂයක් ඇති විය. මෙම සම්බන්ධතාවය " +
                                    "භාවිතා කරන යෙදුම් තිබේ."
                            }

                        }
                    }
                },
                quickStart: {
                    addLoginModal: {
                        heading: "කෙටි පණිවුඩ OTP එක් කරන්න",
                        subHeading: "කෙටි පණිවුඩ OTP පිවිසුම සැකසීමට යෙදුමක් තෝරන්න."
                    },
                    connectApp: {
                        description:
                            "ඔබගේ <1>යෙදුමේ</1> <3>පුරනය වීමේ ක්‍රමය</3> කොටසේ <5>පියවර 2</5> වෙත " +
                            "<6>කෙටි පණිවුඩ OTP</6> එක් කරන්න."
                    },
                    heading: "කෙටි පණිවුඩ OTP පිහිටුවීම් මාර්ගෝපදේශය",
                    subHeading:
                        "ඔබගේ පිවිසුම් ප්‍රවාහයේ සාධකයක් ලෙස කෙටි පණිවුඩ OTP සැකසීමට පහත දැක්වෙන උපදෙස් අනුගමනය " +
                        "කරන්න.",
                    steps: {
                        selectApplication: {
                            content: "ඔබට කෙටි පණිවුඩ ඕටීපී පිවිසුම සැකසීමට අවශ්‍ය <1> යෙදුම </1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectSMSOTP: {
                            content:
                                "මූලික SMS OTP ප්‍රවාහයක් වින්‍යාස කිරීම සඳහා <1> පුරනය වීමේ ක්‍රමය </1> ටැබයට ගොස් " +
                                "<3> දෙවන සාධකයක් ලෙස SMS OTP එකතු කරන්න </3> මත ක්ලික් කරන්න.",
                            heading: "<1>දෙවන සාධකයක් ලෙස SMS OTP එකතු කරන්න</1> තෝරන්න "
                        }
                    }
                }
            },
            facebook: {
                quickStart: {
                    addLoginModal: {
                        heading: "ෆේස්බුක් පිවිසුම එක් කරන්න",
                        subHeading: "ෆේස්බුක් පිවිසුම සැකසීමට යෙදුමක් තෝරන්න."
                    },
                    connectApp: {
                        description:
                            "ඔබගේ <7>යෙදුමේ</7> <5>පුරනය වීමේ ක්‍රමය</5> කොටසේ <3>පියවර 1</3> වෙත <1>ෆේස්බුක්" +
                            "</1> සත්‍යාපකය එක් කරන්න."
                    },
                    heading: "ෆේස්බුක් පිවිසුම එක් කරන්න",
                    subHeading: "ෆේස්බුක් දැන් ඔබගේ යෙදුම් සඳහා පිවිසුම් විකල්පයක් ලෙස භාවිතා කිරීමට සූදානම්ය.",
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්‍රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට ෆේස්බුක් පිවිසුම සැකසීමට අවශ්‍ය <1> යෙදුම </1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectDefaultConfig: {
                            content:
                                "<1> පුරනය වීමේ ක්‍රමය </1> ටැබය වෙත ගොස් <3> පෙරනිමි වින්‍යාස කිරීම සමඟ ආරම්භ කරන්න " +
                                "</3> මත ක්ලික් කරන්න.",
                            heading: "<1> පෙරනිමි වින්‍යාස කිරීම සමඟ ආරම්භ කරන්න </1> තෝරන්න"
                        }
                    }
                }
            },
            github: {
                quickStart: {
                    addLoginModal: {
                        heading: "GitHub පිවිසුම එක් කරන්න",
                        subHeading: "GitHub පිවිසුම සැකසීමට යෙදුමක් තෝරන්න."
                    },
                    connectApp: {
                        description:
                            "ඔබගේ <7>යෙදුමේ</7> <5>පුරනය වීමේ ක්‍රමය</5> කොටසේ <3>පියවර 1</3> වෙත <1>GitHub" +
                            "</1> සත්‍යාපකය එක් කරන්න."
                    },
                    heading: "GitHub පිවිසුම එක් කරන්න",
                    subHeading: "GitHub දැන් ඔබගේ යෙදුම් සඳහා පිවිසුම් විකල්පයක් ලෙස භාවිතා කිරීමට සූදානම්ය.",
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්‍රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට ගිතුබ් ප්‍රවේශය සැකසීමට අවශ්‍ය <1> යෙදුම </1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectDefaultConfig: {
                            content:
                                "<1> පුරනය වීමේ ක්‍රමය </1> ටැබය වෙත ගොස් <3> පෙරනිමි වින්‍යාස කිරීම සමඟ ආරම්භ කරන්න " +
                                "</3> මත ක්ලික් කරන්න.",
                            heading: "<1> පෙරනිමි වින්‍යාස කිරීම සමඟ ආරම්භ කරන්න </1> තෝරන්න"
                        }
                    }
                }
            },
            google: {
                quickStart: {
                    addLoginModal: {
                        heading: "ගූගල් පිවිසුම එක් කරන්න",
                        subHeading: "ගූගල් පිවිසුම සැකසීමට යෙදුමක් තෝරන්න."
                    },
                    connectApp: {
                        description:
                            "ඔබගේ <7>යෙදුමේ</7> <5>පුරනය වීමේ ක්‍රමය</5> කොටසේ <3>පියවර 1</3> වෙත <1>Google" +
                            "</1> සත්‍යාපකය එක් කරන්න."
                    },
                    heading: "Google පිවිසුම එක් කරන්න",
                    subHeading: "Google දැන් ඔබගේ යෙදුම් සඳහා පිවිසුම් විකල්පයක් ලෙස භාවිතා කිරීමට සූදානම්ය.",
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්‍රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට Google පුරනය සැකසීමට අවශ්‍ය <1> යෙදුම </1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectDefaultConfig: {
                            content:
                                "ගූගල් පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම සඳහා <1> පුරනය වීමේ ක්‍රමය </1> ටැබයට ගොස් <3> ගූගල් " +
                                "පිවිසුම එක් කරන්න </3> ක්ලික් කරන්න.",
                            heading: "<1> ගූගල් පිවිසුම එක් කරන්න </1> තෝරන්න"
                        }
                    }
                }
            },
            microsoft: {
                quickStart: {
                    addLoginModal: {
                        heading: "Microsoft Login එක් කරන්න",
                        subHeading: "Microsoft පිවිසුම සැකසීමට යෙදුමක් තෝරන්න.."
                    },
                    connectApp: {
                        description:
                            "ඔබගේ <7>යෙදුමෙහි</7> <5>පුරන ක්‍රමය</5> කොටසෙහි <3>පියවර 1</3>" +
                            "වෙත <1>Microsoft</1> සත්‍යාපකය එක් කරන්න."
                    },
                    heading: "Microsoft Login එක් කරන්න",
                    subHeading: "Microsoft දැන් ඔබගේ යෙදුම් සඳහා පිවිසුම් විකල්පයක් ලෙස භාවිතා කිරීමට සූදානම්ය",
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට Microsoft පිවිසුම පිහිටුවීමට අවශ්‍ය <1>යෙදුම</1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectDefaultConfig: {
                            content:
                                "<1>පුරන ක්‍රමය</1> ටැබය වෙත ගොස් <3>පෙරනිමි වින්‍යාසය සමඟ ආරම්භ කරන්න</3>" +
                                "ක්ලික් කරන්න.",
                            heading: "<1>පෙරනිමි වින්‍යාසය සමඟ ආරම්භ කරන්න</1> තෝරන්න"
                        }
                    }
                }
            },
            hypr: {
                quickStart: {
                    addLoginModal: {
                        heading: "HYPR Login එක් කරන්න",
                        subHeading: "HYPR පිවිසුම සැකසීමට යෙදුමක් තෝරන්න."
                    },
                    connectApp: {
                        description:
                            "ඔබගේ <7>යෙදුමෙහි</7> <5>පුරන ක්‍රමය</5> කොටසෙහි <3>පියවර 1</3>" +
                            "වෙත <1>HYPR</1> සත්‍යාපකය එක් කරන්න."
                    },
                    heading: "HYPR Login එක් කරන්න",
                    subHeading: "HYPR දැන් ඔබගේ යෙදුම් සඳහා පිවිසුම් විකල්පයක් ලෙස භාවිතා කිරීමට සූදානම්ය",
                    steps: {
                        configureLogin: {
                            heading: "පිවිසුම් ප්‍රවාහය වින්‍යාස කරන්න",
                            addHypr: "<1>සත්‍යාපනය එක් කරන්න</1> බොත්තම ක්ලික් කිරීමෙන් පියවර 1 වෙත HYPR සත්‍යාපනය එක් කරන්න.",
                            conditionalAuth:
                                "ටොගල් මාරු කිරීමෙන් <1>කොන්දේසි සහිත සත්‍යාපනය</1> ක්‍රියාත්මක කර " +
                                "පහත කොන්දේසි සහිත සත්‍යාපන ස්ක්‍රිප්ට් එක එක් කරන්න..",
                            update: "තහවුරු කිරීමට <1>යාවත්කාලීන කරන්න</1> ක්ලික් කරන්න."
                        },
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට HYPR පිවිසුම පිහිටුවීමට අවශ්‍ය <1>යෙදුම</1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectDefaultConfig: {
                            content:
                                "<1>පුරන ක්‍රමය</1> ටැබය වෙත ගොස් <3>පෙරනිමි වින්‍යාසය සමඟ ආරම්භ කරන්න</3>" +
                                "ක්ලික් කරන්න.",
                            heading: "<1>පෙරනිමි වින්‍යාසය සමඟ ආරම්භ කරන්න</1> තෝරන්න"
                        }
                    }
                }
            },
            siwe: {
                forms: {
                    authenticatorSettings: {
                        callbackUrl: {
                            hint: "ධාරක OIDC සේවාදායකය සඳහා වලංගු ලෙස දක්වා ඇති යළි-යොමුවීම් URI කට්ටලය.",
                            label: "අවසර දීමේ ආපසු ඇමතුම් URL",
                            placeholder: "අවසර දීමේ ආපසු ඇමතුම් URL ඇතුලත් කරන්න.",
                            validations: {
                                required: "අවසර දීමේ ආපසු ඇමතුම් URL යනු අවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        clientId: {
                            hint: "ඔබට <2>oidc.signinwithethereum.org</2> වෙතින් ලැබුණු <1>සේවාදායක හැඳුනුම්පත</1>" +
                                "ඔබේ OIDC සේවාදායකයා සඳහා.",
                            label: "සේවාලාභී හැඳුනුම්පත",
                            placeholder: "OIDC සේවාලාභියාගේ සේවාලාභී ID ඇතුළු කරන්න.",
                            validations: {
                                required: "සේවාලාභී හැඳුනුම්පත අවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        clientSecret: {
                            hint: "ඔබට ලැබුණු <1>සේවාදායක රහස</1> <2>oidc.signinwithethereum.org</2> " +
                                "ඔබේ OIDC සේවාදායකයා සඳහා.",
                            label: "පාරිභෝගික රහස",
                            placeholder: "OIDC සේවාලාභියාගේ සේවාලාභී රහස ඇතුළත් කරන්න.",
                            validations: {
                                required: "සේවාලාභී රහස යනු අවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        scopes: {
                            heading: "විෂය පථයන්",
                            hint: "සම්බන්ධිත යෙදුම් සඳහා දත්ත වෙත ප්‍රවේශ වීමට සපයා ඇති ප්‍රවේශ වර්ගය " +
                                "Ethereum wallet වෙතින්.",
                            list: {
                                openid: {
                                    description: "පරිශීලකයෙකුගේ විද්‍යුත් තැපෑල, ලිපින, දුරකථන ආදිය වෙත" +
                                        "කියවීමට ප්‍රවේශය ලබා දෙයි."
                                },
                                profile: {
                                    description: "පරිශීලකයෙකුගේ පැතිකඩ දත්ත කියවීමට ප්‍රවේශය ලබා දෙයි."
                                }
                            }
                        }
                    }
                },
                quickStart: {
                    addLoginModal: {
                        heading: "Ethereum සමඟ පුරනය එක් කරන්න",
                        subHeading: "Ethereum සමඟින් පුරනය වීම පිහිටුවීමට යෙදුමක් තෝරන්න."
                    },
                    connectApp: {
                        description:
                            "<3>පියවර 1</3> වෙත <1>Ethereum සමඟින් පුරනය වන්න</1> සත්‍යාපකය <5>පිවිසීම ක්‍රමයට" +
                            "එක් කරන්න </5> ඔබගේ <7>යෙදුමෙහි</7> කොටස."
                    },
                    heading: "Ethereum සමඟ පුරනය එක් කරන්න",
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට කිරීමට අවශ්‍ය <1>යෙදුම</1> තෝරන්න " +
                                "Ethereum සමඟින් පුරනය වීම සකසන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectDefaultConfig: {
                            content: "<1>පුරන ක්‍රමය</1> ටැබයට ගොස් <3>පෙරනිමියෙන් ආරම්භ කරන්න මත ක්ලික් කරන්න" +
                                "වින්‍යාසය</3>.",
                            heading: "<1>පෙරනිමි වින්‍යාසය සමඟ ආරම්භ කරන්න</1> තෝරන්න"
                        }
                    },
                    subHeading: "Ethereum සමඟින් පුරනය වීම දැන් ඔබගේ යෙදුම් සඳහා පිවිසුම් විකල්පයක් " +
                        "ලෙස භාවිතා කිරීමට සූදානම්ය."
                },
                wizardHelp: {
                    clientId: {
                        description: "ඔබට වෙතින් ලැබුණු <1>සේවාදායක හැඳුනුම්පත</1> සපයන්න" +
                            "<2>oidc.signinwithethereum.org</2> ඔබේ OIDC සේවාදායකයා සඳහා.",
                        heading: "සේවාලාභී හැඳුනුම්පත"
                    },
                    clientSecret: {
                        description: "ඔබට වෙතින් ලැබුණු <1>සේවාදායක රහස</1> සපයන්න" +
                            "<2>oidc.signinwithethereum.org</2> ඔබේ OIDC සේවාදායකයා සඳහා.",
                        heading: "පාරිභෝගික රහස"
                    },
                    heading: "උදව්",
                    name: {
                        connectionDescription: "සම්බන්ධතාවය සඳහා අද්විතීය නමක් ලබා දෙන්න.",
                        heading: "නම",
                        idpDescription: "අනන්‍යතා සපයන්නා සඳහා අද්විතීය නමක් සපයන්න."
                    },
                    preRequisites: {
                        clientRegistrationDocs: "OIDC සේවාලාභියා වින්‍යාස කිරීම පිළිබඳ මාර්ගෝපදේශය බලන්න.",
                        configureClient: "ඔබට ඉක්මනින් දේවල් ආරම්භ කිරීමට අවශ්‍ය නම්, සේවාදායකයා ලියාපදිංචි කිරීමට පහත <1>curl</1> විධානය භාවිතා කරන්න.",
                        configureRedirectURI: "පහත URL එක <1>යළි-යොමුවීම් URI</1> ලෙස සැකසිය යුතුය.",
                        getCredentials: "ඔබ ආරම්භ කිරීමට පෙර, <2>oidc.signinwithethereum.org</2> හි OIDC සේවාදායක ලියාපදිංචිය භාවිතයෙන් <1>OIDC සේවාලාභියෙකු</1> ලියාපදිංචි කර, <3>සේවාදායක හැඳුනුම්පතක් සහ රහසක්</3 ලබා ගන්න. >.",
                        heading: "පූර්ව අවශ්යතාව"
                    },
                    subHeading: "පහත මාර්ගෝපදේශය භාවිතා කරන්න"
                }
            },
            totp: {
                quickStart: {
                    addLoginModal: {
                        heading: "TOTP එකතු කරන්න",
                        subHeading: "TOTP පිවිසුම සැකසීමට යෙදුමක් තෝරන්න."
                    },
                    heading: "TOTP සැකසුම් මාර්ගෝපදේශය",
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට TOTP පිවිසුම සැකසීමට අවශ්‍ය <1>යෙදුම</1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectTOTP: {
                            content:
                                "මූලික TOTP ප්‍රවාහයක් වින්‍යාස කිරීම සඳහා <1> පුරනය වීමේ ක්‍රමය </1> ටැබයට ගොස් " +
                                "<3> දෙවන සාධකයක් ලෙස ඕටීපී එකතු කරන්න </3> මත ක්ලික් කරන්න.",
                            heading: "<1>දෙවන සාධකයක් ලෙස TOTP එකතු කරන්න</1> තෝරන්න "
                        }
                    },
                    subHeading: "ඔබේ පිවිසුම් ප්‍රවාහයේ සාධකයක් ලෙස TOTP සැකසීම සඳහා පහත දැක්වෙන උපදෙස් අනුගමනය කරන්න."
                }
            },
            fido: {
                quickStart: {
                    addLoginModal: {
                        heading: "මුර යතුර පිවිසුම එක් කරන්න",
                        subHeading: "මුර යතුර පිවිසුම සැකසීමට යෙදුමක් තෝරන්න."
                    },
                    heading: "මුර යතුර සැකසුම් මාර්ගෝපදේශය",
                    passkeys: {
                        docLinkText: "FIDO මුර යතුර",
                        content:
                            "මුර යතුරු ඔබගේ යෙදුම් සඳහා සරල සහ ආරක්ෂිත මුරපද රහිත සත්‍යාපන ක්‍රමයක් සපයන අතර එය " +
                            "උපාංග නැතිවීමෙන් ආරක්ශිත අතර ඕනෑම උපාංගයකට ක්‍රියා කරයි. " +
                            "ඔබට \"මුර යතුර\" සමඟ Asgardeo හි මුරපද සත්‍යාපනය උත්සාහ කළ හැක. ",
                        heading: "මුර යතුරු සමඟ FIDO සත්‍යාපනය"
                    },
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට මුර යතුර පිවිසුම සැකසීමට අවශ්‍ය <1>යෙදුම</1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectFIDO: {
                            content:
                                "මූලික මුර යතුර ප්‍රවාහයක් වින්‍යාස කිරීම සඳහා <1>පුරනය වීමේ ක්‍රමය</1> ටැබයට ගොස් " +
                                "<3>මුර යතුර පිවිසුම එක් කරන්න</3> මත ක්ලික් කරන්න.",
                            heading: "<1>මුර යතුර පිවිසුම එක් කරන්න</1> තෝරන්න"
                        },
                        configureParameters: {
                            heading: "මුර යතුර විකල්ප වින්‍යාස කරන්න",
                            content: {
                                parameters: {
                                    progressiveEnrollment: {
                                        description: "පුරනය වීමේදී මුර යතුර සඳහා ලියාපදිංචි වීමට පරිශීලකයින්ට ඉඩ දීමට මෙම විකල්පය සක්‍රිය කරන්න.",
                                        label: "ප්‍රගතිශීලී මුර යතුර ලියාපදිංචිය:",
                                        note: "මුරපදය <1>පළමු සාධක</1> විකල්පය ලෙස සකසා ඇති විට, පරිශීලකයන් " +
                                        "මුරපදය ඇතුළත් කිරීමට පෙර පරිශීලකයාගේ අනන්‍යතාවය තහවුරු කිරීමට <3>අනුවර්තන ස්ක්‍රිප්ට්</3> " +
                                        "එකක් එක් කිරීමට අවශ්‍ය වේ. ස්ක්‍රිප්ට් ඇතුළත් කිරීමට, පරිශීලකයින්ට <5>යෙදුමේ පුරනය වීමේ</5> " +
                                        "ක්‍රම පටිත්තෙහි ඇති <7>මුරපද ප්‍රගතිශීලී ලියාපදිංචි වීමේ අච්චුව</7> භාවිතා කළ හැක."
                                    },
                                    usernamelessAuthentication: {
                                        description: "මෙම විශේෂාංගය සක්‍රීය කිරීමෙන් පරිශීලකයින්ට පරිශීලක " +
                                        "නාමය ඇතුළත් නොකර මුරපදයක් සමඟින් පුරනය වීමට ඉඩ සලසයි, එය වඩාත් " +
                                        "විධිමත් පුරනය වීමේ අත්දැකීමක් නිර්මාණය කරයි.",
                                        label: "පරිශීලක නාම රහිත සත්‍යාපනය:"
                                    }
                                },
                                steps: {
                                    info: "වින්‍යාස කිරීමට, කරුණාකර පහත පියවර අනුගමනය කරන්න:",
                                    1: "<1>සම්බන්ධතා</1> ප්රදේශයට සංචාලනය කරන්න.",
                                    2: "<1>මුර යතුර</1> සම්බන්ධතාවය සොයාගෙන තෝරන්න.",
                                    3: "<1>සැකසීම්</1> ටැබය වෙත සංචාලනය කරන්න."
                                }
                            }
                        }
                    },
                    subHeading: "ඔබේ පිවිසුම් ප්‍රවාහයේ සාධකයක් ලෙස මුර යතුර සැකසීම සඳහා පහත දැක්වෙන උපදෙස් අනුගමනය කරන්න."
                }
            },
            magicLink: {
                quickStart: {
                    addLoginModal: {
                        heading: "මුරපද රහිත පිවිසුම එක් කරන්න",
                        subHeading: "මුරපද රහිත පිවිසුම පිහිටුවීමට යෙදුමක් තෝරන්න."
                    },
                    heading: "මැජික් ලින්ක් සැකසුම් මාර්ගෝපදේශය",
                    steps: {
                        customizeFlow: {
                            content: "අවශ්‍ය පරිදි පිවිසුම් ප්‍රවාහය වින්‍යාස කිරීම දිගටම කරගෙන යන්න.",
                            heading: "ප්රවාහය අභිරුචිකරණය කරන්න"
                        },
                        selectApplication: {
                            content: "ඔබට මුරපද රහිත පිවිසුම පිහිටුවීමට අවශ්‍ය <1>යෙදුම</1> තෝරන්න.",
                            heading: "යෙදුම තෝරන්න"
                        },
                        selectMagicLink: {
                            content:
                                "<1>පුරන ක්‍රමය</1> ටැබයට ගොස් <3>මුරපද රහිත පිවිසුම එක් කරන්න ක්ලික් කරන්න" +
                                "</3> මූලික Magic Link ප්‍රවාහයක් වින්‍යාස කිරීමට.",
                            heading: "<1>මුරපද රහිත පිවිසුම එකතු කරන්න</1> තෝරන්න"
                        }
                    },
                    subHeading: "ඔබගේ පිවිසුම් ප්‍රවාහයේ මුරපද රහිත පිවිසුම පිහිටුවීමට පහත දක්වා ඇති උපදෙස් අනුගමනය කරන්න."
                }
            }
        },
        monitor: {
            filter: {
                advancedSearch: {
                    attributes: {
                        placeholder: "උදා., actionId, traceId ආදිය"
                    },
                    fields: {
                        value: {
                            placeholder: "උදා., validate-token, access_token ආදිය"
                        }
                    },
                    buttons: {
                        submit: {
                            label: "ෆිල්ටර් එක් කරන්න"
                        }
                    },
                    title: "උසස් සෙවීම"
                },
                dropdowns: {
                    timeRange: {
                        custom: {
                            labels: {
                                from: "සිට",
                                timeZone: "කාල කලාපය තෝරන්න",
                                to: "වෙත"
                            }
                        },
                        texts: {
                            0: "අවසන් මිනිත්තු 15",
                            1: "අවසන් මිනිත්තු 30",
                            2: "අවසන් පැය",
                            3: "අවසන් පැය 4",
                            4: "අවසන් පැය 12",
                            5: "අවසන් පැය 24",
                            6: "අවසන් පැය 48",
                            7: "පසුගිය දින 3",
                            8: "පසුගිය දින 7",
                            9: "අභිමත කාල පරාසය"
                        }
                    },
                    timeZone: {
                        placeholder: "කාල කලාපය තෝරන්න"
                    }
                },
                topToolbar: {
                    buttons: {
                        addFilter: {
                            label: "ෆිල්ටර් එක් කරන්න"
                        },
                        clearFilters: {
                            label: "සියලුම ෆිල්ටර් ඉවත් කරන්න"
                        }
                    }
                },
                searchBar: {
                    placeholderDiagnostic: "ට්‍රේස් හැඳුනුම්පත, ක්‍රියා හැඳුනුම්පත, සේවාලාභී හැඳුනුම්පත, ප්‍රතිඵල පණිවිඩය හෝ ප්‍රතිඵල තත්ත්වය අනුව ලොග් සොයන්න",
                    placeholderAudit : "ක්‍රියාව, ඉලක්ක හැඳුනුම්පත, ආරම්භක හැඳුනුම්පත, ඉල්ලීම් හැඳුනුම්පත අනුව ලොග සොයන්න"
                },
                refreshMessage: {
                    text: "අවසන් වරට ලොග ලබා ගත්තේ ",
                    tooltipText: "අලුතින් ජනනය කරන ලද ලොග සෙවුම් ප්‍රතිඵලවලට ඇතුළත් කිරීමට මිනිත්තු කිහිපයක් ගතවනු ඇත."
                },
                refreshButton: {
                    label: "නැවත ලොග ලබා ගන්න"
                },
                queryButton: {
                    label: "ලොග ලබා ගන්න"
                },
                downloadButton : {
                    label : "ලොග් දත්ත බාගන්න"
                },
                delayMessage: {
                    text: "සමහර විමසුම් පූරණය වීමට වැඩි කාලයක් ගත විය හැක."
                }
            },
            logView: {
                toolTips: {
                    seeMore: "වැඩි විස්තර බලන්න"
                }
            },
            notifications: {
                genericError: {
                    subtitle: {
                        0: "ලොග ලබා ගැනීමට නොහැකි විය.",
                        1: "කරුණාකර නැවත උත්සාහ කරන්න."
                    },
                    title: "යමක් වැරදී ඇත"
                },
                emptyFilterResult: {
                    actionLabel: "සියලුම ෆිල්ටර් හිස් කරන්න",
                    subtitle: {
                        0: "අපට ප්‍රතිඵල කිසිවක් සොයාගත නොහැකි විය.",
                        1: "කරුණාකර වෙනත් ෆිල්ටර් එක් කිරීමට උත්සාහ කරන්න."
                    },
                    title: "ප්‍රතිඵල කිසිවක් හමු නොවීය"
                },
                emptySearchResult: {
                    actionLabel: "සෙවුම් විමසුම මකන්න",
                    subtitle: {
                        0: "මෙම සෙවුම් විමසුම සඳහා අපට ප්‍රතිඵල කිසිවක් සොයාගත නොහැකි විය.",
                        1: "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න."
                    },
                    title: "ප්‍රතිඵල කිසිවක් හමු නොවීය"
                },
                emptyResponse: {
                    subtitle: {
                        0: "අපට කිසිදු ලොගයක් සොයා ගැනීමට නොහැකි විය ",
                        1: "කරුණාකර වෙනස් කාල පරාසයක් උත්සාහ කරන්න."
                    },
                    title: "ලොග් නොමැත"
                }
            },
            pageHeader: {
                description: "ගැටළු නිරාකරණය කිරීමට සහ සම්පත් ක්‍රියාකාරකම් නිරීක්ෂණය කිරීමට ඔබගේ ලඝු-සටහන් විමසන්න.",
                title: "ලොග්"
            },
            tooltips: {
                copy: "ක්ලිප් පුවරුවට පිටපත් කරන්න"
            }
        },
        sidePanel: {
            apiResources: "API සම්පත්",
            branding: "වෙළඳ නාමකරණය",
            stylesAndText: "මෝස්තර සහ පෙළ",
            monitor: "සටහන්",
            categories: {
                apiResources: "API සම්පත්",
                branding: "වෙළඳ නාමකරණය",
                emailProvider: "ඊමේල් සපයන්නා",
                smsProvider: "SMS සපයන්නා",
                monitor: "සටහන්"
            },
            emailProvider: "ඊමේල් සපයන්නා",
            smsProvider: "SMS සපයන්නා",
            eventPublishing :"සිද්ධීන්",
            emailTemplates : "ඊමේල් සැකිලි",
            organizationInfo: "සංවිධානය තොරතුරු"
        },
        eventPublishing: {
            eventsConfiguration: {
                heading: "සිදුවීම් වින්‍යාස කරන්න",
                subHeading:  "Asgardeo හට විවිධ පරිශීලක අන්තර්ක්‍රියා මත පදනම්ව Choreo වෙත සිදුවීම් ප්‍රකාශ කළ හැක. අභිරුචි භාවිත අවස්ථා අවුලුවාලීමට ඔබට ප්‍රකාශිත සිදුවීම් භාවිත කළ හැක.",
                formHeading: "ඔබට Choreo වෙත ප්‍රකාශනය කිරීමට අවශ්‍ය සිදුවීම් තෝරන්න.",
                form : {
                    updateButton: "Update"
                },
                navigateToChoreo: {
                    description: "ප්‍රකාශිත සිදුවීම් පරිභෝජනය කිරීමට ඔබේ Choreo නිවැසියා වෙත සංචාලනය කරන්න.",
                    navigateButton: "Choreo වෙත යන්න"
                }
            },
            notifications : {
                updateConfiguration : {
                    error : {
                        generic: {
                            description : "සිදුවීම් වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇති විය.",
                            message : "යම්කිසි වරදක් සිදුවි ඇත"
                        },
                        activeSubs: {
                            description: "සිදුවීම් වර්ගයක් අක්‍රිය කිරීමට පෙර ක්‍රියාකාරී ග්‍රාහකයින් නොමැති බවට වග බලා ගන්න." ,
                            message: "යම්කිසි වරදක් සිදුවි ඇත"
                        }
                    },
                    success : {
                        description : " සිදුවීම් වින්‍යාස කිරීම් සාර්ථකව යාවත්කාලීන කරන ලදී.",
                        message : "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                getConfiguration : {
                    error : {
                        description : "සිදුවීම් වින්‍යාසයන් ලබා ගැනීමේදී දෝෂයක් ඇති විය.",
                        message :  "ලබා ගැනීමේ දෝෂය"
                    },
                    success : {
                        description : "",
                        message : ""
                    }
                }
            }
        },
        emailTemplates: {
            page: {
                header: "ඊමේල් සැකිලි",
                description: "ඔබේ සංවිධානයේ භාවිතා කරන ඊමේල් සැකිලි අභිරුචිකරණය කරන්න."
            },
            tabs: {
                content: {
                    label: "අන්තර්ගතය"
                },
                preview: {
                    label: "පෙරදසුන"
                }
            },
            notifications: {
                getEmailTemplateList: {
                    error: {
                        description: "ඊමේල් සැකිලි ලැයිස්තුව ලබා ගැනීමේදී දෝෂයක් ඇති විය.",
                        message: "ඊමේල් සැකිලි ලැයිස්තුව ලබා ගැනීමේදී දෝෂයක් ඇති විය"
                    }
                },
                getEmailTemplate: {
                    error: {
                        description: "ඊමේල් සැකිල්ල ලබා ගැනීමේදී දෝෂයක් ඇති විය.",
                        message: "ඊමේල් සැකිල්ල ලබා ගැනීමේ දෝෂයකි."
                    }
                },
                updateEmailTemplate: {
                    success: {
                        description: "විද්‍යුත් තැපැල් සැකිල්ල සාර්ථකව යාවත්කාලීන කරන ලදී",
                        message: "විද්‍යුත් තැපැල් සැකිල්ල සාර්ථකව යාවත්කාලීන කරන ලදී"
                    },
                    error: {
                        description: "ඊමේල් සැකිල්ල යාවත්කාලීන කිරීමේදී දෝෂයකි. ඔබ අවශ්‍ය සියලුම ක්ෂේත්‍ර පුරවා ඇති බවට වග බලා ගෙන නැවත උත්සාහ කරන්න",
                        message: "ඊමේල් සැකිල්ල යාවත්කාලීන කිරීමේදී දෝෂයකි"
                    }
                },
                deleteEmailTemplate: {
                    success: {
                        description: "විද්‍යුත් තැපැල් අච්චුව සාර්ථකව මකා ඇත",
                        message: "විද්‍යුත් තැපැල් අච්චුව සාර්ථකව මකා ඇත"
                    },
                    error: {
                        description: "ඊමේල් අච්චුව මකා දැමීමේදී දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න",
                        message: "ඊමේල් අච්චුව මකා දැමීමේදී දෝෂයකි"
                    }
                }
            },
            form: {
                inputs: {
                    template: {
                        label: "ඊමේල් සැකිල්ල",
                        placeholder: "ඊමේල් සැකිල්ල තෝරන්න",
                        hint: "ඊමේල් සැකිල්ල තෝරන්න"
                    },
                    locale: {
                        label: "දේශීය",
                        placeholder: "දේශීය තෝරන්න"
                    },
                    subject: {
                        label: "විෂය",
                        placeholder: "ඊමේල් විෂය ඇතුලත් කරන්න",
                        hint: "මෙය විද්‍යුත් තැපැල් සැකිල්ලේ විෂය ලෙස භාවිත කෙරෙන අතර පරිශීලකයාට දෘශ්‍යමාන වනු ඇත."
                    },
                    body: {
                        label: "විද්‍යුත් තැපැල් ශරීරය (HTML)",
                        hint: "ඔබට විද්‍යුත් තැපෑල සඳහා ලබා ගත හැකි ඕනෑම වචන තැන් දරණ ඇතුළත් කළ හැක."
                    },
                    footer: {
                        label: "පාදකය",
                        placeholder: "ඊමේල් පාදකය ඇතුළු කරන්න",
                        hint: "මෙය විද්‍යුත් තැපැල් සැකිල්ලේ පාදකය ලෙස භාවිත කෙරෙන අතර පරිශීලකයාට දෘශ්‍යමාන වේ."
                    }
                }
            },
            modal: {
                replicateContent: {
                    header: "අන්තර්ගතය අනුකරණය කරන්නද?",
                    message: "ඔබට මෙම පෙදෙසිය සඳහා කිසිදු අන්තර්ගතයක් නොමැති බව පෙනේ. ඉක්මන් ආරම්භයක් ලෙස ඔබට පෙර පෙදෙසියේ අන්තර්ගතය මෙහි පුරවා ගැනීමට අවශ්‍යද?"
                }
            },
            dangerZone: {
                heading: "සැකිල්ල ඉවත් කරන්න",
                message: "මෙම ක්‍රියාව මඟින් තෝරාගත් අච්චුව ඉවත් කරන අතර ඔබ මෙම අච්චුවට කර ඇති වෙනස්කමක් ඔබට අහිමි වනු ඇත.",
                action: "සැකිල්ල ඉවත් කරන්න",
                actionDisabledHint: "ඔබට පෙරනිමි පෙදෙසිය සමඟ අච්චුවක් මකා දැමිය නොහැක."
            }
        }
    },
    manage: {
        accountLogin: {
            notifications: {
                success: {
                    description: "පරිශීලක නාම වලංගුකරණ වින්‍යාසය සාර්ථකව යාවත්කාලීන කරන ලදී.",
                    message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                },
                error: {
                    description: "{{description}}",
                    message: "නැවත ලබා ගැනීමේ දෝෂය"
                },
                genericError: {
                    description: "මගේ ගිණුම් ද්වාර දත්ත ලබා ගැනීමට නොහැකි විය.",
                    message: "මොකක්හරි වැරැද්දක් වෙලා"
                }
            },
            validationError: {
                minMaxMismatch: "අවම දිග උපරිම දිගට වඩා අඩු විය යුතුය.",
                minLimitError: "අවම දිග 3 ට වඩා අඩු විය නොහැක.",
                maxLimitError: "උපරිම දිග 50 ට වඩා වැඩි විය නොහැක.",
                wrongCombination: "සංයෝජනයට අවසර නැත."
            },
            editPage: {
                pageTitle: "පරිශීලක නාමය වලංගු කිරීම",
                description: "පරිශීලක නාම වර්ගය යාවත්කාලීන කර ඔබේ පරිශීලකයින් සඳහා පරිශීලක නාම වලංගු කිරීමේ රීති අභිරුචිකරණය කරන්න.",
                usernameType: "පරිශීලක නාම වර්ගය තෝරන්න",
                usernameTypeHint: "පරිශීලක නාමය සඳහා විද්‍යුත් තැපෑලක් හෝ අක්ෂර එකතුවක් සැකසීමට පරිශීලකයින්ට ඉඩ දෙන්න.",
                emailType: "විද්යුත් තැපෑල",
                customType: "අභිරුචි",
                usernameLength: {
                    0: "අක්ෂර",
                    1: "සහ",
                    2: "අතර විය යුතුය."
                },
                usernameAlphanumeric: "අක්ෂරාංක වලට සීමා කරන්න (a-z, A-Z, 0-9).",
                usernameSpecialCharsHint: "අකුරු (a-z, A-Z), අංක (0-9) සහ පහත දැක්වෙන අක්ෂරවල ඕනෑම සංයෝජනයක්: !@#$%&'*+\\=?^_.{|}~-."
            },
            alternativeLoginIdentifierPage: {
                pageTitle: "විකල්ප පිවිසුම් හඳුනාගැනීම්",
                description: "විකල්ප පිවිසුම් හඳුනාගැනීම් වින්‍යාස කරන්න සහ පරිශීලක නාමය හෝ වින්‍යාස කළ පිවිසුම් හඳුනාගැනීම් භාවිතා කිරීමට" +
                    " පරිශීලකයින්ට ඉඩ දෙන්න ලොගින් සහ ප්‍රතිසාධන ප්‍රවාහයේදී.",
                loginIdentifierTypes: "පිවිසුම් හැඳුනුම්කාරකය තෝරන්න",
                loginIdentifierTypesHint: "පිවිසුම් ප්‍රවාහයේ පරිශීලක නාමය හෝ වින්‍යාස කළ පිවිසුම් හඳුනාගැනීම භාවිතා කිරීමට පරිශීලකයින්ට" +
                    " ඉඩ දෙන්න.",
                warning: "ව්‍යාපාරික පරිශීලකයින්ට පිවිසුම් ප්‍රවාහ, ප්‍රතිසාධන ප්‍රවාහ යනාදී පරිශීලක නාමය සඳහා විකල්පයක් ලෙස තෝරාගත් ඕනෑම පිවිසුම්" +
                    " හඳුනාගැනීම් භාවිතා කළ හැකිය.",
                info: "ඔබ එය මූලික පිවිසුම් හැඳුනුම්කාරකය බවට පත් කරන පරිශීලක නාම වර්ගය ලෙස විද්‍යුත් තැපෑල තෝරාගෙන ඇත.",
                notification: {
                    error: {
                        description: "විකල්ප පිවිසුම් හඳුනාගැනීමේ වින්‍යාසය යාවත්කාලීන කිරීමේ දෝෂයකි.",
                        message: "වින්‍යාසය යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    success: {
                        description: "විකල්ප පිවිසුම් හඳුනාගැනීමේ වින්‍යාසය සාර්ථකව යාවත්කාලීන කරන ලදී.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                claimUpdateNotification: {
                    error: {
                        description: "ගුණාංගය අද්විතීය උපලක්ෂණයක් ලෙස යාවත්කාලීන කිරීමේ දෝෂයකි. කරුණාකර නැවත උත්සාහ කරන්න.",
                        message: "හිමිකම් පෑම යාවත්කාලීන කිරීමේ දෝෂයකි"
                    }
                }
            },
            pageTitle: "ගිණුමට පිවිසීම",
            description: "ඔබේ සංවිධානයේ පරිශීලකයින්ගේ ගිණුම් පිවිසුම් වින්‍යාසයන් අභිරුචිකරණය කරන්න.",
            goBackToApplication: "යෙදුම් වෙත ආපසු යන්න",
            goBackToAccountLogin: "ගිණුම් ලොගින් වෙත ආපසු යන්න"
        },
        attributes: {
            attributes: {
                description: "ගුණාංග බලන්න සහ කළමනාකරණය කරන්න"
            },
            displayNameHint:
                "ගුණාංගය හඳුනා ගැනීම සඳහා දර්ශන නාමය පරිශීලක පැතිකඩෙහි භාවිතා කරනු ඇත, " +
                "එබැවින් එය තෝරාගැනීමේදී සිහියෙන් සිටින්න.",
            generatedAttributeMapping: {
                title: "කෙටුම්පත් සිතියම්කරණය",
                OIDCProtocol: "OpenID Connect",
                SCIMProtocol: "SCIM 2.0",
                description:
                    "අපි ඔබ වෙනුවෙන් ක්‍රියාවලිය සරල කරන අතර පහත සඳහන් ප්‍රොටෝකෝල සඳහා අවශ්‍ය සිතියම් එකතු කරමු."
            }
        },
        features: {
            header: {
                links: {
                    billingPortalNav: "බිල්පත් ද්වාරය"
                }
            },
            tenant: {
                header: {
                    tenantSwitchHeader: "සංවිධානය මාරු කරන්න",
                    tenantAddHeader: "නව සංවිධානය",
                    tenantDefaultButton: "පෙරනිමිය",
                    tenantMakeDefaultButton: "පෙරනිමිය කරන්න",
                    makeDefaultOrganization: "සංවිධානය පෙරනිමිය කරන්න",
                    backButton: "ආපසු යන්න",
                    copyOrganizationId: "සංවිධාන හැඳුනුම්පත පිටපත් කරන්න",
                    copied: "පිටපත් කරන ලදි!",
                    tenantSearch: {
                        placeholder: "සංවිධානය සොයන්න",
                        emptyResultMessage: "කිසිදු සංවිධානයක් හමු නොවීය"
                    }
                },
                wizards: {
                    addTenant: {
                        heading: "නව සංවිධානයක් එක් කරන්න",
                        forms: {
                            fields: {
                                tenantName: {
                                    label: "සංවිධානයේ නම",
                                    placeholder: "සංවිධානයේ නම (E.g., myorg)",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි.",
                                        duplicate:
                                            "{{ tenantName }} යන නම සහිත සංවිධානයක් දැනටමත් පවතී. කරුණාකර" +
                                            " වෙනත් නමක් උත්සාහ කරන්න.",
                                        invalid: "කරුණාකර සංවිධානයේ නම සඳහා වලංගු ආකෘතියක් ඇතුළත් කරන්න. එය කල යුතු" +
                                            "<1><0>අද්විතීය වීමට</0><1>වඩා අඩංගු වේ {{ minLength }} සහ වඩා අඩු" +
                                            " {{ maxLength }} චරිත</1><2>කුඩා අකුරින් පමණක් සමන්විත වේ" +
                                            " අක්ෂරාංක අක්ෂර</2><3>අකාරාදී අක්ෂරයකින් ආරම්භ කරන්න</3>" +
                                            "</1>",
                                        invalidLength: "ඔබ ඇතුළු කළ නම අඩුයි {{ minLength }}" +
                                            " චරිත. එය විය යුතුය" +
                                            "<3><0>අද්විතීය වන්න</0><1>වඩා අඩංගු වේ {{ minLength }} සහ වඩා අඩු" +
                                            " {{ maxLength }} චරිත</1><2>කුඩා අකුරින් පමණක් සමන්විත වේ" +
                                            " අක්ෂරාංක අක්ෂර</2><3>අකාරාදී අක්ෂරයකින් ආරම්භ කරන්න</3>" +
                                            "</3s>"
                                    }
                                }
                            },
                            loaderMessages: {
                                duplicateCheck: "නව සංවිධානයේ නම වලංගු කිරීම...",
                                tenantCreate: "නව සංවිධානය නිර්මාණය කිරීම...",
                                tenantSwitch: "අපි ඔබව නව සංවිධානය වෙත හරවා යවන තෙක් කරුණාකර රැඳී සිටින්න..."
                            },
                            messages: {
                                info:
                                    "ඔබගේ නව Asgardeo වැඩබිම සඳහා හොඳ, අද්විතීය සංවිධාන නාමයක් ගැන සිතන්න ඔබට" +
                                    " පසුව එය වෙනස් කිරීමට නොහැකි වනු ඇත!"
                            }
                        },
                        tooltips: {
                            message: "නව සංවිධානයට ප්‍රවේශ වීමට ඔබ මෙම URL භාවිතා කරනු ඇත."
                        }
                    }
                },
                tenantCreationPrompt: {
                    heading: "නව සංවිධානයක් සාදන්න",
                    subHeading1: "ඔබ Asgardeo වෙත පිවිසෙන්න ",
                    subHeading2: "පුරන්න",
                    subHeading3: "සඳහා ",
                    subHeading4: "ඉදිරියට යාමට, ඔබේ පළමු සංවිධානය සාදන්න.",
                    subHeading5: "විකල්පයක් ලෙස, ",
                    subHeading6: "දක්වා",
                    subHeading7: "කලාපයේ."
                },
                notifications: {
                    addTenant: {
                        error: {
                            description: "{{ description }}",
                            message: "සංවිධානය නිර්මාණය කිරීමේදී දෝෂයකි"
                        },
                        genericError: {
                            description: "සංවිධානය නිර්මාණය කිරීමේදී දෝෂයක් ඇතිවිය.",
                            message: "සංවිධානය නිර්මාණය කිරීමේදී දෝෂයකි"
                        },
                        limitReachError: {
                            description: "අවසර ලත් සංවිධාන ගණනට ළඟා වී ඇත.",
                            message: "සංවිධානය නිර්මාණය කිරීමේදී දෝෂයකි"
                        },
                        success: {
                            description: "{{ tenantName }} සංවිධානය සාර්ථකව නිර්මාණය කරන ලදි.",
                            message: "සංවිධානය නිර්මාණය කරන ලදි"
                        }
                    },
                    defaultTenant: {
                        genericError: {
                            description: "ඔබගේ සුපුරුදු සංවිධානය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                            message: "සංවිධානය යාවත්කාලීන කිරීමේ දෝෂයකි"
                        },
                        success: {
                            description: "ඔබේ පෙරනිමි සංවිධානය වන {{ tenantName }} සාර්ථකව සකසන්න.",
                            message: "යාවත්කාලීන කළ පෙරනිමි සංවිධානය"
                        }
                    },
                    missingClaims: {
                        message: "සමහර පුද්ගලික තොරතුරු අස්ථානගත වී ඇත",
                        description:
                            "කරුණාකර MyAccount යෙදුමට පිවිස ඔබේ පළමු නම, අවසාන නම සහ ප්‍රාථමික විද්‍යුත්" +
                            " ලිපිනය පුද්ගලික තොරතුරු අංශයේ සකසා ඇති බවට වග බලා ගන්න."
                    },
                    getTenants: {
                        message: "ඔබේ සංවිධාන නැවත ලබා ගත නොහැක",
                        description: "ඔබේ සංවිධාන ලබා ගැනීමේදී දෝෂයක් ඇතිවිය."
                    }
                }
            },
            user: {
                addUser: {
                    close: "වසන්න",
                    invite: "ආරාධනා කරන්න",
                    finish: "අවසන් කරන්න",
                    add: "එකතු කරන්න",
                    inputLabel: {
                        alphanumericUsername: "පරිශීලක නාමය",
                        alphanumericUsernamePlaceholder: "පරිශීලක නාමය ඇතුළත් කරන්න",
                        emailUsername: "පරිශීලක නාමය (ඊමේල්)"
                    },
                    inviteUserTooltip:
                        "පරිශීලකයාට තමන්ගේම මුරපදයක් සැකසීමට සපයා ඇති විද්‍යුත් තැපැල් ලිපිනයට තහවුරු කිරීමේ සබැඳියක් සහිත විද්‍යුත් තැපෑලක් යවනු ලැබේ.",
                    inviteUserOfflineTooltip: "පරිශීලකයා සමඟ බෙදා ගැනීමට අවසාන පියවරේදී ඔබට ආරාධනා සබැඳිය හෝ ආරාධනය පිටපත් කළ හැක.",
                    inviteLink: {
                        error: {
                            description: "ආරාධනාව ලබා ගැනීමට නොහැකි විය",
                            message: "ආරාධනා සබැඳිය ලබා ගැනීමේදී දෝෂයක් ඇති විය."
                        },
                        genericError: {
                            description: "ආරාධනා සාරාංශය ලබා ගැනීමේ දෝෂයකි",
                            message: "සාරාංශය උත්පාදනය කිරීමේදී දෝෂයක් ඇති විය."
                        }
                    },
                    summary: {
                        invitation: "ආරාධනය",
                        invitationBody: {
                            accountHasBeenCreated: "{{ username }} පරිශීලක නාමය සඳහා ගිණුමක් නිර්මාණය කර ඇත," +
                                " {{ tenantname }} සංවිධානයේ.",
                            hi: "ආයුබෝවන්,",
                            pleaseFollowTheLink: "මුරපදය සැකසීමට කරුණාකර පහත සබැඳිය අනුගමනය කරන්න.",
                            team: "{{ tenantname }} කණ්ඩායම",
                            thanks: "ස්තුතියි"
                        },
                        invitationBodyCopy: {
                            accountHasBeenCreated: "$username පරිශීලක නාමය සඳහා ගිණුමක් නිර්මාණය කර ඇත," +
                                " $tenantname සංවිධානයේ.",
                            team: "$tenantname කණ්ඩායම"
                        },
                        invitationPasswordBody: {
                            accountHasBeenCreated: "{{ tenantname }} සංවිධානයේ ගිණුමක් නිර්මාණය කර ඇත." +
                                " ඔබගේ අක්තපත්‍ර පහත පරිදි වේ.",
                            myAccountLink: "මගේ ගිණුම් URL එක",
                            pleaseFollowTheLink: "පහත සබැඳිය අනුගමනය කිරීමෙන් ඔබගේ ගිණුමට පුරනය වීමට අක්තපත්‍ර භාවිතා කරන්න."
                        },
                        invitationPasswordBodyCopy: {
                            accountHasBeenCreated: "$tenantname සංවිධානයේ ගිණුමක් නිර්මාණය කර ඇත." +
                                " ඔබගේ අක්තපත්‍ර පහත පරිදි වේ."
                        },
                        invitationLink: "ආරාධනා සබැඳිය",
                        inviteWarningMessage: "ඔබ ඉදිරියට යාමට පෙර ආරාධනා සබැඳිය හෝ ආරාධනාව පිටපත් " +
                            "කිරීමට වග බලා ගන්න. ඔබ ඉදිරියට යාමට පෙර ආරාධනා සබැඳිය හෝ ආරාධනාව පිටපත් " +
                            "කිරීමට වග බලා ගන්න.",
                        password: "මුරපදය",
                        passwordWarningMessage: "ඔබ ඉදිරියට යාමට පෙර මුරපදය හෝ ආරාධනාව පිටපත් කිරීමට වග බලා ගන්න." +
                            " ඔබ ඔවුන්ව නැවත දකින්නේ නැහැ!",
                        username: "පරිශීලක නාමය"
                    },
                    validation: {
                        password:
                            "ඔබගේ මුරපදයේ අවම වශයෙන් එක් ලොකු අකුරක්, කුඩා අකුරක් සහ එක් අංකයක් ඇතුළුව අවම වශයෙන් " +
                            "අක්ෂර 8ක් අඩංගු විය යුතුය.",
                        passwordCase: "අවම වශයෙන් {{minUpperCase}} ලොකු අකුරු සහ {{minLowerCase}} කුඩා අකුරු",
                        upperCase: "අවම වශයෙන් {{minUpperCase}} ලොකු අකුරු(ය)",
                        lowerCase: "අවම වශයෙන් {{minLowerCase}} කුඩා අකුරු(ය)",
                        passwordLength: "අක්ෂර {{min}} සහ {{max}} අතර විය යුතුය",
                        passwordNumeric: "අවම වශයෙන් {{min}} අංකය(ය)",
                        specialCharacter: "අවම වශයෙන් {{specialChr}} විශේෂ අක්ෂර(ය)",
                        uniqueCharacters: "අවම වශයෙන් {{uniqueChr}} අනන්‍ය අක්ෂර(ය)",
                        consecutiveCharacters: "පුනරාවර්තන අක්ෂර(ය) {{repeatedChr}} ට වඩා වැඩි නොවේ",
                        error: {
                            passwordValidation: "මුරපදය පහත සීමාවන් සපුරාලිය යුතුය."
                        },
                        usernameHint: "අවම වශයෙන් එක් අකුරක් ඇතුළුව අක්ෂර {{minLength}} සිට {{maxLength}} දක්වා අක්ෂරාංක (a-z, A-Z, 0-9) තන්තුවක් විය යුතුය.",
                        usernameSpecialCharHint: "අවම වශයෙන් එක් අකුරක් ඇතුළුව අක්ෂර {{minLength}} සිට {{maxLength}} දක්වා දිගු " +
                            "විය යුතු අතර, පහත දැක්වෙන අක්ෂරවල එකතුවක් අඩංගු විය හැක: a-z, A-Z, 0-9, !@#$%&'*+\\=?^_.{|}~-.",
                        usernameLength: "පරිශීලක නාමයේ දිග {{minLength}} සහ {{maxLength}} අතර විය යුතුය.",
                        usernameSymbols: "පරිශීලක නාමය අක්ෂරාංක අක්ෂරවලින් (a-z, A-Z, 0-9) සමන්විත විය යුතු අතර අවම වශයෙන් එක් අකුරක් ඇතුළත් විය යුතුය.",
                        usernameSpecialCharSymbols: "කරුණාකර ලබා දී ඇති මාර්ගෝපදේශවලට අනුකූල වන වලංගු පරිශීලක නාමයක් තෝරන්න."
                    }
                }
            },
            userStores: {
                configs: {
                    addUserStores: {
                        actionTitle: "පරිශීලක ගබඩාව සම්බන්ධ කරන්න",
                        subTitle: "දැනට සම්බන්ධිත දුරස්ථ පරිශීලක වෙළඳසැල් නොමැත. නව පරිශීලක ගබඩාවක් සම්බන්ධ " +
                            "කර දුරස්ථ පරිශීලක ගිණුම් Asgardeo වෙත සම්බන්ධ කරන්න.",
                        title: "නව පරිශීලක ගබඩාවක් සම්බන්ධ කරන්න"
                    }
                },
                create: {
                    pageLayout: {
                        actions: {
                            connectUserStore: "පරිශීලක ගබඩාව සම්බන්ධ කරන්න"
                        },
                        description: "Asgardeo වෙත ඔබගේ දුරස්ථ පරිශීලක ගබඩාවේ සිටින පරිශීලකයින් ඇතුල් කරන්න.",
                        title: "දුරස්ථ පරිශීලක වෙළඳසැල",
                        steps: {
                            attributeMappings: {
                                subTitle: "පරිශීලක නාමය සහ පරිශීලක හැඳුනුම්පත සඳහා on-prem පරිශීලක ගබඩාවේ නිර්වචනය කර ඇති " +
                                    "ගුණාංග සිතියම්ගත කරන්න, එවිට ඔබ සම්බන්ධ කරන on-prem පරිශීලක ගබඩාවේ පරිශීලකයින්ට කිසිදු " +
                                    "ගැටළුවක් නොමැතිව යෙදුම්වලට ලොග් විය හැක.",
                                title: "සිතියම් ගුණාංග",
                                usernameHint: "පරිශීලක නාමය සඳහා සිතියම්ගත කළ ගුණාංගය <1> අද්විතීය </1> විය යුතු " +
                                    "අතර <3> {{ usernameType }} </3> වර්ගය විය යුතුය. පරිශීලක නාමය පරිශීලකයාගේ මූලික " +
                                    "හැඳුනුම්කාරකය වන බැවින් මෙම ක්ෂේත්‍රය හිස් විය නොහැක.",
                                emailUsername: "විද්යුත් තැපෑල",
                                alphanumericUsername: "අක්ෂරාංක පරිශීලක නාමය"
                            },
                            generalSettings: {
                                form: {
                                    fields: {
                                        name: {
                                            hint: "මෙය ඔබ සම්බන්ධ කරන දුරස්ථ පරිශීලක ගබඩාවේ නම ලෙස දිස්වනු ඇත.",
                                            label: "නම",
                                            placeholder: "පරිශීලක ගබඩාවේ නම ඇතුළත් කරන්න",
                                            requiredErrorMessage: "මෙම ක්ෂේත්රය හිස්ව තිබිය නොහැක, මෙය පරිශීලක ගබඩාවේ " +
                                                "අද්විතීය හඳුනාගැනීමක් වන බැවින්"
                                        },
                                        description: {
                                            label: "විස්තරය",
                                            placeholder: "පරිශීලක ගබඩාවේ විස්තරය ඇතුළත් කරන්න"
                                        },
                                        userStoreType: {
                                            label: "දුරස්ථ පරිශීලක ගබඩා වර්ගය",
                                            message: "ඔබට මෙම පරිශීලක ගබඩාවට පමණක් කියවීමට ප්‍රවේශය ලබා දෙනු ඇත.",
                                            types: {
                                                ldap: {
                                                    label: "LDAP"
                                                },
                                                ad: {
                                                    label: "සක්රීය නාමාවලිය (Active Directory)"
                                                }
                                            }
                                        },
                                        accessType: {
                                            label: "ප්රවේශ වර්ගය",
                                            types: {
                                                readOnly: {
                                                    label: "කියවීමට පමණි",
                                                    hint: "ඔබට පරිශීලක ගබඩාවට කියවීමට පමණක් ප්‍රවේශය ලබා දෙනු ඇත. ඔබට නව " +
                                                    "පරිශීලකයින් එක් කිරීමට හෝ ඔබ පිවිසෙන පරිශීලක ගිණුම්වල ගුණාංග යාවත්කාලීන කිරීමට " +
                                                    "නොහැකි වනු ඇත."
                                                },
                                                readWrite: {
                                                    label: "කියවන්න/ලියන්න",
                                                    hint: "ඔබට පරිශීලක ගබඩාවට කියවීමට/ලිවීමට ප්‍රවේශය ලබා දෙනු ඇත. ඔබට නව " +
                                                    "පරිශීලකයින් එක් කිරීමට සහ ඔබ පිවිසෙන පරිශීලක ගිණුම්වල ගුණාංග යාවත්කාලීන කිරීමට " +
                                                    "හැකි වනු ඇත."
                                                }
                                            }
                                        }
                                    }
                                },
                                title: "සාමාන්ය විස්තර"
                            }
                        }
                    }
                },
                delete: {
                    assertionHint: "කරුණාකර ඔබගේ ක්‍රියාව තහවුරු කරන්න."
                },
                edit: {
                    attributeMappings: {
                        description: "ඔබේ සංවිධානයේ අනුරූප පෙරනිමි සහ අභිරුචි ගුණාංග සමඟ ඔබේ දුරස්ථ පරිශීලක ගබඩාවේ ගුණාංග " +
                            "සිතියම්ගත කරන්න. උපලක්ෂණ අගයන් ඔබේ සංවිධානයේ පෙරනිමි ගුණාංග සිතියම්ගත කිරීම්වලට සිතියම්ගත කෙරේ. ",
                        disable: {
                            buttonDisableHint: "මෙම පරිශීලක ගබඩාව අක්‍රිය කර ඇති බැවින් ඔබට උපලක්ෂණ සිතියම්ගත කළ නොහැක."
                        },
                        title: "උපලක්ෂණ සිතියම්ගත කිරීම් යාවත්කාලීන කරන්න",
                        subTitle: "පෙරනිමි සහ අභිරුචි උපලක්ෂණ සඳහා ඔබ එක් කර ඇති ගුණාංග සිතියම්ගත කිරීම් යාවත්කාලීන කරන්න",
                        sections: {
                            custom: "අභිරුචි ගුණාංග",
                            local: "දේශීය ගුණාංග"
                        },
                        validations: {
                            empty: "මෙය අවශ්ය ක්ෂේත්රයකි."
                        }
                    },
                    general: {
                        connectionsSections: {
                            title: "පරිශීලක ගබඩා නියෝජිත සම්බන්ධතා(ය)",
                            agents: {
                                agentOne: {
                                    description: "මෙම නියෝජිතයා හරහා සම්බන්ධිත මෙම පරිශීලක ගබඩාවේ ගිණුමක් ඇති පරිශීලකයින්ට, " +
                                        "මගේ ගිණුමට සහ සංවිධානයේ ලියාපදිංචි කර ඇති අනෙකුත් ව්‍යාපාරික යෙදුම් වෙත පුරනය විය හැක."
                                },
                                agentTwo: {
                                    description: "දුරස්ථ පරිශීලක ගබඩාව සඳහා ඉහළ ලබා ගැනීමේ හැකියාවක් පවත්වා ගැනීමට, ඔබට " +
                                        "දෙවන පරිශීලක ගබඩා නියෝජිතයෙකු සම්බන්ධ කළ හැක. "
                                },
                                buttons: {
                                    disconnect: "විසන්ධි කරන්න",
                                    generate: "ටෝකනය ජනනය කරන්න",
                                    regenerate: "ටෝකනය නැවත උත්පාදනය කරන්න"
                                }
                            }
                        },
                        disable: {
                            buttonDisableHint: "මෙම පරිශීලක ගබඩාව අබල කර ඇති බැවින් ඔබට විස්තරය යාවත්කාලීන කළ නොහැක."
                        },
                        form: {
                            fields: {
                                description: {
                                    label: "විස්තර",
                                    placeholder: "පරිශීලක ගබඩාවේ විස්තරය ඇතුළත් කරන්න"
                                }
                            },
                            validations: {
                                allSymbolsErrorMessage: "පරිශීලක ගබඩා නාමයට අක්ෂරාංක සහ විශේෂ අක්ෂර එකතුවක් තිබිය " +
                                    "යුතුය. කරුණාකර වෙනත් නමක් උත්සාහ කරන්න.",
                                invalidSymbolsErrorMessage: "ඔබ ඇතුළු කළ නමේ අවසර නොදුන් අක්ෂර ඇත. එහි '/' " +
                                    "හෝ '_' අඩංගු විය නොහැක.",
                                restrictedNamesErrorMessage: "{{name}} නම සහිත පරිශීලක ගබඩාවක් දැනටමත් පවතී. " +
                                    "කරුණාකර වෙනත් නමක් උත්සාහ කරන්න.",
                                reservedNamesErrorMessage: "{{name}} පරිශීලක ගබඩා නාමය වෙන් කර ඇත. " +
                                    "කරුණාකර වෙනත් නමක් උත්සාහ කරන්න."
                            }
                        },
                        userStoreType: {
                            info: "පරිශීලක නාමාවලිය වෙත ඔබට කියවීමට පමණක් ප්‍රවේශය ලබා දෙන බව සලකන්න. ඔබට නව පරිශීලකයින් " +
                                "එක් කිරීමට හෝ ඔබ පිවිසෙන පරිශීලක ගිණුම්වල උපලක්ෂණ යාවත්කාලීන කිරීමට නොහැකි වනු ඇත. මෙම " +
                                "පරිශීලක ගබඩාවේ පරිශීලකයින්ට ඔබේ සංවිධානයේ යෙදුම් වෙත පුරනය වීමට හැකි වනු ඇත."
                        }
                    },
                    setupGuide: {
                        title: "දුරස්ථ පරිශීලක ගබඩාව සම්බන්ධ කරන්න",
                        subTitle: "දුරස්ථ පරිශීලක ගබඩාව Asgardeo වෙත සම්බන්ධ කරන පරිශීලක ගබඩා නියෝජිතයා වින්‍යාස කිරීමට පහත " +
                            "දක්වා ඇති පියවර අනුගමනය කරන්න.",
                        steps: {
                            configureProperties: {
                                content: {
                                    message: "පරිශීලක ගබඩා වින්‍යාස කිරීමේ ගුණාංගවල සම්පූර්ණ ලැයිස්තුව සඳහා Asgardeo ප්‍රලේඛනය බලන්න."
                                },
                                description: "ඔබගේ අවශ්‍යතා අනුව පරිශීලක ගබඩා නියෝජිත බෙදාහැරීමේ " +
                                    "ඇති deployment.toml ගොනුවේ දේශීය පරිශීලක ගබඩාවේ ගුණාංග වින්‍යාස කරන්න.",
                                title: "පරිශීලක ගබඩා ගුණාංග වින්‍යාස කරන්න"
                            },
                            downloadAgent: {
                                content: {
                                    buttons: {
                                        download: "නියෝජිතයා බාගන්න"
                                    }
                                },
                                description: "පරිශීලක ගබඩා නියෝජිතයා බාගත කර unzip කරන්න.",
                                title: "නියෝජිතයා බාගන්න"
                            },
                            generateToken: {
                                content: {
                                    buttons: {
                                        generate: "ටෝකනය ජනනය කරන්න"
                                    }
                                },
                                description: "ඔබ ඔබේ දුරස්ථ පරිශීලක ගබඩාව පරිශීලක ගබඩා නියෝජිතයා හරහා සම්බන්ධ කිරීමට උත්සාහ " +
                                    "කරන විට අවශ්‍ය වන නව ප්‍රවේශ ටෝකනයක් උත්පාදනය කරන්න.",
                                title: "නව ටෝකනයක් උත්පාදනය කරන්න"
                            },
                            runAgent: {
                                description: "ඔබගේ මෙහෙයුම් පද්ධතිය මත පදනම්ව පහත විධාන වලින් එකක් ක්‍රියාත්මක කරන්න. විමසුමේදී " +
                                    "ස්ථාපනය_ටෝකනය ඇතුළු කරන්න.",
                                title: "නියෝජිතයා ධාවනය කරන්න "
                            },
                            tryAgain: {
                                info: "පරිශීලක ගබඩාවක් සම්බන්ධ වී නැත, කරුණාකර ඔබ ස්ථාපන මාර්ගෝපදේශයේ සියලුම පියවරයන් නිසි ලෙස " +
                                    "අනුගමනය කර ඇති බව සහතික කර ගන්න."
                            }
                        }
                    }
                },
                list: {
                    subTitle: "පරිශීලක වෙළඳසැල් සම්බන්ධ කර කළමනාකරණය කරන්න.",
                    title: "පරිශීලක ගබඩා"

                }
            }
        },
        groups: {
            heading: "කණ්ඩායම්",
            subHeading:
                "ඔබේ ආයතනයේ පරිශීලක කණ්ඩායම් මෙහි ලැයිස්තු ගත කර ඇත. ඔබට නව කණ්ඩායම් සාදා පරිශීලකයන් පැවරිය හැකිය.",
            edit: {
                users: {
                    heading: "කණ්ඩායමේ පරිශීලකයින්",
                    description: "ඔබේ සංවිධානය තුළ පරිශීලක කණ්ඩායම් මෙහි කළමනාකරණය කෙරේ."
                },
                roles: {
                    title: "භූමිකාවන්",
                    heading: "කණ්ඩායමට පවරා ඇති භූමිකාවන්",
                    description: "ඔබේ සංවිධානය තුළ කණ්ඩායම් සිට භූමිකාව පැවරුම් මෙහි කළමනාකරණය කෙරේ.",
                    editHoverText: "පවරා ඇති භූමිකාවන් සංස්කරණය කරන්න",
                    searchPlaceholder: "යෙදුමේ නම සහ භූමිකාවේ නම අනුව යෙදුම් භූමිකාවන් සොයන්න",
                    rolesList: {
                        applicationLabel: "යෙදුම",
                        applicationRolesLabel: "යෙදුම් භූමිකාවන්"
                    },
                    addNewModal: {
                        heading: "යෙදුම් භූමිකාවන් කළමනාකරණය කරන්න",
                        subHeading: "කණ්ඩායමට අදාළ යෙදුම් භූමිකාවන් තෝරන්න."
                    },
                    buttons: {
                        assignRoles: "භූමිකාවන් පවරන්න"
                    },
                    placeHolders: {
                        emptyRoles: {
                            action: "යෙදුම් වෙත යන්න",
                            subtitles: {
                                0: "මේ වන විට යෙදුම් භූමිකාවන් නොමැත.",
                                1: "කරුණාකර එය කණ්ඩායමට ලබා දීම සඳහා යෙදුම් භූමිකාවන් සාදන්න."
                            },
                            title: "කිසිදු භූමිකාවන් නිර්මාණය වී නැත"
                        },
                        emptyList: {
                            action: "භූමිකාවන් පවරන්න",
                            subtitles: {
                                0: "මේ මොහොතේ කණ්ඩායමට පවරා ඇති භූමිකාවන් නොමැත."
                            },
                            title: "භූමිකාවන් පවරා නොමැත"
                        }
                    },
                    notifications: {
                        updateApplicationRoles: {
                            error: {
                                description: "{{description}}",
                                message: "යෙදුම් භූමිකාවන් යාවත්කාලීන කිරීමේදී දෝෂයක් සිදු විය"
                            },
                            genericError: {
                                description: "යෙදුම් භූමිකාවන් යාවත්කාලීන කිරීමේදී දෝෂයක් සිදු විය.",
                                message: "මොකක්හරි වැරැද්දක් වෙලා"
                            },
                            success: {
                                description: "සමූහය සඳහා යෙදුම් භූමිකාවන් යාවත්කාලීන කිරීම සාර්ථකයි.",
                                message: "යෙදුම් භූමිකාවන් යාවත්කාලීන කිරීම සාර්ථකයි"
                            }
                        },
                        fetchApplicationRoles: {
                            error: {
                                description: "{{description}}",
                                message: "යෙදුම් භූමිකාවන් ලබා ගැනීමේදී දෝෂයක් සිදු විය"
                            },
                            genericError: {
                                description: "යෙදුම් භූමිකාවන් ලබා ගැනීමේදී දෝෂයක් සිදු විය.",
                                message: "මොකක්හරි වැරැද්දක් වෙලා"
                            }
                        },
                        fetchAssignedApplicationRoles: {
                            error: {
                                description: "{{description}}",
                                message: "පවරා ඇති යෙදුම් භූමිකාවන් ලබා ගැනීමේදී දෝෂයක් සිදු විය"
                            },
                            genericError: {
                                description: "පවරා ඇති යෙදුම් භූමිකාවන් ලබා ගැනීමේදී දෝෂයක් සිදු විය.",
                                message: "මොකක්හරි වැරැද්දක් වෙලා"
                            }
                        }
                    }
                }
            }
        },
        myAccount: {
            fetchMyAccountData: {
                error: {
                    description: "{{description}}",
                    message: "නැවත ලබා ගැනීමේ දෝෂය"
                },
                genericError: {
                    description: "මගේ ගිණුම් ද්වාර දත්ත ලබා ගැනීමට නොහැකි විය.",
                    message: "මොකක්හරි වැරැද්දක් වෙලා"
                }
            },
            fetchMyAccountStatus: {
                error: {
                    description: "{{description}}",
                    message: "නැවත ලබා ගැනීමේ දෝෂය"
                },
                genericError: {
                    description: "මගේ ගිණුම් ද්වාර තත්ත්වය ලබා ගැනීමට නොහැකි විය.",
                    message: "මොකක්හරි වැරැද්දක් වෙලා"
                }
            },
            editPage: {
                pageTitle: "මගේ ගිණුම් ස්වයං සේවා ද්වාරය",
                description: "ඔබගේ පරිශීලකයින් සඳහා මගේ ගිණුම් ද්වාරයට ප්‍රවේශය පාලනය කරන්න සහ මගේ ගිණුම් ද්වාරය සඳහා ද්වි සාධක සත්‍යාපනය වින්‍යාස කරන්න.",
                enableEmailOtp: "Email OTP සබල කරන්න",
                enableSmsOtp: "SMS OTP සබල කරන්න",
                smsOtpEnableDescription: "SMS OTP සත්‍යාපන විකල්පය සබල කිරීමට, ඔබ ඔබේ සංවිධානය සඳහා SMS OTP සත්‍යාපනය සැකසීමට අවශ්‍ය වේ. <1>වැඩිදුර ඉගෙන ගන්න</1>",
                enableTotp: "TOTP සබල කරන්න",
                mfaDescription: "මගේ ගිණුම් ද්වාරය සඳහා අවශ්‍ය ද්වි-සාධක සත්‍යාපන විකල්ප තෝරන්න.",
                myAccountUrlDescription: "මගේ ගිණුම් ද්වාරයට ප්‍රවේශ වීමට ඔබේ පරිශීලකයන් සමඟ මෙම සබැඳිය බෙදා ගන්න.",
                backupCodeDescription: "ද්වි සාධක සත්‍යාපනය සඳහා උපස්ථ කේත සබල කරන්න.",
                enableBackupCodes: "උපරිම කේත සබල කරන්න",
                backupCodeInfo: "උපස්ථ කේත සත්‍යාපන විකල්පය සක්‍රීය කිරීමට, ඔබ ඔබේ සංවිධානය සඳහා අවම වශයෙන් ද්වි-සාධක සත්‍යාපන විකල්පයන්ගෙන් එකක් සක්‍රිය කළ යුතුය.",
                EnableTotpEnrollment: "පුරනය වීමේදී TOTP ලියාපදිංචියට ඉඩ දෙන්න",
                totpEnrollmentInfo: "පරිශීලක පිවිසුමේදී TOTP ලියාපදිංචිය අක්‍රිය කර ඇත්නම් සහ පරිශීලකයා දැනටමත් TOTP සත්‍යාපකය ලියාපදිංචි කර නොමැති නම්, සහාය සඳහා ආයතනික සහාය සම්බන්ධ කර ගන්නා ලෙස පරිශීලකයාට උපදෙස් දෙනු ලැබේ."
            },
            pageTitle: "ස්වයං සේවා ද්වාරය",
            description: "ඔබේ පරිශීලකයින් සඳහා ස්වයං සේවා ද්වාරය.",
            goBackToApplication: "යෙදුම් පිටුවට ආපසු යන්න",
            goBackToMyAccount: "My Account පිටුවට ආපසු යන්න"
        },
        serverConfigurations: {
            accountManagement: {
                accountRecovery: {
                    heading: "මුරපද ප්‍රතිසාධනය",
                    subHeading:
                        "ඊ-තැපෑලක් භාවිතා කර මුරපදය නැවත සැකසීමට පරිශීලකයින්ට ඉඩ දීම සඳහා ස්වයං සේවා මුරපද " +
                        "ප්‍රතිසාධනය සඳහා සැකසුම් වින්‍යාස කරන්න.",
                    toggleName: "මුරපද ප්‍රතිසාධනය සක්‍රීය කරන්න"
                }
            },
            accountRecovery: {
                backButton: "ගිණුම් ප්‍රතිසාධනය වෙත ආපසු යන්න",
                heading: "ගිණුම් අයකර ගැනීම",
                passwordRecovery: {
                    form: {
                        fields: {
                            enable: {
                                hint:
                                    "මෙය සක්‍රිය කිරීමෙන් ව්‍යාපාරික පරිශීලකයින්ට විද්‍යුත් තැපැල් පණිවිඩයක් භාවිතයෙන් " +
                                    "ඔවුන්ගේ මුරපදය නැවත සැකසිය හැක.",
                                label: "සක්‍රීය කරන්න"
                            },
                            expiryTime: {
                                label: "ප්‍රතිසාධන සම්බන්ධක කල් ඉකුත් වීමේ කාලය මිනිත්තු කිහිපයකින්",
                                placeholder: "කල් ඉකුත් වීමේ වේලාව ඇතුළත් කරන්න",
                                validations: {
                                    invalid: "ප්‍රතිසාධන සම්බන්ධක කල් ඉකුත් වීමේ කාලය නිඛිලයක් විය යුතුය.",
                                    empty: "ප්‍රතිසාධන සම්බන්ධක කල් ඉකුත් වීමේ කාලය හිස් විය නොහැක.",
                                    range:
                                        "ප්‍රතිසාධන සම්බන්ධක කල් ඉකුත් වීමේ කාලය මිනිත්තු 1 සිට මිනිත්තු 10080 දක්වා (දින 7) " +
                                        "විය යුතුය.",
                                    maxLengthReached:
                                        "ප්‍රතිසාධන සම්බන්ධක කල් ඉකුත් වීමේ කාලය ඉලක්කම් 5 ක් හෝ ඊට අඩු " +
                                        "සංඛ්‍යාවක් විය යුතුය."
                                }
                            },
                            notifySuccess: {
                                hint:
                                    "මුරපද ප්‍රතිසාධනය සාර්ථක වූ විට විද්‍යුත් තැපෑලෙන් පරිශීලකයාට දැනුම් දිය යුතුද යන්න " +
                                    "මෙයින් නියම කෙරේ.",
                                label: "සාර්ථක ප්‍රකෘතියක් පිළිබඳව දැනුම් දෙන්න"
                            }
                        }
                    },
                    connectorDescription:
                        "පිවිසුම් පිටුවේ ව්‍යාපාරික පරිශීලකයින් සඳහා ස්වයං සේවා මුරපද ප්‍රතිසාධන " +
                        "විකල්පය සක්‍රීය කරන්න.",
                    heading: "මුරපද ප්‍රතිසාධනය",
                    notification: {
                        error: {
                            description: "මුරපද ප්‍රතිසාධන වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයකි.",
                            message: "වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයකි"
                        },
                        success: {
                            description: "මුරපද ප්‍රතිසාධන වින්‍යාසය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                            message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                        }
                    },
                    subHeading: "ව්‍යාපාර භාවිතා කරන්නන් සඳහා ස්වයං සේවා මුරපද ප්‍රතිසාධනය සක්‍රීය කරන්න."
                },
                subHeading: "මුරපද ප්‍රතිසාධනය සහ පරිශීලක නාම ප්‍රතිසාධනය සම්බන්ධ සැකසුම් වින්‍යාස කරන්න."
            },
            accountSecurity: {
                backButton: "ගිණුම් ආරක්ෂාව වෙත ආපසු යන්න",
                heading: "ගිණුම් ආරක්ෂාව",
                botDetection: {
                    form: {
                        fields: {
                            enable: {
                                hint: "මෙය සක්‍රිය කිරීමෙන් පුරනය වීම සහ ප්‍රතිසාධනය යන දෙකටම reCaptcha බලාත්මක වේ.",
                                label: "සක්‍රීය කරන්න"
                            }
                        }
                    },
                    info: {
                        heading: "මෙමඟින් පහත දැක්වෙන ප්‍රවාහයන්හි අදාළ UI වල reCAPTCHA වලංගු කිරීම බලාත්මක කෙරේ.",
                        subSection1: "ව්‍යාපාර යෙදුම් වෙත පිවිසෙන්න",
                        subSection2: "පාරිභෝගික ගිණුමක මුරපදය නැවත ලබා ගන්න",
                        subSection3: "පාරිභෝගික ගිණුම් සඳහා ස්වයං ලියාපදිංචිය"
                    },
                    connectorDescription: "සංවිධානය සඳහා reCAPTCHA සක්‍රීය කරන්න.",
                    heading: "බොට් හඳුනාගැනීම",
                    notification: {
                        error: {
                            description: "බොට් හඳුනාගැනීමේ වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයකි.",
                            message: "වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයකි"
                        },
                        success: {
                            description: "බොට් හඳුනාගැනීමේ වින්‍යාසය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                            message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                        }
                    },
                    subHeading:
                        "ව්‍යාපාර යෙදුම් පුරනය වීම සහ ආයතනය සඳහා ගිණුම් ප්‍රතිසාධනය සඳහා නැවත සකස් කිරීම සක්‍රීය කරන්න."
                },
                loginAttemptSecurity: {
                    form: {
                        fields: {
                            accountLockIncrementFactor: {
                                hint:
                                    "ගිණුම අගුළු දැමීමෙන් පසු තවදුරටත් අසාර්ථක පිවිසුම් උත්සාහයන් මත ගිණුම් අගුළු කාලය " +
                                    "වැඩි කළ යුතු සාධකය මෙය නියම කරයි. උදා: ආරම්භක කාලය: මිනිත්තු 5; " +
                                    "වර්ධක සාධකය: 2; ඊළඟ අගුළු කාලය: 5x2 = මිනිත්තු 10 යි.",
                                label: "ගිණුම් අගුළු කාල වර්ධක සාධකය",
                                placeholder: "අගුළු කාල වර්ධක සාධකය ඇතුළත් කරන්න",
                                validations: {
                                    invalid: "ගිණුම් අගුලු දැමීමේ කාල වර්‍ධන සාධකය නිඛිලයක් විය යුතුය.",
                                    range: "ගිණුම් අගුලු දැමීමේ කාල වර්‍ධක සාධකය 1 ත් 10 ත් අතර විය යුතුය.",
                                    maxLengthReached:
                                        "ගිණුම් අගුළු දැමීමේ වර්ධන වර්ධන සාධකය ඉලක්කම් 1 ක් හෝ 2 ක් සහිත " +
                                        "අංකයක් විය යුතුය."
                                }
                            },
                            accountLockTime: {
                                hint:
                                    "ගිණුම අගුළු දමා ඇති ආරම්භක කාලසීමාව මෙයින් නියම කරයි. " +
                                    "මෙම කාල සීමාවෙන් පසු ගිණුම ස්වයංක්‍රීයව අගුළු හරිනු ඇත.",
                                label: "ගිණුම් අගුළු කාලය මිනිත්තු කිහිපයකින්",
                                placeholder: "අගුළු කාලය ඇතුළත් කරන්න",
                                validations: {
                                    invalid: "ගිණුම් අගුළු දැමීමේ කාලය නිඛිලයක් විය යුතුය.",
                                    required: "ගිණුම් අගුළු දැමීමේ කාලය අවශ්‍ය ක්ෂේත්‍රයකි.",
                                    range: "ගිණුම් අගුළු දැමීමේ කාලය මිනිත්තු 1 සිට මිනිත්තු 1440 දක්වා (දින 1) විය යුතුය.",
                                    maxLengthReached:
                                        "ගිණුම් අගුලු දැමීමේ කාලය ඉලක්කම් 4 ක් හෝ ඊට අඩු සංඛ්‍යාවක් විය යුතුය."
                                }
                            },
                            enable: {
                                hint:
                                    "ගිණුම අගුළු දැමීමේ ප්‍රති result ලය වනුයේ පරිශීලකයා වෙත ගිණුමක් අගුළු දමා ඇති" +
                                    " බව දක්වමින් ලිපියක් යැවීමයි.",
                                label: "සක්‍රීය කරන්න"
                            },
                            maxFailedAttempts: {
                                hint: "ගිණුම අගුළු දැමීමට පෙර අවසර දී ඇති අසාර්ථක පිවිසුම් උත්සාහයන් ගණන මෙයින් නියම කරයි.",
                                label: "ගිණුම් අගුළු දැමීමට පෙර අසාර්ථක පිවිසුම් උත්සාහයන් ගණන",
                                placeholder: "උපරිම අසාර්ථක උත්සාහයන් ඇතුළත් කරන්න",
                                validations: {
                                    invalid: "උපරිම අසාර්ථක උත්සාහයන් නිඛිලයක් විය යුතුය.",
                                    required: "උපරිම අසාර්ථක උත්සාහයන් අවශ්‍ය ක්ෂේත්‍රයකි.",
                                    range: "උපරිම අසාර්ථක උත්සාහයන් 1 ත් 10 ත් අතර විය යුතුය.",
                                    maxLengthReached:
                                        "උපරිම අසාර්ථක උත්සාහයන් ඉලක්කම් 1 ක් හෝ 2 ක් සහිත අංකයක් විය යුතුය."
                                }
                            }
                        }
                    },
                    info:
                        "ගිණුම අගුළු දැමූ පසු, ගිණුම් හිමිකරුට විද්‍යුත් තැපෑලෙන් දැනුම් දෙනු ලැබේ. ගිණුම් අගුළු කාලයෙන් පසු " +
                        "ගිණුම ස්වයංක්‍රීයව ක්‍රියාත්මක වේ.",
                    connectorDescription:
                        "අඛණ්ඩව අසාර්ථක පිවිසුම් උත්සාහයන් වලදී ගිණුම අගුළු දැමීමෙන් මුරපද තිරිසන් බල " +
                        "ප්‍රහාරවලින් ගිණුම් ආරක්ෂා කරන්න.",
                    heading: "පුරනය වීම ආරක්ෂාව සඳහා උත්සාහ කරයි",
                    notification: {
                        error: {
                            description: "පුරනය වීම යාවත්කාලීන කිරීමේදී ආරක්ෂක වින්‍යාසය උත්සාහ කරයි.",
                            message: "වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයකි"
                        },
                        success: {
                            description: "පිවිසුම සාර්ථකව යාවත්කාලීන කිරීම ආරක්ෂක වින්‍යාසය උත්සාහ කරයි.",
                            message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                        }
                    },
                    subHeading:
                        "සංවිධානයේ ව්‍යාපාර යෙදුම් පිවිසුම සඳහා අසාර්ථක පිවිසුම් උත්සාහයන් මත ගිණුම් අගුළු දැමීම " +
                        "සක්‍රීය කරන්න.",
                    howItWorks: {
                        correctPassword: {
                            description: "පරිශීලකයා නිවැරදි මුරපදය ඇතුළත් කළහොත්, පරිශීලකයාට සාර්ථකව පුරනය විය හැක."
                        },
                        example: {
                            description_plural:
                                "එනම්, ගිණුම {{ lockIncrementRatio }} x {{ lockDuration }}" +
                                " = {{ lockTotalDuration }} විනාඩි සඳහා අගුලු දමා ඇත.",
                            description_singular:
                                "එනම්, ගිණුම {{ lockIncrementRatio }} x {{ lockDuration }}" +
                                " = {{ lockTotalDuration }} විනාඩි සඳහා අගුලු දමා ඇත."
                        },
                        incorrectPassword: {
                            description_plural:
                                "පරිශීලකයා තවත් අඛණ්ඩ උත්සාහයන් {{ maxAttempts }}ක් සඳහා වැරදි " +
                                "මුරපදයක් උත්සාහ කරන්නේ නම්, ගිණුම් අගුළු දැමීමේ කාලය පෙර අගුලු දැමීමේ කාලය මෙන් " +
                                "{{ lockIncrementRatio }} ගුණයකින් වැඩි වේ.",
                            description_singular:
                                "පරිශීලකයා තවත් {{ maxAttempts }} අඛණ්ඩ උත්සාහයක් සඳහා වැරදි " +
                                "මුරපදයක් උත්සාහ කරන්නේ නම්, ගිණුම් අගුළු දැමීමේ කාලය පෙර අගුලු දැමීමේ කාලය මෙන් " +
                                "{{ lockIncrementRatio }} ගුණයකින් වැඩි වේ."
                        }
                    }
                },
                subHeading: "පරිශීලක ගිණුම් ආරක්‍ෂා කිරීම සඳහා ආරක්‍ෂක සැකසුම් සකසන්න."
            },
            additionalSettings: "අමතර සැකසුම්",
            analytics: {
                heading: "විශ්ලේෂණ එන්ජිම",
                subHeading: "ඔබේ සංවිධානය සඳහා විශ්ලේෂණ එන්ජිම වින්යාස කරන්න.",
                form: {
                    fields: {
                        hostUrl: {
                            label: "ධාරක URL",
                            placeholder: "ධාරක URL ඇතුලත් කරන්න",
                            hint: "විශ්ලේෂණ එන්ජිමේ URL."
                        },
                        hostBasicAuthEnable: {
                            label: "මූලික සත්යාපනය සක්රීය කරන්න",
                            hint: "විශ්ලේෂණ එන්ජිම සඳහා මූලික සත්යාපනය සක්රීය කරන්න."
                        },
                        hostUsername: {
                            label: "පරිශීලක නාමය",
                            placeholder: "පරිශීලක නාමය ඇතුළත් කරන්න",
                            hint: "විශ්ලේෂණ එන්ජිමට සත්යාපනය කිරීමේ පරිශීලක නාමය."
                        },
                        hostPassword: {
                            label: "මුරපදය",
                            placeholder: "මුරපදය ඇතුළත් කරන්න",
                            hint: "විශ්ලේෂණ එන්ජිමට සත්යාපනය කිරීමේ මුරපදය."
                        },
                        hostConnectionTimeout: {
                            label: "Http සම්බන්ධතා කාලය",
                            placeholder: "සම්බන්ධතා කාලය ඇතුළත් කරන්න",
                            hint: "මිලි තත්පර වලින් සම්බන්ධ වීමේ කාලකණ්ණි අගය ඇතුළත් කරන්න."
                        },
                        hostReadTimeout: {
                            label: "Http කියවන්න කල් ඉකුත් වීම",
                            placeholder: "කියවීමේ කාල සීමාව ඇතුළත් කරන්න",
                            hint: "ඇඹරූ කල් ඉකුත් වීමේ අගය මිලි තත්පර වලින් ඇතුළත් කරන්න."
                        },
                        hostConnectionRequestTimeout: {
                            label: "Http සම්බන්ධතා ඉල්ලීම් කල් ඉකුත් වීම",
                            placeholder: "සම්බන්ධතා ඉල්ලීම් කල් ඉකුත් වීම ඇතුළත් කරන්න",
                            hint: "සම්බන්ධතා ඉල්ලීම මිලි තත්පරවල කල් ඉකුත් වීමේ වටිනාකම ඇතුළත් කරන්න."
                        },
                        hostNameVerification: {
                            label: "ධාරක නාම සත්යාපනය",
                            placeholder: "ධාරක නාම සත්යාපනය ඇතුළත් කරන්න",
                            hint: "විශ්ලේෂණ එන්ජිම සඳහා සත්කාරක නාම සත්යාපනය සක්රීය කරන්න.(දැඩි | Act_all)"
                        }
                    },
                    notification: {
                        error: {
                            description: "විශ්ලේෂණ එන්ජින් වින්යාසයන් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                            message: "දෝෂයක් සිදුවී"
                        },
                        success: {
                            description: "විශ්ලේෂණ එන්ජින් වින්යාසයන් සාර්ථකව යාවත්කාලීන කරන ලදි.",
                            message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                        }
                    }
                }
            },
            generalBackButton: "ආපසු යන්න",
            generalDisabledLabel: "අක්‍රිය කර ඇත",
            generalEnabledLabel: "සක්‍රීය කර ඇත",
            passwordHistoryCount: {
                heading: "මුරපද ඉතිහාස ගණන",
                label1: "අන්තිමට වඩා වෙනස් විය යුතුය",
                label2: "මුරපද.",
                message: "පැරණි මුරපදයක් නැවත භාවිතා කිරීමට පෙර පරිශීලකයෙකු භාවිතා කළ යුතු අද්විතීය මුරපද ගණන සඳහන් කරන්න."
            },
            passwordExpiry: {
                heading: "මුරපදය කල් ඉකුත්වීම",
                label: "මුරපදය කල් ඉකුත් වේ",
                timeFormat: "දින"
            },
            passwordValidationHeading: "මුරපද ආදාන වලංගුකරණය",
            userOnboarding: {
                backButton: "ස්වයං ලියාපදිංචිය වෙත ආපසු යන්න",
                heading: "ස්වයං ලියාපදිංචිය",
                selfRegistration: {
                    accountVerificationWarning: "ගිණුම් සත්‍යාපන විකල්පය සක්‍රීය කිරීමට, ඔබ ඔබේ සංවිධානය සඳහා " +
                        "විද්‍යුත් තැපැල් ගුණාංගය අනිවාර්ය කළ යුතුය.",
                    form: {
                        fields: {
                            enable: {
                                hint:
                                    "මෙම සංවිධානය සඳහා ස්වයං ලියාපදිංචි වීමට පාරිභෝගික පරිශීලකයින්ට ඉඩ දෙන්න. සක්‍රිය " +
                                    "කර ඇති විට, පරිශීලකයින්ට පිවිසුම් තිරයේ ගිණුමක් නිර්මාණය කිරීම සඳහා සබැඳියක් පෙනෙනු ඇත.",
                                label: "සක්‍රීය කරන්න"
                            },
                            enableAutoLogin: {
                                label: "ස්වයංක්‍රීය පුරනය වීම සබල කරන්න",
                                hint:
                                    "තෝරා ගත්තේ නම්, ලියාපදිංචි වීමෙන් පසු පරිශීලකයා ස්වයංක්‍රීයව ලොග් වනු ඇත."
                            },
                            expiryTime: {
                                hint: "ගිණුම් සත්‍යාපන සබැඳිය සඳහා කල් ඉකුත් වීමේ කාලය.",
                                label: "ගිණුම් සත්‍යාපන සම්බන්ධක කල් ඉකුත් වීමේ වේලාව",
                                placeholder: "කල් ඉකුත් වීමේ වේලාව ඇතුළත් කරන්න",
                                validations: {
                                    invalid: "කල් ඉකුත් වීමේ කාලය නිඛිලයක් විය යුතුය.",
                                    empty: "කල් ඉකුත් වීමේ කාලය හිස් විය නොහැක.",
                                    range: "කල් ඉකුත් වීමේ කාලය මිනිත්තු 1 සිට විනාඩි 10080 දක්වා (දින 7) විය යුතුය.",
                                    maxLengthReached: "කල් ඉකුත් වීමේ කාලය ඉලක්කම් 5 ක් හෝ ඊට අඩු සංඛ්‍යාවක් විය යුතුය."
                                }
                            },
                            activateImmediately: {
                                msg:
                                    "තෝරාගනු ලැබුවහොත්, ගිණුම තහවුරු කිරීම සඳහා බලා " +
                                    "නොසිට ලියාපදිංචි වූ වහාම නව ගිණුම සක්රිය වේ.",
                                hint: "මෙය ස්වයං-ලියාපදිංචියේදී ඊමේල් සත්‍යාපනය සක්‍රීය කරයි.",
                                label: "ගිණුම වහාම ක්‍රියාත්මක කරන්න"
                            },
                            signUpConfirmation: {
                                recommendationMsg:
                                    "ස්වයං ලියාපදිංචිය සඳහා ගිණුම් සත්‍යාපනය සක්‍රීය කිරීම රෙකමදාරු කරනු ලැබේ.",
                                botMsg: " අවම වශයෙන් බොට් හඳුනාගැනීම සක්‍රීය කරන්න.",
                                accountLockMsg:
                                    "ගිණුම් සත්‍යාපනය ස්වයං ලියාපදිංචි කිරීමේදී විද්‍යුත් තැපැල් සත්‍යාපනය සක්‍රීය කරයි. " +
                                    "නව ගිණුම සක්‍රීය වන්නේ පරිශීලකයා විද්‍යුත් තැපෑල සත්‍යාපනය කිරීමෙන් පසුව පමණි",
                                hint: "ගිණුම් සත්‍යාපනය ඉල්ලා ස්වයං-ලියාපදිංචි පරිශීලකයාට විද්‍යුත් තැපෑලක් යවනු ලැබේ.",
                                label: "ගිණුම් සත්‍යාපනය",
                                confirmation: {
                                    heading: "ඔබට විශ්වාසද?",
                                    message: "ගිණුම් සත්‍යාපනය සබල කරන්න",
                                    content: "ස්වයංක්‍රීය පිවිසුමට ලියාපදිංචි වූ වහාම ගිණුම සක්‍රිය කිරීම අවශ්‍ය වේ. ඔබ ඉදිරියට යන විට, "
                                        + "ස්වයංක්‍රීය පුරනය වීම අක්‍රිය වනු ඇත. ඔබ <1>ගිණුම වහාම ක්‍රියාත්මක කරන්න</1> විකල්පය "
                                        + "තෝරාගත් විට ඔබට එය සැම විටම නැවත සක්‍රිය කළ හැක."
                                }
                            }
                        }
                    },
                    connectorDescription: "සංවිධානයේ පාරිභෝගික පරිශීලකයින් සඳහා ස්වයං ලියාපදිංචිය සක්‍රීය කරන්න.",
                    heading: "ස්වයං ලියාපදිංචිය",
                    notification: {
                        error: {
                            description: "ස්වයං ලියාපදිංචි වින්‍යාසය යාවත්කාලීන කිරීමේ දෝෂයකි.",
                            message: "වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයකි"
                        },
                        success: {
                            description: "ස්වයං ලියාපදිංචි කිරීමේ වින්‍යාසය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                            message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                        }
                    },
                    subHeading:
                        "ස්වයං ලියාපදිංචිය සක්‍රිය කර ඇති විට, පරිශීලකයින්ට යෙදුමේ පිවිසුම් පිටුවේ " +
                        "<1> ගිණුමක් සාදන්න </ 1> සබැඳිය හරහා ලියාපදිංචි විය හැකිය. මෙය සංවිධානයේ නව " +
                        "<3> ගනුදෙනුකරුවෙකු </ 3> ගිණුමක් නිර්මාණය කරයි."
                },
                inviteUserToSetPassword: {
                    notification: {
                        error: {
                            description: "මුරපද සම්බන්ධකය සැකසීමට පරිශීලකයාට ආරාධනා කිරීම සඳහා වින්‍යාසය යාවත්කාලීන කිරීමට අසමත් විය.",
                            message: "වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයකි"
                        },
                        success: {
                            description: "මුරපදය සම්බන්ධකය සැකසීමට පරිශීලකයාට ආරාධනා කිරීම සඳහා වින්‍යාසය සාර්ථකව යාවත්කාලීන කරන ලදී.",
                            message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                        }
                    }
                },
                subHeading: "ස්වයං ලියාපදිංචිය හා සම්බන්ධ සැකසුම්"
            }
        },
        users: {
            administratorSettings: {
                administratorSettingsSubtitle: "ආයතනික පරිපාලකයින් සම්බන්ධ සැකසුම්.",
                administratorSettingsTitle: "පරිපාලක සැකසුම්",
                backButton: "පරිපාලකයින් වෙත ආපසු යන්න",
                disableToggleMessage: "සංවිධානය කළමනාකරණය කිරීමට පරිශීලකයින් සබල කරන්න",
                enableToggleMessage: "සංවිධානය කළමනාකරණය කිරීමට පරිශීලකයන් අබල කරන්න",
                error: {
                    description: "{{description}}",
                    message: "වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයකි"
                },
                genericError: {
                    description: "වින්‍යාසය යාවත්කාලීන කිරීමට නොහැකි විය",
                    message: "මොකක්හරි වැරැද්දක් වෙලා"
                },
                success: {
                    description: "වින්‍යාසය සාර්ථකව යාවත්කාලීන කරන ලදී.",
                    message: "වින්‍යාස යාවත්කාලීන කිරීම සාර්ථකයි"
                },
                toggleHint: "සබල කර ඇත්නම්, පරිශීලකයින්ට පරිපාලන හැකියාවන් පැවරිය හැක."
            },
            usersTitle: "පරිශීලකයන්",
            usersSubTitle: "සංවිධානය තුළ යෙදුම් වෙත ප්‍රවේශ විය හැකි පරිශීලකයින් මෙහි කළමනාකරණය කෙරේ.",
            collaboratorsTitle: "සහයෝගිතාකරුවන්",
            collaboratorsSubTitle: "ඔබේ සංවිධානයේ පරිපාලන මෙහෙයුම් සඳහා ප්‍රවේශය ඇති පරිශීලකයින් මෙහි කළමනාකරණය කෙරේ.",
            editUserProfile: {
                userId: "පරිශීලක ID",
                disclaimerMessage:
                    "මෙම පරිශීලක පැතිකඩ අයත් වන්නේ සහයෝගිතාකරුවෙකුට හෝ සංවිධාන හිමිකරුවෙකුට ය. ගිණුම් යෙදුම" +
                    " හරහා පැතිකඩ කළමනාකරණය කළ හැක්කේ ගිණුම් හිමිකරුට පමණි.",
                accountLock: {
                    title: "පරිශීලක ගිණුම අගුළු දමන්න",
                    description:
                        "ඔබ ගිණුම අගුළු දැමූ පසු, පරිශීලකයාට තවදුරටත් පද්ධතියට ප්‍රවේශ විය නොහැක. කරුණාකර ස්ථිර වන්න."
                },
                resetPassword: {
                    changePasswordModal: {
                        emailUnavailableWarning: "අවවාදයයි: පරිශීලක ගිණුම සඳහා ඊමේල් ලිපිනයක් සොයාගත නොහැක. " +
                            "මුරපදය යළි පිහිටුවීමට පරිශීලකයාට ආරාධනා කිරීම සඳහා කරුණාකර ඊමේල් ලිපිනයක් සපයන්න.",
                        emailResetWarning: "මුරපදය යළි පිහිටුවීම සඳහා සබැඳියක් සහිත විද්‍යුත් තැපෑලක් පරිශීලකයාට " +
                            "තමන්ගේම මුරපදයක් සැකසීමට සපයා ඇති විද්‍යුත් තැපැල් ලිපිනයට යවනු ලැබේ",
                        passwordResetConfigDisabled: "ප්‍රතිසාධන විද්‍යුත් තැපෑල හරහා මුරපද යළි පිහිටුවීම සබල කර නැත. " +
                            "කරුණාකර එය <1> පුරනය වීම සහ ලියාපදිංචිය </1> වින්‍යාස කිරීම් වලින් සබල කිරීමට වග බලා ගන්න."
                    }
                }
            },
            buttons: {
                addUserBtn: "පරිශීලක එකතු කරන්න",
                addCollaboratorBtn: "සහකරු එකතු කරන්න"
            },
            collaboratorAccounts: {
                consoleInfo: "කොන්සෝලයට ප්‍රවේශ වීමට ඉඩ දීමට පරිපාලන වරප්‍රසාද ඇති පරිශීලකයන් සමඟ මෙම සබැඳිය බෙදා ගන්න"
            },
            list: {
                columns: {
                    user: "පරිශීලක",
                    accountType: "ගිණුම් වර්ගය",
                    idpType: "කළමනාකරණය",
                    userStore: "පරිශීලක ගබඩාව"
                },
                popups: {
                    content: {
                        AccountTypeContent: "මෙම සංවිධානය සමඟ පරිශීලකයාගේ සම්බන්ධතාවය.",
                        idpTypeContent: "පරිශීලකයාගේ අනන්‍යතාවය සහ අක්තපත්‍ර කළමනාකරණය කරන ආයතනය.",
                        sourceContent: "පරිශීලක තොරතුරු ගබඩා කර ඇති දත්ත ගබඩාව."
                    }
                }
            },
            descriptions: {
                learnMore: "වැඩිදුර ඉගෙන ගන්න",
                allUser: "මේ සියල්ල ඔබගේ සංවිධානයේ පරිශීලකයින් ය.",
                consumerUser:
                    "මෙම පරිශීලකයින්ට (පාරිභෝගිකයින්ට) ආයතනයේ යෙදුම් වලට ප්‍රවේශ විය හැකිය. පරිපාලකයින්ට ගනුදෙනුකරුවන්ට ආයතනයට ඇතුළු " +
                    "විය හැකිය, නැතහොත් ස්වයං ලියාපදිංචිය සක්‍රීය කර ඇත්නම් ගනුදෙනුකරුවන්ට ලියාපදිංචි විය හැකිය.",
                guestUser:
                    "මෙම පරිශීලකයින්ට (හවුල්කරුවන්ට) ඔබේ සංවිධානයේ පරිපාලනමය ක්‍රියාකාරකම් සඳහා ප්‍රවේශය ඇත (උදා., අයදුම්පත් පුවරුව, " +
                    "පරිශීලක කළමනාකරණය). පරිපාලකයින්ට පරිශීලකයින්ට සංවිධානයට සහයෝගිතාකරුවන් ලෙස ආරාධනා කර " +
                    "ඔවුන්ට අවසර ලබා දිය හැකිය.",
                consumerAppInfo:
                    "My Account වෙත ප්‍රවේශ වීමට සහ ඔවුන්ගේ ගිණුම් කළමනාකරණය කිරීමට මෙම සබැඳිය ඔබේ ගනුදෙනුකරුවන් සමඟ බෙදා ගන්න."
            },
            notifications: {
                addUser: {
                    customerUser: {
                        limitReachError: {
                            description: "අවසර ලත් පාරිභෝගික පරිශීලකයින්ගේ උපරිම සංඛ්‍යාවට ළඟා වී ඇත.",
                            message: "නව පරිශීලකයා එකතු කිරීමේදී දෝෂයකි"
                        }
                    }
                }
            },
            wizard: {
                addAdmin: {
                    external: {
                        subtitle: "ඔබේ සංවිධානය කළමනාකරණය කිරීමට බාහිර පරිපාලකයෙකුට ආරාධනා කරන්න. " +
                            "මෙම පරිශීලකයාට සහයෝගිතාව ආරම්භ කිරීම සඳහා ඔවුන්ට පිළිගත හැකි ඊමේල් ආරාධනාවක් ලැබෙනු ඇත.",
                        title: "පරිපාලක පරිශීලකයාට ආරාධනා කරන්න"
                    },
                    internal: {
                        hint: "පරිපාලකයින් ලෙස එක් කළ හැක්කේ පරිශීලක අංශයේ ලැයිස්තුගත කර ඇති පරිශීලකයින් පමණි.",
                        searchPlaceholder: "විද්‍යුත් තැපෑලෙන් සොයන්න",
                        emptySearchQueryPlaceholder: "ආරම්භ කිරීමට, ඊමේල් ටයිප් කිරීමෙන් පරිශීලකයන් සොයන්න. ඔබට සම්පූර්ණ ඊමේල් ලිපිනය ටයිප් කිරීමට සිදු විය හැක.",
                        emptySearchResultsPlaceholder: "අපට සෙවීම සඳහා ප්‍රතිඵල කිසිවක් සොයාගත නොහැකි විය. කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න.",
                        selectUser: "පරිශීලක තෝරන්න",
                        subtitle: "ඔබගේ සංවිධානයේ දැනට සිටින පරිශීලකයින් පරිපාලකයින් බවට පත් කරන්න. වෙනස් " +
                            "කිරීම පෙන්නුම් කරන ඊමේල් දැනුම්දීමක් පරිශීලකයින්ට යවනු ලැබේ.",
                        title: "පරිපාලක පරිශීලකයාට ආරාධනා කරන්න",
                        updateRole: {
                            error: {
                                description: "{{ description }}",
                                message: "පරිපාලක එකතු කිරීමේ දෝෂයකිr."
                            },
                            genericError: {
                                description: "පරිපාලක එකතු කිරීමේදී දෝෂයක් ඇති විය.",
                                message: "පරිපාලක එකතු කිරීමේ දෝෂයකි"
                            },
                            success: {
                                description: "පරිපාලක සාර්ථකව එකතු කරන ලදී.",
                                message: "පරිපාලක එකතු කරන ලදී"
                            }
                        }
                    }
                },
                addUser: {
                    subtitle: "නව පරිශීලකයෙකු එක් කිරීමට පියවර අනුගමනය කරන්න.",
                    title: "පරිශීලක එකතු කරන්න"
                }
            }
        },
        admins: {
            editPage: {
                backButton: "පරිපාලක වෙත ආපසු යන්න"
            }
        },
        invite: {
            notifications: {
                sendInvite: {
                    limitReachError: {
                        description: "අවසර ලත් සහයෝගිතා පරිශීලකයින්ගේ උපරිම සංඛ්‍යාවට ළඟා වී ඇත.",
                        message: "ආරාධනය යැවීමේදී දෝෂයකි"
                    }
                }
            }
        },
        guest: {
            deleteUser: {
                confirmationModal: {
                    content:
                        "කෙසේ වෙතත්, පරිශීලක ගිණුම ස්ථිරවම පද්ධතියෙන් මකා නොදමනු ඇති අතර " +
                        "ඔවුන් සම්බන්ධ වී සිටින වෙනත් සංවිධාන වෙත ප්‍රවේශ වීමට ඔවුන්ට තවමත් හැකි වනු ඇත.",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර පරිශීලකයා මෙම සංවිධානය සමඟ ඇති සම්බන්ධය ඉවත් කරයි. "
                }
            },
            editUser: {
                dangerZoneGroup: {
                    deleteUserZone: {
                        subheader:
                            "මෙම ක්‍රියාව මෙම සංවිධානය සමඟ පරිශීලකයාගේ සම්බන්ධතාවය ඉවත් කරයි. ඉදිරියට යාමට පෙර " +
                            "කරුණාකර සහතික වන්න."
                    }
                }
            }
        },
        sidePanel: {
            categories: {
                attributeManagement: "ගුණාංග කළමනාකරණය",
                AccountManagement: "ගිණුම් කළමනාකරණය",
                userManagement: "පරිශීලක කළමනාකරණය",
                organizationSettings: "සංවිධාන සැකසුම්"
            }
        }
    }
};

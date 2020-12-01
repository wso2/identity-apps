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

import { DevPortalNS } from "../../../models";

export const devPortal: DevPortalNS = {
    componentExtensions: {
        component: {
            application: {
                quickStart: {
                    title: "ඉක්මන් ආරම්භය"
                }
            }
        }
    },
    components: {
        URLInput: {
            withLabel: {
                negative: {
                    content: "යළි-යොමුවීමේ URL හි ආරම්භය {{url}} WSO2 හැඳුනුම් සේවාදායක " +
                        "API වෙත CORS ඉල්ලීම් කිරීමට අවසර නැත.",
                    detailedContent: {
                        0: "පෙරනිමියෙන් WSO2 හැඳුනුම් සේවාදායක API මඟින් CORS ඉල්ලීම් අවහිර කරයි. නමුත් මෙය " +
                            "නීත්‍යානුකූල ඉල්ලීම් දැන ගැනීමෙන් වළක්වා ගත හැකිය",
                        1: "එබැවින් මෙම සම්භවය සඳහා CORS සක්‍රීය කිරීමෙන් <1>{{ tenantName }}</1> කුලී නිවැසියන්ගේ " +
                            "ලියාපදිංචි යෙදුම් වලින් හැඳුනුම් සේවාදායක API වෙත ප්‍රවේශ වීමට ඔබට ඉඩ සලසයි."
                    },
                    header: "CORS අවසර නැත",
                    leftAction: "ඉඩ දෙන්න"
                },
                positive: {
                    content: "යළි-යොමුවීමේ URL හි ආරම්භය {{url}} WSO2 හැඳුනුම් සේවාදායක API " +
                        "වෙත CORS ඉල්ලීම් කිරීමට අවසර ඇත.",
                    detailedContent: {
                        0: "පෙරනිමියෙන් WSO2 හැඳුනුම් සේවාදායක API මඟින් CORS ඉල්ලීම් අවහිර කරයි." +
                            " නමුත් මෙය නීත්‍යානුකූල ඉල්ලීම් දැන ගැනීමෙන් වළක්වා ගත හැකිය",
                        1: "එබැවින් මෙම සම්භවය සඳහා CORS සක්‍රීය කිරීමෙන් <1>{{ tenantName }}</1> කුලී නිවැසියන්ගේ" +
                            " ලියාපදිංචි යෙදුම් වලින් හැඳුනුම් සේවාදායක API වෙත ප්‍රවේශ වීමට ඔබට ඉඩ සලසයි."
                    },
                    header: "CORS සඳහා අවසර ඇත"
                }
            }
        },
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "පෙරහන් ගුණාංගය",
                        placeholder: "උදා. නම, විස්තරය ආදිය.",
                        validations: {
                            empty: "පෙරහන් ගුණාංගය අවශ්‍ය ක්ෂේත්‍රයකි."
                        }
                    },
                    filterCondition: {
                        label: "පෙරහන් තත්වය",
                        placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ.",
                        validations: {
                            empty: "පෙරහන් තත්ත්වය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                        }
                    },
                    filterValue: {
                        label: "පෙරහන් අගය",
                        placeholder: "උදා. පරිපාලක, wso2 ආදිය.",
                        validations: {
                            empty: "පෙරහන් අගය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                        }
                    }
                }
            },
            hints: {
                querySearch: {
                    actionKeys: "Shift + Enter",
                    label: "විමසුමක් ලෙස සෙවීමට"
                }
            },
            options: {
                header: "උසස් සෙවීම"
            },
            placeholder: "{{attribute}} මගින් සොයන්න",
            popups: {
                clear: "පැහැදිලි සෙවීම",
                dropdown: "විකල්ප පෙන්වන්න"
            },
            resultsIndicator: "විමසුම සඳහා ප්‍රතිපල පෙන්වයි \"{{query}}\""
        },
        applications: {
            addWizard: {
                steps: {
                    generalSettings: {
                        heading: "සාමාන්‍ය සැකසුම්"
                    },
                    protocolConfig: {
                        heading: "ප්රොටොකෝල් වින්යාසය"
                    },
                    protocolSelection: {
                        heading: "ප්රොටෝකෝලය තෝරා ගැනීම"
                    },
                    summary: {
                        heading: "සාරාංශය",
                        sections: {
                            accessURL: {
                                heading: "URL වෙත ප්‍රවේශ වන්න"
                            },
                            applicationQualifier: {
                                heading: "අයදුම්පත් සුදුසුකම්"
                            },
                            assertionURLs: {
                                heading: "පාරිභෝගික URL (ය)"
                            },
                            audience: {
                                heading: "ප්‍රේක්ෂකයෝ"
                            },
                            callbackURLs: {
                                heading: "යූආර්එල් (ය) යළි හරවා යැවීම"
                            },
                            certificateAlias: {
                                heading: "සහතික අන්වර්ථය"
                            },
                            discoverable: {
                                heading: "සොයාගත හැකි"
                            },
                            grantType: {
                                heading: "ප්‍රදාන වර්ගය (ය)"
                            },
                            issuer: {
                                heading: "නිකුත් කරන්නා"
                            },
                            metaFile: {
                                heading: "මෙටා ගොනුව (Base64Encoded)"
                            },
                            metadataURL: {
                                heading: "පාර-දත්ත URL"
                            },
                            public: {
                                heading: "පොදු"
                            },
                            realm: {
                                heading: "රාජධානිය"
                            },
                            renewRefreshToken: {
                                heading: "RefreshToken අලුත් කරන්න"
                            },
                            replyTo: {
                                heading: "පිළිතුරු දෙන්න"
                            }
                        }
                    }
                }
            },
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "උදා. නම, විස්තරය ආදිය."
                        },
                        filterCondition: {
                            placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                        },
                        filterValue: {
                            placeholder: "උදා. විශාලනය, විකුණුම් බලකාය ආදිය."
                        }
                    }
                },
                placeholder: "යෙදුම් නාමයෙන් සොයන්න"
            },
            confirmations: {
                deleteApplication: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{ name }}</1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම යෙදුම මකා දැමුවහොත්, ඔබට එය නැවත ලබා ගත නොහැක. මෙය මත පදනම් " +
                        "වූ සියලුම යෙදුම් ද වැඩ කිරීම නවතා දැමිය හැකිය. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර යෙදුම ස්ථිරවම මකා දමනු ඇත."
                },
                deleteOutboundProvisioningIDP: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{ name }}</1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම පිටතට යන ප්‍රතිපාදන IDP මකා දැමුවහොත්, ඔබට එය නැවත ලබා ගත නොහැක." +
                        "කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර අවතැන්වූවන් ඉවත් කරනු ඇත."
                },
                deleteProtocol: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1> {{name}} </1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම ප්‍රොටෝකෝලය මකා දැමුවහොත් ඔබට එය නැවත ලබා ගත නොහැක. මෙය මත" +
                        " පදනම් වූ සියලුම යෙදුම් ද වැඩ කිරීම නවතා දැමිය හැකිය. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර එය ප්‍රොටෝකෝලය ස්ථිරවම මකා දමනු ඇත."
                },
                regenerateSecret: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1> {{id}} </1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම යෙදුම නැවත ප්‍රතිනිර්මාණය කරන්නේ නම්, මෙය මත පදනම් වූ සියලුම යෙදුම් ක්‍රියා" +
                        " කිරීම නවතා දැමිය හැකිය. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර සේවාදායකයාගේ රහස ස්ථිරවම වෙනස් කරයි."
                },
                revokeApplication: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1> {{id}} </1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම යෙදුම අවලංගු කරන්නේ නම්, මෙය මත පදනම් වූ සියලුම යෙදුම් ද ක්‍රියා " +
                        "විරහිත වේ. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "සේවාදායකයාගේ රහස නැවත ප්‍රතිනිර්මාණය කිරීමෙන් මෙම ක්‍රියාව ආපසු හැරවිය හැකිය."
                }
            },
            dangerZoneGroup: {
                deleteApplication: {
                    actionTitle: "මකන්න",
                    header: "යෙදුම මකන්න",
                    subheader: "ඔබ යෙදුමක් මකා දැමූ පසු, ආපසු යාමක් නොමැත. කරුණාකර ස්ථිර වන්න."
                },
                header: "අන්තරා කලාපය"
            },
            edit: {
                sections: {
                    access: {
                        addProtocolWizard: {
                            heading: "ප්රොටෝකෝලය එක් කරන්න",
                            steps: {
                                protocolSelection: {
                                    manualSetup: {
                                        emptyPlaceholder: {
                                            subtitles: "සියලුම ප්‍රොටෝකෝල වින්‍යාස කර ඇත",
                                            title: "සැකිලි නොමැත"
                                        },
                                        heading: "අතින් සැකසුම",
                                        subHeading: "අභිරුචි වින්‍යාසයන් සමඟ ප්‍රොටෝකෝලයක් එක් කරන්න"
                                    },
                                    quickSetup: {
                                        emptyPlaceholder: {
                                            subtitles: "සියලුම ප්‍රොටෝකෝල වින්‍යාස කර ඇත",
                                            title: "සැකිලි නොමැත"
                                        },
                                        heading: "ඉක්මන් පිහිටුවීම්",
                                        subHeading: "අච්චුවකින් ප්‍රොටොකෝල් වින්‍යාසය ලබා ගන්න"
                                    }
                                }
                            },
                            subHeading: "Prot {{appName}} යෙදුමට නව ප්‍රොටෝකෝලයක් එක් කරන්න"
                        },
                        tabName: "ප්රවේශ"
                    },
                    advanced: {
                        tabName: "උසස්"
                    },
                    attributes: {
                        forms: {
                            fields: {
                                dynamic: {
                                    applicationRole: {
                                        label: "අයදුම් කිරීමේ කාර්යභාරය",
                                        validations: {
                                            duplicate: "මෙම භූමිකාව දැනටමත් සිතියම් ගත කර ඇත. කරුණාකර වෙනත්"
                                                + " භූමිකාවක් තෝරන්න",
                                            empty: "කරුණාකර සිතියම සඳහා ලක්ෂණයක් ඇතුළත් කරන්න"
                                        }
                                    },
                                    localRole: {
                                        label: "දේශීය කාර්යභාරය",
                                        validations: {
                                            empty: "කරුණාකර දේශීය භූමිකාව ඇතුළත් කරන්න"
                                        }
                                    }
                                }
                            }
                        },
                        roleMapping: {
                            heading: "භූමිකාව සිතියම්ගත කිරීම"
                        },
                        selection: {
                            addWizard: {
                                header: "ගුණාංග තේරීම යාවත්කාලීන කරන්න",
                                steps: {
                                    select: {
                                        transfer: {
                                            headers: {
                                                attribute: "ගුණාංගය"
                                            },
                                            searchPlaceholders: {
                                                attribute: "සෙවුම් ගුණාංගය",
                                                role: "සෙවුම් කාර්යභාරය"
                                            }
                                        }
                                    }
                                },
                                subHeading: "නව ගුණාංග එකතු කරන්න හෝ පවතින ගුණාංග ඉවත් කරන්න."
                            },
                            heading: "ගුණාංග තේරීම",
                            mappingTable: {
                                actions: {
                                    enable: "සිතියම්කරණය සක්‍රීය කරන්න"
                                },
                                columns: {
                                    appAttribute: "යෙදුම් ගුණාංගය",
                                    attribute: "ගුණාංගය",
                                    mandatory: "අනිවාර්යයි",
                                    requested: "ඉල්ලා"
                                },
                                listItem: {
                                    actions: {
                                        makeMandatory: "අනිවාර්ය කරන්න",
                                        makeRequested: "ඉල්ලීමක් කරන්න",
                                        removeMandatory: "අනිවාර්ය ඉවත් කරන්න",
                                        removeRequested: "ඉල්ලූ දේ ඉවත් කරන්න"
                                    },
                                    fields: {
                                        claim: {
                                            label: "අගය ඇතුලත් කරන්න",
                                            placeholder: "උදා"
                                        }
                                    }
                                },
                                searchPlaceholder: "ගුණාංග සොයන්න"
                            }
                        },
                        tabName: "ගුණාංග"
                    },
                    general: {
                        tabName: "ජනරාල්"
                    },
                    provisioning: {
                        inbound: {
                            heading: "අභ්‍යන්තර ප්‍රතිපාදන",
                            subHeading: "මෙම යෙදුම හරහා WSO2 හැඳුනුම් සේවාදායක පරිශීලක ගබඩාවකට " +
                                "පරිශීලකයින් හෝ කණ්ඩායම් සැපයීම."
                        },
                        outbound: {
                            actions: {
                                addIdp: "නව හැඳුනුම්පත් සපයන්නා"
                            },
                            addIdpWizard: {
                                errors: {
                                    noProvisioningConnector: "තෝරාගත් අනන්‍යතා සැපයුම්කරුට " +
                                        "ප්‍රතිපාදන සම්බන්ධක නොමැත."
                                },
                                heading: "පිටතට යන ප්‍රතිපාදන IDP එක් කරන්න",
                                steps: {
                                    details: "IDP විස්තර"
                                },
                                subHeading: "ඔබගේ යෙදුමට ස්වයං-ලියාපදිංචි වන පරිශීලකයින්ට ප්‍රතිපාදන සැපයීම සඳහා"
                                    + " IDP තෝරන්න."
                            },
                            heading: "පිටතට යන ප්‍රතිපාදන",
                            subHeading: "මෙම යෙදුමේ පරිශීලකයින්ට පිටතට යාම සඳහා අනන්‍යතා " +
                                "සැපයුම්කරුවෙකු වින්‍යාස කරන්න."
                        },
                        tabName: "ප්‍රතිපාදන"
                    },
                    signOnMethod: {
                        sections: {
                            authenticationFlow: {
                                heading: "සත්‍යාපන ප්‍රවාහය",
                                sections: {
                                    scriptBased: {
                                        editor: {
                                            templates: {
                                                darkMode: "අඳුරු ප්‍රකාරය",
                                                heading: "සැකිලි"
                                            }
                                        },
                                        heading: "ස්ක්‍රිප්ට් මත පදනම් වූ වින්‍යාසය",
                                        hint: "අනුවර්තන පිටපතක් හරහා සත්‍යාපන ප්‍රවාහය නිර්වචනය කරන්න. " +
                                            "ආරම්භ කිරීම සඳහා ඔබට පුවරුවේ සිට සැකිලි වලින් එකක් තෝරා ගත හැකිය."
                                    },
                                    stepBased: {
                                        actions: {
                                            addStep: "නව සත්‍යාපන පියවර",
                                            selectAuthenticator: "Authenticator එකක් තෝරන්න"
                                        },
                                        forms: {
                                            fields: {
                                                attributesFrom: {
                                                    label: "වෙතින් ගුණාංග භාවිතා කරන්න",
                                                    placeholder: "පියවර තෝරන්න"
                                                },
                                                subjectIdentifierFrom: {
                                                    label: "සිට විෂය හඳුනාගැනුම භාවිතා කරන්න",
                                                    placeholder: "පියවර තෝරන්න"
                                                }
                                            }
                                        },
                                        heading: "පියවර පදනම් කරගත් වින්‍යාසය",
                                        hint: "දේශීය / ෆෙඩරල් සත්‍යාපනය කරන්නන් අදාළ පියවර වෙත ඇදගෙන " +
                                            "යාමෙන් සත්‍යාපන පියවර සාදන්න."
                                    }
                                }
                            },
                            requestPathAuthenticators: {
                                notifications: {
                                    getRequestPathAuthenticators: {
                                        error: {
                                            description: "{{ description }}",
                                            message: "ලබා ගැනීමේ දෝෂයකි"
                                        },
                                        genericError: {
                                            description: "ඉල්ලීම් මාර්ග සත්‍යාපකයන් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය." +
                                                "authenticators.",
                                            message: "ලබා ගැනීමේ දෝෂයකි"
                                        },
                                        success: {
                                            description: "",
                                            message: ""
                                        }
                                    }
                                },
                                subTitle: "ඉල්ලීම් මාර්ග සත්‍යාපනය සඳහා දේශීය සත්‍යාපකය.",
                                title: "මාර්ග සත්‍යාපනය ඉල්ලන්න"
                            },
                            templateDescription: {
                                description: {
                                    code: "කේතය",
                                    defaultSteps: "පෙරනිමි පියවර",
                                    description: "විස්තර",
                                    helpReference: "උදව් යොමු කිරීම",
                                    parameters: "පරාමිතීන්",
                                    prerequisites: "පූර්වාවශ්යතාවයන්"
                                },
                                popupContent: "වැඩිපුර විස්තර"
                            }
                        },
                        tabName: "පුරනය වීමේ ක්‍රමය"
                    }
                }
            },
            forms: {
                advancedAttributeSettings: {
                    sections: {
                        role: {
                            fields: {
                                role: {
                                    hint: "මෙම විකල්පය මඟින් පරිශීලකයා භූමිකාව සඳහා වාසය කරන " +
                                        "පරිශීලක ගබඩා වසම එකතු කරනු ඇත",
                                    label: "පරිශීලක වසම ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "භූමිකාව තෝරන්න"
                                    }
                                },
                                roleAttribute: {
                                    hint: "ගුණාංගය තෝරන්න",
                                    label: "භූමිකාව",
                                    validations: {
                                        empty: "භූමිකාව තෝරන්න"
                                    }
                                }
                            },
                            heading: "කාර්යභාරය"
                        },
                        subject: {
                            fields:{
                                subjectAttribute: {
                                    hint: "ගුණාංගය තෝරන්න",
                                    label: "විෂය ගුණාංගය",
                                    validations: {
                                        empty: "විෂය ගුණාංගය තෝරන්න"
                                    }
                                },
                                subjectIncludeTenantDomain: {
                                    hint: "මෙම විකල්පය කුලී නිවැසියන්ගේ වසම දේශීය විෂය හඳුනාගැනුමට එකතු කරයි",
                                    label: "කුලී නිවැසියන්ගේ වසම ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                subjectIncludeUserDomain: {
                                    hint: "මෙම විකල්පය මඟින් පරිශීලකයා දේශීය විෂය හඳුනාගැනීමේදී වාසය කරන " +
                                        "පරිශීලක ගබඩා වසම එකතු කරනු ඇත",
                                    label: "පරිශීලක වසම ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                subjectUseMappedLocalSubject: {
                                    hint: "මෙම විකල්පය අනන්‍යතාවය තහවුරු කිරීමේදී දේශීය විෂය " +
                                        "හඳුනාගැනුම භාවිතා කරයි",
                                    label: "සිතියම් ගත කළ දේශීය විෂය භාවිතා කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "විෂය"
                        }
                    }
                },
                advancedConfig: {
                    fields: {
                        enableAuthorization: {
                            hint: "සත්‍යාපන ප්‍රවාහයන් අතරතුරදී බලය පැවරීමේ ප්‍රතිපත්ති ක්‍රියාත්මක කළ යුතුද " +
                                "යන්න තීරණය කරයි.",
                            label: "අවසරය සබල කරන්න",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        returnAuthenticatedIdpList: {
                            hint: "සත්‍යාපන ප්‍රතිචාරයේදී සත්‍යාපිත හැඳුනුම්පත් සපයන්නන්ගේ " +
                                "ලැයිස්තුව ආපසු ලබා දෙනු ඇත.",
                            label: "සත්‍යාපිත IDP ලැයිස්තුව ආපසු එවන්න",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        saas: {
                            hint: "සේවා සැපයුම්කරුගේ කුලී නිවැසියන්ගේ භාවිතය සඳහා යෙදුම් පෙරනිමියෙන් සීමා " +
                                "කර ඇත. මෙම යෙදුම SaaS සක්‍රීය කර ඇත්නම් එය සියලු " +
                                "කුලී නිවැසියන්ගේ සියලු පරිශීලකයින් සඳහා විවෘත වේ.",
                            label: "SaaS යෙදුම",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        skipConsentLogin: {
                            hint: "සක්‍රිය කිරීමෙන් පසු, පුරනය වීමේදී පරිශීලක කැමැත්ත ලබා ගැනීම සඳහා පිටු " +
                                "විමසුම මෙම යෙදුම සඳහා මඟ හරිනු ඇත.",
                            label: "පුරනය වීමේ කැමැත්ත මඟ හරින්න",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        skipConsentLogout: {
                            hint: "සක්‍රිය කිරීමෙන් පසු, පිටවීමේදී පරිශීලක කැමැත්ත ලබා ගැනීම සඳහා පිටු " +
                                "විමසුම මෙම යෙදුම සඳහා මඟ හරිනු ඇත.",
                            label: "ඉවත් වීමේ කැමැත්ත මඟ හරින්න",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        }
                    },
                    sections: {
                        certificate: {
                            fields: {
                                jwksValue: {
                                    label: "වටිනාකම",
                                    placeholder: "යෙදුම JWKS අන්ත ලක්ෂ්‍ය URL.",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි.",
                                        invalid: "මෙය වලංගු URL එකක් නොවේ"
                                    }
                                },
                                pemValue: {
                                    actions: {
                                        view: "සහතික තොරතුරු බලන්න"
                                    },
                                    hint: "යෙදුමේ සහතිකය (PEM ආකෘතියෙන්).",
                                    label: "වටිනාකම",
                                    placeholder: "PEM ආකෘතියෙන් සහතිකය.",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                type: {
                                    children: {
                                        jwks: {
                                            label: "JWKS අන්ත ලක්ෂ්‍යය භාවිතා කරන්න"
                                        },
                                        pem: {
                                            label: "සහතිකය ලබා දෙන්න"
                                        }
                                    },
                                    label: "වර්ගය"
                                }
                            },
                            heading: "සහතිකය"
                        }
                    }
                },
                generalDetails: {
                    fields: {
                        accessUrl: {
                            hint: "සොයාගත හැකි ලෙස සලකුණු කර ඇති යෙදුම් අවසාන පරිශීලකයින් සඳහා දැකිය හැකිය.",
                            label: "URL වෙත ප්‍රවේශ වන්න",
                            placeholder: "යෙදුම් පිවිසුම් පිටුව සඳහා ප්‍රවේශ url ඇතුල් කරන්න",
                            validations: {
                                empty: "යෙදුමක් සොයාගත හැකි යැයි සලකුණු කිරීම සඳහා වලංගු ප්‍රවේශ " +
                                    "URL එකක් අර්ථ දැක්විය යුතුය",
                                invalid: "මෙය වලංගු URL එකක් නොවේ"
                            }
                        },
                        description: {
                            label: "විස්තර",
                            placeholder: "යෙදුම සඳහා විස්තරයක් ඇතුළත් කරන්න"
                        },
                        discoverable: {
                            label: "සොයාගත හැකි යෙදුම"
                        },
                        imageUrl: {
                            label: "යෙදුම් රූපය",
                            placeholder: "යෙදුම සඳහා අනුරූප url එකක් ඇතුළත් කරන්න",
                            validations: {
                                invalid: "මෙය වලංගු රූප URL එකක් නොවේ"
                            }
                        },
                        name: {
                            label: "නම",
                            placeholder: "යෙදුම සඳහා නමක් ඇතුළත් කරන්න.",
                            validations: {
                                duplicate: "මෙම නම සහිත යෙදුමක් දැනටමත් තිබේ." +
                                    " කරුණාකර වෙනත් නමක් ඇතුළත් කරන්න.",
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        }
                    }
                },
                inboundCustom: {
                    fields: {
                        checkbox: {
                            label: "{{label}}",
                            validations: {
                                empty: "{{name} සපයන්න"
                            }
                        },
                        dropdown: {
                            label: "{{label}}",
                            placeholder: "{{name} ඇතුලත් කරන්න",
                            validations: {
                                empty: "{{name} සපයන්න"
                            }
                        },
                        generic: {
                            label: "{{label}}",
                            validations: {
                                empty: "{{name} Select තෝරන්න"
                            }
                        },
                        password: {
                            label: "{{label}}",
                            placeholder: "{{name} ඇතුලත් කරන්න",
                            validations: {
                                empty: "{{name} සපයන්න"
                            }
                        }
                    }
                },
                inboundOIDC: {
                    fields: {
                        allowedOrigins: {
                            hint: "අවසර ලත් මූලාරම්භය යනු හරස් ප්‍රභවයේ සිට WSO2 හැඳුනුම් සේවාදායක API " +
                                "වෙත ඉල්ලීම් කිරීමට ඉඩ දෙන URL ය",
                            label: "අවසර ලත් මූලයන්",
                            placeholder: "අවසර ලත් මූලයන් ඇතුළත් කරන්න",
                            validations: {
                                empty: "කරුණාකර වලංගු ප්‍රභවයක් එක් කරන්න."
                            }
                        },
                        callBackUrls: {
                            hint: "සත්‍යාපනයෙන් පසුව, අපි ඉහත යළි-යොමුවීම් URL වෙත පමණක් හරවා " +
                                "යවන අතර ඔබට බහු URL නියම කළ හැකිය",
                            label: "URL යලි හරවන්න",
                            placeholder: "යළි-යොමුවීම් URL ඇතුළත් කරන්න",
                            validations: {
                                empty: "කරුණාකර වලංගු URL එකක් එක් කරන්න."
                            }
                        },
                        clientID: {
                            label: "සේවාලාභී හැඳුනුම්පත"
                        },
                        clientSecret: {
                            hashedDisclaimer: "සේවාලාභී රහස හෑෂ් කර ඇත. ඔබට එය ලබා " +
                                "ගැනීමට අවශ්‍ය නම්, කරුණාකර රහස නැවත ප්‍රතිනිර්මාණය කරන්න.",
                            hideSecret: "රහස සඟවන්න",
                            label: "සේවාලාභී රහස",
                            placeholder: "සේවාලාභී රහස ඇතුළත් කරන්න",
                            showSecret: "රහස පෙන්වන්න",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        grant: {
                            hint: "යෙදුම ටෝකන් සේවාව සමඟ සන්නිවේදනය කරන්නේ කෙසේද යන්න මෙය තීරණය කරයි",
                            label: "අවසර ලත් වර්ගය",
                            validations: {
                                empty: "අවම වශයෙන් ප්‍රදාන වර්ගයක් තෝරන්න"
                            }
                        },
                        public: {
                            hint: "සේවාදායක රහසක් නොමැතිව සත්‍යාපනය කිරීමට සේවාදායකයාට ඉඩ දෙන්න.",
                            label: "මහජන සේවාදායකයා",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        }
                    },
                    sections: {
                        accessToken: {
                            fields: {
                                bindingType: {
                                    label: "ටෝකන් බන්ධන වර්ගය"
                                },
                                expiry: {
                                    hint: "පරිශීලක ප්‍රවේශ ටෝකන කල් ඉකුත් වීමේ කාලය (තත්පර වලින්)"
                                        + " වින්‍යාස කරන්න.",
                                    label: "පරිශීලක ප්‍රවේශ ටෝකන කල් ඉකුත් වීමේ කාලය",
                                    placeholder: "පරිශීලක ප්‍රවේශ ටෝකන කල් ඉකුත් වීමේ වේලාව ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "කරුණාකර පරිශීලක ප්‍රවේශ ටෝකන කල් ඉකුත් වීමේ කාලය පුරවන්න"
                                    }
                                },
                                revokeToken: {
                                    hint: "පරිශීලක ලොග්අවුට් හරහා සීමිත අවතැන්වූවන්ගේ සැසිය අවසන් වූ විට " +
                                        "මෙම යෙදුමේ ටෝකන අවලංගු කිරීමට ඉඩ දෙන්න.",
                                    label: "පරිශීලක ලොග්අවුට් මත ටෝකන අවලංගු කරන්න"
                                },
                                type: {
                                    label: "ටෝකන් වර්ගය"
                                },
                                validateBinding: {
                                    hint: "API ආයාචනා අතරතුර ටෝකන බන්ධන වලංගු කිරීම සක්‍රීය කරන්න",
                                    label: "ටෝකන් බන්ධන වලංගු කරන්න"
                                }
                            },
                            heading: "ටෝකනයට ප්‍රවේශ වන්න",
                            hint: "ප්‍රවේශ ටෝකන නිකුත් කරන්නා, පරිශීලක ප්‍රවේශ ටෝකන කල් ඉකුත් වීමේ කාලය, " +
                                "යෙදුම් ප්‍රවේශ ටෝකන කල් ඉකුත් වීමේ කාලය ආදිය වින්‍යාස කරන්න."
                        },
                        idToken: {
                            fields: {
                                algorithm: {
                                    hint: "සේවාදායකයා සඳහා ID ටෝකනයේ සංකේතාංකන ඇල්ගොරිතම තෝරන්න.",
                                    label: "ඇල්ගොරිතම",
                                    placeholder: "ඇල්ගොරිතම තෝරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                audience: {
                                    hint: "හැඳුනුම් ටෝකනය අදහස් කරන ලබන්නන්.",
                                    label: "ප්‍රේක්ෂකයෝ",
                                    placeholder: "ප්‍රේක්ෂකයින් ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "කරුණාකර සබය පුරවන්න"
                                    }
                                },
                                encryption: {
                                    hint: "හැඳුනුම්පත් සංකේතාංකනය සක්‍රීය කරන්න.",
                                    label: "සංකේතනය සක්‍රීය කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                expiry: {
                                    hint: "හැඳුනුම් ටෝකන කල් ඉකුත් වීමේ කාලය (තත්පර වලින්) වින්‍යාස කරන්න.",
                                    label: "හැඳුනුම්පත් කල් ඉකුත් වීමේ කාලය",
                                    placeholder: "හැඳුනුම් ටෝකන කල් ඉකුත් වීමේ වේලාව ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "කරුණාකර හැඳුනුම්පත් ටෝකන කල් ඉකුත් වීමේ කාලය පුරවන්න"
                                    }
                                },
                                method: {
                                    hint: "හැඳුනුම්පත් සංකේතාංකනය සඳහා ක්‍රමය තෝරන්න.",
                                    label: "ගුප්තකේතන ක්‍රමය",
                                    placeholder: "ක්රමය තෝරන්න",
                                    validations: {
                                        empty:  "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "ID ටෝකන්"
                        },
                        logoutURLs: {
                            fields: {
                                back: {
                                    label: "ආපසු නාලිකා ලොග්අවුට් URL",
                                    placeholder: "පසුපස නාලිකා ලොග්අවුට් URL එක ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "කරුණාකර පසුපස නාලිකා ලොග්අවුට් URL පුරවන්න",
                                        invalid: "කරුණාකර වලංගු URL එක් කරන්න"
                                    }
                                },
                                front: {
                                    label: "ඉදිරිපස නාලිකා ලොග්අවුට් URL",
                                    placeholder: "ඉදිරිපස නාලිකා ලොග්අවුට් URL එක ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "කරුණාකර ඉදිරිපස නාලිකා ලොග්අවුට් URL පුරවන්න",
                                        invalid: "කරුණාකර වලංගු URL එක් කරන්න"
                                    }
                                },
                                signatureValidation: {
                                    label: "ඉල්ලීම් වස්තු අත්සන වලංගු කිරීම සක්‍රීය කරන්න"
                                }
                            },
                            heading: "PKCE"
                        },
                        pkce: {
                            fields: {
                                pkce: {
                                    children: {
                                        mandatory: {
                                            label: "PKCE අනිවාර්යයි"
                                        },
                                        plainAlg: {
                                            label: "PKCE 'ප්ලේන්' ට්‍රාන්ස්ෆෝමර් ඇල්ගොරිතම සඳහා සහය දක්වන්න"
                                        }
                                    },
                                    label: "{{label}}",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "PKCE",
                            hint: "PKCE (RFC 7636) යනු ඇතැම් ප්‍රහාර වැළැක්වීම සහ මහජන සේවාදායකයින්ගෙන්" +
                                " OAuth හුවමාරුව ආරක්ෂිතව සිදු කිරීම සඳහා " +
                                "බලය පැවරීමේ කේත ප්‍රවාහයේ දිගුවකි."
                        },
                        refreshToken: {
                            fields: {
                                expiry: {
                                    hint: "නැවුම් ටෝකන කල් ඉකුත් වීමේ කාලය (තත්පර වලින්) වින්‍යාස කරන්න.",
                                    label: "ටෝකන කල් ඉකුත් වීමේ වේලාව නැවුම් කරන්න",
                                    placeholder: "නැවුම් ටෝකන කල් ඉකුත් වීමේ වේලාව ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "කරුණාකර නැවුම් ටෝකන කල් ඉකුත් වීමේ කාලය පුරවන්න"
                                    }
                                },
                                renew: {
                                    hint: "Refresh ටෝකන් ප්‍රදාන භාවිතා කරන විට ඉල්ලීමකට නව නැවුම් ටෝකනයක්"
                                        + " නිකුත් කරන්න.",
                                    label: "නැවුම් කිරීමේ ටෝකනය කරකවන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "ටෝකනය නැවුම් කරන්න"
                        },
                        scopeValidators: {
                            fields: {
                                validator: {
                                    label: "{{label}}",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "විෂය පථ වලංගු කරන්නන්"
                        }
                    }
                },
                inboundSAML: {
                    fields: {
                        assertionURLs: {
                            hint: "සත්‍යාපනය සාර්ථක වූ පසු බ්‍රව්සරය යළි හරවා යැවිය යුතු බවට පාරිභෝගික " +
                                "URL ය මෙයින් තහවුරු වේ. මෙය යෙදුමේ " +
                                "සහතික කිරීමේ පාරිභෝගික සේවය (ACS) URL ය.",
                            label: "පාරිභෝගික URL ප්‍රකාශ කිරීම",
                            placeholder: "සහතික කිරීමේ URL ඇතුල් කරන්න",
                            validations: {
                                invalid: "කරුණාකර වලංගු URL එක් කරන්න"
                            }
                        },
                        defaultAssertionURL: {
                            hint: "බහු ප්‍රකාශිත පාරිභෝගික URL තිබිය හැකි බැවින්, සත්‍යාපන " +
                                "ඉල්ලීමෙන් ඔබට එය ලබා ගැනීමට නොහැකි වූ විට, " +
                                "ඔබ පෙරනිමි ප්‍රකාශක පාරිභෝගික URL එකක් අර්ථ දැක්විය යුතුය.",
                            label: "පෙරනිමි ප්‍රකාශය පාරිභෝගික URL",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        idpEntityIdAlias: {
                            hint: "මෙම අගයට අනන්‍යතා සැපයුම්කරුගේ හැඳුනුම්පත අභිබවා යා හැකි අතර එය " +
                                "නේවාසික අනන්‍යතා සැපයුම්කරුගේ SAML SSO අභ්‍යන්තර සත්‍යාපන " +
                                "වින්‍යාසය යටතේ දක්වා ඇත. ජනනය කරන ලද SAML ප්‍රතිචාරය නිකුත් " +
                                "කරන්නා ලෙස හැඳුනුම්පත් සපයන්නාගේ ආයතන හැඳුනුම්පත භාවිතා කරයි.",
                            label: "Idp పరిధిI අන්වර්ථය",
                            placeholder: "අන්වර්ථය ඇතුළත් කරන්න",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        issuer: {
                            hint: "මෙය නිකුත් කරන්නා නියම කරයි. මේ 'සම්ල්' ය" +
                                "contains the unique identifier of the Application. This is also the issuer value" +
                                "specified in the SAML Authentication Request issued by the Application.",
                            label: "නිකුත් කරන්නා",
                            placeholder: "නිකුත් කරන්නාගේ නම ඇතුළත් කරන්න",
                            validations: {
                                empty: "කරුණාකර නිකුත් කරන්නාට සපයන්න"
                            }
                        },
                        metaURL: {
                            hint: "මෙටා ගොනුව සඳහා URL",
                            label: "මෙටා URL",
                            placeholder: "මෙටා ගොනු url ඇතුල් කරන්න",
                            validations: {
                                empty: "කරුණාකර මෙටා ගොනු url ලබා දෙන්න",
                                invalid: "මෙය වලංගු URL එකක් නොවේ"
                            }
                        },
                        mode: {
                            children: {
                                manualConfig: {
                                    label: "අතින් වින්‍යාසය"
                                },
                                metadataFile: {
                                    label: "පාර-දත්ත ගොනුව"
                                },
                                metadataURL: {
                                    label: "පාර-දත්ත URL"
                                }
                            },
                            hint: "Saml වින්‍යාස කිරීමට මාතය තෝරන්න.",
                            label: "මාදිලිය"
                        },
                        qualifier: {
                            hint: "මෙම අගය අවශ්‍ය වන්නේ එකම නිකුත් කරන්නාගේ අගය සඳහා බහු SAML SSO " +
                                "අභ්‍යන්තර සත්‍යාපන වින්‍යාසයන් වින්‍යාස කිරීමට සිදුවුවහොත් පමණි. මෙහි අර්ථ " +
                                "දක්වා ඇති සුදුසුකම් යන්ත්‍රය ක්‍රියාත්මක වන වේලාවේදී සුවිශේෂී ලෙස යෙදුමක් හඳුනා " +
                                "ගැනීම සඳහා අභ්‍යන්තරව නිකුත් කරන්නාට එකතු කරනු ලැබේ.",
                            label: "අයදුම්පත් සුදුසුකම්",
                            placeholder: "යෙදුම් සුදුසුකම් ඇතුළත් කරන්න",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        }
                    },
                    sections: {
                        assertion: {
                            fields: {
                                audience: {
                                    hint: "සබය සීමා කරන්න.",
                                    label: "ප්‍රේක්ෂකයෝ",
                                    placeholder: "ප්‍රේක්ෂකයින් ඇතුළත් කරන්න",
                                    validations: {
                                        invalid: "කරුණාකර වලංගු URL එක් කරන්න"
                                    }
                                },
                                nameIdFormat: {
                                    hint: "අනන්‍යතා සැපයුම්කරු විසින් සහාය දක්වන නාම හඳුනාගැනීමේ ආකෘති මෙය " +
                                        "අර්ථ දක්වයි. පරිශීලකයෙකු පිළිබඳ තොරතුරු සැපයීමට " +
                                        "නාම හඳුනාගැනීම් භාවිතා කරයි.",
                                    label: "නම හැඳුනුම් ආකෘතිය",
                                    placeholder: "නාම හැඳුනුම් ආකෘතිය ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                recipients: {
                                    hint:  "ප්‍රතිචාරයේ ලබන්නන් වලංගු කරන්න.",
                                    label: "ලබන්නන්",
                                    placeholder: "ලබන්නන් ඇතුළත් කරන්න",
                                    validations: {
                                        invalid: "කරුණාකර වලංගු URL එක් කරන්න"
                                    }
                                }
                            },
                            heading: "ප්‍රකාශ කිරීම"
                        },
                        attributeProfile: {
                            fields: {
                                enable: {
                                    hint: "හැඳුනුම්පතෙහි මූලික ගුණාංග පැතිකඩක් සඳහා අනන්‍යතා සේවාදායකයා " +
                                        "සහාය ලබා දෙයි, එහිදී අනන්‍යතා සැපයුම්කරුට SAML ප්‍රකාශයන්හි පරිශීලකයාගේ " +
                                        "ගුණාංග ඇතුළත් කළ හැකිය.",
                                    label: "සක්‍රීය කරන්න"
                                },
                                includeAttributesInResponse: {
                                    hint: "සෑම විටම ප්‍රතිචාරයේ ගුණාංග ඇතුළත් කිරීම සඳහා ඔබ පිරික්සුම් කොටුව " +
                                        "තෝරාගත් පසු, අනන්‍යතා සැපයුම්කරු සෑම විටම SAML ආරෝපණ ප්‍රකාශයේ " +
                                        "තෝරාගත් හිමිකම් වලට අදාළ ගුණාංග අගයන් ඇතුළත් කරයි.",
                                    label: "සෑම විටම ප්‍රතිචාර වශයෙන් ගුණාංග ඇතුළත් කරන්න"
                                },
                                serviceIndex: {
                                    hint: "අගයක් ස්වයංක්‍රීයව ජනනය නොවන්නේ නම් මෙය විකල්ප ක්ෂේත්‍රයකි." +
                                        "automatically.",
                                    label: "පරිභෝජන සේවා දර්ශකය ආරෝපණය කරන්න",
                                    placeholder: "ආරෝපණ පරිභෝජන සේවා දර්ශකය ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "ආරෝපණ පැතිකඩ"
                        },
                        encryption: {
                            fields: {
                                assertionEncryption: {
                                    label: "සක්‍රීය කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                assertionEncryptionAlgorithm: {
                                    label: "ප්‍රකාශ කිරීමේ සංකේතාංකන ඇල්ගොරිතම",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                keyEncryptionAlgorithm: {
                                    label: "යතුරු සංකේතාංකන ඇල්ගොරිතම",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "ගුප්ත කේතනය"
                        },
                        idpInitiatedSLO: {
                            fields: {
                                enable: {
                                    hint: "මෙය සක්‍රිය කර ඇති විට, සේවා සපයන්නා SAML ඉල්ලීම යැවීමට අවශ්‍ය නොවේ." +
                                        "the SAML request.",
                                    label: "සක්‍රීය කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                returnToURLs: {
                                    label: "URL වෙත ආපසු යන්න",
                                    placeholder: "URL ඇතුලත් කරන්න",
                                    validations: {
                                        invalid: "කරුණාකර වලංගු URL එක් කරන්න"
                                    }
                                }
                            },
                            heading: "Idp ආරම්භ කරන ලද තනි ලොග්අවුට්"
                        },
                        requestProfile: {
                            fields: {
                                enable: {
                                    label: "ප්‍රකාශ විමසුම් පැතිකඩ සක්‍රීය කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "ප්‍රකාශ විමසුම / ඉල්ලුම් පැතිකඩ"
                        },
                        requestValidation: {
                            fields: {
                                signatureValidation: {
                                    hint: "හැඳුනුම්පත් සපයන්නා විසින් SAML2 සත්‍යාපන ඉල්ලීමේ අත්සන සහ " +
                                        "යෙදුම විසින් යවන SAML2 ලොග්අවුට් ඉල්ලීම වලංගු කළ යුතුද " +
                                        "යන්න මෙයින් නියම කෙරේ.",
                                    label: "ඉල්ලීම් අත්සන වලංගු කිරීම සක්‍රීය කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                signatureValidationCertAlias: {
                                    hint: "අයදුම්පත් සහතිකය ලබා දෙන්නේ නම් එය භාවිතා කරනු ඇති අතර ඉහත" +
                                        " තෝරාගත් සහතිකය නොසලකා හරිනු ඇත.",
                                    label: "වලංගු කිරීමේ සහතිකය අන්වර්ථය ඉල්ලන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "වලංගුකරණය ඉල්ලීම"
                        },
                        responseSigning: {
                            fields: {
                                digestAlgorithm: {
                                    label: "ඩයිජෙස්ට් ඇල්ගොරිතම",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                responseSigning: {
                                    hint: "සත්‍යාපන ක්‍රියාවලියෙන් පසු ලැබෙන SAML2 ප්‍රතිචාර අත්සන් කරන්න.",
                                    label: "SAML ප්‍රතිචාර අත්සන් කරන්න"
                                },
                                signingAlgorithm: {
                                    label: "ඇල්ගොරිතම අත්සන් කිරීම",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "ප්‍රකාශය / ප්‍රතිචාර අත්සන් කිරීම"
                        },
                        sloProfile: {
                            fields: {
                                enable: {
                                    label: "සක්‍රීය කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                logoutMethod: {
                                    label: "පිටවීමේ ක්‍රමය",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                requestURL: {
                                    label: "තනි පිටවීමේ ඉල්ලීම් URL",
                                    placeholder: "තනි ලොග්අවුට් ඉල්ලීම් URL ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි.",
                                        invalid: "මෙය වලංගු URL එකක් නොවේ"
                                    }
                                },
                                responseURL: {
                                    label: "තනි පිටවීමේ ප්‍රතිචාර URL",
                                    placeholder: "තනි වර්‍ග ප්‍රතිචාර URL ය ඇතුළත් කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි.",
                                        invalid: "මෙය වලංගු URL එකක් නොවේ"
                                    }
                                }
                            },
                            heading: "තනි පිටවීමේ පැතිකඩ"
                        },
                        ssoProfile: {
                            fields: {
                                artifactBinding: {
                                    hint: "අයදුම්පත් සහතිකයට එරෙහිව කලාත්මක විසඳුම් ඉල්ලීම් අත්සන වලංගු වේ." +
                                        "the Application certificate.",
                                    label: "කෞතුක බන්ධන සඳහා අත්සන වලංගු කිරීම සක්‍රීය කරන්න"
                                },
                                bindings: {
                                    hint: "SAML පණිවිඩ ප්‍රවාහනය කිරීමේ යාන්ත්‍රණයන්.",
                                    label: "බන්ධන",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                },
                                idpInitiatedSSO: {
                                    label: "IDP ආරම්භක SSO සක්‍රීය කරන්න",
                                    validations: {
                                        empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                                    }
                                }
                            },
                            heading: "පැතිකඩ මත තනි සං Sign ා"
                        }
                    }
                },
                inboundSTS: {
                    fields: {
                        realm: {
                            hint: "උදාසීන sts සඳහා තාත්වික හඳුනාගැනුම ඇතුළත් කරන්න",
                            label: "රාජධානිය",
                            placeholder: "රාජධානියට ඇතුළු වන්න.",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි."
                            }
                        },
                        replyTo: {
                            hint: "ප්‍රතිචාරය හසුරුවන ආර්පී එන්ඩ්පොයින්ට් URL ඇතුල් කරන්න.",
                            label: "පිළිතුරු URL",
                            placeholder: "පිළිතුරු URL ඇතුලත් කරන්න",
                            validations: {
                                empty: "මෙය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි.",
                                invalid: "මෙය වලංගු URL එකක් නොවේ"
                            }
                        }
                    }
                },
                inboundWSTrust: {
                    fields: {
                        audience: {
                            hint: "විශ්වාසදායක පක්ෂයේ අවසාන ලක්ෂ්‍ය ලිපිනය.",
                            label: "ප්‍රේක්ෂකයෝ",
                            placeholder: "ප්‍රේක්ෂකයින් ඇතුළත් කරන්න",
                            validations: {
                                empty: "ප්‍රේක්ෂකයන් ඇතුළත් කරන්න.",
                                invalid: "මෙය වලංගු URL එකක් නොවේ"
                            }
                        },
                        certificateAlias: {
                            hint: "විශ්වාසදායක පක්ෂයේ පොදු සහතිකය.",
                            label: "සහතික අන්වර්ථය",
                            placeholder: "ප්‍රේක්ෂකයින් ඇතුළත් කරන්න",
                            validations: {
                                empty: "සහතිකය අන්වර්ථය තෝරන්න"
                            }
                        }
                    }
                },
                outboundProvisioning: {
                    fields: {
                        blocking: {
                            hint: "ප්‍රතිපාදන සම්පුර්ණ වන තුරු සත්‍යාපන ප්‍රවාහය අවහිර කරන්න.",
                            label: "අවහිර කිරීම"
                        },
                        connector: {
                            label: "ප්‍රතිපාදන සම්බන්ධකය",
                            placeholder: "ප්‍රතිපාදන සම්බන්ධකය තෝරන්න",
                            validations: {
                                empty: "ප්‍රතිපාදන සම්බන්ධකයක් තෝරා ගැනීම අනිවාර්ය වේ."
                            }
                        },
                        idp: {
                            label: "හැඳුනුම්පත් සපයන්නා",
                            placeholder: "අනන්‍යතා සැපයුම්කරු තෝරන්න",
                            validations: {
                                empty: "අවතැන්වූවෙකු තෝරා ගැනීම අනිවාර්ය වේ."
                            }
                        },
                        jit: {
                            hint: "නියමිත වේලාවට ප්‍රතිපාදන භාවිතා කරමින් සත්‍යාපනය කළ ගබඩාවට"
                                + " පරිශීලකයින් සැපයීම.",
                            label: "පිටතට යන JIT"
                        },
                        rules: {
                            hint: "කලින් නිර්වචනය කරන ලද XACML නීති මත පදනම්ව ප්‍රතිපාදන භාවිතා කරන්නන්",
                            label: "රීති සබල කරන්න"
                        }
                    }
                },
                provisioningConfig: {
                    fields: {
                        proxyMode: {
                            hint: "පරිශීලකයින් / කණ්ඩායම් පරිශීලක ගබඩාවට ලබා දී නොමැත. ඒවා පිටතට " +
                                "යන ප්‍රතිපාදන පමණි.",
                            label: "ප්‍රොක්සි ප්‍රකාරය"
                        },
                        userstoreDomain: {
                            hint: "පරිශීලකයින් සහ කණ්ඩායම් සැපයීම සඳහා පරිශීලක වෙළඳසැල් වසම් නාමය තෝරන්න.",
                            label: "පරිශීලක වෙළඳසැල් වසම සැපයීම"
                        }
                    }
                }
            },
            helpPanel: {
                tabs: {
                    configs: {
                        content: {
                            subTitle: "යෙදුම සඳහා වින්‍යාස කර ඇති ප්‍රොටෝකෝලය (OIDC, SAML, WS-Trust, ආදිය) " +
                                "මත පදනම්ව අච්චුව හරහා කලින් නිර්වචනය කළ වින්‍යාසයන් " +
                                "යාවත්කාලීන කරන්න හෝ නව වින්‍යාසයන් එක් කරන්න.",
                            title: "යෙදුම් වින්‍යාස කිරීම"
                        },
                        heading: "වින්‍යාස කිරීමේ මාර්ගෝපදේශය"
                    },
                    docs: {
                        content: null,
                        heading: "ලියකියවිලි"
                    },
                    samples: {
                        content: {
                            sample: {
                                configurations: {
                                    btn: "වින්‍යාසය බාගන්න",
                                    subTitle: "නියැදිය සමඟ සේවාදායකයේ සාදන ලද යෙදුම ඒකාබද්ධ කිරීම සඳහා, " +
                                        "ඔබ පහත සඳහන් වින්‍යාසයන් සමඟ සේවාදායකයා " +
                                        "ආරම්භ කළ යුතුය.",
                                    title: "සේවාදායකයා ආරම්භ කරන්න"
                                },
                                downloadSample: {
                                    btn: "නියැදිය බාගන්න",
                                    subTitle: "මෙම නියැදි යෙදුම මඟින් WSO2 හැඳුනුම් සේවාදායකයේ SDK " +
                                        "භාවිතය සහ හැඳුනුම් සේවාදායකය සමඟ ඕනෑම " +
                                        "යෙදුමක් ඒකාබද්ධ කළ හැකි ආකාරය පෙන්වයි.",
                                    title: "නියැදිය අත්හදා බලන්න"
                                },
                                goBack: "ආපසු යන්න",
                                subTitle: "අපගේ පෙර සැකසූ නියැදි යෙදුම බාගත කිරීමෙන් ඉක්මනින් " +
                                    "මූලාකෘතිකරණය ආරම්භ කරන්න.",
                                title: "නියැදි යෙදුම්"
                            },
                            technology: {
                                subTitle: "ඔබ තාක්ෂණයක් තෝරාගත් පසු නියැදි සහ අවශ්‍ය SDKs සහ ප්‍රයෝජනවත් " +
                                    "තොරතුරු ලබා දෙනු ඇත",
                                title: "තාක්ෂණයක් තෝරන්න"
                            }
                        },
                        heading: "සාම්පල"
                    },
                    sdks: {
                        content: {
                            sdk: {
                                goBack: "ආපසු යන්න",
                                subTitle: "ඔබගේ යෙදුම් සංවර්ධනය ආරම්භ කිරීමට පහත මෘදුකාංග " +
                                    "සංවර්ධන කට්ටල භාවිතා කළ හැකිය.",
                                title: "මෘදුකාංග සංවර්ධන කට්ටල (SDKs)"
                            }
                        },
                        heading: "SDKs"
                    },
                    start: {
                        content: {
                            endpoints: {
                                subTitle: "WSO2 SDK භාවිතා නොකර ඔබ ඔබේ යෙදුම ක්‍රියාත්මක කරන්නේ නම්, " +
                                    "යෙදුම සඳහා සත්‍යාපනය ක්‍රියාත්මක කිරීමට " +
                                    "පහත සේවාදායක අන්ත ලක්ෂ්‍ය ඔබට ප්‍රයෝජනවත් වනු ඇත.",
                                title: "සේවාදායකයේ අවසාන ස්ථාන"
                            },
                            oidcConfigurations: {
                                labels: {
                                    authorize: "අවසරලත්",
                                    introspection: "ස්වයං විමර්ශනය",
                                    keystore: "යතුරු කට්ටලය",
                                    token: "ටෝකන්",
                                    userInfo: "UserInfo",
                                    wellKnown: "සොයාගැනීම"
                                }
                            },
                            samlConfigurations: {
                                buttons: {
                                    certificate: "සහතිකය බාගන්න",
                                    metadata: "IDP පාර-දත්ත බාගන්න"
                                },
                                labels: {
                                    certificate: "අවතැන්වූවන්ගේ සහතිකය",
                                    issuer: "නිකුත් කරන්නා",
                                    metadata: "IDP පාර-දත්ත",
                                    slo: "තනි ලොග්අවුට්",
                                    sso: "තනි පුරනය වීම"
                                }
                            },
                            trySample: {
                                btn: "සාම්පල ගවේෂණය කරන්න",
                                subTitle: "සත්‍යාපන ප්‍රවාහය පෙන්වන සාම්පල ඔබට අත්හදා බැලිය හැකිය. නියැදි " +
                                    "යෙදුම බාගත කර යෙදවීමට පහත බොත්තම ක්ලික් කරන්න.",
                                title: "නියැදියක් සමඟ උත්සාහ කරන්න"
                            },
                            useSDK: {
                                btns: {
                                    withSDK: "SDK භාවිතා කිරීම",
                                    withoutSDK: "අතින්"
                                },
                                subTitle: "අවම කේත රේඛා සංඛ්‍යාවක් සමඟ ඔබේ යෙදුමට සත්‍යාපනය ඒකාබද්ධ " +
                                    "කිරීමට අපගේ SDKs ස්ථාපනය කර භාවිතා කරන්න.",
                                title: "ඔබේම යෙදුම ඒකාබද්ධ කරන්න"
                            }
                        },
                        heading: "ඊළඟට කුමක්ද?"
                    }
                }
            },
            list: {
                actions: {
                    add: "නව යෙදුම"
                },
                columns: {
                    actions: "ක්‍රියා",
                    name: "නම"
                }
            },
            notifications: {
                addApplication: {
                    error: {
                        description: "{{description}}",
                        message: "නිර්මාණ දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුම නිර්මාණය කිරීමට අපොහොසත් විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "යෙදුම සාර්ථකව නිර්මාණය කරන ලදි.",
                        message: "නිර්මාණය සාර්ථකයි"
                    }
                },
                authenticationStepMin: {
                    genericError: {
                        description: "අවම වශයෙන් එක් සත්‍යාපන පියවරක් අවශ්‍ය වේ.",
                        message: "ඉවත් කිරීමේ දෝෂයකි"
                    }
                },
                deleteApplication: {
                    error: {
                        description: "{{description}}",
                        message: "ඉවත් කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුම මැකීමට අපොහොසත් විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "යෙදුම සාර්ථකව මකා දැමීය.",
                        message: "ඉවත් කිරීම සාර්ථකයි"
                    }
                },
                deleteProtocolConfig: {
                    error: {
                        description: "{{description}}",
                        message: "ඉවත් කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අභ්‍යන්තර ප්‍රොටොකෝල් වින්‍යාසයන් මකාදැමීමේදී දෝෂයක් සිදුවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "{{protocol}} ප්‍රොටොකෝලය වින්‍යාස කිරීම සාර්ථකව මකා දමන ලදි.",
                        message: "ඉවත් කිරීම සාර්ථකයි"
                    }
                },
                duplicateAuthenticationStep: {
                    genericError: {
                        description: "එකම සත්‍යාපකය එක පියවරකින් නැවත නැවත කිරීමට අවසර නැත.",
                        message: "අවසර නැත"
                    }
                },
                emptyAuthenticationStep: {
                    genericError: {
                        description: "හිස් සත්‍යාපන පියවරක් ඇත. කරුණාකර එය ඉවත් කරන්න හෝ " +
                            "ඉදිරියට යාමට සත්‍යාපක එකතු කරන්න.",
                        message: "යාවත්කාලීන දෝෂයකි"
                    }
                },
                fetchAllowedCORSOrigins: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අවසර ලත් CORS ප්‍රභවයන් ලබා ගැනීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "අවසර ලත් CORS ප්‍රභවයන් සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchApplication: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුම් විස්තර ලබා ගැනීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "අයදුම්පත් විස්තර සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchApplications: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුම් ලබා ගැනීමට නොහැකි විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "අයදුම්පත් සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchCustomInboundProtocols: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අභිරුචි අභ්‍යන්තර ප්‍රොටෝකෝල ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "අභිරුචි අභ්‍යන්තර ප්‍රොටෝකෝල සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchInboundProtocols: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පවතින අභ්‍යන්තර ප්‍රොටෝකෝල ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "ඇතුළට එන ප්‍රොටෝකෝල සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchOIDCIDPConfigs: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "OIDC යෙදුම සඳහා IDP වින්‍යාසයන් ලබා ගැනීමේදී දෝෂයක් සිදුවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "OIDC යෙදුම සඳහා IDP වින්‍යාසයන් සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchOIDCServiceEndpoints: {
                    genericError: {
                        description: "OIDC යෙදුම් සඳහා සේවාදායක අන්ත ලක්ෂ්‍ය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "Un problème est survenu"
                    }
                },
                fetchProtocolMeta: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "ප්‍රොටොකෝලය පාර-දත්ත ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "ප්‍රොටොකෝලය පාර-දත්ත සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchSAMLIDPConfigs: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "SAML යෙදුම සඳහා IDP වින්‍යාසයන් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "SAML යෙදුම සඳහා IDP වින්‍යාසයන් සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුම් ආකෘති දත්ත ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "යෙදුම් ආකෘති දත්ත සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchTemplates: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුම් සැකිලි ලබා ගැනීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "යෙදුම් සැකිලි සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                getInboundProtocolConfig: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "ප්‍රොටොකෝලය වින්‍යාස කර ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "අභ්‍යන්තර ප්‍රොටොකෝල් වින්‍යාසයන් සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                regenerateSecret: {
                    error: {
                        description: "{{description}}",
                        message: "දෝෂය නැවත උත්පාදනය කරන්න"
                    },
                    genericError: {
                        description: "යෙදුම ප්‍රතිනිර්මාණය කිරීමේදී දෝෂයක් සිදුවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "යෙදුම සාර්ථකව ප්‍රතිනිර්මාණය කරන ලදි",
                        message: "නැවත උත්පාදනය සාර්ථකයි"
                    }
                },
                revokeApplication: {
                    error: {
                        description: "{{description}}",
                        message: "දෝෂය අවලංගු කරන්න"
                    },
                    genericError: {
                        description: "යෙදුම අවලංගු කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "යෙදුම සාර්ථකව අවලංගු කරන ලදි",
                        message: "අවලංගු කිරීම සාර්ථකයි"
                    }
                },
                updateAdvancedConfig: {
                    error: {
                        description: "{{description}}",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    genericError: {
                        description: "උසස් වින්‍යාසයන් අතරතුර දෝෂයක් සිදුවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "උසස් වින්‍යාසයන් සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateApplication: {
                    error: {
                        description: "{{description}}",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුම් යාවත්කාලීන කිරීමට අපොහොසත් විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "යෙදුම සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateAuthenticationFlow: {
                    error: {
                        description: "{{description}}",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුමේ සත්‍යාපන ප්‍රවාහය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "යෙදුමේ සත්‍යාපන ප්‍රවාහය සාර්ථකව යාවත්කාලීන කරන ලදි",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateClaimConfig: {
                    error: {
                        description: "{{description}}",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    genericError: {
                        description: "හිමිකම් වින්‍යාසය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "හිමිකම් වින්‍යාසය සාර්ථකව යාවත්කාලීන කරන ලදි",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateInboundProtocolConfig: {
                    error: {
                        description: "{{description}}",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අභ්‍යන්තර ප්‍රොටොකෝල් වින්‍යාසයන් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "අභ්‍යන්තර ප්‍රොටොකෝල් වින්‍යාසයන් සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateInboundProvisioningConfig: {
                    error: {
                        description: "{{description}}",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "ප්‍රතිපාදන වින්‍යාස කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "ප්‍රතිපාදන වින්‍යාසයන් සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateOutboundProvisioning: {
                    genericError: {
                        description: "පිටතට යන ප්‍රතිපාදන IDP දැනටමත් පවතී.",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    }
                },
                updateProtocol: {
                    error: {
                        description: "{{description}}",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුම යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "නව ප්‍රොටොකෝල් වින්‍යාසයන් සාර්ථකව එක් කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                }
            },
            placeholders: {
                emptyAttributesList: {
                    action: "ගුණාංගය එක් කරන්න",
                    subtitles: "මේ වන විට යෙදුමට කිසිදු ගුණාංගයක් තෝරාගෙන නොමැත.",
                    title: "කිසිදු ගුණාංගයක් එකතු කර නැත"
                },
                emptyAuthenticatorStep: {
                    subtitles: {
                        0: "ඉහත ඕනෑම සත්‍යාපකය ඇදගෙන යන්න",
                        1: "සත්‍යාපන අනුක්‍රමයක් තැනීමට."
                    },
                    title: null
                },
                emptyAuthenticatorsList: {
                    subtitles: "{{type}} සත්‍යාපකයන් කිසිවක් සොයාගත නොහැකි විය",
                    title: null
                },
                emptyList: {
                    action: "නව යෙදුම",
                    subtitles: {
                        0: "දැනට අයදුම්පත් නොමැත.",
                        1: "පහත සඳහන් දෑ අනුගමනය කිරීමෙන් ඔබට පහසුවෙන් නව යෙදුමක් එක් කළ හැකිය",
                        2: "යෙදුම් නිර්මාණය කිරීමේ විශාරදයේ පියවර."
                    },
                    title: "නව යෙදුමක් එක් කරන්න"
                },
                emptyOutboundProvisioningIDPs: {
                    action: "නව IDP",
                    subtitles: "මෙම යෙදුමට පිටතට යන ප්‍රතිපාදන අවතැන්වූවන් වින්‍යාස කර නොමැත. " +
                        "එය බැලීමට මෙහි අවතැන්වූවෙකු එක් කරන්න.",
                    title: "පිටතට යන ප්‍රතිපාදන අවතැන්වූවන් නැත"
                },
                emptyProtocolList: {
                    action: "නව කෙටුම්පත",
                    subtitles: {
                        0: "දැනට කිසිදු ප්‍රොටෝකෝලයක් නොමැත.",
                        1: "භාවිතා කිරීමෙන් ඔබට පහසුවෙන් ප්‍රොටෝකෝලය එක් කළ හැකිය",
                        2: "පූර්ව නිශ්චිත සැකිලි."
                    },
                    title: "ප්රොටෝකෝලයක් එක් කරන්න"
                }
            },
            templates: {
                manualSetup: {
                    heading: "අතින් සැකසුම",
                    subHeading: "අභිරුචි වින්‍යාසයන් සහිත යෙදුමක් සාදන්න."
                },
                quickSetup: {
                    heading: "ඉක්මන් පිහිටුවීම්",
                    subHeading: "ඔබගේ යෙදුම් නිර්මාණය වේගවත් කිරීම සඳහා පූර්ව නිශ්චිත යෙදුම් සැකිලි සමූහයක්."
                }
            },
            wizards: {
                minimalAppCreationWizard: {
                    help: {
                        heading: "උදව්",
                        subHeading: "මඟ පෙන්වීමක් ලෙස පහත සඳහන් දෑ භාවිතා කරන්න"
                    }
                }
            }
        },
        footer: {
            copyright: "WSO2 හැඳුනුම් සේවාදායකය © {{year}}"
        },
        header: {
            links: {
                adminPortalNav: "පරිපාලක ද්වාරය",
                userPortalNav: "මගේ ගිණුම"
            }
        },
        helpPanel: {
            actions: {
                close: "වසන්න",
                open: "උදව් පැනලය විවෘත කරන්න",
                pin: "පින්",
                unPin: "ඉවත් කරන්න"
            },
            notifications: {
                pin: {
                    success: {
                        description: "ඔබ පැහැදිලිව වෙනස් නොකළහොත් උපකාරක පැනලය සැමවිටම {{state} වනු ඇත.",
                        message: "උදව් පැනලය {{state}}"
                    }
                }
            }
        },
        idp: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "උදා. නම, සබල කර ඇත."
                        },
                        filterCondition: {
                            placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                        },
                        filterValue: {
                            placeholder: "උදා. ගූගල්, GitHub යනාදිය."
                        }
                    }
                },
                placeholder: "IDP නාමයෙන් සොයන්න"
            },
            buttons: {
                addAttribute: "ගුණාංගය එක් කරන්න",
                addAuthenticator: "නව සත්‍යාපකය",
                addCertificate: "නව සහතිකය",
                addConnector: "නව සම්බන්ධකය",
                addIDP: "නව හැඳුනුම්පත් සපයන්නා"
            },
            confirmations: {
                deleteAuthenticator: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1> {{name}} </1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම සත්‍යාපකය මකා දැමුවහොත් ඔබට එය නැවත ලබා ගත නොහැක. මෙය මත " +
                        "පදනම් වූ සියලුම යෙදුම් ද වැඩ කිරීම නවතා දැමිය හැකිය. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර සත්‍යාපකය ස්ථිරවම මකා දමනු ඇත."
                },
                deleteConnector: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1> {{name}} </1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම සම්බන්ධකය මකා දැමුවහොත්, ඔබට එය නැවත ලබා ගත නොහැක. " +
                        "කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර සම්බන්ධකය ස්ථිරවම මකා දමනු ඇත."
                },
                deleteIDP: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1> {{name}} </1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම අනන්‍යතා සැපයුම්කරු මකා දැමුවහොත්, ඔබට එය නැවත ලබා ගත නොහැක. " +
                        "මෙය මත පදනම් වූ සියලුම යෙදුම් ද වැඩ කිරීම නවතා දැමිය හැකිය. කරුණාකර"
                            + " ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර අවතැන්වූවන් ස්ථිරවම මකා දමනු ඇත."
                }
            },
            dangerZoneGroup: {
                deleteIDP: {
                    actionTitle: "හැඳුනුම්පත් සපයන්නා මකන්න",
                    header: "අනන්‍යතා සැපයුම්කරු මකන්න",
                    subheader: "ඔබ අනන්‍යතා සැපයුම්කරුවෙකු මකා දැමූ පසු, ආපසු යාමක් නොමැත. " +
                        "කරුණාකර ස්ථිර වන්න."
                },
                disableIDP: {
                    actionTitle: "හැඳුනුම්පත් සපයන්නා සක්‍රීය කරන්න",
                    header: "අනන්‍යතා සැපයුම්කරු සක්‍රීය කරන්න",
                    subheader: "ඔබ අනන්‍යතා සැපයුම්කරුවෙකු අක්‍රිය කළ පසු, ඔබ එය නැවත සක්‍රිය කරන තුරු එය " +
                        "තවදුරටත් භාවිතා කළ නොහැක. කරුණාකර ස්ථිර වන්න."
                },
                header: "අන්තරා කලාපය"
            },
            forms: {
                advancedConfigs: {
                    alias: {
                        hint: "ෆෙඩරල් අනන්‍යතා සැපයුම්කරුගේ අන්වර්ථ නාමයක් මගින් නේවාසික අනන්‍යතා " +
                            "සැපයුම්කරු හඳුනන්නේ නම්, එය මෙහි සඳහන් කරන්න.",
                        label: "අන්වර්ථය"
                    },
                    certificateType: {
                        certificateJWKS: {
                            label: "JWKS අන්ත ලක්ෂ්‍යය භාවිතා කරන්න",
                            placeholder: "අගය JWKS ආකෘතියෙන් සහතිකය විය යුතුය.",
                            validations: {
                                empty: "සහතික වටිනාකම අවශ්‍ය වේ"
                            }
                        },
                        certificatePEM: {
                            label: "සහතිකය ලබා දෙන්න",
                            placeholder: "අගය PEM URL එකක් විය යුතුය.",
                            validations: {
                                empty: "සහතික වටිනාකම අවශ්‍ය වේ"
                            }
                        },
                        hint: "වර්ගය JWKS නම්, අගය JWKS URL එකක් විය යුතුය. වර්ගය PEM නම්, අගය PEM " +
                            "ආකෘතියෙන් සහතිකය විය යුතුය.",
                        label: "සහතික වර්ගය තෝරන්න"
                    },
                    federationHub: {
                        hint: "මෙය ෆෙඩරේෂන් හබ් අනන්‍යතා සැපයුම්කරුවකු වෙත යොමු කරන්නේ දැයි පරීක්ෂා කරන්න",
                        label: "සම්මේලන කේන්ද්‍රය"
                    },
                    homeRealmIdentifier: {
                        hint: "මෙම අනන්‍යතා සැපයුම්කරු සඳහා ගෘහස්ථ හඳුනාගැනීමේ යන්ත්‍රය ඇතුළත් කරන්න",
                        label: "මුල් පිටුව හඳුනාගැනීමේ යන්ත්‍රය"
                    }
                },
                attributeSettings: {
                    attributeListItem: {
                        validation: {
                            empty: "අගය ඇතුලත් කරන්න"
                        }
                    },
                    attributeMapping: {
                        attributeColumnHeader: "ගුණාංගය",
                        attributeMapColumnHeader: "අනන්‍යතා සැපයුම්කරුගේ ගුණාංගය",
                        attributeMapInputPlaceholderPrefix: "උදා",
                        componentHeading: "සිතියම්ගත කිරීම ආරෝපණය කරයි",
                        hint: "හැඳුනුම් සැපයුම්කරුගේ සහය දක්වන ගුණාංග එක් කරන්න"
                    },
                    attributeProvisioning: {
                        attributeColumnHeader: {
                            0: "ගුණාංගය",
                            1: "අනන්‍යතා සැපයුම්කරුගේ ගුණාංගය"
                        },
                        attributeMapColumnHeader: "පෙරනිමි අගය",
                        attributeMapInputPlaceholderPrefix: "උදා",
                        componentHeading: "ගුණාංග තෝරා ගැනීම",
                        hint: "ප්‍රතිපාදන සඳහා අවශ්‍ය ගුණාංග සඳහන් කරන්න"
                    },
                    attributeSelection: {
                        searchAttributes: {
                            placeHolder: "ගුණාංග සොයන්න"
                        }
                    }
                },
                authenticatorAccordion: {
                    default: {
                        0: "පෙරනිමිය",
                        1: "පෙරනිමිය කරන්න"
                    },
                    enable: {
                        0: "සක්‍රීය කර ඇත",
                        1: "ආබාඅක්‍රීය කර ඇතධිතයි"
                    }
                },
                common: {
                    customProperties: "අභිරුචි දේපල",
                    invalidQueryParamErrorMessage: "මේවා වලංගු විමසුම් පරාමිතීන් නොවේ",
                    invalidURLErrorMessage: "මෙය වලංගු URL එකක් නොවේ",
                    requiredErrorMessage: "මෙය අවශ්‍ය වේ"
                },
                generalDetails: {
                    description: {
                        hint: "අනන්‍යතා සැපයුම්කරු පිළිබඳ අර්ථවත් විස්තරයක්.",
                        label: "විස්තර",
                        placeholder: "අනන්‍යතා සැපයුම්කරුගේ විස්තරයක් ඇතුළත් කරන්න."
                    },
                    image: {
                        hint: "අනන්‍යතා සැපයුම්කරුගේ රූපය විමසීමට URL ය.",
                        label: "හැඳුනුම්පත් සපයන්නාගේ පින්තූර URL",
                        placeholder: "උදා. https"
                    },
                    name: {
                        hint: "මෙම අනන්‍යතා සැපයුම්කරු සඳහා අද්විතීය නමක් ඇතුළත් කරන්න.",
                        label: "හැඳුනුම්පත් සපයන්නාගේ නම",
                        placeholder: "අනන්‍යතා සැපයුම්කරු සඳහා නමක් ඇතුළත් කරන්න.",
                        validations: {
                            duplicate: "මෙම නම සමඟ අනන්‍යතා සැපයුම්කරුවෙකු දැනටමත් සිටී",
                            empty: "අනන්‍යතා සැපයුම්කරුගේ නම අවශ්‍ය වේ"
                        }
                    }
                },
                jitProvisioning: {
                    enableJITProvisioning: {
                        hint: "මෙම අනන්‍යතා සැපයුම්කරුගෙන් ෆෙඩරල් කරන ලද පරිශීලකයින්ට දේශීයව " +
                            "සැපයිය යුතුදැයි නියම කරයි.",
                        label: "යන්තම් ප්‍රතිපාදන සැපයීම සක්‍රීය කරන්න"
                    },
                    provisioningScheme: {
                        children: {
                            0: "පරිශීලක නාමය, මුරපදය සහ කැමැත්ත සඳහා විමසන්න",
                            1: "මුරපදය සහ කැමැත්ත සඳහා විමසන්න",
                            2: "කැමැත්ත සඳහා විමසන්න",
                            3: "නිශ්ශබ්දව සැපයීම"
                        },
                        hint: "පරිශීලකයින්ට ප්‍රතිපාදන ලබා දුන් විට භාවිතා කළ යුතු යෝජනා ක්‍රමය තෝරන්න.",
                        label: "ප්‍රතිපාදන යෝජනා ක්‍රමය"
                    },
                    provisioningUserStoreDomain: {
                        hint: "ප්‍රතිපාදන භාවිතා කරන්නන් සඳහා පරිශීලක ගබඩා වසම් නාමය තෝරන්න.",
                        label: "සෑම විටම පරිශීලකයින්ට ප්‍රතිපාදන සැපයීම සඳහා පරිශීලක ගබඩා වසම"
                    }
                },
                outboundConnectorAccordion: {
                    default: "පෙරනිමිය කරන්න",
                    enable: "සක්‍රීය කර ඇත"
                },
                outboundProvisioningRoles: {
                    heading: "පිටතට යන ප්‍රතිපාදන කාර්යභාරය",
                    hint: "හැඳුනුම්පත් සපයන්නා ලෙස පිටතට යන ප්‍රතිපාදන භූමිකාවන් තෝරන්න සහ එකතු කරන්න",
                    label: "කාර්යභාරය",
                    placeHolder: "භූමිකාව තෝරන්න",
                    popup: {
                        content: "භූමිකාව එක් කරන්න"
                    }
                },
                roleMapping: {
                    heading: "භූමිකාව සිතියම්ගත කිරීම",
                    hint: "අනන්‍යතා සැපයුම්කරුගේ භූමිකාවන් සමඟ දේශීය භූමිකාවන් සිතියම් ගත කරන්න",
                    keyName: "දේශීය කාර්යභාරය",
                    validation: {
                        duplicateKeyErrorMsg: "මෙම භූමිකාව දැනටමත් සිතියම් ගත කර ඇත. කරුණාකර වෙනත්"
                            + " භූමිකාවක් තෝරන්න",
                        keyRequiredMessage: "කරුණාකර දේශීය භූමිකාව ඇතුළත් කරන්න",
                        valueRequiredErrorMessage: "සිතියම් ගත කිරීමට කරුණාකර අවතැන්වූවන්ගේ"
                            + " භූමිකාවක් ඇතුළත් කරන්න"
                    },
                    valueName: "හැඳුනුම්පත් සපයන්නාගේ කාර්යභාරය"
                },
                uriAttributeSettings: {
                    role: {
                        heading: "කාර්යභාරය",
                        hint: "හැඳුනුම් සැපයුම්කරුගේ භූමිකාවන් හඳුනා ගන්නා ගුණාංගය නියම කරයි",
                        label: "භූමිකාව",
                        placeHolder: "ගුණාංගය තෝරන්න",
                        validation: {
                            empty: "කරුණාකර භූමිකාව සඳහා ලක්ෂණයක් තෝරන්න"
                        }
                    },
                    subject: {
                        heading: "විෂය",
                        hint: "අනන්‍යතා සැපයුම්කරු තුළ පරිශීලකයා හඳුනා ගන්නා ගුණාංගය නියම කරයි",
                        label: "විෂය ගුණාංගය",
                        placeHolder: "ගුණාංගය තෝරන්න",
                        validation: {
                            empty: "කරුණාකර විෂය සඳහා ලක්ෂණයක් තෝරන්න"
                        }
                    }
                }
            },
            helpPanel: {
                tabs: {
                    samples: {
                        content: {
                            docs: {
                                goBack: "ආපසු යන්න",
                                hint: "අදාළ ලියකියවිලි පරීක්ෂා කිරීමට පහත හැඳුනුම්පත් සපයන්නාගේ " +
                                    "වර්ග මත ක්ලික් කරන්න.",
                                title: "අච්චු වර්ගයක් තෝරන්න"
                            }
                        },
                        heading: "ලියකියවිලි"
                    }
                }
            },
            list: {
                actions: "ක්‍රියා",
                name: "නම"
            },
            modals: {
                addAuthenticator: {
                    subTitle: "අනන්‍යතා සැපයුම්කරු වෙත නව සත්‍යාපකය එක් කරන්න",
                    title: "නව සත්‍යාපකය එක් කරන්න"
                },
                addCertificate: {
                    subTitle: "හැඳුනුම්පත් සපයන්නාට නව සහතිකයක් එක් කරන්න",
                    title: "නව සහතිකයක් එක් කරන්න"
                },
                addProvisioningConnector: {
                    subTitle: "නව පිටතට යන ප්‍රතිපාදන සම්බන්ධකය එක් කිරීමට පියවර අනුගමනය කරන්න",
                    title: "පිටතට යන ප්‍රතිපාදන සම්බන්ධකය සාදන්න"
                },
                attributeSelection: {
                    content: {
                        searchPlaceholder: "ගුණාංග සොයන්න"
                    },
                    subTitle: "නව ගුණාංග එකතු කරන්න හෝ පවතින ගුණාංග ඉවත් කරන්න.",
                    title: "ගුණාංග තේරීම යාවත්කාලීන කරන්න"
                }
            },
            notifications: {
                addFederatedAuthenticator: {
                    error: {
                        description: "{{ description }}",
                        message: "දෝෂයක් සාදන්න"
                    },
                    genericError: {
                        description: "සත්‍යාපකය එකතු කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "දෝෂයක් සාදන්න"
                    },
                    success: {
                        description: "සත්‍යාපකය සාර්ථකව එක් කරන ලදි.",
                        message: "සාර්ථක ලෙස නිර්මාණය කරන්න"
                    }
                },
                addIDP: {
                    error: {
                        description: "{{ description }}",
                        message: "දෝෂයක් සාදන්න"
                    },
                    genericError: {
                        description: "අනන්‍යතා සැපයුම්කරු නිර්මාණය කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "දෝෂයක් සාදන්න"
                    },
                    success: {
                        description: "අනන්‍යතා සැපයුම්කරු සාර්ථකව නිර්මාණය කළේය.",
                        message: "සාර්ථක ලෙස නිර්මාණය කරන්න"
                    }
                },
                changeCertType: {
                    jwks: {
                        description: "ඔබ සහතිකයක් එකතු කර ඇත්නම් එය JWKS අන්ත ලක්ෂ්‍යය මගින් අභිබවා යනු " +
                            "ඇති බව කරුණාවෙන් සලකන්න.",
                        message: "අවවාදයයි!"
                    },
                    pem: {
                        description: "ඔබ JWKS අන්ත ලක්ෂ්‍යයක් එකතු කර ඇත්නම් එය සහතිකය මගින් අභිබවා " +
                            "යනු ඇති බව කරුණාවෙන් සලකන්න.",
                        message: "අවවාදයයි!"
                    }
                },
                deleteDefaultAuthenticator: {
                    error: {
                        description: "පෙරනිමි ෆෙඩරේටඩ් සත්‍යාපකය මකා දැමිය නොහැක.",
                        message: "ෆෙඩරේටඩ් සත්‍යාපන මකාදැමීමේ දෝෂයකි"
                    },
                    genericError: null,
                    success: null
                },
                deleteDefaultConnector: {
                    error: {
                        description: "පෙරනිමි පිටතට යන ප්‍රතිපාදන සම්බන්ධකය මකා දැමිය නොහැක.",
                        message: "පිටතට යන සම්බන්ධක මකාදැමීමේ දෝෂයකි"
                    },
                    genericError: null,
                    success: null
                },
                deleteIDP: {
                    error: {
                        description: "{{ විස්තර }}",
                        message: "හැඳුනුම්පත් සපයන්නා මකාදැමීමේ දෝෂය"
                    },
                    genericError: {
                        description: "අනන්‍යතා සැපයුම්කරු මකාදැමීමේදී දෝෂයක් ඇතිවිය",
                        message: "හැඳුනුම්පත් සපයන්නා මකාදැමීමේ දෝෂය"
                    },
                    success: {
                        description: "හැඳුනුම්පත් සපයන්නා සාර්ථකව මකා දැමීය",
                        message: "මකන්න සාර්ථකයි"
                    }
                },
                disableAuthenticator: {
                    error: {
                        description: "ඔබට සුපුරුදු සත්‍යාපකය අක්‍රිය කළ නොහැක.",
                        message: "දත්ත වලංගු කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "",
                        message: ""
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                disableOutboundProvisioningConnector: {
                    error: {
                        description: "සුපුරුදු පිටතට යන ප්‍රතිපාදන සම්බන්ධකය ඔබට අක්‍රිය කළ නොහැක.",
                        message: "දත්ත වලංගු කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "",
                        message: ""
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                duplicateCertificateUpload: {
                    error: {
                        description: "අවතැන්වූවන් සඳහා සහතිකය දැනටමත් පවතී",
                        message: "සහතික අනුපිටපත් දෝෂයකි"
                    },
                    genericError: {
                        description: "",
                        message: ""
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getAllLocalClaims: {
                    error: {
                        description: "{{ description }}",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "දේශීය හිමිකම් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getFederatedAuthenticator: {
                    error: {
                        description: "{{ description }}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getFederatedAuthenticatorMetadata: {
                    error: {
                        description: "{{ description }}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "සත්‍යාපන පාර-දත්ත ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getFederatedAuthenticatorsList: {
                    error: {
                        description: "{{ description }}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getIDP: {
                    error: {
                        description: "{{ description }}",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අනන්‍යතා සැපයුම්කරුගේ තොරතුරු ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getIDPList: {
                    error: {
                        description: "{{ description }}",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අනන්‍යතා සපයන්නන් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getIDPTemplate: {
                    error: {
                        description: "{{ description }}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අවතැන්වූවන්ගේ අච්චුව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getIDPTemplateList: {
                    error: {
                        description: "{{ description }}",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අනන්‍යතා සැපයුම්කරුගේ අච්චු ලැයිස්තුව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getOutboundProvisioningConnector: {
                    error: {
                        description: "{{ description }}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පිටතට යන ප්‍රතිපාදන සම්බන්ධක තොරතුරු ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getOutboundProvisioningConnectorMetadata: {
                    error: {
                        description: "{{ description }}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පිටතට යන ප්‍රතිපාදන සම්බන්ධක පාර-දත්ත ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getOutboundProvisioningConnectorsList: {
                    error: {
                        description: "{{ description }}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පිටතට යන ප්‍රතිපාදන සම්බන්ධක ලැයිස්තුව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getRolesList: {
                    error: {
                        description: "{{ description }}",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "භූමිකාවන් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                submitAttributeSettings: {
                    error: {
                        description: "සියලුම අනිවාර්ය ගුණාංග වින්‍යාස කිරීමට අවශ්‍යය.",
                        message: "යාවත්කාලීන කිරීම කළ නොහැක"
                    },
                    genericError: {
                        description: "",
                        message: ""
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                updateClaimsConfigs: {
                    error: {
                        description: "{{ description }}",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "හිමිකම් වින්‍යාසයන් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    success: {
                        description: "හිමිකම් වින්‍යාසයන් සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateFederatedAuthenticator: {
                    error: {
                        description: "{{ description }}",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    genericError: {
                        description: "ෆෙඩරල් සත්‍යාපනය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    success: {
                        description: "ෆෙඩරේටඩ් සත්‍යාපකය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateFederatedAuthenticators: {
                    error: {
                        description: "{{ description }}",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    genericError: {
                        description: "ෆෙඩරල් සත්‍යාපනය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    success: {
                        description: "ෆෙඩරල් සත්‍යාපනය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateIDP: {
                    error: {
                        description: "{{ description }}",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    genericError: {
                        description: "අනන්‍යතා සැපයුම්කරු යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    success: {
                        description: "අනන්‍යතා සැපයුම්කරු සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateIDPCertificate: {
                    error: {
                        description: "{{ description }}",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    genericError: {
                        description: "හැඳුනුම්පත් සැපයුම්කරුගේ සහතිකය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    success: {
                        description: "හැඳුනුම්පත් සැපයුම්කරුගේ සහතිකය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateIDPRoleMappings: {
                    error: {
                        description: "{{ description }}",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පිටතට යන ප්‍රතිපාදන භූමිකාවේ වින්‍යාසයන් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    success: {
                        description: "සාර්ථකව යාවත්කාලීන කරන ලද පිටතට යන ප්‍රතිපාදන භූමිකාව වින්‍යාස කිරීම.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateJITProvisioning: {
                    error: {
                        description: "",
                        message: ""
                    },
                    genericError: {
                        description: "JIT ප්‍රතිපාදන වින්‍යාසකරණ යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    success: {
                        description: "JIT ප්‍රතිපාදන වින්‍යාසයන් සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateOutboundProvisioningConnector: {
                    error: {
                        description: "{{ description }}",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පිටතට යන ප්‍රතිපාදන සම්බන්ධකය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    success: {
                        description: "පිටතට යන ප්‍රතිපාදන සම්බන්ධකය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                },
                updateOutboundProvisioningConnectors: {
                    error: {
                        description: "{{ description }}",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පිටතට යන ප්‍රතිපාදන සම්බන්ධක යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    success: {
                        description: "පිටතට යන ප්‍රතිපාදන සම්බන්ධක සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                }
            },
            placeHolders: {
                emptyAuthenticatorList: {
                    subtitles: {
                        0: "දැනට සත්‍යාපනය කරන්නන් නොමැත.",
                        1: "භාවිතා කිරීමෙන් ඔබට පහසුවෙන් නව සත්‍යාපකයක් එක් කළ හැකිය",
                        2: "පූර්ව නිශ්චිත සැකිලි."
                    },
                    title: "සත්‍යාපකයක් එක් කරන්න"
                },
                emptyCertificateList: {
                    subtitles: {
                        0: "මෙම අවතැන්වූවන්ට සහතික එකතු කර නොමැත.",
                        1: "එය බැලීමට සහතිකයක් එක් කරන්න."
                    },
                    title: "සහතික නැත"
                },
                emptyConnectorList: {
                    subtitles: {
                        0: "මෙම අවතැන්වූවන්ට පිටතට යන ප්‍රතිපාදන සම්බන්ධක වින්‍යාස කර නොමැත",
                        1: "එය බැලීමට සම්බන්ධකයක් එක් කරන්න."
                    },
                    title: "පිටතට යන ප්‍රතිපාදන සම්බන්ධක නොමැත"
                },
                emptyIDPList: {
                    subtitles: {
                        0: "දැනට අනන්‍යතා සපයන්නන් නොමැත.",
                        1: "පහත සඳහන් දෑ අනුගමනය කිරීමෙන් ඔබට පහසුවෙන් නව අනන්‍යතා සැපයුම්කරුවෙකු"
                            + " එක් කළ හැකිය",
                        2: "අනන්‍යතා සැපයුම්කරුවන්ගේ නිර්මාණ විශාරදයේ පියවර."
                    },
                    title: "නව හැඳුනුම්පත් සපයන්නෙකු එක් කරන්න"
                },
                emptyIDPSearchResults: {
                    subtitles: {
                        0: " '{{ searchQuery }}' සඳහා අපට කිසිදු ප්‍රතිපලයක් සොයාගත නොහැකි විය.",
                        1: "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න."
                    },
                    title: "ප්‍රතිපල හමු නොවීය"
                },
                noAttributes: {
                    subtitles: {
                        0: "මේ වන විට කිසිදු ගුණාංගයක් තෝරාගෙන නොමැත."
                    },
                    title: "කිසිදු ගුණාංගයක් එකතු කර නැත"
                }
            },
            templates: {
                manualSetup: {
                    heading: "අතින් සැකසුම",
                    subHeading: "අභිරුචි වින්‍යාසයන් සහිත අනන්‍යතා සැපයුම්කරුවෙකු සාදන්න."
                },
                quickSetup: {
                    heading: "ඉක්මන් පිහිටුවීම්",
                    subHeading: "ඔබගේ අනන්‍යතා සැපයුම්කරු නිර්මාණය වේගවත් කිරීම සඳහා පෙර සැකසූ සැකිලි සමූහයක්."
                }
            },
            wizards: {
                addAuthenticator: {
                    header: "සත්‍යාපකය පිළිබඳ මූලික තොරතුරු පුරවන්න.",
                    steps: {
                        authenticatorConfiguration: {
                            title: "සත්‍යාපන වින්‍යාසය"
                        },
                        authenticatorSelection: {
                            manualSetup: {
                                subTitle: "අභිරුචි වින්‍යාසයන් සහිත නව සත්‍යාපකයක් එක් කරන්න.",
                                title: "අතින් සැකසුම"
                            },
                            quickSetup: {
                                subTitle: "ක්‍රියාවලිය වේගවත් කිරීම සඳහා පූර්ව නිශ්චිත සත්‍යාපන සැකිලි.",
                                title: "ඉක්මන් පිහිටුවීම්"
                            },
                            title: "සත්‍යාපන තේරීම"
                        },
                        summary: {
                            title: "සාරාංශය"
                        }
                    }
                },
                addIDP: {
                    header: "අනන්‍යතා සැපයුම්කරු පිළිබඳ මූලික තොරතුරු පුරවන්න.",
                    steps: {
                        authenticatorConfiguration: {
                            title: "සත්‍යාපන වින්‍යාසය"
                        },
                        generalSettings: {
                            title: "සාමාන්‍ය සැකසුම්"
                        },
                        provisioningConfiguration: {
                            title: "වින්‍යාසය සැපයීම"
                        },
                        summary: {
                            title: "සාරාංශය"
                        }
                    }
                },
                addProvisioningConnector: {
                    header: "ප්‍රතිපාදන සම්බන්ධකය පිළිබඳ මූලික තොරතුරු පුරවන්න.",
                    steps: {
                        connectorConfiguration: {
                            title: "සම්බන්ධක විස්තර"
                        },
                        connectorSelection: {
                            defaultSetup: {
                                subTitle: "නව පිටතට යන ප්‍රතිපාදන සම්බන්ධකයේ වර්ගය තෝරන්න",
                                title: "සම්බන්ධක වර්ග"
                            },
                            title: "සම්බන්ධක තේරීම"
                        },
                        summary: {
                            title: "සාරාංශය"
                        }
                    }
                },
                buttons: {
                    finish: "අවසන් කරන්න",
                    next: "ලබන",
                    previous: "කලින්"
                }
            }
        },
        oidcScopes: {
            buttons: {
                addScope: "නව OIDC විෂය පථය"
            },
            confirmationModals: {
                deleteClaim: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1> {{name}} </1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම හිමිකම මකා දැමුවහොත් ඔබට එය නැවත ලබා ගත නොහැකි වනු ඇත. " +
                        "කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර OIDC හිමිකම් ස්ථිරවම මකා දමනු ඇත."
                },
                deleteScope: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1> {{name}} </1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම විෂය පථය මකා දැමුවහොත්, ඔබට එය නැවත ලබා ගත නොහැක. " +
                        "කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර OIDC විෂය පථය ස්ථිරවම මකා දමනු ඇත."
                }
            },
            editScope: {
                claimList: {
                    addClaim:  "නව ගුණාංගය",
                    emptyPlaceholder: {
                        action: "ගුණාංගය එක් කරන්න",
                        subtitles: {
                            0: "මෙම OIDC විෂය පථය සඳහා කිසිදු ගුණාංගයක් එකතු කර නොමැත",
                            1: "කරුණාකර ඒවා බැලීමට අවශ්‍ය ගුණාංග මෙහි එක් කරන්න."
                        },
                        title: "OIDC ගුණාංග නොමැත"
                    },
                    popupDelete: "ගුණාංගය මකන්න",
                    searchClaims: "සෙවුම් ගුණාංග",
                    subTitle: "OIDC විෂය පථයේ ලක්ෂණ එකතු කිරීම හෝ ඉවත් කිරීම",
                    title: "{{ name }}"
                }
            },
            forms: {
                addScopeForm: {
                    inputs: {
                        description: {
                            label: "විස්තර",
                            placeholder: "විෂය පථය සඳහා විස්තරයක් ඇතුළත් කරන්න"
                        },
                        displayName: {
                            label: "ප්රදර්ශන නාමය",
                            placeholder: "දර්ශන නාමය ඇතුළත් කරන්න",
                            validations: {
                                empty: "දර්ශන නාමය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
                            }
                        },
                        scopeName: {
                            label: "විෂය පථයේ නම",
                            placeholder: "විෂය පථයේ නම ඇතුළත් කරන්න",
                            validations: {
                                empty: "විෂය පථයේ නම අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
                            }
                        }
                    }
                }
            },
            list: {
                columns: {
                    actions: "ක්‍රියා",
                    name: "නම"
                },
                empty: {
                    action: "OIDC විෂය පථය එක් කරන්න",
                    subtitles: {
                        0: "පද්ධතියේ OIDC විෂය පථ නොමැත.",
                        1: "කරුණාකර මෙහි නව OIDC විෂය පථයන් එක් කරන්න."
                    },
                    title: "OIDC විෂය පථ නොමැත"
                },
                searchPlaceholder: "විෂය පථයෙන් සොයන්න"
            },
            notifications: {
                addOIDCClaim: {
                    error: {
                        description: "{{description}}",
                        message: "නිර්මාණ දෝෂයකි"
                    },
                    genericError: {
                        description: "OIDC ගුණාංගය එකතු කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "නව OIDC ගුණාංගය සාර්ථකව එක් කරන ලදි",
                        message: "නිර්මාණය සාර්ථකයි"
                    }
                },
                addOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "නිර්මාණ දෝෂයකි"
                    },
                    genericError: {
                        description: "OIDC විෂය පථය නිර්මාණය කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "නව OIDC විෂය පථය සාර්ථකව",
                        message: "නිර්මාණය සාර්ථකයි"
                    }
                },
                deleteOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "මකාදැමීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "OIDC විෂය පථය මකාදැමීමේදී දෝෂයක් සිදුවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "OIDC විෂය පථය සාර්ථකව මකා දමන ලදි.",
                        message: "මකාදැමීම සාර්ථකයි"
                    }
                },
                deleteOIDClaim: {
                    error: {
                        description: "{{description}}",
                        message: "මකාදැමීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "OIDC ගුණාංගය මකාදැමීමේදී දෝෂයක් සිදුවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "OIDC ගුණාංගය සාර්ථකව මකා දමන ලදි.",
                        message: "මකාදැමීම සාර්ථකයි"
                    }
                },
                fetchOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "OIDC විෂය පථය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "OIDC විෂය පථයේ තොරතුරු සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchOIDCScopes: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "OIDC විෂය පථය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "OIDC විෂය පථය සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchOIDClaims: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "OIDC ගුණාංග ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "OIDC විෂය පථය සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                updateOIDCScope: {
                    error: {
                        description: "{{description}}",
                        message: "යාවත්කාලීන දෝෂයකි"
                    },
                    genericError: {
                        description: "OIDC විෂය පථය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "OIDC විෂය පථය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                }
            },
            placeholders:{
                emptyList: {
                    action: "නව OIDC විෂය පථය",
                    subtitles: {
                        0: "දැනට OIDC විෂය පථ නොමැත.",
                        1: "පහත දැක්වෙන කරුණු අනුගමනය කිරීමෙන් ඔබට නව OIDC විෂය පථයක් පහසුවෙන්"
                            + " එකතු කළ හැකිය",
                        2: "නිර්මාණ විශාරදයේ පියවර."
                    },
                    title: "නව OIDC විෂය පථයක් එක් කරන්න"
                },
                emptySearch: {
                    action: "සියල්ල බලන්න",
                    subtitles: {
                        0: "ඔබ සෙවූ විෂය පථය අපට සොයාගත නොහැකි විය.",
                        1: "කරුණාකර වෙනත් නමක් උත්සාහ කරන්න.",
                    },
                    title: "ප්‍රතිපල හමු නොවීය"
                }
            },
            wizards: {
                addScopeWizard: {
                    buttons: {
                        next: "ලබන",
                        previous: "කලින්"
                    },
                    claimList: {
                        searchPlaceholder: "සෙවුම් ගුණාංග",
                        table: {
                            emptyPlaceholders: {
                                assigned: "මෙම OIDC විෂය පථය සඳහා පවතින සියලුම ගුණාංග පවරා ඇත.",
                                unAssigned: "මෙම OIDC විෂය පථය සඳහා කිසිදු ගුණාංගයක් පවරා නොමැත."
                            },
                            header: "ගුණාංග"
                        }
                    },
                    steps: {
                        basicDetails: "මූලික විස්තර",
                        claims: "ගුණාංග එකතු කරන්න"
                    },
                    subTitle: "අවශ්‍ය ගුණාංග සහිත නව OIDC විෂය පථයක් සාදන්න",
                    title: "OIDC විෂය පථය සාදන්න"
                }
            }
        },
        overview: {
            banner: {
                heading: "සංවර්ධකයින් සඳහා WSO2 හැඳුනුම් සේවාදායකය",
                subHeading: "අභිරුචි කළ අත්දැකීමක් ගොඩනැගීම සඳහා SDKs සහ වෙනත් සංවර්ධක මෙවලම් භාවිතා කරන්න",
                welcome: "සාදරයෙන් පිළිගනිමු, {{username}}"
            },
            quickLinks: {
                cards: {
                    applications: {
                        heading: "අයදුම්පත්",
                        subHeading: "පූර්ව නිශ්චිත සැකිලි භාවිතයෙන් යෙදුම් සාදන්න සහ වින්‍යාසයන්"
                            + " කළමනාකරණය කරන්න."
                    },
                    idps: {
                        heading: "හැඳුනුම්පත් සපයන්නන්",
                        subHeading: "සැකිලි මත පදනම්ව අනන්‍යතා සපයන්නන් නිර්මාණය කිරීම සහ කළමනාකරණය " +
                            "කිරීම සහ සත්‍යාපනය වින්‍යාස කිරීම."
                    },
                    remoteFetch: {
                        heading: "දුරස්ථ ලබා ගැනීම",
                        subHeading: "WSO2 හැඳුනුම් සේවාදායකය සමඟ බාධාවකින් තොරව වැඩ කිරීමට දුරස්ථ"
                            + " ගබඩාවක් වින්‍යාස කරන්න."
                    }
                }
            }
        },
        privacy: {
            about: {
                description: "WSO2 හැඳුනුම් සේවාදායකය (මෙම ප්‍රතිපත්තිය තුළ “WSO2 IS” ලෙස හැඳින්වේ) යනු විවෘත " +
                    "ප්‍රමිතීන් සහ පිරිවිතර මත පදනම් වූ විවෘත මූලාශ්‍ර අනන්‍යතා කළමනාකරණ සහ හිමිකම් සේවාදායකයකි.",
                heading: "WSO2 හැඳුනුම් සේවාදායකය ගැන"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS ඔබගේ ගිණුමට සැක සහිත පිවිසුම් උත්සාහයන් හඳුනා ගැනීමට ඔබගේ IP"
                                + " ලිපිනය භාවිතා කරයි.",
                            1: "WSO2 IS පොහොසත් සහ පුද්ගලාරෝපිත පරිශීලක අත්දැකීමක් ලබා දීම සඳහා ඔබේ මුල් " +
                                "නම, අවසාන නම වැනි ගුණාංග භාවිතා කරයි.",
                            2: "WSO2 IS ඔබගේ ආරක්ෂක ප්‍රශ්න සහ පිළිතුරු භාවිතා කරන්නේ ගිණුම් ප්‍රතිසාධනය"
                                + " සඳහා පමණි."
                        },
                        para1: "WSO2 IS ඔබේ තොරතුරු රැස් කරන්නේ ඔබේ ප්‍රවේශ අවශ්‍යතා සපුරාලීම සඳහා පමණි."
                            + " උදාහරණයක් වශයෙන්"
                    },
                    heading: "පුද්ගලික තොරතුරු එකතු කිරීම",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "ඔබ ඔබේ පුද්ගලික දත්ත ඇතුළත් කරන පරිශීලක පැතිකඩ " +
                                    "පිටුවෙන් තොරතුරු රැස් කිරීම.",
                                1: "HTTP ඉල්ලීම, HTTP ශීර්ෂයන් සහ TCP / IP සමඟ ඔබගේ IP ලිපිනය ලුහුබැඳීම.",
                                2: "ඔබගේ භූගෝලීය තොරතුරු IP ලිපිනය සමඟ ලුහුබැඳීම.",
                                3: "ඔබගේ පිවිසුම් ඉතිහාසය බ්‍රව්සර් කුකී සමඟ ලුහුබැඳීම. වැඩි විස්තර සඳහා කරුණාකර " +
                                    "අපගේ {{cookiePolicyLink} see බලන්න."
                            },
                            para1: "WSO2 IS විසින් ඔබේ තොරතුරු රැස් කරයි"
                        },
                        heading: "ලුහුබැඳීමේ තාක්ෂණයන්"
                    }
                },
                description: {
                    para1: "මෙම ප්‍රතිපත්තියෙන් WSO2 IS ඔබේ පුද්ගලික තොරතුරු, එකතු කිරීමේ අරමුණු සහ ඔබේ " +
                        "පුද්ගලික තොරතුරු රඳවා තබා ගැනීම පිළිබඳ තොරතුරු ග්‍රහණය කරගන්නේ කෙසේද"
                            + " යන්න විස්තර කරයි.",
                    para2: "මෙම ප්‍රතිපත්තිය යොමු කිරීම සඳහා පමණක් වන අතර එය නිෂ්පාදනයක් ලෙස මෘදුකාංගයට " +
                        "අදාළ වන බව කරුණාවෙන් සලකන්න. WSO2 Inc. සහ එහි සංවර්ධකයින්ට WSO2 IS තුළ ඇති " +
                        "තොරතුරු වෙත ප්‍රවේශයක් නොමැත. වැඩි විස්තර සඳහා"
                            +" කරුණාකර <1>disclaimer</1> කොටස බලන්න.",
                    para3: "WSO2 IS හි භාවිතය සහ පරිපාලනය පාලනය කරන ආයතන, සංවිධාන හෝ පුද්ගලයින් අදාළ " +
                        "ආයතනය, සංවිධානය හෝ පුද්ගලයා විසින් දත්ත පාලනය කරන හෝ සකසන " +
                        "ආකාරය සැකසෙන තමන්ගේම රහස්‍යතා ප්‍රතිපත්ති නිර්මාණය කළ යුතුය."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "WSO2, එහි සේවකයින්ට, හවුල්කරුවන්ට සහ අනුබද්ධයන්ට WSO2 IS හි අඩංගු පුද්ගලික " +
                                "දත්ත ඇතුළුව කිසිදු දත්තයකට ප්‍රවේශ වීමට අවශ්‍ය නොවන අතර ගබඩා කිරීම, සැකසීම " +
                                "හෝ පාලනය කිරීම අවශ්‍ය නොවේ. පුද්ගලික දත්ත ඇතුළුව සියලුම දත්ත " +
                                "පාලනය කරනු ලබන්නේ සහ සැකසෙන්නේ WSO2 IS ආයතනය විසිනි. WSO2, එහි සේවක " +
                                "හවුල්කරුවන් සහ අනුබද්ධයන් කිසිදු දත්ත රහස්‍යතා රෙගුලාසි වල අර්ථය තුළ දත්ත " +
                                "සකසනයක් හෝ දත්ත පාලකයක් නොවේ. WSO2 එවැනි ආයතන හෝ පුද්ගලයින් විසින් WSO2" +
                                " IS භාවිතා කරනු ලබන නීත්‍යානුකූල භාවය හෝ WSO2 IS භාවිතා කරන ආකාරය සහ " +
                                "අරමුණු සම්බන්ධයෙන් කිසිදු වගකීමක් හෝ වගකීමක් හෝ වගකීමක් භාර නොගනී.",
                            1: "මෙම රහස්‍යතා ප්‍රතිපත්තිය WSO2 IS ක්‍රියාත්මක වන ආයතනයේ හෝ පුද්ගලයන්ගේ " +
                                "තොරතුරු අරමුණු සඳහා වන අතර පුද්ගලික දත්ත සුරැකීම සම්බන්ධයෙන් WSO2 IS හි " +
                                "අඩංගු ක්‍රියාවලීන් සහ ක්‍රියාකාරිත්වය නියම කරයි. පරිශීලකයින්ගේ පුද්ගලික දත්ත පාලනය " +
                                "කරන තමන්ගේම නීති රීති සහ ක්‍රියාවලීන් නිර්මාණය කිරීම සහ පරිපාලනය කිරීම WSO2 " +
                                "IS ක්‍රියාත්මක කරන ආයතන සහ පුද්ගලයින්ගේ වගකීම වන අතර, එවැනි නීතිරීති හා " +
                                "ක්‍රියාවලීන් මෙහි අඩංගු භාවිතය, ගබඩා කිරීම සහ අනාවරණය කිරීමේ ප්‍රතිපත්ති වෙනස් " +
                                "කළ හැකිය. එබැවින් පරිශීලකයින්ගේ පුද්ගලික දත්ත පාලනය කරන තොරතුරු සඳහා " +
                                "පරිශීලකයින් තමන්ගේම රහස්‍යතා ප්‍රතිපත්තියක් සඳහා WSO2 IS ධාවනය කරන"
                                    + " පුද්ගලයින්ගෙන් හෝ පුද්ගලයින්ගෙන් උපදෙස් ලබා ගත යුතුය."
                        }
                    },
                    heading: "වියාචනය"
                },
                disclosureOfPersonalInfo: {
                    description: "WSO2 IS විසින් WSO2 IS හි ලියාපදිංචි කර ඇති අදාළ යෙදුම් වලට (සේවා සැපයුම්කරු " +
                        "ලෙසද හැඳින්වේ) පුද්ගලික තොරතුරු පමණක් අනාවරණය කරයි. මෙම අයදුම්පත් ලියාපදිංචි කර " +
                        "ඇත්තේ ඔබේ ආයතනයේ හෝ සංවිධානයේ අනන්‍යතා පරිපාලක විසිනි. පුද්ගලික තොරතුරු " +
                        "අනාවරණය වන්නේ ඔබ විසින් වෙනත් ආකාරයකින් කැමැත්ත ප්‍රකාශ කර නොමැති නම් හෝ " +
                        "නීතියෙන් අවශ්‍ය වන ස්ථානයක මිස, එවැනි සේවා සපයන්නන් විසින් පාලනය කරනු ලබන, එකතු " +
                        "කරන ලද අරමුණු සඳහා (හෝ එම අරමුණට අනුකූල යැයි හඳුනාගත් භාවිතයක් සඳහා) පමණි. පුද්ගලික තොරතුරු අනාවරණය කිරීම",
                    heading: "Disclosure of personal information",
                    legalProcess: {
                        description: "WSO2 IS ආයතනයට, ආයතනයට හෝ පුද්ගලිකව ක්‍රියාත්මක වන පුද්ගලයාට ඔබේ " +
                            "පුද්ගලික තොරතුරු නීතියෙන් නියම කළ යුතු හා නීත්‍යානුකූල ක්‍රියාවලියක් අවශ්‍ය වූ විට ඔබේ " +
                            "කැමැත්තෙන් හෝ නැතිව අනාවරණය කිරීමට බල කෙරෙනු ඇති බව කරුණාවෙන් සලකන්න.",
                        heading: "නීති ක්‍රියාවලිය"
                    }
                },
                heading: "රහස්යතා ප්රතිපත්තිය",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: "WSO2 IS හි යාවත්කාලීන කරන ලද අනුවාද වල මෙම ප්‍රතිපත්තියේ වෙනස්කම් අඩංගු " +
                                "විය හැකි අතර මෙම ප්‍රතිපත්තියේ සංශෝධන එවැනි වැඩිදියුණු කිරීම් තුළ ඇසුරුම් කෙරේ. " +
                                "එවැනි වෙනස්කම් අදාළ වන්නේ නවීකරණය කරන ලද අනුවාදයන් භාවිතා කිරීමට"
                                    + " තෝරා ගන්නා පරිශීලකයින්ට පමණි.",
                            para2: "WSO2 IS පවත්වාගෙන යන සංවිධානය වරින් වර රහස්‍යතා ප්‍රතිපත්තිය සංශෝධනය " +
                                "කළ හැකිය. WSO2 IS ක්‍රියාත්මක වන සංවිධානය විසින් සපයනු ලබන අදාළ සබැඳිය සමඟ " +
                                "ඔබට නවතම පාලන ප්‍රතිපත්තිය සොයාගත හැකිය. අපගේ නිල පොදු නාලිකා " +
                                "හරහා රහස්‍යතා ප්‍රතිපත්තියේ යම් වෙනසක් සංවිධානය විසින් දැනුම් දෙනු ඇත."
                        },
                        heading: "මෙම ප්‍රතිපත්තියේ වෙනස්කම්"
                    },
                    contactUs: {
                        description: {
                            para1: "මෙම රහස්‍යතා ප්‍රතිපත්තිය සම්බන්ධයෙන් ඔබට කිසියම් ප්‍රශ්නයක් හෝ " +
                                "ප්‍රශ්නයක් ඇත්නම් කරුණාකර WSO2 අමතන්න."
                        },
                        heading: "අප අමතන්න"
                    },
                    heading: "වැඩි විස්තර",
                    yourChoices: {
                        description: {
                            para1: "ඔබට දැනටමත් WSO2 IS තුළ පරිශීලක ගිණුමක් තිබේ නම්, මෙම රහස්‍යතා ප්‍රතිපත්තිය " +
                                "ඔබට පිළිගත නොහැකි බව ඔබ දුටුවහොත් ඔබේ ගිණුම අක්‍රිය කිරීමට ඔබට අයිතියක් ඇත.",
                            para2: "ඔබට ගිණුමක් නොමැති නම් සහ අපගේ රහස්‍යතා ප්‍රතිපත්තියට ඔබ එකඟ නොවන්නේ " +
                                "නම්, ඔබට එකක් නිර්මාණය නොකිරීමට තෝරා ගත හැකිය."
                        },
                        heading: "ඔබේ තේරීම්"
                    }
                },
                storageOfPersonalInfo: {
                    heading: "පුද්ගලික තොරතුරු ගබඩා කිරීම",
                    howLong: {
                        description: {
                            list1: {
                                0: "වත්මන් මුරපදය",
                                1: "කලින් භාවිතා කළ මුරපද"
                            },
                            para1: "ඔබ අපගේ පද්ධතියේ ක්‍රියාකාරී පරිශීලකයෙකු වන තාක් WSO2 IS ඔබේ පුද්ගලික දත්ත " +
                                "රඳවා තබා ගනී. ලබා දී ඇති ස්වයං රැකවරණ පරිශීලක ද්වාර භාවිතා කරමින් " +
                                "ඔබට ඕනෑම වේලාවක ඔබේ පුද්ගලික දත්ත යාවත්කාලීන කළ හැකිය.",
                            para2: "WSO2 IS මඟින් ඔබට අමතර මට්ටමේ ආරක්ෂාවක් ලබා දීම සඳහා රහසිගත රහස් තබා " +
                                "ගත හැකිය. මෙයට ඇතුළත් වේ:"
                        },
                        heading: "ඔබේ පුද්ගලික තොරතුරු කොපමණ කාලයක් රඳවා තබා ගනීද?"
                    },
                    requestRemoval: {
                        description: {
                            para1: "ඔබගේ ගිණුම මකා දැමීමට ඔබට පරිපාලකගෙන් ඉල්ලා සිටිය හැකිය. " +
                                "පරිපාලකයා යනු ඔබ යටතේ ලියාපදිංචි වී ඇති කුලී නිවැසියන්ගේ පරිපාලකයා හෝ ඔබ " +
                                "කුලී නිවැසියන්ගේ ලක්ෂණය භාවිතා නොකරන්නේ නම් සුපිරි පරිපාලකයා ය.",
                            para2: "මීට අමතරව, WSO2 IS ල logs ු-සටහන්, දත්ත සමුදායන් හෝ විශ්ලේෂණ ආචයනයන් " +
                                "තුළ රඳවාගෙන ඇති ඔබගේ ක්‍රියාකාරකම්වල සියලු අංශ නිර්නාමික කිරීමට"
                                    + " ඔබට ඉල්ලිය හැකිය."
                        },
                        heading: "ඔබගේ පුද්ගලික තොරතුරු ඉවත් කිරීමට ඉල්ලන්නේ කෙසේද"
                    },
                    where: {
                        description: {
                            para1: "WSO2 IS ඔබගේ පුද්ගලික තොරතුරු ආරක්ෂිත දත්ත ගබඩාවල ගබඩා කරයි. WSO2 IS " +
                                "ඔබේ පුද්ගලික තොරතුරු තබා ඇති දත්ත සමුදාය ආරක්ෂා කිරීම සඳහා නිසි කර්මාන්ත " +
                                "පිළිගත් ආරක්ෂක පියවරයන් ක්‍රියාත්මක කරයි. WSO2 IS යනු නිෂ්පාදනයක් ලෙස ඔබේ " +
                                "දත්ත කිසිදු තෙවන පාර්ශවයක් හෝ ස්ථානයක් සමඟ හුවමාරු නොකරයි.",
                            para2: "WSO2 IS ඔබේ පුද්ගලික දත්ත අමතර මට්ටමේ ආරක්ෂාවක් සහිතව තබා ගැනීමට " +
                                "සංකේතනය භාවිතා කරයි."
                        },
                        heading: "ඔබේ පුද්ගලික තොරතුරු ගබඩා කර ඇති තැන"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "ඔබට පුද්ගලික පරිශීලක අත්දැකීමක් ලබා දීමට. WSO2 IS මේ සඳහා ඔබේ නම සහ " +
                                "උඩුගත කළ පැතිකඩ පින්තූර භාවිතා කරයි.",
                            1: "අනවසරයෙන් පිවිසීමෙන් හෝ අනවසරයෙන් ඇතුළුවීමේ උත්සාහයන්ගෙන් ඔබගේ ගිණුම " +
                                "ආරක්ෂා කිරීමට. WSO2 IS මේ සඳහා HTTP හෝ TCP / IP ශීර්ෂ භාවිතා කරයි.",
                            2: "පද්ධති කාර්ය සාධනය වැඩි දියුණු කිරීම පිළිබඳ විශ්ලේෂණාත්මක අරමුණු සඳහා සංඛ්‍යාන " +
                                "දත්ත ලබා ගන්න. WSO2 IS සංඛ්‍යානමය ගණනය කිරීම් වලින් පසුව කිසිදු පුද්ගලික " +
                                "තොරතුරක් තබා නොගනී. එබැවින් සංඛ්‍යාලේඛන වාර්තාවට තනි පුද්ගලයෙකු"
                                    + " හඳුනා ගැනීමට ක්‍රමයක් නොමැත."
                        },
                        para1: "WSO2 IS ඔබේ පුද්ගලික තොරතුරු භාවිතා කරනු ලැබුවේ එය එකතු කරන ලද අරමුණු " +
                            "සඳහා පමණි (හෝ එම අරමුණු වලට අනුකූල බව හඳුනාගත් භාවිතයක් සඳහා).",
                        para2: "WSO2 IS ඔබේ පුද්ගලික තොරතුරු භාවිතා කරන්නේ පහත සඳහන් අරමුණු සඳහා පමණි.",
                        subList1: {
                            heading: "මෙයට ඇතුළත් වේ",
                            list: {
                                0: "IP ලිපිනය",
                                1: "බ්‍රව්සරයේ ඇඟිලි සලකුණු",
                                2: "කුකීස්"
                            }
                        },
                        subList2: {
                            heading: "WSO2 IS භාවිතා කළ හැකිය",
                            list: {
                                0: "භූගෝලීය තොරතුරු ලබා ගැනීම සඳහා IP ලිපිනය",
                                1: "බ්රවුසරයේ තාක්ෂණය හෝ / සහ අනුවාදය තීරණය කිරීම සඳහා"
                                    + " බ්රවුසරයේ ඇඟිලි සලකුණු"
                            }
                        }
                    },
                    heading: "පුද්ගලික තොරතුරු භාවිතය"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: "ඔබේ පරිශීලක නාමය (ඔබේ සේවායෝජකයා විසින් නිර්මාණය කරන ලද " +
                                "පරිශීලක නාමය ගිවිසුම්ගතව ඇති අවස්ථා හැර)",
                            1: "ඔබගේ උපන් දිනය / වයස",
                            2: "පුරනය වීමට භාවිතා කරන IP ලිපිනය",
                            3: "ඔබ පිවිසීමට උපාංගයක් (උදා: දුරකථන හෝ ටැබ්ලටය) භාවිතා කරන්නේ නම්"
                                + " ඔබගේ උපාංග හැඳුනුම්පත"
                        },
                        list2: {
                            0: "ඔබ TCP / IP සම්බන්ධතාවය ආරම්භ කළ නගරය / රට",
                            1: "ඔබ පුරනය වූ දවසේ වේලාව (වර්ෂය, මාසය, සතිය, පැය හෝ මිනිත්තුව)",
                            2: "ඔබ පුරනය වීමට භාවිතා කළ උපාංග වර්ගය (උදා: දුරකථන හෝ ටැබ්ලටය)",
                            3: "මෙහෙයුම් පද්ධතිය සහ සාමාන්‍ය බ්‍රව්සර් තොරතුරු"
                        },
                        para1: "WSO2 IS ඔබ හා සම්බන්ධ ඕනෑම දෙයක් සලකන අතර ඔබව හඳුනාගත හැකි ඒවා ඔබේ " +
                            "පුද්ගලික තොරතුරු ලෙස සලකනු ලැබේ. මෙයට ඇතුළත් නමුත් ඒවාට පමණක් සීමා නොවේ:",
                        para2: "කෙසේ වෙතත්, WSO2 IS පුද්ගලික තොරතුරු ලෙස නොසැලකෙන පහත තොරතුරු රැස් " +
                            "කරයි, නමුත් එය භාවිතා කරනුයේ <1>statistical</1> අරමුණු සඳහා පමණි. " +
                            "එයට හේතුව මෙම තොරතුරු ඔබව ලුහුබැඳීමට භාවිතා කළ නොහැකි වීමයි."
                    },
                    heading: "පුද්ගලික තොරතුරු යනු කුමක්ද?"
                }
            }
        },
        remoteConfig: {
            createConfigForm: {
                configName: {
                    label: "වින්‍යාස කිරීමේ නම",
                    placeholder: "නිධිය වින්‍යාසය සඳහා නම",
                    requiredMessage: "වින්‍යාස කිරීමේ නම අවශ්‍යයි."
                },
                configStatus: {
                    hint: "යෙදුම් ලබා ගැනීම සඳහා වින්‍යාසය සක්‍රීය කරන්න",
                    label: "ලබා ගැනීමේ වින්‍යාසය සක්‍රීය කරන්න",
                    statusDisabled: "අක්‍රීය කර ඇත",
                    statusEnabled: "සක්‍රීය කර ඇත"
                },
                enableConfig: {
                    label: "වින්‍යාසය සබල කරන්න"
                },
                gitAccessToken: {
                    label: "පුද්ගලික ප්‍රවේශ ටෝකනය",
                    placeholder: "GitHub ගිණුම සඳහා ටෝකනය ප්‍රවේශ කරන්න."
                },
                gitBranch: {
                    label: "Git ශාඛාව",
                    placeholder: "github ශාඛා පිහිටීම",
                    requiredMessage: "Git ශාඛාව අවශ්‍යයි."
                },
                gitDirectory: {
                    label: "Git නාමාවලිය",
                    placeholder: "github නාමාවලි පිහිටීම",
                    requiredMessage: "Git බහලුම අවශ්‍යයි."
                },
                gitUrl: {
                    label: "Git Repository URI",
                    placeholder: "ගිතබ් නිධිය URL සඳහා සබැඳිය.",
                    requiredMessage: "Git Repository URL අවශ්‍යයි."
                },
                gitUserName: {
                    label: "Git පරිශීලක නාමය",
                    placeholder: "GitHub ගිණුමේ පරිශීලක නාමය."
                }
            },
            list: {
                columns: {
                    actions: "ක්‍රියා",
                    failedDeployments: "යෙදවීම අසාර්ථක විය",
                    lastDeployed: "අවසන් වරට යොදවා ඇත",
                    name: "නම",
                    successfulDeployments: "සාර්ථක යෙදවීම"
                },
                confirmations: {
                    deleteConfig: {
                        assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{name}}</1> ටයිප් කරන්න.",
                        content: "ඔබ මෙම වින්‍යාසය මකා දැමුවහොත් ඔබට එය නැවත ලබා ගත නොහැකි " +
                            "වනු ඇත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                        header: "ඔබට විශ්වාසද?",
                        message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර වින්‍යාසය ස්ථිරවම මකා දමනු ඇත."
                    }
                }
            },
            notifications: {
                createConfig: {
                    error: {
                        description: "{{description}}",
                        message: "වින්‍යාසය සුරැකීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "වින්‍යාසය සුරැකීමට අපොහොසත් විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "වින්‍යාසය සාර්ථකව සුරකින ලදි.",
                        message: "වින්‍යාසය සුරකින්න"
                    }
                },
                deleteConfig: {
                    error: {
                        description: "{{description}}",
                        message: "වින්‍යාස දෝෂය මකන්න"
                    },
                    genericError: {
                        description: "වින්‍යාසය මකා දැමීමට අපොහොසත් විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "වින්‍යාසය සාර්ථකව මකා දමන ලදි.",
                        message: "වින්‍යාසය මකන්න"
                    }
                },
                editConfig: {
                    error: {
                        description: "{{description}}",
                        message: "සංස්කරණය කිරීමේ දෝෂය"
                    },
                    genericError: {
                        description: "වින්‍යාස කිරීමේ තත්වය වෙනස් කිරීමට අපොහොසත් විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "වින්‍යාස කිරීමේ තත්වය සාර්ථකව වෙනස් කරන ලදි",
                        message: "වෙනස් කිරීම සාර්ථකයි"
                    }
                },
                getConfig: {
                    error: {
                        description: "{{description}}",
                        message: "වින්‍යාසය නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "වින්‍යාසය ලබා ගැනීමට අපොහොසත් විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "වින්‍යාසය සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "වින්‍යාසය නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                triggerConfig: {
                    error: {
                        description: "{{description}}",
                        message: "ප්‍රේරක දෝෂයකි"
                    },
                    genericError: {
                        description: "වින්‍යාසය ක්‍රියාත්මක කිරීමට අපොහොසත් විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "වින්‍යාසය සාර්ථකව අවුලුවන.",
                        message: "ප්‍රේරක වින්‍යාසය සාර්ථකයි"
                    }
                }
            },
            pageTitles: {
                configurationPage: {
                    subTitle: "හැඳුනුම් සේවාදායකය සමඟ බාධාවකින් තොරව වැඩ කිරීම සඳහා GitHub"
                        + " ගබඩාව වින්‍යාස කරන්න.",
                    title: "දුරස්ථ වින්‍යාසයන්"
                }
            },
            placeholders: {
                emptyDetails: {
                    subtitles: {
                        0: "වින්‍යාසය තවමත් යොදවා නොමැත.",
                        1: "කරුණාකර වින්‍යාසය යොදවා නැවත පරීක්ෂා කරන්න."
                    },
                    title: "වින්‍යාසය යොදවා නොමැත."
                },
                emptyList: {
                    action: "නව දුරස්ථ නිධි වින්‍යාසය",
                    subtitles: {
                        0: "දැනට වින්‍යාසයන් නොමැත.",
                        1: "ඔබට නව වින්‍යාසයක් එක් කළ හැකිය",
                        2: "පහත බොත්තම ක්ලික් කරන්න."
                    },
                    title: "නව දුරස්ථ නිධි වින්‍යාසය එක් කරන්න"
                }
            }
        },
        sidePanel: {
            applicationEdit: "යෙදුම් සංස්කරණය",
            applicationTemplates: "යෙදුම් ආකෘති",
            applications: "අයදුම්පත්",
            categories: {
                application: "අයදුම්පත්",
                general: "ජනරාල්",
                gettingStarted: "ඇරඹේ",
                identityProviders: "හැඳුනුම්පත් සපයන්නන්"
            },
            customize: "අභිරුචිකරණය කරන්න",
            identityProviderEdit: "හැඳුනුම්පත් සපයන්නන් සංස්කරණය කරන්න",
            identityProviderTemplates: "හැඳුනුම්පත් සපයන්නාගේ ආකෘති",
            identityProviders: "හැඳුනුම්පත් සපයන්නන්",
            oidcScopes: "OIDC විෂය පථ",
            oidcScopesEdit: "OIDC විෂය පථ සංස්කරණය",
            overview: "දළ විශ්ලේෂණය",
            privacy: "පෞද්ගලිකත්වය",
            remoteRepo: "දුරස්ථ රෙපෝ වින්‍යාසය",
            remoteRepoEdit: "දුරස්ථ රෙපෝ වින්‍යාස සංස්කරණය"
        },
        templates: {
            emptyPlaceholder: {
                action: null,
                subtitles: "කරුණාකර මෙහි පෙන්වීමට සැකිලි එක් කරන්න.",
                title: "පෙන්වීමට සැකිලි නොමැත."
            }
        },
        transferList: {
            list: {
                emptyPlaceholders: {
                    default: "මේ වන විට මෙම ලැයිස්තුවේ අයිතම නොමැත.",
                    users: {
                        roles: {
                            selected: "මෙම පරිශීලකයාට {{type} පවරා නොමැත.",
                            unselected: "මෙම පරිශීලකයාට පැවරීම සඳහා {{type}} නොමැත."
                        }
                    }
                },
                headers: {
                    0: "වසම්",
                    1: "නම"
                }
            },
            searchPlaceholder: "සොයන්න {{type}}"
        }
    },
    notifications: {
        endSession: {
            error: {
                description: "{{description}}",
                message: "අවසන් කිරීමේ දෝෂයකි"
            },
            genericError: {
                description: "වත්මන් සැසිය අවසන් කිරීමට නොහැකි විය.",
                message: "යම් දෝෂයක් ඇති වී ඇත"
            },
            success: {
                description: "වත්මන් සැසිය සාර්ථකව අවසන් කරන ලදි.",
                message: "අවසන් කිරීම සාර්ථකයි"
            }
        },
        getProfileInfo: {
            error: {
                description: "{{description}}",
                message: "නැවත ලබා ගැනීමේ දෝෂයකි"
            },
            genericError: {
                description: "පරිශීලක පැතිකඩ විස්තර ලබා ගැනීමට නොහැකි විය.",
                message: "යම් දෝෂයක් ඇති වී ඇත"
            },
            success: {
                description: "පරිශීලක පැතිකඩ විස්තර සාර්ථකව ලබා ගන්නා ලදි.",
                message: "නැවත ලබා ගැනීම සාර්ථකයි"
            }
        },
        getProfileSchema: {
            error: {
                description: "{{description}}",
                message: "නැවත ලබා ගැනීමේ දෝෂයකි"
            },
            genericError: {
                description: "පරිශීලක පැතිකඩ යෝජනා ක්‍රම ලබා ගැනීමට නොහැකි විය.",
                message: "යම් දෝෂයක් ඇති වී ඇත"
            },
            success: {
                description: "පරිශීලක පැතිකඩ යෝජනා ක්‍රම සාර්ථකව ලබා ගන්නා ලදි.",
                message: "නැවත ලබා ගැනීම සාර්ථකයි"
            }
        }
    },
    pages: {
        applicationTemplate: {
            backButton: "යෙදුම් වෙත ආපසු යන්න",
            subTitle: "කරුණාකර පහත යෙදුම් වර්ග වලින් එකක් තෝරන්න.",
            title: "යෙදුම් වර්ගය තෝරන්න"
        },
        applications: {
            subTitle: "සැකිලි මත පදනම්ව යෙදුම් සාදන්න සහ කළමනාකරණය කරන්න සහ සත්‍යාපනය වින්‍යාස කරන්න.",
            title: "අයදුම්පත්"
        },
        applicationsEdit: {
            backButton: "යෙදුම් වෙත ආපසු යන්න",
            subTitle: null,
            title: null
        },
        idp: {
            subTitle: "සැකිලි මත පදනම්ව අනන්‍යතා සපයන්නන් නිර්මාණය කිරීම සහ කළමනාකරණය"
                + " කිරීම සහ සත්‍යාපනය වින්‍යාස කිරීම.",
            title: "හැඳුනුම්පත් සපයන්නන්"
        },
        idpTemplate: {
            backButton: "හැඳුනුම්පත් සපයන්නන් වෙත ආපසු යන්න",
            subTitle: "කරුණාකර පහත අනන්‍යතා සැපයුම්කරු වර්ග වලින් එකක් තෝරන්න.",
            supportServices: {
                authenticationDisplayName: "සත්‍යාපනය",
                provisioningDisplayName: "ප්‍රතිපාදන"
            },
            title: "අනන්‍යතා සැපයුම්කරු වර්ගය තෝරන්න"
        },
        oidcScopes: {
            subTitle: "OIDC විෂය පථයන් සහ විෂය පථයන්ට බැඳී ඇති ගුණාංග නිර්මාණය කර කළමනාකරණය කරන්න.",
            title: "OIDC විෂය පථ"
        },
        oidcScopesEdit: {
            backButton: "විෂය පථ වෙත ආපසු යන්න",
            subTitle: "විෂය පථයේ OIDC ගුණාංග එකතු කිරීම හෝ ඉවත් කිරීම",
            title: "විෂය පථය සංස්කරණය කරන්න"
        },
        overview: {
            subTitle: "යෙදුම්, අනන්‍යතා සපයන්නන්, පරිශීලකයින් සහ භූමිකාවන් වින්‍යාස කිරීම සහ කළමනාකරණය " +
                "කිරීම, උපභාෂා ආරෝපණය කිරීම යනාදිය.",
            title: "සාදරයෙන් පිළිගනිමු, {{firstName}}"
        }
    },
    placeholders: {
        404: {
            action: "ආපසු ගෙදර යන්න",
            subtitles: {
                0: "ඔබ සොයන පිටුව අපට සොයාගත නොහැකි විය.",
                1: "මුල් පිටුව වෙත හරවා යැවීමට කරුණාකර URL එක පරීක්ෂා කරන්න හෝ පහත බොත්තම ක්ලික් කරන්න."
            },
            title: "පිටුව හමු නොවීය"
        },
        accessDenied: {
            action: "ඉවත් වීම දිගටම කරගෙන යන්න",
            subtitles: {
                0: "මෙම ද්වාරය භාවිතා කිරීමට ඔබට අවසර නොමැති බව පෙනේ.",
                1: "කරුණාකර වෙනත් ගිණුමක් සමඟ පුරනය වන්න."
            },
            title: "ඔබට අවසර නැත"
        },
        consentDenied: {
            action: "ඉවත් වීම දිගටම කරගෙන යන්න",
            subtitles: {
                0: "මෙම යෙදුම සඳහා ඔබ කැමැත්ත ලබා දී නොමැති බව පෙනේ.",
                1: "කරුණාකර යෙදුම භාවිතා කිරීමට කැමැත්ත ලබා දෙන්න."
            },
            title: "ඔබ කැමැත්ත ප්‍රතික්ෂේප කර ඇත"
        },
        emptySearchResult: {
            action: "සෙවුම් විමසුම හිස් කරන්න",
            subtitles: {
                0: "\"{{query}}\" සඳහා අපට කිසිදු ප්‍රතිපලයක් සොයාගත නොහැකි විය",
                1: "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න."
            },
            title: "ප්‍රතිපල හමු නොවීය"
        },
        genericError: {
            action: "පිටුව නැවුම් කරන්න",
            subtitles: {
                0: "මෙම පිටුව ප්‍රදර්ශනය කිරීමේදී යමක් වැරදී ඇත.",
                1: "තාක්ෂණික විස්තර සඳහා බ්‍රව්සර් කොන්සෝලය බලන්න."
            },
            title: "යම් දෝෂයක් ඇති වී ඇත"
        },
        loginError: {
            action: "ඉවත් වීම දිගටම කරගෙන යන්න",
            subtitles: {
                0: "මෙම ද්වාරය භාවිතා කිරීමට ඔබට අවසර නොමැති බව පෙනේ.",
                1: "කරුණාකර වෙනත් ගිණුමක් සමඟ පුරනය වන්න."
            },
            title: "ඔබට අවසර නැත"
        },
        unauthorized: {
            action: "ඉවත් වීම දිගටම කරගෙන යන්න",
            subtitles: {
                0: "මෙම ද්වාරය භාවිතා කිරීමට ඔබට අවසර නොමැති බව පෙනේ.",
                1: "කරුණාකර වෙනත් ගිණුමක් සමඟ පුරනය වන්න."
            },
            title: "ඔබට අවසර නැත"
        },
        underConstruction: {
            action: "ආපසු ගෙදර යන්න",
            subtitles: {
                0: "අපි මේ පිටුවේ යම් වැඩක් කරනවා.",
                1: "කරුණාකර අප සමඟ ඉවසීමෙන් පසුව නැවත එන්න. ඔබේ ඉවසීමට ස්තුතියි."
            },
            title: "පිටුව ඉදිවෙමින් පවතී"
        }
    },
    technologies: {
        android: "Android",
        angular: "Angular",
        ios: "iOS",
        java: "Java",
        python: "Python",
        react: "React",
        windows: "Windows"
    }
};

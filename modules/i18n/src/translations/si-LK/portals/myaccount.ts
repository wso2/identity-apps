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

import { MyAccountNS } from "../../../models";

export const myAccount: MyAccountNS = {
    components: {
        accountRecovery: {
            codeRecovery: {
                descriptions: {
                    add: "කේත ප්\u200Dරතිසාධන විකල්ප එකතු කිරීම හෝ යාවත්කාලීන කිරීම"
                },
                heading: "කේත ප්\u200Dරතිසාධනය"
            },
            emailRecovery: {
                descriptions: {
                    add: "ප්රතිසාධන ඊමේල් තැපැල් ලිපිනයක් එක් කරන්න",
                    update: "ප්රතිසාධන ඊමේල් තැපැල් ලිපිනය යාවත්කාලීන කරන්න ({{email}})",
                    view: "ප්‍රතිසාධන ඊමේල් තැපැල් ලිපිනය බලන්න ({{email}})"
                },
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label: "ඊමේල් ලිපිනය",
                                placeholder: "ප්\u200Dරතිසාධන ඊමේල් ලිපිනය ඇතුළත් කරන්න",
                                validations: {
                                    empty: "ඊමේල් ලිපිනයක් ඇතුළත් කරන්න",
                                    invalidFormat: "ඊමේල් ලිපිනය නිවැරදි ආකෘතියෙන් නොවේ"
                                }
                            }
                        }
                    }
                },
                heading: "ඊමේල් ප්\u200Dරතිසාධනය",
                notifications: {
                    updateEmail: {
                        error: {
                            description: "{{description}}",
                            message: "ප්\u200Dරතිසාධන ඊමේල් ලිපිනය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය"
                        },
                        genericError: {
                            description: "ප්\u200Dරතිසාධන ඊමේල් ලිපිනය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "දෝෂයක් ඇතිවිය !!!"
                        },
                        success: {
                            description: "පරිශීලක පැතිකඩෙහි ඊමේල් ලිපිනය සාර්ථකව යාවත්කාලීන කර ඇත",
                            message: "ඊමේල් ලිපිනය සාර්ථකව යාවත්කාලීන කර ඇත"
                        }
                    }
                }
            },
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "ප්‍රතිසාධන මනාපය ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "ප්‍රතිසාධන මනාපය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "මොකක්හරි වැරැද්දක් වෙලා"
                    },
                    success: {
                        description: "ප්‍රතිසාධන මනාපය සාර්ථකව ලබා ගන්නා ලදි",
                        message: "ප්‍රතිසාධන මනාප ලබා ගැනීම සාර්ථකයි"
                    }
                }
            },
            questionRecovery: {
                descriptions: {
                    add: "ගිණුම් ප්\u200D‍රතිසාධන අභියෝග ප්\u200D‍රශ්න එකතු කිරීම හා යාවත්කාලීන කිරීම"
                },
                forms: {
                    securityQuestionsForm: {
                        inputs: {
                            answer: {
                                label: "පිළිතුර",
                                placeholder: "ඔබේ පිළිතුර ඇතුළත් කරන්න",
                                validations: {
                                    empty: "පිළිතුර අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි"
                                }
                            },
                            question: {
                                label: "ප්\u200Dරශ්නය",
                                placeholder: "ආරක්ෂක ප්\u200Dරශ්නයක් තෝරන්න",
                                validations: {
                                    empty: "අවම වශයෙන් එක් ආරක්ෂක ප්\u200Dරශ්නයක්වත් තෝරා ගත යුතුය"
                                }
                            }
                        }
                    }
                },
                heading: "ආරක්ෂක ප්\u200Dරශ්න",
                notifications: {
                    addQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "ආරක්ෂක ප්\u200Dරශ්න වින්\u200Dයාස කිරීමේදී දෝෂයක් ඇතිවිය"
                        },
                        genericError: {
                            description: "ආරක්ෂක ප්\u200Dරශ්න වින්\u200Dයාස කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "දෝෂයක් ඇතිවිය !!!"
                        },
                        success: {
                            description: "අවශ්\u200Dය ආරක්ෂක ප්\u200Dරශ්න සාර්ථකව එකතු කරන ලදි",
                            message: "ආරක්ෂක ප්\u200Dරශ්න සාර්ථකව එකතු කරන ලදි"
                        }
                    },
                    updateQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "ආරක්ෂක ප්\u200Dරශ්න යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය"
                        },
                        genericError: {
                            description: "ආරක්ෂක ප්\u200Dරශ්න යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "දෝෂයක් ඇතිවිය !!!"
                        },
                        success: {
                            description: "අවශ්\u200Dය ආරක්ෂක ප්\u200Dරශ්න සාර්ථකව යාවත්කාලීන කරන ලදි",
                            message: "ආරක්ෂක ප්\u200Dරශ්න සාර්ථකව යාවත්කාලීන කරන ලදි"
                        }
                    }
                }
            }
        },
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
                        label: "පෙරහන් ගුණාංගය",
                        placeholder: "උදා: නම, විස්තරය ආදිය.",
                        validations: {
                            empty: "පෙරහන් ගුණාංගය අවශ්‍ය ක්ෂේත්‍රයකි"
                        }
                    },
                    filterCondition: {
                        label: "පෙරහන් තත්වය",
                        placeholder: "උදා: සමඟ ආරම්භ වේ.",
                        validations: {
                            empty: "පෙරහන් තත්ත්වය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
                        }
                    },
                    filterValue: {
                        label: "පෙරහන් අගය",
                        placeholder: "උදා: admin, wso2 ආදිය.",
                        validations: {
                            empty: "පෙරහන් අගය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
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
                header: "සංකීර්ණ සෙවීම"
            },
            placeholder: "නමින් සොයන්න",
            popups: {
                clear: "මකන්න",
                dropdown: "විකල්ප පෙන්වන්න"
            },
            resultsIndicator: "{{query}} සඳහා ප්රතිපල"
        },
        applications: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "උදා: නම, විස්තරය ආදිය."
                        },
                        filterCondition: {
                            placeholder: "උදා: සමඟ ආරම්භ වේ."
                        },
                        filterValue: {
                            placeholder: "සෙවීමට අගය ඇතුළත් කරන්න"
                        }
                    }
                },
                placeholder: "නමින් සොයන්න"
            },
            all: {
                heading: "සියලුම ඇප්ස්"
            },
            favourite: {
                heading: "ප්රියතම ඇප්ස්"
            },
            notifications: {
                fetchApplications: {
                    error: {
                        description: "{{description}}",
                        message: "ඇප්ස් ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "ඇප්ස් ලබා ගැනීමේ දෝෂයකි",
                        message: "දෝෂයක් ඇතිවිය"
                    },
                    success: {
                        description: "ඇප්ස් සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "සාර්ථකයි"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "ලැයිස්තුව නැවුම් කරන්න",
                    subtitles: {
                        0: "ඇප් ලැයිස්තුව හිස් විය.",
                        1: "සොයාගැනීමේ අවසර ඇති ඇප් නොමැති වීම මෙයට හේතුව විය හැකිය.",
                        2: "ඇප් සඳහා සොයා ගැනීමේ හැකියාව සක්‍රීය කිරීමට කරුණාකර පරිපාලකයෙකුගෙන් විමසන්න."
                    },
                    title: "ඇප්ස් නොමැත"
                }
            },
            recent: {
                heading: "මෑතකදී විවෘත කළ ඇප්ස්"
            }
        },
        changePassword: {
            forms: {
                passwordResetForm: {
                    inputs: {
                        confirmPassword: {
                            label: "මුරපදය තහවුරු කරන්න",
                            placeholder: "නව මුරපදය ඇතුළත් කරන්න",
                            validations: {
                                empty: "මුරපදය තහවුරු කිරීම අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි",
                                mismatch: "මුරපද තහවුරු කිරීම නොගැලපේ"
                            }
                        },
                        currentPassword: {
                            label: "වත්මන් මුරපදය",
                            placeholder: "වත්මන් මුරපදය ඇතුළත් කරන්න",
                            validations: {
                                empty: "වත්මන් මුරපදය අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි",
                                invalid: "වත්මන් මුරපදය අවලංගුය"
                            }
                        },
                        newPassword: {
                            label: "නව මුරපදය",
                            placeholder: "නව මුරපදය ඇතුළත් කරන්න",
                            validations: {
                                empty: "නව මුරපදය අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි"
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "දෝෂයක් ඇතිවිය!! කරුණාකර නැවත උත්සාහ කරන්න",
                            message: "මුරපද වෙනස් කිරීමේ දෝෂයකි"
                        },
                        invalidCurrentPassword: {
                            description: "ඔබ ඇතුලත් කළ මුරපදය අවලංගු බව පෙනේ. කරුණාකර නැවත උත්සාහ කරන්න",
                            message: "මුරපද වෙනස් කිරීමේ දෝෂයකිි"
                        },
                        passwordCaseRequirement: "අවම වශයෙන් එක් ලොකු අකුරක් සහ කුඩා අකුරක්",
                        passwordCharRequirement: "අවම වශයෙන් එක් සංකේතයක් වත් !@#$%^&*",
                        passwordLengthRequirement: "අක්ෂර 8 කට වඩා",
                        passwordNumRequirement: "අවම වශයෙන් එක් අංකයක්",
                        submitError: {
                            description: "{{description}}",
                            message: "මුරපද වෙනස් කිරීමේ දෝෂයකි"
                        },
                        submitSuccess: {
                            description: "මුරපදය සාර්ථකව වෙනස් කර ඇත",
                            message: "මුරපද යළි පිහිටුවීම සාර්ථකයි"
                        }
                    }
                }
            },
            modals: {
                confirmationModal: {
                    heading: "තහවුරු කිරීම",
                    message:
                        "මුරපදය වෙනස් කිරීමෙන් වත්මන් සැසිය අවසන් වේ. අලුතින් වෙනස් කළ මුරපදය සමඟ " +
                        "ඔබට ප්\u200Dරවේශ වීමට සිදුවනු ඇත. ඉදිරියට යාමට ඔබ කැමතිද?"
                }
            }
        },
        consentManagement: {
            editConsent: {
                collectionMethod: "ගොනුකිරීමේ ක්\u200Dරමය",
                dangerZones: {
                    revoke: {
                        actionTitle: "අවලංගු කරන්න",
                        header: "කැමැත්ත අවලංගු කරන්න",
                        subheader: "ඔබට මෙම ඇප් එක සඳහා නැවත කැමැත්ත ලබා දීමට සිදුවේ."
                    }
                },
                description: "සටහන",
                piiCategoryHeading:
                    "ඇප් එක සමඟ ඔබේ පුද්ගලික තොරතුරු එකතු කිරීම සහ බෙදා ගැනීම සඳහා කැමැත්ත කළමනාකරණය කරන්න. " +
                    "ඔබට අවලංගු කිරීමට අවශ්‍ය ගුණාංග ඉවත් කර යාවත්කාලීන සුරැකීමට යාවත්කාලීන බොත්තම ඔබන්න. " +
                    "සියලු ගුණාංග සඳහා කැමැත්ත ඉවත් කිරීමට අවලංගු කිරීමේ බොත්තම ඔබන්න.",
                state: "තත්වය",
                version: "පිටපත"
            },
            modals: {
                consentRevokeModal: {
                    heading: "ඔබට විශ්වාසද?",
                    message:
                        "මෙම මෙහෙයුම ආපසු හැරවිය නොහැක. මෙය සියලු ගුණාංග සඳහා වන කැමැත්ත ස්ථිරවම අවලංගු කරනු ඇත. ඔබට " +
                        "ඉදිරියට යාමට අවශ්‍ය බව ඔබට විශ්වාසද?",
                    warning: "ඔබ පිවිසුම් කැමැත්ත පිටුවට හරවා යවන බව කරුණාවෙන් සලකන්න"
                }
            },
            notifications: {
                consentReceiptFetch: {
                    error: {
                        description: "{{description}}",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    genericError: {
                        description: "තෝරාගත් යෙදුමේ තොරතුරු පූරණය කළ නොහැක",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "අනුමත රිසිට්පත සාර්ථකව ලබා ගන්නා ලදි",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                consentedAppsFetch: {
                    error: {
                        description: "{{description}}",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    genericError: {
                        description: "අනුමත යෙදුම් ලැයිස්තුව පූරණය කළ නොහැක",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "අනුමත යෙදුම් ලැයිස්තුව සාර්ථකව ලබා ගන්නා ලදි",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                revokeConsentedApp: {
                    error: {
                        description: "{{description}}",
                        message: "අනුමැතිය අවලංගු කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "යෙදුම සඳහාවූ අනුමැතිය අවලංගු කිරීමට නොහැකි විය.",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "යෙදුම සඳහාවූ අනුමැතිය සාර්ථකව අවලංගු කර ඇත",
                        message: "අනුමැතිය අවලංගු කිරීම සාර්ථකය"
                    }
                },
                updateConsentedClaims: {
                    error: {
                        description: "{{description}}",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    genericError: {
                        description: "යෙදුම සඳහා එකඟ වූ හිමිකම් යාවත්කාලීන කිරීමට අසමත් විය",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "යෙදුම සඳහා එකඟ වූ හිමිකම් සාර්ථකව යාවත්කාලීන කර ඇත",
                        message: "අනුමත හිමිකම් සාර්ථකව යාවත්කාලීන කරන ලදි"
                    }
                }
            }
        },
        cookieConsent: {
            confirmButton: "මම එකඟයි",
            content: "ඔබට හොඳම සමස්ත අත්දැකීම ලබා ගැනීම සහතික කිරීම සඳහා අපි කුකීස් භාවිතා කරමු. මෙම කුකීස් " +
                "භාවිතා කරනුයේ සුමට හා පුද්ගලීකරණය කළ සේවාවන් සපයන අතරම අඛණ්ඩ අඛණ්ඩ සැසියක් පවත්වා ගන්න." +
                "අපි කුකීස් භාවිතා කරන ආකාරය ගැන තව දැනගන්න, අපගේ <1>Cookie Policy</1> එක බලන්න."
        },
        federatedAssociations: {
            deleteConfirmation: "මෙම ක්‍රියාව මගින්, ඔබේ ගිණුමේ මෙම බාහිර පිවිසුම ඉවත් කරයි. එය සනාථ කිරීමට ඔබට " +
                "අවශ්‍යද?",
            notifications: {
                getFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    genericError: {
                        description: "බාහිර පිවිසුම් ලබා ගැනීමට නොහැකි විය",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "බාහිර පිවිසුම් සාර්ථකව ලබාගෙන ඇත",
                        message: "බාහිර පිවිසුම් සාර්ථකව ලබා ගන්නා ලදි"
                    }
                },
                removeAllFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    genericError: {
                        description: "බාහිර පිවිසුම් ඉවත් කළ නොහැක",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "සියලුම බාහිර පිවිසුම් සාර්ථකව ඉවත් කර ඇත",
                        message: "බාහිර පිවිසුම් සාර්ථකව ඉවත් කරන ලදි"
                    }
                },
                removeFederatedAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    genericError: {
                        description: "බාහිර පිවිසුම ඉවත් කළ නොහැක",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "බාහිර පිවිසුම සාර්ථකව ඉවත් කර ඇත",
                        message: "බාහිර පිවිසුම සාර්ථකව ඉවත් කරන ලදි"
                    }
                }
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        header: {
            appSwitch: {
                console: {
                    description: "සංවර්ධකයින් හෝ පරිපාලකයින් ලෙස කළමනාකරණය කරන්න",
                    name: "Console"
                },
                myAccount: {
                    description: "ඔබේම ගිණුම කළමනාකරණය කරන්න",
                    name: "My Account"
                },
                tooltip: "Apps"
            },
            organizationLabel: "මෙම ගිණුම කළමනාකරණය කරන්නේ"
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: "ස්ථානික පරිශීලක ගිණුම එක් කරන්න"
                }
            },
            deleteConfirmation: "මෙය ඔබගේ ගිණුමෙන් සම්බන්ධිත ගිණුම ඉවත් කරයි. දිගටම ඉවත් කිරීමට ඔබට අවශ්‍යද?",
            forms: {
                addAccountForm: {
                    inputs: {
                        password: {
                            label: "මුරපදය",
                            placeholder: "මුරපදය ඇතුළත් කරන්න",
                            validations: {
                                empty: "මුරපදය අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි"
                            }
                        },
                        username: {
                            label: "පරිශීලක නාමය",
                            placeholder: "පරිශීලක නාමය ඇතුළත් කරන්න",
                            validations: {
                                empty: "ඇතුළත් කරන්න අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි"
                            }
                        }
                    }
                }
            },
            notifications: {
                addAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "සම්බන්ධිත පරිශීලක ගිණුම් ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "සම්බන්ධිත ගිණුම එකතු කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "අවශ්‍ය සම්බන්ධිත පරිශීලක ගිණුම සාර්ථකව එකතු කරන ලදි",
                        message: "සම්බන්ධිත පරිශීලක ගිණුම සාර්ථකව එක් කරන ලදි"
                    }
                },
                getAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "සම්බන්ධිත පරිශීලක ගිණුම් ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "සම්බන්ධිත පරිශීලක ගිණුම් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "අවශ්‍ය පරිශීලක පැතිකඩ විස්තර සාර්ථකව ලබා ගන්නා ලදි",
                        message: "සම්බන්ධිත පරිශීලක ගිණුම් සාර්ථකව ලබා ගන්නා ලදි"
                    }
                },
                removeAllAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "සම්බන්ධිත පරිශීලක ගිණුම් ඉවත් කිරීමේ දෝෂයකිs"
                    },
                    genericError: {
                        description: "සම්බන්ධිත පරිශීලක ගිණුම් ඉවත් කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය"
                    },
                    success: {
                        description: "සම්බන්ධිත සියලුම පරිශීලක ගිණුම් ඉවත් කර ඇත",
                        message: "සම්බන්ධිත ගිණුම් සාර්ථකව ඉවත් කරන ලදි"
                    }
                },
                removeAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "සම්බන්ධිත පරිශීලක ගිණුම ඉවත් කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "සම්බන්ධිත පරිශීලක ගිණුම ඉවත් කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය"
                    },
                    success: {
                        description: "සම්බන්ධිත පරිශීලක ගිණුම් ඉවත් කර ඇත",
                        message: "සම්බන්ධිත ගිණුම සාර්ථකව ඉවත් කරන ලදි"
                    }
                },
                switchAccount: {
                    error: {
                        description: "{{description}}",
                        message: "ගිණුම මාරු කිරීමේදී දෝෂයක් ඇතිවිය"
                    },
                    genericError: {
                        description: "ගිණුම මාරු කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය"
                    },
                    success: {
                        description: "ගිණුම සාර්ථකව මාරු කර ඇත",
                        message: "ගිණුම සාර්ථකව මාරු විය"
                    }
                }
            }
        },
        loginVerifyData: {
            description: "පුරනය වීමේදී ඔබගේ අනන්‍යතාවය තවදුරටත් තහවුරු කර ගැනීමට මෙම දත්ත භාවිතා කරයි",
            heading: "ඔබගේ පිවිසුම සත්‍යාපනය සඳහා භාවිතා කරන දත්ත ",
            modals: {
                clearTypingPatternsModal: {
                    heading: "තහවුරු කිරීම",
                    message: "මෙම ක්‍රියාව මගින් TypingDNA හි සුරකින ලද ඔබේ ටයිප් රටා ඉවත් කරනු ඇත. ඉදිරියට " +
                        "යාමට ඔබ කැමතිද?"
                }
            },
            notifications: {
                clearTypingPatterns: {
                    error: {
                        description: "ටයිප් කිරීමේ රටා ඉවත් කළ නොහැක. කරුණාකර ඔබේ අඩවි පරිපාලක අමතන්න",
                        message: "යතුරු ලියන රටා ඉවත් කිරීමට අපොහොසත් විය"
                    },
                    success: {
                        description: "TypingDNA හි ඔබේ යතුරු ලියන රටා සාර්ථකව ඉවත් කර ඇත",
                        message: "ටයිප් කිරීමේ රටා සාර්ථකව නිෂ්කාශනය විය"
                    }
                }
            },
            typingdna: {
                description: "ඔබේ ටයිප් කිරීමේ රටා මෙතැනින් ඉවත් කළ හැකිය",
                heading: "TypingDNA ටයිප් කිරීමේ රටා"
            }
        },
        mfa: {
            authenticatorApp: {
                addHint: "QR කේතය වින්‍යාස කරන්න",
                configuredDescription: "සාධක දෙකක සත්‍යාපනය සඳහා ඔබේ වින්‍යාසගත සත්‍යාපන " +
                    "යෙදුමෙන් ඔබට TOTP කේත භාවිතා කළ හැකිය. ඔබට යෙදුමට ප්‍රවේශය නොමැති නම් " +
                    "මෙතැනින් ඔබට නව සත්‍යාපන යෙදුමක් සැකසිය හැකිය",
                deleteHint: "QR කේතය මකා දමයි",
                description: "යෙදුම් වලට ප්‍රවේශවීමේදී දෙවන සාධකය ලෙස කාලය " +
                    "මත පදනම් වූ, එක් වරක් මුර කේත (TOTP ලෙසද හැඳින්වේ) භාවිතා " +
                    "කිරීමට Authenticator යෙදුමක් භාවිතයෙන් QR කේතය පරිලෝකනය කරන්න.",
                enableHint: "TOTP සබල/අබල කරන්න",
                heading: "සත්‍යාපන යෙදුම",
                hint: "QR කේතය පෙන්වන්න",
                modals: {
                    delete : {
                        heading: "තහවුරු කිරීම",
                        message: "මෙම ක්‍රියාව මඟින් ඔබේ පැතිකඩට එකතු කළ QR කේතය ඉවත් කෙරේ. " +
                            "ඔබ දිගටම කරගෙන යාමට කැමතිද ?"
                    },
                    done: "සාර්ථකත්වය! දැන් ඔබට සාධක දෙකක සත්‍යාපනය සඳහා ඔබේ සත්‍යාපන යෙදුම භාවිතා කළ හැකිය",
                    heading: "Set Up An Authenticator App",
                    scan: {
                        additionNote: "QR කේතය ඔබේ පැතිකඩට සාර්ථකව එකතු කර ඇත!",
                        authenticatorApps: "සත්‍යාපන යෙදුම්",
                        generate: "නව කේතයක් ජනනය කරන්න",
                        heading: "සත්‍යාපන යෙදුමක් භාවිතයෙන් මෙම QR කේතය පරිලෝකනය කරන්න",
                        messageBody: "ඔබට මෙහි ඇති සත්‍යාපන යෙදුම් ලැයිස්තුවක් සොයාගත හැකිය.",
                        messageHeading: "සත්‍යාපන යෙදුමක් ස්ථාපනය කර නොමැතිද?",
                        regenerateWarning: "ඔබ නව QR කේතයක් නැවත උත්පාදනය කරන විට, ඔබ එය පරිලෝකනය " + 
                            "කර ඔබගේ සත්‍යාපන යෙදුම නැවත පිහිටුවිය යුතුය. ඔබගේ පෙර පිහිටුවීම තවදුරටත් " + 
                            "ක්‍රියා නොකරනු ඇත."
                    },
                    toolTip: "යෙදුමක් නැද්ද? <3> යෙදුම් වෙළඳසැල </ 3> App Store <3> Google Play </ 3> " +
                        "වෙතින් Google Authenticator වැනි සත්‍යාපන යෙදුමක් බාගන්න.",
                    verify: {
                        error: "සත්‍යාපනය අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.",
                        heading: "සත්‍යාපන යෙදුමෙන් සත්‍යාපන කේතය ඇතුළත් කරන්න",
                        label: "සත්යාපන කේතය",
                        placeholder: "ඔබගේ සත්‍යාපන කේතය ඇතුළත් කරන්න",
                        reScan: "නැවත පරිලෝකනය කරන්න",
                        reScanQuestion: "QR කේතය නැවත පරිලෝකනය කිරීමට අවශ්‍යද?",
                        requiredError: "සත්‍යාපන කේතය ඇතුළත් කරන්න"
                    }
                },
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "TOTP සත්‍යාපනකාරක වින්‍යාසය මැකීමේදී දෝෂයක් සිදු විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    },
                    deleteSuccess: {
                        genericMessage: "සාර්ථකව ඉවත් කරන ලදී",
                        message: "TOTP වින්‍යාසය සාර්ථකව ඉවත් කරන ලදී."
                    },
                    initError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "QR කේතය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "නව QR කේතයක් ලබා ගැනීමට උත්සාහ කිරීමේදී දෝෂයකි",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "සබල කළ සත්‍යාපන ලැයිස්තුව යාවත්කාලීන කිරීමට උත්සාහ කිරීමේදී දෝෂයක් ඇති විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    }
                },
                regenerate: "නැවත උත්පාදනය කරන්න"
            },
            backupCode: {
                download: {
                    heading: "ඔබගේ උපස්ථ කේත සුරකින්න.",
                    info1: "ඔබට එක් එක් උපස්ථ කේතය භාවිතා කළ හැක්කේ එක් වරක් පමණි.",
                    info2: "මෙම කේත ජනනය කරන ලදී ",
                    subHeading: "ඔබ ඔබගේ දුරකථනයෙන් බැහැරව සිටින විට Asgardeo වෙත පුරනය වීමට ඔබට මෙම උපස්ථ " + 
                        "කේත භාවිතා කළ හැක. මෙම උපස්ථ කේත ආරක්ෂිත නමුත් ප්‍රවේශ විය හැකි ස්ථානයක තබා ගන්න."
                },
                heading: "උපස්ථ කේත",
                modals: {
                    description: "ඔබ ඔබගේ දුරකථනයෙන් බැහැරව සිටින විට පුරනය වීමට උපස්ථ කේත භාවිතා කරන්න. " + 
                        "ඒවා සියල්ලම භාවිතා කරන විට ඔබට තවත් උත්පාදනය කළ හැකිය",
                    download: {
                        heading: "කේත බාගන්න"
                    },
                    generate: {
                        description: "ඔබගේ උපස්ථ කේත සියල්ලම භාවිතා වේ. නව උපස්ථ කේත කට්ටලයක් ජනනය කරමු",
                        heading: "උත්පාදනය කරන්න"
                    },
                    heading: "උපස්ථ කේත",
                    info: "සෑම කේතයක්ම භාවිතා කළ හැක්කේ එක් වරක් පමණි",
                    refresh: {
                        heading: "නැවුම් කරන්න"
                    },
                    subHeading: "ඔබට පුරනය වීමට භාවිතා කළ හැකි එක් වරක් මුරකේත"
                },
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "උපස්ථ කේත මකා දැමීමේදී දෝෂයක් සිදු විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    },
                    downloadError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "නව උපස්ථ කේත බාගැනීමට උත්සාහ කිරීමේදී දෝෂයක් ඇති විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    },
                    downloadSuccess: {
                        genericMessage: {
                            description: "උපස්ථ කේත සාර්ථකව බාගත කර ඇත.",
                            message: "උපස්ථ කේත සාර්ථකව බාගන්නා ලදී."
                        },
                        message: {
                            description: "{{message}}",
                            message: "උපස්ථ කේත සාර්ථකව බාගන්නා ලදී."
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "නව උපස්ථ කේත උත්පාදනය කිරීමට උත්සාහ කිරීමේදී දෝෂයක් ඇති විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    },
                    retrieveAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "සක්‍රීය සත්‍යාපන ලැයිස්තුව ලබා ගැනීමට උත්සාහ කිරීමේදී දෝෂයක් ඇති විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    },
                    retrieveError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "උපස්ථ කේත ලබා ගැනීමේදී දෝෂයක් ඇති විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        genericError: {
                            description: "සබල කළ සත්‍යාපන ලැයිස්තුව යාවත්කාලීන කිරීමට උත්සාහ කිරීමේදී දෝෂයක් ඇති විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        }
                    }
                }
            },
            fido: {
                description: "ඔබට ඔබගේ ගිණුමට පුරනය වීමට ඔබගේ උපාංගයේ FIDO2 ආරක්‍ෂක යතුරක් හෝ ජෛවමිතික භාවිත කළ හැක.",
                form: {
                    label: "ආරක්ෂක යතුර/ජීවමිතික",
                    placeholder: "ආරක්ෂක යතුර/ජීවමිතික සඳහා නමක් ඇතුළත් කරන්න",
                    remove: "ආරක්ෂක යතුර/ජීවමිතික ඉවත් කරන්න",
                    required: "කරුණාකර ඔබගේ ආරක්ෂක යතුර/ජෛවමිතික සඳහා නමක් ඇතුළත් කරන්න"
                },
                heading: "ආරක්ෂක යතුර/ජීවමිතික",
                modals: {
                    deleteConfirmation: {
                        assertionHint: "කරුණාකර ඔබගේ ක්‍රියාව තහවුරු කරන්න.",
                        content: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර ආරක්ෂක යතුර/ජෛවමිතික ස්ථිරවම මකනු ඇත.",
                        description: "ඔබ මෙම ආරක්‍ෂක යතුර/ජීවමිතික මකා දැමුවහොත්, ඔබට නැවත ඔබගේ ගිණුමට " +
                            "පුරනය වීමට නොහැකි විය හැක. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                        heading: "ඔයාට විශ්වාස ද?"
                    },
                    deviceRegistrationErrorModal: {
                        description: "ආරක්ෂක යතුර/ජීවමිතික ලියාපදිංචිය බාධා විය. මෙය චේතනාන්විත නොවේ නම්, " +
                            "ඔබට එම ප්‍රවාහයම නැවත උත්සාහ කිරීමට කිරීමට හැකිය.",
                        heading: "ආරක්ෂිත යතුර/ජීවමිතික ලියාපදිංචිය අසාර්ථක විය",
                        tryWithOlderDevice: "ඔබට පැරණි ආරක්ෂක යතුරක්/ජෛවමිතිකයක් සමඟින් නැවත උත්සාහ කිරීමටද හැකිය."
                    }
                },
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "ආරක්ෂක යතුර/ජීවමිතික ඉවත් කිරීමේදී දෝෂයක් සිදු විය"
                        },
                        genericError: {
                            description: "ආරක්ෂක යතුර/ජීවමිතික ඉවත් කිරීමේදී දෝෂයක් සිදු විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        success: {
                            description: "ආරක්ෂිත යතුර/ජීවමිතික ලැයිස්තුවෙන් සාර්ථකව ඉවත් කරන ලදී",
                            message: "ඔබගේ ආරක්‍ෂක යතුර/ජීවමිතික සාර්ථකව ඉවත් කරන ලදී"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "ආරක්ෂක යතුර/ජීවමිතික ලබා ගැනීමේදී දෝෂයක් සිදු විය"
                        },
                        genericError: {
                            description: "ආරක්ෂක යතුර/ජීවමිතික ලබා ගැනීමේදී දෝෂයක් සිදු විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        success: {
                            description: "ආරක්ෂිත යතුර/ජීවමිතික සාර්ථකව ලියාපදිංචි කර ඇති අතර දැන් " +
                                "ඔබට එය සත්‍යාපනය සඳහා භාවිතා කළ හැක.",
                            message: "ඔබගේ ආරක්‍ෂක යතුර/ජෛවමිතික සාර්ථකව ලියාපදිංචි විය"
                        }
                    },
                    updateDeviceName: {
                        error: {
                            description: "{{description}}",
                            message: "ආරක්ෂක යතුර/ජෛවමිතික නම යාවත්කාලීන කිරීමේදී දෝෂයක් ඇති විය"
                        },
                        genericError: {
                            description: "ආරක්ෂක යතුර/ජෛවමිතික නම යාවත්කාලීන කිරීමේදී දෝෂයක් ඇති විය",
                            message: "මොකක්හරි වැරැද්දක් වෙලා"
                        },
                        success: {
                            description: "ඔබගේ ආරක්‍ෂක යතුර/ජෛවමිතික නම සාර්ථකව යාවත්කාලීන කරන ලදී",
                            message: "ආරක්ෂිත යතුර/ජෛවමිතික නම සාර්ථකව යාවත්කාලීන කරන ලදී"
                        }
                    }
                },
                tryButton: "පැරණි ආරක්ෂක යතුරක්/Biometric සමඟ උත්සාහ කරන්න"
            },
            smsOtp: {
                descriptions: {
                    hint: "සත්\u200Dයාපන කේතය අඩංගු කෙටි පණිවිඩයක් ඔබට ලැබෙනු ඇත"
                },
                heading: "කෙටි පණිවුඩ OTP",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "ජංගම දුරකථන අංකය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය"
                        },
                        genericError: {
                            description: "ජංගම දුරකථන අංකය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "දෝෂයක් ඇතිවිය!!!"
                        },
                        success: {
                            description: "පරිශීලක පැතිකඩෙහි ඇති ජංගම දුරකථන අංකය සාර්ථකව යාවත්කාලීන වේ",
                            message: "ජංගම දුරකථන අංකය සාර්ථකව යාවත්කාලීන කරන ලදි"
                        }
                    }
                }
            }
        },
        mobileUpdateWizard: {
            done: "සාර්ථකත්වය! ඔබගේ ජංගම දුරකථන අංකය සාර්ථකව සත්‍යාපනය කර ඇත.",
            notifications: {
                resendError: {
                    error: {
                        description: "{{error}}",
                        message: "මොකක්හරි වැරැද්දක් වෙලා"
                    },
                    genericError: {
                        description: "නව සත්‍යාපන කේතයක් ලබා ගැනීමට උත්සාහ කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "මොකක්හරි වැරැද්දක් වෙලා"
                    }
                },
                resendSuccess: {
                    message: "කේත නැවත යැවීමේ ඉල්ලීම සාර්ථකව යවන ලදි"
                }
            },
            submitMobile: {
                heading: "ඔබගේ නව ජංගම දුරකථන අංකය ඇතුළත් කරන්න"
            },
            verifySmsOtp: {
                error: "සත්‍යාපනය අසාර්ථක විය. කරුණාකර නැවත උත්සාහ කරන්න.",
                generate: "නව සත්‍යාපන කේතයක් යවන්න",
                heading: "ඔබගේ ජංගම දුරකථන අංකයට යවන ලද සත්‍යාපන කේතය ඇතුළත් කරන්න",
                label: "සත්යාපන කේතය",
                placeholder: "ඔබගේ සත්‍යාපන කේතය ඇතුළත් කරන්න",
                requiredError: "සත්‍යාපන කේතය ඇතුළත් කරන්න"
            }
        },
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: "ගිණුම් ක්‍රියාකාරකම් කළමනාකරණය කරන්න"
                    },
                    description: "ඔබ දැනට පහත උපාංගයෙන් පුරනය වී ඇත",
                    header: "ගිණුම් ක්‍රියාකාරකම්"
                },
                accountSecurity: {
                    actionTitles: {
                        update: "ගිණුම් ආරක්ෂාව යාවත්කාලීන කරන්න"
                    },
                    description: "ඔබගේ ගිණුම ආරක්ෂිතව තබා ගැනීමට ඔබට උදව් කිරීමට සැකසීම් සහ නිර්දේශ",
                    header: "ගිණුම් ආරක්ෂාව"
                },
                accountStatus: {
                    complete: "ඔබගේ ගිණුම සම්පූර්ණයි",
                    completedFields: "සම්පුර්ණ කළ ක්ෂේත්‍ර",
                    completionPercentage: "ඔබගේ ගිණුම සම්පුර්ණ කිරීමේ ප්‍රතිශතය {{percentage}}%",
                    inComplete: "ඔබගේ ගිණුම සම්පූර්ණ කරන්න",
                    inCompleteFields: "අසම්පූර්ණ ක්ෂේත්‍ර",
                    mandatoryFieldsCompletion:
                        "අනිවාර්ය ක්ෂේත්‍රයන් {{total}} ගෙන් {{completed}} සම්පූර්ණ කර ඇත",
                    optionalFieldsCompletion: "විකල්ප ක්ෂේත්‍රයන් {{total}} ගෙන් {{completed}} සම්පූර්ණ කර ඇත"
                },
                consentManagement: {
                    actionTitles: {
                        manage: "අනුමැතිය පාලනය කිරීම"
                    },
                    description: "ඔබට යෙදුම් සදහා සැපයීමට අවශ්\u200Dය දත්ත පාලනය කිරීම",
                    header: "අනුමැතිය කළමනාකරණය කිරීම"
                },
                profileStatus: {
                    completionPercentage: "ඔබගේ ගිණුම සම්පුර්ණ කිරීමේ ප්‍රතිශතය {{percentage}}%",
                    description: "ඔබගේ පැතිකඩ කළමනාකරණය කරන්න",
                    header: "ඔබගේ  {{productName}} ගිණුම",
                    profileText: "ඔබගේ පුද්ගලික පැතිකඩ පිළිබඳ විස්තර",
                    readOnlyDescription: "ඔබගේ පැතිකඩ බලන්න",
                    userSourceText: "({{source} හරහා පුරනය වී ඇත)"
                }
            }
        },
        privacy: {
            about: {
                description:
                    "WSO2 හැඳුනුම් සේවාදායකය (මෙම ප්‍රතිපත්තිය තුළ “WSO2 IS” ලෙස හැඳින්වේ) යනු විවෘත " +
                    "ප්‍රමිතීන් සහ පිරිවිතරයන් මත පදනම් වූ විවෘත මූලාශ්‍ර අනන්‍යතා කළමනාකරණ සහ හිමිකම් සේවාදායකයකි.",
                heading: "WSO2 හැඳුනුම් සේවය පිලිබදව"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0: "WSO2 IS ඔබගේ ගිණුමට සැක සහිත පිවිසුම් උත්සාහයන් හඳුනා ගැනීමට " +
                                "ඔබගේ IP ලිපිනය භාවිතා කරයි.",
                            1: "WSO2 IS පොහොසත් සහ පුද්ගලාරෝපිත පරිශීලක අත්දැකීමක් ලබා දීම සඳහා " +
                                "ඔබේ මුල් නම, අවසාන නම වැනි ගුණාංග භාවිතා කරයි.",
                            2: "WSO2 IS ඔබගේ ආරක්ෂක ප්‍රශ්න සහ පිළිතුරු භාවිතා කරන්නේ ගිණුම් ප්‍රතිසාධනය සඳහා පමණි."
                        },
                        para1: "WSO2 IS ඔබේ තොරතුරු රැස් කරන්නේ ඔබේ ප්‍රවේශ අවශ්‍යතා සපුරාලීම සඳහා පමණි. " +
                            "උදාහරණයක් වශයෙන්:"
                    },
                    heading: "පුද්ගලික තොරතුරු එකතු කිරීම",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "ඔබේ පුද්ගල දත්ත ඇතුළත් කරන පරිශීලක පැතිකඩ පිටුවෙන් තොරතුරු රැස් කිරීම.",
                                1: "HTTP ඉල්ලීම, HTTP ශීර්ෂයන් සහ TCP / IP සමඟ ඔබගේ IP ලිපිනය සොයා ගැනීම.",
                                2: "ඔබගේ භූගෝලීය තොරතුරු IP ලිපිනය සමඟ ලුහුබැඳීම.",
                                3:
                                    "ඔබගේ පිවිසුම් ඉතිහාසය බ්‍රව්සර් කුකී සමඟ ලුහුබැඳීම. වැඩි විස්තර සඳහා " +
                                    "කරුණාකර අපගේ {{cookiePolicyLink}} බලන්න"
                            },
                            para1: "WSO2 IS විසින් ඔබේ තොරතුරු රැස් කරන්නේ:"
                        },
                        heading: "ලුහුබැඳීමේ තාක්ෂණයන්"
                    }
                },
                description: {
                    para1: "මෙම ප්‍රතිපත්තියෙන් WSO2 IS ඔබේ පුද්ගලික තොරතුරු, එකතු කිරීමේ අරමුණු සහ ඔබේ පුද්ගලික " +
                        "තොරතුරු රඳවා තබා ගැනීම පිළිබඳ තොරතුරු ග්‍රහණය කරගන්නේ කෙසේද යන්න විස්තර කරයි.",
                    para2: "මෙම ප්‍රතිපත්තිය යොමු කිරීම සඳහා පමණක් වන අතර එය නිෂ්පාදනයක් ලෙස මෘදුකාංගයට අදාළ වන" +
                        " බව කරුණාවෙන් සලකන්න. WSO2 Inc. සහ එහි සංවර්ධකයින්ට WSO2 IS තුළ ඇති තොරතුරු වෙත " +
                        "ප්‍රවේශයක් නොමැත. වැඩි විස්තර සඳහා කරුණාකර <1>වියාචනය</1> කොටස බලන්න.",
                    para3: "WSO2 IS හි භාවිතය සහ පරිපාලනය පාලනය කරන ආයතන, සංවිධාන හෝ පුද්ගලයින් අදාළ ආයතනය, " +
                        "සංවිධානය හෝ පුද්ගලයා විසින් දත්ත පාලනය කරන හෝ සකසන ආකාරය සැකසෙන තමන්ගේම" +
                        " රහස්‍යතා ප්‍රතිපත්ති නිර්මාණය කළ යුතුය."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "WSO2, එහි සේවකයින්, හවුල්කරුවන් සහ අනුබද්ධ සමාගම්වලට WSO2 IS හි අඩංගු " +
                                "පුද්ගලික දත්ත ඇතුළුව කිසිදු දත්තයකට ප්‍රවේශ වීමට අවශ්‍ය නොවන අතර ගබඩා කිරීම, " +
                                "සැකසීම හෝ පාලනය කිරීම අවශ්‍ය නොවේ. පුද්ගලික දත්ත ඇතුළුව සියලුම දත්ත පාලනය " +
                                "කරනු ලබන්නේ සහ සැකසෙන්නේ WSO2 IS ආයතනය විසිනි. WSO2, එහි සේවක " +
                                "හවුල්කරුවන් සහ අනුබද්ධයන් කිසිදු දත්ත රහස්‍යතා රෙගුලාසි වල අර්ථය තුළ දත්ත " +
                                "සකසනයක් හෝ දත්ත පාලකයක් නොවේ. WSO2 එවැනි ආයතන හෝ පුද්ගලයින් විසින් " +
                                "WSO2 IS භාවිතා කරන නීත්‍යානුකූල භාවය හෝ WASO2 IS භාවිතා කරන ආකාරය සහ " +
                                "අරමුණු සම්බන්ධයෙන් කිසිදු වගකීමක් හෝ වගකීමක් හෝ වගකීමක් භාර නොගනී.",
                            1: "මෙම රහස්‍යතා ප්‍රතිපත්තිය WSO2 IS ක්‍රියාත්මක වන ආයතනයේ හෝ පුද්ගලයන්ගේ තොරතුරු " +
                                "අරමුණු සඳහා වන අතර පුද්ගලික දත්ත ආරක්ෂණය සම්බන්ධයෙන් WSO2 IS හි අඩංගු ක්‍රියාවලීන් " +
                                "සහ ක්‍රියාකාරිත්වය නියම කරයි. පරිශීලකයින්ගේ පුද්ගලික දත්ත පාලනය කරන තමන්ගේම " +
                                "නීති රීති සහ ක්‍රියාවලීන් නිර්මාණය කිරීම සහ පරිපාලනය කිරීම WSO2 IS ක්‍රියාත්මක වන " +
                                "ආයතන සහ පුද්ගලයින්ගේ වගකීම වන අතර, එවැනි නීතිරීති හා ක්‍රියාවලීන් මෙහි අඩංගු " +
                                "භාවිතය, ගබඩා කිරීම සහ අනාවරණය කිරීමේ ප්‍රතිපත්ති වෙනස් කළ හැකිය. එබැවින් " +
                                "පරිශීලකයින්ගේ පුද්ගලික දත්ත පාලනය කරන තොරතුරු සඳහා පරිශීලකයින් තමන්ගේම රහස්‍යතා " +
                                "ප්‍රතිපත්තියක් සඳහා WSO2 IS ධාවනය කරන ආයතනයෙන් හෝ පුද්ගලයින්ගෙන් " +
                                "උපදෙස් ලබා ගත යුතුය."
                        }
                    },
                    heading: "වියාචනය"
                },
                disclosureOfPersonalInfo: {
                    description: "WSO2 IS විසින් WSO2 IS හි ලියාපදිංචි කර ඇති අදාළ යෙදුම් වලට (සේවා සැපයුම්කරු " +
                        "ලෙසද හැඳින්වේ) පුද්ගලික තොරතුරු පමණක් අනාවරණය කරයි. මෙම යෙදුම් ඔබගේ ආයතනයේ හෝ " +
                        "සංවිධානයේ අනන්‍යතා පරිපාලක විසිනි. පුද්ගලික තොරතුරු අනාවරණය කරනු ලබන්නේ ඔබ විසින් වෙනත් " +
                        "ආකාරයකින් කැමැත්ත ප්‍රකාශ කර නොමැති නම් හෝ නීතියෙන් නියම කර ඇති ස්ථානයක මිස, එවැනි " +
                        "සේවා සපයන්නන් විසින් පාලනය කරනු ලබන, එකතු කරන ලද අරමුණු සඳහා (හෝ එම අරමුණු වලට " +
                        "අනුකූල යැයි හඳුනාගත් භාවිතයක් සඳහා) පමණි.",
                    heading: "පුද්ගලික තොරතුරු අනාවරණය කිරීම",
                    legalProcess: {
                        description: "WSO2 IS ආයතනයට, ආයතනයට හෝ පුද්ගලිකව ක්‍රියාත්මක වන පුද්ගලයාට ඔබේ " +
                            "පුද්ගලික තොරතුරු නීතියෙන් නියම කළ යුතු හා නීත්‍යානුකූල ක්‍රියාවලියක් අවශ්‍ය වූ විට ඔබේ " +
                            "කැමැත්තෙන් හෝ නැතිව අනාවරණය කිරීමට බල කෙරෙනු ඇති බව කරුණාවෙන් සලකන්න.",
                        heading: "නීති ක්‍රියාවලිය"
                    }
                },
                heading: "රහස්‍යතා ප්‍රතිපත්තිය",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1:
                                "WSO2 IS හි යාවත්කාලීන කරන ලද අනුවාද වල මෙම ප්‍රතිපත්තියේ වෙනස්කම් අඩංගු " +
                                "විය හැකි අතර මෙම ප්‍රතිපත්තියේ සංශෝධන එවැනි වැඩිදියුණු කිරීම් තුළ ඇසුරුම් කරනු " +
                                "ලැබේ. එවැනි වෙනස්කම් අදාළ වන්නේ නවීකරණය කරන ලද අනුවාදයන් භාවිතා කිරීමට තෝරා ගන්නා " +
                                "පරිශීලකයින්ට පමණි.",
                            para2:
                                "WSO2 IS පවත්වාගෙන යන සංවිධානය වරින් වර රහස්‍යතා ප්‍රතිපත්තිය සංශෝධනය කළ හැකිය. " +
                                "WSO2 IS ක්‍රියාත්මක වන සංවිධානය විසින් සපයනු ලබන අදාළ සබැඳිය සමඟ ඔබට" +
                                " නවතම පාලන ප්‍රතිපත්තිය සොයාගත හැකිය. අපගේ නිල පොදු නාලිකා හරහා රහස්‍යතා " +
                                "ප්‍රතිපත්තියේ යම් වෙනසක් සංවිධානය විසින් දැනුම් දෙනු ඇත."
                        },
                        heading: "මෙම ප්‍රතිපත්තියේ වෙනස්කම්"
                    },
                    contactUs: {
                        description: {
                            para1:
                                "මෙම රහස්‍යතා ප්‍රතිපත්තිය සම්බන්ධයෙන් ඔබට කිසියම් ප්‍රශ්නයක් හෝ ප්‍රශ්නයක් " +
                                "ඇත්නම් කරුණාකර WSO2 අමතන්න."
                        },
                        heading: "අප අමතන්න"
                    },
                    heading: "වැඩි විස්තර",
                    yourChoices: {
                        description: {
                            para1:
                                "ඔබට දැනටමත් WSO2 IS තුළ පරිශීලක ගිණුමක් තිබේ නම්, මෙම රහස්‍යතා ප්‍රතිපත්තිය " +
                                "ඔබට පිළිගත නොහැකි බව ඔබ දුටුවහොත් ඔබේ ගිණුම අක්‍රිය කිරීමට ඔබට අයිතියක් ඇත.",
                            para2:
                                "ඔබට ගිණුමක් නොමැති නම් සහ අපගේ රහස්‍යතා ප්‍රතිපත්තියට ඔබ එකඟ නොවන්නේ " +
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
                            para1:
                                "ඔබ අපගේ පද්ධතියේ ක්‍රියාකාරී පරිශීලකයෙකු වන තාක් WSO2 IS ඔබේ පුද්ගලික දත්ත " +
                                "රඳවා තබා ගනී. ලබා දී ඇති ස්වයං රැකවරණ පරිශීලක ද්වාර භාවිතා කරමින් ඔබට ඕනෑම " +
                                "වේලාවක ඔබේ පුද්ගලික දත්ත යාවත්කාලීන කළ හැකිය.",
                            para2:
                                "WSO2 IS මඟින් ඔබට අමතර මට්ටමේ ආරක්ෂාවක් ලබා දීම සඳහා රහසිගත රහස් තබා ගත හැකිය. " +
                                "මෙයට ඇතුළත් වන්නේ:"
                        },
                        heading: "ඔබේ පුද්ගලික තොරතුරු කොපමණ කාලයක් රඳවා තබා ගනීද?"
                    },
                    requestRemoval: {
                        description: {
                            para1:
                                "ඔබගේ ගිණුම මකා දැමීමට ඔබට පරිපාලකගෙන් ඉල්ලා සිටිය හැකිය. පරිපාලක යනු ඔබ යටතේ" +
                                " ලියාපදිංචි වී ඇති සංවිධානයේ පරිපාලකයා හෝ ඔබ සංවිධානාත්මක අංගය භාවිතා නොකරන්නේ නම්" +
                                " සුපිරි පරිපාලකයා ය.",
                            para2:
                                "මීට අමතරව, WSO2 IS ලඝු සටහන්, දත්ත සමුදායන් හෝ විශ්ලේෂණ ආචයනය තුළ රඳවාගෙන " +
                                "ඇති ඔබගේ ක්‍රියාකාරකම්වල සියලු අංශ නිර්නාමික කිරීමට ඔබට ඉල්ලිය හැකිය."
                        },
                        heading: "ඔබගේ පුද්ගලික තොරතුරු ඉවත් කිරීමට ඉල්ලන්නේ කෙසේද?"
                    },
                    where: {
                        description: {
                            para1:
                                "WSO2 IS ඔබේ පුද්ගලික තොරතුරු ආරක්ෂිත දත්ත ගබඩාවල ගබඩා කරයි. WSO2 IS ඔබේ " +
                                "පුද්ගලික තොරතුරු තබා ඇති දත්ත සමුදාය ආරක්ෂා කිරීම සඳහා නිසි කර්මාන්ත පිළිගත් ආරක්ෂක " +
                                "පියවරයන් ක්‍රියාත්මක කරයි. WSO2 IS යනු නිෂ්පාදනයක් ලෙස ඔබේ දත්ත කිසිදු තෙවන " +
                                "පාර්ශවයක් හෝ ස්ථානයක් සමඟ හුවමාරු නොකරයි.",
                            para2:
                                "WSO2 IS ඔබේ පුද්ගලික දත්ත අමතර මට්ටමේ ආරක්ෂාවක් සහිතව තබා ගැනීමට " +
                                "සංකේතනය භාවිතා කරයි."
                        },
                        heading: "ඔබේ පුද්ගලික තොරතුරු ගබඩා කර ඇත්තේ කොහේද?"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "ඔබට පුද්ගලික පරිශීලක අත්දැකීමක් ලබා දීමට. WSO2 IS මේ සඳහා ඔබේ නම සහ " +
                                "උඩුගත කරන ලද පැතිකඩ පින්තූර භාවිතා කරයි.",
                            1:
                                "අනවසරයෙන් පිවිසීමෙන් හෝ අනවසරයෙන් අනවසරයෙන් ඇතුළුවීමේ උත්සාහයන්ගෙන් ඔබගේ " +
                                "ගිණුම ආරක්ෂා කිරීමට. WSO2 IS මේ සඳහා HTTP හෝ TCP / IP ශීර්ෂ භාවිතා කරයි.",
                            2:
                                "පද්ධති කාර්ය සාධනය වැඩි දියුණු කිරීම පිළිබඳ විශ්ලේෂණාත්මක අරමුණු සඳහා සංඛ්‍යාන " +
                                "දත්ත ලබා ගන්න. WSO2 IS සංඛ්‍යානමය ගණනය කිරීම් වලින් පසුව කිසිදු පුද්ගලික තොරතුරක් " +
                                "තබා නොගනී. එබැවින් සංඛ්‍යාලේඛන වාර්තාවට තනි පුද්ගලයෙකු හඳුනා ගැනීමට ක්‍රමයක් නොමැත."
                        },
                        para1:
                            "WSO2 IS ඔබේ පුද්ගලික තොරතුරු භාවිතා කරනු ලැබුවේ එය එකතු කරන ලද අරමුණු සඳහා " +
                            "පමණි (හෝ එම අරමුණු වලට අනුකූල බව හඳුනාගත් භාවිතය සඳහා).",
                        para2: "WSO2 IS ඔබේ පුද්ගලික තොරතුරු භාවිතා කරන්නේ පහත සඳහන් අරමුණු සඳහා පමණි.",
                        subList1: {
                            heading: "මෙයට ඇතුළත් වන්නේ:",
                            list: {
                                0: "IP ලිපිනය",
                                1: "Browser fingerprinting",
                                2: "Cookies"
                            }
                        },
                        subList2: {
                            heading: "WSO2 IS භාවිතා කළ හැකිය:",
                            list: {
                                0: "භූගෝලීය තොරතුරු ලබා ගැනීම සඳහා IP ලිපිනය",
                                1: "බ්රවුසරයේ තාක්ෂණය හෝ/සහ අනුවාදය තීරණය කිරීම සඳහා බ්රවුසරයේ ඇඟිලි සලකුණු"
                            }
                        }
                    },
                    heading: "පුද්ගලික තොරතුරු භාවිතය"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "ඔබේ පරිශීලක නාමය (ඔබේ සේවායෝජකයා විසින් නිර්මාණය කරන ලද පරිශීලක නාමය " +
                                "ගිවිසුම්ගතව ඇති අවස්ථා හැර)",
                            1: "ඔබගේ උපන් දිනය/වයස",
                            2: "පුරනය වීමට භාවිතා කරන IP ලිපිනය",
                            3: "ඔබ පිවිසීමට උපාංගයක් (උදා., දුරකථන හෝ ටැබ්ලටය) භාවිතා කරන්නේ නම් ඔබගේ උපාංග හැඳුනුම්පත."
                        },
                        list2: {
                            0: "ඔබ TCP/IP සම්බන්ධතාවය ආරම්භ කළ නගරය/රට",
                            1: "ඔබ පුරනය වූ දවසේ වේලාව (වර්ෂය, මාසය, සතිය, පැය හෝ මිනිත්තුව)",
                            2: "ඔබ පුරනය වීමට භාවිතා කළ උපාංග වර්ගය (උ.දා., දුරකථන හෝ ටැබ්ලටය)",
                            3: "මෙහෙයුම් පද්ධතිය සහ සාමාන්‍ය බ්‍රව්සර් තොරතුරු"
                        },
                        para1:
                            "WSO2 IS ඔබ හා සම්බන්ධ ඕනෑම දෙයක් සලකන අතර ඔබව හඳුනාගත හැකි ඒවා ඔබේ " +
                            "පුද්ගලික තොරතුරු ලෙස සලකනු ලැබේ. මෙයට ඇතුළත් නමුත් ඒවාට පමණක් සීමා නොවේ:",
                        para2:
                            "කෙසේ වෙතත්, WSO2 IS පුද්ගලික තොරතුරු ලෙස නොසැලකෙන පහත තොරතුරු රැස් කරයි, " +
                            "නමුත් එය භාවිතා කරන්නේ <1>සංඛ්යානමය</ 1> අරමුණු සඳහා පමණි. එයට හේතුව මෙම " +
                            "තොරතුරු ඔබව ලුහුබැඳීමට භාවිතා කළ නොහැකි වීමයි."
                    },
                    heading: "පුද්ගලික තොරතුරු යනු කුමක්ද?"
                }
            }
        },
        profile: {
            fields: {
                emails: "විද්යුත් තැපෑල",
                generic: {
                    default: "එකතු කරන්න {{fieldName}}"
                },
                nameFamilyName: "අවසන් නම",
                nameGivenName: "මුල් නම",
                phoneNumbers: "දුරකතන අංකය",
                profileImage: "පැතිකඩ රූපය",
                profileUrl: "URL",
                userName: "පරිශීලක නාමය"
            },
            forms: {
                countryChangeForm: {
                    inputs: {
                        country: {
                            placeholder: "ඔබගේ රට තෝරන්න"
                        }
                    }
                },
                dateChangeForm: {
                    inputs: {
                        date: {
                            validations: {
                                futureDateError: "ඔබ {{field}} ක්ෂේත්‍රය සඳහා ඇතුළත් කළ දිනය වලංගු නැත.",
                                invalidFormat: "කරුණාකර වලංගු {{fieldName}} YYYY-MM-DD ආකෘතියෙන් ඇතුළත් කරන්න."
                            }
                        }
                    }
                },
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: "විද්‍යුත් තැපෑල",
                            note: "සටහන: මෙය සංස්කරණය කිරීමෙන් මෙම ගිණුම හා සම්බන්ධ ඊමේල් ලිපිනය වෙනස් වේ." +
                                "ගිණුම් ප්‍රතිසාධනය සඳහා මෙම විද්‍යුත් තැපැල් ලිපිනය ද භාවිතා කරයි.",
                            placeholder: "විද්‍යුත් තැපෑල ඇතුල් කරන්න",
                            validations: {
                                empty: "විද්‍යුත් තැපෑල අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි",
                                invalidFormat: "විද්‍යුත් තැපැල් ආකෘතිය නිවැරදි නොවේ. ඔබට අක්ෂරාංක, යුනිකෝඩ් අක්ෂර, " +
                                    "ඉරි (-), යටි ඉරි (_), නැවතුම් ලකුණු (.), සහ at ලකුණක් (@) භාවිතා කළ හැකිය."
                            }
                        }
                    }
                },
                generic: {
                    inputs: {
                        placeholder: "{{fieldName}} ඇතුල් කරන්න",
                        readonly: {
                            placeholder: "මෙම ක්ෂේත්‍රය හිස් ය",
                            popup: "මෙම ක්ෂේත්‍රය යාවත්කාලීන කිරීමට පරිපාලක අමතන්න {{fieldName}}"
                        },
                        validations: {
                            empty: "{{fieldName}} අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි",
                            invalidFormat: "ඇතුළත් කළ {{fieldName}} ආකෘතිය වැරදිය"
                        }
                    }
                },
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: "ජංගම දුරකථන අංකය",
                            note: "සටහන: මෙය ඔබගේ පැතිකඩෙහි ඇති ජංගම දුරකථන අංකය වෙනස් කරනු ඇත",
                            placeholder: "ජංගම දුරකථන අංකය ඇතුල් කරන්න",
                            validations: {
                                empty: "ජංගම දුරකථන අංකය අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි",
                                invalidFormat: "කරුණාකර වලංගු ජංගම අංකයක් [+][රට කේතය][ප්‍රදේශ කේතය]" +
                                    "[දේශීය දුරකථන අංකය] ආකෘතියෙන් ඇතුළත් කරන්න."
                            }
                        }
                    }
                },
                nameChangeForm: {
                    inputs: {
                        firstName: {
                            label: "මුල් නම",
                            placeholder: "මුල් නම ඇතුල් කරන්න",
                            validations: {
                                empty: "මුල් නම අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි"
                            }
                        },
                        lastName: {
                            label: "අන්තිම නම",
                            placeholder: "අන්තිම නම ඇතුල් කරන්න",
                            validations: {
                                empty: "අන්තිම නම අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි"
                            }
                        }
                    }
                },
                organizationChangeForm: {
                    inputs: {
                        organization: {
                            label: "සංවිධානය",
                            placeholder: "සංවිධානය ඇතුල් කරන්න",
                            validations: {
                                empty: "සංවිධානය අත්\u200Dයවශ්\u200Dය ක්ෂේත්\u200Dරයකි"
                            }
                        }
                    }
                }
            },
            messages: {
                emailConfirmation: {
                    content: "ඔබගේ පැතිකඩට නව විද්‍යුත් තැපෑල එක් කිරීම සඳහා කරුණාකර විද්‍යුත් තැපැල් ලිපින " +
                        "යාවත්කාලීන කිරීම තහවුරු කරන්න.",
                    header: "තහවුරු කිරීම අපේක්ෂිතයි!"
                },
                mobileVerification: {
                    content: "දෙවන සාධකය සත්‍\u200Dයාපනය සක්‍රිය කර ඇති විට කෙටි පණිවුඩ OTP යැවීමට සහ පරිශීලක " +
                        "නාමයක් / මුරපද ප්\u200D‍රතිසාධනයකදී ප්\u200D‍රතිසාධන කේත යැවීමට මෙම ජංගම දුරකථන අංකය භාවිතා " +
                        "කරයි. මෙම අංකය යාවත්කාලීන කිරීම සඳහා, ඔබගේ නව අංකයට යවන ලද සත්\u200D‍යාපන කේතය " +
                        "ඇතුළත් කිරීමෙන් ඔබ නව අංකය සත්\u200D‍යාපනය කළ යුතුය. ඔබට ඉදිරියට යාමට අවශ්\u200D‍ය නම් " +
                        "යාවත්කාලීන ක්ලික් කරන්න."
                }
            },
            notifications: {
                getProfileCompletion: {
                    error: {
                        description: "{{description}}",
                        message: "දෝෂයක් ඇතිවිය"
                    },
                    genericError: {
                        description: "පැතිකඩ සම්පුර්ණ කිරීම ගණනය කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය"
                    },
                    success: {
                        description: "පැතිකඩ සම්පුර්ණ කිරීම සාර්ථකව ගණනය කරන ලදි",
                        message: "දෝෂයක් ඇතිවිය"
                    }
                },
                getProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "පැතිකඩ විස්තර ලබා ගැනීමේදී දෝෂයක් ඇතිවිය"
                    },
                    genericError: {
                        description: "පැතිකඩ විස්තර ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "අවශ්‍ය පරිශීලක පැතිකඩ විස්තර සාර්ථකව ලබා ගන්න ලදී",
                        message: "පරිශීලක පැතිකඩ සාර්ථකව ලබා ගන්නා ලදි"
                    }
                },
                getUserReadOnlyStatus: {
                    genericError: {
                        description: "පරිශීලකයාගේ කියවීමට පමණක් තත්ත්වය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    }
                },
                updateProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "පැතිකඩ විස්තර යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය"
                    },
                    genericError: {
                        description: "පැතිකඩ විස්තර යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "අවශ්‍ය පරිශීලක පැතිකඩ විස්තර සාර්ථකව යාවත්කාලීන කරන ලදි",
                        message: "පරිශීලක පැතිකඩ සාර්ථකව යාවත්කාලීන කරන ලදි"
                    }
                }
            },
            placeholders: {
                SCIMDisabled: {
                    heading: "මෙම අංගය ඔබගේ ගිණුමට ලබා ගත නොහැක"
                }
            }
        },
        profileExport: {
            notifications: {
                downloadProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "Eපරිශීලක පැතිකඩ විස්තර බාගත කිරීමේදී දෝෂයක් ඇතිවිය"
                    },
                    genericError: {
                        description: "පරිශීලක පැතිකඩ විස්තර බාගත කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "දෝෂයක් ඇතිවිය!!!"
                    },
                    success: {
                        description: "අවශ්‍ය පරිශීලක පැතිකඩ විස්තර අඩංගු ගොනුව බාගත කිරීම ආරම්භ කර ඇත.",
                        message: "පරිශීලක පැතිකඩ විස්තර බාගත කිරීම ආරම්භ විය"
                    }
                }
            }
        },
        userAvatar: {
            infoPopover: "මෙම පින්තූරය <1>Gravatar</1> සේවාවෙන් ලබාගෙන ඇත.",
            urlUpdateHeader: "ඔබගේ පැතිකඩ පින්තූරය සැකසීමට රූප URL එකක් ඇතුළත් කරන්න"
        },
        userSessions: {
            browserAndOS: "{{os}} {{version}} මත {{browser}}",
            dangerZones: {
                terminate: {
                    actionTitle: "අවසන් කරන්න",
                    header: "සැසිය අවසන් කරන්න",
                    subheader: "විශේෂිත උපාංගයේ සැසියෙන් ඔබ ඉවත් වනු ඇත."
                }
            },
            lastAccessed: "අවසන් ප්‍රවේශය {{date}}",
            modals: {
                terminateAllUserSessionsModal: {
                    heading: "තහවුරු කිරීම",
                    message:
                        "ක්‍රියාව මඟින් මෙම සැසියෙන් සහ සෑම උපාංගයකම අනෙක් සියලුම සැසි වලින් ඔබව ඉවත් කරනු ඇත. " +
                        "ඉදිරියට යාමට ඔබ කැමතිද?"
                },
                terminateUserSessionModal: {
                    heading: "තහවුරු කිරීම",
                    message:
                        "මෙම ක්‍රියාව මඟින් විශේෂිත උපාංගයේ සැසියෙන් ඔබව ඉවත් කරනු ඇත. ඉදිරියට යාමට ඔබ කැමතිද?"
                }
            },
            notifications: {
                fetchSessions: {
                    error: {
                        description: "{{description}}",
                        message: "සක්‍රීය සැසිය ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "කිසිදු සක්‍රීය සැසියක් ලබා ගැනීමට නොහැකි විය",
                        message: "දෝෂයක් ඇතිවිය"
                    },
                    success: {
                        description: "සක්‍රීය සැසි සාර්ථකව ලබා ගන්නා ලදි",
                        message: "සක්‍රීය සැසිය නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                terminateAllUserSessions: {
                    error: {
                        description: "{{description}}",
                        message: "සක්‍රීය සැසි අවසන් කිරීමට නොහැකි විය"
                    },
                    genericError: {
                        description: "සක්‍රීය සැසි අවසන් කිරීමේදී දෝෂයක් ඇතිවී ඇත.",
                        message: "සක්‍රීය සැසි අවසන් කිරීමට නොහැකි විය"
                    },
                    success: {
                        description: "සියලුම සක්‍රීය සැසි සාර්ථකව අවසන් කරන ලදි",
                        message: "සියලුම සක්‍රීය සැසි අවසන් කරන ලදි"
                    }
                },
                terminateUserSession: {
                    error: {
                        description: "{{description}}",
                        message: "සක්‍රීය සැසිය අවසන් කිරීමට නොහැකි විය"
                    },
                    genericError: {
                        description: "සක්‍රීය සැසි අවසන් කිරීමේදී දෝෂයක් ඇතිවී ඇත.",
                        message: "සක්‍රීය සැසිය අවසන් කිරීමට නොහැකි විය"
                    },
                    success: {
                        description: "සක්‍රීය සැසිය සාර්ථකව අවසන් කරන ලදි",
                        message: "සාර්ථකයි"
                    }
                }
            }
        }
    },
    modals: {
        editAvatarModal: {
            content: {
                gravatar: {
                    errors: {
                        noAssociation: {
                            content: "තෝරාගත් විද්‍යුත් තැපෑල Gravatar හි ලියාපදිංචි වී නැති බව පෙනේ. " +
                                "Gravatar නිල වෙබ් අඩවියට පිවිසීමෙන් Gravatar ගිණුමක් සඳහා ලියාපදිංචි වන්න හෝ පහත " +
                                "සඳහන් එකක් භාවිතා කරන්න.",
                            header: "ගැලපෙන Gravatar රූපයක් හමු නොවීය!"
                        }
                    },
                    heading: "Gravatar මත පදනම්ව "
                },
                hostedAvatar: {
                    heading: "සත්කාරක රූපය",
                    input: {
                        errors: {
                            http: {
                                content: "තෝරාගත් URL මඟින් HTTP හරහා සේවය කරන අනාරක්ෂිත රූපයක් වෙත යොමු වේ. " +
                                    "කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                                header: "අනාරක්ෂිත අන්තර්ගතය!"
                            },
                            invalid: {
                                content: "කරුණාකර වලංගු Image URL එකක් ඇතුළත් කරන්න"
                            }
                        },
                        hint: "තෙවන පාර්ශවීය ස්ථානයක සත්කාරක වන වලංගු රූප URL එකක් ඇතුළත් කරන්න.",
                        placeholder: "රූපය සඳහා URL ඇතුලත් කරන්න.",
                        warnings: {
                            dataURL: {
                                content: "විශාල අක්ෂර සංඛ්‍යාවක් සහිත දත්ත URL භාවිතා කිරීම දත්ත සමුදායේ ගැටළු වලට " +
                                    "හේතු විය හැක. ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                                header: "ඇතුළත් කළ දත්ත URL එක දෙවරක් පරීක්ෂා කරන්න!"
                            }
                        }
                    }
                },
                systemGenAvatars: {
                    heading: "පද්ධතිය ජනනය කළ අවතාරය",
                    types: {
                        initials: "මුලකුරු"
                    }
                }
            },
            description: null,
            heading: "පැතිකඩ පින්තූරය යාවත්කාලීන කරන්න",
            primaryButton: "සුරකින්න",
            secondaryButton: "අවලංගු කරන්න"
        },
        sessionTimeoutModal: {
            description: "ඔබ <1>ආපසු යන්න</1> මත ක්ලික් කළ විට, සැසිය පවතින්නේ නම් එය නැවත ලබා ගැනීමට අපි " +
                "උත්සාහ කරන්නෙමු. ඔබට සක්‍රීය සැසියක් නොමැති නම්, ඔබ පිවිසුම් පිටුවට හරවා යවනු ලැබේ.",
            heading: "ඔබ දිගු කලක් අක්‍රිය වී ඇති බව පෙනේ.",
            loginAgainButton: "නැවත පුරනය වන්න",
            primaryButton: "ආපසු යන්න",
            secondaryButton: "ඉවත් වන්න",
            sessionTimedOutDescription: "ඔබ නතර කළ ස්ථානයෙන් ඉදිරියට යාමට කරුණාකර නැවත ලොග් වන්න.",
            sessionTimedOutHeading: "අක්‍රියතාවය හේතුවෙන් පරිශීලක සැසිය කල් ඉකුත්වී ඇත."
        }
    },
    pages: {
        applications: {
            subTitle: "ඔබගේ යෙදුම් සොයාගෙන ප්‍රවේශ වන්න",
            title: "අයදුම්පත්"
        },
        overview: {
            subTitle: "ඔබගේ පුද්ගලික තොරතුරු, ගිණුම් ආරක්ෂාව සහ රහස්‍යතා සැකසුම් කළමනාකරණය කරන්න",
            title: "ආයුබෝවන්, {{firstName}}"
        },
        personalInfo: {
            subTitle:
                "ඔබගේ පුද්ගලික පැතිකඩ සංස්කරණය කරන්න හෝ අපනයනය කරන්න සහ සම්බන්ධිත ගිණුම් කළමනාකරණය කරන්න",
            title: "පෞද්ගලික තොරතුරු"
        },
        personalInfoWithoutExportProfile: {
            subTitle: "ඔබගේ පුද්ගලික පැතිකඩ සංස්කරණය කරන්න",
            title: "පෞද්ගලික තොරතුරු"
        },
        personalInfoWithoutLinkedAccounts: {
            subTitle: "ඔබගේ පුද්ගලික පැතිකඩ සංස්කරණය කරන්න හෝ අපනයනය කරන්න",
            title: "පෞද්ගලික තොරතුරු"
        },
        privacy: {
            subTitle: "",
            title: "WSO2 හැඳුනුම් සේවාදායක රහස්‍යතා ප්‍රතිපත්තිය"
        },
        readOnlyProfileBanner: "ඔබගේ පැතිකඩ මෙම ද්වාරයෙන් වෙනස් කළ නොහැක. වැඩි විස්තර සඳහා " +
            "කරුණාකර ඔබේ පරිපාලක අමතන්න.",
        security: {
            subTitle: "සියලුම ආරක්ෂක සැකසුම් සහ නිර්දේශ සමඟ යාවත්කාලීනව සිටීමෙන් ඔබගේ ගිණුම සුරක්ෂිත කිරීම",
            title: "ආරක්ෂාව"
        }
    },
    placeholders: {
        404: {
            action: "නැවත ආරම්භයට",
            subtitles: {
                0: "ඔබ සොයන පිටුව අපට සොයාගත නොහැකි විය.",
                1: "කරුණාකර URL එක පරීක්ෂා කරන්න හෝ නැවත මුල් පිටුවට ගමන් කිරීමට පහත බොත්තම ක්ලික් කරන්න."
            },
            title: "පිටුව හමු නොවීය"
        },
        accessDeniedError: {
            action: "නැවත ආරම්භක පිටුව වෙත",
            subtitles: {
                0: "ඔබට මෙම පිටුවට ප්‍රවේශ වීමට අවසර නැති බව පෙනේ.",
                1: "කරුණාකර වෙනත් ගිණුමක් සමඟ පුරනය වීමට උත්සාහ කරන්න"
            },
            title: "ප්‍රවේශයට අවසර නැත"
        },
        emptySearchResult: {
            action: "සෙවුම් විමසුම හිස් කරන්න",
            subtitles: {
                0: "{{query}} සෙවීමට කිසිදු ප්‍රතිපලයක් සොයාගත නොහැකි විය",
                1: "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න."
            },
            title: "ප්‍රතිපලයක් හමු නොවීය"
        },
        genericError: {
            action: "පිටුව refresh කරන්න",
            subtitles: {
                0: "මෙම පිටුව ප්‍රදර්ශනය කිරීමේදී යමක් වැරදී ඇත.",
                1: "තාක්ෂණික විස්තර සඳහා බ්‍රව්සර් කොන්සෝලය බලන්න."
            },
            title: "යමක් වැරදී ඇත"
        },
        loginError: {
            action: "ලොග්අවුට් වෙන්න",
            subtitles: {
                0: "මෙම ඇප් එක භාවිතා කිරීමට ඔබට අවසර නොමැති බව පෙනේ.",
                1: "කරුණාකර වෙනත් ගිණුමක් සමඟ පුරනය වන්න."
            },
            title: "ඔබට අවසර නැත"
        },
        sessionStorageDisabled: {
            subtitles: {
                0: "මෙම ඇප් එක භාවිතා කිරීමට, ඔබේ වෙබ් බ්‍රව්සර සැකසුම් තුළ කුකී සක්‍රීය කළ යුතුය.",
                1: "කුකී සක්‍රීය කරන්නේ කෙසේද යන්න පිළිබඳ වැඩි විස්තර සඳහා, ඔබේ වෙබ් බ්‍රව්සරයේ උදව් අංශය බලන්න."
            },
            title: "ඔබගේ බ්‍රව්සරයේ කුකී අක්‍රීය කර ඇත."
        }
    },
    sections: {
        accountRecovery: {
            description:
                "ඔබගේ පරිශීලක නාමය හෝ මුරපදය නැවත ලබා ගැනීමට ඔබට උදව් කිරීමට අපට භාවිතා කළ හැකි ප්‍රතිසාධන තොරතුරු " +
                "කළමනාකරණය කරන්න",
            heading: "ගිණුම් ප්‍රතිසාධනය"
        },
        changePassword: {
            actionTitles: {
                change: "ඔබගේ මුරපදය වෙනස් කරන්න"
            },
            description:
                "ඔබගේ මුරපදය නිතිපතා යාවත්කාලීන කර එය ඔබ භාවිතා කරන වෙනත් " +
                "මුරපද වලින් අද්විතීය බව සහතික කරගන්න.",
            heading: "මුරපදය වෙනස් කරන්න"
        },
        consentManagement: {
            actionTitles: {
                empty: "ඔබ කිසිදු යෙදුමක් අනුමත කර නැත"
            },
            description: "එක් එක් යෙදුම සඳහා ඔබ ලබා දී ඇති කැමැත්ත සමාලෝචනය කරන්න. " +
                "එසේම, ඔබට අවශ්‍ය පරිදි එකක් හෝ කිහිපයක් අවලංගු කළ හැකිය.",
            heading: "අනුමත යෙදුම්",
            placeholders: {
                emptyConsentList: {
                    heading: "ඔබ කිසිදු යෙදුමක් අනුමත කර නැත"
                }
            }
        },
        createPassword: {
            actionTitles: {
                create: "මුරපදය සාදන්න"
            },
            description: "අස්ගාර්ඩියෝ හි මුරපදයක් සාදන්න. ඔබට මෙම මුරපදය භාවිතා කර සමාජ මාධ්ය ප්‍රවේශයට " +
                "අමතරව අස්ගාර්ඩියෝ වෙත පුරනය විය හැකිය.",
            heading: "මුරපදය සාදන්න"
        },
        federatedAssociations: {
            description: "මෙම ගිණුම හා සම්බන්ධ වෙනත් අනන්‍යතා සපයන්නන්ගෙන් ඔබගේ ගිණුම් බලන්න",
            heading: "බාහිර පිවිසුම්"
        },
        linkedAccounts: {
            actionTitles: {
                add: "ගිණුම එක් කරන්න"
            },
            description: "ඔබ සම්බන්ධිත ගිණුමකට පිවිසීමෙන් පසු ඔබගේ වෙනත් ගිණුම් එකතු කර ඒවා අතර මාරු වන්න",
            heading: "සම්බන්ධිත ගිණුම්"
        },
        mfa: {
            description:
                "සත්‍යාපන පියවර කිහිපයක් වින්‍යාස කිරීමෙන් ඔබගේ ගිණුමට අමතර ආරක්ෂිත තට්ටුවක් එක් කරන්න.",
            heading: "බහු සාධක සත්‍යාපනය"
        },
        profile: {
            description:
                "නම, ඊමේල්, ජංගම දුරකථන අංකය, සංවිධානය වැනි ඔබගේ පුද්ගලික තොරතුරු " +
                "කළමනාකරණය කර යාවත්කාලීන කිරීම",
            heading: "පැතිකඩ"
        },
        profileExport: {
            actionTitles: {
                export: "පැතිකඩ දත්ත අපනයනය කරන්න"
            },
            description: "පුද්ගලික දත්ත, ආරක්ෂක ප්‍රශ්න සහ කැමැත්ත ඇතුළුව ඔබගේ සියලුම පැතිකඩ දත්ත බාගත කිරීම",
            heading: "පැතිකඩ අපනයනය"
        },
        userSessions: {
            actionTitles: {
                empty: "සක්‍රීය සැසි නොමැත",
                terminateAll: "සියලුම සැසි අවසන් කරන්න"
            },
            description: "මෙය ඔබගේ ගිණුමේ සක්‍රියව සැසි ලැයිස්තුවකි",
            heading: "සක්‍රීය සැසි",
            placeholders: {
                emptySessionList: {
                    heading: "සක්‍රීය සැසි නොමැත"
                }
            }
        }
    }
};

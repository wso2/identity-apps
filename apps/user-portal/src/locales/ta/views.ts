/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { Views } from "../../models";

export const views: Views = {
    components: {
        accountRecovery: {
            codeRecovery: {
                descriptions: {
                    add: "குறியீட்டு மீட்பு விருப்புகளை சேர்க்க மற்றும் புதுப்பிக்க"
                },
                heading: "குறியீட்டு மீட்பு"
            },
            emailRecovery: {
                descriptions: {
                    add: "மீட்பு மின்னஞ்சல் முகவரிய சேர்க்க",
                    update: "மீட்பு மின்னஞ்சல் முகவரியை புதுப்பிக்க ({{email}})"
                },
                forms: {
                    emailResetForm: {
                        inputs: {
                            email: {
                                label: "மின்னஞ்சல் முகவரி",
                                placeholder: "மீட்பு மின்னஞ்சல் முகவரியினை உள்ளிடுக",
                                validations: {
                                    empty: "மின்னஞ்சல் முகவரியினை உள்ளிடுக",
                                    invalidFormat: "மின்னஞ்சல் முகவரி சரியான வடிவத்தில் இல்லை"
                                }
                            }
                        }
                    }
                },
                heading: "மின்னஞ்சல் மீட்பு",
                notifications: {
                    updateEmail: {
                        error: {
                            description: "{{description}}",
                            message: "மீட்பு மின்னஞ்சல் முகவரியினை புதுப்பிக்கும் பொழுது தவறேற்பட்டுவிட்டது"
                        },
                        genericError: {
                            description: "மீட்பு மின்னஞ்சல் முகவரியினை புதுப்பிக்கும் பொழுது தவறேற்பட்டுவிட்டது",
                            message: "ஏதோ தவறேற்பட்டுவிட்டது"
                        },
                        success: {
                            description: "பயனர் விபரக்கோவையில் உள்ள மின்னஞ்சல் முகவரி புதுப்பிக்கப்பட்டுவிட்டது.",
                            message: "மின்னஞ்சல் புதுப்பிக்கப்பட்டுவிட்டது"
                        }
                    }
                }
            },
            questionRecovery: {
                descriptions: {
                    add: "கணக்கு மீட்பு சவால் வினாக்களை சேர்க்க மற்றும் புதுப்பிக்க"
                },
                forms: {
                    securityQuestionsForm: {
                        inputs: {
                            answer: {
                                label: "பதில்",
                                placeholder: "பதிலினை உள்ளிடுக",
                                validations: {
                                    empty: "பதில் கட்டாய களமாகும்"
                                }
                            },
                            question: {
                                label: "வினா",
                                placeholder: "வினாவொன்றிணை தேர்வு செய்க",
                                validations: {
                                    empty: "வினாவினை தேர்ந்தெடுத்தல் கட்டாயம்"
                                }
                            }
                        }
                    }
                },
                heading: "பாதுகாப்பு வினாக்கள்",
                notifications: {
                    addQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "பாதுகாப்பு வினாக்களை கட்டமைக்கும் பொழுது தவறேற்பட்டுவிட்டது"
                        },
                        genericError: {
                            description: "சவால் வினாக்களை சேர்க்கும் பொழுது தவறேற்பட்டுவிட்டது",
                            message: "ஏதோ தவறேற்பட்டுவிட்டது"
                        },
                        success: {
                            description: "பாதுகாப்பு வினாக்கள் வெற்றிகரமாக சேர்க்கப்பட்டுவிட்டன",
                            message: "பாதுகாப்பு வினாக்கள் சேர்க்கப்பட்டுவிட்டன"
                        }
                    },
                    updateQuestions: {
                        error: {
                            description: "{{description}}",
                            message: "பாதுகாப்பு வினாக்களை புதுப்பிககும் பொழுது தவறேற்பட்டுவிட்டது"
                        },
                        genericError: {
                            description: "பாதுகாப்பு வினாக்களை புதுப்பிககும் பொழுது தவறேற்பட்டுவிட்டது",
                            message: "ஏதோ தவறேற்பட்டுவிட்டது !!!"
                        },
                        success: {
                            description: "பாதுகாப்பு வினாக்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டுவிட்டன",
                            message: "பாதுகாப்பு வினாக்கள் புதுப்பிக்கப்பட்டுவிட்டன"
                        }
                    }
                }
            }
        },
        applications: {
            all: {
                heading: "அனைத்து செயலிகளும்"
            },
            favourite: {
                heading: "பிடித்தவை"
            },
            notifications: {
                fetchApplications: {
                    error: {
                        description: "{{description}}",
                        message: "செயலிகளை பெறுவதில் தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "செயலிகளை பெறமுடியவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "செயலிகள் வெற்றிகராமாக பெறப்பட்டுவிட்டன.",
                        message: "செயலிகள் பெறப்பட்டுவிட்டன"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "பட்டியலைப் புதுப்பிக்கவும்",
                    subtitles: {
                        0: "செயலிகளின் பட்டியல் வெறுமையாக உள்ளது.",
                        1: "இது கண்டறியப்படக்கூடிய செயலிகள் ஏதும் இல்லாமையின் காரணமாக இருக்கலாம்.",
                        2: "தயவு செய்து இயக்க நிர்வாகி ஒருவரிடம் செயலிகளின் கண்டுபிடிப்புத்தன்மையை செயற்படுத்துமாறு விண்ணப்பியுங்கள்."
                    },
                    title: "செயலிகள் ஏதுமில்லை"
                }
            },
            recent: {
                heading: "அண்மையில் பயன்படுத்தப்பட்ட செயலிகள்"
            },
            search: {
                forms: {
                    searchForm: {
                        inputs: {
                            filerAttribute: {
                                label: "வடிகட்டும் பண்பு",
                                placeholder: "எ.கா.: பெயர், விவரம் போன்றவை",
                                validations: {
                                    empty: "வடிகட்டல் பண்பு ஒரு கட்டாய களமாகும்"
                                }
                            },
                            filterCondition: {
                                label: "வடிகட்டும் நிபந்தனை",
                                placeholder: "எ.கா.: தொடங்குவது",
                                validations: {
                                    empty: "வடிகட்டும் நிபந்தனை ஒரு கட்டாய களமாகும்"
                                }
                            },
                            filterValue: {
                                label: "வடிகட்டும் மதிப்பு",
                                placeholder: "எ.கா.: facebook, slack போன்றவை",
                                validations: {
                                    empty: "வடிகட்டும் மதிப்பு ஒரு கட்டாய களமாகும்"
                                }
                            }
                        }
                    }
                },
                hints: {
                    querySearch: {
                        actionKeys: "Shift + Enter",
                        label: "கேள்வியின் மூலம் தேடுவதற்கு"
                    }
                },
                options: {
                    header: "மேம்பட்ட தேடல்"
                },
                placeholder: "பெயரைக் கொண்டு தேடு",
                popups: {
                    clear: "தேடலை அழி",
                    dropdown: "தேர்வுகளை காண்பி"
                },
                resultsIndicator: '"{{query}}" இற்கான பெறுபேறுகள்'
            }
        },
        approvals: {
            notifications: {
                fetchApprovalDetails: {
                    error: {
                        description: "{{description}}",
                        message: "ஒப்புதல்களை பெறுவதில் தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "ஒப்புதல்களை புதுப்பிக்க இயலவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "ஒப்புதல் விவரங்கள் வெற்றிகரமாக பெறப்பட்டுவிட்டன",
                        message: "ஒப்புதல் விவரங்கள் பெறப்பட்டுவிட்டன"
                    }
                },
                fetchPendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "முடிவெடுக்கப்படாத ஒப்புதல்களை பெறுவதில் தவறு"
                    },
                    genericError: {
                        description: "முடிவெடுக்கப்படாத ஒப்புதல்களை பெறுவதில் தவறேற்பட்டுவிட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "முடிவெடுக்கப்படாத ஒப்புதல்களை வெற்றிகரமாக பெறப்பட்டுவிட்டன",
                        message: "முடிவெடுக்கப்படாத ஒப்புதல்களை பெறப்பட்டுவிட்டன"
                    }
                },
                updatePendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "ஒப்புதல் புதுப்பிக்கப்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "ஒப்புதலை புதுப்பிக்க இயலவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "ஒப்புதல் வெற்றிகரமாக புதுப்பிக்கப்பட்டுவிட்டது",
                        message: "புதுப்பித்தல் வெற்றி"
                    }
                }
            }
        },
        changePassword: {
            forms: {
                passwordResetForm: {
                    inputs: {
                        confirmPassword: {
                            label: "கடவுச்சொல் உறுதிப்பாடு",
                            placeholder: "புதிய கடவுச்சொல்லை மீண்டும் உள்ளிடுங்கள்",
                            validations: {
                                empty: "கடவுச்சொல் உறுதிப்பாடு கட்டாயாமன களமாகும்.",
                                mismatch: "உங்கள் புதிய கடவுச்சொல்லும் கடவுச்சொல் உறுதிப்பாடும் பொருந்தவில்லை."
                            }
                        },
                        currentPassword: {
                            label: "நிகழ்கால கடவுச்சொல்",
                            placeholder: "உங்களின் நிகழ்கால கடவுச்சொல்லை உள்ளிடுங்கள்",
                            validations: {
                                empty: "நிகழ்கால கடவுச்சொல் கட்டாயமான களமாகும்.",
                                invalid: "நீங்கள் அளித்த நிகழ்கால கடவுச்சொல் தவறானது"
                            }
                        },
                        newPassword: {
                            label: "புதிய கடவுச்சொல்",
                            placeholder: "புதிய கடவுச்சொல்லை உள்ளிடுங்கள்",
                            validations: {
                                empty: "புதிய கடவுச்சொல் கட்டாயமான களமாகும்"
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "ஏதோ தவறேற்பட்டுவிட்டது. மீண்டும் முயற்சி செய்க.",
                            message: "கடவுச்சொல் பிழையை மாற்றவும்"
                        },
                        invalidCurrentPassword: {
                            description: "நீங்கள் அளித்த தற்போதைய கடவுச்சொல் தவறானது. மீண்டும் முயற்சி செய்க.",
                            message: "கடவுச்சொல் பிழையை மாற்றவும்"
                        },
                        submitError: {
                            description: "{{description}}",
                            message: "கடவுச்சொல் பிழையை மாற்றவும்"
                        },
                        submitSuccess: {
                            description: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது விட்டது",
                            message: "கடவுச்சொல்லை மீட்டலில் வெற்றி"
                        }
                    }
                }
            },
            modals: {
                confirmationModal: {
                    heading: "உறுதிப்படுத்தல்",
                    message:
                        "கடவுச்சொல்லை மாற்றுவது உங்களது நிகழ்கால அமர்வை முடிவுக்குக்கொண்டுவரும்." +
                        " நீங்கள் உங்கள் புதிய கடவுச்சொல்லை பயன் படுத்தி மீண்டும் உள்நுழைய வேண்டும்." +
                        " மேலும் தொடர விரும்புகிறீர்களா?"
                }
            }
        },
        consentManagement: {
            modals: {
                consentRevokeModal: {
                    heading: "{{appName}} இற்கான அனுமதியினை நீக்க விரும்புகிறீர்களா?",
                    message: "நீங்கள் அனுமதியினை நீக்க விரும்புகிறீர்களா? இச்செயல் மீள் திரும்ப முடியாக்க செயலாகும்."
                },
                editConsentModal: {
                    description: {
                        collectionMethod: "அறவிடும் முறை",
                        description: "விபரம்",
                        piiCategoryHeading: "செயலியுடன் நீங்கள் பகிர்ந்துள்ள தகவல்கள்",
                        state: "நிலை",
                        version: "பதிப்பு"
                    }
                }
            },
            notifications: {
                consentReceiptFetch: {
                    error: {
                        description: "{{description}}",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "தேர்வு செய்யப்பட்ட செயலி பற்றிய தகவலை பெற முடியவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "அனுமதி பற்றுசீட்டு வெற்றிகரமாக பெறப்பட்டுவிட்டது",
                        message: "அனுமதி பற்றுசீட்டு பெறப்பட்டுவிட்டது"
                    }
                },
                consentedAppsFetch: {
                    error: {
                        description: "{{description}}",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "அனுமதியளிக்கப்பட்ட செயலிகளின் பட்டியலை பெற முடியவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "அனுமதியளிக்கபட்ட செயலிகளின் பட்டியல் வெற்றிகரமாக பெறப்பட்டுவிட்டது",
                        message: "அனுமதியளிக்கபட்ட செயலிகளின் பட்டியல் பெறப்பட்டுவிட்டது"
                    }
                },
                revokeConsentedApp: {
                    error: {
                        description: "{{description}}",
                        message: "அனுமதி நீக்கலில் தவறு"
                    },
                    genericError: {
                        description: "செயலியின் அனுமதியினை நீக்க இயலவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "செயலியின் அனுமதி வெற்றிகராமக நீக்கப்பட்டுவிட்டது.",
                        message: "அனுமதி நீக்கலில் வெற்றி"
                    }
                },
                updateConsentedClaims: {
                    error: {
                        description: "{{description}}",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "செயலியின் அனுமதியளிக்கப்பட்ட கூற்றுக்கள் புதுப்பிக்கப்படுவதில் தோல்வி",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "செயலியின் அனுமதியளிக்கப்பட்ட கூற்றுக்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டுவிட்டன",
                        message: "அனுமதியளிக்கப்பட்ட கூற்றுக்கள் புதுப்பிக்கப்பட்டுவிட்டன"
                    }
                }
            }
        },
        footer: {
            copyright: "WSO2 Identity Server © {{year}}"
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: "உட்பயனர் கணக்கினை சேர்க்க"
                }
            },
            forms: {
                addAccountForm: {
                    inputs: {
                        password: {
                            label: "கடவுச்சொல்",
                            placeholder: "கடவுச்சொல்லை உள்ளிடுக",
                            validations: {
                                empty: "கடவுச்சொல் ஒரு கட்டாய களமாகும்"
                            }
                        },
                        username: {
                            label: "பயனர்பெயர்",
                            placeholder: "பயனர்பெயரை உள்ளிடுக",
                            validations: {
                                empty: "பயனர்பெயர் ஒரு கட்டாய களமாகும்"
                            }
                        }
                    }
                }
            },
            notifications: {
                addAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "இணைக்கப்பட்ட கணக்குகளை பெரும் பொழுது தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "கணக்கினை இணைக்கும் பொழுது தவறேற்பட்டுவிட்டது.",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "கணக்கு வெற்றிகரமாக இணைக்கப் பட்டுவிட்டது",
                        message: "கணக்கு இணைக்கப்பட்டு விட்டது"
                    }
                },
                getAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "இணைக்கப்பட்ட பயனர் கணக்குகளை பெறும் பொழுது தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "இணைக்கப்பட்ட கனக்குகளை பெறும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "இணைக்கபட்ட பயனர் கணக்குகள் வெற்றிகரமாக பெறப்பட்டுவிட்டன",
                        message: "இணைக்கப்பட்ட பயனர் கணக்குகள் பெறப்பட்டுவிட்டன"
                    }
                },
                switchAccount: {
                    error: {
                        description: "{{description}}",
                        message: "கணக்கினை மாற்றும் பொழுது தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "கணக்கினை மாற்றும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "கணக்கு வெற்றிகரமாக மாற்றப்பட்டுவிட்டது",
                        message: "கணக்கு மாற்றப்பட்டுவிட்டது"
                    }
                }
            }
        },
        mfa: {
            fido: {
                description: "FIDO கருவியினை இணைப்பதானூடாக உங்களை உறுதிப்படுத்திக் கொள்ளுங்கள்",
                heading: "FIDO",
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "சாதனத்தை அகற்றும்போது பிழை ஏற்பட்டது"
                        },
                        genericError: {
                            description: "சாதனத்தை அகற்றும்போது பிழை ஏற்பட்டது",
                            message: "ஏதோ ஒரு தவறு ஏற்பட்டுவிட்டது"
                        },
                        success: {
                            description: "சாதனம் பட்டியலிலிருந்து வெற்றிகரமாக அகற்றப்பட்டது",
                            message: "உங்கள் சாதனம் வெற்றிகரமாக அகற்றப்பட்டது"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "கருவிகளின் பட்டியலை பெறும் பொழுது தவறேற்பட்டுவிட்டது",
                            message: "ஏதோ ஒரு தவறு ஏற்பட்டுவிட்டது !!!"
                        },
                        genericError: {
                            description: "உங்களின் கருவியினை பதிவு செய்யும் பொழுது தவறேற்பட்டுவிட்டது.",
                            message: "ஏதோ ஒரு தவறு ஏற்பட்டுவிட்டது !!!"
                        },
                        success: {
                            description:
                                "உங்கள் கருவி வெற்றிகரமாக பதிவு செய்யப்பட்டுவிட்டது. " +
                                "இதனை, இனி, நீங்கள் உங்களது இரண்டாவது காரணியாக பயன்படுத்திக் கொள்ளலாம்.",
                            message: "உங்கள் கருவி பதிவு செய்யப்பட்டுவிட்டது."
                        }
                    }
                }
            },
            smsOtp: {
                descriptions: {
                    hint: "நீங்கள் உறுதிப்படுத்தும் குறியீட்டினை குறுஞ் செய்தியினூடாக பெறுவீர்கள்"
                },
                heading: "ஒரு முறை கடவுச்சொல்(OTP) குறுஞ் செய்தி",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "கையடக்க தொலைபேசி இலக்கத்தினை புதுப்பிக்கும் பொழுது தவறொன்று ஏற்பட்டு விட்டது",
                            message: "தவறொன்று ஏற்பட்டுவிட்டது !!!"
                        },
                        genericError: {
                            description: "{{description}}",
                            message: "தவறொன்று ஏற்பட்டுவிட்டது"
                        },
                        success: {
                            description:
                                "பயனர் விபரத்தில் உள்ள கையடக்க தொலைபேசி இலக்கம் வெற்றிகரமாக " +
                                "புதுப்பிக்கப்பட்டுவிட்டது.",
                            message: "கையடக்க தொலைபேசி இலக்கம் புதுப்பிக்கப்பட்டுவிட்டது"
                        }
                    }
                }
            }
        },
        overview: {
            widgets: {
                accountActivity: {
                    actionTitles: {
                        update: "கணக்கு செயல்பாட்டை நிர்வகிக்கவும்"
                    },
                    description: " நீங்கள் பின்வரும் கருவியினூடாக உள் நுழைந்திருக்கின்றீர்கள்",
                    header: "கணக்கின் செயற்பாடுகள்"
                },
                accountSecurity: {
                    actionTitles: {
                        update: "கணக்கின் பாதுகாப்பு அமைப்பினை புதுப்பி"
                    },
                    description: "உங்களின் கணக்கினை பாதுகாப்பாக வைத்திருப்பதற்கான அமைப்புக்களும் பரிந்துரைகளும்",
                    header: "கணக்கின் பாதுகாப்பு"
                },
                accountStatus: {
                    header: "உங்கள் கணக்கின் ஆரோக்கியம் சிறப்பாக உள்ளது!",
                    list: {
                        0: "கடவுச்சொல்லின் ஆரோக்கியம்",
                        1: "கணக்கின் பூரணத்துவம்",
                        2: "உள்நுழைந்திருக்கும் செயற்பாடுகள்"
                    }
                },
                consentManagement: {
                    actionTitles: {
                        manage: "அனுமதிகளை முகாமை செய்"
                    },
                    description: "செயலிகளுடன் பகிர விரும்பும் தகவல்களை கட்டுப்படுத்து",
                    header: "அனுமதி முகாமை"
                }
            }
        },
        // TODO: Translate to Tamil
        privacy: {
            about: {
                description:
                    "WSO2 Identity Server (referred to as “WSO2 IS” within this policy) is an open source " +
                    "Identity Management and Entitlement Server that is based on open standards " +
                    "and specifications.",
                heading: "About WSO2 Identity Server"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "WSO2 IS uses your IP address to detect any suspicious login attempts" +
                                " to your account.",
                            1:
                                "WSO2 IS uses attributes like your first name, last name, etc., " +
                                "to provide a rich and personalized user experience.",
                            2: "WSO2 IS uses your security questions and answers only to allow account recovery."
                        },
                        para1:
                            "WSO2 IS collects your information only to serve your access requirements. " +
                            "For example:"
                    },
                    heading: "Collection of personal information",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0:
                                    "Collecting information from the user profile page where you enter " +
                                    "your personal data.",
                                1: "Tracking your IP address with HTTP request, HTTP headers, and TCP/IP.",
                                2: "Tracking your geographic information with the IP address.",
                                3:
                                    "Tracking your login history with browser cookies. Please see our" +
                                    " {{cookiePolicyLink}} for more information."
                            },
                            para1: "WSO2 IS collects your information by:"
                        },
                        heading: "Tracking Technologies"
                    }
                },
                description: {
                    para1:
                        "This policy describes how WSO2 IS captures your personal information, the purposes of" +
                        " collection, and information about the retention of your personal information.",
                    para2:
                        "Please note that this policy is for reference only, and is applicable for the software " +
                        "as a product. WSO2 Inc. and its developers have no access to the information held within " +
                        "WSO2 IS. Please see the <1>disclaimer</1> section for more information.",
                    para3:
                        "Entities, organisations or individuals controlling the use and administration of WSO2 IS " +
                        "should create their own privacy policies setting out the manner in which data is controlled " +
                        "or processed by the respective entity, organisation or individual."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0:
                                "WSO2, its employees, partners, and affiliates do not have access to and do not " +
                                "require, store, process or control any of the data, including personal data " +
                                "contained in WSO2 IS. All data, including personal data is controlled and " +
                                "processed by the entity or individual running WSO2 IS. WSO2, its employees partners " +
                                "and affiliates are not a data processor or a data controller within the meaning of " +
                                "any data privacy regulations. WSO2 does not provide any warranties or undertake any " +
                                "responsibility or liability in connection with the lawfulness or the manner and " +
                                "purposes for which WSO2 IS is used by such entities or persons.",
                            1:
                                "This privacy policy is for the informational purposes of the entity or persons " +
                                "running WSO2 IS and sets out the processes and functionality contained within " +
                                "WSO2 IS regarding personal data protection. It is the responsibility of entities " +
                                "and persons running WSO2 IS to create and administer its own rules and processes " +
                                "governing users' personal data, and such rules and processes may change the use, " +
                                "storage and disclosure policies contained herein. Therefore users should consult " +
                                "the entity or persons running WSO2 IS for its own privacy policy for details " +
                                "governing users' personal data."
                        }
                    },
                    heading: "Disclaimer"
                },
                disclosureOfPersonalInfo: {
                    description:
                        "WSO2 IS only discloses personal information to the relevant applications (also " +
                        "known as Service Provider) that are registered with WSO2 IS. These applications are " +
                        "registered by the identity administrator of your entity or organization. Personal " +
                        "information is disclosed only for the purposes for which it was collected (or for a " +
                        "use identified as consistent with that purpose), as controlled by such Service Providers, " +
                        "unless you have consented otherwise or where it is required by law.",
                    heading: "Disclosure of personal information",
                    legalProcess: {
                        description:
                            "Please note that the organisation, entity or individual running WSO2 IS may " +
                            "be compelled to disclose your personal information with or without your consent when " +
                            "it is required by law following due and lawful process.",
                        heading: "Legal process"
                    }
                },
                heading: "Privacy Policy",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1:
                                "Upgraded versions of WSO2 IS may contain changes to this policy and " +
                                "revisions to this policy will be packaged within such upgrades. Such changes " +
                                "would only apply to users who choose to use upgraded versions.",
                            para2:
                                "The organization running WSO2 IS may revise the Privacy Policy from time to " +
                                "time. You can find the most recent governing policy with the respective link " +
                                "provided by the organization running WSO2 IS 5.5. The organization will notify " +
                                "any changes to the privacy policy over our official public channels."
                        },
                        heading: "Changes to this policy"
                    },
                    contactUs: {
                        description: {
                            para1:
                                "Please contact WSO2 if you have any question or concerns regarding this privacy " +
                                "policy."
                        },
                        heading: "Contact us"
                    },
                    heading: "More information",
                    yourChoices: {
                        description: {
                            para1:
                                "If you are already have a user account within WSO2 IS, you have the right to " +
                                "deactivate your account if you find that this privacy policy is unacceptable to you.",
                            para2:
                                "If you do not have an account and you do not agree with our privacy policy, " +
                                "you can chose not to create one."
                        },
                        heading: "Your choices"
                    }
                },
                storageOfPersonalInfo: {
                    heading: "Storage of personal information",
                    howLong: {
                        description: {
                            list1: {
                                0: "Current password",
                                1: "Previously used passwords"
                            },
                            para1:
                                "WSO2 IS retains your personal data as long as you are an active user of our " +
                                "system. You can update your personal data at any time using the given self-care " +
                                "user portals.",
                            para2:
                                "WSO2 IS may keep hashed secrets to provide you with an added level of security. " +
                                "This includes:"
                        },
                        heading: "How long your personal information is retained"
                    },
                    requestRemoval: {
                        description: {
                            para1:
                                "You can request the administrator to delete your account. The administrator is " +
                                "the administrator of the tenant you are registered under, or the " +
                                "super-administrator if you do not use the tenant feature.",
                            para2:
                                "Additionally, you can request to anonymize all traces of your activities " +
                                "that WSO2 IS may have retained in logs, databases or analytical storage."
                        },
                        heading: "How to request removal of your personal information"
                    },
                    where: {
                        description: {
                            para1:
                                "WSO2 IS stores your personal information in secured databases. WSO2 IS " +
                                "exercises proper industry accepted security measures to protect the database " +
                                "where your personal information is held. WSO2 IS as a product does not transfer " +
                                "or share your data with any third parties or locations.",
                            para2:
                                "WSO2 IS may use encryption to keep your personal data with an added level " +
                                "of security."
                        },
                        heading: "Where your personal information is stored"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "To provide you with a personalized user experience. WSO2 IS uses your name and " +
                                "uploaded profile pictures for this purpose.",
                            1:
                                "To protect your account from unauthorized access or potential hacking attempts. " +
                                "WSO2 IS uses HTTP or TCP/IP Headers for this purpose.",
                            2:
                                "Derive statistical data for analytical purposes on system performance improvements. " +
                                "WSO2 IS will not keep any personal information after statistical calculations. " +
                                "Therefore, the statistical report has no means of identifying an individual person."
                        },
                        para1:
                            "WSO2 IS will only use your personal information for the purposes for which it was " +
                            "collected (or for a use identified as consistent with that purpose).",
                        para2: "WSO2 IS uses your personal information only for the following purposes.",
                        subList1: {
                            heading: "This includes:",
                            list: {
                                0: "IP address",
                                1: "Browser fingerprinting",
                                2: "Cookies"
                            }
                        },
                        subList2: {
                            heading: "WSO2 IS may use:",
                            list: {
                                0: "IP Address to derive geographic information",
                                1: "Browser fingerprinting to determine the browser technology or/and version"
                            }
                        }
                    },
                    heading: "Use of personal information"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "Your user name (except in cases where the user name created by your employer is " +
                                "under contract)",
                            1: "Your date of birth/age",
                            2: "IP address used to log in",
                            3: "Your device ID if you use a device (e.g., phone or tablet) to log in"
                        },
                        list2: {
                            0: "City/Country from which you originated the TCP/IP connection",
                            1: "Time of the day that you logged in (year, month, week, hour or minute)",
                            2: "Type of device that you used to log in (e.g., phone or tablet)",
                            3: "Operating system and generic browser information"
                        },
                        para1:
                            "WSO2 IS considers anything related to you, and by which you may be identified, as " +
                            "your personal information. This includes, but is not limited to:",
                        para2:
                            "However, WSO2 IS also collects the following information that is not considered " +
                            "personal information, but is used only for <1>statistical</1> purposes. The reason " +
                            "for this is that this information can not be used to track you."
                    },
                    heading: "What is personal information?"
                }
            }
        },
        profile: {
            fields: {
                email: {
                    default: "மின்னஞ்சலை சேர்க்க",
                    label: "மின்னஞ்சல்"
                },
                mobile: {
                    default: "கையடக்க தொலைபேசி இலக்கத்தை சேர்க்க",
                    label: "கையடக்க தொலைபேசி இலக்கம்"
                },
                name: {
                    default: "பெயரை சேர்க்க",
                    label: "பெயர்"
                },
                organization: {
                    default: "நிறுவனத்தை சேர்க்க",
                    label: "நிறுவனம்"
                },
                username: {
                    default: "பயனர் பெயரை சேர்க்க",
                    label: "பயனர் பெயர்"
                }
            },
            forms: {
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: "மின்னஞ்சல் முகவரி",
                            note: "கவனிக்குக: இது உங்கள் சுயவிவரத்தில் உள்ள மின்னஞ்சல் முகவரியை மாற்றும்",
                            placeholder: "மின்னஞ்சல் முகவரியை உள்ளிடவும்",
                            validations: {
                                empty: "மின்னஞ்சல் முகவரி ஒரு கட்டாயா களமாகும்",
                                invalidFormat: "மின்னஞ்சல் முகவரி சரியான வடிவத்தில் இல்லை"
                            }
                        }
                    }
                },
                mobileChangeForm: {
                    inputs: {
                        mobile: {
                            label: "கையடக்க தொலைபேசி இலக்கம்",
                            note: "கவனிக்குக: இது உங்களின் சுயவிபரத்தில் உள்ள கையடக்க தொலைபேசி இலக்கத்தை மாற்றும்",
                            placeholder: "கையடக்க தொலைபேசி இலக்கத்தை உள்ளிடவும்",
                            validations: {
                                empty: "கையடக்க தொலைபேசி இலக்கம் ஒரு கட்டாயா களமாகும்",
                                invalidFormat: "கையடக்க தொலைபேசி இலக்கம் சரியான வடிவத்தில் இல்லை"
                            }
                        }
                    }
                },
                nameChangeForm: {
                    inputs: {
                        firstName: {
                            label: "முதற்பெயர்",
                            placeholder: "முதற்பெயரை உள்ளிடவும்",
                            validations: {
                                empty: "முதற்பெயர் ஒரு கட்டாயா களமாகும்"
                            }
                        },
                        lastName: {
                            label: "இறுதிப்பெயர்",
                            placeholder: "இறுதிப்பெயரை உள்ளிடவும்",
                            validations: {
                                empty: "இறுதிப்பெயர் ஒரு கட்டாயா களமாகும்"
                            }
                        }
                    }
                },
                organizationChangeForm: {
                    inputs: {
                        organization: {
                            label: "நிறுவனம்",
                            placeholder: "நிறுவனத்தை உள்ளிடவும்",
                            validations: {
                                empty: "நிறுவனம் ஒரு கட்டாயா களமாகும்"
                            }
                        }
                    }
                }
            },
            notifications: {
                getProfileInfo: {
                    error: {
                        description: "பயனர் விபரத்தை பெறும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது !!!"
                    },
                    genericError: {
                        description: "பயனர் விபரத்தை பெறும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது !!!"
                    },
                    success: {
                        description: "பயனர் விபரம் வெற்றிகரமாக பெறப்பட்டுவிட்டது",
                        message: "பயனர் விபரம் பெறப்பட்டுவிட்டது"
                    }
                },
                updateProfileInfo: {
                    error: {
                        description: "பயனர் சுயவிபரத்தை புதுப்பிக்கும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது !!!"
                    },
                    genericError: {
                        description: "பயனர் சுயவிபரத்தை புதுப்பிக்கும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது !!!"
                    },
                    success: {
                        description: "பயனர் சுயவிபரம் வெற்றிகரமாக புதுப்பிக்கபட்டுவிட்டது.",
                        message: "பயனர் சுயவிபரம் புதுப்பிக்கபட்டுவிட்டது"
                    }
                }
            }
        },
        profileExport: {
            notifications: {
                downloadProfileInfo: {
                    error: {
                        description: "{{description}}",
                        message: "பயனர் சுயவிபரத்தை பதிவிறக்கம் செய்யும் பொழுது தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "பயனர் சுயவிபரத்தை பதிவிறக்கம் செய்யும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது !!!"
                    },
                    success: {
                        description: "பயனர் சுயவிபரம் வெற்றிகரமாக பதிவிறக்கப்பட்டுவிட்டது.",
                        message: "பயனர் சுயவிபரம் பதிவிறக்கப்பட்டுவிட்டது"
                    }
                }
            }
        },
        userSessions: {
            browserAndOS: "{{os}} {{version}} இல் {{browser}}",
            lastAccessed: "இறுதியாக அணுகியது {{date}}",
            modals: {
                terminateAllUserSessionsModal: {
                    heading: "உறுதிப்பாடு",
                    message:
                        "இச்செயல் சகல கருவிகளிலும் உள்ள உங்களுடைய அனைத்து அமர்வுகளில் இருந்தும் " +
                        "உங்களை வெளியேற்றும். மேலும் தொடர விரும்புகின்றீர்களா?"
                },
                terminateUserSessionModal: {
                    heading: "உறுதிப்பாடு",
                    message:
                        "இச்செயல் குறிப்பிட்ட கருவியிலுள்ள அமர்விலிருந்து உங்களை வெளியேற்றும்," +
                        " மேலும் தொடர விரும்புகின்றீர்களா?"
                }
            },
            notifications: {
                fetchSessions: {
                    error: {
                        description: "{{description}}",
                        message: "பயனர் அமர்வுகளை பெறும் பொழுது தவறேற்பட்டுவிட்டது."
                    },
                    genericError: {
                        description: "பயனர் அமர்வுகளை பெற இயலவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது."
                    },
                    success: {
                        description: "பயனர் அமர்வுகள் வெற்றிகரமாக பெறப்பட்டுவிட்டன.",
                        message: "பயனர் அமர்வுகள் பெறப்பட்டுவிட்டன"
                    }
                },
                terminateAllUserSessions: {
                    error: {
                        description: "{{description}}",
                        message: "பயனர் அமர்வுகளை முடிக்க இயலவில்லை"
                    },
                    genericError: {
                        description: "பயனர் அமர்வுகளை முடிக்கும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "பயனர் அமர்வுகளை முடிக்க இயலவில்லை"
                    },
                    success: {
                        description: "சகல பயனர் அமர்வுகளும் வெற்றிகரமாக முடிக்கப்பட்டுவிட்டன.",
                        message: "சகல பயனர் அமர்வுகளும் முடிக்கப்பட்டுவிட்டன"
                    }
                },
                terminateUserSession: {
                    error: {
                        description: "{{description}}",
                        message: "யனர் அமர்வினை முடிக்க இயலவில்லை"
                    },
                    genericError: {
                        description: "பயனர் அமரவை முடிக்கும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "யனர் அமர்வினை முடிக்க இயலவில்லை"
                    },
                    success: {
                        description: "பயனர் அமர்வு வெற்றிகரமாக முடிக்கப்பட்டுவிட்டது.",
                        message: "அமர்வு முடிக்கப்பட்டுவிட்டது"
                    }
                }
            }
        }
    },
    pages: {
        applications: {
            subTitle: "உங்கள் செயலிகளை முகாமை செய்ய மற்றும் பராமரிக்க",
            title: "செயலிகள்"
        },
        operations: {
            subTitle: "முடிவு செய்யப்படாத அனுமதிகள் போன்ற பணிகளை முகாமை செய்யவும் பராமரிக்கவும்",
            title: "செயற்பாடுகள்"
        },
        overview: {
            subTitle: "உங்களின் தகவல், பாதுகாப்பு, தனியுரிமை மற்றும் ஏனைய சார்ந்த கட்டமைப்புக்களை முகாமை செய்க",
            title: "வருக, {{firstName}}"
        },
        personalInfo: {
            subTitle: "உங்களின் கணக்கு, உப சுயவிபரக்கோவை, மற்றும் உங்களை பற்றிய தகவல்களை முகாமை செய்க",
            title: "பயனர் விபரம்"
        },
        privacy: {
            subTitle: "",
            title: "WSO2 Identity Server தனியுரிமைக் கொள்கை"
        },
        security: {
            subTitle: "உங்களின் கணக்கின் பாதுகாப்பை உறுதிப்படுத்த அமைப்புக்களை புதுப்பிக",
            title: "பாதுகாப்பு"
        }
    },
    placeholders: {
        404: {
            action: "மீண்டும் முகப்பிற்கு செல்ல",
            subtitles: {
                0: "நீங்கள் தேடி வந்த பக்கத்தினை எங்களால் கண்டுபிடிக்க இயலவில்லை",
                1: "பக்கத்தின் முகவரியினை சரி பாருங்கள் அல்லது கீழிருக்கும் பொத்தானை அழுத்தி",
                2: "முகப்புப் பக்கத்திற்குச் செல்லுங்கள்."
            },
            title: "பக்கம் காணப்படவில்லை"
        },
        emptySearchResult: {
            action: "தேடல் கேள்வியினை அழி",
            subtitles: {
                0: '"{{query}}" இற்கான பெறுபேறுகள் எதுவுமில்லை',
                1: "தயவுசெய்து வேறு பதத்தினை பயன்படுத்தி தேடவும்"
            },
            title: "பெறுபேறுகள் எதுவுமில்லை"
        },
        genericError: {
            action: "பக்கத்தைப் புதுப்பிக்கவும்",
            subtitles: {
                0: "இந்தப் பக்கத்தைக் காண்பிக்கும் போது ஏதோ தவறு ஏற்பட்டது.",
                1: "தொழில்நுட்ப விவரங்களுக்கு உலாவி console இனை பார்க்கவும்."
            },
            title: "ஏதோ தவறு ஏற்பட்டது"
        },
        loginError: {
            action: "வெளியேறுதலைத் தொடரவும்",
            subtitles: {
                0: "இந்த செயலியைப் பயன்படுத்த உங்களுக்கு அனுமதி இல்லை என்று தெரிகிறது.",
                1: "வேறு கணக்கில் உள்நுழைக."
            },
            title: "உங்களுக்கு அங்கீகாரம் இல்லை"
        }
    },
    sections: {
        accountRecovery: {
            description: "உங்கள் கணக்கின் மீட்பு சம்பந்தமான விருப்புகளை பார்வையிட மற்றும் மாற்ற",
            heading: "கணக்கு மீட்பு"
        },
        approvals: {
            description: "முடிவெடுக்கப்படாதா ஒப்புதல்களை முகாமை செய்ய",
            heading: "முடிவெடுக்கப்படாத ஒப்புதல்கள்",
            placeholders: {
                emptyApprovalList: {
                    heading: "உங்களிடம் {{status}} நிலையில் உள்ள முடிவெடுக்கப்படாத ஒப்புதல்கள் இல்லை"
                }
            }
        },
        changePassword: {
            actionTitles: {
                change: "உங்கள் கடவுச்சொல்லை மாற்றுக"
            },
            description: "பதிவு செய்த கடவுச்சொல்லை மாற்று.",
            heading: "கடவுச்சொல்லை மாற்று"
        },
        consentManagement: {
            actionTitles: {
                empty: "நீங்கள் எந்தவொரு செயலிற்கும் அனுமதி அளிக்கவில்லை"
            },
            description: "அனுமதி அளிக்கபட்ட செயலிகளையும் வலைத்தளங்களையும் முகாமை செய்க",
            heading: "அனுமதியளிக்கப்பட்ட செயலிகள்",
            placeholders: {
                emptyConsentList: {
                    heading: "நீங்கள் எந்தவொரு செயலிற்கும் அனுமதி அளிக்கவில்லை."
                }
            }
        },
        linkedAccounts: {
            actionTitles: {
                add: "கணைக்கினை சேர்க்க"
            },
            description: "உங்களுடைய அனைத்து இணைக்கப்பட்ட கணக்குகளையும் முகாமை செய்ய",
            heading: "இணைக்கப்பட்ட கணக்குகள்"
        },
        mfa: {
            description: "உங்கள் பல காரணி உறுதிப்பாட்டு விருப்பங்களை பார்வையிடவும் முகாமை செய்யவும்",
            heading: "பல காரணி உறுதிப்பாடு"
        },
        profile: {
            description: "உங்கள் அடிப்படை சுயவிபரத் தகவல்களை முகாமை செய்ய மற்றும் புதுப்பிக்க",
            heading: "சுயவிபரம்"
        },
        profileExport: {
            actionTitles: {
                export: "சுயவிபரத்தை ஏற்றுமதி செய்க"
            },
            description:
                "பயனர் தகவல், பாதுகாப்பு வினாக்கள், அனுமதிகள் உள்ளிட்ட அனைத்து " +
                "சுயவிபரங்களையும் பதிவிறக்கம் செய்ய.",
            heading: "சுயவிபரத்தை ஏற்றுமதி செய்க"
        },
        userSessions: {
            actionTitles: {
                empty: "செயலில் அமர்வுகள் இல்லை",
                terminateAll: "சகல அமர்வுகளையும் முடிக்க"
            },
            description: "செய்ற்பாட்டில் உள்ள உங்கள் அமர்வுகளை முகாமை செய்ய மற்றும் பார்க்க",
            heading: "செயற்பாட்டில் உள்ள பயனர் அமர்வுகள்",
            placeholders: {
                emptySessionList: {
                    heading: "இந்த பயனரின் எந்தவொரு அமர்வும் செய்ற்பாட்டினில் இல்லை"
                }
            }
        }
    }
};

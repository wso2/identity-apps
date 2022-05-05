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
                    add: "குறியீட்டு மீட்பு விருப்புகளை சேர்க்க மற்றும் புதுப்பிக்க"
                },
                heading: "குறியீட்டு மீட்பு"
            },
            emailRecovery: {
                descriptions: {
                    add: "மீட்பு மின்னஞ்சல் முகவரிய சேர்க்க",
                    update: "மீட்பு மின்னஞ்சல் முகவரியை புதுப்பிக்க ({{email}})",
                    view: "மீட்பு மின்னஞ்சல் முகவரியைக் காண்க ({{email}})"
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
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "மீட்டெடுப்பு விருப்பத்தைப் பெறுவதில் பிழை"
                    },
                    genericError: {
                        description: "மீட்பு விருப்பத்தைப் பெறும்போது பிழை ஏற்பட்டது",
                        message: "ஏதோ தவறு நடந்துவிட்டது"
                    },
                    success: {
                        description: "மீட்பு விருப்பத்தை வெற்றிகரமாக மீட்டெடுத்தது",
                        message: "மீட்பு விருப்பம் மீட்டெடுப்பு வெற்றிகரமாக"
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
        advancedSearch: {
            form: {
                inputs: {
                    filterAttribute: {
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
                        placeholder: "எ.கா.: admin, wso2 போன்றவை",
                        validations: {
                            empty: "வடிகட்டும் மதிப்பு ஒரு கட்டாய களமாகும்"
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
            resultsIndicator: "{{query}} இற்கான பெறுபேறுகள்"
        },
        applications: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "எ.கா.: பெயர், விவரம் போன்றவை"
                        },
                        filterCondition: {
                            placeholder: "எ.கா.: தொடங்குவது"
                        },
                        filterValue: {
                            placeholder: "தேட மதிப்பை உள்ளிடவும்"
                        }
                    }
                },
                placeholder: "Search by application name"
            },
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
                        2: "தயவு செய்து இயக்க நிர்வாகி ஒருவரிடம் செயலிகளின் கண்டுபிடிப்புத்தன்மையை செயற்படுத்துமாறு " +
                            "விண்ணப்பியுங்கள்."
                    },
                    title: "செயலிகள் ஏதுமில்லை"
                }
            },
            recent: {
                heading: "அண்மையில் பயன்படுத்தப்பட்ட செயலிகள்"
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
            editConsent: {
                collectionMethod: "அறவிடும் முறை",
                dangerZones: {
                    revoke: {
                        actionTitle: "அகற்றுவதில்",
                        header: "சம்மதத்தை ரத்துசெய்",
                        subheader: "இந்த பயன்பாட்டிற்கான ஒப்புதலை நீங்கள் மீண்டும் வழங்க வேண்டும்."
                    }
                },
                description: "விபரம்",
                piiCategoryHeading:
                    "உங்கள் தனிப்பட்ட தகவல்களை பயன்பாட்டுடன் சேகரிப்பதற்கும் பகிர்வதற்கும் சம்மதத்தை நிர்வகிக்கவும். " +
                    "மாற்றங்களைச் சேமிக்க நீங்கள் திரும்பப்பெற வேண்டிய பண்புகளைத் தேர்வுசெய்து புதுப்பிப்பு பொத்தானை " +
                    "அழுத்தவும் அல்லது அனைத்து பண்புகளுக்கான ஒப்புதலை நீக்க திரும்பப்பெறு பொத்தானை அழுத்தவும்.",
                state: "நிலை",
                version: "பதிப்பு"
            },
            modals: {
                consentRevokeModal: {
                    heading: "நீ சொல்வது உறுதியா?",
                    message:
                        "இந்த செயல்பாடு மீளக்கூடியதல்ல. இது அனைத்து பண்புகளுக்கான ஒப்புதலை நிரந்தரமாக ரத்து " +
                        "செய்யும். நீங்கள் நிச்சயமாக தொடர விரும்புகிறீர்களா?",
                    warning: "உள்நுழைவு ஒப்புதல் பக்கத்திற்கு நீங்கள் திருப்பி விடப்படுவீர்கள் என்பதை நினைவில் கொள்க"
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
        cookieConsent: {
            confirmButton: "அறிந்துகொண்டேன்",
            content: "சிறந்த சிறந்த அனுபவத்தைப் பெறுவதை உறுதிசெய்ய நாங்கள் குக்கீகளைப் பயன்படுத்துகிறோம். " +
                "இந்த குக்கீகள் பயன்படுத்தப்படுகின்றன மென்மையான மற்றும் தனிப்பயனாக்கப்பட்ட சேவைகளை வழங்கும் " +
                "போது தடையில்லா தொடர்ச்சியான அமர்வை பராமரிக்கவும். நாங்கள் குக்கீகளை எவ்வாறு " +
                "பயன்படுத்துகிறோம் என்பது பற்றி மேலும் அறிக, எங்கள் <1>குக்கீ கொள்கை</1> ஐப் பார்க்கவும்."
        },
        federatedAssociations: {
            deleteConfirmation: "இது உங்கள் கணக்கிலிருந்து இந்த வெளிப்புற உள்நுழைவை அகற்றும். நீக்குவதைத் தொடர " +
                "விரும்புகிறீர்களா?",
            notifications: {
                getFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "வெளிப்புற உள்நுழைவுகளை பெற முடியவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "வெளிப்புற உள்நுழைவுகள் வெற்றிகரமாக பெறப்பட்டுவிட்டன",
                        message: "வெளிப்புற உள்நுழைவுகள் வெற்றிகரமாக பெறப்பட்டுவிட்டன"
                    }
                },
                removeAllFederatedAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "வெளிப்புற உள்நுழைவுகளை அகற்ற முடியவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "அனைத்து வெளிப்புற உள்நுழைவுகளும் வெற்றிகரமாக அகற்றப்பட்டன",
                        message: "வெளிப்புற உள்நுழைவுகள் வெற்றிகரமாக அகற்றப்பட்டன"
                    }
                },
                removeFederatedAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "வெளிப்புற உள்நுழைவை அகற்ற முடியவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "வெளிப்புற உள்நுழைவு வெற்றிகரமாக அகற்றப்பட்டது",
                        message: "வெளிப்புற உள்நுழைவு வெற்றிகரமாக அகற்றப்பட்டது"
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
                    description: "டெவலப்பர்கள் அல்லது நிர்வாகிகளாக நிர்வகிக்கவும்",
                    name: "Console"
                },
                myAccount: {
                    description: "உங்கள் சொந்த கணக்கை நிர்வகிக்கவும்",
                    name: "My Account"
                },
                tooltip: "Apps"
            },
            organizationLabel: "இந்தக் கணக்கு நிர்வகிக்கப்படுகிறது"
        },
        linkedAccounts: {
            accountTypes: {
                local: {
                    label: "உட்பயனர் கணக்கினை சேர்க்க"
                }
            },
            deleteConfirmation: "இது உங்கள் கணக்கிலிருந்து இணைக்கப்பட்ட கணக்கை அகற்றும். நீக்குவதைத் தொடர " +
                "விரும்புகிறீர்களா?",
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
                removeAllAssociations: {
                    error: {
                        description: "{{description}}",
                        message: "இணைக்கப்பட்ட பயனர் கணக்குகளை அகற்றுவதில் பிழை"
                    },
                    genericError: {
                        description: "இணைக்கப்பட்ட பயனர் கணக்குகளை அகற்றும்போது பிழை ஏற்பட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "இணைக்கப்பட்ட அனைத்து பயனர் கணக்குகளும் அகற்றப்பட்டுள்ளன",
                        message: "இணைக்கப்பட்ட கணக்குகள் வெற்றிகரமாக அகற்றப்பட்டன"
                    }
                },
                removeAssociation: {
                    error: {
                        description: "{{description}}",
                        message: "இணைக்கப்பட்ட பயனர் கணக்கை அகற்றுவதில் பிழை"
                    },
                    genericError: {
                        description: "இணைக்கப்பட்ட பயனர் கணக்கை அகற்றும்போது பிழை ஏற்பட்டது",
                        message: "ஏதோ தவறு நடைபெற்றிருக்கிறது"
                    },
                    success: {
                        description: "இணைக்கப்பட்ட பயனர் கணக்குகள் அகற்றப்பட்டன",
                        message: "இணைக்கப்பட்ட கணக்கு வெற்றிகரமாக அகற்றப்பட்டது"
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
        loginVerifyData: {
            description: "உள்நுழைவின் போது உங்கள் அடையாளத்தை மேலும் சரிபார்க்க இந்தத் தரவு பயன்படுத்தப்படுகிறது",
            heading: "உங்கள் உள்நுழைவைச் சரிபார்க்கப் பயன்படுத்தப்படும் தரவு",
            modals: {
                clearTypingPatternsModal: {
                    heading: "உறுதிப்படுத்தல்",
                    message: "இந்த செயல் TypingDNAவில் சேமிக்கப்பட்ட உங்கள் தட்டச்சு முறைகளை அழிக்கும். "+
                        "தொடர விரும்புகிறீர்களா?"
                }
            },
            notifications: {
                clearTypingPatterns: {
                    error: {
                        description: "தட்டச்சு முறைகளை அழிக்க முடியவில்லை. உங்கள் தள நிர்வாகியைத் தொடர்பு கொள்ளவும்",
                        message: "தட்டச்சு முறைகளை அழிக்க முடியவில்லை"
                    },
                    success: {
                        description: "TypingDNAவில் உங்கள் தட்டச்சு முறைகள் வெற்றிகரமாக அழிக்கப்பட்டுள்ளன",
                        message: "தட்டச்சு முறைகள் வெற்றிகரமாக அழிக்கப்பட்டன"
                    }
                }
            },
            typingdna: {
                description: "உங்கள் தட்டச்சு முறைகளை இங்கிருந்து அழிக்க முடியும்",
                heading: "TypingDNA தட்டச்சு வடிவங்கள்"
            }
        },
        mfa: {
            authenticatorApp: {
                addHint: "புதிய QR குறியீட்டைச் சேர்க்கிறது",
                configuredDescription: "இரண்டு காரணி அங்கீகாரத்திற்காக உங்கள் உள்ளமைக்கப்பட்ட " +
                    "அங்கீகார பயன்பாட்டிலிருந்து TOTP குறியீடுகளைப் பயன்படுத்தலாம். பயன்பாட்டிற்கான அணுகல் " +
                    "உங்களிடம் இல்லையென்றால், இங்கிருந்து ஒரு புதிய அங்கீகார பயன்பாட்டை அமைக்கலாம்",
                deleteHint: "QR குறியீட்டை நீக்குகிறது",
                description: "பயன்பாடுகளில் உள்நுழையும்போது இரண்டாவது காரணியாக " +
                    "நேர அடிப்படையிலான, ஒரு முறை கடவுக்குறியீடுகளை " +
                    "(TOTP என்றும் அழைக்கப்படுகிறது) பயன்படுத்த ஒரு அங்கீகார " +
                    "பயன்பாட்டைப் பயன்படுத்தி QR குறியீட்டை ஸ்கேன் செய்யுங்கள்.",
                enableHint: "TOTP அங்கீகாரத்தை இயக்கு/முடக்கு",
                heading: "அங்கீகார பயன்பாடு",
                hint: "QR குறியீட்டினை காண்பி",
                modals: {
                    delete : {
                        heading: "உறுதிப்படுத்தல்",
                        message: "இந்த செயல் உங்கள் சுயவிவரத்தில் சேர்க்கப்பட்ட QR குறியீட்டை அகற்றும். " +
                            "நீங்கள் தொடர விரும்புகிறீர்களா ?"
                    },
                    done: "வெற்றி! இப்போது இரண்டு காரணி உறுதிப்பாட்டிற்கு உங்கள் உறுதிப்பாட்டு செயலியை பயன்படுத்தலாம்",
                    heading: "Set Up An Authenticator App",
                    scan: {
                        additionNote: "உங்கள் சுயவிவரத்தில் QR குறியீடு வெற்றிகரமாகச் சேர்க்கப்பட்டது!",
                        authenticatorApps: "உறுதிப்பாட்டு செயலிகள்",
                        generate: "புதிய குறியீட்டை உருவாக்கவும்",
                        heading: "ஒரு உறுதிப்பாட்டு செயலியை பயன்படுத்தி இந்த QR குறியீட்டை பதிவு செய்யுங்கள்",
                        messageBody: "உறுதிப்பாட்டு செயலிகளின் பட்டியலை இங்கே காணலாம்.",
                        messageHeading: "உங்களிடம் உறுதிப்பாட்டு செயலி இல்லையா?"
                    },
                    toolTip: "பயன்பாடு இல்லையா? <3> App Store </ 3> அல்லது <3> Google Play </ 3> " +
                        "இலிருந்து Google Authenticator போன்ற அங்கீகார பயன்பாட்டைப் பதிவிறக்கவும்",
                    verify: {
                        error: "சரிபார்ப்பு தோல்வியுற்றது. தயவு செய்து மீண்டும் முயற்சிக்கவும்.",
                        heading: "உறுதிப்பாட்டு செயலியிலிருந்து சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்",
                        label: "சரிபார்ப்புக் குறியீடு",
                        placeholder: "உங்கள் சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்",
                        reScan: "மீண்டும் பதிவு செய்",
                        reScanQuestion: "QR குறியீட்டினை மீண்டும் பதிவு செய்ய வேண்டுமா?",
                        requiredError: "சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்"
                    }
                },
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "ஏதோ தவறேற்பட்டுவிட்டது"
                        },
                        genericError: {
                            description: "TOTP அங்கீகரிப்பு உள்ளமைவை நீக்கும் போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறேற்பட்டுவிட்டது"
                        }
                    },
                    initError: {
                        error: {
                            description: "{{error}}",
                            message: "ஏதோ தவறேற்பட்டுவிட்டது"
                        },
                        genericError: {
                            description: "QR குறியீட்டினை பெறும் பொழுது தவறேற்பட்டுவிட்டது",
                            message: "ஏதோ தவறேற்பட்டுவிட்டது"
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "ஏதோ தவறேற்பட்டுவிட்டது"
                        },
                        genericError: {
                            description: "புதிய QR குறியீட்டினை பெறும் பொழுது தவறேற்பட்டுவிட்டது",
                            message: "ஏதோ தவறேற்பட்டுவிட்டது"
                        }
                    }
                }
            },
            backupCode: {
                download: {
                    heading: "உங்கள் காப்புக் குறியீடுகளைச் சேமிக்கவும்.",
                    info1: "நீங்கள் ஒவ்வொரு காப்புக் குறியீட்டையும் ஒரு முறை மட்டுமே பயன்படுத்த முடியும்.",
                    info2: "இந்த குறியீடுகள் உருவாக்கப்பட்டன: ",
                    subHeading: "இந்த காப்பு குறியீடுகளை எங்காவது பாதுகாப்பாக ஆனால் அணுகக்கூடிய இடத்தில் வைத்திருங்கள்"
                },
                heading: "காப்பு குறியீடுகள்",
                modals: {
                    description: "நீங்கள் உங்கள் ஃபோனில் இல்லாதபோது உள்நுழைய, காப்புப் பிரதிக் " + 
                    "குறியீடுகளைப் பயன்படுத்தவும். அவை அனைத்தும் பயன்படுத்தப்படும்போது நீங்கள் மேலும் உருவாக்கலாம்",
                    download: {
                        heading: "குறியீடுகளைப் பதிவிறக்கவும்"
                    },
                    generate: {
                        description: "உங்கள் காப்புப் பிரதி குறியீடுகள் அனைத்தும் பயன்படுத்தப்படுகின்றன. " + 
                        "காப்பு குறியீடுகளின் புதிய தொகுப்பை உருவாக்குவோம்",
                        heading: "உருவாக்கு" 
                    },
                    heading: "காப்பு குறியீடுகள்",
                    info: "ஒவ்வொரு குறியீட்டையும் ஒரு முறை மட்டுமே பயன்படுத்த முடியும்",
                    refresh: {
                        heading: "புதுப்பிப்பு"
                    },
                    subHeading: "உள்நுழைய நீங்கள் பயன்படுத்தக்கூடிய ஒரு முறை கடவுக்குறியீடுகள்"
                },
                notifications: {
                    deleteError: {
                        error: {
                            description: "{{error}}",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        genericError: {
                            description: "காப்பு குறியீடுகளை நீக்குவதில் பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        }
                    },
                    downloadError: {
                        error: {
                            description: "{{error}}",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        genericError: {
                            description: "புதிய காப்புப் பிரதி குறியீடுகளைப் பதிவிறக்க " + 
                                "முயற்சிக்கும்போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        }
                    },
                    downloadSuccess: {
                        genericMessage: {
                            description: "காப்புப் பிரதி குறியீடுகள் வெற்றிகரமாகப் பதிவிறக்கப்பட்டன.",
                            message: "காப்புப் பிரதி குறியீடுகள் வெற்றிகரமாகப் பதிவிறக்கப்பட்டன."
                        },
                        message: {
                            description: "{{message}}",
                            message: "காப்புப் பிரதி குறியீடுகள் வெற்றிகரமாகப் பதிவிறக்கப்பட்டன."
                        }
                    },
                    refreshError: {
                        error: {
                            description: "{{error}}",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        genericError: {
                            description: "புதிய காப்புப் பிரதி குறியீடுகளை உருவாக்க " + 
                                "முயற்சிக்கும்போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        }
                    },
                    retrieveAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        genericError: {
                            description: "இயக்கப்பட்ட அங்கீகரிப்பாளர் பட்டியலைப் பெற " + 
                                "முயற்சிக்கும்போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        }
                    },
                    retrieveError: {
                        error: {
                            description: "{{error}}",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        genericError: {
                            description: "காப்புப் பிரதி குறியீடுகளை மீட்டெடுக்கும் போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        }
                    },
                    updateAuthenticatorError: {
                        error: {
                            description: "{{error}}",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        genericError: {
                            description: "இயக்கப்பட்ட அங்கீகரிப்பு பட்டியலை புதுப்பிக்க முயற்சிக்கும் " + 
                                "போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        }
                    }
                }
            },
            fido: {
                description: "உங்கள் கணக்கில் உள்நுழைய, உங்கள் சாதனத்தில் FIDO2 பாதுகாப்பு விசை அல்லது " +
                    "பயோமெட்ரிக்ஸைப் பயன்படுத்தலாம்.",
                form: {
                    label: "பாதுகாப்பு விசை/பயோமெட்ரிக்ஸ்",
                    placeholder: "பாதுகாப்பு விசை/பயோமெட்ரிக் பெயரை உள்ளிடவும்",
                    remove: "பாதுகாப்பு விசை/பயோமெட்ரிக்கை அகற்றவும்",
                    required: "உங்கள் பாதுகாப்பு விசை/பயோமெட்ரிக் பெயரை உள்ளிடவும்"
                },
                heading: "பாதுகாப்பு விசை/பயோமெட்ரிக்ஸ்",
                modals: {
                    deleteConfirmation: {
                        assertionHint: "உங்கள் செயலை உறுதிப்படுத்தவும்.",
                        content: "இந்தச் செயல் மீள முடியாதது மற்றும் பாதுகாப்பு " +
                            "விசை/பயோமெட்ரிக் நிரந்தரமாக நீக்கப்படும்.",
                        description: "இந்த பாதுகாப்பு விசை/பயோமெட்ரிக்கை " +
                            "நீக்கினால், உங்கள் கணக்கில் மீண்டும் உள்நுழைய " +
                            "முடியாமல் போகலாம். எச்சரிக்கையுடன் தொடரவும்.",
                        heading: "நீ சொல்வது உறுதியா?"
                    },
                    deviceRegistrationErrorModal: {
                        description: "பாதுகாப்பு விசை/பயோமெட்ரிக் பதிவு தடைபட்டது. இது வேண்டுமென்றே " +
                            "செய்யப்படவில்லை என்றால், நீங்கள் அதே ஓட்டத்தை " +
                            "மீண்டும் முயற்சிக்கலாம்.",
                        heading: "பாதுகாப்பு விசை/பயோமெட்ரிக் பதிவு தோல்வியடைந்தது",
                        tryWithOlderDevice: "பழைய பாதுகாப்பு விசை/பயோமெட்ரிக் மூலம் மீண்டும் முயற்சி செய்யலாம்."
                    }
                },
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "பாதுகாப்பு விசை/பயோமெட்ரிக்கை அகற்றும்போது பிழை ஏற்பட்டது"
                        },
                        genericError: {
                            description: "பாதுகாப்பு விசை/பயோமெட்ரிக்கை அகற்றும்போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        success: {
                            description: "பட்டியலிலிருந்து பாதுகாப்பு விசை/பயோமெட்ரிக் வெற்றிகரமாக அகற்றப்பட்டது",
                            message: "உங்கள் பாதுகாப்புச் சாவி/பயோமெட்ரிக் வெற்றிகரமாக அகற்றப்பட்டது"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "பாதுகாப்பு விசை/பயோமெட்ரிக்கை மீட்டெடுப்பதில் பிழை ஏற்பட்டது"
                        },
                        genericError: {
                            description: "பாதுகாப்பு விசை/பயோமெட்ரிக்கை மீட்டெடுப்பதில் பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        success: {
                            description: "பாதுகாப்பு விசை/பயோமெட்ரிக் வெற்றிகரமாக பதிவுசெய்யப்பட்டது, " +
                                "இப்போது நீங்கள் அங்கீகாரத்திற்காக அதைப் பயன்படுத்தலாம்.",
                            message: "உங்கள் பாதுகாப்புச் சாவி/பயோமெட்ரிக் பதிவுசெய்யப்பட்டது"
                        }
                    },
                    updateDeviceName: {
                        error: {
                            description: "{{description}}",
                            message: "பாதுகாப்பு விசை/பயோமெட்ரிக் பெயரைப் புதுப்பிக்கும்போது பிழை ஏற்பட்டது"
                        },
                        genericError: {
                            description: "பாதுகாப்பு விசை/பயோமெட்ரிக் பெயரைப் புதுப்பிக்கும்போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        success: {
                            description: "உங்கள் பாதுகாப்பு விசை/பயோமெட்ரிக் பெயர் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
                            message: "பாதுகாப்புச் சாவி/பயோமெட்ரிக் பெயர் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது"
                        }
                    }
                },
                tryButton: "பழைய பாதுகாப்பு விசை/பயோமெட்ரிக் மூலம் முயற்சிக்கவும்"
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
        mobileUpdateWizard: {
            done: "வெற்றி! உங்கள் மொபைல் எண் வெற்றிகரமாக சரிபார்க்கப்பட்டது.",
            notifications: {
                resendError: {
                    error: {
                        description: "{{error}}",
                        message: "ஏதோ தவறு நடைபெற்றிருக்கிறது"
                    },
                    genericError: {
                        description: "புதிய சரிபார்ப்புக் குறியீட்டைப் பெற முயற்சிக்கும்போது பிழை ஏற்பட்டது",
                        message: "ஏதோ தவறு நடைபெற்றிருக்கிறது"
                    }
                },
                resendSuccess: {
                    message: "குறியீடு கோரிக்கையை மீண்டும் அனுப்புங்கள்"
                }
            },
            submitMobile: {
                heading: "உங்கள் புதிய மொபைல் எண்ணை உள்ளிடவும்"
            },
            verifySmsOtp: {
                error: "சரிபார்ப்பு தோல்வியுற்றது. தயவுசெய்து மீண்டும் முயற்சி செய்க.",
                generate: "புதிய சரிபார்ப்புக் குறியீட்டை மீண்டும் அனுப்பவும்",
                heading: "உங்கள் மொபைல் எண்ணுக்கு அனுப்பப்பட்ட சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்",
                label: "சரிபார்ப்புக் குறியீடு",
                placeholder: "உங்கள் சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்",
                requiredError: "சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்"
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
                    complete: "உங்கள் சுயவிவரம் முடிந்தது",
                    completedFields: "பூர்த்தி செய்யப்பட்ட புலங்கள்",
                    completionPercentage: "உங்கள் சுயவிவர நிறைவு {{percentage}}%",
                    inComplete: "உங்கள் சுயவிவரத்தை பூர்த்தி செய்யவும்",
                    inCompleteFields: "முழுமையற்ற புலங்கள்",
                    mandatoryFieldsCompletion: "{{total}} கட்டாய புலங்களில் {{completed}} முடிந்தது",
                    optionalFieldsCompletion: "{{total}} விருப்ப புலங்களில் {{completed}} முடிந்தது"
                },
                consentManagement: {
                    actionTitles: {
                        manage: "அனுமதிகளை முகாமை செய்"
                    },
                    description: "செயலிகளுடன் பகிர விரும்பும் தகவல்களை கட்டுப்படுத்து",
                    header: "அனுமதி முகாமை"
                },
                profileStatus: {
                    completionPercentage: "உங்கள் சுயவிவர நிறைவு {{percentage}}%",
                    header: "உங்கள் {{productName}} சுயவிவரம்",
                    userSourceText: "(உடன் கையொப்பமிடப்பட்டுள்ளது {{source}})"
                }
            }
        },
        privacy: {
            about: {
                description:
                    "WSO2 Identity Server (இக் கொள்கையில் “WSO2 IS” என குறிப்பிடப்படும்) திறந்த தரநிலைகள் மற்றும் " +
                    "குறிப்புகளை அடிப்படையாகக் கொண்ட ஒரு திறந்த மூல அடையாள முகாமைத்துவம் மற்றும் உரிமம் வழங்கி ஆகும்.",
                heading: "WSO2 Identity Server ஐ பற்றி"
            },
            privacyPolicy: {
                collectionOfPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "சந்தேகத்துக்குரிய முறையில் உங்கள் கணக்கிற்குள் உள்நுழைய மேற்கொள்ளப்படும் முயற்சிகளை " +
                                "கண்டரிய WSO2 IS உங்கள் IP முகவரியினை பயன்படுத்துகின்றது.",
                            1:
                                "உங்களது முதற் பெயர், இறுதிப் பெயர் போன்ற விவரங்களை WSO2 IS உங்களுக்கு சிறப்பான, " +
                                "தனிப்பட்ட அனுபவத்தை தர பயன்படுத்துகின்றது.",
                            2:
                                "உங்களது கணக்கினை மீட்க மட்டுமே WSO2 IS உங்களது பாதுகாப்பு வினாக்களையும் அவற்றிற்கான " +
                                "விடைகளையும் பயன்படுத்துகின்றது."
                        },
                        para1:
                            "உங்கள் அணுகல் தேவைகளை பூர்த்தி செய்ய மட்டுமே WSO2 IS உங்களது தகவல்களை சேகரிக்கின்றது." +
                            "உதாரணத்திற்கு"
                    },
                    heading: "தனிப்பட்ட தகவல் சேகரிப்பு",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0:
                                    "நீங்கள் உங்களது தனிப்பட்ட தகவல்களை உள்ளிடும் சுய விவரப் பக்கத்திலிருந்து" +
                                    " தகவல்களை சேகரிப்பதனூடாகவும்",
                                1:
                                    "உங்களது IP முகவரியினை HTTP கோரிக்கைகள், HTTP headers, மற்றும் TCP/IPயினூடாக " +
                                    "கண்காணிப்பதனூடாகவும்",
                                2: "உங்களது பூகோளவியல் தகவல்களை IP முகவரியினூடாக கண்காணிப்பதனூடகவும்",
                                3: "மேலதிக தகவல்களுக்காக உங்களது உள்நுழைவு வரலாறு மற்றும் உலாவி குக்கீகளை " +
                                    "கண்காணிப்பதனூடாகவும்"
                            },
                            para1: "WSO2 IS உங்கள் தகவல்களை பின்வருமாறு சேகரிக்கின்றது:"
                        },
                        heading: "கண்காணிப்பு தொழில்நுட்பங்கள்"
                    }
                },
                description: {
                    para1:
                        "இக் கொள்கை, WSO2 IS எவ்வாறு உங்கள் தகவல்களை பெறுகின்றது, தகவல்களை பெறும் நோக்கம், மற்றும் " +
                        "உங்கள் தகவல்களை வைத்திருத்தல் பற்றிய விவரங்களை விவரிக்கின்றது.",
                    para2:
                        "இக் கொள்கை வெறுமனே குறிப்பிற்காக மட்டுமே. அத்துடன், இக்கொள்கை உற்பத்தியாக " +
                        "வழங்கப்படும் மென்பொருளுக்கு மட்டும் பொருந்தும்." +
                        "WSO2 Inc. இனாலோ அதனது மென்பொருள் பொறியியலாளர்களினாலோ WSO2 IS இல் வைத்திருக்கப்பட்டிருக்கும் " +
                        "தகவல்களை பெற முடியாது. மேலதிக தகவல்களுக்கு <i>பொறுப்புத் துறப்பு</i> பகுதியினை பார்வையிடவும்.",
                    para3:
                        "WSO2 IS ஐ நிர்வாகம் செய்யும் அல்லது அதனது பாவனையை கட்டுபடுத்தும் நிறுவனங்களோ, அல்லது " +
                        "தனிப்பட்ட நபர்களோ, அந் நபரினால் அல்லது அந் நிறுவனத்தினால் தகவல்கள் எவ்வாறு " +
                        "கட்டுபடுத்தப்படுகின்றன அல்லது செயாலாக்கப்படுகின்றன போன்றவற்றை விவரிக்கும் தமக்கானதொரு " +
                        "பொறுப்புத் துறப்பு கொள்கையினை உருவாக்கிக் கொள்ள வேண்டும்."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0:
                                "WSO2 இற்கு, அதன் ஊழியர்களிற்கு, கூட்டாளர்களிற்கு மற்றும் துணை நிறுவனங்களிற்கு WSO2 " +
                                "IS இல் உள்ள தனிப்பட்ட தரவு உட்பட எந்தவொரு தரவையும் அணுகவோ, சேமிக்கவோ, " +
                                "செயலாக்கவோ அல்லது கட்டுப்படுத்தவோ இயாலது மற்றும் இவற்றிற்கான தேவையும் கிடையாது. " +
                                "தனிப்பட்ட தரவு உட்பட அனைத்து தரவும் WSO2 IS ஐ இயக்கும் நிறுவனம் அல்லது தனிநபரால் " +
                                "கட்டுப்படுத்தப்பட்டு செயலாக்கப்படுகிறது. WSO2, அதன் பணியாளர்கள், கூட்டாளர்கள் " +
                                "மற்றும் துணை நிறுவனங்கள் எந்தவொரு தரவு தனியுரிமை விதிமுறைகளின் அர்த்தத்திற்குட்பட்ட " +
                                "ஒரு தரவு செயலி அல்லது தரவுக் கட்டுப்படுத்தி அல்ல. WSO2 எந்தவொரு உத்தரவாதத்தையும் " +
                                "வழங்காது என்பதுடன் நிறுவனங்களோ, தனி நபர்களோ WSO2 IS ஐ பயன்படுத்தும் முறை மற்றும் " +
                                "நோக்கம், அத்துடன் அவற்றின் சட்டபூர்வ தன்மை என்பனவற்றிற்கு எவ்வித பொறுப்பும் " +
                                "எடுக்காது.",
                            1:
                                "இந்த தனியுரிமைக் கொள்கை WSO2 IS ஐ இயக்கும் நிறுவனம் அல்லது நபர்களின் தகவல் " +
                                "நோக்கங்களுக்காகவும், தனிப்பட்ட தரவு பாதுகாப்பு தொடர்பாக WSO2 IS இல் உள்ள " +
                                "செயல்முறைகள் மற்றும் செயல்பாடுகளை விளக்குவற்காகவும் அமைக்கப்பட்டுள்ளது. " +
                                "பயனர்களின் தனிப்பட்ட தரவை நிர்வகிக்கும் அதன் சொந்த விதிகள் மற்றும் செயல்முறைகளை " +
                                "உருவாக்கி நிர்வகிப்பது WSO2 IS ஐ இயக்கும் நிறுவனங்கள் மற்றும் நபர்களின் " +
                                "பொறுப்பாகும், மேலும் இதுபோன்ற விதிகள் மற்றும் செயல்முறைகள் இங்கு உள்ள பயன்பாடு, " +
                                "சேமிப்பு மற்றும் வெளிப்படுத்தல் கொள்கைகளை மாற்றக்கூடும். எனவே பயனர்களின் " +
                                "தனிப்பட்ட தரவை நிர்வகிக்கும் விவரங்களுக்கு பயனர்கள் அதன் சொந்த தனியுரிமைக் " +
                                "கொள்கைக்காக நிறுவனம் அல்லது WSO2 IS ஐ இயக்கும் நபர்களை அணுக வேண்டும்."
                        }
                    },
                    heading: "பொறுப்புத்துறப்பு"
                },
                disclosureOfPersonalInfo: {
                    description:
                        "WSO2 IS உடன் பதிவுசெய்யப்பட்ட தொடர்புடைய செயலிகளிற்கு (சேவை வழங்குநர் என்றும் " +
                        "அழைக்கப்படுகிறது) மட்டுமே தனிப்பட்ட தகவல்களை WSO2 IS வெளியிடுகிறது. இந்த செயலிகள் உங்கள் " +
                        "நிறுவனம் அல்லது நிறுவனத்தின் அடையாள நிர்வாகியால் பதிவு செய்யப்பட்டுள்ளன. தனிப்பட்ட " +
                        "தகவல்கள், நீங்கள் வேறுவிதமாக ஒப்புக் கொள்ளாவிட்டால் அல்லது சட்டத்தால் தேவைப்படும் " +
                        "இடத்தில் ஒழிய, சேகரிக்கப்பட்ட நோக்கங்களுக்காக மட்டுமே (அல்லது அந்த நோக்கத்துடன் " +
                        "ஒத்துப்போகும் என அடையாளம் காணப்பட்ட ஒரு பயன்பாட்டிற்காக), அத்தகைய சேவை வழங்குநர்களால் " +
                        "கட்டுப்படுத்தப்படும் விதத்திற்கு அமைய வெளிப்படுத்தப்படுகிறது. Personal ",
                    heading: "தனிப்பட்ட தகவல்களை வெளிப்படுத்தல்",
                    legalProcess: {
                        description:
                            "WSO2 ISஐ இயக்கும் அமைப்பு, நிறுவனம் அல்லது தனிநபர் உங்கள் தனிப்பட்ட தகவல்களை " +
                            "உங்கள் அனுமதியுடன் அல்லது இல்லாமல் சட்டத்தால் நிர்ப்பந்திக்கப்படும் இடத்து உரிய " +
                            "மற்றும் சட்டபூர்வமான செயல்முறைகளின் பிற்பாடு வெளியிட நிர்ப்பந்திக்கப்படலாம் " +
                            "என்பதை நினைவில் கொள்க.",
                        heading: "சட்ட செயல்முறை"
                    }
                },
                heading: "தனியுரிமைக் கொள்கை",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1:
                                "WSO2 IS இன் மேம்படுத்தப்பட்ட பதிப்புகள் இந்தக் கொள்கையில் மாற்றங்களைக் " +
                                "கொண்டிருக்கலாம் மற்றும் இந்தக் கொள்கைக்கான திருத்தங்கள் அத்தகைய " +
                                "மேம்பாடுகளுக்குள் தொகுக்கப்படும். மேம்படுத்தப்பட்ட பதிப்புகளைப் பயன்படுத்தத் " +
                                "தேர்ந்தெடுக்கும் பயனர்களுக்கு மட்டுமே இத்தகைய மாற்றங்கள் பொருந்தும்.",
                            para2:
                                "WSO2 IS ஐ இயக்கும் அமைப்பு அவ்வப்போது தனியுரிமைக் கொள்கையைத் " +
                                "திருத்தக்கூடும். WSO2 IS ஐ இயக்கும் அமைப்பு வழங்கிய அந்தந்த இணைப்பைக் கொண்டு மிக " +
                                "சமீபத்திய நிர்வாகக் கொள்கையை நீங்கள் காணலாம். எங்கள் அதிகாரப்பூர்வ பொது தடங்களின் " +
                                "ஊடாக தனியுரிமைக் கொள்கையில் மேற்கொள்ள்ப்படும் மாற்றங்களை அமைப்பு அறிவிக்கும்."
                        },
                        heading: "கொள்கை மாற்றங்கள்"
                    },
                    contactUs: {
                        description: {
                            para1:
                                "இந்த தனியுரிமைக் கொள்கை தொடர்பாக உங்களுக்கு ஏதேனும் கேள்வி அல்லது " +
                                "வருத்தங்கள் இருந்தால் WSO2 ஐ தொடர்பு கொள்ளவும்."
                        },
                        heading: "எங்களை தொடர்பு கொள்ள"
                    },
                    heading: "மேலதிக தகவல்கள்",
                    yourChoices: {
                        description: {
                            para1:
                                "WSO2 IS க்குள் உங்களிடம் ஏற்கனவே ஒரு பயனர் கணக்கு இருந்தால், இந்த " +
                                "தனியுரிமைக் கொள்கை உங்களுக்கு ஏற்றுக்கொள்ள முடியாதது எனக் கண்டால் உங்கள் " +
                                "கணக்கை செயலிழக்கச் செய்ய உங்களுக்கு உரிமை உண்டு.",
                            para2:
                                "உங்களிடம் கணக்கு இல்லாமல், எங்கள் தனியுரிமைக் கொள்கையுடன் நீங்கள் " +
                                "உடன்படவில்லை என்றால், கணக்கு ஒன்றினை நீங்கள் உருவாக்கமலிருக்க " +
                                "நீங்கள் தீர்மானிக்க முடியும்."
                        },
                        heading: "உங்கள் தேர்வுகள்"
                    }
                },
                storageOfPersonalInfo: {
                    heading: "தனிப்பட்ட தகவல் சேமிப்பு",
                    howLong: {
                        description: {
                            list1: {
                                0: "நிகழ்கால கடவுச்சொல்",
                                1: "முன்பு பயன்படுத்திய கடவுச்சொல்"
                            },
                            para1:
                                "நீங்கள் எங்கள் சேவையின் செயலிலுள்ள பயனராக இருக்கும் வரை WSO2 IS உங்கள் தனிப்பட்ட " +
                                "தரவைத் தக்க வைத்துக் கொள்ளும்.கொடுக்கப்பட்ட பயனர் தளங்களைப் " +
                                "பயன்படுத்தி எந்த நேரத்திலும் உங்கள் தனிப்பட்ட தரவைப் புதுப்பிக்கலாம்.",
                            para2:
                                "WSO2 IS உங்களுக்கு கூடுதல் பாதுகாப்பு அளிக்க சுருக்கப்பட்ட ரகசியங்களை " +
                                "வைத்திருக்கலாம். இதில் பின்வருவன அடங்கும்:"
                        },
                        heading: "எவ்வளவு காலத்திற்கு உங்கள் தகவல்கள் வைத்திருக்கப்படும்?"
                    },
                    requestRemoval: {
                        description: {
                            para1:
                                "உங்கள் கணக்கை நீக்க நிர்வாகியிடம் கோரலாம். நிர்வாகி என்பது நீங்கள் " +
                                "பதிவுசெய்த குத்தகைதாரரின் நிர்வாகி அல்லது நீங்கள் குத்தகைதாரர் அம்சத்தைப் " +
                                "பயன்படுத்தாவிட்டால் சூப்பர் நிர்வாகி.",
                            para2:
                                "கூடுதலாக, பதிவுகள், தரவுத்தளங்கள் அல்லது பகுப்பாய்வு சேமிப்பகத்தில் WSO2 IS " +
                                "தக்கவைத்துள்ள உங்கள் செயல்பாடுகளின் அனைத்து தடயங்களையும் அநாமதேயமாக்க நீங்கள் கோரலாம்."
                        },
                        heading: "உங்கள் தனிப்பட்ட தகவல்களை நீக்க கோருவது எப்படி?"
                    },
                    where: {
                        description: {
                            para1:
                                "WSO2 IS உங்கள் தனிப்பட்ட தகவல்களை பாதுகாப்பான தரவுத்தளங்களில் சேமிக்கிறது. உங்கள் " +
                                "தனிப்பட்ட தகவல்கள் வைத்திருக்கும் தரவுத்தளத்தைப் பாதுகாக்க WSO2 IS சரியான துறையில் " +
                                "ஏற்றுக்கொள்ளப்பட்ட பாதுகாப்பு நடவடிக்கைகளைப் பயன்படுத்துகிறது. WSO2 IS ஒரு " +
                                "தயாரிப்பாக உங்கள் தரவை எந்த மூன்றாம் தரப்பினருடனோ அல்லது இருப்பிடங்களுடனோ மாற்றவோ " +
                                "பகிரவோ இல்லை.",
                            para2:
                                "WSO2 IS உங்கள் தனிப்பட்ட தரவை கூடுதல் பாதுகாப்புடன் வைத்திருக்க குறியாக்கத்தைப் " +
                                "பயன்படுத்தலாம்."
                        },
                        heading: "உங்கள் தனிப்பட்ட தகவல்கள் எங்கு சேகரிக்கப்படுகின்றன?"
                    }
                },
                useOfPersonalInfo: {
                    description: {
                        list1: {
                            0:
                                "தனிப்பயனாக்கப்பட்ட பயனர் அனுபவத்தை உங்களுக்கு வழங்க, WSO2 IS உங்கள் பெயரைப் " +
                                "மற்றும் பதிவேற்றிய உங்கள் படங்களை பயன்படுத்துகிறது",
                            1:
                                "அங்கீகரிக்கப்படாத அணுகல் அல்லது சாத்தியமான ஹேக்கிங் முயற்சிகளிலிருந்து " +
                                "உங்கள் கணக்கைப் பாதுகாக்க, WSO2 IS இந்த நோக்கத்திற்காக HTTP " +
                                "அல்லது TCP / IP தலைப்புகளைப் பயன்படுத்துகிறது.",
                            2:
                                "கணினி செயல்திறன் மேம்பாடுகள் குறித்த பகுப்பாய்வு நோக்கங்களுக்காக புள்ளிவிவர தரவைப் " +
                                "பெறப்படுகின்றது. WSO2 IS புள்ளிவிவர கணக்கீடுகளுக்குப் பிறகு எந்த தனிப்பட்ட " +
                                "தகவலையும் வைத்திருக்காது. எனவே, புள்ளிவிவர அறிக்கையில் ஒரு தனி நபரை அடையாளம் " +
                                "காண வழி இல்லை."
                        },
                        para1:
                            "WSO2 IS உங்கள் தனிப்பட்ட தகவல்களை சேகரிக்கப்பட்ட நோக்கங்களுக்காக மட்டுமே பயன்படுத்தும் " +
                            "(அல்லது அந்த நோக்கத்துடன் ஒத்துப்போகும் அடையாளம் காணப்பட்ட பயன்பாட்டிற்கு).",
                        para2: "WSO2 IS உங்கள் தனிப்பட்ட தகவல்களை பின்வரும் நோக்கங்களுக்காக மட்டுமே பயன்படுத்துகிறது.",
                        subList1: {
                            heading: "இதில் பின்வருவன அடங்கும்:",
                            list: {
                                0: "IP முகவரி",
                                1: "உலாவி கைரேகை",
                                2: "குக்கிகள்"
                            }
                        },
                        subList2: {
                            heading: "WSO2 IS பின்வருவனவற்றை பயன்படத்தலாம்:",
                            list: {
                                0: "புவியியல் தகவல்களைப் பெற IP முகவரி",
                                1: "உலாவி தொழில்நுட்பம் அல்லது / மற்றும் பதிப்பைத் தீர்மானிக்க உலாவி கைரேகை"
                            }
                        }
                    },
                    heading: "தனிப்பட்ட தகவல்களின் பாவனை"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: "உங்கள் பயனர் பெயர் (உங்கள் முதலாளியால் உருவாக்கப்பட்ட பயனர் பெயர் ஒப்பந்தத்தின் " +
                                "கீழ் தவிர)",
                            1: "உங்கள் பிறந்த தேதி / வயது",
                            2: "உள்நுழைய பயன்படும் IP முகவரி",
                            3:
                                "உள்நுழைய ஒரு சாதனத்தை (எ.கா., தொலைபேசி அல்லது டேப்லெட்) பயன்படுத்தினால் " +
                                "உங்கள் சாதன ID"
                        },
                        list2: {
                            0: "நீங்கள் TCP / IP இணைப்பை உருவாக்கிய நகரம் / நாடு",
                            1: "நீங்கள் உள்நுழைந்த நாளின் நேரம் (ஆண்டு, மாதம், வாரம், மணிநேரம் அல்லது நிமிடம்)",
                            2: "நீங்கள் உள்நுழைய பயன்படுத்திய சாதன வகை (எ.கா., தொலைபேசி அல்லது டேப்லெட்)",
                            3: "இயங்கு தளம் மற்றும் பொதுவான உலாவி தகவல்"
                        },
                        para1:
                            "உங்கள் தனிப்பட்ட தகவலாக உங்களை அடையாளம் காணும் எதையும் WSO2 IS கருதுகிறது. " +
                            "இது பின்வருவனவற்றை உள்ளடக்குகிறது, ஆனால் இவை மட்டும் அல்ல:",
                        para2:
                            "இருப்பினும், WSO2 IS தனிப்பட்ட தகவல்களாக கருதப்படாத பின்வரும் தகவல்களையும் " +
                            "சேகரிக்கிறது, ஆனால் இது <1> புள்ளிவிவர </ 1> நோக்கங்களுக்காக மட்டுமே " +
                            "பயன்படுத்தப்படுகிறது. இதற்கான காரணம், உங்களைக் கண்காணிக்க இந்த " +
                            "தகவலைப் பயன்படுத்த முடியாது என்பதே."
                    },
                    heading: "தனிப்பட்ட தகவல்கள் என்றால் என்ன?"
                }
            }
        },
        profile: {
            fields: {
                emails: "மின்னஞ்சல் முகவரி",
                generic: {
                    default: "ஐச் சேருங்கள் {{fieldName}}"
                },
                nameFamilyName: "இறுதிப்பெயர்",
                nameGivenName: "முதற்பெயர்",
                phoneNumbers: "தொலைபேசி இலக்கம்",
                profileImage: "பயனர் படம்",
                profileUrl: "URL",
                userName: "பயனர் பெயர்"
            },
            forms: {
                countryChangeForm: {
                    inputs: {
                        country: {
                            placeholder: "உங்கள் நாட்டை தேர்ந்தெடுங்கள்"
                        }
                    }
                },
                dateChangeForm: {
                    inputs: {
                        date: {
                            validations: {
                                invalidFormat: "YYYY-MM-DD வடிவத்தில் செல்லுபடியாகும் {{fieldName}} ஐ உள்ளிடவும்."
                            }
                        }
                    }
                },
                emailChangeForm: {
                    inputs: {
                        email: {
                            label: "மின்னஞ்சல் முகவரி",
                            note: "கவனிக்குக: இதைத் திருத்துவது இந்தக் கணக்குடன் தொடர்புடைய மின்னஞ்சல் " +
                                "முகவரியை மாற்றுகிறது. கணக்கு மீட்டெடுப்பதற்கும் இந்த மின்னஞ்சல் முகவரி " +
                                "பயன்படுத்தப்படுகிறது.",
                            placeholder: "மின்னஞ்சல் முகவரியை உள்ளிடவும்",
                            validations: {
                                empty: "மின்னஞ்சல் முகவரி ஒரு கட்டாயா களமாகும்",
                                invalidFormat: "மின்னஞ்சல் முகவரி சரியான வடிவத்தில் இல்லை. நீங்கள் " +
                                    "எண்ணெழுத்து எழுத்துக்கள், யூனிகோட் எழுத்துக்கள், அடிக்கோடிட்டு (_), " +
                                    "கோடுகள் (-), காலங்கள் (.) மற்றும் ஒரு அடையாளம் (@) ஆகியவற்றைப் பயன்படுத்தலாம்."
                            }
                        }
                    }
                },
                generic: {
                    inputs: {
                        placeholder: "{{fieldName}} ஐ உள்ளிடவும்",
                        readonly: {
                            placeholder: "இந்த மதிப்பு காலியாக உள்ளது",
                            popup: "உங்கள் புதுப்பிக்க நிர்வாகியைத் தொடர்பு கொள்ளுங்கள் {{fieldName}}"
                        },
                        validations: {
                            empty: "{{fieldName}} ஒரு கட்டாயா களமாகும்",
                            invalidFormat: "{{fieldName}} சரியான வடிவத்தில் இல்லை"
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
                                invalidFormat: "[+][நாட்டின் குறியீடு][பகுதி குறியீடு][உள்ளூர் தொலைபேசி எண்] " +
                                    "வடிவத்தில் செல்லுபடியாகும் மொபைல் எண்ணை உள்ளிடவும்."
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
            messages: {
                emailConfirmation: {
                    content: "உங்கள் சுயவிவரத்தில் புதிய மின்னஞ்சலைச் சேர்க்க மின்னஞ்சல் முகவரி புதுப்பிப்பை " +
                        "உறுதிப்படுத்தவும்.",
                    header: "உறுதிப்படுத்தல் நிலுவையில் உள்ளது!"
                },
                mobileVerification: {
                    content: "இரண்டாவது காரணி அங்கீகாரம் இயக்கப்பட்டிருக்கும்போது எஸ்எம்எஸ் ஓடிபி அனுப்பவும் " +
                        "பயனர்பெயர் / கடவுச்சொல் மீட்டெடுப்பு ஏற்பட்டால் மீட்டெடுப்பு குறியீடுகளை அனுப்பவும் இந்த " +
                        "மொபைல் எண் பயன்படுத்தப்படுகிறது. இந்த எண்ணைப் புதுப்பிக்க, உங்கள் புதிய எண்ணுக்கு " +
                        "அனுப்பப்பட்ட சரிபார்ப்புக் குறியீட்டை உள்ளிட்டு புதிய எண்ணைச் சரிபார்க்க வேண்டும். " +
                        "நீங்கள் தொடர விரும்பினால் புதுப்பிப்பைக் கிளிக் செய்க."
                }
            },
            notifications: {
                getProfileCompletion: {
                    error: {
                        description: "{{description}}",
                        message: "பிழை ஏற்பட்டுவிட்டது"
                    },
                    genericError: {
                        description: "சுயவிவர நிறைவு கணக்கிடும்போது பிழை ஏற்பட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது"
                    },
                    success: {
                        description: "சுயவிவர நிறைவு வெற்றிகரமாக கணக்கிடப்பட்டது",
                        message: "கணக்கீடு வெற்றிகரமாக"
                    }
                },
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
                getUserReadOnlyStatus: {
                    genericError: {
                        description: "பயனரின் படிக்க-மட்டும் நிலையை மீட்டெடுக்கும்போது தவறேற்பட்டுவிட்டது",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது !!!"
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
            },
            placeholders: {
                SCIMDisabled: {
                    heading: "இந்த அம்சம் உங்கள் கணக்கிற்கு கிடைக்கவில்லை"
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
                        description: "பயனர் சுயவிபரங்களைக் கொண்ட கோப்பு பதிவிறங்க தொடங்கிவிட்டது.",
                        message: "பயனர் சுயவிபர பதிவிறக்கம் ஆரம்பிக்கப்பட்டுவிட்டது"
                    }
                }
            }
        },
        userAvatar: {
            infoPopover: "இந்த படம் <1>Gravatar</1> சேவையிலிருந்து மீட்டெடுக்கப்பட்டது.",
            urlUpdateHeader: "உங்கள் சுயவிவரப் படத்தை அமைக்க பட URL ஐ உள்ளிடவும்"
        },
        userSessions: {
            browserAndOS: "{{os}} {{version}} இல் {{browser}}",
            dangerZones: {
                terminate: {
                    actionTitle: "நிறுத்துதல்",
                    header: "அமர்வை நிறுத்தவும்",
                    subheader: "குறிப்பிட்ட சாதனத்தில் நீங்கள் அமர்விலிருந்து வெளியேறுவீர்கள்."
                }
            },
            lastAccessed: "இறுதியாக அணுகியது {{date}}",
            modals: {
                terminateAllUserSessionsModal: {
                    heading: "உறுதிப்பாடு",
                    message:
                        "இச்செயல் இந்த கருவி மற்றும் சகல கருவிகளிலும் உள்ள உங்களுடைய அனைத்து IDP " +
                        "அமர்வுகளில் இருந்தும் உங்களை வெளியேற்றும். மேலும் தொடர விரும்புகின்றீர்களா?"
                },
                terminateUserSessionModal: {
                    heading: "உறுதிப்பாடு",
                    message:
                        "இச்செயல் குறிப்பிட்ட கருவியிலுள்ள IDP அமர்விலிருந்து உங்களை வெளியேற்றும்," +
                        " மேலும் தொடர விரும்புகின்றீர்களா?"
                }
            },
            notifications: {
                fetchSessions: {
                    error: {
                        description: "{{description}}",
                        message: "IDP அமர்வுகளை பெறும் பொழுது தவறேற்பட்டுவிட்டது."
                    },
                    genericError: {
                        description: "IDP அமர்வுகளை பெற இயலவில்லை",
                        message: "ஏதோ தவறேற்பட்டுவிட்டது."
                    },
                    success: {
                        description: "IDP அமர்வுகள் வெற்றிகரமாக பெறப்பட்டுவிட்டன.",
                        message: "IDP அமர்வுகள் பெறப்பட்டுவிட்டன"
                    }
                },
                terminateAllUserSessions: {
                    error: {
                        description: "{{description}}",
                        message: "IDP அமர்வுகளை முடிக்க இயலவில்லை"
                    },
                    genericError: {
                        description: "IDP அமர்வுகளை முடிக்கும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "IDP அமர்வுகளை முடிக்க இயலவில்லை"
                    },
                    success: {
                        description: "சகல IDP அமர்வுகளும் வெற்றிகரமாக முடிக்கப்பட்டுவிட்டன.",
                        message: "சகல IDP அமர்வுகளும் முடிக்கப்பட்டுவிட்டன"
                    }
                },
                terminateUserSession: {
                    error: {
                        description: "{{description}}",
                        message: "IDP அமர்வினை முடிக்க இயலவில்லை"
                    },
                    genericError: {
                        description: "IDP அமரவை முடிக்கும் பொழுது தவறேற்பட்டுவிட்டது",
                        message: "IDP அமர்வினை முடிக்க இயலவில்லை"
                    },
                    success: {
                        description: "IDP அமர்வு வெற்றிகரமாக முடிக்கப்பட்டுவிட்டது.",
                        message: "அமர்வு முடிக்கப்பட்டுவிட்டது"
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
                            content: "தேர்ந்தெடுக்கப்பட்ட மின்னஞ்சல் Gravatar இல் பதிவு செய்யப்படவில்லை போல் " +
                                "தெரிகிறது. Gravatar அதிகாரப்பூர்வ வலைத்தளத்தைப் பார்வையிடுவதன் மூலம் Gravatar " +
                                "கணக்கில் பதிவுபெறுக அல்லது பின்வருவனவற்றில் ஒன்றைப் பயன்படுத்தவும்.",
                            header: "பொருந்தக்கூடிய Gravatar படம் எதுவும் கிடைக்கவில்லை!"
                        }
                    },
                    heading: "Gravatarஐ அடிப்படையாகக் கொண்டது "
                },
                hostedAvatar: {
                    heading: "ஹோஸ்ட் செய்யப்பட்ட படம்",
                    input: {
                        errors: {
                            http: {
                                content: "தேர்ந்தெடுக்கப்பட்ட URL HTTP இல் வழங்கப்பட்ட பாதுகாப்பற்ற படத்தை " +
                                    "சுட்டிக்காட்டுகிறது. தயவுசெய்து எச்சரிக்கையுடன் தொடரவும்.",
                                header: "பாதுகாப்பற்ற உள்ளடக்கம்!"
                            },
                            invalid: {
                                content: "செல்லுபடியாகும் பட URL ஐ உள்ளிடவும்"
                            }
                        },
                        hint: "மூன்றாம் தரப்பு இடத்தில் ஹோஸ்ட் செய்யப்பட்ட செல்லுபடியாகும் பட URL ஐ உள்ளிடவும்.",
                        placeholder: "படத்திற்கான URL ஐ உள்ளிடவும்.",
                        warnings: {
                            dataURL: {
                                content: "பெரிய எழுத்துக்குறி எண்ணிக்கையுடன் தரவு URL களைப் பயன்படுத்துவது தரவுத்தள " +
                                    "சிக்கல்களை ஏற்படுத்தக்கூடும். எச்சரிக்கையுடன் தொடரவும்.",
                                header: "உள்ளிட்ட தரவு URL ஐ இருமுறை சரிபார்க்கவும்!"
                            }
                        }
                    }
                },
                systemGenAvatars: {
                    heading: "கணினி உருவாக்கிய அவதாரம்",
                    types: {
                        initials: "தொடக்கங்கள்"
                    }
                }
            },
            description: null,
            heading: "சுயவிவரப் படத்தைப் புதுப்பிக்கவும்",
            primaryButton: "சேமி",
            secondaryButton: "ரத்துசெய்"
        },
        sessionTimeoutModal: {
            description: "<1>திரும்பிச் செல்</1> ஐக் கிளிக் செய்யும்போது, அமர்வு இருந்தால் அதை மீட்டெடுக்க " +
                "முயற்சிப்போம். உங்களிடம் செயலில் அமர்வு இல்லையென்றால், நீங்கள் உள்நுழைவு பக்கத்திற்கு " +
                "திருப்பி விடப்படுவீர்கள்.",
            heading: "நீங்கள் நீண்ட காலமாக செயலற்ற நிலையில் இருப்பது போல் தெரிகிறது.",
            loginAgainButton: "மீண்டும் உள்நுழைக",
            primaryButton: "திரும்பிச் செல்லுங்கள்",
            secondaryButton: "வெளியேறு",
            sessionTimedOutDescription: "நீங்கள் நிறுத்திய இடத்திலிருந்து தொடர தயவுசெய்து மீண்டும் உள்நுழைக.",
            sessionTimedOutHeading: "செயலற்ற தன்மை காரணமாக பயனர் அமர்வு காலாவதியானது."
        }
    },
    pages: {
        applications: {
            subTitle: "உங்கள் பயன்பாடுகளைக் கண்டறிந்து அணுகவும்",
            title: "பயன்பாடுகள்"
        },
        overview: {
            subTitle: "உங்கள் தனிப்பட்ட தகவல், கணக்கு பாதுகாப்பு மற்றும் தனியுரிமை அமைப்புகளை நிர்வகிக்கவும்",
            title: "வருக, {{firstName}}"
        },
        personalInfo: {
            subTitle: "உங்கள் தனிப்பட்ட சுயவிவரத்தைத் திருத்தவும் அல்லது ஏற்றுமதி செய்யவும் மற்றும் இணைக்கப்பட்ட" +
                "கணக்குகளை நிர்வகிக்கவும்",
            title: "பயனர் விபரம்"
        },
        personalInfoWithoutExportProfile: {
            subTitle: "உங்கள் தனிப்பட்ட சுயவிவரத்தைத் திருத்தவும்",
            title: "பயனர் விபரம்"
        },
        personalInfoWithoutLinkedAccounts: {
            subTitle: "உங்கள் தனிப்பட்ட சுயவிவரத்தைத் திருத்தவும் அல்லது ஏற்றுமதி செய்யவும்",
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
                1: "பக்கத்தின் முகவரியினை சரி பாருங்கள் அல்லது கீழிருக்கும் பொத்தானை " +
                    "அழுத்தி முகப்புப் பக்கத்திற்குச் செல்லுங்கள்."
            },
            title: "பக்கம் காணப்படவில்லை"
        },
        accessDeniedError: {
            action: "முகப்பிற்கு திரும்பு",
            subtitles: {
                0: "இந்தப் பக்கத்தை அணுக உங்களுக்கு அனுமதி இல்லை என்று தெரிகிறது.",
                1: "வேறு கணக்கில் உள்நுழைய முயற்சிக்கவும்."
            },
            title: "அணுகல் வழங்கப்படவில்லை"
        },
        emptySearchResult: {
            action: "தேடல் கேள்வியினை அழி",
            subtitles: {
                0: "{{query}} இற்கான பெறுபேறுகள் எதுவுமில்லை",
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
        },
        sessionStorageDisabled: {
            subtitles: {
                0: "இந்த பயன்பாட்டைப் பயன்படுத்த, உங்கள் வலை உலாவி அமைப்புகளில் குக்கீகளை இயக்க வேண்டும்.",
                1: "குக்கீகளை எவ்வாறு இயக்குவது என்பது பற்றிய கூடுதல் தகவலுக்கு, உங்கள் இணைய உலாவியின் " +
                    "உதவி பகுதியைப் பார்க்கவும்."
            },
            title: "உங்கள் உலாவியில் குக்கீகள் முடக்கப்பட்டுள்ளன."
        }
    },
    sections: {
        accountRecovery: {
            description: "உங்கள் பயனர்பெயர் அல்லது கடவுச்சொல்லை மீட்டெடுக்க உங்களுக்கு உதவ நாங்கள் " +
                "பயன்படுத்தக்கூடிய மீட்பு தகவலை நிர்வகிக்கவும்",
            heading: "கணக்கு மீட்பு"
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
            description: "ஒவ்வொரு பயன்பாட்டிற்கும் நீங்கள் வழங்கிய சம்மதங்களை மதிப்பாய்வு செய்யவும். " +
                "மேலும், அவற்றில் ஒன்று அல்லது பலவற்றை நீங்கள் தேவைக்கேற்ப திரும்பப் பெறலாம்.",
            heading: "அனுமதியளிக்கப்பட்ட செயலிகள்",
            placeholders: {
                emptyConsentList: {
                    heading: "நீங்கள் எந்தவொரு செயலிற்கும் அனுமதி அளிக்கவில்லை."
                }
            }
        },
        createPassword: {
            actionTitles: {
                create: "கடவுச்சொல்லை உருவாக்கு"
            },
            description: "அஸ்கார்டியோவில் கடவுச்சொல்லை உருவாக்கவும். சமூக உள்நுழைவுக்கு கூடுதலாக அஸ்கார்டியோவில் " +
                "உள்நுழைய இந்த கடவுச்சொல்லைப் பயன்படுத்தலாம்.",
            heading: "கடவுச்சொல்லை உருவாக்கு"
        },
        federatedAssociations: {
            description: "இந்தக் கணக்குடன் இணைக்கப்பட்டுள்ள பிற அடையாள வழங்குநர்களிடமிருந்து வழங்கப்பட்ட " +
                "உங்கள் கணக்குகளைக் காண்க",
            heading: "வெளிப்புற உள்நுழைவுகள்"
        },
        linkedAccounts: {
            actionTitles: {
                add: "கணைக்கினை சேர்க்க"
            },
            description: "உங்களுடைய அனைத்து இணைக்கப்பட்ட கணக்குகளையும் முகாமை செய்ய",
            heading: "இணைக்கப்பட்ட கணக்குகள்"
        },
        mfa: {
            description: "அங்கீகாரத்தின் பல படிகளை உள்ளமைப்பதன் மூலம் உங்கள் கணக்கில் கூடுதல் பாதுகாப்பு " +
                "அடுக்கைச் சேர்க்கவும்.",
            heading: "பல காரணி உறுதிப்பாடு"
        },
        profile: {
            description: "உங்கள் அடிப்படை சுயவிபரத் தகவல்களை முகாமை செய்ய மற்றும் புதுப்பிக்க",
            heading: "சுயவிபரம்"
        },
        profileExport: {
            actionTitles: {
                export: "சுயவிவரத்தைப் பதிவிறக்கவும்"
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
            description: "செயற்பாட்டில் உள்ள உங்கள் அமர்வுகளை முகாமை செய்ய மற்றும் பார்க்க",
            heading: "செயற்பாட்டில் உள்ள அமர்வுகள்",
            placeholders: {
                emptySessionList: {
                    heading: "இந்த பயனரின் எந்தவொரு அமர்வும் செய்ற்பாட்டினில் இல்லை"
                }
            }
        }
    }
};

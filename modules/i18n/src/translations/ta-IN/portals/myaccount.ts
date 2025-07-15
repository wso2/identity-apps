/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { MyAccountNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const myAccount: MyAccountNS = {
    components: {
        accountRecovery: {
            SMSRecovery: {
                descriptions: {
                    add: "மீட்பு மொபைல் எண்ணைச் சேர்க்கவோ புதுப்பிக்கவோ செய்யவும்.",
                    emptyMobile: "SMS-OTP மீட்பு முனையில் மொபைல் எண்ணை உங்கள் உள்ளக அமைக்க வேண்டும்.",
                    update: "மீட்பு மொபைல் எண்ணை புதுப்பிக்கவும் ({{mobile}})",
                    view: "மீட்பு மொபைல் எண்ணைப் பார்க்க ({{mobile}})"
                },
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
                                label: "மொபைல் எண்",
                                placeholder: "மீட்பு மொபைல் எணை உள்ளிடவும்.",
                                validations: {
                                    empty: "மொபைல் எண் உள்ளிடவும்.",
                                    invalidFormat: "மொபைல் எண் சரியான வடிவம் இல்லை."
                                }
                            }
                        }
                    }
                },
                heading: "SMS மீட்பு",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "மீட்பு மொபைல் எணை புதுப்பித்தல் விசேட பிழை ஏற்பட்டது."
                        },
                        genericError: {
                            description: "மீட்பு மொபைல் எணை புதுப்பித்தல் செய்யும் போது பிழை ஏற்பட்டது",
                            message: "ஏதேனும் பிழை ஏற்பட்டுள்ளது"
                        },
                        success: {
                            description: "பயனர் சுயவிவரத்தில் உள்ள மொபைல் எண் வெற்றிகரமாக புதுப்பிக்கப்பட்டுள்ளது",
                            message: "மொபைல் எண் வெற்றிகரமாக புதுப்பிக்கப்பட்டுள்ளது"
                        }
                    }
                }
            },
            codeRecovery: {
                descriptions: {
                    add: "குறியீட்டு மீட்பு விருப்புகளை சேர்க்க மற்றும் புதுப்பிக்க"
                },
                heading: "குறியீட்டு மீட்பு"
            },
            emailRecovery: {
                descriptions: {
                    add: "மீட்பு மின்னஞ்சல் முகவரிய சேர்க்க",
                    emptyEmail: "மின்னஞ்சல் மீட்டெடுப்பைத் தொடர உங்கள் மின்னஞ்சல் முகவரியை உள்ளமைக்க வேண்டும்.",
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
                        invalidNewPassword: {
                            description: "கடவுச்சொல் தேவையான கட்டுப்பாடுகளை பூர்த்தி செய்யவில்லை.",
                            message: "தவறான கடவுச்சொல்"
                        },
                        passwordCaseRequirement: "குறைந்தபட்சம் {{minUpperCase}} பெரிய எழுத்து மற்றும் {{minLowerCase}} " +
                            "சிறிய ஆங்கில எழுத்துக்கள்",
                        passwordCharRequirement: "குறைந்தபட்சம் {{minSpecialChr}} சிறப்பு எழுத்து(கள்)",
                        passwordLengthRequirement: "{{min}} மற்றும் {{max}} எழுத்துகளுக்கு இடையில் இருக்க வேண்டும்",
                        passwordLowerCaseRequirement: "குறைந்தபட்சம் {{minLowerCase}} சிறிய எழுத்து(கள்)",
                        passwordNumRequirement: "குறைந்தது {{min}} எண்(கள்)",
                        passwordRepeatedChrRequirement: "க{{repeatedChr}}க்கு மேல் திரும்பத் திரும்ப வரும் எழுத்து(கள்)",
                        passwordUniqueChrRequirement: "குறைந்தபட்சம் {{uniqueChr}} தனிப்பட்ட எழுத்து(கள்)",
                        passwordUpperCaseRequirement: "குறைந்தபட்சம் {{minUpperCase}} பெரிய எழுத்து(கள்)",
                        submitError: {
                            description: "{{description}}",
                            message: "கடவுச்சொல் பிழையை மாற்றவும்"
                        },
                        submitSuccess: {
                            description: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது விட்டது",
                            message: "கடவுச்சொல்லை மீட்டலில் வெற்றி"
                        },
                        validationConfig: {
                            error: {
                                description: "{{description}}",
                                message: "மீட்டெடுப்பதில் பிழை"
                            },
                            genericError: {
                                description: "சரிபார்ப்பு உள்ளமைவு தரவை மீட்டெடுக்க முடியவில்லை.",
                                message: "ஏதோ தவறு நடைபெற்றிருக்கிறது"
                            }
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
            dropdown: {
                footer: {
                    cookiePolicy: "குக்கீக் கொள்கை",
                    privacyPolicy: "தனியுரிமை",
                    termsOfService: "சேவை விதிமுறைகள்"
                }
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
                addHint: "கட்டமைக்கவும்",
                configuredDescription: "இரண்டு காரணி அங்கீகாரத்திற்காக உங்கள் உள்ளமைக்கப்பட்ட " +
                    "அங்கீகார பயன்பாட்டிலிருந்து TOTP குறியீடுகளைப் பயன்படுத்தலாம். பயன்பாட்டிற்கான அணுகல் " +
                    "உங்களிடம் இல்லையென்றால், இங்கிருந்து ஒரு புதிய அங்கீகார பயன்பாட்டை அமைக்கலாம்",
                deleteHint: "அகற்று",
                description: "பயன்பாடுகளில் உள்நுழையும்போது இரண்டாவது காரணியாக " +
                    "நேர அடிப்படையிலான, ஒரு முறை கடவுக்குறியீடுகளை " +
                    "(TOTP என்றும் அழைக்கப்படுகிறது) பயன்படுத்த ஒரு அங்கீகார " +
                    "பயன்பாட்டைப் பயன்படுத்தி QR குறியீட்டை ஸ்கேன் செய்யுங்கள்.",
                enableHint: "TOTP அங்கீகாரத்தை இயக்கு/முடக்கு",
                heading: "TOTP அங்கீகாரி",
                hint: "காண்க",
                modals: {
                    delete : {
                        heading: "உறுதிப்படுத்தல்",
                        message: "இந்த செயல் உங்கள் சுயவிவரத்தில் சேர்க்கப்பட்ட QR குறியீட்டை அகற்றும். " +
                            "நீங்கள் தொடர விரும்புகிறீர்களா ?"
                    },
                    done: "வெற்றி! இப்போது இரண்டு காரணி உறுதிப்பாட்டிற்கு உங்கள் உறுதிப்பாட்டு செயலியை பயன்படுத்தலாம்",
                    heading: "அங்கீகரிப்பு பயன்பாட்டை அமைக்கவும்",
                    scan: {
                        additionNote: "உங்கள் சுயவிவரத்தில் QR குறியீடு வெற்றிகரமாகச் சேர்க்கப்பட்டது!",
                        authenticatorApps: "உறுதிப்பாட்டு செயலிகள்",
                        generate: "புதிய குறியீட்டை உருவாக்கவும்",
                        heading: "ஒரு உறுதிப்பாட்டு செயலியை பயன்படுத்தி இந்த QR குறியீட்டை பதிவு செய்யுங்கள்",
                        messageBody: "உறுதிப்பாட்டு செயலிகளின் பட்டியலை இங்கே காணலாம்.",
                        messageHeading: "உங்களிடம் உறுதிப்பாட்டு செயலி இல்லையா?",
                        regenerateConfirmLabel: "புதிய QR குறியீட்டை மீண்டும் உருவாக்குவதை உறுதிப்படுத்தவும் ",
                        regenerateWarning: {
                            extended: "புதிய QR குறியீட்டை மீண்டும் உருவாக்கும்போது, ​​அதை ஸ்கேன் செய்து, உங்கள் அங்கீகரிப்பு பயன்பாட்டை மீண்டும் அமைக்க வேண்டும். முந்தைய QR குறியீட்டைப் பயன்படுத்தி நீங்கள் உள்நுழைய முடியாது.",
                            generic: "புதிய QR குறியீட்டை மீண்டும் உருவாக்கும்போது, ​​அதை ஸ்கேன் செய்து, உங்கள் அங்கீகரிப்பு பயன்பாட்டை மீண்டும் அமைக்க வேண்டும். உங்கள் முந்தைய அமைவு இனி வேலை செய்யாது."
                        }
                    },
                    toolTip: "பயன்பாடு இல்லையா? <1>App Store</1> அல்லது <3>Google Play</3> " +
                        "இலிருந்து Google Authenticator போன்ற அங்கீகார பயன்பாட்டைப் பதிவிறக்கவும்",
                    verify: {
                        error: "சரிபார்ப்பு தோல்வியுற்றது. தயவு செய்து மீண்டும் முயற்சிக்கவும்.",
                        heading: "சரிபார்ப்பிற்காக உருவாக்கப்பட்ட குறியீட்டை உள்ளிடவும்",
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
                    deleteSuccess: {
                        genericMessage: "வெற்றிகரமாக அகற்றப்பட்டது",
                        message: "TOTP உள்ளமைவு வெற்றிகரமாக அகற்றப்பட்டது."
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
                },
                regenerate: "மீண்டும் உருவாக்கு"
            },
            backupCode: {
                actions: {
                    add: "காப்பு குறியீடுகளைச் சேர்க்கவும்",
                    delete: "காப்பு குறியீடுகளை அகற்று"
                },
                description: "பல காரணி அங்கீகாரக் குறியீடுகளைப் பெற முடியாத பட்சத்தில் உங்கள் கணக்கை அணுக காப்புப் பிரதிக் குறியீடுகளைப் " +
                    "பயன்படுத்தவும். தேவைப்பட்டால் புதிய குறியீடுகளை மீண்டும் உருவாக்கலாம்.",
                download: {
                    heading: "உங்கள் காப்புக் குறியீடுகளைச் சேமிக்கவும்.",
                    info1: "நீங்கள் ஒவ்வொரு காப்புக் குறியீட்டையும் ஒரு முறை மட்டுமே பயன்படுத்த முடியும்.",
                    info2: "இந்த குறியீடுகள் உருவாக்கப்பட்டன ",
                    subHeading: "உங்கள் ஃபோனில் இருந்து விலகி இருக்கும்போது Asgardeo இல் உள்நுழைய, " +
                        "இந்தக் காப்புப் பிரதிக் குறியீடுகளைப் பயன்படுத்தலாம். இந்த காப்பு குறியீடுகளை எங்காவது " +
                        "பாதுகாப்பாக ஆனால் அணுகக்கூடிய இடத்தில் வைத்திருங்கள்."
                },
                heading: "காப்பு குறியீடுகள்",
                messages: {
                    disabledMessage: "காப்புப் பிரதி குறியீடுகளை இயக்க குறைந்தபட்சம் ஒரு கூடுதல் அங்கீகாரம் உள்ளமைக்கப்பட வேண்டும்."
                },
                modals: {
                    actions: {
                        copied: "நகலெடுக்கப்பட்டது",
                        copy: "குறியீடுகளை நகலெடுக்கவும்",
                        download: "குறியீடுகளைப் பதிவிறக்கவும்",
                        regenerate: "மீண்டும் உருவாக்கு"
                    },
                    delete: {
                        description: "இந்தச் செயலானது காப்புப் பிரதிக் குறியீடுகளை அகற்றி, அவற்றை இனி உங்களால் பயன்படுத்த முடியாது. " +
                            "நீங்கள் தொடர விரும்புகிறீர்களா?",
                        heading: "உறுதிப்படுத்தல்"
                    },
                    description: "நீங்கள் உங்கள் ஃபோனில் இல்லாதபோது உள்நுழைய, காப்புப் பிரதிக் " +
                    "குறியீடுகளைப் பயன்படுத்தவும். அவை அனைத்தும் பயன்படுத்தப்படும்போது நீங்கள் மேலும் உருவாக்கலாம்",
                    generate: {
                        description: "உங்கள் காப்புப் பிரதி குறியீடுகள் அனைத்தும் பயன்படுத்தப்படுகின்றன. " +
                        "காப்பு குறியீடுகளின் புதிய தொகுப்பை உருவாக்குவோம்",
                        heading: "உருவாக்கு"
                    },
                    heading: "காப்பு குறியீடுகள்",
                    info: "ஒவ்வொரு குறியீட்டையும் ஒரு முறை மட்டுமே பயன்படுத்த முடியும்",
                    regenerate: {
                        description: "புதிய குறியீடுகளை உருவாக்கிய பிறகு, உங்கள் பழைய குறியீடுகள் இயங்காது. "
                            + "புதிய குறியீடுகள் உருவாக்கப்பட்டவுடன் அவற்றைச் சேமிக்க மறக்காதீர்கள்.",
                        heading: "உறுதிப்படுத்தல்"
                    },
                    subHeading: "உள்நுழைய நீங்கள் பயன்படுத்தக்கூடிய ஒரு முறை கடவுக்குறியீடுகள்",
                    warn: "இந்த குறியீடுகள் ஒருமுறை மட்டுமே தோன்றும். இப்போது அவற்றைச் சேமித்து, "
                        + "பாதுகாப்பான ஆனால் அணுகக்கூடிய இடத்தில் சேமிக்கவும்."
                },
                mutedHeader: "மீட்பு விருப்பங்கள்",
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
                    deleteSuccess: {
                        genericMessage: "வெற்றிகரமாக அகற்றப்பட்டது",
                        message: "காப்புப் பிரதி குறியீடுகள் வெற்றிகரமாக அகற்றப்பட்டன."
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
                },
                remaining: "மீதமுள்ள"
            },
            fido: {
                description: "உங்கள் கணக்கில் உள்நுழைய, உங்கள் சாதனத்தில் <1>பாஸ் விசை</1>, " +
                    "<1>FIDO பாதுகாப்பு விசை</1> அல்லது <1>பயோமெட்ரிக்ஸைப்</1> பயன்படுத்தலாம்.",
                form: {
                    label: "பாஸ்கி",
                    placeholder: "பாஸ்கி பெயரை உள்ளிடவும்",
                    remove: "பாஸ்கி அகற்றவும்",
                    required: "உங்கள் பாஸ்கி பெயரை உள்ளிடவும்"
                },
                heading: "பாஸ்கி",
                modals: {
                    deleteConfirmation: {
                        assertionHint: "உங்கள் செயலை உறுதிப்படுத்தவும்.",
                        content: "இந்தச் செயல் மீள முடியாதது மற்றும் பாஸ்கி நிரந்தரமாக நீக்கப்படும்.",
                        description: "இந்த பாஸ்கிகை " +
                            "நீக்கினால், உங்கள் கணக்கில் மீண்டும் உள்நுழைய " +
                            "முடியாமல் போகலாம். எச்சரிக்கையுடன் தொடரவும்.",
                        heading: "நீ சொல்வது உறுதியா?"
                    },
                    deviceRegistrationErrorModal: {
                        description: "பாஸ்கி பதிவு தடைபட்டது. இது வேண்டுமென்றே " +
                            "செய்யப்படவில்லை என்றால், நீங்கள் அதே ஓட்டத்தை " +
                            "மீண்டும் முயற்சிக்கலாம்.",
                        heading: "பாஸ்கி பதிவு தோல்வியடைந்தது",
                        tryWithOlderDevice: "பழைய பாஸ்கி மூலம் மீண்டும் முயற்சி செய்யலாம்."
                    }
                },
                noPassKeyMessage: "நீங்கள் இன்னும் எந்த பாஸ்கீஸ்-ஐயும் பதிவு செய்யவில்லை.",
                notifications: {
                    removeDevice: {
                        error: {
                            description: "{{description}}",
                            message: "பாஸ்கிகை அகற்றும்போது பிழை ஏற்பட்டது"
                        },
                        genericError: {
                            description: "பாஸ்கிகை அகற்றும்போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        success: {
                            description: "பட்டியலிலிருந்து பாஸ்கி வெற்றிகரமாக அகற்றப்பட்டது",
                            message: "உங்கள் பாஸ்கி வெற்றிகரமாக அகற்றப்பட்டது"
                        }
                    },
                    startFidoFlow: {
                        error: {
                            description: "{{description}}",
                            message: "பாஸ்கிகை மீட்டெடுப்பதில் பிழை ஏற்பட்டது"
                        },
                        genericError: {
                            description: "பாஸ்கிகை மீட்டெடுப்பதில் பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        success: {
                            description: "பாஸ்கி வெற்றிகரமாக பதிவுசெய்யப்பட்டது, " +
                                "இப்போது நீங்கள் அங்கீகாரத்திற்காக அதைப் பயன்படுத்தலாம்.",
                            message: "உங்கள் பாஸ்கி பதிவுசெய்யப்பட்டது"
                        }
                    },
                    updateDeviceName: {
                        error: {
                            description: "{{description}}",
                            message: "பாஸ்கி பெயரைப் புதுப்பிக்கும்போது பிழை ஏற்பட்டது"
                        },
                        genericError: {
                            description: "பாஸ்கி பெயரைப் புதுப்பிக்கும்போது பிழை ஏற்பட்டது",
                            message: "ஏதோ தவறு நடந்துவிட்டது"
                        },
                        success: {
                            description: "உங்கள் பாஸ்கி பெயர் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",
                            message: "பாஸ்கி பெயர் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது"
                        }
                    }
                },
                tryButton: "பழைய பாஸ்கி மூலம் முயற்சிக்கவும்"
            },
            "pushAuthenticatorApp": {
                "addHint": "அமைக்க",
                "configuredDescription": "இரு காரணி அங்கீகாரத்திற்கு, உங்கள் அமைக்கப்பட்ட push authenticator செயலியில் இருந்து உருவாக்கப்படும் உள்நுழைவு கோரிக்கைகளை பயன்படுத்தலாம். செயலிக்கு அணுகல் இல்லை என்றால், இங்கே புதிய authenticator செயலியை அமைக்கலாம்.",
                "deleteHint": "அகற்று",
                "description": "Push authenticator செயலியை பயன்படுத்தி உள்நுழைவு கோரிக்கைகளை push அறிவிப்புகளாகப் பெறலாம், இது இரு காரணி அங்கீகாரத்திற்கு உதவும்.",
                "heading": "Push Authenticator",
                "hint": "பார்க்க",
                "modals": {
                    "deviceDeleteConfirmation": {
                        "assertionHint": "உங்கள் நடவடிக்கையை உறுதிசெய்யவும்.",
                        "content": "இந்த நடவடிக்கை மாற்ற முடியாதது மற்றும் சாதனத்தை நிரந்தரமாக அகற்றும்.",
                        "description": "இந்த சாதனத்தை நீக்கினால், நீங்கள் உங்கள் கணக்கில் மீண்டும் உள்நுழைய முடியாதிருக்கும். தயவுசெய்து கவனமாக தொடரவும்.",
                        "heading": "உங்களுக்கு நிச்சயமா?"
                    },
                    "scan": {
                        "additionNote": "QR குறியீடு வெற்றிகரமாக உங்கள் சுயவிவரத்தில் சேர்க்கப்பட்டது!",
                        "done": "வெற்றி! இப்போது உங்கள் Push Authenticator செயலியை இரு காரணி அங்கீகாரத்திற்கு பயன்படுத்தலாம்.",
                        "heading": "Push Authenticator செயலியை அமைக்கவும்",
                        "messageBody": "கிடைக்கக்கூடிய Authenticator செயலிகளின் பட்டியலை இங்கே காணலாம்.",
                        "subHeading": "Push authenticator செயலியை பயன்படுத்தி கீழே உள்ள QR குறியீட்டைப் பரிசீலிக்கவும்"
                    }
                },
                "notifications": {
                    "delete": {
                        "error": {
                            "description": "{{error}}",
                            "message": "ஏதோ தவறு ஏற்பட்டது"
                        },
                        "genericError": {
                            "description": "பதிவுசெய்யப்பட்ட சாதனத்தை அகற்றும் போது பிழை ஏற்பட்டது",
                            "message": "ஏதோ தவறு ஏற்பட்டது"
                        },
                        "success": {
                            "description": "பதிவுசெய்யப்பட்ட சாதனம் வெற்றிகரமாக அகற்றப்பட்டது",
                            "message": "சாதனம் வெற்றிகரமாக அகற்றப்பட்டது"
                        }
                    },
                    "deviceListFetchError": {
                        "error": {
                            "description": "Push authentication க்கான பதிவுசெய்யப்பட்ட சாதனங்களை பெறும்போது பிழை ஏற்பட்டது",
                            "message": "ஏதோ தவறு ஏற்பட்டது"
                        }
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "ஏதோ தவறு ஏற்பட்டது"
                        },
                        "genericError": {
                            "description": "QR குறியீட்டை பெறும்போது பிழை ஏற்பட்டது",
                            "message": "ஏதோ தவறு ஏற்பட்டது"
                        }
                    }
                }
            },
            smsOtp: {
                descriptions: {
                    hint: "நீங்கள் உறுதிப்படுத்தும் குறியீட்டினை குறுஞ் செய்தியினூடாக பெறுவீர்கள்"
                },
                heading: "Mobile number",
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
            verificationSent: {
                heading: "சரிபார்ப்புக்காக உங்கள் மொபைல் எண்ணுக்கு ஒரு OTP ஐப் பெறுவீர்கள்"
            },
            verifySmsOtp: {
                didNotReceive: "குறியீட்டைப் பெறவில்லையா?",
                error: "சரிபார்ப்பு தோல்வியுற்றது. தயவுசெய்து மீண்டும் முயற்சி செய்க.",
                heading: "உங்கள் மொபைல் எண்ணை சரிபார்க்கவும்",
                label: "உங்கள் மொபைல் எண்ணுக்கு அனுப்பப்பட்ட சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்",
                placeholder: "உங்கள் சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்",
                requiredError: "சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்",
                resend: "மீண்டும் அனுப்பு"
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
                    description: "உங்கள் சுயவிவரத்தை நிர்வகிக்கவும்",
                    header: "உங்கள் {{productName}} சுயவிவரம்",
                    profileText: "உங்கள் தனிப்பட்ட சுயவிவரத்தின் விவரங்கள்",
                    readOnlyDescription: "உங்கள் சுயவிவரத்தைப் பார்க்கவும்",
                    userSourceText: "(உடன் கையொப்பமிடப்பட்டுள்ளது {{source}})"
                }
            }
        },
        profile: {
            actions: {
                "deleteEmail": "மின்னஞ்சல் முகவரியை நீக்கு",
                "deleteMobile": "மொபைலை நீக்கு",
                "verifyEmail": "மின்னஞ்சல் முகவரியை சரிபார்க்கவும்",
                "verifyMobile": "மொபைலை சரிபார்க்கவும்"
            },
            fields: {
                "Account Confirmed Time": "கணக்கு உறுதிப்படுத்தப்பட்ட நேரம்",
                "Account Disabled": "கணக்கு முடக்கப்பட்டது",
                "Account Locked": "கணக்கு பூட்டப்பட்டுள்ளது",
                "Account State": "கணக்கு நிலை",
                "Active": "செயலில்",
                "Address - Street": "முகவரி - தெரு",
                "Ask Password": "கடவுச்சொல்லைக் கேளுங்கள்",
                "Backup Code Enabled": "காப்பு குறியீடு இயக்கப்பட்டது",
                "Backup Codes": "காப்பு குறியீடுகள்",
                "Birth Date": "பிறந்த தேதி",
                "Country": "நாடு",
                "Created Time": "நேரம் உருவாக்கப்பட்டது",
                "Disable EmailOTP": "Erimalotp ஐ முடக்கு",
                "Disable SMSOTP": "SMSOTP ஐ முடக்கு",
                "Display Name": "காட்சி பெயர்",
                "Email": "மின்னஞ்சல்",
                "Email Addresses": "மின்னஞ்சல் முகவரிகள்",
                "Email Verified": "மின்னஞ்சல் சரிபார்க்கப்பட்டது",
                "Enabled Authenticators": "இயக்கப்பட்ட அங்கீகாரங்கள்",
                "Existing Lite User": "இருக்கும் லைட் பயனர்",
                "External ID": "வெளிப்புற ஐடி",
                "Failed Attempts Before Success": "வெற்றிக்கு முன் தோல்வியுற்ற முயற்சிகள்",
                "Failed Backup Code Attempts": "தோல்வியுற்ற காப்பு குறியீடு முயற்சிகள்",
                "Failed Email OTP Attempts": "தோல்வியுற்ற மின்னஞ்சல் OTP முயற்சிகள்",
                "Failed Lockout Count": "கதவடைப்பு எண்ணிக்கை தோல்வியுற்றது",
                "Failed Login Attempts": "தோல்வியுற்ற உள்நுழைவு முயற்சிகள்",
                "Failed Password Recovery Attempts": "கடவுச்சொல் மீட்பு முயற்சிகள் தோல்வியுற்றன",
                "Failed SMS OTP Attempts": "தோல்வியுற்ற SMS OTP முயற்சிகள்",
                "Failed TOTP Attempts": "தோல்வியுற்ற TOTP முயற்சிகள்",
                "First Name": "முதல் பெயர்",
                "Force Password Reset": "கடவுச்சொல் மீட்டமைப்பை கட்டாயப்படுத்துங்கள்",
                "Full Name": "Full பெயர்",
                "Gender": "பாலினம்",
                "Groups": "குழுக்கள்",
                "Identity Provider Type": "அடையாள வழங்குநர் வகை",
                "Last Logon": "கடைசி உள்நுழைவு",
                "Last Modified Time": "கடைசி மாற்றியமைக்கப்பட்ட நேரம்",
                "Last Name": "கடைசி பெயர்",
                "Last Password Update": "கடைசி கடவுச்சொல் புதுப்பிப்பு",
                "Lite User": "லைட் பயனர்",
                "Lite User ID": "லைட் பயனர் ஐடி",
                "Local": "உள்ளூர்",
                "Local Credential Exists": "உள்ளூர் நற்சான்றிதழ் உள்ளது",
                "Locality": "இடம்",
                "Location": "இடம்",
                "Locked Reason": "பூட்டப்பட்ட காரணம்",
                "Manager - Name": "மேலாளர் - பெயர்",
                "Middle Name": "நடுத்தர பெயர்",
                "Mobile": "கைபேசி",
                "Mobile Numbers": "மொபைல் எண்கள்",
                "Nick Name": "நிக் பெயர்",
                "Phone Verified": "தொலைபேசி சரிபார்க்கப்பட்டது",
                "Photo - Thumbnail": "புகைப்படம் - சிறுபடம்",
                "Photo URL": "புகைப்பட URL",
                "Postal Code": "அஞ்சல் குறியீடு",
                "Preferred Channel": "விருப்பமான சேனல்",
                "Read Only User": "பயனரை மட்டும் படியுங்கள்",
                "Region": "பகுதி",
                "Resource Type": "வள வகை",
                "Roles": "பாத்திரங்கள்",
                "Secret Key": "ரகசிய விசை",
                "TOTP Enabled": "TOTP இயக்கப்பட்டது",
                "Time Zone": "நேரம் மண்டலம்",
                "URL": "url",
                "Unlock Time": "நேரத்தை திறக்கவும்",
                "User Account Type": "பயனர் கணக்கு வகை",
                "User ID": "பயனர் ஐடி",
                "User Metadata - Version": "பயனர் மெட்டாடேட்டா - பதிப்பு",
                "User Source": "பயனர் ஆதாரம்",
                "User Source ID": "பயனர் மூல ஐடி",
                "Username": "பயனர்பெயர்",
                "Verification Pending Email": "சரிபார்ப்பு நிலுவையில் உள்ளது",
                "Verification Pending Mobile Number": "சரிபார்ப்பு மொபைல் எண் நிலுவையில் உள்ளது",
                "Verified Email Addresses": "சரிபார்க்கப்பட்ட மின்னஞ்சல் முகவரிகள்",
                "Verified Mobile Numbers": "சரிபார்க்கப்பட்ட மொபைல் எண்கள்",
                "Verify Email": "மின்னஞ்சலை உறுதிசெய்யுங்கள்",
                "Verify Mobile": "மொபைலை சரிபார்க்கவும்",
                "Verify Secret Key": "ரகசிய விசையை சரிபார்க்கவும்",
                "Website URL": "வலைத்தள URL",
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
                                futureDateError: "{{field}} புலத்திற்கு நீங்கள் உள்ளிட்ட தேதி தவறானது.",
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
            modals: {
                customMultiAttributeDeleteConfirmation: {
                    assertionHint: "தயவுசெய்து உங்கள் செயலை உறுதிப்படுத்தவும்.",
                    content: "இந்த செயல் திரும்பப் பெற முடியாதது மற்றும் தேர்ந்தெடுக்கப்பட்ட மதிப்பை நிரந்தரமாக நீக்கும்.",
                    description: "நீங்கள் தேர்ந்தெடுத்த இந்த மதிப்பை நீக்கினால், அது உங்கள் சுயவிவரத்திலிருந்து நிரந்தரமாக நீக்கப்படும்.",
                    heading: "நீ சொல்வது உறுதியா?"
                },
                emailAddressDeleteConfirmation: {
                    assertionHint: "தயவுசெய்து உங்கள் செயலை உறுதிப்படுத்தவும்.",
                    content: "இந்த நடவடிக்கை மீளமுடியாதது மற்றும் மின்னஞ்சல் முகவரியை நிரந்தரமாக நீக்கும்.",
                    description: "இந்த மின்னஞ்சல் முகவரியை நீங்கள் நீக்கினால், அது உங்கள் சுயவிவரத்திலிருந்து நிரந்தரமாக அகற்றப்படும்.",
                    heading: "நீ சொல்வது உறுதியா?"
                },
                mobileNumberDeleteConfirmation: {
                    assertionHint: "தயவுசெய்து உங்கள் செயலை உறுதிப்படுத்தவும்.",
                    content: "இந்த நடவடிக்கை மீளமுடியாதது மற்றும் மொபைல் எண்ணை நிரந்தரமாக நீக்கும்.",
                    description: "இந்த மொபைல் எண்ணை நீங்கள் நீக்கினால், அது உங்கள் சுயவிவரத்திலிருந்து நிரந்தரமாக அகற்றப்படும்.",
                    heading: "நீ சொல்வது உறுதியா?"
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
                },
                verifyEmail: {
                    error: {
                        description: "{{description}}",
                        message: "சரிபார்ப்பு மின்னஞ்சலை அனுப்பும்போது பிழை ஏற்பட்டது"
                    },
                    genericError: {
                        description: "சரிபார்ப்பு மின்னஞ்சலை அனுப்பும்போது பிழை ஏற்பட்டது",
                        message: "ஏதோ தவறு நடந்துவிட்டது"
                    },
                    success: {
                        description: "சரிபார்ப்பு மின்னஞ்சல் வெற்றிகரமாக அனுப்பப்பட்டது. தயவுசெய்து உங்கள் இன்பாக்ஸைச் சரிபார்க்கவும்",
                        message: "சரிபார்ப்பு மின்னஞ்சல் வெற்றிகரமாக அனுப்பப்பட்டது"
                    }
                },
                verifyMobile: {
                    error: {
                        description: "{{description}}",
                        message: "சரிபார்ப்புக் குறியீட்டை அனுப்பும்போது பிழை ஏற்பட்டது"
                    },
                    genericError: {
                        description: "சரிபார்ப்புக் குறியீட்டை அனுப்பும்போது பிழை ஏற்பட்டது",
                        message: "ஏதோ தவறு நடந்துவிட்டது"
                    },
                    success: {
                        description: "சரிபார்ப்புக் குறியீடு வெற்றிகரமாக அனுப்பப்பட்டது. தயவுசெய்து உங்கள் மொபைலை சரிபார்க்கவும்",
                        message: "சரிபார்ப்பு குறியீடு வெற்றிகரமாக அனுப்பப்பட்டது"
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
        selfSignUp: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}.",
                        message: "சுய பதிவு விருப்பத்தைப் பெறுவதில் பிழை"
                    },
                    genericError: {
                        description: "சுய பதிவு விருப்பத்தைப் பெறும்போது பிழை ஏற்பட்டது.",
                        message: "ஏதோ தவறு நடந்துவிட்டது"
                    },
                    success: {
                        description: "சுய பதிவு விருப்பம் வெற்றிகரமாகப் பெறப்பட்டது.",
                        message: "சுய பதிவு விருப்பம் பெறுதல் வெற்றிகரமானது"
                    }
                }
            }
        },
        systemNotificationAlert: {
            resend: "மீண்டும் அனுப்பு",
            selfSignUp: {
                awaitingAccountConfirmation: "உங்கள் கணக்கு இன்னும் செயலில் இல்லை. உங்கள் பதிவு செய்யப்பட்ட " +
                    "மின்னஞ்சல் முகவரிக்குச் செயல்படுத்தும் இணைப்பை அனுப்பியுள்ளோம். புதிய இணைப்பு தேவையா?",
                notifications: {
                    resendError: {
                        description: "கணக்கு உறுதிப்படுத்தல் மின்னஞ்சலை மீண்டும் அனுப்பும்போது பிழை ஏற்பட்டது.",
                        message: "ஏதோ தவறு நடந்துவிட்டது"
                    },
                    resendSuccess: {
                        description: "கணக்கு உறுதிப்படுத்தல் மின்னஞ்சல் வெற்றிகரமாக மீண்டும் அனுப்பப்பட்டது.",
                        message: "கணக்கு உறுதிப்படுத்தல் மின்னஞ்சல் மீண்டும் அனுப்புதல் வெற்றிகரமானது"
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
                terminateActiveUserSessionModal: {
                    heading: "தற்போதைய செயலில் உள்ள அமர்வுகளை நிறுத்தவும்",
                    message:
                        "இரண்டாவது காரணி அங்கீகாரம் (2FA) விருப்ப மாற்றங்கள் உங்கள் செயலில் உள்ள அமர்வுகளுக்குப் பயன்படுத்தப்படாது. " +
                        "அவற்றை நிறுத்துமாறு பரிந்துரைக்கிறோம்.",
                    primaryAction: "அனைத்தையும் நிறுத்து",
                    secondaryAction: "மதிப்பாய்வு செய்து முடிக்கவும்"

                },
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
        },
        verificationOnUpdate: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "புதுப்பிப்பு விருப்பத்தேர்வில் சரிபார்ப்பைப் பெறுவதில் பிழை"
                    },
                    genericError: {
                        description: "புதுப்பிப்பு விருப்பத்தேர்வில் சரிபார்ப்பைப் பெறுவதில் பிழை ஏற்பட்டது",
                        message: "ஏதோ தவறு நடந்துவிட்டது"
                    },
                    success: {
                        description: "புதுப்பிப்பு விருப்பத்தேர்வில் சரிபார்ப்பு வெற்றிகரமாக மீட்டெடுக்கப்பட்டது",
                        message: "புதுப்பிப்பு விருப்பத்தேர்வு மீட்டெடுப்பின் சரிபார்ப்பு வெற்றிகரமாக உள்ளது"
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
                                "தெரிகிறது. Gravatar அதிகாரப்பூர்வ வலைத்தளத்தைப் பார்வையிடுவதன் <1>மூலம் Gravatar</1> " +
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
        readOnlyProfileBanner: "இந்த போர்ட்டலில் இருந்து உங்கள் சுயவிவரத்தை மாற்ற முடியாது. " +
            "மேலும் விவரங்களுக்கு உங்கள் நிர்வாகியைத் தொடர்பு கொள்ளவும்.",
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
            description: "உங்கள் கடவுச்சொல்லை மீட்டெடுக்க உதவ நாங்கள் பயன்படுத்தக்கூடிய மீட்பு தகவல்களை நிர்வகிக்கவும்",
            emptyPlaceholderText: "கணக்கு மீட்பு விருப்பங்கள் எதுவும் கிடைக்கவில்லை",
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
            description: "இந்தக் கணக்குடன் இணைக்கப்பட்டுள்ள பிற இணைப்புகளிலிருந்து உங்கள் கணக்குகளைப் பார்க்கவும்",
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
                "தனிப்பட்ட தரவு மற்றும் இணைக்கப்பட்ட கணக்குகள் உட்பட உங்களின் எல்லா சுயவிவரத் தரவையும் பதிவிறக்கம் செய்ய.",
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

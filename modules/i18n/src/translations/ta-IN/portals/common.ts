/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { CommonNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
export const common: CommonNS = {
    access: "அணுகல்",
    actions: "செயல்கள்",
    activate: "செயல்படுத்த",
    active: "செயல்பாட்டில் உள்ள",
    add: "சேர்",
    addKey: "ரகசியத்தைச் சேர்க்கவும்",
    addURL: "URL ஐச் சேர்க்கவும்",
    all: "அனைத்தும்",
    applicationName: "செயலியின் பெயர்",
    applications: "செயலிகள்",
    approvalStatus: "அனுமதி நிலை",
    approvals: "அனுமதிகள்",
    approvalsPage: {
        list: {
            columns: {
                actions: "செயல்கள்",
                name: "பெயர்"
            }
        },
        modals: {
            description: "உங்கள் அங்கீகாரத்தைத் தேவைப்படும் செயல்பாட்டு பணிகளைப் பரிசீலிக்கவும்",
            header: "அனுமதிகள்",
            subHeader: "உங்கள் அங்கீகாரத்தைத் தேவைப்படும் செயல்பாட்டு பணிகளைப் பரிசீலிக்கவும்"
        },
        notifications: {
            fetchApprovalDetails: {
                error: {
                    description: "{{description}}",
                    message: "அனுமதி விவரங்களைப் பெறுவதில் பிழை"
                },
                genericError: {
                    description: "அனுமதி விவரங்களைப் பெற முடியவில்லை.",
                    message: "ஏதோ தவறு நடந்துவிட்டது"
                }
            },
            fetchPendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "பொறுத்து அனுமதிகளைப் பெறுவதில் பிழை"
                },
                genericError: {
                    description: "பொறுத்து அனுமதிகளைப் பெற முடியவில்லை.",
                    message: "ஏதோ தவறு நடந்துவிட்டது"
                }
            },
            updatePendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "அனுமதியைப் புதுப்பிப்பதில் பிழை"
                },
                genericError: {
                    description: "பொறுத்து அனுமதியைப் புதுப்பிக்க முடியவில்லை.",
                    message: "ஏதோ தவறு நடந்துவிட்டது"
                },
                success: {
                    description: "அனுமதியை வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
                    message: "புதுப்பிப்பு வெற்றிகரமாக"
                }
            }
        },
        placeholders: {
            emptyApprovalFilter: {
                action: "அனைத்தையும் காண்க",
                subtitles: {
                    0: "தற்காலிகமாக {{status}} நிலைமையில் எந்த அனுமதிகளும் இல்லை.",
                    1: "தயவுசெய்து {{status}} நிலைமையில் உங்களிடம் எந்த பணிகளும் உள்ளதா என்பதை சரிபார்க்கவும்",
                    2: "அவற்றைப் இங்கே காண்க."
                },
                title: "முடிவுகள் எதுவும் கிடைக்கவில்லை"
            },
            emptyApprovalList: {
                action: "",
                subtitles: {
                    0: "தற்காலிகமாக மதிப்பீடு செய்ய எந்த அனுமதிகளும் இல்லை.",
                    1: "தயவுசெய்து அமைப்பில் செயல்பாடுகளை கட்டுப்படுத்த ஒரு வேலைப்பதிவு சேர்த்துள்ளீர்களா என்பதை சரிபார்க்கவும்.",
                    2: ""
                },
                title: "அனுமதிகள் இல்லை"
            },
            emptySearchResults: {
                action: "அனைத்தையும் காண்க",
                subtitles: {
                    0: "நீங்கள் தேடிய வேலைப்பதிவு கிடைக்கவில்லை.",
                    1: "தயவுசெய்து அந்த பெயருடன் உங்களிடம் ஒரு வேலைப்பதிவு உள்ளதா என்பதை சரிபார்க்கவும்",
                    2: "அமைப்பில்."
                },
                title: "அனுமதிகள் இல்லை"
            },
            searchApprovals: "வேலைப்பதிவு பெயரால் தேடு"
        },
        propertyMessages: {
            assignedUsersDeleted: "ஒதுக்கப்பட்ட பயனர்/கள் நீக்கப்பட்டுள்ளன.",
            roleDeleted: "இந்த பங்கு நீக்கப்பட்டுள்ளது.",
            selfRegistration: "சுய பதிவு",
            unassignedUsersDeleted: "ஒதுக்கப்படாத பயனர்/கள் நீக்கப்பட்டுள்ளன."
        },
        subTitle: "உங்கள் அங்கீகாரத்தைத் தேவைப்படும் செயல்பாட்டு பணிகளைப் பரிசீலிக்கவும்",
        title: "அனுமதிகள்"
    },

    approve: "அனுமதி",
    approved: "அனுமதிக்கப்பட்டது",
    apps: "செயலிகள்",
    assignee: "ஒதுக்கப்பட்டவர்",
    assignees: "அளிக்கப்பட்டவர்கள்",
    asyncOperationErrorMessage: {
        description: "ஏதோ தவறாகிவிட்டது.",
        message: "எதிர்பாராத பிழை ஏற்பட்டது. பின்னர் மீண்டும் சரிபார்க்கவும்."
    },
    authentication: "அங்கீகார",
    authenticator: "அங்கீகார",
    authenticator_plural: "அங்கீகாரிகள்",
    back: "மீண்டும்",
    beta: "பீட்டா",
    browser: "உலாவி",
    cancel: "இரத்து செய்",
    challengeQuestionNumber: "சவால் வினா {{number}}",
    change: "மாற்று",
    chunkLoadErrorMessage: {
        description: "கோரப்பட்ட பயன்பாட்டிற்கு சேவை செய்யும் போது பிழை ஏற்பட்டது. பயன்பாட்டை மீண்டும் " +
            "ஏற்ற முயற்சிக்கவும்.",
        heading: "ஏதோ தவறு நடந்துவிட்டது",
        primaryActionText: "பயன்பாட்டை மீண்டும் ஏற்றவும்"
    },
    claim: "கோர்",
    clear: "அழிக்கவும்",
    clientId: "வாடிக்கையாளர் அடையாளம்",
    close: "நெருக்கமான",
    comingSoon: "விரைவில்",
    completed: "பூரணப்படுத்தப்பட்டவை",
    configure: "கட்டமை",
    confirm: "உறுதிப்படுத்தவும்",
    contains: "கொண்டுள்ளது",
    continue: "தொடர்",
    copyToClipboard: "கிளிப்போர்டுக்கு நகலெடு",
    create: "உருவாக்கு",
    createdOn: "உருவாக்கப்பட்ட தினம்",
    dangerZone: "ஆபத்து மண்டலம்",
    darkMode: "இருண்ட தீம்",
    delete: "அழி",
    deprecated: "இந்த கட்டமைப்பு பழமையானது மற்றும் எதிர்கால வெளியீட்டில் நீக்கப்படும்.",
    description: "விபரம்",
    deviceModel: "கருவி மாதிரி",
    disable: "முடக்கப்பட்டது",
    disabled: "செயலில் இல்லை",
    docs: "டாக்ஸ்",
    documentation: "ஆவணம்",
    done: "நிறைவு செய்",
    download: "பதிவிறக்கம்",
    drag: "இழுக்கவும்",
    duplicateURLError: "இந்த URL ஏற்கனவே சேர்க்கப்பட்டுள்ளது",
    edit: "திருத்து",
    enable: "இயக்கு",
    enabled: "செயலில் உள்ளது",
    endsWith: "முடிவடைவது",
    equals: "சமன்",
    exitFullScreen: "முழுத்திரையில் இருந்து வெளியேறவும்",
    experimental: "சோதனைக்குரிய",
    explore: "ஆராயுங்கள்",
    export: "ஏற்று",
    featureAvailable: "இந்த அம்சம் விரைவில் கிடைக்கும்!",
    filter: "வடிகட்டு",
    finish: "நிறைவு செய்",
    generatePassword: "கடவுச்சொல்லை உருவாக்கவும்",
    goBackHome: "முகப்புக்கு செல்",
    goFullScreen: "முழுத்திரைக்குச் செல்லுங்கள்",
    good: "சிறந்தது",
    help: "உதவி",
    hide: "மறை",
    hidePassword: "கடவுச்சொல்லை மறை",
    identityProviders: "அடையாள வழங்குநர்கள்",
    import: "இறக்கு",
    initiator: "கருத்தா",
    ipAddress: "IP முகவரி",
    issuer: "வழங்குபவர்",
    lastAccessed: "இறுதி அணுகல்",
    lastModified: "கடைசியாக மாற்றியமைக்கப்பட்டது",
    lastSeen: "இறுதி நுழைவு",
    lastUpdatedOn: "கடைசியாக புதுப்பிக்கப்பட்ட தேதி",
    learnMore: "மேலும் அறிக",
    lightMode: "ஒளி தீம்",
    loading: "ஏற்றுகிறது",
    loginTime: "நுழைந்த நேரம்",
    logout: "வெளியேறு",
    makePrimary:"முதன்மை உருவாக்கு",
    maxValidation: "இந்த மதிப்பு {{max}} ஐ விட குறைவாகவோ அல்லது சமமாகவோ இருக்க வேண்டும்.",
    maximize: "பெரிதாக்கு",
    metaAttributes: "மெட்டா பண்புக்கூறுகள்",
    minValidation: "இந்த மதிப்பு {{min}} ஐ விட அதிகமாகவோ அல்லது சமமாகவோ இருக்க வேண்டும்.",
    minimize: "குறைத்தல்",
    minutes: "நிமிடங்கள்",
    more: "மேலும்",
    myAccount: "என் கணக்கு",
    name: "பெயர்",
    networkErrorMessage: {
        description: "மீண்டும் உள்நுழைய முயற்சிக்கவும்.",
        heading: "உங்கள் அமர்வு காலாவதியாகி விட்டது",
        primaryActionText: "உள்நுழையவும்"
    },
    new: "புதிய",
    next: "அடுத்தது",
    noResultsFound: "முடிவுகள் எதுவும் இல்லை",
    okay: "சரி",
    operatingSystem: "இயங்கு தளம்",
    operations: "செயற்பாடுகள்",
    organizationName: "{{orgName}} நிறுவனம்",
    overview: "கண்ணோட்டம்",
    personalInfo: "பயனர் விபரம்",
    pin: "பொருத்து",
    pinned: "பொருத்தப்பட்டுள்ளது",
    premium: "பிரீமியம்",
    pressEnterPrompt: "தேர்ந்தெடுக்க <1>Enter</1> ஐ அழுத்தவும்",
    preview: "முன்னோட்ட",
    previous: "பின் செல்",
    primary: "முதன்மை",
    priority: "முன்னுரிமை",
    privacy: "தனியுரிமை",
    properties: "உடைமைகள்",
    publish: "வெளியிடு",
    ready: "தயார்",
    regenerate: "மீளுருவாக்கம்",
    register: "பதிவு செய்",
    reject: "மறுக்கவும்",
    rejected: "மறுக்கப்பட்டது",
    release: "விடுவி",
    remove: "நீக்கு",
    removeAll: "அனைத்து நீக்க",
    required: "இது தேவை",
    reserved: "ஒதுக்கப்பட்டவை",
    resetFilters: "வடிகட்டல்களை மீட்டடமை",
    retry: "மீண்டும் முயற்சி செய்",
    revoke: "நீக்கு",
    revokeAll: "அனைத்தையும் நீக்கு",
    samples: "மாதிரிகள்",
    save: "சேமி",
    saveDraft: "மூலத்தைச் சேமி",
    sdks: "SDKகள்",
    search: "தேடு",
    searching: "தேடி",
    security: "பாதுகாப்பு",
    selectAll: "அனைத்தையும் தேர்ந்தெடுக்கவும்",
    selectNone: "எதுவுமில்லை என்பதைத் தேர்ந்தெடுக்கவும்",
    services: "சேவைகள்",
    settings: "அமைப்புகள்",
    setup: "அமைவு",
    show: "காட்டு",
    showAll: "அனைத்தையும் காட்டு",
    showLess: "சுருக்கிக் காண்",
    showMore: "மேலுங் காண்",
    showPassword: "கடவுச்சொல்லை காண்",
    skip: "தவிர்",
    startsWith: "தொடங்குவது",
    step: "படி",
    strong: "வலுவான",
    submit: "சமர்ப்பி",
    switch: "மாற்று",
    technologies: "தொழில்நுட்பங்கள்",
    terminate: "முடி",
    terminateAll: "அனைத்தையும் முடி",
    terminateSession: "அமர்வை முடி",
    tooShort: "மிகவும் குறுகிய",
    type: "வகை",
    unpin: "அகற்று",
    unpinned: "அகற்றப்பட்டது",
    update: "புதுப்பி",
    user: "பயனர்",
    verified: "சரிபார்க்கப்பட்டது",
    verify: "உறுதி செய்",
    view: "காண்க",
    weak: "பலவீனமான",
    weakPassword: "கடவுச்சொல் வலிமை குறைந்தபட்சம் நன்றாக இருக்க வேண்டும்."
};

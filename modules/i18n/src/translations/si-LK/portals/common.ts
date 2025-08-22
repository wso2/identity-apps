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
    access: "ප්\u200Dරවේශය",
    actions: "ක්‍රියා",
    activate: "සක්‍රිය කරන්න",
    active: "සක්\u200Dරීයයි",
    add: "එකතු කරන්න",
    addKey: "රහස එකතු කරන්න",
    addURL: "URL එක් කරන්න",
    all: "සියලුම",
    applicationName: "ඇප් එකේ නම",
    applications: "ඇප්ස්",
    approvalStatus: "අනුමත කිරීමේ තත්වය",
    approvals: "අනුමත කිරීම්",
    approvalsPage: {
        list: {
            columns: {
                actions: "ක්‍රියා",
                name: "නම"
            }
        },
        modals: {
            description: "ඔබගේ අනුමැතිය අවශ්‍ය මෙහෙයුම් කාර්යයන් සමාලෝචනය කරන්න",
            header: "අනුමත කිරීම්",
            subHeader: "ඔබගේ අනුමැතිය අවශ්‍ය මෙහෙයුම් කාර්යයන් සමාලෝචනය කරන්න"
        },
        notifications: {
            fetchApprovalDetails: {
                error: {
                    description: "{{description}}",
                    message: "අනුමත කිරීමේ විස්තර ලබා ගැනීමට දෝෂයක්"
                },
                genericError: {
                    description: "අනුමත කිරීමේ විස්තර ලබා ගැනීමට නොහැකි විය.",
                    message: "යමක් වැරදී ඇත"
                }
            },
            fetchPendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "අනුමත කිරීම් ලබා ගැනීමට දෝෂයක්"
                },
                genericError: {
                    description: "අනුමත කිරීම් ලබා ගැනීමට නොහැකි විය.",
                    message: "යමක් වැරදී ඇත"
                }
            },
            updatePendingApprovals: {
                error: {
                    description: "{{description}}",
                    message: "අනුමත කිරීම යාවත්කාලීන කිරීමට දෝෂයක්"
                },
                genericError: {
                    description: "පැවරුම්කරු අනුමත කිරීම යාවත්කාලීන කිරීමට නොහැකි විය.",
                    message: "යමක් වැරදී ඇත"
                },
                success: {
                    description: "අනුමත කිරීම සාර්ථකව යාවත්කාලීන කරන ලදී.",
                    message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                }
            }
        },
        placeholders: {
            emptyApprovalFilter: {
                action: "සියල්ල බලන්න",
                subtitles: {
                    0: "{{status}} තත්වයේ දැනට කිසිදු අනුමැතියක් නොමැත.",
                    1: "කරුණාකර {{status}} තත්වයේ ඔබට ඇති කාර්යයන් පරීක්ෂා කරන්න",
                    2: "එහිදී ඒවා බලන්න."
                },
                title: "ප්‍රතිඵල කිසිවක් හමු නොවීය"
            },
            emptyApprovalList: {
                action: "",
                subtitles: {
                    0: "සමාලෝචනය කිරීමට දැනට අනුමැතීන් නොමැත.",
                    1: "කරුණාකර පද්ධතියේ මෙහෙයුම් පාලනය කිරීමට ඔබ වැඩපිළිවෙළක් එක් කර ඇතිදැයි පරීක්ෂා කරන්න.",
                    2: ""
                },
                title: "අනුමත කිරීම් නොමැත"
            },
            emptySearchResults: {
                action: "සියල්ල බලන්න",
                subtitles: {
                    0: "ඔබ සෙවූ මෙහෙයුම් කාර්යය අපට සොයාගත නොහැකි විය.",
                    1: "කරුණාකර පද්ධතියේ එම නාමය ඇති මෙහෙයුම් කාර්යයන් තිබේදැයි පරීක්ෂා කරන්න.",
                    2: ""
                },
                title: "අනුමත කිරීම් නොමැත"
            },
            searchApprovals: "කාර්ය ප්‍රවාහ නාමයෙන් සොයන්න"
        },
        propertyMessages: {
            assignedUsersDeleted: "පවරා ඇති පරිශීලකයන් මකා දමා ඇත.",
            roleDeleted: "මෙම භූමිකාව මකා දමා ඇත.",
            selfRegistration: "ස්වයං ලියාපදිංචිය",
            unassignedUsersDeleted: "පවරා නොමැති පරිශීලකයන් මකා දමා ඇත."
        },
        subTitle: "අනුමැතිය අවශ්‍ය මෙහෙයුම් කාර්යයන් සමාලෝචනය කරන්න",
        title: "අනුමත කිරීම්"
    },

    approve: "අනුමත කරන්න",
    approved: "අනුමත කරන ලදි",
    apps: "ඇප්ස්",
    assignee: "පැවරුම්කරු",
    assignees: "පැවරුම්කරුවන්",
    asyncOperationErrorMessage: {
        description: "යමක් වැරදී ඇත.",
        message: "අනපේක්ෂිත දෝෂයක් සිදු විය. කරුණාකර පසුව නැවත පරීක්ෂා කරන්න."
    },
    authentication: "සත්‍යාපනය",
    authenticator: "සත්‍යාපකය",
    authenticator_plural: "සත්‍යාපක",
    back: "ආපසු",
    beta: "බීටා",
    browser: "බ්\u200Dරව්සරය",
    cancel: "අවලංගු කරන්න",
    challengeQuestionNumber: "අභියෝගාත්මක ප්\u200Dරශ්නය {{number}}",
    change: "වෙනස් කරන්න",
    chunkLoadErrorMessage: {
        description: "ඉල්ලූ යෙදුමට සේවය කිරීමේදී දෝෂයක් ඇතිවිය. කරුණාකර යෙදුම නැවත පූරණය කිරීමට උත්සාහ කරන්න.",
        heading: "මොකක්හරි වැරැද්දක් වෙලා",
        primaryActionText: "යෙදුම නැවත පූරණය කරන්න"
    },
    claim: "හිමිකම",
    clear: "මකන්න",
    clientId: "සේවාලාභී හැඳුනුම්පත",
    close: "වසන්න",
    comingSoon: "ඉක්මනින් පැමිණේවි",
    completed: "සම්පුර්ණ කරන ලද",
    configure: "වින්\u200Dයාස කරන්න",
    confirm: "තහවුරු කරන්න",
    contains: "අඩංගු වේ",
    continue: "පවත්වාගෙන යන්න",
    copyToClipboard: "ක්ලිප්බෝඩ් වෙත පිටපත් කරන්න",
    create: "සාදන්න",
    createdOn: "නිර්මාණය කරන ලද්දේ",
    dangerZone: "අන්තරා කලාපය",
    darkMode: "අඳුරු තේමාව",
    delete: "මකන්න",
    deprecated: "මෙම වින්‍යාසය අහෝසි කර ඇති අතර අනාගත නිකුතුවකින් ඉවත් කෙරෙනු ඇත.",
    description: "විස්තරය",
    deviceModel: "උපාංග ආකෘතිය",
    disable: "අක්‍රීය",
    disabled: "අක්‍රීයයි",
    docs: "ලියකියවිලි",
    documentation: "ප්‍රලේඛනය",
    done: "සම්පූර්ණයි",
    download: "බාගත",
    drag: "අදින්න",
    duplicateURLError: "මෙම URL දැනටමත් එකතු කර ඇත",
    edit: "සංස්කරණය කරන්න",
    enable: "සක්‍රීය",
    enabled: "සක්‍රීයයි",
    endsWith: "සමඟ අවසන් වේ",
    equals: "සමාන",
    exitFullScreen: "සම්පූර්ණ තිරයෙන් පිටවන්න",
    experimental: "පර්යේෂණාත්මක",
    explore: "ගවේෂණය කරන්න",
    export: "අපනයනය කරන්න",
    featureAvailable: "මෙම අංගය ඉක්මනින් ලබා ගත හැක!",
    filter: "පෙරහන",
    finish: "අවසන් කරන්න",
    generatePassword: "මුරපදය ජනනය කරන්න",
    goBackHome: "නැවත ප්\u200Dරධාන පිටුවට",
    goFullScreen: "සම්පූර්ණ තිරයට යන්න",
    good: "හොඳ",
    help: "උපකාර",
    hide: "සඟවන්න",
    hidePassword: "මුරපදය සඟවන්න",
    identityProviders: "හැඳුනුම්පත් සපයන්නා",
    import: "ආනයන",
    initiator: "ආරම්භකයා",
    ipAddress: "IP ලිපිනය",
    issuer: "යෙදුම් නිකුත් කරන්නා",
    lastAccessed: "අවසන් ප්\u200Dරවේශය",
    lastModified: "අවසන් වෙනස් කළ දිනය",
    lastSeen: "අවසන් වරට",
    lastUpdatedOn: "අවසන් වරට යාවත්කාලීන කළ දිනය",
    learnMore: "තවත් හදාරන්න",
    lightMode: "දීප්තිමත් තේමාව",
    loading: "පූරණය වෙමින් පවතී",
    loginTime: "පිවිසුම් කාලය",
    logout: "වරන්න",
    makePrimary: "ප්‍රාථමික කරන්න",
    maxValidation: "මෙම අගය {{max}} ට වඩා අඩු හෝ සමාන විය යුතුය.",
    maximize: "උපරිම කරන්න",
    metaAttributes: "අතිරේක ගුණාංග",
    minValidation: "මෙම අගය {{min}} ට වඩා වැඩි හෝ සමාන විය යුතුය.",
    minimize: "අවම කරන්න",
    minutes: "මිනිත්තු",
    more: "තව",
    myAccount: "පුද්ගලික ගිණුම",
    name: "නම",
    networkErrorMessage: {
        description: "කරුණාකර නැවත පුරනය වීමට උත්සාහ කරන්න.",
        heading: "ඔබගේ සැසිය කල් ඉකුත් වී ඇත",
        primaryActionText: "පුරන්න"
    },
    new: "නවතම",
    next: "ඊළඟ ",
    noResultsFound: "ප්‍රතිඵල හමු නොවීය",
    okay: "හරි",
    operatingSystem: "මෙහෙයුම් පද්ධතිය",
    operations: "මෙහෙයුම්",
    organizationName: "{{orgName}} සංවිධානය",
    overview: "දළ විශ්ලේෂණය",
    personalInfo: "පෞද්ගලික තොරතුරු",
    pin: "තබා ගන්න",
    pinned: "තබා ඇත",
    premium: "විශිෂ්ට",
    pressEnterPrompt: "තේරීමට <1>Enter</1> ඔබන්න",
    preview: "පෙරදසුන",
    previous: "පෙර",
    primary: "ප්‍රාථමික",
    priority: "ප්\u200Dරමුඛතාවය",
    privacy: "රහස්\u200Dයතාවය",
    properties: "ගුණාංග",
    publish: "ප්‍රකාශනය කරන්න",
    ready: "සූදානම්",
    regenerate: "නැවත උත්පාදනය කරන්න",
    register: "ලියාපදිංචි වන්න",
    reject: "ප්‍රතික්ෂේප කරන්න",
    rejected: "ප්‍රතික්ෂේප කරන ලදි",
    release: "මුදා හැරීම",
    remove: "ඉවත් කරන්න",
    removeAll: "සියල්ල ඉවත් කරන්න",
    required: "මෙය අවශ්‍ය වේ",
    reserved: "වෙන් කරන ලද",
    resetFilters: "පෙරහන් නැවත සකසන්න",
    retry: "නැවත උත්සාහ කරන්න",
    revoke: "අවලංගු කරන්න",
    revokeAll: "සියල්ල අවලංගු කරන්න",
    samples: "සාම්පල",
    save: "සුරකින්න",
    saveDraft: "තාවකාලිකව සුරකින්න",
    sdks: "SDKs",
    search: "සොයන්න",
    searching: "සොයමින්",
    security: "ආරක්ෂාව",
    selectAll: "සියල්ල තෝරන්න",
    selectNone: "කිසිවක් තෝරන්න",
    services: "සේවාවන්",
    settings: "සැකසුම්",
    setup: "සැලසුම",
    show: "පෙන්වන්න",
    showAll: "සියල්ල පෙන්වන්න",
    showLess: "අඩුවෙන් පෙන්වන්න",
    showMore: "වැඩිදුර තොරතුරු",
    showPassword: "මුරපදය පෙන්වන්න",
    skip: "මඟ හරින්න",
    startsWith: "සමඟ ආරම්භ වේ",
    step: "පියවර",
    strong: "ශක්තිමත්",
    submit: "ඉදිරිපත් කරන්න",
    switch: "මාරු කරන්න",
    technologies: "තාක්ෂණයන්",
    terminate: "අවසන් කරන්න",
    terminateAll: "සියල්ල අවසන් කරන්න",
    terminateSession: "සැසිය අවසන් කරන්න",
    tooShort: "බොහෝ කෙටි",
    type: "වර්ගය",
    unpin: "ඉවත් කරන්න",
    unpinned: "ඉවත් කරන ලදි",
    update: "යාවත්කාලීන කරන්න",
    user: "පරිශීලක",
    verified: "තහවුරු කර ඇත",
    verify: "සත්‍යාපනය කරන්න",
    view: "බලන්න",
    weak: "දුර්වලයි",
    weakPassword: "මුරපදයේ ශක්තිය අවම වශයෙන් හොඳ විය යුතුය."
};

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

import { AdminPortalNS } from "../../../models";

export const adminPortal: AdminPortalNS = {
    components: {
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
            placeholder: "{{attribute}} by මගින් සොයන්න",
            popups: {
                clear: "පැහැදිලි සෙවීම",
                dropdown: "විකල්ප පෙන්වන්න"
            },
            resultsIndicator: "විමසුම සඳහා ප්‍රතිපල පෙන්වයි \"{{query}}\""
        },
        approvals: {
            list: {
                columns: {
                    actions: "ක්‍රියා",
                    name: "නම"
                }
            },
            modals: {
                taskDetails: {
                    header: "අනුමත කිරීමේ කාර්යය",
                    description: "පරිශීලකයෙකුගේ මෙහෙයුම් ක්‍රියාවක් අනුමත කිරීමට ඔබට ඉල්ලීමක් තිබේ.",
                }
            },
            notifications: {
                fetchApprovalDetails: {
                    error: {
                        description: "{{description}}",
                        message: "අනුමත තොරතුරු ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අනුමත තොරතුරු යාවත්කාලීන කිරීමට නොහැකි විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "අනුමත කිරීමේ තොරතුරු සාර්ථකව ලබා ගන්නා ලදි",
                        message: "අනුමත තොරතුරු ලබා ගැනීම සාර්ථකයි"
                    }
                },
                fetchPendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "අපේක්ෂිත අනුමැතිය ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "අපේක්ෂිත අනුමත ලබා ගැනීමට නොහැකි විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "අපේක්ෂිත අනුමත කිරීම් සාර්ථකව ලබා ගන්නා ලදි",
                        message: "අපේක්ෂිත අනුමත කිරීම් නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                updatePendingApprovals: {
                    error: {
                        description: "{{description}}",
                        message: "අනුමැතිය යාවත්කාලීන කිරීමේදී දෝෂයකි"
                    },
                    genericError: {
                        description: "අනුමැතිය යාවත්කාලීන කළ නොහැක",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "අනුමැතිය සාර්ථකව යාවත්කාලීන කරන ලදි",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                }
            },
            placeholders: {
                emptyApprovalList: {
                    action: "",
                    subtitles: {
                        0: "සමාලෝචනය කිරීමට දැනට අනුමත කිරීම් නොමැත.",
                        1: "පද්ධතියේ මෙහෙයුම් පාලනය කිරීම සඳහා ඔබ කාර්ය ප්‍රවාහයක් එකතු කර ඇත්දැයි"
                            + " කරුණාකර පරීක්ෂා කරන්න.",
                        2: ""
                    },
                    title: "අනුමත කිරීම් නොමැත"
                },
                emptyApprovalFilter: {
                    action: "සියල්ල බලන්න",
                    subtitles: {
                        0: "{{status}} තත්වයේ දැනට අනුමත කිරීම් නොමැත.",
                        1: "ඔබට {{status}} තත්වයේ කිසියම් කාර්යයක් තිබේදැයි කරුණාකර පරීක්ෂා කරන්න",
                        2: "ඒවා මෙතැනින් බලන්න."
                    },
                    title: "ප්‍රතිපල හමු නොවීය"
                },
                emptySearchResults: {
                    action: "සියල්ල බලන්න",
                    subtitles: {
                        0: "ඔබ සෙවූ කාර්ය ප්‍රවාහය අපට සොයාගත නොහැකි විය.",
                        1: "කරුණාකර එම නම සමඟ වැඩ ප්‍රවාහයක් තිබේදැයි පරීක්ෂා කරන්න",
                        2: "පද්ධතිය."
                    },
                    title: "අනුමත කිරීම් නොමැත"
                }
            }
        },
        certificates: {
            keystore: {
                advancedSearch: {
                    error: "පෙරහන් විමසුම් ආකෘතිය වැරදිය",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "උදා. අන්වර්ථය ආදිය."
                            },
                            filterCondition: {
                                placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                            },
                            filterValue: {
                                placeholder: "උදා. wso2carbon ආදිය."
                            }
                        }
                    },
                    placeholder: "අන්වර්ථය මගින් සොයන්න"
                },
                attributes: {
                    alias: "අන්වර්ථය"
                },
                certificateModalHeader: "සහතිකය බලන්න",
                confirmation: {
                    content: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර සහතිකය ස්ථිරවම මකා දමනු ඇත.",
                    header: "ඔබට විශ්වාසද?",
                    hint: "තහවුරු කිරීමට කරුණාකර <1>{{id}}</1> ඇතුලත් කරන්න.",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර සහතිකය ස්ථිරවම මකා දමනු ඇත.",
                    primaryAction: "තහවුරු කරන්න",
                    tenantContent: "මෙය කුලී නිවැසියන්ගේ සහතිකය ස්ථිරවම මකා දමනු ඇත. වරක් මකාදැමූ විට, ඔබ "
                        + "නව කුලී නිවැසියෙකුගේ සහතිකයක් ආනයනය නොකරන්නේ නම්, ඔබට ද්වාර "
                        + "අයදුම්පත් වෙත ප්‍රවේශ විය නොහැක. මකාදැමීම දිගටම කරගෙන යාමට, "
                        + "සහතිකයේ අන්වර්ථය ඇතුළත් කර මකන්න ක්ලික් කරන්න."
                },
                errorCertificate: "සහතිකය විකේතනය කිරීමේදී දෝෂයක් සිදුවිය. "
                    + "කරුණාකර සහතිකය වලංගු බව සහතික කරන්න.",
                errorEmpty: "සහතික ගොනුවක් එක් කරන්න හෝ PEM- කේතනය කළ සහතිකයක අන්තර්ගතය අලවන්න.",
                forms: {
                    alias: {
                        label: "අන්වර්ථය",
                        placeholder: "අන්වර්ථයක් ඇතුළත් කරන්න",
                        requiredErrorMessage: "අන්වර්ථය අවශ්‍යයි"
                    }
                },
                list: {
                    columns: {
                        actions: "ක්‍රියා",
                        name: "නම"
                    }
                },
                notifications: {
                    addCertificate:{
                        genericError: {
                            description: "සහතිකය ආයාත කිරීමේදී දෝෂයක් සිදුවිය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "සහතිකය සාර්ථකව එකතු කර ඇත.",
                            message: "සහතික ආනයන සාර්ථකත්වය"
                        }
                    },
                    deleteCertificate: {
                        genericError: {
                            description: "සහතිකය මකාදැමීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත!"
                        },
                        success: {
                            description: "සහතිකය සාර්ථකව මකා දමා ඇත.",
                            message: "සහතිකය සාර්ථකව මකා දමන ලදි"
                        }
                    },
                    download: {
                        success: {
                            description: "සහතිකය බාගත කිරීම ආරම්භ කර ඇත.",
                            message: "සහතික බාගත කිරීම ආරම්භ විය"
                        }
                    },
                    getAlias: {
                        genericError: {
                            description: "සහතිකය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        }
                    },
                    getCertificate: {
                        genericError: {
                            description: "සහතිකය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        }
                    },
                    getCertificates: {
                        genericError: {
                            description: "සහතික ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        }
                    },
                    getPublicCertificate: {
                        genericError: {
                            description: "කුලී නිවැසියන්ගේ සහතිකය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත!"
                        }
                    }
                },
                pageLayout: {
                    description: "යතුරු ගබඩාවේ සහතික සාදන්න සහ කළමනාකරණය කරන්න",
                    primaryAction: "ආනයන සහතිකය",
                    title: "සහතික"
                },
                placeholders: {
                    emptyList: {
                        action: "ආනයන සහතිකය",
                        subtitle: "දැනට සහතික නොමැත. "
                            + "පහත බොත්තම ක්ලික් කිරීමෙන් ඔබට නව "
                            + "සහතිකයක් ආයාත කළ හැකිය.",
                        title: "ආනයන සහතිකය"
                    },
                    emptySearch: {
                        action: "සෙවුම් විමසුම හිස් කරන්න",
                        subtitle: "{{searchQuery}} සඳහා අපට කිසිදු ප්‍රතිපලයක් සොයාගත නොහැකි විය, "
                            + "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න.",
                        title: "ප්‍රතිපල හමු නොවීය"
                    }
                },
                summary: {
                    issuerDN: "නිකුත් කරන්නා ඩී.එන්",
                    sn: "අන්රක්රමික අංකය",
                    subjectDN: "විෂය ඩී.එන්",
                    validFrom: "පෙර වලංගු නොවේ",
                    validTill: "පසුව වලංගු නොවේ",
                    version: "පිටපත"
                },
                wizard: {
                    dropZone: {
                        action: "සහතිකය උඩුගත කරන්න",
                        description: "සහතික ගොනුවක් මෙහි ඇද දමන්න"
                    },
                    header: "සහතිකය එකතු කරන්න",
                    panes: {
                        paste: "අලවන්න",
                        upload: "උඩුගත කරන්න"
                    },
                    pastePlaceholder: "PEM සහතිකයක අන්තර්ගතය අලවන්න",
                    steps: {
                        summary: "සාරාංශය",
                        upload: "සහතිකය උඩුගත කරන්න"
                    }
                }
            },
            truststore: {
                advancedSearch: {
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "උදා. අන්වර්ථය, සහතිකය ආදිය."
                            },
                            filterCondition: {
                                placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                            },
                            filterValue: {
                                placeholder: "උදා. wso2carbon ආදිය."
                            }
                        }
                    },
                    placeholder: "කණ්ඩායම් නාමයෙන් සොයන්න"
                }
            }
        },
        claims: {
            dialects: {
                advancedSearch: {
                    error: "පෙරහන් විමසුම් ආකෘතිය වැරදිය",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "උදා. ඩයලෙක්ට් යූආර්අයි ආදිය."
                            },
                            filterCondition: {
                                placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                            },
                            filterValue: {
                                placeholder: "උදා. http"
                            }
                        }
                    },
                    placeholder: "ඩයලෙක්ට් යූආර්අයි මගින් සොයන්න"
                },
                attributes: {
                    dialectURI: "උපභාෂාව URI"
                },
                confirmations: {
                    action: "තහවුරු කරන්න",
                    content: "ඔබ මෙම බාහිර උපභාෂාව මකා දැමුවහොත්, ඊට සම්බන්ධ සියලු බාහිර ගුණාංග ද මකා "
                        + "දැමෙනු ඇත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    hint: "තහවුරු කිරීමට කරුණාකර <1>{{confirm}}</1> ඇතුලත් කරන්න.",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර තෝරාගත් බාහිර උපභාෂාව"
                        + " ස්ථිරවම මකා දමනු ඇත."
                },
                dangerZone: {
                    actionTitle: "බාහිර උපභාෂාව මකන්න",
                    header: "බාහිර උපභාෂාව මකන්න",
                    subheader: "ඔබ බාහිර උපභාෂාවක් මකා දැමූ පසු, ආපසු යාමක් නොමැත. කරුණාකර ස්ථිර වන්න."
                },
                forms: {
                    dialectURI: {
                        label: "උපභාෂාව URI",
                        placeholder: "යූආර්අයි උපභාෂාවක් ඇතුළත් කරන්න",
                        requiredErrorMessage: "යූආර්අයි උපභාෂාවක් ඇතුළත් කරන්න"
                    },
                    submit: "යාවත්කාලීන කරන්න"
                },
                localDialect: "දේශීය උපභාෂාව",
                notifications: {
                    addDialect: {
                        error: {
                            description: "බාහිර උපභාෂාව එකතු කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        genericError: {
                            description: "බාහිර උපභාෂාව එකතු කර ඇති නමුත් "
                                + "සියලු බාහිර ගුණාංග සාර්ථකව එකතු කර නොමැත",
                            message: "බාහිර ගුණාංග එකතු කළ නොහැක"
                        },
                        success: {
                            description: "බාහිර උපභාෂාව සාර්ථකව එකතු කර ඇත",
                            message: "බාහිර උපභාෂාව සාර්ථකව එකතු කරන ලදි"
                        }
                    },
                    deleteDialect: {
                        genericError: {
                            description: "මෙම භාෂාව මකාදැමීමේ දෝශයක් ඇති විය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "උපභාෂාව සාර්ථකව මකා දමා ඇත!",
                            message: "උපභාෂාව සාර්ථකව මකා දමන ලදි"
                        }
                    },
                    fetchADialect: {
                        genericError: {
                            description: "බාහිර උපභාෂාව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        }
                    },
                    fetchDialects: {
                        error: {
                            description: "{{description}}",
                            message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                        },
                        genericError: {
                            description: "හිමිකම් උපභාෂා ලබා ගැනීමට නොහැකි විය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "හිමිකම් උපභාෂා සාර්ථකව ලබා ගන්නා ලදි.",
                            message: "නැවත ලබා ගැනීම සාර්ථකයි"
                        }
                    },
                    fetchExternalClaims: {
                        genericError: {
                            description: "බාහිර ගුණාංග ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        }
                    },
                    updateDialect: {
                        genericError: {
                            description: "උපභාෂාව යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "උපභාෂාව සාර්ථකව යාවත්කාලීන කර ඇත.",
                            message: "උපභාෂා යාවත්කාලීන කිරීම සාර්ථකයි"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        back: "Attribute dialects වෙත ආපසු යන්න",
                        description: "External dialect සහ එහි attributes සංස්කරණය කරන්න",
                        updateDialectURI: "උපභාෂාව URI යාවත්කාලීන කරන්න",
                        updateExternalAttributes: "බාහිර ගුණාංග යාවත්කාලීන කරන්න"
                    },
                    list: {
                        description: "ගුණාංග උපභාෂා සාදන්න සහ කළමනාකරණය කරන්න",
                        primaryAction: "නව බාහිර උපභාෂාව",
                        title: "උපභාෂා ආරෝපණය කරන්න",
                        view: "දේශීය හිමිකම් බලන්න"
                    }
                },
                wizard: {
                    header: "බාහිර උපභාෂාව එක් කරන්න",
                    steps: {
                        dialectURI: "උපභාෂාව URI",
                        externalAttribute: "බාහිර ගුණාංග",
                        summary: "සාරාංශය"
                    },
                    summary: {
                        externalAttribute: "බාහිර ගුණාංග යූආර්අයි",
                        mappedAttribute: "සිතියම්ගත කළ දේශීය ගුණාංග යූආර්අයි",
                        notFound: "බාහිර ලක්ෂණයක් එකතු කර නැත."
                    }
                }
            },
            external: {
                advancedSearch: {
                    error: "පෙරහන් විමසුම් ආකෘතිය වැරදිය",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "උදා. URI ආදිය ආරෝපණය කරන්න."
                            },
                            filterCondition: {
                                placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                            },
                            filterValue: {
                                placeholder: "උදා. http"
                            }
                        }
                    },
                    placeholder: "ගුණාංග URI මගින් සොයන්න"
                },
                attributes: {
                    attributeURI: "ආරෝපණය URI",
                    mappedClaim: "සිතියම්ගත කළ දේශීය ගුණාංග යූආර්අයි"
                },
                forms: {
                    attributeURI: {
                        label: "ආරෝපණය URI",
                        placeholder: "URI ගුණාංගයක් ඇතුළත් කරන්න",
                        requiredErrorMessage: "URI ගුණාංගය අවශ්‍ය වේ"
                    },
                    localAttribute: {
                        label: "සිතියම් ගත කිරීම සඳහා දේශීය ගුණාංග URI",
                        placeholder: "දේශීය ලක්ෂණයක් තෝරන්න",
                        requiredErrorMessage: "සිතියම් ගත කිරීම සඳහා දේශීය ලක්ෂණයක් තෝරන්න"
                    },
                    submit: "බාහිර ගුණාංග එකතු කරන්න"
                },
                notifications: {
                    addExternalAttribute: {
                        genericError: {
                            description: "බාහිර ගුණාංගය එකතු කිරීමේදී දෝෂයක් ඇතිවිය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "බාහිර ගුණාංගය උපභාෂාවට සාර්ථකව එකතු කර ඇත!",
                            message: "බාහිර ගුණාංගය සාර්ථකව එක් කරන ලදි"
                        }
                    },
                    deleteExternalClaim: {
                        genericError: {
                            description: "බාහිර ගුණාංගය මකාදැමීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "බාහිර ගුණාංගය සාර්ථකව මකා දමා ඇත!",
                            message: "බාහිර ගුණාංගය සාර්ථකව මකා දමන ලදි"
                        }
                    },
                    fetchExternalClaims: {
                        error: {
                            description: "{{description}}",
                            message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                        },
                        genericError: {
                            description: "බාහිර හිමිකම් ලබා ගැනීමට නොහැකි විය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "බාහිර හිමිකම් සාර්ථකව ලබා ගන්නා ලදි.",
                            message: "නැවත ලබා ගැනීම සාර්ථකයි"
                        }
                    },
                    getExternalAttribute: {
                        genericError: {
                            description: "බාහිර ගුණාංගය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        }
                    },
                    updateExternalAttribute: {
                        genericError: {
                            description: "බාහිර ගුණාංගය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "බාහිර ගුණාංගය සාර්ථකව යාවත්කාලීන කර ඇත!",
                            message: "බාහිර ගුණාංගය සාර්ථකව යාවත්කාලීන කරන ලදි"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        header: "බාහිර ගුණාංග එකතු කරන්න",
                        primaryAction: "නව බාහිර ගුණාංගය"
                    }
                },
                placeholders: {
                    empty: {
                        subtitle: "දැනට, මෙම උපභාෂාව සඳහා බාහිර ගුණාංග නොමැත."
                            + "this dialect.",
                        title: "බාහිර ගුණාංග නොමැත"
                    }
                }
            },
            list: {
                columns: {
                    actions: "ක්‍රියා",
                    claimURI: "යූආර්අයි ඉල්ලන්න",
                    dialectURI: "උපභාෂාව URI",
                    name: "නම"
                },
                confirmation: {
                    action: "තහවුරු කරන්න",
                    content: "{{message}} කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    dialect: {
                        message: "ඔබ මෙම බාහිර උපභාෂාව මකා දැමුවහොත්, "
                            + "ඊට සම්බන්ධ සියලු බාහිර ගුණාංග ද මකා දැමෙනු ඇත.",
                        name: "බාහිර උපභාෂාව"
                    },
                    external: {
                        message: "මෙය බාහිර ගුණාංගය ස්ථිරවම මකා දමනු ඇත.",
                        name: "බාහිර ගුණාංගය"
                    },
                    header: "ඔබට විශ්වාසද?",
                    hint: "තහවුරු කිරීමට කරුණාකර <1>{{assertion}}</1> ටයිප් කරන්න.",
                    local: {
                        message: "ඔබ මෙම දේශීය ගුණාංගය මකා දැමුවහොත්, "
                            + "මෙම ගුණාංගයට අයත් පරිශීලක දත්ත ද මකා දැමෙනු ඇත.",
                        name: "දේශීය ගුණාංගය"
                    },
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර තෝරාගත් {{name} ස්ථිරවම මකා දමනු ඇත."
                },
                placeholders: {
                    emptyList: {
                        action: {
                            dialect: "නව බාහිර ගුණාංගය",
                            external: "නව බාහිර ගුණාංගය",
                            local: "නව දේශීය ගුණාංගය"
                        },
                        subtitle: "දැනට ප්‍රතිපල නොමැත. නිර්මාණ විශාරදයේ ඇති පියවර අනුගමනය කිරීමෙන් "
                            + "ඔබට පහසුවෙන් නව අයිතමයක් එක් කළ හැකිය.",
                        title: {
                            dialect: "බාහිර උපභාෂාවක් එක් කරන්න",
                            external: "බාහිර ගුණාංගයක් එක් කරන්න",
                            local: "දේශීය ලක්ෂණයක් එක් කරන්න"
                        }
                    },
                    emptySearch: {
                        action: "සෙවුම් විමසුම හිස් කරන්න",
                        subtitle: "{{searchQuery}} සඳහා අපට කිසිදු ප්‍රතිපලයක් සොයාගත නොහැකි විය. "
                            + "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න.",
                        title: "ප්‍රතිපල හමු නොවීය"
                    }
                },
                warning: "මෙම ගුණාංගය පහත පරිශීලක වෙළඳසැල් වල ඇති " +
                    "ගුණාංගයකට සිතියම් ගත කර නොමැත:"
            },
            local: {
                additionalProperties: {
                    hint: "වත්මන් ගුණාංග භාවිතා කරමින් දිගුවක් ලිවීමේදී භාවිතා කරන්න",
                    key: "නම",
                    keyRequiredErrorMessage: "නමක් ඇතුළත් කරන්න",
                    value: "වටිනාකම",
                    valueRequiredErrorMessage: "අගයක් ඇතුළත් කරන්න"
                },
                advancedSearch: {
                    error: "පෙරහන් විමසුම් ආකෘතිය වැරදිය",
                    form: {
                        inputs: {
                            filterAttribute: {
                                placeholder: "උදා. නම, ආරෝපණය URI ආදිය."
                            },
                            filterCondition: {
                                placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                            },
                            filterValue: {
                                placeholder: "උදා. ලිපිනය, ස්ත්‍රී පුරුෂ භාවය ආදිය."
                            }
                        }
                    },
                    placeholder: "නමින් සොයන්න"
                },
                attributes: {
                    attributeURI: "ආරෝපණය URI"
                },
                confirmation: {
                    content: "ඔබ මෙම දේශීය ගුණාංගය මකා දැමුවහොත්, මෙම ගුණාංගයට අයත් පරිශීලක "
                        + "දත්ත ද මකා දැමෙනු ඇත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    hint: "තහවුරු කිරීමට කරුණාකර <1>{{name}}</1> ටයිප් කරන්න.",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර තෝරාගත් දේශීය ගුණාංගය ස්ථිරවම"
                        + " මකා දමනු ඇත.",
                    primaryAction: "තහවුරු කරන්න"
                },
                dangerZone: {
                    actionTitle: "දේශීය ගුණාංග මකන්න",
                    header: "දේශීය ගුණාංග මකන්න",
                    subheader: "ඔබ දේශීය ගුණාංගයක් මකා දැමූ පසු, ආපසු යාමක් නොමැත. "
                        + "කරුණාකර ස්ථිර වන්න."
                },
                forms: {
                    attribute: {
                        placeholder: "සිතියම සඳහා ලක්ෂණයක් ඇතුළත් කරන්න",
                        requiredErrorMessage: "ගුණාංග නාමය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
                    },
                    attributeHint: "ගුණාංගය සඳහා අද්විතීය හැඳුනුම්පතක්. යූආර්අයි ගුණාංගයක් නිර්මාණය කිරීම "
                        + "සඳහා හැඳුනුම්පත යූආර්අයි උපභාෂාවට එකතු කරනු ලැබේ",
                    attributeID: {
                        label: "ගුණාංග හැඳුනුම්පත",
                        placeholder: "ගුණාංග හැඳුනුම්පතක් ඇතුළත් කරන්න",
                        requiredErrorMessage: "ගුණාංග හැඳුනුම්පත අවශ්‍ය වේ"
                    },
                    description: {
                        label: "විස්තර",
                        placeholder: "විස්තරයක් ඇතුළත් කරන්න",
                        requiredErrorMessage: "විස්තරය අවශ්ය වේ"
                    },
                    displayOrder: {
                        label: "ඇණවුම පෙන්වන්න",
                        placeholder: "දර්ශන අනුපිළිවෙල ඇතුළත් කරන්න"
                    },
                    displayOrderHint: "පරිශීලක පැතිකඩෙහි සහ පරිශීලක ලියාපදිංචි කිරීමේ පිටුවෙහි මෙම "
                        + "ගුණාංගය පෙන්වන ස්ථානය මෙය තීරණය කරයි",
                    name: {
                        label: "නම",
                        placeholder: "ගුණාංගය සඳහා නමක් ඇතුළත් කරන්න",
                        requiredErrorMessage: "නම අවශ්‍යයි"
                    },
                    nameHint: "පරිශීලක පැතිකඩ සහ පරිශීලක ලියාපදිංචි පිටුවෙහි පෙන්වන ගුණාංගයේ නම"
                        + "and user registration page",
                    readOnly: {
                        label: "මෙම ගුණාංගය කියවීමට පමණක් කරන්න"
                    },
                    regEx: {
                        label: "සාමාන්ය ලෙස",
                        placeholder: "සාමාන්‍ය ප්‍රකාශනයක් ඇතුළත් කරන්න"
                    },
                    regExHint: "මෙම නිත්‍ය ප්‍රකාශනය මෙම ගුණාංගයට ගත හැකි අගය වලංගු කිරීම සඳහා භාවිතා කරයි",
                    required: {
                        label: "පරිශීලක ලියාපදිංචි කිරීමේදී මෙම ගුණාංගය අවශ්‍ය කරන්න"
                    },
                    supportedByDefault: {
                        label: "පරිශීලක පැතිකඩ සහ පරිශීලක ලියාපදිංචි පිටුවෙහි මෙම ගුණාංගය පෙන්වන්න"
                    }
                },
                mappedAttributes: {
                    hint: "ඔබට මෙම ගුණාංගයට සිතියම් ගත කිරීමට අවශ්‍ය සෑම පරිශීලක වෙළඳසැලකින්ම"
                        + " ගුණාංගය ඇතුළත් කරන්න."
                },
                notifications: {
                    addLocalClaim: {
                        genericError: {
                            description: "දේශීය ගුණාංගය එකතු කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "දේශීය ගුණාංගය සාර්ථකව එකතු කර ඇත!",
                            message: "දේශීය ගුණාංගය සාර්ථකව එකතු කරන ලදි"
                        }
                    },
                    deleteClaim: {
                        genericError: {
                            description: "දේශීය ගුණාංගය මකාදැමීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "දේශීය හිමිකම් පෑම සාර්ථකව මකා දමා ඇත!",
                            message: "දේශීය ගුණාංගය සාර්ථකව මකා දමන ලදි"
                        }
                    },
                    fetchLocalClaims: {
                        error: {
                            description: "{{description}}",
                            message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                        },
                        genericError: {
                            description: "දේශීය හිමිකම් ලබා ගැනීමට නොහැකි විය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "දේශීය හිමිකම් සාර්ථකව ලබා ගන්නා ලදි.",
                            message: "නැවත ලබා ගැනීම සාර්ථකයි"
                        }
                    },
                    getAClaim: {
                        genericError: {
                            description: "දේශීය ගුණාංගය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        }
                    },
                    getClaims: {
                        genericError: {
                            description: "දේශීය ගුණාංග ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        }
                    },
                    getLocalDialect: {
                        genericError: {
                            description: "දේශීය උපභාෂාව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        }
                    },
                    updateClaim: {
                        genericError: {
                            description: "දේශීය ගුණාංගය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "මෙම දේශීය ගුණාංගය සාර්ථකව "
                                + "යාවත්කාලීන කර ඇත!",
                            message: "දේශීය ගුණාංගය සාර්ථකව යාවත්කාලීන කරන ලදි"
                        }
                    }
                },
                pageLayout: {
                    edit: {
                        back: "දේශීය ගුණාංග වෙත ආපසු යන්න",
                        description: "දේශීය ගුණාංග සංස්කරණය කරන්න",
                        tabs: {
                            additionalProperties: "අමතර දේපල",
                            general: "ජනරාල්",
                            mappedAttributes: "සිතියම්ගත කළ ගුණාංග"
                        }
                    },
                    local: {
                        action: "නව දේශීය ගුණාංගය",
                        back: "උපභාෂා ආරෝපණය කිරීමට ආපසු යන්න",
                        description: "දේශීය ගුණාංග සාදන්න සහ කළමනාකරණය කරන්න",
                        title: "දේශීය ගුණාංග"
                    }
                },
                wizard: {
                    header: "දේශීය ගුණාංග එකතු කරන්න",
                    steps: {
                        general: "ජනරාල්",
                        mapAttributes: "සිතියම් ගුණාංග",
                        summary: "සාරාංශය"
                    },
                    summary: {
                        attribute: "ගුණාංගය",
                        attributeURI: "ආරෝපණය URI",
                        displayOrder: "ඇණවුම පෙන්වන්න",
                        readOnly: "මෙම ගුණාංගය කියවීමට පමණි",
                        regEx: "සාමාන්ය ලෙස",
                        required: "පරිශීලක ලියාපදිංචි කිරීමේදී මෙම ගුණාංගය අවශ්‍ය වේ",
                        supportedByDefault: "මෙම ගුණාංගය පරිශීලක පැතිකඩ සහ පරිශීලක ලියාපදිංචි පිටුවෙහි දැක්වේ",
                        userstore: "පරිශීලක වෙළඳසැල"
                    }
                }
            }
        },
        emailLocale: {
            buttons: {
                addLocaleTemplate: "ස්ථාන සැකිල්ල එක් කරන්න",
                saveChanges: "වෙනස්කම් සුරකින්න"
            },
            forms: {
                addLocale: {
                    fields: {
                        bodyEditor: {
                            label: "සිරුර",
                            validations: {
                                empty: "ඊමේල් බොඩි හිස් විය නොහැක."
                            }
                        },
                        locale: {
                            label: "පෙදෙසි",
                            placeholder: "පෙදෙසි තෝරන්න",
                            validations: {
                                empty: "පෙදෙසි තෝරන්න"
                            }
                        },
                        signatureEditor: {
                            label: "තැපැල් අත්සන",
                            validations: {
                                empty: "ඊමේල් අත්සන හිස් විය නොහැක."
                            }
                        },
                        subject: {
                            label: "විෂය",
                            placeholder: "ඔබගේ විද්‍යුත් තැපැල් විෂය ඇතුළත් කරන්න",
                            validations: {
                                empty: "විද්‍යුත් විෂය අවශ්‍ය වේ"
                            }
                        }
                    }
                }
            }
        },
        emailTemplateTypes: {
            advancedSearch: {
                error: "පෙරහන් විමසුම් ආකෘතිය වැරදිය",
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "උදා. නම ආදිය."
                        },
                        filterCondition: {
                            placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                        },
                        filterValue: {
                            placeholder: "උදා. TOTP, passwordResetSuccess ආදිය."
                        }
                    }
                },
                placeholder: "විද්‍යුත් තැපැල් ආකෘති වර්ගය අනුව සොයන්න"
            },
            buttons: {
                createTemplateType: "සැකිලි වර්ගය සාදන්න",
                deleteTemplate: "අච්චුව මකන්න",
                editTemplate: "සැකිල්ල සංස්කරණය කරන්න",
                newType: "නව ආකෘති වර්ගය"
            },
            confirmations: {
                deleteTemplateType: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{id}}</1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම ඊමේල් අච්චු වර්ගය මකා දැමුවහොත්, සියලු සම්බන්ධිත වැඩ ප්‍රවාහයන්ට " +
                        "තවදුරටත් වලංගු ඊමේල් අච්චුවක් සමඟ වැඩ කිරීමට නොහැකි වන අතර මෙම අච්චු වර්ගයට " +
                        "සම්බන්ධ සියලුම ස්ථාන සැකිලි මකා දමනු ඇත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර තෝරාගත් විද්‍යුත් තැපැල් " +
                        "ආකෘති වර්ගය ස්ථිරවම මකා දමනු ඇත."
                }
            },
            forms: {
                addTemplateType: {
                    fields: {
                        type: {
                            label: "ආකෘති වර්ගය නම",
                            placeholder: "අච්චු වර්ගයේ නමක් ඇතුළත් කරන්න",
                            validations: {
                                empty: "ඉදිරියට යාමට අච්චු වර්ගයේ නම අවශ්‍ය වේ."
                            }
                        }
                    }
                }
            },
            list: {
                actions: "ක්‍රියා",
                name: "නම"
            },
            notifications: {
                createTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "විද්‍යුත් තැපැල් ආකෘති වර්ගය සෑදීමේ දෝෂයකි."
                    },
                    genericError: {
                        description: "විද්‍යුත් තැපැල් ආකෘති වර්ගය සෑදිය නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "විද්‍යුත් තැපැල් ආකෘති වර්ගය සාර්ථකව නිර්මාණය කළේය.",
                        message: "විද්‍යුත් තැපැල් ආකෘති වර්ගය සෑදීම සාර්ථකයි"
                    }
                },
                deleteTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "විද්‍යුත් තැපැල් ආකෘති වර්ගය මැකීමේ දෝෂයකි."
                    },
                    genericError: {
                        description: "විද්‍යුත් තැපැල් ආකෘති වර්ගය මකා දැමිය නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "විද්‍යුත් තැපැල් ආකෘති වර්ගය සාර්ථකව මකා දමන ලදි.",
                        message: "විද්‍යුත් තැපැල් ආකෘති වර්ගය මකා දැමීම සාර්ථකයි"
                    }
                },
                getTemplateTypes: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "විද්‍යුත් තැපැල් ආකෘති වර්ග ලබා ගැනීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "විද්‍යුත් තැපැල් ආකෘති වර්ග සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                updateTemplateType: {
                    error: {
                        description: "{{description}}",
                        message: "විද්‍යුත් තැපැල් ආකෘති වර්ගය යාවත්කාලීන කිරීමේ දෝෂයකි."
                    },
                    genericError: {
                        description: "විද්‍යුත් තැපැල් ආකෘති වර්ගය යාවත්කාලීන කළ නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "විද්‍යුත් තැපැල් ආකෘති වර්ගය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "විද්‍යුත් තැපැල් ආකෘති වර්ගය යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "නව ආකෘති වර්ගය",
                    subtitles: {
                        0: "දැනට සැකිලි වර්ග නොමැත.",
                        1: "ඔබට නව අච්චු වර්ගයක් එක් කළ හැකිය",
                        2: "පහත බොත්තම ක්ලික් කරන්න."
                    },
                    title: "නව ආකෘති වර්ගය එක් කරන්න"
                },
                emptySearch: {
                    action: "සෙවුම් විමසුම හිස් කරන්න",
                    subtitles: "{{searchQuery}} සඳහා අපට කිසිදු ප්‍රතිපලයක් සොයාගත නොහැකි විය. "
                        + "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න.",
                    title: "ප්‍රතිපල හමු නොවීය"
                }
            },
            wizards: {
                addTemplateType: {
                    heading: "විද්‍යුත් තැපැල් ආකෘති වර්ගය සාදන්න",
                    steps: {
                        templateType: {
                            heading: "ආකෘති වර්ගය"
                        }
                    },
                    subHeading: "ඊමේල් අවශ්‍යතා සමඟ සම්බන්ධ වීමට නව අච්චු වර්ගයක් සාදන්න."
                }
            }
        },
        emailTemplates: {
            buttons: {
                deleteTemplate: "අච්චුව මකන්න",
                editTemplate: "සැකිල්ල සංස්කරණය කරන්න",
                newTemplate: "නව අච්චුව",
                viewTemplate: "අච්චුව බලන්න"
            },
            confirmations: {
                deleteTemplate: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{id}}</1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම විද්‍යුත් තැපැල් අච්චුව මකා දැමුවහොත්, සියලු සම්බන්ධිත වැඩ ප්‍රවාහයන්ට තවදුරටත්" +
                        " වැඩ කිරීමට වලංගු විද්‍යුත් තැපැල් අච්චුවක් නොමැත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර තෝරාගත් විද්‍යුත් තැපැල් අච්චුව"
                        + " ස්ථිරවම මකා දමනු ඇත."
                }
            },
            editor: {
                tabs: {
                    code: {
                        tabName: "HTML කේතය"
                    },
                    preview: {
                        tabName: "පෙරදසුන"
                    }
                }
            },
            list: {
                actions: "ක්‍රියා",
                name: "නම"
            },
            notifications: {
                createTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "විද්‍යුත් තැපැල් අච්චුවක් සෑදීමේ දෝෂයකි."
                    },
                    genericError: {
                        description: "විද්‍යුත් තැපැල් අච්චුවක් සෑදිය නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "විද්‍යුත් තැපැල් අච්චුව සාර්ථකව නිර්මාණය කළේය.",
                        message: "විද්‍යුත් තැපැල් අච්චුවක් සෑදීම සාර්ථකයි"
                    }
                },
                deleteTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "විද්‍යුත් තැපැල් අච්චුව මකාදැමීමේ දෝෂයකි."
                    },
                    genericError: {
                        description: "විද්‍යුත් තැපැල් අච්චුව මකා දැමිය නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "විද්‍යුත් තැපැල් අච්චුව සාර්ථකව මකා දමන ලදි.",
                        message: "විද්‍යුත් තැපැල් අච්චුව මකා දැමීම සාර්ථකයි"
                    }
                },
                getTemplateDetails: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "විද්‍යුත් තැපැල් ආකෘති විස්තර ලබා ගැනීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "විද්‍යුත් තැපැල් ආකෘති විස්තර සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                getTemplates: {
                    error: {
                        description: "{{description}}",
                        message: "නැවත ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "විද්‍යුත් තැපැල් සැකිලි ලබා ගැනීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "විද්‍යුත් තැපැල් සැකිලි සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "නැවත ලබා ගැනීම සාර්ථකයි"
                    }
                },
                iframeUnsupported: {
                    genericError: {
                        description: "ඔබගේ බ්‍රව්සරය iframes සඳහා සහය නොදක්වයි.",
                        message: "සහාය නොදක්වයි"
                    }
                },
                updateTemplate: {
                    error: {
                        description: "{{description}}",
                        message: "විද්‍යුත් තැපැල් අච්චුව යාවත්කාලීන කිරීමේ දෝෂයකි."
                    },
                    genericError: {
                        description: "විද්‍යුත් තැපැල් අච්චුව යාවත්කාලීන කළ නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "විද්‍යුත් තැපැල් අච්චුව සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "විද්‍යුත් තැපැල් අච්චු යාවත්කාලීන කිරීම සාර්ථකයි"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "නව අච්චුව",
                    subtitles: {
                        0: "තෝරාගත් අය සඳහා දැනට සැකිලි නොමැත",
                        1: "විද්‍යුත් තැපැල් ආකෘති වර්ගය. ඔබට නව අච්චුවක් එක් කළ හැකිය",
                        2: "පහත බොත්තම ක්ලික් කරන්න."
                    },
                    title: "අච්චුව එක් කරන්න"
                }
            },
            viewTemplate: {
                heading: "විද්‍යුත් තැපැල් ආකෘති පෙරදසුන"
            }
        },
        footer: {
            copyright: "WSO2 හැඳුනුම් සේවාදායකය © {{year}}"
        },
        governanceConnectors: {
            categories: "ප්රවර්ග",
            connectorSubHeading: "{{Name}} සැකසුම් වින්‍යාස කරන්න.",
            disabled: "අක්‍රීය කර ඇත",
            enabled: "සක්‍රීය කර ඇත",
            form: {
                errors: {
                    format: "ආකෘතිය වැරදිය.",
                    positiveIntegers: "අංකය 0 ට නොඅඩු විය යුතුය."
                }
            },
            notifications: {
                getConnector: {
                    error: {
                        description: "{{ description }}",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පාලන සම්බන්ධකය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                getConnectorCategories: {
                    error: {
                        description: "{{ description }}",
                        message: "ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පාලන සම්බන්ධක කාණ්ඩ ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "",
                        message: ""
                    }
                },
                updateConnector: {
                    error: {
                        description: "{{ description }}",
                        message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පාලන සම්බන්ධකය යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "{{name}} සම්බන්ධකය සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "යාවත්කාලීන කිරීම සාර්ථකයි."
                    }
                }
            },
            pageSubHeading: "{{ name }} වින්‍යාස කර කළමනාකරණය කරන්න."

        },
        groups: {
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "උදා. කණ්ඩායම් නම."
                        },
                        filterCondition: {
                            placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                        },
                        filterValue: {
                            placeholder: "සෙවීමට අගය ඇතුළත් කරන්න"
                        }
                    }
                },
                placeholder: "කණ්ඩායම් නාමයෙන් සොයන්න"
            },
            edit: {
                basics: {
                    fields: {
                        groupName: {
                            name: "කණ්ඩායම් නම",
                            placeholder: "ඔබගේ කණ්ඩායමේ නම ඇතුළත් කරන්න",
                            required: "කණ්ඩායම් නම අවශ්‍යයි"
                        }
                    }
                },
                roles: {
                    addRolesModal: {
                        heading: "කණ්ඩායම් භූමිකාවන් යාවත්කාලීන කරන්න",
                        subHeading: "නව භූමිකාවන් එක් කරන්න හෝ කණ්ඩායමට පවරා ඇති භූමිකාවන් ඉවත් කරන්න."
                    },
                    subHeading: "මෙම කණ්ඩායම විසින් පවරා ඇති භූමිකාවන් එකතු කිරීම හෝ ඉවත් කිරීම සහ " +
                        "මෙය ඇතැම් කාර්යයන් ඉටු කිරීමට බලපානු ඇති බව සලකන්න."
                }
            },
            list: {
                columns: {
                    actions: "ක්‍රියා",
                    lastModified: "අවසන් වරට වෙනස් කරන ලදි",
                    name: "නම"
                },
                storeOptions: "පරිශීලක වෙළඳසැල තෝරන්න"
            },
            notifications: {
                createGroup: {
                    error: {
                        description: "{{description}}",
                        message: "කණ්ඩායම නිර්මාණය කිරීමේදී දෝෂයක් ඇතිවිය."
                    },
                    genericError: {
                        description: "කණ්ඩායම නිර්මාණය කිරීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "කණ්ඩායම සාර්ථකව නිර්මාණය කරන ලදි.",
                        message: "කණ්ඩායම සාර්ථකව නිර්මාණය කරන ලදි."
                    }
                },
                createPermission: {
                    error: {
                        description: "{{description}}",
                        message: "කණ්ඩායමට අවසර එකතු කිරීමේදී දෝෂයක් ඇතිවිය."
                    },
                    genericError: {
                        description: "කණ්ඩායමට අවසර එකතු කළ නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "කණ්ඩායමට අවසර සාර්ථකව එකතු කරන ලදි.",
                        message: "කණ්ඩායම සාර්ථකව නිර්මාණය කරන ලදි."
                    }
                },
                deleteGroup: {
                    error: {
                        description: "{{description}}",
                        message: "තෝරාගත් කණ්ඩායම මකාදැමීමේ දෝෂයකි."
                    },
                    genericError: {
                        description: "තෝරාගත් කණ්ඩායම ඉවත් කිරීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "තෝරාගත් කණ්ඩායම සාර්ථකව මකා දමන ලදි.",
                        message: "කණ්ඩායම සාර්ථකව මකා දමන ලදි"
                    }
                },
                fetchGroups: {
                    genericError: {
                        description: "කණ්ඩායම් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    }
                },
                updateGroup: {
                    error: {
                        description: "{{description}}",
                        message: "තෝරාගත් කණ්ඩායම යාවත්කාලීන කිරීමේදී දෝෂයකි."
                    },
                    genericError: {
                        description: "තෝරාගත් කණ්ඩායම යාවත්කාලීන කළ නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "තෝරාගත් කණ්ඩායම සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "කණ්ඩායම සාර්ථකව යාවත්කාලීන කරන ලදි"
                    }
                }
            },
            placeholders: {
                groupsError: {
                    subtitles: [
                        "පරිශීලක වෙළඳසැලෙන් කණ්ඩායම් ලබා ගැනීමට උත්සාහ කිරීමේදී දෝෂයක් ඇතිවිය.",
                        "කරුණාකර පරිශීලක වෙළඳසැලේ සම්බන්ධතා තොරතුරු නිවැරදි බවට වග බලා ගන්න."
                    ],
                    title:"පරිශීලක වෙළඳසැලෙන් කණ්ඩායම් ලබා ගැනීමට නොහැකි විය"
                }
            }
        },
        header: {
            links: {
                devPortalNav: "සංවර්ධක ද්වාරය",
                userPortalNav: "මගේ ගිණුම"
            }
        },
        helpPanel: {
            notifications: {
                pin: {
                    success: {
                        description: "ඔබ පැහැදිලිව වෙනස් නොකළහොත් උපකාරක පැනලය සැමවිටම {{state}} වනු ඇත.",
                        message: "උදව් පැනලය {{state}}"
                    }
                }
            }
        },
        overview: {
            widgets: {
                insights: {
                    groups: {
                        heading: "කණ්ඩායම්",
                        subHeading: "කණ්ඩායම් පිළිබඳ දළ විශ්ලේෂණය"
                    },
                    users: {
                        heading: "පරිශීලකයින්",
                        subHeading: "පරිශීලකයින්ගේ දළ විශ්ලේෂණය"
                    }
                },
                overview: {
                    cards: {
                        groups: {
                            heading: "කණ්ඩායම්"
                        },
                        users: {
                            heading: "පරිශීලකයින්"
                        },
                        userstores: {
                            heading: "පරිශීලක වෙළඳසැල්"
                        }
                    },
                    heading: "දළ විශ්ලේෂණය",
                    subHeading: "නිදසුනෙහි තත්වය අවබෝධ කර ගැනීම සඳහා මූලික සංඛ්‍යාලේඛන සමූහය."
                },
                quickLinks: {
                    cards: {
                        certificates: {
                            heading: "සහතික",
                            subHeading: "යතුරු ගබඩාවේ සහතික කළමනාකරණය කරන්න."
                        },
                        dialects: {
                            heading: "උපභාෂා ආරෝපණය කරන්න",
                            subHeading: "ගුණාංග උපභාෂා කළමනාකරණය කරන්න."
                        },
                        emailTemplates: {
                            heading: "විද්‍යුත් තැපැල් ආකෘති",
                            subHeading: "විද්‍යුත් තැපැල් සැකිලි කළමනාකරණය කරන්න."
                        },
                        generalConfigs: {
                            heading: "සාමාන්‍ය වින්‍යාසයන්",
                            subHeading: "වින්‍යාස කිරීම්, ප්‍රතිපත්ති ආදිය කළමනාකරණය කරන්න."
                        },
                        groups: {
                            heading: "කණ්ඩායම්",
                            subHeading: "පරිශීලක කණ්ඩායම් සහ අවසර කළමනාකරණය කරන්න."
                        },
                        roles: {
                            heading: "භූමිකාවන්",
                            subHeading: "පරිශීලක භූමිකාවන් සහ අවසර කළමනාකරණය කරන්න."
                        }
                    },
                    heading: "ඉක්මන් සබැඳි",
                    subHeading: "විශේෂාංග වෙත ඉක්මනින් සැරිසැරීමට සබැඳි."
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
                            0: "WSO2 IS ඔබගේ ගිණුමට සැක සහිත පිවිසුම් උත්සාහයන් හඳුනා ගැනීමට ඔබගේ"
                                + " IP ලිපිනය භාවිතා කරයි.",
                            1: "WSO2 IS පොහොසත් සහ පුද්ගලාරෝපිත පරිශීලක අත්දැකීමක් ලබා දීම සඳහා ඔබේ " +
                                "මුල් නම, අවසාන නම වැනි ගුණාංග භාවිතා කරයි.",
                            2: "WSO2 IS ඔබගේ ආරක්ෂක ප්‍රශ්න සහ පිළිතුරු භාවිතා කරන්නේ ගිණුම්"
                                + " ප්‍රතිසාධනය සඳහා පමණි."
                        },
                        para1: "WSO2 IS ඔබේ තොරතුරු රැස් කරන්නේ ඔබේ ප්‍රවේශ අවශ්‍යතා සපුරාලීම"
                            + " සඳහා පමණි. උදාහරණයක් වශයෙන්"
                    },
                    heading: "පුද්ගලික තොරතුරු එකතු කිරීම",
                    trackingTechnologies: {
                        description: {
                            list1: {
                                0: "ඔබ ඔබේ පුද්ගලික දත්ත ඇතුළත් කරන පරිශීලක පැතිකඩ පිටුවෙන්" +
                                    " තොරතුරු රැස් කිරීම.",
                                1: "HTTP ඉල්ලීම, HTTP ශීර්ෂයන් සහ TCP / IP සමඟ ඔබගේ IP ලිපිනය සොයා ගැනීම.",
                                2: "ඔබගේ භූගෝලීය තොරතුරු IP ලිපිනය සමඟ ලුහුබැඳීම.",
                                3: "ඔබගේ පිවිසුම් ඉතිහාසය බ්‍රව්සර් කුකී සමඟ ලුහුබැඳීම. වැඩි විස්තර " +
                                    "සඳහා කරුණාකර අපගේ {{cookiePolicyLink} බලන්න."
                            },
                            para1: "WSO2 IS විසින් ඔබේ තොරතුරු රැස් කරයි"
                        },
                        heading: "ලුහුබැඳීමේ තාක්ෂණයන්"
                    }
                },
                description: {
                    para1: "මෙම ප්‍රතිපත්තියෙන් WSO2 IS ඔබේ පුද්ගලික තොරතුරු, එකතු කිරීමේ අරමුණු සහ ඔබේ " +
                        "පුද්ගලික තොරතුරු රඳවා තබා ගැනීම පිළිබඳ තොරතුරු ග්‍රහණය කරගන්නේ කෙසේද" +
                        " යන්න විස්තර කරයි.",
                    para2: "මෙම ප්‍රතිපත්තිය යොමු කිරීම සඳහා පමණක් වන අතර එය නිෂ්පාදනයක් ලෙස මෘදුකාංගයට" +
                        " අදාළ වන බව කරුණාවෙන් සලකන්න. WSO2 Inc. සහ එහි සංවර්ධකයින්ට WSO2 IS තුළ ඇති" +
                        " තොරතුරු වෙත ප්‍රවේශයක් නොමැත. වැඩි විස්තර සඳහා"
                            + " කරුණාකර <1> වියාචනය </ 1> කොටස බලන්න.",
                    para3: "WSO2 IS හි භාවිතය සහ පරිපාලනය පාලනය කරන ආයතන, සංවිධාන හෝ පුද්ගලයින් " +
                        "අදාළ ආයතනය, සංවිධානය හෝ පුද්ගලයා විසින් දත්ත පාලනය කරන හෝ සකසන ආකාරය " +
                        "සැකසෙන තමන්ගේම රහස්‍යතා ප්‍රතිපත්ති නිර්මාණය කළ යුතුය."
                },
                disclaimer: {
                    description: {
                        list1: {
                            0: "WSO2, එහි සේවකයින්, හවුල්කරුවන් සහ අනුබද්ධ සමාගම්වලට WSO2 IS හි අඩංගු" +
                                " පුද්ගලික දත්ත ඇතුළුව කිසිදු දත්තයකට ප්‍රවේශ වීමට අවශ්‍ය නොවන අතර ගබඩා කිරීම," +
                                " සැකසීම හෝ පාලනය කිරීම අවශ්‍ය නොවේ. පුද්ගලික දත්ත ඇතුළුව සියලුම දත්ත " +
                                "පාලනය කරනු ලබන්නේ සහ සැකසෙන්නේ WSO2 IS ආයතනය විසිනි. WSO2, එහි සේවක" +
                                " හවුල්කරුවන් සහ අනුබද්ධයන් කිසිදු දත්ත රහස්‍යතා රෙගුලාසි වල අර්ථය තුළ දත්ත " +
                                "සකසනයක් හෝ දත්ත පාලකයක් නොවේ. WSO2 එවැනි ආයතන හෝ පුද්ගලයින් විසින් WSO2" +
                                " IS භාවිතා කරනු ලබන නීත්‍යානුකූල භාවය හෝ WSO2 IS භාවිතා කරන ආකාරය සහ " +
                                "අරමුණු සම්බන්ධයෙන් කිසිදු වගකීමක් හෝ වගකීමක් හෝ වගකීමක් භාර නොගනී.",
                            1: "මෙම රහස්‍යතා ප්‍රතිපත්තිය WSO2 IS ක්‍රියාත්මක වන ආයතනයේ හෝ පුද්ගලයන්ගේ " +
                                "තොරතුරු අරමුණු සඳහා වන අතර පුද්ගලික දත්ත ආරක්ෂණය සම්බන්ධයෙන් WSO2 IS " +
                                "තුළ අඩංගු ක්‍රියාවලීන් සහ ක්‍රියාකාරිත්වය නියම කරයි. WSO2 IS පවත්වාගෙන යන " +
                                "ආයතනවල සහ පුද්ගලයන්ගේ වගකීම වන්නේ පරිශීලකයින්ගේ පුද්ගලික දත්ත " +
                                "පාලනය කරන තමන්ගේම නීති රීති සහ ක්‍රියාවලීන් නිර්මාණය" +
                                "කිරීම සහ පරිපාලනය කිරීමයි. එවැනි නීතිරීති හා ක්‍රියාවලීන් " +
                                "මෙහි අඩංගු භාවිතය, ගබඩා කිරීම සහ අනාවරණය කිරීමේ " +
                                "ප්‍රතිපත්ති වෙනස් කළ හැකිය. එබැවින් පරිශීලකයින්ගේ පුද්ගලික දත්ත පාලනය කරන " +
                                "තොරතුරු සඳහා පරිශීලකයින් එහි පුද්ගලිකත්ව ප්‍රතිපත්තියක් සඳහා WSO2 IS ධාවනය " +
                                "කරන පුද්ගලයින්ගෙන් හෝ පුද්ගලයින්ගෙන් උපදෙස් ලබා ගත යුතුය."
                        }
                    },
                    heading: "වියාචනය"
                },
                disclosureOfPersonalInfo: {
                    description: "WSO2 IS විසින් WSO2 IS හි ලියාපදිංචි කර ඇති අදාළ යෙදුම් වලට (සේවා " +
                        "සැපයුම්කරු ලෙසද හැඳින්වේ) පුද්ගලික තොරතුරු පමණක් අනාවරණය කරයි. මෙම අයදුම්පත් " +
                        "ලියාපදිංචි කර ඇත්තේ ඔබේ ආයතනයේ හෝ සංවිධානයේ අනන්‍යතා පරිපාලක විසිනි. පුද්ගලික " +
                        "තොරතුරු අනාවරණය වන්නේ ඔබ විසින් වෙනත් ආකාරයකින් කැමැත්ත ප්‍රකාශ කර නොමැති " +
                        "නම් හෝ නීතියෙන් අවශ්‍ය වන ස්ථානයක මිස, එවැනි සේවා සපයන්නන් විසින් පාලනය කරනු " +
                        "ලබන, එකතු කරන ලද අරමුණු සඳහා (හෝ එම අරමුණට අනුකූල යැයි හඳුනාගත් " +
                        "භාවිතයක් සඳහා) පමණි.",
                    heading: "පුද්ගලික තොරතුරු අනාවරණය කිරීම",
                    legalProcess: {
                        description: "WSO2 IS ආයතනයට, ආයතනයට හෝ පුද්ගලිකව ක්‍රියාත්මක වන පුද්ගලයාට ඔබේ " +
                            "පුද්ගලික තොරතුරු නීතියෙන් නියම කළ යුතු හා නීත්‍යානුකූල ක්‍රියාවලියක් අවශ්‍ය වූ විට " +
                            "ඔබේ කැමැත්තෙන් හෝ නැතිව අනාවරණය කිරීමට බල කෙරෙනු ඇති බව " +
                            "කරුණාවෙන් සලකන්න.",
                        heading: "නීති ක්‍රියාවලිය"
                    }
                },
                heading: "රහස්යතා ප්රතිපත්තිය",
                moreInfo: {
                    changesToPolicy: {
                        description: {
                            para1: "WSO2 IS හි යාවත්කාලීන කරන ලද අනුවාද වල මෙම ප්‍රතිපත්තියේ වෙනස්කම් අඩංගු " +
                                "විය හැකි අතර මෙම ප්‍රතිපත්තියේ සංශෝධන එවැනි වැඩිදියුණු කිරීම් තුළ ඇසුරුම් කරනු " +
                                "ලැබේ. එවැනි වෙනස්කම් අදාළ වන්නේ නවීකරණය කරන ලද අනුවාදයන් භාවිතා කිරීමට" +
                                " තෝරා ගන්නා පරිශීලකයින්ට පමණි.",
                            para2: "WSO2 IS පවත්වාගෙන යන සංවිධානය වරින් වර රහස්‍යතා ප්‍රතිපත්තිය සංශෝධනය " +
                                "කළ හැකිය. WSO2 IS ක්‍රියාත්මක වන සංවිධානය විසින් සපයනු ලබන අදාළ සබැඳිය " +
                                "සමඟ ඔබට නවතම පාලන ප්‍රතිපත්තිය සොයාගත හැකිය. අපගේ නිල පොදු නාලිකා " +
                                "හරහා රහස්‍යතා ප්‍රතිපත්තියේ යම් වෙනසක් සංවිධානය විසින් දැනුම් දෙනු ඇත."
                        },
                        heading: "මෙම ප්‍රතිපත්තියේ වෙනස්කම්"
                    },
                    contactUs: {
                        description: {
                            para1: "මෙම රහස්‍යතා ප්‍රතිපත්තිය සම්බන්ධයෙන් ඔබට කිසියම් ප්‍රශ්නයක් හෝ ප්‍රශ්නයක් " +
                                "ඇත්නම් කරුණාකර WSO2 අමතන්න."
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
                            para1: "ඔබ අපගේ පද්ධතියේ ක්‍රියාකාරී පරිශීලකයෙකු වන තාක් WSO2 IS ඔබේ පුද්ගලික " +
                                "දත්ත රඳවා තබා ගනී. ලබා දී ඇති ස්වයං රැකවරණ පරිශීලක ද්වාර භාවිතා කරමින් ඔබට" +
                                " ඕනෑම වේලාවක ඔබේ පුද්ගලික දත්ත යාවත්කාලීන කළ හැකිය.",
                            para2: "WSO2 IS මඟින් ඔබට අමතර මට්ටමේ ආරක්ෂාවක් ලබා දීම සඳහා රහසිගත රහස් තබා " +
                                "ගත හැකිය. මෙම ඇතුළත්:"
                        },
                        heading: "ඔබේ පුද්ගලික තොරතුරු කොපමණ කාලයක් රඳවා තබා ගනීද?"
                    },
                    requestRemoval: {
                        description: {
                            para1: "ඔබට ඔබගේ ගිණුම මැකීමට පරිපාලක ඉල්ලා සිටිය හැක. පරිපාලකයා යනු ඔබ " +
                                "යටතේ ලියාපදිංචි වී ඇති කුලී නිවැසියන්ගේ පරිපාලකයා හෝ ඔබ " +
                                "කුලී නිවැසියන්ගේ ලක්ෂණය භාවිතා නොකරන්නේ නම් සුපිරි පරිපාලකයා ය.",
                            para2: "මීට අමතරව, WSO2 IS ල logs ු-සටහන්, දත්ත සමුදායන් හෝ විශ්ලේෂණ ආචයනයන් " +
                                "තුළ රඳවාගෙන ඇති ඔබගේ ක්‍රියාකාරකම්වල සියලු අංශ නිර්නාමික කිරීමට" +
                                " ඔබට ඉල්ලිය හැකිය."
                        },
                        heading: "ඔබගේ පුද්ගලික තොරතුරු ඉවත් කිරීමට ඉල්ලන්නේ කෙසේද"
                    },
                    where: {
                        description: {
                            para1: "WSO2 IS ඔබගේ පුද්ගලික තොරතුරු ආරක්ෂිත දත්ත ගබඩාවල ගබඩා කරයි. WSO2 IS " +
                                "ඔබේ පුද්ගලික තොරතුරු තබා ඇති දත්ත සමුදාය ආරක්ෂා කිරීම සඳහා නිසි කර්මාන්ත " +
                                "පිළිගත් ආරක්ෂක පියවරයන් ක්‍රියාත්මක කරයි. WSO2 IS යනු නිෂ්පාදනයක් " +
                                "ලෙස ඔබේ දත්ත කිසිදු තෙවන පාර්ශවයක් හෝ ස්ථානයක් සමඟ හුවමාරු නොකරයි.",
                            para2: "WSO2 IS ඔබේ පුද්ගලික දත්ත අමතර මට්ටමේ ආරක්ෂාවක් සහිතව තබා " +
                                "ගැනීමට සංකේතනය භාවිතා කරයි."
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
                                "තොරතුරක් තබා නොගනී. එබැවින් සංඛ්‍යාලේඛන වාර්තාවට තනි පුද්ගලයෙකු හඳුනා"
                                    + " ගැනීමට ක්‍රමයක් නොමැත."
                        },
                        para1: "WSO2 IS ඔබේ පුද්ගලික තොරතුරු භාවිතා කරනු ලැබුවේ එය එකතු කරන ලද අරමුණු " +
                            "සඳහා පමණි (හෝ එම අරමුණු වලට අනුකූල බව හඳුනාගත් භාවිතය සඳහා).",
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
                                1: "බ්‍රව්සර් තාක්‍ෂණය හෝ / සහ අනුවාදය තීරණය කිරීම සඳහා බ්‍රව්සරයේ ඇඟිලි සලකුණු"
                            }
                        }
                    },
                    heading: "පුද්ගලික තොරතුරු භාවිතය"
                },
                whatIsPersonalInfo: {
                    description: {
                        list1: {
                            0: "ඔබේ පරිශීලක නාමය (ඔබේ සේවායෝජකයා විසින් නිර්මාණය කරන ලද " +
                                "පරිශීලක නාමය ගිවිසුම්ගතව ඇති අවස්ථා හැර))",
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
                            "කරයි, නමුත් එය භාවිතා කරනුයේ <1> සංඛ්‍යාන </ 1> අරමුණු සඳහා පමණි. " +
                            "එයට හේතුව මෙම තොරතුරු ඔබව ලුහුබැඳීමට භාවිතා කළ නොහැකි වීමයි."
                    },
                    heading: "පුද්ගලික තොරතුරු යනු කුමක්ද?"
                }
            }
        },
        roles: {
            addRoleWizard: {
                buttons: {
                    finish: "අවසන් කරන්න",
                    next: "ලබන",
                    previous: "කලින්"
                },
                forms: {
                    roleBasicDetails: {
                        domain: {
                            label: {
                                group: "පරිශීලක වෙළඳසැල",
                                role: "භූමිකාව වර්ගය"
                            },
                            placeholder: "වසම්",
                            validation: {
                                empty: {
                                    group: "පරිශීලක ගබඩාව තෝරන්න",
                                    role: "භූමිකාව වර්ගය තෝරන්න"
                                }
                            }
                        },
                        roleName: {
                            label: "{{type}} නම",
                            placeholder: "Enter {{type}} නම ඇතුළත් කරන්න",
                            validations: {
                                duplicate: "දී ඇති {{type}} with නම සමඟ {{type}} දැනටමත් පවතී.",
                                empty: "ඉදිරියට යාමට {{type}} නම අවශ්‍ය වේ.",
                                invalid: "කරුණාකර වලංගු {{type}} නමක් ඇතුළත් කරන්න."
                            }
                        }
                    }
                },
                heading: "{{Type}} සාදන්න",
                permissions: {
                    buttons: {
                        collapseAll: "සියල්ල හකුලන්න",
                        expandAll: "සියල්ල පුළුල් කරන්න",
                        update: "යාවත්කාලීන කරන්න"
                    }
                },
                subHeading: "නිශ්චිත අවසරයන් සහිතව පද්ධතිය තුළ නව {{වර්ගයේ} create සාදන්න",
                summary: {
                    labels: {
                        domain: {
                            group: "පරිශීලක වෙළඳසැල",
                            role: "භූමිකාව වර්ගය"
                        },
                        groups: "පවරා ඇති කණ්ඩායම් (ය)",
                        permissions: "අවසර (ය)",
                        roleName: "{{type}} නම",
                        users: "පවරා ඇති පරිශීලකයින් (ය)"
                    }
                },
                users: {
                    assignUserModal: {
                        heading: "යාවත්කාලීන කරන්න {{type}} පරිශීලකයින්",
                        list: {
                            listHeader: "නම",
                            searchPlaceholder: "පරිශීලකයින් සොයන්න"
                        },
                        subHeading: "නව පරිශීලකයින් එක් කරන්න හෝ  {{type}} වෙත පවරා ඇති පවතින"
                            + " පරිශීලකයින් ඉවත් කරන්න."
                    }
                },
                wizardSteps: {
                    0: "මූලික විස්තර",
                    1: "අවසර තෝරා ගැනීම",
                    2: "පරිශීලකයින් යොදවන්න",
                    3: "සාරාංශය",
                    4: "කණ්ඩායම් සහ පරිශීලකයින්",
                    5: "භූමිකාවන් පවරන්න"
                }
            },
            advancedSearch: {
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "උදා. භූමිකාවේ නම."
                        },
                        filterCondition: {
                            placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                        },
                        filterValue: {
                            placeholder: "සෙවීමට අගය ඇතුළත් කරන්න"
                        }
                    }
                },
                placeholder: "භූමිකාවේ නම අනුව සොයන්න"
            },
            edit: {
                basics: {
                    buttons: {
                        update: "යාවත්කාලීන කරන්න"
                    },
                    confirmation: {
                        assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{roleName}}</1> ටයිප් කරන්න.",
                        content: "ඔබ මෙම {{type}} මකා දැමුවහොත්, එයට අනුයුක්ත කර ඇති අවසරයන් මකා දැමෙනු "
                            + "ඇති අතර එයට අනුයුක්ත කර ඇති පරිශීලකයින්ට කලින් අවසර දී ඇති අපේක්ෂිත ක්‍රියා සිදු "
                            + "කිරීමට තවදුරටත් නොහැකි වනු ඇත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න",
                        header: "ඔබට විශ්වාසද?",
                        message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර තෝරාගත් {{type}} ස්ථිරවම මකා දමනු ඇත."
                    },
                    dangerZone: {
                        actionTitle: "{{type}} මකන්න",
                        header: "{{type}} මකන්න",
                        subheader: "ඔබ {{type}} මකා දැමූ පසු, ආපසු යාමක් නොමැත. කරුණාකර ස්ථිර වන්න."
                    },
                    fields: {
                        roleName: {
                            name: "භූමිකාවේ නම",
                            placeholder: "ඔබගේ භූමිකාවේ නම ඇතුළත් කරන්න",
                            required: "භූමිකාවේ නම අවශ්‍යයි"
                        }
                    }
                },
                groups: {
                    addGroupsModal: {
                        heading: "කාර්යභාර කණ්ඩායම් යාවත්කාලීන කරන්න",
                        subHeading: "නව කණ්ඩායම් එකතු කරන්න හෝ භූමිකාවට පවරා ඇති පවතින"
                            + " කණ්ඩායම් ඉවත් කරන්න."
                    },
                    emptyPlaceholder: {
                        action: "කණ්ඩායම පවරන්න",
                        subtitles: "මේ වන විට මෙම භූමිකාවට කිසිදු කණ්ඩායමක් පවරා නොමැත.",
                        title: "කණ්ඩායම් පවරා නොමැත"
                    },
                    heading: "පවරා ඇති කණ්ඩායම්",
                    subHeading: "මෙම භූමිකාවට පවරා ඇති කණ්ඩායම් එකතු කරන්න හෝ ඉවත් කරන්න. "
                        + "මෙය ඇතැම් කාර්යයන් ඉටු කිරීමට බලපානු ඇති බව සලකන්න."
                },
                menuItems: {
                    basic: "මූලික කරුණු",
                    groups: "කණ්ඩායම්",
                    permissions: "අවසර",
                    roles: "භූමිකාවන්",
                    users: "පරිශීලකයින්"
                },
                users: {
                    list: {
                        emptyPlaceholder: {
                            action: "පරිශීලකයා පවරන්න",
                            subtitles: "මේ මොහොතේ {{type}} to සඳහා පරිශීලකයින් පවරා නොමැත.",
                            title: "පරිශීලකයින් පවරා නොමැත"
                        },
                        header: "පරිශීලකයින්"
                    }
                }
            },
            list: {
                buttons: {
                    addButton: "නව {{type}}",
                    filterDropdown: "පෙරණය"
                },
                columns: {
                    actions: "ක්‍රියා",
                    lastModified: "අවසන් වරට වෙනස් කරන ලදි",
                    name: "නම"
                },
                confirmations: {
                    deleteItem: {
                        assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{roleName}}</1> ටයිප් කරන්න.",
                        content: "ඔබ මෙම {{type}} මකා දැමුවහොත්, එයට අනුයුක්ත කර ඇති අවසරයන් මකා දැමෙනු " +
                            "ඇති අතර එයට අනුයුක්ත කර ඇති පරිශීලකයින්ට කලින් අවසර දී ඇති අපේක්ෂිත " +
                            "ක්‍රියා සිදු කිරීමට තවදුරටත් නොහැකි වනු ඇත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                        header: "ඔබට විශ්වාසද?",
                        message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර තෝරාගත් {{type}} ස්ථිරවම මකා දමනු ඇත."
                    }
                },
                emptyPlaceholders: {
                    emptyRoleList: {
                        action: "නව {{type}}",
                        subtitles: {
                            0: "දැනට {{type}} නොමැත.",
                            1: "පහත දැක්වෙන දේ අනුගමනය කිරීමෙන් ඔබට පහසුවෙන් නව {{type}} එකතු කළ හැකිය",
                            2: "{{type}} නිර්මාණ විශාරදයේ පියවර."
                        },
                        title: "නව {{type}} එකතු කරන්න"
                    },
                    search: {
                        action: "සෙවුම් විමසුම හිස් කරන්න",
                        subtitles: {
                            0: "{{type}} සඳහා අපට කිසිදු ප්‍රතිපලයක් සොයාගත නොහැකි විය",
                            1: "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න."
                        },
                        title: "ප්‍රතිපල හමු නොවීය"
                    }
                },
                popups: {
                    delete: "{{type}} delete මකන්න",
                    edit: "{{type}} සංස්කරණය කරන්න"
                }
            },
            notifications: {
                createPermission: {
                    error: {
                        description: "{{description}}",
                        message: "භූමිකාවට අවසර එකතු කිරීමේදී දෝෂයක් ඇතිවිය."
                    },
                    genericError: {
                        description: "භූමිකාවට අවසර එකතු කළ නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "භූමිකාවට අවසර සාර්ථකව එකතු කරන ලදි.",
                        message: "භූමිකාව සාර්ථකව නිර්මාණය විය."
                    }
                },
                createRole: {
                    error: {
                        description: "{{description}}",
                        message: "භූමිකාව නිර්මාණය කිරීමේදී දෝෂයක් ඇතිවිය."
                    },
                    genericError: {
                        description: "භූමිකාව නිර්මාණය කිරීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "භූමිකාව සාර්ථකව නිර්මාණය විය.",
                        message: "භූමිකාව සාර්ථකව නිර්මාණය විය."
                    }
                },
                deleteRole: {
                    error: {
                        description: "{{description}}",
                        message: "තෝරාගත් භූමිකාව මකාදැමීමේ දෝෂයකි."
                    },
                    genericError: {
                        description: "තෝරාගත් භූමිකාව ඉවත් කිරීමට නොහැකි විය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "තෝරාගත් භූමිකාව සාර්ථකව මකා දමන ලදි.",
                        message: "කාර්යභාරය සාර්ථකව මකා දමන ලදි"
                    }
                },
                fetchRoles: {
                    genericError: {
                        description: "භූමිකාවන් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    }
                },
                updateRole: {
                    error: {
                        description: "{{description}}",
                        message: "තෝරාගත් භූමිකාව යාවත්කාලීන කිරීමේදී දෝෂයකි."
                    },
                    genericError: {
                        description: "තෝරාගත් භූමිකාව යාවත්කාලීන කළ නොහැක.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "තෝරාගත් භූමිකාව සාර්ථකව යාවත්කාලීන කරන ලදි.",
                        message: "කාර්යභාරය සාර්ථකව යාවත්කාලීන කරන ලදි"
                    }
                }
            }
        },
        serverConfigs: {
            realmConfiguration: {
                actionTitles: {
                    config: "තව"
                },
                confirmation: {
                    heading: "තහවුරු කිරීම",
                    message: "රාජධානියට අදාළ වින්‍යාසයන් සුරැකීමට ඔබ කැමතිද?"
                },
                description: "රාජධානියට අදාළ මූලික වින්‍යාසයන් වින්‍යාස කරන්න.",
                form: {
                    homeRealmIdentifiers: {
                        hint: "ගෘහස්ථ හඳුනාගැනීමේ යන්ත්‍රය ඇතුළත් කරන්න. බහු හඳුනාගැනීම් සඳහා අවසර ඇත.",
                        label: "ගෘහස්ථ හඳුනාගැනීම්",
                        placeholder: "localhost"
                    },
                    idleSessionTimeoutPeriod: {
                        hint: "නිෂ්ක්‍රීය සැසි කල් ඉකුත්වීම මිනිත්තු කිහිපයකින් ඇතුළත් කරන්න",
                        label: "නිෂ්ක්‍රීය සැසි කාලය අවසන්"
                    },
                    rememberMePeriod: {
                        hint: "මතක තබා ගැනීමේ කාල සීමාව මිනිත්තු කිහිපයකින් ඇතුළත් කරන්න",
                        label: "මාව මතක තබා ගන්න"
                    }
                },
                heading: "තාත්වික වින්‍යාසයන්",
                notifications: {
                    emptyHomeRealmIdentifiers: {
                        error: {
                            description: "ඔබ අවම වශයෙන් එක් නිවාස ක්ෂේත්‍ර හඳුනාගැනීමක් ප්‍රකාශ කළ යුතුය.",
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
                    getConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "ලබා ගැනීමේ දෝෂයකි"
                        },
                        genericError: {
                            description: "රාජධානියේ වින්‍යාසයන් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "",
                            message: ""
                        }
                    },
                    updateConfigurations: {
                        error: {
                            description: "{{ description }}",
                            message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                        },
                        genericError: {
                            description: "තාත්වික වින්‍යාසයන් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                            message: "යාවත්කාලීන කිරීමේ දෝෂයකි"
                        },
                        success: {
                            description: "රාජධානියේ වින්‍යාසයන් සාර්ථකව යාවත්කාලීන කරන ලදි.",
                            message: "යාවත්කාලීන කිරීම සාර්ථකයි"
                        }
                    }
                }
            }
        },
        sidePanel: {
            addEmailTemplate: "විද්‍යුත් තැපැල් අච්චුව එක් කරන්න",
            addEmailTemplateLocale: "විද්‍යුත් තැපැල් ආකෘති පෙදෙසි එක් කරන්න",
            approvals: "අනුමත කිරීම්",
            attributeDialects: "උපභාෂා ආරෝපණය කරන්න",
            categories: {
                attributes: "ගුණාංග",
                certificates: "සහතික",
                configurations: "වින්‍යාස කිරීම්",
                general: "ජනරාල්",
                users: "පරිශීලකයින්",
                userstores: "පරිශීලක වෙළඳසැල්"
            },
            certificates: "සහතික",
            configurations: "වින්‍යාස කිරීම්",
            editEmailTemplate: "විද්‍යුත් තැපැල් ආකෘති",
            editExternalDialect: "බාහිර උපභාෂාව සංස්කරණය කරන්න",
            editGroups: "කණ්ඩායම සංස්කරණය කරන්න",
            editLocalClaims: "දේශීය හිමිකම් සංස්කරණය කරන්න",
            editRoles: "භූමිකාව සංස්කරණය කරන්න",
            editUsers: "පරිශීලක සංස්කරණය කරන්න",
            editUserstore: "පරිශීලක වෙළඳසැල සංස්කරණය කරන්න",
            emailTemplateTypes: "",
            emailTemplates: "විද්‍යුත් තැපැල් ආකෘති",
            generalConfigurations: "ජනරාල්",
            groups: "කණ්ඩායම්",
            localDialect: "දේශීය උපභාෂාව",
            overview: "දළ විශ්ලේෂණය",
            privacy: "පෞද්ගලිකත්වය",
            roles: "භූමිකාවන්",
            users: "පරිශීලකයින්",
            userstoreTemplates: "පරිශීලක වෙළඳසැල් සැකිලි",
            userstores: "පරිශීලක වෙළඳසැල්"
        },
        transferList: {
            list: {
                emptyPlaceholders: {
                    default: "මේ වන විට මෙම ලැයිස්තුවේ අයිතම නොමැත.",
                    groups: {
                        selected: "මෙම කණ්ඩායමට පවරා ඇති {{type}} නොමැත.",
                        unselected: "මෙම කණ්ඩායමට පැවරීම සඳහා {{type}} නොමැත."
                    },
                    roles: {
                        selected: "මෙම භූමිකාව සමඟ පවරා ඇති {{type}} නොමැත.",
                        unselected: "මෙම භූමිකාව සමඟ පැවරීම සඳහා {{type}} නොමැත."
                    },
                    users: {
                        roles: {
                            selected: "මෙම පරිශීලකයාට {{type}} පවරා නොමැත.",
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
        },
        user: {
            deleteUser: {
                confirmationModal: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{userName}}</1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම පරිශීලකයා මකා දැමුවහොත්, පරිශීලකයාට මගේ ගිණුමට හෝ පරිශීලකයා මීට " +
                        "පෙර දායක වූ වෙනත් යෙදුමකට ප්‍රවේශ විය නොහැක. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර එය පරිශීලකයා ස්ථිරවම මකා දමනු ඇත."
                }
            },
            disableUser: {
                confirmationModal: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{userName}}</1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම පරිශීලකයා අක්‍රීය කළහොත්, පරිශීලකයාට මගේ ගිණුමට හෝ පරිශීලකයා මීට " +
                        "පෙර දායක වූ වෙනත් යෙදුමකට ප්‍රවේශ විය නොහැක. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "පරිශීලකයාට තවදුරටත් පද්ධතියට ප්‍රවේශය අවශ්‍ය නොවන බවට වග බලා ගන්න."
                }
            },
            editUser: {
                dangerZoneGroup: {
                    deleteUserZone: {
                        actionTitle: "පරිශීලකයා මකන්න",
                        header: "පරිශීලකයා මකන්න",
                        subheader: "ඔබ පරිශීලකයෙකු මකා දැමූ පසු, ආපසු යාමක් නොමැත. කරුණාකර ස්ථිර වන්න."
                    },
                    disableUserZone: {
                        actionTitle: "පරිශීලකයා අක්‍රීය කරන්න",
                        header: "පරිශීලකයා අක්‍රීය කරන්න",
                        subheader: "ඔබ ගිණුමක් අක්‍රිය කළ පසු, පරිශීලකයාට පද්ධතියට ප්‍රවේශ විය නොහැක. " +
                            "කරුණාකර ස්ථිර වන්න."
                    },
                    header: "අන්තරා කලාපය",
                    lockUserZone: {
                        actionTitle: "අගුළු පරිශීලකයා",
                        header: "අගුළු පරිශීලකයා",
                        subheader: "ඔබ ගිණුම අගුළු දැමූ පසු, පරිශීලකයාට තවදුරටත් පද්ධතියට ප්‍රවේශ විය නොහැක. " +
                            "කරුණාකර ස්ථිර වන්න."
                    }
                }
            },
            forms: {
                addUserForm: {
                    buttons: {
                        radioButton: {
                            label: "පරිශීලක මුරපදය සැකසීමේ ක්‍රමය තෝරන්න",
                            options: {
                                askPassword: "මුරපදය සැකසීමට පරිශීලකයාට ආරාධනා කරන්න",
                                createPassword: "පරිශීලක මුරපදය සකසන්න"

                            }
                        }
                    },
                    inputs: {
                        confirmPassword: {
                            label: "මුරපදය තහවුරු කරන්න",
                            placeholder: "නව මුරපදය ඇතුළත් කරන්න",
                            validations: {
                                empty: "මුරපදය තහවුරු කිරීම අත්‍යවශ්‍ය ක්ෂේත්‍රයකි",
                                mismatch: "මුරපද තහවුරු කිරීම නොගැලපේ"
                            }
                        },
                        domain: {
                            label: "Userstore",
                            placeholder: "පරිශීලක ගබඩාව තෝරන්න",
                            validations: {
                                empty: "User store name cannot be empty."
                            }
                        },
                        email: {
                            label: "විද්යුත් තැපැල් ලිපිනය",
                            placeholder: "ඊමේල් ලිපිනය ඇතුළත් කරන්න",
                            validations: {
                                empty: "විද්‍යුත් තැපැල් ලිපිනය හිස් විය නොහැක",
                                invalid: "කරණාකර වලංගු ඊතැපැල් ලිපිනයක් ඇතුළු කරන්න"
                            }
                        },
                        firstName: {
                            label: "මුල් නම",
                            placeholder: "ඔබේ මුල් නම ඇතුළත් කරන්න",
                            validations: {
                                empty: "පළමු නම අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
                            }
                        },
                        lastName: {
                            label: "අවසන් නම",
                            placeholder: "ඔබගේ අවසාන නම ඇතුළත් කරන්න",
                            validations: {
                                empty: "අවසාන නම අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
                            }
                        },
                        newPassword: {
                            label: "නව මුරපදය",
                            placeholder: "නව මුරපදය ඇතුළත් කරන්න",
                            validations: {
                                empty: "නව මුරපදය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි",
                                regExViolation: "කරුණාකර වලංගු මුරපදයක් ඇතුළත් කරන්න"
                            }
                        },
                        username: {
                            label: "පරිශීලක නාමය",
                            placeholder: "පරිශීලක නාමය ඇතුළත් කරන්න",
                            validations: {
                                empty: "පරිශීලක නාමය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි",
                                invalid: "මෙම පරිශීලක නාමය සමඟ පරිශීලකයෙකු දැනටමත් සිටී.",
                                invalidCharacters: "පරිශීලක නාමය අවලංගු අක්ෂර අඩංගු බව පෙනේ.",
                                regExViolation: "කරුණාකර වලංගු පරිශීලක නාමයක් ඇතුළත් කරන්න."
                            }
                        }
                    },
                    validations: {
                        genericError: {
                            description: "යම් දෝෂයක් ඇති වී ඇත. කරුණාකර නැවත උත්සාහ කරන්න",
                            message: "මුරපද දෝෂය වෙනස් කරන්න"
                        },
                        invalidCurrentPassword: {
                            description: "ඔබ ඇතුලත් කළ මුරපදය අවලංගු බව පෙනේ. කරුණාකර නැවත උත්සාහ කරන්න",
                            message: "මුරපද දෝෂය වෙනස් කරන්න"
                        },
                        submitError: {
                            description: "{{description}}",
                            message: "මුරපද දෝෂය වෙනස් කරන්න"
                        },
                        submitSuccess: {
                            description: "මුරපදය සාර්ථකව වෙනස් කර ඇත",
                            message: "මුරපද යළි පිහිටුවීම සාර්ථකයි"
                        }
                    }
                }
            },
            lockUser: {
                confirmationModal: {
                    assertionHint: "තහවුරු කිරීමට කරුණාකර <1>{{userName}}</1> ටයිප් කරන්න.",
                    content: "ඔබ මෙම පරිශීලකයා අගුළු දැමුවහොත්, පරිශීලකයාට මගේ ගිණුමට හෝ පරිශීලකයා මීට " +
                        "පෙර දායක වූ වෙනත් යෙදුමකට ප්‍රවේශ විය නොහැක. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                    header: "ඔබට විශ්වාසද?",
                    message: "මෙම පරිශීලකයා පද්ධතියට ප්‍රවේශ වීම වැළැක්විය යුතු බවට වග බලා ගන්න."
                }
            },
            modals: {
                addUserWarnModal: {
                    heading: "අවවාදයයි",
                    message: "මෙම නිර්මාණය කළ පරිශීලකයාට කාර්යභාරයක් පැවරෙන්නේ නැති බව කරුණාවෙන්" +
                        " සලකන්න. ඔබට මෙම පරිශීලකයාට භූමිකාවන් පැවරීමට අවශ්‍ය නම් කරුණාකර"
                            + " පහත බොත්තම ක්ලික් කරන්න."
                },
                addUserWizard: {
                    buttons: {
                        next: "ලබන",
                        previous: "කලින්"
                    },
                    steps: {
                        basicDetails: "මූලික විස්තර",
                        groups: "පරිශීලක කණ්ඩායම්",
                        roles: "පරිශීලක භූමිකාවන්",
                        summary: "සාරාංශය"
                    },
                    subTitle: "නව පරිශීලකයා නිර්මාණය කිරීමට පියවර අනුගමනය කරන්න",
                    title: "පරිශීලක සාදන්න",
                    wizardSummary: {
                        domain: "පරිශීලක වෙළඳසැල",
                        groups: "කණ්ඩායම්)",
                        name: "නම",
                        passwordOption: {
                            label: "මුරපද විකල්පය",
                            message: {
                                0: "මුරපදය සැකසීමට සබැඳිය සමඟ {{email}} වෙත විද්‍යුත් තැපෑලක් යවනු ලැබේ.",
                                1: "මුරපදය පරිපාලක විසින් සකසා ඇත."
                            }
                        },
                        roles: "කාර්යභාරය (ය)",
                        username: "පරිශීලක නාමය"
                    }
                },
                changePasswordModal: {
                    header: "පරිශීලක මුරපදය වෙනස් කරන්න",
                    message: "සටහන" +
                        "able to log into any application using the current password."
                }
            },
            profile: {
                fields: {
                    /* eslint-disable @typescript-eslint/camelcase */
                    addresses_home: "නිවසේ ලිපිනය",
                    addresses_work: "වැඩ ලිපිනය",
                    emails: "විද්යුත් තැපෑල",
                    emails_home: "මුල් පිටුව විද්‍යුත් තැපෑල",
                    emails_other: "වෙනත් විද්‍යුත් තැපෑල",
                    emails_work: "වැඩ ඊමේල්",
                    generic: {
                        default: "{{FieldName} එකතු කරන්න"
                    },
                    name_familyName: "අවසන් නම",
                    name_givenName: "මුල් නම",
                    oneTimePassword: "එක් වරක් මුරපදය",
                    phoneNumbers: "දුරකතන අංකය",
                    phoneNumbers_home: "නිවසේ දුරකථන අංකය",
                    phoneNumbers_mobile: "ජංගම දූරකථන අංකය",
                    phoneNumbers_other: "වෙනත් දුරකථන අංකය",
                    phoneNumbers_work: "වැඩ කරන දුරකථන අංකය",
                    profileUrl: "URL",
                    userName: "පරිශීලක නාමය"
                    /* eslint-enable @typescript-eslint/camelcase */
                },
                forms: {
                    emailChangeForm: {
                        inputs: {
                            email: {
                                label: "විද්යුත් තැපෑල",
                                note: "සටහන",
                                placeholder: "ඔබගේ විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කරන්න",
                                validations: {
                                    empty: "විද්‍යුත් තැපැල් ලිපිනය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි",
                                    invalidFormat: "ඊමේල් ලිපිනය නිවැරදි ආකෘතියෙන් නොවේ"
                                }
                            }
                        }
                    },
                    generic: {
                        inputs: {
                            placeholder: "ඔබගේ {{fieldName}} ඇතුළත් කරන්න",
                            validations: {
                                empty: "{{fieldName}} යනු අත්‍යවශ්‍ය ක්ෂේත්‍රයකි",
                                invalidFormat: "{{FieldName}} නිවැරදි ආකෘතියෙන් නොවේ"
                            }
                        }
                    },
                    mobileChangeForm: {
                        inputs: {
                            mobile: {
                                label: "ජංගම දූරකථන අංකය",
                                note: "සටහන",
                                placeholder: "ඔබගේ ජංගම දුරකථන අංකය ඇතුලත් කරන්න",
                                validations: {
                                    empty: "ජංගම දුරකථන අංකය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි",
                                    invalidFormat: "ජංගම දුරකථන අංකය නිවැරදි ආකෘතියෙන් නොවේ"
                                }
                            }
                        }
                    },
                    nameChangeForm: {
                        inputs: {
                            firstName: {
                                label: "මුල් නම",
                                placeholder: "පළමු නම ඇතුළත් කරන්න",
                                validations: {
                                    empty: "පළමු නම අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
                                }
                            },
                            lastName: {
                                label: "අවසන් නම",
                                placeholder: "අවසාන නම ඇතුළත් කරන්න",
                                validations: {
                                    empty: "අවසාන නම අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
                                }
                            }
                        }
                    },
                    organizationChangeForm: {
                        inputs: {
                            organization: {
                                label: "ආයතනය",
                                placeholder: "ඔබේ සංවිධානයට ඇතුළු වන්න",
                                validations: {
                                    empty: "සංවිධානය අත්‍යවශ්‍ය ක්ෂේත්‍රයකි"
                                }
                            }
                        }
                    }
                },
                notifications: {
                    changeUserPassword: {
                        error: {
                            description: "{{description}}",
                            message: "පරිශීලක මුරපදය වෙනස් කිරීමේදී දෝෂයක් ඇතිවිය."
                        },
                        genericError: {
                            description: "පරිශීලක මුරපදය වෙනස් කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "පරිශීලකයාගේ මුරපදය සාර්ථකව වෙනස් කරන ලදි",
                            message: "මුරපදය සාර්ථකව වෙනස් කරන ලදි"
                        }
                    },
                    disableUserAccount: {
                        error: {
                            description: "{{description}}",
                            message: "පරිශීලක ගිණුම අක්‍රීය කිරීමේදී දෝෂයක් ඇතිවිය."
                        },
                        genericError: {
                            description: "පරිශීලක ගිණුම අක්‍රීය කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "පරිශීලක ගිණුම සාර්ථකව අක්‍රීය කර ඇත",
                            message: "{{name}} ගිණුම අක්‍රීය කර ඇත"
                        }
                    },
                    enableUserAccount: {
                        error: {
                            description: "{{description}}",
                            message: "පරිශීලක ගිණුම සක්‍රීය කිරීමේදී දෝෂයක් ඇතිවිය."
                        },
                        genericError: {
                            description: "පරිශීලක ගිණුම සක්‍රීය කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "පරිශීලක ගිණුම සාර්ථකව සක්‍රීය කර ඇත",
                            message: "{{name}} ගිණුම සක්‍රීය කර ඇත"
                        }
                    },
                    forcePasswordReset: {
                        error: {
                            description: "{{description}}",
                            message: "මුරපද යළි පිහිටුවීමේ ප්‍රවාහය ක්‍රියාත්මක කිරීමේදී දෝෂයක් ඇතිවිය."
                        },
                        genericError: {
                            description: "මුරපද යළි පිහිටුවීමේ ප්‍රවාහය ක්‍රියාත්මක කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "පරිශීලක ගිණුමේ මුරපද යළි පිහිටුවීම සාර්ථකව ක්‍රියාත්මක විය",
                            message: "මුරපද යළි පිහිටුවීම සාර්ථකව ක්‍රියාත්මක විය"
                        }
                    },
                    getProfileInfo: {
                        error: {
                            description: "{{description}}",
                            message: "පැතිකඩ විස්තර ලබා ගැනීමේදී දෝෂයක් ඇතිවිය"
                        },
                        genericError: {
                            description: "පැතිකඩ විස්තර ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "අවශ්‍ය පරිශීලක පැතිකඩ විස්තර සාර්ථකව ලබා ගනී",
                            message: "පරිශීලක පැතිකඩ සාර්ථකව ලබා ගන්නා ලදි"
                        }
                    },
                    lockUserAccount: {
                        error: {
                            description: "{{description}}",
                            message: "පරිශීලක ගිණුම අගුළු දැමීමේදී දෝෂයක් ඇතිවිය."
                        },
                        genericError: {
                            description: "පරිශීලක ගිණුම අගුළු දැමීමේදී දෝෂයක් ඇතිවිය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "පරිශීලක ගිණුම සාර්ථකව අගුළු දමා ඇත.",
                            message: "{{name}} ගිණුම අගුළු දමා ඇත"
                        }
                    },
                    noPasswordResetOptions: {
                        error: {
                            description: "බල මුරපද විකල්ප කිසිවක් සක්‍රීය කර නැත.",
                            message: "බල මුරපද යළි පිහිටුවීම ක්‍රියාත්මක කිරීමට නොහැකි විය"
                        }
                    },
                    unlockUserAccount: {
                        error: {
                            description: "{{description}}",
                            message: "පරිශීලක ගිණුම අගුළු ඇරීමේදී දෝෂයක් ඇතිවිය."
                        },
                        genericError: {
                            description: "පරිශීලක ගිණුම අගුළු ඇරීමේදී දෝෂයක් ඇතිවිය.",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
                        },
                        success: {
                            description: "පරිශීලක ගිණුම සාර්ථකව අගුළු හරින ලදි.",
                            message: "{{name}} ගිණුම අගුළු හරිනු ලැබේ"
                        }
                    },
                    updateProfileInfo: {
                        error: {
                            description: "{{description}}",
                            message: "පැතිකඩ විස්තර යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය"
                        },
                        genericError: {
                            description: "පැතිකඩ විස්තර යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                            message: "යම් දෝෂයක් ඇති වී ඇත"
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
            updateUser: {
                groups: {
                    addGroupsModal: {
                        heading: "පරිශීලක කණ්ඩායම් යාවත්කාලීන කරන්න",
                        subHeading: "නව කණ්ඩායම් එකතු කරන්න හෝ පරිශීලකයාට පවරා ඇති පවතින"
                            + " කණ්ඩායම් ඉවත් කරන්න."
                    },
                    editGroups: {
                        groupList: {
                            emptyListPlaceholder: {
                                subTitle: {
                                    0: "මේ වන විට පරිශීලකයාට කණ්ඩායම් පවරා නොමැත.",
                                    1: "මෙය පරිශීලකයාට නිශ්චිත දේ කිරීම සීමා කරයි",
                                    2: "සමහර යෙදුම් වලට ප්‍රවේශ වීම වැනි කාර්යයන්."
                                },
                                title: "කණ්ඩායම් පවරා නොමැත"
                            },
                            headers: {
                                0: "වසම්",
                                1: "නම"
                            }
                        },
                        heading: "පවරා ඇති කණ්ඩායම්",
                        popups: {
                            viewPermissions: "අවසර බලන්න"
                        },
                        searchPlaceholder: "කණ්ඩායම් සොයන්න",
                        subHeading: "පරිශීලකයාට පවරා ඇති කණ්ඩායම් එකතු කිරීම හෝ ඉවත් කිරීම සහ " +
                            "මෙය ඇතැම් කාර්යයන් ඉටු කිරීමට බලපාන බව සලකන්න."
                    },
                    notifications: {
                        addUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "පරිශීලක කණ්ඩායම් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය"
                            },
                            genericError: {
                                description: "පරිශීලක කණ්ඩායම් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                                message: "යම් දෝෂයක් ඇති වී ඇත"
                            },
                            success: {
                                description: "පරිශීලකයා සඳහා නව කණ්ඩායම් පැවරීම සාර්ථකයි",
                                message: "යාවත්කාලීන පරිශීලක කණ්ඩායම් සාර්ථකයි"
                            }
                        },
                        fetchUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "කණ්ඩායම් ලැයිස්තුව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය"
                            },
                            genericError: {
                                description: "කණ්ඩායම් ලැයිස්තුව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                                message: "යම් දෝෂයක් ඇති වී ඇත"
                            },
                            success: {
                                description: "කණ්ඩායම් ලැයිස්තුව සාර්ථකව ලබා ගන්නා ලදි",
                                message: "පරිශීලක කණ්ඩායම් ලැයිස්තුව සාර්ථකව ලබා ගන්නා ලදි"
                            }
                        },
                        removeUserGroups: {
                            error: {
                                description: "{{description}}",
                                message: "පරිශීලකයාගේ කණ්ඩායම් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය"
                            },
                            genericError: {
                                description: "පරිශීලක කණ්ඩායම් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                                message: "යම් දෝෂයක් ඇති වී ඇත"
                            },
                            success: {
                                description: "පරිශීලකයා සඳහා පවරා ඇති කණ්ඩායම් ඉවත් කිරීම සාර්ථකයි",
                                message: "යාවත්කාලීන පරිශීලක කණ්ඩායම් සාර්ථකයි"
                            }
                        }
                    }
                },
                roles: {
                    addRolesModal: {
                        heading: "පරිශීලක භූමිකාවන් යාවත්කාලීන කරන්න",
                        subHeading: "නව භූමිකාවන් එක් කරන්න හෝ පරිශීලකයාට පවරා ඇති පවතින"
                            + " භූමිකාවන් ඉවත් කරන්න."
                    },
                    editRoles: {
                        heading: "පවරා ඇති භූමිකාවන්",
                        popups: {
                            viewPermissions: "අවසර බලන්න"
                        },
                        roleList: {
                            emptyListPlaceholder: {
                                subTitle: {
                                    0: "මේ වන විට පරිශීලකයාට කිසිදු භූමිකාවක් පවරා නොමැත.",
                                    1: "මෙය පරිශීලකයාට නිශ්චිත දේ කිරීම සීමා කරයි",
                                    2: "සමහර යෙදුම් වලට ප්‍රවේශ වීම වැනි කාර්යයන්."
                                },
                                title: "භූමිකාවන් පවරා නොමැත"
                            },
                            headers: {
                                0: "වසම්",
                                1: "නම"
                            }
                        },
                        searchPlaceholder: "සෙවුම් භූමිකාවන්",
                        subHeading: "මෙම පරිශීලකයාට පවරා ඇති භූමිකාවන් එකතු කිරීම හෝ ඉවත් කිරීම සහ " +
                            "මෙය ඇතැම් කාර්යයන් ඉටු කිරීමට බලපානු ඇති බව සලකන්න."
                    },
                    notifications: {
                        addUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "පරිශීලක භූමිකාවන් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය"
                            },
                            genericError: {
                                description: "පරිශීලක භූමිකාවන් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                                message: "යම් දෝෂයක් ඇති වී ඇත"
                            },
                            success: {
                                description: "පරිශීලකයා සඳහා නව භූමිකාවන් පැවරීම සාර්ථකයි",
                                message: "යාවත්කාලීන පරිශීලක භූමිකාවන් සාර්ථකයි"
                            }
                        },
                        fetchUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "භූමිකාවන් ලැයිස්තුව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය"
                            },
                            genericError: {
                                description: "භූමිකාවන් ලැයිස්තුව ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                                message: "යම් දෝෂයක් ඇති වී ඇත"
                            },
                            success: {
                                description: "භූමිකාවන් ලැයිස්තුව සාර්ථකව ලබා ගන්නා ලදි",
                                message: "පරිශීලක භූමිකාවන් ලැයිස්තුව සාර්ථකව ලබා ගන්නා ලදි"
                            }
                        },
                        removeUserRoles: {
                            error: {
                                description: "{{description}}",
                                message: "පරිශීලකයාගේ භූමිකාවන් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය"
                            },
                            genericError: {
                                description: "පරිශීලක භූමිකාවන් යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය",
                                message: "යම් දෝෂයක් ඇති වී ඇත"
                            },
                            success: {
                                description: "පරිශීලකයා සඳහා පවරා ඇති භූමිකාවන් ඉවත් කිරීම සාර්ථකයි",
                                message: "යාවත්කාලීන පරිශීලක භූමිකාවන් සාර්ථකයි"
                            }
                        }
                    },
                    viewPermissionModal: {
                        backButton: "නැවත ලැයිස්තුවට",
                        editButton: "අවසර සංස්කරණය කරන්න",
                        heading: "{{role}} සඳහා අවසර"
                    }
                }
            }
        },
        users: {
            advancedSearch: {
                form: {
                    dropdown: {
                        filterAttributeOptions: {
                            email: "විද්යුත් තැපෑල",
                            username: "පරිශීලක නාමය"
                        }
                    },
                    inputs: {
                        filterAttribute: {
                            placeholder: "උදා. පරිශීලක නාමය, විද්‍යුත් තැපෑල යනාදිය."
                        },
                        filterCondition: {
                            placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                        },
                        filterValue: {
                            placeholder: "සෙවීමට අගය ඇතුළත් කරන්න"
                        }
                    }
                },
                placeholder: "පරිශීලක නාමයෙන් සොයන්න"
            },
            all: {
                heading: "පරිශීලකයින්",
                subHeading: "පරිශීලක ගිණුම් එකතු කිරීම සහ කළමනාකරණය කිරීම, පරිශීලකයින්ට භූමිකාවන්"
                    + " පැවරීම සහ පරිශීලක අනන්‍යතා පවත්වා ගැනීම."
            },
            buttons: {
                addNewUserBtn: "නව පරිශීලක",
                assignUserRoleBtn: "භූමිකාවන් පවරන්න",
                metaColumnBtn: "තීරු"
            },
            forms: {
                validation: {
                    formatError: "ඇතුළත් කළ {{field}} ආකෘතිය වැරදිය."
                }
            },
            list: {
                columns: {
                    actions: "ක්‍රියා",
                    name: "නම"
                }
            },
            notifications: {
                addUser: {
                    error: {
                        description: "{{description}}",
                        message: "නව පරිශීලකයා එකතු කිරීමේදී දෝෂයකි"
                    },
                    genericError: {
                        description: "නව පරිශීලකයා එක් කිරීමට නොහැකි විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "නව පරිශීලකයා සාර්ථකව එකතු කරන ලදි.",
                        message: "පරිශීලකයා සාර්ථකව එකතු කරන ලදි"
                    }
                },
                deleteUser: {
                    error: {
                        description: "{{description}}",
                        message: "පරිශීලකයා මකාදැමීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පරිශීලකයා මකා දැමිය නොහැක",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "පරිශීලකයා සාර්ථකව මකා දමන ලදි.",
                        message: "පරිශීලකයා සාර්ථකව මකා දමන ලදි"
                    }
                },
                fetchUsers: {
                    error: {
                        description: "{{description}}",
                        message: "පරිශීලකයින් ලබා ගැනීමේ දෝෂයකි"
                    },
                    genericError: {
                        description: "පරිශීලකයින් ලබා ගැනීමට නොහැකි විය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "පරිශීලකයින් සාර්ථකව ලබා ගන්නා ලදි.",
                        message: "පරිශීලකයින් ලබා ගැනීම සාර්ථකයි"
                    }
                }
            },
            placeholders: {
                emptyList: {
                    action: "ලැයිස්තුව නැවුම් කරන්න",
                    subtitles: {
                        0: "පරිශීලක ලැයිස්තුව හිස්ව ය.",
                        1: "පරිශීලක ලැයිස්තුව ලබා ගැනීමේදී යමක් වැරදී ඇත"
                    },
                    title: "පරිශීලකයින් හමු නොවීය"
                },
                userstoreError: {
                    subtitles: {
                        0: "පරිශීලක වෙළඳසැලෙන් පරිශීලකයින් ගෙන්වා ගැනීමට උත්සාහ කිරීමේදී දෝෂයක් ඇතිවිය",
                        1: "කරුණාකර පරිශීලක වෙළඳසැලේ සම්බන්ධතා තොරතුරු නිවැරදි බවට වග බලා ගන්න."
                    },
                    title: "පරිශීලක වෙළඳසැලෙන් පරිශීලකයින් ගෙන්වා ගැනීමට නොහැකි විය"
                }
            },
            usersList: {
                list: {
                    emptyResultPlaceholder: {
                        addButton: "නව පරිශීලක",
                        subTitle: {
                            0: "දැනට පරිශීලකයින් නොමැත.",
                            1: "පහත සඳහන් දෑ අනුගමනය කිරීමෙන් ඔබට පහසුවෙන් නව පරිශීලකයෙකු එක් කළ හැකිය",
                            2: "පරිශීලක නිර්මාණ විශාරදයේ පියවර."
                        },
                        title: "නව පරිශීලකයෙකු එක් කරන්න"
                    },
                    iconPopups: {
                        delete: "මකන්න",
                        edit: "සංස්කරණය කරන්න"
                    }
                },
                metaOptions: {
                    columns: {
                        emails: "විද්යුත් තැපෑල",
                        id: "පරිශීලක ID",
                        lastModified: "අවසන් වරට වෙනස් කරන ලදි",
                        name: "නම",
                        userName: "පරිශීලක නාමය"
                    },
                    heading: "තීරු පෙන්වන්න"
                },
                search: {
                    emptyResultPlaceholder: {
                        clearButton: "සෙවුම් විමසුම හිස් කරන්න",
                        subTitle: {
                            0: "{{query}} සඳහා අපට කිසිදු ප්‍රතිපලයක් සොයාගත නොහැකි විය",
                            1: "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න."
                        },
                        title: "ප්‍රතිපල හමු නොවීය"
                    }
                }
            },
            userstores: {
                userstoreOptions: {
                    all: "සියලුම පරිශීලක වෙළඳසැල්",
                    primary: "ප්‍රාථමික"
                }
            }
        },
        userstores: {
            advancedSearch: {
                error: "පෙරහන් විමසුම් ආකෘතිය වැරදිය",
                form: {
                    inputs: {
                        filterAttribute: {
                            placeholder: "උදා. නම, විස්තරය ආදිය."
                        },
                        filterCondition: {
                            placeholder: "උදා. ආදිය සමඟ ආරම්භ වේ."
                        },
                        filterValue: {
                            placeholder: "උදා. ප්‍රාථමික, දෙවන ආදිය."
                        }
                    }
                },
                placeholder: "පරිශීලක වෙළඳසැල් නාමයෙන් සොයන්න"
            },
            confirmation: {
                confirm: "තහවුරු කරන්න",
                content: "ඔබ මෙම පරිශීලක වෙළඳසැල මකා දැමුවහොත්, මෙම පරිශීලක වෙළඳසැලේ පරිශීලක දත්ත ද "
                    + "මකා දැමෙනු ඇත. කරුණාකර ප්‍රවේශමෙන් ඉදිරියට යන්න.",
                header: "ඔබට විශ්වාසද?",
                hint: "තහවුරු කිරීමට කරුණාකර <1>{{name}}</1> ටයිප් කරන්න.",
                message: "මෙම ක්‍රියාව ආපසු හැරවිය නොහැකි අතර තෝරාගත් පරිශීලක වෙළඳසැල සහ එහි "
                    + "ඇති දත්ත ස්ථිරවම මකා දමනු ඇත."
            },
            dangerZone: {
                delete: {
                    actionTitle: "පරිශීලක වෙළඳසැල මකන්න",
                    header: "පරිශීලක වෙළඳසැල මකන්න",
                    subheader: "ඔබ පරිශීලක වෙළඳසැලක් මකා දැමූ පසු, ආපසු යාමක් නොමැත."
                        + " කරුණාකර ස්ථිර වන්න."
                },
                disable: {
                    actionTitle: "පරිශීලක වෙළඳසැල සබල කරන්න",
                    header: "පරිශීලක වෙළඳසැල සබල කරන්න",
                    subheader: "පරිශීලක වෙළඳසැලක් අක්‍රීය කිරීමෙන් පරිශීලක වෙළඳසැලේ පරිශීලකයින්ට ප්‍රවේශය අහිමි " +
                        "විය හැකිය. ප්‍රවේශමෙන් ඉදිරියට යන්න."
                }
            },
            forms: {
                connection: {
                    connectionErrorMessage: "කරුණාකර සපයා ඇති සම්බන්ධතා URL, නම, "
                        + "මුරපදය සහ ධාවක නාමය නිවැරදි බව සහතික කරන්න",
                    testButton: "පරීක්ෂණ සම්බන්ධතාවය"
                },
                custom: {
                    placeholder: "{{name}} ඇතුළත් කරන්න",
                    requiredErrorMessage: "{{name}} අවශ්‍ය වේ"
                },
                general: {
                    description: {
                        label: "විස්තර",
                        placeholder: "විස්තරයක් ඇතුළත් කරන්න"
                    },
                    name: {
                        label: "නම",
                        placeholder: "නමක් ඇතුළත් කරන්න",
                        requiredErrorMessage: "නම අත්‍යවශ්‍ය ක්ෂේත්‍රයකි",
                        validationErrorMessages: {
                            alreadyExistsErrorMessage: "මෙම නම සහිත පරිශීලක වෙළඳසැලක් දැනටමත් පවතී."
                        }
                    },
                    type: {
                        label: "වර්ගය",
                        requiredErrorMessage: "වර්ගයක් තෝරන්න"
                    }
                }
            },
            notifications: {
                addUserstore: {
                    genericError: {
                        description: "පරිශීලක වෙළඳසැල නිර්මාණය කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත!"
                    },
                    success: {
                        description: "පරිශීලක වෙළඳසැල සාර්ථකව එකතු කර ඇත!",
                        message: "පරිශීලක වෙළඳසැල සාර්ථකව එකතු කරන ලදි!"
                    }
                },
                delay: {
                    description: "පරිශීලක වෙළඳසැල් ලැයිස්තුව යාවත්කාලීන කිරීමට ටික කාලයක් ගතවනු ඇත. "
                        + "යාවත්කාලීන කළ පරිශීලක වෙළඳසැල් ලැයිස්තුව ලබා ගැනීමට තත්පර කිහිපයකින් නැවුම් කරන්න.",
                    message: "පරිශීලක වෙළඳසැල් ලැයිස්තුව යාවත්කාලීන කිරීමට කාලය ගතවේ"
                },
                deleteUserstore: {
                    genericError: {
                        description: "පරිශීලක වෙළඳසැල මකාදැමීමේදී දෝෂයක් ඇතිවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත!"
                    },
                    success: {
                        description: "පරිශීලක වෙළඳසැල සාර්ථකව මකා දමා ඇත!",
                        message: "පරිශීලක වෙළඳසැල සාර්ථකව මකා දමන ලදි!"
                    }
                },
                fetchUserstoreMetadata: {
                    genericError: {
                        description: "මෙටා දත්ත වර්ගය ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    }
                },
                fetchUserstoreTemplates: {
                    genericError: {
                        description: "පරිශීලක වෙළඳසැල් වර්ගයේ තොරතුරු ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    }
                },
                fetchUserstoreTypes: {
                    genericError: {
                        description: "පරිශීලක වෙළඳසැල් වර්ග ලබා ගැනීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    }
                },
                fetchUserstores: {
                    genericError: {
                        description: "පරිශීලක වෙළඳසැල් ලබා ගැනීමේදී දෝෂයක් ඇතිවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    }
                },
                testConnection: {
                    genericError: {
                        description: "පරිශීලක වෙළඳසැලට සම්බන්ධතාවය පරීක්ෂා කිරීමේදී දෝෂයක් ඇතිවිය",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "සම්බන්ධතාවය සෞඛ්ය සම්පන්නයි",
                        message: "සම්බන්ධතාවය සාර්ථකයි!"
                    }
                },
                updateDelay: {
                    description: "යාවත්කාලීන කළ ගුණාංග දර්ශණය වීමට යම් කාලයක් ගතවනු ඇත.",
                    message: "ගුණාංග යාවත්කාලීන කිරීමට කාලය ගතවේ"
                },
                updateUserstore: {
                    genericError: {
                        description: "පරිශීලක වෙළඳසැල යාවත්කාලීන කිරීමේදී දෝෂයක් ඇතිවිය.",
                        message: "යම් දෝෂයක් ඇති වී ඇත"
                    },
                    success: {
                        description: "මෙම පරිශීලක වෙළඳසැල සාර්ථකව යාවත්කාලීන කර ඇත!",
                        message: "පරිශීලක වෙළඳසැල සාර්ථකව යාවත්කාලීන කරන ලදි!"
                    }
                }
            },
            pageLayout: {
                edit: {
                    back: "පරිශීලක වෙළඳසැල් වෙත ආපසු යන්න",
                    description: "පරිශීලක වෙළඳසැල සංස්කරණය කරන්න",
                    tabs: {
                        connection: "සම්බන්ධතාවය",
                        general: "ජනරාල්",
                        group: "සමූහය",
                        user: "පරිශීලක"
                    }
                },
                list: {
                    description: "පරිශීලක වෙළඳසැල් සාදන්න සහ කළමනාකරණය කරන්න",
                    primaryAction: "නව පරිශීලක වෙළඳසැල",
                    title: "පරිශීලක වෙළඳසැල්"
                },
                templates: {
                    back: "පරිශීලක වෙළඳසැල් වෙත ආපසු යන්න",
                    description: "කරුණාකර පහත පරිශීලක වෙළඳසැල් වර්ග වලින් එකක් තෝරන්න.",
                    templateHeading: "ඉක්මන් පිහිටුවීම්",
                    templateSubHeading: "ඔබේ පරිශීලක වෙළඳසැල් නිර්මාණය වේගවත් කිරීම සඳහා පෙර සැකසූ"
                        + " සැකිලි සමූහයක්.",
                    title: "පරිශීලක වෙළඳසැල් වර්ගය තෝරන්න"
                }
            },
            placeholders: {
                emptyList: {
                    action: "නව පරිශීලක වෙළඳසැල",
                    subtitles: "දැනට පරිශීලක වෙළඳසැල් නොමැත. පරිශීලක වෙළඳසැල් නිර්මාණය "
                        + "කිරීමේ විශාරදයේ පියවර අනුගමනය කිරීමෙන් ඔබට "
                        + "පහසුවෙන් නව පරිශීලක වෙළඳසැලක් එක් කළ හැකිය.",
                    title: "නව පරිශීලක වෙළඳසැලක් එක් කරන්න"
                },
                emptySearch: {
                    action: "සෙවුම් විමසුම හිස් කරන්න",
                    subtitles: "{{සෙවුම් විමසුම} for සඳහා අපට කිසිදු ප්‍රතිපලයක් සොයාගත නොහැකි විය. "
                        + "කරුණාකර වෙනත් සෙවුම් පදයක් උත්සාහ කරන්න.",
                    title: "ප්‍රතිපල හමු නොවීය"
                }
            },
            sqlEditor: {
                create: "සාදන්න",
                darkMode: "අඳුරු ප්‍රකාරය",
                delete: "මකන්න",
                read: "කියවන්න",
                reset: "නැවත සකසන්න",
                title: "SQL විමසුම් වර්ග",
                update: "යාවත්කාලීන කරන්න"
            },
            wizard: {
                header: "Store {{type}} පරිශීලක වෙළඳසැල එක් කරන්න",
                steps: {
                    general: "ජනරාල්",
                    group: "සමූහය",
                    summary: "සාරාංශය",
                    user: "පරිශීලක"
                }
            }
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
                message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
            },
            genericError: {
                description: "පරිශීලක පැතිකඩ විස්තර ලබා ගැනීමට නොහැකි විය.",
                message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
            },
            success: {
                description: "පරිශීලක පැතිකඩ විස්තර සාර්ථකව ලබා ගන්නා ලදි.",
                message: "දත්ත නැවත ලබා ගැනීම සාර්ථකයි"
            }
        },
        getProfileSchema: {
            error: {
                description: "{{description}}",
                message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
            },
            genericError: {
                description: "පරිශීලක පැතිකඩ යෝජනා ක්‍රම ලබා ගැනීමට නොහැකි විය.",
                message: "දත්ත ලබා ගැනීමේ දෝෂයක්"
            },
            success: {
                description: "පරිශීලක පැතිකඩ යෝජනා ක්‍රම සාර්ථකව ලබා ගන්නා ලදි.",
                message: "නැවත ලබා ගැනීම සාර්ථකයි"
            }
        }
    },
    pages: {
        addEmailTemplate: {
            backButton: "{{name}} අච්චුව වෙත ආපසු යන්න",
            subTitle: null,
            title: "නව අච්චුව එක් කරන්න"
        },
        approvalsPage: {
            subTitle: "ඔබේ අනුමැතිය අවශ්‍ය මෙහෙයුම් කාර්යයන් සමාලෝචනය කරන්න",
            title: "අනුමත කිරීම්"
        },
        editTemplate: {
            backButton: "{{name}} අච්චුව වෙත ආපසු යන්න",
            subTitle: null,
            title: "{{template}}"
        },
        emailLocaleAdd: {
            backButton: "{{name}} අච්චුව වෙත ආපසු යන්න",
            subTitle: null,
            title: "ආකෘතිය සංස්කරණය කරන්න - {{name}}"
        },
        emailLocaleAddWithDisplayName: {
            backButton: "{{name}} ආකෘතිය වෙත ආපසු යන්න",
            subTitle: null,
            title: "{{displayName}} සඳහා නව ආකෘතියක් එක් කරන්න"
        },
        emailTemplateTypes: {
            subTitle: "සැකිලි වර්ග සාදන්න සහ කළමනාකරණය කරන්න.",
            title: "විද්‍යුත් තැපැල් ආකෘති වර්ග"
        },
        emailTemplates: {
            backButton: "ඊමේල් සැකිලි වර්ග වෙත ආපසු යන්න",
            subTitle: null,
            title: "විද්‍යුත් තැපැල් ආකෘති වර්ග"
        },
        emailTemplatesWithDisplayName: {
            backButton: "යෙදුම් වෙත ආපසු යන්න",
            subTitle: null,
            title: "සැකිලි - {{displayName}}"
        },
        groups: {
            subTitle: "පරිශීලක කණ්ඩායම් සාදන්න සහ කළමනාකරණය කරන්න, කණ්ඩායම් සඳහා අවසර ලබා දෙන්න.",
            title: "කණ්ඩායම්"
        },
        overview: {
            subTitle: "පරිශීලකයින්, භූමිකාවන්, උපභාෂා, සේවාදායක වින්‍යාසයන් වින්‍යාස කිරීම " +
                "සහ කළමනාකරණය කිරීම.",
            title: "සාදරයෙන් පිළිගනිමු, {{firstName}}"
        },
        roles: {
            subTitle: "භූමිකාවන් සාදන්න සහ කළමනාකරණය කරන්න, භූමිකාවන් සඳහා අවසර ලබා දෙන්න.",
            title: "භූමිකාවන්"
        },
        rolesEdit: {
            backButton: "{{Type} වෙත ආපසු යන්න",
            subTitle: null,
            title: "භූමිකාව සංස්කරණය කරන්න"
        },
        serverConfigurations: {
            subTitle: "සේවාදායකයේ සාමාන්‍ය වින්‍යාසයන් කළමනාකරණය කරන්න.",
            title: "සාමාන්‍ය වින්‍යාසයන්"
        },
        users: {
            subTitle: "පරිශීලකයින්, පරිශීලක ප්‍රවේශය සහ පරිශීලක පැතිකඩ සාදන්න සහ කළමනාකරණය කරන්න.",
            title: "පරිශීලකයින්"
        },
        usersEdit: {
            backButton: "නැවත පරිශීලකයින් වෙත යන්න",
            subTitle: "{{name}}",
            title: "{{email}}"
        }
    },
    placeholders: {
        404: {
            action: "ආපසු ප්‍රධාන පිටුවට යන්න",
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
                0: "මෙම පිටුව ප්‍රදර්ශනය කිරීමේදී යම් දෝෂයක් ඇති වී ඇත.",
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
        sessionStorageDisabled: {
            subtitles: {
                0: "මෙම යෙදුම භාවිතා කිරීමට, ඔබගේ වෙබ් බ්‍රව්සර සැකසුම් තුළ කුකී සක්‍රීය කළ යුතුය.",
                1: "කුකීස් සක්‍රීය කරන්නේ කෙසේද යන්න පිළිබඳ වැඩි විස්තර සඳහා, ඔබේ වෙබ් බ්‍රව්සරයේ උපකාරක"
                    + " අංශය බලන්න."
            },
            title: "ඔබගේ බ්‍රව්සරයේ cookies අක්‍රීය කර ඇත."
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
            action: "ආපසු ප්‍රධාන පිටුවට යන්න",
            subtitles: {
                0: "අපි මේ පිටුවේ යම් වැඩක් කරනවා.",
                1: "කරුණාකර  පසුව එන්න. ඔබේ ඉවසීමට ස්තුතියි."
            },
            title: "පිටුව ඉදිවෙමින් පවතී"
        }
    }
};

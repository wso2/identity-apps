/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    "components": {
        "accountRecovery": {
            "codeRecovery": {
                "descriptions": {
                    "add": "Kod kurtarma seçeneklerini ekleyin veya güncelleyin"
                },
                "heading": "Kod Kurtarma"
            },
            "emailRecovery": {
                "descriptions": {
                    "add": "Kurtarma e-posta adresi ekleyin veya güncelleyin",
                    "emptyEmail": "E-posta kurtarma işlemine devam etmek için e-posta adresinizi yapılandırmanız gerekir.",
                    "update": "İkincil e-posta adresini güncelle ({{email}})",
                    "view": "İkincil e-posta adresini görüntüle ({{email}})"
                },
                "forms": {
                    "emailResetForm": {
                        "inputs": {
                            "email": {
                                "label": "E-posta adresi",
                                "placeholder": "Kurtarma e-posta adresini girin",
                                "validations": {
                                    "empty": "Bir e-mail adresi girin",
                                    "invalidFormat": "E-posta adresi doğru biçimde değil"
                                }
                            }
                        }
                    }
                },
                "heading": "E-posta kurtarma",
                "notifications": {
                    "updateEmail": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Kurtarma e-postası güncellenirken hata oluştu"
                        },
                        "genericError": {
                            "description": "Kurtarma e-postası güncellenirken hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "success": {
                            "description": "Kullanıcı profilindeki e-posta adresi başarıyla güncellendi",
                            "message": "E-posta Adresi Başarıyla Güncellendi"
                        }
                    }
                }
            },
            "preference": {
                "notifications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Kurtarma tercihi alınırken hata oluştu"
                    },
                    "genericError": {
                        "description": "Kurtarma tercihi alınırken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Kurtarma tercihi başarıyla alındı",
                        "message": "Kurtarma tercihi alımı başarılı"
                    }
                }
            },
            "questionRecovery": {
                "descriptions": {
                    "add": "Hesap kurtarma sorgulama soruları ekleyin veya güncelleyin"
                },
                "forms": {
                    "securityQuestionsForm": {
                        "inputs": {
                            "answer": {
                                "label": "Cevap",
                                "placeholder": "Cevabınızı girin",
                                "validations": {
                                    "empty": "Cevap zorunlu bir alandır"
                                }
                            },
                            "question": {
                                "label": "Soru",
                                "placeholder": "Bir güvenlik sorusu seçin",
                                "validations": {
                                    "empty": "En az bir güvenlik sorusu seçilmelidir"
                                }
                            }
                        }
                    }
                },
                "heading": "Güvenlik SORULARI",
                "notifications": {
                    "addQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Güvenlik soruları eklenirken hata oluştu"
                        },
                        "genericError": {
                            "description": "Güvenlik soruları eklenirken hata oluştu",
                            "message": "Bir şeyler yanlış gitti."
                        },
                        "success": {
                            "description": "Gerekli güvenlik soruları başarıyla eklendi",
                            "message": "Güvenlik soruları başarıyla eklendi"
                        }
                    },
                    "updateQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Güvenlik soruları güncellenirken hata oluştu"
                        },
                        "genericError": {
                            "description": "Güvenlik soruları güncellenirken hata oluştu",
                            "message": "Bir şeyler yanlış gitti."
                        },
                        "success": {
                            "description": "Gerekli güvenlik soruları başarıyla güncellendi",
                            "message": "Güvenlik Soruları başarıyla güncellendi"
                        }
                    }
                }
            }
        },
        "advancedSearch": {
            "form": {
                "inputs": {
                    "filterAttribute": {
                        "label": "Filtre özelliği",
                        "placeholder": "Örneğin. ",
                        "validations": {
                            "empty": "Filtre özelliği zorunlu bir alandır."
                        }
                    },
                    "filterCondition": {
                        "label": "Filtre koşulu",
                        "placeholder": "Örneğin. ",
                        "validations": {
                            "empty": "Filtre koşulu zorunlu bir alandır."
                        }
                    },
                    "filterValue": {
                        "label": "Filtre değeri",
                        "placeholder": "Örneğin. ",
                        "validations": {
                            "empty": "Filtre değeri zorunlu bir alandır."
                        }
                    }
                }
            },
            "hints": {
                "querySearch": {
                    "actionKeys": "Shift Enter",
                    "label": "Sorgu olarak aramak için"
                }
            },
            "options": {
                "header": "Gelişmiş Arama"
            },
            "placeholder": "şuna göre ara: {{attribute}}",
            "popups": {
                "clear": "aramayı Temizle",
                "dropdown": "Seçenekleri göster"
            },
            "resultsIndicator": "\" sorgusu için sonuçlar gösteriliyor.{{query}}\""
        },
        "applications": {
            "advancedSearch": {
                "form": {
                    "inputs": {
                        "filterAttribute": {
                            "placeholder": "Örneğin. "
                        },
                        "filterCondition": {
                            "placeholder": "Örneğin. "
                        },
                        "filterValue": {
                            "placeholder": "Aranacak değeri girin"
                        }
                    }
                },
                "placeholder": "Uygulama adına göre ara"
            },
            "all": {
                "heading": "Bütün uygulamalar"
            },
            "favourite": {
                "heading": "Favoriler"
            },
            "notifications": {
                "fetchApplications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Uygulamalar alınırken hata oluştu"
                    },
                    "genericError": {
                        "description": "Uygulamalar alınamadı",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Uygulamalar başarıyla alındı.",
                        "message": "Uygulamaların alınması başarılı"
                    }
                }
            },
            "placeholders": {
                "emptyList": {
                    "action": "Listeyi yenile",
                    "subtitles": {
                        "0": "Uygulamalar listesi boş döndü.",
                        "1": "Bunun nedeni keşfedilebilir uygulamaların olmaması olabilir.",
                        "2": "Lütfen bir yöneticiden uygulamalar için keşfedilebilirliği etkinleştirmesini isteyin."
                    },
                    "title": "Başvuru Yok"
                }
            },
            "recent": {
                "heading": "Son Başvurular"
            }
        },
        "changePassword": {
            "forms": {
                "passwordResetForm": {
                    "inputs": {
                        "confirmPassword": {
                            "label": "Şifreyi Onayla",
                            "placeholder": "yeni şifreyi girin",
                            "validations": {
                                "empty": "Parolanın zorunlu bir alan olduğunu onaylayın",
                                "mismatch": "Parola onayı eşleşmiyor"
                            }
                        },
                        "currentPassword": {
                            "label": "Mevcut Şifre",
                            "placeholder": "mevcut şifreyi girin",
                            "validations": {
                                "empty": "Mevcut şifre zorunlu bir alandır",
                                "invalid": "Mevcut şifre geçersiz"
                            }
                        },
                        "newPassword": {
                            "label": "Yeni Şifre",
                            "placeholder": "yeni şifreyi girin",
                            "validations": {
                                "empty": "Yeni şifre zorunlu bir alandır"
                            }
                        }
                    },
                    "validations": {
                        "genericError": {
                            "description": "Bir şeyler yanlış gitti. ",
                            "message": "Şifre değiştirme hatası"
                        },
                        "invalidCurrentPassword": {
                            "description": "Girdiğiniz mevcut şifre geçersiz görünüyor. ",
                            "message": "Şifre değiştirme hatası"
                        },
                        "invalidNewPassword": {
                            "description": "Parola gerekli kısıtlamaları karşılamıyor.",
                            "message": "Geçersiz şifre"
                        },
                        "passwordCaseRequirement": "En azından {{minUpperCase}} büyük harf ve {{minLowerCase}} Küçük harfler",
                        "passwordCharRequirement": "En azından {{minSpecialChr}} özel karakter(ler)in",
                        "passwordLengthRequirement": "Arasında olmalı {{min}} Ve {{max}} karakterler",
                        "passwordLowerCaseRequirement": "En azından {{minLowerCase}} Küçük harfler)",
                        "passwordNumRequirement": "En azından {{min}} sayı(lar)",
                        "passwordRepeatedChrRequirement": "Den fazla değil {{repeatedChr}} tekrarlanan karakter(ler)",
                        "passwordUniqueChrRequirement": "En azından {{uniqueChr}} benzersiz karakter(ler)",
                        "passwordUpperCaseRequirement": "En azından {{minUpperCase}} büyük harfler)",
                        "submitError": {
                            "description": "{{description}}",
                            "message": "Şifre değiştirme hatası"
                        },
                        "submitSuccess": {
                            "description": "Şifre başarıyla değiştirildi",
                            "message": "Parola sıfırlama başarılı"
                        },
                        "validationConfig": {
                            "error": {
                                "description": "{{description}}",
                                "message": "alma hatası"
                            },
                            "genericError": {
                                "description": "Doğrulama yapılandırma verileri alınamadı.",
                                "message": "Bir şeyler yanlış gitti"
                            }
                        }
                    }
                }
            },
            "modals": {
                "confirmationModal": {
                    "heading": "Onayla",
                    "message": "Parolanın değiştirilmesi mevcut oturumun sonlandırılmasına neden olacaktır. "
                }
            }
        },
        "consentManagement": {
            "editConsent": {
                "collectionMethod": "Toplama Yöntemi",
                "dangerZones": {
                    "revoke": {
                        "actionTitle": "Geri çekmek",
                        "header": "İzni iptal et",
                        "subheader": "Bu başvuru için tekrar onay vermeniz gerekecek."
                    }
                },
                "description": "Tanım",
                "piiCategoryHeading": "Uygulama ile kişisel bilgilerinizin toplanması ve paylaşılması için izni yönetin. ",
                "state": "Durum",
                "version": "Sürüm"
            },
            "modals": {
                "consentRevokeModal": {
                    "heading": "Emin misin?",
                    "message": "Bu işlem geri alınamaz. ",
                    "warning": "Lütfen oturum açma izni sayfasına yönlendirileceğinizi unutmayın."
                }
            },
            "notifications": {
                "consentReceiptFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "genericError": {
                        "description": "Seçilen uygulama hakkında bilgi yüklenemedi",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Onay makbuzu başarıyla alındı",
                        "message": "Başarılı alma"
                    }
                },
                "consentedAppsFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "genericError": {
                        "description": "İzin verilen uygulamalar listesi yüklenemedi",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "İzin verilen uygulamalar listesi başarıyla alındı",
                        "message": "Başarılı alma"
                    }
                },
                "revokeConsentedApp": {
                    "error": {
                        "description": "{{description}}",
                        "message": "İzinleri İptal Etme Hatası"
                    },
                    "genericError": {
                        "description": "Uygulama için izin iptal edilemedi",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Onay, uygulama için başarıyla iptal edildi",
                        "message": "Onaylar Başarıyı İptal Eder"
                    }
                },
                "updateConsentedClaims": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "genericError": {
                        "description": "İzin verilen talepler, uygulama için güncellenemedi",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Kabul edilen talepler, uygulama için başarıyla güncellendi",
                        "message": "Kabul edilen hak talepleri başarıyla güncellendi"
                    }
                }
            }
        },
        "cookieConsent": {
            "confirmButton": "Anladım",
            "content": "Genel olarak en iyi deneyimi yaşamanızı sağlamak için tanımlama bilgileri kullanıyoruz.  <1>Çerez politikası</1>."
        },
        "federatedAssociations": {
            "deleteConfirmation": "Bu, bağlantılı sosyal hesabı yerel hesabınızdan kaldıracaktır. ",
            "notifications": {
                "getFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "genericError": {
                        "description": "Bağlantılı Sosyal Hesaplar alınamadı",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Bağlantılı Sosyal Hesaplar başarıyla alındı",
                        "message": "Bağlantılı Sosyal Hesaplar başarıyla alındı"
                    }
                },
                "removeAllFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "genericError": {
                        "description": "Bağlantılı Sosyal Hesaplar kaldırılamadı",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Tüm Bağlantılı Sosyal Hesaplar başarıyla kaldırıldı",
                        "message": "Bağlantılı Sosyal Hesaplar başarıyla kaldırıldı"
                    }
                },
                "removeFederatedAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "genericError": {
                        "description": "Bağlantılı Sosyal Hesap kaldırılamadı",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Bağlantılı Sosyal Hesap başarıyla kaldırıldı",
                        "message": "Bağlantılı Sosyal Hesap başarıyla kaldırıldı"
                    }
                }
            }
        },
        "footer": {
            "copyright": "WSO2 Kimlik Sunucusu © {{year}}"
        },
        "header": {
            "appSwitch": {
                "console": {
                    "description": "Geliştiriciler veya yöneticiler olarak yönetin",
                    "name": "Konsol"
                },
                "myAccount": {
                    "description": "Kendi hesabınızı yönetin",
                    "name": "Hesabım"
                },
                "tooltip": "Uygulamalar"
            },
            "organizationLabel": "Bu hesap tarafından yönetilmektedir"
        },
        "linkedAccounts": {
            "accountTypes": {
                "local": {
                    "label": "Yerel kullanıcı hesabı ekle"
                }
            },
            "deleteConfirmation": "Bu, bağlı hesabı hesabınızdan kaldıracaktır. ",
            "forms": {
                "addAccountForm": {
                    "inputs": {
                        "password": {
                            "label": "Şifre",
                            "placeholder": "Şifreyi gir",
                            "validations": {
                                "empty": "Şifre girmek zorunludur"
                            }
                        },
                        "username": {
                            "label": "Kullanıcı adı",
                            "placeholder": "kullanıcı adını girin",
                            "validations": {
                                "empty": "Kullanıcı adı zorunlu bir alandır"
                            }
                        }
                    }
                }
            },
            "notifications": {
                "addAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bağlı kullanıcı hesapları alınırken hata oluştu"
                    },
                    "genericError": {
                        "description": "Bağlı hesap eklenirken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Gerekli bağlantılı kullanıcı hesabı başarıyla eklendi",
                        "message": "Bağlı kullanıcı hesabı başarıyla eklendi"
                    }
                },
                "getAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bağlı kullanıcı hesapları alınırken hata oluştu"
                    },
                    "genericError": {
                        "description": "Bağlı kullanıcı hesapları alınırken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Gerekli kullanıcı profili ayrıntıları başarıyla alındı",
                        "message": "Bağlı kullanıcı hesapları başarıyla alındı"
                    }
                },
                "removeAllAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bağlı kullanıcı hesapları kaldırılırken hata oluştu"
                    },
                    "genericError": {
                        "description": "Bağlı kullanıcı hesapları kaldırılırken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Tüm bağlı kullanıcı hesapları kaldırıldı",
                        "message": "Bağlı hesaplar başarıyla kaldırıldı"
                    }
                },
                "removeAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Bağlı kullanıcı hesabı kaldırılırken hata oluştu"
                    },
                    "genericError": {
                        "description": "Bağlı kullanıcı hesabı kaldırılırken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Bağlı kullanıcı hesapları kaldırıldı",
                        "message": "Bağlı hesap başarıyla kaldırıldı"
                    }
                },
                "switchAccount": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Hesap değiştirilirken hata oluştu"
                    },
                    "genericError": {
                        "description": "Hesap değiştirilirken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Hesap başarıyla değiştirildi",
                        "message": "Hesap başarıyla değiştirildi"
                    }
                }
            }
        },
        "loginVerifyData": {
            "description": "Bu veriler, oturum açma sırasında kimliğinizi daha fazla doğrulamak için kullanılır",
            "heading": "Girişinizi doğrulamak için kullanılan veriler",
            "modals": {
                "clearTypingPatternsModal": {
                    "heading": "Onayla",
                    "message": "Bu eylem, TypingDNA'da kaydedilen yazma kalıplarınızı temizleyecektir. "
                }
            },
            "notifications": {
                "clearTypingPatterns": {
                    "error": {
                        "description": "Yazma kalıpları temizlenemedi. ",
                        "message": "Yazma kalıpları temizlenemedi"
                    },
                    "success": {
                        "description": "TypingDNA'daki yazım kalıplarınız başarıyla temizlendi",
                        "message": "Yazma kalıpları başarıyla temizlendi"
                    }
                }
            },
            "typingdna": {
                "description": "Yazma kalıplarınız buradan temizlenebilir",
                "heading": "YazmaDNA Yazma Modelleri"
            }
        },
        "mfa": {
            "authenticatorApp": {
                "addHint": "Yapılandır",
                "configuredDescription": "İki faktörlü kimlik doğrulama için yapılandırılmış kimlik doğrulayıcı uygulamanızdaki TOTP kodlarını kullanabilirsiniz. ",
                "deleteHint": "Kaldırmak",
                "description": "İki faktörlü kimlik doğrulama için doğrulama kodları almak üzere kimlik doğrulayıcı uygulamasını kullanabilirsiniz.",
                "enableHint": "TOTP Kimlik Doğrulayıcıyı Etkinleştir/Devre Dışı Bırak",
                "heading": "Doğrulayıcı Uygulaması",
                "hint": "Görüş",
                "modals": {
                    "delete": {
                        "heading": "Onayla",
                        "message": "Bu işlem, profilinize eklenen QR kodunu kaldıracaktır.  "
                    },
                    "done": "Başarı! ",
                    "heading": "Bir Kimlik Doğrulayıcı Uygulaması Kurun",
                    "scan": {
                        "additionNote": "QR kodu profilinize başarıyla eklendi!",
                        "authenticatorApps": "Doğrulayıcı Uygulamalar",
                        "generate": "Yeni bir kod oluştur",
                        "heading": "Bir kimlik doğrulama uygulaması kullanarak aşağıdaki QR kodunu tarayın",
                        "messageBody": "Mevcut Authenticator Uygulamalarının bir listesini burada bulabilirsiniz.",
                        "messageHeading": "Yüklü bir Kimlik Doğrulayıcı Uygulamanız yok mu?",
                        "regenerateConfirmLabel": "Yeni bir QR kodu oluşturmayı onaylayın",
                        "regenerateWarning": {
                            "extended": "Yeni bir QR kodunu yeniden oluşturduğunuzda, onu taramanız ve kimlik doğrulayıcı uygulamanızı yeniden kurmanız gerekir. ",
                            "generic": "Yeni bir QR kodunu yeniden oluşturduğunuzda, onu taramanız ve kimlik doğrulayıcı uygulamanızı yeniden kurmanız gerekir. "
                        }
                    },
                    "toolTip": "Doğrulayıcı uygulamanız yok mu?  <1>Uygulama mağazası</1> veya <3>Google Oyun</3>",
                    "verify": {
                        "error": "Doğrulama başarısız oldu. ",
                        "heading": "Doğrulama için oluşturulan kodu girin",
                        "label": "Doğrulama kodu",
                        "placeholder": "Doğrulama kodunuzu girin",
                        "reScan": "yeniden tarama",
                        "reScanQuestion": "QR kodunu tekrar taramak ister misiniz?",
                        "requiredError": "Onay kodunu giriniz"
                    }
                },
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "QR kodu silinirken hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "Başarıyla kaldırıldı",
                        "message": "TOTP yapılandırması başarıyla kaldırıldı."
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "QR kodu alınırken bir hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "Yeni bir QR kodu almaya çalışırken bir hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "Etkin kimlik doğrulayıcı listesi güncellenmeye çalışılırken bir hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    }
                },
                "regenerate": "yeniden oluştur"
            },
            "backupCode": {
                "actions": {
                    "add": "Yedek kodları ekleyin",
                    "delete": "Yedek kodları kaldır"
                },
                "description": "Çok faktörlü kimlik doğrulama kodlarını alamamanız durumunda hesabınıza erişmek için yedek kodları kullanın. ",
                "download": {
                    "heading": "için yedek kodlar {{productName}}",
                    "info1": "Her bir yedek kodu yalnızca bir kez kullanabilirsiniz.",
                    "info2": "Bu kodlar üzerinde oluşturuldu ",
                    "subHeading": "Oturum açmak için bu yedek kodları kullanabilirsiniz. {{productName}} Telefonunuzdan uzakta olduğunuzda. "
                },
                "heading": "Yedek Kodlar",
                "messages": {
                    "disabledMessage": "Yedek kodları etkinleştirmek için en az bir ek kimlik doğrulayıcı yapılandırılmalıdır."
                },
                "modals": {
                    "actions": {
                        "copied": "kopyalandı",
                        "copy": "Kodları Kopyala",
                        "download": "Kodları İndir",
                        "regenerate": "yeniden oluştur"
                    },
                    "delete": {
                        "description": "Bu işlem, yedek kodları kaldıracak ve artık bunları kullanamayacaksınız. ",
                        "heading": "Onayla"
                    },
                    "description": "Telefonunuzdan uzaktayken oturum açmak için yedek kodları kullanın.",
                    "generate": {
                        "description": "Tüm yedek kodlarınız kullanılır. ",
                        "heading": "oluştur"
                    },
                    "heading": "Yedek Kodlar",
                    "info": "Her kod yalnızca bir kez kullanılabilir. ",
                    "regenerate": {
                        "description": "Yeni kodlar oluşturduktan sonra eski kodlarınız artık çalışmayacaktır. ",
                        "heading": "Onayla"
                    },
                    "subHeading": "Oturum açmak için kullanabileceğiniz tek seferlik parolalar",
                    "warn": "Bu kodlar yalnızca bir kez görünecektir. "
                },
                "mutedHeader": "Kurtarma Seçenekleri",
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "Yedek kodlar silinirken hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "Başarıyla kaldırıldı",
                        "message": "Yedek kodlar başarıyla kaldırıldı."
                    },
                    "downloadError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "Yedek kodlar indirilmeye çalışılırken bir hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    },
                    "downloadSuccess": {
                        "genericMessage": {
                            "description": "Yedek kodlar başarıyla indirildi.",
                            "message": "Yedek kodlar başarıyla indirildi."
                        },
                        "message": {
                            "description": "{{message}}",
                            "message": "Yedek kodlar başarıyla indirildi."
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "Yeni yedek kodlar oluşturulmaya çalışılırken bir hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    },
                    "retrieveAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "Etkin kimlik doğrulayıcı listesi alınmaya çalışılırken bir hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    },
                    "retrieveError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "Yedek kodlar alınırken bir hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "genericError": {
                            "description": "Etkin kimlik doğrulayıcı listesi güncellenmeye çalışılırken bir hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        }
                    }
                },
                "remaining": "geriye kalan"
            },
            "fido": {
                "description": "kullanabilirsiniz <1>geçiş anahtarı</1>, <1>FIDO2 Güvenlik Anahtarı</1> veya <1>Biyometri</1> Hesabınızda oturum açmak için cihazınızda.",
                "form": {
                    "label": "Güvenlik Anahtarı/Biyometrik",
                    "placeholder": "Güvenlik anahtarı/biyometri için bir ad girin",
                    "remove": "Güvenlik anahtarını/biyometriyi kaldırın",
                    "required": "Lütfen güvenlik anahtarınız/biyometrik bilgileriniz için bir ad girin"
                },
                "heading": "Güvenlik Anahtarı/Biyometri",
                "modals": {
                    "deleteConfirmation": {
                        "assertionHint": "Lütfen işleminizi onaylayın.",
                        "content": "Bu işlem geri alınamaz ve güvenlik anahtarını/biyometriyi kalıcı olarak siler.",
                        "description": "Bu güvenlik anahtarını/biyometriği silerseniz, hesabınızda tekrar oturum açamayabilirsiniz. ",
                        "heading": "Emin misin?"
                    },
                    "deviceRegistrationErrorModal": {
                        "description": "Güvenlik anahtarı/biyometri kaydı kesintiye uğradı. ",
                        "heading": "Güvenlik Anahtarı/Biyometrik Kayıt Başarısız",
                        "tryWithOlderDevice": "Daha eski bir güvenlik anahtarı/biyometri ile de tekrar deneyebilirsiniz."
                    }
                },
                "notifications": {
                    "removeDevice": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Güvenlik anahtarı/biyometri kaldırılırken hata oluştu"
                        },
                        "genericError": {
                            "description": "Güvenlik anahtarı/biyometri kaldırılırken hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "success": {
                            "description": "Güvenlik anahtarı/biyometri listeden başarıyla kaldırıldı",
                            "message": "Güvenlik Anahtarınız/Biyometriğiniz Başarıyla Kaldırıldı"
                        }
                    },
                    "startFidoFlow": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Güvenlik anahtarı/biyometri alınırken hata oluştu"
                        },
                        "genericError": {
                            "description": "Güvenlik anahtarı/biyometri alınırken hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "success": {
                            "description": "Güvenlik anahtarı/biyometri başarıyla kaydedildi ve artık bunu kimlik doğrulama için kullanabilirsiniz.",
                            "message": "Güvenlik Anahtarınız/Biyometriğiniz Başarıyla Kaydedildi"
                        }
                    },
                    "updateDeviceName": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Güvenlik anahtarı/biyometri adı güncellenirken hata oluştu"
                        },
                        "genericError": {
                            "description": "Güvenlik anahtarı/biyometri adı güncellenirken hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "success": {
                            "description": "Güvenlik anahtarınızın/biyometrinizin adı başarıyla güncellendi",
                            "message": "Güvenlik Anahtarı/Biyometrik ad başarıyla güncellendi"
                        }
                    }
                },
                "tryButton": "Daha eski bir Güvenlik Anahtarı/Biyometrik ile deneyin"
            },
            "smsOtp": {
                "descriptions": {
                    "hint": "Tek seferlik bir doğrulama kodu içeren bir kısa mesaj alacaksınız"
                },
                "heading": "SMS Numarası",
                "notifications": {
                    "updateMobile": {
                        "error": {
                            "description": "{{description}}",
                            "message": "Cep telefonu numarası güncellenirken hata oluştu"
                        },
                        "genericError": {
                            "description": "Cep telefonu numarası güncellenirken hata oluştu",
                            "message": "Bir şeyler yanlış gitti"
                        },
                        "success": {
                            "description": "Kullanıcı profilindeki cep telefonu numarası başarıyla güncellendi",
                            "message": "Cep telefonu numarası başarıyla güncellendi"
                        }
                    }
                }
            }
        },
        "mobileUpdateWizard": {
            "done": "Başarı! ",
            "notifications": {
                "resendError": {
                    "error": {
                        "description": "{{error}}",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "genericError": {
                        "description": "Yeni bir doğrulama kodu alınmaya çalışılırken bir hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    }
                },
                "resendSuccess": {
                    "message": "Yeniden kod isteği başarıyla gönderildi"
                }
            },
            "submitMobile": {
                "heading": "Yeni cep telefonu numaranızı girin"
            },
            "verifySmsOtp": {
                "error": "Doğrulama başarısız oldu. ",
                "generate": "Yeni bir doğrulama kodunu tekrar gönderin",
                "heading": "Cep numaranıza gönderilen doğrulama kodunu giriniz.",
                "label": "Doğrulama kodu",
                "placeholder": "Doğrulama kodunuzu girin",
                "requiredError": "Onay kodunu giriniz"
            }
        },
        "overview": {
            "widgets": {
                "accountActivity": {
                    "actionTitles": {
                        "update": "Hesap etkinliğini yönet"
                    },
                    "description": "Şu anda aşağıdaki cihazdan giriş yaptınız",
                    "header": "Aktif Oturumlar"
                },
                "accountSecurity": {
                    "actionTitles": {
                        "update": "Hesap güvenliğini güncelle"
                    },
                    "description": "Hesabınızı güvende tutmanıza yardımcı olacak ayarlar ve öneriler",
                    "header": "hesap Güvenliği"
                },
                "accountStatus": {
                    "complete": "profiliniz tamamlandı",
                    "completedFields": "Tamamlanan alanlar",
                    "completionPercentage": "Profilinizin tamamlanma zamanı {{percentage}}%",
                    "inComplete": "profilinizi tamamlayın",
                    "inCompleteFields": "Eksik alanlar",
                    "mandatoryFieldsCompletion": "{{completed}} dışında {{total}} doldurulması zorunlu alanlar",
                    "optionalFieldsCompletion": "{{completed}} dışında {{total}} isteğe bağlı alanlar tamamlandı"
                },
                "consentManagement": {
                    "actionTitles": {
                        "manage": "İzinleri yönet"
                    },
                    "description": "Uygulamalarla paylaşmak istediğiniz verileri kontrol edin",
                    "header": "Kontrol Onayları"
                },
                "profileStatus": {
                    "completionPercentage": "Profilinizin tamamlanma zamanı {{percentage}}%",
                    "description": "profilinizi yönetin",
                    "header": "Senin {{productName}} Profil",
                    "profileText": "Kişisel profilinizin ayrıntıları",
                    "readOnlyDescription": "profilinizi görüntüleyin",
                    "userSourceText": "(üzerinden kaydoldu {{source}})"
                }
            }
        },
        "privacy": {
            "about": {
                "description": "WSO2 Kimlik Sunucusu (bu politikada \"WSO2 IS\" olarak anılacaktır), açık standartlara ve spesifikasyonlara dayalı açık kaynaklı bir Kimlik Yönetimi ve Yetkilendirme Sunucusudur.",
                "heading": "WSO2 Kimlik Sunucusu Hakkında"
            },
            "privacyPolicy": {
                "collectionOfPersonalInfo": {
                    "description": {
                        "list1": {
                            "0": "WSO2 IS, hesabınıza yapılan herhangi bir şüpheli oturum açma girişimini tespit etmek için IP adresinizi kullanır.",
                            "1": "WSO2 IS, zengin ve kişiselleştirilmiş bir kullanıcı deneyimi sağlamak için adınız, soyadınız vb. gibi öznitelikleri kullanır.",
                            "2": "WSO2 IS, güvenlik sorularınızı ve yanıtlarınızı yalnızca hesap kurtarmaya izin vermek için kullanır."
                        },
                        "para1": "WSO2 IS, bilgilerinizi yalnızca erişim gereksinimlerinizi karşılamak için toplar. "
                    },
                    "heading": "Kişisel bilgilerin toplanması",
                    "trackingTechnologies": {
                        "description": {
                            "list1": {
                                "0": "Kişisel verilerinizi girdiğiniz kullanıcı profili sayfasından bilgi toplama.",
                                "1": "IP adresinizi HTTP isteği, HTTP başlıkları ve TCP/IP ile izleme.",
                                "2": "IP adresi ile coğrafi bilgilerinizin takibi.",
                                "3": "Giriş geçmişinizi tarayıcı tanımlama bilgileriyle izleme.  {{cookiePolicyLink}} daha fazla bilgi için."
                            },
                            "para1": "WSO2 IS, bilgilerinizi şu şekilde toplar:"
                        },
                        "heading": "Takip Teknolojileri"
                    }
                },
                "description": {
                    "para1": "Bu politika, WSO2 IS'nin kişisel bilgilerinizi nasıl topladığını, toplama amaçlarını ve kişisel bilgilerinizin saklanmasına ilişkin bilgileri açıklamaktadır.",
                    "para2": "Lütfen bu politikanın yalnızca referans amaçlı olduğunu ve bir ürün olarak yazılım için geçerli olduğunu unutmayın.  <1>feragatname</1> Daha fazla bilgi için bölüm.",
                    "para3": "WSO2 IS'nin kullanımını ve yönetimini kontrol eden kuruluşlar, kuruluşlar veya bireyler, verilerin ilgili varlık, kuruluş veya kişi tarafından kontrol edilme veya işlenme şeklini belirleyen kendi gizlilik politikalarını oluşturmalıdır."
                },
                "disclaimer": {
                    "description": {
                        "list1": {
                            "0": "WSO2, çalışanları, ortakları ve bağlı kuruluşları, WSO2 IS'de yer alan kişisel veriler de dahil olmak üzere hiçbir veriye erişim sahibi değildir ve bunları gerektirmez, saklamaz, işlemez veya kontrol etmez. ",
                            "1": "Bu gizlilik politikası, WSO2 IS çalıştıran kurum veya kişilerin bilgilendirme amaçlıdır ve kişisel verilerin korunmasına ilişkin olarak WSO2 IS kapsamında yer alan süreçleri ve işlevleri belirler. "
                        }
                    },
                    "heading": "Feragatname"
                },
                "disclosureOfPersonalInfo": {
                    "description": "WSO2 IS, kişisel bilgileri yalnızca WSO2 IS'ye kayıtlı ilgili uygulamalara (Hizmet Sağlayıcı olarak da bilinir) ifşa eder. ",
                    "heading": "kişisel bilgilerin ifşası",
                    "legalProcess": {
                        "description": "Lütfen, WSO2 IS'yi çalıştıran kuruluş, kuruluş veya bireyin, gerekli ve yasal süreci takiben kanunen gerekli olduğu durumlarda, kişisel bilgilerinizi izniniz olsun veya olmasın ifşa etmek zorunda kalabileceğini unutmayın.",
                        "heading": "Yasal süreç"
                    }
                },
                "heading": "Gizlilik Politikası",
                "moreInfo": {
                    "changesToPolicy": {
                        "description": {
                            "para1": "WSO2 IS'nin yükseltilmiş sürümleri, bu politikada değişiklikler içerebilir ve bu politikada yapılan revizyonlar, bu tür yükseltmeler içinde paketlenecektir. ",
                            "para2": "WSO2 IS'yi çalıştıran kuruluş, Gizlilik Politikasını zaman zaman revize edebilir. "
                        },
                        "heading": "Bu politikadaki değişiklikler"
                    },
                    "contactUs": {
                        "description": {
                            "para1": "Bu gizlilik politikasıyla ilgili herhangi bir sorunuz veya endişeniz varsa lütfen WSO2 ile iletişime geçin."
                        },
                        "heading": "Bize Ulaşın"
                    },
                    "heading": "Daha fazla bilgi",
                    "yourChoices": {
                        "description": {
                            "para1": "WSO2 IS içinde zaten bir kullanıcı hesabınız varsa ve bu gizlilik politikasının sizin için kabul edilemez olduğunu fark ederseniz, hesabınızı devre dışı bırakma hakkınız vardır.",
                            "para2": "Hesabınız yoksa ve gizlilik politikamızı kabul etmiyorsanız, hesap oluşturmamayı seçebilirsiniz."
                        },
                        "heading": "Senin seçimlerin"
                    }
                },
                "storageOfPersonalInfo": {
                    "heading": "Kişisel bilgilerin saklanması",
                    "howLong": {
                        "description": {
                            "list1": {
                                "0": "Mevcut Şifre",
                                "1": "Daha önce kullanılan şifreler"
                            },
                            "para1": "WSO2 IS, sistemimizin aktif bir kullanıcısı olduğunuz sürece kişisel verilerinizi saklar. ",
                            "para2": "WSO2 IS, size ek bir güvenlik düzeyi sağlamak için hashlenmiş sırlar tutabilir. "
                        },
                        "heading": "Kişisel bilgileriniz ne kadar süreyle saklanır?"
                    },
                    "requestRemoval": {
                        "description": {
                            "para1": "Yöneticiden hesabınızı silmesini isteyebilirsiniz. ",
                            "para2": "Ek olarak, WSO2 IS'nin günlüklerde, veritabanlarında veya analitik depolamada tutmuş olabileceği faaliyetlerinizin tüm izlerini anonimleştirme talebinde bulunabilirsiniz."
                        },
                        "heading": "Kişisel bilgilerinizin kaldırılmasını nasıl talep edebilirsiniz?"
                    },
                    "where": {
                        "description": {
                            "para1": "WSO2 IS, kişisel bilgilerinizi güvenli veritabanlarında saklar. ",
                            "para2": "WSO2 IS, kişisel verilerinizi ek bir güvenlik düzeyiyle saklamak için şifreleme kullanabilir."
                        },
                        "heading": "Kişisel bilgileriniz nerede saklanır?"
                    }
                },
                "useOfPersonalInfo": {
                    "description": {
                        "list1": {
                            "0": "Size kişiselleştirilmiş bir kullanıcı deneyimi sağlamak için. ",
                            "1": "Hesabınızı yetkisiz erişimden veya olası bilgisayar korsanlığı girişimlerinden korumak için. ",
                            "2": "Sistem performansı iyileştirmelerine ilişkin analitik amaçlar için istatistiksel veriler elde edin. "
                        },
                        "para1": "WSO2 IS, kişisel bilgilerinizi yalnızca toplanma amaçları (veya bu amaçla tutarlı olarak tanımlanan bir kullanım için) için kullanacaktır.",
                        "para2": "WSO2 IS, kişisel bilgilerinizi yalnızca aşağıdaki amaçlar için kullanır.",
                        "subList1": {
                            "heading": "Bu içerir:",
                            "list": {
                                "0": "IP adresi",
                                "1": "tarayıcı parmak izi",
                                "2": "Kurabiye"
                            }
                        },
                        "subList2": {
                            "heading": "WSO2 IS şunları kullanabilir:",
                            "list": {
                                "0": "Coğrafi bilgi elde etmek için IP Adresi",
                                "1": "Tarayıcı teknolojisini ve/veya sürümünü belirlemek için tarayıcı parmak izi"
                            }
                        }
                    },
                    "heading": "kişisel bilgilerin kullanımı"
                },
                "whatIsPersonalInfo": {
                    "description": {
                        "list1": {
                            "0": "Kullanıcı adınız (işvereniniz tarafından oluşturulan kullanıcı adının sözleşme kapsamında olduğu durumlar hariç)",
                            "1": "Doğum tarihiniz/yaşınız",
                            "2": "Oturum açmak için kullanılan IP adresi",
                            "3": "Giriş yapmak için bir cihaz (ör. telefon veya tablet) kullanıyorsanız cihaz kimliğiniz"
                        },
                        "list2": {
                            "0": "TCP/IP bağlantısını oluşturduğunuz Şehir/Ülke",
                            "1": "Giriş yaptığınız günün saati (yıl, ay, hafta, saat veya dakika)",
                            "2": "Giriş yapmak için kullandığınız cihazın türü (ör. telefon veya tablet)",
                            "3": "İşletim sistemi ve genel tarayıcı bilgileri"
                        },
                        "para1": "WSO2 IS, sizinle ilgili olan ve tanımlanabileceğiniz her şeyi kişisel bilgileriniz olarak kabul eder. ",
                        "para2": "Bununla birlikte, WSO2 IS, kişisel bilgi olarak kabul edilmeyen, yalnızca aşağıdaki bilgileri de toplar: <1>istatistiksel</1> amaçlar. "
                    },
                    "heading": "Kişisel bilgi nedir?"
                }
            }
        },
        "profile": {
            "fields": {
                "Account Confirmed Time": "Hesabın Onaylanma Zamanı",
                "Account Disabled": "Hesap Devre Dışı",
                "Account Locked": "Hesap Kilitli",
                "Account State": "Hesap Durumu",
                "Active": "Aktif",
                "Address - Street": "Sokak adresi",
                "Ask Password": "Şifre Sor",
                "Backup Code Enabled": "Yedekleme Kodu Etkin",
                "Backup Codes": "Yedek Kodlar",
                "Birth Date": "Doğum günü",
                "Country": "Ülke",
                "Created Time": "Oluşturma Zamanı",
                "Disable EmailOTP": "EmailOTP'yi devre dışı bırak",
                "Disable SMSOTP": "SMSOTP'yi devre dışı bırak",
                "Display Name": "Ekran adı",
                "Email": "E-posta",
                "Email Verified": "E-posta Doğrulandı",
                "Enabled Authenticators": "Etkin Doğrulayıcılar",
                "Existing Lite User": "Mevcut Lite Kullanıcısı",
                "External ID": "Harici Kimlik",
                "Failed Attempts Before Success": "Başarıdan Önce Başarısız Denemeler",
                "Failed Backup Code Attempts": "Başarısız Yedekleme Kodu Denemeleri",
                "Failed Email OTP Attempts": "Başarısız E-posta OTP Denemeleri",
                "Failed Lockout Count": "Başarısız Kilitleme Sayısı",
                "Failed Login Attempts": "Başarısız Giriş Denemeleri",
                "Failed Password Recovery Attempts": "Başarısız Şifre Kurtarma Girişimleri",
                "Failed SMS OTP Attempts": "Başarısız SMS OTP Denemeleri",
                "Failed TOTP Attempts": "Başarısız TOTP Denemeleri",
                "First Name": "İlk adı",
                "Force Password Reset": "Parola Sıfırlamaya Zorla",
                "Full Name": "Ad Soyad",
                "Gender": "Cinsiyet",
                "Groups": "Gruplar",
                "Identity Provider Type": "Kimlik Sağlayıcı Türü",
                "Last Logon": "Son Oturum Açma",
                "Last Modified Time": "Son Değiştirme Zamanı",
                "Last Name": "Soy isim",
                "Last Password Update": "Son Şifre Güncellemesi",
                "Lite User": "Basit Kullanıcı",
                "Lite User ID": "Basit Kullanıcı Kimliği",
                "Local": "Yerel",
                "Local Credential Exists": "Yerel Kimlik Bilgileri Var",
                "Locality": "yerellik",
                "Location": "Konum",
                "Locked Reason": "Kilitlenme Nedeni",
                "Manager - Name": "Yönetici ismi",
                "Middle Name": "İkinci ad",
                "Mobile": "mobil",
                "Nick Name": "Takma ad",
                "Phone Verified": "Telefon Doğrulandı",
                "Photo - Thumbnail": "Fotoğraf - Küçük resim",
                "Photo URL": "Fotoğraf URL'si",
                "Postal Code": "Posta Kodu",
                "Preferred Channel": "Tercih Edilen Kanal",
                "Read Only User": "Salt Okunur Kullanıcı",
                "Region": "Bölge",
                "Resource Type": "Kaynak tipi",
                "Roles": "Roller",
                "Secret Key": "Gizli anahtar",
                "TOTP Enabled": "TOTP Etkin",
                "Time Zone": "Saat dilimi",
                "URL": "URL",
                "Unlock Time": "Kilit Açma Zamanı",
                "User Account Type": "Kullanıcı Hesabı Türü",
                "User ID": "Kullanıcı kimliği",
                "User Metadata - Version": "Kullanıcı Meta Verileri - Sürüm",
                "User Source": "Kullanıcı Kaynağı",
                "User Source ID": "Kullanıcı Kaynağı Kimliği",
                "Username": "Kullanıcı adı",
                "Verification Pending Email": "Doğrulama Bekleyen E-posta",
                "Verification Pending Mobile Number": "Doğrulama Bekleyen Cep Numarası",
                "Verify Email": "E-mail'i doğrula",
                "Verify Mobile": "Mobil Doğrula",
                "Verify Secret Key": "Gizli Anahtarı Doğrulayın",
                "Website URL": "Web Sitesi URL'si",
                "emails": "E-posta",
                "generic": {
                    "default": "Eklemek {{fieldName}}"
                },
                "nameFamilyName": "Soy isim",
                "nameGivenName": "İlk adı",
                "phoneNumbers": "Telefon numarası",
                "profileImage": "Profil Resmi",
                "profileUrl": "URL",
                "userName": "Kullanıcı adı"
            },
            "forms": {
                "countryChangeForm": {
                    "inputs": {
                        "country": {
                            "placeholder": "Ülkeni seç"
                        }
                    }
                },
                "dateChangeForm": {
                    "inputs": {
                        "date": {
                            "validations": {
                                "futureDateError": "için girdiğiniz tarih {{field}} alan geçersiz.",
                                "invalidFormat": "Lütfen geçerli bir girin {{fieldName}} YYYY-AA-GG biçiminde."
                            }
                        }
                    }
                },
                "emailChangeForm": {
                    "inputs": {
                        "email": {
                            "label": "E-posta",
                            "note": "NOT: Bunu düzenlemek, bu hesapla ilişkili e-posta adresini değiştirir. ",
                            "placeholder": "E-posta adresinizi giriniz",
                            "validations": {
                                "empty": "Email adresini doldurmanız zorunludur",
                                "invalidFormat": "Geçerli bir e. "
                            }
                        }
                    }
                },
                "generic": {
                    "inputs": {
                        "placeholder": "Girin {{fieldName}}",
                        "readonly": {
                            "placeholder": "Bu değer boş",
                            "popup": "güncellemek için yönetici ile iletişime geçin. {{fieldName}}"
                        },
                        "validations": {
                            "empty": "{{fieldName}} Zorunlu bir alandır",
                            "invalidFormat": "formatı {{fieldName}} girilen yanlış"
                        }
                    }
                },
                "mobileChangeForm": {
                    "inputs": {
                        "mobile": {
                            "label": "Cep numarası",
                            "note": "NOT: Bu, profilinizdeki cep telefonu numarasını değiştirecektir.",
                            "placeholder": "telefon numaranızı girin",
                            "validations": {
                                "empty": "Cep telefonu numarası zorunlu bir alandır",
                                "invalidFormat": "Lütfen [ ][ülke kodu][alan kodu][yerel telefon numarası] biçiminde geçerli bir cep telefonu numarası girin."
                            }
                        }
                    }
                },
                "nameChangeForm": {
                    "inputs": {
                        "firstName": {
                            "label": "İlk adı",
                            "placeholder": "İlk adı girin",
                            "validations": {
                                "empty": "Ad, zorunlu bir alandır"
                            }
                        },
                        "lastName": {
                            "label": "Soy isim",
                            "placeholder": "soyadını girin",
                            "validations": {
                                "empty": "Soyadı zorunlu bir alandır"
                            }
                        }
                    }
                },
                "organizationChangeForm": {
                    "inputs": {
                        "organization": {
                            "label": "organizasyon",
                            "placeholder": "Kuruluşunuzu girin",
                            "validations": {
                                "empty": "Organizasyon zorunlu bir alandır"
                            }
                        }
                    }
                }
            },
            "messages": {
                "emailConfirmation": {
                    "content": "Yeni e-postayı profilinize eklemek için lütfen e-posta adresi güncellemesini onaylayın.",
                    "header": "Onay bekliyor!"
                },
                "mobileVerification": {
                    "content": "Bu cep telefonu numarası, ikinci faktörlü kimlik doğrulama etkinleştirildiğinde SMS OTP göndermek ve bir kullanıcı adı/şifre kurtarma durumunda kurtarma kodları göndermek için kullanılır. "
                }
            },
            "notifications": {
                "getProfileCompletion": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Hata oluştu"
                    },
                    "genericError": {
                        "description": "Profil tamamlama değerlendirilirken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Profil tamamlama başarıyla değerlendirildi",
                        "message": "Hesaplama Başarılı"
                    }
                },
                "getProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Profil ayrıntıları alınırken hata oluştu"
                    },
                    "genericError": {
                        "description": "Profil ayrıntıları alınırken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Gerekli kullanıcı profili ayrıntıları başarıyla alındı",
                        "message": "Kullanıcı profili başarıyla alındı"
                    }
                },
                "getUserReadOnlyStatus": {
                    "genericError": {
                        "description": "Kullanıcının salt okunur durumu alınırken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    }
                },
                "updateProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Profil ayrıntıları güncellenirken hata oluştu"
                    },
                    "genericError": {
                        "description": "Profil ayrıntıları güncellenirken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Gerekli kullanıcı profili ayrıntıları başarıyla güncellendi",
                        "message": "Kullanıcı profili başarıyla güncellendi"
                    }
                }
            },
            "placeholders": {
                "SCIMDisabled": {
                    "heading": "Bu özellik hesabınız için mevcut değil"
                }
            }
        },
        "profileExport": {
            "notifications": {
                "downloadProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Kullanıcı profili ayrıntıları indirilirken hata oluştu"
                    },
                    "genericError": {
                        "description": "Kullanıcı profili ayrıntıları indirilirken hata oluştu",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Gerekli kullanıcı profili ayrıntılarını içeren dosya indirilmeye başlandı",
                        "message": "Kullanıcı profili ayrıntıları indirme işlemi başladı"
                    }
                }
            }
        },
        "userAvatar": {
            "infoPopover": "Bu görüntü şu adresten alındı: <1>Gravatar</1> hizmet.",
            "urlUpdateHeader": "Profil resminizi ayarlamak için bir resim URL'si girin"
        },
        "userSessions": {
            "browserAndOS": "{{browser}} Açık {{os}} {{version}}",
            "dangerZones": {
                "terminate": {
                    "actionTitle": "sonlandırmak",
                    "header": "Oturumu sonlandır",
                    "subheader": "Belirli bir cihazda oturumunuz kapatılacaktır."
                }
            },
            "lastAccessed": "Son Erişim {{date}}",
            "modals": {
                "terminateActiveUserSessionModal": {
                    "heading": "Mevcut Aktif Oturumları Sonlandır",
                    "message": "İkinci faktörlü kimlik doğrulama (2FA) seçenek değişiklikleri aktif oturumlarınıza uygulanmayacaktır. ",
                    "primaryAction": "Tümünü sonlandır",
                    "secondaryAction": "İncele ve sonlandır"
                },
                "terminateAllUserSessionsModal": {
                    "heading": "Onayla",
                    "message": "İşlem, sizi bu oturumdan ve her cihazdaki diğer tüm oturumlardan çıkaracaktır. "
                },
                "terminateUserSessionModal": {
                    "heading": "Onayla",
                    "message": "Bu işlem, belirli bir cihazda oturumunuzu kapatacaktır. "
                }
            },
            "notifications": {
                "fetchSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Etkin oturum alınırken hata oluştu"
                    },
                    "genericError": {
                        "description": "Etkin oturumlar alınamadı",
                        "message": "Bir şeyler yanlış gitti"
                    },
                    "success": {
                        "description": "Etkin oturumlar başarıyla alındı",
                        "message": "Etkin oturum alımı başarılı"
                    }
                },
                "terminateAllUserSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Etkin oturumlar sonlandırılamadı"
                    },
                    "genericError": {
                        "description": "Etkin oturumlar sonlandırılırken bir şeyler ters gitti",
                        "message": "Etkin oturumlar sonlandırılamadı"
                    },
                    "success": {
                        "description": "Tüm etkin oturumlar başarıyla sonlandırıldı",
                        "message": "Tüm etkin oturumları sonlandırdı"
                    }
                },
                "terminateUserSession": {
                    "error": {
                        "description": "{{description}}",
                        "message": "Etkin oturum sonlandırılamadı"
                    },
                    "genericError": {
                        "description": "Etkin oturum sonlandırılırken bir şeyler ters gitti",
                        "message": "Etkin oturum sonlandırılamadı"
                    },
                    "success": {
                        "description": "Etkin oturum başarıyla sonlandırıldı",
                        "message": "Oturum sonlandırıldı başarılı"
                    }
                }
            }
        }
    },
    "modals": {
        "editAvatarModal": {
            "content": {
                "gravatar": {
                    "errors": {
                        "noAssociation": {
                            "content": "Görünüşe göre seçilen e-posta Gravatar'da kayıtlı değil. ",
                            "header": "Eşleşen Gravatar görseli bulunamadı!"
                        }
                    },
                    "heading": "Gravatar dayalı "
                },
                "hostedAvatar": {
                    "heading": "Barındırılan Resim",
                    "input": {
                        "errors": {
                            "http": {
                                "content": "Seçilen URL, HTTP üzerinden sunulan güvenli olmayan bir resme işaret ediyor. ",
                                "header": "Güvenli Olmayan İçerik!"
                            },
                            "invalid": {
                                "content": "Lütfen geçerli bir resim URL'si girin"
                            }
                        },
                        "hint": "Üçüncü taraf bir konumda barındırılan geçerli bir resim URL'si girin.",
                        "placeholder": "Resim için URL'yi girin.",
                        "warnings": {
                            "dataURL": {
                                "content": "Büyük karakter sayısına sahip Veri URL'lerinin kullanılması, veritabanı sorunlarına neden olabilir. ",
                                "header": "Girilen Veri URL'sini tekrar kontrol edin!"
                            }
                        }
                    }
                },
                "systemGenAvatars": {
                    "heading": "Sistem tarafından oluşturulan avatar",
                    "types": {
                        "initials": "baş harfleri"
                    }
                }
            },
            "description": null,
            "heading": "Profil resmini güncelle",
            "primaryButton": "Kaydetmek",
            "secondaryButton": "İptal etmek"
        },
        "sessionTimeoutModal": {
            "description": "üzerine tıkladığınızda <1>Geri gitmek</1>, varsa oturumu kurtarmaya çalışacağız. ",
            "heading": "Görünüşe göre uzun süredir aktif değilsin.",
            "loginAgainButton": "Tekrar giriş yap",
            "primaryButton": "Geri gitmek",
            "secondaryButton": "Çıkış Yap",
            "sessionTimedOutDescription": "Kaldığınız yerden devam etmek için lütfen tekrar giriş yapınız.",
            "sessionTimedOutHeading": "Hareketsizlik nedeniyle kullanıcı oturumunun süresi doldu."
        }
    },
    "pages": {
        "applications": {
            "subTitle": "Uygulamalarınızı keşfedin ve erişin",
            "title": "Uygulamalar"
        },
        "overview": {
            "subTitle": "Kişisel bilgilerinizi, hesap güvenliğinizi ve gizlilik ayarlarınızı yönetin",
            "title": "Hoş geldin, {{firstName}}"
        },
        "personalInfo": {
            "subTitle": "Kişisel profilinizi düzenleyin veya dışa aktarın ve bağlantılı hesapları yönetin",
            "title": "Kişisel bilgi"
        },
        "personalInfoWithoutExportProfile": {
            "subTitle": "Kişisel bilgilerinizi görüntüleyin ve yönetin",
            "title": "Kişisel bilgi"
        },
        "personalInfoWithoutLinkedAccounts": {
            "subTitle": "Kişisel profilinizi düzenleyin veya dışa aktarın",
            "title": "Kişisel bilgi"
        },
        "privacy": {
            "subTitle": "",
            "title": "WSO2 Kimlik Sunucusu Gizlilik Politikası"
        },
        "readOnlyProfileBanner": "Profiliniz bu portaldan değiştirilemez. ",
        "security": {
            "subTitle": "Onayları, oturumları ve güvenlik ayarlarını yöneterek hesabınızın güvenliğini sağlayın",
            "title": "Güvenlik"
        }
    },
    "placeholders": {
        "404": {
            "action": "Eve geri dön",
            "subtitles": {
                "0": "Aradığınız sayfayı bulamadık.",
                "1": "Lütfen URL'yi kontrol edin veya ana sayfaya geri yönlendirilmek için aşağıdaki düğmeyi tıklayın."
            },
            "title": "sayfa bulunamadı"
        },
        "accessDeniedError": {
            "action": "Eve geri dön",
            "subtitles": {
                "0": "Görünüşe göre bu sayfaya erişmenize izin verilmiyor.",
                "1": "Lütfen farklı bir hesapla oturum açmayı deneyin."
            },
            "title": "Erişim verilmedi"
        },
        "emptySearchResult": {
            "action": "Arama sorgusunu temizle",
            "subtitles": {
                "0": "\" araması için sonuç bulunamadı.{{query}}\"",
                "1": "Lütfen farklı bir arama terimi deneyin."
            },
            "title": "Sonuç bulunamadı"
        },
        "genericError": {
            "action": "Sayfayı yenile",
            "subtitles": {
                "0": "Bu sayfa görüntülenirken bir şeyler ters gitti.",
                "1": "Teknik ayrıntılar için tarayıcı konsoluna bakın."
            },
            "title": "Bir şeyler yanlış gitti"
        },
        "loginError": {
            "action": "oturumu kapatmaya devam et",
            "subtitles": {
                "0": "Bu portalı kullanma izniniz yok gibi görünüyor.",
                "1": "Lütfen farklı bir hesapla oturum açın."
            },
            "title": "Yetkili değilsin"
        },
        "sessionStorageDisabled": {
            "subtitles": {
                "0": "Bu uygulamayı kullanmak için, web tarayıcınızın ayarlarında çerezleri etkinleştirmelisiniz.",
                "1": "Çerezlerin nasıl etkinleştirileceği hakkında daha fazla bilgi için web tarayıcınızın yardım bölümüne bakın."
            },
            "title": "Çerezler tarayıcınızda devre dışı bırakıldı."
        }
    },
    "sections": {
        "accountRecovery": {
            "description": "Kullanıcı adınızı veya şifrenizi kurtarmanıza yardımcı olmak için kullanabileceğimiz kurtarma bilgilerini yönetin",
            "heading": "Hesap kurtarma"
        },
        "changePassword": {
            "actionTitles": {
                "change": "Şifreni değiştir"
            },
            "description": "Parolanızı düzenli olarak güncelleyin ve kullandığınız diğer parolalardan farklı olduğundan emin olun.",
            "heading": "Şifre değiştir"
        },
        "consentManagement": {
            "actionTitles": {
                "empty": "Herhangi bir uygulamaya izin vermediniz"
            },
            "description": "Her başvuru için sağladığınız onayları inceleyin. ",
            "heading": "İzinleri Yönet",
            "placeholders": {
                "emptyConsentList": {
                    "heading": "Herhangi bir uygulamaya izin vermediniz"
                }
            }
        },
        "createPassword": {
            "actionTitles": {
                "create": "Şifre oluştur"
            },
            "description": "içinde bir şifre oluşturun {{productName}}.  {{productName}} sosyal girişe ek olarak.",
            "heading": "Şifre oluştur"
        },
        "federatedAssociations": {
            "description": "Bu hesapla bağlantılı diğer kimlik sağlayıcılardan hesaplarınızı görüntüleyin",
            "heading": "Bağlantılı Sosyal Hesaplar"
        },
        "linkedAccounts": {
            "actionTitles": {
                "add": "Hesap eklemek"
            },
            "description": "Diğer hesaplarınızı bağlayın/ilişkilendirin ve yeniden oturum açmanıza gerek kalmadan onlara sorunsuz bir şekilde erişin",
            "heading": "Bağlı Hesaplar"
        },
        "mfa": {
            "description": "Kolayca oturum açmak veya hesabınıza fazladan bir güvenlik katmanı eklemek için ek kimlik doğrulamaları yapılandırın.",
            "heading": "Ek Kimlik Doğrulama"
        },
        "profile": {
            "description": "Kişisel profilinizi yönetin",
            "heading": "Profil"
        },
        "profileExport": {
            "actionTitles": {
                "export": "profili indir"
            },
            "description": "Kişisel veriler, güvenlik soruları ve izinler dahil olmak üzere tüm profil verilerinizi indirin",
            "heading": "Profili Dışa Aktar"
        },
        "userSessions": {
            "actionTitles": {
                "empty": "Aktif oturum yok",
                "terminateAll": "Tüm oturumları sonlandır"
            },
            "description": "Hesabınız için tüm etkin kullanıcı oturumlarını inceleyin",
            "heading": "Aktif Oturumlar",
            "placeholders": {
                "emptySessionList": {
                    "heading": "Bu kullanıcı için aktif oturum yok"
                }
            }
        }
    }
};
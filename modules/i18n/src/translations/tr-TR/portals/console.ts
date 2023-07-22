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

import { ConsoleNS } from "../../../models";

/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */
export const console: ConsoleNS = {
    common: {
      advancedSearch: {
        form: {
          inputs: {
            filterAttribute: {
              label: "Filtre özelliği",
              placeholder: "Örneğin. ",
              validations: {
                empty: "Filtre özelliği zorunlu bir alandır."
              }
            },
            filterCondition: {
              label: "Filtre koşulu",
              placeholder: "Örneğin. ",
              validations: {
                empty: "Filtre koşulu zorunlu bir alandır."
              }
            },
            filterValue: {
              label: "Filtre değeri",
              placeholder: "Örneğin. ",
              validations: {
                empty: "Filtre değeri zorunlu bir alandır."
              }
            }
          }
        },
        hints: {
          querySearch: {
            actionKeys: "Shift Enter",
            label: "Sorgu olarak aramak için"
          }
        },
        options: {
          header: "Gelişmiş Arama"
        },
        placeholder: "şuna göre ara: {{attribute}}",
        popups: {
          clear: "aramayı Temizle",
          dropdown: "Seçenekleri göster"
        },
        resultsIndicator: "\" sorgusu için sonuçlar gösteriliyor.{{query}}\""
      },
      cookieConsent: {
        confirmButton: "Anladım",
        content: "Genel olarak en iyi deneyimi yaşamanızı sağlamak için tanımlama bilgileri kullanıyoruz.  <1>Çerez politikası</1>."
      },
      dateTime: {
        humanizedDateString: "Son düzenleme {{date}} evvel"
      },
      header: {
        appSwitch: {
          console: {
            description: "Geliştiriciler veya yöneticiler olarak yönetin",
            name: "Konsol"
          },
          myAccount: {
            description: "Kendi hesabınızı yönetin",
            name: "Hesabım"
          },
          tooltip: "Uygulamalar"
        },
        featureAnnouncements: {
          organizations: {
            message: "B2B organizasyonları ile tanışın. ",
            buttons: {
              tryout: "Dene"
            }
          }
        },
        organizationSwitch: {
          breadcrumbError: {
            description: "Kuruluş hiyerarşisi getirilirken bir hata oluştu.",
            message: "Bir şeyler yanlış gitti"
          },
          emptyOrgListMessage: "Kuruluş yok",
          orgSearchPlaceholder: "Kuruluş adına göre ara"
        }
      },
      modals: {
        editAvatarModal: {
          content: {
            gravatar: {
              errors: {
                noAssociation: {
                  content: "Görünüşe göre seçilen e-posta Gravatar'da kayıtlı değil. ",
                  header: "Eşleşen Gravatar görseli bulunamadı!"
                }
              },
              heading: "Gravatar dayalı "
            },
            hostedAvatar: {
              heading: "Barındırılan Resim",
              input: {
                errors: {
                  http: {
                    content: "Seçilen URL, HTTP üzerinden sunulan güvenli olmayan bir resme işaret ediyor. ",
                    header: "Güvenli Olmayan İçerik!"
                  },
                  invalid: {
                    content: "Lütfen geçerli bir resim URL'si girin"
                  }
                },
                hint: "Üçüncü taraf bir konumda barındırılan geçerli bir resim URL'si girin.",
                placeholder: "Resim için URL'yi girin.",
                warnings: {
                  dataURL: {
                    content: "Büyük karakter sayısına sahip Veri URL'lerinin kullanılması, veritabanı sorunlarına neden olabilir. ",
                    header: "Girilen Veri URL'sini tekrar kontrol edin!"
                  }
                }
              }
            },
            systemGenAvatars: {
              heading: "Sistem tarafından oluşturulan avatar",
              types: {
                initials: "baş harfleri"
              }
            }
          },
          description: null,
          heading: "Profil Resmini Güncelle",
          primaryButton: "Kaydet",
          secondaryButton: "İptal Et"
        },
        "sessionTimeoutModal": {
          "description": " <1>Geri Dön</1>'e  tıkladığınızda, varsa oturumu kurtarmaya çalışacağız. ",
          "heading": "Uzun süredir aktif değilsin.",
          "loginAgainButton": "Tekrar giriş yap",
          "primaryButton": "Geri Dön",
          "secondaryButton": "Çıkış Yap",
          "sessionTimedOutDescription": "Kaldığınız yerden devam etmek için lütfen tekrar giriş yapınız.",
          "sessionTimedOutHeading": "Hareketsizlik nedeniyle kullanıcı oturumunun süresi doldu."
        }
      },
      notifications: {
        invalidPEMFile: {
          error: {
            description: "{{ description }}",
            message: "Kod Çözme Hatası"
          },
          genericError: {
            description: "Sertifikanın kodu çözülürken bir hata oluştu.",
            message: "Kod Çözme Hatası"
          },
          success: {
            description: "Sertifika dosyasının kodu başarıyla çözüldü.",
            message: "Kod Çözme Başarılı"
          }
        }
      },
      placeholders: {
        "404": {
          action: "Anasayfaya geri dön",
          subtitles: {
            "0": "Aradığınız sayfayı bulamadık.",
            "1": "Lütfen URL'yi kontrol edin veya ana sayfaya geri yönlendirilmek için aşağıdaki düğmeyi tıklayın."
          },
          title: "sayfa bulunamadı"
        },
        accessDenied: {
          action: "oturumu kapatmaya devam et",
          subtitles: {
            "0": "Bu portalı kullanma izniniz yok gibi görünüyor.",
            "1": "Lütfen farklı bir hesapla oturum açın."
          },
          title: "Yetkili değilsin"
        },
        brokenPage: {
          action: "Sayfayı yenile",
          subtitles: {
            "0": "Bu sayfa görüntülenirken bir şeyler ters gitti.",
            "1": "Teknik ayrıntılar için tarayıcı konsoluna bakın."
          },
          title: "Bir şeyler yanlış gitti"
        },
        consentDenied: {
          action: "oturumu kapatmaya devam et",
          subtitles: {
            "0": "Bu uygulamaya onay vermemişsiniz gibi görünüyor.",
            "1": "Lütfen uygulamayı kullanmak için izin verin."
          },
          title: "izni reddettiniz"
        },
        genericError: {
          action: "Sayfayı yenile",
          subtitles: {
            "0": "Bu sayfa görüntülenirken bir şeyler ters gitti.",
            "1": "Teknik ayrıntılar için tarayıcı konsoluna bakın."
          },
          title: "Bir şeyler yanlış gitti"
        },
        loginError: {
          action: "oturumu kapatmaya devam et",
          subtitles: {
            "0": "Bu portalı kullanma izniniz yok gibi görünüyor.",
            "1": "Lütfen farklı bir hesapla oturum açın."
          },
          title: "Yetkili değilsin"
        },
        sessionStorageDisabled: {
          subtitles: {
            "0": "Bu uygulamayı kullanmak için, web tarayıcınızın ayarlarında çerezleri etkinleştirmelisiniz.",
            "1": "Çerezlerin nasıl etkinleştirileceği hakkında daha fazla bilgi için web tarayıcınızın yardım bölümüne bakın."
          },
          title: "Çerezler tarayıcınızda devre dışı bırakıldı."
        },
        unauthorized: {
          action: "oturumu kapatmaya devam et",
          subtitles: {
            "0": "Bu portalı kullanma izniniz yok gibi görünüyor.",
            "1": "Lütfen farklı bir hesapla oturum açın."
          },
          title: "Yetkili değilsin"
        }
      },
      privacy: {
        about: {
          description: "Elveriş Kimlik Sunucusu (bu politikada \"Elveriş IS\" olarak anılacaktır), açık standartlara ve spesifikasyonlara dayalı açık kaynaklı bir Kimlik Yönetimi ve Yetkilendirme Sunucusudur.",
          heading: "Elveriş Kimlik Sunucusu Hakkında"
        },
        privacyPolicy: {
          collectionOfPersonalInfo: {
            description: {
              list1: {
                "0": "Elveriş IS, hesabınıza yapılan herhangi bir şüpheli oturum açma girişimini tespit etmek için IP adresinizi kullanır.",
                "1": "Elveriş IS, zengin ve kişiselleştirilmiş bir kullanıcı deneyimi sağlamak için adınız, soyadınız vb. gibi öznitelikleri kullanır.",
                "2": "Elveriş IS, güvenlik sorularınızı ve yanıtlarınızı yalnızca hesap kurtarmaya izin vermek için kullanır."
              },
              para1: "Elveriş IS, bilgilerinizi yalnızca erişim gereksinimlerinizi karşılamak için toplar. "
            },
            heading: "Kişisel bilgilerin toplanması",
            trackingTechnologies: {
              description: {
                list1: {
                  "0": "Kişisel verilerinizi girdiğiniz kullanıcı profili sayfasından bilgi toplama.",
                  "1": "IP adresinizi HTTP isteği, HTTP başlıkları ve TCP/IP ile izleme.",
                  "2": "IP adresi ile coğrafi bilgilerinizin takibi.",
                  "3": "Giriş geçmişinizi tarayıcı tanımlama bilgileriyle izleme.  {{cookiePolicyLink}} daha fazla bilgi için."
                },
                para1: "Elveriş IS, bilgilerinizi şu şekilde toplar:"
              },
              heading: "Takip Teknolojileri"
            }
          },
          description: {
            para1: "Bu politika, Elveriş IS'nin kişisel bilgilerinizi nasıl topladığını, toplama amaçlarını ve kişisel bilgilerinizin saklanmasına ilişkin bilgileri açıklamaktadır.",
            para2: "Lütfen bu politikanın yalnızca referans amaçlı olduğunu ve bir ürün olarak yazılım için geçerli olduğunu unutmayın.  <1>feragatname</1> Daha fazla bilgi için bölüm.",
            para3: "Elveriş IS'nin kullanımını ve yönetimini kontrol eden kuruluşlar, kuruluşlar veya bireyler, verilerin ilgili varlık, kuruluş veya kişi tarafından kontrol edilme veya işlenme şeklini belirleyen kendi gizlilik politikalarını oluşturmalıdır."
          },
          disclaimer: {
            description: {
              list1: {
                "0": "Elveriş, çalışanları, ortakları ve bağlı kuruluşları, Elveriş IS'de yer alan kişisel veriler de dahil olmak üzere hiçbir veriye erişim sahibi değildir ve bunları gerektirmez, saklamaz, işlemez veya kontrol etmez. ",
                "1": "Bu gizlilik politikası, Elveriş IS çalıştıran kurum veya kişilerin bilgilendirme amaçlıdır ve kişisel verilerin korunmasına ilişkin olarak Elveriş IS kapsamında yer alan süreçleri ve işlevleri belirler. "
              }
            },
            heading: "Feragatname"
          },
          disclosureOfPersonalInfo: {
            description: "Elveriş IS, kişisel bilgileri yalnızca Elveriş IS'ye kayıtlı ilgili uygulamalara (Hizmet Sağlayıcı olarak da bilinir) ifşa eder. ",
            heading: "kişisel bilgilerin ifşası",
            legalProcess: {
              description: "Lütfen, Elveriş IS'yi çalıştıran kuruluş, kuruluş veya bireyin, gerekli ve yasal süreci takiben kanunen gerekli olduğu durumlarda, kişisel bilgilerinizi izniniz olsun veya olmasın ifşa etmek zorunda kalabileceğini unutmayın.",
              heading: "Yasal süreç"
            }
          },
          heading: "Gizlilik Politikası",
          moreInfo: {
            changesToPolicy: {
              description: {
                para1: "Elveriş IS'nin yükseltilmiş sürümleri, bu politikada değişiklikler içerebilir ve bu politikada yapılan revizyonlar, bu tür yükseltmeler içinde paketlenecektir. ",
                para2: "Elveriş IS'yi çalıştıran kuruluş, Gizlilik Politikasını zaman zaman revize edebilir. "
              },
              heading: "Bu politikadaki değişiklikler"
            },
            contactUs: {
              description: {
                para1: "Bu gizlilik politikasıyla ilgili herhangi bir sorunuz veya endişeniz varsa lütfen Elveriş ile iletişime geçin."
              },
              heading: "Bize Ulaşın"
            },
            heading: "Daha fazla bilgi",
            yourChoices: {
              description: {
                para1: "Elveriş IS içinde zaten bir kullanıcı hesabınız varsa ve bu gizlilik politikasının sizin için kabul edilemez olduğunu fark ederseniz, hesabınızı devre dışı bırakma hakkınız vardır.",
                para2: "Hesabınız yoksa ve gizlilik politikamızı kabul etmiyorsanız, hesap oluşturmamayı seçebilirsiniz."
              },
              heading: "Senin seçimlerin"
            }
          },
          storageOfPersonalInfo: {
            heading: "Kişisel bilgilerin saklanması",
            howLong: {
              description: {
                list1: {
                  "0": "Mevcut Şifre",
                  "1": "Daha önce kullanılan şifreler"
                },
                para1: "Elveriş IS, sistemimizin aktif bir kullanıcısı olduğunuz sürece kişisel verilerinizi saklar. ",
                para2: "Elveriş IS, size ek bir güvenlik düzeyi sağlamak için hashlenmiş sırlar tutabilir. "
              },
              heading: "Kişisel bilgileriniz ne kadar süreyle saklanır?"
            },
            requestRemoval: {
              description: {
                para1: "Yöneticiden hesabınızı silmesini isteyebilirsiniz. ",
                para2: "Ek olarak, Elveriş IS'nin günlüklerde, veritabanlarında veya analitik depolamada tutmuş olabileceği faaliyetlerinizin tüm izlerini anonimleştirme talebinde bulunabilirsiniz."
              },
              heading: "Kişisel bilgilerinizin kaldırılmasını nasıl talep edebilirsiniz?"
            },
            where: {
              description: {
                para1: "Elveriş IS, kişisel bilgilerinizi güvenli veritabanlarında saklar. ",
                para2: "Elveriş IS, kişisel verilerinizi ek bir güvenlik düzeyiyle saklamak için şifreleme kullanabilir."
              },
              heading: "Kişisel bilgileriniz nerede saklanır?"
            }
          },
          useOfPersonalInfo: {
            description: {
              list1: {
                "0": "Size kişiselleştirilmiş bir kullanıcı deneyimi sağlamak için. ",
                "1": "Hesabınızı yetkisiz erişimden veya olası bilgisayar korsanlığı girişimlerinden korumak için. ",
                "2": "Sistem performansı iyileştirmelerine ilişkin analitik amaçlar için istatistiksel veriler elde edin. "
              },
              para1: "Elveriş IS, kişisel bilgilerinizi yalnızca toplanma amaçları (veya bu amaçla tutarlı olarak tanımlanan bir kullanım için) için kullanacaktır.",
              para2: "Elveriş IS, kişisel bilgilerinizi yalnızca aşağıdaki amaçlar için kullanır.",
              subList1: {
                heading: "Bu içerir:",
                list: {
                  "0": "IP adresi",
                  "1": "tarayıcı parmak izi",
                  "2": "Kurabiye"
                }
              },
              subList2: {
                heading: "Elveriş IS şunları kullanabilir:",
                list: {
                  "0": "Coğrafi bilgi elde etmek için IP Adresi",
                  "1": "Tarayıcı teknolojisini ve/veya sürümünü belirlemek için tarayıcı parmak izi"
                }
              }
            },
            heading: "kişisel bilgilerin kullanımı"
          },
          whatIsPersonalInfo: {
            description: {
              list1: {
                "0": "Kullanıcı adınız (işvereniniz tarafından oluşturulan kullanıcı adının sözleşme kapsamında olduğu durumlar hariç)",
                "1": "Doğum tarihiniz/yaşınız",
                "2": "Oturum açmak için kullanılan IP adresi",
                "3": "Giriş yapmak için bir cihaz (örn. telefon veya tablet) kullanıyorsanız cihaz kimliğiniz"
              },
              list2: {
                "0": "TCP/IP bağlantısını oluşturduğunuz Şehir/Ülke",
                "1": "Giriş yaptığınız günün saati (yıl, ay, hafta, saat veya dakika)",
                "2": "Giriş yapmak için kullandığınız cihazın türü (Örn. telefon veya tablet)",
                "3": "İşletim sistemi ve genel tarayıcı bilgileri"
              },
              para1: "Elveriş IS, sizinle ilgili olan ve tanımlanabileceğiniz her şeyi kişisel bilgileriniz olarak kabul eder. ",
              para2: "Bununla birlikte, Elveriş IS, kişisel bilgi olarak kabul edilmeyen, yalnızca aşağıdaki bilgileri de toplar: <1>istatistiksel</1> amaçlar. "
            },
            heading: "Kişisel bilgi nedir?"
          }
        }
      },
      sidePanel: {
        privacy: "Mahremiyet"
      },
      validations: {
        inSecureURL: {
          description: "Girilen URL, TLS olmayan bir URL'dir. ",
          heading: "güvenli olmayan URL"
        },
        unrecognizedURL: {
          description: "Girilen URL ne HTTP ne de HTTPS'dir. ",
          heading: "tanınmayan URL"
        }
      }
    },
    develop: {
      componentExtensions: {
        component: {
          application: {
            quickStart: {
              title: "Hızlı başlangıç"
            }
          }
        }
      },
      features: {
        URLInput: {
          withLabel: {
            negative: {
              content: "İstekte bulunmak için bu URL'nin kaynağına yönelik CORS'u etkinleştirmeniz gerekir. {{productName}} bir tarayıcıdan.",
              detailedContent: {
                "0": "",
                "1": ""
              },
              header: "CORS için İzin Verilmez",
              leftAction: "İzin vermek"
            },
            positive: {
              content: "Bu URL'nin kaynağının şu adrese istekte bulunmasına izin verilir: {{productName}} Bir tarayıcıdan API'ler.",
              detailedContent: {
                "0": "",
                "1": ""
              },
              header: "CORS'a İzin Verilir"
            }
          }
        },
        applications: {
          addWizard: {
            steps: {
              generalSettings: {
                heading: "Genel Ayarlar"
              },
              protocolConfig: {
                heading: "Protokol Yapılandırması"
              },
              protocolSelection: {
                heading: "Protokol Seçimi"
              },
              summary: {
                heading: "Özet",
                sections: {
                  accessURL: {
                    heading: "Erişim URL'si"
                  },
                  applicationQualifier: {
                    heading: "Başvuru niteleyici"
                  },
                  assertionURLs: {
                    heading: "Onaylama tüketici URL'leri"
                  },
                  audience: {
                    heading: "Kitle"
                  },
                  callbackURLs: {
                    heading: "Yetkili yönlendirme URI'leri"
                  },
                  certificateAlias: {
                    heading: "Sertifika takma adı"
                  },
                  discoverable: {
                    heading: "keşfedilebilir"
                  },
                  grantType: {
                    heading: "Hibe Türleri"
                  },
                  issuer: {
                    heading: "Yayıncı"
                  },
                  metaFile: {
                    heading: "Meta Dosyası(Base64Encoded)"
                  },
                  metadataURL: {
                    heading: "Meta veri URL'si"
                  },
                  public: {
                    heading: "Halk"
                  },
                  realm: {
                    heading: "Diyar"
                  },
                  renewRefreshToken: {
                    heading: "RefreshToken'ı yenile"
                  },
                  replyTo: {
                    heading: "Yanıtla"
                  }
                }
              }
            }
          },
          advancedSearch: {
            form: {
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "Uygulamaları ada, müşteri kimliğine veya verene göre arayın"
          },
          confirmations: {
            addSocialLogin: {
              content: "Yeni bir sosyal giriş eklemek için sizi farklı bir sayfaya yönlendirmemiz gerekecek ve bu sayfadaki kaydedilmemiş tüm değişiklikler kaybolacak. ",
              header: "Devam etmek istiyor musun?",
              subHeader: "Kaydedilmemiş tüm değişiklikleri kaybedersiniz."
            },
            certificateDelete: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Yok",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve sertifikayı kalıcı olarak siler.",
              primaryAction: "Silmek",
              secondaryAction: "İptal etmek"
            },
            changeProtocol: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Bu işlem geri alınamaz ve mevcut protokol yapılandırmalarını kalıcı olarak kaldıracaktır.",
              header: "Emin misin?",
              message: "Farklı bir protokole geçerseniz, {{ name }} yapılandırmalar kaldırılacaktır. "
            },
            clientSecretHashDisclaimer: {
              forms: {
                clientIdSecretForm: {
                  clientId: {
                    hide: "kimliği gizle",
                    label: "Müşteri Kimliği",
                    placeholder: "Müşteri Kimliği",
                    show: "Kimliği göster",
                    validations: {
                      empty: "Bu gerekli bir alandır."
                    }
                  },
                  clientSecret: {
                    hide: "Sırrı sakla",
                    label: "müşteri sırrı",
                    placeholder: "müşteri sırrı",
                    show: "Sırrı göster",
                    validations: {
                      empty: "Bu gerekli bir alandır."
                    }
                  }
                }
              },
              modal: {
                assertionHint: "",
                content: "",
                header: "OAuth Uygulama Kimlik Bilgileri",
                message: "Tüketici sırrı değeri düz metin olarak yalnızca bir kez görüntülenecektir. "
              }
            },
            deleteApplication: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu işlem geri alınamaz ve uygulamayı kalıcı olarak siler.",
              header: "Emin misin?",
              message: "Bu uygulamayı silerseniz, bu uygulama için kimlik doğrulama akışları çalışmayı durduracaktır. "
            },
            deleteOutboundProvisioningIDP: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Bu giden sağlama IDP'sini silerseniz geri alamazsınız. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve IDP'yi kaldırır."
            },
            deleteProtocol: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Bu protokolü silerseniz, geri alamazsınız. ",
              header: "Emin misin?",
              message: "Bu eylem geri alınamaz ve protokolü kalıcı olarak siler."
            },
            handlerAuthenticatorAddition: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Eklemeye çalıştığınız kimlik doğrulayıcı bir işleyicidir. ",
              header: "Bir İşleyici ekliyorsunuz",
              message: "Bu bir işleyici."
            },
            backupCodeAuthenticatorDelete: {
              assertionHint: "Yedek kod işlevini kaldırmak için Devam'a tıklayın.",
              content: "Devam ederseniz, yedek kod işlevi mevcut kimlik doğrulama adımınızdan da kaldırılacaktır. ",
              header: "Silmeyi onayla",
              message: "Bu eylem, geçerli kimlik doğrulama adımından yedek kod işlevselliğini kaldıracaktır."
            },
            lowOIDCExpiryTimes: {
              assertionHint: "Değerlerinizle devam etmek için Onayla'yı tıklayın.",
              content: "Bu, belirteçlerinizin çok erken sona erebileceği anlamına gelir. ",
              header: "Emin misin?",
              message: "Belirteç süre sonu için 60 saniyeden az bir değer girdiniz."
            },
            reactivateOIDC: {
              assertionHint: "Lütfen yazın <1>{{ id }}</1> uygulamayı yeniden etkinleştirmek için.",
              content: "Uygulamayı yeniden etkinleştirirseniz, yeni bir istemci sırrı oluşturulur. ",
              header: "Emin misin?",
              message: ""
            },
            reactivateSPA: {
              assertionHint: "Lütfen yazın <1>{{ id }}</1> uygulamayı yeniden etkinleştirmek için.",
              content: "Uygulamayı yeniden etkinleştirirseniz, bu uygulama için kimlik doğrulama akışları çalışmaya başlayacaktır. ",
              header: "Emin misin?",
              message: "Bu eylem, müşteri kimliği daha sonra iptal edilerek tersine çevrilebilir."
            },
            regenerateSecret: {
              assertionHint: "Lütfen yazın <1>{{ id }}</1> istemci sırrını yeniden oluşturmak için.",
              content: "İstemci sırrını yeniden oluşturursanız, bu uygulama için eski istemci sırrını kullanan kimlik doğrulama akışları çalışmayı durduracaktır. ",
              header: "Emin misin?",
              message: "Bu eylem geri alınamaz ve istemci sırrını kalıcı olarak değiştirir. "
            },
            removeApplicationUserAttribute: {
              content: "Bu eylemi onaylarsanız, konu özelliği varsayılan özniteliğe ayarlanacaktır: <1>{{ default }}</1>",
              header: "Emin misin?",
              subHeader: "Kaldırmaya çalıştığınız özellik şu anda konu özelliği olarak seçili."
            },
            removeApplicationUserAttributeMapping: {
              content: "Bu eylemi onaylarsanız, yeni bir konu özelliği seçmeniz gerekir.",
              header: "Emin misin?",
              subHeader: "Kaldırmaya çalıştığınız özellik şu anda konu özelliği olarak seçili."
            },
            revokeApplication: {
              assertionHint: "Lütfen yazın <1>{{ id }}</1> onaylamak.",
              content: "Bu eylem, uygulamayı daha sonra etkinleştirerek tersine çevrilebilir.",
              header: "Emin misin?",
              message: "Bu uygulamayı iptal ederseniz, bu uygulama için kimlik doğrulama akışları çalışmayı durduracaktır. "
            }
          },
          dangerZoneGroup: {
            deleteApplication: {
              actionTitle: "Silmek",
              header: "Uygulamayı sil",
              subheader: "Uygulama silindikten sonra kurtarılamaz ve bu uygulamayı kullanan istemciler artık çalışmaz."
            },
            header: "Tehlikeli bölge"
          },
          edit: {
            sections: {
              access: {
                addProtocolWizard: {
                  heading: "Protokol Ekle",
                  steps: {
                    protocolSelection: {
                      manualSetup: {
                        emptyPlaceholder: {
                          subtitles: "Tüm protokoller yapılandırıldı",
                          title: "Kullanılabilir şablon yok"
                        },
                        heading: "Elle kurulum",
                        subHeading: "Özel yapılandırmalarla bir protokol ekleyin"
                      },
                      quickSetup: {
                        emptyPlaceholder: {
                          subtitles: "Tüm protokoller yapılandırıldı",
                          title: "Kullanılabilir şablon yok"
                        },
                        heading: "Hızlı ayar",
                        subHeading: "Bir şablondan protokol yapılandırmasını alın"
                      }
                    }
                  },
                  subHeading: "Yeni protokol ekle {{appName}} başvuru"
                },
                protocolLanding: {
                  heading: "Hangi protokolü kullanıyorsunuz?",
                  subHeading: "Uygulamanızın bağlanacağı protokolü seçin."
                },
                tabName: "Protokol"
              },
              advanced: {
                tabName: "Gelişmiş"
              },
              attributes: {
                attributeMappingChange: {
                  error: {
                    description: "Eşlenen kullanıcı öznitelikleri, varsayılan değerlerle değiştirildi.",
                    message: "Kullanıcı Niteliği Eşlemesi Değiştirildi"
                  }
                },
                emptySearchResults: {
                  subtitles: {
                    "0": "' araması için sonuç bulunamadı.{{ searchQuery }}'",
                    "1": "Lütfen farklı bir arama terimi deneyin."
                  },
                  title: "Sonuç bulunamadı"
                },
                forms: {
                  fields: {
                    dynamic: {
                      applicationRole: {
                        label: "Uygulama Rolü",
                        validations: {
                          duplicate: "Bu rol zaten eşlendi. ",
                          empty: "Lütfen eşlenecek bir özellik girin"
                        }
                      },
                      localRole: {
                        label: "Yerel Rol",
                        validations: {
                          empty: "Lütfen yerel rolü girin"
                        }
                      }
                    }
                  }
                },
                roleMapping: {
                  heading: "Rol Eşleme"
                },
                selection: {
                  addWizard: {
                    header: "Kullanıcı Özelliklerini Seçin",
                    steps: {
                      select: {
                        transfer: {
                          headers: {
                            attribute: "Tüm Kullanıcı Özelliklerini Seçin"
                          },
                          searchPlaceholders: {
                            attribute: "Kullanıcı özelliği ara",
                            role: "Arama Rolü"
                          }
                        }
                      }
                    },
                    subHeading: "Uygulamayla hangi kullanıcı özniteliklerini paylaşmak istediğinizi seçin."
                  },
                  attributeComponentHint: "Kullanmak <1>OpenID Bağlantı Kapsamları</1> bir kapsamdaki kullanıcı özniteliğini yönetmek için.  <3>Öznitellikler.</3>",
                  attributeComponentHintAlt: "Bu uygulamayla paylaşmak istediğiniz kullanıcı özniteliklerini yönetin.  <1>Öznitellikler.</1>",
                  description: "Kapsamları seçin, yani bu uygulamayla paylaşılmasına izin verilen gruplandırılmış kullanıcı öznitelikleri.",
                  heading: "Kullanıcı Özelliği Seçimi",
                  scopelessAttributes: {
                    description: "Kapsam olmadan öznitelikleri görüntüleyin",
                    displayName: "Kapsamı olmayan öznitelikler",
                    name: "",
                    hint: "OIDC kapsamları istenerek bu kullanıcı öznitelikleri alınamıyor. "
                  },
                  selectedScopesComponentHint: "Seçilen kullanıcı özniteliklerini almak için uygulamanızdan bu kapsamları isteyin.",
                  howToUseScopesHint: "Kapsamlar nasıl kullanılır?",
                  mandatoryAttributeHint: "Hangi kullanıcı özniteliklerinin uygulama ile paylaşılmasının zorunlu olduğunu işaretleyin.  {{productName}} kullanıcı profilinde önceden sağlanmamışsa, kullanıcıdan bu öznitelik değerlerini girmesini ister.",
                  mappingTable: {
                    actions: {
                      enable: "Öznitelik adı eşlemeyi etkinleştir"
                    },
                    columns: {
                      appAttribute: "Eşlenen kullanıcı özelliği",
                      attribute: "Kullanıcı Özniteliği",
                      mandatory: "Zorunlu",
                      requested: "Talep edilen"
                    },
                    listItem: {
                      actions: {
                        makeMandatory: "zorunlu yap",
                        makeRequested: "İstek yap",
                        makeScopeRequested: "Kapsam istendi",
                        removeMandatory: "Zorunlu kaldır",
                        removeRequested: "İstenen kaldırma",
                        removeScopeRequested: "İstenen Kapsamı Kaldır",
                        subjectDisabledSelection: "Bu öznitelik, özne özniteliği olduğu için zorunludur."
                      },
                      faultyAttributeMapping: "Eksik OpenID Connect Öznitelik Eşlemesi",
                      faultyAttributeMappingHint: "Öznitelik değeri, kullanıcı oturum açma sırasında uygulamaya paylaşılmayacaktır.",
                      fields: {
                        claim: {
                          label: "Lütfen bir değer girin",
                          placeholder: "örneğin: özel {{name}}, yeni {{name}}"
                        }
                      }
                    },
                    mappedAtributeHint: "Uygulamaya gönderilen onaylamada kullanılacak özel öznitelik adını girin.",
                    mappingRevert: {
                      confirmPrimaryAction: "Onaylamak",
                      confirmSecondaryAction: "İptal etmek",
                      confirmationContent: "Eşlenen özel öznitelikler, varsayılan öznitelik değerlerine geri döner. ",
                      confirmationHeading: "Emin misin?",
                      confirmationMessage: "Bu eylem, eşlenen özel özellik değerlerini varsayılan değerlere döndürür."
                    },
                    searchPlaceholder: "Kullanıcı özelliklerini ada, görünen ada veya kapsam ayrıntılarına göre arayın"
                  },
                  selectAll: "Tüm özellikleri seçin"
                },
                tabName: "Kullanıcı Özellikleri"
              },
              general: {
                tabName: "Genel"
              },
              info: {
                oidcHeading: "Sunucu Uç Noktaları",
                oidcSubHeading: "Aşağıdaki sunucu uç noktaları, OpenID Connect kullanarak uygulamanız için kimlik doğrulaması uygulamanız ve yapılandırmanız için yararlı olacaktır.",
                samlHeading: "Kimlik Sağlayıcı Ayrıntıları",
                samlSubHeading: "Aşağıdaki IdP ayrıntıları, SAML 2.0 kullanarak uygulamanız için kimlik doğrulaması uygulamanız ve yapılandırmanız için yararlı olacaktır.",
                tabName: "Bilgi"
              },
              provisioning: {
                inbound: {
                  heading: "Gelen Provizyon",
                  subHeading: "Bu uygulama aracılığıyla bir Elveriş Kimlik Sunucusunun kullanıcı deposunda kullanıcıları veya grupları sağlayın."
                },
                outbound: {
                  actions: {
                    addIdp: "Yeni Hazırlayıcı"
                  },
                  addIdpWizard: {
                    errors: {
                      noProvisioningConnector: "Seçili hazırlayıcının herhangi bir sağlama bağlayıcısı yok."
                    },
                    heading: "Giden Hazırlayıcı Ekle",
                    steps: {
                      details: "Hazırlayıcı Ayrıntıları"
                    },
                    subHeading: "Uygulamanıza kendi kendine kaydolan kullanıcıları yetkilendirmek için hazırlayıcıyı seçin."
                  },
                  heading: "Giden Provizyon",
                  subHeading: "Bu uygulamanın kullanıcılarına giden yetkilendirmeyi yapmak için bir hazırlayıcı yapılandırın."
                },
                tabName: "sağlama"
              },
              sharedAccess: {
                subTitle: "Uygulamayı alt kuruluşlarla paylaşmak için aşağıdaki seçenekleri belirleyin.",
                tabName: "Paylaşılan Erişim"
              },
              shareApplication: {
                addSharingNotification: {
                  genericError: {
                    description: "Uygulama paylaşımı başarısız oldu. ",
                    message: "Uygulama paylaşımı başarısız oldu!"
                  },
                  success: {
                    description: "Uygulama, kuruluş(lar) ile başarıyla paylaşıldı",
                    message: "Uygulama paylaştı!"
                  }
                },
                getSharedOrganizations: {
                  genericError: {
                    description: "Paylaşılan kuruluş listesi alınamadı!",
                    message: "Paylaşılan Organizasyon listesi alınamadı!"
                  }
                },
                heading: "Uygulamayı Paylaş",
                shareApplication: "Uygulamayı Paylaş",
                stopSharingNotification: {
                  genericError: {
                    description: "Şunun için uygulama paylaşımı durdurulamadı: {{organization}}",
                    message: "Uygulama paylaşımı durdurulamadı!"
                  },
                  success: {
                    description: "Uygulama Paylaşımı durduruldu {{organization}} başarıyla",
                    message: "Paylaşılan uygulama başarıyla durduruldu!"
                  }
                }
              },
              signOnMethod: {
                sections: {
                  authenticationFlow: {
                    heading: "Kimlik doğrulama akışı",
                    sections: {
                      scriptBased: {
                        accordion: {
                          title: {
                            description: "Giriş akışınıza koşullar ekleyin.",
                            heading: "Koşullu Kimlik Doğrulama"
                          }
                        },
                        conditionalAuthTour: {
                          steps: {
                            "0": {
                              content: {
                                "0": "Bağlama göre oturum açma akışını dinamik olarak değiştirmek için bir komut dosyası tanımlayın",
                                "1": "Tıkla <1>Sonraki</1> İşlem hakkında bilgi almak için düğmesine basın."
                              },
                              heading: "Koşullu Kimlik Doğrulama"
                            },
                            "1": {
                              content: {
                                "0": "Adıma gerekli kimlik doğrulama seçeneklerini eklemek için bu düğmeye tıklayın."
                              },
                              heading: "Kimlik Doğrulaması Ekle"
                            },
                            "2": {
                              content: {
                                "0": "Akışa daha fazla adım eklemeniz gerekiyorsa burayı tıklayın.  <1>yürütmeAdım(STEP_NUMBER);</1> komut dosyası düzenleyicide görünecektir."
                              },
                              heading: "Yeni Adım Ekle"
                            }
                          }
                        },
                        editor: {
                          apiDocumentation: "API",
                          changeConfirmation: {
                            content: "Seçilen şablon, düzenleyicideki mevcut komut dosyasının yanı sıra yapılandırdığınız oturum açma adımlarının yerini alacaktır.  <1>Onaylamak</1> Devam etmek için.",
                            heading: "Emin misin?",
                            message: "Bu işlem geri alınamaz."
                          },
                          goToApiDocumentation: "API Dokümantasyonuna Git",
                          resetConfirmation: {
                            content: "Bu eylem, editördeki mevcut komut dosyasını varsayılana sıfırlayacaktır.  <1>Onaylamak</1> Devam etmek için.",
                            heading: "Emin misin?",
                            message: "Bu işlem geri alınamaz."
                          },
                          templates: {
                            darkMode: "Karanlık Mod",
                            heading: "Şablonlar"
                          }
                        },
                        heading: "Komut dosyası tabanlı yapılandırma",
                        hint: "Uyarlanabilir bir komut dosyası aracılığıyla kimlik doğrulama akışını tanımlayın. ",
                        secretsList: {
                          create: "Yeni sır oluştur",
                          emptyPlaceholder: "Kullanılabilir sır yok",
                          search: "Gizli isme göre ara",
                          tooltips: {
                            keyIcon: "Erişim anahtarlarını sır olarak güvenli bir şekilde saklayın.  <1>callChoreo()</1> koşullu kimlik doğrulama betiklerinde işlev.",
                            plusIcon: "Komut dosyasına ekle"
                          }
                        }
                      },
                      stepBased: {
                        actions: {
                          addAuthentication: "Kimlik Doğrulaması Ekle",
                          addNewStep: "Yeni adım ekle",
                          addStep: "Yeni Kimlik Doğrulama Adımı",
                          selectAuthenticator: "Bir Doğrulayıcı seçin"
                        },
                        addAuthenticatorModal: {
                          content: {
                            addNewAuthenticatorCard: {
                              title: "Yeni Kimlik Sağlayıcıyı Yapılandır"
                            },
                            authenticatorGroups: {
                              basic: {
                                description: "Tarafından desteklenen temel kimlik doğrulayıcı seti {{productName}}.",
                                heading: "Temel"
                              },
                              enterprise: {
                                description: "Standart protokoller aracılığıyla kurumsal oturum açma.",
                                heading: "kurumsal giriş"
                              },
                              mfa: {
                                description: "Oturum açma akışınıza ek güvenlik katmanı ekleyin.",
                                heading: "çok faktörlü"
                              },
                              social: {
                                description: "Mevcut sosyal oturum açma hesabını kullanın.",
                                heading: "Sosyal giriş"
                              },
                              backupCodes: {
                                description: "İki faktörlü kimlik doğrulama kurtarma seçeneği.",
                                heading: "MFA Kurtarma"
                              }
                            },
                            goBackButton: "seçime geri dön",
                            search: {
                              placeholder: "Kimlik Doğrulayıcıları Ara"
                            },
                            stepSelectDropdown: {
                              hint: "Doğrulayıcı eklemek istediğiniz adımı seçin.",
                              label: "adım seç",
                              placeholder: "adım seç"
                            }
                          },
                          description: null,
                          heading: "Kimlik Doğrulaması Ekle",
                          primaryButton: null,
                          secondaryButton: null
                        },
                        authenticatorDisabled: "İstemci kimliği sağlayarak bu kimlik doğrulayıcıyı yapılandırmanız gerekir.",
                        firstFactorDisabled: "Tanımlayıcı İlk doğrulayıcı ve Kullanıcı Adı",
                        forms: {
                          fields: {
                            attributesFrom: {
                              label: "Bu adımdaki özellikleri seçin",
                              placeholder: "adım seç"
                            },
                            subjectIdentifierFrom: {
                              label: "Bu adımdan kullanıcı tanımlayıcısını seçin",
                              placeholder: "adım seç"
                            },
                            enableBackupCodes: {
                              label: "Yedek kodları etkinleştir"
                            }
                          }
                        },
                        heading: "Adım tabanlı yapılandırma",
                        hint: "Doğrulayıcıları ilgili adımlara sürükleyerek bir kullanıcı oturum açma akışı oluşturun.",
                        secondFactorDisabled: "İkinci faktör doğrulayıcılar yalnızca şu durumlarda kullanılabilir: <1>Kullanıcı adı ve şifre şifre</1>, <3>Sosyal Giriş</3> veya bu faktörleri işleyebilen başka herhangi bir işleyici, bir önceki adımda mevcuttur.",
                        secondFactorDisabledDueToProxyMode: "Yapılandırmak için <1>{{auth}}</1>, aşağıdaki Kimlik Sağlayıcılardan Tam Zamanında sağlama ayarını etkinleştirmelisiniz.",
                        secondFactorDisabledInFirstStep: "İkinci faktör doğrulayıcılar ilk adımda kullanılamaz.",
                        backupCodesDisabled: "Yedek kod doğrulayıcı, yalnızca geçerli adımda çok faktörlü kimlik doğrulayıcılar varsa kullanılabilir.",
                        backupCodesDisabledInFirstStep: "Yedek kod doğrulayıcı ilk adımda kullanılamaz.",
                        federatedSMSOTPConflictNote: {
                          multipleIdps: "Asgardeo, kullanıcının aşağıdakileri içeren profilini gerektirir: <1>cep numarası</1> Yapılandırmak için <3>SMS OTP'si</3> aşağıdaki bağlantılarla.",
                          singleIdp: "Asgardeo, kullanıcının aşağıdakileri içeren profilini gerektirir: <1>cep numarası</1> Yapılandırmak için <3>SMS OTP'si</3> ile <5>{{idpName}}</5> bağlantı."
                        }
                      }
                    }
                  },
                  customization: {
                    heading: "Oturum Açma Yöntemini Özelleştirin",
                    revertToDefaultButton: {
                      hint: "Varsayılan yapılandırmaya geri dönün (Kullanıcı adı",
                      label: "Varsayılana dön"
                    }
                  },
                  landing: {
                    defaultConfig: {
                      description: {
                        "0": "Bu uygulama ile yapılandırılmıştır <1>Kullanıcı adı</1> Giriş yapmak",
                        "1": "Özelleştirmeye başlamak için sağ taraftaki seçeneklerden birini seçin."
                      },
                      heading: "Bu uygulama Kullanıcı Adı ile yapılandırılmıştır"
                    },
                    flowBuilder: {
                      addMissingSocialAuthenticatorModal: {
                        content: {
                          body: "Şununla yapılandırılmış etkin bir Sosyal Bağlantınız yok: <1>{{authenticator}} Doğrulayıcı</1>.  <3>Yapılandır</3> yeni kayıt için düğme <5>{{authenticator}} Sosyal Bağlantı</5> veya şuraya gidin: <7>Bağlantılar</7> bölüm manuel olarak.",
                          message: "aktif değil {{authenticator}} Sosyal Bağlantı yapılandırıldı"
                        },
                        description: "",
                        heading: "Yapılandır {{authenticator}} Sosyal Bağlantı",
                        primaryButton: "Yapılandır",
                        secondaryButton: "İptal etmek"
                      },
                      duplicateSocialAuthenticatorSelectionModal: {
                        content: {
                          body: "Şununla yapılandırılmış birden çok Sosyal Bağlantınız var: <1>{{authenticator}} Doğrulayıcı</1>. ",
                          message: "ile Çoklu Sosyal Bağlantılar bulundu {{authenticator}} Doğrulayıcı."
                        },
                        description: "",
                        heading: "Seçme {{authenticator}} Sosyal Bağlantı",
                        primaryButton: "Devam etmek",
                        secondaryButton: "İptal etmek"
                      },
                      heading: "Kendi giriş akışınızı oluşturun",
                      headings: {
                        "default": "Varsayılan Giriş",
                        multiFactorLogin: "Çok Faktörlü Giriş",
                        passwordlessLogin: "Şifresiz Giriş",
                        socialLogin: "Sosyal Giriş"
                      },
                      types: {
                        apple: {
                          description: "Kullanıcıların Apple Kimliği ile oturum açmasını sağlayın.",
                          heading: "Apple girişi ekle"
                        },
                        defaultConfig: {
                          description: "Kullanıcı Adından başlayarak oturum açma akışınızı oluşturun",
                          heading: "Varsayılan yapılandırmayla başla"
                        },
                        facebook: {
                          description: "Kullanıcıların Facebook ile oturum açmasını sağlayın.",
                          heading: "Facebook girişi ekle"
                        },
                        github: {
                          description: "Kullanıcıların GitHub ile oturum açmasını sağlayın.",
                          heading: "GitHub girişi ekle"
                        },
                        google: {
                          description: "Kullanıcıların Google ile oturum açmasını sağlayın.",
                          heading: "Google girişi ekle"
                        },
                        magicLink: {
                          description: "Kullanıcıların, e-postalarına gönderilen sihirli bir bağlantıyı kullanarak oturum açmalarını sağlayın.",
                          heading: "Magic Link girişi ekle"
                        },
                        microsoft: {
                          description: "Kullanıcıların Microsoft ile oturum açmasını sağlayın.",
                          heading: "Microsoft oturumu ekle"
                        },
                        totp: {
                          description: "Zamana dayalı OTP ile ek kimlik doğrulama katmanını etkinleştirin.",
                          heading: "TOTP'yi ikinci bir faktör olarak ekleyin"
                        },
                        usernameless: {
                          description: "Kullanıcıların geçiş anahtarı, güvenlik anahtarı veya biyometri kullanarak oturum açmasını sağlayın.",
                          heading: "Güvenlik Anahtarı/Biyometri girişi ekleyin",
                          info: "Parolasız oturum açma ile oturum açmak için, kullanıcılarınızın FIDO2 güvenlik anahtarlarının veya biyometrik bilgilerinin Hesabım aracılığıyla kaydedilmesi gerekir."
                        },
                        emailOTP: {
                          description: "E-posta tabanlı OTP ile ek kimlik doğrulama katmanını etkinleştirin.",
                          heading: "E-posta OTP'yi ikinci bir faktör olarak ekleyin"
                        },
                        smsOTP: {
                          description: "SMS tabanlı OTP ile ek kimlik doğrulama katmanını etkinleştirin.",
                          heading: "İkinci bir faktör olarak SMS OTP'yi ekleyin"
                        }
                      }
                    }
                  },
                  requestPathAuthenticators: {
                    notifications: {
                      getRequestPathAuthenticators: {
                        error: {
                          description: "{{ description }}",
                          message: "Alma Hatası"
                        },
                        genericError: {
                          description: "İstek yolu doğrulayıcıları alınırken bir hata oluştu.",
                          message: "Alma Hatası"
                        },
                        success: {
                          description: "",
                          message: ""
                        }
                      }
                    },
                    subTitle: "İstek yolu kimlik doğrulaması için yerel kimlik doğrulayıcılar.",
                    title: "Yol Kimlik Doğrulaması İste"
                  },
                  templateDescription: {
                    description: {
                      code: "kod",
                      defaultSteps: "Varsayılan Adımlar",
                      description: "Tanım",
                      helpReference: "Yardım Referansı",
                      parameters: "parametreler",
                      prerequisites: "Önkoşullar"
                    },
                    popupContent: "Daha fazla detay"
                  }
                },
                tabName: "Oturum Açma Yöntemi"
              }
            }
          },
          forms: {
            advancedAttributeSettings: {
              sections: {
                role: {
                  fields: {
                    role: {
                      hint: "Bu seçenek, kullanıcının bulunduğu kullanıcı deposu etki alanını role ekler",
                      label: "Kullanıcı alanını dahil et",
                      validations: {
                        empty: "rol özniteliğini seçin"
                      }
                    },
                    roleAttribute: {
                      hint: "Özelliği seçin",
                      label: "Rol özelliği",
                      validations: {
                        empty: "rol özniteliğini seçin"
                      }
                    }
                  },
                  heading: "rol"
                },
                subject: {
                  fields: {
                    subjectAttribute: {
                      hint: "Kullanıcının konu tanımlayıcısı olarak kullanmak istediğiniz paylaşılan öznitelikleri seçin",
                      hintOIDC: "Kullanıcının konu tanımlayıcısı olarak kullanmak istediğiniz paylaşılan öznitelikleri seçin.  <1>alt</1> iddiası <1>id_token</1>.",
                      hintSAML: "Kullanıcının konu tanımlayıcısı olarak kullanmak istediğiniz paylaşılan öznitelikleri seçin.  <1>ders</1> SAML iddiasının öğesi.",
                      label: "konu özniteliği",
                      validations: {
                        empty: "Konu özniteliğini seçin"
                      }
                    },
                    subjectIncludeTenantDomain: {
                      hint: "Bu seçenek, kuruluş adını yerel konu tanımlayıcısına ekler",
                      label: "Kuruluş adını dahil et",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    subjectIncludeUserDomain: {
                      hint: "Bu seçenek, kullanıcının bulunduğu kullanıcı deposu etki alanını yerel konu tanımlayıcısına ekler.",
                      label: "Kullanıcı alanını dahil et",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    subjectUseMappedLocalSubject: {
                      hint: "Bu seçenek, kimliği ileri sürerken yerel özne tanımlayıcısını kullanacaktır.",
                      label: "Eşlenen yerel konuyu kullan",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "Ders"
                }
              }
            },
            advancedConfig: {
              fields: {
                enableAuthorization: {
                  hint: "Kimlik doğrulama akışları sırasında yetkilendirme ilkelerinin devreye alınması gerekip gerekmediğine karar verir.",
                  label: "Yetkilendirmeyi etkinleştir",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                },
                returnAuthenticatedIdpList: {
                  hint: " Kimliği doğrulanmış Kimlik Sağlayıcılarının listesi, kimlik doğrulama yanıtında döndürülecektir.",
                  label: "Kimliği doğrulanmış IDP listesini döndür",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                },
                saas: {
                  hint: "Varsayılan olarak, uygulamalar yalnızca uygulamanın kuruluşuna ait kullanıcılar tarafından kullanılabilir. ",
                  label: "SaaS uygulaması",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                },
                skipConsentLogin: {
                  hint: "Etkinleştirildiğinde, oturum açma sırasında bu uygulama için kullanıcı onayı almak için sayfa istemi atlanacaktır.",
                  label: "Oturum açma iznini atla",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                },
                skipConsentLogout: {
                  hint: "Etkinleştirildiğinde, oturum kapatılırken bu uygulama için kullanıcı onayının alınmasına yönelik sayfa istemi atlanacaktır.",
                  label: "Oturum kapatma iznini atla",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                }
              },
              sections: {
                certificate: {
                  fields: {
                    jwksValue: {
                      description: "JWKS ortak anahtarını almak için kullanılan URL.",
                      label: "URL",
                      placeholder: "https://myapp.io/jwks",
                      validations: {
                        empty: "Bu gerekli bir alandır.",
                        invalid: "geçerli bir URL girin"
                      }
                    },
                    pemValue: {
                      actions: {
                        view: "Sertifika bilgilerini görüntüle"
                      },
                      description: "Sertifikanın PEM biçimindeki metin değeri.",
                      hint: "Uygulamanın sertifikası (PEM formatında).",
                      label: "sertifika",
                      placeholder: "PEM formatında sertifika.",
                      validations: {
                        empty: "Bu gerekli bir alandır.",
                        invalid: "PEM biçiminde geçerli bir sertifika girin"
                      }
                    },
                    type: {
                      children: {
                        jwks: {
                          label: "JWKS uç noktasını kullan"
                        },
                        pem: {
                          label: "Sertifika sağlayın"
                        }
                      },
                      label: "Tip"
                    }
                  },
                  heading: "sertifika",
                  hint: {
                    customOidc: "Bu sertifika şifrelemek için kullanılır. <1>id_token</1> kimlik doğrulamasından sonra geri döndü.",
                    customSaml: "Bu sertifika, imzalanan isteklerin imzalarını doğrulamak ve kimlik doğrulamasından sonra döndürülen SAML onaylarını şifrelemek için kullanılır."
                  },
                  invalidOperationModal: {
                    header: "İşlem Geçersiz",
                    message: "Sertifikayı kaldırmak için istek imza doğrulamasını devre dışı bırakmalısınız. "
                  }
                }
              }
            },
            generalDetails: {
              fields: {
                accessUrl: {
                  hint: "Bu uygulama için açılış sayfası URL'si. ",
                  label: "Erişim URL'si",
                  placeholder: "https://myapp.io/home",
                  validations: {
                    empty: "Bu uygulamanın keşfedilebilir olması için geçerli bir erişim URL'si sağlanmalıdır.",
                    invalid: "geçerli bir URL girin"
                  }
                },
                description: {
                  label: "Tanım",
                  placeholder: "Uygulama için bir açıklama girin"
                },
                discoverable: {
                  hint: "Etkinleştirilirse, müşteriler bu uygulamaya şu adresten erişebilir: <1>{{ myAccount }}</1> portal.",
                  label: "Keşfedilebilir uygulama"
                },
                imageUrl: {
                  hint: "Uygulama için bir resim URL'si. ",
                  label: "Logo",
                  placeholder: "https://myapp-resources.io/my_app_image.png",
                  validations: {
                    invalid: "Bu geçerli bir resim URL'si değil"
                  }
                },
                isSharingEnabled: {
                  hint: "Etkinleştirilirse, bu uygulamanın bu kuruluşta veya alt kuruluşlarından herhangi birinde müşterilerin/ortakların kimliğini doğrulamasına izin verir.",
                  label: "Alt kuruluşlarla paylaşıma izin ver"
                },
                isManagementApp: {
                  hint: "Uygulamanın bu kuruluşun yönetim API'sine erişmesine izin vermek için etkinleştirin.",
                  label: "Yönetim Uygulaması"
                },
                name: {
                  label: "İsim",
                  placeholder: "Uygulamam",
                  validations: {
                    duplicate: "Bu ada sahip bir uygulama zaten var. ",
                    empty: "Uygulama adı gerekli.",
                    reserved: "{{appName}} ayrılmış bir uygulama adıdır. "
                  }
                }
              },
              managementAppBanner: "Uygulamanın, bu kuruluşun yönetim API'lerine erişmesine izin verilir."
            },
            inboundCustom: {
              fields: {
                checkbox: {
                  label: "{{label}}",
                  validations: {
                    empty: "Sağlamak {{name}}"
                  }
                },
                dropdown: {
                  label: "{{label}}",
                  placeholder: "Girmek {{name}}",
                  validations: {
                    empty: "Sağlamak {{name}}"
                  }
                },
                generic: {
                  label: "{{label}}",
                  validations: {
                    empty: "seçin {{name}}"
                  }
                },
                password: {
                  label: "{{label}}",
                  placeholder: "Girmek {{name}}",
                  validations: {
                    empty: "Sağlamak {{name}}"
                  }
                }
              }
            },
            inboundOIDC: {
              description: "Aşağıda verilenler {{protocol}} uygulamanız için ayarlar.",
              documentation: "bizim aracılığıyla okuyun <1>belgeler</1> kullanma hakkında daha fazla bilgi edinmek için <3>{{protocol}}</3> uygulamalarınızda oturum açmak için protokol.",
              fields: {
                allowedOrigins: {
                  hint: "İzin verilen kaynaklar, kaynaklar arası isteklerde bulunmasına izin verilecek URL'lerdir. {{productName}} API'ler",
                  label: "İzin verilen kaynaklar",
                  placeholder: "https://myapp.io",
                  validations: {
                    empty: "Lütfen geçerli bir kaynak ekleyin."
                  }
                },
                callBackUrls: {
                  hint: "Yetkili yönlendirme URL'si, kullanıcı kimlik doğrulaması üzerine yetkilendirme kodunun nereye gönderileceğini ve kullanıcının oturumu kapatması üzerine kullanıcının nereye yönlendirileceğini belirler.  {{productName}} buraya girilen yetkili yönlendirme URL'lerine göre doğrulayacaktır.",
                  info: "Bir uygulamanız yok mu?  {{callBackURLFromTemplate}} yetkili yönlendirme URL'si olarak. ",
                  label: "Yetkili yönlendirme URL'leri",
                  placeholder: "https://myapp.io/login",
                  validations: {
                    empty: "Bu gerekli bir alandır.",
                    invalid: "Girilen URL ne HTTP ne de HTTPS'dir. ",
                    required: "Bu alan, işlevsel bir uygulama için gereklidir. "
                  }
                },
                clientID: {
                  label: "Müşteri Kimliği"
                },
                clientSecret: {
                  hashedDisclaimer: "İstemci sırrı hashing işlemine tabi tutulmuştur. ",
                  hideSecret: "Sırrı sakla",
                  label: "müşteri sırrı",
                  message: "{{productName}} yayınlamıyor <1>client_secret</1> istemci kimlik doğrulaması amacıyla yerel uygulamalara veya web tarayıcısı tabanlı uygulamalara.",
                  placeholder: "İstemci Sırrını Girin",
                  showSecret: "Sırrı göster",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                },
                grant: {
                  children: {
                    client_credential: {
                      hint: "Bu izin türü, 'openid' kapsamını desteklemiyor.",
                      label: "(openid kapsamına izin verilmez)"
                    },
                    implicit: {
                      hint: "Bu hibe türü önerilmez.",
                      label: "{{grantType}} (Tavsiye edilmez)"
                    },
                    password: {
                      hint: "Bu hibe türü önerilmez.",
                      label: "{{grantType}} (Tavsiye edilmez)"
                    }
                  },
                  hint: "Bu, uygulamanın belirteç hizmetiyle nasıl iletişim kurduğunu belirleyecektir.",
                  label: "İzin verilen hibe türleri",
                  validation: {
                    refreshToken: "Yenileme belirteci verme türü, yalnızca yenileme belirteci sağlayan izin türleri ile birlikte seçilmelidir."
                  },
                  validations: {
                    empty: "En az bir hibe türü seçin"
                  }
                },
                public: {
                  hint: "İstemcinin kimlik doğrulaması yapmasına izin ver {{productName}} müşteri sırrı olmadan.  ",
                  label: "genel müşteri",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                }
              },
              messages: {
                customInvalidMessage: "Lütfen geçerli bir URI girin. ",
                revokeDisclaimer: {
                  content: "Uygulama iptal edildi. ",
                  heading: "Uygulama etkin değil"
                }
              },
              mobileApp: {
                discoverableHint: "Etkinleştirilirse ve web'den erişilebilen bir url (derin bağlantı) verilirse, müşteriler bu uygulamaya şu adresten erişebilir: <1>{{ myAccount }}</1> portal.",
                mobileAppPlaceholder: "uygulamam://oauth2"
              },
              sections: {
                accessToken: {
                  fields: {
                    applicationTokenExpiry: {
                      hint: "Geçerlilik süresini belirtin <1>application_access_token</1> saniyeler içinde.",
                      label: "Uygulama erişim belirteci sona erme süresi",
                      placeholder: "Uygulama erişim belirteci sona erme süresini girin",
                      validations: {
                        empty: "Lütfen uygulama erişim belirteci sona erme süresini doldurun",
                        invalid: "Uygulama erişim belirteci sona erme süresi saniye cinsinden olmalıdır. "
                      }
                    },
                    bindingType: {
                      children: {
                        ssoBinding: {
                          label: "TOA oturumu"
                        }
                      },
                      description: "tür seçin <1>TOA oturumu</1> izin vermek {{productName}} bağlamak için <3>erişim belirteci</3> ve <5>yenileme_token</5> oturum açın ve oturum başına yeni bir belirteç verin. ",
                      label: "Belirteç bağlama türü",
                      valueDescriptions: {
                        cookie: "Erişim belirtecini Secure ve httpOnly parametreleriyle bir tanımlama bilgisine bağlayın.",
                        none: "Bağlama yok. {{productName}} yalnızca belirtecin süresi dolduğunda veya iptal edildiğinde yeni bir erişim belirteci yayınlar.",
                        sso_session: "Erişim belirtecini oturum açma oturumuna bağlar. {{productName}} her yeni giriş için yeni bir erişim belirteci verecek ve oturum kapatıldığında belirteci iptal edecektir."
                      }
                    },
                    expiry: {
                      hint: "Geçerlilik süresini belirtin <1>erişim belirteci</1> saniyeler içinde.",
                      label: "Kullanıcı erişim belirteci sona erme süresi",
                      labelForSPA: "Erişim belirteci sona erme süresi",
                      placeholder: "Kullanıcı erişim belirteci sona erme süresini girin",
                      validations: {
                        empty: "Lütfen kullanıcı erişim belirteci sona erme süresini doldurun",
                        invalid: "Erişim belirtecinin sona erme süresi saniye cinsinden olmalıdır. "
                      }
                    },
                    revokeToken: {
                      hint: "Bağlı bir IDP oturumu bir kullanıcı oturumunu kapatma yoluyla sonlandırıldığında bu uygulamanın belirteçlerinin iptal edilmesine izin ver.",
                      label: "Kullanıcı oturumu kapattığında belirteçleri iptal et"
                    },
                    type: {
                      label: "belirteç türü",
                      valueDescriptions: {
                        "default": "Belirteç olarak opak bir UUID verin.",
                        jwt: "Bağımsız bir JWT belirteci düzenleyin."
                      }
                    },
                    validateBinding: {
                      hint: "Belirteç doğrulamasında bağlama özniteliklerini doğrulayın.  <1>erişim belirteci</1> başarılı yetkilendirme için çerez.",
                      label: "Belirteç bağlamalarını doğrulama"
                    }
                  },
                  heading: "Erişim Jetonu",
                  hint: " Erişim belirteci vereni, kullanıcı erişim belirteci sona erme süresini, uygulama erişim belirteci sona erme süresini vb. yapılandırın."
                },
                certificates: {
                  disabledPopup: "Bu sertifika şifrelemek için kullanılır. <1>id_token</1>.  <3>id_token</3> Devam etmek için şifreleme."
                },
                idToken: {
                  fields: {
                    algorithm: {
                      hint: "Açılır menü, desteklenenleri içerir <1>id_token</1> şifreleme algoritmaları.",
                      label: "algoritma",
                      placeholder: "Algoritma Seçin",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    audience: {
                      hint: "Bunun için alıcı(lar)ı belirtin. <1>id_token</1> Için tasarlanmıştır. ",
                      label: "Kitle",
                      placeholder: "Kitle Gir",
                      validations: {
                        duplicate: "Kitle yinelenen değerler içeriyor",
                        empty: "Lütfen seyirciyi doldurun",
                        invalid: "Lütfen virgül (,) gibi özel karakterlerden kaçının"
                      }
                    },
                    encryption: {
                      hint: "şifrelemek için seçin <1>id_token</1> uygulamanızın genel anahtarını kullanarak belirteci yayınlarken. ",
                      label: "Şifrelemeyi etkinleştir",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    expiry: {
                      hint: "Geçerlilik süresini belirtin <1>id_token</1> saniyeler içinde.",
                      label: "Kimlik Belirteci sona erme süresi",
                      placeholder: "Kimlik belirteci süre sonu süresini girin",
                      validations: {
                        empty: "Lütfen kimlik belirteci sona erme süresini doldurun",
                        invalid: "Kimlik belirteci sona erme süresi saniye cinsinden olmalıdır. "
                      }
                    },
                    method: {
                      hint: "Açılır menü, desteklenenleri içerir <1>id_token</1> şifreleme yöntemleri.",
                      label: "Şifreleme yöntemi",
                      placeholder: "Yöntem Seçin",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "kimlik belirteci"
                },
                logoutURLs: {
                  fields: {
                    back: {
                      hint: "{{productName}} oturum kapatma isteklerini doğrudan bu istemci URL'sine iletir, böylece istemciler kullanıcı oturumunu geçersiz kılabilir.",
                      label: "Arka kanal çıkış URL'si",
                      placeholder: "https://myapp.io/logout",
                      validations: {
                        empty: "Lütfen Arka Kanal Çıkış URL'sini doldurun",
                        invalid: "Lütfen geçerli URL ekleyin"
                      }
                    },
                    front: {
                      label: "Ön kanal çıkış URL'si",
                      placeholder: "Ön Kanal Çıkış URL'sini girin",
                      validations: {
                        empty: "Lütfen Ön Kanal Çıkış URL'sini doldurun",
                        invalid: "Lütfen geçerli URL ekleyin"
                      }
                    }
                  },
                  heading: "PKCE"
                },
                pkce: {
                  description: "tarafından kullanılan varsayılan yöntem {{productName}} meydan okuma oluşturmak için SHA-256'dır. ",
                  fields: {
                    pkce: {
                      children: {
                        mandatory: {
                          label: "Zorunlu"
                        },
                        plainAlg: {
                          label: "'Düz' Dönüşüm Algoritmasını Destekleyin"
                        }
                      },
                      label: "{{label}}",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "PKCE",
                  hint: "Uygulamanın, yetkilendirme isteğine bir code_challenge eklemesini zorunlu kılmak için seçin."
                },
                refreshToken: {
                  fields: {
                    expiry: {
                      hint: "Geçerlilik süresini belirtin <1>yenileme_token</1> saniyeler içinde.",
                      label: "Yenileme belirteci sona erme süresi",
                      placeholder: "Yenileme jetonunun sona erme süresini girin",
                      validations: {
                        empty: "Lütfen yenileme belirteci sona erme süresini doldurun",
                        invalid: "Yenileme belirteci sona erme süresi saniye cinsinden olmalıdır. "
                      }
                    },
                    renew: {
                      hint: "Yeni yayınlamak için seçin <1>yenileme_token</1> her seferinde bir <3>yenileme_token</3> değiştirilir. ",
                      label: "Yenileme jetonunu yenile",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "Jetonu Yenile"
                },
                requestObjectSignature: {
                  description: "{{productName}} OIDC kimlik doğrulama isteğinin, tek, bağımsız bir şekilde iletilen bir istek nesnesi olarak alınmasını destekler. <1>rica etmek</1> parametre. ",
                  fields: {
                    signatureValidation: {
                      label: "İmza doğrulamayı etkinleştir"
                    }
                  },
                  heading: "İstek Nesnesi"
                },
                scopeValidators: {
                  fields: {
                    validator: {
                      label: "{{label}}",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "Kapsam doğrulayıcılar"
                }
              }
            },
            inboundSAML: {
              description: "Aşağıda verilenler, uygulamanız için SAML ayarlarıdır.",
              documentation: "bizim aracılığıyla okuyun <1>belgeler</1> kullanma hakkında daha fazla bilgi edinmek için <3>{{protocol}}</3> uygulamalarınızda oturum açmak için protokol.",
              fields: {
                assertionURLs: {
                  hint: "Onaylama Tüketici Hizmeti (ACS) URL'si, SAML yanıtının nereye gönderileceğini belirler.",
                  info: "Bir uygulamanız yok mu?  {{assertionURLFromTemplate}} iddia tüketici URL'si olarak. ",
                  label: "Onay tüketici hizmeti URL'leri",
                  placeholder: "ACS URL'sini girin",
                  validations: {
                    empty: "Bu gerekli bir alandır.",
                    invalid: "Girilen URL ne HTTP ne de HTTPS'dir. ",
                    required: "Bu alan, işlevsel bir uygulama için gereklidir. "
                  }
                },
                defaultAssertionURL: {
                  hint: "Birden çok ACS URL'si yapılandırdıysanız, birini varsayılan olarak yapılandırmanız gerekir. ",
                  label: "Varsayılan iddia tüketici hizmeti URL'si",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                },
                idpEntityIdAlias: {
                  hint: "Bu değer, varsayılan Kimlik Sağlayıcı (IdP) varlık kimliğini ({{defaultIdpEntityID}}).  <1>saml2:Veren</1>  tarafından oluşturulan SAML yanıtının {{productName}}. ",
                  label: "IdP varlık kimliği takma adı",
                  placeholder: "takma ad girin",
                  validations: {
                    empty: "Bu gerekli bir alandır.",
                    invalid: "Bu, geçerli bir URI/URL olmalıdır."
                  }
                },
                issuer: {
                  errorMessage: "Veren zaten var.",
                  hint: "Bu, uygulamanın benzersiz tanımlayıcısını belirtir.  <1>saml2:Veren</1> uygulama tarafından verilen SAML kimlik doğrulama isteğinde belirtilen değer.",
                  label: "Yayıncı",
                  placeholder: "Yayıncıyı girin",
                  validations: {
                    empty: "Lütfen vereni belirtin"
                  }
                },
                metaURL: {
                  errorMessage: "Meta veri URL'si geçersiz",
                  hint: "meta dosyası için URL",
                  label: "Meta URL",
                  placeholder: "Meta dosya url'sini girin",
                  validations: {
                    empty: "Lütfen meta dosya url'sini sağlayın",
                    invalid: "geçerli bir URL girin"
                  }
                },
                mode: {
                  children: {
                    manualConfig: {
                      label: "Manuel Yapılandırma"
                    },
                    metadataFile: {
                      label: "Meta veri dosyası"
                    },
                    metadataURL: {
                      label: "Meta veri URL'si"
                    }
                  },
                  hint: "Saml'yi yapılandırmak için modu seçin.",
                  label: "mod"
                },
                qualifier: {
                  hint: "Bu değer, yalnızca aynı Yayıncı değeri için birden çok SAML Çoklu Oturum Açma (SSO) gelen kimlik doğrulama yapılandırması yapılandırmanız gerektiğinde gereklidir. ",
                  label: "Başvuru niteleyici",
                  placeholder: "Uygulama niteleyicisini girin",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                }
              },
              sections: {
                assertion: {
                  fields: {
                    audience: {
                      hint: "Bu, SAML iddiasının hedef kitlesini belirtir. ",
                      label: "İzleyiciler",
                      placeholder: "Kitle girin",
                      validations: {
                        invalid: "Lütfen geçerli URI ekleyin"
                      }
                    },
                    nameIdFormat: {
                      hint: "Bu, SAML onayında kullanıcıyla ilgili bilgi alışverişinde kullanılan ad tanımlayıcı biçimini belirtir.",
                      label: "Ad kimliği biçimi",
                      placeholder: "Ad kimliği biçimini girin",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    recipients: {
                      hint: "Bu, SAML onayının alıcılarını belirtir.",
                      label: "alıcılar",
                      placeholder: "Alıcı girin",
                      validations: {
                        invalid: "Lütfen geçerli URI ekleyin"
                      }
                    }
                  },
                  heading: "İddia"
                },
                attributeProfile: {
                  fields: {
                    enable: {
                      hint: "Bu, kullanıcının özniteliklerinin öznitelik bildiriminin bir parçası olarak SAML onaylarına dahil edilip edilmeyeceğini belirtir.",
                      label: "Öznitelik profilini etkinleştir"
                    },
                    includeAttributesInResponse: {
                      hint: "Nitelikleri Yanıta Her Zaman Dahil Et onay kutusunu seçtiğinizde, kimlik sağlayıcı her zaman SAML öznitelik bildiriminde seçilen taleplerle ilgili öznitelik değerlerini içerir.",
                      label: "Yanıta her zaman öznitelikleri dahil edin"
                    },
                    serviceIndex: {
                      hint: "Bu isteğe bağlı bir alandır, sağlanmadığı takdirde otomatik olarak bir değer oluşturulur.",
                      label: "Öznitelik tüketen hizmet dizini",
                      placeholder: "Öznitelik tüketen hizmet dizinini girin",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "Öznitelik Profili"
                },
                certificates: {
                  disabledPopup: "Devam etmek için istek imza doğrulaması ve onaylama şifrelemesinin devre dışı bırakıldığından emin olun.",
                  certificateRemoveConfirmation: {
                    header: "Geçerli sertifika kaldırılsın mı?",
                    content: "Sertifika türünün hiçbiri olarak ayarlanması, bu uygulama için sağlanan mevcut sertifikayı kaldıracaktır. "
                  }
                },
                encryption: {
                  fields: {
                    assertionEncryption: {
                      hint: "Kimlik doğrulamasından sonra döndürülen SAML2 Onaylarını şifrelemek için seçin. ",
                      label: "Şifrelemeyi etkinleştir",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    assertionEncryptionAlgorithm: {
                      label: "Onay şifreleme algoritması",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    keyEncryptionAlgorithm: {
                      label: "Anahtar şifreleme algoritması",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "şifreleme"
                },
                idpInitiatedSLO: {
                  fields: {
                    enable: {
                      hint: "Bu, uygulamanın IdP tarafından başlatılan oturum kapatmayı destekleyip desteklemediğini belirtir.",
                      label: "Olanak vermek",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    returnToURLs: {
                      hint: "Bu, oturum kapatıldıktan sonra kullanıcının yönlendirilmesi gereken URL'leri belirtir.",
                      label: "URL'lere dön",
                      placeholder: "URL girin",
                      validations: {
                        invalid: "Lütfen geçerli URL ekleyin"
                      }
                    }
                  },
                  heading: "IdP tarafından başlatılan tek oturum kapatma"
                },
                requestProfile: {
                  fields: {
                    enable: {
                      label: "Onay sorgusu profilini etkinleştir",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "Onay Sorgulama/Talep Profili"
                },
                requestValidation: {
                  fields: {
                    signatureValidation: {
                      hint: "Bu, olup olmadığını belirtir {{productName}} uygulama tarafından gönderilen SAML kimlik doğrulama isteğinin ve SAML oturum kapatma isteğinin imzasını doğrulamalıdır.",
                      label: "İstek imza doğrulamasını etkinleştir",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    signatureValidationCertAlias: {
                      hint: "Uygulama sertifikası sağlanmışsa kullanılacak ve yukarıda seçilen sertifika yoksayılacaktır.",
                      label: "Doğrulama sertifikası takma adı iste",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "Doğrulama İste"
                },
                responseSigning: {
                  fields: {
                    digestAlgorithm: {
                      label: "Özet algoritması",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    responseSigning: {
                      hint: "Bu, tarafından oluşturulan SAML yanıtlarının {{productName}} imzalanmalıdır.",
                      label: "SAML yanıtlarını imzala"
                    },
                    signingAlgorithm: {
                      label: "İmzalama algoritması",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "Yanıt İmzalama"
                },
                sloProfile: {
                  fields: {
                    enable: {
                      hint: "Bu, uygulamanın Tek Oturum Kapatma (SLO) profilini destekleyip desteklemediğini belirtir.",
                      label: "SLO'yu etkinleştir",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    logoutMethod: {
                      label: "Çıkış yöntemi",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    requestURL: {
                      hint: "Bu, tek oturum kapatma isteğinin gönderilmesi gereken uygulamanın uç noktasını belirtir.  {{productName}} ACS URL'sini kullanacaktır.",
                      label: "Tek çıkış isteği URL'si",
                      placeholder: "Tek çıkış isteği URL'si girin",
                      validations: {
                        empty: "Bu gerekli bir alandır.",
                        invalid: "geçerli bir URL girin"
                      }
                    },
                    responseURL: {
                      hint: "Bu, tek oturum kapatma yanıtının gönderilmesi gereken uygulamanın uç noktasını belirtir.  {{productName}} ACS URL'sini kullanacaktır.",
                      label: "Tek çıkış yanıt URL'si",
                      placeholder: "Tek oturum kapatma yanıt URL'sini girin",
                      validations: {
                        empty: "Bu gerekli bir alandır.",
                        invalid: "geçerli bir URL girin"
                      }
                    }
                  },
                  heading: "Tek Çıkış Profili"
                },
                ssoProfile: {
                  fields: {
                    artifactBinding: {
                      hint: "Bu, yapay çözümleme isteği imzasının uygulama sertifikasına göre doğrulanıp doğrulanmayacağını belirtir. ",
                      label: "Yapı bağlama için imza doğrulamayı etkinleştir"
                    },
                    bindings: {
                      hint: "Bu, SAML mesajlarını iletişim protokollerinde taşıma mekanizmalarını belirtir.",
                      label: "bağlamalar",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    },
                    idpInitiatedSSO: {
                      hint: "Bu, uygulama yerine IdP'den Çoklu Oturum Açma'nın (SSO) başlatılıp başlatılmayacağını belirtir.",
                      label: "IdP tarafından başlatılan SSO'yu etkinleştir",
                      validations: {
                        empty: "Bu gerekli bir alandır."
                      }
                    }
                  },
                  heading: "Tek Oturum Açma Profili"
                }
              }
            },
            inboundSTS: {
              fields: {
                realm: {
                  hint: "Pasif st'ler için bölge tanımlayıcısını girin",
                  label: "Diyar",
                  placeholder: "Bölgeye girin.",
                  validations: {
                    empty: "Bu gerekli bir alandır."
                  }
                },
                replyTo: {
                  hint: "Yanıtı işleyen RP uç noktası URL'sini girin.",
                  label: "Yanıt URL'si",
                  placeholder: "Yanıt URL'sini girin",
                  validations: {
                    empty: "Bu gerekli bir alandır.",
                    invalid: "geçerli bir URL girin"
                  }
                }
              }
            },
            inboundWSTrust: {
              fields: {
                audience: {
                  hint: "Güvenilen güvenen tarafın uç nokta adresi.",
                  label: "Kitle",
                  placeholder: "Kitle girin",
                  validations: {
                    empty: "Seyirciye girin.",
                    invalid: "geçerli bir URL girin"
                  }
                },
                certificateAlias: {
                  hint: "Güvenilir güvenen tarafın genel sertifikası.",
                  label: "Sertifika takma adı",
                  placeholder: "Kitle girin",
                  validations: {
                    empty: "Sertifika takma adını seçin"
                  }
                }
              }
            },
            outboundProvisioning: {
              fields: {
                blocking: {
                  hint: "Sağlama tamamlanana kadar kimlik doğrulama akışını engelleyin.",
                  label: "engelleme"
                },
                connector: {
                  label: "Hazırlama Bağlayıcısı",
                  placeholder: "Temel hazırlık bağlayıcısını seçin",
                  validations: {
                    empty: "Bir sağlama bağlayıcısı seçmek zorunludur."
                  }
                },
                idp: {
                  label: "Kimlik Sağlayıcı",
                  placeholder: "Kimlik sağlayıcı seçin",
                  validations: {
                    empty: "Bir IDP seçmek zorunludur."
                  }
                },
                jit: {
                  hint: "Tam zamanında sağlamayı kullanarak kimliği doğrulanmış mağazada kullanıcıları sağlayın.",
                  label: "JIT Giden"
                },
                rules: {
                  hint: "Kullanıcıları önceden tanımlanmış XACML kurallarına göre sağlayın",
                  label: "Kuralları Etkinleştir"
                }
              }
            },
            provisioningConfig: {
              fields: {
                proxyMode: {
                  hint: "Kullanıcılar/Gruplar, kullanıcı deposuna sağlanmaz. ",
                  label: "proxy modu"
                },
                userstoreDomain: {
                  hint: "Kullanıcıları ve grupları hazırlamak için kullanıcı deposu etki alanı adını seçin.",
                  label: "Kullanıcı deposu alanı sağlama"
                }
              }
            },
            spaProtocolSettingsWizard: {
              fields: {
                callBackUrls: {
                  label: "Yetkili yönlendirme URL'leri",
                  validations: {
                    empty: "Bu gerekli bir alandır.",
                    invalid: "Girilen URL ne HTTP ne de HTTPS'dir. "
                  }
                },
                name: {
                  label: "İsim",
                  validations: {
                    invalid: "{{appName}} geçerli bir isim değil.  {{characterLimit}} alfasayısallar, noktalar (.), kısa çizgiler (-), alt çizgiler (_) ve boşluklar dahil olmak üzere karakterler."
                  }
                },
                urlDeepLinkError: "Girilen URL bir derin bağlantı değil."
              }
            }
          },
          helpPanel: {
            tabs: {
              configs: {
                content: {
                  subTitle: "Uygulama için yapılandırılan protokole (OIDC, SAML, WS-Trust vb.) bağlı olarak şablon aracılığıyla önceden tanımlanmış yapılandırmaları güncelleyin veya yeni yapılandırmalar ekleyin.",
                  title: "Uygulama Yapılandırmaları"
                },
                heading: "Yapılandırma Kılavuzu"
              },
              docs: {
                content: null,
                heading: "Dokümanlar"
              },
              samples: {
                content: {
                  sample: {
                    configurations: {
                      btn: "Yapılandırmayı İndirin",
                      subTitle: "Sunucuda oluşturulan uygulamayı örnek uygulama ile entegre edebilmeniz için client'ı aşağıdaki konfigürasyonlarla başlatmanız gerekmektedir.",
                      title: "İstemciyi başlat"
                    },
                    downloadSample: {
                      btn: "örneği indir",
                      subTitle: "Bu örnek uygulama, Elveriş Identity Server SDK'nın kullanımını ve herhangi bir uygulamayı Identity Server ile nasıl entegre edebileceğinizi gösterecektir.",
                      title: "örneği deneyin"
                    },
                    goBack: "Geri gitmek",
                    subTitle: "Önceden yapılandırılmış örnek uygulamamızı indirerek hızlı bir şekilde prototip oluşturmaya başlayın.",
                    title: "Örnek Uygulamalar"
                  },
                  technology: {
                    subTitle: "Bir teknoloji seçtiğinizde, faydalı bilgilerle birlikte örnek ve gerekli SDK'lar sağlanacaktır.",
                    title: "Bir teknoloji seçin"
                  }
                },
                heading: "Örnekler"
              },
              sdks: {
                content: {
                  sdk: {
                    goBack: "Geri gitmek",
                    subTitle: "Aşağıdaki yazılım geliştirme kitleri, uygulama geliştirmeye hemen başlamak için kullanılabilir.",
                    title: "Yazılım Geliştirme Kitleri (SDK'ler)"
                  }
                },
                heading: "SDK'lar"
              },
              start: {
                content: {
                  endpoints: {
                    subTitle: "Uygulamanızı bir Elveriş SDK kullanmadan uygularsanız, uygulama için kimlik doğrulaması gerçekleştirmeniz için aşağıdaki sunucu uç noktaları yararlı olacaktır.",
                    title: "Sunucu uç noktaları"
                  },
                  oidcConfigurations: {
                    labels: {
                      authorize: "Yetki vermek",
                      endSession: "Çıkış Yap",
                      introspection: "iç gözlem",
                      issuer: "Yayıncı",
                      jwks: "JWKS",
                      keystore: "Anahtar seti",
                      revoke: "Geri çekmek",
                      token: "Jeton",
                      userInfo: "Kullanıcı bilgisi",
                      wellKnown: "keşif"
                    }
                  },
                  samlConfigurations: {
                    buttons: {
                      certificate: "Sertifikayı İndir",
                      metadata: "IdP Meta Verilerini İndirin"
                    },
                    labels: {
                      certificate: "kimlik sertifikası",
                      issuer: "Yayıncı",
                      metadata: "IdP Meta Verileri",
                      slo: "Tek Çıkış",
                      sso: "Tek seferlik"
                    }
                  },
                  trySample: {
                    btn: "Örnekleri keşfedin",
                    subTitle: "Kimlik doğrulama akışını gösterecek örnekleri deneyebilirsiniz. ",
                    title: "Bir örnekle deneyin"
                  },
                  useSDK: {
                    btns: {
                      withSDK: "SDK'yı kullanma",
                      withoutSDK: "manuel olarak"
                    },
                    subTitle: "Minimum sayıda kod satırı ile uygulamanıza kimlik doğrulaması entegre etmek için SDK'larımızı kurun ve kullanın.",
                    title: "Kendi uygulamanızı entegre edin"
                  }
                },
                heading: "Sıradaki ne?"
              }
            }
          },
          list: {
            actions: {
              add: "Yeni uygulama",
              custom: "Gelenek",
              predefined: "Ön Tanımlı Kullan"
            },
            columns: {
              actions: "",
              name: "İsim",
              inboundKey: "Gelen Anahtar"
            },
            labels: {
              fragment: "Paylaşılan uygulama"
            }
          },
          myaccount: {
            description: "Kullanıcılarınız için self servis portalı.",
            popup: "Hesabım'a erişim izni vermek ve hesaplarını yönetmek için bu bağlantıyı kullanıcılarınızla paylaşın.",
            title: "Hesabım",
            enable: {
              "0": "Etkinleştirilmiş",
              "1": "Engelli"
            },
            Confirmation: {
              enableConfirmation: {
                content: "Hesabım portalı önizleme modundadır ve kuruluşunuz üretime geçtiğinde devre dışı bırakmanız önerilir.",
                heading: "Emin misin?",
                message: "Hesabım portalını etkinleştirin."
              },
              disableConfirmation: {
                content: "Hesabım portalı önizleme modundadır ve kuruluşunuz üretime geçtiğinde devre dışı bırakmanız önerilir. ",
                heading: "Emin misin?",
                message: "Hesabım portalını devre dışı bırakın."
              }
            },
            notifications: {
              error: {
                description: "{{description}}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Hesabım portal durumu güncellenemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Hesabım portal durumu başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            fetchMyAccountStatus: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "Hesabım portal durumu alınamadı.",
                message: "Bir şeyler yanlış gitti"
              }
            }
          },
          notifications: {
            addApplication: {
              error: {
                description: "{{description}}",
                message: "oluşturma hatası"
              },
              genericError: {
                description: "Uygulama oluşturulamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Uygulama başarıyla oluşturuldu.",
                message: "Oluşturma başarılı"
              }
            },
            apiLimitReachedError: {
              error: {
                description: "İzin verilen maksimum uygulama sayısına ulaştınız.",
                message: "Uygulama oluşturulamadı"
              }
            },
            authenticationStepDeleteErrorDueToSecondFactors: {
              genericError: {
                description: "İkinci faktör kimlik doğrulayıcıları bir Kullanıcı Adına sahip olmayı gerektirir",
                message: "Adım silinemez"
              }
            },
            authenticationStepMin: {
              genericError: {
                description: "En az bir kimlik doğrulama adımı gereklidir.",
                message: "Adım silinemez"
              }
            },
            conditionalScriptLoopingError: {
              description: "gibi döngüsel yapılar <1>için</1>, <3>sırasında</3>, Ve <5>her biri için</5> koşullu kimlik doğrulama komut dosyasında izin verilmez.",
              message: "Komut dosyası güncellenemedi"
            },
            deleteApplication: {
              error: {
                description: "{{description}}",
                message: "Kaldırma Hatası"
              },
              genericError: {
                description: "Uygulama silinemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Uygulama başarıyla silindi.",
                message: "Uygulama silindi"
              }
            },
            deleteCertificateGenericError: {
              description: "Bir şeyler yanlış gitti. ",
              message: "Uygulama güncellenemedi"
            },
            deleteCertificateSuccess: {
              description: "Uygulama sertifikası başarıyla silindi.",
              message: "Silinen sertifika"
            },
            deleteOptionErrorDueToSecondFactorsOnRight: {
              error: {
                description: "{{description}}",
                message: "Bu kimlik doğrulayıcı silinemez"
              },
              genericError: {
                description: "Diğer adımlarda bu doğrulayıcıya bağlı olan doğrulayıcılar vardır.",
                message: "Bu kimlik doğrulayıcı silinemez"
              },
              success: {
                description: "Adımdaki kimlik doğrulayıcı başarıyla silindi {{stepNo}}.",
                message: "Silme başarılı"
              }
            },
            deleteProtocolConfig: {
              error: {
                description: "{{description}}",
                message: "Kaldırma Hatası"
              },
              genericError: {
                description: "Gelen protokol yapılandırmaları silinirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "başarıyla silindi {{protocol}} protokol yapılandırmaları.",
                message: "Yapılandırmalar silindi"
              }
            },
            duplicateAuthenticationStep: {
              genericError: {
                description: "Aynı kimlik doğrulayıcıya tek bir adımda birden fazla izin verilmez.",
                message: "İzin verilmedi"
              }
            },
            emptyAuthenticationStep: {
              genericError: {
                description: "Boş kimlik doğrulama adımları var. ",
                message: "Güncelleme hatası"
              }
            },
            fetchAllowedCORSOrigins: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "İzin verilen CORS Kaynakları alınamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "İzin verilen CORS Kaynakları başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            fetchApplication: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "Uygulama ayrıntıları alınamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Uygulama ayrıntıları başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            fetchApplications: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "Uygulamalar alınamadı",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Uygulamalar başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            fetchCustomInboundProtocols: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "Özel gelen iletişim kuralları alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "Özel gelen protokolleri başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            fetchInboundProtocols: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "Mevcut gelen protokoller alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "Gelen protokoller başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            fetchOIDCIDPConfigs: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "OIDC uygulaması için IDP yapılandırmaları alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "OIDC uygulaması için IDP yapılandırmaları başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            fetchOIDCServiceEndpoints: {
              genericError: {
                description: "OIDC uygulamaları için sunucu uç noktaları alınırken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              }
            },
            fetchProtocolMeta: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "Protokol meta verileri alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "Protokol meta verileri başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            fetchSAMLIDPConfigs: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "SAML uygulaması için IDP yapılandırmaları alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "SAML uygulaması için IDP yapılandırmaları başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            fetchTemplate: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "Uygulama şablonu verileri alınırken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Uygulama şablonu verileri başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            fetchTemplates: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "Uygulama şablonları alınamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Uygulama şablonları başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            firstFactorAuthenticatorToSecondStep: {
              genericError: {
                description: "Bu kimlik doğrulayıcı yalnızca ilk adıma eklenebilir.",
                message: "Bu adıma eklenemez"
              }
            },
            getInboundProtocolConfig: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "Protokol yapılandırmaları alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "Gelen protokol yapılandırmaları başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            regenerateSecret: {
              error: {
                description: "{{description}}",
                message: "Yeniden oluşturma hatası"
              },
              genericError: {
                description: "Uygulama yeniden oluşturulurken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Uygulama başarıyla yeniden oluşturuldu.",
                message: "Yenileme başarılı"
              }
            },
            revokeApplication: {
              error: {
                description: "{{description}}",
                message: "Hatayı iptal et"
              },
              genericError: {
                description: "Uygulama iptal edilirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Başvuru başarıyla iptal edildi.",
                message: "İptal başarılı"
              }
            },
            secondFactorAuthenticatorToFirstStep: {
              genericError: {
                description: "İkinci faktörlü kimlik doğrulayıcılar, önceki bir adımda temel bir kimlik doğrulayıcıya sahip olmayı gerektirir.",
                message: "Bu adıma eklenemez"
              }
            },
            tierLimitReachedError: {
              emptyPlaceholder: {
                action: "Planları Görüntüle",
                subtitles: "İzin verilen sınırı artırmak için kuruluş yöneticisiyle iletişime geçebilir veya (yöneticiyseniz) aboneliğinizi yükseltebilirsiniz.",
                title: "Bu kuruluş için izin verilen maksimum uygulama sayısına ulaştınız."
              },
              heading: "Uygulamalar için maksimum sınıra ulaştınız"
            },
            updateAdvancedConfig: {
              error: {
                description: "{{description}}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Gelişmiş yapılandırmalar alınırken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Gelişmiş yapılandırmalar başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateApplication: {
              error: {
                description: "{{description}}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Uygulama güncellenemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Uygulama başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateAuthenticationFlow: {
              error: {
                description: "{{description}}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Uygulamanın kimlik doğrulama akışı güncellenirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Uygulamanın kimlik doğrulama akışı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateClaimConfig: {
              error: {
                description: "Eşlenen kullanıcı öznitelikleri kopyalanamaz.",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Öznitelik ayarları güncellenirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Öznitelik ayarları başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateInboundProtocolConfig: {
              error: {
                description: "{{description}}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Gelen protokol yapılandırmaları güncellenirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Gelen protokol yapılandırmaları başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateInboundProvisioningConfig: {
              error: {
                description: "{{description}}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Sağlama yapılandırmaları güncellenirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Sağlama yapılandırmaları başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateOnlyIdentifierFirstError: {
              description: "Tanımlayıcı İlk doğrulayıcı, tek doğrulayıcı olamaz. ",
              message: "Güncelleme hatası"
            },
            updateOutboundProvisioning: {
              genericError: {
                description: "Giden sağlama IDP'si zaten var.",
                message: "Güncelleme hatası"
              }
            },
            updateProtocol: {
              error: {
                description: "{{description}}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Uygulama güncellenirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Yeni protokol yapılandırmaları başarıyla eklendi.",
                message: "Güncelleme başarılı"
              }
            }
          },
          placeholders: {
            emptyAttributesList: {
              action: "Kullanıcı Özniteliği Ekle",
              subtitles: "Şu anda uygulama için seçilmiş kullanıcı özelliği yok.",
              title: "Hiçbir kullanıcı özelliği eklenmedi"
            },
            emptyAuthenticatorStep: {
              subtitles: {
                "0": "Bu adıma seçenekler eklemek için yukarıdaki düğmeye tıklayın."
              },
              title: null
            },
            emptyAuthenticatorsList: {
              subtitles: "bulunamadı {{type}} doğrulayıcılar",
              title: null
            },
            emptyList: {
              action: "Yeni uygulama",
              subtitles: {
                "0": "Şu anda mevcut uygulama yok.",
                "1": "Aşağıdakileri takip ederek kolayca yeni bir uygulama ekleyebilirsiniz.",
                "2": "uygulama oluşturma sihirbazındaki adımlar."
              },
              title: "Yeni bir Uygulama ekle"
            },
            emptyOutboundProvisioningIDPs: {
              action: "Yeni Hazırlayıcı",
              subtitles: "Bu Uygulamada yapılandırılmış giden sağlayıcı yok. ",
              title: "Giden sağlayıcı yok"
            },
            emptyProtocolList: {
              action: "Yeni Protokol",
              subtitles: {
                "0": "Şu anda kullanılabilir protokol yok.",
                "1": "kullanarak kolayca protokol ekleyebilirsiniz.",
                "2": "önceden tanımlanmış şablonlar"
              },
              title: "protokol ekle"
            }
          },
          popups: {
            appStatus: {
              active: {
                content: "Uygulama aktif.",
                header: "Aktif",
                subHeader: ""
              },
              notConfigured: {
                content: "Uygulama yapılandırılmadı. ",
                header: "Ayarlanmamış",
                subHeader: ""
              },
              revoked: {
                content: "Uygulama iptal edildi. ",
                header: "iptal edildi",
                subHeader: ""
              }
            }
          },
          templates: {
            manualSetup: {
              heading: "Elle kurulum",
              subHeading: "Özel yapılandırmalarla bir uygulama oluşturun."
            },
            quickSetup: {
              heading: "Hızlı ayar",
              subHeading: "Uygulama oluşturmanızı hızlandırmak için önceden tanımlanmış uygulama şablonları seti."
            }
          },
          wizards: {
            applicationCertificateWizard: {
              emptyPlaceHolder: {
                description1: "Bu Uygulamaya eklenmiş sertifika yok.",
                description2: "Burada görüntülemek için bir sertifika ekleyin.",
                title: "sertifika yok"
              },
              heading: "Yeni Sertifika Ekle",
              subHeading: "Uygulamaya yeni sertifika ekle"
            },
            minimalAppCreationWizard: {
              help: {
                heading: "Yardım",
                subHeading: "Aşağıdaki kılavuzu kullanın",
                template: {
                  common: {
                    authorizedRedirectURLs: {
                      example: "Örneğin, https://myapp.io/login",
                      subTitle: "Kimlik doğrulama sonrasında yetkilendirme kodunun gönderildiği ve oturum kapatıldığında kullanıcının yönlendirildiği URL.",
                      title: "Yetkili yönlendirme URL'leri"
                    },
                    heading: {
                      example: "Örneğin, Uygulamam",
                      subTitle: "Uygulamanızı tanımlamak için benzersiz bir ad.",
                      title: "İsim"
                    },
                    protocol: {
                      subTitle: "SSO kullanarak uygulamada oturum açmak için kullanılacak erişim yapılandırma protokolü.",
                      title: "Protokol"
                    }
                  },
                  label: "Minimal uygulama oluşturma sihirbazı yardım paneli şablonları.",
                  samlWeb: {
                    assertionResponseURLs: {
                      example: "Örneğin, https://my-app.com/home.jsp",
                      subTitle: "Kimlik doğrulaması başarılı olduğunda tarayıcının yönlendirildiği URL'ler. ",
                      title: "Onay tüketici hizmeti URL'leri"
                    },
                    issuer: {
                      example: "Örneğin, uygulamam.com",
                      subTitle: "bu <1>saml:Veren</1> uygulamanın benzersiz tanımlayıcısını içeren öğe. ",
                      title: "Yayıncı"
                    },
                    metaFile: {
                      subTitle: "SAML yapılandırması için meta dosyasını yükleyin.",
                      title: "Meta Veri Dosyasını Yükle"
                    },
                    metaURL: {
                      subTitle: "SAML yapılandırmalarının alınabileceği meta URL bağlantısı.",
                      title: "Meta URL"
                    }
                  }
                }
              }
            }
          }
        },
        authenticationProvider: {
          advancedSearch: {
            form: {
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "Ada göre ara"
          },
          buttons: {
            addAttribute: "Öznitelik Ekle",
            addAuthenticator: "Yeni Doğrulayıcı",
            addCertificate: "Yeni Sertifika",
            addConnector: "Yeni Bağlayıcı",
            addIDP: "Bağlantı Oluştur"
          },
          confirmations: {
            deleteAuthenticator: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Bu kimlik doğrulayıcıyı silerseniz geri alamazsınız. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve kimlik doğrulayıcıyı kalıcı olarak siler."
            },
            deleteConnector: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Bu bağlayıcıyı silerseniz geri alamazsınız. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve bağlayıcıyı kalıcı olarak siler."
            },
            deleteIDP: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu bağlantıyı silerseniz, kurtaramazsınız. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve bağlantıyı kalıcı olarak siler."
            },
            deleteIDPWithConnectedApps: {
              assertionHint: "",
              content: "Silmeden önce bu uygulamalardan ilişkilendirmeleri kaldırın:",
              header: "Silinemiyor",
              message: "Bu bağlantıyı kullanan uygulamalar var."
            }
          },
          dangerZoneGroup: {
            deleteIDP: {
              actionTitle: "Silmek",
              header: "Bağlantıyı sil",
              subheader: "Bir kez sildikten sonra geri alınamaz. "
            },
            disableIDP: {
              actionTitle: "{{ state }} Bağlantı",
              header: "{{ state }} bağlantı",
              subheader: "Devre dışı bıraktıktan sonra, siz tekrar etkinleştirene kadar artık kullanılamaz.",
              subheader2: "Uygulamalarınızla kullanmak için kimlik sağlayıcıyı etkinleştirin."
            },
            header: "Tehlikeli bölge"
          },
          edit: {
            common: {
              settings: {
                tabName: "Ayarlar"
              }
            },
            emailOTP: {
              emailTemplate: {
                tabName: "E-posta şablonu <1>(Yakında gelecek)</1>"
              }
            },
            smsOTP: {
              smsProvider: {
                tabName: "SMS Sağlayıcı <1>(Yakında gelecek)</1>"
              }
            }
          },
          forms: {
            advancedConfigs: {
              alias: {
                hint: "Yerleşik kimlik sağlayıcısı, birleşik kimlik sağlayıcısında bir takma adla biliniyorsa burada belirtin.",
                label: "takma ad",
                placeholder: "Takma ad için değer girin."
              },
              certificateType: {
                certificateJWKS: {
                  label: "JWKS uç noktasını kullan",
                  placeholder: "Değer, JWKS biçimindeki sertifika olmalıdır.",
                  validations: {
                    empty: "Sertifika değeri gerekli",
                    invalid: "JWKS uç noktası geçerli bir URI olmalıdır."
                  }
                },
                certificatePEM: {
                  label: "Sertifika sağlayın",
                  placeholder: "Değer bir PEM URL'si olmalıdır.",
                  validations: {
                    empty: "Sertifika değeri gerekli"
                  }
                },
                hint: "Tür JWKS ise, değer bir JWKS URL'si olmalıdır. ",
                label: "Sertifika Türünü Seçin"
              },
              federationHub: {
                hint: "Bunun bir federasyon merkezi kimlik sağlayıcısına işaret edip etmediğini kontrol edin",
                label: "Federasyon Merkezi"
              },
              homeRealmIdentifier: {
                hint: "Bu kimlik sağlayıcı için ana bölge tanımlayıcısını girin",
                label: "Ana Bölge Tanımlayıcısı",
                placeholder: "Ana Bölge Tanımlayıcısı için değer girin."
              }
            },
            attributeSettings: {
              attributeListItem: {
                validation: {
                  empty: "Lütfen bir değer girin"
                }
              },
              attributeMapping: {
                attributeColumnHeader: "Bağlanmak",
                attributeMapColumnHeader: "Kimlik Sağlayıcı özniteliği",
                attributeMapInputPlaceholderPrefix: "örneğin: için IdP'nin özelliği ",
                componentHeading: "Özellikler Eşleme",
                hint: "Kimlik Sağlayıcı tarafından desteklenen öznitelikleri ekleyin"
              },
              attributeProvisioning: {
                attributeColumnHeader: {
                  "0": "Bağlanmak",
                  "1": "Kimlik Sağlayıcı özniteliği"
                },
                attributeMapColumnHeader: "Varsayılan değer",
                attributeMapInputPlaceholderPrefix: "örneğin: için varsayılan bir değer ",
                componentHeading: "Hazırlama Nitelikleri Seçimi",
                hint: "Sağlama için gerekli öznitelikleri belirtin"
              },
              attributeSelection: {
                searchAttributes: {
                  placeHolder: "Arama özellikleri"
                }
              }
            },
            authenticatorAccordion: {
              "default": {
                "0": "Varsayılan",
                "1": "Varsayılan yap"
              },
              enable: {
                "0": "Etkinleştirilmiş",
                "1": "Engelli"
              }
            },
            authenticatorSettings: {
              apple: {
                additionalQueryParameters: {
                  hint: "Apple'a gönderilecek ek sorgu parametreleri.",
                  label: "Ek Sorgu Parametreleri",
                  placeholder: "Ek sorgu parametreleri girin.",
                  validations: {
                    required: "Ek sorgu parametreleri zorunlu bir alan değildir."
                  }
                },
                callbackUrl: {
                  hint: "Apple kimlik bilgilerini almak için kullanılan yetkili yönlendirme URI'si.",
                  label: "Yetkili yönlendirme URI'sı",
                  placeholder: "Yetkili yönlendirme URI'sini girin.",
                  validations: {
                    required: "Yetkili yönlendirme URI'si zorunlu bir alandır."
                  }
                },
                clientId: {
                  hint: "Apple Hizmetleri Kimliği oluşturulurken sağlanan benzersiz tanımlayıcı.",
                  label: "Hizmet Kimliği",
                  placeholder: "Apple uygulaması için kayıtlı Hizmet Kimliğini girin.",
                  validations: {
                    required: "Hizmet Kimliği zorunlu bir alandır."
                  }
                },
                keyId: {
                  hint: "Apple uygulaması için özel anahtarı kaydederken oluşturulan anahtar tanımlayıcı.",
                  label: "Anahtar Kimliği",
                  placeholder: "Uygulamanın özel anahtarının Anahtar Kimliğini girin.",
                  validations: {
                    required: "Anahtar Kimliği zorunlu bir alandır."
                  }
                },
                privateKey: {
                  hint: "Apple uygulaması için oluşturulan özel anahtar.",
                  label: "Özel anahtar",
                  placeholder: "Apple uygulaması için oluşturulan Özel Anahtarı girin.",
                  validations: {
                    required: "Özel Anahtar zorunlu bir alandır."
                  }
                },
                secretValidityPeriod: {
                  hint: "Oluşturulan müşteri sırrının saniye cinsinden geçerlilik süresi. ",
                  label: "İstemci Sırrı Geçerlilik Süresi",
                  placeholder: "Müşteri Sırrı için Geçerlilik Süresini girin.",
                  validations: {
                    required: "İstemci Sırrı Geçerlilik Süresi zorunlu bir alan değildir."
                  }
                },
                scopes: {
                  heading: "Kapsamlar",
                  hint: "Bağlı uygulamaların Apple'dan gelen verilere erişmesi için sağlanan erişim türü.  <1>Burada</1> daha fazla öğrenmek için.",
                  list: {
                    email: {
                      description: "Bir kullanıcının e-posta adresine okuma erişimi verir."
                    },
                    name: {
                      description: "Bir kullanıcının adı alanlarına okuma erişimi verir."
                    }
                  }
                },
                teamId: {
                  hint: "Apple geliştirici ekibine atanan, oluşturulan benzersiz kimlik.",
                  label: "Takım Kimliği",
                  placeholder: "Apple geliştirici ekibinin Ekip Kimliğini girin.",
                  validations: {
                    required: "Ekip Kimliği zorunlu bir alandır."
                  }
                }
              },
              emailOTP: {
                enableBackupCodes: {
                  hint: "Kullanıcıların yedek kodlarla kimlik doğrulaması yapmasına izin verin.",
                  label: "Yedek kodlarla kimlik doğrulamayı etkinleştir",
                  validations: {
                    required: "Yedek kodlarla kimlik doğrulamayı etkinleştir zorunlu bir alandır."
                  }
                },
                expiryTime: {
                  hint: "Lütfen arasında bir değer seçin <1>1 dakika</1><3>1440 dakika (1 gün)</3>.",
                  label: "E-posta OTP geçerlilik süresi",
                  placeholder: "E-posta OTP sona erme süresini girin.",
                  unit: "dakika",
                  validations: {
                    invalid: "E-posta OTP sona erme zamanı bir tamsayı olmalıdır.",
                    range: "E-posta OTP sona erme süresi 1 dakika arasında olmalıdır",
                    required: "E-posta OTP sona erme zamanı zorunlu bir alandır."
                  }
                },
                tokenLength: {
                  hint: "OTP'de izin verilen karakter sayısı.  <1>4-10</1>.",
                  label: "E-posta OTP uzunluğu",
                  placeholder: "E-posta OTP uzunluğunu girin.",
                  unit: {
                    digits: "basamak",
                    characters: "karakterler"
                  },
                  validations: {
                    invalid: "E-posta OTP uzunluğu bir tamsayı olmalıdır.",
                    range: {
                      characters: "E-posta OTP uzunluğu 4 arasında olmalıdır",
                      digits: "E-posta OTP uzunluğu 4 arasında olmalıdır"
                    },
                    required: "E-posta OTP uzunluğu zorunlu bir alandır."
                  }
                },
                useNumericChars: {
                  hint: "Alfanümerik karakterleri etkinleştirmek için lütfen bu onay kutusunu temizleyin.",
                  label: "OTP için yalnızca sayısal karakterler kullanın",
                  validations: {
                    required: "OTP için yalnızca sayısal karakterler kullanın, zorunlu bir alandır."
                  }
                }
              },
              smsOTP: {
                expiryTime: {
                  hint: "Lütfen arasında bir değer seçin <1>1 dakika</1><3> 1440 dakika (1 gün)</3>.",
                  label: "SMS OTP geçerlilik süresi",
                  placeholder: "SMS OTP sona erme süresini girin.",
                  unit: "dakika",
                  validations: {
                    invalid: "SMS OTP sona erme süresi bir tamsayı olmalıdır.",
                    range: "SMS OTP bitiş süresi 1 dakika arasında olmalıdır.",
                    required: "SMS OTP bitiş zamanı zorunlu bir alandır."
                  }
                },
                tokenLength: {
                  hint: "OTP'de izin verilen karakter sayısı.  <1>4-10</1>.",
                  label: "SMS OTP uzunluğu",
                  placeholder: "SMS OTP uzunluğunu girin.",
                  validations: {
                    invalid: "SMS OTP uzunluğu bir tamsayı olmalıdır.",
                    range: {
                      digits: "SMS OTP uzunluğu 4 arasında olmalıdır",
                      characters: "SMS OTP uzunluğu 4 arasında olmalıdır"
                    },
                    required: "SMS OTP uzunluğu zorunlu bir alandır."
                  },
                  unit: {
                    digits: "basamak",
                    characters: "karakterler"
                  }
                },
                useNumericChars: {
                  hint: "Alfanümerik karakterleri etkinleştirmek için lütfen bu onay kutusunu temizleyin.",
                  label: "OTP için yalnızca sayısal karakterler kullanın",
                  validations: {
                    required: "OTP belirteci için yalnızca sayısal karakterler kullanın, zorunlu bir alandır."
                  }
                },
                allowedResendAttemptCount: {
                  hint: "İzin verilen OTP yeniden gönderme girişimlerinin sayısı.",
                  label: "İzin verilen OTP yeniden gönderme girişimi sayısı",
                  placeholder: "İzin verilen yeniden gönderme girişimi sayısını girin.",
                  validations: {
                    required: "İzin verilen OTP yeniden gönderme girişimi sayısı zorunlu bir alandır.",
                    invalid: "İzin verilen OTP yeniden gönderme girişimi sayısı bir tamsayı olmalıdır.",
                    range: "İzin verilen OTP yeniden gönderme girişimi sayısı 0 arasında olmalıdır"
                  }
                }
              },
              facebook: {
                callbackUrl: {
                  hint: "Facebook OAuth uygulamasında geçerli olarak belirtilen yönlendirme URI'si.",
                  label: "Geçerli OAuth yönlendirme URI'si",
                  placeholder: "Geçerli OAuth yönlendirme URI'lerini girin.",
                  validations: {
                    required: "Geçerli OAuth yönlendirme URI'leri zorunlu bir alandır."
                  }
                },
                clientId: {
                  hint: "Facebook OAuth uygulaması oluşturulduğunda oluşturulan, oluşturulan benzersiz kimlik.",
                  label: "Uygulama kimliği",
                  placeholder: "Facebook uygulamasından Uygulama Kimliğini girin.",
                  validations: {
                    required: "Uygulama Kimliği zorunlu bir alandır."
                  }
                },
                clientSecret: {
                  hint: "bu <1>Uygulama sırrı</1> Facebook OAuth uygulamasının değeri.",
                  label: "Uygulama sırrı",
                  placeholder: "Facebook uygulamasından Uygulama sırrını girin.",
                  validations: {
                    required: "Uygulama sırrı zorunlu bir alandır."
                  }
                },
                scopes: {
                  heading: "İzinler",
                  hint: "Bağlı uygulamaların Facebook'tan verilere erişmesi için verilen izinler.  <1>Burada</> daha fazla öğrenmek için.",
                  list: {
                    email: {
                      description: "Bir kullanıcının birincil e-posta adresine okuma erişimi verir."
                    },
                    profile: {
                      description: "Bir kullanıcının varsayılan genel profil alanlarına okuma erişimi verir."
                    }
                  }
                },
                userInfo: {
                  heading: "Kullanıcı bilgi alanları",
                  hint: "Bir kullanıcının istenen varsayılan genel profil alanları.  <1>Burada</1> daha fazla öğrenmek için.",
                  list: {
                    ageRange: {
                      description: "Bu kişi için yaş segmenti, minimum ve maksimum yaş olarak ifade edilir."
                    },
                    email: {
                      description: "Kullanıcının profilinde listelenen birincil e-posta adresi."
                    },
                    firstName: {
                      description: "Kişinin ilk adı."
                    },
                    gender: {
                      description: "Bu kişi tarafından seçilen cinsiyet, erkek veya kadın."
                    },
                    id: {
                      description: "Uygulama kullanıcısının Uygulama Kapsamlı Kullanıcı Kimliği."
                    },
                    lastName: {
                      description: "Kişinin soyadı."
                    },
                    link: {
                      description: "Kişinin Zaman Tüneline bir bağlantı."
                    },
                    name: {
                      description: "Kişinin tam adı."
                    }
                  },
                  placeholder: "Kullanıcı profilinden ayıklanacak alanları girin."
                }
              },
              github: {
                callbackUrl: {
                  hint: "OAuth uygulamanız için GitHub'da geçerli olarak belirtilen yeniden yönlendirme URI'leri kümesi.",
                  label: "Yetkilendirme geri arama URL'si",
                  placeholder: "Yetkilendirme geri arama URL'sini girin.",
                  validations: {
                    required: "Yetkilendirme geri arama URL'si zorunlu bir alandır."
                  }
                },
                clientId: {
                  hint: "bu <1>Müşteri Kimliği</> OAuth uygulamanız için GitHub'dan aldığınız",
                  label: "Müşteri Kimliği",
                  placeholder: "Github uygulamasından İstemci Kimliğini girin.",
                  validations: {
                    required: "Müşteri Kimliği zorunlu bir alandır."
                  }
                },
                clientSecret: {
                  hint: "bu <1>müşteri sırrı</1> OAuth uygulamanız için GitHub'dan aldığınız",
                  label: "müşteri sırrı",
                  placeholder: "Github uygulamasından İstemci sırrını girin.",
                  validations: {
                    required: "İstemci sırrı zorunlu bir alandır."
                  }
                },
                scopes: {
                  heading: "Kapsamlar",
                  hint: "Bağlı uygulamaların GitHub'dan verilere erişmesi için sağlanan erişim türü.  <1>Burada</1> daha fazla öğrenmek için.",
                  list: {
                    email: {
                      description: "Bir kullanıcının e-posta adreslerine okuma erişimi verir."
                    },
                    profile: {
                      description: "Bir kullanıcının profil verilerini okuma erişimi verir."
                    }
                  }
                }
              },
              google: {
                AdditionalQueryParameters: {
                  ariaLabel: "Google kimlik doğrulayıcı ek sorgu parametreleri",
                  hint: "Google'a gönderilecek ek sorgu parametreleri.",
                  label: "Ek Sorgu Parametreleri",
                  placeholder: "Ek sorgu parametreleri girin.",
                  validations: {
                    required: "İstemci sırrı zorunlu bir alan değil."
                  }
                },
                callbackUrl: {
                  hint: "Google kimlik bilgilerini almak için kullanılan yetkili yönlendirme URI'si.",
                  label: "Yetkili yönlendirme URI'sı",
                  placeholder: "Yetkili yönlendirme URI'sini girin.",
                  validations: {
                    required: "Yetkili yönlendirme URI'si zorunlu bir alandır."
                  }
                },
                clientId: {
                  hint: "bu <1>Müşteri Kimliği</1> OAuth uygulamanız için Google'dan aldığınız",
                  label: "Müşteri Kimliği",
                  placeholder: "Google uygulamasından İstemci Kimliğini girin.",
                  validations: {
                    required: "Müşteri Kimliği zorunlu bir alandır."
                  }
                },
                clientSecret: {
                  hint: "bu <1>müşteri sırrı</1> OAuth uygulamanız için Google'dan aldığınız",
                  label: "müşteri sırrı",
                  placeholder: "Google uygulamasından İstemci sırrını girin.",
                  validations: {
                    required: "İstemci sırrı zorunlu bir alandır."
                  }
                },
                enableGoogleOneTap: {
                  hint: "Google One Tap'ı oturum açma seçeneği olarak etkinleştirme",
                  label: "Google Tek Dokunuş",
                  placeholder: "Oturum açma seçeneği olarak Google tek dokunuş"
                },
                scopes: {
                  heading: "Kapsamlar",
                  hint: "Bağlı uygulamaların Google'dan gelen verilere erişmesi için sağlanan erişim türü.  <1>Burada</1> daha fazla öğrenmek için.",
                  list: {
                    email: {
                      description: "Kullanıcının e-posta adresini görüntülemeye izin verir."
                    },
                    openid: {
                      description: "OpenID Connect kullanarak kimlik doğrulamaya izin verir."
                    },
                    profile: {
                      description: "Kullanıcının temel profil verilerini görüntülemeye izin verir."
                    }
                  }
                }
              },
              microsoft: {
                commonAuthQueryParams: {
                  ariaLabel: "Microsoft kimlik doğrulayıcı ek sorgu parametreleri",
                  hint: "Microsoft'a gönderilecek ek sorgu parametreleri.",
                  label: "Ek Sorgu Parametreleri",
                  placeholder: "Ek sorgu parametreleri girin.",
                  validations: {
                    required: "İstemci sırrı zorunlu bir alan değil."
                  }
                },
                callbackUrl: {
                  hint: "Microsoft kimlik bilgilerini almak için kullanılan yetkili yönlendirme URI'si.",
                  label: "Yetkili yönlendirme URI'sı",
                  placeholder: "Yetkili yönlendirme URI'sini girin.",
                  validations: {
                    required: "Yetkili yönlendirme URI'si zorunlu bir alandır."
                  }
                },
                clientId: {
                  hint: "bu <1>Müşteri Kimliği</1> OAuth uygulamanız için Microsoft'tan aldığınız",
                  label: "Müşteri Kimliği",
                  placeholder: "Microsoft uygulamasından İstemci Kimliğini girin.",
                  validations: {
                    required: "Müşteri Kimliği zorunlu bir alandır."
                  }
                },
                clientSecret: {
                  hint: "bu <1>müşteri sırrı</1> OAuth uygulamanız için Microsoft'tan aldığınız",
                  label: "müşteri sırrı",
                  placeholder: "Microsoft uygulamasından İstemci sırrını girin.",
                  validations: {
                    required: "İstemci sırrı zorunlu bir alandır."
                  }
                },
                scopes: {
                  ariaLabel: "Microsoft Authenticator tarafından sağlanan kapsamlar",
                  heading: "Kapsamlar",
                  hint: "Bağlı uygulamaların Microsoft'tan verilere erişmesi için sağlanan erişim türü.  <1>Burada</1> daha fazla öğrenmek için.",
                  label: "Kapsamlar",
                  list: {
                    email: {
                      description: "Kullanıcının e-posta adresini görüntülemeye izin verir."
                    },
                    openid: {
                      description: "OpenID Connect kullanarak kimlik doğrulamaya izin verir."
                    },
                    profile: {
                      description: "Kullanıcının temel profil verilerini görüntülemeye izin verir."
                    }
                  },
                  placeholder: "örneğin: açık kimlik"
                }
              },
              hypr: {
                appId: {
                  hint: "bu <1>Uygulama Kimliği</1> OAuth uygulamanız için HYPR'den aldığınız.",
                  label: "Güvenen Taraf Uygulama Kimliği",
                  placeholder: "HYPR uygulamasından Uygulama Kimliğini girin.",
                  validations: {
                    required: "Bağlı Taraf Uygulama Kimliği zorunlu bir alandır."
                  }
                },
                apiToken: {
                  hint: "Kontrol merkezinde oluşturulan bağlı taraf uygulaması erişim belirteci.",
                  label: "API Jetonu",
                  placeholder: "HYPR'den API belirtecini girin",
                  validations: {
                    required: "API belirteci zorunlu bir alandır."
                  }
                },
                baseUrl: {
                  hint: "HYPR sunucu dağıtımınızın temel URL'si.",
                  label: "Temel URL",
                  placeholder: "HYPR sunucusu temel URL'sini girin",
                  validations: {
                    required: "Temel URL zorunlu bir alandır."
                  }
                }
              },
              saml: {
                AuthRedirectUrl: {
                  ariaLabel: "SAML onayı tüketici hizmeti URL'si",
                  hint: "Onaylama Tüketici Hizmeti (ACS) URL'si, nerede olduğunu belirler {{productName}} harici kimlik sağlayıcının SAML yanıtını göndermesini bekler.",
                  label: "Onaylama Tüketici Hizmeti (ACS) URL'si",
                  placeholder: "Onaylama Tüketici Hizmeti (ACS) URL'si"
                },
                DigestAlgorithm: {
                  ariaLabel: "Açıklama için özet algoritmasını seçin.",
                  label: "Özet algoritmasını seçin",
                  placeholder: "Özet algoritmasını seçin"
                },
                ISAuthnReqSigned: {
                  ariaLabel: "Kimlik doğrulama isteği imzalandı mı?",
                  hint: "etkinleştirildiğinde {{productName}} SAML2 kimlik doğrulama isteğini harici IdP'ye imzalayacaktır.",
                  label: "Kimlik doğrulama isteği imzalama"
                },
                IdPEntityId: {
                  ariaLabel: "Kimlik sağlayıcı varlık kimliği",
                  hint: "bu <1></1> harici IdP tarafından verilen SAML yanıtlarında belirtilen değer. ",
                  label: "Kimlik sağlayıcı varlık kimliği",
                  placeholder: "Kimlik sağlayıcı varlık kimliğini girin"
                },
                IncludeProtocolBinding: {
                  ariaLabel: "İsteğe protokol bağlamayı dahil et",
                  hint: "Taşıma mekanizmasının küçük kimlik doğrulama isteğine dahil edilip edilmeyeceğini belirtir.",
                  label: "İsteğe protokol bağlamayı dahil et"
                },
                IsAuthnRespSigned: {
                  ariaLabel: "Kimlik doğrulama yanıtı her zaman imzalanmalı mı?",
                  hint: "Harici IdP'den gelen SAML2 kimlik doğrulama yanıtının imzalanıp imzalanmayacağını belirtir.",
                  label: "Kimlik doğrulama yanıtı imza bilgilerini kesinlikle doğrulayın"
                },
                IsLogoutEnabled: {
                  ariaLabel: "IdP için oturum kapatmanın etkinleştirilip etkinleştirilmediğini belirtin",
                  hint: "Oturum kapatmanın harici IdP tarafından desteklenip desteklenmediğini belirtin.",
                  label: "Kimlik sağlayıcı oturum kapatma etkin"
                },
                IsLogoutReqSigned: {
                  ariaLabel: "IdP için oturum kapatmanın etkinleştirilip etkinleştirilmediğini belirtin",
                  hint: "etkinleştirildiğinde {{productName}} harici IdP'ye gönderilen SAML2 çıkış isteğini imzalayacaktır.",
                  label: "Çıkış isteği imzalama",
                  placeholder: ""
                },
                IsSLORequestAccepted: {
                  ariaLabel: "IdP için oturum kapatmanın etkinleştirilip etkinleştirilmediğini belirtin",
                  hint: "IdP'den gelen tek oturum kapatma talebinin şu kişi tarafından kabul edilip edilmeyeceğini belirtin: {{productName}}.",
                  label: "Kimlik sağlayıcı oturum kapatma isteğini kabul edin"
                },
                IsUserIdInClaims: {
                  ariaLabel: "Kullanıcı tanımlayıcısı olarak Name ID'yi kullanın.",
                  hint: "Kullanıcı tanımlayıcısı olarak SAML 2.0 onayından bir öznitelik belirtmek için öznitelikler bölümünden konu özniteliğini yapılandırın.",
                  label: "Özniteliklerden kullanıcı kimliğini bulun"
                },
                LogoutReqUrl: {
                  ariaLabel: "SAML 2.0 IdP Çıkış URL'sini belirtin",
                  hint: "Yukarıda bahsedilen Tek Oturum Açma URL'sinden farklıysa, IdP'nin oturum kapatma URL değerini girin.",
                  label: "IdP çıkış URL'si",
                  placeholder: "Çıkış URL'sini girin"
                },
                NameIDType: {
                  ariaLabel: "SAML 2.0 onayı için NameIDFormat'ı seçin",
                  hint: "Bu, harici IdP'den gönderilen SAML onayındaki kullanıcıyla ilgili bilgi alışverişinde kullanılan ad tanımlayıcı biçimini belirtir.",
                  label: "Kimlik sağlayıcı NameID biçimi",
                  placeholder: "Kimlik sağlayıcı seçin NameIDFormat"
                },
                RequestMethod: {
                  ariaLabel: "SAML 2.0 bağlamaları için HTTP protokolü",
                  hint: "Bu, SAML mesajlarını iletişim protokollerinde taşıma mekanizmalarını belirtir.",
                  label: "HTTP protokolü bağlama",
                  placeholder: "HTTP protokolü bağlamayı seçin"
                },
                SPEntityId: {
                  ariaLabel: "Servis sağlayıcı varlık kimliği",
                  hint: "Bu değer şu şekilde kullanılacaktır: <1><saml2:Issuer></1> başlatılan SAML isteklerinde {{productName}} harici Kimlik Sağlayıcıya (IdP). ",
                  label: "Servis sağlayıcı varlık kimliği",
                  placeholder: "Hizmet sağlayıcı varlık kimliğini girin"
                },
                SSOUrl: {
                  ariaLabel: "Tek Oturum Açma URL'si",
                  hint: "Harici IdP'nin çoklu oturum açma URL'si.  {{productName}} kimlik doğrulama isteklerini gönderir.",
                  label: "Kimlik sağlayıcı Çoklu Oturum Açma URL'si",
                  placeholder: "https://ENTERPRISE_IDP/samlsso"
                },
                SignatureAlgorithm: {
                  ariaLabel: "İstek imzalama için imza algoritmasını seçin.",
                  label: "imza algoritması",
                  placeholder: "İmza algoritmasını seçin."
                },
                commonAuthQueryParams: {
                  ariaLabel: "SAML, ek sorgu parametreleri talep ediyor",
                  label: "Ek sorgu parametreleri"
                }
              }
            },
            common: {
              customProperties: "Özel Özellikler",
              invalidQueryParamErrorMessage: "Bunlar geçerli sorgu parametreleri değil",
              invalidScopesErrorMessage: "Kapsamlar 'openid' içermelidir",
              invalidURLErrorMessage: "geçerli bir URL girin",
              requiredErrorMessage: "Bu alan boş olamaz"
            },
            generalDetails: {
              description: {
                hint: "Kimlik sağlayıcının metin açıklaması.",
                label: "Tanım",
                placeholder: "Kimlik sağlayıcının açıklamasını girin."
              },
              image: {
                hint: "Görüntüleme amacıyla kimlik sağlayıcının resminin URL'si. ",
                label: "Logo",
                placeholder: "https://myapp-resources.io/my_app_image.png"
              },
              name: {
                hint: "Bu bağlantı için benzersiz bir ad girin.",
                label: "İsim",
                placeholder: "Bağlantı için bir ad girin.",
                validations: {
                  duplicate: "Bu ada sahip bir kimlik sağlayıcı zaten var",
                  empty: "Kimlik Sağlayıcı adı gerekli",
                  maxLengthReached: "Kimlik sağlayıcı adı şu değeri aşamaz: {{ maxLength }} karakterler.",
                  required: "Kimlik Sağlayıcı adı gerekli"
                }
              }
            },
            jitProvisioning: {
              associateLocalUser: {
                label: "Sağlanan kullanıcıları mevcut yerel kullanıcılarla ilişkilendirin",
                hint: "Etkinleştirildiğinde, bu kimlik sağlayıcıyla yetkilendirilen kullanıcılar, aynı e-posta adresiyle zaten kayıtlı olan yerel kullanıcılara bağlanacaktır."
              },
              enableJITProvisioning: {
                disabledMessageContent: "Aşağıdaki uygulamalar etkinleştirilmesini gerektirdiğinden Tam Zamanında Kullanıcı Hazırlama ayarını devre dışı bırakamazsınız.",
                disabledMessageHeader: "İşleme İzin Verilmiyor",
                hint: "Bu kimlik sağlayıcıdan federe olan kullanıcıların proxy'ye tabi tutulması gerekip gerekmediğini belirtin.",
                label: "Tam Zamanında (JIT) Kullanıcı Hazırlama"
              },
              provisioningScheme: {
                children: {
                  "0": "Kullanıcı adı, şifre ve izin isteme",
                  "1": "Parola ve onay isteme",
                  "2": "Onay istemi",
                  "3": "Sessizce sağlama"
                },
                hint: "Kullanıcılar sağlandığında kullanılacak düzeni seçin.",
                label: "Tedarik şeması"
              },
              provisioningUserStoreDomain: {
                hint: "Kullanıcıları hazırlamak için kullanıcı deposu etki alanı adını seçin.",
                label: "Kullanıcıların her zaman temel hazırlığını yapmak için kullanıcı deposu alanı"
              }
            },
            outboundConnectorAccordion: {
              "default": {
                "0": "Varsayılan",
                "1": "Varsayılan yap"
              },
              enable: {
                "0": "Etkinleştirilmiş",
                "1": "Engelli"
              }
            },
            outboundProvisioningRoles: {
              heading: "Giden Sağlama Rolleri",
              hint: "Kimlik sağlayıcı giden sağlama rollerini seçin ve ekleyin",
              label: "rol",
              placeHolder: "Rol Seçin",
              popup: {
                content: "Rol Ekle"
              }
            },
            roleMapping: {
              heading: "Rol Eşleme",
              hint: "Kimlik Sağlayıcı rolleriyle yerel rolleri eşleyin",
              keyName: "Yerel Rol",
              validation: {
                duplicateKeyErrorMsg: "Bu rol zaten eşlendi. ",
                keyRequiredMessage: "Lütfen yerel rolü girin",
                valueRequiredErrorMessage: "Lütfen eşlenecek bir IDP rolü girin"
              },
              valueName: "Kimlik Sağlayıcı Rolü"
            },
            uriAttributeSettings: {
              role: {
                heading: "rol",
                hint: "Kimlik Sağlayıcıdaki rolleri tanımlayan özniteliği belirtir.",
                label: "Rol Özelliği",
                placeHolder: "Varsayılan Rol",
                validation: {
                  empty: "Lütfen rol için bir özellik seçin"
                }
              },
              subject: {
                heading: "Ders",
                hint: "Kurumsal kimlik sağlayıcısında kullanıcıyı tanımlayan öznitelik.  <1>saml2:Konu</1> SAML yanıtında konu özniteliği olarak kullanılır.",
                label: "Konu Özniteliği",
                placeHolder: "Varsayılan konu",
                validation: {
                  empty: "Lütfen konu için bir özellik seçin"
                }
              }
            }
          },
          helpPanel: {
            tabs: {
              samples: {
                content: {
                  docs: {
                    goBack: "Geri gitmek",
                    hint: "İlgili belgelere göz atmak için aşağıdaki Kimlik Sağlayıcı türlerine tıklayın.",
                    title: "Bir Şablon Türü Seçin"
                  }
                },
                heading: "Dokümanlar"
              }
            }
          },
          list: {
            actions: "Hareketler",
            name: "İsim"
          },
          modals: {
            addAuthenticator: {
              subTitle: "Kimlik sağlayıcıya yeni kimlik doğrulayıcı ekleyin: {{ idpName }}",
              title: "Yeni Doğrulayıcı Ekle"
            },
            addCertificate: {
              subTitle: "Kimlik sağlayıcıya yeni sertifika ekleyin: {{ idpName }}",
              title: "Sertifikaları Yapılandır"
            },
            addProvisioningConnector: {
              subTitle: "Yeni giden sağlama bağlayıcısı eklemek için adımları izleyin",
              title: "Giden sağlama bağlayıcısı oluştur"
            },
            attributeSelection: {
              content: {
                searchPlaceholder: "Arama Nitelikleri"
              },
              subTitle: "Yeni özellikler ekleyin veya mevcut özellikleri kaldırın.",
              title: "Öznitelik seçimini güncelle"
            }
          },
          notifications: {
            addFederatedAuthenticator: {
              error: {
                description: "{{ description }}",
                message: "Hata oluştur"
              },
              genericError: {
                description: "Doğrulayıcı eklenirken bir hata oluştu.",
                message: "Hata oluştur"
              },
              success: {
                description: "Doğrulayıcı başarıyla eklendi.",
                message: "Başarılı oluştur"
              }
            },
            addIDP: {
              error: {
                description: "{{ description }}",
                message: "Hata oluştur"
              },
              genericError: {
                description: "Kimlik sağlayıcı oluşturulurken bir hata oluştu.",
                message: "Hata oluştur"
              },
              success: {
                description: "Bağlantı başarıyla oluşturuldu.",
                message: "Başarılı oluştur"
              }
            },
            apiLimitReachedError: {
              error: {
                description: "İzin verilen maksimum bağlantı sayısına ulaştınız.",
                message: "Bağlantı oluşturulamadı"
              }
            },
            changeCertType: {
              jwks: {
                description: "Lütfen sertifikaların JWKS uç noktası tarafından geçersiz kılınacağını unutmayın.",
                message: "Uyarı!"
              },
              pem: {
                description: "JWKS bitiş noktasının sertifikalar tarafından geçersiz kılınacağını lütfen unutmayın.",
                message: "Uyarı!"
              }
            },
            deleteCertificate: {
              error: {
                description: "{{ description }}",
                message: "Sertifika silme hatası"
              },
              genericError: {
                description: "Sertifika silinirken bir hata oluştu.",
                message: "Sertifika silme hatası"
              },
              success: {
                description: "Sertifika başarıyla silindi.",
                message: "Silme başarılı"
              }
            },
            deleteConnection: {
              error: {
                description: "{{ description }}",
                message: "Bağlantı Silme Hatası"
              },
              genericError: {
                description: "Bağlantı silinirken bir hata oluştu.",
                message: "Bağlantı Silme Hatası"
              },
              success: {
                description: "Bağlantı başarıyla silindi.",
                message: "Silme Başarılı"
              }
            },
            deleteDefaultAuthenticator: {
              error: {
                description: "Varsayılan birleşik kimlik doğrulayıcı silinemez.",
                message: "Birleşik Kimlik Doğrulayıcı Silme Hatası"
              },
              genericError: null,
              success: null
            },
            deleteDefaultConnector: {
              error: {
                description: "Varsayılan giden sağlama bağlayıcısı silinemez.",
                message: "Giden Bağlayıcı Silme hatası"
              },
              genericError: null,
              success: null
            },
            deleteIDP: {
              error: {
                description: "{{ description }}",
                message: "Kimlik Sağlayıcı Silme Hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcı silinirken bir hata oluştu.",
                message: "Kimlik Sağlayıcı Silme Hatası"
              },
              success: {
                description: "Kimlik sağlayıcı başarıyla silindi.",
                message: "Silme başarılı"
              }
            },
            disableAuthenticator: {
              error: {
                description: "Varsayılan kimlik doğrulayıcıyı devre dışı bırakamazsınız.",
                message: "Veri doğrulama hatası"
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
                description: "Varsayılan giden sağlama bağlayıcısını devre dışı bırakamazsınız.",
                message: "Veri doğrulama hatası"
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
                description: "Sertifika, IDP için zaten var: {{idp}}",
                message: "Sertifika çoğaltma hatası "
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
                message: "Alma Hatası"
              },
              genericError: {
                description: "Nitelikler alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getConnectionDetails: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Bağlantı ayrıntıları alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getFederatedAuthenticator: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getFederatedAuthenticatorMetadata: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "Doğrulayıcı meta verileri alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getFederatedAuthenticatorsList: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getIDP: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcı ayrıntıları alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getIDPList: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcıları alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getIDPTemplate: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "IDP şablonu alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getIDPTemplateList: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcı şablon listesi alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getOutboundProvisioningConnector: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "Giden sağlama bağlayıcısı ayrıntıları alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getOutboundProvisioningConnectorMetadata: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "Giden sağlama bağlayıcısı meta verileri alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getOutboundProvisioningConnectorsList: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "Giden yetkilendirme bağlayıcıları listesi alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getRolesList: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Roller alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            submitAttributeSettings: {
              error: {
                description: "Tüm zorunlu özellikleri yapılandırmanız gerekir.",
                message: "Güncelleme gerçekleştirilemiyor"
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
            updateAttributes: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Kimlik Sağlayıcı nitelikleri güncellenirken bir hata oluştu.",
                message: "Güncelleme hatası"
              },
              success: {
                description: "Kimlik Sağlayıcı öznitelikleri başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateClaimsConfigs: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme Hatası"
              },
              genericError: {
                description: "Talep yapılandırmaları güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Talep yapılandırmaları başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateEmailOTPAuthenticator: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "E-posta OTP bağlayıcısı güncellenirken bir hata oluştu.",
                message: "Güncelleme hatası"
              },
              success: {
                description: "E-posta OTP bağlayıcısı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateSMSOTPAuthenticator: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "SMS OTP bağlayıcısı güncellenirken bir hata oluştu.",
                message: "Güncelleme hatası"
              },
              success: {
                description: "SMS OTP bağlayıcısı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateGenericAuthenticator: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Bağlayıcı güncellenirken bir hata oluştu.",
                message: "Güncelleme hatası"
              },
              success: {
                description: "Bağlayıcı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateFederatedAuthenticator: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Birleştirilmiş kimlik doğrulayıcı güncellenirken bir hata oluştu.",
                message: "Güncelleme hatası"
              },
              success: {
                description: "Birleşik kimlik doğrulayıcı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateFederatedAuthenticators: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Birleştirilmiş kimlik doğrulayıcılar güncellenirken bir hata oluştu.",
                message: "Güncelleme hatası"
              },
              success: {
                description: "Birleştirilmiş kimlik doğrulayıcılar başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateIDP: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Bağlantı güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Bağlantı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateIDPCertificate: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcı sertifikası güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Bağlantı sertifikası başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateIDPRoleMappings: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme Hatası"
              },
              genericError: {
                description: "Giden sağlama rolü yapılandırmaları güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Giden sağlama rolü yapılandırmaları başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateJITProvisioning: {
              error: {
                description: "",
                message: ""
              },
              genericError: {
                description: "JIT sağlama yapılandırmaları güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "JIT sağlama yapılandırmaları başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateOutboundProvisioningConnector: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme Hatası"
              },
              genericError: {
                description: "Giden sağlama bağlayıcısı güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Giden sağlama bağlayıcısı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateOutboundProvisioningConnectors: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme Hatası"
              },
              genericError: {
                description: "Giden sağlama bağlayıcıları güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Giden sağlama bağlayıcıları başarıyla güncellendi.",
                message: "Güncelleme Başarılı"
              }
            }
          },
          placeHolders: {
            emptyAuthenticatorList: {
              subtitles: {
                "0": "Şu anda kullanılabilir kimlik doğrulayıcı yok.",
                "1": "kullanarak kolayca yeni bir kimlik doğrulayıcı ekleyebilirsiniz.",
                "2": "önceden tanımlanmış şablonlar"
              },
              title: "Doğrulayıcı ekle"
            },
            emptyCertificateList: {
              subtitles: {
                "0": "Bu IDP'de eklenmiş sertifika yok.",
                "1": "Burada görüntülemek için bir sertifika ekleyin."
              },
              title: "sertifika yok"
            },
            emptyConnectionTypeList: {
              subtitles: {
                "0": "Şu anda kullanılabilir bağlantı türü yok.",
                "1": "yapılandırma için."
              },
              title: "Bağlantı türü bulunamadı"
            },
            emptyConnectorList: {
              subtitles: {
                "0": "Bu IDP'de yapılandırılmış giden yetkilendirme bağlayıcısı yok.",
                "1": "Burada görüntülemek için bir bağlayıcı ekleyin."
              },
              title: "Giden sağlama bağlayıcısı yok"
            },
            emptyIDPList: {
              subtitles: {
                "0": "Şu anda kullanılabilir bağlantı yok.",
                "1": "Takip ederek yeni bir bağlantı ekleyebilirsiniz.",
                "2": "oluşturma sihirbazındaki adımlar."
              },
              title: "Yeni bir Kimlik Sağlayıcı ekleyin"
            },
            emptyIDPSearchResults: {
              subtitles: {
                "0": "' araması için sonuç bulunamadı.{{ searchQuery }}'",
                "1": "Lütfen farklı bir arama terimi deneyin."
              },
              title: "Sonuç bulunamadı"
            },
            noAttributes: {
              subtitles: {
                "0": "Şu anda seçili özellik yok."
              },
              title: "Özellik eklenmedi"
            }
          },
          popups: {
            appStatus: {
              disabled: {
                content: "Kimlik sağlayıcı devre dışı bırakıldı. ",
                header: "Engelli",
                subHeader: ""
              },
              enabled: {
                content: "Kimlik sağlayıcı etkinleştirildi.",
                header: "Etkinleştirilmiş",
                subHeader: ""
              }
            }
          },
          templates: {
            apple: {
              wizardHelp: {
                clientId: {
                  description: "Sağlamak <1>Hizmet Kimliği</1> Apple'da oluşturuldu.",
                  heading: "Hizmet Kimliği"
                },
                heading: "Yardım",
                keyId: {
                  description: "Sağlamak <1>Anahtar Tanımlayıcı</1> oluşturulan özel anahtarın.",
                  heading: "Anahtar Kimliği"
                },
                name: {
                  connectionDescription: "Bağlantı için benzersiz bir ad girin.",
                  idpDescription: "Kimlik sağlayıcı için benzersiz bir ad sağlayın.",
                  heading: "İsim"
                },
                preRequisites: {
                  configureAppleSignIn: "Apple ile Oturum Açmak için ortamınızı yapılandırma konusunda Apple'ın kılavuzuna bakın.",
                  configureReturnURL: "Aşağıdaki URL'yi bir <1>Dönüş URL'si</1>.",
                  configureWebDomain: "Aşağıdakileri bir olarak kullanın <1>Web Etki Alanı</1>.",
                  getCredentials: "Başlamadan önce, bir <1>Apple ile Giriş Yapın</1> etkinleştirilmiş uygulama <3>Apple Geliştirici Portalı</3> Birlikte <5>Hizmet Kimliği</5> ve bir <5>Özel anahtar</5>.",
                  heading: "ön koşul"
                },
                privateKey: {
                  description: "Sağlamak <1>Özel anahtar</1> uygulama için oluşturulmuştur.",
                  heading: "Özel anahtar"
                },
                subHeading: "Aşağıdaki kılavuzu kullanın",
                teamId: {
                  description: "Apple geliştiricisini sağlayın <1>Takım Kimliği</1>.",
                  heading: "Takım Kimliği"
                }
              }
            },
            enterprise: {
              addWizard: {
                subtitle: "Standart kimlik doğrulama protokolleriyle bağlanmak için bir IDP yapılandırın.",
                title: "Standart tabanlı Kimlik Sağlayıcılar"
              },
              saml: {
                preRequisites: {
                  configureIdp: "SAML IdP'yi yapılandırma hakkında Asgardeo kılavuzuna bakın",
                  configureRedirectURL: "olarak aşağıdaki URL'yi kullanın. <1>Onaylama Tüketici Hizmeti (ACS) URL'si</1>.",
                  heading: "ön koşul",
                  hint: "Onaylama Tüketici Hizmeti (ACS) URL'si, nerede olduğunu belirler {{productName}} harici kimlik sağlayıcının SAML yanıtını göndermesini bekler."
                }
              },
              validation: {
                invalidName: "{{idpName}} geçerli bir isim değil. ",
                name: "Kimlik doğrulama sağlayıcı adı geçerli değil"
              }
            },
            expert: {
              wizardHelp: {
                description: {
                  connectionDescription: "Bağlantı için benzersiz bir ad girin.",
                  heading: "İsim",
                  idpDescription: "Kimlik sağlayıcı için benzersiz bir ad sağlayın."
                },
                heading: "Yardım",
                name: {
                  connectionDescription: "Bağlantı hakkında daha fazla açıklama yapmak için bir açıklama sağlayın.",
                  heading: "Tanım",
                  idpDescription: "Kimlik sağlayıcının bu konuda daha fazla açıklama yapması için bir açıklama sağlayın."
                },
                subHeading: "Aşağıdaki kılavuzu kullanın"
              }
            },
            facebook: {
              wizardHelp: {
                clientId: {
                  description: "Sağlamak <1>Uygulama kimliği</1> OAuth uygulamasını kaydettirdiğinizde Facebook'tan aldığınız.",
                  heading: "Uygulama kimliği"
                },
                clientSecret: {
                  description: "Sağlamak <1>Uygulama sırrı</1> OAuth uygulamasını kaydettirdiğinizde Facebook'tan aldığınız.",
                  heading: "Uygulama sırrı"
                },
                heading: "Yardım",
                name: {
                  connectionDescription: "Bağlantı için benzersiz bir ad girin.",
                  heading: "İsim",
                  idpDescription: "Kimlik sağlayıcı için benzersiz bir ad sağlayın."
                },
                preRequisites: {
                  configureOAuthApps: "Uygulamaları yapılandırma hakkında Facebook'un kılavuzuna bakın.",
                  configureRedirectURL: "Aşağıdaki URL'yi bir <1>Geçerli OAuth Yönlendirme URI'sı</1>.",
                  configureSiteURL: "Aşağıdakileri şu şekilde kullanın: <1>Site URL'si</1>.",
                  getCredentials: "Başlamadan önce, bir <1>uygulama</1> <3>Facebook'ta</3>ve bir <5>Uygulama kimliği</5>.",
                  heading: "ön koşul"
                },
                subHeading: "Aşağıdaki kılavuzu kullanın"
              }
            },
            github: {
              wizardHelp: {
                clientId: {
                  description: "Sağlamak <1>Müşteri Kimliği</1> OAuth uygulamasını kaydettirdiğinizde GitHub'dan aldığınız.",
                  heading: "Müşteri Kimliği"
                },
                clientSecret: {
                  description: "Sağlamak <1>müşteri sırrı</1> OAuth uygulamasını kaydettirdiğinizde GitHub'dan aldığınız.",
                  heading: "müşteri sırrı"
                },
                heading: "Yardım",
                name: {
                  connectionDescription: "Bağlantı için benzersiz bir ad girin.",
                  heading: "İsim",
                  idpDescription: "Kimlik sağlayıcı için benzersiz bir ad sağlayın."
                },
                preRequisites: {
                  configureHomePageURL: "Aşağıdakileri şu şekilde kullanın: <1>Ana Sayfa URL'si</1>.",
                  configureOAuthApps: "OAuth Uygulamalarını yapılandırma hakkında GitHub kılavuzuna bakın.",
                  configureRedirectURL: "Aşağıdaki URL'yi şu şekilde ekleyin: <1>Yetkilendirme geri arama URL'si</1>.",
                  getCredentials: "Başlamadan önce, bir <1>OAuth uygulaması</1> <3>GitHub'da</3>ve bir <5>Müşteri Kimliği</5>.",
                  heading: "ön koşul"
                },
                subHeading: "Aşağıdaki kılavuzu kullanın"
              }
            },
            google: {
              wizardHelp: {
                clientId: {
                  description: "Sağlamak <1>Müşteri Kimliği</1> OAuth uygulamasını kaydettirdiğinizde Google'dan aldığınız.",
                  heading: "Müşteri Kimliği"
                },
                clientSecret: {
                  description: "Sağlamak <1>müşteri sırrı</1> OAuth uygulamasını kaydettirdiğinizde Google'dan aldığınız.",
                  heading: "müşteri sırrı"
                },
                heading: "Yardım",
                name: {
                  connectionDescription: "Bağlantı için benzersiz bir ad girin.",
                  heading: "İsim",
                  idpDescription: "Kimlik sağlayıcı için benzersiz bir ad sağlayın."
                },
                preRequisites: {
                  configureOAuthApps: "OAuth Uygulamalarını yapılandırmayla ilgili Google kılavuzuna bakın.",
                  configureRedirectURL: "Aşağıdaki URL'yi şu şekilde ekleyin: <1>Yetkili Yönlendirme URI'sı</1>.",
                  getCredentials: "Başlamadan önce, bir <1>OAuth uygulaması</1> <3>Google'da</3>ve bir <5>Müşteri Kimliği</5>.",
                  heading: "ön koşul"
                },
                subHeading: "Aşağıdaki kılavuzu kullanın"
              }
            },
            organizationIDP: {
              wizardHelp: {
                name: {
                  description: "Kolayca tanımlanabilmesi için kurumsal kimlik doğrulama sağlayıcısı için benzersiz bir ad sağlayın.",
                  heading: "İsim"
                },
                description: {
                  description: "Bu konuda daha fazla açıklama yapmak için kurumsal kimlik doğrulama sağlayıcısı için bir açıklama sağlayın.",
                  heading: "Tanım",
                  example: "Örn. Bu, MyApp için IDP görevi gören MyOrg için kimlik doğrulayıcıdır."
                }
              }
            },
            microsoft: {
              wizardHelp: {
                clientId: {
                  description: "Sağlamak <1>Müşteri Kimliği</1> OAuth uygulamasını kaydettirdiğinizde Microsoft'tan aldığınız.",
                  heading: "Müşteri Kimliği"
                },
                clientSecret: {
                  description: "Sağlamak <1>müşteri sırrı</1> OAuth uygulamasını kaydettirdiğinizde Microsoft'tan aldığınız.",
                  heading: "müşteri sırrı"
                },
                heading: "Yardım",
                name: {
                  connectionDescription: "Bağlantı için benzersiz bir ad girin.",
                  heading: "İsim",
                  idpDescription: "Kimlik sağlayıcı için benzersiz bir ad sağlayın."
                },
                preRequisites: {
                  configureOAuthApps: "OAuth Uygulamalarını yapılandırmayla ilgili Microsoft kılavuzuna bakın.",
                  configureRedirectURL: "Aşağıdaki URL'yi şu şekilde ekleyin: <1>Yetkili Yönlendirme URI'sı</1>.",
                  getCredentials: "Başlamadan önce, bir <1>OAuth uygulaması</1> <3>Microsoft'ta</3>ve bir <5>Müşteri Kimliği</5>.",
                  heading: "ön koşul"
                },
                subHeading: "Aşağıdaki kılavuzu kullanın"
              }
            },
            hypr: {
              wizardHelp: {
                apiToken: {
                  description: "Sağlamak <1>API Jetonu</1> HYPR'den elde edildi. ",
                  heading: "API Jetonu"
                },
                appId: {
                  description: "Sağlamak <1>Uygulama Kimliği</1> HYPR kontrol merkezinde kayıtlı uygulamanın.",
                  heading: "Uygulama kimliği"
                },
                baseUrl: {
                  description: "Sağlamak <1>temel URL</1> HYPR sunucu dağıtımınızın.",
                  heading: "Temel URL"
                },
                heading: "Yardım",
                name: {
                  connectionDescription: "Bağlantı için benzersiz bir ad girin.",
                  heading: "İsim",
                  idpDescription: "Kimlik sağlayıcı için benzersiz bir ad sağlayın."
                },
                preRequisites: {
                  rpDescription: "Başlamadan önce, bir güvenen taraf uygulaması oluşturun. <1>HYPR kontrol merkezi</1>ve uygulama kimliğini alın.",
                  tokenDescription: "Ayrıca bir <1>API belirteci</1> HYPR'de oluşturulan uygulamanız için.",
                  heading: "ön koşul"
                }
              }
            },
            manualSetup: {
              heading: "Elle kurulum",
              subHeading: "Özel yapılandırmalara sahip bir kimlik sağlayıcı oluşturun."
            },
            quickSetup: {
              heading: "Hızlı ayar",
              subHeading: "Kimlik sağlayıcı oluşturma işleminizi hızlandırmak için önceden tanımlanmış şablonlar."
            }
          },
          wizards: {
            addAuthenticator: {
              header: "Doğrulayıcı hakkında temel bilgileri doldurun.",
              steps: {
                authenticatorConfiguration: {
                  title: "Doğrulayıcı Yapılandırması"
                },
                authenticatorSelection: {
                  manualSetup: {
                    subTitle: "Özel yapılandırmalarla yeni bir kimlik doğrulayıcı ekleyin.",
                    title: "Elle kurulum"
                  },
                  quickSetup: {
                    subTitle: "Süreci hızlandırmak için önceden tanımlanmış kimlik doğrulayıcı şablonları.",
                    title: "Hızlı ayar"
                  },
                  title: "Doğrulayıcı Seçimi"
                },
                authenticatorSettings: {
                  emptyPlaceholder: {
                    subtitles: [
                      "Bu kimlik doğrulayıcının kullanılabilecek herhangi bir ayarı yok.",
                      "bu seviyede yapılandırılmıştır.  <1>Sona ermek</1>."
                    ],
                    title: "Bu Kimlik Doğrulayıcı için ayar yok."
                  }
                },
                summary: {
                  title: "Özet"
                }
              }
            },
            addIDP: {
              header: "Kimlik sağlayıcı hakkında temel bilgileri doldurun.",
              steps: {
                authenticatorConfiguration: {
                  title: "Doğrulayıcı Yapılandırması"
                },
                generalSettings: {
                  title: "Genel Ayarlar"
                },
                provisioningConfiguration: {
                  title: "Sağlama Yapılandırması"
                },
                summary: {
                  title: "Özet"
                }
              }
            },
            addProvisioningConnector: {
              header: "Sağlama bağlayıcısı hakkındaki temel bilgileri doldurun.",
              steps: {
                connectorConfiguration: {
                  title: "Bağlayıcı Ayrıntıları"
                },
                connectorSelection: {
                  defaultSetup: {
                    subTitle: "Yeni giden sağlama bağlayıcısının türünü seçin",
                    title: "Bağlayıcı Tipleri"
                  },
                  title: "Bağlayıcı seçimi"
                },
                summary: {
                  title: "Özet"
                }
              }
            },
            buttons: {
              finish: "Sona ermek",
              next: "Sonraki",
              previous: "Öncesi"
            }
          }
        },
        suborganizations: {
          notifications: {
            tierLimitReachedError: {
              emptyPlaceholder: {
                action: "Planları Görüntüle",
                subtitles: "İzin verilen sınırı artırmak için kuruluş yöneticisiyle iletişime geçebilir veya (yöneticiyseniz) aboneliğinizi yükseltebilirsiniz.",
                title: "Bu kuruluş için izin verilen maksimum alt kuruluş sayısına ulaştınız."
              },
              heading: "Alt kuruluşlar için maksimum sınıra ulaştınız"
            }
          }
        },
        footer: {
          copyright: "Elveriş Kimlik Sunucusu © {{year}}"
        },
        header: {
          links: {
            adminPortalNav: "Yönetici Portalı",
            userPortalNav: "Hesabım"
          }
        },
        helpPanel: {
          actions: {
            close: "Kapalı",
            open: "Yardım panelini aç",
            pin: "Toplu iğne",
            unPin: "sabitlemeyi kaldır"
          },
          notifications: {
            pin: {
              success: {
                description: "Yardım paneli her zaman görünecek {{state}} açıkça değiştirmediğiniz sürece.",
                message: "yardım paneli {{state}}"
              }
            }
          }
        },
        idp: {
          advancedSearch: {
            form: {
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "IDP adına göre ara"
          },
          buttons: {
            addAttribute: "Öznitelik Ekle",
            addAuthenticator: "Yeni Doğrulayıcı",
            addCertificate: "Yeni Sertifika",
            addConnector: "Yeni Bağlayıcı",
            addIDP: "Yeni Kimlik Sağlayıcı"
          },
          confirmations: {
            deleteAuthenticator: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Bu kimlik doğrulayıcıyı silerseniz geri alamazsınız. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve kimlik doğrulayıcıyı kalıcı olarak siler."
            },
            deleteConnector: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Bu bağlayıcıyı silerseniz geri alamazsınız. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve bağlayıcıyı kalıcı olarak siler."
            },
            deleteIDP: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Bu kimlik sağlayıcıyı silerseniz kurtaramazsınız. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve kimlik sağlayıcıyı kalıcı olarak siler."
            },
            deleteIDPWithConnectedApps: {
              assertionHint: "",
              content: "Silmeden önce bu uygulamalardan ilişkilendirmeleri kaldırın:",
              header: "Silinemiyor",
              message: "Bu kimlik sağlayıcıyı kullanan uygulamalar var. "
            }
          },
          connectedApps: {
            action: "Oturum Açma Yöntemine Git",
            header: "Bağlantılı Uygulamaları {{idpName}}.",
            subHeader: "bağlı uygulamalar {{idpName}} burada listelenir.",
            placeholders: {
              search: "Uygulama adına göre ara",
              emptyList: "bağlı hiçbir uygulama yok {{idpName}} şu anda."
            },
            applicationEdit: {
              back: "Geri dönmek {{idpName}}"
            },
            genericError: {
              description: "Bağlı uygulamalar alınmaya çalışılırken hata oluştu.",
              message: "Hata oluştu."
            }
          },
          dangerZoneGroup: {
            deleteIDP: {
              actionTitle: "Kimlik Sağlayıcıyı Sil",
              header: "Kimlik sağlayıcıyı sil",
              subheader: "Bir kimlik sağlayıcıyı sildiğinizde kurtarılamaz. "
            },
            disableIDP: {
              actionTitle: "Kimlik Sağlayıcıyı Devre Dışı Bırak",
              header: "Kimlik sağlayıcıyı devre dışı bırak",
              subheader: "Bir kimlik sağlayıcıyı devre dışı bıraktığınızda, siz yeniden etkinleştirene kadar artık kullanılamaz.",
              subheader2: "Uygulamalarınızla kullanmak için kimlik sağlayıcıyı etkinleştirin."
            },
            header: "Tehlikeli bölge"
          },
          forms: {
            advancedConfigs: {
              alias: {
                hint: "Yerleşik kimlik sağlayıcısı, birleşik kimlik sağlayıcısında bir takma adla biliniyorsa burada belirtin.",
                label: "takma ad"
              },
              certificateType: {
                certificateJWKS: {
                  label: "JWKS uç noktasını kullan",
                  placeholder: "Değer, JWKS biçimindeki sertifika olmalıdır.",
                  validations: {
                    empty: "Sertifika değeri gerekli",
                    invalid: "JWKS uç noktası geçerli bir URI olmalıdır."
                  }
                },
                certificatePEM: {
                  label: "Sertifika sağlayın",
                  placeholder: "Değer bir PEM URL'si olmalıdır.",
                  validations: {
                    empty: "Sertifika değeri gerekli"
                  }
                },
                hint: "Tür JWKS ise, değer bir JWKS URL'si olmalıdır. ",
                label: "Sertifika Türünü Seçin"
              },
              federationHub: {
                hint: "Bunun bir federasyon merkezi kimlik sağlayıcısına işaret edip etmediğini kontrol edin",
                label: "Federasyon Merkezi"
              },
              homeRealmIdentifier: {
                hint: "Bu kimlik sağlayıcı için ana bölge tanımlayıcısını girin",
                label: "Ana Bölge Tanımlayıcısı"
              }
            },
            attributeSettings: {
              attributeListItem: {
                validation: {
                  empty: "Lütfen bir değer girin"
                }
              },
              attributeMapping: {
                attributeColumnHeader: "Bağlanmak",
                attributeMapColumnHeader: "Kimlik sağlayıcı özelliği",
                attributeMapInputPlaceholderPrefix: "örneğin: için IdP'nin özelliği ",
                componentHeading: "Özellikler Eşleme",
                hint: "Kimlik Sağlayıcı tarafından desteklenen öznitelikleri ekleyin"
              },
              attributeProvisioning: {
                attributeColumnHeader: {
                  "0": "Bağlanmak",
                  "1": "Kimlik sağlayıcı özelliği"
                },
                attributeMapColumnHeader: "Varsayılan değer",
                attributeMapInputPlaceholderPrefix: "örneğin: için varsayılan bir değer ",
                componentHeading: "Hazırlama Nitelikleri Seçimi",
                hint: "Sağlama için gerekli öznitelikleri belirtin"
              },
              attributeSelection: {
                searchAttributes: {
                  placeHolder: "Arama özellikleri"
                }
              }
            },
            authenticatorAccordion: {
              "default": {
                "0": "Varsayılan",
                "1": "Varsayılan yap"
              },
              enable: {
                "0": "Etkinleştirilmiş",
                "1": "Engelli"
              }
            },
            common: {
              customProperties: "Özel Özellikler",
              internetResolvableErrorMessage: "URL internette çözülebilir olmalıdır.",
              invalidQueryParamErrorMessage: "Bunlar geçerli sorgu parametreleri değil",
              invalidURLErrorMessage: "geçerli bir URL girin",
              requiredErrorMessage: "bu gereklidir"
            },
            generalDetails: {
              description: {
                hint: "Kimlik sağlayıcı hakkında anlamlı bir açıklama.",
                label: "Tanım",
                placeholder: "Kimlik sağlayıcının açıklamasını girin."
              },
              image: {
                hint: "Kimlik sağlayıcının resmini sorgulamak için bir URL.",
                label: "Kimlik Sağlayıcı Resim URL'si",
                placeholder: "Örneğin. "
              },
              name: {
                hint: "Bu kimlik sağlayıcı için benzersiz bir ad girin.",
                label: "Kimlik Sağlayıcı Adı",
                placeholder: "Kimlik sağlayıcı için bir ad girin.",
                validations: {
                  duplicate: "Bu ada sahip bir kimlik sağlayıcı zaten var",
                  empty: "Kimlik Sağlayıcı adı gerekli",
                  maxLengthReached: "Kimlik Sağlayıcı adı şu değeri aşamaz: {{ maxLength }} karakterler."
                }
              }
            },
            jitProvisioning: {
              enableJITProvisioning: {
                disabledMessageContent: {
                  "1": "Birden çok uygulama bu bağlantıya bağlı olduğundan Proxy Modu ayarlarını değiştiremezsiniz. ",
                  "2": "Bir uygulama bu bağlantıya bağlı olduğundan, Proxy Modu ayarlarını değiştirmenize izin verilmez. "
                },
                disabledMessageHeader: "İşleme İzin Verilmiyor",
                hint: "Bu kimlik sağlayıcıdan federe olan kullanıcıların proxy'ye tabi tutulması gerekip gerekmediğini belirtin.",
                label: "Tam Zamanında (JIT) Kullanıcı Hazırlama"
              },
              provisioningScheme: {
                children: {
                  "0": "Kullanıcı adı, şifre ve izin isteme",
                  "1": "Parola ve onay isteme",
                  "2": "Onay istemi",
                  "3": "Sessizce sağlama"
                },
                hint: "Kullanıcılar sağlandığında kullanılacak düzeni seçin.",
                label: "Tedarik şeması"
              },
              provisioningUserStoreDomain: {
                hint: "Kullanıcıları hazırlamak için kullanıcı deposu etki alanı adını seçin.",
                label: "Kullanıcıların her zaman temel hazırlığını yapmak için kullanıcı deposu alanı"
              }
            },
            outboundConnectorAccordion: {
              "default": {
                "0": "Varsayılan",
                "1": "Varsayılan yap"
              },
              enable: {
                "0": "Etkinleştirilmiş",
                "1": "Engelli"
              }
            },
            outboundProvisioningRoles: {
              heading: "Giden Sağlama Rolleri",
              hint: "Kimlik sağlayıcı giden sağlama rollerini seçin ve ekleyin",
              label: "rol",
              placeHolder: "Rol Seçin",
              popup: {
                content: "Rol Ekle"
              }
            },
            roleMapping: {
              heading: "Rol Eşleme",
              hint: "Kimlik Sağlayıcı rolleriyle yerel rolleri eşleyin",
              keyName: "Yerel Rol",
              validation: {
                duplicateKeyErrorMsg: "Bu rol zaten eşlendi. ",
                keyRequiredMessage: "Lütfen yerel rolü girin",
                valueRequiredErrorMessage: "Lütfen eşlenecek bir IDP rolü girin"
              },
              valueName: "Kimlik Sağlayıcı Rolü"
            },
            uriAttributeSettings: {
              role: {
                heading: "rol",
                hint: "Kimlik Sağlayıcıdaki rolleri tanımlayan özniteliği belirtir",
                label: "Rol Özelliği",
                placeHolder: "Öznitelik Seçin",
                validation: {
                  empty: "Lütfen rol için bir özellik seçin"
                }
              },
              subject: {
                heading: "Ders",
                hint: "Kimlik sağlayıcıda kullanıcıyı tanımlayan özniteliği belirtir",
                label: "Konu Özniteliği",
                placeHolder: "Öznitelik Seçin",
                validation: {
                  empty: "Lütfen konu için bir özellik seçin"
                }
              }
            }
          },
          helpPanel: {
            tabs: {
              samples: {
                content: {
                  docs: {
                    goBack: "Geri gitmek",
                    hint: "İlgili belgelere göz atmak için aşağıdaki Kimlik Sağlayıcı türlerine tıklayın.",
                    title: "Bir Şablon Türü Seçin"
                  }
                },
                heading: "Dokümanlar"
              }
            }
          },
          list: {
            actions: "Hareketler",
            name: "İsim"
          },
          modals: {
            addAuthenticator: {
              subTitle: "Kimlik sağlayıcıya yeni kimlik doğrulayıcı ekleyin: {{ idpName }}",
              title: "Yeni Doğrulayıcı Ekle"
            },
            addCertificate: {
              subTitle: "Kimlik sağlayıcıya yeni sertifika ekleyin: {{ idpName }}",
              title: "Sertifikaları Yapılandır"
            },
            addProvisioningConnector: {
              subTitle: "Yeni giden sağlama bağlayıcısı eklemek için adımları izleyin",
              title: "Giden sağlama bağlayıcısı oluştur"
            },
            attributeSelection: {
              content: {
                searchPlaceholder: "Arama Nitelikleri"
              },
              subTitle: "Yeni özellikler ekleyin veya mevcut özellikleri kaldırın.",
              title: "Öznitelik seçimini güncelle"
            }
          },
          notifications: {
            addFederatedAuthenticator: {
              error: {
                description: "{{ description }}",
                message: "Hata oluştur"
              },
              genericError: {
                description: "Doğrulayıcı eklenirken bir hata oluştu.",
                message: "Hata oluştur"
              },
              success: {
                description: "Doğrulayıcı başarıyla eklendi.",
                message: "Başarılı oluştur"
              }
            },
            addIDP: {
              error: {
                description: "{{ description }}",
                message: "Hata oluştur"
              },
              genericError: {
                description: "Kimlik sağlayıcı oluşturulurken bir hata oluştu.",
                message: "Hata oluştur"
              },
              success: {
                description: "Kimlik sağlayıcı başarıyla oluşturuldu.",
                message: "Başarılı oluştur"
              }
            },
            apiLimitReachedError: {
              error: {
                description: "İzin verilen maksimum kimlik sağlayıcı sayısına ulaştınız.",
                message: "Kimlik sağlayıcı oluşturulamadı"
              }
            },
            changeCertType: {
              jwks: {
                description: "Lütfen sertifikaların JWKS uç noktası tarafından geçersiz kılınacağını unutmayın.",
                message: "Uyarı!"
              },
              pem: {
                description: "Lütfen JWKS bitiş noktasının sertifikalar tarafından geçersiz kılınacağını unutmayın.",
                message: "Uyarı!"
              }
            },
            deleteCertificate: {
              error: {
                description: "{{ description }}",
                message: "Sertifika silme hatası"
              },
              genericError: {
                description: "Sertifika silinirken bir hata oluştu.",
                message: "Sertifika silme hatası"
              },
              success: {
                description: "Sertifika başarıyla silindi.",
                message: "Silme başarılı"
              }
            },
            deleteDefaultAuthenticator: {
              error: {
                description: "Varsayılan birleşik kimlik doğrulayıcı silinemez.",
                message: "Birleşik Kimlik Doğrulayıcı Silme Hatası"
              },
              genericError: null,
              success: null
            },
            deleteDefaultConnector: {
              error: {
                description: "Varsayılan giden sağlama bağlayıcısı silinemez.",
                message: "Giden Bağlayıcı Silme hatası"
              },
              genericError: null,
              success: null
            },
            deleteIDP: {
              error: {
                description: "{{ description }}",
                message: "Kimlik Sağlayıcı Silme Hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcı silinirken bir hata oluştu.",
                message: "Kimlik Sağlayıcı Silme Hatası"
              },
              success: {
                description: "Kimlik sağlayıcı başarıyla silindi.",
                message: "Silme başarılı"
              }
            },
            disableAuthenticator: {
              error: {
                description: "Varsayılan kimlik doğrulayıcıyı devre dışı bırakamazsınız.",
                message: "Veri doğrulama hatası"
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
                description: "Varsayılan giden sağlama bağlayıcısını devre dışı bırakamazsınız.",
                message: "Veri doğrulama hatası"
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
                description: "Sertifika, IDP için zaten var: {{idp}}",
                message: "Sertifika çoğaltma hatası "
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
                message: "Alma Hatası"
              },
              genericError: {
                description: "Nitelikler alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getFederatedAuthenticator: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getFederatedAuthenticatorMetadata: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "Doğrulayıcı meta verileri alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getFederatedAuthenticatorsList: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getIDP: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcı ayrıntıları alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getIDPList: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcıları alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getIDPTemplate: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "IDP şablonu alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getIDPTemplateList: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcı şablon listesi alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getOutboundProvisioningConnector: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "Giden sağlama bağlayıcısı ayrıntıları alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getOutboundProvisioningConnectorMetadata: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "Giden sağlama bağlayıcısı meta verileri alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getOutboundProvisioningConnectorsList: {
              error: {
                description: "{{ description }}",
                message: "alma hatası"
              },
              genericError: {
                description: "Giden yetkilendirme bağlayıcıları listesi alınırken bir hata oluştu.",
                message: "alma hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getRolesList: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Roller alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "",
                message: ""
              }
            },
            submitAttributeSettings: {
              error: {
                description: "Tüm zorunlu özellikleri yapılandırmanız gerekir.",
                message: "Güncelleme gerçekleştirilemiyor"
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
            tierLimitReachedError: {
              emptyPlaceholder: {
                action: "Planları Görüntüle",
                subtitles: "İzin verilen sınırı artırmak için kuruluş yöneticisiyle iletişime geçebilir veya (yöneticiyseniz) aboneliğinizi yükseltebilirsiniz.",
                title: "Bu kuruluş için izin verilen maksimum IdP sayısına ulaştınız."
              },
              heading: "IdP'ler için maksimum sınıra ulaştınız"
            },
            updateClaimsConfigs: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme Hatası"
              },
              genericError: {
                description: "Talep yapılandırmaları güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Talep yapılandırmaları başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateFederatedAuthenticator: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Birleştirilmiş kimlik doğrulayıcı güncellenirken bir hata oluştu.",
                message: "Güncelleme hatası"
              },
              success: {
                description: "Birleşik kimlik doğrulayıcı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateFederatedAuthenticators: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Birleştirilmiş kimlik doğrulayıcılar güncellenirken bir hata oluştu.",
                message: "Güncelleme hatası"
              },
              success: {
                description: "Birleştirilmiş kimlik doğrulayıcılar başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateIDP: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcı güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Kimlik sağlayıcı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateIDPCertificate: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Kimlik sağlayıcı sertifikası güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Kimlik sağlayıcı sertifikası başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateIDPRoleMappings: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme Hatası"
              },
              genericError: {
                description: "Giden sağlama rolü yapılandırmaları güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Giden sağlama rolü yapılandırmaları başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateJITProvisioning: {
              error: {
                description: "",
                message: ""
              },
              genericError: {
                description: "JIT sağlama yapılandırmaları güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "JIT sağlama yapılandırmaları başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateOutboundProvisioningConnector: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme Hatası"
              },
              genericError: {
                description: "Giden sağlama bağlayıcısı güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Giden sağlama bağlayıcısı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            updateOutboundProvisioningConnectors: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme Hatası"
              },
              genericError: {
                description: "Giden sağlama bağlayıcıları güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Giden sağlama bağlayıcıları başarıyla güncellendi.",
                message: "Güncelleme Başarılı"
              }
            }
          },
          placeHolders: {
            emptyAuthenticatorList: {
              subtitles: {
                "0": "Şu anda kullanılabilir kimlik doğrulayıcı yok.",
                "1": "kullanarak kolayca yeni bir kimlik doğrulayıcı ekleyebilirsiniz.",
                "2": "önceden tanımlanmış şablonlar"
              },
              title: "Doğrulayıcı ekle"
            },
            emptyCertificateList: {
              subtitles: {
                "0": "Bu IDP'de eklenmiş sertifika yok.",
                "1": "Burada görüntülemek için bir sertifika ekleyin."
              },
              title: "sertifika yok"
            },
            emptyConnectorList: {
              subtitles: {
                "0": "Bu IDP'de yapılandırılmış giden yetkilendirme bağlayıcısı yok.",
                "1": "Burada görüntülemek için bir bağlayıcı ekleyin."
              },
              title: "Giden sağlama bağlayıcısı yok"
            },
            emptyIDPList: {
              subtitles: {
                "0": "Şu anda kullanılabilir kimlik sağlayıcı yok.",
                "1": "Aşağıdakileri izleyerek kolayca yeni bir kimlik sağlayıcı ekleyebilirsiniz.",
                "2": "kimlik sağlayıcı oluşturma sihirbazındaki adımlar."
              },
              title: "Yeni bir Kimlik Sağlayıcı ekleyin"
            },
            emptyIDPSearchResults: {
              subtitles: {
                "0": "' araması için sonuç bulunamadı.{{ searchQuery }}'",
                "1": "Lütfen farklı bir arama terimi deneyin."
              },
              title: "Sonuç bulunamadı"
            },
            noAttributes: {
              subtitles: {
                "0": "Şu anda seçili özellik yok."
              },
              title: "Özellik eklenmedi"
            }
          },
          templates: {
            manualSetup: {
              heading: "Elle kurulum",
              subHeading: "Özel yapılandırmalara sahip bir kimlik sağlayıcı oluşturun."
            },
            quickSetup: {
              heading: "Hızlı ayar",
              subHeading: "Kimlik sağlayıcı oluşturma işleminizi hızlandırmak için önceden tanımlanmış şablonlar."
            }
          },
          wizards: {
            addAuthenticator: {
              header: "Doğrulayıcı hakkında temel bilgileri doldurun.",
              steps: {
                authenticatorConfiguration: {
                  title: "Doğrulayıcı Yapılandırması"
                },
                authenticatorSelection: {
                  manualSetup: {
                    subTitle: "Özel yapılandırmalarla yeni bir kimlik doğrulayıcı ekleyin.",
                    title: "Elle kurulum"
                  },
                  quickSetup: {
                    subTitle: "Süreci hızlandırmak için önceden tanımlanmış kimlik doğrulayıcı şablonları.",
                    title: "Hızlı ayar"
                  },
                  title: "Doğrulayıcı Seçimi"
                },
                summary: {
                  title: "Özet"
                }
              }
            },
            addIDP: {
              header: "Kimlik sağlayıcı hakkında temel bilgileri doldurun.",
              steps: {
                authenticatorConfiguration: {
                  title: "Doğrulayıcı Yapılandırması"
                },
                generalSettings: {
                  title: "Genel Ayarlar"
                },
                provisioningConfiguration: {
                  title: "Sağlama Yapılandırması"
                },
                summary: {
                  title: "Özet"
                }
              }
            },
            addProvisioningConnector: {
              header: "Sağlama bağlayıcısı hakkındaki temel bilgileri doldurun.",
              steps: {
                connectorConfiguration: {
                  title: "Bağlayıcı Ayrıntıları"
                },
                connectorSelection: {
                  defaultSetup: {
                    subTitle: "Yeni giden sağlama bağlayıcısının türünü seçin",
                    title: "Bağlayıcı Tipleri"
                  },
                  title: "Bağlayıcı seçimi"
                },
                summary: {
                  title: "Özet"
                }
              }
            },
            buttons: {
              finish: "Sona ermek",
              next: "Sonraki",
              previous: "Öncesi"
            }
          }
        },
        idvp: {
          advancedSearch: {
            form: {
              inputs: {
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "Ada göre ara"
          },
          buttons: {
            addIDVP: "Yeni Kimlik Doğrulama Sağlayıcısı"
          },
          placeholders: {
            emptyIDVPList: {
              subtitles: {
                "0": "Şu anda kullanılabilir bir kimlik doğrulama sağlayıcısı yok.",
                "1": "Takip ederek kolayca yeni bir kimlik doğrulama sağlayıcısı ekleyebilirsiniz.",
                "2": "kimlik doğrulama sağlayıcısı oluşturma sihirbazındaki adımlar."
              },
              title: "Yeni bir Kimlik Doğrulama Sağlayıcısı ekleyin"
            },
            emptyIDVPTypeList: {
              subtitles: {
                "0": "Şu anda kimlik doğrulama sağlayıcı türü yok ",
                "1": "yapılandırma için kullanılabilir."
              },
              title: "Kimlik doğrulama sağlayıcı türü bulunamadı"
            }
          },
          confirmations: {
            deleteIDVP: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu kimlik doğrulama sağlayıcısını silerseniz kurtaramazsınız. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve kimlik doğrulama sağlayıcısını kalıcı olarak siler."
            }
          },
          notifications: {
            getIDVPList: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik doğrulama sağlayıcıları alınırken bir hata oluştu.",
                message: "Alma Hatası"
              }
            },
            deleteIDVP: {
              error: {
                description: "{{ description }}",
                message: "Hatayı Sil"
              },
              genericError: {
                description: "Kimlik doğrulama sağlayıcısı silinirken bir hata oluştu.",
                message: "Hatayı Sil"
              },
              success: {
                description: "Kimlik doğrulama sağlayıcısı başarıyla silindi.",
                message: "Silme Başarılı"
              }
            },
            updateIDVP: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "Kimlik doğrulama sağlayıcısı güncellenirken bir hata oluştu.",
                message: "Güncelleme Hatası"
              },
              success: {
                description: "Kimlik doğrulama sağlayıcısı başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            },
            addIDVP: {
              error: {
                description: "{{ description }}",
                message: "Hata oluştur"
              },
              genericError: {
                description: "Kimlik doğrulama sağlayıcısı oluşturulurken bir hata oluştu.",
                message: "Hata oluştur"
              },
              success: {
                description: "Kimlik doğrulama sağlayıcısı başarıyla oluşturuldu.",
                message: "Başarılı oluştur"
              }
            },
            submitAttributeSettings: {
              error: {
                description: "Tüm zorunlu özellikleri yapılandırmanız gerekir.",
                message: "Güncelleme gerçekleştirilemiyor"
              }
            },
            getAllLocalClaims: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Nitelikler alınırken bir hata oluştu.",
                message: "Alma Hatası"
              }
            },
            getIDVP: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik doğrulama sağlayıcı ayrıntıları alınırken bir hata oluştu.",
                message: "Alma Hatası"
              }
            },
            getUIMetadata: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik doğrulama sağlayıcısı için meta veriler alınırken bir hata oluştu.",
                message: "Alma Hatası"
              }
            },
            getIDVPTemplateTypes: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik doğrulama sağlayıcı şablon türleri alınırken bir hata oluştu.",
                message: "Alma Hatası"
              }
            },
            getIDVPTemplateType: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik doğrulama sağlayıcı şablon türü alınırken bir hata oluştu.",
                message: "Alma Hatası"
              }
            },
            getIDVPTemplate: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Kimlik doğrulama sağlayıcı şablonu alınırken bir hata oluştu.",
                message: "Alma Hatası"
              }
            }
          },
          forms: {
            generalDetails: {
              description: {
                hint: "Kimlik doğrulama sağlayıcısı için bir metin açıklaması.",
                label: "Tanım",
                placeholder: "Kimlik doğrulama sağlayıcısı için bir açıklama girin."
              },
              name: {
                hint: "Bu kimlik doğrulama sağlayıcısı için benzersiz bir ad girin.",
                label: "İsim",
                placeholder: "Kimlik doğrulama sağlayıcısı için bir ad girin.",
                validations: {
                  duplicate: "Bu ada sahip bir kimlik doğrulama sağlayıcısı zaten var",
                  empty: "Kimlik Doğrulama Sağlayıcı adı gerekli",
                  maxLengthReached: "Kimlik doğrulama sağlayıcı adı şu değeri aşamaz: {{ maxLength }} karakterler.",
                  required: "Kimlik Doğrulama Sağlayıcı adı gerekli",
                  invalid: "Lütfen geçerli bir isim girin"
                }
              }
            },
            attributeSettings: {
              attributeMapping: {
                heading: "Kimlik Doğrulama Sağlayıcı Öznitelik Eşlemeleri",
                hint: "Harici Kimlik Doğrulama Sağlayıcısından desteklenen öznitelikleri ekleyin ve eşleyin.",
                addButton: "Nitelik Eşleme Ekle",
                emptyPlaceholderEdit: {
                  subtitle: "Bu Kimlik Doğrulama Sağlayıcısı için eşlenmiş öznitelik yok.",
                  title: "Eşlenen özellik yok"
                },
                emptyPlaceholderCreate: {
                  subtitle: "Nitelikleri eşleyin ve tıklayın <1>Nitelik Eşleme Ekle</1> başlamak.",
                  title: "Herhangi bir özelliği eşlemediniz"
                }
              },
              attributeMappingListItem: {
                validation: {
                  duplicate: "Bu adla eşlenen bir özellik zaten var.",
                  required: "Bu alan boş olamaz",
                  invalid: "Lütfen geçerli bir giriş girin"
                },
                placeholders: {
                  mappedValue: "Harici IDVP özelliğini girin",
                  localClaim: "Eşleme özelliğini seçin"
                },
                labels: {
                  mappedValue: "Harici IDVP Özniteliği",
                  localClaim: "Haritalar"
                }
              },
              attributeSelectionModal: {
                header: "Öznitelik Eşlemeleri Ekle"
              },
            },
            dynamicUI: {
                validations: {
                    required: "Bu alan boş olamaz",
                    regex: "Lütfen geçerli bir giriş girin",
                    range: "Rakam {{ min }} - {{ max }} arasında olmalıdır."
                }
            }
          },
          dangerZoneGroup: {
            deleteIDVP: {
              actionTitle: "Silmek",
              header: "Kimlik doğrulama sağlayıcısını sil",
              subheader: "Bu geri alınamaz bir eylemdir, dikkatli ilerleyin."
            },
            disableIDVP: {
              actionTitle: "{{ state }} Kimlik Doğrulama Sağlayıcısı",
              header: "{{ state }} kimlik doğrulama sağlayıcısı",
              subheader: "Bir kimlik doğrulama sağlayıcısını devre dışı bıraktığınızda, yeniden etkinleştirilene kadar artık kullanılamaz.",
              subheader2: "Uygulamalarınızla kullanmak için kimlik doğrulama sağlayıcısını etkinleştirin."
            },
            header: "Tehlikeli bölge"
          },
          list: {
            actions: "Hareketler",
            name: "İsim"
          }
        },
        overview: {
          banner: {
            heading: "Geliştiriciler için Elveriş Kimlik Sunucusu",
            subHeading: "SDK'ları kullanın",
            welcome: "Hoş geldin, {{username}}"
          },
          quickLinks: {
            cards: {
              applications: {
                heading: "Uygulamalar",
                subHeading: "Önceden tanımlanmış şablonları kullanarak uygulamalar oluşturun ve yapılandırmaları yönetin."
              },
              authenticationProviders: {
                heading: "Bağlantılar",
                subHeading: "Uygulamalarınızın oturum açma akışında kullanmak için bağlantılar oluşturun ve yönetin."
              },
              idps: {
                heading: "Kimlik Sağlayıcılar",
                subHeading: "Şablonlara dayalı olarak kimlik sağlayıcıları oluşturun ve yönetin ve kimlik doğrulamasını yapılandırın."
              },
              remoteFetch: {
                heading: "Uzaktan Alma",
                subHeading: "Elveriş Identity Server ile sorunsuz çalışacak şekilde bir uzak havuz yapılandırın."
              }
            }
          }
        },
        secrets: {
          advancedSearch: {
            form: {
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "Gizli isme göre ara"
          },
          alerts: {
            createdSecret: {
              description: "Sırrı başarıyla oluşturdu.",
              message: "Oluşturma başarılı."
            },
            deleteSecret: {
              description: "Sır başarıyla silindi.",
              message: "Silme başarılı."
            },
            updatedSecret: {
              description: "Sırrı başarıyla güncelledi.",
              message: "Güncelleme başarılı."
            }
          },
          banners: {
            adaptiveAuthSecretType: {
              content: "Bu sırlar, harici API'lere erişirken kayıtlı bir uygulamanın Koşullu Kimlik Doğrulama komut dosyasında kullanılabilir.",
              title: "Koşullu Kimlik Doğrulama Sırları"
            },
            secretIsHidden: {
              content: "Oluşturulduktan sonra gizli değeri tekrar göremeyeceksiniz.  ",
              title: "Neden sırrı göremiyorum?"
            }
          },
          emptyPlaceholders: {
            buttons: {
              addSecret: {
                ariaLabel: "Yeni bir Sır ekleyin.",
                label: "Yeni Sır"
              },
              backToSecrets: {
                ariaLabel: "Sırlar listesine gidin.",
                label: "Beni Sırlar'a geri götür"
              }
            },
            emptyListOfSecrets: {
              messages: [
                "Şu anda mevcut hiçbir sır yok."
              ]
            },
            resourceNotFound: {
              messages: [
                "Hata! ",
                "Belki de geçersiz bir URL'ye geldiniz..."
              ]
            }
          },
          errors: {
            generic: {
              description: "Bu isteği tamamlayamadık. ",
              message: "Bazışeyler doğru değil."
            }
          },
          forms: {
            actions: {
              submitButton: {
                ariaLabel: "Formu kaydetmek için güncelleyin",
                label: "Güncelleme"
              }
            },
            editSecret: {
              page: {
                description: "Sırrı düzenle"
              },
              secretDescriptionField: {
                ariaLabel: "Gizli Açıklama",
                hint: "Bu sır için bir açıklama sağlayın (ör. Bu sır ne zaman kullanılır).",
                label: "Gizli açıklama",
                placeholder: "Gizli bir açıklama girin"
              },
              secretValueField: {
                ariaLabel: "Bir Gizli Değer Girin",
                cancelButton: "İptal etmek",
                editButton: "Gizli değeri değiştir",
                hint: "uzunluk arasında bir değer girebilirsiniz. {{minLength}} ile {{maxLength}}.",
                label: "gizli değer",
                placeholder: "Gizli bir değer girin",
                updateButton: "Gizli değeri güncelle"
              }
            }
          },
          modals: {
            deleteSecret: {
              assertionHint: "Evet anladım. ",
              content: "Bu işlem geri alınamaz ve sırrı kalıcı olarak siler.",
              primaryActionButtonText: "Onaylamak",
              secondaryActionButtonText: "İptal etmek",
              title: "Emin misin?",
              warningMessage: "Bu sırrı silerseniz, bu değere bağlı koşullu kimlik doğrulama komut dizileri çalışmayı durduracaktır. "
            }
          },
          page: {
            description: "Koşullu kimlik doğrulama için gizli diziler oluşturun ve yönetin",
            primaryActionButtonText: "Yeni Sır",
            subFeatureBackButton: "Sırlar'e geri dön",
            title: "Sırlar"
          },
          routes: {
            category: "sırlar",
            name: "Sırlar",
            sidePanelChildrenNames: [
              "Gizli Düzenleme"
            ]
          },
          wizards: {
            actions: {
              cancelButton: {
                ariaLabel: "Modu İptal Et ve Kapat",
                label: "İptal etmek"
              },
              createButton: {
                ariaLabel: "Oluştur ve Gönder",
                label: "Yaratmak"
              }
            },
            addSecret: {
              form: {
                secretDescriptionField: {
                  ariaLabel: "Gizli Açıklama",
                  hint: "Bu sır için bir açıklama sağlayın (ör. Bu sır ne zaman kullanılır).",
                  label: "Gizli açıklama",
                  placeholder: "Gizli bir açıklama girin"
                },
                secretNameField: {
                  alreadyPresentError: "Bu Gizli isim zaten eklendi!",
                  ariaLabel: "Gizli Tür için Gizli Ad",
                  hint: "Bu sır için anlamlı bir isim girin. ",
                  label: "gizli isim",
                  placeholder: "Gizli bir ad girin"
                },
                secretTypeField: {
                  ariaLabel: "Gizli Tür Seçin",
                  hint: "Bu Sırrın dahil olduğu bir Sır Türü seçin.",
                  label: "Gizli tür seçin"
                },
                secretValueField: {
                  ariaLabel: "Gizli bir değer girin",
                  hint: "Bu sırrın değeridir.  {{minLength}} ile {{maxLength}}.",
                  label: "gizli değer",
                  placeholder: "Gizli bir değer girin"
                }
              },
              heading: "Sır Oluştur",
              subheading: "Koşullu kimlik doğrulama komut dosyaları için yeni bir sır oluşturun"
            }
          }
        },
        sidePanel: {
          applicationEdit: "Uygulama Düzenleme",
          applicationTemplates: "Uygulama Şablonları",
          applications: "Uygulamalar",
          authenticationProviderEdit: "Kimlik Sağlayıcıları Düzenle",
          authenticationProviderTemplates: "Kimlik Sağlayıcı Şablonları",
          authenticationProviders: "Bağlantılar",
          categories: {
            application: "Uygulamalar",
            authenticationProviders: "Kimlik Sağlayıcılar",
            general: "Genel",
            gettingStarted: "Başlarken",
            identityProviders: "Kimlik Sağlayıcılar",
            identityVerificationProviders: "Kimlik Doğrulama Sağlayıcıları"
          },
          customize: "Özelleştirmek",
          identityProviderEdit: "Kimlik Sağlayıcıları Düzenle",
          identityProviderTemplates: "Kimlik Sağlayıcı Şablonları",
          identityProviders: "Kimlik Sağlayıcılar",
          oidcScopes: "Kapsamlar",
          oidcScopesEdit: "Kapsam Düzenleme",
          overview: "genel bakış",
          remoteRepo: "Uzak Depo Yapılandırması",
          remoteRepoEdit: "Uzak Depo Yapılandırma Düzenleme"
        },
        templates: {
          emptyPlaceholder: {
            action: null,
            subtitles: "Lütfen burada görüntülenecek şablonlar ekleyin.",
            title: "Görüntülenecek şablon yok."
          }
        }
      },
      notifications: {
        endSession: {
          error: {
            description: "{{description}}",
            message: "Sonlandırma hatası"
          },
          genericError: {
            description: "Geçerli oturum sonlandırılamadı.",
            message: "Bir şeyler yanlış gitti"
          },
          success: {
            description: "Geçerli oturum başarıyla sonlandırıldı.",
            message: "Fesih başarılı"
          }
        },
        getProfileInfo: {
          error: {
            description: "{{description}}",
            message: "alma hatası"
          },
          genericError: {
            description: "Kullanıcı profili ayrıntıları alınamadı.",
            message: "Bir şeyler yanlış gitti"
          },
          success: {
            description: "Kullanıcı profili ayrıntıları başarıyla alındı.",
            message: "Alma başarılı"
          }
        },
        getProfileSchema: {
          error: {
            description: "{{description}}",
            message: "alma hatası"
          },
          genericError: {
            description: "Kullanıcı profili şemaları alınamadı.",
            message: "Bir şeyler yanlış gitti"
          },
          success: {
            description: "Kullanıcı profili şemaları başarıyla alındı.",
            message: "Alma başarılı"
          }
        }
      },
      pages: {
        applicationTemplate: {
          backButton: "Uygulamalara geri dön",
          subTitle: "Aşağıda verilen şablonlardan birini kullanarak bir uygulama kaydedin. ",
          title: "Yeni Başvuru Kaydet"
        },
        applications: {
          alternateSubTitle: "Uygulamalarınızı yönetin ve oturum açma akışlarını özelleştirin.",
          subTitle: "Uygulamalarınızı kaydedin ve yönetin ve oturum açmayı yapılandırın.",
          title: "Uygulamalar"
        },
        applicationsEdit: {
          backButton: "Uygulamalara geri dön",
          subTitle: null,
          title: null
        },
        authenticationProvider: {
          subTitle: "Uygulamalarınızın oturum açma akışında kullanmak için bağlantılar oluşturun ve yönetin.",
          title: "Bağlantılar"
        },
        authenticationProviderTemplate: {
          backButton: "Bağlantılara geri dön",
          search: {
            placeholder: "Ada göre ara"
          },
          subTitle: "Bir bağlantı türü seçin ve yeni bir bağlantı oluşturun.",
          supportServices: {
            authenticationDisplayName: "kimlik doğrulama",
            provisioningDisplayName: "sağlama"
          },
          title: "Yeni Bağlantı Oluştur"
        },
        idp: {
          subTitle: "Kullanıcıların uygulamanızda onlar aracılığıyla oturum açmasına izin vermek için kimlik sağlayıcıları yönetin.",
          title: "Kimlik Sağlayıcılar"
        },
        idpTemplate: {
          backButton: "Kimlik Sağlayıcılara geri dönün",
          subTitle: "Aşağıdaki kimlik sağlayıcılardan birini seçin.",
          supportServices: {
            authenticationDisplayName: "kimlik doğrulama",
            provisioningDisplayName: "sağlama"
          },
          title: "Kimlik Sağlayıcı Seçin"
        },
        idvp: {
          subTitle: "Kimlik Doğrulama Sağlayıcılarını yöneterek kullanıcıların kimliklerini onlar aracılığıyla doğrulamasına izin verin.",
          title: "Kimlik Doğrulama Sağlayıcıları"
        },
        idvpTemplate: {
          backButton: "Kimlik Doğrulama Sağlayıcılarına geri dönün",
          subTitle: "Aşağıdaki kimlik doğrulama sağlayıcılarından birini seçin.",
          title: "Kimlik Doğrulama Sağlayıcısını Seçin",
          search: {
            placeholder: "Ada göre ara"
          }
        },
        overview: {
          subTitle: "Uygulamaları, kimlik sağlayıcıları, kullanıcıları ve rolleri, öznitelik lehçelerini vb. yapılandırın ve yönetin.",
          title: "Hoş geldin, {{firstName}}"
        }
      },
      placeholders: {
        emptySearchResult: {
          action: "Arama sorgusunu temizle",
          subtitles: {
            "0": "\" araması için sonuç bulunamadı.{{query}}\"",
            "1": "Lütfen farklı bir arama terimi deneyin."
          },
          title: "Sonuç bulunamadı"
        },
        underConstruction: {
          action: "Anasayfaya geri dön",
          subtitles: {
            "0": "Bu sayfada bazı çalışmalar yapıyoruz.",
            "1": "Lütfen bizimle kalın ve daha sonra tekrar gelin. "
          },
          title: "Sayfa yapım aşamasında"
        }
      },
      technologies: {
        android: "Android",
        angular: "Açısal",
        ios: "iOS",
        java: "java",
        python: "Piton",
        react: "Tepki",
        windows: "pencereler"
      }
    },
    manage: {
      features: {
        approvals: {
          list: {
            columns: {
              actions: "Hareketler",
              name: "İsim"
            }
          },
          modals: {
            approvalProperties: {
              Claims: "iddialar",
              "REQUEST ID": "İstek Kimliği",
              Roles: "Roller",
              "User Store Domain": "Kullanıcı Mağaza Alanı",
              Username: "Kullanıcı adı"
            },
            taskDetails: {
              description: "Bir kullanıcının operasyonel eylemini onaylama talebiniz var.",
              header: "Onay Görevi"
            }
          },
          notifications: {
            fetchApprovalDetails: {
              error: {
                description: "{{description}}",
                message: "Onay ayrıntıları alınırken hata oluştu"
              },
              genericError: {
                description: "Onay ayrıntıları güncellenemedi",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Onay ayrıntıları başarıyla alındı.",
                message: "Onay ayrıntıları alma işlemi başarılı"
              }
            },
            fetchPendingApprovals: {
              error: {
                description: "{{description}}",
                message: "Bekleyen onaylar alınırken hata oluştu"
              },
              genericError: {
                description: "Bekleyen onaylar alınamadı",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Bekleyen onaylar başarıyla alındı.",
                message: "Bekleyen onayların alınması başarılı"
              }
            },
            updatePendingApprovals: {
              error: {
                description: "{{description}}",
                message: "Onay güncellenirken hata oluştu"
              },
              genericError: {
                description: "Onay güncellenemedi",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Onay başarıyla güncellendi.",
                message: "Güncelleme başarılı"
              }
            }
          },
          placeholders: {
            emptyApprovalFilter: {
              action: "Hepsini gör",
              subtitles: {
                "0": "Şu anda hiçbir onay yok {{status}} durum.",
                "1": "Lütfen herhangi bir göreviniz olup olmadığını kontrol edin. {{status}} belirtmek",
                "2": "onları burada görüntüle."
              },
              title: "Sonuç bulunamadı"
            },
            emptyApprovalList: {
              action: "",
              subtitles: {
                "0": "Şu anda incelenecek bir onay yok.",
                "1": "Lütfen sistemdeki işlemleri kontrol etmek için bir iş akışı ekleyip eklemediğinizi kontrol edin.",
                "2": ""
              },
              title: "Onay Yok"
            },
            emptySearchResults: {
              action: "Hepsini gör",
              subtitles: {
                "0": "Aradığınız iş akışını bulamadık.",
                "1": "Lütfen bu ada sahip bir iş akışınız olup olmadığını kontrol edin.",
                "2": "sistem."
              },
              title: "Onay Yok"
            }
          }
        },
        businessGroups: {
          fields: {
            groupName: {
              label: "{{type}} İsim",
              placeholder: "Girmek {{type}} İsim",
              validations: {
                duplicate: "A {{type}} verilenle zaten var {{type}} isim.",
                empty: "{{type}} Devam etmek için ad gereklidir.",
                invalid: "A {{type}} ad yalnızca alfasayısal karakterler, - ve _ içerebilir. "
              }
            }
          }
        },
        certificates: {
          keystore: {
            advancedSearch: {
              error: "Filtre sorgu biçimi yanlış",
              form: {
                inputs: {
                  filterAttribute: {
                    placeholder: "Örneğin. "
                  },
                  filterCondition: {
                    placeholder: "Örneğin. "
                  },
                  filterValue: {
                    placeholder: "Örneğin. "
                  }
                }
              },
              placeholder: "Takma adla ara"
            },
            attributes: {
              alias: "takma ad"
            },
            certificateModalHeader: "Sertifikayı Görüntüle",
            confirmation: {
              content: "Bu işlem geri alınamaz ve sertifikayı kalıcı olarak siler.",
              header: "Emin misin?",
              hint: "Lütfen yazın <1>{{id}}</1> onaylamak.",
              message: "Bu işlem geri alınamaz ve sertifikayı kalıcı olarak siler.",
              primaryAction: "Onaylamak",
              tenantContent: "Bu, kiracı sertifikasını kalıcı olarak siler.Silindikten sonra, yeni bir kiracı sertifikası almadığınız sürece portal uygulamalarına erişemezsiniz.Silme işlemine devam etmek için, sertifikanın diğer adını girin ve sil'i tıklayın."
            },
            errorCertificate: "Sertifikanın kodu çözülürken bir hata oluştu. ",
            errorEmpty: "Ya bir sertifika dosyası ekleyin ya da PEM kodlu bir sertifikanın içeriğini yapıştırın.",
            forms: {
              alias: {
                label: "takma ad",
                placeholder: "takma ad girin",
                requiredErrorMessage: "Takma ad gerekli"
              }
            },
            list: {
              columns: {
                actions: "Hareketler",
                name: "İsim"
              }
            },
            notifications: {
              addCertificate: {
                genericError: {
                  description: "Sertifika içe aktarılırken bir hata oluştu.",
                  message: "Bir şeyler yanlış gitti!"
                },
                success: {
                  description: "Sertifika başarıyla içe aktarıldı.",
                  message: "Sertifika alma başarısı"
                }
              },
              deleteCertificate: {
                genericError: {
                  description: "Sertifika silinirken bir hata oluştu.",
                  message: "Bir şeyler yanlış gitti!"
                },
                success: {
                  description: "Sertifika başarıyla silindi.",
                  message: "Sertifika başarıyla silindi"
                }
              },
              download: {
                success: {
                  description: "Sertifika indirilmeye başlandı.",
                  message: "Sertifika indirme işlemi başladı"
                }
              },
              getAlias: {
                genericError: {
                  description: "Sertifika getirilirken bir hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                }
              },
              getCertificate: {
                genericError: {
                  description: ".the sertifikası alınırken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti!"
                }
              },
              getCertificates: {
                genericError: {
                  description: "Sertifikalar alınırken bir hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                }
              },
              getPublicCertificate: {
                genericError: {
                  description: "Kuruluş sertifikası alınırken bir hata oluştu.",
                  message: "Bir şeyler yanlış gitti!"
                }
              }
            },
            pageLayout: {
              description: "Anahtar deposundaki sertifikaları yönetin.",
              primaryAction: "İthalat Sertifikası",
              title: "Sertifikalar"
            },
            placeholders: {
              emptyList: {
                action: "İthalat Sertifikası",
                subtitle: "Şu anda kullanılabilir sertifika yok. Aşağıdaki düğmeyi tıklayarak yeni bir sertifika alabilirsiniz.",
                title: "İthalat Sertifikası"
              },
              emptySearch: {
                action: "Arama sorgusunu temizle",
                subtitle: "için herhangi bir sonuç bulamadık {{searchQuery}},Lütfen farklı bir arama terimi deneyin.",
                title: "Sonuç bulunamadı"
              }
            },
            summary: {
              issuerDN: "Yayıncı DN'si",
              sn: "Seri numarası:",
              subjectDN: "Konu DN'si",
              validFrom: "Önce geçerli değil",
              validTill: "sonra geçerli değil",
              version: "Sürüm"
            },
            wizard: {
              dropZone: {
                action: "Sertifika Yükle",
                description: "Bir sertifika dosyasını buraya sürükleyip bırakın."
              },
              header: "İthalat Sertifikası",
              panes: {
                paste: "Yapıştırmak",
                upload: "Yüklemek"
              },
              pastePlaceholder: "PEM sertifikasının içeriğini yapıştırın",
              steps: {
                summary: "Özet",
                upload: "Sertifika yükle"
              }
            }
          },
          truststore: {
            advancedSearch: {
              form: {
                inputs: {
                  filterAttribute: {
                    placeholder: "Örneğin. "
                  },
                  filterCondition: {
                    placeholder: "Örneğin. "
                  },
                  filterValue: {
                    placeholder: "Örneğin. "
                  }
                }
              },
              placeholder: "Grup adına göre ara"
            }
          }
        },
        claims: {
          attributeMappings: {
            custom: {
              description: "Kullanıcı nitelikleri için özel protokol gösterimi.",
              heading: "Özel Nitelikler"
            },
            oidc: {
              description: "Kullanıcı öznitelikleri için OpenID Connect (OIDC) protokolü gösterimi.",
              heading: "OpenID Bağlantısı"
            },
            scim: {
              description: "SCIM2 API'sinde kullanılacak kullanıcı nitelikleri için SCIM2 protokolü gösterimi.",
              heading: "SCIM 2.0"
            }
          },
          dialects: {
            advancedSearch: {
              error: "Filtre sorgu biçimi yanlış",
              form: {
                inputs: {
                  filterAttribute: {
                    placeholder: "Örneğin. "
                  },
                  filterCondition: {
                    placeholder: "Örneğin. "
                  },
                  filterValue: {
                    placeholder: "Örneğin. "
                  }
                }
              },
              placeholder: "Nitelik eşlemesine göre ara "
            },
            attributes: {
              dialectURI: "Nitelik Eşleme"
            },
            confirmations: {
              action: "Onaylamak",
              content: "Bu öznitelik eşlemesini silerseniz, ilişkili tüm {{type}} öznitelikler de silinecek. Lütfen dikkatli ilerleyin.",
              header: "Emin misin?",
              hint: "Lütfen yazın <1>{{confirm}}</1> onaylamak.",
              message: "Bu işlem geri alınamaz ve seçili öznitelik eşlemesini kalıcı olarak siler."
            },
            dangerZone: {
              actionTitle: "Silmek {{type}} Nitelik Eşleme",
              header: "Silmek {{type}} Nitelik Eşleme",
              subheader: "Bunu bir kez sildiğinizde {{type}} öznitelik eşleme, geri dönüş yoktur. "
            },
            forms: {
              dialectURI: {
                label: "{{type}} Nitelik Eşleme",
                placeholder: "Bir öznitelik eşlemesi girin",
                requiredErrorMessage: "Bir öznitelik eşlemesi girin"
              },
              fields: {
                attributeName: {
                  validation: {
                    alreadyExists: "Verilen Öznitelik adına sahip bir Öznitelik zaten var.",
                    invalid: "Öznitelik adı yalnızca alfasayısal karakterler ve _ içerebilir. "
                  }
                }
              },
              submit: "Güncelleme"
            },
            notifications: {
              addDialect: {
                error: {
                  description: "Öznitelik eşlemesi eklenirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                },
                genericError: {
                  description: "Nitelik eşleme eklendi, ancak tümü eklenmedi {{type}} nitelikler başarıyla eklendi",
                  message: "{{type}} özellikler eklenemedi"
                },
                success: {
                  description: "Nitelik eşleme başarıyla eklendi",
                  message: "Nitelik Eşleme başarıyla eklendi"
                }
              },
              deleteDialect: {
                genericError: {
                  description: "Öznitelik eşlemesi silinirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Nitelik eşleme başarıyla silindi!",
                  message: "Nitelik Eşleme başarıyla silindi"
                }
              },
              fetchADialect: {
                genericError: {
                  description: "Öznitelik eşlemesi getirilirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                }
              },
              fetchDialects: {
                error: {
                  description: "{{description}}",
                  message: "alma hatası"
                },
                genericError: {
                  description: "Talep lehçeleri alınamadı.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Talep lehçeleri başarıyla alındı.",
                  message: "Alma başarılı"
                }
              },
              fetchExternalClaims: {
                genericError: {
                  description: "getirilirken bir hata oluştu. {{type}} Öznitellikler",
                  message: "Bir şeyler yanlış gitti"
                }
              },
              updateDialect: {
                genericError: {
                  description: "Öznitelik eşlemesi güncellenirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Nitelik eşleme başarıyla güncellendi.",
                  message: "Nitelik Eşleme güncellemesi başarılı"
                }
              }
            },
            pageLayout: {
              edit: {
                back: "Öznitelik Eşlemelerine geri dönün",
                description: "Öznitelik eşlemeyi düzenle",
                updateDialectURI: "Güncelleme {{type}} Nitelik Eşleme",
                updateExternalAttributes: "Güncelleme {{type}} Nitelik Eşleme"
              },
              list: {
                description: "API'ler veya uygulamalarınızla etkileşim kurarken kullanıcı özniteliklerinin nasıl eşlendiğini ve dönüştürüldüğünü görüntüleyin ve yönetin.",
                primaryAction: "Yeni Nitelik Eşleme",
                title: "Öznitellikler",
                view: "Nitelikleri görüntüle"
              }
            },
            sections: {
              manageAttributeMappings: {
                custom: {
                  description: "Özel eşlemeler aracılığıyla kullanıcı hakkındaki bilgileri iletin.",
                  heading: "Özel Öznitelik Eşleme"
                },
                description: "API'ler veya uygulamalarınızla etkileşim kurarken özniteliklerin nasıl eşlendiğini ve dönüştürüldüğünü görüntüleyin ve yönetin.",
                heading: "Nitelik Eşlemelerini Yönet",
                oidc: {
                  description: "Kimlik doğrulaması için OpenID Connect kullanan uygulamalar için kullanıcı hakkındaki bilgileri iletin.",
                  heading: "OpenID Bağlantısı"
                },
                scim: {
                  description: "SCIM2 standartlarına uygun API aracılığıyla kullanıcı hakkındaki bilgileri iletin.",
                  heading: "SCIM 2.0"
                }
              },
              manageAttributes: {
                attributes: {
                  description: "Her öznitelik, bir parça depolanmış kullanıcı verisi içerir.",
                  heading: "Öznitellikler"
                },
                description: "Nitelikleri görüntüleyin ve yönetin.",
                heading: "Nitelikleri Yönet"
              }
            },
            wizard: {
              header: "Nitelik Eşleme Ekle",
              steps: {
                dialectURI: "Nitelik Eşleme",
                externalAttribute: "{{type}} Bağlanmak",
                summary: "Özet"
              },
              summary: {
                externalAttribute: "{{type}} Bağlanmak",
                mappedAttribute: "Eşlenmiş Öznitelik",
                notFound: "HAYIR {{type}} öznitelik eklendi."
              }
            }
          },
          external: {
            advancedSearch: {
              error: "Filtre sorgu biçimi yanlış",
              form: {
                inputs: {
                  filterAttribute: {
                    placeholder: "Örneğin. {{type}} Öznitelik vb."
                  },
                  filterCondition: {
                    placeholder: "Örneğin. "
                  },
                  filterValue: {
                    placeholder: "Örneğin. "
                  }
                }
              },
              placeholder: "şuna göre ara: {{type}} bağlanmak"
            },
            attributes: {
              attributeURI: "{{type}} Bağlanmak",
              mappedClaim: "Eşlenmiş Öznitelik"
            },
            forms: {
              attributeURI: {
                label: "{{type}} Bağlanmak",
                placeholder: "Girmek {{type}} bağlanmak",
                requiredErrorMessage: "{{type}} Öznitelik gerekli",
                validationErrorMessages: {
                  duplicateName: "bu {{type}} öznitelik zaten var.",
                  invalidName: "Girdiğiniz ad geçersiz karakterler içeriyor. ",
                  scimInvalidName: "Adın başlangıç ​​karakteri bir harf olmalıdır. "
                }
              },
              emptyMessage: "Tüm SCIM öznitelikleri yerel taleplerle eşlenir.",
              localAttribute: {
                label: "Eşlenecek Kullanıcı Özniteliği",
                placeholder: "Bir kullanıcı özelliği seçin",
                requiredErrorMessage: "Eşlenecek bir kullanıcı özelliği seçin"
              },
              submit: "Nitelik Eşleme Ekle",
              warningMessage: "Eşleme için kullanılabilir yerel öznitelik yok. "
            },
            notifications: {
              addExternalAttribute: {
                genericError: {
                  description: "eklenirken bir hata oluştu. {{type}} bağlanmak.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "bu {{type}} öznitelik, öznitelik eşlemesine başarıyla eklendi!",
                  message: "Özellik eklendi"
                }
              },
              deleteExternalClaim: {
                genericError: {
                  description: "silinirken bir hata oluştu {{type}} bağlanmak",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "bu {{type}} öznitelik başarıyla silindi!",
                  message: "Öznitelik silindi"
                }
              },
              fetchExternalClaims: {
                error: {
                  description: "{{description}}",
                  message: "alma hatası"
                },
                genericError: {
                  description: "alınamadı {{type}} Öznitellikler.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Başarıyla alındı {{type}} Öznitellikler.",
                  message: "Alma başarılı"
                }
              },
              getExternalAttribute: {
                genericError: {
                  description: "getirilirken bir hata oluştu. {{type}} bağlanmak",
                  message: "Bir şeyler yanlış gitti"
                }
              },
              updateExternalAttribute: {
                genericError: {
                  description: "güncellenirken bir hata oluştu {{type}} bağlanmak",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "bu {{type}} öznitelik başarıyla güncellendi!",
                  message: "Öznitelik güncellendi"
                }
              }
            },
            pageLayout: {
              edit: {
                header: "Eklemek {{type}} Bağlanmak",
                primaryAction: "Yeni Öznitelik"
              }
            },
            placeholders: {
              empty: {
                subtitle: "Şu anda, yok {{type}} bu öznitelik eşleme için kullanılabilir öznitelikler.",
                title: "HAYIR {{type}} Öznitellikler"
              }
            }
          },
          list: {
            columns: {
              actions: "Hareketler",
              claimURI: "SCIM Özniteliği",
              dialectURI: "Eşlenmiş Öznitelik",
              name: "İsim"
            },
            confirmation: {
              action: "Onaylamak",
              content: "{{message}} Lütfen dikkatli ilerleyin.",
              dialect: {
                message: "Bu öznitelik eşlemesini silerseniz, ilişkili tüm {{type}} nitelikler de silinecektir.",
                name: "öznitelik eşleme"
              },
              external: {
                message: "Bu, kalıcı olarak silecek {{type}} bağlanmak.",
                name: "{{type}} bağlanmak"
              },
              header: "Emin misin?",
              hint: "Lütfen işleminizi onaylayın.",
              local: {
                message: "Bu özelliği silerseniz, bu özelliğe ait kullanıcı verileri de silinecektir.",
                name: "bağlanmak"
              },
              message: "Bu işlem geri alınamaz ve seçilenleri kalıcı olarak siler. {{name}}."
            },
            placeholders: {
              emptyList: {
                action: {
                  dialect: "Yeni {{type}} Bağlanmak",
                  external: "Yeni {{type}} Bağlanmak",
                  local: "Yeni Öznitelik"
                },
                subtitle: "Şu anda uygun sonuç yok. Oluşturma sihirbazındaki adımları izleyerek kolayca yeni bir öğe ekleyebilirsiniz.",
                title: {
                  dialect: "Öznitelik Eşlemesi Ekleme",
                  external: "ekle {{type}} Bağlanmak",
                  local: "Özellik Ekle"
                }
              },
              emptySearch: {
                action: "Arama sorgusunu temizle",
                subtitle: "için herhangi bir sonuç bulamadık {{searchQuery}}.Lütfen farklı bir arama terimi deneyin.",
                title: "Sonuç bulunamadı"
              }
            },
            warning: "Bu öznitelik, aşağıdaki kullanıcı mağazalarında bir öznitelikle eşlenmedi:"
          },
          local: {
            additionalProperties: {
              hint: "Geçerli öznitelikleri kullanarak bir uzantı yazarken kullanın",
              key: "İsim",
              keyRequiredErrorMessage: "İsim girin",
              value: "Değer",
              valueRequiredErrorMessage: "bir değer girin"
            },
            advancedSearch: {
              error: "Filtre sorgu biçimi yanlış",
              form: {
                inputs: {
                  filterAttribute: {
                    placeholder: "Örneğin. "
                  },
                  filterCondition: {
                    placeholder: "Örneğin. "
                  },
                  filterValue: {
                    placeholder: "Örneğin. "
                  }
                }
              },
              placeholder: "Ada göre ara"
            },
            attributes: {
              attributeURI: "Bağlanmak"
            },
            confirmation: {
              content: "Bu özelliği silerseniz, bu özelliğe ait kullanıcı verileri de silinecektir. ",
              header: "Emin misin?",
              hint: "Lütfen işleminizi onaylayın.",
              message: "Bu işlem geri alınamaz ve seçili özelliği kalıcı olarak siler.",
              primaryAction: "Onaylamak"
            },
            dangerZone: {
              actionTitle: "Özniteliği Sil",
              header: "Özniteliği Sil",
              subheader: "Bir özniteliği bir kez sildiğinizde geri dönüş yoktur. "
            },
            forms: {
              attribute: {
                placeholder: "Eşlenecek bir kullanıcı özelliği seçin",
                requiredErrorMessage: "Özellik adı zorunlu bir alandır"
              },
              attributeHint: "Öznitelik için benzersiz bir kimlik. ",
              attributeID: {
                label: "Öznitelik Adı",
                placeholder: "Bir özellik adı girin",
                requiredErrorMessage: "Özellik adı gerekli"
              },
              description: {
                label: "Tanım",
                placeholder: "Bir açıklama girin",
                requiredErrorMessage: "Açıklama gerekli"
              },
              descriptionHint: "Öznitelik için anlamlı bir açıklama.",
              displayOrder: {
                label: "Görüntüleme sırası",
                placeholder: "Görüntüleme sırasını girin"
              },
              displayOrderHint: "Bu, bu özniteliğin kullanıcı profilinde ve kullanıcı kayıt sayfasında görüntülendiği konumu belirler.",
              infoMessages: {
                configApplicabilityInfo: "Lütfen aşağıdaki öznitelik yapılandırmalarının yalnızca müşteri kullanıcılarının profillerini etkileyeceğini unutmayın.",
                disabledConfigInfo: "Bu talep özniteliği için harici talep eşleme bulunamadığından aşağıdaki bölümün devre dışı bırakıldığını lütfen unutmayın."
              },
              name: {
                label: "Öznitelik Görünen Ad",
                placeholder: "Görünen adı girin",
                requiredErrorMessage: "İsim gerekli",
                validationErrorMessages: {
                  invalidName: "Girdiğiniz ad, izin verilmeyen karakterler içeriyor. "
                }
              },
              nameHint: "Kullanıcı profilindeki özniteliğin görünen adı.",
              readOnly: {
                label: "Bu özniteliği kullanıcının profilinde salt okunur yapın"
              },
              readOnlyHint: "Bu seçilirse, bu özniteliğin değeri bir kullanıcı profilinde salt okunur olur. ",
              regEx: {
                label: "Düzenli ifade",
                placeholder: "Normal bir ifade girin"
              },
              regExHint: "Öznitelik giriş değerini doğrulamak için bir normal ifade kalıbı kullanın.",
              required: {
                label: "Kullanıcının profilinde bu özelliği zorunlu hale getirin"
              },
              requiredHint: "Seçilirse, kullanıcının profilde bu öznitelik için bir değer belirtmesi gerekir.",
              requiredWarning: "E-posta özniteliğinin kullanıcı profilinde görüntülenmemesi ve gerekli olmaması için kuruluşunuz için hesap doğrulamayı devre dışı bırakmanız gerekir.",
              supportedByDefault: {
                label: "Bu özelliği kullanıcının profilinde göster"
              }
            },
            mappedAttributes: {
              hint: "Bu özniteliğe eşlemek istediğiniz her bir kullanıcı deposundan özniteliği girin."
            },
            notifications: {
              addLocalClaim: {
                genericError: {
                  description: "Özellik eklenirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Öznitelik başarıyla eklendi!",
                  message: "Öznitelik başarıyla eklendi"
                }
              },
              deleteClaim: {
                genericError: {
                  description: "Öznitelik silinirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Öznitelik başarıyla silindi!",
                  message: "Öznitelik başarıyla silindi"
                }
              },
              fetchLocalClaims: {
                error: {
                  description: "{{description}}",
                  message: "alma hatası"
                },
                genericError: {
                  description: "Özellikler alınamadı.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Öznitelikler başarıyla alındı.",
                  message: "Alma başarılı"
                }
              },
              getAClaim: {
                genericError: {
                  description: "Öznitelik getirilirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                }
              },
              getClaims: {
                genericError: {
                  description: "Özellikler getirilirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                }
              },
              getLocalDialect: {
                genericError: {
                  description: "Özellikler getirilirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                }
              },
              updateClaim: {
                genericError: {
                  description: "Öznitelik güncellenirken bir hata oluştu",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Bu özellik başarıyla güncellendi!",
                  message: "Öznitelik başarıyla güncellendi"
                }
              }
            },
            pageLayout: {
              edit: {
                back: "Özellikler'e geri dön",
                description: "Özniteliği düzenle",
                tabs: {
                  additionalProperties: "Ek Özellikler",
                  general: "Genel",
                  mappedAttributes: "Eşlenen Nitelikler"
                }
              },
              local: {
                action: "Yeni Öznitelik",
                back: "Nitelikler ve Eşlemelere geri dönün",
                description: "Nitelikler oluşturma ve yönetme",
                title: "Öznitellikler"
              }
            },
            wizard: {
              header: "Öznitelik Ekle",
              steps: {
                general: "Genel",
                mapAttributes: "Harita Özellikleri",
                summary: "Özet"
              },
              summary: {
                attribute: "Bağlanmak",
                attributeURI: "Bağlanmak",
                displayOrder: "Görüntüleme sırası",
                readOnly: "Bu özellik salt okunurdur",
                regEx: "Düzenli ifade",
                required: "Bu özellik, kullanıcı kaydı sırasında gereklidir",
                supportedByDefault: "Bu özellik, kullanıcı profilinde ve kullanıcı kayıt sayfasında gösterilir.",
                userstore: "Kullanıcı Mağazası"
              }
            }
          },
          scopeMappings: {
            deletionConfirmationModal: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu talebi silerseniz, belirteçte mevcut olmayacaktır. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve kapsam talebi eşlemesini kalıcı olarak siler"
            },
            saveChangesButton: "Değişiklikleri Kaydet"
          }
        },
        emailLocale: {
          buttons: {
            addLocaleTemplate: "Yerel Ayar Şablonu Ekle",
            saveChanges: "Değişiklikleri Kaydet"
          },
          forms: {
            addLocale: {
              fields: {
                bodyEditor: {
                  label: "Vücut",
                  validations: {
                    empty: "E-posta gövdesi boş olamaz."
                  }
                },
                locale: {
                  label: "yerel ayar",
                  placeholder: "Yerel Ayarı Seçin",
                  validations: {
                    empty: "yerel ayarı seçin"
                  }
                },
                signatureEditor: {
                  label: "Posta imzası",
                  validations: {
                    empty: "E-posta imzası boş olamaz."
                  }
                },
                subject: {
                  label: "Ders",
                  placeholder: "E-posta konunuzu girin",
                  validations: {
                    empty: "E-posta Konusu gerekli"
                  }
                }
              }
            }
          }
        },
        emailTemplateTypes: {
          advancedSearch: {
            error: "Filtre sorgu biçimi yanlış",
            form: {
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Örneğin. "
                }
              }
            },
            placeholder: "E-posta şablonu türüne göre ara"
          },
          buttons: {
            createTemplateType: "Şablon Türü Oluştur",
            deleteTemplate: "Şablonu Sil",
            editTemplate: "Şablonu Düzenle",
            newType: "Yeni Şablon Türü"
          },
          confirmations: {
            deleteTemplateType: {
              assertionHint: "Lütfen yazın <1>{{ id }}</1> onaylamak.",
              content: "Bu e-posta şablonu türünü silerseniz, ilişkili tüm iş akışlarının artık çalışacak geçerli bir e-posta şablonu olmayacak ve bu, bu şablon türüyle ilişkili tüm yerel ayar şablonlarını silecektir. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve seçilen e-posta şablonu türünü kalıcı olarak siler."
            }
          },
          forms: {
            addTemplateType: {
              fields: {
                type: {
                  label: "Şablon Türü Adı",
                  placeholder: "Bir şablon türü adı girin",
                  validations: {
                    empty: "Devam etmek için şablon türü adı gereklidir."
                  }
                }
              }
            }
          },
          list: {
            actions: "Hareketler",
            name: "İsim"
          },
          notifications: {
            createTemplateType: {
              error: {
                description: "{{description}}",
                message: "E-posta şablonu türü oluşturulurken hata oluştu."
              },
              genericError: {
                description: "E-posta şablonu türü oluşturulamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "E-posta şablonu türü başarıyla oluşturuldu.",
                message: "E-posta şablonu türü oluşturma başarılı"
              }
            },
            deleteTemplateType: {
              error: {
                description: "{{description}}",
                message: "E-posta şablon türü silinirken hata oluştu."
              },
              genericError: {
                description: "E-posta şablonu türü silinemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "E-posta şablonu türü başarıyla silindi.",
                message: "E-posta şablon türü silme işlemi başarılı"
              }
            },
            getTemplateTypes: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "E-posta şablonu türleri alınamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "E-posta şablonu türleri başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            updateTemplateType: {
              error: {
                description: "{{description}}",
                message: "E-posta şablonu türü güncellenirken hata oluştu."
              },
              genericError: {
                description: "E-posta şablonu türü güncellenemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "E-posta şablonu türü başarıyla güncellendi.",
                message: "E-posta şablonu türü güncellemesi başarılı"
              }
            }
          },
          placeholders: {
            emptyList: {
              action: "Yeni Şablon Türü",
              subtitles: {
                "0": "Şu anda kullanılabilir şablon türü yok.",
                "1": "Şuna göre yeni bir şablon türü ekleyebilirsiniz: ",
                "2": "aşağıdaki düğmeye tıklayın."
              },
              title: "Yeni Şablon Türü ekle"
            },
            emptySearch: {
              action: "Arama sorgusunu temizle",
              subtitles: "için herhangi bir sonuç bulamadık {{searchQuery}}. ",
              title: "Sonuç bulunamadı"
            }
          },
          wizards: {
            addTemplateType: {
              heading: "E-posta Şablonu Türü Oluşturun",
              steps: {
                templateType: {
                  heading: "Şablon Türü"
                }
              },
              subHeading: "E-posta gereksinimleriyle ilişkilendirmek için yeni bir şablon türü oluşturun."
            }
          }
        },
        emailTemplates: {
          buttons: {
            deleteTemplate: "Şablonu Sil",
            editTemplate: "Şablonu Düzenle",
            newTemplate: "Yeni şablon",
            viewTemplate: "Şablonu Görüntüle"
          },
          confirmations: {
            deleteTemplate: {
              assertionHint: "Lütfen yazın <1>{{ id }}</1> onaylamak.",
              content: "Bu e-posta şablonunu silerseniz, ilişkili tüm iş akışlarının artık üzerinde çalışılacak geçerli bir e-posta şablonu olmayacaktır. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve seçilen e-posta şablonunu kalıcı olarak siler."
            }
          },
          editor: {
            tabs: {
              code: {
                tabName: "HTML Kodu"
              },
              preview: {
                tabName: "Ön izleme"
              }
            }
          },
          list: {
            actions: "Hareketler",
            name: "İsim"
          },
          notifications: {
            createTemplate: {
              error: {
                description: "{{description}}",
                message: "E-posta şablonu oluşturulurken hata oluştu."
              },
              genericError: {
                description: "E-posta şablonu oluşturulamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "E-posta şablonu başarıyla oluşturuldu.",
                message: "E-posta şablonu oluşturma başarılı"
              }
            },
            deleteTemplate: {
              error: {
                description: "{{description}}",
                message: "E-posta şablonu silinirken hata oluştu."
              },
              genericError: {
                description: "E-posta şablonu silinemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "E-posta şablonu başarıyla silindi.",
                message: "E-posta şablonu silme işlemi başarılı"
              }
            },
            getTemplateDetails: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "E-posta şablonu ayrıntıları alınamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "E-posta şablonu ayrıntıları başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            getTemplates: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "E-posta şablonları alınamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "E-posta şablonları başarıyla alındı.",
                message: "Alma başarılı"
              }
            },
            iframeUnsupported: {
              genericError: {
                description: "Tarayıcınız iframe'leri desteklemiyor.",
                message: "desteklenmiyor"
              }
            },
            updateTemplate: {
              error: {
                description: "{{description}}",
                message: "E-posta şablonu güncellenirken hata oluştu."
              },
              genericError: {
                description: "E-posta şablonu güncellenemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "E-posta şablonu başarıyla güncellendi.",
                message: "E-posta şablonu güncellemesi başarılı"
              }
            }
          },
          placeholders: {
            emptyList: {
              action: "Yeni şablon",
              subtitles: {
                "0": "Seçilenler için kullanılabilir şablon yok",
                "1": "şu anda e-posta şablonu türü.  ",
                "2": "aşağıdaki düğmeye tıklayın."
              },
              title: "Şablon Ekle"
            }
          },
          viewTemplate: {
            heading: "E-posta Şablonu Önizlemesi"
          }
        },
        footer: {
          copyright: "Elveriş Kimlik Sunucusu © {{year}}"
        },
        governanceConnectors: {
          categories: "Kategoriler",
          connectorSubHeading: "Yapılandır {{ name }} ayarlar.",
          connectorCategories: {
            passwordPolicies: {
              name: "Şifre Politikaları",
              connectors: {
                passwordHistory: {
                  friendlyName: "Şifre Geçmişi",
                  properties: {
                    passwordHistoryEnable: {
                      hint: "Kullanıcının daha önce kullandığı şifreleri kullanmasına izin verilmeyecektir.",
                      label: "Parola geçmişini doğrula"
                    },
                    passwordHistoryCount: {
                      hint: "Parola güncellemesi sırasında bu son kullanılan parola sayısını kısıtlayın.",
                      label: "Parola geçmişi doğrulama sayısı"
                    }
                  }
                },
                passwordPolicy: {
                  friendlyName: "Şifre Kalıpları",
                  properties: {
                    passwordPolicyEnable: {
                      hint: "Kullanıcı parolalarını bir ilkeye göre doğrulama",
                      label: "Bir ilke modeline göre parolaları doğrulayın"
                    },
                    passwordPolicyMinLength: {
                      hint: "Paroladaki minimum karakter sayısı.",
                      label: "Minimum karakter sayısı"
                    },
                    passwordPolicyMaxLength: {
                      hint: "Paroladaki maksimum karakter sayısı.",
                      label: "Maksimum karakter sayısı"
                    },
                    passwordPolicyPattern: {
                      hint: "Parolayı doğrulamak için normal ifade modeli.",
                      label: "Şifre kalıbı normal ifadesi"
                    },
                    passwordPolicyErrorMsg: {
                      hint: "Bu hata mesajı, bir model ihlali algılandığında görüntülenecektir.",
                      label: "Kalıp ihlaliyle ilgili hata mesajı"
                    }
                  }
                }
              }
            },
            userOnboarding: {
              name: "Kullanıcı Katılımı",
              connectors: {
                selfSignUp: {
                  friendlyName: "Kendi Kendine Kayıt",
                  properties: {
                    selfRegistrationEnable: {
                      hint: "Kullanıcının sisteme kendi kendine kayıt olmasına izin ver.",
                      label: "Kullanıcı kendi kendine kayıt"
                    },
                    selfRegistrationLockOnCreation: {
                      hint: "E-posta doğrulamasına kadar kendi kayıtlı kullanıcı hesabını kilitleyin.",
                      label: "Oluşturma sırasında kullanıcı hesabını kilitle"
                    },
                    selfRegistrationSendConfirmationOnCreation: {
                      hint: "Kullanıcı hesabı oluşturma sırasında kilitli olmadığında kullanıcı hesabı onayını etkinleştirin",
                      label: "Oluşturma Sırasında Hesap Onayını Etkinleştir"
                    },
                    selfRegistrationNotificationInternallyManage: {
                      hint: "İstemci uygulaması bildirim göndermeyi işliyorsa devre dışı bırakın",
                      label: "Dahili olarak gönderilen bildirimleri yönetin"
                    },
                    selfRegistrationReCaptcha: {
                      hint: "Kendi kendine kayıt sırasında reCaptcha doğrulamasını etkinleştirin.",
                      label: "reCaptcha'yı sor"
                    },
                    selfRegistrationVerificationCodeExpiryTime: {
                      hint: "Doğrulama bağlantısı için bitiş süresini dakika cinsinden belirtin.",
                      label: "Kullanıcı kendi kendine kayıt doğrulama bağlantısının geçerlilik süresi"
                    },
                    selfRegistrationVerificationCodeSmsotpExpiryTime: {
                      hint: "SMS OTP için bitiş süresini dakika cinsinden belirtin.",
                      label: "Kullanıcı kendi kendine kayıt SMS OTP sona erme süresi"
                    },
                    selfRegistrationSmsotpRegex: {
                      hint: "[izin verilen karakterler]{uzunluk} biçiminde SMS OTP için normal ifade. ",
                      label: "Kullanıcı kendi kendine kayıt SMS OTP normal ifade"
                    },
                    selfRegistrationCallbackRegex: {
                      hint: "Bu önek, geri arama URL'sini doğrulamak için kullanılacaktır.",
                      label: "Kullanıcı kendi kendine kayıt geri arama URL'si normal ifade"
                    },
                    urlListPurposeSelfSignUp: {
                      hint: "Kendi Kendine Kayıt olma amaçlarını yönetmek için burayı tıklayın",
                      label: "Kendi Kendine Kaydolma amaçlarını yönetme"
                    },
                    selfRegistrationNotifyAccountConfirmation: {
                      hint: "Kendi kendine kayıt onayı için bildirim göndermeyi etkinleştirin.",
                      label: "Kayıt onayı e-postası gönder"
                    },
                    selfRegistrationResendConfirmationReCaptcha: {
                      hint: "Yeniden gönderme onayı için reCaptcha doğrulamasını sor",
                      label: "Yeniden gönderme onayında reCaptcha'yı sor"
                    },
                    selfRegistrationAutoLoginEnable: {
                      hint: "Kullanıcı, Hesap Onayını tamamladıktan sonra otomatik olarak oturum açacaktır.",
                      label: "Hesap Onayından Sonra Otomatik Oturum Açmayı Etkinleştir"
                    },
                    selfRegistrationAutoLoginAliasName: {
                      hint: "Tanımlama bilgisine oturum açmak için kullanılan anahtarın takma adı. ",
                      label: "Tanımlama bilgisine oturum açmak için kullanılan anahtarın takma adı"
                    }
                  }
                },
                liteUserSignUp: {
                  friendlyName: "Basit Kullanıcı Kaydı",
                  properties: {
                    liteRegistrationEnable: {
                      hint: "Kullanıcının sisteme parola olmadan kendi kendine kaydolmasına izin ver.",
                      label: "Basit kullanıcı kaydı"
                    },
                    liteRegistrationLockOnCreation: {
                      hint: "E-posta doğrulamasına kadar kendi kayıtlı kullanıcı hesabını kilitleyin.",
                      label: "Oluşturma sırasında kullanıcı hesabını kilitle"
                    },
                    liteRegistrationNotificationInternallyManage: {
                      hint: "İstemci uygulaması bildirim göndermeyi işliyorsa devre dışı bırakın",
                      label: "Dahili olarak gönderilen bildirimleri yönetin"
                    },
                    liteRegistrationReCaptcha: {
                      hint: "Kendi kendine kayıt sırasında reCaptcha doğrulamasını etkinleştirin.",
                      label: "reCaptcha'yı sor"
                    },
                    liteRegistrationVerificationCodeExpiryTime: {
                      hint: "Doğrulama bağlantısı için bitiş süresini dakika cinsinden belirtin.",
                      label: "Lite kullanıcı kaydı doğrulama bağlantısının geçerlilik süresi"
                    },
                    liteRegistrationVerificationCodeSmsotpExpiryTime: {
                      hint: "SMS OTP için bitiş süresini dakika cinsinden belirtin.",
                      label: "Lite kullanıcı kaydı SMS OTP bitiş süresi"
                    },
                    liteRegistrationSmsotpRegex: {
                      hint: "[izin verilen karakterler]{uzunluk} biçiminde SMS OTP için normal ifade. ",
                      label: "Lite kullanıcı kaydı SMS OTP normal ifade"
                    },
                    liteRegistrationCallbackRegex: {
                      hint: "Bu önek, geri arama URL'sini doğrulamak için kullanılacaktır.",
                      label: "Lite kullanıcı kaydı geri arama URL'si normal ifade"
                    },
                    urlListPurposeLiteUserSignUp: {
                      hint: "Lite-Kaydolma amaçlarını yönetmek için burayı tıklayın",
                      label: "Lite-Kaydolma amaçlarını yönetin"
                    }
                  }
                },
                userEmailVerification: {
                  friendlyName: "Şifre Sor",
                  properties: {
                    emailVerificationEnable: {
                      hint: "Kullanıcı oluşturma sırasında bir doğrulama bildirimi tetiklenecektir.",
                      label: "Kullanıcı e-posta doğrulamasını etkinleştir"
                    },
                    emailVerificationLockOnCreation: {
                      hint: "Kullanıcı hesabı, kullanıcı oluşturma sırasında kilitlenecektir.",
                      label: "Oluşturma sırasında hesap kilidini etkinleştir"
                    },
                    emailVerificationNotificationInternallyManage: {
                      hint: "İstemci uygulaması bildirim göndermeyi işliyorsa devre dışı bırakın.",
                      label: "Dahili olarak gönderilen bildirimleri yönetin"
                    },
                    emailVerificationExpiryTime: {
                      hint: "Doğrulama e-postasının geçerli olacağı süreyi dakika olarak ayarlayın. ",
                      label: "E-posta doğrulama kodunun geçerlilik süresi"
                    },
                    emailVerificationAskPasswordExpiryTime: {
                      hint: "Parola sor e-postasının geçerli olacağı süreyi dakika olarak ayarlayın. ",
                      label: "Parola kodunun geçerlilik süresinin sona ermesini isteyin"
                    },
                    emailVerificationAskPasswordPasswordGenerator: {
                      hint: "Parola sorma özelliğinde geçici parola oluşturma uzantısı noktası.",
                      label: "Geçici parola oluşturma uzantısı sınıfı"
                    },
                    urlListPurposeJitProvisioning: {
                      hint: "Tam zamanında provizyon amaçlarını yönetmek için burayı tıklayın.",
                      label: "JIT provizyon amaçlarını yönetin"
                    }
                  }
                }
              }
            },
            loginAttemptsSecurity: {
              name: "Oturum Açma Girişimleri Güvenliği",
              connectors: {
                accountLockHandler: {
                  friendlyName: "Hesap Kilidi",
                  properties: {
                    accountLockHandlerLockOnMaxFailedAttemptsEnable: {
                      hint: "Başarısız giriş denemelerinde kullanıcı hesaplarını kilitleyin",
                      label: "Maksimum başarısız denemede kullanıcı hesaplarını kilitle"
                    },
                    accountLockHandlerOnFailureMaxAttempts: {
                      hint: "Hesap kilitlenene kadar izin verilen başarısız giriş denemelerinin sayısı.",
                      label: "Maksimum başarısız giriş denemesi"
                    },
                    accountLockHandlerTime: {
                      hint: "Dakika cinsinden ilk hesap kilitleme süresi. ",
                      label: "İlk hesap kilitleme süresi"
                    },
                    accountLockHandlerLoginFailTimeoutRatio: {
                      hint: "Hesap kilitleme süresi bu faktör kadar artacaktır. ",
                      label: "Hesap kilitleme süresi artış faktörü"
                    },
                    accountLockHandlerNotificationManageInternally: {
                      hint: "İstemci uygulaması bildirim göndermeyi işliyorsa devre dışı bırakın",
                      label: "Bildirim gönderimini dahili olarak yönetin"
                    },
                    accountLockHandlerNotificationNotifyOnLockIncrement: {
                      hint: "Sürekli başarısız giriş denemeleri nedeniyle hesap kilitleme süresi arttığında kullanıcıyı bilgilendirin.",
                      label: "Kilit süresi arttığında kullanıcıyı bilgilendir"
                    }
                  }
                },
                ssoLoginRecaptcha: {
                  friendlyName: "TOA Girişi için reCaptcha",
                  properties: {
                    ssoLoginRecaptchaEnableAlways: {
                      hint: "SSO oturum açma akışı sırasında her zaman reCaptcha doğrulamasını isteyin.",
                      label: "Her zaman reCaptcha'yı sor"
                    },
                    ssoLoginRecaptchaEnable: {
                      hint: "SSO oturum açma akışı sırasında reCaptcha doğrulamasını yalnızca maksimum başarısız deneme sayısı aşıldıktan sonra isteyin.",
                      label: "Maksimum başarısız denemeden sonra reCaptcha'yı sor"
                    },
                    ssoLoginRecaptchaOnMaxFailedAttempts: {
                      hint: "ReCaptcha doğrulaması sorulmadan izin verilen başarısız deneme sayısı.",
                      label: "reCaptcha için maksimum başarısız deneme"
                    }
                  }
                }
              }
            },
            accountManagement: {
              name: "Hesap Yönetimi",
              connectors: {
                suspensionNotification: {
                  friendlyName: "Boşta Hesap Askıya Alma",
                  properties: {
                    suspensionNotificationEnable: {
                      hint: "Belirli bir boşta kalma süresinden sonra kullanıcı hesabını kilitleyin.",
                      label: "Boştaki kullanıcı hesaplarını askıya alın"
                    },
                    suspensionNotificationAccountDisableDelay: {
                      hint: "Kullanıcı hesabının kilitlenmesinden önceki gün cinsinden süre.",
                      label: "Gün cinsinden izin verilen boşta kalma süresi"
                    },
                    suspensionNotificationDelays: {
                      hint: "Her dönemden sonra hesabı kilitlemeden önce kullanıcılara uyarı uyarıları gönderin. ",
                      label: "Gün cinsinden uyarı gönderme zaman dilimleri"
                    }
                  }
                },
                accountDisableHandler: {
                  friendlyName: "Hesap Devre Dışı Bırakma",
                  properties: {
                    accountDisableHandlerEnable: {
                      hint: "Bir yönetici kullanıcının kullanıcı hesaplarını devre dışı bırakmasına izin ver",
                      label: "Hesap devre dışı bırakmayı etkinleştir"
                    },
                    accountDisableHandlerNotificationManageInternally: {
                      hint: "İstemci uygulaması bildirim göndermeyi yönetiyorsa devre dışı bırakın",
                      label: "Bildirim gönderimini dahili olarak yönetin"
                    }
                  }
                },
                multiattributeLoginHandler: {
                  friendlyName: "Çoklu Öznitelik Girişi",
                  properties: {
                    accountMultiattributeloginHandlerEnable: {
                      hint: "Giriş tanımlayıcısı olarak birden çok öznitelik kullanmayı etkinleştir",
                      label: "Çoklu Nitelikli Oturum Açmayı Etkinleştir"
                    },
                    accountMultiattributeloginHandlerAllowedattributes: {
                      hint: "Virgülle ayrılmış izin verilen talep listesi",
                      label: "İzin Verilen Öznitelik Talep Listesi"
                    }
                  }
                },
                accountRecovery: {
                  friendlyName: "Hesap Yönetimi",
                  properties: {
                    recoveryNotificationPasswordEnable: {
                      label: "Bildirim tabanlı şifre kurtarma"
                    },
                    recoveryReCaptchaPasswordEnable: {
                      label: "Şifre kurtarma için reCaptcha'yı etkinleştirin"
                    },
                    recoveryQuestionPasswordEnable: {
                      label: "Güvenlik sorusu tabanlı şifre kurtarma"
                    },
                    recoveryQuestionPasswordMinAnswers: {
                      label: "Parola kurtarma için gereken soru sayısı"
                    },
                    recoveryQuestionAnswerRegex: {
                      hint: "Güvenlik sorusu yanıt normal ifadesi",
                      label: "Güvenlik sorusu yanıt normal ifadesi"
                    },
                    recoveryQuestionAnswerUniqueness: {
                      hint: "Güvenlik sorusu yanıt benzersizliğini zorunlu kılın",
                      label: "Güvenlik sorusu yanıt benzersizliğini zorunlu kılın"
                    },
                    recoveryQuestionPasswordReCaptchaEnable: {
                      hint: "Güvenlik sorusuna dayalı parola kurtarma için reCaptcha'yı isteyin",
                      label: "Güvenlik sorularına dayalı parola kurtarma için reCaptcha'yı etkinleştirin"
                    },
                    recoveryQuestionPasswordReCaptchaMaxFailedAttempts: {
                      label: "reCaptcha için maksimum başarısız deneme"
                    },
                    recoveryNotificationUsernameEnable: {
                      label: "kullanıcı adı kurtarma"
                    },
                    recoveryReCaptchaUsernameEnable: {
                      label: "Kullanıcı adı kurtarma için reCaptcha'yı etkinleştirin"
                    },
                    recoveryNotificationInternallyManage: {
                      hint: "İstemci uygulaması bildirim göndermeyi işliyorsa devre dışı bırakın",
                      label: "Dahili olarak gönderilen bildirimleri yönetin"
                    },
                    recoveryNotifySuccess: {
                      label: "Kurtarma başarılı olduğunda bildir"
                    },
                    recoveryQuestionPasswordNotifyStart: {
                      label: "Güvenlik sorularına dayalı kurtarma başladığında bildir"
                    },
                    recoveryExpiryTime: {
                      label: "Dakika cinsinden kurtarma bağlantısı sona erme süresi"
                    },
                    recoveryNotificationPasswordExpiryTimeSmsOtp: {
                      hint: "Şifre kurtarma için SMS OTP kodunun sona erme süresi",
                      label: "SMS OTP geçerlilik süresi"
                    },
                    recoveryNotificationPasswordSmsOtpRegex: {
                      hint: "[izin verilen karakterler]{uzunluk} biçiminde SMS OTP için normal ifade. ",
                      label: "SMS OTP normal ifadesi"
                    },
                    recoveryQuestionPasswordForcedEnable: {
                      hint: "Kullanıcıları oturum açma sırasında güvenlik sorularına yanıt vermeye zorlayın",
                      label: "Zorunlu güvenlik sorularını etkinleştir"
                    },
                    recoveryQuestionMinQuestionsToAnswer: {
                      hint: "Kullanıcı bu değerden daha azını yanıtlamışsa, kullanıcıları oturum açma sırasında güvenlik sorularına yanıt vermeye zorla",
                      label: "Yanıtlanması gereken minimum zorunlu güvenlik sorusu sayısı"
                    },
                    recoveryCallbackRegex: {
                      hint: "Kurtarma geri arama URL'si normal ifadesi",
                      label: "Kurtarma geri arama URL'si normal ifadesi"
                    },
                    recoveryAutoLoginEnable: {
                      hint: "Parola Sıfırlama sihirbazını tamamladıktan sonra kullanıcı otomatik olarak oturum açacaktır.",
                      label: "Parola Sıfırlamadan Sonra Otomatik Oturum Açmayı Etkinleştir"
                    }
                  }
                },
                adminForcedPasswordReset: {
                  friendlyName: "Parola sıfırlama",
                  properties: {
                    recoveryAdminPasswordResetRecoveryLink: {
                      hint: "Kullanıcı, parolayı sıfırlamak için bir bağlantıyla bilgilendirilir",
                      label: "Kurtarma e-postası yoluyla parola sıfırlamayı etkinleştir"
                    },
                    recoveryAdminPasswordResetOtp: {
                      hint: "Kullanıcı, SSO oturum açmayı denemek için tek seferlik bir şifreyle bilgilendirilir",
                      label: "OTP aracılığıyla şifre sıfırlamayı etkinleştir"
                    },
                    recoveryAdminPasswordResetOffline: {
                      hint: "Kullanıcı taleplerinde oluşturulan ve depolanan bir OTP",
                      label: "Çevrimdışı parola sıfırlamayı etkinleştir"
                    },
                    recoveryAdminPasswordResetExpiryTime: {
                      hint: "Yönetici zorunlu parola sıfırlama kodunun dakika cinsinden geçerlilik süresi",
                      label: "Yönetici zorunlu parola sıfırlama kodu süre sonu"
                    }
                  }
                }
              }
            },
            otherSettings: {
              name: "Diğer ayarlar",
              connectors: {
                piiController: {
                  friendlyName: "Rıza Bilgileri Denetleyicisi",
                  properties: {
                    piiController: {
                      hint: "Verileri toplayan ilk Denetleyicinin adı",
                      label: "Denetleyici Adı"
                    },
                    contact: {
                      hint: "Denetleyicinin ilgili kişi adı",
                      label: "Kişi Adı"
                    },
                    email: {
                      hint: "Denetleyicinin iletişim e-posta adresi",
                      label: "E-posta Adresi"
                    },
                    phone: {
                      hint: "Denetleyicinin iletişim telefon numarası",
                      label: "Telefon numarası"
                    },
                    onBehalf: {
                      hint: "Bir Denetleyici veya PII İşleyici adına hareket eden bir kullanıcı bilgisi (PII) İşleyicisi",
                      label: "Adına"
                    },
                    piiControllerUrl: {
                      hint: "Denetleyici ile iletişim kurmak için bir URL",
                      label: "url"
                    },
                    addressCountry: {
                      hint: "Kontrolörün Ülkesi",
                      label: "Ülke"
                    },
                    addressLocality: {
                      hint: "Denetleyicinin bulunduğu yer",
                      label: "yerellik"
                    },
                    addressRegion: {
                      hint: "Denetleyici Bölgesi",
                      label: "Bölge"
                    },
                    postOfficeBoxNumber: {
                      hint: "Denetleyicinin Posta Kutusu Numarası",
                      label: "Posta Kutusu Numarası"
                    },
                    postalCode: {
                      hint: "Denetleyicinin Posta Kodu",
                      label: "Posta Kodu"
                    },
                    streetAddress: {
                      hint: "Denetleyicinin Sokak Adresi",
                      label: "Açık adres"
                    }
                  }
                },
                analyticsEngine: {
                  friendlyName: "[Kullanımdan kaldırıldı] Kimlik Sunucusu Analitiği",
                  messages: {
                    deprecation: {
                      description: "Elveriş Kimlik Sunucusu Analizi artık kullanımdan kaldırılmıştır.  <1>ELK Analizi</1> yerine.",
                      heading: "Kullanımdan kaldırıldı"
                    }
                  },
                  properties: {
                    adaptiveAuthenticationAnalyticsReceiver: {
                      hint: "Hedef Ana Bilgisayar",
                      label: "Hedef Ana Bilgisayar"
                    },
                    adaptiveAuthenticationAnalyticsBasicAuthEnabled: {
                      hint: "Temel Kimlik Doğrulamayı Etkinleştir",
                      label: "Temel Kimlik Doğrulamayı Etkinleştir"
                    },
                    adaptiveAuthenticationAnalyticsBasicAuthUsername: {
                      hint: "Hedef Ana Bilgisayar Güvenli Kullanıcı Kimliği",
                      label: "Kullanıcı kimliği"
                    },
                    secretAdaptiveAuthenticationAnalyticsBasicAuthPassword: {
                      hint: "Hedef Ana Bilgisayar Güvenli Sır",
                      label: "Gizli"
                    },
                    adaptiveAuthenticationAnalyticsHttpConnectionTimeout: {
                      hint: "Milisaniye cinsinden HTTP Bağlantısı Zaman Aşımı",
                      label: "HTTP Bağlantı Zaman Aşımı"
                    },
                    adaptiveAuthenticationAnalyticsHttpReadTimeout: {
                      hint: "Milisaniye cinsinden HTTP Okuma Zaman Aşımı",
                      label: "HTTP Okuma Zaman Aşımı"
                    },
                    adaptiveAuthenticationAnalyticsHttpConnectionRequestTimeout: {
                      hint: "Milisaniye cinsinden HTTP Bağlantı İsteği Zaman Aşımı",
                      label: "HTTP Bağlantı İsteği Zaman Aşımı"
                    },
                    adaptiveAuthenticationAnalyticsHostnameVerfier: {
                      hint: "Ana bilgisayar adı doğrulaması. ",
                      label: "Ana bilgisayar adı doğrulaması"
                    }
                  }
                },
                elasticAnalyticsEngine: {
                  friendlyName: "ELK Analizi",
                  properties: {
                    adaptiveAuthenticationElasticReceiver: {
                      hint: "Elasticsearch Sunucusu",
                      label: "Elasticsearch Sunucusu"
                    },
                    adaptiveAuthenticationElasticBasicAuthEnabled: {
                      hint: "Temel Kimlik Doğrulamayı Etkinleştir",
                      label: "Temel Kimlik Doğrulamayı Etkinleştir"
                    },
                    adaptiveAuthenticationElasticBasicAuthUsername: {
                      hint: "Elasticsearch Kullanıcı Adı",
                      label: "Elasticsearch Kullanıcı Adı"
                    },
                    secretAdaptiveAuthenticationElasticBasicAuthPassword: {
                      hint: "Elasticsearch Kullanıcı Şifresi",
                      label: "Elasticsearch Şifresi"
                    },
                    adaptiveAuthenticationElasticHttpConnectionTimeout: {
                      hint: "Milisaniye cinsinden HTTP Bağlantısı Zaman Aşımı",
                      label: "HTTP Bağlantı Zaman Aşımı"
                    },
                    adaptiveAuthenticationElasticHttpReadTimeout: {
                      hint: "Milisaniye cinsinden HTTP Okuma Zaman Aşımı",
                      label: "HTTP Okuma Zaman Aşımı"
                    },
                    adaptiveAuthenticationElasticHttpConnectionRequestTimeout: {
                      hint: "Milisaniye cinsinden HTTP Bağlantı İsteği Zaman Aşımı",
                      label: "HTTP Bağlantı İsteği Zaman Aşımı"
                    },
                    adaptiveAuthenticationElasticHostnameVerfier: {
                      hint: "Ana bilgisayar adı doğrulaması. ",
                      label: "Ana bilgisayar adı doğrulaması"
                    }
                  }
                },
                userClaimUpdate: {
                  friendlyName: "Kullanıcı Talebi Güncellemesi",
                  properties: {
                    userClaimUpdateEmailEnableVerification: {
                      hint: "Kullanıcının e-posta adresi güncellendiğinde bir doğrulama bildirimi tetikleyin.",
                      label: "Güncellemede kullanıcı e-posta doğrulamasını etkinleştir"
                    },
                    userClaimUpdateEmailVerificationCodeExpiryTime: {
                      hint: "E-posta onay bağlantısının dakika cinsinden geçerlilik süresi.",
                      label: "Güncelleme bağlantısı sona erme süresinde e-posta doğrulaması"
                    },
                    userClaimUpdateEmailEnableNotification: {
                      hint: "Kullanıcı mevcut e-posta adresini güncellemeye çalıştığında mevcut e-posta adresine bir bildirim tetikleyin.",
                      label: "Güncellemede kullanıcı e-posta bildirimini etkinleştir"
                    },
                    userClaimUpdateMobileNumberEnableVerification: {
                      hint: "Kullanıcının cep telefonu numarası güncellendiğinde bir doğrulama SMS OTP'sini tetikleyin.",
                      label: "Güncellemede kullanıcı cep telefonu numarası doğrulamasını etkinleştir"
                    },
                    userClaimUpdateMobileNumberVerificationCodeExpiryTime: {
                      hint: "Cep telefonu numarası doğrulama OTP'sinin dakika cinsinden geçerlilik süresi.",
                      label: "SMS OTP sona erme süresi güncellemesinde cep telefonu numarası doğrulaması"
                    },
                    userClaimUpdateMobileNumberEnableVerificationByPrivilegedUser: {
                      hint: "Ayrıcalıklı kullanıcıların güncelleme sırasında cep telefonu numarası doğrulamasını başlatmasına izin ver.",
                      label: "Ayrıcalıklı kullanıcılar tarafından cep telefonu numarası doğrulamasını etkinleştirin"
                    }
                  }
                }
              }
            },
            multiFactorAuthenticators: {
              name: "Çok Faktörlü Kimlik Doğrulayıcılar",
              connectors: {
                backupCodeAuthenticator: {
                  friendlyName: "Yedek Kod Doğrulayıcı",
                  properties: {
                    backupCodeBackupCodeLength: {
                      hint: "Yedek kodun uzunluğu",
                      label: "Yedek kod uzunluğu"
                    },
                    backupCodeBackupCodeSize: {
                      hint: "Maksimum yedek kod sayısı",
                      label: "Yedek kod boyutu"
                    }
                  }
                }
              }
            }
          },
          disabled: "Engelli",
          enabled: "Etkinleştirilmiş",
          form: {
            errors: {
              format: "Biçim yanlış.",
              positiveIntegers: "Sayı 0'dan küçük olmamalıdır."
            }
          },
          notifications: {
            getConnector: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Yönetişim bağlayıcısı alınırken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "",
                message: ""
              }
            },
            getConnectorCategories: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Yönetişim bağlayıcı kategorileri alınırken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "",
                message: ""
              }
            },
            updateConnector: {
              error: {
                description: "{{ description }}",
                message: "Güncelleme Hatası"
              },
              genericError: {
                description: "Yönetişim bağlayıcısı güncellenirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "{{ name }} Bağlayıcı başarıyla güncellendi.",
                message: "Güncelleme Başarılı."
              }
            }
          },
          pageSubHeading: "Yapılandırın ve yönetin {{ name }}."
        },
        groups: {
          advancedSearch: {
            form: {
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "Grup adına göre ara"
          },
          edit: {
            basics: {
              fields: {
                groupName: {
                  name: "Grup ismi",
                  placeholder: "Grup adını girin",
                  required: "Grup adı gerekli"
                }
              }
            },
            roles: {
              addRolesModal: {
                heading: "Grup Rollerini Güncelle",
                subHeading: "Yeni roller ekleyin veya gruba atanan mevcut rolleri kaldırın."
              },
              subHeading: "Bu grubun atandığı rolleri ekleyin veya kaldırın ve bunun belirli görevleri gerçekleştirmeyi etkileyeceğini unutmayın."
            }
          },
          list: {
            columns: {
              actions: "Hareketler",
              lastModified: "Değiştirilen Zaman",
              name: "Grup",
              source: "Kullanıcı Mağazası"
            },
            storeOptions: "Kullanıcı Mağazasını Seçin"
          },
          notifications: {
            createGroup: {
              error: {
                description: "{{description}}",
                message: "Grup oluşturulurken hata oluştu."
              },
              genericError: {
                description: "Grup oluşturulamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Grup başarıyla oluşturuldu.",
                message: "Grup başarıyla oluşturuldu."
              }
            },
            createPermission: {
              error: {
                description: "{{description}}",
                message: "Gruba izin eklenirken hata oluştu."
              },
              genericError: {
                description: "Gruba izinler eklenemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "İzinler gruba başarıyla eklendi.",
                message: "Grup başarıyla oluşturuldu."
              }
            },
            deleteGroup: {
              error: {
                description: "{{description}}",
                message: "Seçilen grup silinirken hata oluştu."
              },
              genericError: {
                description: "Seçilen grup kaldırılamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Seçilen grup başarıyla silindi.",
                message: "Grup başarıyla silindi"
              }
            },
            fetchGroups: {
              genericError: {
                description: "Gruplar getirilirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              }
            },
            updateGroup: {
              error: {
                description: "{{description}}",
                message: "Seçilen grup güncellenirken hata oluştu."
              },
              genericError: {
                description: "Seçilen grup güncellenemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Seçilen grup başarıyla güncellendi.",
                message: "Grup başarıyla güncellendi"
              }
            }
          },
          placeholders: {
            groupsError: {
              subtitles: [
                "Kullanıcı deposundan gruplar getirilmeye çalışılırken bir hata oluştu.",
                "Lütfen kullanıcı deposunun bağlantı detaylarının doğru olduğundan emin olun."
              ],
              title: "Kullanıcı deposundan gruplar getirilemedi"
            }
          }
        },
        header: {
          links: {
            devPortalNav: "Geliştirici Portalı",
            userPortalNav: "Hesabım"
          }
        },
        helpPanel: {
          notifications: {
            pin: {
              success: {
                description: "Yardım paneli her zaman görünecek {{state}} açıkça değiştirmediğiniz sürece.",
                message: "yardım paneli {{state}}"
              }
            }
          }
        },
        invite: {
          advancedSearch: {
            form: {
              dropdown: {
                filterAttributeOptions: {
                  email: "E-posta",
                  username: "Kullanıcı adı"
                }
              },
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "E-posta ile Ara"
          },
          confirmationModal: {
            deleteInvite: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu daveti iptal ederseniz, kullanıcı kuruluşunuza katılamaz. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve daveti kalıcı olarak iptal eder."
            },
            resendInvite: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Davetiyeyi yeniden gönderirseniz önceki davet bağlantısı iptal edilir. ",
              header: "Emin misin?",
              message: "Bu işlem, önceki daveti kalıcı olarak iptal edecek."
            }
          },
          form: {
            sendmail: {
              subTitle: "Kuruluşunuza yeni bir yönetici veya geliştirici eklemek için bir e-posta daveti gönderin",
              title: "Yönetici/Geliştirici Davet Et"
            }
          },
          inviteButton: "Yeni davetiye",
          notifications: {
            deleteInvite: {
              error: {
                description: "{{description}}",
                message: "Davetiye silinirken hata oluştu"
              },
              genericError: {
                description: "Davetiye silinemedi",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kullanıcının daveti başarıyla silindi.",
                message: "Davet silme başarılı"
              }
            },
            resendInvite: {
              error: {
                description: "{{description}}",
                message: "Davet yeniden gönderilirken hata oluştu"
              },
              genericError: {
                description: "Davetiye yeniden gönderilemedi",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Daveti e-posta yoluyla başarıyla yeniden gönderin.",
                message: "Davet yeniden gönderildi"
              }
            },
            sendInvite: {
              error: {
                description: "{{description}}",
                message: "Davetiye gönderilirken hata oluştu"
              },
              genericError: {
                description: "Davetiye gönderilemedi",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Davetiye e-posta yoluyla başarıyla gönderildi.",
                message: "Davet gönderildi"
              }
            },
            updateInvite: {
              error: {
                description: "{{description}}",
                message: "Davet güncellenirken hata oluştu"
              },
              genericError: {
                description: "Davet güncellenemedi",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Davet başarıyla güncellendi.",
                message: "Davet güncellemesi başarılı"
              }
            }
          },
          placeholder: {
            emptyResultPlaceholder: {
              addButton: "Yeni davetiye",
              subTitle: {
                "0": "Şu anda kullanılabilir davetiye yok.",
                "1": "Bir organizasyon oluşturabilir ve kullanıcıları davet edebilirsiniz.",
                "2": "kuruluşunuza dahil olmak için."
              },
              title: "Yeni Davet Gönder"
            },
            emptySearchResultPlaceholder: {
              clearButton: "Arama sorgusunu temizle",
              subTitle: {
                "0": "için herhangi bir sonuç bulamadık {{query}}",
                "1": "Lütfen farklı bir arama terimi deneyin."
              },
              title: "Sonuç bulunamadı"
            }
          },
          rolesUpdateModal: {
            header: "Davetli Rollerini Güncelle",
            searchPlaceholder: "Rol adına göre ara",
            subHeader: "Davet ettiğiniz kullanıcıdan roller ekleyin veya kaldırın."
          },
          subSelection: {
            invitees: "davetliler",
            onBoard: "Yerleşik Kullanıcılar"
          }
        },
        oidcScopes: {
          addAttributes: {
            description: "Kapsamla ilişkilendirmek istediğiniz kullanıcı özniteliklerini seçin {{name}}."
          },
          buttons: {
            addScope: "Yeni OIDC Kapsamı"
          },
          confirmationModals: {
            deleteClaim: {
              assertionHint: "Lütfen yazın <1>{{ name }}</1> onaylamak.",
              content: "Bu hak talebini silerseniz geri alamazsınız. Lütfen dikkatli bir şekilde ilerleyin.",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve OIDC talebini kalıcı olarak siler."
            },
            deleteScope: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu kapsamı silerseniz geri alamazsınız. ",
              header: "Emin misin?",
              message: "Bu eylem geri alınamaz ve OIDC kapsamını kalıcı olarak siler."
            }
          },
          editScope: {
            claimList: {
              addClaim: "Yeni Öznitelik",
              emptyPlaceholder: {
                action: "Öznitelik Ekle",
                subtitles: {
                  "0": "Bu OIDC kapsamı için eklenmiş öznitelik yok.",
                  "1": "Lütfen burada görüntülemek için gerekli özellikleri ekleyin."
                },
                title: "OIDC özelliği yok"
              },
              emptySearch: {
                action: "Hepsini gör",
                subtitles: {
                  "0": "Aradığınız özelliği bulamadık.",
                  "1": "Lütfen farklı bir ad deneyin."
                },
                title: "Sonuç bulunamadı"
              },
              popupDelete: "Özniteliği sil",
              searchClaims: "arama özellikleri",
              subTitle: "Bir OIDC kapsamının özniteliklerini ekleme veya kaldırma",
              title: "{{ name }}"
            }
          },
          forms: {
            addScopeForm: {
              inputs: {
                description: {
                  label: "Tanım",
                  placeholder: "Kapsam için bir açıklama girin"
                },
                displayName: {
                  label: "Ekran adı",
                  placeholder: "Görünen adı girin",
                  validations: {
                    empty: "Bu alan boş olamaz"
                  }
                },
                scopeName: {
                  label: "Kapsam",
                  placeholder: "kapsamı girin",
                  validations: {
                    empty: "Bu alan boş olamaz",
                    invalid: "Kapsam yalnızca alfasayısal karakterler ve _ içerebilir. "
                  }
                }
              }
            }
          },
          list: {
            columns: {
              actions: "Hareketler",
              name: "İsim"
            },
            empty: {
              action: "OIDC Kapsamı Ekle",
              subtitles: {
                "0": "Sistemde OIDC Kapsamları yok.",
                "1": "Lütfen burada görüntülemek için yeni OIDC kapsamları ekleyin."
              },
              title: "OIDC Kapsamı Yok"
            },
            searchPlaceholder: "Kapsama göre ara"
          },
          notifications: {
            addOIDCClaim: {
              error: {
                description: "{{description}}",
                message: "oluşturma hatası"
              },
              genericError: {
                description: "OIDC özniteliği eklenirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Yeni OIDC özniteliği başarıyla eklendi.",
                message: "Oluşturma başarılı"
              }
            },
            addOIDCScope: {
              error: {
                description: "{{description}}",
                message: "oluşturma hatası"
              },
              genericError: {
                description: "OIDC kapsamı oluşturulurken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Başarıyla yeni OIDC kapsamı.",
                message: "Oluşturma başarılı"
              }
            },
            claimsMandatory: {
              error: {
                description: "Kapsam eklemek için kapsamın en az bir özniteliği olduğundan emin olmanız gerekir.",
                message: "En az bir özellik seçmeniz gerekiyor."
              }
            },
            deleteOIDCScope: {
              error: {
                description: "{{description}}",
                message: "silme hatası"
              },
              genericError: {
                description: "OIDC kapsamı silinirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "OIDC kapsamı başarıyla silindi.",
                message: "Silme başarılı"
              }
            },
            deleteOIDClaim: {
              error: {
                description: "{{description}}",
                message: "silme hatası"
              },
              genericError: {
                description: "OIDC özniteliği silinirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "OIDC özniteliği başarıyla silindi.",
                message: "Silme başarılı"
              }
            },
            fetchOIDCScope: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "OIDC kapsam ayrıntıları getirilirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "OIDC kapsam ayrıntıları başarıyla getirildi.",
                message: "Alma başarılı"
              }
            },
            fetchOIDCScopes: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "OIDC kapsamları getirilirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "OIDC kapsam listesi başarıyla getirildi.",
                message: "Alma başarılı"
              }
            },
            fetchOIDClaims: {
              error: {
                description: "{{description}}",
                message: "alma hatası"
              },
              genericError: {
                description: "OIDC nitelikleri getirilirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "OIDC kapsam listesi başarıyla getirildi.",
                message: "Alma başarılı"
              }
            },
            updateOIDCScope: {
              error: {
                description: "{{description}}",
                message: "Güncelleme hatası"
              },
              genericError: {
                description: "OIDC kapsamı güncellenirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "OIDC kapsamı başarıyla güncellendi {{ scope }}.",
                message: "Güncelleme başarılı"
              }
            }
          },
          placeholders: {
            emptyList: {
              action: "Yeni OIDC Kapsamı",
              subtitles: {
                "0": "Şu anda OIDC kapsamı yok.",
                "1": "Aşağıdakileri izleyerek kolayca yeni bir OIDC kapsamı ekleyebilirsiniz.",
                "2": "oluşturma sihirbazındaki adımlar."
              },
              title: "Yeni bir OIDC Kapsamı ekleyin"
            },
            emptySearch: {
              action: "Hepsini gör",
              subtitles: {
                "0": "Aradığınız kapsamı bulamadık.",
                "1": "Lütfen farklı bir ad deneyin."
              },
              title: "Sonuç bulunamadı"
            }
          },
          wizards: {
            addScopeWizard: {
              buttons: {
                next: "Sonraki",
                previous: "Öncesi"
              },
              claimList: {
                searchPlaceholder: "Arama özellikleri",
                table: {
                  emptyPlaceholders: {
                    assigned: "Mevcut tüm öznitelikler bu OIDC kapsamı için atanır.",
                    unAssigned: "Bu OIDC kapsamı için atanmış öznitelik yok."
                  },
                  header: "Öznitellikler"
                }
              },
              steps: {
                basicDetails: "Temel Ayrıntılar",
                claims: "Nitelikler Ekle"
              },
              subTitle: "Gerekli özniteliklerle yeni bir OpenID Connect (OIDC) kapsamı oluşturun",
              title: "OpenID Bağlantı Kapsamı Oluşturun"
            }
          }
        },
        onboarded: {
          confirmationModal: {
            removeUser: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu kullanıcıyı kaldırırsanız, kullanıcı kuruluşunuzdaki konsola erişemez. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve kullanıcıyı kuruluşunuzdan kaldırır."
            }
          },
          notifications: {
            removeUser: {
              error: {
                description: "{{description}}",
                message: "Kullanıcı kaldırılırken hata oluştu"
              },
              genericError: {
                description: "Kullanıcı şuradan kaldırılamadı: {{tenant}} organizasyon",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kullanıcı başarıyla kaldırıldı {{tenant}} organizasyon",
                message: "Kullanıcı başarıyla kaldırıldı"
              }
            }
          }
        },
        organizations: {
          advancedSearch: {
            form: {
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "İsme Göre Ara"
          },
          confirmations: {
            deleteOrganization: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu kuruluşu kaldırırsanız, bu kuruluşla ilişkili tüm veriler kaldırılacaktır. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve kuruluşu tamamen ortadan kaldırır."
            }
          },
          edit: {
            attributes: {
              hint: "Kuruluş özniteliklerini yapılandırma",
              key: "İsim",
              keyRequiredErrorMessage: "İsim gerekli",
              value: "Değer",
              valueRequiredErrorMessage: "Değer gerekli"
            },
            back: "Geri",
            dangerZone: {
              disableOrganization: {
                disableActionTitle: "Kuruluşu Devre Dışı Bırak",
                enableActionTitle: "Organizasyonu Etkinleştir",
                subheader: "Bir kuruluşu devre dışı bırakmak, kuruluşla ilgili bilgilere erişiminizi kaybetmenize neden olabilir. "
              },
              subHeader: "Bu kuruluşu silmek istediğinizden emin misiniz?",
              title: "Kuruluşu Sil"
            },
            description: "Organizasyonu Düzenle",
            fields: {
              created: {
                ariaLabel: "oluşturuldu",
                label: "oluşturuldu"
              },
              description: {
                ariaLabel: "Kuruluş Açıklaması",
                label: "Kuruluş Açıklaması",
                placeholder: "Kuruluş açıklamasını girin"
              },
              domain: {
                ariaLabel: "Organizasyon Alanı",
                label: "Organizasyon Alanı"
              },
              id: {
                ariaLabel: "Kuruluş Kimliği",
                label: "Kuruluş Kimliği"
              },
              lastModified: {
                ariaLabel: "Son düzenleme",
                label: "Son düzenleme"
              },
              name: {
                ariaLabel: "Kuruluş Adı",
                label: "Kuruluş Adı",
                placeholder: "Kuruluş adını girin"
              },
              type: {
                ariaLabel: "Organizasyon tipi",
                label: "Organizasyon tipi"
              }
            },
            tabTitles: {
              attributes: "Öznitellikler",
              overview: "genel bakış"
            }
          },
          forms: {
            addOrganization: {
              description: {
                label: "Tanım",
                placeholder: "Açıklamayı girin"
              },
              domainName: {
                label: "Alan adı",
                placeholder: "alan adını girin",
                validation: {
                  duplicate: "Alan adı zaten var",
                  empty: "Alan adı gerekli"
                }
              },
              name: {
                label: "Kuruluş Adı",
                placeholder: "Kuruluş adını girin",
                validation: {
                  duplicate: "Kuruluş adı zaten var",
                  empty: "Kuruluş adı gerekli"
                }
              },
              structural: "Yapısal",
              tenant: "Kiracı",
              type: "Tip"
            }
          },
          homeList: {
            description: "Mevcut tüm kuruluşların listesini görüntüleyin.",
            name: "Tüm Organizasyonlar"
          },
          list: {
            actions: {
              add: "Organizasyon Ekle"
            },
            columns: {
              actions: "Hareketler",
              name: "İsim"
            }
          },
          modals: {
            addOrganization: {
              header: "Organizasyon Ekle",
              subtitle1: "Şurada yeni bir kuruluş oluşturun: {{parent}}.",
              subtitle2: "Yeni bir organizasyon oluşturun."
            }
          },
          notifications: {
            addOrganization: {
              error: {
                description: "{{description}}",
                message: "Kuruluş eklenirken hata oluştu"
              },
              genericError: {
                description: "Kuruluş eklenirken bir hata oluştu",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kuruluş başarıyla eklendi",
                message: "Kuruluş başarıyla eklendi"
              }
            },
            deleteOrganization: {
              error: {
                description: "{{description}}",
                message: "Kuruluş silinirken hata oluştu"
              },
              genericError: {
                description: "Kuruluş silinirken bir hata oluştu",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kuruluş başarıyla silindi",
                message: "Kuruluş başarıyla silindi"
              }
            },
            deleteOrganizationWithSubOrganizationError: "organizasyon {{ organizationName }} bir veya daha fazla alt organizasyonu olduğu için silinemez.",
            disableOrganization: {
              error: {
                description: "{{description}}",
                message: "Kuruluş devre dışı bırakılırken hata oluştu"
              },
              genericError: {
                description: "Kuruluş devre dışı bırakılırken bir hata oluştu",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kuruluş başarıyla devre dışı bırakıldı",
                message: "Kuruluş başarıyla devre dışı bırakıldı"
              }
            },
            disableOrganizationWithSubOrganizationError: "organizasyon {{ organizationName }} bir veya daha fazla alt organizasyonu olduğu için devre dışı bırakılamaz.",
            enableOrganization: {
              error: {
                description: "{{description}}",
                message: "Kuruluş etkinleştirilirken hata oluştu"
              },
              genericError: {
                description: "Kuruluş etkinleştirilirken bir hata oluştu",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kuruluş başarıyla etkinleştirildi",
                message: "Organizasyon başarıyla etkinleştirildi"
              }
            },
            fetchOrganization: {
              error: {
                description: "{{description}}",
                message: "Kuruluş getirilirken hata oluştu"
              },
              genericError: {
                description: "Kuruluş getirilirken bir hata oluştu",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kuruluş başarıyla getirildi",
                message: "Kuruluş başarıyla getirildi"
              }
            },
            getOrganizationList: {
              error: {
                description: "{{description}}",
                message: "Kuruluş listesi alınırken hata oluştu"
              },
              genericError: {
                description: "Kuruluş listesi alınırken bir hata oluştu",
                message: "Bir şeyler yanlış gitti"
              }
            },
            updateOrganization: {
              error: {
                description: "{{description}}",
                message: "Kuruluş güncellenirken hata oluştu"
              },
              genericError: {
                description: "Kuruluş güncellenirken bir hata oluştu",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kuruluş başarıyla güncellendi",
                message: "Kuruluş başarıyla güncellendi"
              }
            },
            updateOrganizationAttributes: {
              error: {
                description: "{{description}}",
                message: "Kuruluş öznitelikleri güncellenirken hata oluştu"
              },
              genericError: {
                description: "Kuruluş öznitelikleri güncellenirken bir hata oluştu",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kuruluş öznitelikleri başarıyla güncellendi",
                message: "Kuruluş öznitelikleri başarıyla güncellendi"
              }
            }
          },
          placeholders: {
            emptyList: {
              action: "Organizasyon Ekle",
              subtitles: {
                "0": "Şu anda herhangi bir organizasyon bulunmamaktadır.",
                "1": "ile kolayca yeni bir organizasyon ekleyebilirsiniz.",
                "2": "aşağıdaki düğmeye tıklayın.",
                "3": "altında herhangi bir kuruluş bulunmamaktadır. {{parent}} şu anda."
              },
              title: "Yeni bir Kuruluş ekle"
            }
          },
          shareApplicationSubTitle: "Uygulamayı paylaşmak için aşağıdaki seçeneklerden birini seçin.",
          shareApplicationRadio: "Tüm alt kuruluşlarla paylaşın",
          shareApplicationInfo: "Uygulamayı tüm mevcut alt kuruluşlarla ve mevcut kuruluşunuz altında oluşturduğunuz tüm yeni alt kuruluşlarla paylaşmak için bunu seçin.",
          unshareApplicationRadio: "Herhangi bir alt kuruluş ile paylaşmayınız.",
          shareWithSelectedOrgsRadio: "Yalnızca seçilen alt kuruluşlarla paylaşın",
          unshareApplicationInfo: "Bu, bu uygulamanın mevcut alt kuruluşlardan herhangi biriyle veya gelecekte bu kuruluş altında oluşturacağınız yeni alt kuruluşlarla paylaşılmasını engellemenizi sağlayacaktır.",
          switching: {
            emptyList: "Gösterilecek alt kuruluş yok.",
            goBack: "Geri gitmek",
            search: {
              placeholder: "İsme Göre Ara"
            },
            subOrganizations: "Alt organizasyonlar",
            switchLabel: "organizasyon"
          },
          title: "Organizasyonlar"
        },
        overview: {
          widgets: {
            insights: {
              groups: {
                heading: "Gruplar",
                subHeading: "Gruplara Genel Bakış"
              },
              users: {
                heading: "Kullanıcılar",
                subHeading: "Kullanıcılara Genel Bakış"
              }
            },
            overview: {
              cards: {
                groups: {
                  heading: "Gruplar"
                },
                users: {
                  heading: "Kullanıcılar"
                },
                userstores: {
                  heading: "Kullanıcı Mağazaları"
                }
              },
              heading: "genel bakış",
              subHeading: "Örneğin durumunu anlamak için temel istatistik kümesi."
            },
            quickLinks: {
              cards: {
                certificates: {
                  heading: "Sertifikalar",
                  subHeading: "Anahtar deposundaki sertifikaları yönetin."
                },
                dialects: {
                  heading: "Öznitelik Lehçeleri",
                  subHeading: "Öznitelik lehçelerini yönetin."
                },
                emailTemplates: {
                  heading: "E-posta Şablonları",
                  subHeading: "E-posta şablonlarını yönetin."
                },
                generalConfigs: {
                  heading: "Genel Konfigürasyonlar",
                  subHeading: "Yapılandırmaları, politikaları vb. yönetin."
                },
                groups: {
                  heading: "Gruplar",
                  subHeading: "Kullanıcı gruplarını ve izinleri yönetin."
                },
                roles: {
                  heading: "Roller",
                  subHeading: "Kullanıcı rollerini ve izinlerini yönetin."
                }
              },
              heading: "Hızlı Linkler",
              subHeading: "Özelliklere hızla gitmek için bağlantılar."
            }
          }
        },
        remoteFetch: {
          components: {
            status: {
              details: "Detaylar",
              header: "Uzak Yapılandırmalar",
              hint: "Şu anda dağıtılan uygulama yok.",
              linkPopup: {
                content: "",
                header: "Github Deposu URL'si",
                subHeader: ""
              },
              refetch: "Yeniden getir"
            }
          },
          forms: {
            getRemoteFetchForm: {
              actions: {
                remove: "Yapılandırmayı Kaldır",
                save: "Yapılandırmayı Kaydet"
              },
              fields: {
                accessToken: {
                  label: "Github Kişisel Erişim Simgesi",
                  placeholder: "Kişisel Erişim Jetonu"
                },
                connectivity: {
                  children: {
                    polling: {
                      label: "yoklama"
                    },
                    webhook: {
                      label: "Web kancası"
                    }
                  },
                  label: "Bağlantı Mekanizması"
                },
                enable: {
                  hint: "Uygulamaları getirmek için yapılandırmayı etkinleştirin",
                  label: "Getirme Yapılandırmasını Etkinleştir"
                },
                gitBranch: {
                  hint: "Uygulamaları getirmek için yapılandırmayı etkinleştirin",
                  label: "Github Şubesi",
                  placeholder: "Örn : Ana",
                  validations: {
                    required: "Github şubesi gerekli."
                  }
                },
                gitFolder: {
                  hint: "Uygulamaları getirmek için yapılandırmayı etkinleştirin",
                  label: "GitHub Dizini",
                  placeholder: "Örn : SampleConfigFolder/",
                  validations: {
                    required: "Github yapılandırma dizini gereklidir."
                  }
                },
                gitURL: {
                  label: "GitHub Deposu URL'si",
                  placeholder: "Örn: https://github.com/samplerepo/sample-project",
                  validations: {
                    required: "Github Deposu URL'si gerekli."
                  }
                },
                pollingFrequency: {
                  label: "Yoklama Sıklığı"
                },
                sharedKey: {
                  label: "GitHub Paylaşılan Anahtar"
                },
                username: {
                  label: "Github Kullanıcı Adı",
                  placeholder: "Örn: John Doe"
                }
              },
              heading: {
                subTitle: "Uygulamaları getirmek için depoyu yapılandırın",
                title: "Uygulama Yapılandırma Havuzu"
              }
            }
          },
          modal: {
            appStatusModal: {
              description: "",
              heading: "Uygulama Getirme Durumu",
              primaryButton: "Uygulamaları Yeniden Getir",
              secondaryButton: ""
            }
          },
          notifications: {
            createRepoConfig: {
              error: {
                description: "{{ description }}",
                message: "Hata Oluştur"
              },
              genericError: {
                description: "Uzak depo yapılandırması oluşturulurken bir hata oluştu.",
                message: "Hata Oluştur"
              },
              success: {
                description: "Uzak repo yapılandırması başarıyla oluşturuldu.",
                message: "Başarılı Oluştur"
              }
            },
            deleteRepoConfig: {
              error: {
                description: "{{ description }}",
                message: "Hatayı Sil"
              },
              genericError: {
                description: "Uzak depo yapılandırması silinirken bir hata oluştu.",
                message: "Hatayı Sil"
              },
              success: {
                description: "Uzak repo yapılandırması başarıyla silindi.",
                message: "Silme Başarılı"
              }
            },
            getConfigDeploymentDetails: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Dağıtım ayrıntıları alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "Dağıtım ayrıntıları başarıyla alındı.",
                message: "Alma Başarılı"
              }
            },
            getConfigList: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Dağıtım yapılandırma listesi alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "Dağıtım yapılandırma listesi başarıyla alındı.",
                message: "Alma Başarılı"
              }
            },
            getRemoteRepoConfig: {
              error: {
                description: "{{ description }}",
                message: "Alma Hatası"
              },
              genericError: {
                description: "Depo yapılandırması alınırken bir hata oluştu.",
                message: "Alma Hatası"
              },
              success: {
                description: "Depo yapılandırması başarıyla alındı.",
                message: "Alma Başarılı"
              }
            },
            triggerConfigDeployment: {
              error: {
                description: "{{ description }}",
                message: "Dağıtım Hatası"
              },
              genericError: {
                description: "Depo yapılandırmaları dağıtılırken bir hata oluştu.",
                message: "Dağıtım Hatası"
              },
              success: {
                description: "Depo yapılandırmaları başarıyla dağıtıldı.",
                message: "Dağıtım Başarılı"
              }
            }
          },
          pages: {
            listing: {
              subTitle: "Kimlik sunucusuyla sorunsuz çalışacak şekilde github deposunu yapılandırın.",
              title: "Uzak Yapılandırmalar"
            }
          },
          placeholders: {
            emptyListPlaceholder: {
              action: "Depoyu Yapılandır",
              subtitles: "Şu anda yapılandırılmış havuz yok. ",
              title: "Yapılandırma Ekle"
            }
          }
        },
        roles: {
          addRoleWizard: {
            buttons: {
              finish: "Sona ermek",
              next: "Sonraki",
              previous: "Öncesi"
            },
            forms: {
              roleBasicDetails: {
                domain: {
                  label: {
                    group: "Kullanıcı Mağazası",
                    role: "Rol Türü"
                  },
                  placeholder: "İhtisas",
                  validation: {
                    empty: {
                      group: "Kullanıcı mağazası seçin",
                      role: "Rol Türünü Seçin"
                    }
                  }
                },
                roleName: {
                  hint: "için bir isim {{type}}.",
                  label: "{{type}} İsim",
                  placeholder: "Girmek {{type}} isim",
                  validations: {
                    duplicate: "A {{type}} verilenle zaten var {{type}} isim.",
                    empty: "{{type}} Devam etmek için ad gereklidir.",
                    invalid: "A {{type}} ad yalnızca alfasayısal karakterler, - ve _ içerebilir. "
                  }
                }
              }
            },
            heading: "Yaratmak {{type}}",
            permissions: {
              buttons: {
                collapseAll: "Hepsini Daralt",
                expandAll: "Hepsini genişlet",
                update: "Güncelleme"
              }
            },
            subHeading: "Yeni bir tane oluştur {{type}} Sistemde.",
            summary: {
              labels: {
                domain: {
                  group: "Kullanıcı Mağazası",
                  role: "Rol Türü"
                },
                groups: "Atanan Grup(lar)",
                permissions: "izin(ler)",
                roleName: "{{type}} İsim",
                users: "Atanan Kullanıcı(lar)"
              }
            },
            users: {
              assignUserModal: {
                heading: "Kullanıcıları Yönet",
                hint: "Kullanıcı grubuna eklemek için kullanıcıları seçin.",
                list: {
                  listHeader: "İsim",
                  searchPlaceholder: "Kullanıcı ara"
                },
                subHeading: "Yeni kullanıcılar ekleyin veya şuraya atanmış mevcut kullanıcıları kaldırın: {{type}}."
              }
            },
            wizardSteps: {
              "0": "Temel Ayrıntılar",
              "1": "İzin Seçimi",
              "2": "Kullanıcı Ata",
              "3": "Özet",
              "4": "Gruplar",
              "5": "Rolleri Ata"
            }
          },
          advancedSearch: {
            form: {
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "Rol adına göre ara"
          },
          edit: {
            basics: {
              buttons: {
                update: "Güncelleme"
              },
              confirmation: {
                assertionHint: "Lütfen işleminizi onaylayın.",
                content: "eğer bunu silersen {{type}}, ona bağlı izinler silinecek ve buna bağlı kullanıcılar, daha önce izin verilen amaçlanan eylemleri artık gerçekleştiremeyecek. ",
                header: "Emin misin?",
                message: "Bu işlem geri alınamaz ve seçilenleri kalıcı olarak siler. {{type}}"
              },
              dangerZone: {
                actionTitle: "Silmek {{type}}",
                buttonDisableHint: "Sil seçeneği devre dışı çünkü bu {{type}} bir uzak kullanıcı deposunda yönetilir.",
                header: "Silmek {{type}}",
                subheader: "sildikten sonra {{type}}, kurtarılamaz."
              },
              fields: {
                roleName: {
                  name: "Rol ismi",
                  placeholder: "rol adını girin",
                  required: "Rol adı gerekli"
                }
              }
            },
            groups: {
              addGroupsModal: {
                heading: "Rol Gruplarını Güncelle",
                subHeading: "Yeni gruplar ekleyin veya role atanmış mevcut grupları kaldırın."
              },
              emptyPlaceholder: {
                action: "Grup Ata",
                subtitles: "Şu anda bu role atanmış bir grup yok.",
                title: "Atanan Grup Yok"
              },
              heading: "Atanan Gruplar",
              subHeading: "Bu role atanan grupları ekleyin veya kaldırın. "
            },
            menuItems: {
              basic: "Temel bilgiler",
              groups: "Gruplar",
              permissions: "İzinler",
              roles: "Roller",
              users: "Kullanıcılar"
            },
            users: {
              list: {
                emptyPlaceholder: {
                  action: "Kullanıcı Ata",
                  subtitles: "Şuraya atanmış kullanıcı yok: {{type}} şu anda.",
                  title: "Atanan Kullanıcı Yok"
                },
                user: "kullanıcı",
                organization: "Tarafından yönetilen"
              }
            }
          },
          list: {
            buttons: {
              addButton: "Yeni {{type}}",
              filterDropdown: "Tarafından filtre"
            },
            columns: {
              actions: "Hareketler",
              lastModified: "Değiştirilen Zaman",
              name: "rol"
            },
            confirmations: {
              deleteItem: {
                assertionHint: "Lütfen işleminizi onaylayın.",
                content: "eğer bunu silersen {{type}}, ona bağlı izinler silinecek ve buna bağlı kullanıcılar, daha önce izin verilen amaçlanan eylemleri artık gerçekleştiremeyecek. ",
                header: "Emin misin?",
                message: "Bu işlem geri alınamaz ve seçilenleri kalıcı olarak siler. {{type}}"
              }
            },
            emptyPlaceholders: {
              emptyRoleList: {
                action: "Yeni {{type}}",
                subtitles: {
                  "0": "şu anda yok {{type}} mevcut.",
                  "1": "yeni ekleyebilirsiniz {{type}} takip ederek kolayca",
                  "2": "adımlar {{type}} oluşturma sihirbazı."
                },
                title: "yeni ekle {{type}}"
              },
              search: {
                action: "Arama sorgusunu temizle",
                subtitles: {
                  "0": "için herhangi bir sonuç bulamadık {{searchQuery}}",
                  "1": "Lütfen farklı bir arama terimi deneyin."
                },
                title: "Sonuç bulunamadı"
              }
            },
            popups: {
              "delete": "Silmek {{type}}",
              edit: "Düzenlemek {{type}}"
            }
          },
          notifications: {
            createPermission: {
              error: {
                description: "{{description}}",
                message: "Role izin eklenirken hata oluştu."
              },
              genericError: {
                description: "Role izinler eklenemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "İzinler role başarıyla eklendi.",
                message: "Rol başarıyla oluşturuldu."
              }
            },
            createRole: {
              error: {
                description: "{{description}}",
                message: "Rol oluşturulurken hata oluştu."
              },
              genericError: {
                description: "Rol oluşturulamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Rol başarıyla oluşturuldu.",
                message: "Rol başarıyla oluşturuldu."
              }
            },
            deleteRole: {
              error: {
                description: "{{description}}",
                message: "Seçilen rol silinirken hata oluştu."
              },
              genericError: {
                description: "Seçilen rol kaldırılamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Seçilen rol başarıyla silindi.",
                message: "Rol başarıyla silindi"
              }
            },
            fetchRoles: {
              genericError: {
                description: "Roller alınırken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              }
            },
            updateRole: {
              error: {
                description: "{{description}}",
                message: "Seçilen rol güncellenirken hata oluştu."
              },
              genericError: {
                description: "Seçilen rol güncellenemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Seçilen rol başarıyla güncellendi.",
                message: "Rol başarıyla güncellendi"
              }
            }
          }
        },
        serverConfigs: {
          realmConfiguration: {
            actionTitles: {
              config: "Daha"
            },
            confirmation: {
              heading: "Onayla",
              message: "Realm ile ilgili konfigürasyonları kaydetmek istiyor musunuz?"
            },
            description: "Bölge ile ilgili temel yapılandırmaları yapılandırın.",
            form: {
              homeRealmIdentifiers: {
                hint: "Ana bölge tanımlayıcısını girin. ",
                label: "Ana bölge tanımlayıcıları",
                placeholder: "yerel ana bilgisayar"
              },
              idleSessionTimeoutPeriod: {
                hint: "Boş oturum zaman aşımını dakika olarak girin",
                label: "Boş Oturum Zaman Aşımı"
              },
              rememberMePeriod: {
                hint: "Beni hatırla süresini dakika cinsinden girin",
                label: "Beni Hatırla Dönemi"
              }
            },
            heading: "bölge yapılandırmaları",
            notifications: {
              emptyHomeRealmIdentifiers: {
                error: {
                  description: "En az bir ana bölge tanımlayıcısı bildirmelisiniz.",
                  message: "Veri doğrulama hatası"
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
                  message: "Alma Hatası"
                },
                genericError: {
                  description: "Bölge yapılandırmaları alınırken bir hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "",
                  message: ""
                }
              },
              updateConfigurations: {
                error: {
                  description: "{{ description }}",
                  message: "Güncelleme Hatası"
                },
                genericError: {
                  description: "Bölge yapılandırmaları güncellenirken bir hata oluştu.",
                  message: "Güncelleme Hatası"
                },
                success: {
                  description: "Bölge yapılandırmaları başarıyla güncellendi.",
                  message: "Güncelleme Başarılı"
                }
              }
            }
          }
        },
        sidePanel: {
          accountManagement: "Hesap Yönetimi",
          addEmailTemplate: "E-posta Şablonu Ekle",
          addEmailTemplateLocale: "E-posta Şablonu Yerel Ayarı Ekle",
          approvals: "Onaylar",
          attributeDialects: "Öznitellikler",
          categories: {
            attributes: "Kullanıcı Özellikleri",
            certificates: "Sertifikalar",
            configurations: "Yapılandırmalar",
            general: "Genel",
            organizations: "Organizasyon yönetimi",
            users: "Kullanıcılar",
            userstores: "Kullanıcı Mağazaları"
          },
          certificates: "Sertifikalar",
          configurations: "Yapılandırmalar",
          editEmailTemplate: "E-posta Şablonları",
          editExternalDialect: "Nitelik Eşlemesini Düzenle",
          editGroups: "Grubu Düzenle",
          editLocalClaims: "Nitelikleri Düzenle",
          editRoles: "Rolü Düzenle",
          editUsers: "kullanıcıyı düzenle",
          editUserstore: "Kullanıcı Mağazasını Düzenle",
          emailTemplateTypes: "",
          emailTemplates: "E-posta Şablonları",
          generalConfigurations: "Genel",
          groups: "Gruplar",
          localDialect: "Öznitellikler",
          loginAttemptsSecurity: "Oturum Açma Girişimleri Güvenliği",
          multiFactorAuthenticators: "Çok Faktörlü Kimlik Doğrulayıcılar",
          organizations: "Organizasyonlar",
          otherSettings: "Diğer ayarlar",
          overview: "genel bakış",
          passwordPolicies: "Şifre Politikaları",
          remoteFetchConfig: "Uzak Yapılandırmalar",
          roles: "Roller",
          userOnboarding: "Kullanıcı Katılımı",
          users: "Kullanıcılar",
          userstoreTemplates: "Kullanıcı Mağazası Şablonları",
          userstores: "Kullanıcı Mağazaları"
        },
        transferList: {
          list: {
            emptyPlaceholders: {
              "default": "Şu anda bu listede hiç öğe yok.",
              groups: {
                selected: "yok {{type}} bu gruba atandı.",
                unselected: "yok {{type}} bu gruba atanabilir."
              },
              roles: {
                selected: "yok {{type}} bu rolle atanmıştır.",
                unselected: "yok {{type}} bu rolle atanabilir."
              },
              users: {
                roles: {
                  selected: "yok {{type}} bu kullanıcıya atanan",
                  unselected: "yok {{type}} bu kullanıcıya atanabilir."
                }
              }
            },
            headers: {
              "0": "İhtisas",
              "1": "İsim"
            }
          },
          searchPlaceholder: "Aramak {{type}}"
        },
        user: {
          deleteJITUser: {
            confirmationModal: {
              content: "Bu kullanıcıyı silerseniz, kullanıcı, bir sosyal oturum açma seçeneğini kullanarak bir sonraki oturum açmasına kadar Hesabım'da veya kullanıcının abone olduğu başka herhangi bir uygulamada oturum açamaz."
            }
          },
          deleteUser: {
            confirmationModal: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu kullanıcıyı silerseniz, kullanıcı Hesabım'da veya kullanıcının daha önce abone olduğu başka bir uygulamada oturum açamaz. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve kullanıcıyı kalıcı olarak siler."
            }
          },
          disableUser: {
            confirmationModal: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu kullanıcıyı devre dışı bırakırsanız, kullanıcı Hesabım'da veya kullanıcının daha önce abone olduğu başka herhangi bir uygulamada oturum açamaz.",
              header: "Emin misin?",
              message: "Kullanıcının artık sisteme erişmesi gerekmediğinden emin olun."
            }
          },
          editUser: {
            dangerZoneGroup: {
              deleteUserZone: {
                actionTitle: "Kullanıcıyı sil",
                buttonDisableHint: "Bu kullanıcı bir uzak kullanıcı deposunda yönetildiği için silme seçeneği devre dışı bırakıldı.",
                header: "Kullanıcıyı sil",
                subheader: "Bu işlem, kullanıcıyı kuruluştan kalıcı olarak siler. "
              },
              disableUserZone: {
                actionTitle: "Kullanıcıyı Devre Dışı Bırak",
                header: "Kullanıcıyı devre dışı bırak",
                subheader: "Bir hesabı devre dışı bıraktığınızda, kullanıcı sisteme erişemez."
              },
              header: "Tehlikeli bölge",
              lockUserZone: {
                actionTitle: "Kullanıcıyı Kilitle",
                header: "Kullanıcıyı kilitle",
                subheader: "Hesabı kilitledikten sonra, kullanıcı artık sisteme giriş yapamaz."
              },
              passwordResetZone: {
                actionTitle: "Şifreyi yenile",
                buttonHint: "Parolayı sıfırlamak için bu kullanıcı hesabının kilidi açılmalıdır.",
                header: "Şifreyi yenile",
                subheader: "Parolayı değiştirdikten sonra, kullanıcı artık mevcut parolayı kullanarak hiçbir uygulamada oturum açamaz."
              },
              deleteAdminPriviledgeZone: {
                actionTitle: "Ayrıcalıkları İptal Et",
                header: "Yönetici ayrıcalıklarını iptal et",
                subheader: "Bu işlem, kullanıcının yönetici ayrıcalıklarını kaldıracak, ancak kullanıcı kuruluşta olmaya devam edecek."
              }
            },
            dateOfBirth: {
              placeholder: {
                part1: "Giriş",
                part2: "YYYY-AA-GG biçiminde"
              }
            }
          },
          forms: {
            addUserForm: {
              buttons: {
                radioButton: {
                  label: "Kullanıcı parolasını ayarlamak için yöntemi seçin",
                  options: {
                    askPassword: "Kullanıcıyı kendi şifresini belirlemeye davet edin",
                    createPassword: "Kullanıcı için bir şifre belirleyin"
                  }
                }
              },
              inputs: {
                confirmPassword: {
                  label: "Şifreyi Onayla",
                  placeholder: "yeni şifreyi girin",
                  validations: {
                    empty: "Parolanın zorunlu bir alan olduğunu onaylayın",
                    mismatch: "Parola onayı eşleşmiyor"
                  }
                },
                domain: {
                  label: "Kullanıcı Mağazası",
                  placeholder: "Kullanıcı mağazası seçin",
                  validations: {
                    empty: "Kullanıcı deposu adı boş olamaz."
                  }
                },
                email: {
                  label: "E-posta Adresi",
                  placeholder: "e-posta adresini girin",
                  validations: {
                    empty: "E-posta adresi boş olamaz",
                    invalid: "Geçerli bir e"
                  }
                },
                firstName: {
                  label: "İlk adı",
                  placeholder: "İlk adı girin",
                  validations: {
                    empty: "Ad, zorunlu bir alandır"
                  }
                },
                lastName: {
                  label: "Soy isim",
                  placeholder: "soyadını girin",
                  validations: {
                    empty: "Soyadı zorunlu bir alandır"
                  }
                },
                newPassword: {
                  label: "Şifre",
                  placeholder: "Şifreyi gir",
                  validations: {
                    empty: "Şifre girmek zorunludur",
                    regExViolation: "Lütfen geçerli bir şifre giriniz"
                  }
                },
                username: {
                  label: "Kullanıcı adı",
                  placeholder: "kullanıcı adını girin",
                  validations: {
                    empty: "Kullanıcı adı zorunlu bir alandır",
                    invalid: "Bu kullanıcı adına sahip bir kullanıcı zaten var.",
                    invalidCharacters: "Kullanıcı adı geçersiz karakterler içeriyor gibi görünüyor.",
                    regExViolation: "Geçerli bir e."
                  }
                }
              },
              validations: {
                genericError: {
                  description: "Bir şeyler yanlış gitti. ",
                  message: "Şifre değiştirme hatası"
                },
                invalidCurrentPassword: {
                  description: "Girdiğiniz mevcut şifre geçersiz görünüyor. ",
                  message: "Şifre değiştirme hatası"
                },
                submitError: {
                  description: "{{description}}",
                  message: "Şifre değiştirme hatası"
                },
                submitSuccess: {
                  description: "Parola başarıyla değiştirildi.",
                  message: "Parola sıfırlama başarılı"
                }
              }
            }
          },
          lockUser: {
            confirmationModal: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu hesabı kilitlerseniz, kullanıcı hiçbir iş uygulamasında oturum açamaz. ",
              header: "Emin misin?",
              message: "Bu eylem, kullanıcı hesabını kilitler."
            }
          },
          modals: {
            addUserWarnModal: {
              heading: "Uyarı",
              message: "Lütfen bu oluşturulan kullanıcıya bir rol atanmayacağını unutmayın. "
            },
            addUserWizard: {
              buttons: {
                next: "Sonraki",
                previous: "Öncesi"
              },
              steps: {
                basicDetails: "Temel Ayrıntılar",
                groups: "Kullanıcı Grupları",
                roles: "Kullanıcı rolleri",
                summary: "Özet"
              },
              subTitle: "Yeni kullanıcıyı oluşturmak için adımları izleyin",
              title: "Kullanıcı oluştur",
              wizardSummary: {
                domain: "Kullanıcı Mağazası",
                groups: "Grup(lar)",
                name: "İsim",
                passwordOption: {
                  label: "Şifre seçeneği",
                  message: {
                    "0": "Şuraya bir e-posta gönderilecek: {{email}} şifreyi ayarlamak için bağlantı ile.",
                    "1": "Parola yönetici tarafından ayarlandı."
                  }
                },
                roles: "Roller)",
                username: "Kullanıcı adı"
              }
            },
            changePasswordModal: {
              button: "Şifreyi yenile",
              header: "Kullanıcı Parolasını Sıfırla",
              hint: {
                forceReset: "UYARI: Kullanıcıyı parolayı değiştirmeye davet ettikten sonra, kullanıcının artık mevcut parolayı kullanarak herhangi bir uygulamada oturum açamayacağını lütfen unutmayın.  {{codeValidityPeriod}} dakika.",
                setPassword: "UYARI: Parolayı değiştirdikten sonra, kullanıcının artık mevcut parolayı kullanarak herhangi bir uygulamada oturum açamayacağını lütfen unutmayın."
              },
              message: "UYARI: Parolayı değiştirdikten sonra, kullanıcının artık mevcut parolayı kullanarak herhangi bir uygulamada oturum açamayacağını lütfen unutmayın.",
              passwordOptions: {
                forceReset: "Kullanıcıyı parolayı sıfırlamaya davet edin",
                setPassword: "Kullanıcı için yeni bir şifre belirleyin"
              }
            }
          },
          profile: {
            fields: {
              createdDate: "Oluşturulma Tarihi",
              emails: "E-posta",
              generic: {
                "default": "Eklemek {{fieldName}}"
              },
              modifiedDate: "Değiştirilme Tarihi",
              name_familyName: "Soy isim",
              name_givenName: "İlk adı",
              oneTimePassword: "Tek seferlik şifre",
              phoneNumbers: "Telefon numarası",
              photos: "Fotoğraflar",
              profileUrl: "URL",
              userId: "Kullanıcı kimliği",
              userName: "Kullanıcı adı"
            },
            forms: {
              emailChangeForm: {
                inputs: {
                  email: {
                    label: "E-posta",
                    note: "NOT: Bu, profilinizdeki e-posta adresini değiştirecektir.",
                    placeholder: "E-posta adresinizi giriniz",
                    validations: {
                      empty: "Email adresini doldurmanız zorunludur",
                      invalidFormat: "E-posta adresi doğru biçimde değil"
                    }
                  }
                }
              },
              generic: {
                inputs: {
                  placeholder: "Girin {{fieldName}}",
                  validations: {
                    empty: "{{fieldName}} Zorunlu bir alandır",
                    invalidFormat: "bu {{fieldName}} doğru formatta değil"
                  }
                }
              },
              mobileChangeForm: {
                inputs: {
                  mobile: {
                    label: "Cep numarası",
                    note: "NOT: Bu, profilinizdeki cep telefonu numarasını değiştirecektir.",
                    placeholder: "telefon numaranızı girin",
                    validations: {
                      empty: "Cep telefonu numarası zorunlu bir alandır",
                      invalidFormat: "Cep telefonu numarası doğru biçimde değil"
                    }
                  }
                }
              },
              nameChangeForm: {
                inputs: {
                  firstName: {
                    label: "İlk adı",
                    placeholder: "İlk adı girin",
                    validations: {
                      empty: "Ad, zorunlu bir alandır"
                    }
                  },
                  lastName: {
                    label: "Soy isim",
                    placeholder: "soyadını girin",
                    validations: {
                      empty: "Soyadı zorunlu bir alandır"
                    }
                  }
                }
              },
              organizationChangeForm: {
                inputs: {
                  organization: {
                    label: "organizasyon",
                    placeholder: "Kuruluşunuzu girin",
                    validations: {
                      empty: "Organizasyon zorunlu bir alandır"
                    }
                  }
                }
              }
            },
            notifications: {
              changeUserPassword: {
                error: {
                  description: "{{description}}",
                  message: "Kullanıcı parolası değiştirilirken hata oluştu."
                },
                genericError: {
                  description: "Kullanıcı parolası değiştirilirken hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Kullanıcının şifresi başarıyla değiştirildi.",
                  message: "Şifre başarıyla değiştirildi"
                }
              },
              disableUserAccount: {
                error: {
                  description: "{{description}}",
                  message: "Kullanıcı hesabı devre dışı bırakılırken hata oluştu."
                },
                genericError: {
                  description: "Kullanıcı hesabı devre dışı bırakılırken hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Kullanıcı hesabı başarıyla devre dışı bırakıldı.",
                  genericMessage: "Hesap devredışı",
                  message: "{{name}}adlı kullanıcının hesabı devre dışı bırakıldı"
                }
              },
              enableUserAccount: {
                error: {
                  description: "{{description}}",
                  message: "Kullanıcı hesabı etkinleştirilirken hata oluştu."
                },
                genericError: {
                  description: "Kullanıcı hesabı etkinleştirilirken hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Kullanıcı hesabı başarıyla etkinleştirildi.",
                  genericMessage: "Hesap etkinleştirildi",
                  message: "{{name}}adlı kullanıcının hesabı etkinleştirildi"
                }
              },
              forcePasswordReset: {
                error: {
                  description: "{{description}}",
                  message: "Parola sıfırlama akışı tetiklenirken hata oluştu."
                },
                genericError: {
                  description: "Parola sıfırlama akışı tetiklenirken hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Kullanıcı hesabı için parola sıfırlama işlemi başarıyla başlatıldı.",
                  message: "Parola sıfırlama başlatıldı"
                }
              },
              getProfileInfo: {
                error: {
                  description: "{{description}}",
                  message: "Profil ayrıntıları alınırken hata oluştu"
                },
                genericError: {
                  description: "Profil ayrıntıları alınırken hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Gerekli kullanıcı profili ayrıntıları başarıyla alındı.",
                  message: "Kullanıcı profili başarıyla alındı"
                }
              },
              lockUserAccount: {
                error: {
                  description: "{{description}}",
                  message: "Kullanıcı hesabı kilitlenirken hata oluştu."
                },
                genericError: {
                  description: "Kullanıcı hesabı kilitlenirken hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Kullanıcı hesabı başarıyla kilitlendi.",
                  genericMessage: "Hesap kilitlendi",
                  message: "{{name}}hesabı kilitli"
                }
              },
              noPasswordResetOptions: {
                error: {
                  description: "Zorunlu parola seçeneklerinin hiçbiri etkin değil.",
                  message: "Zorunlu parola sıfırlama tetiklenemiyor"
                }
              },
              unlockUserAccount: {
                error: {
                  description: "{{description}}",
                  message: "Kullanıcı hesabının kilidi açılırken hata oluştu."
                },
                genericError: {
                  description: "Kullanıcı hesabının kilidi açılırken hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Kullanıcı hesabının kilidi başarıyla açıldı.",
                  genericMessage: "Hesabın kilidi açıldı",
                  message: "{{name}}hesabının kilidi açıldı"
                }
              },
              updateProfileInfo: {
                error: {
                  description: "{{description}}",
                  message: "Profil ayrıntıları güncellenirken hata oluştu"
                },
                genericError: {
                  description: "Profil ayrıntıları güncellenirken hata oluştu.",
                  message: "Bir şeyler yanlış gitti"
                },
                success: {
                  description: "Gerekli kullanıcı profili ayrıntıları başarıyla güncellendi.",
                  message: "Kullanıcı profili başarıyla güncellendi"
                }
              }
            },
            placeholders: {
              SCIMDisabled: {
                heading: "Bu özellik hesabınız için mevcut değil"
              },
              userProfile: {
                emptyListPlaceholder: {
                  subtitles: "Profil bilgileri bu kullanıcı için mevcut değil.",
                  title: "Profil bilgisi yok"
                }
              }
            }
          },
          revokeAdmin: {
            confirmationModal: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu kullanıcının yönetici ayrıcalıklarını iptal etmeniz halinde, kullanıcı Asgardeo konsoluna giriş yapamayacak ve yönetici işlemleri gerçekleştiremeyecektir. ",
              header: "Emin misin?",
              message: "Bu eylem, kullanıcının yönetici ayrıcalıklarını iptal edecektir."
            }
          },
          updateUser: {
            groups: {
              addGroupsModal: {
                heading: "Kullanıcı Gruplarını Güncelle",
                subHeading: "Yeni gruplar ekleyin veya kullanıcıya atanmış mevcut grupları kaldırın."
              },
              editGroups: {
                groupList: {
                  emptyListPlaceholder: {
                    subTitle: {
                      "0": "Şu anda kullanıcıya atanmış bir grup yok.",
                      "1": "Bu, kullanıcının belirli işlemleri gerçekleştirmesini kısıtlayabilir.",
                      "2": "belirli uygulamalara erişmek gibi görevler."
                    },
                    title: "Atanan Grup Yok"
                  },
                  headers: {
                    "0": "İhtisas",
                    "1": "İsim"
                  }
                },
                heading: "Atanan Gruplar",
                popups: {
                  viewPermissions: "İzinleri Görüntüle"
                },
                searchPlaceholder: "Arama grupları",
                subHeading: "Kullanıcının atandığı grupları ekleyin veya kaldırın ve bunun belirli görevleri gerçekleştirmeyi etkileyeceğini unutmayın."
              },
              notifications: {
                addUserGroups: {
                  error: {
                    description: "{{description}}",
                    message: "Kullanıcı grupları güncellenirken hata oluştu"
                  },
                  genericError: {
                    description: "Kullanıcı grupları güncellenirken bir hata oluştu.",
                    message: "Bir şeyler yanlış gitti"
                  },
                  success: {
                    description: "Kullanıcı için yeni gruplar atama başarılı.",
                    message: "Kullanıcı gruplarını güncelleme başarılı"
                  }
                },
                fetchUserGroups: {
                  error: {
                    description: "{{description}}",
                    message: "Grup listesi getirilirken hata oluştu"
                  },
                  genericError: {
                    description: "Grup listesi getirilirken hata oluştu.",
                    message: "Bir şeyler yanlış gitti"
                  },
                  success: {
                    description: "Grup listesi başarıyla alındı.",
                    message: "Kullanıcı grupları listesi başarıyla alındı"
                  }
                },
                removeUserGroups: {
                  error: {
                    description: "{{description}}",
                    message: "Kullanıcının grupları güncellenirken hata oluştu"
                  },
                  genericError: {
                    description: "Kullanıcı grupları güncellenirken bir hata oluştu.",
                    message: "Bir şeyler yanlış gitti"
                  },
                  success: {
                    description: "Kullanıcı için atanan gruplar başarıyla kaldırıldı.",
                    message: "Kullanıcı gruplarını güncelleme başarılı"
                  }
                },
                updateUserGroups: {
                  error: {
                    description: "{{description}}",
                    message: "Kullanıcı grupları güncellenirken hata oluştu"
                  },
                  genericError: {
                    description: "Kullanıcı grupları güncellenirken bir hata oluştu.",
                    message: "Bir şeyler yanlış gitti"
                  },
                  success: {
                    description: "Kullanıcı için atanan grupların güncellenmesi başarılı.",
                    message: "Kullanıcı gruplarını güncelleme başarılı"
                  }
                }
              }
            },
            roles: {
              addRolesModal: {
                heading: "Kullanıcı Rollerini Güncelle",
                subHeading: "Yeni roller ekleyin veya kullanıcıya atanan mevcut rolleri kaldırın."
              },
              editRoles: {
                confirmationModal: {
                  assertionHint: "Lütfen işleminizi onaylayın.",
                  content: "Rolü değiştirmek, kullanıcının belirli özellikleri kaybetmesine veya bunlara erişim kazanmasına neden olur. ",
                  header: "Emin misin?",
                  message: "Bu eylem, bu kullanıcının rolünü değiştirecek."
                },
                heading: "Atanan Roller",
                popups: {
                  viewPermissions: "İzinleri Görüntüle"
                },
                roleList: {
                  emptyListPlaceholder: {
                    subTitle: {
                      "0": "Şu anda kullanıcıya atanan rol yok.",
                      "1": "Bu, kullanıcının belirli işlemleri gerçekleştirmesini kısıtlayabilir.",
                      "2": "belirli uygulamalara erişmek gibi görevler."
                    },
                    title: "Atanan Rol Yok"
                  },
                  headers: {
                    "0": "İhtisas",
                    "1": "İsim"
                  }
                },
                searchPlaceholder: "Rolleri Ara",
                subHeading: "Bu kullanıcıya atanan rolleri ekleyin veya kaldırın ve bunun belirli görevleri gerçekleştirmeyi etkileyeceğini unutmayın."
              },
              notifications: {
                addUserRoles: {
                  error: {
                    description: "{{description}}",
                    message: "Kullanıcı rolleri güncellenirken hata oluştu"
                  },
                  genericError: {
                    description: "Kullanıcı rolleri güncellenirken bir hata oluştu.",
                    message: "Bir şeyler yanlış gitti"
                  },
                  success: {
                    description: "Kullanıcı için yeni roller atama başarılı.",
                    message: "Kullanıcı rollerini güncelleme başarılı"
                  }
                },
                fetchUserRoles: {
                  error: {
                    description: "{{description}}",
                    message: "Roller listesi getirilirken hata oluştu"
                  },
                  genericError: {
                    description: "Roller listesi getirilirken hata oluştu.",
                    message: "Bir şeyler yanlış gitti"
                  },
                  success: {
                    description: "Roller listesi başarıyla alındı.",
                    message: "Kullanıcı rolleri listesi başarıyla alındı"
                  }
                },
                removeUserRoles: {
                  error: {
                    description: "{{description}}",
                    message: "Kullanıcının rolleri güncellenirken hata oluştu"
                  },
                  genericError: {
                    description: "Kullanıcı rolleri güncellenirken bir hata oluştu.",
                    message: "Bir şeyler yanlış gitti"
                  },
                  success: {
                    description: "Kullanıcı için atanan roller başarıyla kaldırıldı.",
                    message: "Kullanıcı rollerini güncelleme başarılı"
                  }
                },
                updateUserRoles: {
                  error: {
                    description: "{{description}}",
                    message: "Kullanıcının rolleri güncellenirken hata oluştu"
                  },
                  genericError: {
                    description: "Kullanıcı rolleri güncellenirken bir hata oluştu.",
                    message: "Bir şeyler yanlış gitti"
                  },
                  success: {
                    description: "Kullanıcı için atanan roller başarılı bir şekilde güncelleniyor.",
                    message: "Kullanıcı rollerini güncelleme başarılı"
                  }
                }
              },
              viewPermissionModal: {
                backButton: "Listeye geri dön",
                editButton: "İzinleri Düzenle",
                heading: "için izinler {{role}}"
              }
            }
          }
        },
        users: {
          advancedSearch: {
            form: {
              dropdown: {
                filterAttributeOptions: {
                  email: "E-posta",
                  username: "Kullanıcı adı"
                }
              },
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Aranacak değeri girin"
                }
              }
            },
            placeholder: "E-posta ile Ara"
          },
          all: {
            heading: "Kullanıcılar",
            subHeading: "Kullanıcı hesapları ekleyin ve yönetin, kullanıcılara roller atayın ve kullanıcı kimliklerini koruyun."
          },
          buttons: {
            addNewUserBtn: "Yeni kullanıcı",
            assignUserRoleBtn: "Rolleri atayın",
            metaColumnBtn: "Sütunlar"
          },
          confirmations: {
            terminateAllSessions: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu eyleme devam ederseniz, kullanıcının tüm aktif oturumları kapatılacaktır. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve tüm etkin oturumları kalıcı olarak sonlandırır."
            },
            terminateSession: {
              assertionHint: "Lütfen işleminizi onaylayın.",
              content: "Bu eyleme devam ederseniz, kullanıcının seçilen oturumdaki oturumu kapatılacaktır. ",
              header: "Emin misin?",
              message: "Bu işlem geri alınamaz ve oturumu kalıcı olarak sonlandırır."
            }
          },
          consumerUsers: {
            fields: {
              username: {
                label: "Kullanıcı adı",
                placeholder: "kullanıcı adını girin",
                validations: {
                  empty: "Kullanıcı adı zorunlu bir alandır",
                  invalid: "Bu kullanıcı adına sahip bir kullanıcı zaten var.",
                  invalidCharacters: "Kullanıcı adı geçersiz karakterler içeriyor gibi görünüyor.",
                  regExViolation: "Geçerli bir e."
                }
              }
            }
          },
          editUser: {
            tab: {
              menuItems: {
                "0": "Profil",
                "1": "Gruplar",
                "2": "Roller",
                "3": "Aktif Oturumlar"
              }
            }
          },
          forms: {
            validation: {
              dateFormatError: "formatı {{field}} girilen yanlış ",
              formatError: "formatı {{field}} girilen yanlış",
              futureDateError: "için girdiğiniz tarih {{field}} alan geçersiz.",
              mobileFormatError: "formatı {{field}} girilen yanlış "
            }
          },
          guestUsers: {
            fields: {
              username: {
                label: "Kullanıcı adı",
                placeholder: "kullanıcı adını girin",
                validations: {
                  empty: "Kullanıcı adı zorunlu bir alandır",
                  invalid: "Bu kullanıcı adına sahip bir kullanıcı zaten var.",
                  invalidCharacters: "Kullanıcı adı geçersiz karakterler içeriyor gibi görünüyor.",
                  regExViolation: "Geçerli bir e."
                }
              }
            }
          },
          list: {
            columns: {
              actions: "Hareketler",
              name: "İsim"
            }
          },
          notifications: {
            addUser: {
              error: {
                description: "{{description}}",
                message: "Yeni kullanıcı eklenirken hata oluştu"
              },
              genericError: {
                description: "Yeni kullanıcı eklenemedi",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Yeni kullanıcı başarıyla eklendi.",
                message: "Kullanıcı başarıyla eklendi"
              }
            },
            addUserPendingApproval: {
                error: {
                    description: "{{description}}",
                    message: "Yeni kullanıcı eklenirken hata oluştu"
                },
                genericError: {
                    description: "Couldn't add the new user",
                    message: "Bir şeyler yanlış gitti"
                },
                success: {
                    description: "Yeni kullanıcı kabul edildi. Onaylama bekleniyor.",
                    message: "Kullanıcı kabul edildi."
                }
            },
            deleteUser: {
              error: {
                description: "{{description}}",
                message: "Kullanıcı silinirken hata oluştu"
              },
              genericError: {
                description: "kullanıcı silinemedi",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kullanıcı başarıyla silindi.",
                message: "Kullanıcı başarıyla silindi"
              }
            },
            fetchUsers: {
              error: {
                description: "{{description}}",
                message: "Kullanıcılar alınırken hata oluştu"
              },
              genericError: {
                description: "Kullanıcılar alınamadı",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Kullanıcılar başarıyla alındı.",
                message: "Kullanıcı alma işlemi başarılı"
              }
            },
            getAdminRole: {
              error: {
                description: "{{description}}",
                message: "Yönetici rolü alınırken hata oluştu"
              },
              genericError: {
                description: "Yönetici rolleri alınamadı.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Yönetici rolleri başarıyla alındı.",
                message: "Rol alma başarılı"
              }
            },
            revokeAdmin: {
              error: {
                description: "{{description}}",
                message: "Yönetici ayrıcalıkları iptal edilirken hata oluştu"
              },
              genericError: {
                description: "Yönetici ayrıcalıkları iptal edilemedi.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Yönetici ayrıcalıkları başarıyla iptal edildi.",
                message: "Ayrıcalıklar başarıyla iptal edildi"
              }
            }
          },
          placeholders: {
            emptyList: {
              action: "Listeyi yenile",
              subtitles: {
                "0": "Kullanıcılar listesi boş döndü.",
                "1": "Kullanıcı listesi getirilirken bir şeyler ters gitti"
              },
              title: "Kullanıcı bulunamadı"
            },
            userstoreError: {
              subtitles: {
                "0": "Kullanıcı deposundan kullanıcılar getirilemedi",
                "1": "Lütfen tekrar deneyin"
              },
              title: "Bir şeyler yanlış gitti"
            }
          },
          userSessions: {
            components: {
              sessionDetails: {
                actions: {
                  terminateAllSessions: "Tümünü Sonlandır",
                  terminateSession: "Oturumu Sonlandır"
                },
                labels: {
                  activeApplication: "Aktif Uygulamalar",
                  browser: "Tarayıcı",
                  deviceModel: "Cihaz modeli",
                  ip: "IP adresi",
                  lastAccessed: "Son Erişim {{ date }}",
                  loggedInAs: "tarihinde giriş yapıldı <1>{{ app }}</1> gibi <3>{{ user }}</3>",
                  loginTime: "Giriş Zamanı",
                  os: "İşletim sistemi",
                  recentActivity: "Son Etkinlik"
                }
              }
            },
            dangerZones: {
              terminate: {
                actionTitle: "sonlandırmak",
                header: "Oturumu sonlandır",
                subheader: "Belirli bir cihazda oturumunuz kapatılacaktır."
              }
            },
            notifications: {
              getAdminUser: {
                error: {
                  description: "{{ description }}",
                  message: "Alma Hatası"
                },
                genericError: {
                  description: "Geçerli kullanıcı türü alınırken bir hata oluştu.",
                  message: "Alma Hatası"
                }
              },
              getUserSessions: {
                error: {
                  description: "{{ description }}",
                  message: "Alma Hatası"
                },
                genericError: {
                  description: "Kullanıcı oturumları alınırken bir hata oluştu.",
                  message: "Alma Hatası"
                },
                success: {
                  description: "Kullanıcı oturumları başarıyla alındı.",
                  message: "Alma Başarılı"
                }
              },
              terminateAllUserSessions: {
                error: {
                  description: "{{ description }}",
                  message: "Sonlandırma Hatası"
                },
                genericError: {
                  description: "Kullanıcı oturumları sonlandırılırken bir hata oluştu.",
                  message: "Sonlandırma Hatası"
                },
                success: {
                  description: "Tüm kullanıcı oturumları başarıyla sonlandırıldı.",
                  message: "Fesih Başarılı"
                }
              },
              terminateUserSession: {
                error: {
                  description: "{{ description }}",
                  message: "Sonlandırma Hatası"
                },
                genericError: {
                  description: "Kullanıcı oturumu sonlandırılırken bir hata oluştu.",
                  message: "Sonlandırma Hatası"
                },
                success: {
                  description: "Kullanıcı oturumu başarıyla sonlandırıldı.",
                  message: "Fesih Başarılı"
                }
              }
            },
            placeholders: {
              emptyListPlaceholder: {
                subtitles: "Bu kullanıcı için aktif oturum yok.",
                title: "Aktif oturum yok"
              }
            }
          },
          usersList: {
            list: {
              emptyResultPlaceholder: {
                addButton: "Yeni kullanıcı",
                subTitle: {
                  "0": "Şu anda müsait kullanıcı yok.",
                  "1": "Aşağıdakileri takip ederek kolayca yeni bir kullanıcı ekleyebilirsiniz.",
                  "2": "kullanıcı oluşturma sihirbazındaki adımlar."
                },
                title: "yeni bir kullanıcı ekle"
              },
              iconPopups: {
                "delete": "Silmek",
                edit: "Düzenlemek"
              }
            },
            metaOptions: {
              columns: {
                emails: "E-posta",
                id: "Kullanıcı kimliği",
                lastModified: "Son düzenleme",
                name: "İsim",
                userName: "Kullanıcı adı"
              },
              heading: "Sütunları Göster"
            },
            search: {
              emptyResultPlaceholder: {
                clearButton: "Arama sorgusunu temizle",
                subTitle: {
                  "0": "için herhangi bir sonuç bulamadık {{query}}",
                  "1": "Lütfen farklı bir arama terimi deneyin."
                },
                title: "Sonuç bulunamadı"
              }
            }
          },
          userstores: {
            userstoreOptions: {
              all: "Tüm kullanıcı mağazaları",
              primary: "Öncelik"
            }
          }
        },
        userstores: {
          advancedSearch: {
            error: "Filtre sorgu biçimi yanlış",
            form: {
              inputs: {
                filterAttribute: {
                  placeholder: "Örneğin. "
                },
                filterCondition: {
                  placeholder: "Örneğin. "
                },
                filterValue: {
                  placeholder: "Örneğin. "
                }
              }
            },
            placeholder: "Kullanıcı mağaza adına göre ara"
          },
          confirmation: {
            confirm: "Onaylamak",
            content: "Bu kullanıcı deposunu silerseniz, bu kullanıcı deposundaki kullanıcı verileri de silinecektir. ",
            header: "Emin misin?",
            hint: "Lütfen işleminizi onaylayın.",
            message: "Bu işlem geri alınamaz ve seçilen kullanıcı deposunu ve içindeki verileri kalıcı olarak siler."
          },
          dangerZone: {
            "delete": {
              actionTitle: "Kullanıcı Deposunu Sil",
              header: "Kullanıcı Deposunu Sil",
              subheader: "Bir kullanıcı mağazasını bir kez sildiğinizde geri dönüş yoktur. "
            },
            disable: {
              actionTitle: "Kullanıcı Deposunu Etkinleştir",
              header: "Kullanıcı Deposunu Etkinleştir",
              subheader: "Bir kullanıcı deposunu devre dışı bırakmak, kullanıcı deposundaki kullanıcılara erişiminizi kaybetmenize neden olabilir. "
            }
          },
          forms: {
            connection: {
              connectionErrorMessage: "Lütfen sağlanan bağlantı URL'sinin, adın, parolanın ve sürücü adının doğru olduğundan emin olun",
              testButton: "Test bağlantısı"
            },
            custom: {
              placeholder: "Gir {{name}}",
              requiredErrorMessage: "{{name}} gereklidir"
            },
            general: {
              description: {
                label: "Tanım",
                placeholder: "Bir açıklama girin"
              },
              name: {
                label: "İsim",
                placeholder: "İsim girin",
                requiredErrorMessage: "İsim zorunlu bir alandır",
                validationErrorMessages: {
                  alreadyExistsErrorMessage: "Bu ada sahip bir kullanıcı deposu zaten var."
                }
              },
              type: {
                label: "Tip",
                requiredErrorMessage: "Bir Tür Seçin"
              }
            }
          },
          notifications: {
            addUserstore: {
              genericError: {
                description: "Kullanıcı deposu oluşturulurken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti!"
              },
              success: {
                description: "Kullanıcı mağazası başarıyla eklendi!",
                message: "Kullanıcı mağazası başarıyla eklendi!"
              }
            },
            apiLimitReachedError: {
              error: {
                description: "İzin verilen maksimum kullanıcı mağazası sayısına ulaştınız.",
                message: "Kullanıcı deposu oluşturulamadı"
              }
            },
            delay: {
              description: "Kullanıcı mağaza listesinin güncellenmesi biraz zaman alabilir. ",
              message: "Kullanıcı mağaza listesinin güncellenmesi zaman alıyor"
            },
            deleteUserstore: {
              genericError: {
                description: "Kullanıcı deposu silinirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti!"
              },
              success: {
                description: "Kullanıcı deposu başarıyla silindi!",
                message: "Kullanıcı deposu başarıyla silindi!"
              }
            },
            fetchUserstoreMetadata: {
              genericError: {
                description: "Tür meta verisi alınırken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              }
            },
            fetchUserstoreTemplates: {
              genericError: {
                description: "Kullanıcı deposu türü ayrıntıları getirilirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              }
            },
            fetchUserstoreTypes: {
              genericError: {
                description: "Kullanıcı deposu türleri getirilirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              }
            },
            fetchUserstores: {
              genericError: {
                description: "Kullanıcı mağazaları getirilirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              }
            },
            testConnection: {
              genericError: {
                description: "Kullanıcı deposuyla bağlantı test edilirken bir hata oluştu",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Bağlantı sağlıklı.",
                message: "Bağlantı başarılı!"
              }
            },
            updateDelay: {
              description: "Güncellenen özelliklerin görünmesi biraz zaman alabilir.",
              message: "Özelliklerin güncellenmesi zaman alır"
            },
            updateUserstore: {
              genericError: {
                description: "Kullanıcı deposu güncellenirken bir hata oluştu.",
                message: "Bir şeyler yanlış gitti"
              },
              success: {
                description: "Bu kullanıcı mağazası başarıyla güncellendi!",
                message: "Kullanıcı mağazası başarıyla güncellendi!"
              }
            }
          },
          pageLayout: {
            edit: {
              back: "Kullanıcı mağazalarına geri dönün",
              description: "Kullanıcı mağazasını düzenle",
              tabs: {
                connection: "Bağlantı",
                general: "Genel",
                group: "Grup",
                user: "kullanıcı"
              }
            },
            list: {
              description: "Kullanıcı mağazaları oluşturun ve yönetin.",
              primaryAction: "Yeni Kullanıcı Mağazası",
              title: "Kullanıcı Mağazaları"
            },
            templates: {
              back: "Kullanıcı mağazalarına geri dönün",
              description: "Lütfen aşağıdaki kullanıcı deposu türlerinden birini seçin.",
              templateHeading: "Hızlı ayar",
              templateSubHeading: "Kullanıcı mağazası oluşturma işleminizi hızlandırmak için önceden tanımlanmış şablonlar.",
              title: "Kullanıcı Deposu Türünü Seçin"
            }
          },
          placeholders: {
            emptyList: {
              action: "Yeni Kullanıcı Mağazası",
              subtitles: "Şu anda kullanılabilir kullanıcı mağazası yok. Kullanıcı deposu oluşturma sihirbazındaki adımları izleyerek kolayca yeni bir kullanıcı mağazası ekleyebilirsiniz.",
              title: "Yeni bir kullanıcı mağazası ekle"
            },
            emptySearch: {
              action: "Arama sorgusunu temizle",
              subtitles: "için herhangi bir sonuç bulamadık {{searchQuery}}. ",
              title: "Sonuç bulunamadı"
            }
          },
          sqlEditor: {
            create: "Yaratmak",
            darkMode: "Karanlık Mod",
            "delete": "Silmek",
            read: "Okumak",
            reset: "Değişiklikleri Sıfırla",
            title: "SQL Sorgu Türleri",
            update: "Güncelleme"
          },
          wizard: {
            header: "Eklemek {{type}} Kullanıcı Mağazası",
            steps: {
              general: "Genel",
              group: "Grup",
              summary: "Özet",
              user: "kullanıcı"
            }
          }
        },
        validation: {
          fetchValidationConfigData: {
            error: {
              description: "{{description}}",
              message: "alma hatası"
            },
            genericError: {
              description: "Doğrulama yapılandırma verileri alınamadı.",
              message: "Bir şeyler yanlış gitti"
            }
          },
          validationError: {
            minMaxMismatch: "Minimum uzunluk, maksimum uzunluktan az olmalıdır.",
            uniqueChrMismatch: "Benzersiz karakter sayısı, parolanın minimum uzunluğundan az olmalıdır.",
            consecutiveChrMismatch: "Ardışık karakter sayısı, parolanın minimum uzunluğundan az olmalıdır.",
            invalidConfig: "Yukarıdaki yapılandırmalarla parola oluşturulamıyor.",
            minLimitError: "Minimum uzunluk 8'den az olamaz.",
            maxLimitError: "Maksimum uzunluk 30'dan fazla olamaz.",
            wrongCombination: "Kombinasyona izin verilmiyor"
          },
          notifications: {
            error: {
              description: "{{description}}",
              message: "Güncelleme hatası"
            },
            genericError: {
              description: "Parola doğrulama yapılandırması güncellenemedi.",
              message: "Bir şeyler yanlış gitti"
            },
            success: {
              description: "Parola doğrulama yapılandırması başarıyla güncellendi.",
              message: "Güncelleme başarılı"
            }
          },
          pageTitle: "Şifre Doğrulama",
          description: "Kullanıcılarınız için parola doğrulama kurallarını özelleştirin.",
          goBackToApplication: "uygulamaya geri dön",
          goBackToValidationConfig: "Hesap Güvenliğine geri dönün"
        },
        jwtPrivateKeyConfiguration: {
          fetchValidationConfigData: {
            error: {
              description: "{{description}}",
              message: "alma hatası"
            },
            genericError: {
              description: "Impossible de recupérer les de l'authentificateur de l'authentificateur de l'authentificateur de jwt.",
              message: "Bir şeyler yanlış gitti"
            }
          },
          notifications: {
            error: {
              description: "{{description}}",
              message: "Güncelleme hatası"
            },
            genericError: {
              description: "jwt özel anahtar kimlik doğrulayıcı yapılandırması güncellenemedi.",
              message: "Bir şeyler yanlış gitti"
            },
            success: {
              description: "jwt özel anahtar kimlik doğrulayıcı yapılandırması başarıyla güncellendi.",
              message: "Güncelleme başarılı"
            }
          },
          pageTitle: "OIDC için Özel Anahtar JWT İstemci Kimlik Doğrulaması",
          description: "Belirteç uç noktasını kullanırken, yetkilendirme sunucusunda gizli istemcilerin kimliğini doğrulayın.",
          goBackToApplication: "uygulamaya geri dön",
          goBackToAccountSecurityConfig: "Hesap Güvenliğine geri dönün",
          messageInfo: "Etkinleştirilirse, JWT sona erme süresi içinde yeniden kullanılabilir. ",
          tokenReuseEnabled: "Jeton Yeniden Kullanımı Etkin",
          tokenReuseDisabled: "Belirteç Yeniden Kullanımı Devre Dışı Bırakıldı"
        }
      },
      notifications: {
        endSession: {
          error: {
            description: "{{description}}",
            message: "Sonlandırma hatası"
          },
          genericError: {
            description: "Geçerli oturum sonlandırılamadı.",
            message: "Bir şeyler yanlış gitti"
          },
          success: {
            description: "Geçerli oturum başarıyla sonlandırıldı.",
            message: "Fesih başarılı"
          }
        },
        getProfileInfo: {
          error: {
            description: "{{description}}",
            message: "alma hatası"
          },
          genericError: {
            description: "Kullanıcı profili ayrıntıları alınamadı.",
            message: "Bir şeyler yanlış gitti"
          },
          success: {
            description: "Kullanıcı profili ayrıntıları başarıyla alındı.",
            message: "Alma başarılı"
          }
        },
        getProfileSchema: {
          error: {
            description: "{{description}}",
            message: "alma hatası"
          },
          genericError: {
            description: "Kullanıcı profili şemaları alınamadı.",
            message: "Bir şeyler yanlış gitti"
          },
          success: {
            description: "Kullanıcı profili şemaları başarıyla alındı.",
            message: "Alma başarılı"
          }
        }
      },
      pages: {
        addEmailTemplate: {
          backButton: "Geri dönmek {{name}} şablon",
          subTitle: null,
          title: "Yeni Şablon Ekle"
        },
        approvalsPage: {
          subTitle: "Onayınızı gerektiren operasyonel görevleri gözden geçirin",
          title: "Onaylar"
        },
        editTemplate: {
          backButton: "Geri dönmek {{name}} şablon",
          subTitle: null,
          title: "{{template}}"
        },
        emailLocaleAdd: {
          backButton: "Geri dönmek {{name}} şablon",
          subTitle: null,
          title: "Şablonu düzenle - {{name}}"
        },
        emailLocaleAddWithDisplayName: {
          backButton: "Geri dönmek {{name}} şablon",
          subTitle: null,
          title: "için yeni şablon ekle {{displayName}}"
        },
        emailTemplateTypes: {
          subTitle: "Şablon türleri oluşturun ve yönetin.",
          title: "E-posta Şablonu Türleri"
        },
        emailTemplates: {
          backButton: "E-posta şablonu türlerine geri dönün",
          subTitle: null,
          title: "E-posta Şablonları"
        },
        emailTemplatesWithDisplayName: {
          backButton: "uygulamalara geri dön",
          subTitle: null,
          title: "şablonlar - {{displayName}}"
        },
        groups: {
          subTitle: "Kullanıcı grupları oluşturun ve yönetin, gruplar için izinler atayın.",
          title: "Gruplar"
        },
        invite: {
          subTitle: "Yöneticileri ve geliştiricileri davet edin ve yönetin.",
          title: "Yöneticiler"
        },
        oidcScopes: {
          subTitle: "OpenID Connect (OIDC) kapsamları ve kapsamlara bağlı öznitelikler oluşturun ve yönetin.",
          title: "OpenID Bağlantı Kapsamları"
        },
        oidcScopesEdit: {
          backButton: "Scopes'a geri dön",
          subTitle: "Kapsamın OIDC özniteliklerini ekleyin veya kaldırın",
          title: "Kapsamı düzenleyin: {{ name }}"
        },
        organizations: {
          subTitle: "Organizasyonlar oluşturun ve yönetin.",
          title: "Organizasyonlar"
        },
        overview: {
          subTitle: "Kullanıcıları, rolleri, öznitelik lehçelerini, sunucu yapılandırmalarını vb. yapılandırın ve yönetin.",
          title: "Hoş geldin, {{firstName}}"
        },
        roles: {
          subTitle: "Rolleri oluşturun ve yönetin, roller için izinler atayın.",
          title: "Roller"
        },
        rolesEdit: {
          backButton: "Geri dönmek {{type}}",
          subTitle: null,
          title: "Rolü Düzenle"
        },
        serverConfigurations: {
          subTitle: "Sunucunun genel yapılandırmalarını yönetin.",
          title: "Genel Konfigürasyonlar"
        },
        users: {
          subTitle: "Kullanıcıları, kullanıcı erişimini ve kullanıcı profillerini oluşturun ve yönetin.",
          title: "Kullanıcılar"
        },
        usersEdit: {
          backButton: "Kullanıcılara geri dön",
          subTitle: "{{name}}",
          title: "{{email}}"
        }
      },
      placeholders: {
        emptySearchResult: {
          action: "Arama sorgusunu temizle",
          subtitles: {
            "0": "\" araması için sonuç bulunamadı.{{query}}\"",
            "1": "Lütfen farklı bir arama terimi deneyin."
          },
          title: "Sonuç bulunamadı"
        },
        underConstruction: {
          action: "Anasayfaya geri dön",
          subtitles: {
            "0": "Bu sayfada bazı çalışmalar yapıyoruz.",
            "1": "Lütfen bizimle kalın ve daha sonra tekrar gelin. "
          },
          title: "Sayfa yapım aşamasında"
        }
      }
    }
  };

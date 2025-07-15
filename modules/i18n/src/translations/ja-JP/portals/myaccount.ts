/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
            SMSRecovery: {
                descriptions: {
                    add: "再設定用の携帯電話番号を追加または更新します。",
                    emptyMobile: "SMS-OTPの再設定を進めるには、携帯電話番号を設定する必要があります。",
                    update: "再設定用の携帯電話番号を更新します ({{mobile}})",
                    view: "再設定用の携帯電話番号を表示します ({{mobile}})"
                },
                forms: {
                    mobileResetForm: {
                        inputs: {
                            mobile: {
                                label: "携帯電話番号",
                                placeholder: "再設定用の携帯電話番号を入力してください。",
                                validations: {
                                    empty: "携帯電話番号を入力してください。",
                                    invalidFormat: "携帯電話番号の形式が正しくありません。"
                                }
                            }
                        }
                    }
                },
                heading: "SMS再設定",
                notifications: {
                    updateMobile: {
                        error: {
                            description: "{{description}}",
                            message: "再設定用の携帯電話番号の更新に失敗しました。"
                        },
                        genericError: {
                            description: "再設定用の携帯電話番号の更新中にエラーが発生しました",
                            message: "問題が発生しました"
                        },
                        success: {
                            description: "ユーザープロフィールの携帯電話番号が正常に更新されました",
                            message: "携帯電話番号が正常に更新されました"
                        }
                    }
                }
            },
            "codeRecovery": {
                "descriptions": {
                    "add": "コードリカバリオプションを追加または更新します"
                },
                "heading": "コード回復"
            },
            "emailRecovery": {
                "descriptions": {
                    "add": "回復メールアドレスを追加または更新します",
                    "emptyEmail": "メールの回復を続行するには、メールアドレスを構成する必要があります。",
                    "update": "リカバリメールアドレスを更新する（{{email}}）",
                    "view": "回復メールアドレスを表示（{{email}}）"
                },
                "forms": {
                    "emailResetForm": {
                        "inputs": {
                            "email": {
                                "label": "電子メールアドレス",
                                "placeholder": "回復メールアドレスを入力します",
                                "validations": {
                                    "empty": "メールアドレスを入力",
                                    "invalidFormat": "メールアドレスは正しい形式ではありません"
                                }
                            }
                        }
                    }
                },
                "heading": "メールの回復",
                "notifications": {
                    "updateEmail": {
                        "error": {
                            "description": "{{description}}",
                            "message": "回復メールの更新エラー"
                        },
                        "genericError": {
                            "description": "回復メールの更新中にエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        },
                        "success": {
                            "description": "ユーザープロファイルのメールアドレスが正常に更新されました",
                            "message": "電子メールアドレスが正常に更新されました"
                        }
                    }
                }
            },
            "preference": {
                "notifications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "回復の好みを取得するエラー"
                    },
                    "genericError": {
                        "description": "回復の好みを取得したときにエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "回復の好みを正常に取得しました",
                        "message": "回復選好の検索が成功しました"
                    }
                }
            },
            "questionRecovery": {
                "descriptions": {
                    "add": "アカウントの回復チャレンジの質問を追加または更新します"
                },
                "forms": {
                    "securityQuestionsForm": {
                        "inputs": {
                            "answer": {
                                "label": "答え",
                                "placeholder": "あなたの答えを入力してください",
                                "validations": {
                                    "empty": "答えは必須フィールドです"
                                }
                            },
                            "question": {
                                "label": "質問",
                                "placeholder": "セキュリティの質問を選択します",
                                "validations": {
                                    "empty": "少なくとも1つのセキュリティの質問を選択する必要があります"
                                }
                            }
                        }
                    }
                },
                "heading": "セキュリティの質問",
                "notifications": {
                    "addQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "セキュリティの質問を追加したときにエラーが発生しました"
                        },
                        "genericError": {
                            "description": "セキュリティの質問を追加したときにエラーが発生しました",
                            "message": "何かがうまくいかなかった。"
                        },
                        "success": {
                            "description": "必要なセキュリティの質問が正常に追加されました",
                            "message": "セキュリティの質問が正常に追加されました"
                        }
                    },
                    "updateQuestions": {
                        "error": {
                            "description": "{{description}}",
                            "message": "セキュリティの質問の更新エラー"
                        },
                        "genericError": {
                            "description": "セキュリティの質問の更新中にエラーが発生しました",
                            "message": "何かがうまくいかなかった。"
                        },
                        "success": {
                            "description": "必要なセキュリティの質問は正常に更新されました",
                            "message": "セキュリティの質問は正常に更新されました"
                        }
                    }
                }
            }
        },
        "advancedSearch": {
            "form": {
                "inputs": {
                    "filterAttribute": {
                        "label": "フィルター属性",
                        "placeholder": "例えば。名前、説明など",
                        "validations": {
                            "empty": "フィルター属性は必須フィールドです。"
                        }
                    },
                    "filterCondition": {
                        "label": "フィルター状態",
                        "placeholder": "例えば。などで始まります。",
                        "validations": {
                            "empty": "フィルター条件は必要なフィールドです。"
                        }
                    },
                    "filterValue": {
                        "label": "フィルター値",
                        "placeholder": "例えば。管理者、WSO2など",
                        "validations": {
                            "empty": "フィルター値は必須フィールドです。"
                        }
                    }
                }
            },
            "hints": {
                "querySearch": {
                    "actionKeys": "Shift + Enter",
                    "label": "クエリとして検索します"
                }
            },
            "options": {
                "header": "高度な検索"
            },
            "placeholder": "{{attribute}}で検索",
            "popups": {
                "clear": "クリア検索",
                "dropdown": "オプションを表示します"
            },
            "resultsIndicator": "クエリ「{{query}}」の結果を表示する"
        },
        "applications": {
            "advancedSearch": {
                "form": {
                    "inputs": {
                        "filterAttribute": {
                            "placeholder": "例えば。名前、説明など"
                        },
                        "filterCondition": {
                            "placeholder": "例えば。などで始まります。"
                        },
                        "filterValue": {
                            "placeholder": "検索に値を入力します"
                        }
                    }
                },
                "placeholder": "アプリケーション名で検索します"
            },
            "all": {
                "heading": "すべてのアプリケーション"
            },
            "favourite": {
                "heading": "お気に入り"
            },
            "notifications": {
                "fetchApplications": {
                    "error": {
                        "description": "{{description}}",
                        "message": "アプリケーションの取得エラー"
                    },
                    "genericError": {
                        "description": "アプリケーションを取得できませんでした",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "アプリケーションを正常に取得しました。",
                        "message": "アプリケーションの検索が成功しました"
                    }
                }
            },
            "placeholders": {
                "emptyList": {
                    "action": "リフレッシュリスト",
                    "subtitles": {
                        "0": "アプリケーションリストは空に戻りました。",
                        "1": "これは、発見可能なアプリケーションがないことが原因である可能性があります。",
                        "2": "アプリケーションの発見可能性を有効にするよう管理者に依頼してください。"
                    },
                    "title": "アプリケーションはありません"
                }
            },
            "recent": {
                "heading": "最近のアプリケーション"
            }
        },
        "changePassword": {
            "forms": {
                "passwordResetForm": {
                    "inputs": {
                        "confirmPassword": {
                            "label": "パスワードを認証する",
                            "placeholder": "新しいパスワードを入力します",
                            "validations": {
                                "empty": "パスワードが必要なフィールドであることを確認してください",
                                "mismatch": "パスワードの確認は一致しません"
                            }
                        },
                        "currentPassword": {
                            "label": "現在のパスワード",
                            "placeholder": "現在のパスワードを入力します",
                            "validations": {
                                "empty": "現在のパスワードは必須フィールドです",
                                "invalid": "現在のパスワードは無効です"
                            }
                        },
                        "newPassword": {
                            "label": "新しいパスワード",
                            "placeholder": "新しいパスワードを入力します",
                            "validations": {
                                "empty": "新しいパスワードは必須フィールドです"
                            }
                        }
                    },
                    "validations": {
                        "genericError": {
                            "description": "何かがうまくいかなかった。もう一度やり直してください",
                            "message": "パスワードエラーを変更します"
                        },
                        "invalidCurrentPassword": {
                            "description": "入力した現在のパスワードは無効であるように見えます。もう一度やり直してください",
                            "message": "パスワードエラーを変更します"
                        },
                        "invalidNewPassword": {
                            "description": "パスワードは、必要な制約を満たしません。",
                            "message": "無効なパスワード"
                        },
                        "passwordCaseRequirement": "少なくとも{{minUpperCase}}大文字と{{minLowerCase}}小文字",
                        "passwordCharRequirement": "特別なキャラクターの少なくとも{{minSpecialChr}}",
                        "passwordLengthRequirement": "{{min}}と{{max}}文字の間にある必要があります",
                        "passwordLowerCaseRequirement": "少なくとも{{minLowerCase}}小文字の文字",
                        "passwordNumRequirement": "少なくとも{{min}}番号",
                        "passwordRepeatedChrRequirement": "{{repeatedChr}}繰り返される文字以下",
                        "passwordUniqueChrRequirement": "少なくとも{{uniqueChr}}ユニークな文字",
                        "passwordUpperCaseRequirement": "少なくとも{{minUpperCase}}大文字",
                        "submitError": {
                            "description": "{{description}}",
                            "message": "パスワードエラーを変更します"
                        },
                        "submitSuccess": {
                            "description": "パスワードは正常に変更されました",
                            "message": "パスワードリセットが成功しました"
                        },
                        "validationConfig": {
                            "error": {
                                "description": "{{description}}",
                                "message": "検索エラー"
                            },
                            "genericError": {
                                "description": "検証構成データを取得できませんでした。",
                                "message": "何かがうまくいかなかった"
                            }
                        }
                    }
                }
            },
            "modals": {
                "confirmationModal": {
                    "heading": "確認",
                    "message": "パスワードを変更すると、現在のセッションが終了します。新しく変更されたパスワードでログインする必要があります。続けたいですか？"
                }
            }
        },
        "consentManagement": {
            "editConsent": {
                "collectionMethod": "収集方法",
                "dangerZones": {
                    "revoke": {
                        "actionTitle": "取り消す",
                        "header": "同意を取り消します",
                        "subheader": "このアプリケーションに再度同意する必要があります。"
                    }
                },
                "description": "説明",
                "piiCategoryHeading": "お客様の個人情報の収集と共有の同意をアプリケーションで管理します。[変更]ボタンを[変更]ボタンを押して[変更]ボタンを保存するか、すべての属性の同意を削除するために[更新]ボタンを押して[更新]ボタンを押す必要がある属性を外します。",
                "state": "州",
                "version": "バージョン"
            },
            "modals": {
                "consentRevokeModal": {
                    "heading": "本気ですか？",
                    "message": "この操作は可逆的ではありません。これは、すべての属性の同意を永久に取り除きます。先に進みたいですか？",
                    "warning": "ログイン同意ページにリダイレクトされることに注意してください"
                }
            },
            "notifications": {
                "consentReceiptFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "何かがうまくいかなかった"
                    },
                    "genericError": {
                        "description": "選択したアプリケーションに情報をロードできませんでした",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "同意の領収書を正常に取得しました",
                        "message": "成功した検索"
                    }
                },
                "consentedAppsFetch": {
                    "error": {
                        "description": "{{description}}",
                        "message": "何かがうまくいかなかった"
                    },
                    "genericError": {
                        "description": "同意されたアプリケーションのリストをロードできませんでした",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "同意されたアプリケーションリストを正常に取得しました",
                        "message": "成功した検索"
                    }
                },
                "revokeConsentedApp": {
                    "error": {
                        "description": "{{description}}",
                        "message": "取り消しエラーに同意します"
                    },
                    "genericError": {
                        "description": "申請の同意を取り消すことができませんでした",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "アプリケーションの同意は正常に取り消されました",
                        "message": "同意して成功を取り消します"
                    }
                },
                "updateConsentedClaims": {
                    "error": {
                        "description": "{{description}}",
                        "message": "何かがうまくいかなかった"
                    },
                    "genericError": {
                        "description": "同意された請求は、アプリケーションの更新に失敗しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "同意された請求は、アプリケーションのために正常に更新されました",
                        "message": "同意された請求は正常に更新されました"
                    }
                }
            }
        },
        "cookieConsent": {
            "confirmButton": "わかった",
            "content": "Cookieを使用して、最高の全体的な体験を確実に得ることができます。これらのCookieは、スムーズでパーソナライズされたサービスを提供しながら、途切れない連続セッションを維持するために使用されます。Cookieの使用方法の詳細については、<1> Cookieポリシーを参照してください。"
        },
        "federatedAssociations": {
            "deleteConfirmation": "これにより、ローカルアカウントからリンクされたソーシャルアカウントが削除されます。削除を続けたいですか？",
            "notifications": {
                "getFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "何かがうまくいかなかった"
                    },
                    "genericError": {
                        "description": "リンクされたソーシャルアカウントを取得できませんでした",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "リンクされたソーシャルアカウントは正常に取得されました",
                        "message": "リンクされたソーシャルアカウントは正常に取得されました"
                    }
                },
                "removeAllFederatedAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "何かがうまくいかなかった"
                    },
                    "genericError": {
                        "description": "リンクされたソーシャルアカウントを削除できませんでした",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "リンクされたすべてのソーシャルアカウントは正常に削除されました",
                        "message": "リンクされたソーシャルアカウントは正常に削除されました"
                    }
                },
                "removeFederatedAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "何かがうまくいかなかった"
                    },
                    "genericError": {
                        "description": "リンクされたソーシャルアカウントを削除できませんでした",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "リンクされたソーシャルアカウントは正常に削除されました",
                        "message": "リンクされたソーシャルアカウントは正常に削除されました"
                    }
                }
            }
        },
        "footer": {
            "copyright": "WSO2 Identity Server©{{year}}"
        },
        "header": {
            "appSwitch": {
                "console": {
                    "description": "開発者または管理者として管理します",
                    "name": "コンソール"
                },
                "myAccount": {
                    "description": "独自のアカウントを管理します",
                    "name": "私のアカウント"
                },
                "tooltip": "アプリ"
            },
            "dropdown": {
                "footer": {
                    "cookiePolicy": "クッキー",
                    "privacyPolicy": "プライバシー",
                    "termsOfService": "利用規約"
                }
            },
            "organizationLabel": "このアカウントはによって管理されています"
        },
        "linkedAccounts": {
            "accountTypes": {
                "local": {
                    "label": "ローカルユーザーアカウントを追加します"
                }
            },
            "deleteConfirmation": "これにより、アカウントからリンクされたアカウントが削除されます。削除を続けたいですか？",
            "forms": {
                "addAccountForm": {
                    "inputs": {
                        "password": {
                            "label": "パスワード",
                            "placeholder": "パスワードを入力します",
                            "validations": {
                                "empty": "パスワードは必須フィールドです"
                            }
                        },
                        "username": {
                            "label": "ユーザー名",
                            "placeholder": "ユーザー名を入力します",
                            "validations": {
                                "empty": "ユーザー名は必須フィールドです"
                            }
                        }
                    }
                }
            },
            "notifications": {
                "addAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "リンクされたユーザーアカウントの取得エラー"
                    },
                    "genericError": {
                        "description": "リンクされたアカウントを追加したときにエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "必要なリンクされたユーザーアカウントが正常に追加されました",
                        "message": "リンクされたユーザーアカウントが正常に追加されました"
                    }
                },
                "getAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "リンクされたユーザーアカウントの取得エラー"
                    },
                    "genericError": {
                        "description": "リンクされたユーザーアカウントの取得中にエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "必要なユーザープロファイルの詳細は正常に取得されます",
                        "message": "リンクされたユーザーアカウントは正常に取得されました"
                    }
                },
                "removeAllAssociations": {
                    "error": {
                        "description": "{{description}}",
                        "message": "リンクされたユーザーアカウントの削除エラー"
                    },
                    "genericError": {
                        "description": "リンクされたユーザーアカウントの削除中にエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "すべてのリンクされたユーザーアカウントが削除されました",
                        "message": "リンクされたアカウントが正常に削除されました"
                    }
                },
                "removeAssociation": {
                    "error": {
                        "description": "{{description}}",
                        "message": "リンクされたユーザーアカウントの削除エラー"
                    },
                    "genericError": {
                        "description": "リンクされたユーザーアカウントの削除中にエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "リンクされたユーザーアカウントが削除されました",
                        "message": "リンクされたアカウントは正常に削除されました"
                    }
                },
                "switchAccount": {
                    "error": {
                        "description": "{{description}}",
                        "message": "アカウントの切り替え中にエラーが発生しました"
                    },
                    "genericError": {
                        "description": "アカウントの切り替え中にエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "アカウントは正常に切り替えられました",
                        "message": "アカウントが正常に切り替えられました"
                    }
                }
            }
        },
        "loginVerifyData": {
            "description": "このデータは、ログイン中にあなたの身元をさらに検証するために使用されます",
            "heading": "ログインを確認するために使用されるデータ",
            "modals": {
                "clearTypingPatternsModal": {
                    "heading": "確認",
                    "message": "このアクションは、typingDNAに保存されているタイピングパターンをクリアします。続けたいですか？"
                }
            },
            "notifications": {
                "clearTypingPatterns": {
                    "error": {
                        "description": "入力パターンをクリアできませんでした。サイト管理者に連絡してください",
                        "message": "タイピングパターンをクリアできませんでした"
                    },
                    "success": {
                        "description": "TypingDNAのタイピングパターンは正常にクリアされました",
                        "message": "入力パターンは正常にクリアされました"
                    }
                }
            },
            "typingdna": {
                "description": "ここから入力パターンをクリアできます",
                "heading": "typingDNAタイピングパターン"
            }
        },
        "mfa": {
            "authenticatorApp": {
                "addHint": "構成、設定",
                "configuredDescription": "2要素認証のために、構成されたAuthenticatorアプリのTOTPコードを使用できます。アプリケーションにアクセスできない場合は、ここから新しいAuthenticatorアプリを設定できます。",
                "deleteHint": "取り除く",
                "description": "Authenticatorアプリを使用して、2要素認証のために確認コードを取得できます。",
                "enableHint": "TOTP Authenticatorを有効/無効にします",
                "heading": "TOTP認証器",
                "hint": "ビュー",
                "modals": {
                    "delete": {
                        "heading": "確認",
                        "message": "このアクションにより、プロファイルに追加されたQRコードが削除されます。続けたいですか？"
                    },
                    "done": "成功！これで、2要素認証に認証アプリを使用できます",
                    "heading": "Authenticatorアプリを設定します",
                    "scan": {
                        "additionNote": "QRコードはプロフィールに正常に追加されました！",
                        "authenticatorApps": "Authenticatorアプリ",
                        "generate": "新しいコードを生成します",
                        "heading": "Authenticatorアプリを使用して、以下のQRコードをスキャンします",
                        "messageBody": "ここでは、Authenticatorアプリのリストを見つけることができます。",
                        "messageHeading": "Authenticatorアプリをインストールしていませんか？",
                        "regenerateConfirmLabel": "新しいQRコードの再生を確認します",
                        "regenerateWarning": {
                            "extended": "新しいQRコードを再生するときは、スキャンして認証アプリを再設定する必要があります。以前のQRコードでログインすることはできません。",
                            "generic": "新しいQRコードを再生するときは、スキャンして認証アプリを再設定する必要があります。以前のセットアップはもう機能しません。"
                        }
                    },
                    "toolTip": "Authenticatorアプリを持っていませんか？<1> App Storeまたは<3> Google PlayからGoogle Authenticatorのような認証アプリをダウンロードする",
                    "verify": {
                        "error": "検証に失敗しました。もう一度やり直してください。",
                        "heading": "検証のために生成されたコードを入力します",
                        "label": "検証コード",
                        "placeholder": "確認コードを入力します",
                        "reScan": "再スキャン",
                        "reScanQuestion": "QRコードをもう一度スキャンしたいですか？",
                        "requiredError": "確認コードを入力します"
                    }
                },
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "QRコードの削除中にエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "正常に削除されました",
                        "message": "TOTP構成を正常に削除しました。"
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "QRコードの取得中にエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "新しいQRコードを取得しようとしているときにエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "有効な認証リストを更新しようとしているときにエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    }
                },
                "regenerate": "再生"
            },
            "backupCode": {
                "actions": {
                    "add": "バックアップコードを追加します",
                    "delete": "バックアップコードを削除します"
                },
                "description": "バックアップコードを使用して、マルチファクター認証コードを受信できない場合にアカウントにアクセスします。必要に応じて、新しいコードを再生できます。",
                "download": {
                    "heading": "{{productName}}のバックアップコード",
                    "info1": "各バックアップコードは1回しか使用できません。",
                    "info2": "これらのコードはで生成されました",
                    "subHeading": "これらのバックアップコードを使用して、携帯電話から離れているときに{{productName}}にサインインできます。これらのバックアップコードをどこかに安全ですが、アクセスしやすい場所に保管してください。"
                },
                "heading": "バックアップコード",
                "messages": {
                    "disabledMessage": "バックアップコードを有効にするように、少なくとも1つの追加の認証器を構成する必要があります。"
                },
                "modals": {
                    "actions": {
                        "copied": "コピー",
                        "copy": "コードをコピーします",
                        "download": "コードをダウンロードします",
                        "regenerate": "再生"
                    },
                    "delete": {
                        "description": "このアクションはバックアップコードを削除し、それらを使用できなくなります。続けたいですか？",
                        "heading": "確認"
                    },
                    "description": "バックアップコードを使用して、携帯電話から離れているときにサインインします。",
                    "generate": {
                        "description": "すべてのバックアップコードが使用されます。バックアップコードの新しいセットを生成します",
                        "heading": "生成する"
                    },
                    "heading": "バックアップコード",
                    "info": "各コードは1回しか使用できません。これらを置き換えるために、いつでも新しいコードを生成できます。",
                    "regenerate": {
                        "description": "新しいコードを生成した後、古いコードは機能しなくなります。生成されたら、必ず新しいコードを保存してください。",
                        "heading": "確認"
                    },
                    "subHeading": "サインインするために使用できる1回限りのパスコード",
                    "warn": "これらのコードは一度だけ表示されます。今すぐ保存して、どこかに安全だがアクセスしやすい場所に保管してください。"
                },
                "mutedHeader": "回復オプション",
                "notifications": {
                    "deleteError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "バックアップコードの削除中にエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    },
                    "deleteSuccess": {
                        "genericMessage": "正常に削除されました",
                        "message": "バックアップコードを正常に削除しました。"
                    },
                    "downloadError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "バックアップコードをダウンロードしようとしているときにエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    },
                    "downloadSuccess": {
                        "genericMessage": {
                            "description": "バックアップコードは正常にダウンロードされます。",
                            "message": "バックアップコードは正常にダウンロードされました。"
                        },
                        "message": {
                            "description": "{{メッセージ}}",
                            "message": "バックアップコードは正常にダウンロードされました。"
                        }
                    },
                    "refreshError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "新しいバックアップコードを生成しようとしているときにエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    },
                    "retrieveAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "有効化されたAuthenticatorリストを取得しようとしているときにエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    },
                    "retrieveError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "バックアップコードの取得中にエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    },
                    "updateAuthenticatorError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "何かがうまくいかなかった"
                        },
                        "genericError": {
                            "description": "有効な認証リストを更新しようとしているときにエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        }
                    }
                },
                "remaining": "残り"
            },
            "fido": {
                "description": "<1>パスキー<1> FIDOセキュリティキー、または<1>バイオメトリクスを使用して、アカウントにサインインできます。",
                "form": {
                    "label": "パスキー",
                    "placeholder": "パスキーの名前を入力します",
                    "remove": "パスキーを削除します",
                    "required": "パスキーの名前を入力してください"
                },
                "heading": "パスキー",
                "modals": {
                    "deleteConfirmation": {
                        "assertionHint": "アクションを確認してください。",
                        "content": "この操作は元に戻すことができず、パスキーが完全に削除されます。",
                        "description": "このパスキーを削除すると、アカウントに再度サインインできなくなる可能性があります。 慎重に進めてください。",
                        "heading": "本気ですか？"
                    },
                    "deviceRegistrationErrorModal": {
                        "description": "パスキーの登録が中断されました。 これが意図的でない場合は、フローを再試行できます。",
                        "heading": "パスキーの登録に失敗しました",
                        "tryWithOlderDevice": "古いパスキーを使用して再試行することもできます。"
                    }
                },
                "noPassKeyMessage": "まだパスキーが登録されていません。",
                "notifications": {
                    "removeDevice": {
                        "error": {
                            "description": "{{description}}",
                            "message": "パスキーの削除中にエラーが発生しました"
                        },
                        "genericError": {
                            "description": "パスキーの削除中にエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        },
                        "success": {
                            "description": "パスキーがリストから正常に削除されました",
                            "message": "パスキーは正常に削除されました"
                        }
                    },
                    "startFidoFlow": {
                        "error": {
                            "description": "{{description}}",
                            "message": "パスキーの取得中にエラーが発生しました"
                        },
                        "genericError": {
                            "description": "パスキーの取得中にエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        },
                        "success": {
                            "description": "パスキーが正常に登録されたので、認証に使用できるようになりました。",
                            "message": "パスキーが正常に登録されました"
                        }
                    },
                    "updateDeviceName": {
                        "error": {
                            "description": "{{description}}",
                            "message": "パスキー名の更新中にエラーが発生しました"
                        },
                        "genericError": {
                            "description": "パスキー名の更新中にエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        },
                        "success": {
                            "description": "パスキーの名前が正常に更新されました",
                            "message": "パスキー名が正常に更新されました"
                        }
                    }
                },
                "tryButton": "古いパスキーで試してください"
            },
            "pushAuthenticatorApp": {
                "addHint": "設定する",
                "configuredDescription": "設定済みのプッシュ認証アプリから生成されたログインプロンプトを使用して、二要素認証を行うことができます。アプリにアクセスできない場合は、ここから新しい認証アプリを設定できます。",
                "deleteHint": "削除",
                "description": "プッシュ認証アプリを使用して、二要素認証のためのログインプロンプトをプッシュ通知として受け取ることができます。",
                "heading": "プッシュ認証アプリ",
                "hint": "表示",
                "modals": {
                    "deviceDeleteConfirmation": {
                        "assertionHint": "アクションを確認してください。",
                        "content": "この操作は元に戻せず、デバイスが完全に削除されます。",
                        "description": "このデバイスを削除すると、再度アカウントにサインインできなくなる可能性があります。慎重に操作してください。",
                        "heading": "本当に削除しますか？"
                    },
                    "scan": {
                        "additionNote": "QRコードがプロフィールに正常に追加されました！",
                        "done": "成功しました！これで、プッシュ認証アプリを使用して二要素認証を行うことができます。",
                        "heading": "プッシュ認証アプリを設定する",
                        "messageBody": "利用可能な認証アプリのリストはこちらで確認できます。",
                        "subHeading": "プッシュ認証アプリを使用して、以下のQRコードをスキャンしてください"
                    }
                },
                "notifications": {
                    "delete": {
                        "error": {
                            "description": "{{error}}",
                            "message": "問題が発生しました"
                        },
                        "genericError": {
                            "description": "登録されたデバイスの削除中にエラーが発生しました",
                            "message": "問題が発生しました"
                        },
                        "success": {
                            "description": "登録されたデバイスが正常に削除されました",
                            "message": "デバイスが正常に削除されました"
                        }
                    },
                    "deviceListFetchError": {
                        "error": {
                            "description": "プッシュ認証用の登録されたデバイスを取得中にエラーが発生しました",
                            "message": "問題が発生しました"
                        }
                    },
                    "initError": {
                        "error": {
                            "description": "{{error}}",
                            "message": "問題が発生しました"
                        },
                        "genericError": {
                            "description": "QRコードの取得中にエラーが発生しました",
                            "message": "問題が発生しました"
                        }
                    }
                }
            },
            "smsOtp": {
                "descriptions": {
                    "hint": "1回限りの検証コードを含むテキストメッセージが届きます"
                },
                "heading": "Mobile number",
                "notifications": {
                    "updateMobile": {
                        "error": {
                            "description": "{{description}}",
                            "message": "携帯電話番号の更新中にエラーが発生しました"
                        },
                        "genericError": {
                            "description": "携帯電話番号の更新中にエラーが発生しました",
                            "message": "何かがうまくいかなかった"
                        },
                        "success": {
                            "description": "ユーザープロファイルの携帯電話番号が正常に更新されます",
                            "message": "携帯電話番号は正常に更新されました"
                        }
                    }
                }
            }
        },
        "mobileUpdateWizard": {
            "done": "成功！携帯電話番号は正常に検証されています。",
            "notifications": {
                "resendError": {
                    "error": {
                        "description": "{{error}}",
                        "message": "何かがうまくいかなかった"
                    },
                    "genericError": {
                        "description": "新しい検証コードを取得しようとしているときにエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    }
                },
                "resendSuccess": {
                    "message": "再送信コードリクエストは正常に送信されます"
                }
            },
            "submitMobile": {
                "heading": "新しい携帯電話番号を入力します"
            },
            verificationSent: {
                heading: "あなたはまもなく検証のためにあなたの携帯電話番号にOTPを受け取ります"
            },
            "verifySmsOtp": {
                "didNotReceive": "コードを受け取っていませんか?",
                "error": "検証に失敗しました。もう一度やり直してください。",
                "heading": "携帯電話番号を確認する",
                "label": "携帯電話番号に送信された検証コードを入力してください",
                "placeholder": "確認コードを入力します",
                "requiredError": "確認コードを入力します",
                "resend": "再送信"
            }
        },
        "overview": {
            "widgets": {
                "accountActivity": {
                    "actionTitles": {
                        "update": "アカウントのアクティビティを管理します"
                    },
                    "description": "現在、次のデバイスからログインしています",
                    "header": "アクティブセッション"
                },
                "accountSecurity": {
                    "actionTitles": {
                        "update": "アカウントのセキュリティを更新します"
                    },
                    "description": "アカウントを安全に保つのに役立つ設定と推奨事項",
                    "header": "アカウントのセキュリティ"
                },
                "accountStatus": {
                    "complete": "あなたのプロフィールは完了しています",
                    "completedFields": "完成したフィールド",
                    "completionPercentage": "あなたのプロファイルの完了は{{percentage}}％です",
                    "inComplete": "プロフィールを完成させます",
                    "inCompleteFields": "不完全なフィールド",
                    "mandatoryFieldsCompletion": "{{completed}} {{{total}}必須フィールドが完了しました",
                    "optionalFieldsCompletion": "{{completed}} {{{total}}オプションのフィールドが完了しました"
                },
                "consentManagement": {
                    "actionTitles": {
                        "manage": "同意を管理します"
                    },
                    "description": "共有するデータをアプリケーションと制御します",
                    "header": "コントロールの同意"
                },
                "profileStatus": {
                    "completionPercentage": "あなたのプロファイルの完了は{{percentage}}％です",
                    "description": "プロフィールを管理します",
                    "header": "あなたの{{productName}}プロファイル",
                    "profileText": "あなたの個人的なプロフィールの詳細",
                    "readOnlyDescription": "あなたのプロフィールを表示します",
                    "userSourceText": "（{{source}}経由でサインアップ）"
                }
            }
        },
        "profile": {
            actions: {
                "deleteEmail": "メールアドレスを削除",
                "deleteMobile": "モバイルを削除",
                "verifyEmail": "メールアドレスの確認",
                "verifyMobile": "モバイルの確認"
            },
            "fields": {
                "Account Confirmed Time": "アカウントが確認された時間",
                "Account Disabled": "アカウントが無効になっています",
                "Account Locked": "アカウントがロックされました",
                "Account State": "アカウント状態",
                "Active": "アクティブ",
                "Address - Street": "アドレスストリート",
                "Ask Password": "パスワードを尋ねます",
                "Backup Code Enabled": "バックアップコードが有効になっています",
                "Backup Codes": "バックアップコード",
                "Birth Date": "生年月日",
                "Country": "国",
                "Created Time": "作成された時間",
                "Disable EmailOTP": "emailotpを無効にします",
                "Disable SMSOTP": "SMSOTPを無効にします",
                "Display Name": "表示名",
                "Email": "Eメール",
                "Email Addresses": "メールアドレス",
                "Email Verified": "検証済みのメール",
                "Enabled Authenticators": "有効化された認証機",
                "Existing Lite User": "既存のLiteユーザー",
                "External ID": "外部ID",
                "Failed Attempts Before Success": "成功前の試みに失敗しました",
                "Failed Backup Code Attempts": "バックアップコードの試行に失敗しました",
                "Failed Email OTP Attempts": "メールOTPの試行に失敗しました",
                "Failed Lockout Count": "ロックアウトカウントに失敗しました",
                "Failed Login Attempts": "ログインの試行に失敗しました",
                "Failed Password Recovery Attempts": "パスワード回復の試みに失敗しました",
                "Failed SMS OTP Attempts": "SMS OTPの試みに失敗しました",
                "Failed TOTP Attempts": "失敗したTOTPの試み",
                "First Name": "ファーストネーム",
                "Force Password Reset": "パスワードリセットを強制します",
                "Full Name": "フルネーム",
                "Gender": "性別",
                "Groups": "グループ",
                "Identity Provider Type": "IDプロバイダータイプ",
                "Last Logon": "最後のログオン",
                "Last Modified Time": "最後の変更時間",
                "Last Name": "苗字",
                "Last Password Update": "最後のパスワードの更新",
                "Lite User": "ライトユーザー",
                "Lite User ID": "LiteユーザーID",
                "Local": "地元",
                "Local Credential Exists": "ローカル資格が存在します",
                "Locality": "地域",
                "Location": "位置",
                "Locked Reason": "ロックされた理由",
                "Manager - Name": "マネージャー - 名前",
                "Middle Name": "ミドルネーム",
                "Mobile": "携帯",
                "Mobile Numbers": "携帯電話番号",
                "Nick Name": "ニックネーム",
                "Phone Verified": "電話が検証された",
                "Photo - Thumbnail": "写真 - サムネイル",
                "Photo URL": "写真URL",
                "Postal Code": "郵便番号",
                "Preferred Channel": "優先チャネル",
                "Read Only User": "ユーザーのみを読んでください",
                "Region": "地域",
                "Resource Type": "リソースタイプ",
                "Roles": "役割",
                "Secret Key": "秘密の鍵",
                "TOTP Enabled": "TOTPが有効になっています",
                "Time Zone": "タイムゾーン",
                "URL": "URL",
                "Unlock Time": "時間を解除します",
                "User Account Type": "ユーザーアカウントタイプ",
                "User ID": "ユーザーID",
                "User Metadata - Version": "ユーザーメタデータ - バージョン",
                "User Source": "ユーザーソース",
                "User Source ID": "ユーザーソースID",
                "Username": "ユーザー名",
                "Verification Pending Email": "検証保留中のメール",
                "Verification Pending Mobile Number": "携帯電話番号が保留中の検証",
                "Verified Email Addresses": "検証済みのメールアドレス",
                "Verified Mobile Numbers": "検証済みの携帯電話番号",
                "Verify Email": "Eメールを確認します",
                "Verify Mobile": "モバイルを確認します",
                "Verify Secret Key": "シークレットキーを確認します",
                "Website URL": "ウェブサイトのURL",
                "emails": "Eメール",
                "generic": {
                    "default": "{{fieldName}}を追加します"
                },
                "nameFamilyName": "苗字",
                "nameGivenName": "ファーストネーム",
                "phoneNumbers": "電話番号",
                "profileImage": "プロファイル画像",
                "profileUrl": "URL",
                "userName": "ユーザー名"
            },
            "forms": {
                "countryChangeForm": {
                    "inputs": {
                        "country": {
                            "placeholder": "あなたの国を選択"
                        }
                    }
                },
                "dateChangeForm": {
                    "inputs": {
                        "date": {
                            "validations": {
                                "futureDateError": "{{{field}}フィールドに入力した日付は無効です。",
                                "invalidFormat": "yyyy-mm-ddの形式に有効な{{fieldName}}を入力してください。"
                            }
                        }
                    }
                },
                "emailChangeForm": {
                    "inputs": {
                        "email": {
                            "label": "Eメール",
                            "note": "注：これを編集すると、このアカウントに関連付けられているメールアドレスが変更されます。このメールアドレスは、アカウントの回復にも使用されます。",
                            "placeholder": "メールアドレスを入力してください",
                            "validations": {
                                "empty": "メールアドレスは必要なフィールドです",
                                "invalidFormat": "有効なメールアドレスを入力してください。英数字、Unicode文字、アンダースコア（_）、ダッシュ（ - ）、周期（。）、およびaTサイン（@）を使用できます。"
                            }
                        }
                    }
                },
                "generic": {
                    "inputs": {
                        "placeholder": "{{fieldName}}を入力します",
                        "readonly": {
                            "placeholder": "この値は空です",
                            "popup": "管理者に連絡して{{fieldName}}を更新します"
                        },
                        "validations": {
                            "empty": "{{fieldName}}は必須フィールドです",
                            "invalidFormat": "入力された{{fieldName}}の形式は正しくありません"
                        }
                    }
                },
                "mobileChangeForm": {
                    "inputs": {
                        "mobile": {
                            "label": "携帯電話番号",
                            "note": "注：これにより、プロフィールの携帯電話番号が変更されます",
                            "placeholder": "携帯番号を入力してください",
                            "validations": {
                                "empty": "携帯電話番号は必須フィールドです",
                                "invalidFormat": "Format [+] [Country Code] [市外コード] [ローカル電話番号]に有効な携帯電話番号を入力してください。"
                            }
                        }
                    }
                },
                "nameChangeForm": {
                    "inputs": {
                        "firstName": {
                            "label": "ファーストネーム",
                            "placeholder": "名を入力します",
                            "validations": {
                                "empty": "名は必須フィールドです"
                            }
                        },
                        "lastName": {
                            "label": "苗字",
                            "placeholder": "姓を入力します",
                            "validations": {
                                "empty": "姓は必須フィールドです"
                            }
                        }
                    }
                },
                "organizationChangeForm": {
                    "inputs": {
                        "organization": {
                            "label": "組織",
                            "placeholder": "組織に入ります",
                            "validations": {
                                "empty": "組織は必要な分野です"
                            }
                        }
                    }
                }
            },
            "messages": {
                "emailConfirmation": {
                    "content": "プロフィールに新しいメールを追加するために、メールアドレスの更新を確認してください。",
                    "header": "保留中の確認！"
                },
                "mobileVerification": {
                    "content": "この携帯電話番号は、2番目の因子認証が有効になったときにSMS OTPを送信し、ユーザー名/パスワードの回復の場合のリカバリコードを送信するために使用されます。この番号を更新するには、新しい番号に送信された検証コードを入力して、新しい番号を確認する必要があります。続行する場合は、[更新]をクリックします。"
                }
            },
            modals: {
                customMultiAttributeDeleteConfirmation: {
                    assertionHint: "あなたの行動を確認してください。",
                    content: "この操作は元に戻すことができず、選択した値が完全に削除されます。",
                    description: "選択した値を削除すると、プロフィールから完全に削除されます。",
                    heading: "本気ですか？"
                },
                emailAddressDeleteConfirmation: {
                    assertionHint: "あなたの行動を確認してください。",
                    content: "このアクションは不可逆的であり、メールアドレスを永久に削除します。",
                    description: "このメールアドレスを削除すると、プロファイルから永続的に削除されます。",
                    heading: "本気ですか？"
                },
                mobileNumberDeleteConfirmation: {
                    assertionHint: "あなたの行動を確認してください。",
                    content: "このアクションは不可逆的であり、携帯電話番号を永久に削除します。",
                    description: "この携帯電話番号を削除すると、プロファイルから永久に削除されます。",
                    heading: "本気ですか？"
                }
            },
            "notifications": {
                "getProfileCompletion": {
                    "error": {
                        "description": "{{description}}",
                        "message": "エラーが発生しました"
                    },
                    "genericError": {
                        "description": "プロファイルの完了の評価中にエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "プロファイルの完了は正常に評価されました",
                        "message": "計算が成功しました"
                    }
                },
                "getProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "プロファイルの詳細を取得している間にエラーが発生しました"
                    },
                    "genericError": {
                        "description": "プロファイルの詳細を取得している間にエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "必要なユーザープロファイルの詳細は正常に取得されます",
                        "message": "ユーザープロファイルを正常に取得しました"
                    }
                },
                "getUserReadOnlyStatus": {
                    "genericError": {
                        "description": "ユーザーの読み取り専用ステータスを取得している間にエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    }
                },
                "updateProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "プロファイルの詳細の更新中にエラーが発生しました"
                    },
                    "genericError": {
                        "description": "プロファイルの詳細の更新中にエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "必要なユーザープロファイルの詳細が正常に更新されました",
                        "message": "ユーザープロファイルは正常に更新されました"
                    }
                },
                verifyEmail: {
                    error: {
                        description: "{{description}}",
                        message: "検証メールの送信中にエラーが発生しました"
                    },
                    genericError: {
                        description: "検証メールの送信中にエラーが発生しました",
                        message: "何かがうまくいかなかった"
                    },
                    success: {
                        description: "検証メールが正常に送信されました。受信トレイを確認してください",
                        message: "確認メールが正常に送信されました"
                    }
                },
                verifyMobile: {
                    error: {
                        description: "{{description}}",
                        message: "検証コードの送信中にエラーが発生しました"
                    },
                    genericError: {
                        description: "検証コードの送信中にエラーが発生しました",
                        message: "何かがうまくいかなかった"
                    },
                    success: {
                        description: "検証コードが正常に送信されました。携帯電話を確認してください",
                        message: "検証コードが正常に送信されました"
                    }
                }
            },
            "placeholders": {
                "SCIMDisabled": {
                    "heading": "この機能はアカウントでは利用できません"
                }
            }
        },
        "profileExport": {
            "notifications": {
                "downloadProfileInfo": {
                    "error": {
                        "description": "{{description}}",
                        "message": "ユーザープロファイルの詳細のダウンロード中にエラーが発生しました"
                    },
                    "genericError": {
                        "description": "ユーザープロファイルの詳細のダウンロード中にエラーが発生しました",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "必要なユーザープロファイルの詳細を含むファイルはダウンロードを開始しました",
                        "message": "ユーザープロファイルの詳細ダウンロード開始"
                    }
                }
            }
        },
        selfSignUp: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "セルフサインアップ設定の取得エラー"
                    },
                    genericError: {
                        description: "セルフサインアップ設定の取得中にエラーが発生しました。",
                        message: "問題が発生しました。"
                    },
                    success: {
                        description: "セルフサインアップ設定を正常に取得しました。",
                        message: "セルフサインアップ設定の取得に成功しました。"
                    }
                }
            }
        },
        systemNotificationAlert: {
            resend: "再送信",
            selfSignUp: {
                awaitingAccountConfirmation: "アカウントはまだ有効ではありません。登録されたメールアドレスに有効化（アクティベーション）リンクを送信しました。新しいリンクが必要ですか？",
                notifications: {
                    resendError: {
                        description: "アカウント確認メールの再送信中にエラーが発生しました。",
                        message: "問題が発生しました。"
                    },
                    resendSuccess: {
                        description: "アカウント確認メールを正常に再送信しました。",
                        message: "アカウント確認メールの再送信に成功しました。"
                    }
                }
            }
        },
        "userAvatar": {
            "infoPopover": "この画像は、<1>グラバタールサービスから取得されました。",
            "urlUpdateHeader": "画像URLを入力して、プロフィール画像を設定します"
        },
        "userSessions": {
            "browserAndOS": "{{browser}} on {{os}} {{version}}",
            "dangerZones": {
                "terminate": {
                    "actionTitle": "終了します",
                    "header": "セッションを終了します",
                    "subheader": "特定のデバイス上のセッションからログアウトされます。"
                }
            },
            "lastAccessed": "最後にアクセス{{date}}",
            "modals": {
                "terminateActiveUserSessionModal": {
                    "heading": "現在のアクティブセッションを終了します",
                    "message": "セカンドファクター認証（2FA）オプションの変更は、アクティブセッションには適用されません。それらを終了することをお勧めします。",
                    "primaryAction": "すべてを終了します",
                    "secondaryAction": "レビューして終了します"
                },
                "terminateAllUserSessionsModal": {
                    "heading": "確認",
                    "message": "アクションは、このセッションとすべてのデバイスの他のすべてのセッションからあなたをログアウトします。続けたいですか？"
                },
                "terminateUserSessionModal": {
                    "heading": "確認",
                    "message": "このアクションは、特定のデバイス上のセッションからログアウトします。続けたいですか？"
                }
            },
            "notifications": {
                "fetchSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "アクティブセッションの取得エラー"
                    },
                    "genericError": {
                        "description": "アクティブなセッションを取得できませんでした",
                        "message": "何かがうまくいかなかった"
                    },
                    "success": {
                        "description": "アクティブセッションを正常に取得しました",
                        "message": "アクティブなセッション検索が成功しました"
                    }
                },
                "terminateAllUserSessions": {
                    "error": {
                        "description": "{{description}}",
                        "message": "アクティブセッションを終了できませんでした"
                    },
                    "genericError": {
                        "description": "アクティブなセッションを終了している間、何かがうまくいかなかった",
                        "message": "アクティブセッションを終了できませんでした"
                    },
                    "success": {
                        "description": "すべてのアクティブセッションを正常に終了しました",
                        "message": "すべてのアクティブセッションを終了しました"
                    }
                },
                "terminateUserSession": {
                    "error": {
                        "description": "{{description}}",
                        "message": "アクティブなセッションを終了できませんでした"
                    },
                    "genericError": {
                        "description": "アクティブなセッションを終了している間、何かがうまくいかなかった",
                        "message": "アクティブなセッションを終了できませんでした"
                    },
                    "success": {
                        "description": "アクティブセッションを正常に終了しました",
                        "message": "セッションは成功を終了します"
                    }
                }
            }
        },
        verificationOnUpdate: {
            preference: {
                notifications: {
                    error: {
                        description: "{{description}}",
                        message: "更新設定の検証を取得中にエラーが発生しました"
                    },
                    genericError: {
                        description: "更新設定の検証を取得中にエラーが発生しました",
                        message: "何か問題が発生しました"
                    },
                    success: {
                        description: "更新設定の検証を正常に取得しました",
                        message: "更新設定の取得の検証が成功しました"
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
                            "content": "選択した電子メールはGravatarに登録されていないようです。Gravatarの公式<1>WebサイトにアクセスしてGravatar</1>アカウントにサインアップするか、次のいずれかを使用してください。",
                            "header": "一致するグラバータルの画像は見つかりません！"
                        }
                    },
                    "heading": "に基づくグラバタル"
                },
                "hostedAvatar": {
                    "heading": "ホストされた画像",
                    "input": {
                        "errors": {
                            "http": {
                                "content": "選択したURLは、HTTPを介して提供される安全でない画像を指します。注意して進めてください。",
                                "header": "不安なコンテンツ！"
                            },
                            "invalid": {
                                "content": "有効な画像URLを入力してください"
                            }
                        },
                        "hint": "サードパーティの場所でホストされている有効な画像URLを入力します。",
                        "placeholder": "画像のURLを入力します。",
                        "warnings": {
                            "dataURL": {
                                "content": "文字カウントが大きいデータURLを使用すると、データベースの問題が発生する可能性があります。注意して進めてください。",
                                "header": "入力されたデータURLを再確認してください！"
                            }
                        }
                    }
                },
                "systemGenAvatars": {
                    "heading": "システム生成アバター",
                    "types": {
                        "initials": "イニシャル"
                    }
                }
            },
            "description": null,
            "heading": "プロフィール写真を更新します",
            "primaryButton": "保存",
            "secondaryButton": "キャンセル"
        },
        "sessionTimeoutModal": {
            "description": "<1>をクリックすると、戻ると、セッションが存在する場合は回復しようとします。アクティブなセッションがない場合は、ログインページにリダイレクトされます。",
            "heading": "あなたは長い間非アクティブだったようです。",
            "loginAgainButton": "もう一度ログインします",
            "primaryButton": "戻る",
            "secondaryButton": "ログアウト",
            "sessionTimedOutDescription": "もう一度ログインして、中断したところから続行してください。",
            "sessionTimedOutHeading": "不活性のためにユーザーセッションが期限切れになっています。"
        }
    },
    "pages": {
        "applications": {
            "subTitle": "アプリケーションを発見してアクセスします",
            "title": "アプリケーション"
        },
        "overview": {
            "subTitle": "個人情報、アカウントセキュリティ、プライバシー設定を管理する",
            "title": "ようこそ、{{firstName}}"
        },
        "personalInfo": {
            "subTitle": "個人のプロフィールを編集またはエクスポートし、リンクされたアカウントを管理する",
            "title": "個人情報"
        },
        "personalInfoWithoutExportProfile": {
            "subTitle": "個人情報を表示および管理します",
            "title": "個人情報"
        },
        "personalInfoWithoutLinkedAccounts": {
            "subTitle": "個人プロフィールを編集またはエクスポートします",
            "title": "個人情報"
        },
        "privacy": {
            "subTitle": "",
            "title": "WSO2 IDサーバーのプライバシーポリシー"
        },
        "readOnlyProfileBanner": "このポータルからプロファイルを変更することはできません。詳細については、管理者にお問い合わせください。",
        "security": {
            "subTitle": "同意、セッション、セキュリティ設定を管理してアカウントを保護します",
            "title": "安全"
        }
    },
    "placeholders": {
        "404": {
            "action": "家に帰る",
            "subtitles": {
                "0": "探しているページが見つかりませんでした。",
                "1": "URLを確認するか、下のボタンをクリックして、ホームページにリダイレクトされます。"
            },
            "title": "ページが見つかりません"
        },
        "accessDeniedError": {
            "action": "家に帰る",
            "subtitles": {
                "0": "このページにアクセスすることは許可されていないようです。",
                "1": "別のアカウントでサインインしてみてください。"
            },
            "title": "許可されていないアクセス"
        },
        "emptySearchResult": {
            "action": "検索クエリをクリアします",
            "subtitles": {
                "0": "「{{query}}」の結果は見つかりませんでした",
                "1": "別の検索用語を試してください。"
            },
            "title": "結果が見つかりません"
        },
        "genericError": {
            "action": "ページを更新",
            "subtitles": {
                "0": "このページを表示している間、何かがうまくいかなかった。",
                "1": "技術的な詳細については、ブラウザコンソールを参照してください。"
            },
            "title": "何かがうまくいかなかった"
        },
        "loginError": {
            "action": "ログアウトを続けます",
            "subtitles": {
                "0": "このポータルを使用する許可がないようです。",
                "1": "別のアカウントでサインインしてください。"
            },
            "title": "あなたは許可されていません"
        },
        "sessionStorageDisabled": {
            "subtitles": {
                "0": "このアプリケーションを使用するには、Webブラウザー設定でCookieを有効にする必要があります。",
                "1": "Cookieを有効にする方法の詳細については、Webブラウザーのヘルプセクションを参照してください。"
            },
            "title": "クッキーはブラウザで無効になっています。"
        }
    },
    "sections": {
        "accountRecovery": {
            "description": "パスワードの回復に役立つリカバリ情報を管理する",
            "emptyPlaceholderText": "アカウントの回復オプションはありません",
            "heading": "アカウント復旧"
        },
        "changePassword": {
            "actionTitles": {
                "change": "パスワードを変更してください"
            },
            "description": "パスワードを定期的に更新し、使用する他のパスワードから一意であることを確認してください。",
            "heading": "パスワードを変更する"
        },
        "consentManagement": {
            "actionTitles": {
                "empty": "お客様は、アプリケーションに同意を与えていません"
            },
            "description": "各アプリケーションに提供した同意を確認します。また、必要に応じてそれらの1つまたは多くを取り消すことができます。",
            "heading": "同意を管理します",
            "placeholders": {
                "emptyConsentList": {
                    "heading": "お客様は、アプリケーションに同意を与えていません"
                }
            }
        },
        "createPassword": {
            "actionTitles": {
                "create": "パスワードを作成します"
            },
            "description": "{{productName}}でパスワードを作成します。このパスワードを使用して、ソーシャルログインに加えて{{productName}}にサインインできます。",
            "heading": "パスワードを作成します"
        },
        "federatedAssociations": {
            "description": "このアカウントにリンクされている他の接続からアカウントを表示する",
            "heading": "リンクされたソーシャルアカウント"
        },
        "linkedAccounts": {
            "actionTitles": {
                "add": "アカウントを追加する"
            },
            "description": "他のアカウントをリンク/関連付け、再ロギンなしでシームレスにアクセスします",
            "heading": "リンクされたアカウント"
        },
        "mfa": {
            "description": "追加の認証を構成して、簡単にサインインするか、アカウントにセキュリティの追加レイヤーを追加します。",
            "heading": "追加の認証"
        },
        "profile": {
            "description": "あなたの個人的なプロフィールを管理します",
            "heading": "プロフィール"
        },
        "profileExport": {
            "actionTitles": {
                "export": "プロファイルをダウンロードします"
            },
            "description": "個人データやリンクされたアカウントを含むすべてのプロファイルデータをダウンロードする",
            "heading": "エクスポートプロファイル"
        },
        "userSessions": {
            "actionTitles": {
                "empty": "アクティブセッションはありません",
                "terminateAll": "すべてのセッションを終了します"
            },
            "description": "アカウントのすべてのアクティブユーザーセッションを確認します",
            "heading": "アクティブセッション",
            "placeholders": {
                "emptySessionList": {
                    "heading": "このユーザーのアクティブセッションはありません"
                }
            }
        }
    }
};

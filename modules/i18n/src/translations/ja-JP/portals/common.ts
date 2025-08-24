/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
    "access": "アクセス",
    "actions": "行動",
    "activate": "活性化",
    "active": "アクティブ",
    "add": "追加",
    "addKey": "秘密を追加します",
    "addURL": "URLを追加します",
    "all": "全て",
    "applicationName": "アプリケーション名",
    "applications": "アプリケーション",
    "approvalStatus": "承認状況",
    "approvals": "承認",
    "approvalsPage": {
        "list": {
            "columns": {
                "actions": "アクション",
                "name": "名前"
            }
        },
        "modals": {
            "description": "あなたの承認を必要とする運用タスクを確認します",
            "header": "承認",
            "subHeader": "あなたの承認を必要とする運用タスクを確認します"
        },
        "notifications": {
            "fetchApprovalDetails": {
                "error": {
                    "description": "{{description}}",
                    "message": "承認の詳細を取得中にエラーが発生しました"
                },
                "genericError": {
                    "description": "承認の詳細を取得できませんでした。",
                    "message": "何かがうまくいかなかった"
                }
            },
            "fetchPendingApprovals": {
                "error": {
                    "description": "{{description}}",
                    "message": "承認の取得中にエラーが発生しました"
                },
                "genericError": {
                    "description": "保留中の承認を取得できませんでした。",
                    "message": "何かがうまくいかなかった"
                }
            },
            "updatePendingApprovals": {
                "error": {
                    "description": "{{description}}",
                    "message": "承認の更新中にエラーが発生しました"
                },
                "genericError": {
                    "description": "保留中の承認を更新できませんでした。",
                    "message": "何かがうまくいかなかった"
                },
                "success": {
                    "description": "承認が正常に更新されました。",
                    "message": "更新に成功しました"
                }
            }
        },
        operationTypes: {
            "addRole": "ロールを追加",
            "addUser": "ユーザーを追加",
            "all": "すべての操作",
            "deleteRole": "ロールを削除",
            "deleteUser": "ユーザーを削除",
            "selfRegisterUser": "ユーザーの自己登録",
            "updateRolesOfUser": "ロールのユーザーを更新"
        },
        "placeholders": {
            "emptyApprovalFilter": {
                "action": "すべて表示",
                "subtitles": {
                    0: "現在、{{status}} 状態の承認はありません。",
                    1: "タスクが {{status}} 状態にあるかどうかを確認してください。",
                    2: "ここで表示できます。"
                },
                "title": "結果が見つかりません"
            },
            "emptyApprovalList": {
                "action": "",
                "subtitles": {
                    0: "現在、承認をレビューするものはありません。",
                    1: "システム内の操作を制御するためにワークフローを追加したかどうかを確認してください。",
                    2: ""
                },
                "title": "承認なし"
            },
            "emptySearchResults": {
                "action": "すべて表示",
                "subtitles": {
                    0: "検索したワークフローが見つかりませんでした。",
                    1: "その名前のワークフローがあるかどうかを確認してください。",
                    2: "システム内で。"
                },
                "title": "承認なし"
            },
            "searchApprovals": "ワークフロー名で検索"
        },
        propertyMessages: {
            assignedUsersDeleted: "割り当てられたユーザー/sは削除されています。",
            roleDeleted: "役割が削除されました。",
            selfRegistration: "自己登録",
            unassignedUsersDeleted: "割り当てられていないユーザー/sは削除されています。"
        },
        "subTitle": "承認を必要とする運用タスクを確認します",
        "title": "承認"
    },
    "approve": "承認する",
    "approved": "承認済み",
    "apps": "アプリ",
    "assignYourself": "自分に割り当てる",
    "assignee": "譲受人",
    "assignees": "譲受人",
    "asyncOperationErrorMessage": {
        "description": "問題が発生しました",
        "message": "予期しないエラーが発生しました。しばらくしてからもう一度ご確認ください。"
    },
    "authentication": "認証",
    "authenticator": "認証者",
    "authenticator_plural": "認証者",
    "back": "戻る",
    "beta": "ベータ",
    "browser": "ブラウザ",
    "cancel": "キャンセル",
    "challengeQuestionNumber": "挑戦質問 {{number}}",
    "change": "変化",
    "chunkLoadErrorMessage": {
        "description": "要求されたアプリケーションを提供するときにエラーが発生しました。アプリをリロードしてみてください。",
        "heading": "何かがうまくいかなかった",
        "primaryActionText": "アプリをリロードします"
    },
    "clear": "クリア",
    "clientId": "クライアントID",
    "close": "近い",
    "comingSoon": "近日公開",
    "completed": "完了しました",
    "configure": "構成、設定",
    "confirm": "確認する",
    "contains": "含む",
    "continue": "続く",
    "copyToClipboard": "クリップボードにコピー",
    "create": "作成する",
    "createdOn": "に作成されました",
    "dangerZone": "危険区域",
    "darkMode": "ダークモード",
    "delete": "消去",
    "deprecated": "この構成は非推奨であり、今後のリリースで削除される予定です。",
    "description": "説明",
    "deviceModel": "デバイスモデル",
    "disable": "無効にします",
    "disabled": "無効",
    "docs": "ドキュメント",
    "documentation": "ドキュメンテーション",
    "done": "終わり",
    "download": "ダウンロード",
    "drag": "引っ張る",
    "duplicateURLError": "この値はすでに追加されています",
    "edit": "編集",
    "enable": "有効にする",
    "enabled": "有効になっています",
    "endsWith": "で終わります",
    "equals": "平等です",
    "exitFullScreen": "フルスクリーンを終了します",
    "experimental": "実験的な",
    "explore": "探検する",
    "export": "輸出",
    "featureAvailable": "この機能はまもなく利用可能になります！",
    "filter": "フィルター",
    "finish": "仕上げる",
    "generatePassword": "パスワードを生成します",
    "goBackHome": "家に帰ります",
    "goFullScreen": "フルスクリーンに行きます",
    "good": "良い",
    "help": "ヘルプ",
    "hide": "隠れる",
    "hidePassword": "パスワードを非表示にします",
    "identityProviders": "IDプロバイダー",
    "import": "輸入",
    "initiator": "イニシエータ",
    "ipAddress": "IPアドレス",
    "issuer": "発行者",
    "lastAccessed": "最後にアクセスしました",
    "lastModified": "最終更新日",
    "lastSeen": "最後に見たのは",
    "lastUpdatedOn": "最後に更新されました",
    "learnMore": "もっと詳しく知る",
    "lightMode": "ライトモード",
    "loading": "読み込み",
    "loginTime": "ログイン時間",
    "logout": "ログアウト",
    "makePrimary": "プライマリを作成します",
    "maxValidation": "この値は、{{max}}以下でなければなりません。",
    "maximize": "最大化します",
    "metaAttributes": "メタ属性",
    "minValidation": "この値は{{min}}以上である必要があります。",
    "minimize": "最小化します",
    "minutes": "分",
    "more": "もっと",
    "myAccount": "私のアカウント",
    "name": "名前",
    "networkErrorMessage": {
        "description": "もう一度サインインしてみてください。",
        "heading": "あなたのセッションは期限切れになりました",
        "primaryActionText": "サインイン"
    },
    "new": "新しい",
    "next": "次",
    "noResultsFound": "結果が見つかりません",
    "okay": "わかった",
    "operatingSystem": "オペレーティング·システム",
    "operationType": "操作タイプ",
    "operations": "オペレーション",
    "organizationName": "{{orgName}} 組織",
    "overview": "概要",
    "personalInfo": "個人情報",
    "pin": "ピン",
    "pinned": "ピン留め",
    "premium": "プレミアム",
    "pressEnterPrompt": "<1>Enter</1> を押して選択します",
    "preview": "プレビュー",
    "previous": "前の",
    "primary": "主要な",
    "priority": "優先度",
    "privacy": "プライバシー",
    "properties": "プロパティ",
    "publish": "公開",
    "ready": "準備ができて",
    "regenerate": "再生",
    "register": "登録する",
    "reject": "拒否する",
    "rejected": "拒否されました",
    "remove": "取り除く",
    "removeAll": "すべて削除する",
    "required": "これが必要です。",
    "reserved": "予約済み",
    "resetFilters": "フィルターをリセットします",
    "retry": "リトライ",
    "revoke": "取り消す",
    "revokeAll": "すべてを取り消します",
    "samples": "サンプル",
    "save": "保存",
    "saveDraft": "下書きを保存",
    "sdks": "SDKs",
    "search": "検索",
    "searching": "検索",
    "security": "安全",
    "selectAll": "すべてを選択します",
    "selectNone": "なしを選択します",
    "services": "サービス",
    "settings": "設定",
    "setup": "設定",
    "show": "見せる",
    "showAll": "すべて表示する",
    "showLess": "少なく表示します",
    "showMore": "もっと見せる",
    "showPassword": "パスワードを表示します",
    "skip": "スキップ",
    "startsWith": "から始まります",
    "step": "ステップ",
    "strong": "強い",
    "submit": "提出する",
    "switch": "スイッチ",
    "technologies": "テクノロジー",
    "terminate": "終了します",
    "terminateAll": "すべてを終了します",
    "terminateSession": "セッションを終了します",
    "tooShort": "短すぎる",
    "type": "タイプ",
    "unassign": "割り当て解除",
    "unpin": "運品",
    "unpinned": "インプインしていない",
    "update": "アップデート",
    "user": "ユーザー",
    "verified": "検証",
    "verify": "確認する",
    "view": "ビュー",
    "weak": "弱い",
    "weakPassword": "パスワードの強度は少なくとも良いはずです。"
};

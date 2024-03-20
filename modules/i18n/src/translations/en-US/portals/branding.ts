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
import { BrandingNS } from "../../../models";

export const branding: BrandingNS = {
    form: {
        actions: {
            resetAll: "Reset to Default",
            save: "Save & Publish"
        }
    },
    screens: {
        common: "Common",
        "email-otp": "Email OTP",
        "email-template": "Email Templates",
        login: "Login",
        myaccount: "My Account",
        "password-recovery": "Password Recovery",
        "password-reset": "Password Reset",
        "password-reset-success": "Password Reset Link Sent",
        "sign-up": "Sign Up",
        "sms-otp": "SMS OTP",
        "totp": "TOTP"
    },
    tabs: {
        preview: {
            label: "Preview"
        },
        text: {
            label: "Text"
        }
    }
};

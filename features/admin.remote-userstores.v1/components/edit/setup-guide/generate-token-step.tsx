/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import Typography from "@oxygen-ui/react/Typography";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CopyInputField, Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { generateToken } from "../../../api/remote-user-stores";
import { RemoteUserStoreAPIExceptionCodes } from "../../../constants/remote-user-stores-constants";
import { GenerateTokenResponseInterface } from "../../../models/remote-user-stores";

interface GenerateTokenStepPropsInterface extends IdentifiableComponentInterface {
    /**
     * User store manager type.
     */
    userStoreManager: RemoteUserStoreManagerType;
    /**
     * User store ID.
     */
    userStoreID: string;
    /**
     * Whether the user store is disabled.
     */
    isUserStoreDisabled: boolean;
}

/**
 * Generate token step component for the remote user store setup guide.
 *
 * @param props - Props injected to the component.
 * @returns The generate token step component.
 */
const GenerateTokenStep: FunctionComponent<GenerateTokenStepPropsInterface> = ({
    userStoreManager,
    userStoreID,
    isUserStoreDisabled,
    ["data-componentid"]: componentId = "generate-token-step"
}: GenerateTokenStepPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ generatedToken, setGeneratedToken ] = useState<string>();
    const [ isTokenGenerating, setIsTokenGenerating ] = useState<boolean>(false);

    /**
     * The following function handles generating the token.
     */
    const handleGenerateToken = () => {
        setIsTokenGenerating(true);

        generateToken(userStoreID, userStoreManager)
            .then((response: GenerateTokenResponseInterface) => {
                setGeneratedToken(response.token);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.code === RemoteUserStoreAPIExceptionCodes.TokenLimitExceeded) {
                    dispatch(addAlert(
                        {
                            description: t("remoteUserStores:notifications.tokenCountExceededError.description"),
                            level: AlertLevels.ERROR,
                            message: t("remoteUserStores:notifications.tokenCountExceededError.message")
                        }
                    ));

                    return;
                }

                dispatch(addAlert(
                    {
                        description: t("remoteUserStores:notifications.tokenGenerateError.description"),
                        level: AlertLevels.ERROR,
                        message: t("remoteUserStores:notifications.tokenGenerateError.message")
                    }
                ));
            })
            .finally(() => {
                setIsTokenGenerating(false);
            });
    };

    if (generatedToken) {
        return (
            <>
                <Message
                    content={ t("remoteUserStores:pages.edit.guide.steps.token.generatedToken.message") }
                    type="warning"
                />
                <label>{ t("remoteUserStores:pages.edit.guide.steps.token.generatedToken.label") }</label>
                <CopyInputField
                    value={ generatedToken }
                    data-componentid={ `${componentId}-token-readonly-input` }
                />
            </>
        );
    }

    return (
        <>
            <Typography component="p" gutterBottom>
                { t("remoteUserStores:pages.edit.guide.steps.token.description") }
            </Typography>
            <Button
                variant="outlined"
                onClick={ handleGenerateToken }
                loading={ isTokenGenerating }
                disabled={ isUserStoreDisabled }
                data-componentid={ `${componentId}-generate-token` }
            >
                { t("remoteUserStores:pages.edit.guide.steps.token.action") }
            </Button>
        </>
    );
};

export default GenerateTokenStep;

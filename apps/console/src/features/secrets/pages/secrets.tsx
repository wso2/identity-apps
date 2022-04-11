/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Icon } from "semantic-ui-react";
import { getSecretList } from "../api/secret";
import AddSecretWizard from "../components/add-secret-wizard";
import SecretsList from "../components/secrets-list";
import { ADAPTIVE_SCRIPT_SECRETS } from "../constants/secrets.common";
import { GetSecretListResponse, SecretModel } from "../models/secret";

/**
 * Props interface of {@link SecretsPage}
 */
export type SecretsPageProps = IdentifiableComponentInterface;

/**
 * There are couple of things missing in this component:
 * The secrets list of page.
 *
 * @param props {SecretsPageProps}
 * @constructor
 */
const SecretsPage: FC<SecretsPageProps> = (props: SecretsPageProps): ReactElement => {

    const {
        ["data-componentid"]: testId
    } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();

    /**
     * List of secrets for the selected {@code secretType}. It can hold secrets of
     * either a custom one or the static type "ADAPTIVE_AUTH_CALL_CHOREO"
     */
    const [ secretList, setSecretList ] = useState<SecretModel[]>([]);
    const [ isSecretListLoading, setIsSecretListLoading ] = useState<boolean>(true);
    const [ showAddSecretModal, setShowAddSecretModal ] = useState<boolean>(false);
    const [ selectedSecretType ] = useState<string>(ADAPTIVE_SCRIPT_SECRETS);
    const [ isLoading, setLoading ] = useState<boolean>(true);

    useEffect(() => {
        loadSecretListForSecretType();
    }, []);

    const loadSecretListForSecretType = async (): Promise<void> => {

        setIsSecretListLoading(true);

        getSecretList({
            params: { secretType: selectedSecretType }
        }).then((axiosResponse: AxiosResponse<GetSecretListResponse>) => {
            setSecretList(axiosResponse.data);
        }).catch((error) => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data?.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data?.message
                }));

                return;
            }
            dispatch(addAlert({
                description: t("console:develop.features.secrets.errors.generic.description"),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.secrets.errors.generic.message")
            }));
        }).finally(() => {
            setIsSecretListLoading(false);
            setLoading(false);
        });

    };

    const refreshSecretList = async () => {
        loadSecretListForSecretType();
    };

    /**
     * @event-handler of Add Secret Button
     */
    const onAddNewSecretButtonClick = (): void => {
        setShowAddSecretModal(true);
    };

    /**
     * This will be called when secret add wizard closed.
     * It will tell us to refresh the secret list or not.
     * @param shouldRefresh {boolean}
     */
    const whenAddNewSecretModalClosed = (shouldRefresh: boolean): void => {
        setShowAddSecretModal(false);
        if (shouldRefresh) {
            refreshSecretList();
        }
    };

    /**
     * This will be called when a secret is deleted from the list.
     * It will also tell us whether we should refresh the secret list or not.
     * @param deletedSecret {SecretModel}
     * @param shouldRefresh {boolean}
     */
    const whenSecretDeleted = (deletedSecret: SecretModel, shouldRefresh: boolean): void => {
        if (shouldRefresh) {
            refreshSecretList();
        }
    };

    return (
        
        <PageLayout
            action={
                (!isLoading && !(secretList?.length <= 0))
            && (
                <Show when={ AccessControlConstants.SECRET_WRITE }>
                    <PrimaryButton
                        onClick={ onAddNewSecretButtonClick }
                        data-testid={ `${ testId }-add-button` }>
                        <Icon name="add"/>
                        { t("console:develop.features.secrets.page.primaryActionButtonText") }
                    </PrimaryButton>
                </Show>
            ) }
            
            isLoading={ isSecretListLoading }
            title={ t("console:develop.features.secrets.page.title") }
            description={ t("console:develop.features.secrets.page.description") }
        >
               
            <Show when={ AccessControlConstants.SECRET_READ }>
                <SecretsList
                    whenSecretDeleted={ whenSecretDeleted }
                    isSecretListLoading={ isSecretListLoading }
                    secretList={ secretList }
                    selectedSecretType={ selectedSecretType }
                    onAddNewSecretButtonClick={ onAddNewSecretButtonClick }
                    onSearchQueryClear={ loadSecretListForSecretType }
                />
            </Show>
            { showAddSecretModal && (
                <AddSecretWizard
                    onClose={ whenAddNewSecretModalClosed }
                />
            ) }
        </PageLayout>
    );

};

/**
 * Default props of {@link SecretsPage}
 */
SecretsPage.defaultProps = {
    "data-componentid": "secrets-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SecretsPage;

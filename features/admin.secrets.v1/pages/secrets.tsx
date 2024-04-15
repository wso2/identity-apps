/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import { AppState, FeatureConfigInterface } from "../../admin.core.v1";
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
 */
const SecretsPage: FC<SecretsPageProps> = (props: SecretsPageProps): ReactElement => {

    const {
        ["data-componentid"]: testId
    } = props;

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    /**
     * List of secrets for the selected secretType. It can hold secrets of
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
        }).catch((error: AxiosError) => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data?.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data?.message
                }));

                return;
            }
            dispatch(addAlert({
                description: t("secrets:errors.generic.description"),
                level: AlertLevels.ERROR,
                message: t("secrets:errors.generic.message")
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
     */
    const onAddNewSecretButtonClick = (): void => {
        setShowAddSecretModal(true);
    };

    /**
     * This will be called when secret add wizard closed.
     * It will tell us to refresh the secret list or not.
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
                <Show when={ featureConfig?.secretsManagement?.scopes?.create }>
                    <PrimaryButton
                        onClick={ onAddNewSecretButtonClick }
                        data-testid={ `${ testId }-add-button` }>
                        <Icon name="add"/>
                        { t("secrets:page.primaryActionButtonText") }
                    </PrimaryButton>
                </Show>
            ) }
            isLoading={ isSecretListLoading }
            title={ t("secrets:page.title") }
            pageTitle={ t("secrets:page.title") }
            description={ t("secrets:page.description") }
        >

            <Show when={ featureConfig?.secretsManagement?.scopes?.read }>
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

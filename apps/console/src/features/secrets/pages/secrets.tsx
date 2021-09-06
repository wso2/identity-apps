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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout, PrimaryButton } from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FC, ReactElement, useEffect, useState } from "react";
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
 * TODO: Address https://github.com/wso2/product-is/issues/12447
 *      Add <Show> component & Event publishers & i18n strings.
 *
 * The secrets list of page.
 * @constructor
 */
const SecretsPage: FC<SecretsPageProps> = (props: SecretsPageProps): ReactElement => {

    const {
        ["data-componentid"]: testId
    } = props;

    const dispatch = useDispatch();

    /**
     * List of secrets for the selected {@code secretType}. It can hold secrets of
     * either a custom one or the static type "ADAPTIVE_AUTH_CALL_CHOREO"
     */
    const [ secretList, setSecretList ] = useState<SecretModel[]>([]);
    const [ isSecretListLoading, setIsSecretListLoading ] = useState<boolean>(true);
    const [ showAddSecretModal, setShowAddSecretModal ] = useState<boolean>(false);
    const [ selectedSecretType ] = useState<string>(ADAPTIVE_SCRIPT_SECRETS);

    useEffect(() => {
        loadSecretListForSecretType();
    }, []);

    const loadSecretListForSecretType = () => {

        setIsSecretListLoading(true);

        getSecretList({
            params: { secretType: selectedSecretType }
        }).then((axiosResponse: AxiosResponse<GetSecretListResponse>) => {
            setSecretList(axiosResponse.data);
        }).catch((error) => {
            if (error.response && error.response.data && error.response.data.description) {
                dispatch(addAlert({
                    description: error.response.data.description,
                    level: AlertLevels.ERROR,
                    message: error.response.data?.message
                }));
                return;
            }
            dispatch(addAlert({
                description: "Something went wrong!",
                level: AlertLevels.ERROR,
                message: `We were unable to get the list of secrets for ${ selectedSecretType }`
            }));
        }).finally(() => {
            setIsSecretListLoading(false);
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
            isLoading={ isSecretListLoading }
            title={ "Secrets" }
            description={ "Create and manage secrets for External APIs or Adaptive Authentication" }
            action={ secretList?.length > 0 && (
                <PrimaryButton
                    onClick={ onAddNewSecretButtonClick }
                    data-testid={ `${ testId }-add-button` }>
                    <Icon name="add"/>
                    New Secret
                </PrimaryButton>
            ) }>
            <SecretsList
                whenSecretDeleted={ whenSecretDeleted }
                isSecretListLoading={ isSecretListLoading }
                secretList={ secretList }
                selectedSecretType={ selectedSecretType }
                onAddNewSecretButtonClick={ onAddNewSecretButtonClick }
            />
            { showAddSecretModal && (
                <AddSecretWizard
                    onClose={ whenAddNewSecretModalClosed }
                />
            ) }
        </PageLayout>
    );

};

SecretsPage.defaultProps = {
    "data-componentid": "secrets-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SecretsPage;

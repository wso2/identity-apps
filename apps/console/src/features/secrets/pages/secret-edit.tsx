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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, GenericIcon, PageLayout } from "@wso2is/react-components";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { AppConstants, getSecretManagementIllustrations, history } from "../../core";
import { getSecret } from "../api/secret";
import EditSecret from "../components/edit-secret";
import { EmptySecretListPlaceholder } from "../components/empty-secret-list-placeholder";
import { FEATURE_BASE_PATH } from "../constants/secrets.common";
import { SecretModel } from "../models/secret";

/**
 * Props interface of {@link SecretEdit}
 */
export type SecretEditProps = RouteComponentProps & IdentifiableComponentInterface;

/**
 * @param props {SecretEditProps}
 * @constructor
 */
const SecretEdit: FC<SecretEditProps> = (props: SecretEditProps): ReactElement => {

    const {
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ loading, setLoading ] = useState<boolean>(true);
    const [ resourceNotFound, setResourceNotFound ] = useState<boolean>(false);
    const [ editingSecret, setEditingSecret ] = useState<SecretModel>(undefined);
    const [ secretName, setSecretName ] = useState<string>();

    /**
     * Fetch the secret details on initial component load.
     */
    useEffect(() => {

        const { secretType, secretName } = extractDataFromPath();

        setSecretName(secretName);

        getSecret({ params: { secretName, secretType } })
            .then(({ data }) => {
                setEditingSecret(data);
                setResourceNotFound(false);
            })
            .catch((error) => {
                setResourceNotFound(true);
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
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    const extractDataFromPath = (): { secretType: string, secretName: string } => {
        const path = history.location.pathname.split("/");
        const TYPE = path.length - 2, NAME = path.length - 1;

        return {
            secretName: path[NAME],
            secretType: path[TYPE]
        };
    };

    return (
        resourceNotFound
            ? (
                <EmptySecretListPlaceholder
                    onAddNewSecret={ null }
                    resourceNotFound
                />
            )
            : (
                <PageLayout
                    isLoading={ loading }
                    title={ secretName }
                    pageTitle={ secretName }
                    description={ "Edit secret" }
                    image={
                        (<GenericIcon
                            size="x60"
                            shape="rounded"
                            colored
                            background={ true }
                            hoverable={ false }
                            icon={ getSecretManagementIllustrations().editingSecretIcon }
                        />)
                    }
                    backButton={ {
                        onClick: () => history.push(AppConstants.getPaths().get(FEATURE_BASE_PATH)),
                        text: t("console:develop.features.secrets.page.subFeatureBackButton")
                    } }>
                    {
                        (loading && !resourceNotFound)
                            ? <ContentLoader/>
                            : (<EditSecret
                                data-componentid={ testId }
                                editingSecret={ editingSecret }
                            />)
                    }
                </PageLayout>
            )
    );

};

/**
 * Default props of {@link SecretEdit}
 */
SecretEdit.defaultProps = {
    "data-componentid": "secret-edit"
};

export default SecretEdit;

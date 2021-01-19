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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Forms } from "@wso2is/forms";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { IdpCertificatesListComponent } from "./idp-certificate-list";
import { AddIDPJWKSUriFormComponent } from "./idp-jwks-endpoint-form";
import { updateIDPCertificate } from "../../../api";
import { IdentityProviderInterface } from "../../../models";

/**
 * Proptypes for the IDP certificate component.
 */
interface IdpCertificatesPropsInterface extends TestableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: IdentityProviderInterface;
    /**
     * Callback to update the idp details.
     */
    onUpdate: (id: string) => void;
}

/**
 * IDP certificates component.
 *
 * @param {IdpCertificatesPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const IdpCertificates: FunctionComponent<IdpCertificatesPropsInterface> = (
    props: IdpCertificatesPropsInterface
): ReactElement => {

    const {
        editingIDP,
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ isPEMSelected, setPEMSelected ] = useState<boolean>(false);
    const [ isJWKSSelected, setJWKSSelected ] = useState<boolean>(false);

    /**
     * The following function update the IDP JWKS endpoint.
     *
     * @param endpoint
     */
    const updateJWKEndpoint = (endpoint: string) => {
        const data = [
            {
                "operation": "REPLACE",
                "path": "/certificate/jwksUri",
                "value": endpoint
            }
        ];

        updateIDPCertificate(editingIDP.id, data)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.idp.notifications.updateIDPCertificate.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idp.notifications.updateIDPCertificate.success.message")
                }));
                onUpdate(editingIDP.id);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.idp.notifications.updateIDPCertificate.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.idp.notifications.updateIDPCertificate.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.idp.notifications.updateIDPCertificate.genericError.message")
                }));
            });
    };

    /**
     * The following function handle the certificate type change.
     *
     * @param certType
     */
    const handleCertificateTypeChange = (certType: string) => {
        if (certType === "PEM") {
            dispatch(addAlert({
                description: t("console:develop.features.idp.notifications.changeCertType.pem.description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.idp.notifications.changeCertType.pem.message")
            }));
        } else {
            dispatch(addAlert({
                description: t("console:develop.features.idp.notifications.changeCertType.jwks" +
                    ".description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.idp.notifications.changeCertType.jwks.message")
            }));
        }
    };

    return (
        <Forms>
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                        <Field
                            label={ t("console:develop.features.idp.forms.advancedConfigs.certificateType.label") }
                            name="type"
                            default={ "JWKS" }
                            listen={
                                (values) => {
                                    setPEMSelected(values.get("type") === "PEM");
                                    setJWKSSelected(values.get("type") === "JWKS");
                                    handleCertificateTypeChange(values.get("type").toString());
                                }
                            }
                            type="radio"
                            children={ [
                                {
                                    label: t("console:develop.features.idp.forms.advancedConfigs.certificateType" +
                                        ".certificateJWKS.label"),
                                    value: "JWKS"
                                },
                                {
                                    label: t("console:develop.features.idp.forms.advancedConfigs.certificateType" +
                                        ".certificatePEM.label"),
                                    value: "PEM"
                                }
                            ] }
                            value={ editingIDP?.certificate?.certificates ? "PEM" : "JWKS" }
                            data-testid={ `${ testId }-certificate-type-radio-group` }
                        />
                        <Hint>
                            { t("console:develop.features.idp.forms.advancedConfigs.certificateType.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                        {
                            (isPEMSelected || editingIDP?.certificate?.certificates) && !isJWKSSelected ?
                                (
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <IdpCertificatesListComponent
                                            editingIDP={ editingIDP }
                                            onUpdate={ onUpdate }
                                        />
                                    </Grid.Column>
                                ) : (
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <AddIDPJWKSUriFormComponent
                                            initialUri={ editingIDP?.certificate?.jwksUri
                                                ? editingIDP?.certificate?.jwksUri : "" }
                                            onSubmit={ updateJWKEndpoint }
                                        />
                                    </Grid.Column>
                                )
                        }
                </Grid.Row>
            </Grid>
        </Forms>
    );
};

/**
 * Default proptypes for the IDP advance settings form component.
 */
IdpCertificates.defaultProps = {
    "data-testid": "idp-edit-advance-settings"
};

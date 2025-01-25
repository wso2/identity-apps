/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment";
import Stack from "@oxygen-ui/react/Stack";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/form";
import { PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import { ServerConfigurationsConstants } from "../../constants/server-configurations-constants";
import { GovernanceConnectorInterface } from "../../models/governance-connectors";
import { GovernanceConnectorUtils } from "../../utils";
import "./sift-connector-form.scss";

/**
 * Proptypes for the Sift Connector Form component.
 */
interface SiftConnectorFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: Record<string, unknown>) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

/**
 * Sift Connector Configuration Form.
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
const SiftConnectorForm: FunctionComponent<SiftConnectorFormPropsInterface> = (
    props: SiftConnectorFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ apiKey, setApiKey ] = useState<string>(initialValues?.properties[0]?.value ?? "");
    const [ isShow, setIsShow ] = useState(false);

    /**
     * Get updated API Key.
     *
     * @param values - Form values.
     * @returns Form values object.
     */
    const getUpdatedAPIKey = (values: Record<string, unknown>) => {

        let data: { [ key: string]: unknown } = {
            [ ServerConfigurationsConstants.SIFT_CONNECTOR_API_KEY_PROPERTY ]: ""
        };

        if (Object.keys(values).length === 0) {
            return data;
        }

        for (const key in values) {
            data = {
                ...data,
                [ GovernanceConnectorUtils.decodeConnectorPropertyName(key) ]: values[ key ]
            };
        }

        return data;
    };

    /**
     * Render input adornment.
     *
     * @returns ReactElement
     */
    const renderInputAdornment = (): ReactElement => (
        <InputAdornment position="end">
            <Icon
                link={ true }
                className="list-icon reset-field-to-default-adornment"
                size="small"
                color="grey"
                name={ !isShow ? "eye" : "eye slash" }
                data-testid={ "view-button" }
                onClick={ () => { setIsShow(!isShow); } }
            />
        </InputAdornment>
    );

    return (
        <div className="sift-connector-form">
            <FinalForm
                onSubmit={ (values: Record<string, unknown>) =>
                    onSubmit(getUpdatedAPIKey(values))
                }
                data-componentid={ `${ componentId }-configuration-form` }
                initialValues={
                    {
                        [ GovernanceConnectorUtils
                            .encodeConnectorPropertyName(ServerConfigurationsConstants.SIFT_CONNECTOR_API_KEY_PROPERTY)
                        ]: initialValues?.properties[0]?.value ?? ""
                    }
                }
                render={ ({ handleSubmit, form }: FormRenderProps) => (
                    <form onSubmit={ handleSubmit }>
                        <Stack direction="row" spacing={ 2 } mb={ 3 }>
                            <FinalFormField
                                className="addon-field-wrapper"
                                key={ ServerConfigurationsConstants.SIFT_CONNECTOR_API_KEY_PROPERTY }
                                FormControlProps={ {
                                    margin: "dense"
                                } }
                                ariaLabel="API Key Input"
                                data-componentid={ `${componentId}-configuration-form-api-key` }
                                name={
                                    GovernanceConnectorUtils
                                        .encodeConnectorPropertyName(ServerConfigurationsConstants
                                            .SIFT_CONNECTOR_API_KEY_PROPERTY)
                                }
                                inputType="password"
                                type={ isShow ? "text" : "password" }
                                label={ t("governanceConnectors:connectorCategories" +
                                    ".loginAttemptsSecurity.connectors.siftConnector" +
                                    ".properties.siftConnectorApiKey.label")
                                }
                                placeholder={ t("governanceConnectors:connectorCategories" +
                                    ".loginAttemptsSecurity.connectors.siftConnector" +
                                    ".properties.siftConnectorApiKey.placeholder")
                                }
                                component={ TextFieldAdapter }
                                autoComplete="new-password"
                                InputProps={ {
                                    endAdornment: renderInputAdornment()
                                } }
                                initialValue={ initialValues?.properties[0]?.value ?? "" }
                                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
                                    const value: string = e.target.value;

                                    setApiKey(value);
                                    form.change(GovernanceConnectorUtils
                                        .encodeConnectorPropertyName(ServerConfigurationsConstants
                                            .SIFT_CONNECTOR_API_KEY_PROPERTY), value
                                    );
                                } }
                                value={ apiKey }
                            />
                            {
                                (apiKey && apiKey !== "") && (
                                    <IconButton
                                        className="delete-button"
                                        onClick={ () => {
                                            setApiKey("");
                                            form.change(
                                                GovernanceConnectorUtils
                                                    .encodeConnectorPropertyName(ServerConfigurationsConstants
                                                        .SIFT_CONNECTOR_API_KEY_PROPERTY), ""
                                            );
                                        } }
                                        data-componentid={ `${ componentId }-configuration-form-api-key-delete-button` }
                                    >
                                        <TrashIcon />
                                    </IconButton>
                                )
                            }
                        </Stack>
                        <PrimaryButton
                            size="small"
                            disabled={ isSubmitting || readOnly }
                            loading={ isSubmitting }
                            data-componentid={
                                `${ componentId }-configuration-form-submit-button`
                            }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    </form>
                ) }
            />
        </div>
    );
};

/**
 * Default proptypes for the Sift Connector Form component.
 */
SiftConnectorForm.defaultProps = {
    "data-componentid": "sift-connector"
};

export default SiftConnectorForm;

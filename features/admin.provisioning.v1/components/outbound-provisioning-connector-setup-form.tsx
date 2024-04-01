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

import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Hint, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { OutboundProvisioningConfigurationInterface } from "../../admin.applications.v1/models/application";
import { OutboundProvisioningConnectorInterface } from "../../admin.connections.v1/models/connection";
import { getIdentityProviderDetail } from "../../admin.identity-providers.v1/api/identity-provider";
import { IdentityProviderInterface } from "../../admin.identity-providers.v1/models/identity-provider";

/**
 * Proptypes for the outbound provisioning connector setup form component.
 */
interface OutboundProvisioningConnectorSetupFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Form initial values.
     */
    initialValues: OutboundProvisioningConfigurationInterface;
    triggerSubmit: boolean;
    idpList: IdentityProviderInterface[];
    onSubmit: (values: any) => void;
    isEdit?: boolean;
    /**
     * Make the form read only.
     */
    isReadOnly?: boolean;
    /**
     * Specifies if the form is being submitted.
     */
    isSubmitting?: boolean;
}

interface DropdownOptionsInterface {
    text: string;
    key: number;
    value: string;
}

/**
 * Outbound Provisioning Connector Setup Form component.
 *
 * @param props - Props injected to the component.
 * @returns Outbound Provisioning Connector Setup Form component.
 */
export const OutboundProvisioningConnectorSetupForm: FunctionComponent<
    OutboundProvisioningConnectorSetupFormPropsInterface
> = (
    props: OutboundProvisioningConnectorSetupFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        idpList,
        triggerSubmit,
        onSubmit,
        isEdit,
        isReadOnly,
        isSubmitting,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();

    const [ idpListOptions, setIdpListOptions ] = useState<DropdownOptionsInterface[]>([]);
    const [ connectorListOptions, setConnectorListOptions ] = useState<DropdownOptionsInterface[]>(undefined);
    const [ selectedIdp, setSelectedIdp ] = useState<string>();
    const [ isBlockingChecked, setIsBlockingChecked ] = useState<boolean>(initialValues?.blocking ?? false);
    const [ isRulesChecked, setIsRulesChecked ] = useState<boolean>(initialValues?.rules ?? false);
    const [ connector, setConnector ] = useState<string>(initialValues?.connector);

    useEffect(() => {
        if (!idpList) {
            return;
        }

        if (initialValues?.idp) {
            const idp: IdentityProviderInterface = idpList?.find(
                (idp: IdentityProviderInterface) => idp.name === initialValues?.idp);

            setSelectedIdp(idp?.id);
        }
    }, [ idpList ]);

    /**
     * Set the IDP options for the dropdown.
     */
    useEffect(() => {
        if(!idpList) {
            return;
        }

        const idpOptions: DropdownOptionsInterface[] = [];
        let idpOption: DropdownOptionsInterface = {
            key: -1,
            text: "",
            value: ""
        };

        idpList.map((idp: IdentityProviderInterface, index: number) => {
            idpOption = {
                key: index,
                text: idp.name,
                value: idp.id
            };
            idpOptions.push(idpOption);
        });
        setIdpListOptions(idpOptions);
    }, [ idpList ]);

    /**
     * Set the selected IDP.
     */
    useEffect(() => {
        if(!selectedIdp) {
            return;
        }

        const connectorOptions: DropdownOptionsInterface[] = [];
        let connectorOption: DropdownOptionsInterface = {
            key: -1,
            text: "",
            value: ""
        };

        getIdentityProviderDetail(selectedIdp)
            .then((response: IdentityProviderInterface) => {
                response.provisioning.outboundConnectors.connectors.map(
                    (connector: OutboundProvisioningConnectorInterface, index: number) => {
                    // Check enabled connectors
                        if (connector.isEnabled) {
                            connectorOption = {
                                key: index,
                                text: connector.name,
                                value: connector.name
                            };
                            connectorOptions.push(connectorOption);
                        }
                    });
                setConnectorListOptions(connectorOptions);
            });
    }, [ selectedIdp ]);

    /**
     * The following function handles the change of the IDP.
     *
     * @param values - Form values.
     */
    const handleIdpChange = (values: Map<string, FormValue>): void => {
        setSelectedIdp(values.get("idp").toString());
    };

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param _ - Form values.
     * @returns Prepared values.
     */
    const getFormValues = (_: Map<string, FormValue>): Record<string, unknown> => {
        const idpName: string = (idpListOptions.find(
            (idp: DropdownOptionsInterface) => idp.value === selectedIdp)).text;

        return {
            blocking: isBlockingChecked,
            connector: connector,
            idp: idpName,
            rules: isRulesChecked
        };
    };

    return (
        <Forms
            onSubmit={ (values: Map<string, FormValue>) => onSubmit(getFormValues(values)) }
            submitState={ triggerSubmit && triggerSubmit }
        >
            <Grid>
                {
                    !isEdit && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } computer={ 10 }>
                                <Field
                                    type="dropdown"
                                    label={
                                        t("applications:resident.provisioning." +
                                            "outbound.form.fields.connection.label")
                                    }
                                    placeholder={
                                        t("applications:resident.provisioning." +
                                            "outbound.form.fields.connection.placeholder")
                                    }
                                    name="idp"
                                    children={ idpListOptions }
                                    requiredErrorMessage={
                                        t("applications:resident.provisioning." +
                                            "outbound.form.fields.connection.empty")
                                    }
                                    readOnly={ isReadOnly }
                                    required={ false }
                                    value={ initialValues?.idp }
                                    listen={ handleIdpChange }
                                    data-componentid={ `${ componentId }-idp-dropdown` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        <Field
                            type="dropdown"
                            label={
                                t("applications:forms.outboundProvisioning.fields.connector" +
                                    ".label")
                            }
                            placeholder={
                                t("applications:forms.outboundProvisioning.fields.connector" +
                                    ".placeholder")
                            }
                            name="connector"
                            children={ connectorListOptions }
                            requiredErrorMessage={
                                t("applications:forms.outboundProvisioning.fields" +
                                    ".connector.validations.empty")
                            }
                            readOnly={ isReadOnly }
                            required={ true }
                            value={ initialValues?.connector }
                            listen={
                                (values: Map<string, FormValue>) => {
                                    setConnector(values.get("connector").toString());
                                }
                            }
                            data-componentid={ `${ componentId }-provisioning-connector-dropdown` }
                        />
                        { connectorListOptions?.length <= 0 && (
                            <Hint icon="warning sign">
                                {
                                    t("applications:edit.sections.provisioning." +
                                        "outbound.addIdpWizard.errors.noProvisioningConnector")
                                }
                            </Hint>
                        ) }
                    </Grid.Column>
                </Grid.Row>
                {
                    UIConfig?.isXacmlConnectorEnabled && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } computer={ 10 }>
                                <Field
                                    name="rules"
                                    required={ false }
                                    requiredErrorMessage=""
                                    type="checkbox"
                                    children={ [
                                        {
                                            label: t("applications:forms." +
                                                "outboundProvisioning.fields.rules.label"),
                                            value: "rules"
                                        }
                                    ] }
                                    value={ initialValues?.rules ? [ "rules" ] : [] }
                                    listen={
                                        (values: Map<string, FormValue>) => {
                                            setIsRulesChecked(values.get("rules").includes("rules"));
                                        }
                                    }
                                    readOnly={ isReadOnly }
                                    data-componentid={ `${ componentId }-rules-checkbox` }
                                />
                                <Hint>
                                    { t("applications:forms.outboundProvisioning." +
                                        "fields.rules.hint") }
                                </Hint>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } computer={ 10 }>
                        <Field
                            name="blocking"
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: t("applications:forms.outboundProvisioning" +
                                        ".fields.blocking.label"),
                                    value: "blocking"
                                }
                            ] }
                            readOnly={ isReadOnly }
                            value={ initialValues?.blocking ? [ "blocking" ] : [] }
                            listen={
                                (values: Map<string, FormValue>) => {
                                    setIsBlockingChecked(values.get("blocking").includes("blocking"));
                                }
                            }
                            data-componentid={ `${ componentId }-blocking-checkbox` }
                        />
                        <Hint>
                            { t("applications:forms.outboundProvisioning.fields.blocking" +
                                ".hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                { isEdit
                    && !isReadOnly
                    && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } computer={ 10 }>
                                <PrimaryButton
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                    data-componentid={ `${ componentId }-submit-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { t("common:update") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    ) }
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the application outbound provisioning wizard idp form component.
 */
OutboundProvisioningConnectorSetupForm.defaultProps = {
    "data-componentid": "outbound-provisioning-connector-setup-form"
};

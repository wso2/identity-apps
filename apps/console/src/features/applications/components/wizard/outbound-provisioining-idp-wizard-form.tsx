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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Hint, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { getIdentityProviderDetail } from "../../../identity-providers";

/**
 * Proptypes for the outbound provisioning IDP form component.
 */
interface OutboundProvisioningIdpWizardFormPropsInterface extends TestableComponentInterface {
    initialValues: any;
    triggerSubmit: boolean;
    idpList: any;
    onSubmit: (values: any) => void;
    isEdit?: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
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
 * General settings wizard form component.
 *
 * @param {GeneralSettingsWizardFormPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const OutboundProvisioningWizardIdpForm: FunctionComponent<OutboundProvisioningIdpWizardFormPropsInterface> = (
    props: OutboundProvisioningIdpWizardFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        idpList,
        triggerSubmit,
        onSubmit,
        isEdit,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ idpListOptions, setIdpListOptions ] = useState<DropdownOptionsInterface[]>([]);
    const [ connectorListOptions, setConnectorListOptions ] = useState<DropdownOptionsInterface[]>(undefined);
    const [ selectedIdp, setSelectedIdp ] = useState<string>();
    const [ isBlockingChecked, setIsBlockingChecked ] = useState<boolean>(initialValues?.blocking);
    const [ isJITChecked, setIsJITChecked ] = useState<boolean>(initialValues?.jit);
    const [ isRulesChecked, setIsRulesChecked ] = useState<boolean>(initialValues?.rules);
    const [ connector, setConnector ] = useState<string>(initialValues?.connector);


    useEffect(() => {
        if (!idpList) {
            return;
        }

        if (initialValues?.idp) {
            const idp = idpList?.find(idp => idp.name === initialValues?.idp);

            setSelectedIdp(idp.id);
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

        idpList.map((idp, index) => {
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
            .then((response) => {
                response.provisioning.outboundConnectors.connectors.map((connector, index) => {
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
     * @param values
     */
    const handleIdpChange = (values: Map<string, FormValue>): void => {
        setSelectedIdp(values.get("idp").toString());
    };

    /**
     * Sanitizes and prepares the form values for submission.
     *
     * @param values - Form values.
     * @return {Record<string, unknown>} Prepared values.
     */
    const getFormValues = (values: any): Record<string, unknown> => {
        const idpName = (idpListOptions.find(idp => idp.value === selectedIdp)).text;

        return {
            blocking: isBlockingChecked ? isBlockingChecked : !!values.get("blocking").includes("blocking"),
            connector: connector,
            idp: idpName,
            jit: isJITChecked ? isJITChecked : !!values.get("jit").includes("jit"),
            rules: isRulesChecked ? isRulesChecked : !!values.get("blocking").includes("blocking")
        };
    };

    return (
        <Forms
            onSubmit={ (values) => onSubmit(getFormValues(values)) }
            submitState={ triggerSubmit && triggerSubmit }
        >
            <Grid>
                {
                    !isEdit && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <Field
                                    type="dropdown"
                                    label={
                                        t("console:develop.features.applications.forms.outboundProvisioning.fields" +
                                            ".idp.label")
                                    }
                                    placeholder={
                                        t("console:develop.features.applications.forms.outboundProvisioning.fields" +
                                            ".idp.placeholder")
                                    }
                                    name="idp"
                                    children={ idpListOptions }
                                    requiredErrorMessage={
                                        t("console:develop.features.applications.forms.outboundProvisioning.fields" +
                                            ".idp.validations.empty")
                                    }
                                    readOnly={ readOnly }
                                    required={ false }
                                    value={ initialValues?.idp }
                                    listen={ handleIdpChange }
                                    data-testid={ `${ testId }-idp-dropdown` }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            type="dropdown"
                            label={
                                t("console:develop.features.applications.forms.outboundProvisioning.fields.connector" +
                                    ".label")
                            }
                            placeholder={
                                t("console:develop.features.applications.forms.outboundProvisioning.fields.connector" +
                                    ".placeholder")
                            }
                            name="connector"
                            children={ connectorListOptions }
                            requiredErrorMessage={
                                t("console:develop.features.applications.forms.outboundProvisioning.fields" +
                                    ".connector.validations.empty")
                            }
                            readOnly={ readOnly }
                            required={ true }
                            value={ initialValues?.connector }
                            listen={
                                (values) => {
                                    setConnector(values.get("connector").toString());
                                }
                            }
                            data-testid={ `${ testId }-provisioning-connector-dropdown` }
                        />
                        { connectorListOptions?.length <= 0 && (
                            <Hint icon="warning sign">
                                {
                                    t("console:develop.features.applications.edit.sections.provisioning." +
                                        "outbound.addIdpWizard.errors.noProvisioningConnector")
                                }
                            </Hint>
                        ) }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="rules"
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: t("console:develop.features.applications.forms.outboundProvisioning" +
                                        ".fields.rules.label"),
                                    value: "rules"
                                }
                            ] }
                            value={ initialValues?.rules ? [ "rules" ] : [] }
                            listen={
                                (values) => {
                                    setIsRulesChecked(values.get("rules").includes("rules"));
                                }
                            }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-rules-checkbox` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.outboundProvisioning.fields.rules.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="blocking"
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: t("console:develop.features.applications.forms.outboundProvisioning" +
                                        ".fields.blocking.label"),
                                    value: "blocking"
                                }
                            ] }
                            readOnly={ readOnly }
                            value={ initialValues?.blocking ? [ "blocking" ] : [] }
                            listen={
                                (values) => {
                                    setIsBlockingChecked(values.get("blocking").includes("blocking"));
                                }
                            }
                            data-testid={ `${ testId }-blocking-checkbox` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.outboundProvisioning.fields.blocking" +
                                ".hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            name="jit"
                            required={ false }
                            requiredErrorMessage=""
                            type="checkbox"
                            children={ [
                                {
                                    label: t("console:develop.features.applications.forms.outboundProvisioning" +
                                        ".fields.jit.label"),
                                    value: "jit"
                                }
                            ] }
                            value={ initialValues?.jit ? [ "jit" ] : [] }
                            listen={
                                (values) => {
                                    setIsJITChecked(values.get("jit").includes("jit"));
                                }
                            }
                            readOnly={ readOnly }
                            data-testid={ `${ testId }-jit-checkbox` }
                        />
                        <Hint>
                            { t("console:develop.features.applications.forms.outboundProvisioning.fields.jit.hint") }
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                {
                    isEdit && !readOnly && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <PrimaryButton
                                    type="submit"
                                    size="small"
                                    className="form-button"
                                    data-testid={ `${ testId }-submit-button` }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { t("common:update") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    );
};

/**
 * Default props for the application outbound provisioning wizard idp form component.
 */
OutboundProvisioningWizardIdpForm.defaultProps = {
    "data-testid": "application-outbound-provisioning-wizard-idp-form"
};

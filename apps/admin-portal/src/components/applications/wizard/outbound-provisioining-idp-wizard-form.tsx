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

import { Field, Forms, FormValue } from "@wso2is/forms";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import { Hint, PrimaryButton } from "@wso2is/react-components";
import { getIdentityProviderDetail } from "../../../api";

/**
 * Proptypes for the outbound provisioning IDP form component.
 */
interface OutboundProvisioningIdpWizardFormPropsInterface {
    initialValues: any;
    triggerSubmit: boolean;
    idpList: any;
    onSubmit: (values: any) => void;
    isEdit?: boolean;
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
 * @return {JSX.Element}
 */
export const OutboundProvisioningWizardIdpForm: FunctionComponent<OutboundProvisioningIdpWizardFormPropsInterface> = (
    props: OutboundProvisioningIdpWizardFormPropsInterface
): JSX.Element => {

    const {
        initialValues,
        idpList,
        triggerSubmit,
        onSubmit,
        isEdit
    } = props;

    const [ idpListOptions, setIdpListOptions ] = useState<DropdownOptionsInterface[]>([]);
    const [ connectorListOptions, setConnectorListOptions ] = useState<DropdownOptionsInterface[]>([]);
    const [ selectedIdp, setSelectedIdp ] = useState<string>();

    /**
     * Set the IDP options for the dropdown.
     */
    useEffect(() => {
        if(!idpList) {
            return;
        }

        const idpOptions: DropdownOptionsInterface[] = [];
        let idpOption: DropdownOptionsInterface = {
            text: "",
            key: -1,
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
            text: "",
            key: -1,
            value: ""
        };
        getIdentityProviderDetail(selectedIdp)
            .then((response) => {
                response.provisioning.outboundConnectors.connectors.map((connector, index) => {
                    // Add check for isEnabled
                    connectorOption = {
                        key: index,
                        text: connector.name,
                        value: connector.name
                    };
                    connectorOptions.push(connectorOption);
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
     * @return {object} Prepared values.
     */
    const getFormValues = (values: any): object => {
        const idpName = (idpListOptions.find(idp => idp.value === selectedIdp)).text;
        return {
            idp: idpName,
            connector: values.get("connector").toString(),
            blocking: !!values.get("blocking").includes("blocking"),
            rules: !!values.get("rules").includes("rules"),
            jit: !!values.get("jit").includes("jit")
        };
    };

    return (
        <Forms
            onSubmit={ (values) => onSubmit(getFormValues(values)) }
            submitState={ triggerSubmit }
        >
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            type="dropdown"
                            label="Identity Provider"
                            placeholder="Select identity provider"
                            name="idp"
                            children={ idpListOptions }
                            requiredErrorMessage="It is mandatory to select an IDP."
                            required={ false }
                            value={ initialValues && initialValues.idp }
                            listen={ handleIdpChange }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        <Field
                            type="dropdown"
                            label="Provisioning Connector"
                            placeholder="Select provisioning connector"
                            name="connector"
                            children={ connectorListOptions }
                            requiredErrorMessage="It is mandatory to select a provisioning connector."
                            required={ false }
                            value={ initialValues && initialValues.connector }
                        />
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
                                    label: "Enable Rules",
                                    value: "rules"
                                }
                            ] }
                            value={ [ initialValues && initialValues.rules ] }
                        />
                        <Hint>
                            Provision users based on the pre-defined XACML rules
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
                                    label: "Blocking",
                                    value: "blocking"
                                }
                            ] }
                            value={ [ initialValues && initialValues.blocking ] }
                        />
                        <Hint>
                            Block the authentication flow until the provisioning is completed.
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
                                    label: "JIT Outbound",
                                    value: "jit"
                                }
                            ] }
                            value={ [ initialValues && initialValues.jit ] }
                        />
                        <Hint>
                            Provision users to the store authenticated using just-in-time provisioning.
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                {
                    isEdit && (
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                <PrimaryButton type="submit">
                                    Update
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
            </Grid>
        </Forms>
    );
};

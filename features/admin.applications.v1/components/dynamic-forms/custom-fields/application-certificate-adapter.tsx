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

import { Code } from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import { FieldRenderProps, useFormState } from "react-final-form";
import { Trans, useTranslation } from "react-i18next";
import {
    ApplicationInterface,
    CertificateInterface,
    CertificateTypeInterface,
    SupportedAuthProtocolTypes
} from "../../../models";
import { ApplicationCertificateWrapper } from "../../settings/certificate";

/**
 * Props for the ApplicationCertificateAdapter component.
 */
export interface ApplicationCertificateAdapterPropsInterface extends
    FieldRenderProps<CertificateInterface, HTMLElement> {
    /**
     * The type of protocol to which the certificate belongs.
     */
    protocol: SupportedAuthProtocolTypes;
    /**
     * Data of the current application.
     */
    application: ApplicationInterface;
    /**
     * Callback to trigger when the application update occurs.
     */
    onApplicationUpdate: (id: string) => void;
    /**
     * Determine whether to hide the JWKS certificate option.
     */
    hideJWKS: boolean;
    /**
     * Indicates whether the field is required.
     */
    required: boolean;
    /**
     * Indicates whether the field is a read-only field.
     */
    readonly: boolean;
}

/**
 * Application certificate adapter for use with React Final Form.
 * This adapter wraps the ApplicationCertificateWrapper component and integrates it with React Final Form.
 *
 * @param props - The component props.
 * @returns The ApplicationCertificateWrapper component.
 */
const ApplicationCertificateAdapter: FunctionComponent<ApplicationCertificateAdapterPropsInterface> = (
    props: ApplicationCertificateAdapterPropsInterface
): ReactElement => {
    const {
        input,
        protocol,
        application,
        onApplicationUpdate,
        hideJWKS,
        required,
        readOnly
    } = props;

    const { t } = useTranslation();
    const { values, submitting } = useFormState();

    const checkDeleteAllowed = () => {
        if (protocol === SupportedAuthProtocolTypes.SAML) {
            return !values?.requestValidation?.enableSignatureValidation &&
                !values?.singleSignOnProfile?.assertion?.encryption?.enabled;
        } else if (protocol === SupportedAuthProtocolTypes.OIDC) {
            return !(values.idToken?.encryption?.enabled);
        }

        return true;
    };

    const getDeleteIsNotAllowedTooltip = () => {
        if (protocol === SupportedAuthProtocolTypes.SAML) {
            return t("applications:forms." +
                "inboundSAML.sections.certificates.disabledPopup");
        } else if (protocol === SupportedAuthProtocolTypes.OIDC) {
            return (
                <Fragment>
                    <Trans
                        i18nKey={ "applications:forms" +
                        ".inboundOIDC.sections.certificates.disabledPopup" }
                    >
                        This certificate is used to encrypt the <Code>id_token</Code>.
                        First, you need to disable <Code>id_token</Code> encryption to proceed.
                    </Trans>
                </Fragment>
            );
        }

        return null;
    };

    const canDiscardCertificate = () => {
        if (protocol === SupportedAuthProtocolTypes.SAML) {
            return !values?.requestValidation?.enableSignatureValidation;
        }

        return false;
    };

    return (
        <>
            <ApplicationCertificateWrapper
                protocol={ protocol }
                deleteAllowed={ checkDeleteAllowed() }
                reasonInsideTooltipWhyDeleteIsNotAllowed={
                    getDeleteIsNotAllowedTooltip()
                }
                onUpdate={ onApplicationUpdate }
                application={ application }
                updateCertFinalValue={ (value: string) => input?.onChange({ ...input?.value, value }) }
                updateCertType={ (certType: CertificateTypeInterface) =>
                    input?.onChange({ ...input?.value, type: certType }) }
                canDiscardCertificate = { (): boolean =>  canDiscardCertificate() }
                certificate={ input?.value }
                readOnly={ readOnly }
                hidden={ false }
                isRequired={ required }
                hideJWKS={ hideJWKS }
                triggerSubmit={ submitting }
                hideDivider={ true }
            />
        </>
    );
};

export default ApplicationCertificateAdapter;

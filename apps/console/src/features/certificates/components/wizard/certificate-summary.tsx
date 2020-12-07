/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { DisplayCertificate, DistinguishedName, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";

/**
 * Prop types of the of the `CertificateSummary` component 
 */
interface CertificateSummaryPropsInterface extends TestableComponentInterface {
    /**
     * The alias of the certificate.
     */
    name: string;
    /**
     * The decoded certificate details. 
     */
    certificate: DisplayCertificate;
}

/**
 * This is the summary view of the certificate import wizard.
 * 
 * @param {CertificateSummaryPropsInterface} props
 * 
 * @returns {ReactElement}
 */
export const CertificateSummary: FunctionComponent<CertificateSummaryPropsInterface> = (
    props: CertificateSummaryPropsInterface
): ReactElement => {

    const {
        name,
        certificate,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    return (
        <Grid className="wizard-summary" data-testid={ testId }>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <h3>{ name }</h3>
                        <div className="description">
                            { t("console:manage.features.certificates.keystore.summary.sn")
                                + " " + certificate?.serialNumber }
                        </div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{ t("console:manage.features.certificates.keystore.summary.validFrom")}</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{
                        certificate.validFrom.toLocaleString("en-us", {
                            day: "numeric",
                            hour: "numeric",
                            hour12: true,
                            minute: "numeric",
                            month: "long",
                            timeZoneName: "short",
                            weekday: "short",
                            year: "numeric"
                        }) }
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{t("console:manage.features.certificates.keystore.summary.validTill")}</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{
                        certificate.validTill.toLocaleString("en-us", {
                            day: "numeric",
                            hour: "numeric",
                            hour12: true,
                            minute: "numeric",
                            month: "long",
                            timeZoneName: "short",
                            weekday: "short",
                            year: "numeric"
                        }) }
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{t("console:manage.features.certificates.keystore.summary.issuerDN")}</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{ certificate.issuerDN.map((attribute: DistinguishedName) => {
                        return `${Object.entries(attribute)[ 0 ][ 0 ]}=${Object.entries(attribute)[ 0 ][ 1 ]}`;
                    }).join((", ")) }
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{t("console:manage.features.certificates.keystore.summary.subjectDN")}</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{ certificate.subjectDN.map((attribute: DistinguishedName) => {
                        return `${Object.entries(attribute)[ 0 ][ 0 ]}=${Object.entries(attribute)[ 0 ][ 1 ]}`;
                    }).join((", ")) }
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{t("console:manage.features.certificates.keystore.summary.version")}</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">
                        { certificate.version }
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the component.
 */
CertificateSummary.defaultProps = {
    "data-testid": "certificate-summary"
};

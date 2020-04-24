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

import React, { ReactElement } from "react";
import { Grid } from "semantic-ui-react";
import { DN, DisplayCertificate } from "../../models";

interface CertificateSummaryPropsInterface {
    name: string;
    certificate: DisplayCertificate;
}
export const CertificateSummary = (props: CertificateSummaryPropsInterface): ReactElement => {

    const { name, certificate } = props;

    return (
        <Grid className="wizard-summary">
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <h3>{ name }</h3>
                        <div className="description">Serial Number: { certificate?.serialNumber }</div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">Not valid before</div>
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
                    <div className="label">Not valid after</div>
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
                    <div className="label">Issuer DN</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{ certificate.issuerDN.map((attribute: DN) => {
                        return `${Object.entries(attribute)[ 0 ][ 0 ]}=${Object.entries(attribute)[ 0 ][ 1 ]}`;
                    }).join((", ")) }
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">Subject DN</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{ certificate.subjectDN.map((attribute: DN) => {
                        return `${Object.entries(attribute)[ 0 ][ 0 ]}=${Object.entries(attribute)[ 0 ][ 1 ]}`;
                    }).join((", ")) }
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">Version</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">
                        { certificate.version }
                    </div>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}

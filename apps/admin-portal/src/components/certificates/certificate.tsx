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

import React, { FunctionComponent, ReactElement } from "react";
import { Divider, Header, Icon, Label, Segment } from "semantic-ui-react";
import { CertificateIllustrations } from "../../configs";
import { DisplayCertificate, DistinguishedName } from "../../models";

/**
 * Prop types of the `Certificate` component.
 */
interface CertificatePropsInterface {
    /**
     * The decoded certificate details
     */
    certificate: DisplayCertificate;
}

/**
 * This renders the certificate component that 
 * displays the details of a certificate.
 * 
 * @param {CertificatePropsInterface} props
 * 
 * @returns {ReactElement}
 */
export const Certificate: FunctionComponent<CertificatePropsInterface> = (
    props: CertificatePropsInterface
): ReactElement => {

    const {
        alias,
        serialNumber,
        version,
        issuerDN,
        subjectDN,
        validFrom,
        validTill
    } = props.certificate;

    const isValid = new Date() >= validFrom && new Date() <= validTill;

    return (
        <Segment className="certificate" compact padded="very">
            <div className="certificate-ribbon">
                <CertificateIllustrations.ribbon.ReactComponent />
            </div>

            <Header>
                <Header.Content>{ alias }</Header.Content>
                <Header.Subheader><span>Serial Number:</span> { serialNumber }</Header.Subheader>
            </Header>

            <p className="certificate-field">
                <span>Not valid before:</span> {
                    validFrom.toLocaleString("en-us", {
                        day: "numeric",
                        hour: "numeric",
                        hour12: true,
                        minute: "numeric",
                        month: "long",
                        timeZoneName: "short",
                        weekday: "short",
                        year: "numeric"
                    })
                }
            </p>

            <p className="certificate-field">
                <span>Not valid after:</span> {
                    validTill.toLocaleString("en-us", {
                        day: "numeric",
                        hour: "numeric",
                        hour12: true,
                        minute: "numeric",
                        month: "long",
                        timeZoneName: "short",
                        weekday: "short",
                        year: "numeric"
                    })
                }
            </p>

            <Divider hidden />

            <p className="certificate-field">
                <span>Issuer DN:</span> { issuerDN.map((attribute: DistinguishedName) => {
                    return `${Object.entries(attribute)[ 0 ][ 0 ]}=${Object.entries(attribute)[ 0 ][ 1 ]}`;
                }).join((", ")) }
            </p>

            <Divider hidden />

            <p className="certificate-field">
                <span>Subject DN:</span> { subjectDN.map((attribute: DistinguishedName) => {
                    return `${Object.entries(attribute)[ 0 ][ 0 ]}=${Object.entries(attribute)[ 0 ][ 1 ]}`;
                }).join(", ") }
            </p>

            <p className="certificate-version">
                <span>Version:</span> { version + " " }
                <Label color={ isValid ? "green" : "red" } size="mini">
                    <Icon name={ isValid ? "calendar check outline" : "calendar times outline" } />
                    { isValid ? "Valid" : "Expired" }
                </Label>
            </p>
            <div className="certificate-badge"><CertificateIllustrations.badge.ReactComponent /></div>
        </Segment>
    )
}

/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    DisplayCertificate,
    DistinguishedName,
    IdentifiableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import moment from "moment";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
import { Divider, Grid, Icon, Segment, SemanticCOLORS, SemanticICONS } from "semantic-ui-react";
import { Popup } from "../popup";

/**
 * Prop types of the `Certificate` component.
 */
export interface CertificatePropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * The decoded certificate details
     */
    certificate: DisplayCertificate;
    /**
     * labels.
     */
    labels: CertificateLablesPropsInterface;
}

/**
 * Interface for labels in the certificate.
 */
export interface CertificateLablesPropsInterface {
    issuerDN: string;
    subjectDN: string;
    validFrom: string;
    validTill: string;
    version: string;
}

/**
 * This renders the certificate component that displays the details of a certificate.
 *
 * @param props - Props injected to the component.
 * @returns the certificate component
 */
export const Certificate: FunctionComponent<CertificatePropsInterface> = (
    props: CertificatePropsInterface
): ReactElement => {

    const {
        labels,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const {
        version,
        issuerDN,
        validFrom,
        validTill
    } = props.certificate;

    /**
     * Creates the validity icon.
     */
    const showValidTillIcon = (): ReactElement => {
        let icon: SemanticICONS = null;
        let iconColor: SemanticCOLORS = null;
        let popupText = "";

        const currentDate = moment(new Date());
        const expiryDate = moment(validTill);
        const isValid = new Date() <= validTill;

        if (isValid) {
            if (Math.abs(moment.duration(currentDate.diff(expiryDate)).months()) > 1) {
                icon = "check circle";
                iconColor = "green";
                popupText = "Certificate is valid.";
            } else {
                icon = "exclamation circle";
                iconColor = "yellow";
                popupText = "Certificate is soon to be expired.";
            }
        } else {
            icon = "times circle";
            iconColor = "red";
            popupText = "Certificate is expired.";
        }

        return (
            <>
                <Popup
                    trigger={ <Icon name={ icon } color={ iconColor } /> }
                    content={ popupText }
                    inverted
                    position="top center"
                    size="mini"
                />
            </>
        );
    };

    /**
     * Creates the validity icon for expiry date.
     */
    const showValidFromIcon = (): ReactElement => {
        let icon: SemanticICONS = null;
        let iconColor: SemanticCOLORS = null;
        let popupText = "";

        const currentDate = moment(new Date());
        const expiryDate = moment(validFrom);
        const isValid = new Date() >= validFrom;

        if (isValid) {
            icon = "check circle";
            iconColor = "green";
            popupText = "Certificate is valid.";
        } else {
            if (Math.abs(moment.duration(currentDate.diff(expiryDate)).months()) > 1) {
                icon = "times circle";
                iconColor = "red";
                popupText = "Certificate is still not valid.";
            } else {
                icon = "exclamation circle";
                iconColor = "yellow";
                popupText = "Certificate is soon to be valid.";
            }
        }

        return (
            <>
                <Popup
                    trigger={ <Icon name={ icon } color={ iconColor } /> }
                    content={ popupText }
                    inverted
                    position="top center"
                    size="mini"
                />
            </>
        );
    };

    return (
        <Segment
            className="certificate"
            compact
            data-testid={ testId }
            data-componentid={ componentId }
        >
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 16 } mobile={ 16 } tablet={ 16 }>
                        <p className="certificate-field">
                            <span>
                                <strong>
                                    { labels.validFrom }
                                </strong>
                            </span>
                            <span className="valid-before-date">
                                {
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
                                { showValidFromIcon() }
                            </span>
                        </p>
                        <p className="certificate-field">
                            <span>
                                <strong>
                                    { labels.validTill }
                                </strong>
                            </span>
                            <span className="valid-till-date">
                                {
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
                                { showValidTillIcon() }
                            </span>
                        </p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>

            <Divider hidden />
            <Divider hidden />

            <Grid className="certificate-issuer">
                <Grid.Row>
                    <Grid.Column computer={ 4 } mobile={ 4 } tablet={ 4 }/>
                    <Grid.Column computer={ 6 } mobile={ 6 } tablet={ 6 }>
                        <p className="certificate-field">
                            <span>
                                <strong>
                                    { labels.issuerDN }
                                </strong>
                            </span>
                        </p>
                    </Grid.Column>
                    <Grid.Column computer={ 6 } mobile={ 6 } tablet={ 6 }>
                        <p className="certificate-field">
                            <span>
                                <strong>
                                    { labels.subjectDN }
                                </strong>
                            </span>
                        </p>
                    </Grid.Column>
                </Grid.Row>
                {
                    issuerDN.map((attribute: DistinguishedName, index: number) => (
                        <Fragment key={ index }>
                            <Grid.Row>
                                <Grid.Column computer={ 4 } mobile={ 4 } tablet={ 4 }>
                                    <p className="certificate-field">
                                        <span>
                                            <strong>{ Object.entries(attribute)[ 0 ][ 0 ] }</strong>
                                        </span>
                                    </p>
                                </Grid.Column>
                                <Grid.Column computer={ 6 } mobile={ 6 } tablet={ 6 }>
                                    <p className="certificate-field">
                                        <span>
                                            { Object.entries(attribute)[ 0 ][ 1 ] }
                                        </span>
                                    </p>
                                </Grid.Column>
                                <Grid.Column computer={ 6 } mobile={ 6 } tablet={ 6 }>
                                    <p className="certificate-field">
                                        <span>
                                            { Object.entries(attribute)[ 0 ][ 1 ] }
                                        </span>
                                    </p>
                                </Grid.Column>
                            </Grid.Row>
                        </Fragment>
                    ))
                }
            </Grid>
            <Divider hidden />
            <p className="certificate-version">
                <span>{ labels.version }</span> { version + " " }
            </p>
        </Segment>
    );
};

/**
 * Default props for the component.
 */
Certificate.defaultProps = {
    "data-componentid": "certificate",
    "data-testid": "certificate"
};

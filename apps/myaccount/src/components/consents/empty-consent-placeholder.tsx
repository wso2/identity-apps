/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Link from "@oxygen-ui/react/Link";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";

const StyledEmptyPlaceholder: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    padding: theme.spacing(4, 2.5, 3.5),
    textAlign: "center"
}));

const StyledMessage: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1.5)
}));

const StyledLink: typeof Link = styled(Link)({
    alignItems: "center",
    display: "inline-flex",
    fontWeight: 600,
    gap: 6,
    textDecoration: "none"
});

/**
 * Prop types for the empty consent placeholder component.
 */
interface EmptyConsentPlaceholderPropsInterface extends IdentifiableComponentInterface {
    message: string;
    linkText: string;
    linkHref: string;
}

/**
 * Shared empty-state placeholder used across the consent-related sections
 * (Consent Management, Policy Consents, Communication Preferences) to
 * replace the previous info-alert placeholder with plain text and a
 * documentation link.
 *
 * @param props - Props injected to the component.
 *
 * @returns Empty consent placeholder component.
 */
export const EmptyConsentPlaceholder: FunctionComponent<EmptyConsentPlaceholderPropsInterface> = (
    props: EmptyConsentPlaceholderPropsInterface
): ReactElement => {

    const {
        message,
        linkText,
        linkHref,
        ["data-componentid"]: componentId
    } = props;

    return (
        <StyledEmptyPlaceholder data-componentid={ componentId }>
            <StyledMessage variant="body2" data-componentid={ `${ componentId }-message` }>
                { message }
            </StyledMessage>
            <StyledLink
                href={ linkHref }
                target="_blank"
                rel="noopener noreferrer"
                data-componentid={ `${ componentId }-link` }
            >
                { linkText }
                <span>→</span>
            </StyledLink>
        </StyledEmptyPlaceholder>
    );
};

EmptyConsentPlaceholder.defaultProps = {
    "data-componentid": "empty-consent-placeholder"
};
/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { FunctionComponent, SVGProps } from "react";
import {
    ReactComponent as MailBoxIllustration
} from "../../../../assets/images/illustrations/mailbox-illustration.svg";

/**
 * Configuration to get the illustrations related to marketing consent feature.
 * 
 * @returns the illustrations related to marketing consent feature.
 */
export const getMarketingConsentIllustrations = (): {
    mailBox: FunctionComponent<SVGProps<SVGSVGElement>>;
} => {
    return {
        mailBox: MailBoxIllustration
    };
};

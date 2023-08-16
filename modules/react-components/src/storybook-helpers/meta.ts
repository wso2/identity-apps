/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Sample Profile Information for the story.
 */
export const getSampleProfileInfo = (): {
    emails: string[];
    name: {
        familyName: string;
        givenName: string;
    };
    profileUrl: string;
    userName: string;
} => {

    return {
        emails: [ "johndoe@example.com", "johndoe@gmail.com", "john@gmail.com" ],
        name: {
            familyName: "Doe",
            givenName: "John"
        },
        profileUrl: "https://avatars3.githubusercontent.com/u/25959096?s=460&v=4",
        userName: "john"
    };
};

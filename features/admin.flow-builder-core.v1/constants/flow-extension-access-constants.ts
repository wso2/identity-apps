/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";

/**
 * Colours of a READ or WRITE toggle.
 */
interface AccessChipColorsInterface {
    color: string;
    background: string;
}

/**
 * Constants of the access a flow extension has to the flow context, shared by the access configuration of a flow
 * extension and the flow extension step of the flow builder.
 */
class FlowExtensionAccessConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() { }

    /**
     * Flow type of a node that applies to every flow.
     */
    public static readonly ALL_FLOW_TYPES: string = "ALL";

    /**
     * Flow types in the order they are shown.
     */
    public static readonly FLOW_TYPE_ORDER: string[] = [
        FlowTypes.REGISTRATION,
        FlowTypes.PASSWORD_RECOVERY,
        FlowTypes.INVITED_USER_REGISTRATION
    ];

    /**
     * Identifier type of a flow input that collects an attribute of the organization the flow onboards.
     */
    public static readonly ORGANIZATION_IDENTIFIER_TYPE: string = "ORGANIZATION";

    /**
     * Organization inputs with fields of their own, so they are not listed among the organization's attributes.
     */
    public static readonly STANDARD_ORGANIZATION_INPUTS: string[] = [
        "organizationName",
        "organizationHandle",
        "organizationDescription"
    ];

    public static readonly STRING_DATA_TYPE: string = "String";

    public static readonly NAME_SELECTOR_SUFFIX: string = "]";

    public static readonly RUNTIME_VALUES_PATH: string = "/runtimeValues";
    public static readonly RUNTIME_VALUE_PATH_PREFIX: string = "/runtimeValues[name=";

    public static readonly REQUEST_HEADERS_PATH: string = "/request/additionalHeaders";
    public static readonly REQUEST_HEADER_PATH_PREFIX: string = "/request/additionalHeaders[name=";

    public static readonly ORGANIZATION_PATH: string = "/organization";

    public static readonly SUBJECT_ORGANIZATION_PATH: string = "/subjectOrganization";
    public static readonly SUBJECT_ORGANIZATION_PATH_PREFIX: string = "/subjectOrganization/";
    public static readonly SUBJECT_ORGANIZATION_ID_PATH: string = "/subjectOrganization/id";
    public static readonly SUBJECT_ORGANIZATION_NAME_PATH: string = "/subjectOrganization/name";
    public static readonly SUBJECT_ORGANIZATION_HANDLE_PATH: string = "/subjectOrganization/handle";
    public static readonly SUBJECT_ORGANIZATION_DESCRIPTION_PATH: string = "/subjectOrganization/description";
    public static readonly SUBJECT_ORGANIZATION_ATTRIBUTES_PATH: string = "/subjectOrganization/attributes";
    public static readonly SUBJECT_ORGANIZATION_ATTRIBUTE_PATH_PREFIX: string = "/subjectOrganization/attributes[name=";

    public static readonly READ_CHIP_COLORS: AccessChipColorsInterface = { background: "#E8F5E9", color: "#2E7D32" };
    public static readonly WRITE_CHIP_COLORS: AccessChipColorsInterface = { background: "#E3F2FD", color: "#1565C0" };
    public static readonly IDLE_CHIP_BORDER_COLOR: string = "#EBEBEB";
    public static readonly IDLE_CHIP_TEXT_COLOR: string = "#787878";

    /**
     * Background of a section header, and of a row on hover.
     */
    public static readonly ROW_BAND_COLOR: string = "#F4F4F4";

    public static readonly CHEVRON_COLOR: string = "#D0D0D0";
}

export default FlowExtensionAccessConstants;

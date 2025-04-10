
export class ApprovalProcessesConstants {
    
    private constructor() {}
    public static getPaths(): Map<string, string> {
        return new Map<string, string>().set(
            "APPROVAL_PROCESS_CREATE",
            `${window["AppUtils"].getConfig().adminApp.basePath}/workflow-model-create`
            // "./approval-process-create-page.tsx"
        );
    }
}

interface ApprovalProcessValidationRegexPatternInterface {
    EscapeRegEx: string;
}

/**
 * User store validation regEx patterns
 */
export const APPROVALPROCESS_VALIDATION_REGEX_PATTERNS: ApprovalProcessValidationRegexPatternInterface = {
    EscapeRegEx: "\\$\\{[^}]*\\}"
};

/**
 * Remote user store edit tab IDs.
 */
export enum WorkflowModelEditTabIDs {
    GENERAL = "general",
    CONFIGURATIONS = "configurations",
}

export default ApprovalProcessesConstants

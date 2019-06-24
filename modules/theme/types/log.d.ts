export = index;
declare function index(msgItemIgnored: any, ...args: any[]): void;
declare namespace index {
    const debug: any;
    function disable(): any;
    function enable(): any;
    const error: any;
    function get(namespace: any): any;
    function getAllInitializedLevels(): any;
    function getAllInitializedNamespaces(): any;
    const info: any;
    const isEnabled: boolean;
    function isLevelInitialized(level: any): any;
    function isNamespaceInitialized(namespace: any): any;
    const level: string;
    const levelIndex: number;
    // Circular reference from index
    const levelRoot: any;
    const namespace: any;
    const namespaceTokens: any;
    const notice: any;
    const warn: any;
    const warning: any;
}

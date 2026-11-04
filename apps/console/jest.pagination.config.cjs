module.exports = {
    displayName: "console-pagination",
    rootDir: ".",
    moduleFileExtensions: [
        "js",
        "jsx",
        "ts",
        "tsx",
        "json",
        "node"
    ],
    testEnvironment: "node",
    testMatch: [
        "<rootDir>/src/features/admin.groups.v1/__tests__/group-user-pagination.test.ts"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": [ "ts-jest", {
            tsconfig: "<rootDir>/tsconfig.json"
        } ]
    }
};

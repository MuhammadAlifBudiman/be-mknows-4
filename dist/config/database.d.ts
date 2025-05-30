declare const DB_HOST: string;
declare const DB_USER: string;
declare const DB_PASSWORD: string;
declare const DB_DATABASE: string;
declare const DB_PORT: string;
export namespace development {
    export const dialect: string;
    export { DB_HOST as host };
    export { DB_USER as username };
    export { DB_PASSWORD as password };
    export { DB_DATABASE as database };
    export { DB_PORT as port };
    export namespace define {
        const underscored: boolean;
        const freezeTableName: boolean;
        const paranoid: boolean;
        const createdAt: string;
        const updatedAt: string;
        const deletedAt: string;
    }
    export namespace pool {
        const min: number;
        const max: number;
    }
    export const logQueryParameters: boolean;
    export const logging: boolean;
    export const benchmark: boolean;
}
export namespace production {
    const dialect_1: string;
    export { dialect_1 as dialect };
    export { DB_HOST as host };
    export { DB_USER as username };
    export { DB_PASSWORD as password };
    export { DB_DATABASE as database };
    export { DB_PORT as port };
    export namespace define_1 {
        const underscored_1: boolean;
        export { underscored_1 as underscored };
        const freezeTableName_1: boolean;
        export { freezeTableName_1 as freezeTableName };
        const paranoid_1: boolean;
        export { paranoid_1 as paranoid };
        const createdAt_1: string;
        export { createdAt_1 as createdAt };
        const updatedAt_1: string;
        export { updatedAt_1 as updatedAt };
        const deletedAt_1: string;
        export { deletedAt_1 as deletedAt };
    }
    export { define_1 as define };
    const logging_1: boolean;
    export { logging_1 as logging };
    const benchmark_1: boolean;
    export { benchmark_1 as benchmark };
}
export {};

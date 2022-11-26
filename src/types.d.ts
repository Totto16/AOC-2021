import { CountFunction, PossibleFillTypes, PrintNestedMapFunction } from './utils';

export {};
declare global {
    interface Array<T> {
        equals(array: Array<T>): boolean;
        includesArray(this: Array<Array<T>>, array: Array<T>): boolean;
        printNested(this: Array<T> | Array<Array<T>>, mapFunction?: PrintNestedMapFunction<T>): boolean;
        copy(): Array<T>;
        isArray(): true;
        count(countFunction?: CountFunction<T>, startValue?: number): number;
        combine(second: Array<T>, flat?: boolean): Array<T>;
        fillElements(
            this: PossibleFillTypes | T[],
            start?: number,
            end?: number
        ): this extends PossibleFillTypes ? Array<number> : [];
        print(): false | void;
        atSafe(index: number): T;
    }

    interface Object {
        isArray(): boolean;
    }
}


declare module 'ical.js' {
    export function parse(input: string): any;
    export class Component {
        constructor(jcal: any);
        getAllSubcomponents(name: string): Component[];
        getFirstPropertyValue(name: string): any;
    }
}

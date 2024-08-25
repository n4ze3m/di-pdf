import Handlebars from "handlebars";


export const compileTemplate = (html:  string, varaible: any)=> {
    const template = Handlebars.compile(html);
    const result = template(varaible);
    return result;
}
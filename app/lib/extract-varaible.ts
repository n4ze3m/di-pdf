import Handlebars from "handlebars";

type HelperDetails = {
    contextParam?: number;
    transmogrify?: (path: string[]) => string[];
    optional?: boolean;
};

type Options = {
    [key: string]: HelperDetails;
};
interface Schema {
    _type: string;
    _optional?: boolean;
    '#'?: Schema;
    [key: string]: any;
}

const extract = (
    template: string,
    callback: (segs: string[], optional: boolean) => void,
    opts?: Options
): void => {
    opts = opts || {};

    const emit = (segs: string[], optional: boolean) =>
        callback(segs, optional);

    const helperDetails: Options = {
        each: {
            contextParam: 0,
            transmogrify: (path) => {
                const clone = [...path];
                clone.push("#");
                return clone;
            },
        },
        with: { contextParam: 0 },
        if: { optional: true },
        ...opts,
    };

    const parsed = Handlebars.parse(template);

    const extend = (path: string[], subpath: any): string[] => {
        let clone: string[];
        if (subpath.original?.startsWith("@root")) {
            clone = [...subpath.parts];
            return [clone.slice(1).join("")];
        } else if (subpath.original?.startsWith("@")) {
            return path;
        } else if (subpath.original?.startsWith("../")) {
            clone =
                path[path.length - 1] === "#" ? path.slice(0, -2) : path.slice(0, -1);
            clone.push(subpath.parts.join(""));
            return clone;
        } else {
            clone = [...path];
            clone.push(subpath.parts.join(""));
            return clone;
        }
    };

    const visit = (
        emit: (segs: string[], optional: boolean) => void,
        path: string[],
        node: any,
        optional = false
    ) => {
        switch (node.type) {
            case "Program":
                node.body.forEach((child: any) => visit(emit, path, child, optional));
                break;

            case "BlockStatement":
                let newPath = path;
                const helper = helperDetails[node.path.original];
                node.params.forEach((child: any) =>
                    visit(emit, path, child, optional || (helper?.optional ?? false))
                );
                if (helper?.contextParam != null) {
                    visit(
                        (path) => (newPath = path),
                        path,
                        node.params[helper.contextParam]
                    );
                    if (helper.transmogrify) {
                        newPath = helper.transmogrify(newPath);
                    }
                }
                visit(emit, newPath, node.program, optional || (helper?.optional ?? false));
                break;

            case "PathExpression":
                emit(extend(path, node), optional);
                break;

            case "MustacheStatement":
                const mustacheHelper = helperDetails[node.path.original];
                if (node.params.length === 0) {
                    visit(emit, path, node.path, optional);
                } else {
                    node.params.forEach((child: any) =>
                        visit(emit, path, child, optional || (mustacheHelper?.optional ?? false))
                    );
                }
                break;
        }
    };
    visit(emit, [], parsed);
};

export const extractSchema = (
    template: string,
    opts?: Options
): Schema => {
    const obj: Record<string, any> = {};

    const callback = (path: string[], optional: boolean) => {
        const augment = (obj: Record<string, any>, path: string[]): void => {
            obj._optional = obj._optional !== undefined ? optional && obj._optional : optional;
            if (!(path.length === 0 || (path.length === 1 && path[0] === "length"))) {
                obj._type = "object";
                const segment = path[0];
                if (segment === "#") {
                    obj._type = "array";
                }
                obj[segment] = obj[segment] || {};
                augment(obj[segment], path.slice(1));
            } else {
                obj._type = "any";
            }
        };
        augment(obj, path);
    };

    extract(template, callback, opts);
    delete obj._optional;
    return obj as Schema;
};

export const schemaToJson = (schema: Schema): any => {
    if (schema._type === "any") {
        return "";
    }
    const keys = Object.keys(schema).filter(
        (key) => key !== "_optional" && key !== "_type" && key !== "#"
    );
    const obj: { [key: string]: any } = {};
    for (const k of keys) {
        const key = schema[k] as Schema;
        if (key._type === "any") {
            obj[k] = "";
        } else if (key._type === "object") {
            obj[k] = schemaToJson(key);
        } else if (key._type === "array") {
            if (key["#"]?._type === "any") {
                obj[k] = [""];
            } else if (key["#"]?._type === "object") {
                obj[k] = [schemaToJson(key["#"] as Schema)];
            } else {
                obj[k] = [schemaToJson(key["#"] as Schema)];
            }
        }
    }
    return obj;
};
``
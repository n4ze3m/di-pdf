import React, { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "../ui/label";

interface Schema {
  [key: string]:
    | string
    | number
    | boolean
    | Schema
    | (string | number | boolean)[]
    | Schema[];
}

interface DynamicFormProps {
  schema: Schema;
  initialData?: Schema;
  onSubmit: (data: Schema) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Schema>({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (path: string, value: any) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const keys = path.split(".");
      let current = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] as Schema;
      }

      current[keys[keys.length - 1]] = value;
      return updatedData;
    });
  };

  const renderForm = (schema: Schema, path: string = ""): JSX.Element[] => {
    return Object.entries(schema).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        return (
          <div key={currentPath} className="space-y-2">
            <Label htmlFor={currentPath}>{key}</Label>
            <Input
              id={currentPath}
              type={typeof value === "number" ? "number" : "text"}
              value={getNestedValue(formData, currentPath) || ""}
              onChange={(e) => handleChange(currentPath, e.target.value)}
            />
          </div>
        );
      } else if (Array.isArray(value)) {
        return renderArrayField(key, value, currentPath);
      } else {
        return (
          <div key={currentPath} className="space-y-2">
            <Label>{key}</Label>
            {renderForm(value as Schema, currentPath)}
          </div>
        );
      }
    });
  };

  const renderArrayField = (key: string, value: any[], currentPath: string) => {
    const arrayValue = (getNestedValue(formData, currentPath) as any[]) || [];

    return (
      <div key={currentPath} className="space-y-2">
        <Label>{key}</Label>
        {arrayValue.map((item, index) => (
          <div key={`${currentPath}.${index}`} className="flex space-x-2">
            {typeof item !== "object" ? (
              <Input
                type="text"
                value={item || ""}
                onChange={(e) =>
                  handleArrayItemChange(currentPath, index, e.target.value)
                }
              />
            ) : (
              <div className="space-y-2">
                {renderForm(value[0] as Schema, `${currentPath}.${index}`)}
              </div>
            )}
            <Button
              type="button"
              variant="destructive"
              onClick={() => handleRemoveArrayItem(currentPath, index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          onClick={() => handleAddArrayItem(currentPath, value[0])}
        >
          Add {key}
        </Button>
      </div>
    );
  };

  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((prev, curr) => prev && prev[curr], obj);
  };

  const handleArrayItemChange = (path: string, index: number, value: any) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const arrayPath = path.split(".");
      let current = updatedData;

      for (let i = 0; i < arrayPath.length - 1; i++) {
        if (!current[arrayPath[i]]) {
          current[arrayPath[i]] = {};
        }
        current = current[arrayPath[i]] as Schema;
      }

      if (!Array.isArray(current[arrayPath[arrayPath.length - 1]])) {
        current[arrayPath[arrayPath.length - 1]] = [];
      }

      (current[arrayPath[arrayPath.length - 1]] as any[])[index] = value;
      return updatedData;
    });
  };

  const handleAddArrayItem = (path: string, schemaItem: any) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const arrayPath = path.split(".");
      let current = updatedData;

      for (let i = 0; i < arrayPath.length - 1; i++) {
        if (!current[arrayPath[i]]) {
          current[arrayPath[i]] = {};
        }
        current = current[arrayPath[i]] as Schema;
      }

      if (!Array.isArray(current[arrayPath[arrayPath.length - 1]])) {
        current[arrayPath[arrayPath.length - 1]] = [];
      }

      const newItem = typeof schemaItem === "object" ? {} : "";
      (current[arrayPath[arrayPath.length - 1]] as any[]).push(newItem);
      return updatedData;
    });
  };

  const handleRemoveArrayItem = (path: string, index: number) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const arrayPath = path.split(".");
      let current = updatedData;

      for (let i = 0; i < arrayPath.length - 1; i++) {
        if (!current[arrayPath[i]]) {
          current[arrayPath[i]] = {};
        }
        current = current[arrayPath[i]] as Schema;
      }

      if (Array.isArray(current[arrayPath[arrayPath.length - 1]])) {
        (current[arrayPath[arrayPath.length - 1]] as any[]).splice(index, 1);
      }

      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {renderForm(schema)}
        <Button className="w-full" type="submit">
          Preview
        </Button>
      </div>
    </form>
  );
};

export default DynamicForm;

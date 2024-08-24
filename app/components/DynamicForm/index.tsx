import React, { useState } from 'react';
import { Form } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from '../ui/label';

interface Schema {
  [key: string]: string | number | boolean | Schema | (string | number | boolean)[] | Schema[];
}

interface DynamicFormProps {
  schema: Schema;
  onSubmit: (data: Schema) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (path: string, value: any) => {
    const updatedFormData = { ...formData };
    const keys = path.split(".");
    let nestedData = updatedFormData;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        nestedData[key] = value;
      } else {
        nestedData = nestedData[key] = nestedData[key] || {};
      }
    });

    setFormData(updatedFormData);
  };

  const renderForm = (schema: Schema, path: string = ""): JSX.Element[] => {
    return Object.entries(schema).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        return (
          <div key={currentPath} className="space-y-2">
            <Label htmlFor={currentPath}>{key}</Label>
            <Input
              id={currentPath}
              type="text"
              value={formData[currentPath] || ""}
              onChange={(e) => handleChange(currentPath, e.target.value)}
            />
          </div>
        );
      } else if (Array.isArray(value)) {
        // Check if the array contains primitive values (string, number, boolean)
        if (typeof value[0] === "string" || typeof value[0] === "number" || typeof value[0] === "boolean") {
          return (
            <div key={currentPath} className="space-y-2">
              <Label>{key}</Label>
              {(formData[currentPath] || []).map((item: any, index: number) => (
                <div key={`${currentPath}.${index}`} className="flex space-x-2">
                  <Input
                    type="text"
                    value={item || ""}
                    onChange={(e) => handlePrimitiveArrayChange(currentPath, index, e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemovePrimitiveArrayItem(currentPath, index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleAddPrimitiveArrayItem(currentPath)}
              >
                Add {key}
              </Button>
            </div>
          );
        } else {
          // Render for array of objects (Schema[])
          return (
            <div key={currentPath} className="space-y-2">
              <Label>{key}</Label>
              {(formData[currentPath] || []).map((item: any, index: number) => (
                <div key={`${currentPath}.${index}`} className="space-y-2">
                  {renderForm(value[0] as Schema, `${currentPath}.${index}`)}
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => handleRemoveNode(currentPath, index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleAddNode(currentPath, value[0] as Schema)}
              >
                Add {key}
              </Button>
            </div>
          );
        }
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

  const handlePrimitiveArrayChange = (path: string, index: number, value: any) => {
    const updatedFormData = { ...formData };
    const keys = path.split(".");
    let nestedData = updatedFormData;

    keys.forEach((key, i) => {
      if (i === keys.length - 1) {
        if (!nestedData[key]) nestedData[key] = [];
        nestedData[key][index] = value;
      } else {
        nestedData = nestedData[key] = nestedData[key] || {};
      }
    });

    setFormData(updatedFormData);
  };

  const handleAddPrimitiveArrayItem = (path: string) => {
    const updatedFormData = { ...formData };
    const keys = path.split(".");
    let nestedData = updatedFormData;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        if (!nestedData[key]) nestedData[key] = [];
        nestedData[key].push("");
      } else {
        nestedData = nestedData[key] = nestedData[key] || {};
      }
    });

    setFormData(updatedFormData);
  };

  const handleRemovePrimitiveArrayItem = (path: string, index: number) => {
    const updatedFormData = { ...formData };
    const keys = path.split(".");
    let nestedData = updatedFormData;

    keys.forEach((key, i) => {
      if (i === keys.length - 1) {
        nestedData[key].splice(index, 1);
      } else {
        nestedData = nestedData[key] = nestedData[key] || {};
      }
    });

    setFormData(updatedFormData);
  };

  const handleAddNode = (path: string, schema: Schema) => {
    const updatedFormData = { ...formData };
    const keys = path.split(".");
    let nestedData = updatedFormData;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        if (!nestedData[key]) nestedData[key] = [];
        nestedData[key].push({});
      } else {
        nestedData = nestedData[key] = nestedData[key] || {};
      }
    });

    setFormData(updatedFormData);
  };

  const handleRemoveNode = (path: string, index: number) => {
    const updatedFormData = { ...formData };
    const keys = path.split(".");
    let nestedData = updatedFormData;

    keys.forEach((key, i) => {
      if (i === keys.length - 1) {
        nestedData[key].splice(index, 1);
      } else {
        nestedData = nestedData[key] = nestedData[key] || {};
      }
    });

    setFormData(updatedFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        {renderForm(schema)}
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
};

export default DynamicForm;

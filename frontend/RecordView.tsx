import React from "react";
import { base } from "@airtable/blocks";
import Field from "@airtable/blocks/dist/types/src/models/field";
import { Box, Button, Heading, Text, useRecordById } from "@airtable/blocks/ui";

interface FieldColor {
  fieldId: string;
  fieldName: string;
  hexColor: string;
}

interface Props {
  tableId: string;
  recordId: string;
  colorFields: Field[];
}

const RecordView: React.FunctionComponent<Props> = ({
  tableId,
  recordId,
  colorFields,
}) => {
  const [isDirty, setDirty] = React.useState<boolean>(false);
  const [fieldColors, setFieldColors] = React.useState<FieldColor[]>([]);

  const table = base.getTableById(tableId);
  const record = useRecordById(table, recordId, {
    fields: colorFields,
  });

  const resetToOriginalColors = React.useCallback(() => {
    setFieldColors(
      colorFields.map((colorField) => ({
        fieldId: colorField.id,
        fieldName: colorField.name,
        hexColor: record.getCellValueAsString(colorField),
      }))
    );
    setDirty(false);
  }, [colorFields, record]);

  React.useEffect(() => {
    resetToOriginalColors();
  }, [resetToOriginalColors]);

  const onColorChange = (fieldId: string, newHexColor: string) => {
    setFieldColors((currentFieldColors) => {
      const editedItem = currentFieldColors.find(
        (fieldColor) => fieldColor.fieldId === fieldId
      );
      editedItem.hexColor = newHexColor;
      return [...currentFieldColors];
    });
    setDirty(true);
  };

  const save = () => {
    let updateObject = {};
    fieldColors.forEach((fieldColor) => {
      updateObject = {
        ...updateObject,
        [fieldColor.fieldName]: fieldColor.hexColor,
      };
    });
    table.updateRecordAsync(record, updateObject);
    setDirty(false);
  };

  const colorTableRows = fieldColors.map((fieldColor) => (
    <tr key={fieldColor.fieldId}>
      <td>
        <Text>{fieldColor.fieldName}</Text>
      </td>
      <td>
        <input
          type="color"
          value={fieldColor.hexColor}
          onChange={(event) =>
            onColorChange(fieldColor.fieldId, event.target.value)
          }
        />
      </td>
      <td>
        <Text>{fieldColor.hexColor}</Text>
      </td>
    </tr>
  ));

  return (
    <Box marginBottom={4}>
      <Heading>{record.getCellValueAsString(table.primaryField)}</Heading>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Color</th>
            <th>HEX code</th>
          </tr>
        </thead>
        <tbody>{colorTableRows}</tbody>
      </table>
      {isDirty && (
        <Box marginTop={3} textAlign="right">
          <Button marginRight={2} variant="primary" icon="check" onClick={save}>
            Apply changes
          </Button>
          <Button icon="x" onClick={resetToOriginalColors}>
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RecordView;

import { base } from "@airtable/blocks";
import Field from "@airtable/blocks/dist/types/src/models/field";
import { Box, Button, Text, useRecordById } from "@airtable/blocks/ui";
import React from "react";

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

  const colorList = fieldColors.map((fieldColor) => (
    <Box
      key={fieldColor.fieldId}
      style={{ display: "flex", flexDirection: "row" }}
    >
      <Text>{`${fieldColor.fieldName}:`}</Text>
      <input
        type="color"
        value={fieldColor.hexColor}
        onChange={(event) =>
          onColorChange(fieldColor.fieldId, event.target.value)
        }
      />
    </Box>
  ));

  return (
    <Box style={{ marginBottom: 20 }}>
      <Text as="h1" style={{ fontWeight: 700 }}>
        {record.getCellValueAsString(table.primaryField)}
      </Text>
      {colorList}
      {isDirty && (
        <Box>
          <Button icon="check" onClick={save}>
            Save
          </Button>
          <Button icon="redo" onClick={resetToOriginalColors}>
            Reset
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RecordView;

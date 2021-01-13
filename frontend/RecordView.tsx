import { base } from "@airtable/blocks";
import Field from "@airtable/blocks/dist/types/src/models/field";
import { Box, Button, Heading, Text, useRecordById } from "@airtable/blocks/ui";
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

  const colorTableRows = fieldColors.map((fieldColor, index) => (
    <tr key={fieldColor.fieldId} style={styles.tableRow(index)}>
      <td style={styles.tableCell}>
        <Text>{fieldColor.fieldName}</Text>
      </td>
      <td style={styles.tableCell}>
        <input
          type="color"
          value={fieldColor.hexColor}
          onChange={(event) =>
            onColorChange(fieldColor.fieldId, event.target.value)
          }
        />
      </td>
      <td style={styles.tableCell}>
        <Text>{fieldColor.hexColor}</Text>
      </td>
    </tr>
  ));

  return (
    <Box marginBottom={4}>
      <Heading>{record.getCellValueAsString(table.primaryField)}</Heading>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
        }}
      >
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>Field</th>
            <th style={styles.tableCell}>Color</th>
            <th style={styles.tableCell}>HEX code</th>
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

const styles = {
  tableHeader: {
    backgroundColor: "#009879",
    border: "thin solid #008879",
    color: "#ffffff",
  },
  tableCell: {
    padding: "4px 10px",
  },
  tableRow: (index: number) => ({
    backgroundColor: index % 2 === 0 ? "transparent" : "#f3f3f3",
    border: "thin solid #dddddd",
    ...(index === 0 && { borderTop: "none" }),
  }),
};

export default RecordView;

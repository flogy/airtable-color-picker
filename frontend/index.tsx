import React from "react";
import { Box, Text, initializeBlock, useRecords } from "@airtable/blocks/ui";
import { base, cursor } from "@airtable/blocks";
import { useWatchable, useLoadable } from "@airtable/blocks/ui";

const colorFieldNames = [
  "Hintergrundfarbe",
  "Schriftfarbe",
  "Primärfarbe",
  "Sekundärfarbe",
];

const HelloWorldTypescriptApp = () => {
  useLoadable(cursor);
  useWatchable(cursor, ["activeTableId", "selectedRecordIds"]);

  const activeTable = base.getTableById(cursor.activeTableId);
  const fields = activeTable.fields;
  const availableColorFields = fields.filter((field) =>
    colorFieldNames.includes(field.name)
  );
  const allRecords = useRecords(activeTable, {
    fields: availableColorFields,
  });

  const hasColorFields = availableColorFields.length > 0;
  if (!hasColorFields) {
    return <Text>No color fields found in the currently selected table.</Text>;
  }

  const isAnyRowSelected = cursor.selectedRecordIds.length > 0;
  if (!isAnyRowSelected) {
    return <Text>No rows selected.</Text>;
  }

  const selectedRecords = allRecords.filter((record) =>
    cursor.selectedRecordIds.includes(record.id)
  );
  const colorPalettes = selectedRecords.map((record) => {
    const colorList = availableColorFields.map((colorField) => {
      const hexColor = record.getCellValueAsString(colorField);
      return (
        <Box
          key={colorField.id}
          style={{ display: "flex", flexDirection: "row" }}
        >
          <Text>{`${colorField.name}:`}</Text>
          <input type="color" value={hexColor} />
        </Box>
      );
    });
    return (
      <Box key={record.id} style={{ marginBottom: 20 }}>
        <Text as="h1" style={{ fontWeight: 700 }}>
          {record.getCellValueAsString(activeTable.primaryField)}
        </Text>
        {colorList}
      </Box>
    );
  });

  return <Box>{colorPalettes}</Box>;
};

initializeBlock(() => <HelloWorldTypescriptApp />);

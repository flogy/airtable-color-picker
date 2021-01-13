import React from "react";
import { Box, Text, initializeBlock, useRecords } from "@airtable/blocks/ui";
import { base, cursor } from "@airtable/blocks";
import { useWatchable, useLoadable } from "@airtable/blocks/ui";
import RecordView from "./RecordView";

export const colorFieldNames = [
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

  return (
    <Box>
      {selectedRecords.map((record) => (
        <RecordView
          key={record.id}
          tableId={activeTable.id}
          recordId={record.id}
          colorFields={availableColorFields}
        />
      ))}
    </Box>
  );
};

initializeBlock(() => <HelloWorldTypescriptApp />);

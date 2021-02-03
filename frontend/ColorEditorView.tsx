import React from "react";
import { base, cursor } from "@airtable/blocks";
import {
  Box,
  Text,
  useRecords,
  useWatchable,
  useLoadable,
  useGlobalConfig,
} from "@airtable/blocks/ui";
import RecordView from "./RecordView";
import { getConfigurationKey } from "./SettingsView";

const ColorEditorView = () => {
  const [colorFieldIds, setColorFieldIds] = React.useState([]);

  useLoadable(cursor);
  useWatchable(cursor, ["activeTableId", "selectedRecordIds"]);
  const globalConfig = useGlobalConfig();

  const activeTable = base.getTableById(cursor.activeTableId);

  React.useEffect(() => {
    if (!activeTable) {
      setColorFieldIds([]);
      return;
    }
    const configuredColorFieldIds = globalConfig.get(
      getConfigurationKey(activeTable.id)
    ) as string[];
    if (!configuredColorFieldIds) {
      setColorFieldIds([]);
      return;
    }
    setColorFieldIds(configuredColorFieldIds);
  }, [activeTable, globalConfig]);

  const fields = activeTable.fields;
  const availableColorFields = fields.filter((field) =>
    colorFieldIds.includes(field.id)
  );
  const allRecords = useRecords(activeTable, {
    fields: availableColorFields,
  });

  const hasColorFields = availableColorFields.length > 0;
  if (!hasColorFields) {
    return (
      <Box padding={3}>
        <Text>
          No color fields found in the currently selected table. Configure them
          in the settings.
        </Text>
      </Box>
    );
  }

  const isAnyRowSelected = cursor.selectedRecordIds.length > 0;
  if (!isAnyRowSelected) {
    return (
      <Box padding={3}>
        <Text>
          No rows selected. Please select the rows to edit in the table.
        </Text>
      </Box>
    );
  }

  const selectedRecords = allRecords.filter((record) =>
    cursor.selectedRecordIds.includes(record.id)
  );

  return (
    <Box padding={3}>
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

export default ColorEditorView;

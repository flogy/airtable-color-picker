import React from "react";
import {
  Box,
  Text,
  Heading,
  TablePicker,
  Switch,
  useSynced,
} from "@airtable/blocks/ui";

export const getConfigurationKey = (tableId: string) => [
  "colorFields",
  tableId,
];

const SettingsView = () => {
  const [selectedTable, setSelectedTable] = React.useState(null);

  const [
    configuredColorFieldIds,
    setConfiguredColorFieldIds,
    canSetConfiguredColorFieldIds,
  ] = useSynced(getConfigurationKey(selectedTable?.id || " "));

  const configuredColorFields = React.useMemo(() => {
    if (!selectedTable || !configuredColorFieldIds) {
      return [];
    }
    return (configuredColorFieldIds as string[]).map((id) =>
      selectedTable.getFieldById(id)
    );
  }, [selectedTable, configuredColorFieldIds]);

  const onAddColorField = React.useCallback(
    (colorFieldIdToAdd: string) => {
      if (!selectedTable) {
        return;
      }
      const newColorFieldIds = [
        ...configuredColorFields.map((field) => field.id),
        colorFieldIdToAdd,
      ];
      setConfiguredColorFieldIds(newColorFieldIds);
    },
    [configuredColorFields, selectedTable, setConfiguredColorFieldIds]
  );

  const onRemoveColorField = React.useCallback(
    (colorFieldIdToRemove: string) => {
      if (!selectedTable) {
        return;
      }
      const newColorFieldIds = configuredColorFields
        .map((field) => field.id)
        .filter((colorFieldId) => colorFieldId !== colorFieldIdToRemove);
      setConfiguredColorFieldIds(newColorFieldIds);
    },
    [selectedTable, configuredColorFields, setConfiguredColorFieldIds]
  );

  const colorFieldList = React.useMemo(() => {
    if (!selectedTable) {
      return null;
    }
    const singleLineTextFields = selectedTable.fields.filter(
      (field) => field.type === "singleLineText"
    );
    return singleLineTextFields.map((field) => {
      const isColorField = !!configuredColorFields.find(
        (configuredField) => configuredField.id === field.id
      );
      return (
        <tr key={field.id}>
          <td>{field.name}</td>
          <td>
            <Switch
              value={isColorField}
              onChange={() => {
                isColorField
                  ? onRemoveColorField(field.id)
                  : onAddColorField(field.id);
              }}
              aria-label="Is configured as color field"
              backgroundColor="transparent"
              width="320px"
            />
          </td>
        </tr>
      );
    });
  }, [
    selectedTable,
    configuredColorFields,
    onRemoveColorField,
    onAddColorField,
  ]);

  if (!canSetConfiguredColorFieldIds) {
    return (
      <Box padding={3}>
        <Text>No permission to change settings.</Text>
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <Heading>Settings</Heading>
      <Box marginTop={1} display="flex" alignItems="center" flexWrap="wrap">
        <Text flexShrink={0} marginRight={1}>
          Configure color fields of table:
        </Text>
        <TablePicker
          flexShrink={1}
          marginRight={1}
          table={selectedTable}
          onChange={setSelectedTable}
        />
      </Box>
      {selectedTable && (
        <Box marginTop={1}>
          <table>
            <thead>
              <tr>
                <th>Single line text field</th>
                <th>Is color field?</th>
              </tr>
            </thead>
            <tbody>{colorFieldList}</tbody>
          </table>
        </Box>
      )}
    </Box>
  );
};

export default SettingsView;

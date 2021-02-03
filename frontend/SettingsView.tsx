import React from "react";
import {
  Box,
  Text,
  Heading,
  TablePicker,
  useGlobalConfig,
  Switch,
} from "@airtable/blocks/ui";

export const getConfigurationKey = (tableId: string) => [
  "colorFields",
  tableId,
];

const SettingsView = () => {
  const [selectedTable, setSelectedTable] = React.useState(null);
  const [configuredColorFields, setConfiguredColorFields] = React.useState([]);

  const globalConfig = useGlobalConfig();

  const reloadConfiguratedColorFields = React.useCallback(() => {
    if (!selectedTable) {
      setConfiguredColorFields([]);
      return;
    }
    const configuredColorFieldIds = globalConfig.get(
      getConfigurationKey(selectedTable.id)
    ) as string[];
    if (!configuredColorFieldIds) {
      setConfiguredColorFields([]);
      return;
    }
    setConfiguredColorFields(
      configuredColorFieldIds.map((fieldId) =>
        selectedTable.getFieldById(fieldId)
      )
    );
  }, [selectedTable, globalConfig]);

  React.useEffect(() => reloadConfiguratedColorFields(), [
    reloadConfiguratedColorFields,
  ]);

  const onAddColorField = React.useCallback(
    (colorFieldIdToAdd: string) => {
      if (!selectedTable) {
        return;
      }
      const newColorFieldIds = [
        ...configuredColorFields.map((field) => field.id),
        colorFieldIdToAdd,
      ];
      globalConfig.setAsync(
        getConfigurationKey(selectedTable.id),
        newColorFieldIds
      );
      reloadConfiguratedColorFields();
    },
    [
      configuredColorFields,
      globalConfig,
      reloadConfiguratedColorFields,
      selectedTable,
    ]
  );

  const onRemoveColorField = React.useCallback(
    (colorFieldIdToRemove: string) => {
      if (!selectedTable) {
        return;
      }
      const newColorFieldIds = configuredColorFields
        .map((field) => field.id)
        .filter((colorFieldId) => colorFieldId !== colorFieldIdToRemove);
      globalConfig.setAsync(
        getConfigurationKey(selectedTable.id),
        newColorFieldIds
      );
      reloadConfiguratedColorFields();
    },
    [
      selectedTable,
      configuredColorFields,
      globalConfig,
      reloadConfiguratedColorFields,
    ]
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
      <Box marginTop={1} style={selectedTable || { display: "none" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
          }}
        >
          <thead>
            <tr>
              <th>Single line text field</th>
              <th>Is color field?</th>
            </tr>
          </thead>
          <tbody>{colorFieldList}</tbody>
        </table>
      </Box>
    </Box>
  );
};

export default SettingsView;

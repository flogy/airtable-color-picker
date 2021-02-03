import React from "react";
import {
  initializeBlock,
  loadCSSFromString,
  useSettingsButton,
} from "@airtable/blocks/ui";
import SettingsView from "./SettingsView";
import ColorEditorView from "./ColorEditorView";

loadCSSFromString(`
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    box-shadow: '0 0 10px rgba(0, 0, 0, 0.15)';
  }

  th, td {
    padding: 4px 10px;
  }

  thead > tr {
    background-color: #009879;
    border: thin solid #008879;
    color: #ffffff;
  }

  tbody > tr:nth-child(1) {
    border-top: none;
  }

  tbody > tr:nth-child(even) {
    background-color: transparent;
  }

  tbody > tr:nth-child(odd) {
    background-color: #f3f3f3;
  }
`);

const AirtableColorPicker = () => {
  const [isShowingSettings, setIsShowingSettings] = React.useState(false);
  useSettingsButton(() => setIsShowingSettings(!isShowingSettings));

  if (isShowingSettings) {
    return <SettingsView />;
  } else {
    return <ColorEditorView />;
  }
};

initializeBlock(() => <AirtableColorPicker />);

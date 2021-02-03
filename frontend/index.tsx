import React from "react";
import { initializeBlock, useSettingsButton } from "@airtable/blocks/ui";
import SettingsView from "./SettingsView";
import ColorEditorView from "./ColorEditorView";

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

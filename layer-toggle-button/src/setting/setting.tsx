import { React, jsx, IMState, appActions } from 'jimu-core';
import { AllWidgetSettingProps } from 'jimu-for-builder';
import { TextInput, Switch, Select, Option } from 'jimu-ui';
import { SettingSection, SettingRow, MapWidgetSelector } from 'jimu-ui/advanced/setting-components';
import { MapViewManager } from 'jimu-arcgis';

export default function Setting(props: AllWidgetSettingProps<any>) {
  const { config, id, onSettingChange, useMapWidgetIds } = props;
  const [layerOptions, setLayerOptions] = React.useState<JSX.Element[]>([]);

  const updateStyle = (key: string, value: string) => {
    const newStyle = { ...config.style, [key]: value };
    onSettingChange({ id, config: { ...config, style: newStyle } });
  };

  const onMapWidgetSelected = (ids: string[]) => {
    onSettingChange({ id, useMapWidgetIds: ids });
    if (ids?.[0]) {
      MapViewManager.getInstance().getJimuMapViewById(ids[0])?.whenJimuMapViewLoaded().then(jmv => {
        const options = jmv.view.map.layers.map(layer => (
          <Option key={layer.id} value={layer.id}>{layer.title || layer.id}</Option>
        ));
        setLayerOptions(options as any);
      });
    }
  };

  return (
    <div className="widget-setting-layer-toggle p-3">
      <SettingSection title="Map & Layer">
        <SettingRow label="Map:">
          <MapWidgetSelector
            useMapWidgetIds={useMapWidgetIds}
            onSelect={onMapWidgetSelected}
          />
        </SettingRow>
        <SettingRow label="Layer:">
          <Select
            value={config.layerId || ''}
            onChange={e => onSettingChange({ id, config: { ...config, layerId: e.target.value } })}
          >
            <Option value="" disabled>Select a layer</Option>
            {layerOptions}
          </Select>
        </SettingRow>
      </SettingSection>

      <SettingSection title="Labels and Toggle">
        <SettingRow label="Label when OFF:">
          <TextInput value={config.showLabel} onChange={e => onSettingChange({ id, config: { ...config, showLabel: e.target.value } })} />
        </SettingRow>
        <SettingRow label="Label when ON:">
          <TextInput value={config.hideLabel} onChange={e => onSettingChange({ id, config: { ...config, hideLabel: e.target.value } })} />
        </SettingRow>
        <SettingRow label="Use Switch:">
          <Switch checked={config.useSwitch} onChange={e => onSettingChange({ id, config: { ...config, useSwitch: e.target.checked } })} />
        </SettingRow>
        <SettingRow label="Icon URL:">
          <TextInput value={config.iconUrl} onChange={e => onSettingChange({ id, config: { ...config, iconUrl: e.target.value } })} />
        </SettingRow>
      </SettingSection>

      <SettingSection title="Style">
        <SettingRow label="Background Color:">
          <TextInput value={config.style?.backgroundColor || ''} onChange={e => updateStyle('backgroundColor', e.target.value)} />
        </SettingRow>
        <SettingRow label="Text Color:">
          <TextInput value={config.style?.textColor || ''} onChange={e => updateStyle('textColor', e.target.value)} />
        </SettingRow>
        <SettingRow label="Border Radius:">
          <TextInput value={config.style?.borderRadius || ''} onChange={e => updateStyle('borderRadius', e.target.value)} />
        </SettingRow>
        <SettingRow label="Font Size:">
          <TextInput value={config.style?.fontSize || ''} onChange={e => updateStyle('fontSize', e.target.value)} />
        </SettingRow>
      </SettingSection>
    </div>
  );
}

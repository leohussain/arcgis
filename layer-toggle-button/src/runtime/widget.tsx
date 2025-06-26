import * as React from 'react';
import { useState } from 'react';
import { AllWidgetProps } from 'jimu-core';
import { Button, Switch } from 'jimu-ui';
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis';

export default function LayerToggleButton(props: AllWidgetProps<any>) {
  const [mapView, setMapView] = useState<JimuMapView | null>(null);
  const [visible, setVisible] = useState(true);

  const style = props.config?.style || {};
  const buttonStyle = {
    backgroundColor: style.backgroundColor || '#007ACC',
    color: style.textColor || '#FFFFFF',
    borderRadius: style.borderRadius || '4px',
    fontSize: style.fontSize || '14px',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center'
  };

  const toggleLayer = () => {
    if (!mapView || !props.config.layerId) return;
    const layer = mapView.view.map.findLayerById(props.config.layerId);
    if (layer) {
      layer.visible = !layer.visible;
      setVisible(layer.visible);
    }
  };

  return (
    <div className="widget-layer-toggle-button">
      <JimuMapViewComponent
        useMapWidgetId={props.useMapWidgetIds?.[0]}
        onActiveViewChange={(jmv) => setMapView(jmv)}
      />
      {props.config.useSwitch ? (
        <Switch
          checked={visible}
          onChange={toggleLayer}
          aria-label="Toggle Layer"
        />
      ) : (
        <Button style={buttonStyle} onClick={toggleLayer}>
          {props.config.iconUrl && (
            <img src={props.config.iconUrl} alt="icon" style={{ width: 16, height: 16, marginRight: 6 }} />
          )}
          {visible ? props.config.hideLabel : props.config.showLabel}
        </Button>
      )}
    </div>
  );
}

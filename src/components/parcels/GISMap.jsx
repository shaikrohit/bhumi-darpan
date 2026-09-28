import React, { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Popup, useMap } from 'react-leaflet'
import { ZoomIn, ZoomOut, Maximize2, MapPin, Layers } from 'lucide-react'
import { Button } from '../common'

// Default center of Andhra Pradesh region (Guntur/Vijayawada area)
const DEFAULT_CENTER = [16.4815, 80.6020]
const DEFAULT_ZOOM = 13

// Helper component to auto-recenter Leaflet map on parcel selection
function MapRecenter({ selectedParcel, parcels }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return
    if (selectedParcel && selectedParcel.latitude && selectedParcel.longitude) {
      map.flyTo([selectedParcel.latitude, selectedParcel.longitude], 16, { duration: 1.2 })
    } else if (parcels && parcels.length > 0) {
      const valid = parcels.filter(p => p.latitude && p.longitude)
      if (valid.length > 0) {
        const bounds = valid.map(p => [p.latitude, p.longitude])
        map.fitBounds(bounds, { padding: [40, 40] })
      }
    }
  }, [selectedParcel, parcels, map])

  return null
}

function getPolygonStyle(parcel, isSelected) {
  if (isSelected) {
    return {
      color: '#2563eb', // blue-600
      fillColor: '#3b82f6', // blue-500
      fillOpacity: 0.65,
      weight: 4,
      dashArray: null,
    }
  }

  const vStatus = parcel.verificationStatus || parcel.verification
  if (vStatus === 'Verified') {
    return {
      color: '#059669', // emerald-600
      fillColor: '#10b981', // emerald-500
      fillOpacity: 0.35,
      weight: 2,
    }
  }
  if (vStatus === 'Needs Review') {
    return {
      color: '#dc2626', // red-600
      fillColor: '#ef4444', // red-500
      fillOpacity: 0.45,
      weight: 2.5,
    }
  }
  // Pending
  return {
    color: '#d97706', // amber-600
    fillColor: '#f59e0b', // amber-500
    fillOpacity: 0.35,
    weight: 2,
  }
}

export default function GISMap({
  parcels = [],
  selectedParcel = null,
  onSelectParcel,
  className = '',
}) {
  const [mapInstance, setMapInstance] = useState(null)
  const [mapType, setMapType] = useState('street') // 'street' or 'satellite'

  const tileUrl =
    mapType === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

  const attribution =
    mapType === 'satellite'
      ? '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  const handleResetView = () => {
    if (mapInstance && parcels.length > 0) {
      const valid = parcels.filter((p) => p.latitude && p.longitude)
      if (valid.length > 0) {
        const bounds = valid.map((p) => [p.latitude, p.longitude])
        mapInstance.fitBounds(bounds, { padding: [40, 40] })
      } else {
        mapInstance.setView(DEFAULT_CENTER, DEFAULT_ZOOM)
      }
    }
  }

  return (
    <div className={`relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100 ${className}`}>
      {/* Interactive Map Canvas */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
        ref={setMapInstance}
      >
        <TileLayer url={tileUrl} attribution={attribution} />
        <MapRecenter selectedParcel={selectedParcel} parcels={parcels} />

        {parcels.map((parcel) => {
          if (!parcel.geometry || !parcel.geometry.coordinates) return null
          const isSelected = selectedParcel && selectedParcel.id === parcel.id
          const polyCoords = parcel.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])

          return (
            <Polygon
              key={parcel.id}
              positions={polyCoords}
              pathOptions={getPolygonStyle(parcel, isSelected)}
              eventHandlers={{
                click: () => onSelectParcel && onSelectParcel(parcel),
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 text-xs font-sans">
                  <div className="flex items-center justify-between gap-2 border-b pb-1">
                    <span className="font-bold text-gray-900 font-mono">{parcel.id}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                      {parcel.verificationStatus || parcel.verification}
                    </span>
                  </div>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">ULPIN:</strong> {parcel.ulpin}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Survey No:</strong> {parcel.surveyNumber || parcel.surveyNo}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Village:</strong> {parcel.village}, {parcel.district}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Area:</strong> {parcel.area}
                  </p>
                  <p className="text-gray-600">
                    <strong className="text-gray-800">Status:</strong> {parcel.acquisitionStatus || parcel.status}
                  </p>
                  <button
                    onClick={() => onSelectParcel && onSelectParcel(parcel)}
                    className="w-full mt-1 px-2 py-1 text-center font-medium bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-[11px]"
                  >
                    Inspect Parcel
                  </button>
                </div>
              </Popup>
            </Polygon>
          )
        })}
      </MapContainer>

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-1.5 bg-white p-1.5 rounded-xl border border-gray-200 shadow-md">
        <button
          onClick={() => mapInstance && mapInstance.zoomIn()}
          aria-label="Zoom In"
          title="Zoom In"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapInstance && mapInstance.zoomOut()}
          aria-label="Zoom Out"
          title="Zoom Out"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetView}
          aria-label="Reset Map View"
          title="Reset View"
          className="p-2 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors border-t border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Layer Toggle Button */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm p-1 rounded-lg border border-gray-200 shadow-md flex items-center gap-1 text-xs">
        <button
          onClick={() => setMapType('street')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
            mapType === 'street' ? 'bg-navy-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Street View
        </button>
        <button
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
            mapType === 'satellite' ? 'bg-navy-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          Satellite
        </button>
      </div>
    </div>
  )
}

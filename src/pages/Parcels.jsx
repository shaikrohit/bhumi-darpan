import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Map, 
  Table2, 
  X, 
  Eye, 
  Layers, 
  Navigation,
  Plus,
  Minus,
  Ruler,
  MousePointer2
} from 'lucide-react';
import { parcels } from '../data/mockData';
import StatusBadge from '../components/StatusBadge';

const Parcels = () => {
  const [activeTab, setActiveTab] = useState('table');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Derived unique values for filters
  const districts = ['All', ...new Set(parcels.map(p => p.district))];
  const statuses = ['All', ...new Set(parcels.map(p => p.status))];

  const filteredParcels = parcels.filter(parcel => {
    const matchesSearch = 
      parcel.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.ulpin?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.village.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistrict = filterDistrict === 'All' || parcel.district === filterDistrict;
    const matchesStatus = filterStatus === 'All' || parcel.status === filterStatus;
    
    return matchesSearch && matchesDistrict && matchesStatus;
  });

  const handleRowClick = (parcel) => {
    setSelectedParcel(parcel);
  };

  const closePanel = () => {
    setSelectedParcel(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Acquired':
      case 'Verified':
        return '#16a34a'; // Green
      case 'Pending':
      case 'Pending Verification':
        return '#f59e0b'; // Amber
      case 'Under Review':
      case 'In Progress':
        return '#3b82f6'; // Blue
      case 'Disputed':
        return '#ef4444'; // Red
      default:
        return '#6b7280'; // Gray
    }
  };

  const getPolygonFill = (status) => {
    switch (status) {
      case 'Acquired':
      case 'Verified':
        return 'rgba(22, 163, 74, 0.4)'; 
      case 'Pending':
      case 'Pending Verification':
        return 'rgba(245, 158, 11, 0.4)';
      case 'Under Review':
      case 'In Progress':
        return 'rgba(59, 130, 246, 0.4)';
      case 'Disputed':
        return 'rgba(239, 68, 68, 0.4)';
      default:
        return 'rgba(107, 114, 128, 0.4)';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 relative overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Land Parcels</h1>
            <p className="text-sm text-gray-500 mt-1">GIS-enabled parcel management and tracking</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('table')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'table' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table2 className="w-4 h-4 mr-2" />
              Table View
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'map' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Map className="w-4 h-4 mr-2" />
              Map View
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex relative">
        <div className={`flex-1 overflow-auto transition-all duration-300 ${selectedParcel ? 'pr-[400px]' : ''}`}>
          
          {activeTab === 'table' && (
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Filters */}
                <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by ID, ULPIN, or Village..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={filterDistrict}
                      onChange={(e) => setFilterDistrict(e.target.value)}
                      className="border border-gray-300 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {districts.map(d => <option key={d} value={d}>{d === 'All' ? 'All Districts' : d}</option>)}
                    </select>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg py-2 pl-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                      <tr>
                        <th className="px-6 py-3">Parcel ID</th>
                        <th className="px-6 py-3">ULPIN</th>
                        <th className="px-6 py-3">Survey No.</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Area (Ha)</th>
                        <th className="px-6 py-3">Land Type</th>
                        <th className="px-6 py-3">Verification</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredParcels.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                            No parcels found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredParcels.map((parcel) => (
                          <tr 
                            key={parcel.id} 
                            onClick={() => handleRowClick(parcel)}
                            className={`cursor-pointer hover:bg-blue-50 transition-colors ${selectedParcel?.id === parcel.id ? 'bg-blue-50' : ''}`}
                          >
                            <td className="px-6 py-4 font-medium text-blue-600">{parcel.id}</td>
                            <td className="px-6 py-4 text-gray-500">{parcel.ulpin || 'N/A'}</td>
                            <td className="px-6 py-4">{parcel.surveyNo}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span>{parcel.village}</span>
                                <span className="text-xs text-gray-500">{parcel.district}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">{parcel.area}</td>
                            <td className="px-6 py-4">{parcel.landType}</td>
                            <td className="px-6 py-4">
                              <StatusBadge status={parcel.verification || 'Pending'} />
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge status={parcel.status} />
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="h-full w-full relative bg-[#e5e7eb] flex items-center justify-center p-6">
              {/* Mock Map Container */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#d4dfc9] to-[#b3c5a6] overflow-hidden">
                {/* Grid lines to make it look technical */}
                <div className="absolute inset-0 opacity-20" 
                     style={{ backgroundImage: 'linear-gradient(#9ca3af 1px, transparent 1px), linear-gradient(90deg, #9ca3af 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
                </div>
                
                {/* SVG Map layer */}
                <svg className="absolute w-full h-full" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <pattern id="project-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 0 10 L 10 0 M -1 1 L 1 -1 M 9 11 L 11 9" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="2"/>
                    </pattern>
                  </defs>
                  
                  {/* Project Boundary */}
                  <polygon 
                    points="150,100 850,150 900,700 200,750 100,400" 
                    fill="url(#project-pattern)" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                    strokeDasharray="10,5"
                  />
                  
                  {/* Mock Parcels representing actual data */}
                  {filteredParcels.map((parcel, index) => {
                    // Generate pseudo-random coordinates based on ID for stable rendering
                    const numId = parseInt(parcel.id.replace(/\D/g, '')) || index;
                    const baseX = 200 + ((numId * 137) % 500);
                    const baseY = 200 + ((numId * 251) % 400);
                    const size = 30 + parseFloat(parcel.area) * 15;
                    
                    const points = `${baseX},${baseY} ${baseX+size},${baseY-size/3} ${baseX+size*1.2},${baseY+size*0.8} ${baseX-size/4},${baseY+size}`;
                    
                    const isSelected = selectedParcel?.id === parcel.id;
                    const fillColor = getPolygonFill(parcel.status);
                    const strokeColor = isSelected ? '#ef4444' : getStatusColor(parcel.status);
                    
                    return (
                      <g 
                        key={parcel.id} 
                        onClick={() => handleRowClick(parcel)}
                        className="cursor-pointer transition-all duration-200 hover:opacity-80"
                      >
                        <polygon 
                          points={points} 
                          fill={fillColor} 
                          stroke={strokeColor} 
                          strokeWidth={isSelected ? "4" : "2"}
                        />
                        <text 
                          x={baseX + size/2} 
                          y={baseY + size/2} 
                          fontSize="12" 
                          fontWeight="bold"
                          textAnchor="middle" 
                          fill="#1f2937"
                          style={{ pointerEvents: 'none' }}
                        >
                          {parcel.surveyNo}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Water body */}
                  <path d="M 0 300 Q 150 350 300 300 T 700 400 T 1000 350 L 1000 800 L 0 800 Z" fill="rgba(56, 189, 248, 0.2)" />
                  <text x="800" y="500" fontSize="16" fill="rgba(2, 132, 199, 0.5)" transform="rotate(-15 800,500)">Ganga River Basin</text>
                  
                  {/* Highway */}
                  <path d="M 50 0 L 250 800" stroke="#4b5563" strokeWidth="12" fill="none" opacity="0.6"/>
                  <path d="M 50 0 L 250 800" stroke="#fbbf24" strokeWidth="2" strokeDasharray="15,15" fill="none"/>
                  <text x="120" y="200" fontSize="14" fill="#1f2937" transform="rotate(75 120,200)" fontWeight="bold">NH-44</text>
                </svg>

                {/* Map Controls */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md flex flex-col overflow-hidden border border-gray-200">
                  <button className="p-2 hover:bg-gray-100 border-b border-gray-200 text-gray-700" title="Zoom In"><Plus className="w-5 h-5"/></button>
                  <button className="p-2 hover:bg-gray-100 border-b border-gray-200 text-gray-700" title="Zoom Out"><Minus className="w-5 h-5"/></button>
                  <button className="p-2 hover:bg-gray-100 border-b border-gray-200 text-gray-700" title="Pan"><Navigation className="w-5 h-5"/></button>
                  <button className="p-2 hover:bg-gray-100 border-b border-gray-200 text-gray-700" title="Select"><MousePointer2 className="w-5 h-5"/></button>
                  <button className="p-2 hover:bg-gray-100 border-b border-gray-200 text-gray-700" title="Measure"><Ruler className="w-5 h-5"/></button>
                  <button className="p-2 hover:bg-gray-100 text-gray-700" title="Layers"><Layers className="w-5 h-5"/></button>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-gray-200 text-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>
                  <div className="space-y-2">
                    <div className="flex items-center"><div className="w-4 h-4 bg-green-500/40 border-2 border-green-600 rounded mr-2"></div><span>Verified / Acquired</span></div>
                    <div className="flex items-center"><div className="w-4 h-4 bg-blue-500/40 border-2 border-blue-600 rounded mr-2"></div><span>Under Review</span></div>
                    <div className="flex items-center"><div className="w-4 h-4 bg-amber-500/40 border-2 border-amber-600 rounded mr-2"></div><span>Pending</span></div>
                    <div className="flex items-center"><div className="w-4 h-4 bg-red-500/40 border-2 border-red-600 rounded mr-2"></div><span>Disputed</span></div>
                    <div className="flex items-center mt-3 pt-2 border-t border-gray-200"><div className="w-4 h-0 border-t-2 border-dashed border-blue-500 mr-2"></div><span>Project Boundary</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Slide-in Detail Panel */}
        <div 
          className={`absolute top-0 right-0 h-full w-[400px] bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ease-in-out z-20 flex flex-col overflow-hidden ${
            selectedParcel ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {selectedParcel && (
            <>
              {/* Panel Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selectedParcel.id}</h2>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedParcel.village}, {selectedParcel.district}
                  </p>
                </div>
                <button 
                  onClick={closePanel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="space-y-6">
                  
                  {/* Status Section */}
                  <div className="flex space-x-3 pb-4 border-b border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Acquisition Status</p>
                      <StatusBadge status={selectedParcel.status} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Verification</p>
                      <StatusBadge status={selectedParcel.verification || 'Pending'} />
                    </div>
                  </div>

                  {/* Parcel Details */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <Layers className="w-4 h-4 mr-2 text-blue-600" />
                      Parcel Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">ULPIN</p>
                          <p className="text-sm font-medium text-gray-900">{selectedParcel.ulpin || 'Not Assigned'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Survey No.</p>
                          <p className="text-sm font-medium text-gray-900">{selectedParcel.surveyNo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Total Area</p>
                          <p className="text-sm font-medium text-gray-900">{selectedParcel.area} Hectares</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Land Type</p>
                          <p className="text-sm font-medium text-gray-900">{selectedParcel.landType}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ownership Details */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-blue-600" />
                      Ownership & Valuation
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Primary Owner</p>
                        <p className="text-sm font-medium text-gray-900">{selectedParcel.owner || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Market Value (Est.)</p>
                        <p className="text-sm font-medium text-green-600">
                          {selectedParcel.marketValue ? `₹${selectedParcel.marketValue.toLocaleString('en-IN')}` : 'Pending Assessment'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Geo Details */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <Navigation className="w-4 h-4 mr-2 text-blue-600" />
                      Geospatial Data
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Project ID</p>
                        <p className="text-sm font-medium text-blue-600">{selectedParcel.projectId || 'PRJ-2023-001'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Coordinates</p>
                        <p className="text-sm font-mono text-gray-700 bg-white p-2 rounded border border-gray-200 mt-1">
                          {selectedParcel.coordinates || '23.456, 78.901 (Approx)'}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 flex space-x-3 shrink-0">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm">
                  View Full Record
                </button>
                <button className="flex-1 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors border border-gray-300 shadow-sm">
                  Generate Report
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default Parcels;

import React, { useState } from 'react'
import { User, Bell, Shield, Globe, Settings as SettingsIcon, Check } from 'lucide-react'
import { PageHeader, Card, Button } from '../components/common'

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.k@bhumidarpan.gov.in',
    phone: '+91 98765 43210',
    district: 'Guntur District',
  })

  const [saved, setSaved] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings & System Preferences"
        subtitle="Manage officer profile, district assignments, notification rules, and localization"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]}
      />

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          Settings updated successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="User Profile" subtitle="Officer details and district assignment" icon={User}>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full p-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full p-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full p-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Assigned District</label>
                  <input
                    type="text"
                    disabled
                    value={profile.district}
                    className="w-full p-2 border rounded-lg text-xs bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" size="sm">Save Changes</Button>
              </div>
            </form>
          </Card>

          <Card title="Role & Permissions (RBAC)" subtitle="Current administrative privileges" icon={Shield}>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-900">District Land Acquisition Officer (DLAO)</p>
                  <p className="text-blue-700 mt-0.5">Full approval authority for Guntur District land cases.</p>
                </div>
                <span className="px-2.5 py-1 bg-blue-600 text-white rounded-full font-bold text-[10px]">ACTIVE</span>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card title="System Preferences" icon={SettingsIcon}>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Language</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>English</option>
                  <option>Telugu</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Theme</label>
                <select className="w-full p-2 border rounded-lg">
                  <option>Light (System Default)</option>
                  <option>Dark</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

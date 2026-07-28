'use client'

import React, { useState } from 'react'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  ShieldCheck,
  UserCog,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Mail,
  CheckCircle2,
  XCircle
} from 'lucide-react'

export interface UserAccount {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Supervisor' | 'Operator'
  status: 'Active' | 'Inactive'
  lastActivity: string
  avatarBg: string
}

export default function UsersModule() {
  const [roleFilter, setRoleFilter] = useState<string>('All Roles')
  const [searchQuery, setSearchQuery] = useState('')

  const usersList: UserAccount[] = [
    {
      id: '1',
      name: 'Elena Rostova',
      email: 'elena.r@forge.inc',
      role: 'Admin',
      status: 'Active',
      lastActivity: 'Just now',
      avatarBg: 'bg-gradient-to-br from-amber-500 to-orange-600'
    },
    {
      id: '2',
      name: 'Marcus Jin',
      email: 'm.jin@forge.inc',
      role: 'Supervisor',
      status: 'Active',
      lastActivity: '2 hrs ago',
      avatarBg: 'bg-gradient-to-br from-blue-500 to-indigo-600'
    },
    {
      id: '3',
      name: 'Sarah Connor',
      email: 's.connor@forge.inc',
      role: 'Operator',
      status: 'Inactive',
      lastActivity: '4 days ago',
      avatarBg: 'bg-gradient-to-br from-slate-600 to-slate-700'
    },
    {
      id: '4',
      name: 'Budi Santoso',
      email: 'budi.s@forge.inc',
      role: 'Operator',
      status: 'Active',
      lastActivity: '15 mins ago',
      avatarBg: 'bg-gradient-to-br from-emerald-500 to-teal-600'
    }
  ]

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole =
      roleFilter === 'All Roles' || u.role.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Invite Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              User Management
            </h1>
            <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Users className="w-3 h-3" />
              Access Control
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage platform access, roles, and security permissions.
          </p>
        </div>

        <button
          onClick={() => alert('Invite User Modal triggered')}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite User</span>
        </button>
      </div>

      {/* Main Two-Column Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Users Data Table (2 Cols wide) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-[#1E293B]">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F172A] text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 border border-[#1E293B] focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#0F172A] border border-[#1E293B] text-slate-300 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
            >
              <option value="All Roles">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Operator">Operator</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5 text-center">Status</th>
                  <th className="p-3.5 text-center">Last Activity</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {filteredUsers.map((user) => {
                  return (
                    <tr key={user.id} className="hover:bg-[#1E2D47]/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${user.avatarBg} flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                            {user.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-bold text-white leading-tight">{user.name}</h4>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        {user.role === 'Admin' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            Admin
                          </span>
                        ) : user.role === 'Supervisor' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            Supervisor
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
                            Operator
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center">
                        {user.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="p-3.5 text-center text-slate-400 font-mono">
                        {user.lastActivity}
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => alert(`Manage user ${user.name}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#162032] transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-[#1E293B] text-xs text-slate-400">
            <span>Showing {filteredUsers.length} of {usersList.length} users</span>
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-lg bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white disabled:opacity-40">
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 rounded-lg bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Role Permissions Specification Cards */}
        <div className="glass-card rounded-2xl p-5 border border-[#1E293B]">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white tracking-wide">
              Role Permissions
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Admin Card */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Admin
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Role #1</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Full system access. Can manage billing, global settings, and all user accounts.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">
                  All Access
                </span>
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">
                  Billing
                </span>
              </div>
            </div>

            {/* Supervisor Card */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Supervisor
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Role #2</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Can view all production data, generate reports, and manage operator schedules.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded text-[10px]">
                  Reports
                </span>
                <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded text-[10px]">
                  Schedules
                </span>
              </div>
            </div>

            {/* Operator Card */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  Operator
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Role #3</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Limited access to specific production lines. Can log data and view personal metrics.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-slate-500/10 text-slate-300 border border-slate-500/20 px-2 py-0.5 rounded text-[10px]">
                  Data Entry
                </span>
                <span className="bg-slate-500/10 text-slate-300 border border-slate-500/20 px-2 py-0.5 rounded text-[10px]">
                  View Only
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

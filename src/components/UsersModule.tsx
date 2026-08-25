'use client'

import React, { useState, useEffect } from 'react'
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Mail,
  RefreshCw,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { getUsersApi, createUserApi, UserItem } from '@/services/api'
import { useLanguage } from '@/context/LanguageContext'

export default function UsersModule() {
  const { t } = useLanguage()
  const [users, setUsers] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState<string>('All Roles')
  const [searchQuery, setSearchQuery] = useState('')

  // Invite Modal States
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('password123')
  const [newRole, setNewRole] = useState('operator')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsersApi()
      setUsers(data)
    } catch (err) {
      console.error('Failed to fetch users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        const data = await getUsersApi()
        if (!ignore) {
          setUsers(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Failed to fetch users:', err)
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUsername.trim()) return

    setSubmitting(true)
    setErrorMsg(null)

    try {
      await createUserApi({
        username: newUsername.trim(),
        password: newPassword,
        role: newRole
      })

      fetchUsers()
      setIsInviteOpen(false)
      setNewUsername('')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membuat akun user baru'
      setErrorMsg(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.Username.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole =
      roleFilter === 'All Roles' || u.Role.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Invite Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {t('users_title')}
            </h1>
            <span className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Users className="w-3 h-3" />
              {t('access_control')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {t('users_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            className="flex items-center gap-1.5 bg-[#162032] hover:bg-[#1E2D47] text-slate-300 text-xs font-semibold px-3.5 py-2 rounded-xl border border-[#1E293B] transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{t('sync_data')}</span>
          </button>

          <button
            onClick={() => setIsInviteOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>{t('invite_user')}</span>
          </button>
        </div>
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
                placeholder={t('search_settings')}
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
              <option value="All Roles">{t('all_roles')}</option>
              <option value="Admin">{t('admin_role')}</option>
              <option value="Supervisor">{t('supervisor_role')}</option>
              <option value="Operator">{t('operator_role')}</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0F172A] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="p-3.5">{t('product_id').replace('Product', 'User').replace('Produk', 'Pengguna')}</th>
                  <th className="p-3.5">{t('user')}</th>
                  <th className="p-3.5">{t('role')}</th>
                  <th className="p-3.5 text-center">{t('status')}</th>
                  <th className="p-3.5 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No user accounts found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => {
                    const isSystemAdmin = user.Role.toLowerCase() === 'admin'
                    const isSupervisor = user.Role.toLowerCase() === 'supervisor'

                    return (
                      <tr key={user.UserID} className="hover:bg-[#1E2D47]/40 transition-colors">
                        <td className="p-3.5 font-mono text-slate-400 font-bold">
                          USR-{user.UserID}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xs shadow-md uppercase">
                              {user.Username.substring(0, 2)}
                            </div>
                            <div>
                              <h4 className="font-bold text-white leading-tight">{user.Username}</h4>
                              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-500" />
                                {user.Username}@forge.inc
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5">
                          {isSystemAdmin ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              {t('admin_role')}
                            </span>
                          ) : isSupervisor ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                              {t('supervisor_role')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">
                              {t('operator_role')}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-center">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Active
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => alert(`Manage user ${user.Username}`)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#162032] transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-[#1E293B] text-xs text-slate-400">
            <span>Showing {filteredUsers.length} of {users.length} users</span>
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
              {t('role_permissions')}
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Admin Card */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  {t('admin_role')}
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Tier #1</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t('admin_role_desc')}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">
                  All Access
                </span>
                <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[10px]">
                  Configuration
                </span>
              </div>
            </div>

            {/* Supervisor Card */}
            <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-blue-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  {t('supervisor_role')}
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Tier #2</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t('supervisor_role_desc')}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded text-[10px]">
                  Analytics
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
                  {t('operator_role')}
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Tier #3</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t('operator_role_desc')}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="bg-slate-500/10 text-slate-300 border border-slate-500/20 px-2 py-0.5 rounded text-[10px]">
                  Data Entry
                </span>
                <span className="bg-slate-500/10 text-slate-300 border border-slate-500/20 px-2 py-0.5 rounded text-[10px]">
                  Line Output
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add User / Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#162032] border border-[#1E293B] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">Add New Platform User</h3>
                <p className="text-xs text-slate-400">Create user account credentials for MSSQL</p>
              </div>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. operator4"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="operator">Operator</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2 rounded-xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{submitting ? 'Creating...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

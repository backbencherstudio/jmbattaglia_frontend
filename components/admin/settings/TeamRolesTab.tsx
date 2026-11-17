"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Check,
  Loader2,
  AlertCircle,
  Clock,
  Mail,
  ChevronDown,
} from "lucide-react";
import {
  useGetTeamMembersQuery,
  useCreateTeamMemberMutation,
  useUpdateUserRoleMutation,
} from "@/redux/features/profile/profileApi";
import { getErrorMessage } from "@/lib/getErrorMessage";

const ROLE_OPTIONS = [
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    description: "Full system control, billing, security, and portal configuration",
    badgeClass: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    value: "OFFICE_MANAGER",
    label: "Office Manager",
    description: "Package pricing, orders, client communications & calendar sync",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    value: "INSPECTOR",
    label: "Inspector",
    description: "Field inspection scheduling, assignment view, and report access",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "ADMIN",
    label: "Standard Admin",
    description: "Standard administrative dashboard management",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
  },
];

export function TeamRolesTab() {
  const { data: teamResponse, isLoading, isError, error, refetch } =
    useGetTeamMembersQuery();
  const [createTeamMember, { isLoading: isCreating }] =
    useCreateTeamMemberMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("OFFICE_MANAGER");

  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const team = teamResponse?.data || [];

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    if (!newEmail || !newFirstName || !newPassword) {
      setActionError("Please provide email, first name, and a temporary password.");
      return;
    }

    try {
      await createTeamMember({
        email: newEmail,
        firstName: newFirstName,
        lastName: newLastName || undefined,
        password: newPassword,
        roleName: newRole,
      }).unwrap();

      setActionSuccess(`Successfully added ${newFirstName} as ${newRole}!`);
      setShowAddModal(false);
      setNewEmail("");
      setNewFirstName("");
      setNewLastName("");
      setNewPassword("");
      setNewRole("OFFICE_MANAGER");
      refetch();
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to create team member."));
    }
  };

  const handleRoleChange = async (userId: string, roleName: string) => {
    setActionError(null);
    setActionSuccess(null);

    try {
      await updateUserRole({ id: userId, role: roleName }).unwrap();
      setActionSuccess("User role updated successfully.");
      refetch();
    } catch (err) {
      setActionError(getErrorMessage(err, "Failed to update user role."));
    }
  };

  const getRoleBadge = (roleName: string) => {
    const role = ROLE_OPTIONS.find((r) => r.value === roleName);
    const badgeClass =
      role?.badgeClass || "bg-gray-100 text-gray-700 border-gray-200";
    const label = role?.label || roleName;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}
      >
        <Shield className="w-3 h-3 mr-1" />
        {label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-canvas border border-hairline rounded-2xl p-8 flex items-center justify-center space-x-2 text-sub">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="text-sm">Loading admin team & roles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-main">Administrative Team & RBAC</h3>
          <p className="text-xs sm:text-sm text-sub mt-0.5">
            Configure access levels across Super Admin, Office Manager, and Inspector roles.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setActionError(null);
            setActionSuccess(null);
            setShowAddModal(true);
          }}
          className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl cursor-pointer transition-colors shadow-2xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Admin Account</span>
        </button>
      </div>

      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-800 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-3 text-emerald-800 text-xs sm:text-sm">
          <Check className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Role Definitions Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {ROLE_OPTIONS.filter((r) => r.value !== "ADMIN").map((role) => (
          <div
            key={role.value}
            className="p-4 bg-canvas border border-hairline rounded-xl space-y-1.5 shadow-2xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-main">{role.label}</span>
              {getRoleBadge(role.value)}
            </div>
            <p className="text-[11px] text-sub leading-relaxed">
              {role.description}
            </p>
          </div>
        ))}
      </div>

      {/* Team Members Table */}
      <div className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-hairline flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-sub">
            Active Accounts ({team.length})
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-layout-bg text-sub uppercase text-[10px] tracking-wider border-b border-hairline">
              <tr>
                <th className="py-3 px-4 font-bold">Admin Member</th>
                <th className="py-3 px-4 font-bold">Email</th>
                <th className="py-3 px-4 font-bold">Current Role</th>
                <th className="py-3 px-4 font-bold text-right">Assign Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {team.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-sub">
                    No administrative team accounts found.
                  </td>
                </tr>
              ) : (
                team.map((member) => (
                  <tr key={member.id} className="hover:bg-canvas-subtle transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center font-bold text-primary text-xs flex-shrink-0">
                          {member.firstName ? member.firstName[0] : member.email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-main text-sm">
                            {member.name || member.email}
                          </div>
                          <div className="text-[11px] text-muted flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              Added {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "Active"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-sub font-mono text-[11px]">
                      {member.email}
                    </td>
                    <td className="py-3.5 px-4">
                      {getRoleBadge(member.role)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value)}
                        disabled={isUpdatingRole}
                        aria-label={`Assign role for ${member.name || member.email}`}
                        className="py-1 px-2.5 bg-canvas border border-hairline rounded-lg text-xs font-medium text-main focus:outline-none focus:border-brand-border cursor-pointer disabled:opacity-50"
                      >
                        {ROLE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Team Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-canvas border border-hairline rounded-2xl w-full max-w-md p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <h4 className="text-base font-bold text-main flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-primary" />
                <span>Add Admin Account</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-sub hover:text-main text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-main">First Name *</label>
                  <input
                    type="text"
                    required
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. Porcha"
                    className="w-full px-3 py-2 bg-canvas border border-hairline rounded-xl text-xs text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-main">Last Name</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="e.g. Manager"
                    className="w-full px-3 py-2 bg-canvas border border-hairline rounded-xl text-xs text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-main">Email Address *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="name@ateaseinspections.com"
                  className="w-full px-3 py-2 bg-canvas border border-hairline rounded-xl text-xs text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-main">Temporary Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 bg-canvas border border-hairline rounded-xl text-xs text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-main">Assigned Role *</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  aria-label="Select role for new admin"
                  className="w-full px-3 py-2 bg-canvas border border-hairline rounded-xl text-xs font-medium text-main focus:outline-none focus:border-brand-border"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} — {opt.description.split(",")[0]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-hairline">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-hairline hover:bg-canvas-subtle text-sub text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {isCreating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isCreating ? "Creating Account..." : "Create Account"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

